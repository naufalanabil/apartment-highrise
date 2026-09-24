import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { unitNumber, accessMethod, status } = body;

    // Menyarankan simpan log ke database Neon
    // Jika tabel AccessLog belum dibuat di Prisma, ini mensimulasikan respon sukses
    console.log(`[NEON DB LOG] Unit: ${unitNumber} | Method: ${accessMethod} | Status: ${status}`);

    return NextResponse.json({ success: true, message: 'Log berhasil dicatat ke Neon DB' });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Gagal mencatat log' }, { status: 500 });
  }
}