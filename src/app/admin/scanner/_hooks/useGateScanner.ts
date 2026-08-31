'use client';

import { useState, useEffect } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { api } from '@/lib/api';

export const useGateScanner = () => {
  const [scanResult, setScanResult] = useState<any>(null);
  const [scanError, setScanError] = useState<string>('');
  const [manualOrderId, setManualOrderId] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCheckIn = async (qrData: string) => {
    if (isProcessing) return;

    setIsProcessing(true);
    setScanResult(null);
    setScanError('');

    try {
      const res = await api.post('/tickets/check-in', { qrData });
      setScanResult(res.data?.data);
    } catch (err: any) {
      setScanError(err.response?.data?.message || 'Check-in failed / Ticket Invalid.');
    } finally {
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      'qr-reader',
      {
        fps: 10,
        qrbox: { width: 260, height: 260 },
      },
      /* verbose= */ false,
    );

    scanner.render(
      (decodedText) => {
        handleCheckIn(decodedText);
      },
      () => {},
    );

    return () => {
      scanner.clear().catch((e) => console.error(e));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualOrderId.trim()) return;
    handleCheckIn(manualOrderId.trim());
  };

  return {
    scanResult,
    scanError,
    manualOrderId,
    setManualOrderId,
    isProcessing,
    handleManualSubmit,
  };
};
