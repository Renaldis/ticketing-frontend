import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Globe2 } from 'lucide-react';
import { EventItem } from '@/types';

interface ScopeSelectorProps {
  events: EventItem[];
  selectedEventId: string;
  onScopeChange: (id: string) => void;
}

export const ScopeSelector = ({ events, selectedEventId, onScopeChange }: ScopeSelectorProps) => {
  return (
    <div className="flex items-center gap-2">
      <Select value={selectedEventId} onValueChange={onScopeChange}>
        <SelectTrigger className="w-[230px] bg-[#1f1f27] border-[#464554]/40 text-xs font-bold">
          <div className="flex items-center gap-2 truncate">
            <Globe2 className="w-3.5 h-3.5 text-[#4cd7f6] flex-shrink-0" />
            <SelectValue placeholder="Pilih Lingkup Telemetri" />
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL">🌐 Seluruh Event (Agregasi)</SelectItem>
          {events.map((evt) => (
            <SelectItem key={evt.id} value={evt.id}>
              📍 {evt.title}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
