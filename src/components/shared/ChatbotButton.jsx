"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CldImg from "@/components/shared/CldImg";

// ═══════════════════════════════════════════════════════════
// KNOWLEDGE BASE — Semua informasi tentang PT Sinar Cerah Sempurna
// ═══════════════════════════════════════════════════════════

function getDynamicKnowledgeBase(settings) {
  const address =
    settings.footer_address ||
    "Jl. Karangrejo Barat No 09, RT. 02 RW. 02 (Kp. Pentul), Tinjomoyo, Semarang";
  const phone = settings.footer_phone || "024 8502010";
  const email = settings.footer_email || "info@ptsinarcerahsempurna.com";
  const companyName = settings.company_name || "Sinar Cerah Sempurna";

  return [
    {
      topic: "profil_perusahaan",
      keywords: [
        "siapa",
        "apa itu",
        "perusahaan",
        "scs",
        "sinar cerah",
        "tentang",
        "profil",
        "company",
        "about",
      ],
      answer: `PT ${companyName} adalah perusahaan konstruksi dan infrastruktur yang berpengalaman dalam pembangunan gedung, jalan, jembatan, dan berbagai proyek infrastruktur lainnya di Indonesia. Kami berpegang teguh pada motto "Memberi Kepuasan Kepada Relasi".`,
    },
    {
      topic: "layanan",
      keywords: [
        "layanan",
        "jasa",
        "service",
        "apa saja",
        "ditawarkan",
        "kerjakan",
        "bisa apa",
        "pekerjaan",
        "bidang",
        "spesialisasi",
      ],
      answer:
        "Layanan kami meliputi:\n\n🏗️ Pembangunan Gedung & Bangunan Komersial\n🛣️ Konstruksi Jalan & Jembatan\n🏛️ Proyek Infrastruktur Publik\n🔧 Renovasi & Rehabilitasi Bangunan\n📐 Konsultasi Perencanaan Konstruksi\n\nSemua proyek dikerjakan dengan standar kualitas tinggi dan tim profesional berpengalaman.",
    },
    {
      topic: "lokasi",
      keywords: [
        "lokasi",
        "alamat",
        "kantor",
        "dimana",
        "di mana",
        "semarang",
        "address",
        "tempat",
        "office",
      ],
      answer: `📍 Kantor kami berlokasi di:\n${address}.\n\nAnda bisa langsung berkunjung ke kantor kami atau menghubungi melalui halaman Hubungi Kami di website ini.`,
    },
    {
      topic: "visi",
      keywords: ["visi", "vision", "cita-cita", "harapan"],
      answer:
        "Visi kami: Menjadi perusahaan konstruksi dan infrastruktur terdepan serta terpercaya di Indonesia, yang diakui karena keunggulan dalam kualitas, keselamatan, dan pembangunan berkelanjutan.",
    },
    {
      topic: "misi",
      keywords: ["misi", "mission", "tugas"],
      answer:
        "Misi kami:\n\n1️⃣ Memberikan layanan konstruksi berkualitas tinggi yang melampaui ekspektasi klien\n2️⃣ Menerapkan praktik terbaik K3L pada setiap proyek\n3️⃣ Mendorong inovasi melalui teknologi konstruksi mutakhir\n4️⃣ Membangun hubungan jangka panjang berdasarkan kepercayaan\n5️⃣ Mengembangkan kapabilitas profesional tim\n6️⃣ Berkontribusi pada pembangunan berkelanjutan Indonesia",
    },
    {
      topic: "visi_misi",
      keywords: ["visi misi", "visi dan misi", "tujuan", "goal", "target"],
      answer:
        "🎯 Visi: Menjadi perusahaan konstruksi terdepan dan terpercaya di Indonesia dalam kualitas, keselamatan, dan pembangunan berkelanjutan.\n\n📋 Misi:\n• Layanan berkualitas tinggi melampaui ekspektasi\n• Praktik terbaik K3L di setiap proyek\n• Inovasi teknologi konstruksi mutakhir\n• Hubungan jangka panjang berbasis kepercayaan\n• Pengembangan profesional tim berkelanjutan",
    },
    {
      topic: "pengalaman",
      keywords: [
        "pengalaman",
        "berapa lama",
        "tahun",
        "statistik",
        "track record",
        "portofolio",
        "pencapaian",
        "prestasi",
        "seberapa",
      ],
      answer:
        "📊 Pencapaian PT Sinar Cerah Sempurna:\n\n✅ 5+ Proyek Besar Selesai\n✅ 50+ Klien Puas\n✅ 25+ Tahun Pengalaman\n✅ 200+ Tim Profesional\n\nDengan pengalaman lebih dari dua dekade, kami telah membuktikan komitmen pada kualitas dan kepuasan klien.",
    },
    {
      topic: "nilai",
      keywords: [
        "nilai",
        "value",
        "prinsip",
        "budaya",
        "kultur",
        "inti",
        "fondasi",
        "keunggulan",
      ],
      answer:
        "Fondasi utama keunggulan kami:\n\n🛡️ Integritas — Kejujuran, transparansi, dan tanggung jawab penuh\n💎 Kualitas — Standar tertinggi di setiap proyek\n💡 Inovasi — Teknologi dan metode konstruksi terbaru\n🤝 Kerja Sama Tim — Kolaborasi kuat untuk hasil terbaik",
    },
    {
      topic: "kontak",
      keywords: [
        "hubungi",
        "kontak",
        "contact",
        "telepon",
        "email",
        "cara hubungi",
        "reach",
        "whatsapp",
        "wa",
      ],
      answer: `Anda bisa menghubungi kami melalui:\n\n1️⃣ Halaman "Hubungi Kami" di website ini\n2️⃣ Kunjungi kantor: ${address}\n3️⃣ Telepon: ${phone}\n4️⃣ Email: ${email}\n\nTim kami siap membantu mewujudkan visi konstruksi Anda! 🏗️`,
    },
    {
      topic: "proyek",
      keywords: [
        "proyek",
        "project",
        "portfolio",
        "contoh proyek",
        "hasil kerja",
        "pernah",
        "dikerjakan",
      ],
      answer:
        "Kami telah mengerjakan berbagai proyek konstruksi dan infrastruktur di Indonesia. Anda bisa melihat detail proyek-proyek kami di halaman Proyek pada website ini.\n\nSetiap proyek kami kerjakan dengan standar kualitas tertinggi dan komitmen pada kepuasan klien. 🏗️",
    },
    {
      topic: "berita",
      keywords: [
        "berita",
        "news",
        "update",
        "terbaru",
        "kabar",
        "informasi terbaru",
        "artikel",
      ],
      answer: `Untuk berita dan informasi terbaru seputar PT ${companyName}, silakan kunjungi halaman Berita di website kami.\n\nDi sana Anda bisa menemukan update proyek, pencapaian, dan berbagai kegiatan perusahaan. 📰`,
    },
    {
      topic: "karir",
      keywords: [
        "karir",
        "kerja",
        "lowongan",
        "rekrut",
        "lamaran",
        "hiring",
        "career",
        "job",
        "pekerjaan di",
        "gabung",
      ],
      answer: `Tertarik bergabung dengan tim kami? PT ${companyName} selalu mencari talenta terbaik!\n\nUntuk informasi lowongan, silakan hubungi kami melalui halaman Hubungi Kami atau kunjungi langsung kantor kami di Semarang. 👷‍♂️`,
    },
    {
      topic: "keselamatan",
      keywords: [
        "keselamatan",
        "safety",
        "k3",
        "keamanan",
        "aman",
        "standar keselamatan",
      ],
      answer:
        "Keselamatan adalah prioritas utama kami. Kami menerapkan:\n\n🔒 Standar K3L (Kesehatan, Keselamatan Kerja & Lingkungan)\n📋 Prosedur keselamatan ketat di setiap proyek\n👷 Pelatihan rutin untuk seluruh tim lapangan\n✅ Peralatan pelindung diri (APD) lengkap\n\nKeselamatan bukan hanya kebijakan, tetapi budaya kerja kami.",
    },
    {
      topic: "kerjasama",
      keywords: [
        "kerjasama",
        "kerja sama",
        "partner",
        "mitra",
        "kolaborasi",
        "konsultasi",
        "ajukan",
        "konsul",
      ],
      answer:
        "Kami sangat terbuka untuk kerja sama dan konsultasi proyek! 🤝\n\nLangkah untuk memulai:\n1️⃣ Hubungi kami via halaman Hubungi Kami\n2️⃣ Ceritakan kebutuhan proyek Anda\n3️⃣ Tim kami akan melakukan analisis dan konsultasi\n4️⃣ Kami berikan proposal yang sesuai kebutuhan\n\nMari wujudkan visi konstruksi Anda bersama kami!",
    },
    {
      topic: "motto",
      keywords: ["motto", "slogan", "tagline", "semboyan"],
      answer:
        'Motto kami: "Memberi Kepuasan Kepada Relasi" 🌟\n\nMotto ini mencerminkan komitmen kami untuk selalu mengutamakan kepuasan klien dan mitra kerja dalam setiap proyek yang kami jalankan.',
    },
    {
      topic: "jam_kerja",
      keywords: [
        "jam kerja",
        "operasional",
        "buka jam",
        "tutup jam",
        "hari apa",
        "jadwal",
        "waktu buka",
      ],
      answer: `🕒 Jam Operasional PT ${companyName}:\n\n• Senin - Jumat: 08.00 - 17.00 WIB\n• Sabtu: 08.00 - 12.00 WIB\n• Minggu & Hari Libur Nasional: Tutup\n\nSilakan kunjungi atau hubungi kami pada jam tersebut untuk respon terbaik.`,
    },
    {
      topic: "anak_perusahaan",
      keywords: [
        "anak perusahaan",
        "maharani",
        "globalindo",
        "jejaring",
        "sinergi",
        "unit bisnis",
        "anak usaha",
      ],
      answer: `PT ${companyName} bersinergi dengan jejaring bisnis kami, salah satunya adalah:\n\n🏢 PT Maharani Globalindo\nPerusahaan yang berbasis di Semarang yang bergerak dalam dua lini utama: Jasa Konstruksi berskala nasional dan penyelenggaraan perjalanan ibadah Umrah terpercaya.`,
    },
    {
      topic: "sejarah",
      keywords: [
        "sejarah",
        "kapan berdiri",
        "didirikan",
        "asal usul",
        "perjalanan",
      ],
      answer: `PT ${companyName} memiliki sejarah panjang lebih dari 25 tahun di Indonesia. Didirikan dengan komitmen kuat untuk memajukan pembangunan infrastruktur nasional, kami bertransformasi menjadi kontraktor terpercaya dengan puluhan proyek sukses berskala nasional.`,
    },
    {
      topic: "keunggulan",
      keywords: [
        "keunggulan",
        "kenapa memilih",
        "kelebihan",
        "kenapa harus",
        "mengapa",
        "bagus",
      ],
      answer: `Mengapa memilih PT ${companyName}?\n\n💯 Berpengalaman 25+ tahun di bidang infrastruktur\n🏆 Hasil konstruksi berstandar kualitas tinggi\n👷 Didukung oleh 200+ SDM ahli dan bersertifikat\n🛡️ Komitmen keselamatan K3L yang ketat\n🤝 Transparan, jujur, dan berintegritas`,
    },
    {
      topic: "sertifikasi",
      keywords: [
        "sertifikasi",
        "iso",
        "legalitas",
        "ijin",
        "izin",
        "sertifikat",
      ],
      answer: `PT ${companyName} memiliki legalitas lengkap dan sertifikasi industri standar nasional & internasional untuk memastikan setiap proyek dikerjakan secara aman, legal, dan berkualitas tinggi.`,
    },
    {
      topic: "wilayah",
      keywords: [
        "wilayah",
        "area",
        "daerah",
        "jangkauan",
        "luar kota",
        "luar jawa",
        "nasional",
        "lokasi proyek",
      ],
      answer:
        "Jangkauan layanan kami bersifat NASIONAL 🇮🇩.\n\nKami melayani proyek konstruksi di berbagai wilayah di seluruh Indonesia, baik di dalam pulau Jawa maupun luar pulau Jawa, didukung oleh logistik dan manajemen rantai pasok yang andal.",
    },
    {
      topic: "mitra_klien",
      keywords: [
        "mitra",
        "klien",
        "siapa klien",
        "customer",
        "pelanggan",
        "instansi",
        "bumn",
        "pemerintah",
      ],
      answer:
        "Kami melayani berbagai segmen klien, termasuk:\n\n🏢 Instansi Pemerintah (Kementerian & Dinas Pekerjaan Umum)\n🏛️ BUMN (Badan Usaha Milik Negara)\n🏬 Perusahaan Swasta Nasional & Multinasional\n🏘️ Pengembang Properti & Perorangan",
    },
    {
      topic: "portal_aplikasi",
      keywords: [
        "portal",
        "aplikasi",
        "sistem",
        "login karyawan",
        "internal",
        "link aplikasi",
      ],
      answer: `Portal Aplikasi SCS merupakan sistem internal yang digunakan khusus oleh manajemen dan karyawan PT ${companyName} untuk kebutuhan koordinasi proyek, administrasi, dan operasional internal.`,
    },
    {
      topic: "sop",
      keywords: [
        "sop",
        "standard operating",
        "prosedur",
        "panduan kerja",
        "aturan",
      ],
      answer: `SOP (Standard Operating Procedure) PT ${companyName} adalah dokumen panduan resmi bagi tim kami di lapangan maupun kantor untuk memastikan standar keselamatan, efisiensi kerja, dan kualitas konstruksi tetap terjaga di setiap proyek.`,
    },
    {
      topic: "metode_kerja",
      keywords: [
        "metode",
        "cara kerja",
        "teknologi",
        "bim",
        "digital",
        "modern",
      ],
      answer:
        "Kami mengadopsi metode konstruksi modern & berkelanjutan, termasuk:\n\n📐 Pemanfaatan BIM (Building Information Modeling)\n⚙️ Alat konstruksi berspesifikasi tinggi\n🍃 Praktik Green Construction untuk meminimalkan dampak lingkungan\n⚡ Manajemen waktu proyek yang ketat berbasis digital",
    },
  ];
}

function getQuickFaq(settings) {
  const companyName = settings.company_name || "Sinar Cerah Sempurna";
  return [
    `Apa itu PT ${companyName}?`,
    "Apa saja layanan yang ditawarkan?",
    "Di mana lokasi kantor?",
    "Apa visi dan misi perusahaan?",
    "Berapa pengalaman di industri?",
    "Bagaimana cara menghubungi?",
  ];
}

// ═══════════════════════════════════════════════════════════
// SMART MATCHING ENGINE
// ═══════════════════════════════════════════════════════════

function findBestAnswer(input, knowledgeBase) {
  const lower = input.toLowerCase().replace(/[?!.,]/g, "");
  const words = lower.split(/\s+/);

  let bestMatch = null;
  let bestScore = 0;

  for (const entry of knowledgeBase) {
    let score = 0;

    for (const keyword of entry.keywords) {
      // Exact substring match (bonus point)
      if (lower.includes(keyword)) {
        score += keyword.split(/\s+/).length * 3;
      }

      // Individual word matching
      const kwWords = keyword.split(/\s+/);
      for (const kw of kwWords) {
        for (const word of words) {
          // Exact word
          if (word === kw) score += 2;
          // Fuzzy: word starts with keyword or vice versa (min 3 chars)
          else if (word.length >= 3 && kw.length >= 3) {
            if (
              word.startsWith(kw.substring(0, 3)) ||
              kw.startsWith(word.substring(0, 3))
            ) {
              score += 1;
            }
          }
        }
      }
    }

    if (score > bestScore) {
      bestScore = score;
      bestMatch = entry;
    }
  }

  return bestScore >= 2 ? bestMatch : null;
}

// ═══════════════════════════════════════════════════════════
// GREETING / SMALL TALK DETECTION
// ═══════════════════════════════════════════════════════════

const GREETINGS = {
  patterns: [
    "halo",
    "hai",
    "hi",
    "hello",
    "hey",
    "selamat",
    "pagi",
    "siang",
    "sore",
    "malam",
    "assalamualaikum",
    "apa kabar",
  ],
  responses: [
    "Halo juga! 😊 Ada yang bisa saya bantu tentang PT Sinar Cerah Sempurna?",
    "Hai! 👋 Senang bisa membantu Anda. Mau tanya apa tentang SCS?",
    "Halo! Selamat datang di SCS AI. Silakan tanyakan apa saja tentang perusahaan kami! 🏗️",
  ],
};

const THANKS = {
  patterns: ["terima kasih", "makasih", "thanks", "thank you", "thx", "tq"],
  responses: [
    "Sama-sama! 😊 Jangan ragu untuk bertanya lagi ya!",
    "Terima kasih kembali! Senang bisa membantu! 🙌",
    "Dengan senang hati! Ada yang lain yang bisa saya bantu? 😊",
  ],
};

const GOODBYE = {
  patterns: ["bye", "dadah", "sampai jumpa", "see you", "goodbye"],
  responses: [
    "Sampai jumpa! Terima kasih sudah menghubungi SCS AI 👋",
    "Bye! Jangan ragu untuk bertanya lagi kapan saja 😊",
  ],
};

function checkSmallTalk(input) {
  const lower = input.toLowerCase();

  for (const group of [GREETINGS, THANKS, GOODBYE]) {
    if (group.patterns.some((p) => lower.includes(p))) {
      return group.responses[
        Math.floor(Math.random() * group.responses.length)
      ];
    }
  }
  return null;
}

// ═══════════════════════════════════════════════════════════
// EASTER EGG 🥚
// ═══════════════════════════════════════════════════════════

const EASTER_EGG = {
  patterns: [
    "pembuat",
    "developer",
    "bikin web",
    "buat web",
    "siapa yang buat",
    "siapa yang bikin",
    "creator",
    "dibuat oleh",
    "dibikin",
    "programmer",
    "tim developer",
    "web developer",
  ],
  response: {
    text: "🎉 Easter egg unlocked!\n\nWebsite ini dibuat dengan ❤️ oleh tim developer keren ini:\n\n👨‍💻 Tim Web Developer SCS\n\nMereka adalah otak di balik layar yang membangun website PT Sinar Cerah Sempurna dari nol! 🚀",
    image: "/team-photo.jpg",
  },
};

function checkEasterEgg(input) {
  const lower = input.toLowerCase();
  return EASTER_EGG.patterns.some((p) => lower.includes(p));
}

// ═══════════════════════════════════════════════════════════
// FALLBACK RESPONSES
// ═══════════════════════════════════════════════════════════

const FALLBACK_RESPONSES = [
  "Hmm, saya belum punya informasi spesifik tentang itu. 🤔 Coba tanyakan tentang layanan, lokasi, atau profil PT Sinar Cerah Sempurna!\n\nAtau hubungi tim kami langsung melalui halaman Hubungi Kami.",
  "Maaf, saya belum bisa menjawab pertanyaan tersebut. 😅 Saya bisa membantu Anda mengenai:\n• Profil perusahaan\n• Layanan konstruksi\n• Lokasi kantor\n• Visi & Misi\n• Cara menghubungi kami",
  "Pertanyaan menarik! Tapi saya belum punya jawabannya. 🙏 Untuk informasi lebih detail, silakan hubungi tim kami melalui halaman Hubungi Kami di website.",
];

function generateResponse(input, settings) {
  // 0. Check easter egg 🥚
  if (checkEasterEgg(input)) {
    return { type: "easter_egg", ...EASTER_EGG.response };
  }

  // 1. Check small talk
  const smallTalk = checkSmallTalk(input);
  if (smallTalk) return smallTalk;

  // 2. Check knowledge base
  const knowledgeBase = getDynamicKnowledgeBase(settings);
  const match = findBestAnswer(input, knowledgeBase);
  if (match) return match.answer;

  // 3. Fallback
  return FALLBACK_RESPONSES[
    Math.floor(Math.random() * FALLBACK_RESPONSES.length)
  ];
}

// ═══════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════

export default function ChatbotButton({ settings = {} }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      type: "bot",
      text: "Halo! 👋 Saya SCS AI, asisten virtual PT Sinar Cerah Sempurna.\n\nSilakan pilih pertanyaan di bawah atau ketik langsung apa yang ingin Anda tanyakan!",
    },
  ]);
  const [showFaq, setShowFaq] = useState(true);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const addBotMessage = (response) => {
    setIsTyping(true);
    const textLength =
      typeof response === "string" ? response.length : response.text.length;
    const delay = Math.min(400 + textLength * 2, 1500);
    setTimeout(() => {
      setIsTyping(false);
      if (typeof response === "object" && response.type === "easter_egg") {
        setMessages((prev) => [
          ...prev,
          { type: "bot", text: response.text, image: response.image },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            type: "bot",
            text: typeof response === "string" ? response : response.text,
          },
        ]);
      }
    }, delay);
  };

  const handleFaqClick = (question) => {
    setMessages((prev) => [...prev, { type: "user", text: question }]);
    setShowFaq(false);
    const response = generateResponse(question, settings);
    addBotMessage(response);
    setTimeout(() => setShowFaq(true), 1800);
  };

  const handleSend = () => {
    const trimmed = inputValue.trim();
    if (!trimmed) return;

    setMessages((prev) => [...prev, { type: "user", text: trimmed }]);
    setInputValue("");
    setShowFaq(false);

    const response = generateResponse(trimmed, settings);
    addBotMessage(response);
    setTimeout(() => setShowFaq(true), 1800);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSend();
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end font-['Plus_Jakarta_Sans']">
      {/* Jendela Chat (Muncul dengan efek air mengembang dari logo) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{
              width: 56,
              height: 56,
              borderRadius: "28px",
              opacity: 0,
              y: 70,
              scale: 0.9,
            }}
            animate={{
              width: 340,
              height: 480,
              borderRadius: "16px",
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            exit={{
              width: 56,
              height: 56,
              borderRadius: "28px",
              opacity: 0,
              y: 70,
              scale: 0.9,
            }}
            transition={{
              type: "spring",
              damping: 24,
              stiffness: 220,
            }}
            className="bg-white shadow-2xl border border-neutral-200 overflow-hidden flex flex-col absolute bottom-[70px] right-0 origin-bottom-right"
            role="dialog"
            aria-modal="true"
            aria-label="Jendela Chatbot SCS AI"
          >
            <div className="w-[340px] h-[480px] flex flex-col justify-between shrink-0">
              {/* Header */}
              <div className="bg-[#004282] px-4 py-3.5 text-white flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                      <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.2L4 17.2V4h16v12z" />
                      <circle cx="8" cy="9" r="1.5" />
                      <circle cx="16" cy="9" r="1.5" />
                    </svg>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold text-sm leading-tight">
                      SCS AI
                    </span>
                    <div className="flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-[10px] text-white/80">Online</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-white/20 transition-colors text-white text-lg"
                >
                  ×
                </button>
              </div>

              {/* Area Pesan */}
              <div className="flex-grow p-4 overflow-y-auto space-y-3 bg-[#f7f7f8]">
                {messages.map((msg, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, scale: 0.95, y: 12 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ ease: [0.16, 1, 0.3, 1], duration: 0.4 }}
                    className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`px-3.5 py-2.5 rounded-2xl text-[13px] leading-relaxed max-w-[85%] whitespace-pre-line ${
                        msg.type === "user"
                          ? "bg-[#004282] text-white rounded-br-md"
                          : "bg-white text-[#1E1E1E] border border-neutral-200 rounded-bl-md shadow-sm"
                      }`}
                    >
                      {msg.text}
                      {msg.image && (
                        <CldImg
                          src={msg.image}
                          alt="Tim Developer"
                          className="w-full rounded-xl mt-2 shadow-md border border-neutral-100"
                        />
                      )}
                    </div>
                  </motion.div>
                ))}

                {/* Typing Indicator */}
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 8 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ ease: [0.16, 1, 0.3, 1], duration: 0.4 }}
                    className="flex justify-start"
                  >
                    <div className="bg-white border border-neutral-200 px-4 py-3 rounded-2xl rounded-bl-md shadow-sm flex gap-1.5">
                      <span
                        className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0ms" }}
                      ></span>
                      <span
                        className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce"
                        style={{ animationDelay: "150ms" }}
                      ></span>
                      <span
                        className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce"
                        style={{ animationDelay: "300ms" }}
                      ></span>
                    </div>
                  </motion.div>
                )}

                {/* FAQ Buttons */}
                <AnimatePresence>
                  {showFaq && !isTyping && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 4 }}
                      transition={{ ease: [0.16, 1, 0.3, 1], duration: 0.35 }}
                      className="flex flex-wrap gap-1.5 pt-1"
                    >
                      {getQuickFaq(settings).map((q, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleFaqClick(q)}
                          className="text-[11px] font-medium text-[#004282] bg-blue-50 hover:bg-blue-100 border border-blue-200 px-3 py-1.5 rounded-full transition-colors text-left"
                        >
                          {q}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>

                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="p-3 border-t border-neutral-200 bg-white flex gap-2 shrink-0">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ketik pertanyaan Anda..."
                  className="flex-grow border border-neutral-300 rounded-xl px-3.5 py-2.5 text-[13px] focus:outline-none focus:border-[#004282] focus:ring-1 focus:ring-[#004282]/20 transition-all"
                  autoFocus
                />
                <button
                  onClick={handleSend}
                  disabled={!inputValue.trim()}
                  className="bg-[#004282] text-white px-4 py-2.5 rounded-xl text-[13px] font-bold hover:bg-blue-900 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Kirim
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tombol Utama (Tetap Ada di Bawah) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-yellow-400 hover:bg-yellow-500 text-[#004282] rounded-full shadow-xl transition-all duration-200 focus:outline-none group active:scale-95 flex items-center justify-center z-10"
        aria-label="Chatbot AI"
        aria-expanded={isOpen}
      >
        <motion.svg
          animate={{ rotate: isOpen ? 180 : 0, scale: isOpen ? 0.95 : 1 }}
          transition={{ ease: [0.16, 1, 0.3, 1], duration: 0.35 }}
          className="w-7 h-7 fill-current transform group-hover:rotate-12 transition-transform duration-200"
          viewBox="0 0 24 24"
        >
          {isOpen ? (
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
          ) : (
            <>
              <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.2L4 17.2V4h16v12z" />
              <circle cx="8" cy="9" r="1.5" />
              <circle cx="16" cy="9" r="1.5" />
              <path d="M11.5 11h1v2h-1z" />
            </>
          )}
        </motion.svg>
      </button>
    </div>
  );
}
