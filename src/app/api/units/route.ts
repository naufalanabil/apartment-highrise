import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const units = await prisma.unit.findMany({
      orderBy: [{ floor: 'asc' }, { positionIndex: 'asc' }],
    });
    return NextResponse.json(units);
  } catch (error) {
    return NextResponse.json({ error: 'Gagal memuat data unit' }, { status: 500 });
  }
}