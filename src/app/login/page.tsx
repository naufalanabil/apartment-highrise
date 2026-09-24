'use client';

export default function LoginPage() {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-slate-50">
      {/* Kolom Kiri: Form Login */}
      <div className="flex w-full flex-col justify-center px-8 md:w-1/2 lg:px-20">
        <div className="mx-auto w-full max-w-sm">
          {/* Logo & Judul */}
          <div className="mb-8">
            <span className="text-2xl font-bold tracking-tight text-blue-600">🏢 UrbanNest</span>
            <h2 className="mt-6 text-3xl font-extrabold text-slate-900">Selamat Datang Kembali!</h2>
            <p className="mt-2 text-sm text-slate-600">Silakan masuk untuk mengelola hunian dan fasilitas Anda.</p>
          </div>

          {/* Form */}
          <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label className="block text-sm font-medium text-slate-700">Email / Username</label>
              <input 
                type="email" 
                required
                placeholder="nama@email.com" 
                className="mt-1 block w-full rounded-lg border border-slate-300 px-4 py-2.5 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">Password</label>
              <input 
                type="password" 
                required
                placeholder="••••••••" 
                className="mt-1 block w-full rounded-lg border border-slate-300 px-4 py-2.5 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center text-slate-600">
                <input type="checkbox" className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                <span className="ml-2">Ingat saya</span>
              </label>
              <a href="#" className="font-medium text-blue-600 hover:underline">Lupa password?</a>
            </div>

            <button 
              type="submit" 
              className="w-full rounded-lg bg-blue-600 py-2.5 font-semibold text-white shadow-lg shadow-blue-500/30 transition hover:bg-blue-700"
            >
              Masuk ke Sistem
            </button>
          </form>
        </div>
      </div>

      {/* Kolom Kanan: Gambar / Ilustrasi Apartemen */}
      <div className="relative hidden w-1/2 md:block">
        <img 
          src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=1200" 
          alt="Modern Apartment Building" 
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/20 to-transparent flex flex-col justify-end p-12 text-white">
          <blockquote className="space-y-2">
            <p className="text-xl font-medium">"Hunian vertikal modern dengan fasilitas bintang lima dan kenyamanan maksimal."</p>
            <footer className="text-sm text-slate-300">UrbanNest Highrise Management</footer>
          </blockquote>
        </div>
      </div>
    </div>
  );
}