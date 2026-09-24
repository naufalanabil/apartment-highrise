'use client';

import React, { useEffect, useState } from 'react';

interface StatsSummary {
  totalUnits: number;
  availableUnits: number;
  occupiedUnits: number;
  totalRevenue: number;
  activePasses: number;
}

interface TransactionLog {
  id: string;
  bookingCode: string;
  unitNumber: string;
  floor: number;
  duration: string;
  paymentMethod: string;
  totalAmount: number;
  status: 'Active Pass' | 'Expired' | 'Pending';
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<StatsSummary>({
    totalUnits: 1500,
    availableUnits: 1200,
    occupiedUnits: 300,
    totalRevenue: 450000000,
    activePasses: 285,
  });

  const [logs, setLogs] = useState<TransactionLog[]>([
    {
      id: '1',
      bookingCode: 'BK-932101',
      unitNumber: '312',
      floor: 3,
      duration: '1 Bulan (Monthly)',
      paymentMethod: 'QRIS Instant',
      totalAmount: 5500000,
      status: 'Active Pass',
    },
    {
      id: '2',
      bookingCode: 'BK-932102',
      unitNumber: '5001',
      floor: 50,
      duration: '1 Tahun (Yearly)',
      paymentMethod: 'Virtual Account BCA',
      totalAmount: 55000000,
      status: 'Active Pass',
    },
    {
      id: '3',
      bookingCode: 'BK-932103',
      unitNumber: '1505',
      floor: 15,
      duration: '3 Hari (Short Stay)',
      paymentMethod: 'QRIS Instant',
      totalAmount: 950000,
      status: 'Expired',
    },
  ]);

  const handleResetSimulation = () => {
    setStats({
      totalUnits: 1500,
      availableUnits: 1500,
      occupiedUnits: 0,
      totalRevenue: 0,
      activePasses: 0,
    });
    setLogs([]);
  };

  const handlePrintReport = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-6 md:p-12">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Dashboard */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-800 pb-6">
          <div>
            <span className="text-xs font-black text-blue-400 uppercase tracking-widest">
              Building Management System (BMS)
            </span>
            <h1 className="text-3xl font-black text-white mt-1">
              Admin Monitoring & Analytics
            </h1>
            <p className="text-xs text-slate-400">
              Grand Horizon Apartment - 50 Floors High-Rise Building
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handlePrintReport}
              className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition"
            >
              Cetak Laporan Pendapatan
            </button>
            <button
              onClick={handleResetSimulation}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold px-4 py-2.5 rounded-xl border border-slate-700 transition"
            >
              Reset State Sim
            </button>
          </div>
        </div>

        {/* Metric Cards (Ringkasan KPI) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-slate-800/80 p-6 rounded-3xl border border-slate-700">
            <span className="text-xs font-bold text-slate-400">Total Unit Gedung</span>
            <p className="text-3xl font-black text-white mt-2">
              {stats.totalUnits} <span className="text-xs font-normal text-slate-400">Unit</span>
            </p>
            <p className="text-[10px] text-slate-400 mt-2">50 Lantai × 30 Kamar/Lantai</p>
          </div>

          <div className="bg-slate-800/80 p-6 rounded-3xl border border-slate-700">
            <span className="text-xs font-bold text-emerald-400">
              Tingkat Okupansi (Occupancy)
            </span>
            <p className="text-3xl font-black text-emerald-400 mt-2">
              {Math.round((stats.occupiedUnits / stats.totalUnits) * 100)}%
            </p>
            <p className="text-[10px] text-slate-400 mt-2">
              {stats.occupiedUnits} Terisi / {stats.availableUnits} Kosong
            </p>
          </div>

          <div className="bg-slate-800/80 p-6 rounded-3xl border border-slate-700">
            <span className="text-xs font-bold text-blue-400">Total Pendapatan (Revenue)</span>
            <p className="text-3xl font-black text-blue-400 mt-2">
              Rp {(stats.totalRevenue / 1000000).toFixed(0)}M
            </p>
            <p className="text-[10px] text-slate-400 mt-2">Transaksi QRIS & VA Terverifikasi</p>
          </div>

          <div className="bg-slate-800/80 p-6 rounded-3xl border border-slate-700">
            <span className="text-xs font-bold text-amber-400">Smart Access Pass Aktif</span>
            <p className="text-3xl font-black text-amber-400 mt-2">{stats.activePasses}</p>
            <p className="text-[10px] text-slate-400 mt-2">Digital Pass QR/PIN Terdaftar</p>
          </div>
        </div>

        {/* Table Log Transaksi & Reservasi Terbaru */}
        <div className="bg-slate-800/80 p-6 rounded-3xl border border-slate-700 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-black text-white">Log Transaksi & Reservasi Real-Time</h3>
            <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
              Live Connection
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900 text-slate-400 uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="p-3.5 rounded-l-xl">Kode Booking</th>
                  <th className="p-3.5">Unit Kamar</th>
                  <th className="p-3.5">Durasi Sewa</th>
                  <th className="p-3.5">Metode Bayar</th>
                  <th className="p-3.5">Total Bayar</th>
                  <th className="p-3.5 rounded-r-xl">Status Akses</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/50 font-medium">
                {logs.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-slate-500">
                      Belum ada data transaksi tersimpan.
                    </td>
                  </tr>
                ) : (
                  logs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-700/30 transition">
                      <td className="p-3.5 font-bold text-blue-400">{log.bookingCode}</td>
                      <td className="p-3.5 font-black text-white">
                        Unit {log.unitNumber} (Lt. {log.floor})
                      </td>
                      <td className="p-3.5">{log.duration}</td>
                      <td className="p-3.5">{log.paymentMethod}</td>
                      <td className="p-3.5 font-bold text-emerald-400">
                        Rp {log.totalAmount.toLocaleString('id-ID')}
                      </td>
                      <td className="p-3.5">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            log.status === 'Active Pass'
                              ? 'bg-emerald-500/20 text-emerald-400'
                              : 'bg-amber-500/20 text-amber-400'
                          }`}
                        >
                          {log.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}