'use client';

import React, { Suspense, useState } from 'react';
import Link from 'next/link';
import {
  Ticket,
  Lock,
  Mail,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Clock,
  Loader2,
  Eye,
  EyeOff,
} from 'lucide-react';
import { useLogin } from './_hooks/useLogin';

function LoginForm() {
  const { form, serverError, sessionExpired, loading, onSubmit } = useLogin();
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  return (
    <div className="premium-card max-w-md w-full rounded-2xl p-8 sm:p-10 shadow-2xl space-y-6">
      <div className="text-center space-y-1.5">
        <h1 className="text-2xl font-extrabold text-[#e4e1ed] tracking-tight">Sign In</h1>
      </div>

      {sessionExpired && (
        <div className="p-3.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs flex items-center gap-2">
          <Clock className="w-4 h-4 flex-shrink-0 text-amber-400" />
          <span>Your session has expired or is invalid. Please sign in again.</span>
        </div>
      )}

      {serverError && (
        <div className="p-3.5 rounded-xl bg-[#93000a]/20 border border-[#ffb4ab]/30 text-[#ffb4ab] text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{serverError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-xs">
        <div>
          <label className="block text-[#908fa0] uppercase font-bold mb-1.5">Email Address</label>
          <div className="relative">
            <Mail className="w-4 h-4 text-[#908fa0] absolute left-3.5 top-3" />
            <input
              type="email"
              {...register('email')}
              placeholder="name@gmail.com"
              className="input-glass w-full rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-[#908fa0]"
            />
          </div>
          {errors.email && <p className="text-rose-400 text-[11px] mt-1">{errors.email.message}</p>}
        </div>

        <div>
          <label className="block text-[#908fa0] uppercase font-bold mb-1.5">Password</label>
          <div className="relative">
            <Lock className="w-4 h-4 text-[#908fa0] absolute left-3.5 top-3" />
            <input
              type={showPassword ? 'text' : 'password'}
              {...register('password')}
              placeholder="••••••••"
              className="input-glass w-full rounded-xl pl-10 pr-11 py-2.5 text-sm text-white placeholder-[#908fa0]"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-2.5 text-[#908fa0] hover:text-white transition"
              title={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.password && (
            <p className="text-rose-400 text-[11px] mt-1">{errors.password.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full text-[#003640] font-bold py-3.5 rounded-xl text-sm transition mt-6 flex items-center justify-center gap-2 disabled:opacity-40"
        >
          <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
          {!loading && <ArrowRight className="w-4 h-4" />}
        </button>
      </form>

      <p className="text-center text-xs text-[#908fa0] pt-2">
        Don&apos;t have an account?{' '}
        <Link href="/register" className="text-[#4cd7f6] hover:underline font-bold">
          Sign up
        </Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <main className="min-h-screen w-full flex flex-col items-center justify-center px-4 py-8 hero-bg relative overflow-hidden">
      <Link
        href="/"
        className="absolute top-6 left-6 inline-flex items-center gap-2 text-xs font-semibold text-[#908fa0] hover:text-white transition bg-[#13131b]/70 border border-[#292932] px-3.5 py-2 rounded-xl backdrop-blur-md"
      >
        <ArrowLeft className="w-4 h-4 text-[#4cd7f6]" />
        <span>Back to Home</span>
      </Link>

      <div className="flex items-center gap-2 mb-6">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-cyan-400 p-[1px] shadow-md shadow-cyan-500/20">
          <div className="w-full h-full bg-[#13131b] rounded-[7px] flex items-center justify-center">
            <Ticket className="w-4 h-4 text-[#4cd7f6]" />
          </div>
        </div>
        <span className="font-extrabold text-xl text-white tracking-wider">
          TICKET<span className="text-[#4cd7f6]">IX</span>
        </span>
      </div>

      <Suspense
        fallback={
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-[#4cd7f6] animate-spin" />
          </div>
        }
      >
        <LoginForm />
      </Suspense>
    </main>
  );
}
