'use client';

import React, { useState } from 'react';

export default function MaintenanceTicket() {
  const [unit, setUnit] = useState('');
  const [category, setCategory] = useState('AC / Plumbing');
  const [desc, setDesc] = useState('');
  const [sent, setSent] = useState(false);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="bg-white p-6 rounded-3xl shadow-xl border border-slate-200">
      <h3 className="text-lg font-black text-slate-900 mb-1">Layanan Perbaikan & Maintenance</h3>
      <p className="text-xs text-slate-500 mb-4">Adukan kendala teknis unit kamar langsung ke tim teknisi gedung.</p>

      {sent ? (
        <div className="bg-blue-50 text-blue-800 p-4 rounded-2xl text-xs font-bold border border-blue-200">
          📩 Tiket laporan perbaikan berhasil terkirim ke Building Manager!
        </div>
      ) : (
        <form onSubmit={handleSend} className="space-y-3 text-xs">
          <div>
            <label className="font-bold block mb-1">Nomor Unit Kamar:</label>
            <input
              type="text"
              required
              placeholder="Contoh: 312"
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              className="w-full p-2.5 border rounded-xl"
            />
          </div>
          <div>
            <label className="font-bold block mb-1">Kategori Layanan:</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-2.5 border rounded-xl"
            >
              <option>AC / Plumbing (Pipa)</option>
              <option>Kelistrikan / Penerangan</option>
              <option>Permintaan Cleaning Service</option>
            </select>
          </div>
          <div>
            <label className="font-bold block mb-1">Deskripsi Kendala:</label>
            <textarea
              required
              rows={2}
              placeholder="Jelaskan rincian kendala..."
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              className="w-full p-2.5 border rounded-xl"
            ></textarea>
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl">
            Kirim Tiket Perbaikan
          </button>
        </form>
      )}
    </div>
  );
}