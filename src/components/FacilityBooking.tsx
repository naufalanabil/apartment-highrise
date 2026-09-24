'use client';

import React, { useState } from 'react';

export default function FacilityBooking() {
  const [facility, setFacility] = useState('Sky Lounge (Lantai 50)');
  const [slot, setSlot] = useState('19:00 - 21:00');
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(true);
  };

  return (
    <div className="bg-white p-6 rounded-3xl shadow-xl border border-slate-200">
      <h3 className="text-lg font-black text-slate-900 mb-1">Reservasi Fasilitas Gedung</h3>
      <p className="text-xs text-slate-500 mb-4">Pilih fasilitas & slot waktu kunjungan penghuni.</p>

      {success ? (
        <div className="bg-emerald-50 text-emerald-800 p-4 rounded-2xl text-xs font-bold border border-emerald-200">
          ✅ Reservasi fasilitas berhasil dikonfirmasi!
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div>
            <label className="font-bold block mb-1">Fasilitas:</label>
            <select
              value={facility}
              onChange={(e) => setFacility(e.target.value)}
              className="w-full p-2.5 border rounded-xl font-medium"
            >
              <option>Sky Lounge & BBQ Pit (Lantai 50)</option>
              <option>Executive Co-Working (Lantai 25)</option>
              <option>Indoor Swimming Pool & Gym (Lantai 5)</option>
            </select>
          </div>
          <div>
            <label className="font-bold block mb-1">Slot Waktu:</label>
            <select
              value={slot}
              onChange={(e) => setSlot(e.target.value)}
              className="w-full p-2.5 border rounded-xl font-medium"
            >
              <option>08:00 - 10:00</option>
              <option>13:00 - 15:00</option>
              <option>19:00 - 21:00</option>
            </select>
          </div>
          <button type="submit" className="w-full bg-slate-900 text-white font-bold py-3 rounded-xl">
            Booking Fasilitas
          </button>
        </form>
      )}
    </div>
  );
}