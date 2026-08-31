'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { Loader2 } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { user, isLoading } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    setMounted(true);
    if (!isLoading) {
      if (!user || user.role !== 'ADMIN') {
        router.push('/login');
      }
    }
  }, [user, isLoading, router]);

  if (!mounted || isLoading) {
    return (
      <div className="min-h-screen bg-[#0d0d15] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#4cd7f6] animate-spin" />
      </div>
    );
  }

  if (!user || user.role !== 'ADMIN') {
    return null;
  }

  return (
    <div
      suppressHydrationWarning
      className="h-screen w-screen bg-[#0d0d15] text-[#e4e1ed] flex overflow-hidden"
    >
      {/* Centralized Fixed Sidebar */}
      <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Main Container with Header & Scrollable Body */}
      <div
        suppressHydrationWarning
        className="flex-1 h-full flex flex-col min-w-0 overflow-hidden"
      >
        {children}
      </div>
    </div>
  );
}
