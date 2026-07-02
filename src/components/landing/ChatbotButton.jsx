// components/landing/ChatbotButton.jsx
'use client';
import { useState } from 'react';

export default function ChatbotButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end font-sans">
      
      {/* Jendela Chat Mini (Hanya muncul jika isOpen = true) */}
      {isOpen && (
        <div className="w-80 h-96 bg-white rounded-2xl shadow-2xl border border-slate-100 mb-4 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
          {/* Header Jendela Chat */}
          <div className="bg-blue-600 p-4 text-white flex justify-between items-center">
            <div>
              <h3 className="font-bold text-sm">SCS Virtual Assistant</h3>
              <p className="text-xs text-blue-200">Online • Siap membantu</p>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white hover:text-blue-200 text-sm">✕</button>
          </div>
          
          {/* Area Isi Chat (Simulasi) */}
          <div className="flex-grow p-4 bg-slate-50 overflow-y-auto text-sm space-y-3">
            <div className="bg-blue-100 text-slate-800 p-3 rounded-2xl rounded-tl-none max-w-[85%]">
              Halo! Ada yang bisa kami bantu mengenai layanan SCS?
            </div>
          </div>

          {/* Kolom Input */}
          <div className="p-3 bg-white border-t flex gap-2">
            <input type="text" placeholder="Ketik pesan..." className="w-full bg-slate-100 p-2 text-xs rounded-lg outline-none border focus:border-blue-500" />
            <button className="bg-blue-600 text-white px-3 py-1 rounded-lg text-xs font-semibold">Kirim</button>
          </div>
        </div>
      )}

      {/* Tombol Bulat Utama (Floating Action Button) */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-xl hover:bg-blue-700 hover:scale-105 transition-all duration-300 active:scale-95"
      >
        {isOpen ? (
          <span className="text-xl">✕</span>
        ) : (
          /* Kamu bisa ganti teks ini dengan Icon Chat jika sudah pasang library icon */
          <span className="text-xs font-bold uppercase tracking-tight">Chat</span>
        )}
      </button>
    </div>
  );
}