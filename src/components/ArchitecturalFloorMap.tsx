'use client';

import React, { useState } from 'react';

export interface UnitItem {
  id: string;
  unitNumber: string;
  floor: number;
  positionIndex: number;
  type: string;
  status: 'AVAILABLE' | 'RESERVED' | 'OCCUPIED' | 'MAINTENANCE';
  facing: string;
  baseDailyRate: number;
}

interface ArchitecturalFloorMapProps {
  initialUnits: UnitItem[];
  onSelectUnit: (unit: UnitItem) => void;
}

export default function ArchitecturalFloorMap({ initialUnits, onSelectUnit }: ArchitecturalFloorMapProps) {
  const [selectedFloor, setSelectedFloor] = useState<number>(1);
  const [activeUnitId, setActiveUnitId] = useState<string | null>(null);

  const floorUnits = initialUnits.filter((u) => u.floor === selectedFloor);
  const northUnits = floorUnits.filter((u) => u.positionIndex <= 15);
  const southUnits = floorUnits.filter((u) => u.positionIndex > 15);

  const getStatusBadge = (status: UnitItem['status'], isActive: boolean) => {
    if (isActive) return 'bg-blue-600 text-white ring-4 ring-blue-300 scale-105 z-10';
    switch (status) {
      case 'AVAILABLE':
        return 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100 cursor-pointer';
      case 'RESERVED':
        return 'bg-amber-50 text-amber-800 border-amber-300 cursor-not-allowed opacity-80';
      case 'OCCUPIED':
        return 'bg-rose-50 text-rose-800 border-rose-300 cursor-not-allowed opacity-60';
      default:
        return 'bg-gray-100 text-gray-500 border-gray-300 cursor-not-allowed';
    }
  };

  return (
    <div className="bg-white p-6 rounded-3xl shadow-xl border border-slate-200">
      {/* Header Selector Lantai */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-xl font-black text-slate-900">Denah Arsitektur Floor Plan</h2>
          <p className="text-xs text-slate-500 mt-1">30 Unit Kamar per Lantai dengan Akses Elevator & Tangga Darurat</p>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm font-bold text-slate-700">Pilih Lantai:</label>
          <select
            value={selectedFloor}
            onChange={(e) => setSelectedFloor(Number(e.target.value))}
            className="p-2.5 border border-slate-300 rounded-xl font-black text-blue-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            {Array.from({ length: 50 }, (_, i) => i + 1).map((f) => (
              <option key={f} value={f}>
                Lantai {f} {f === 50 ? '(Zone Penthouse)' : ''}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Infrastruktur Gedung: Tangga Darurat & Lift */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 p-4 bg-slate-900 text-white rounded-2xl mb-6 text-xs font-bold">
        <div className="flex items-center gap-2 bg-slate-800 p-2.5 rounded-xl border border-slate-700">
          <span>🚨 Tangga Darurat Barat</span>
        </div>
        <div className="flex items-center gap-2 bg-slate-800 p-2.5 rounded-xl border border-slate-700">
          <span>🛗 Lift Penumpang 1 - 4</span>
        </div>
        <div className="flex items-center gap-2 bg-slate-800 p-2.5 rounded-xl border border-slate-700">
          <span>📦 Lift Barang / Service</span>
        </div>
        <div className="flex items-center gap-2 bg-slate-800 p-2.5 rounded-xl border border-slate-700">
          <span>🚨 Tangga Darurat Timur</span>
        </div>
      </div>

      {/* Lorong Utara (North Wing - City View) */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs font-extrabold text-blue-600 uppercase tracking-widest">
            Lorong Utara (North Wing - City View)
          </span>
          <span className="text-[10px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded font-bold">15 Unit Kamar</span>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-8 lg:grid-cols-15 gap-2">
          {northUnits.map((unit) => (
            <button
              key={unit.id}
              disabled={unit.status !== 'AVAILABLE'}
              onClick={() => {
                setActiveUnitId(unit.id);
                onSelectUnit(unit);
              }}
              className={`p-2.5 rounded-xl border text-center transition-all flex flex-col items-center justify-center ${getStatusBadge(
                unit.status,
                activeUnitId === unit.id
              )}`}
            >
              <span className="text-xs font-black">{unit.unitNumber}</span>
              <span className="text-[9px] uppercase font-bold mt-0.5">{unit.type.replace('_', ' ')}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Visual Koridor Tengah */}
      <div className="my-4 py-2 bg-slate-100 rounded-xl border border-dashed border-slate-300 text-center text-slate-400 text-xs font-bold uppercase tracking-widest">
        ━━ Corridor Central Hallway ━━
      </div>

      {/* Lorong Selatan (South Wing - Pool View) */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs font-extrabold text-emerald-600 uppercase tracking-widest">
            Lorong Selatan (South Wing - Pool View)
          </span>
          <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded font-bold">15 Unit Kamar</span>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-8 lg:grid-cols-15 gap-2">
          {southUnits.map((unit) => (
            <button
              key={unit.id}
              disabled={unit.status !== 'AVAILABLE'}
              onClick={() => {
                setActiveUnitId(unit.id);
                onSelectUnit(unit);
              }}
              className={`p-2.5 rounded-xl border text-center transition-all flex flex-col items-center justify-center ${getStatusBadge(
                unit.status,
                activeUnitId === unit.id
              )}`}
            >
              <span className="text-xs font-black">{unit.unitNumber}</span>
              <span className="text-[9px] uppercase font-bold mt-0.5">{unit.type.replace('_', ' ')}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}