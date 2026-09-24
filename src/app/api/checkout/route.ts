import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { unitId, durationType, paymentMethod, totalAmount } = body;

    const dummyUser = await prisma.user.upsert({
      where: { email: 'penghuni.highrise@example.com' },
      update: {},
      create: {
        name: 'Penghuni High-Rise',
        email: 'penghuni.highrise@example.com',
        phone: '081234567890',
      },
    });

    const bookingCode = `BK-${Date.now().toString().slice(-6)}`;
    const randomPin = Math.floor(100000 + Math.random() * 900000).toString();

    const booking = await prisma.booking.create({
      data: {
        bookingCode,
        userId: dummyUser.id,
        unitId,
        durationType,
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        totalAmount,
        paymentMethod,
        paymentStatus: 'SUCCESS',
        payment: {
          create: {
            transactionId: `TRX-${Date.now()}`,
            qrCodeUrl: paymentMethod === 'QRIS' ? 'https://qris.id/sample.png' : null,
            vaNumber: paymentMethod === 'VIRTUAL_ACCOUNT' ? '880123456789' : null,
            bankName: paymentMethod === 'VIRTUAL_ACCOUNT' ? 'BCA' : null,
            status: 'SUCCESS',
            paidAt: new Date(),
          },
        },
        accessKey: {
          create: {
            accessPin: randomPin,
            qrAccess: `PASS-${bookingCode}-${randomPin}`,
            validFrom: new Date(),
            validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          },
        },
      },
      include: {
        accessKey: true,
        unit: true,
      },
    });

    return NextResponse.json({
      success: true,
      bookingCode: booking.bookingCode,
      unitNumber: booking.unit.unitNumber,
      floor: booking.unit.floor,
      accessKey: booking.accessKey,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Gagal memproses checkout' }, { status: 500 });
  }
}