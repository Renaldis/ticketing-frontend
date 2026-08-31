'use client';

import { Toaster as Sonner } from 'sonner';

type ToasterProps = React.ComponentProps<typeof Sonner>;

export const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="dark"
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            'group toast group-[.toaster]:bg-[#13131b] group-[.toaster]:text-[#e4e1ed] group-[.toaster]:border-[#464554]/50 group-[.toaster]:shadow-2xl group-[.toaster]:rounded-2xl',
          description: 'group-[.toast]:text-[#908fa0]',
          actionButton:
            'group-[.toast]:bg-[#4cd7f6] group-[.toast]:text-[#003640] group-[.toast]:font-bold',
          cancelButton: 'group-[.toast]:bg-[#292932] group-[.toast]:text-[#c7c4d7]',
        },
      }}
      {...props}
    />
  );
};
