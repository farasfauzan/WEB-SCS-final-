// components/landing/Navbar.jsx
'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();

  const navLinks = [
    { name: 'Beranda', path: '/' },
    { name: 'Tentang', path: '/tentang' },
    { name: 'Proyek', path: '/proyek' },
    { name: 'Berita', path: '/berita' },
  ];

  return (
    <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-md z-50 border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="font-extrabold text-2xl text-blue-900 tracking-tight">
          CORP<span className="text-blue-500">.</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link 
              key={link.path} 
              href={link.path} 
              className={`font-medium transition-colors ${
                pathname === link.path ? 'text-blue-600' : 'text-slate-600 hover:text-blue-600'
              }`}
            >
              {link.name}
            </Link>
          ))}
          
          {/* Tombol Hubungi Kami langsung mengarah ke ID #kontak di Beranda */}
          <Link 
            href="/#kontak" 
            className="bg-blue-600 text-white px-5 py-2 rounded-full font-medium text-sm hover:bg-blue-700 transition shadow-sm"
          >
            Hubungi Kami
          </Link>
        </div>
      </div>
    </nav>
  );
}