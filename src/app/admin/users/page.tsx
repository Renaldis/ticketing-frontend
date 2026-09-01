'use client';

import React from 'react';
import {
  Users,
  Search,
  CalendarCheck2,
  CheckCircle2,
  Clock,
  XCircle,
  Loader2,
  X,
  Ticket,
  Calendar,
  UserCheck,
} from 'lucide-react';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { useAdminUsers } from './_hooks/useAdminUsers';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function AdminUsersPage() {
  const {
    activeTab,
    setActiveTab,
    users,
    userSearch,
    setUserSearch,
    loadingUsers,
    selectedUserAudit,
    setSelectedUserAudit,
    auditLoading,
    handleOpenUserAudit,
    eventsList,
    selectedEventId,
    setSelectedEventId,
    attendeeSearch,
    setAttendeeSearch,
    statusFilter,
    setStatusFilter,
    attendeesData,
    loadingAttendees,
  } = useAdminUsers();

  return (
    <>
      <AdminHeader
        title="Manajemen Pengguna & Audit Peserta Event"
        subtitle="Pantau seluruh akun pengguna, serta audit transparan pengunjung yang sudah atau belum check-in di gate"
        onOpenSidebar={() => {}}
      />

      <main className="p-6 sm:p-10 space-y-8 flex-1 max-w-7xl mx-auto w-full">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-3 border-b border-[#464554]/30 pb-4">
          <button
            onClick={() => setActiveTab('USERS')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs transition ${
              activeTab === 'USERS'
                ? 'bg-[#03b5d3] text-[#003640] shadow-lg shadow-cyan-500/20'
                : 'bg-[#13131b] text-[#c7c4d7] hover:text-white border border-[#464554]/40'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Daftar Pengguna ({users.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('ATTENDEES')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs transition ${
              activeTab === 'ATTENDEES'
                ? 'bg-[#03b5d3] text-[#003640] shadow-lg shadow-cyan-500/20'
                : 'bg-[#13131b] text-[#c7c4d7] hover:text-white border border-[#464554]/40'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            <span>Audit Transparansi Peserta Event</span>
          </button>
        </div>

        {/* TAB 1: MANAJEMEN USER */}
        {activeTab === 'USERS' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 absolute left-3.5 top-3 text-[#908fa0]" />
                <input
                  type="text"
                  placeholder="Cari nama atau email pengguna..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  className="input-glass w-full rounded-xl pl-10 pr-4 py-2 text-xs text-white"
                />
              </div>
              <span className="text-xs text-[#908fa0]">
                Total Pengguna Terdaftar:{' '}
                <strong className="text-white font-bold">{users.length}</strong>
              </span>
            </div>

            <div className="premium-card rounded-2xl overflow-hidden shadow-2xl border border-[#464554]/30">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#13131b] text-[#908fa0] uppercase tracking-wider font-bold border-b border-[#464554]/30">
                    <tr>
                      <th className="p-4">Pengguna</th>
                      <th className="p-4">Role</th>
                      <th className="p-4">Tanggal Mendaftar</th>
                      <th className="p-4">Total Pesanan Tiket</th>
                      <th className="p-4 text-right">Aksi Audit</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#464554]/30 text-[#c7c4d7]">
                    {loadingUsers ? (
                      <tr>
                        <td colSpan={5} className="p-8 text-center">
                          <Loader2 className="w-6 h-6 text-[#4cd7f6] animate-spin mx-auto" />
                        </td>
                      </tr>
                    ) : users.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="p-8 text-center text-[#908fa0]">
                          Tidak ada pengguna ditemukan.
                        </td>
                      </tr>
                    ) : (
                      users.map((u) => (
                        <tr key={u.id} className="hover:bg-[#13131b]/60 transition">
                          <td className="p-4">
                            <div className="font-bold text-white">{u.name || 'User'}</div>
                            <div className="text-[11px] text-[#908fa0]">{u.email}</div>
                          </td>
                          <td className="p-4">
                            <span
                              className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold border ${
                                u.role === 'ADMIN'
                                  ? 'bg-purple-500/15 border-purple-500/30 text-purple-300'
                                  : 'bg-cyan-500/15 border-cyan-500/30 text-[#4cd7f6]'
                              }`}
                            >
                              {u.role}
                            </span>
                          </td>
                          <td className="p-4">
                            {new Date(u.createdAt).toLocaleDateString('id-ID', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </td>
                          <td className="p-4 font-bold text-white">{u._count?.orders || 0} Tiket</td>
                          <td className="p-4 text-right">
                            <button
                              onClick={() => handleOpenUserAudit(u.id)}
                              className="btn-secondary px-3 py-1.5 rounded-lg text-xs font-bold text-[#c0c1ff] hover:text-white"
                            >
                              Lihat Audit Tiket
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: AUDIT TRANSPARANSI PESERTA EVENT */}
        {activeTab === 'ATTENDEES' && (
          <div className="space-y-6">
            {/* Event Picker & Filter Options */}
            <div className="premium-card rounded-2xl p-6 space-y-4 border border-[#464554]/30 shadow-xl">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                <div>
                  <label className="block text-xs font-bold text-[#908fa0] uppercase mb-1.5">
                    Pilih Acara / Event:
                  </label>
                  <Select value={selectedEventId} onValueChange={setSelectedEventId}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Pilih Acara..." />
                    </SelectTrigger>
                    <SelectContent>
                      {eventsList.map((ev) => (
                        <SelectItem key={ev.id} value={ev.id}>
                          {ev.title} ({new Date(ev.date).toLocaleDateString('id-ID')})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#908fa0] uppercase mb-1.5">
                    Filter Status Gate:
                  </label>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Pilih Status Gate..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ALL">Semua Peserta</SelectItem>
                      <SelectItem value="CHECKED_IN">Sudah Check-In (Hadir Gate)</SelectItem>
                      <SelectItem value="PAID">Belum Check-In (Sudah Bayar)</SelectItem>
                      <SelectItem value="CANCELLED">Dibatalkan / Kadaluarsa</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#908fa0] uppercase mb-1.5">
                    Pencarian Peserta:
                  </label>
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3.5 top-2.5 text-[#908fa0]" />
                    <input
                      type="text"
                      placeholder="Cari nama atau email..."
                      value={attendeeSearch}
                      onChange={(e) => setAttendeeSearch(e.target.value)}
                      className="input-glass w-full rounded-xl pl-10 pr-4 py-2 text-xs text-white"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Live Stats Telemetry Baris Event */}
            {attendeesData?.stats && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-[#13131b] p-4 rounded-xl border border-[#464554]/30 space-y-1">
                  <span className="text-[10px] text-[#908fa0] uppercase font-bold block">
                    Total Tiket Terjual
                  </span>
                  <span className="text-xl font-extrabold text-white">
                    {attendeesData.stats.totalOrders}
                  </span>
                </div>
                <div className="bg-[#13131b] p-4 rounded-xl border border-purple-500/30 space-y-1">
                  <span className="text-[10px] text-purple-400 uppercase font-bold block flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Sudah Check-In
                  </span>
                  <span className="text-xl font-extrabold text-purple-300">
                    {attendeesData.stats.checkedInCount}
                  </span>
                </div>
                <div className="bg-[#13131b] p-4 rounded-xl border border-emerald-500/30 space-y-1">
                  <span className="text-[10px] text-emerald-400 uppercase font-bold block flex items-center gap-1">
                    <Clock className="w-3 h-3" /> Belum Check-In
                  </span>
                  <span className="text-xl font-extrabold text-emerald-300">
                    {attendeesData.stats.paidCount}
                  </span>
                </div>
                <div className="bg-[#13131b] p-4 rounded-xl border border-rose-500/30 space-y-1">
                  <span className="text-[10px] text-rose-400 uppercase font-bold block flex items-center gap-1">
                    <XCircle className="w-3 h-3" /> Dibatalkan
                  </span>
                  <span className="text-xl font-extrabold text-rose-300">
                    {attendeesData.stats.cancelledCount}
                  </span>
                </div>
              </div>
            )}

            {/* Attendees Transparency Table */}
            <div className="premium-card rounded-2xl overflow-hidden shadow-2xl border border-[#464554]/30">
              <div className="p-4 bg-[#13131b] border-b border-[#464554]/30 flex justify-between items-center">
                <h3 className="font-bold text-sm text-white flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#4cd7f6]" />
                  <span>
                    Audit Transparan Pengunjung: {attendeesData?.event?.title || 'Loading...'}
                  </span>
                </h3>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#13131b]/80 text-[#908fa0] uppercase tracking-wider font-bold border-b border-[#464554]/30">
                    <tr>
                      <th className="p-4">Pengunjung / Pembeli</th>
                      <th className="p-4">Kategori Tiket & Qty</th>
                      <th className="p-4">Waktu Pembelian</th>
                      <th className="p-4">Status Gate</th>
                      <th className="p-4">Timestamp Check-In Gate</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#464554]/30 text-[#c7c4d7]">
                    {loadingAttendees ? (
                      <tr>
                        <td colSpan={5} className="p-8 text-center">
                          <Loader2 className="w-6 h-6 text-[#4cd7f6] animate-spin mx-auto" />
                        </td>
                      </tr>
                    ) : !attendeesData?.attendees || attendeesData.attendees.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="p-8 text-center text-[#908fa0]">
                          Tidak ada data peserta ditemukan untuk event ini.
                        </td>
                      </tr>
                    ) : (
                      attendeesData.attendees.map((ord: any) => (
                        <tr key={ord.id} className="hover:bg-[#13131b]/60 transition">
                          <td className="p-4">
                            <div className="font-bold text-white">
                              {ord.user?.name || 'Customer'}
                            </div>
                            <div className="text-[11px] text-[#908fa0]">{ord.user?.email}</div>
                          </td>
                          <td className="p-4 font-bold text-[#c0c1ff]">
                            {ord.orderItems
                              ?.map((i: any) => `${i.ticketCategory?.name} (x${i.quantity})`)
                              .join(', ')}
                          </td>
                          <td className="p-4">
                            {new Date(ord.createdAt).toLocaleString('id-ID', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </td>
                          <td className="p-4">
                            <span
                              className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold border ${
                                ord.status === 'CHECKED_IN'
                                  ? 'bg-purple-500/15 border-purple-500/30 text-purple-300'
                                  : ord.status === 'PAID'
                                    ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
                                    : 'bg-rose-500/15 border-rose-500/30 text-rose-300'
                              }`}
                            >
                              {ord.status === 'CHECKED_IN'
                                ? 'SUDAH CHECK-IN'
                                : ord.status === 'PAID'
                                  ? 'BELUM CHECK-IN'
                                  : 'DIBATALKAN'}
                            </span>
                          </td>
                          <td className="p-4 font-mono text-xs">
                            {ord.checkedInAt ? (
                              <span className="text-purple-300 font-bold">
                                {new Date(ord.checkedInAt).toLocaleString('id-ID', {
                                  day: 'numeric',
                                  month: 'short',
                                  year: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                  second: '2-digit',
                                })}
                              </span>
                            ) : (
                              <span className="text-[#908fa0] italic">- Belum Masuk Gate -</span>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* USER AUDIT MODAL */}
      {selectedUserAudit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="premium-card rounded-2xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative border border-[#464554]/40 max-h-[85vh] overflow-y-auto">
            <button
              onClick={() => setSelectedUserAudit(null)}
              className="absolute right-4 top-4 p-1.5 rounded-lg text-[#908fa0] hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <span className="text-[10px] font-bold text-[#4cd7f6] uppercase tracking-widest block">
                Audit Riwayat Pengguna
              </span>
              <h3 className="text-xl font-bold text-white">{selectedUserAudit.user?.name}</h3>
              <p className="text-xs text-[#908fa0]">{selectedUserAudit.user?.email}</p>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-bold text-[#c0c1ff] uppercase">
                Seluruh Tiket & Pesanan ({selectedUserAudit.orders?.length || 0})
              </h4>

              {selectedUserAudit.orders?.length === 0 ? (
                <p className="text-xs text-[#908fa0] py-4 text-center">
                  User ini belum pernah melakukan pembelian tiket.
                </p>
              ) : (
                selectedUserAudit.orders?.map((ord: any) => (
                  <div
                    key={ord.id}
                    className="p-4 rounded-xl bg-[#13131b] border border-[#464554]/30 space-y-2 text-xs"
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-white">{ord.event?.title}</span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                          ord.status === 'CHECKED_IN'
                            ? 'bg-purple-500/15 border-purple-500/30 text-purple-300'
                            : ord.status === 'PAID'
                              ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
                              : 'bg-rose-500/15 border-rose-500/30 text-rose-300'
                        }`}
                      >
                        {ord.status}
                      </span>
                    </div>

                    <div className="flex justify-between text-[11px] text-[#908fa0]">
                      <span>
                        Kategori:{' '}
                        {ord.orderItems
                          ?.map((i: any) => `${i.ticketCategory?.name} (x${i.quantity})`)
                          .join(', ')}
                      </span>
                      <span>
                        Total: Rp {Number(ord.totalAmount || 0).toLocaleString('id-ID')}
                      </span>
                    </div>

                    <div className="flex justify-between text-[10px] text-[#908fa0] pt-2 border-t border-[#464554]/20">
                      <span>
                        Beli:{' '}
                        {new Date(ord.createdAt).toLocaleString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                      <span>
                        Check-in Gate:{' '}
                        {ord.checkedInAt
                          ? new Date(ord.checkedInAt).toLocaleString('id-ID', {
                              day: 'numeric',
                              month: 'short',
                              hour: '2-digit',
                              minute: '2-digit',
                            })
                          : '-'}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>

            <button
              onClick={() => setSelectedUserAudit(null)}
              className="w-full btn-secondary py-2.5 rounded-xl text-xs font-bold text-white"
            >
              Tutup Audit
            </button>
          </div>
        </div>
      )}
    </>
  );
}
