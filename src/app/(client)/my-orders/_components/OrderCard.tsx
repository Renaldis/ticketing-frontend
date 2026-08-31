import React from 'react';
import { Calendar, MapPin, QrCode } from 'lucide-react';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Order } from '@/types';

interface OrderCardProps {
  order: Order;
  ticketLoading: boolean;
  onViewTicket: (id: string) => void;
}

export const OrderCard = ({ order, ticketLoading, onViewTicket }: OrderCardProps) => {
  return (
    <div className="premium-card rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
      <div className="space-y-2.5 flex-grow">
        <div className="flex flex-wrap items-center gap-3">
          <h3 className="text-lg font-bold text-[#e4e1ed]">{order.event.title}</h3>
          <StatusBadge status={order.status} />
        </div>

        <div className="flex flex-wrap gap-4 text-xs text-[#c7c4d7]">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-[#c0c1ff]" />
            <span>{new Date(order.event.date).toLocaleDateString('id-ID', { dateStyle: 'full' })}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-rose-400" />
            <span>{order.event.location}</span>
          </div>
        </div>

        <div className="text-xs text-[#908fa0] pt-1 flex items-center gap-2">
          <span className="font-semibold text-white">
            {order.orderItems.map((item) => `${item.ticketCategory.name} (x${item.quantity})`).join(', ')}
          </span>
          <span>•</span>
          <span>Total: Rp {Number(order.totalAmount).toLocaleString('id-ID')}</span>
        </div>
      </div>

      <div>
        {(order.status === 'PAID' || order.status === 'CHECKED_IN') && (
          <button
            onClick={() => onViewTicket(order.id)}
            disabled={ticketLoading}
            className="btn-primary text-[#003640] px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2"
          >
            <QrCode className="w-4 h-4" />
            <span>View Pass</span>
          </button>
        )}
      </div>
    </div>
  );
};
