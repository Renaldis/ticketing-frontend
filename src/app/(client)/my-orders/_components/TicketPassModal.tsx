import React from 'react';
import { User } from '@/types';
import { CheckCircle2, AlertTriangle, X } from 'lucide-react';

interface TicketPassModalProps {
  ticket: any;
  user: User | null;
  onClose: () => void;
}

export const TicketPassModal = ({ ticket, user, onClose }: TicketPassModalProps) => {
  if (!ticket) return null;

  const now = new Date();
  const eventDate = ticket.event?.date ? new Date(ticket.event.date) : null;
  const isEventPassed = eventDate ? eventDate < now : false;

  const isCheckedIn = ticket.status === 'CHECKED_IN';
  const isExpired = !isCheckedIn && isEventPassed;
  const isValid = !isCheckedIn && !isEventPassed;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="premium-card rounded-2xl max-w-sm w-full p-8 text-center space-y-6 shadow-2xl relative border border-[#464554]/40">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-1.5 rounded-lg text-[#908fa0] hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-1">
          <span className="text-[10px] font-bold text-[#4cd7f6] uppercase tracking-widest block">
            Official Digital Pass
          </span>
          <h3 className="text-lg font-bold text-white">{ticket.event?.title}</h3>
          <p className="text-xs text-[#908fa0]">{ticket.event?.location}</p>
        </div>

        {/* QR CODE CONTAINER WITH STAMP OVERLAY */}
        <div className="relative inline-block mx-auto">
          <div className="bg-white p-4 rounded-2xl shadow-2xl border-2 border-[#4cd7f6]/40">
            <img
              src={ticket.qrCode}
              alt="Ticket QR Code"
              className={`w-44 h-44 mx-auto ${!isValid ? 'opacity-30 grayscale' : ''}`}
            />
          </div>

          {/* Stempel Visual Jika Sudah Digunakan */}
          {isCheckedIn && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="bg-purple-950/90 border-2 border-purple-400 text-purple-200 px-4 py-2 rounded-xl rotate-[-12deg] shadow-2xl flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-purple-300" />
                <span className="text-xs font-black tracking-widest">ALREADY USED</span>
              </div>
            </div>
          )}

          {/* Stempel Visual Jika Acara Selesai / Hangus */}
          {isExpired && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="bg-rose-950/90 border-2 border-rose-500 text-rose-200 px-4 py-2 rounded-xl rotate-[-12deg] shadow-2xl flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-rose-400" />
                <span className="text-xs font-black tracking-widest">EVENT EXPIRED</span>
              </div>
            </div>
          )}
        </div>

        <div className="bg-[#13131b] p-4 rounded-xl border border-[#464554]/40 text-left text-xs space-y-2 text-[#c7c4d7]">
          <div className="flex justify-between">
            <span className="text-[#908fa0]">Pemegang Tiket</span>
            <span className="text-white font-bold">{user?.name || user?.email}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#908fa0]">Kategori</span>
            <span className="text-[#c0c1ff] font-bold">
              {ticket.items?.map((i: any) => `${i.ticketCategory} (x${i.quantity})`).join(', ')}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#908fa0]">Status Gate</span>
            <span
              className={`font-black ${
                isValid ? 'text-emerald-400' : isCheckedIn ? 'text-purple-400' : 'text-rose-400'
              }`}
            >
              {isValid
                ? 'VALID / READY TO SCAN'
                : isCheckedIn
                  ? 'CHECKED IN (USED)'
                  : 'EVENT PASSED'}
            </span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full btn-secondary py-2.5 rounded-xl text-xs font-bold text-white"
        >
          Tutup Tiket
        </button>
      </div>
    </div>
  );
};
