'use client';

import React, { useState } from 'react';

export interface UnitItem {
  id: string;
  unitNumber: string;
  floor: number;
  type: string;
  status: 'AVAILABLE' | 'RESERVED' | 'OCCUPIED' | 'MAINTENANCE';
  facing: string;
  baseDailyRate: number;
}

interface FloorMatrixProps {
  initialUnits: UnitItem[];
  onSelectUnit: (unit: UnitItem) => void;
}

export default function FloorMatrix({ initialUnits, onSelectUnit }: FloorMatrixProps) {
  const [selectedFloor, setSelectedFloor] = useState<number>(1);
  const [activeUnitId, setActiveUnitId] = useState<string | null>(null);

  const floorUnits = initialUnits.filter((u) => u.floor === selectedFloor);

  const getStatusBadge = (status: UnitItem['status'], isActive: boolean) => {
    if (isActive) return 'bg-blue-600 text-white ring-4 ring-blue-300 scale-105';
    switch (status) {
      case 'AVAILABLE':
        return 'bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100 cursor-pointer';
      case 'RESERVED':
        return 'bg-amber-50 text-amber-700 border-amber-300 cursor-not-allowed opacity-80';
      case 'OCCUPIED':
        return 'bg-rose-50 text-rose-700 border-rose-300 cursor-not-allowed opacity-60';
      default:
        return 'bg-gray-100 text-gray-500 border-gray-300 cursor-not-allowed';
    }
  };

  return (
    <div className="bg-white p-6 rounded-3xl shadow-lg border border-gray-100">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Visual Matriks Kamar Per Lantai</h2>
          <p className="text-xs text-gray-500 mt-1">Gunakan selector lantai di kanan untuk memuat 30 kamar per lantai.</p>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm font-semibold text-gray-700">Pilih Lantai:</label>
          <select
            value={selectedFloor}
            onChange={(e) => setSelectedFloor(Number(e.target.value))}
            className="p-2.5 border border-gray-300 rounded-xl font-bold text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {Array.from({ length: 50 }, (_, i) => i + 1).map((f) => (
              <option key={f} value={f}>
                Lantai {f} {f === 50 ? '(Zone Penthouse)' : ''}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex gap-4 text-xs font-semibold mb-6">
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-emerald-500"></span> Available</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-amber-500"></span> Reserved</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-rose-500"></span> Occupied</span>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-10 gap-3">
        {floorUnits.map((unit) => {
          const isActive = activeUnitId === unit.id;
          return (
            <button
              key={unit.id}
              disabled={unit.status !== 'AVAILABLE'}
              onClick={() => {
                setActiveUnitId(unit.id);
                onSelectUnit(unit);
              }}
              className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center justify-center ${getStatusBadge(
                unit.status,
                isActive
              )}`}
            >
              <span className="text-sm font-extrabold">{unit.unitNumber}</span>
              <span className="text-[10px] uppercase font-semibold mt-0.5">{unit.type.replace('_', ' ')}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}