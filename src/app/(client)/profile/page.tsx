'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import {
  User as UserIcon,
  Mail,
  Shield,
  KeyRound,
  Save,
  Loader2,
  Calendar,
  CheckCircle2,
  Eye,
  EyeOff,
} from 'lucide-react';
import { toast } from 'sonner';

export default function ProfilePage() {
  const { user, updateUser, isLoading: authLoading } = useAuth();
  const router = useRouter();

  // Profile Form State
  const [name, setName] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);

  // Password Form State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  // Load user data into form
  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push('/login');
        return;
      }
      setName(user.name || '');
    }
  }, [user, authLoading, router]);

  // Handle Update Profile Name
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Nama tidak boleh kosong');
      return;
    }

    setSavingProfile(true);
    try {
      const res = await api.put('/auth/profile', { name: name.trim() });
      const updatedUser = res.data?.data?.user;
      if (updatedUser) {
        updateUser(updatedUser);
        toast.success('Profil berhasil diperbarui!');
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Gagal memperbarui profil.');
    } finally {
      setSavingProfile(false);
    }
  };

  // Handle Change Password
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error('Semua kolom password wajib diisi');
      return;
    }

    if (newPassword.length < 6) {
      toast.error('Password baru minimal 6 karakter');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('Konfirmasi password baru tidak cocok');
      return;
    }

    setSavingPassword(true);
    try {
      await api.put('/auth/change-password', {
        currentPassword,
        newPassword,
      });
      toast.success('Password berhasil diubah! Gunakan password baru untuk login berikutnya.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Gagal mengubah password.');
    } finally {
      setSavingPassword(false);
    }
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#4cd7f6] animate-spin" />
      </div>
    );
  }

  return (
    <main className="flex-grow w-full max-w-4xl mx-auto px-6 sm:px-12 py-10 space-y-8">
      {/* Header */}
      <div className="pb-6 border-b border-[#464554]/30">
        <span className="text-xs font-extrabold text-[#4cd7f6] uppercase tracking-widest block mb-1">
          Pengaturan Akun
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#e4e1ed] tracking-tight">
          Profil Pengguna
        </h1>
        <p className="text-[#908fa0] text-sm mt-1">
          Kelola informasi nama akun dan amankan kredensial kata sandi Anda
        </p>
      </div>

      {/* Account Info Badge Card */}
      <div className="premium-card rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6 shadow-2xl border border-[#464554]/40 bg-[#13131b]/80">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-indigo-500 via-cyan-400 to-[#4cd7f6] p-[2px] shadow-lg shadow-cyan-500/20 flex-shrink-0">
          <div className="w-full h-full bg-[#13131b] rounded-[14px] flex items-center justify-center font-black text-2xl text-[#4cd7f6]">
            {(user.name || user.email || 'U')[0].toUpperCase()}
          </div>
        </div>

        <div className="space-y-1 text-center sm:text-left flex-1 overflow-hidden">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <h2 className="text-xl font-bold text-white truncate">{user.name || 'Pengguna'}</h2>
            <span
              className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${
                user.role === 'ADMIN'
                  ? 'bg-purple-500/15 border-purple-500/30 text-purple-300'
                  : 'bg-cyan-500/15 border-cyan-500/30 text-[#4cd7f6]'
              }`}
            >
              {user.role === 'ADMIN' ? 'ADMINISTRATOR' : 'CUSTOMER'}
            </span>
          </div>

          <div className="flex items-center justify-center sm:justify-start gap-1.5 text-xs text-[#908fa0]">
            <Mail className="w-3.5 h-3.5" />
            <span className="truncate">{user.email}</span>
          </div>

          <div className="flex items-center justify-center sm:justify-start gap-1.5 text-[11px] text-[#908fa0] pt-1">
            <Shield className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-emerald-300">Akun Terverifikasi</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* EDIT PROFILE NAME FORM */}
        <div className="premium-card rounded-2xl p-6 sm:p-7 space-y-5 border border-[#464554]/30 shadow-xl">
          <div className="flex items-center gap-3 pb-3 border-b border-[#464554]/30">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/10 flex items-center justify-center text-[#4cd7f6]">
              <UserIcon className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">Informasi Dasar</h3>
              <p className="text-[11px] text-[#908fa0]">Perbarui nama tampilan publik Anda</p>
            </div>
          </div>

          <form onSubmit={handleUpdateProfile} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-[#c7c4d7] uppercase mb-1.5 text-[11px]">
                Email (Permanen)
              </label>
              <input
                type="email"
                value={user.email}
                disabled
                className="input-glass w-full rounded-xl px-3.5 py-2.5 text-[#908fa0] opacity-60 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block font-bold text-[#c7c4d7] uppercase mb-1.5 text-[11px]">
                Nama Lengkap
              </label>
              <input
                type="text"
                placeholder="Masukkan nama lengkap Anda..."
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input-glass w-full rounded-xl px-3.5 py-2.5 text-white focus:border-[#4cd7f6]"
              />
            </div>

            <button
              type="submit"
              disabled={savingProfile}
              className="btn-primary w-full text-[#003640] font-bold py-2.5 rounded-xl flex items-center justify-center gap-2 disabled:opacity-40 shadow-lg shadow-cyan-500/10"
            >
              {savingProfile ? (
                <Loader2 className="w-4 h-4 animate-spin text-[#003640]" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              <span>Simpan Perubahan</span>
            </button>
          </form>
        </div>

        {/* CHANGE PASSWORD FORM */}
        <div className="premium-card rounded-2xl p-6 sm:p-7 space-y-5 border border-[#464554]/30 shadow-xl">
          <div className="flex items-center gap-3 pb-3 border-b border-[#464554]/30">
            <div className="w-9 h-9 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-300">
              <KeyRound className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">Ganti Kata Sandi</h3>
              <p className="text-[11px] text-[#908fa0]">Amankan akun Anda dengan password baru</p>
            </div>
          </div>

          <form onSubmit={handleChangePassword} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-[#c7c4d7] uppercase mb-1.5 text-[11px]">
                Kata Sandi Saat Ini
              </label>
              <div className="relative">
                <input
                  type={showCurrentPass ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="input-glass w-full rounded-xl pl-3.5 pr-10 py-2.5 text-white"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPass(!showCurrentPass)}
                  className="absolute right-3 top-3 text-[#908fa0] hover:text-white"
                >
                  {showCurrentPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block font-bold text-[#c7c4d7] uppercase mb-1.5 text-[11px]">
                Kata Sandi Baru (Min. 6 Karakter)
              </label>
              <div className="relative">
                <input
                  type={showNewPass ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="input-glass w-full rounded-xl pl-3.5 pr-10 py-2.5 text-white"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPass(!showNewPass)}
                  className="absolute right-3 top-3 text-[#908fa0] hover:text-white"
                >
                  {showNewPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block font-bold text-[#c7c4d7] uppercase mb-1.5 text-[11px]">
                Konfirmasi Kata Sandi Baru
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="input-glass w-full rounded-xl px-3.5 py-2.5 text-white"
              />
            </div>

            <button
              type="submit"
              disabled={savingPassword}
              className="btn-primary w-full text-[#003640] font-bold py-2.5 rounded-xl flex items-center justify-center gap-2 disabled:opacity-40 shadow-lg shadow-cyan-500/10"
            >
              {savingPassword ? (
                <Loader2 className="w-4 h-4 animate-spin text-[#003640]" />
              ) : (
                <KeyRound className="w-4 h-4" />
              )}
              <span>Perbarui Kata Sandi</span>
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
