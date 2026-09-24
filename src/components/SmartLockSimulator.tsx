'use client';

import React, { useState, useEffect } from 'react';

interface SmartLockSimulatorProps {
  unitNumber?: string;
  correctPin?: string;
}

export default function SmartLockSimulator({
  unitNumber = '301',
  correctPin,
}: SmartLockSimulatorProps) {
  // Rumus generator PIN yang disamakan secara global untuk semua kamar & lantai
  const getUniversalPin = (unit: string) => {
    let hash = 0;
    for (let i = 0; i < unit.length; i++) {
      hash = unit.charCodeAt(i) + ((hash << 5) - hash);
    }
    return String(Math.abs(hash) % 900000 + 100000);
  };

  const activePin = correctPin || getUniversalPin(unitNumber);

  const [inputPin, setInputPin] = useState('');
  const [status, setStatus] = useState<'IDLE' | 'GRANTED' | 'DENIED'>('IDLE');
  const [timer, setTimer] = useState(5);
  const [showIoTModal, setShowIoTModal] = useState(false);

  const [acOn, setAcOn] = useState(true);
  const [lampOn, setLampOn] = useState(true);

  // Reset otomatis setiap kali unit atau lantai diganti
  useEffect(() => {
    setInputPin('');
    setStatus('IDLE');
  }, [unitNumber, correctPin]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (status === 'GRANTED') {
      setTimer(5);
      interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setStatus('IDLE');
            setInputPin('');
            setShowIoTModal(false);
            return 5;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [status]);

  const handleUnlock = async () => {
    // Memeriksa input dengan PIN aktif unit tersebut
    if (inputPin.trim() === activePin.trim()) {
      setStatus('GRANTED');
      setShowIoTModal(true);

      try {
        await fetch('/api/logs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            unitNumber,
            accessMethod: 'PIN Keypad',
            status: 'SUCCESS',
          }),
        });
      } catch (err) {
        console.error('Error logging:', err);
      }
    } else {
      setStatus('DENIED');
      setTimeout(() => setStatus('IDLE'), 2000);
    }
  };

  return (
    <div className="bg-white p-6 rounded-3xl shadow-xl border border-slate-100 max-w-md mx-auto font-sans relative">
      <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">
        Simulasi Kunci Door Lock (Unit {unitNumber})
      </h3>

      <div className="flex gap-2 mb-3">
        <input
          type="text"
          value={inputPin}
          onChange={(e) => setInputPin(e.target.value)}
          placeholder="Masukkan PIN"
          className="flex-1 bg-slate-100 border border-slate-200 rounded-2xl px-4 py-3 font-mono font-bold text-center text-lg text-slate-800 tracking-widest focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleUnlock}
          className="bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold px-6 py-3 rounded-2xl transition-all shadow-md shadow-blue-500/20 text-xs"
        >
          Buka
        </button>
      </div>

      {status === 'GRANTED' && (
        <div className="bg-emerald-500 text-white p-3 rounded-2xl text-center font-bold text-sm shadow-lg shadow-emerald-500/20 flex items-center justify-between px-4">
          <span>🔓 ACCESS GRANTED! Unlocked.</span>
          <span className="text-xs bg-emerald-700/50 px-2 py-1 rounded-lg">
            Locking in {timer}s
          </span>
        </div>
      )}

      {status === 'DENIED' && (
        <div className="bg-rose-500 text-white p-3 rounded-2xl text-center font-bold text-sm shadow-lg shadow-rose-500/20">
          🔒 ACCESS DENIED! PIN Salah.
        </div>
      )}

      {showIoTModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-slate-100">
            <div className="text-center mb-5">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-2 text-2xl font-bold">
                ✓
              </div>
              <h4 className="text-xl font-extrabold text-slate-800">
                Selamat Datang di Unit {unitNumber}!
              </h4>
              <p className="text-xs text-slate-500 mt-1">
                Pintu berhasil dibuka. Mengunci otomatis dalam {timer} detik.
              </p>
            </div>

            <div className="space-y-3 bg-slate-50 p-4 rounded-2xl mb-5">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Kontrol Otomatis Kamar
              </p>
              
              <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-slate-100">
                <span className="text-xs font-bold text-slate-700">❄️ AC Room (22°C)</span>
                <button
                  onClick={() => setAcOn(!acOn)}
                  className={`text-xs px-3 py-1 rounded-full font-bold transition-colors ${
                    acOn ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {acOn ? 'ON' : 'OFF'}
                </button>
              </div>

              <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-slate-100">
                <span className="text-xs font-bold text-slate-700">💡 Lampu Utama</span>
                <button
                  onClick={() => setLampOn(!lampOn)}
                  className={`text-xs px-3 py-1 rounded-full font-bold transition-colors ${
                    lampOn ? 'bg-amber-500 text-white' : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {lampOn ? 'ON' : 'OFF'}
                </button>
              </div>
            </div>

            <button
              onClick={() => setShowIoTModal(false)}
              className="w-full bg-slate-900 text-white font-bold py-3 rounded-2xl hover:bg-slate-800 transition-colors text-xs"
            >
              Tutup & Masuk Kamar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}