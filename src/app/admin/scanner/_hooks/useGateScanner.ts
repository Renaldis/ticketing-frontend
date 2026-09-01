'use client';

import { useState, useEffect, useRef } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { api } from '@/lib/api';
import { playScanAudio } from '../_utils/sound';
import { toast } from 'sonner';

export const useGateScanner = () => {
  const [scanResult, setScanResult] = useState<any>(null);
  const [scanError, setScanError] = useState<string>('');
  const [manualOrderId, setManualOrderId] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [cooldownSeconds, setCooldownSeconds] = useState(0);

  // Gunakan Ref agar terbebas dari masalah React stale closure pada callback event kamera
  const isCoolingDownRef = useRef(false);
  const lastScannedDataRef = useRef<string>('');
  const cooldownTimerRef = useRef<any>(null);
  const countdownIntervalRef = useRef<any>(null);

  const handleCheckIn = async (qrData: string) => {
    // PROTEKSI UTAMA: Jika sedang dalam masa cooldown atau sedang memproses, ABAIKAN TOTAL!
    if (isCoolingDownRef.current || isProcessing) {
      return;
    }

    // Pasang kunci cooldown & processing seketika (synchronous)
    isCoolingDownRef.current = true;
    setIsProcessing(true);
    setScanResult(null);
    setScanError('');
    lastScannedDataRef.current = qrData;

    try {
      const res = await api.post('/tickets/check-in', { qrData });
      const data = res.data?.data;
      setScanResult(data);
      playScanAudio('SUCCESS');
      toast.success(
        `AKSES DIIZINKAN: ${data.attendee?.name || data.attendee?.email} - ${data.event?.title}`,
      );
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Check-in gagal. Tiket tidak valid.';
      setScanError(msg);
      playScanAudio('ERROR');
      toast.error(`AKSES DITOLAK: ${msg}`);
    } finally {
      setIsProcessing(false);

      // Mulai Cooldown Keras selama 8 Detik
      setCooldownSeconds(8);

      if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
      if (cooldownTimerRef.current) clearTimeout(cooldownTimerRef.current);

      // Update tampilan hitung mundur setiap detik
      countdownIntervalRef.current = setInterval(() => {
        setCooldownSeconds((prev) => (prev > 1 ? prev - 1 : 0));
      }, 1000);

      // Lepas penguncian cooldown setelah tepat 4 detik
      cooldownTimerRef.current = setTimeout(() => {
        isCoolingDownRef.current = false;
        lastScannedDataRef.current = '';
        setScanResult(null);
        setScanError('');
        setCooldownSeconds(0);
        if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
      }, 4000);
    }
  };

  useEffect(() => {
    let scannerInstance: Html5QrcodeScanner | null = null;
    const container = document.getElementById('qr-reader');

    // Tunda instansiasi 100ms agar browser sempat merilis media stream kamera jika ada sisa re-render HMR
    const initTimer = setTimeout(() => {
      if (container) {
        container.innerHTML = '';
      }

      scannerInstance = new Html5QrcodeScanner(
        'qr-reader',
        {
          fps: 10,
          qrbox: { width: 260, height: 260 },
          rememberLastUsedCamera: true,
        },
        /* verbose= */ false,
      );

      scannerInstance.render(
        (decodedText) => {
          handleCheckIn(decodedText);
        },
        () => {},
      );
    }, 150);

    return () => {
      clearTimeout(initTimer);
      if (scannerInstance) {
        scannerInstance.clear().catch(() => {});
      }
      if (container) {
        container.innerHTML = '';
      }
      if (cooldownTimerRef.current) clearTimeout(cooldownTimerRef.current);
      if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualOrderId.trim()) return;
    handleCheckIn(manualOrderId.trim());
    setManualOrderId('');
  };

  return {
    scanResult,
    scanError,
    manualOrderId,
    setManualOrderId,
    isProcessing,
    cooldownSeconds,
    handleManualSubmit,
  };
};
