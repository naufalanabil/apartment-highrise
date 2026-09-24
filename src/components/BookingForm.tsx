'use client';

import React, { useState } from 'react';
import { UnitItem } from './ArchitecturalFloorMap';

interface BookingFormProps {
  unit: UnitItem;
  onSuccess: (bookingData: any) => void;
}

type DurationKey = 'DAILY_1' | 'DAILY_3' | 'WEEKLY_1' | 'MONTHLY_1' | 'YEARLY_1';

export default function BookingForm({ unit, onSuccess }: BookingFormProps) {
  const [duration, setDuration] = useState<DurationKey>('MONTHLY_1');
  const [paymentMethod, setPaymentMethod] = useState<'QRIS' | 'VIRTUAL_ACCOUNT'>('QRIS');
  const [loading, setLoading] = useState(false);

  const calculateTotal = (key: DurationKey) => {
    const base = unit.baseDailyRate;
    switch (key) {
      case 'DAILY_1': return base;
      case 'DAILY_3': return base * 3 * 0.9;
      case 'WEEKLY_1': return base * 7 * 0.8;
      case 'MONTHLY_1': return base * 30 * 0.65;
      case 'YEARLY_1': return base * 365 * 0.5;
    }
  };

  const totalAmount = calculateTotal(duration);

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          unitId: unit.id,
          durationType: duration,
          paymentMethod,
          totalAmount,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        onSuccess(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-3xl shadow-xl border border-slate-200 w-full max-w-lg">
      <div className="border-b pb-4 mb-4">
        <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">Selected Unit</span>
        <h3 className="text-2xl font-black text-slate-900">Unit {unit.unitNumber} (Lantai {unit.floor})</h3>
        <p className="text-xs text-slate-500">{unit.facing} - Tipe {unit.type}</p>
      </div>

      <div className="space-y-2 mb-6">
        <label className="text-xs font-bold text-slate-700 uppercase">Pilih Paket Sewa:</label>
        <div className="grid grid-cols-2 gap-2">
          {[
            { key: 'DAILY_1', label: '1 Hari' },
            { key: 'DAILY_3', label: '3 Hari (Hemat 10%)' },
            { key: 'WEEKLY_1', label: '1 Minggu (Hemat 20%)' },
            { key: 'MONTHLY_1', label: '1 Bulan (Best)' },
          ].map((item) => (
            <button
              key={item.key}
              onClick={() => setDuration(item.key as DurationKey)}
              className={`p-3 rounded-2xl border text-left text-xs transition ${
                duration === item.key
                  ? 'border-blue-600 bg-blue-50 font-black text-blue-900'
                  : 'border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <div>{item.label}</div>
              <div className="text-sm font-black mt-1">
                Rp {Math.round(calculateTotal(item.key as DurationKey)).toLocaleString('id-ID')}
              </div>
            </button>
          ))}
        </div>

        <button
          onClick={() => setDuration('YEARLY_1')}
          className={`w-full p-3.5 rounded-2xl border text-left transition mt-2 flex justify-between items-center ${
            duration === 'YEARLY_1'
              ? 'border-blue-600 bg-blue-50 font-black text-blue-900'
              : 'border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          <div>
            <div className="text-xs text-emerald-600 font-extrabold">1 Tahun (Hemat 50%)</div>
            <div className="text-sm font-black">
              Rp {Math.round(calculateTotal('YEARLY_1')).toLocaleString('id-ID')}
            </div>
          </div>
          <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-1 rounded-md font-extrabold">
            Super Saver
          </span>
        </button>
      </div>

      <div className="mb-6">
        <label className="text-xs font-bold text-slate-700 uppercase block mb-2">Metode Pembayaran Gateway:</label>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setPaymentMethod('QRIS')}
            className={`p-3 rounded-2xl border text-center font-bold text-xs transition ${
              paymentMethod === 'QRIS' ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-300 text-slate-700'
            }`}
          >
            QRIS Instant
          </button>
          <button
            onClick={() => setPaymentMethod('VIRTUAL_ACCOUNT')}
            className={`p-3 rounded-2xl border text-center font-bold text-xs transition ${
              paymentMethod === 'VIRTUAL_ACCOUNT' ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-300 text-slate-700'
            }`}
          >
            Virtual Account Bank
          </button>
        </div>
      </div>

      <div className="pt-4 border-t border-slate-200 flex justify-between items-center mb-4">
        <span className="text-xs text-slate-500 font-bold">Total Tagihan:</span>
        <span className="text-2xl font-black text-blue-600">
          Rp {Math.round(totalAmount).toLocaleString('id-ID')}
        </span>
      </div>

      <button
        onClick={handleCheckout}
        disabled={loading}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-3.5 rounded-2xl transition disabled:opacity-50"
      >
        {loading ? 'Processing Gateway...' : 'Bayar & Dapatkan KeyPass'}
      </button>
    </div>
  );
}