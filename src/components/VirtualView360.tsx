'use client';

import React, { useState } from 'react';

interface VirtualView360Props {
  floor: number;
  facing: string;
}

export default function VirtualView360({ floor, facing }: VirtualView360Props) {
  const getZoneLabel = (f: number) => {
    if (f <= 15) return { name: 'Low Zone Altitude', desc: 'Pemandangan taman podium & lanskap kota bawah (~30m)' };
    if (f <= 35) return { name: 'Mid Zone Altitude', desc: 'Pemandangan lanskap kota menengah (~80m)' };
    if (f <= 49) return { name: 'High Zone Altitude', desc: 'Pemandangan sudut tinggi cakrawala kota (~140m)' };
    return { name: 'Top Penthouse Panoramic Zone', desc: 'Pemandangan panoramic 360 derajat tertinggi gedung (~180m)' };
  };

  const zoneInfo = getZoneLabel(floor);

  return (
    <div className="bg-slate-900 text-white p-6 rounded-3xl border border-slate-800 shadow-xl">
      <div className="flex justify-between items-start mb-4">
        <div>
          <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">{zoneInfo.name}</span>
          <h4 className="text-lg font-black mt-0.5">Simulasi Pemandangan Lantai {floor}</h4>
          <p className="text-xs text-slate-400">{facing} - {zoneInfo.desc}</p>
        </div>
        <span className="bg-blue-500/20 text-blue-400 border border-blue-500/30 text-[10px] px-2.5 py-1 rounded-full font-bold">
          Virtual 360°
        </span>
      </div>

      <div className="relative aspect-video bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-12 h-12 rounded-full bg-blue-600/20 border border-blue-500/40 text-blue-400 flex items-center justify-center mb-2 animate-bounce">
          🌐
        </div>
        <p className="text-xs font-bold text-slate-200">Panoramic View Render Simulator</p>
        <p className="text-[10px] text-slate-400 max-w-xs mt-1">
          [Integrasi Poin Library Three.js / Pannellum 360° View untuk Pemandangan {facing} dari Lantai {floor}]
        </p>
      </div>
    </div>
  );
}