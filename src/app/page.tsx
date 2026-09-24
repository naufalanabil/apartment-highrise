'use client';

import React, { FormEvent, useEffect, useMemo, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';

// =========================================================
// TYPES
// =========================================================

interface User {
  name: string;
  unit: string;
  avatar: string;
}

type TabId =
  | 'dashboard'
  | 'floorplan'
  | 'facilities'
  | 'maintenance'
  | 'billing'
  | 'access'
  | 'parking'
  | 'operations'
  | 'admin';
type RoomStatus = 'Tersedia' | 'Terisi';
type UnitStatus = 'Checked-In' | 'Checked-Out';
type TicketStatus = 'Pending' | 'In Progress' | 'Resolved';

interface Room {
  unitNum: string;
  type: string;
  price: string;
  image: string;
  isFacility: boolean;
  status: RoomStatus;
}

interface Ticket {
  id: string;
  category: string;
  status: TicketStatus;
  date: string;
  image: string;
  description: string;
  unit: string;
}

interface Facility {
  id: string;
  name: string;
  type: string;
  image: string;
  floor: number;
}

interface FacilityBooking {
  id: string;
  facility: string;
  date: string;
  time: string;
  status: 'Booked' | 'Checked-In' | 'Completed';
}

interface VisitorPass {
  id: string;
  name: string;
  purpose: string;
  date: string;
  time: string;
  status: 'Waiting' | 'Checked In' | 'Checked Out' | 'Expired';
  validUntil?: string;
}

interface Vehicle {
  id: string;
  type: string;
  brand: string;
  plate: string;
  parking: string;
  status: 'Active' | 'Inactive';
}

interface PackageItem {
  id: string;
  courier: string;
  arrival: string;
  status: 'Ready for Pickup' | 'Picked Up';
}

interface HousekeepingRequest {
  id: string;
  service: string;
  date: string;
  time: string;
  status: 'Requested' | 'Assigned' | 'Cleaning' | 'Completed';
}

interface Announcement {
  id: string;
  title: string;
  category: string;
  date: string;
  description: string;
}

interface EmergencyRequest {
  id: string;
  type: string;
  time: string;
  status: 'Reported' | 'Dispatched' | 'Resolved';
}

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'danger' | 'info' | 'success' | 'warning';
  read: boolean;
  time: string;
}

interface AccessLog {
  id: string;
  location: string;
  time: string;
  result: 'Granted' | 'Denied';
}

interface Pet {
  id: string;
  name: string;
  type: string;
  status: 'Registered' | 'Inactive';
}

type PaymentMethod = 'qris' | 'bca' | 'mandiri';

interface PaymentReceipt {
  id: string;
  unit: string;
  description: string;
  amount: number;
  method: string;
  paidAt: string;
}

// =========================================================
// CONSTANTS
// =========================================================

const STORAGE_KEYS = {
  user: 'sky_full_user',
  bookedUnits: 'sky_booked_units',
  unitStatuses: 'sky_unit_statuses',
  tickets: 'sky_tickets',
  utilityPaid: 'sky_utility_paid',
  facilityBookings: 'sky_facility_bookings',
  visitors: 'sky_visitors',
  vehicles: 'sky_vehicles',
  packages: 'sky_packages',
  housekeeping: 'sky_housekeeping',
  announcements: 'sky_announcements',
  emergencies: 'sky_emergencies',
  notifications: 'sky_notifications',
  profile: 'sky_profile',
  accessLogs: 'sky_access_logs',
  pets: 'sky_pets',
  role: 'sky_role',
} as const;

const DEFAULT_AVATAR =
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200';

const UNIT_IMAGES = [
  'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=600',
  'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&q=80&w=600',
  'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=600',
];

const FACILITY_FLOORS = [2, 5, 50];

const FACILITY_DATA: Record<number, Facility[]> = {
  2: [
    {
      id: '201',
      name: 'Executive Meeting Room A',
      type: 'MEETING',
      floor: 2,
      image:
        'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=600',
    },
    {
      id: '202',
      name: 'Executive Meeting Room B',
      type: 'MEETING',
      floor: 2,
      image:
        'https://images.unsplash.com/photo-1517502884422-41eaead166d4?auto=format&fit=crop&q=80&w=600',
    },
    {
      id: '203',
      name: 'Business Lounge & Co-Working',
      type: 'LOUNGE',
      floor: 2,
      image:
        'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=600',
    },
  ],
  5: [
    {
      id: '501',
      name: 'Gym & Fitness Center Main Hall',
      type: 'FITNESS',
      floor: 5,
      image:
        'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=600',
    },
    {
      id: '502',
      name: 'Yoga & Aerobic Studio',
      type: 'STUDIO',
      floor: 5,
      image:
        'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&q=80&w=600',
    },
    {
      id: '503',
      name: 'Sauna & Spa Wellness Center',
      type: 'WELLNESS',
      floor: 5,
      image:
        'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=600',
    },
  ],
  50: [
    {
      id: '5001',
      name: 'Infinity Rooftop Pool',
      type: 'POOL',
      floor: 50,
      image:
        'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&q=80&w=600',
    },
    {
      id: '5002',
      name: 'Sky Lounge & Rooftop Bar',
      type: 'ROOFTOP',
      floor: 50,
      image:
        'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=600',
    },
    {
      id: '5003',
      name: 'BBQ & Open Garden Area',
      type: 'GARDEN',
      floor: 50,
      image:
        'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&q=80&w=600',
    },
  ],
};

const FACILITY_LIST = [
  {
    name: 'Infinity Rooftop Pool (Lt. 50)',
    id: '5001',
    img: FACILITY_DATA[50][0].image,
  },
  {
    name: 'Executive Fitness & Gym (Lt. 5)',
    id: '501',
    img: FACILITY_DATA[5][0].image,
  },
  {
    name: 'Sky Lounge & BBQ Area (Lt. 50)',
    id: '5002',
    img: FACILITY_DATA[50][1].image,
  },
  {
    name: 'Sauna & Spa Center (Lt. 5)',
    id: '503',
    img: FACILITY_DATA[5][2].image,
  },
];

// =========================================================
// HELPERS
// =========================================================

function readStorage<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;

  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeStorage(key: string, value: unknown) {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Ignore localStorage errors.
  }
}

function generatePinForUnit(unit: string) {
  let hash = 0;

  for (let i = 0; i < unit.length; i += 1) {
    hash = unit.charCodeAt(i) + ((hash << 5) - hash);
  }

  return String(Math.abs(hash) % 900000 + 100000);
}

function formatRupiah(value: number) {
  return `Rp ${value.toLocaleString('id-ID')}`;
}

function downloadPaymentReceiptPdf(receipt: PaymentReceipt) {
  const cleanPdfText = (value: string) => value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\x20-\x7E]/g, '-')
    .replace(/[\\()]/g, (character) => `\\${character}`);
  const textLine = (text: string, x: number, y: number, size = 11, color = '0.12 0.18 0.28') =>
    `BT /F1 ${size} Tf ${color} rg 1 0 0 1 ${x} ${y} Tm (${cleanPdfText(text)}) Tj ET`;
  const content = [
    textLine('SKY RESIDENCE', 50, 785, 21, '0.08 0.28 0.72'),
    textLine('PAYMENT RECEIPT', 50, 758, 12),
    '0.75 w 50 742 m 545 742 l S',
    textLine('PAYMENT SUCCESSFUL', 50, 710, 13, '0.02 0.55 0.35'),
    textLine(`Transaction: ${receipt.id}`, 50, 675),
    textLine(`Unit: ${receipt.unit}`, 50, 650),
    textLine(`Description: ${receipt.description}`, 50, 625),
    textLine(`Payment method: ${receipt.method}`, 50, 600),
    textLine(`Paid at: ${receipt.paidAt}`, 50, 575),
    '0.75 w 50 550 m 545 550 l S',
    textLine(`TOTAL PAID: ${formatRupiah(receipt.amount)}`, 50, 520, 16, '0.02 0.55 0.35'),
    textLine('This receipt records a simulated payment in the application.', 50, 475, 9, '0.38 0.42 0.50'),
  ].join('\n');
  const objects = [
    '<< /Type /Catalog /Pages 2 0 R >>',
    '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
    '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>',
    '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>',
    `<< /Length ${content.length} >>\nstream\n${content}\nendstream`,
  ];
  let pdf = '%PDF-1.4\n';
  const offsets = [0];
  objects.forEach((object, index) => {
    offsets.push(pdf.length);
    pdf += `${index + 1} 0 obj\n${object}\nendobj\n`;
  });
  const xrefOffset = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  offsets.slice(1).forEach((offset) => { pdf += `${String(offset).padStart(10, '0')} 00000 n \n`; });
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;

  const blob = new Blob([pdf], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `Struk-${receipt.id}.pdf`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function localDateInputValue() {
  const date = new Date();
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
  return date.toISOString().slice(0, 10);
}

function today() {
  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date());
}

function visitorPassExpired(visitor: VisitorPass) {
  if (visitor.status === 'Expired') return true;
  if (visitor.status === 'Checked In' || visitor.status === 'Checked Out') return false;

  let expiresAt: Date | null = visitor.validUntil ? new Date(visitor.validUntil) : null;
  if (!expiresAt || Number.isNaN(expiresAt.getTime())) {
    const dateParts = visitor.date.includes('/')
      ? visitor.date.split('/').map(Number)
      : visitor.date.split('-').map(Number).reverse();
    const timeMatch = visitor.time.match(/(\d{1,2}):(\d{2})\s*(?:WIB)?\s*$/i);
    if (dateParts.length === 3 && timeMatch) {
      const [day, month, year] = dateParts;
      expiresAt = new Date(year, month - 1, day, Number(timeMatch[1]), Number(timeMatch[2]));
    }
  }
  return Boolean(expiresAt && !Number.isNaN(expiresAt.getTime()) && Date.now() > expiresAt.getTime());
}

// =========================================================
// COMPONENT
// =========================================================

export default function FullImageEnterpriseBMS() {
  // -------------------------
  // AUTH
  // -------------------------
  const [isHydrated, setIsHydrated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loginUnit, setLoginUnit] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [authError, setAuthError] = useState('');

  // -------------------------
  // NAVIGATION
  // -------------------------
  const [activeTab, setActiveTab] = useState<TabId>('dashboard');
  const [selectedFloor, setSelectedFloor] = useState(1);
  const [activeUnit, setActiveUnit] = useState('101');

  // -------------------------
  // UNIT / BOOKING
  // -------------------------
  const [bookedUnits, setBookedUnits] = useState<Record<string, boolean>>({
    '101': true,
  });

  const [unitStatuses, setUnitStatuses] = useState<Record<string, UnitStatus>>({
    '101': 'Checked-In',
  });

  const [bookingModalUnit, setBookingModalUnit] = useState<string | null>(null);
  const [duration, setDuration] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('qris');
  const [paymentReceipt, setPaymentReceipt] = useState<PaymentReceipt | null>(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  // -------------------------
  // NOTIFICATION
  // -------------------------
  const [toastMsg, setToastMsg] = useState('');

  // -------------------------
  // BILLING
  // -------------------------
  const [utilityPaid, setUtilityPaid] = useState(false);
  const [showBillModal, setShowBillModal] = useState(false);

  // -------------------------
  // MAINTENANCE
  // -------------------------
  const [category, setCategory] = useState('AC / Pendingin Ruangan');
  const [description, setDescription] = useState('');
  const [tickets, setTickets] = useState<Ticket[]>([
    {
      id: 'TKT-8821',
      category: 'Lampu Utama Kedip',
      status: 'In Progress',
      date: '22/09/2026',
      image:
        'https://images.unsplash.com/photo-1540932239986-30128078f3c5?auto=format&fit=crop&q=80&w=400',
      description: 'Lampu utama unit berkedip saat dinyalakan.',
      unit: '101',
    },
  ]);

  // -------------------------
  // FACILITY
  // -------------------------
  const [facilityBookings, setFacilityBookings] = useState<FacilityBooking[]>([]);
  const [activeFacilityModal, setActiveFacilityModal] = useState<string | null>(null);
  const [facilityBookingDate, setFacilityBookingDate] = useState(localDateInputValue);
  const [facilityBookingTime, setFacilityBookingTime] = useState('08:00 - 10:00 WIB');
  const [selectedBookingQR, setSelectedBookingQR] = useState<FacilityBooking | null>(null);
  const [doorPin, setDoorPin] = useState('');
  const [doorOpenUnit, setDoorOpenUnit] = useState<string | null>(null);

  // -------------------------
  // ENTERPRISE MODULES
  // -------------------------
  const [visitors, setVisitors] = useState<VisitorPass[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([
    { id: 'VEH-001', type: 'Sedan', brand: 'Toyota Camry', plate: 'B 1234 XYZ', parking: 'P2-034', status: 'Active' },
  ]);
  const [packages, setPackages] = useState<PackageItem[]>([
    { id: 'PKG-88291', courier: 'Express Delivery', arrival: '14:32', status: 'Ready for Pickup' },
    { id: 'PKG-88274', courier: 'Premium Courier', arrival: '11:18', status: 'Picked Up' },
  ]);
  const [housekeeping, setHousekeeping] = useState<HousekeepingRequest[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([
    { id: 'ANN-01', title: 'Elevator Maintenance', category: 'Building', date: '25/09/2026', description: 'Elevator Tower A akan menjalani preventive maintenance.' },
    { id: 'ANN-02', title: 'Pool Cleaning Schedule', category: 'Facility', date: '26/09/2026', description: 'Infinity pool ditutup sementara pukul 06:00–09:00.' },
  ]);
  const [emergencies, setEmergencies] = useState<EmergencyRequest[]>([]);
  const [accessLogs, setAccessLogs] = useState<AccessLog[]>([
    { id: 'ACC-001', location: 'Main Gate', time: '14:31', result: 'Granted' },
    { id: 'ACC-002', location: 'Elevator • Floor 12', time: '14:34', result: 'Granted' },
    { id: 'ACC-003', location: 'Parking P2', time: '14:36', result: 'Granted' },
  ]);
  const [pets, setPets] = useState<Pet[]>([
    { id: 'PET-001', name: 'Milo', type: 'Golden Retriever', status: 'Registered' },
  ]);
  const [role, setRole] = useState('Resident');
  const [petName, setPetName] = useState('');
  const [petType, setPetType] = useState('Dog');
  const [unitSearch, setUnitSearch] = useState('');
  const [floorStatusFilter, setFloorStatusFilter] = useState<'all' | 'available' | 'occupied'>('all');

  const [notifications, setNotifications] = useState<NotificationItem[]>([
    { id: 'N-01', title: 'Tagihan jatuh tempo', message: 'Air & listrik Unit aktif perlu diperiksa.', type: 'warning', read: false, time: '10 menit lalu' },
    { id: 'N-02', title: 'Maintenance updated', message: 'Tiket TKT-8821 sedang dikerjakan teknisi.', type: 'info', read: false, time: '1 jam lalu' },
    { id: 'N-03', title: 'Facility confirmed', message: 'Reservasi fasilitas berhasil tersimpan.', type: 'success', read: true, time: '2 jam lalu' },
  ]);

  const [visitorName, setVisitorName] = useState('');
  const [visitorPurpose, setVisitorPurpose] = useState('Visiting Resident');
  const [visitorTime, setVisitorTime] = useState('19:00 - 22:00');
  const [visitorDate, setVisitorDate] = useState(localDateInputValue);
  const [vehicleBrand, setVehicleBrand] = useState('');
  const [vehiclePlate, setVehiclePlate] = useState('');
  const [vehicleParking, setVehicleParking] = useState('');
  const [housekeepingTime, setHousekeepingTime] = useState('10:00');
  const [housekeepingService, setHousekeepingService] = useState('Room Cleaning');
  const [emergencyType, setEmergencyType] = useState('Security Emergency');

  // =========================================================
  // INITIAL LOAD
  // =========================================================

  useEffect(() => {
    setUser(readStorage<User | null>(STORAGE_KEYS.user, null));
    setBookedUnits(
      readStorage<Record<string, boolean>>(STORAGE_KEYS.bookedUnits, {
        '101': true,
      }),
    );
    setUnitStatuses(
      readStorage<Record<string, UnitStatus>>(STORAGE_KEYS.unitStatuses, {
        '101': 'Checked-In',
      }),
    );
    setTickets(readStorage<Ticket[]>(STORAGE_KEYS.tickets, [
      {
        id: 'TKT-8821',
        category: 'Lampu Utama Kedip',
        status: 'In Progress',
        date: '22/09/2026',
        image:
          'https://images.unsplash.com/photo-1540932239986-30128078f3c5?auto=format&fit=crop&q=80&w=400',
        description: 'Lampu utama unit berkedip saat dinyalakan.',
        unit: '101',
      },
    ]));
    setUtilityPaid(readStorage<boolean>(STORAGE_KEYS.utilityPaid, false));
    const savedFacilityBookings = readStorage<FacilityBooking[]>(STORAGE_KEYS.facilityBookings, []);
    setFacilityBookings(savedFacilityBookings.map((booking) => ({
      ...booking,
      date: /^\d{2}\/\d{2}\/\d{4}$/.test(booking.date) ? booking.date.split('/').reverse().join('-') : booking.date,
      time: booking.time || '08:00 - 10:00 WIB',
    })));
    setVisitors(readStorage<VisitorPass[]>(STORAGE_KEYS.visitors, []));
    setVehicles(readStorage<Vehicle[]>(STORAGE_KEYS.vehicles, [
      { id: 'VEH-001', type: 'Sedan', brand: 'Toyota Camry', plate: 'B 1234 XYZ', parking: 'P2-034', status: 'Active' },
    ]));
    setPackages(readStorage<PackageItem[]>(STORAGE_KEYS.packages, [
      { id: 'PKG-88291', courier: 'Express Delivery', arrival: '14:32', status: 'Ready for Pickup' },
      { id: 'PKG-88274', courier: 'Premium Courier', arrival: '11:18', status: 'Picked Up' },
    ]));
    setHousekeeping(readStorage<HousekeepingRequest[]>(STORAGE_KEYS.housekeeping, []));
    setAnnouncements(readStorage<Announcement[]>(STORAGE_KEYS.announcements, [
      { id: 'ANN-01', title: 'Elevator Maintenance', category: 'Building', date: '25/09/2026', description: 'Elevator Tower A akan menjalani preventive maintenance.' },
      { id: 'ANN-02', title: 'Pool Cleaning Schedule', category: 'Facility', date: '26/09/2026', description: 'Infinity pool ditutup sementara pukul 06:00–09:00.' },
    ]));
    setEmergencies(readStorage<EmergencyRequest[]>(STORAGE_KEYS.emergencies, []));
    setAccessLogs(readStorage<AccessLog[]>(STORAGE_KEYS.accessLogs, [
      { id: 'ACC-001', location: 'Main Gate', time: '14:31', result: 'Granted' },
      { id: 'ACC-002', location: 'Elevator • Floor 12', time: '14:34', result: 'Granted' },
      { id: 'ACC-003', location: 'Parking P2', time: '14:36', result: 'Granted' },
    ]));
    setPets(readStorage<Pet[]>(STORAGE_KEYS.pets, [
      { id: 'PET-001', name: 'Milo', type: 'Golden Retriever', status: 'Registered' },
    ]));
    setRole(readStorage<string>(STORAGE_KEYS.role, 'Resident'));
    setNotifications(readStorage<NotificationItem[]>(STORAGE_KEYS.notifications, [
      { id: 'N-01', title: 'Tagihan jatuh tempo', message: 'Air & listrik Unit aktif perlu diperiksa.', type: 'warning', read: false, time: '10 menit lalu' },
      { id: 'N-02', title: 'Maintenance updated', message: 'Tiket TKT-8821 sedang dikerjakan teknisi.', type: 'info', read: false, time: '1 jam lalu' },
      { id: 'N-03', title: 'Facility confirmed', message: 'Reservasi fasilitas berhasil tersimpan.', type: 'success', read: true, time: '2 jam lalu' },
    ]));
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    writeStorage(STORAGE_KEYS.bookedUnits, bookedUnits);
  }, [bookedUnits, isHydrated]);

  useEffect(() => {
    if (!isHydrated) return;
    writeStorage(STORAGE_KEYS.unitStatuses, unitStatuses);
  }, [unitStatuses, isHydrated]);

  useEffect(() => {
    if (!isHydrated) return;
    writeStorage(STORAGE_KEYS.tickets, tickets);
  }, [tickets, isHydrated]);

  useEffect(() => {
    if (!isHydrated) return;
    writeStorage(STORAGE_KEYS.utilityPaid, utilityPaid);
  }, [utilityPaid, isHydrated]);

  useEffect(() => {
    if (!isHydrated) return;
    writeStorage(STORAGE_KEYS.facilityBookings, facilityBookings);
  }, [facilityBookings, isHydrated]);

  useEffect(() => { if (isHydrated) writeStorage(STORAGE_KEYS.visitors, visitors); }, [visitors, isHydrated]);
  useEffect(() => { if (isHydrated) writeStorage(STORAGE_KEYS.vehicles, vehicles); }, [vehicles, isHydrated]);
  useEffect(() => { if (isHydrated) writeStorage(STORAGE_KEYS.packages, packages); }, [packages, isHydrated]);
  useEffect(() => { if (isHydrated) writeStorage(STORAGE_KEYS.housekeeping, housekeeping); }, [housekeeping, isHydrated]);
  useEffect(() => { if (isHydrated) writeStorage(STORAGE_KEYS.announcements, announcements); }, [announcements, isHydrated]);
  useEffect(() => { if (isHydrated) writeStorage(STORAGE_KEYS.emergencies, emergencies); }, [emergencies, isHydrated]);
  useEffect(() => { if (isHydrated) writeStorage(STORAGE_KEYS.notifications, notifications); }, [notifications, isHydrated]);
  useEffect(() => { if (isHydrated) writeStorage(STORAGE_KEYS.accessLogs, accessLogs); }, [accessLogs, isHydrated]);
  useEffect(() => { if (isHydrated) writeStorage(STORAGE_KEYS.pets, pets); }, [pets, isHydrated]);
  useEffect(() => { if (isHydrated) writeStorage(STORAGE_KEYS.role, role); }, [role, isHydrated]);

  // =========================================================
  // DERIVED STATE
  // =========================================================

  const currentStatus = unitStatuses[activeUnit] ?? 'Checked-Out';
  const currentUnitPin = generatePinForUnit(activeUnit);
  useEffect(() => {
    setDoorPin('');
    setDoorOpenUnit(null);
  }, [activeUnit]);

  const units = useMemo<Room[]>(() => {
    return Array.from({ length: 30 }, (_, index) => {
      const unitNum = `${selectedFloor}${String(index + 1).padStart(2, '0')}`;
      const type =
        index % 3 === 0
          ? 'Two Bedroom Suite'
          : index % 2 === 0
            ? 'One Bedroom Deluxe'
            : 'Studio Executive';

      const price =
        index % 3 === 0
          ? 'Rp 10.5 Juta / bln'
          : index % 2 === 0
            ? 'Rp 6.8 Juta / bln'
            : 'Rp 4.5 Juta / bln';

      const isBooked = Boolean(bookedUnits[unitNum]);

      return {
        unitNum,
        type,
        price,
        image: UNIT_IMAGES[index % UNIT_IMAGES.length],
        isFacility: false,
        status: isBooked ? 'Terisi' : 'Tersedia',
      };
    });
  }, [selectedFloor, bookedUnits]);

  const bookingPrice = 750000;
  const totalBooking = bookingPrice * Math.max(1, duration);
  const paymentMethodLabel = paymentMethod === 'qris' ? 'QRIS' : paymentMethod === 'bca' ? 'BCA Virtual Account' : 'Mandiri Virtual Account';
  const virtualAccountNumber = (bank: 'bca' | 'mandiri', unit: string) => `${bank === 'bca' ? '70000' : '89000'}${unit.replace(/\D/g, '').padStart(6, '0').slice(-6)}`;

  const filteredUnits = useMemo(() => {
    const query = unitSearch.trim().toLowerCase();
    return units.filter((unit) => {
      const matchesSearch = !query || unit.unitNum.toLowerCase().includes(query) || unit.type.toLowerCase().includes(query);
      const booked = Boolean(bookedUnits[unit.unitNum]);
      const matchesStatus = floorStatusFilter === 'all' || (floorStatusFilter === 'occupied' ? booked : !booked);
      return matchesSearch && matchesStatus;
    });
  }, [units, unitSearch, floorStatusFilter, bookedUnits]);

  const activeRoom = useMemo(
    () => units.find((room) => room.unitNum === activeUnit),
    [units, activeUnit],
  );

  const totalUnits = 50 * 30;
  const occupiedUnits = Object.values(unitStatuses).filter((status) => status === 'Checked-In').length;
  const maintenanceCount = tickets.filter((ticket) => ticket.status !== 'Resolved').length;
  const unreadNotifications = notifications.filter((item) => !item.read).length;
  const outstandingAmount = utilityPaid ? 450000 : 770000;

  // =========================================================
  // TOAST
  // =========================================================

  const triggerToast = (message: string) => {
    setToastMsg(message);

    window.setTimeout(() => {
      setToastMsg('');
    }, 3500);
  };

  // =========================================================
  // AUTH HANDLERS
  // =========================================================

  const handleLogin = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const normalizedUnit = loginUnit.trim();

    if (!normalizedUnit || !loginPassword.trim()) {
      setAuthError('Harap isi Nomor Unit dan Password Access Pass.');
      return;
    }

    if (!/^\d+$/.test(normalizedUnit)) {
      setAuthError('Nomor unit hanya boleh berisi angka.');
      return;
    }

    const userData: User = {
      name: `Naufal Ardra (Unit ${normalizedUnit})`,
      unit: normalizedUnit,
      avatar: DEFAULT_AVATAR,
    };

    setUser(userData);
    setActiveUnit(normalizedUnit);

    setBookedUnits((previous) => ({
      ...previous,
      [normalizedUnit]: true,
    }));

    setUnitStatuses((previous) => ({
      ...previous,
      [normalizedUnit]: 'Checked-In',
    }));

    writeStorage(STORAGE_KEYS.user, userData);
    setAuthError('');
    setLoginPassword('');

    triggerToast(`👋 Selamat datang, Unit ${normalizedUnit}!`);
  };

  const handleLogout = () => {
    setUser(null);
    setLoginUnit('');
    setLoginPassword('');
    setAuthError('');
    localStorage.removeItem(STORAGE_KEYS.user);
  };

  // =========================================================
  // BOOKING / PAYMENT
  // =========================================================

  const openBookingModal = (unit: string) => {
    setBookingModalUnit(unit);
    setDuration(1);
    setPaymentMethod('qris');
  };

  const closeBookingModal = () => {
    if (isProcessingPayment) return;
    setBookingModalUnit(null);
  };

  const handleProcessPayment = () => {
    if (!bookingModalUnit || duration < 1) return;

    setIsProcessingPayment(true);

    window.setTimeout(() => {
      const unit = bookingModalUnit;

      setBookedUnits((previous) => ({
        ...previous,
        [unit]: true,
      }));

      setUnitStatuses((previous) => ({
        ...previous,
        [unit]: 'Checked-In',
      }));
      setPaymentReceipt({ id: `TRX-${Date.now().toString(36).toUpperCase()}`, unit, description: `Sewa unit (${duration} hari)`, amount: totalBooking, method: paymentMethodLabel, paidAt: new Date().toLocaleString('id-ID', { dateStyle: 'long', timeStyle: 'short' }) });

      setActiveUnit(unit);
      setSelectedFloor(Number(unit.slice(0, -2)) || selectedFloor);
      setIsProcessingPayment(false);
      setBookingModalUnit(null);

      triggerToast(
        `🎉 Pembayaran ${paymentMethodLabel} berhasil. Struk pembayaran siap. Unit ${unit} aktif selama ${duration} hari.`,
      );
    }, 1200);
  };

  const handleUnlockUnit = () => {
    if (doorPin.trim() !== currentUnitPin) {
      recordAccess(`Smart Door Unit ${activeUnit}`, 'Denied');
      setDoorOpenUnit(null);
      triggerToast(`PIN Unit ${activeUnit} salah. Pintu tetap terkunci.`);
      return;
    }
    recordAccess(`Smart Door Unit ${activeUnit}`, 'Granted');
    setDoorOpenUnit(activeUnit);
    triggerToast(`Pintu Unit ${activeUnit} berhasil dibuka.`);
  };

  const handleToggleCheckInOut = () => {
    if (!bookedUnits[activeUnit]) {
      triggerToast(`⚠️ Unit ${activeUnit} belum aktif.`);
      return;
    }

    const nextStatus: UnitStatus =
      currentStatus === 'Checked-In' ? 'Checked-Out' : 'Checked-In';

    setUnitStatuses((previous) => ({
      ...previous,
      [activeUnit]: nextStatus,
    }));
    recordAccess(nextStatus === 'Checked-In' ? 'Smart Door / Elevator' : 'Smart Door', 'Granted');

    triggerToast(
      nextStatus === 'Checked-In'
        ? `🔑 Unit ${activeUnit} Check-In Berhasil!`
        : `🔒 Unit ${activeUnit} Checked-Out.`,
    );
  };

  // =========================================================
  // MAINTENANCE
  // =========================================================

  const handleCreateTicket = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const cleanDescription = description.trim();

    if (!cleanDescription) {
      triggerToast('⚠️ Rincian keluhan belum diisi.');
      return;
    }

    const newTicket: Ticket = {
      id: `TKT-${Math.floor(1000 + Math.random() * 9000)}`,
      category,
      status: 'Pending',
      date: today(),
      image:
        'https://images.unsplash.com/photo-1581094288338-2314dddb7ece?auto=format&fit=crop&q=80&w=400',
      description: cleanDescription,
      unit: activeUnit,
    };

    setTickets((previous) => [newTicket, ...previous]);
    setDescription('');

    triggerToast('📩 Tiket laporan berhasil dikirim ke teknisi gedung!');
  };

  const updateTicketStatus = (ticketId: string, status: TicketStatus) => {
    setTickets((previous) =>
      previous.map((ticket) =>
        ticket.id === ticketId ? { ...ticket, status } : ticket,
      ),
    );

    triggerToast(`🔧 Status ${ticketId} diubah menjadi ${status}.`);
  };

  // =========================================================
  // FACILITY BOOKING
  // =========================================================

  const handleBookFacility = () => {
    if (!activeFacilityModal || !facilityBookingDate) return;
    if (facilityBookingDate < localDateInputValue()) {
      triggerToast('Tanggal reservasi tidak boleh berada di masa lalu.');
      return;
    }

    const conflict = facilityBookings.some(
      (booking) => booking.facility === activeFacilityModal &&
        booking.date === facilityBookingDate &&
        (booking.time ?? '') === facilityBookingTime && booking.status === 'Booked',
    );
    if (conflict) {
      triggerToast('Slot waktu tersebut sudah Anda pesan. Pilih jadwal lain.');
      return;
    }

    const booking: FacilityBooking = {
      id: `FAC-${Date.now().toString(36).toUpperCase()}`,
      facility: activeFacilityModal,
      date: facilityBookingDate,
      time: facilityBookingTime,
      status: 'Booked',
    };
    setFacilityBookings((previous) => [booking, ...previous]);
    setActiveFacilityModal(null);
    triggerToast(`${activeFacilityModal} berhasil direservasi.`);
  };

  const handleCancelFacilityBooking = (bookingId: string) => {
    setFacilityBookings((previous) => previous.filter((booking) => booking.id !== bookingId));
    setSelectedBookingQR((previous) => previous?.id === bookingId ? null : previous);
    triggerToast('Reservasi fasilitas berhasil dibatalkan.');
  };

  const handleFacilityCheckIn = (bookingId: string) => {
    setFacilityBookings((previous) => previous.map((booking) =>
      booking.id === bookingId && booking.status === 'Booked'
        ? { ...booking, status: 'Checked-In' }
        : booking,
    ));
    setSelectedBookingQR(null);
    triggerToast('Check-in fasilitas berhasil. Selamat menikmati!');
  };

  const handleFacilityCheckOut = (bookingId: string) => {
    setFacilityBookings((previous) => previous.map((booking) =>
      booking.id === bookingId && booking.status === 'Checked-In'
        ? { ...booking, status: 'Completed' }
        : booking,
    ));
    triggerToast('Kunjungan selesai. Check-out fasilitas berhasil.');
  };

  // =========================================================
  // ENTERPRISE HANDLERS
  // =========================================================

  const addNotification = (
    title: string,
    message: string,
    type: NotificationItem['type'] = 'info',
  ) => {
    setNotifications((previous) => [
      {
        id: `N-${Date.now()}`,
        title,
        message,
        type,
        read: false,
        time: 'baru saja',
      },
      ...previous,
    ]);
  };

  const handleCreateVisitor = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const name = visitorName.trim();
    if (!name) {
      triggerToast('⚠️ Nama visitor belum diisi.');
      return;
    }

    const timeRange = visitorTime.match(/^\s*(\d{1,2}):(\d{2})\s*-\s*(\d{1,2}):(\d{2})(?:\s*WIB)?\s*$/i);
    if (!timeRange || !visitorDate) {
      triggerToast('⚠️ Isi tanggal dan rentang waktu pass dengan format HH:MM - HH:MM.');
      return;
    }
    const [, startHour, startMinute, endHour, endMinute] = timeRange;
    const start = Number(startHour) * 60 + Number(startMinute);
    const end = Number(endHour) * 60 + Number(endMinute);
    if ([startHour, endHour].some((hour) => Number(hour) > 23) || [startMinute, endMinute].some((minute) => Number(minute) > 59) || end <= start) {
      triggerToast('⚠️ Waktu selesai harus setelah waktu mulai pada hari yang sama.');
      return;
    }
    const [year, month, day] = visitorDate.split('-').map(Number);
    const validUntil = new Date(year, month - 1, day, Number(endHour), Number(endMinute)).toISOString();

    const visitor: VisitorPass = {
      id: `VIS-${Math.floor(1000 + Math.random() * 9000)}`,
      name,
      purpose: visitorPurpose,
      date: new Date(year, month - 1, day).toLocaleDateString('id-ID'),
      time: visitorTime,
      status: 'Waiting',
      validUntil,
    };

    setVisitors((previous) => [visitor, ...previous]);
    addNotification('Visitor Pass dibuat', `${name} dapat masuk sesuai jadwal.`, 'success');
    setVisitorName('');
    triggerToast(`👥 Visitor pass ${visitor.id} berhasil dibuat.`);
  };

  const updateVisitorStatus = (
    id: string,
    status: VisitorPass['status'],
  ) => {
    const visitor = visitors.find((item) => item.id === id);
    if (!visitor) return;
    if (visitorPassExpired(visitor) && status === 'Checked In') {
      setVisitors((previous) => previous.map((item) => item.id === id ? { ...item, status: 'Expired' } : item));
      recordAccess(`Visitor ${id} • expired`, 'Denied');
      triggerToast(`⛔ Pass visitor ${id} sudah kedaluwarsa.`);
      return;
    }
    if (status === 'Checked In' && visitor.status !== 'Waiting') {
      triggerToast(`⚠️ Visitor ${id} hanya bisa Check In dari status Menunggu.`);
      return;
    }
    if (status === 'Checked Out' && visitor.status !== 'Checked In') {
      triggerToast(`⚠️ Visitor ${id} harus Check In sebelum Check Out.`);
      return;
    }
    setVisitors((previous) =>
      previous.map((visitor) =>
        visitor.id === id ? { ...visitor, status } : visitor,
      ),
    );
    recordAccess(`Visitor ${id} • ${status}`, 'Granted');
    triggerToast(`👥 Status visitor ${id}: ${status}.`);
  };

  const handleAddVehicle = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!vehicleBrand.trim() || !vehiclePlate.trim() || !vehicleParking.trim()) {
      triggerToast('⚠️ Lengkapi kendaraan dan parking slot.');
      return;
    }

    const vehicle: Vehicle = {
      id: `VEH-${Math.floor(100 + Math.random() * 900)}`,
      type: 'Car',
      brand: vehicleBrand.trim(),
      plate: vehiclePlate.trim().toUpperCase(),
      parking: vehicleParking.trim().toUpperCase(),
      status: 'Active',
    };

    setVehicles((previous) => [vehicle, ...previous]);
    setVehicleBrand('');
    setVehiclePlate('');
    setVehicleParking('');
    triggerToast('🚗 Kendaraan berhasil didaftarkan.');
  };

  const handleCreateHousekeeping = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const request: HousekeepingRequest = {
      id: `HK-${Math.floor(1000 + Math.random() * 9000)}`,
      service: housekeepingService,
      date: today(),
      time: housekeepingTime,
      status: 'Requested',
    };

    setHousekeeping((previous) => [request, ...previous]);
    addNotification('Housekeeping request', `${housekeepingService} untuk Unit ${activeUnit}.`, 'info');
    triggerToast(`🧹 Request ${request.id} berhasil dibuat.`);
  };

  const updateHousekeepingStatus = (
    id: string,
    status: HousekeepingRequest['status'],
  ) => {
    setHousekeeping((previous) =>
      previous.map((item) => (item.id === id ? { ...item, status } : item)),
    );
  };

  const markAllNotificationsRead = () => {
    setNotifications((previous) =>
      previous.map((item) => ({ ...item, read: true })),
    );
    triggerToast('🔔 Semua notifikasi ditandai sudah dibaca.');
  };

  const handlePackagePickup = (id: string) => {
    setPackages((previous) =>
      previous.map((item) =>
        item.id === id ? { ...item, status: 'Picked Up' } : item,
      ),
    );
    addNotification('Package picked up', `${id} telah diambil.`, 'success');
    triggerToast(`📦 ${id} berhasil ditandai sebagai diambil.`);
  };

  const handleEmergency = () => {
    const request: EmergencyRequest = {
      id: `SOS-${Math.floor(1000 + Math.random() * 9000)}`,
      type: emergencyType,
      time: new Date().toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
      }),
      status: 'Reported',
    };

    setEmergencies((previous) => [request, ...previous]);
    addNotification('Emergency request', `${emergencyType} dari Unit ${activeUnit}.`, 'danger');
    triggerToast(`🚨 ${request.id} dikirim ke Security (simulasi).`);
  };

  const updateEmergencyStatus = (
    id: string,
    status: EmergencyRequest['status'],
  ) => {
    setEmergencies((previous) =>
      previous.map((item) => (item.id === id ? { ...item, status } : item)),
    );
  };

  const recordAccess = (location: string, result: AccessLog['result'] = 'Granted') => {
    setAccessLogs((previous) => [
      {
        id: `ACC-${Date.now()}`,
        location,
        time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        result,
      },
      ...previous,
    ].slice(0, 12));
  };

  const handleAddPet = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!petName.trim()) {
      triggerToast('⚠️ Nama hewan belum diisi.');
      return;
    }
    setPets((previous) => [
      { id: `PET-${Date.now()}`, name: petName.trim(), type: petType, status: 'Registered' },
      ...previous,
    ]);
    setPetName('');
    addNotification('Pet registered', `${petName.trim()} terdaftar di Unit ${activeUnit}.`, 'success');
    triggerToast('🐾 Hewan peliharaan berhasil didaftarkan.');
  };

  // =========================================================
  // BILLING
  // =========================================================

  const handleConfirmUtilityPayment = () => {
    setUtilityPaid(true);
    setPaymentReceipt({ id: `TRX-${Date.now().toString(36).toUpperCase()}`, unit: activeUnit, description: 'Tagihan Air & Listrik', amount: 320000, method: paymentMethodLabel, paidAt: new Date().toLocaleString('id-ID', { dateStyle: 'long', timeStyle: 'short' }) });
    setShowBillModal(false);
    triggerToast('Pembayaran berhasil. Struk pembayaran siap.');
  };

  // =========================================================
  // LOADING / LOGIN
  // =========================================================

  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 rounded-full border-4 border-slate-700 border-t-blue-500 animate-spin" />
          <p className="text-sm font-bold">Memuat SkyResidence...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div
        className="min-h-screen w-full flex items-center justify-center p-4 bg-cover bg-center relative font-sans"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=1920')",
        }}
      >
        <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-md" />

        <div className="relative z-10 bg-white/95 backdrop-blur-xl rounded-3xl p-8 max-w-md w-full shadow-2xl border border-white/20">
          <div className="text-center mb-6">
            <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-lg mx-auto mb-3 border-2 border-blue-600">
              <img
                src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=200"
                alt="Logo SkyResidence"
                className="w-full h-full object-cover"
              />
            </div>

            <h1 className="text-2xl font-black text-slate-900">
              SkyResidence Luxury
            </h1>

            <p className="text-xs text-slate-500 mt-1">
              Sistem Manajemen Properti & Smart Access Berbasis Gambar
            </p>
          </div>

          {authError && (
            <div className="bg-rose-50 border border-rose-200 text-rose-600 text-xs font-bold p-3 rounded-xl mb-4 text-center">
              {authError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Nomor Unit / Kamar
              </label>

              <input
                type="text"
                inputMode="numeric"
                value={loginUnit}
                onChange={(event) => setLoginUnit(event.target.value)}
                placeholder="Contoh: 101, 1205, 5001"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 font-bold text-slate-800 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Password Access Pass
              </label>

              <input
                type="password"
                value={loginPassword}
                onChange={(event) => setLoginPassword(event.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 font-bold text-slate-800 focus:outline-none focus:border-blue-500"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-2xl shadow-lg text-xs transition-all mt-2"
            >
              Masuk ke Dashboard Penghuni
            </button>
          </form>
        </div>
      </div>
    );
  }

  // =========================================================
  // MAIN DASHBOARD
  // =========================================================

  return (
    <div className="min-h-screen w-full bg-slate-900 text-slate-100 p-4 md:p-6 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* HEADER */}
        <header className="bg-slate-800 rounded-3xl shadow-xl border border-slate-700 p-5 space-y-4">
          <div className="relative overflow-hidden rounded-2xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-900/40 border border-slate-700/50">
            <div className="absolute inset-0 opacity-20 pointer-events-none">
              <img
                src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=1200"
                alt="Banner"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Kiri: Judul Utama */}
            <div className="relative z-15">
              <span className="bg-blue-600/80 text-white text-[9px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-widest">
                SkyResidence High-Rise Elite
              </span>
              <h1 className="text-xl md:text-2xl font-black text-white mt-1">
                Smart Building Management
              </h1>
              <p className="text-[11px] text-slate-300">
                Sistem Terintegrasi 50 Lantai dengan Verifikasi Visual & Kunci Digital
              </p>
            </div>

            {/* Kanan: Profil & Logout (Selalu Kelihatan Utuh) */}
            <div className="relative z-15 flex items-center gap-3 bg-slate-900/90 backdrop-blur-md p-2 rounded-2xl border border-slate-700 shrink-0">
              <img
                src={user.avatar}
                alt="Avatar"
                className="w-9 h-9 rounded-xl object-cover border border-blue-500"
              />

              <button
                onClick={() => setActiveTab('admin')}
                className="relative bg-slate-800 hover:bg-slate-700 p-2 rounded-xl border border-slate-700 text-xs"
                title="Notifications"
              >
                🔔
                {unreadNotifications > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 rounded-full bg-rose-500 text-white text-[9px] font-black flex items-center justify-center">
                    {unreadNotifications}
                  </span>
                )}
              </button>

              <div className="text-left pr-1">
                <p className="text-xs font-black text-white leading-tight">{user.name}</p>
                <p className="text-[10px] text-emerald-400 font-extrabold leading-tight">
                  Unit: {activeUnit}
                </p>
              </div>

              <button
                onClick={handleLogout}
                className="bg-rose-500/20 hover:bg-rose-500 text-rose-300 hover:text-white p-2 rounded-xl text-xs font-bold transition-all ml-1"
                title="Logout"
              >
                🚪
              </button>
            </div>
          </div>

          {/* Bawah: Menu Navigasi Lengkap Berjajar Rapi */}
          <nav className="flex flex-wrap items-center gap-1.5 bg-slate-900/90 backdrop-blur-md p-2 rounded-2xl border border-slate-700">
            {[
              ['dashboard', '📊 Dashboard'],
              ['floorplan', '🏢 Residence'],
              ['facilities', '🏊 Booking'],
              ['maintenance', '🛠️ Maintenance'],
              ['billing', '💳 Finance'],
              ['access', '🔐 Access'],
              ['parking', '🚗 Parking'],
              ['operations', '📦 Operations'],
              ['admin', '⚙️ Admin'],
            ].map(([tab, label]) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as TabId)}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === tab
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                {label}
              </button>
            ))}
          </nav>
        </header>

        {/* TOAST */}
        {toastMsg && (
          <div className="bg-emerald-600 text-white p-4 rounded-2xl text-center font-bold text-sm shadow-xl animate-pulse">
            {toastMsg}
          </div>
        )}


        {/* =====================================================
            TAB: DASHBOARD OVERVIEW
        ====================================================== */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                ['🏠', 'Total Unit', totalUnits.toLocaleString('id-ID'), '50 lantai x 30 kamar'],
                ['🟢', 'Occupied', `${occupiedUnits}`, 'sedang check-in'],
                ['🛠️', 'Maintenance', `${maintenanceCount}`, 'tiket berjalan'],
                ['📅', 'Booking', `${facilityBookings.length}`, 'reservasi fasilitas'],
              ].map(([icon, title, value, subtitle]) => (
                <div key={title} className="bg-slate-800 border border-slate-700 rounded-3xl p-5 shadow-xl">
                  <div className="text-2xl">{icon}</div>
                  <p className="text-[10px] text-slate-500 uppercase font-black mt-3">{title}</p>
                  <p className="text-2xl font-black text-white mt-1">{value}</p>
                  <p className="text-[10px] text-slate-400 mt-1">{subtitle}</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {[['🔐','Access','access'],['👥','Visitor','access'],['🚗','Parking','parking'],['🧹','Housekeeping','operations'],['💳','Finance','billing']].map(([icon,label,tab]) => <button key={label} onClick={() => setActiveTab(tab as TabId)} className="bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-2xl p-4 text-left transition-all"><span className="text-xl">{icon}</span><p className="text-[10px] text-white font-black mt-2">{label}</p><p className="text-[8px] text-slate-500 mt-1">Quick Access</p></button>)}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-slate-800 border border-slate-700 rounded-3xl p-6 shadow-xl">
                <div className="flex justify-between items-center mb-5">
                  <div>
                    <h2 className="text-lg font-black text-white">Occupancy Analytics</h2>
                    <p className="text-xs text-slate-400">Simulasi distribusi status unit gedung.</p>
                  </div>
                  <span className="text-emerald-400 font-black text-sm">
                    {totalUnits ? Math.round((occupiedUnits / totalUnits) * 100) : 0}%
                  </span>
                </div>
                <div className="h-4 rounded-full bg-slate-900 overflow-hidden border border-slate-700">
                  <div
                    className="h-full bg-emerald-500 rounded-full transition-all"
                    style={{ width: `${Math.max(4, Math.min(100, (occupiedUnits / totalUnits) * 100))}%` }}
                  />
                </div>
                <div className="grid grid-cols-3 gap-3 mt-5">
                  <div className="bg-slate-900 rounded-2xl p-4">
                    <p className="text-[10px] text-slate-500">Occupied</p>
                    <p className="text-xl font-black text-emerald-400">{occupiedUnits}</p>
                  </div>
                  <div className="bg-slate-900 rounded-2xl p-4">
                    <p className="text-[10px] text-slate-500">Vacant</p>
                    <p className="text-xl font-black text-blue-400">{Math.max(0, totalUnits - occupiedUnits)}</p>
                  </div>
                  <div className="bg-slate-900 rounded-2xl p-4">
                    <p className="text-[10px] text-slate-500">Maintenance</p>
                    <p className="text-xl font-black text-amber-400">{maintenanceCount}</p>
                  </div>
                </div>
              </div>

              <div className="bg-slate-800 border border-slate-700 rounded-3xl p-6 shadow-xl">
                <h2 className="text-lg font-black text-white">Finance Snapshot</h2>
                <p className="text-xs text-slate-400 mt-1">Ringkasan akun Unit #{activeUnit}</p>
                <div className="mt-5 space-y-3">
                  <div className="bg-slate-900 rounded-2xl p-4">
                    <p className="text-[10px] text-slate-500">Outstanding</p>
                    <p className="text-xl font-black text-amber-400">{formatRupiah(outstandingAmount)}</p>
                  </div>
                  <div className="bg-slate-900 rounded-2xl p-4">
                    <p className="text-[10px] text-slate-500">Paid This Month</p>
                    <p className="text-xl font-black text-emerald-400">Rp 5.700.000</p>
                  </div>
                  <div className="bg-slate-900 rounded-2xl p-4">
                    <p className="text-[10px] text-slate-500">Next Payment</p>
                    <p className="text-sm font-black text-white">01 Oktober 2026</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-slate-800 border border-slate-700 rounded-3xl p-6 shadow-xl">
                <h2 className="text-lg font-black text-white mb-4">Revenue Analytics</h2>
                <div className="space-y-3">
                  {[
                    ['Jan', 62], ['Feb', 71], ['Mar', 78], ['Apr', 83], ['May', 91], ['Jun', 86],
                  ].map(([month, value]) => (
                    <div key={month} className="flex items-center gap-3">
                      <span className="w-8 text-[10px] text-slate-500 font-bold">{month}</span>
                      <div className="flex-1 bg-slate-900 rounded-full h-3 overflow-hidden">
                        <div className="h-full bg-blue-500 rounded-full" style={{ width: `${value}%` }} />
                      </div>
                      <span className="w-8 text-right text-[10px] text-slate-400">{value}%</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-slate-800 border border-slate-700 rounded-3xl p-6 shadow-xl">
                <h2 className="text-lg font-black text-white mb-4">Pengumuman Terbaru</h2>
                <div className="space-y-3">
                  {announcements.slice(0, 3).map((item) => (
                    <div key={item.id} className="bg-slate-900 border border-slate-700 rounded-2xl p-4">
                      <div className="flex justify-between gap-3">
                        <p className="text-xs font-black text-white">{item.title}</p>
                        <span className="text-[9px] text-blue-400 font-bold">{item.category}</span>
                      </div>
                      <p className="text-[10px] text-slate-400 mt-1">{item.description}</p>
                      <p className="text-[9px] text-slate-600 mt-2">{item.date}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =====================================================
            TAB: ACCESS / VISITOR
        ====================================================== */}
        {activeTab === 'access' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-slate-800 border border-slate-700 rounded-3xl p-6 shadow-xl">
              <div className="flex justify-between items-center mb-5">
                <div>
                  <h2 className="text-lg font-black text-white">Smart Access Center</h2>
                  <p className="text-xs text-slate-400">Kontrol akses digital Unit #{activeUnit}</p>
                </div>
                <span className="bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full text-[10px] font-black">ONLINE</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  ['🚪', 'MAIN GATE', currentStatus === 'Checked-In'],
                  ['🏢', 'LOBBY', currentStatus === 'Checked-In'],
                  ['🛗', 'ELEVATOR', currentStatus === 'Checked-In'],
                  ['🅿️', 'PARKING', currentStatus === 'Checked-In'],
                  ['🏊', 'POOL', currentStatus === 'Checked-In'],
                  ['🏋️', 'GYM', currentStatus === 'Checked-In'],
                ].map(([icon, name, enabled]) => (
                  <button
                    key={name as string}
                    type="button"
                    disabled={!enabled}
                    onClick={() => enabled && recordAccess(name as string, 'Granted')}
                    className={`text-left border rounded-2xl p-4 transition-all ${enabled ? 'bg-slate-900 border-slate-700 hover:border-blue-500' : 'bg-slate-950/70 border-slate-800 opacity-70 cursor-not-allowed'}`}
                  >
                    <span className="text-xl">{icon}</span>
                    <p className="text-[10px] font-black text-white mt-2">{name}</p>
                    <p className={`text-[9px] font-bold mt-1 ${enabled ? 'text-emerald-400' : 'text-amber-400'}`}>
                      {enabled ? '✓ ACCESS GRANTED' : 'LOCKED'}
                    </p>
                  </button>
                ))}
              </div>
              <div className="mt-4 bg-slate-950 rounded-2xl p-4 flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-slate-500">Access Pass</p>
                  <p className="text-xs font-black text-white">PASS-SR-{activeUnit}-{currentUnitPin}</p>
                  <p className={`mt-1 text-[10px] font-bold ${currentStatus === 'Checked-In' ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {currentStatus === 'Checked-In' ? '✓ Sudah Check In' : 'Belum Check In'}
                  </p>
                </div>
                <QRCodeSVG value={`https://skyresidence.id/pass?unit=${activeUnit}&pin=${currentUnitPin}`} size={70} />
              </div>
              <button
                type="button"
                onClick={handleToggleCheckInOut}
                className={`mt-3 w-full rounded-xl px-4 py-3 text-xs font-black text-white transition-colors ${
                  currentStatus === 'Checked-In'
                    ? 'bg-rose-600 hover:bg-rose-500'
                    : 'bg-emerald-600 hover:bg-emerald-500'
                }`}
              >
                {currentStatus === 'Checked-In' ? '🚪 Check Out / Keluar' : '🔑 Check In / Masuk'}
              </button>
              <p className="mt-2 text-center text-[9px] text-slate-500">
                Simulasi validasi pass: tekan Check In saat masuk dan Check Out saat keluar.
              </p>
              <div className="mt-4 bg-slate-900 border border-slate-700 rounded-2xl p-4">
                <div className="flex justify-between items-center mb-3">
                  <p className="text-xs font-black text-white">Access History</p>
                  <span className="text-[9px] text-slate-500">12 aktivitas terakhir</span>
                </div>
                <div className="space-y-2 max-h-36 overflow-y-auto">
                  {accessLogs.slice(0, 5).map((log) => (
                    <div key={log.id} className="flex justify-between items-center bg-slate-950 rounded-xl px-3 py-2">
                      <div><p className="text-[10px] font-bold text-slate-200">{log.location}</p><p className="text-[8px] text-slate-600">{log.id} • {log.time}</p></div>
                      <span className="text-[9px] font-black text-emerald-400">{log.result}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-slate-800 border border-slate-700 rounded-3xl p-6 shadow-xl">
              <h2 className="text-lg font-black text-white">Visitor Management</h2>
              <p className="text-xs text-slate-400 mt-1 mb-5">Buat visitor pass untuk tamu penghuni.</p>

              <form onSubmit={handleCreateVisitor} className="space-y-3">
                <input value={visitorName} onChange={(e) => setVisitorName(e.target.value)} placeholder="Nama visitor" className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-white" />
                <select value={visitorPurpose} onChange={(e) => setVisitorPurpose(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-white">
                  <option>Visiting Resident</option>
                  <option>Delivery</option>
                  <option>Business Meeting</option>
                  <option>Family Visit</option>
                </select>
                <input type="date" value={visitorDate} onChange={(e) => setVisitorDate(e.target.value)} min={localDateInputValue()} className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-white" />
                <input value={visitorTime} onChange={(e) => setVisitorTime(e.target.value)} placeholder="19:00 - 22:00" aria-label="Jam berlaku visitor pass, format HH:MM - HH:MM" className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-white" />
                <button className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-3 rounded-xl text-xs">+ Buat Visitor Pass</button>
              </form>

              <div className="mt-5 space-y-3 max-h-72 overflow-y-auto">
                {visitors.length === 0 ? (
                  <p className="text-xs text-slate-500 text-center py-6">Belum ada visitor pass.</p>
                ) : visitors.map((visitor) => {
                  const expired = visitorPassExpired(visitor);
                  const shownStatus = expired ? 'Expired' : visitor.status;
                  return (
                  <div key={visitor.id} className="bg-slate-900 border border-slate-700 rounded-2xl p-4">
                    <div className="flex justify-between gap-3">
                      <div>
                        <p className="text-xs font-black text-white">{visitor.name}</p>
                        <p className="text-[10px] text-slate-500">{visitor.id} • {visitor.purpose} • {visitor.date} • {visitor.time}</p>
                      </div>
                      <span className={`text-[9px] font-black ${shownStatus === 'Checked In' ? 'text-emerald-400' : shownStatus === 'Checked Out' ? 'text-slate-400' : shownStatus === 'Expired' ? 'text-rose-400' : 'text-amber-400'}`}>{shownStatus}</span>
                    </div>
                    <div className="flex gap-2 mt-3">
                      <button type="button" onClick={() => updateVisitorStatus(visitor.id, 'Checked In')} disabled={expired || visitor.status !== 'Waiting'} aria-pressed={visitor.status === 'Checked In'} className={`flex-1 py-2 rounded-lg text-[10px] font-bold transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${visitor.status === 'Checked In' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-emerald-600/30 hover:text-emerald-300'}`}>Check In</button>
                      <button type="button" onClick={() => updateVisitorStatus(visitor.id, 'Checked Out')} disabled={visitor.status !== 'Checked In'} aria-pressed={visitor.status === 'Checked Out'} className={`flex-1 py-2 rounded-lg text-[10px] font-bold transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${visitor.status === 'Checked Out' ? 'bg-rose-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-rose-600/30 hover:text-rose-300'}`}>Check Out</button>
                    </div>
                    <div className="mt-3 bg-white p-2 rounded-xl w-fit">
                      <QRCodeSVG value={`https://skyresidence.id/visitor?id=${visitor.id}&unit=${activeUnit}`} size={75} />
                    </div>
                  </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* =====================================================
            TAB: PARKING
        ====================================================== */}
        {activeTab === 'parking' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-slate-800 border border-slate-700 rounded-3xl p-6 shadow-xl">
              <h2 className="text-lg font-black text-white">Vehicle Management</h2>
              <p className="text-xs text-slate-400 mt-1 mb-5">Registrasi kendaraan penghuni.</p>
              <form onSubmit={handleAddVehicle} className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input value={vehicleBrand} onChange={(e) => setVehicleBrand(e.target.value)} placeholder="Merk / model kendaraan" className="bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-white" />
                <input value={vehiclePlate} onChange={(e) => setVehiclePlate(e.target.value)} placeholder="Nomor polisi" className="bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-white" />
                <input value={vehicleParking} onChange={(e) => setVehicleParking(e.target.value)} placeholder="Parking slot, contoh P2-034" className="bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-white md:col-span-2" />
                <button className="md:col-span-2 bg-blue-600 hover:bg-blue-500 text-white font-black py-3 rounded-xl text-xs">+ Daftarkan Kendaraan</button>
              </form>

              <div className="mt-5 space-y-3">
                {vehicles.map((vehicle) => (
                  <div key={vehicle.id} className="bg-slate-900 border border-slate-700 rounded-2xl p-4 flex justify-between items-center">
                    <div>
                      <p className="text-xs font-black text-white">{vehicle.brand}</p>
                      <p className="text-[10px] text-blue-400 font-bold">{vehicle.plate} • {vehicle.parking}</p>
                      <p className="text-[9px] text-slate-500 mt-1">{vehicle.id}</p>
                    </div>
                    <span className="bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded-lg text-[9px] font-black">{vehicle.status}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-slate-800 border border-slate-700 rounded-3xl p-6 shadow-xl">
              <div className="flex justify-between items-center mb-5">
                <div>
                  <h2 className="text-lg font-black text-white">Parking Map • P2</h2>
                  <p className="text-xs text-slate-400">Simulasi slot parkir gedung.</p>
                </div>
                <span className="text-[10px] text-emerald-400 font-black">12 AVAILABLE</span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {Array.from({ length: 20 }, (_, index) => {
                  const slot = `P2-${String(index + 1).padStart(3, '0')}`;
                  const occupied = index % 3 === 0 || vehicles.some((v) => v.parking === slot);
                  return (
                    <div key={slot} className={`rounded-xl p-3 border text-center ${occupied ? 'bg-rose-500/10 border-rose-500/30' : 'bg-emerald-500/10 border-emerald-500/30'}`}>
                      <div className="text-lg">{occupied ? '🚗' : '—'}</div>
                      <p className="text-[9px] font-black text-white mt-1">{slot}</p>
                      <p className={`text-[8px] font-bold ${occupied ? 'text-rose-400' : 'text-emerald-400'}`}>{occupied ? 'OCCUPIED' : 'AVAILABLE'}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* =====================================================
            TAB: OPERATIONS
        ====================================================== */}
        {activeTab === 'operations' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-slate-800 border border-slate-700 rounded-3xl p-6 shadow-xl">
              <h2 className="text-lg font-black text-white">Package Center</h2>
              <p className="text-xs text-slate-400 mt-1 mb-5">Delivery dan pickup penghuni.</p>
              <div className="space-y-3">
                {packages.map((item) => (
                  <div key={item.id} className="bg-slate-900 border border-slate-700 rounded-2xl p-4 flex justify-between gap-3">
                    <div>
                      <p className="text-xs font-black text-white">{item.id}</p>
                      <p className="text-[10px] text-slate-500">{item.courier} • Arrived {item.arrival}</p>
                    </div>
                    {item.status === 'Ready for Pickup' ? (
                      <button onClick={() => handlePackagePickup(item.id)} className="bg-blue-600 text-white px-3 py-2 rounded-xl text-[9px] font-black">Pickup</button>
                    ) : (
                      <span className="text-[9px] text-emerald-400 font-black self-center">PICKED UP</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-slate-800 border border-slate-700 rounded-3xl p-6 shadow-xl">
              <h2 className="text-lg font-black text-white">Housekeeping</h2>
              <p className="text-xs text-slate-400 mt-1 mb-5">Request layanan unit.</p>
              <form onSubmit={handleCreateHousekeeping} className="space-y-3">
                <select value={housekeepingService} onChange={(e) => setHousekeepingService(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-white">
                  <option>Room Cleaning</option>
                  <option>Replace Towels</option>
                  <option>Deep Cleaning</option>
                  <option>Bed Linen</option>
                </select>
                <input type="time" value={housekeepingTime} onChange={(e) => setHousekeepingTime(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-white" />
                <button className="w-full bg-purple-600 hover:bg-purple-500 text-white font-black py-3 rounded-xl text-xs">+ Request Housekeeping</button>
              </form>
              <div className="mt-5 space-y-3">
                {housekeeping.map((item) => (
                  <div key={item.id} className="bg-slate-900 border border-slate-700 rounded-2xl p-4">
                    <div className="flex justify-between">
                      <div>
                        <p className="text-xs font-black text-white">{item.service}</p>
                        <p className="text-[10px] text-slate-500">{item.id} • {item.date} • {item.time}</p>
                      </div>
                      <span className="text-[9px] text-purple-400 font-black">{item.status}</span>
                    </div>
                    <div className="flex gap-2 mt-3">
                      {(['Assigned', 'Cleaning', 'Completed'] as HousekeepingRequest['status'][]).map((status) => (
                        <button key={status} aria-pressed={item.status === status} onClick={() => updateHousekeepingStatus(item.id, status)} className={`flex-1 py-2 rounded-lg text-[9px] font-bold transition-colors ${item.status === status ? status === 'Assigned' ? 'bg-blue-600 text-white ring-1 ring-blue-300' : status === 'Cleaning' ? 'bg-amber-500 text-slate-950 ring-1 ring-amber-300' : 'bg-emerald-600 text-white ring-1 ring-emerald-300' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'}`}>{status}</button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-2 bg-slate-800 border border-slate-700 rounded-3xl p-6 shadow-xl">
              <div className="flex justify-between items-center mb-4">
                <div><h2 className="text-lg font-black text-white">Pet Management</h2><p className="text-xs text-slate-400">Registrasi hewan peliharaan penghuni.</p></div>
                <span className="text-[9px] bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full font-black">{pets.length} REGISTERED</span>
              </div>
              <form onSubmit={handleAddPet} className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <input value={petName} onChange={(e) => setPetName(e.target.value)} placeholder="Nama hewan" className="bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-white" />
                <select value={petType} onChange={(e) => setPetType(e.target.value)} className="bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-white"><option>Dog</option><option>Cat</option><option>Bird</option><option>Other</option></select>
                <button className="bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-xl text-xs">+ Register Pet</button>
              </form>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
                {pets.map((pet) => <div key={pet.id} className="bg-slate-900 border border-slate-700 rounded-2xl p-4"><div className="flex justify-between"><span className="text-xl">🐾</span><span className="text-[9px] text-emerald-400 font-black">{pet.status}</span></div><p className="text-xs font-black text-white mt-2">{pet.name}</p><p className="text-[10px] text-slate-500">{pet.type} • {pet.id}</p></div>)}
              </div>
            </div>

            <div className="lg:col-span-2 bg-slate-800 border border-slate-700 rounded-3xl p-6 shadow-xl">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h2 className="text-lg font-black text-white">Emergency / SOS</h2>
                  <p className="text-xs text-slate-400">Simulasi pelaporan emergency ke Security.</p>
                </div>
                <span className="text-[9px] bg-rose-500/10 text-rose-400 px-3 py-1 rounded-full font-black">DEMO MODE</span>
              </div>
              <div className="flex flex-col md:flex-row gap-3">
                <select value={emergencyType} onChange={(e) => setEmergencyType(e.target.value)} className="flex-1 bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-white">
                  <option>Security Emergency</option>
                  <option>Fire Emergency</option>
                  <option>Medical Emergency</option>
                  <option>Water Leak</option>
                  <option>Electrical Emergency</option>
                </select>
                <button onClick={handleEmergency} className="bg-rose-600 hover:bg-rose-500 text-white font-black px-6 py-3 rounded-xl text-xs">🚨 SEND EMERGENCY</button>
              </div>
              <div className="mt-5 space-y-3">
                {emergencies.length === 0 ? (
                  <p className="text-xs text-slate-500 text-center py-4">Belum ada laporan emergency.</p>
                ) : emergencies.map((item) => (
                  <div key={item.id} className="bg-slate-900 border border-slate-700 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-black text-white">{item.type}</p>
                      <p className="text-[10px] text-slate-500">{item.id} • Unit {activeUnit} • {item.time}</p>
                    </div>
                    <div className="flex gap-2">
                      {(['Reported', 'Dispatched', 'Resolved'] as EmergencyRequest['status'][]).map((status) => (
                        <button key={status} aria-pressed={item.status === status} onClick={() => updateEmergencyStatus(item.id, status)} className={`px-3 py-2 rounded-lg text-[9px] font-bold transition-colors ${item.status === status ? status === 'Reported' ? 'bg-rose-600 text-white ring-1 ring-rose-300' : status === 'Dispatched' ? 'bg-amber-500 text-slate-950 ring-1 ring-amber-300' : 'bg-emerald-600 text-white ring-1 ring-emerald-300' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'}`}>{status}</button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* =====================================================
            TAB: ADMIN / NOTIFICATIONS
        ====================================================== */}
        {activeTab === 'admin' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-slate-800 border border-slate-700 rounded-3xl p-6 shadow-xl">
              <div className="flex justify-between items-center mb-5">
                <div>
                  <h2 className="text-lg font-black text-white">Notification Center</h2>
                  <p className="text-xs text-slate-400">{unreadNotifications} notifikasi belum dibaca.</p>
                </div>
                <button onClick={markAllNotificationsRead} className="text-[10px] bg-blue-600 text-white px-3 py-2 rounded-xl font-bold">Mark all as read</button>
              </div>
              <div className="space-y-3">
                {notifications.map((item) => (
                  <div key={item.id} className={`rounded-2xl p-4 border ${item.read ? 'bg-slate-900 border-slate-700' : 'bg-blue-500/5 border-blue-500/30'}`}>
                    <div className="flex gap-3">
                      <span className="text-xl">
                        {item.type === 'danger' ? '🚨' : item.type === 'warning' ? '⚠️' : item.type === 'success' ? '✅' : '🔔'}
                      </span>
                      <div className="flex-1">
                        <div className="flex justify-between gap-3">
                          <p className="text-xs font-black text-white">{item.title}</p>
                          <span className="text-[9px] text-slate-600">{item.time}</span>
                        </div>
                        <p className="text-[10px] text-slate-400 mt-1">{item.message}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-slate-800 border border-slate-700 rounded-3xl p-6 shadow-xl">
                <h2 className="text-lg font-black text-white">Resident Profile</h2>
                <div className="flex items-center gap-3 mt-5">
                  <img src={user.avatar} alt="Resident" className="w-14 h-14 rounded-2xl object-cover border border-blue-500" />
                  <div>
                    <p className="text-sm font-black text-white">{user.name}</p>
                    <p className="text-[10px] text-blue-400 font-bold">Resident • Unit {activeUnit}</p>
                    <p className="text-[9px] text-slate-500 mt-1">Access ID: SR-{activeUnit}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-5">
                  <div className="bg-slate-900 rounded-xl p-3"><p className="text-[9px] text-slate-500">Floor</p><p className="text-xs font-black text-white">{String(activeUnit).length > 2 ? activeUnit.slice(0, -2) : 1}</p></div>
                  <div className="bg-slate-900 rounded-xl p-3"><p className="text-[9px] text-slate-500">Vehicle</p><p className="text-xs font-black text-white">{vehicles.length}</p></div>
                </div>
              </div>

              <div className="bg-slate-800 border border-slate-700 rounded-3xl p-6 shadow-xl">
                <div className="flex justify-between items-center"><h2 className="text-lg font-black text-white">Role Access</h2><span className="text-[9px] text-blue-400 font-black">DEMO RBAC</span></div>
                <select value={role} onChange={(e) => { setRole(e.target.value); triggerToast(`🔐 Role demo diubah menjadi ${e.target.value}.`); }} className="w-full mt-4 bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-white">
                  <option>Resident</option><option>Security</option><option>Finance</option><option>Maintenance</option><option>Building Manager</option><option>Admin</option>
                </select>
                <p className="text-[9px] text-slate-500 mt-2">Role aktif: <span className="text-white font-bold">{role}</span></p>
                <div className="mt-4 space-y-2">
                  {[
                    ['Resident', 'Booking • Billing • Access', 'blue'],
                    ['Security', 'Visitor • QR Scan • SOS', 'emerald'],
                    ['Finance', 'Invoice • Payment • Billing', 'amber'],
                    ['Maintenance', 'Tickets • Housekeeping', 'purple'],
                    ['Admin', 'Full Building Access', 'rose'],
                  ].map(([role, access, tone]) => (
                    <div key={role} className="bg-slate-900 border border-slate-700 rounded-xl p-3">
                      <p className="text-xs font-black text-white">{role}</p>
                      <p className="text-[9px] text-slate-500 mt-1">{access}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-slate-800 border border-slate-700 rounded-3xl p-6 shadow-xl">
                <h2 className="text-lg font-black text-white">Elevator Monitoring</h2>
                <div className="mt-4 space-y-2">
                  {[
                    ['E1', 'Floor 12', '▲', 'NORMAL'],
                    ['E2', 'Floor 08', '▼', 'NORMAL'],
                    ['E3', 'Floor 02', '—', 'MAINTENANCE'],
                  ].map(([id, floor, direction, status]) => (
                    <div key={id} className="bg-slate-900 rounded-xl p-3 flex items-center justify-between">
                      <div><p className="text-xs font-black text-white">{id}</p><p className="text-[9px] text-slate-500">{floor} • {direction}</p></div>
                      <span className={`text-[9px] font-black ${status === 'NORMAL' ? 'text-emerald-400' : 'text-amber-400'}`}>{status}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =====================================================
            TAB 1: FLOORPLAN
        ====================================================== */}
        {activeTab === 'floorplan' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-slate-800 p-6 rounded-3xl shadow-xl border border-slate-700">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                  <div>
                    <h2 className="text-lg font-black text-white">
                      Denah Arsitektur & Katalog Unit 50 Lantai
                    </h2>
                    <p className="text-xs text-slate-400">
                      Pilih salah satu dari 30 kamar di lantai ini, klik PIN, lalu tekan Buka Pintu.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-400">
                      Pilih Lantai:
                    </span>

                    <select
                      value={selectedFloor}
                      onChange={(event) =>
                        setSelectedFloor(Number(event.target.value))
                      }
                      className="bg-slate-900 border border-slate-700 text-blue-400 font-bold text-xs rounded-xl px-4 py-2.5 focus:outline-none"
                    >
                      {Array.from({ length: 50 }, (_, index) => index + 1).map(
                        (floor) => (
                          <option key={floor} value={floor}>
                            Lantai {floor}
                            {FACILITY_FLOORS.includes(floor)
                              ? ' (30 Kamar + Fasilitas di tab Booking)'
                              : ''}
                          </option>
                        ),
                      )}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                  <input value={unitSearch} onChange={(e) => setUnitSearch(e.target.value)} placeholder="🔎 Cari unit / tipe kamar..." className="bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-white" />
                  <select value={floorStatusFilter} onChange={(e) => setFloorStatusFilter(e.target.value as typeof floorStatusFilter)} className="bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-white">
                    <option value="all">Semua Status</option><option value="available">Hanya Tersedia</option><option value="occupied">Hanya Terisi</option>
                  </select>
                </div>
                <div className="flex justify-between items-center mb-3"><p className="text-[10px] text-slate-500">Menampilkan {filteredUnits.length} dari {units.length} item</p><span className="text-[10px] text-blue-400 font-bold">50 Floors • Live Map</span></div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-h-[500px] overflow-y-auto pr-2">
                  {filteredUnits.map((unit) => {
                    const isSelected = unit.unitNum === activeUnit;
                    const isBooked = Boolean(bookedUnits[unit.unitNum]);

                    return (
                      <div
                        key={unit.unitNum}
                        onClick={() => {
                          if (unit.isFacility) {
                            setSelectedFloor(unit.unitNum.startsWith('50') ? 50 : Number(unit.unitNum.slice(0, -2)));
                            setActiveTab('facilities');
                          } else {
                            setActiveUnit(unit.unitNum);
                            triggerToast(`Pilih PIN untuk Unit ${unit.unitNum}, lalu tekan Buka Pintu.`);
                          }
                        }}
                        className={`group relative rounded-2xl overflow-hidden border cursor-pointer transition-all ${
                          isSelected
                            ? 'border-blue-500 ring-2 ring-blue-500 shadow-xl scale-[1.02]'
                            : 'border-slate-700 hover:border-slate-500 bg-slate-900'
                        }`}
                      >
                        <div className="h-32 w-full relative overflow-hidden">
                          <img
                            src={unit.image}
                            alt={unit.type}
                            className="w-full h-full object-cover transition duration-500 group-hover:scale-110"
                          />

                          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

                          <span
                            className={`absolute top-2 right-2 text-[10px] px-2.5 py-1 rounded-full font-extrabold shadow ${
                              unit.isFacility
                                ? 'bg-blue-500 text-white'
                                : isBooked
                                  ? 'bg-emerald-500 text-white'
                                  : 'bg-slate-800 text-slate-300'
                            }`}
                          >
                            {unit.isFacility
                              ? 'Fasilitas'
                              : isBooked
                                ? 'Terisi / Aktif'
                                : 'Tersedia'}
                          </span>

                          <span className="absolute bottom-2 left-3 text-white font-black text-sm">
                            {unit.isFacility
                              ? unit.type
                              : `Unit #${unit.unitNum}`}
                          </span>
                        </div>

                        <div className="p-3 bg-slate-900 space-y-1">
                          <p className="text-xs font-bold text-slate-200 line-clamp-1">
                            {unit.type}
                          </p>
                          <p className="text-[11px] text-blue-400 font-extrabold">
                            {unit.price}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="bg-slate-800 p-6 rounded-3xl shadow-xl border border-slate-700 flex flex-col sm:flex-row justify-between items-center gap-4">
                <div>
                  <h3 className="text-sm font-black text-white">
                    Unit Terpilih: #{activeUnit}
                  </h3>

                  <p className="text-xs text-slate-400 mt-0.5">
                    Status Sistem Kamar:{' '}
                    <span className="font-bold text-blue-400 uppercase">
                      {currentStatus}
                    </span>
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={handleToggleCheckInOut}
                    className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-lg ${
                      currentStatus === 'Checked-In'
                        ? 'bg-rose-600 hover:bg-rose-500 text-white'
                        : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                    }`}
                  >
                    {currentStatus === 'Checked-In'
                      ? '🚪 Check-Out Kamar'
                      : '🔑 Check-In Kamar'}
                  </button>

                  <button
                    onClick={() => openBookingModal(activeUnit)}
                    className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-lg transition-all"
                  >
                    Sewa Ulang / Durasi
                  </button>
                </div>
              </div>
            </div>

            {/* DIGITAL PASS */}
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-6 rounded-3xl shadow-xl border border-slate-700 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black text-blue-400 tracking-widest uppercase">
                    Smart Access Pass
                  </span>

                  <span
                    className={`text-[10px] px-2.5 py-1 rounded-full font-bold ${
                      currentStatus === 'Checked-In'
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : 'bg-amber-500/20 text-amber-400'
                    }`}
                  >
                    {currentStatus === 'Checked-In'
                      ? 'ACTIVE PASS'
                      : 'CHECKED-OUT'}
                  </span>
                </div>

                <div className="bg-white p-4 rounded-2xl flex flex-col items-center justify-center shadow-inner">
                  <QRCodeSVG
                    value={`https://skyresidence.id/pass?unit=${activeUnit}&pin=${currentUnitPin}`}
                    size={140}
                  />

                  <p className="text-[10px] text-slate-500 mt-2 font-mono font-bold">
                    PASS-SR-{activeUnit}-{currentUnitPin}
                  </p>
                </div>

                <div className="text-center space-y-1">
                  <p className="text-xs text-slate-400">
                    PIN Smart Door Lock Unit {activeUnit}:
                  </p>

                  <p className="text-2xl font-black text-white tracking-widest bg-slate-950 py-2 rounded-xl border border-slate-800">
                    {currentUnitPin}
                  </p>
                  <div className="grid grid-cols-[1fr_auto] gap-2 pt-2">
                    <input
                      aria-label={`PIN pintu Unit ${activeUnit}`}
                      inputMode="numeric"
                      autoComplete="one-time-code"
                      maxLength={6}
                      value={doorPin}
                      onChange={(event) => setDoorPin(event.target.value.replace(/\D/g, '').slice(0, 6))}
                      onKeyDown={(event) => { if (event.key === 'Enter') handleUnlockUnit(); }}
                      placeholder="Masukkan PIN 6 digit"
                      className="min-w-0 rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-center font-mono text-sm tracking-[0.3em] text-white placeholder:tracking-normal placeholder:text-slate-500"
                    />
                    <button type="button" onClick={() => setDoorPin(currentUnitPin)} className="rounded-xl border border-blue-500/30 bg-blue-500/10 px-3 text-[10px] font-black text-blue-300 hover:bg-blue-500/20">PIN</button>
                  </div>
                  <button type="button" onClick={handleUnlockUnit} disabled={doorPin.length !== 6} className="w-full rounded-xl bg-emerald-600 py-3 text-xs font-black text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-500">{doorOpenUnit === activeUnit ? 'Pintu Terbuka' : 'Buka Pintu'}</button>
                  {doorOpenUnit === activeUnit && <p role="status" className="text-[10px] font-bold text-emerald-400">Akses Unit {activeUnit} berhasil. Silakan masuk.</p>}
                </div>
              </div>

              {/* ACTIVE UNIT INFO */}
              <div className="bg-slate-800 p-6 rounded-3xl shadow-xl border border-slate-700 space-y-3">
                <div className="flex justify-between items-center">
                  <h3 className="text-xs font-bold text-slate-300">
                    Detail Unit #{activeUnit}
                  </h3>
                  <span className="text-[10px] text-blue-400 font-bold">
                    {activeRoom?.type ?? 'Unit Aktif'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="rounded-xl bg-slate-900 border border-slate-700 p-3">
                    <p className="text-[10px] text-slate-500">Status</p>
                    <p className="text-xs font-black text-white mt-1">
                      {currentStatus}
                    </p>
                  </div>

                  <div className="rounded-xl bg-slate-900 border border-slate-700 p-3">
                    <p className="text-[10px] text-slate-500">Pass</p>
                    <p className="text-xs font-black text-emerald-400 mt-1">
                      {bookedUnits[activeUnit] ? 'Aktif' : 'Belum Aktif'}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <img
                    src={UNIT_IMAGES[0]}
                    alt="Interior 1"
                    className="rounded-xl h-24 w-full object-cover border border-slate-700"
                  />
                  <img
                    src={UNIT_IMAGES[1]}
                    alt="Interior 2"
                    className="rounded-xl h-24 w-full object-cover border border-slate-700"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =====================================================
            TAB 2: FACILITIES
        ====================================================== */}
        {activeTab === 'facilities' && (
          <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-800 p-6 rounded-3xl shadow-xl border border-slate-700 space-y-6">
              <div>
                <h2 className="text-xl font-black text-white mb-1">
                  Reservasi Fasilitas Gedung
                </h2>
                <p className="text-xs text-slate-400">
                  Pilih fasilitas gedung untuk reservasi.
                </p>
              </div>

              <div className="space-y-4">
                {FACILITY_LIST.map((facility) => {
                  const hasBookings = facilityBookings.some((booking) => booking.facility === facility.name && booking.status === 'Booked');

                  return (
                    <div
                      key={facility.id}
                      className="flex items-center gap-4 bg-slate-900 p-3 rounded-2xl border border-slate-700"
                    >
                      <img
                        src={facility.img}
                        alt={facility.name}
                        className="w-16 h-16 rounded-xl object-cover"
                      />

                      <div className="flex-grow">
                        <h4 className="font-bold text-white text-xs">
                          {facility.name}
                        </h4>

                        <p className="text-[9px] text-slate-500 mt-1">Capacity 8–40 • 06:00–22:00 • Booking 60–120 menit</p>
                        <p
                          className={`text-[10px] font-semibold mt-0.5 ${
                            hasBookings ? 'text-emerald-400' : 'text-slate-400'
                          }`}
                        >
                          {hasBookings ? 'Ada jadwal reservasi' : 'Tersedia untuk Booking'}
                        </p>
                      </div>

                      <button
                        onClick={() => setActiveFacilityModal(facility.name)}
                        className="px-4 py-2 rounded-xl text-xs font-bold transition bg-blue-600 hover:bg-blue-500 text-white"
                      >
                        Reservasi
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-slate-800 p-6 rounded-3xl shadow-xl border border-slate-700 space-y-4">
              <h3 className="text-sm font-extrabold text-white">
                Reservasi Saya
              </h3>

              {facilityBookings.length === 0 ? (
                <div className="bg-slate-900 border border-dashed border-slate-700 rounded-2xl p-6 text-center">
                  <p className="text-xs text-slate-400">
                    Belum ada fasilitas yang dipesan.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {facilityBookings.map((booking) => (
                    <div key={booking.id} className="bg-slate-900 border border-slate-700 rounded-2xl p-4 space-y-3">
                      <div className="flex justify-between gap-3">
                        <div><p className="text-xs font-bold text-white">{booking.facility}</p><p className="text-[10px] text-slate-400 mt-1">{booking.id} &middot; {new Date(booking.date + 'T12:00:00').toLocaleDateString('id-ID')} &middot; {booking.time || 'Waktu belum ditentukan'}</p></div>
                        <span className={`text-[10px] px-2 py-1 rounded-full font-bold h-fit ${booking.status === 'Booked' ? 'bg-blue-500/20 text-blue-300' : booking.status === 'Checked-In' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-700 text-slate-300'}`}>
                          {booking.status === 'Booked' ? 'BOOKED' : booking.status === 'Checked-In' ? 'SEDANG DIGUNAKAN' : 'SELESAI'}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {booking.status === 'Booked' ? (
                          <>
                            <button onClick={() => setSelectedBookingQR(booking)} className="bg-blue-600 hover:bg-blue-500 text-white py-2 rounded-xl text-[10px] font-bold transition">QR Tiket Masuk</button>
                            <button onClick={() => handleCancelFacilityBooking(booking.id)} className="bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/20 py-2 rounded-xl text-[10px] font-bold transition">Batalkan</button>
                          </>
                        ) : booking.status === 'Checked-In' ? (
                          <button onClick={() => handleFacilityCheckOut(booking.id)} className="col-span-2 bg-emerald-600 hover:bg-emerald-500 text-white py-2 rounded-xl text-[10px] font-bold transition">Selesai / Keluar</button>
                        ) : (
                          <button disabled className="col-span-2 bg-slate-800 text-slate-400 py-2 rounded-xl text-[10px] font-bold cursor-not-allowed">Kunjungan Selesai</button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="rounded-2xl overflow-hidden h-64 border border-slate-700">
                <img
                  src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800"
                  alt="Sky Lounge"
                  className="w-full h-full object-cover"
                />
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                Gunakan pass digital QR untuk akses zona fasilitas yang telah
                tersedia pada sistem.
              </p>
            </div>
          </div>

          <section className="mt-6 rounded-3xl border border-slate-700 bg-slate-800 p-6 shadow-xl space-y-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div><h2 className="text-lg font-black text-white">Booking Kamar & Smart Door</h2><p className="mt-1 text-xs text-slate-400">Semua lantai memiliki 30 kamar. Pilih kamar, klik PIN, lalu tekan Buka Pintu.</p></div>
              <label className="text-xs font-bold text-slate-300">Pilih lantai
                <select value={selectedFloor} onChange={(event) => { const floor = Number(event.target.value); setSelectedFloor(floor); setActiveUnit(`${floor}01`); }} className="mt-1 block w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-blue-300 sm:w-56">
                  {Array.from({ length: 50 }, (_, index) => index + 1).map((floor) => <option key={floor} value={floor}>Lantai {floor}</option>)}
                </select>
              </label>
            </div>
            <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1.4fr_0.8fr]">
              <div className="space-y-3"><p className="text-[10px] font-bold uppercase tracking-wider text-blue-300">30 kamar di lantai {selectedFloor}</p>
                <div className="grid max-h-[440px] grid-cols-2 gap-2 overflow-y-auto pr-1 sm:grid-cols-3 lg:grid-cols-5">
                  {units.map((room) => { const selected = room.unitNum === activeUnit; const booked = Boolean(bookedUnits[room.unitNum]); return (
                    <button key={room.unitNum} type="button" onClick={() => setActiveUnit(room.unitNum)} aria-pressed={selected} className={`rounded-xl border p-3 text-left transition ${selected ? 'border-blue-400 bg-blue-500/15 ring-1 ring-blue-400' : 'border-slate-700 bg-slate-900 hover:border-slate-500'}`}>
                      <span className="block text-xs font-black text-white">Unit {room.unitNum}</span><span className="mt-1 block truncate text-[9px] text-slate-400">{room.type}</span><span className={`mt-2 inline-block rounded-full px-2 py-1 text-[8px] font-bold ${booked ? 'bg-emerald-500/15 text-emerald-300' : 'bg-slate-700 text-slate-300'}`}>{booked ? 'Aktif' : 'Tersedia'}</span>
                    </button>); })}
                </div>
              </div>
              <div className="rounded-2xl border border-slate-700 bg-slate-900 p-5">
                <div className="flex items-center justify-between gap-3"><p className="text-[10px] font-black uppercase tracking-wider text-blue-300">PIN Smart Door</p><span className={`rounded-full px-2.5 py-1 text-[9px] font-bold ${doorOpenUnit === activeUnit ? 'bg-emerald-500/15 text-emerald-300' : 'bg-slate-700 text-slate-300'}`}>{doorOpenUnit === activeUnit ? 'PINTU TERBUKA' : 'TERKUNCI'}</span></div>
                <p className="mt-4 text-sm font-bold text-white">Unit {activeUnit}</p><p className="mt-2 rounded-xl border border-slate-800 bg-slate-950 py-3 text-center font-mono text-2xl font-black tracking-[0.35em] text-white">{currentUnitPin}</p>
                <div className="mt-3 grid grid-cols-[1fr_auto] gap-2"><input aria-label={`Masukkan PIN Unit ${activeUnit}`} inputMode="numeric" autoComplete="one-time-code" maxLength={6} value={doorPin} onChange={(event) => setDoorPin(event.target.value.replace(/\D/g, '').slice(0, 6))} onKeyDown={(event) => { if (event.key === 'Enter') handleUnlockUnit(); }} placeholder="Masukkan PIN 6 digit" className="min-w-0 rounded-xl border border-slate-700 bg-slate-950 px-3 py-3 text-center font-mono text-sm tracking-[0.3em] text-white placeholder:tracking-normal placeholder:text-slate-500" /><button type="button" onClick={() => setDoorPin(currentUnitPin)} className="rounded-xl border border-blue-500/30 bg-blue-500/10 px-4 text-[10px] font-black text-blue-300 hover:bg-blue-500/20">PIN</button></div>
                <button type="button" onClick={handleUnlockUnit} disabled={doorPin.length !== 6} className="mt-2 w-full rounded-xl bg-emerald-600 py-3 text-xs font-black text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-500">Buka Pintu</button>
                {doorOpenUnit === activeUnit && <p role="status" className="mt-3 text-center text-[10px] font-bold text-emerald-300">Akses Unit {activeUnit} berhasil. Silakan masuk.</p>}<p className="mt-3 text-center text-[9px] text-slate-500">PIN berubah otomatis saat Anda memilih unit lain.</p>
              </div>
            </div>
          </section>
          </>
        )}

        {/* =====================================================
            TAB 3: MAINTENANCE
        ====================================================== */}
        {activeTab === 'maintenance' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-800 p-6 rounded-3xl shadow-xl border border-slate-700">
              <h2 className="text-xl font-black text-white mb-1">
                Adukan Kendala / Perbaikan
              </h2>

              <p className="text-xs text-slate-400 mb-6">
                Kirim laporan kendala teknis unit #{activeUnit}.
              </p>

              <form onSubmit={handleCreateTicket} className="space-y-4 text-xs">
                <div>
                  <label className="font-bold text-slate-300 block mb-1">
                    Kategori Kendala
                  </label>

                  <select
                    value={category}
                    onChange={(event) => setCategory(event.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 font-bold text-white"
                  >
                    <option>AC / Pendingin Ruangan</option>
                    <option>Pipa Kebocoran Air / Saniter</option>
                    <option>Kelistrikan & Stopkontak</option>
                    <option>Smart Lock / Door Access</option>
                    <option>Lift / Akses Lantai</option>
                    <option>Fasilitas Gedung</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-300 block mb-1">
                    Rincian Keluhan
                  </label>

                  <textarea
                    rows={4}
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                    placeholder="Jelaskan kendala teknis secara detail..."
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3.5 rounded-2xl shadow-lg text-xs"
                >
                  Kirim Tiket Laporan Teknisi
                </button>
              </form>
            </div>

            <div className="bg-slate-800 p-6 rounded-3xl shadow-xl border border-slate-700 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-extrabold text-white">
                  Riwayat Tiket Laporan
                </h3>

                <span className="text-[10px] text-slate-500">
                  {tickets.length} tiket
                </span>
              </div>

              <div className="space-y-3 max-h-[520px] overflow-y-auto pr-1">
                {tickets
                  .filter((ticket) => ticket.unit === activeUnit)
                  .map((ticket) => (
                    <div
                      key={ticket.id}
                      className="bg-slate-900 p-4 rounded-2xl border border-slate-700 space-y-3"
                    >
                      <div className="flex items-center gap-4">
                        <img
                          src={ticket.image}
                          alt="Ticket Proof"
                          className="w-14 h-14 rounded-xl object-cover border border-slate-700"
                        />

                        <div className="flex-grow min-w-0">
                          <p className="font-bold text-white text-xs truncate">
                            {ticket.category}
                          </p>

                          <p className="text-[10px] text-slate-400">
                            {ticket.id} • {ticket.date}
                          </p>

                          <p className="text-[10px] text-slate-500 mt-1 line-clamp-2">
                            {ticket.description}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {(['Pending', 'In Progress', 'Resolved'] as TicketStatus[]).map(
                          (status) => (
                            <button
                              key={status}
                              onClick={() =>
                                updateTicketStatus(ticket.id, status)
                              }
                              className={`px-2.5 py-1 rounded-lg text-[9px] font-bold ${
                                ticket.status === status
                                  ? 'bg-blue-600 text-white'
                                  : 'bg-slate-800 text-slate-400 hover:text-white'
                              }`}
                            >
                              {status}
                            </button>
                          ),
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}

        {/* =====================================================
            TAB 4: BILLING
        ====================================================== */}
        {activeTab === 'billing' && (
          <div className="bg-slate-800 p-6 rounded-3xl shadow-xl border border-slate-700 space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h2 className="text-xl font-black text-white">
                  Tagihan & Iuran Pengelolaan (IPL)
                </h2>

                <p className="text-xs text-slate-400">
                  Rincian penggunaan utilitas unit #{activeUnit}
                </p>
              </div>

              {!utilityPaid && (
                <button
                  onClick={() => { setPaymentMethod('qris'); setShowBillModal(true); }}
                  className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-6 py-3 rounded-xl shadow-lg transition"
                >
                  Bayar Tagihan via QRIS / VA
                </button>
              )}

              {utilityPaid && (
                <span className="bg-emerald-500/20 text-emerald-400 px-4 py-2 rounded-xl text-xs font-bold">
                  ✓ Tagihan Utilitas Lunas
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-slate-900 border border-slate-700 p-5 rounded-2xl space-y-2">
                <p className="text-xs font-bold text-blue-400">
                  Iuran IPL Bulanan
                </p>
                <p className="text-2xl font-black text-white">Rp 450.000</p>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-400 font-bold px-2 py-0.5 rounded inline-block">
                  LUNAS
                </span>
              </div>

              <div className="bg-slate-900 border border-slate-700 p-5 rounded-2xl space-y-2">
                <p className="text-xs font-bold text-amber-400">
                  Pemakaian Air & Listrik
                </p>
                <p className="text-2xl font-black text-white">Rp 320.000</p>

                {utilityPaid ? (
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-400 font-bold px-2 py-0.5 rounded inline-block">
                    LUNAS
                  </span>
                ) : (
                  <span className="text-[10px] bg-amber-500/20 text-amber-400 font-bold px-2 py-0.5 rounded inline-block">
                    JATUH TEMPO
                  </span>
                )}
              </div>

              <div className="bg-slate-900 border border-slate-700 p-5 rounded-2xl space-y-2">
                <p className="text-xs font-bold text-purple-400">
                  Deposit Garansi
                </p>
                <p className="text-2xl font-black text-white">Rp 1.000.000</p>
                <span className="text-[10px] bg-purple-500/20 text-purple-400 font-bold px-2 py-0.5 rounded inline-block">
                  TERSIMPAN
                </span>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-700 rounded-2xl p-5">
              <div className="flex justify-between items-center mb-3">
                <p className="text-xs font-bold text-slate-300">
                  Ringkasan Pembayaran
                </p>
                <p className="text-xs text-slate-500">
                  Unit #{activeUnit}
                </p>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>IPL</span>
                  <span>Rp 450.000</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Air & Listrik</span>
                  <span>Rp 320.000</span>
                </div>
                <div className="border-t border-slate-700 pt-2 flex justify-between text-white font-black">
                  <span>Total</span>
                  <span>Rp 770.000</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* =======================================================
          BOOKING MODAL
      ======================================================== */}
      {bookingModalUnit && (
        <div
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 z-50"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeBookingModal();
          }}
        >
          <div className="bg-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-700 space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-slate-700">
              <div>
                <h3 className="text-lg font-black text-white">
                  Sewa Unit #{bookingModalUnit}
                </h3>
                <p className="text-[10px] text-slate-400 mt-1">
                  Pilih durasi dan metode pembayaran.
                </p>
              </div>

              <button
                onClick={closeBookingModal}
                disabled={isProcessingPayment}
                className="text-slate-400 hover:text-white font-bold text-sm disabled:opacity-40"
              >
                ✕
              </button>
            </div>

            <div className="rounded-2xl overflow-hidden h-40 border border-slate-700">
              <img
                src={UNIT_IMAGES[0]}
                alt="Preview unit"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-300 block mb-1">
                  Durasi Sewa (Hari)
                </label>

                <input
                  type="number"
                  min="1"
                  max="365"
                  value={duration}
                  onChange={(event) =>
                    setDuration(
                      Math.max(
                        1,
                        Math.min(365, Number(event.target.value) || 1),
                      ),
                    )
                  }
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 font-bold text-white"
                />
              </div>

              <div>
                <label className="font-bold text-slate-300 block mb-2">
                  Metode Pembayaran
                </label>

                <div className="grid grid-cols-3 gap-2">
                  {(['qris', 'bca', 'mandiri'] as PaymentMethod[]).map((method) => (
                    <button key={method} type="button" onClick={() => setPaymentMethod(method)} aria-pressed={paymentMethod === method} className={`rounded-xl border p-3 text-left text-[10px] transition ${paymentMethod === method ? 'border-blue-500 bg-blue-500/10 text-blue-300' : 'border-slate-700 bg-slate-900 text-slate-400'}`}>
                      <span className="block font-black">{method === 'qris' ? 'QRIS' : method === 'bca' ? 'BCA' : 'Mandiri'}</span><span>{method === 'qris' ? 'Scan QR' : 'Virtual Account'}</span>
                    </button>
                  ))}
                </div>
                <div className="rounded-xl border border-slate-700 bg-slate-900 p-3 text-center">
                  {paymentMethod === 'qris' ? <><p className="mb-2 text-[10px] text-slate-400">Scan QR sewa unit (simulasi)</p><div className="mx-auto w-fit rounded-lg bg-white p-2"><QRCodeSVG value={`https://pay.skyresidence.id/rent?unit=${bookingModalUnit}&amount=${totalBooking}`} size={110} /></div></> : <><p className="text-[10px] text-slate-400">Nomor Virtual Account {paymentMethod === 'bca' ? 'BCA' : 'Mandiri'} (simulasi)</p><p className="mt-1 font-mono text-lg font-black tracking-wider text-white">{virtualAccountNumber(paymentMethod, bookingModalUnit ?? activeUnit)}</p></>}
                </div>
              </div>

              <div className="bg-slate-900 p-4 rounded-2xl space-y-2 border border-slate-700">
                <div className="flex justify-between text-slate-400">
                  <span>Harga per malam:</span>
                  <span>{formatRupiah(bookingPrice)}</span>
                </div>

                <div className="flex justify-between text-slate-400">
                  <span>Durasi:</span>
                  <span>{duration} hari</span>
                </div>

                <div className="flex justify-between font-extrabold text-white text-sm pt-2 border-t border-slate-700">
                  <span>Total Pembayaran:</span>
                  <span className="text-blue-400">
                    {formatRupiah(totalBooking)}
                  </span>
                </div>
              </div>

              <button
                onClick={handleProcessPayment}
                disabled={isProcessingPayment}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3.5 rounded-2xl shadow-lg text-xs transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessingPayment
                  ? 'Memproses Pembayaran...'
                  : `Bayar via ${paymentMethodLabel}`}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =======================================================
          BILL MODAL
      ======================================================== */}
      {activeFacilityModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4" onMouseDown={(event) => { if (event.target === event.currentTarget) setActiveFacilityModal(null); }}>
          <form onSubmit={(event) => { event.preventDefault(); handleBookFacility(); }} className="w-full max-w-md space-y-5 rounded-3xl border border-slate-700 bg-slate-900 p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3"><h3 className="text-sm font-black uppercase tracking-wide text-white">Konfirmasi Reservasi</h3><button type="button" aria-label="Tutup" onClick={() => setActiveFacilityModal(null)} className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-800 text-slate-300 hover:text-white">&times;</button></div>
            <div><p className="text-[10px] font-bold text-blue-400">Fasilitas dipilih</p><p className="mt-1 text-sm font-black text-white">{activeFacilityModal}</p></div>
            <label className="block text-xs font-bold text-slate-300">Tanggal kunjungan<input type="date" required min={localDateInputValue()} value={facilityBookingDate} onChange={(event) => setFacilityBookingDate(event.target.value)} className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-950 p-3 text-white" /></label>
            <label className="block text-xs font-bold text-slate-300">Slot waktu<select value={facilityBookingTime} onChange={(event) => setFacilityBookingTime(event.target.value)} className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-950 p-3 text-white"><option>06:00 - 08:00 WIB</option><option>08:00 - 10:00 WIB</option><option>14:00 - 16:00 WIB</option><option>18:00 - 20:00 WIB</option></select></label>
            <div className="grid grid-cols-2 gap-2 pt-2"><button type="button" onClick={() => setActiveFacilityModal(null)} className="rounded-xl border border-slate-700 bg-slate-800 py-3 text-xs font-bold text-white">Batal</button><button type="submit" className="rounded-xl bg-blue-600 py-3 text-xs font-bold text-white hover:bg-blue-500">Simpan Reservasi</button></div>
          </form>
        </div>
      )}

      {selectedBookingQR && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4" onMouseDown={(event) => { if (event.target === event.currentTarget) setSelectedBookingQR(null); }}>
          <div role="dialog" aria-modal="true" aria-labelledby="facility-qr-title" className="w-full max-w-sm space-y-4 rounded-3xl border border-slate-700 bg-slate-900 p-6 text-center shadow-2xl">
            <div className="flex justify-end"><button aria-label="Tutup" onClick={() => setSelectedBookingQR(null)} className="text-slate-400 hover:text-white">&times;</button></div>
            <h3 id="facility-qr-title" className="text-sm font-black text-white">QR Tiket Masuk Fasilitas</h3><p className="text-xs text-slate-300">{selectedBookingQR.facility}</p>
            <div className="mx-auto flex w-fit rounded-2xl bg-white p-4"><QRCodeSVG value={JSON.stringify({ id: selectedBookingQR.id, facility: selectedBookingQR.facility, date: selectedBookingQR.date, time: selectedBookingQR.time || '' })} size={190} level="M" /></div>
            <p className="text-[10px] text-slate-400">{selectedBookingQR.id} &middot; {selectedBookingQR.date} &middot; {selectedBookingQR.time || 'Waktu belum ditentukan'}</p><p className="text-[10px] text-slate-500">Tunjukkan QR ini kepada petugas saat memasuki fasilitas.</p>
            <p className="text-[9px] text-amber-300">Konfirmasi di bawah mensimulasikan petugas memvalidasi QR.</p>
            <button onClick={() => handleFacilityCheckIn(selectedBookingQR.id)} className="w-full rounded-xl bg-emerald-600 py-3 text-xs font-black text-white transition hover:bg-emerald-500">Konfirmasi Masuk</button>
          </div>
        </div>
      )}

      {paymentReceipt && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-md">
          <div role="dialog" aria-modal="true" aria-labelledby="payment-receipt-title" className="w-full max-w-md rounded-3xl border border-slate-700 bg-slate-900 p-6 shadow-2xl">
            <div className="mb-5 text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/15 text-2xl text-emerald-400">&#10003;</div>
              <h2 id="payment-receipt-title" className="text-lg font-black text-white">Pembayaran Berhasil</h2>
              <p className="mt-1 text-xs text-slate-400">Struk pembayaran Anda</p>
            </div>
            <div className="space-y-3 rounded-2xl border border-slate-700 bg-slate-950 p-4 text-xs">
              <div className="flex justify-between gap-3"><span className="text-slate-400">No. Transaksi</span><span className="font-mono font-bold text-white">{paymentReceipt.id}</span></div>
              <div className="flex justify-between gap-3"><span className="text-slate-400">Unit</span><span className="font-bold text-white">{paymentReceipt.unit}</span></div>
              <div className="flex justify-between gap-3"><span className="text-slate-400">Pembayaran</span><span className="text-right font-bold text-white">{paymentReceipt.description}</span></div>
              <div className="flex justify-between gap-3"><span className="text-slate-400">Metode</span><span className="text-right font-bold text-white">{paymentReceipt.method}</span></div>
              <div className="flex justify-between gap-3"><span className="text-slate-400">Waktu</span><span className="text-right text-white">{paymentReceipt.paidAt}</span></div>
              <div className="flex justify-between border-t border-slate-700 pt-3 text-sm"><span className="font-black text-white">Total dibayar</span><span className="font-black text-emerald-400">{formatRupiah(paymentReceipt.amount)}</span></div>
            </div>
            <p className="mt-3 text-center text-[10px] text-slate-500">Pembayaran ini tercatat sebagai transaksi simulasi aplikasi.</p>
            <div className="mt-5 grid grid-cols-2 gap-2">
              <button type="button" onClick={() => downloadPaymentReceiptPdf(paymentReceipt)} className="rounded-xl bg-emerald-600 py-3 text-xs font-black text-white transition hover:bg-emerald-500">⬇ Unduh PDF</button>
              <button type="button" onClick={() => setPaymentReceipt(null)} className="rounded-xl bg-blue-600 py-3 text-xs font-black text-white transition hover:bg-blue-500">Selesai</button>
            </div>
          </div>
        </div>
      )}

      {showBillModal && (
        <div
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 z-50"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setShowBillModal(false);
            }
          }}
        >
          <div className="bg-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-700 space-y-4 text-center">
            <div className="flex justify-between items-center pb-3 border-b border-slate-700 text-left">
              <div>
                <h3 className="text-lg font-black text-white">
                  Pembayaran Tagihan
                </h3>
                <p className="text-[10px] text-slate-500 mt-1">
                  Unit #{activeUnit} • Total Rp 320.000
                </p>
              </div>

              <button
                onClick={() => setShowBillModal(false)}
                className="text-slate-400 hover:text-white font-bold"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {(['qris', 'bca', 'mandiri'] as PaymentMethod[]).map((method) => (
                <button key={method} type="button" onClick={() => setPaymentMethod(method)} aria-pressed={paymentMethod === method} className={`rounded-xl border p-2 text-[10px] font-bold transition ${paymentMethod === method ? 'border-blue-500 bg-blue-500/10 text-blue-300' : 'border-slate-700 bg-slate-900 text-slate-400'}`}>{method === 'qris' ? 'QRIS' : method === 'bca' ? 'BCA VA' : 'Mandiri VA'}</button>
              ))}
            </div>
            {paymentMethod === 'qris' ? (
              <div className="bg-white p-4 rounded-2xl inline-block shadow-lg mx-auto"><QRCodeSVG value={`https://pay.skyresidence.id/bill?unit=${activeUnit}&amount=320000&method=qris`} size={180} /></div>
            ) : (
              <div className="bg-slate-900 border border-slate-700 rounded-2xl p-4">
                <p className="text-[10px] text-slate-400">Virtual Account {paymentMethod === 'bca' ? 'BCA' : 'Mandiri'} (simulasi)</p>
                <p className="mt-2 font-mono text-xl font-black tracking-wider text-white">{virtualAccountNumber(paymentMethod, activeUnit)}</p>
              </div>
            )}

            
            <div className="bg-slate-900 rounded-2xl p-3">
              <p className="text-[10px] text-slate-500">Kode Tagihan</p>
              <p className="text-xs font-black text-white mt-1">
                BILL-SR-{activeUnit}-2026
              </p>
            </div>

            <p className="text-slate-300 text-xs">
              Scan menggunakan m-banking atau e-wallet untuk melunasi tagihan.
            </p>

            <button
              onClick={handleConfirmUtilityPayment}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-2xl text-xs transition"
            >
              Konfirmasi Pembayaran Selesai
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
