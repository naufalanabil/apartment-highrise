'use client';

import React, { useMemo, useState } from 'react';

interface StatsSummary {
  totalUnits: number;
  availableUnits: number;
  occupiedUnits: number;
  totalRevenue: number;
  totalExpense: number;
  activePasses: number;
}

type RoomStatus = 'Tersedia' | 'Terisi';

interface Room {
  id: string;
  floor: number;
  name: string;
  price: string;
  status: RoomStatus;
  image: string;
  facilities: string[];
}

type TicketStatus = 'Pending' | 'In Progress' | 'Resolved';
type TicketCategory = 'Plumbing / AC' | 'Electrical' | 'Security System' | 'Civil / Struktur';

interface Ticket {
  id: string;
  unit: string;
  issue: string;
  category: TicketCategory;
  status: TicketStatus;
  technician: string;
  date: string;
}

interface Tenant {
  unit: string;
  name: string;
  type: 'Pemilik' | 'Penyewa';
  phone: string;
  vehicle: string;
}

interface Visitor {
  id: string;
  guestName: string;
  targetUnit: string;
  checkInTime: string;
  status: 'Di Dalam' | 'Keluar';
}

interface Bill {
  invoiceId: string;
  unit: string;
  tenantName: string;
  serviceCharge: number;
  sinkingFund: number;
  utilities: number;
  status: 'Lunas' | 'Belum Lunas';
}

type AnnouncementCategory = 'Darurat' | 'Maintenance' | 'Informasi';

interface Announcement {
  id: string;
  title: string;
  category: AnnouncementCategory;
  date: string;
  content: string;
}

type TransactionType = 'Pemasukan' | 'Pengeluaran';

interface FinanceTransaction {
  id: string;
  date: string;
  type: TransactionType;
  category: string;
  description: string;
  amount: number;
}

interface ParkingZone {
  zone: string;
  totalSlots: number;
  occupiedSlots: number;
}

type ReservationStatus = 'Pending' | 'Approved' | 'Rejected';

interface FacilityReservation {
  id: string;
  facilityName: string;
  bookerName: string;
  unit: string;
  date: string;
  status: ReservationStatus;
}

export type UserRole = 'Super Admin' | 'Finance' | 'Maintenance' | 'Security';

type TabId =
  | 'overview'
  | 'units'
  | 'tickets'
  | 'iot'
  | 'billing'
  | 'tenants'
  | 'broadcast'
  | 'finance'
  | 'parking'
  | 'reservation';

const TICKET_STATUS_FLOW: TicketStatus[] = ['Pending', 'In Progress', 'Resolved'];
const TECHNICIAN_POOL = ['Budi Santoso', 'Ahmad Tekno', 'Rina Wijaya', 'Dedi Kurniawan'];

const ALL_TABS: { id: TabId; label: string }[] = [
  { id: 'overview', label: '📊 Overview & Fasilitas' },
  { id: 'units', label: '🏢 Unit & Katalog (50 Lt)' },
  { id: 'tickets', label: '🛠️ Tiket Maintenance' },
  { id: 'iot', label: '⚡ IoT & Sensor Gedung' },
  { id: 'billing', label: '💰 Tagihan & e-Invoice' },
  { id: 'tenants', label: '👥 Penghuni & Tamu' },
  { id: 'broadcast', label: '📢 Pengumuman Broadcast' },
  { id: 'finance', label: '📈 Keuangan & Kas' },
  { id: 'parking', label: '🚗 Kontrol Parkir & Akses' },
  { id: 'reservation', label: '📅 Reservasi Fasilitas' },
];

const ROLE_TABS: Record<UserRole, TabId[]> = {
  'Super Admin': ALL_TABS.map((t) => t.id),
  Finance: ['overview', 'billing', 'finance'],
  Maintenance: ['overview', 'units', 'tickets', 'iot'],
  Security: ['overview', 'tenants', 'parking'],
};

export default function UltimateEnterpriseBMS() {
  const [activeTab, setActiveTab] = useState<TabId>('overview');
  const [currentUserRole, setCurrentUserRole] = useState<UserRole>('Super Admin');

  const [stats] = useState<StatsSummary>({
    totalUnits: 1500,
    availableUnits: 1200,
    occupiedUnits: 300,
    totalRevenue: 450000000,
    totalExpense: 125000000,
    activePasses: 285,
  });

  const [selectedFloor, setSelectedFloor] = useState<number>(1);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [roomFilter, setRoomFilter] = useState<'Semua' | RoomStatus>('Semua');

  const [tickets, setTickets] = useState<Ticket[]>([
    { id: 'TCK-001', unit: 'Unit 312', issue: 'AC Utama Bocor & Netes Air', category: 'Plumbing / AC', status: 'In Progress', technician: 'Budi Santoso', date: '2026-09-22' },
    { id: 'TCK-002', unit: 'Unit 1505', issue: 'Lampu Koridor Depan Redup', category: 'Electrical', status: 'Pending', technician: 'Belum Ditugaskan', date: '2026-09-23' },
    { id: 'TCK-003', unit: 'Unit 5001', issue: 'Smart Door Lock Low Battery Warning', category: 'Security System', status: 'Resolved', technician: 'Ahmad Tekno', date: '2026-09-20' },
  ]);
  const [newTicketUnit, setNewTicketUnit] = useState('Unit 101');
  const [newTicketIssue, setNewTicketIssue] = useState('');
  const [newTicketCat, setNewTicketCat] = useState<TicketCategory>('Electrical');

  const [bills, setBills] = useState<Bill[]>([
    { invoiceId: 'INV-2026-0901', unit: 'Unit 312', tenantName: 'Naufal Ardra', serviceCharge: 750000, sinkingFund: 250000, utilities: 420000, status: 'Lunas' },
    { invoiceId: 'INV-2026-0902', unit: 'Unit 5001', tenantName: 'Reza Pratama', serviceCharge: 2500000, sinkingFund: 750000, utilities: 1450000, status: 'Belum Lunas' },
    { invoiceId: 'INV-2026-0903', unit: 'Unit 1505', tenantName: 'Siti Aminah', serviceCharge: 1200000, sinkingFund: 400000, utilities: 680000, status: 'Lunas' },
  ]);

  const [tenants] = useState<Tenant[]>([
    { unit: 'Unit 312', name: 'Naufal Ardra', type: 'Penyewa', phone: '081234567890', vehicle: 'B 1234 XYZ (Mobil)' },
    { unit: 'Unit 5001', name: 'Reza Pratama', type: 'Pemilik', phone: '089876543210', vehicle: 'D 9999 ABC (Mobil)' },
    { unit: 'Unit 1505', name: 'Siti Aminah', type: 'Penyewa', phone: '081122334455', vehicle: 'F 5678 DEF (Motor)' },
  ]);

  const [visitors, setVisitors] = useState<Visitor[]>([
    { id: 'VST-881', guestName: 'Joko Anwar (Kurir Paket)', targetUnit: 'Unit 312', checkInTime: '14:20 WIB', status: 'Di Dalam' },
    { id: 'VST-882', guestName: 'Dr. Hendra (Tamu Keluarga)', targetUnit: 'Unit 5001', checkInTime: '13:05 WIB', status: 'Di Dalam' },
  ]);

  const [announcements, setAnnouncements] = useState<Announcement[]>([
    { id: 'ANC-01', title: 'Maintenance Berkala Lift Utama Zona 3', category: 'Maintenance', date: '25 Sep 2026', content: 'Lift nomor 11-20 akan menjalani uji kelayakan dan pelumasan kabel baja pada pukul 01:00 - 04:00 WIB.' },
    { id: 'ANC-02', title: 'Pemadaman Terjadwal Trafo Gedung', category: 'Darurat', date: '28 Sep 2026', content: 'Perawatan panel utama PLN gedung. Genset otomatis akan aktif, namun mohon matikan perangkat elektronik sensitif sementara.' },
  ]);
  const [newAnnTitle, setNewAnnTitle] = useState('');
  const [newAnnContent, setNewAnnContent] = useState('');
  const [newAnnCat, setNewAnnCat] = useState<AnnouncementCategory>('Informasi');

  const [financeTransactions, setFinanceTransactions] = useState<FinanceTransaction[]>([
    { id: 'TRX-101', date: '2026-09-22', type: 'Pemasukan', category: 'Service Charge Bulanan', description: 'Pembayaran batch September tower A', amount: 350000000 },
    { id: 'TRX-102', date: '2026-09-21', type: 'Pengeluaran', category: 'Perawatan Lift', description: 'Penggantian sparepart kabel lift utama zona 2', amount: 45000000 },
    { id: 'TRX-103', date: '2026-09-20', type: 'Pengeluaran', category: 'Gaji Staff & Teknisi', description: 'Pembayaran honor bulanan tim teknik & kebersihan', amount: 80000000 },
  ]);
  const [txDesc, setTxDesc] = useState('');
  const [txAmount, setTxAmount] = useState('');
  const [txType, setTxType] = useState<TransactionType>('Pengeluaran');
  const [txCategory, setTxCategory] = useState('Operasional Umum');

  const [parkingZones] = useState<ParkingZone[]>([
    { zone: 'Basement 1 (VIP & Owner)', totalSlots: 150, occupiedSlots: 132 },
    { zone: 'Basement 2 (Tenant Regular)', totalSlots: 400, occupiedSlots: 365 },
    { zone: 'Basement 3 (Visitor / Tamu)', totalSlots: 250, occupiedSlots: 145 },
  ]);

  const [reservations, setReservations] = useState<FacilityReservation[]>([
    { id: 'RES-01', facilityName: 'Grand Function Hall (Lt. 1)', bookerName: 'Naufal Ardra', unit: 'Unit 312', date: '2026-09-28', status: 'Approved' },
    { id: 'RES-02', facilityName: 'Rooftop BBQ Area', bookerName: 'Reza Pratama', unit: 'Unit 5001', date: '2026-09-30', status: 'Pending' },
  ]);

  const facilities = [
    { name: 'Infinity Rooftop Pool', image: 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&q=80&w=800', desc: 'Kolam renang infinity di lantai teratas dengan pemandangan cakrawala kota.' },
    { name: 'Executive Fitness & Gym', image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=800', desc: 'Peralatan fitness modern lengkap dengan instruktur profesional.' },
    { name: 'Sky Garden & Lounge', image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800', desc: 'Area hijau terbuka untuk bersantai dan menikmati sore hari.' },
    { name: 'Sauna & Spa Center', image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=800', desc: 'Fasilitas relaksasi eksklusif untuk memanjakan diri setelah lelah beraktivitas.' },
  ];

  const generateRooms = (floor: number): Room[] => {
    const roomTypes = [
      { name: 'Studio Deluxe', price: 'Rp 4.5 Juta / bln', img: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=600' },
      { name: '1 Bedroom Suite', price: 'Rp 6.8 Juta / bln', img: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&q=80&w=600' },
      { name: '2 Bedroom Executive', price: 'Rp 10.5 Juta / bln', img: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=600' },
      { name: 'Penthouse Royal', price: 'Rp 25.0 Juta / bln', img: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=600' },
    ];

    const roomsList: Room[] = [];
    for (let i = 1; i <= 30; i++) {
      const roomNumber = `${floor}${i < 10 ? '0' + i : i}`;
      const typeIndex = i % roomTypes.length;
      const selectedType = roomTypes[typeIndex];
      const status: RoomStatus = i % 3 === 0 ? 'Terisi' : 'Tersedia';

      roomsList.push({
        id: roomNumber,
        floor,
        name: selectedType.name,
        price: selectedType.price,
        status,
        image: selectedType.img,
        facilities: ['AC Central', 'Smart TV', 'Water Heater', 'Kitchen Set', 'Wi-Fi High Speed'],
      });
    }
    return roomsList;
  };

  const currentRooms = useMemo(() => generateRooms(selectedFloor), [selectedFloor]);

  const filteredRooms = useMemo(() => {
    if (roomFilter === 'Semua') return currentRooms;
    return currentRooms.filter((r) => r.status === roomFilter);
  }, [currentRooms, roomFilter]);

  const floorOccupancy = useMemo(() => {
    const terisi = currentRooms.filter((r) => r.status === 'Terisi').length;
    return { terisi, tersedia: currentRooms.length - terisi };
  }, [currentRooms]);

  const allowedTabs = useMemo(() => ROLE_TABS[currentUserRole], [currentUserRole]);

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTicketIssue.trim()) {
      alert('Mohon deskripsikan masalah kerusakan.');
      return;
    }
    const newT: Ticket = {
      id: `TCK-${String(tickets.length + 1).padStart(3, '0')}`,
      unit: newTicketUnit,
      issue: newTicketIssue.trim(),
      category: newTicketCat,
      status: 'Pending',
      technician: 'Menunggu Alokasi',
      date: new Date().toISOString().split('T')[0],
    };
    setTickets([newT, ...tickets]);
    setNewTicketIssue('');
    alert('Tiket berhasil dibuat dan diteruskan ke tim teknisi gedung!');
  };

  const handleAdvanceTicket = (id: string) => {
    setTickets((prev) =>
      prev.map((t) => {
        if (t.id !== id) return t;
        const currentIndex = TICKET_STATUS_FLOW.indexOf(t.status);
        if (currentIndex === TICKET_STATUS_FLOW.length - 1) return t;
        const nextStatus = TICKET_STATUS_FLOW[currentIndex + 1];
        const nextTechnician =
          nextStatus === 'In Progress' && t.technician === 'Menunggu Alokasi'
            ? TECHNICIAN_POOL[Math.floor(Math.random() * TECHNICIAN_POOL.length)]
            : t.technician;
        return { ...t, status: nextStatus, technician: nextTechnician };
      })
    );
  };

  const handleMarkPaid = (invoiceId: string) => {
    setBills((prev) =>
      prev.map((b) => (b.invoiceId === invoiceId ? { ...b, status: 'Lunas' as const } : b))
    );
  };

  const handleCheckoutVisitor = (id: string) => {
    setVisitors((prev) =>
      prev.map((v) => (v.id === id ? { ...v, status: 'Keluar' as const } : v))
    );
  };

  const handleDeleteAnnouncement = (id: string) => {
    setAnnouncements((prev) => prev.filter((a) => a.id !== id));
  };

  const handlePostAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAnnTitle.trim() || !newAnnContent.trim()) {
      alert('Judul dan isi pengumuman wajib diisi.');
      return;
    }
    const newA: Announcement = {
      id: `ANC-${String(announcements.length + 1).padStart(2, '0')}`,
      title: newAnnTitle.trim(),
      category: newAnnCat,
      date: 'Hari Ini',
      content: newAnnContent.trim(),
    };
    setAnnouncements([newA, ...announcements]);
    setNewAnnTitle('');
    setNewAnnContent('');
    alert('Broadcast pengumuman berhasil dikirim ke aplikasi seluruh penghuni gedung!');
  };

  const handleAddTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = Number(txAmount);
    if (!txDesc.trim() || !txAmount || Number.isNaN(amountNum) || amountNum <= 0) {
      alert('Deskripsi dan nominal yang valid wajib diisi.');
      return;
    }
    const newTx: FinanceTransaction = {
      id: `TRX-${String(financeTransactions.length + 101).padStart(3, '0')}`,
      date: new Date().toISOString().split('T')[0],
      type: txType,
      category: txCategory.trim() || 'Operasional Umum',
      description: txDesc.trim(),
      amount: amountNum,
    };
    setFinanceTransactions([newTx, ...financeTransactions]);
    setTxDesc('');
    setTxAmount('');
    alert('Transaksi kas berhasil dicatat!');
  };

  const handleUpdateReservation = (id: string, status: ReservationStatus) => {
    setReservations((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-4 md:p-8 space-y-8">
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.25s ease-out; }
      `}</style>

      <div className="max-w-7xl mx-auto space-y-8">
        {/* HEADER BMS PROFESSIONAL & SIMULATOR RBAC */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-800 pb-6">
          <div>
            <span className="text-xs font-black text-blue-400 uppercase tracking-widest">
              Grand Horizon Enterprise BMS (v5.1 Ultimate RBAC)
            </span>
            <h1 className="text-3xl font-black text-white mt-1">Smart Building Management System</h1>
            <p className="text-xs text-slate-400">Multi-Role Access, 50 Lantai, IoT, Keuangan, Parkir, & Reservasi Fasilitas</p>
          </div>

          <div className="flex items-center gap-3 bg-slate-800 p-2.5 rounded-2xl border border-slate-700">
            <span className="text-xs font-bold text-slate-400 pl-2">Simulasi Hak Akses (Role):</span>
            <select
              value={currentUserRole}
              onChange={(e) => {
                const newRole = e.target.value as UserRole;
                setCurrentUserRole(newRole);
                setActiveTab('overview');
              }}
              className="bg-slate-900 border border-slate-700 text-xs font-bold text-blue-400 rounded-xl px-3 py-1.5 focus:outline-none"
            >
              <option value="Super Admin">Super Admin (Full Access)</option>
              <option value="Finance">Finance (Keuangan & Billing)</option>
              <option value="Maintenance">Maintenance (Unit & IoT)</option>
              <option value="Security">Security (Penghuni & Parkir)</option>
            </select>
          </div>
        </div>

        {/* NAVIGATION TABS */}
        <div className="flex overflow-x-auto gap-2 bg-slate-800/60 p-2 rounded-2xl border border-slate-700/80">
          {ALL_TABS.filter((tab) => allowedTabs.includes(tab.id)).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'text-slate-400 hover:bg-slate-700/50 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* TAB 1: OVERVIEW & FASILITAS */}
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-fadeIn">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-slate-800/80 p-6 rounded-3xl border border-slate-700 shadow-sm">
                <span className="text-xs font-bold text-slate-400">Total Unit Gedung</span>
                <p className="text-3xl font-black text-white mt-2">{stats.totalUnits} <span className="text-xs font-normal text-slate-400">Unit</span></p>
                <p className="text-[10px] text-slate-400 mt-2">50 Lantai × 30 Kamar/Lantai</p>
              </div>

              <div className="bg-slate-800/80 p-6 rounded-3xl border border-slate-700 shadow-sm">
                <span className="text-xs font-bold text-emerald-400">Tingkat Okupansi (Occupancy)</span>
                <p className="text-3xl font-black text-emerald-400 mt-2">
                  {Math.round((stats.occupiedUnits / stats.totalUnits) * 100)}%
                </p>
                <p className="text-[10px] text-slate-400 mt-2">{stats.occupiedUnits} Terisi / {stats.availableUnits} Kosong</p>
              </div>

              <div className="bg-slate-800/80 p-6 rounded-3xl border border-slate-700 shadow-sm">
                <span className="text-xs font-bold text-blue-400">Arus Kas Bersih (Net Income)</span>
                <p className="text-3xl font-black text-blue-400 mt-2">
                  Rp {((stats.totalRevenue - stats.totalExpense) / 1000000).toFixed(0)}M
                </p>
                <p className="text-[10px] text-slate-400 mt-2">Pendapatan dikurangi pengeluaran operasional</p>
              </div>

              <div className="bg-slate-800/80 p-6 rounded-3xl border border-slate-700 shadow-sm">
                <span className="text-xs font-bold text-amber-400">Smart Access Pass Aktif</span>
                <p className="text-3xl font-black text-amber-400 mt-2">{stats.activePasses}</p>
                <p className="text-[10px] text-slate-400 mt-2">Digital Pass QR/PIN Terdaftar</p>
              </div>
            </div>

            <section className="space-y-4">
              <h2 className="text-xl font-black text-white">Fasilitas & Layanan Eksklusif Gedung</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {facilities.map((fac, idx) => (
                  <div key={idx} className="group overflow-hidden rounded-2xl bg-slate-800 border border-slate-700 shadow-lg">
                    <div className="overflow-hidden h-44">
                      <img src={fac.image} alt={fac.name} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                    </div>
                    <div className="p-4 space-y-1">
                      <h3 className="font-bold text-white text-sm">{fac.name}</h3>
                      <p className="text-[11px] text-slate-400 leading-relaxed">{fac.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {/* TAB 2: UNITS & KATALOG 50 LANTAI */}
        {activeTab === 'units' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-slate-800/80 p-6 rounded-3xl border border-slate-700">
              <div>
                <h2 className="text-xl font-black text-white">Katalog Unit 50 Lantai (1.500 Kamar)</h2>
                <p className="text-xs text-slate-400">Pilih lantai untuk melihat visual dan status dari 30 kamar di lantai tersebut.</p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <label className="text-xs font-bold text-slate-300">Pilih Lantai:</label>
                <select
                  value={selectedFloor}
                  onChange={(e) => setSelectedFloor(Number(e.target.value))}
                  className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-2.5 text-xs font-bold text-blue-400 focus:outline-none"
                >
                  {Array.from({ length: 50 }, (_, i) => (
                    <option key={i + 1} value={i + 1}>
                      Lantai {i + 1} ({i + 1}01 - {i + 1}30)
                    </option>
                  ))}
                </select>

                <label className="text-xs font-bold text-slate-300">Status:</label>
                <select
                  value={roomFilter}
                  onChange={(e) => setRoomFilter(e.target.value as 'Semua' | RoomStatus)}
                  className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-2.5 text-xs font-bold text-blue-400 focus:outline-none"
                >
                  <option value="Semua">Semua</option>
                  <option value="Tersedia">Tersedia</option>
                  <option value="Terisi">Terisi</option>
                </select>
              </div>
            </div>

            <div className="rounded-2xl bg-gradient-to-r from-blue-700 to-indigo-800 p-6 text-white shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border border-blue-600/30">
              <div>
                <span className="bg-white/20 text-[10px] px-3 py-1 rounded-full font-semibold uppercase tracking-wider">Grand Horizon - Active View</span>
                <h3 className="text-xl font-black mt-2">Menampilkan Lantai {selectedFloor}</h3>
                <p className="text-blue-100 text-xs mt-1">
                  {floorOccupancy.tersedia} Tersedia · {floorOccupancy.terisi} Terisi dari 30 unit di lantai ini.
                </p>
              </div>
              <div className="text-right">
                <span className="text-3xl font-black">{filteredRooms.length}</span>
                <p className="text-[10px] text-blue-200 uppercase tracking-widest">Unit Ditampilkan</p>
              </div>
            </div>

            {filteredRooms.length === 0 ? (
              <div className="text-center text-xs text-slate-400 py-10 bg-slate-800/50 rounded-2xl border border-slate-700">
                Tidak ada unit dengan status "{roomFilter}" di lantai ini.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {filteredRooms.map((room) => (
                  <div key={room.id} className="bg-slate-800 rounded-2xl overflow-hidden border border-slate-700 flex flex-col justify-between shadow-md">
                    <div className="relative h-36">
                      <img src={room.image} alt={room.name} className="w-full h-full object-cover" />
                      <span className={`absolute top-2 right-2 rounded-full px-2 py-0.5 text-[10px] font-bold text-white shadow ${room.status === 'Tersedia' ? 'bg-emerald-500' : 'bg-rose-500'}`}>
                        {room.status}
                      </span>
                      <span className="absolute bottom-2 left-2 rounded bg-slate-950/80 px-2 py-0.5 text-[10px] font-bold text-white">
                        Unit #{room.id}
                      </span>
                    </div>
                    <div className="p-3.5 flex flex-col flex-grow justify-between space-y-2">
                      <div>
                        <h4 className="font-bold text-white text-xs">{room.name}</h4>
                        <p className="text-[11px] text-blue-400 font-bold mt-0.5">{room.price}</p>
                      </div>
                      <button
                        onClick={() => setSelectedRoom(room)}
                        className="w-full rounded-xl bg-slate-700/60 py-1.5 text-[11px] font-bold text-slate-200 hover:bg-blue-600 hover:text-white transition"
                      >
                        Lihat Detail
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: TIKET MAINTENANCE */}
        {activeTab === 'tickets' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fadeIn">
            <div className="bg-slate-800/80 p-6 rounded-3xl border border-slate-700 space-y-4">
              <h3 className="text-lg font-black text-white">Buat Tiket Perbaikan</h3>
              <form onSubmit={handleCreateTicket} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Nomor Unit</label>
                  <input
                    type="text"
                    value={newTicketUnit}
                    onChange={(e) => setNewTicketUnit(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Kategori</label>
                  <select
                    value={newTicketCat}
                    onChange={(e) => setNewTicketCat(e.target.value as TicketCategory)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white"
                  >
                    <option value="Plumbing / AC">Plumbing / AC</option>
                    <option value="Electrical">Electrical</option>
                    <option value="Security System">Security System</option>
                    <option value="Civil / Struktur">Civil / Struktur</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Deskripsi</label>
                  <textarea
                    rows={3}
                    value={newTicketIssue}
                    onChange={(e) => setNewTicketIssue(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white"
                  />
                </div>
                <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 py-3 rounded-xl font-bold text-white transition">
                  Kirim Tiket
                </button>
              </form>
            </div>

            <div className="lg:col-span-2 bg-slate-800/80 p-6 rounded-3xl border border-slate-700 space-y-4">
              <h3 className="text-lg font-black text-white">Daftar Tiket Teknisi</h3>
              <div className="space-y-3">
                {tickets.map((t) => (
                  <div key={t.id} className="bg-slate-900/60 p-4 rounded-2xl border border-slate-700/60 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-bold text-blue-400 text-xs">{t.id}</span>
                        <span className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded text-[10px]">{t.unit}</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          t.status === 'Resolved' ? 'bg-emerald-500/20 text-emerald-400' :
                          t.status === 'In Progress' ? 'bg-blue-500/20 text-blue-400' : 'bg-amber-500/20 text-amber-400'
                        }`}>
                          {t.status}
                        </span>
                      </div>
                      <p className="font-bold text-white text-sm mt-1">{t.issue}</p>
                      <p className="text-[11px] text-slate-400">{t.category} • Teknisi: {t.technician} • {t.date}</p>
                    </div>
                    {t.status !== 'Resolved' ? (
                      <button
                        onClick={() => handleAdvanceTicket(t.id)}
                        className="bg-slate-700 hover:bg-blue-600 text-white px-3 py-1.5 rounded-lg font-bold text-[11px] transition self-start sm:self-center"
                      >
                        {t.status === 'Pending' ? 'Mulai Kerjakan' : 'Tandai Selesai'}
                      </button>
                    ) : (
                      <span className="text-[10px] text-emerald-400 font-bold self-start sm:self-center">Selesai</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: IOT SENSOR */}
        {activeTab === 'iot' && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 animate-fadeIn">
            <div className="bg-slate-800/80 p-6 rounded-3xl border border-slate-700 space-y-2">
              <span className="text-xs font-bold text-emerald-400">⚡ Trafo & Genset</span>
              <p className="text-2xl font-black text-white">380V (Stable)</p>
            </div>
            <div className="bg-slate-800/80 p-6 rounded-3xl border border-slate-700 space-y-2">
              <span className="text-xs font-bold text-blue-400">💧 Pompa Air Booster</span>
              <p className="text-2xl font-black text-white">4.2 Bar</p>
            </div>
            <div className="bg-slate-800/80 p-6 rounded-3xl border border-slate-700 space-y-2">
              <span className="text-xs font-bold text-amber-400">🔥 Smoke Detector</span>
              <p className="text-2xl font-black text-white">100% Active</p>
            </div>
          </div>
        )}

        {/* TAB 5: BILLING & E-INVOICE */}
        {activeTab === 'billing' && (
          <div className="bg-slate-800/80 p-6 rounded-3xl border border-slate-700 space-y-4 animate-fadeIn">
            <h3 className="text-lg font-black text-white">Tagihan Service Charge & Utilities</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-900 text-slate-400 uppercase text-[10px]">
                  <tr>
                    <th className="p-3.5 rounded-l-xl">No Invoice</th>
                    <th className="p-3.5">Unit</th>
                    <th className="p-3.5">Penghuni</th>
                    <th className="p-3.5">Total Tagihan</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5 rounded-r-xl text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/50">
                  {bills.map((b) => (
                    <tr key={b.invoiceId} className="hover:bg-slate-700/30">
                      <td className="p-3.5 font-bold text-blue-400">{b.invoiceId}</td>
                      <td className="p-3.5 font-black text-white">{b.unit}</td>
                      <td className="p-3.5">{b.tenantName}</td>
                      <td className="p-3.5 font-bold text-emerald-400">Rp {(b.serviceCharge + b.sinkingFund + b.utilities).toLocaleString()}</td>
                      <td className="p-3.5">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${b.status === 'Lunas' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>{b.status}</span>
                      </td>
                      <td className="p-3.5 text-right">
                        {b.status !== 'Lunas' && (
                          <button
                            onClick={() => handleMarkPaid(b.invoiceId)}
                            className="bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1 rounded text-[11px] font-bold transition"
                          >
                            Tandai Lunas
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 6: PENGHUNI & TAMU */}
        {activeTab === 'tenants' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fadeIn">
            <div className="bg-slate-800/80 p-6 rounded-3xl border border-slate-700 space-y-4">
              <h3 className="text-lg font-black text-white">Direktori Penghuni</h3>
              {tenants.map((ten, i) => (
                <div key={i} className="bg-slate-900/60 p-3 rounded-xl flex justify-between items-center text-xs">
                  <div>
                    <span className="font-bold text-white">{ten.name} ({ten.unit})</span>
                    <p className="text-slate-400 text-[10px]">Kendaraan: {ten.vehicle}</p>
                  </div>
                  <span className="bg-slate-800 px-2 py-1 rounded text-slate-300">{ten.type}</span>
                </div>
              ))}
            </div>
            <div className="bg-slate-800/80 p-6 rounded-3xl border border-slate-700 space-y-4">
              <h3 className="text-lg font-black text-white">Buku Tamu Lobi (Visitor Log)</h3>
              {visitors.map((v) => (
                <div key={v.id} className="bg-slate-900/60 p-3 rounded-xl flex justify-between items-center text-xs">
                  <div>
                    <span className="font-bold text-emerald-400">{v.guestName}</span>
                    <p className="text-slate-400 text-[10px]">Tujuan: {v.targetUnit} • Masuk: {v.checkInTime}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${v.status === 'Di Dalam' ? 'bg-blue-500/20 text-blue-400' : 'bg-slate-700 text-slate-400'}`}>{v.status}</span>
                    {v.status === 'Di Dalam' && (
                      <button
                        onClick={() => handleCheckoutVisitor(v.id)}
                        className="bg-slate-700 hover:bg-slate-600 text-white px-2 py-0.5 rounded text-[10px]"
                      >
                        Checkout
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 7: BROADCAST PENGUMUMAN */}
        {activeTab === 'broadcast' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fadeIn">
            <div className="bg-slate-800/80 p-6 rounded-3xl border border-slate-700 space-y-4">
              <h3 className="text-lg font-black text-white">Kirim Broadcast</h3>
              <form onSubmit={handlePostAnnouncement} className="space-y-4 text-xs">
                <input
                  type="text"
                  placeholder="Judul Pengumuman"
                  value={newAnnTitle}
                  onChange={(e) => setNewAnnTitle(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white"
                />
                <select
                  value={newAnnCat}
                  onChange={(e) => setNewAnnCat(e.target.value as AnnouncementCategory)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white"
                >
                  <option value="Informasi">Informasi</option>
                  <option value="Maintenance">Maintenance</option>
                  <option value="Darurat">Darurat</option>
                </select>
                <textarea
                  rows={3}
                  placeholder="Isi Pesan..."
                  value={newAnnContent}
                  onChange={(e) => setNewAnnContent(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white"
                />
                <button type="submit" className="w-full bg-blue-600 py-3 rounded-xl font-bold text-white">Kirim Pengumuman</button>
              </form>
            </div>
            <div className="lg:col-span-2 space-y-3">
              {announcements.map((anc) => (
                <div key={anc.id} className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700 space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-white text-sm">{anc.title}</span>
                    <button
                      onClick={() => handleDeleteAnnouncement(anc.id)}
                      className="text-slate-500 hover:text-rose-400 text-xs font-bold"
                    >
                      Hapus
                    </button>
                  </div>
                  <p className="text-xs text-slate-300">{anc.content}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 8: MODUL KEUANGAN & KAS */}
        {activeTab === 'finance' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fadeIn">
            <div className="bg-slate-800/80 p-6 rounded-3xl border border-slate-700 space-y-4">
              <h3 className="text-lg font-black text-white">Catat Arus Kas Baru</h3>
              <form onSubmit={handleAddTransaction} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Jenis Transaksi</label>
                  <select value={txType} onChange={(e) => setTxType(e.target.value as TransactionType)} className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white">
                    <option value="Pemasukan">Pemasukan (Income)</option>
                    <option value="Pengeluaran">Pengeluaran (Expense)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Kategori</label>
                  <input type="text" value={txCategory} onChange={(e) => setTxCategory(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white" placeholder="Contoh: Perawatan Lift" />
                </div>
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Deskripsi</label>
                  <input type="text" value={txDesc} onChange={(e) => setTxDesc(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white" placeholder="Keterangan transaksi..." />
                </div>
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Nominal (Rp)</label>
                  <input type="number" value={txAmount} onChange={(e) => setTxAmount(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white" placeholder="5000000" />
                </div>
                <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 py-3 rounded-xl font-bold text-white transition">Simpan Transaksi Kas</button>
              </form>
            </div>

            <div className="lg:col-span-2 bg-slate-800/80 p-6 rounded-3xl border border-slate-700 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-black text-white">Laporan Arus Kas Operasional Gedung</h3>
                <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full">Real-Time Ledger</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-900 text-slate-400 uppercase text-[10px]">
                    <tr>
                      <th className="p-3.5 rounded-l-xl">ID</th>
                      <th className="p-3.5">Tanggal</th>
                      <th className="p-3.5">Kategori</th>
                      <th className="p-3.5">Keterangan</th>
                      <th className="p-3.5 rounded-r-xl">Nominal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700/50">
                    {financeTransactions.map((tx) => (
                      <tr key={tx.id} className="hover:bg-slate-700/30">
                        <td className="p-3.5 font-bold text-blue-400">{tx.id}</td>
                        <td className="p-3.5">{tx.date}</td>
                        <td className="p-3.5 font-bold text-white">{tx.category}</td>
                        <td className="p-3.5 text-slate-400">{tx.description}</td>
                        <td className={`p-3.5 font-black ${tx.type === 'Pemasukan' ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {tx.type === 'Pemasukan' ? '+' : '-'} Rp {tx.amount.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 9: KONTROL PARKIR & AKSES */}
        {activeTab === 'parking' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="bg-slate-800/80 p-6 rounded-3xl border border-slate-700 space-y-4">
              <h3 className="text-lg font-black text-white">Status Slot Parkir Basement per Zona</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {parkingZones.map((pz, idx) => {
                  const percentage = Math.round((pz.occupiedSlots / pz.totalSlots) * 100);
                  return (
                    <div key={idx} className="bg-slate-900 p-5 rounded-2xl border border-slate-700 space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-white text-sm">{pz.zone}</span>
                        <span className="text-xs text-blue-400 font-bold">{percentage}% Terisi</span>
                      </div>
                      <p className="text-xs text-slate-300">Slot Terisi: <strong>{pz.occupiedSlots}</strong> / {pz.totalSlots}</p>
                      <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                        <div className={`h-full ${percentage > 90 ? 'bg-rose-500' : 'bg-blue-500'}`} style={{ width: `${percentage}%` }}></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB 10: RESERVASI FASILITAS */}
        {activeTab === 'reservation' && (
          <div className="bg-slate-800/80 p-6 rounded-3xl border border-slate-700 space-y-4 animate-fadeIn">
            <h3 className="text-lg font-black text-white">Persetujuan Reservasi Fasilitas Bersama</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-900 text-slate-400 uppercase text-[10px]">
                  <tr>
                    <th className="p-3.5 rounded-l-xl">ID</th>
                    <th className="p-3.5">Fasilitas</th>
                    <th className="p-3.5">Pemohon</th>
                    <th className="p-3.5">Tanggal Acara</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5 rounded-r-xl text-right">Aksi Admin</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/50">
                  {reservations.map((res) => (
                    <tr key={res.id} className="hover:bg-slate-700/30">
                      <td className="p-3.5 font-bold text-blue-400">{res.id}</td>
                      <td className="p-3.5 font-bold text-white">{res.facilityName}</td>
                      <td className="p-3.5">{res.bookerName} ({res.unit})</td>
                      <td className="p-3.5">{res.date}</td>
                      <td className="p-3.5">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${res.status === 'Approved' ? 'bg-emerald-500/20 text-emerald-400' : res.status === 'Pending' ? 'bg-amber-500/20 text-amber-400' : 'bg-rose-500/20 text-rose-400'}`}>
                          {res.status}
                        </span>
                      </td>
                      <td className="p-3.5 text-right space-x-2">
                        <button onClick={() => handleUpdateReservation(res.id, 'Approved')} className="bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 rounded-lg font-bold text-[11px]">Setujui</button>
                        <button onClick={() => handleUpdateReservation(res.id, 'Rejected')} className="bg-rose-600 hover:bg-rose-500 text-white px-3 py-1.5 rounded-lg font-bold text-[11px]">Tolak</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>

      {/* POP-UP MODAL DETAIL KAMAR */}
      {selectedRoom && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl">
            <div className="relative h-60">
              <img src={selectedRoom.image} alt={selectedRoom.name} className="w-full h-full object-cover" />
              <button onClick={() => setSelectedRoom(null)} className="absolute top-4 right-4 h-8 w-8 rounded-full bg-slate-950/70 text-white font-bold flex items-center justify-center">✕</button>
              <span className="absolute bottom-4 left-4 bg-blue-600 text-white font-bold text-xs px-3 py-1 rounded-xl">Unit Nomor #{selectedRoom.id} (Lantai {selectedRoom.floor})</span>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-bold text-white">{selectedRoom.name}</h3>
                  <p className="text-xs text-slate-400">Grand Horizon Highrise Standard VVIP</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${selectedRoom.status === 'Tersedia' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>{selectedRoom.status}</span>
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-slate-700">
                <span className="text-lg font-black text-blue-400">{selectedRoom.price}</span>
                <button onClick={() => { alert(`Memproses pemesanan Unit #${selectedRoom.id}`); setSelectedRoom(null); }} className="rounded-xl bg-blue-600 hover:bg-blue-500 px-5 py-2.5 text-xs font-bold text-white transition">Booking Unit Ini</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}