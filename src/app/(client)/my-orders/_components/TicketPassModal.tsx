import React from 'react';
import { User } from '@/types';

interface TicketPassModalProps {
  ticket: any;
  user: User | null;
  onClose: () => void;
}

export const TicketPassModal = ({ ticket, user, onClose }: TicketPassModalProps) => {
  if (!ticket) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="premium-card rounded-2xl max-w-sm w-full p-8 text-center space-y-6 shadow-2xl relative">
        <div className="space-y-1">
          <span className="text-[10px] font-bold text-[#4cd7f6] uppercase tracking-widest block">
            Official Digital Pass
          </span>
          <h3 className="text-lg font-bold text-white">{ticket.event.title}</h3>
          <p className="text-xs text-[#908fa0]">{ticket.event.location}</p>
        </div>

        <div className="bg-white p-4 rounded-2xl inline-block mx-auto shadow-2xl border-2 border-[#4cd7f6]/40">
          <img src={ticket.qrCode} alt="Ticket QR Code" className="w-44 h-44 mx-auto" />
        </div>

        <div className="bg-[#13131b] p-4 rounded-xl border border-[#464554]/40 text-left text-xs space-y-2 text-[#c7c4d7]">
          <div className="flex justify-between">
            <span className="text-[#908fa0]">Attendee</span>
            <span className="text-white font-bold">{user?.name || user?.email}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#908fa0]">Pass Tier</span>
            <span className="text-[#c0c1ff] font-bold">
              {ticket.items.map((i: any) => `${i.ticketCategory} (x${i.quantity})`).join(', ')}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#908fa0]">Status</span>
            <span className="text-emerald-400 font-extrabold">{ticket.status}</span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full btn-secondary py-2.5 rounded-xl text-xs font-bold text-white"
        >
          Close
        </button>
      </div>
    </div>
  );
};
