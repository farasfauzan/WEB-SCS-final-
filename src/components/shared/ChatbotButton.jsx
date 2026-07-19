"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CldImg from "@/components/shared/CldImg";

// ═══════════════════════════════════════════════════════════
// FILTER STOPWORDS (FITUR 1)
// ═══════════════════════════════════════════════════════════
const STOPWORDS = [
  "dan",
  "di",
  "ke",
  "yang",
  "dari",
  "pada",
  "untuk",
  "dengan",
  "ini",
  "itu",
  "ya",
  "saya",
  "aku",
  "kamu",
  "kami",
  "adalah",
  "apakah",
  "bagaimana",
  "kenapa",
  "kapan",
  "siapa",
  "dimana",
  "ada",
  "apa",
];

// ═══════════════════════════════════════════════════════════
// ALGORITMA ANTI-TYPO (Proteksi Super Ketat)
// ═══════════════════════════════════════════════════════════
function levenshtein(a, b) {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;
  const matrix = [];
  for (let i = 0; i <= b.length; i++) matrix[i] = [i];
  for (let j = 0; j <= a.length; j++) matrix[0][j] = j;
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1,
        );
      }
    }
  }
  return matrix[b.length][a.length];
}

function isFuzzyMatch(word, keyword) {
  if (word === keyword) return true;

  // Jika selisih panjang lebih dari 2 huruf, tolak mentah-mentah
  if (Math.abs(word.length - keyword.length) > 2) return false;

  // MASALAH 1: Proteksi Khusus Kata Pendek (Wajib Sama Persis)
  // Menghapus .includes() agar "wa" tidak dianggap cocok dengan "kecewa"
  if (word.length <= 3 || keyword.length <= 3) {
    return word === keyword;
  }

  const distance = levenshtein(word, keyword);
  const allowedTypos = keyword.length <= 5 ? 1 : 2;
  return distance <= allowedTypos;
}

// ═══════════════════════════════════════════════════════════
// KNOWLEDGE BASE — Dwibahasa (ID & EN)
// ═══════════════════════════════════════════════════════════
function getDynamicKnowledgeBase(settings, lang = "id") {
  const address =
    settings.footer_address ||
    "Jl. Karangrejo Barat No 09, RT. 02 RW. 02 (Kp. Pentul), Tinjomoyo, Semarang";
  const phone = settings.footer_phone || "024 8502010";
  const email = settings.footer_email || "info@ptsinarcerahsempurna.com";
  const companyName = settings.company_name || "Sinar Cerah Sempurna";

  const kb = [
    {
      topic: "arti_nama",
      keywords: [
        "hikari", // EASTER EGG HIKARI DITEMPATKAN DI SINI
        "kenapa hikari",
        "arti nama",
        "namamu",
        "siapa hikari",
        "scs pintar",
      ],
      answer: {
        id: "Halo! 'Hikari' adalah namaku yang dulu, diambil dari bahasa Jepang yang artinya 'Cahaya'. 🌟\n\nTapi sekarang, panggil aku **SCS Pintar**, asisten digital resmi PT Sinar Cerah Sempurna yang siap memberikan solusi untukmu! ✨",
        en: "Hello! 'Hikari' was my old name, taken from Japanese meaning 'Light'. 🌟\n\nBut now, call me **SCS Pintar**, the official digital assistant of PT Sinar Cerah Sempurna ready to provide solutions for you! ✨",
      },
    },
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
        "who",
      ],
      answer: {
        id: `PT ${companyName} adalah perusahaan konstruksi dan infrastruktur yang berpengalaman dalam pembangunan gedung, jalan, jembatan, dan berbagai proyek infrastruktur lainnya di Indonesia. Kami berpegang teguh pada motto "Memberi Kepuasan Kepada Relasi".`,
        en: `PT ${companyName} is an experienced construction and infrastructure company specializing in buildings, roads, bridges, and various other infrastructure projects in Indonesia. We firmly adhere to our motto "Providing Satisfaction to Our Partners".`,
      },
    },
    {
      topic: "layanan",
      keywords: [
        "layanan",
        "jasa",
        "service",
        "services",
        "apa saja",
        "ditawarkan",
        "kerjakan",
        "bisa apa",
        "pekerjaan",
        "bidang",
        "spesialisasi",
        "offer",
      ],
      answer: {
        id: "Layanan kami meliputi:\n\n🏗️ Pembangunan Gedung & Bangunan Komersial\n🛣️ Konstruksi Jalan & Jembatan\n🏛️ Proyek Infrastruktur Publik\n🔧 Renovasi & Rehabilitasi Bangunan\n📐 Konsultasi Perencanaan Konstruksi\n\nSemua proyek dikerjakan dengan standar kualitas tinggi dan tim profesional berpengalaman.",
        en: "Our services include:\n\n🏗️ Building & Commercial Construction\n🛣️ Road & Bridge Construction\n🏛️ Public Infrastructure Projects\n🔧 Building Renovation & Rehabilitation\n📐 Construction Planning Consultation\n\nAll projects are executed with high-quality standards by our experienced professional team.",
      },
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
        "location",
        "where",
      ],
      answer: {
        id: `📍 Kantor kami berlokasi di:\n${address}.\n\nAnda bisa langsung berkunjung ke kantor kami atau menghubungi melalui halaman Hubungi Kami di website ini.`,
        en: `📍 Our office is located at:\n${address}.\n\nYou can visit our office directly or contact us through the Contact Us page on this website.`,
      },
    },
    {
      topic: "visi",
      keywords: ["visi", "vision", "cita-cita", "harapan"],
      answer: {
        id: "Visi kami: Menjadi perusahaan konstruksi dan infrastruktur terdepan serta terpercaya di Indonesia, yang diakui karena keunggulan dalam kualitas, keselamatan, dan pembangunan berkelanjutan.",
        en: "Our Vision: To become a leading and trusted construction and infrastructure company in Indonesia, recognized for excellence in quality, safety, and sustainable development.",
      },
    },
    {
      topic: "misi",
      keywords: ["misi", "mission", "tugas"],
      answer: {
        id: "Misi kami:\n\n1️⃣ Memberikan layanan konstruksi berkualitas tinggi yang melampaui ekspektasi klien\n2️⃣ Menerapkan praktik terbaik K3L pada setiap proyek\n3️⃣ Mendorong inovasi melalui teknologi konstruksi mutakhir\n4️⃣ Membangun hubungan jangka panjang berdasarkan kepercayaan\n5️⃣ Mengembangkan kapabilitas profesional tim\n6️⃣ Berkontribusi pada pembangunan berkelanjutan Indonesia",
        en: "Our Mission:\n\n1️⃣ Deliver high-quality construction services that exceed client expectations\n2️⃣ Implement HSE (Health, Safety, Environment) best practices in every project\n3️⃣ Drive innovation through cutting-edge construction technology\n4️⃣ Build long-term relationships based on trust\n5️⃣ Develop the professional capabilities of our team\n6️⃣ Contribute to Indonesia's sustainable development",
      },
    },
    {
      topic: "visi_misi",
      keywords: [
        "visi misi",
        "visi dan misi",
        "tujuan",
        "goal",
        "target",
        "vision and mission",
      ],
      answer: {
        id: "🎯 Visi: Menjadi perusahaan konstruksi terdepan dan terpercaya di Indonesia dalam kualitas, keselamatan, dan pembangunan berkelanjutan.\n\n📋 Misi:\n• Layanan berkualitas tinggi melampaui ekspektasi\n• Praktik terbaik K3L di setiap proyek\n• Inovasi teknologi konstruksi mutakhir\n• Hubungan jangka panjang berbasis kepercayaan\n• Pengembangan profesional tim berkelanjutan",
        en: "🎯 Vision: To be a leading and trusted construction company in Indonesia in quality, safety, and sustainability.\n\n📋 Mission:\n• High-quality services exceeding expectations\n• HSE best practices in every project\n• Cutting-edge construction technology innovation\n• Long-term trust-based relationships\n• Continuous professional team development",
      },
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
        "experience",
        "achievement",
      ],
      answer: {
        id: "📊 Pencapaian PT Sinar Cerah Sempurna:\n\n✅ 5+ Proyek Besar Selesai\n✅ 50+ Klien Puas\n✅ 25+ Tahun Pengalaman\n✅ 200+ Tim Profesional\n\nDengan pengalaman lebih dari dua dekade, kami telah membuktikan komitmen pada kualitas dan kepuasan klien.",
        en: "📊 PT Sinar Cerah Sempurna's Achievements:\n\n✅ 5+ Major Projects Completed\n✅ 50+ Satisfied Clients\n✅ 25+ Years of Experience\n✅ 200+ Professional Team Members\n\nWith over two decades of experience, we have proven our commitment to quality and client satisfaction.",
      },
    },
    {
      topic: "nilai",
      keywords: [
        "nilai",
        "value",
        "values",
        "prinsip",
        "budaya",
        "kultur",
        "inti",
        "fondasi",
        "keunggulan",
        "core",
      ],
      answer: {
        id: "Fondasi utama keunggulan kami:\n\n🛡️ Integritas — Kejujuran, transparansi, dan tanggung jawab penuh\n💎 Kualitas — Standar tertinggi di setiap proyek\n💡 Inovasi — Teknologi dan metode konstruksi terbaru\n🤝 Kerja Sama Tim — Kolaborasi kuat untuk hasil terbaik",
        en: "The core foundations of our excellence:\n\n🛡️ Integrity — Honesty, transparency, and full responsibility\n💎 Quality — Highest standards in every project\n💡 Innovation — Latest construction technology and methods\n🤝 Teamwork — Strong collaboration for the best results",
      },
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
        "call",
      ],
      answer: {
        id: `Anda bisa menghubungi kami melalui:\n\n1️⃣ Halaman "Hubungi Kami" di website ini\n2️⃣ Kunjungi kantor: ${address}\n3️⃣ Telepon: ${phone}\n4️⃣ Email: ${email}\n\nTim kami siap membantu mewujudkan visi konstruksi Anda! 🏗️`,
        en: `You can reach us through:\n\n1️⃣ The "Contact Us" page on this website\n2️⃣ Visit our office: ${address}\n3️⃣ Phone: ${phone}\n4️⃣ Email: ${email}\n\nOur team is ready to help bring your construction vision to life! 🏗️`,
      },
    },
    {
      topic: "proyek",
      keywords: [
        "proyek",
        "project",
        "projects",
        "portfolio",
        "contoh proyek",
        "hasil kerja",
        "pernah",
        "dikerjakan",
      ],
      answer: {
        id: "Kami telah mengerjakan berbagai proyek konstruksi dan infrastruktur di Indonesia. Anda bisa melihat detail proyek-proyek kami di halaman Proyek pada website ini.\n\nSetiap proyek kami kerjakan dengan standar kualitas tertinggi dan komitmen pada kepuasan klien. 🏗️",
        en: "We have worked on various construction and infrastructure projects in Indonesia. You can view the details of our projects on the Projects page of this website.\n\nEvery project is executed with the highest quality standards and a commitment to client satisfaction. 🏗️",
      },
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
        "article",
      ],
      answer: {
        id: `Untuk berita dan informasi terbaru seputar PT ${companyName}, silakan kunjungi halaman Berita di website kami.\n\nDi sana Anda bisa menemukan update proyek, pencapaian, dan berbagai kegiatan perusahaan. 📰`,
        en: `For the latest news and information about PT ${companyName}, please visit the News page on our website.\n\nThere you can find project updates, achievements, and various company activities. 📰`,
      },
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
        "vacancy",
      ],
      answer: {
        id: `Tertarik bergabung dengan tim kami? PT ${companyName} selalu mencari talenta terbaik!\n\nUntuk informasi lowongan, silakan hubungi kami melalui halaman Hubungi Kami atau kunjungi langsung kantor kami di Semarang. 👷‍♂️`,
        en: `Interested in joining our team? PT ${companyName} is always looking for the best talent!\n\nFor job vacancy information, please contact us through the Contact Us page or visit our office directly in Semarang. 👷‍♂️`,
      },
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
        "hse",
      ],
      answer: {
        id: "Keselamatan adalah prioritas utama kami. Kami menerapkan:\n\n🔒 Standar K3L (Kesehatan, Keselamatan Kerja & Lingkungan)\n📋 Prosedur keselamatan ketat di setiap proyek\n👷 Pelatihan rutin untuk seluruh tim lapangan\n✅ Peralatan pelindung diri (APD) lengkap\n\nKeselamatan bukan hanya kebijakan, tetapi budaya kerja kami.",
        en: "Safety is our top priority. We implement:\n\n🔒 HSE (Health, Safety, and Environment) Standards\n📋 Strict safety procedures on every project\n👷 Regular training for all field teams\n✅ Complete personal protective equipment (PPE)\n\nSafety is not just a policy, it is our work culture.",
      },
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
        "collaboration",
        "partnership",
      ],
      answer: {
        id: "Kami sangat terbuka untuk kerja sama dan konsultasi proyek! 🤝\n\nLangkah untuk memulai:\n1️⃣ Hubungi kami via halaman Hubungi Kami\n2️⃣ Ceritakan kebutuhan proyek Anda\n3️⃣ Tim kami akan melakukan analisis dan konsultasi\n4️⃣ Kami berikan proposal yang sesuai kebutuhan\n\nMari wujudkan visi konstruksi Anda bersama kami!",
        en: "We are very open to project collaborations and consultations! 🤝\n\nSteps to get started:\n1️⃣ Contact us via the Contact Us page\n2️⃣ Tell us your project needs\n3️⃣ Our team will conduct analysis and consultation\n4️⃣ We will provide a proposal tailored to your needs\n\nLet's bring your construction vision to life with us!",
      },
    },
    {
      topic: "motto",
      keywords: ["motto", "slogan", "tagline", "semboyan"],
      answer: {
        id: 'Motto kami: "Memberi Kepuasan Kepada Relasi" 🌟\n\nMotto ini mencerminkan komitmen kami untuk selalu mengutamakan kepuasan klien dan mitra kerja dalam setiap proyek yang kami jalankan.',
        en: 'Our motto: "Providing Satisfaction to Our Partners" 🌟\n\nThis motto reflects our commitment to always prioritize client and partner satisfaction in every project we undertake.',
      },
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
        "working hours",
        "open",
      ],
      answer: {
        id: `🕒 Jam Operasional PT ${companyName}:\n\n• Senin - Jumat: 08.00 - 17.00 WIB\n• Sabtu: 08.00 - 12.00 WIB\n• Minggu & Hari Libur Nasional: Tutup\n\nSilakan kunjungi atau hubungi kami pada jam tersebut untuk respon terbaik.`,
        en: `🕒 PT ${companyName} Operating Hours:\n\n• Monday - Friday: 08.00 - 17.00 WIB\n• Saturday: 08.00 - 12.00 WIB\n• Sunday & Public Holidays: Closed\n\nPlease visit or contact us during these hours for the best response.`,
      },
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
        "subsidiary",
        "network",
      ],
      answer: {
        id: `PT ${companyName} bersinergi dengan jejaring bisnis kami, salah satunya adalah:\n\n🏢 PT Maharani Globalindo\nPerusahaan yang berbasis di Semarang yang bergerak dalam dua lini utama: Jasa Konstruksi berskala nasional dan penyelenggaraan perjalanan ibadah Umrah terpercaya.`,
        en: `PT ${companyName} synergizes with our business network, one of which is:\n\n🏢 PT Maharani Globalindo\nA Semarang-based company operating in two main lines: national-scale Construction Services and trusted Umrah pilgrimage travel arrangements.`,
      },
    },
    {
      topic: "sejarah",
      keywords: [
        "sejarah",
        "kapan berdiri",
        "didirikan",
        "asal usul",
        "perjalanan",
        "history",
        "founded",
      ],
      answer: {
        id: `PT ${companyName} memiliki sejarah panjang lebih dari 25 tahun di Indonesia. Didirikan dengan komitmen kuat untuk memajukan pembangunan infrastruktur nasional, kami bertransformasi menjadi kontraktor terpercaya dengan puluhan proyek sukses berskala nasional.`,
        en: `PT ${companyName} has a long history of over 25 years in Indonesia. Founded with a strong commitment to advancing national infrastructure development, we have transformed into a trusted contractor with dozens of successful national-scale projects.`,
      },
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
        "advantage",
        "why choose",
      ],
      answer: {
        id: `Mengapa memilih PT ${companyName}?\n\n💯 Berpengalaman 25+ tahun di bidang infrastruktur\n🏆 Hasil konstruksi berstandar kualitas tinggi\n👷 Didukung oleh 200+ SDM ahli dan bersertifikat\n🛡️ Komitmen keselamatan K3L yang ketat\n🤝 Transparan, jujur, dan berintegritas`,
        en: `Why choose PT ${companyName}?\n\n💯 25+ years of experience in infrastructure\n🏆 High-quality standard construction results\n👷 Supported by 200+ certified experts\n🛡️ Strict HSE safety commitment\n🤝 Transparent, honest, and full of integrity`,
      },
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
        "certification",
        "license",
      ],
      answer: {
        id: `PT ${companyName} memiliki legalitas lengkap dan sertifikasi industri standar nasional & internasional untuk memastikan setiap proyek dikerjakan secara aman, legal, dan berkualitas tinggi.`,
        en: `PT ${companyName} has complete legality and national & international standard industry certifications to ensure every project is executed safely, legally, and with high quality.`,
      },
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
        "region",
        "coverage",
      ],
      answer: {
        id: "Jangkauan layanan kami bersifat NASIONAL 🇮🇩.\n\nKami melayani proyek konstruksi di berbagai wilayah di seluruh Indonesia, baik di dalam pulau Jawa maupun luar pulau Jawa, didukung oleh logistik dan manajemen rantai pasok yang andal.",
        en: "Our service coverage is NATIONAL 🇮🇩.\n\nWe serve construction projects in various regions throughout Indonesia, both inside and outside Java, supported by reliable logistics and supply chain management.",
      },
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
        "client",
        "clients",
      ],
      answer: {
        id: "Kami melayani berbagai segmen klien, termasuk:\n\n🏢 Instansi Pemerintah (Kementerian & Dinas Pekerjaan Umum)\n🏛️ BUMN (Badan Usaha Milik Negara)\n🏬 Perusahaan Swasta Nasional & Multinasional\n🏘️ Pengembang Properti & Perorangan",
        en: "We serve various client segments, including:\n\n🏢 Government Agencies (Ministries & Public Works Departments)\n🏛️ SOEs (State-Owned Enterprises)\n🏬 National & Multinational Private Companies\n🏘️ Property Developers & Individuals",
      },
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
        "application",
        "system",
      ],
      answer: {
        id: `Portal Aplikasi SCS merupakan sistem internal yang digunakan khusus oleh manajemen dan karyawan PT ${companyName} untuk kebutuhan koordinasi proyek, administrasi, dan operasional internal.`,
        en: `The SCS Application Portal is an internal system used specifically by the management and employees of PT ${companyName} for project coordination, administration, and internal operational needs.`,
      },
    },
    {
      topic: "sop",
      keywords: [
        "sop",
        "standard operating",
        "prosedur",
        "panduan kerja",
        "aturan",
        "procedure",
      ],
      answer: {
        id: `SOP (Standard Operating Procedure) PT ${companyName} adalah dokumen panduan resmi bagi tim kami di lapangan maupun kantor untuk memastikan standar keselamatan, efisiensi kerja, dan kualitas konstruksi tetap terjaga di setiap proyek.`,
        en: `The SOP (Standard Operating Procedure) of PT ${companyName} is the official guide document for our team in the field and office to ensure safety standards, work efficiency, and construction quality are maintained in every project.`,
      },
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
        "method",
        "technology",
      ],
      answer: {
        id: "Kami mengadopsi metode konstruksi modern & berkelanjutan, termasuk:\n\n📐 Pemanfaatan BIM (Building Information Modeling)\n⚙️ Alat konstruksi berspesifikasi tinggi\n🍃 Praktik Green Construction untuk meminimalkan dampak lingkungan\n⚡ Manajemen waktu proyek yang ketat berbasis digital",
        en: "We adopt modern & sustainable construction methods, including:\n\n📐 Utilization of BIM (Building Information Modeling)\n⚙️ High-specification construction equipment\n🍃 Green Construction practices to minimize environmental impact\n⚡ Strict digital-based project time management",
      },
    },
  ];

  return kb.map((entry) => ({
    topic: entry.topic,
    keywords: entry.keywords,
    answer: entry.answer[lang],
  }));
}

// ═══════════════════════════════════════════════════════════
// ANAK PERTANYAAN (DYNAMIC FAQ TREE)
// ═══════════════════════════════════════════════════════════
const FAQ_TREE = {
  default: {
    id: [
      "Apa itu PT SCS?",
      "Apa saja layanan yang ditawarkan?",
      "Di mana lokasi kantor?",
    ],
    en: [
      "What is PT SCS?",
      "What services are offered?",
      "Where is the office located?",
    ],
  },
  profil_perusahaan: {
    id: [
      "Apa visi dan misi perusahaan?",
      "Berapa lama pengalamannya?",
      "Siapa saja klien SCS?",
    ],
    en: [
      "What is the company's vision and mission?",
      "How much industry experience?",
      "Who are SCS's clients?",
    ],
  },
  layanan: {
    id: [
      "Cek contoh proyek yang pernah dikerjakan",
      "Sertifikasi dan legalitas",
      "Metode kerja yang digunakan",
    ],
    en: [
      "Check examples of past projects",
      "Certification and legality",
      "Working methods used",
    ],
  },
  lokasi: {
    id: [
      "Bagaimana cara menghubungi?",
      "Jam operasional kantor?",
      "Bisa jangkau wilayah luar kota?",
    ],
    en: [
      "How to contact you?",
      "Office operating hours?",
      "Can you reach outside regions?",
    ],
  },
  arti_nama: {
    id: [
      "Nilai dan budaya perusahaan?",
      "Sejarah berdirinya perusahaan",
      "Siapa yang membuat website ini?",
    ],
    en: [
      "Company values and culture?",
      "History of the company",
      "Who built this website?",
    ],
  },
};

function getDynamicFaq(lang, currentTopic) {
  let faqs = FAQ_TREE[currentTopic] || FAQ_TREE["default"];
  return faqs[lang];
}

// ═══════════════════════════════════════════════════════════
// SMART MATCHING ENGINE (Logika Inti Diperbaiki)
// ═══════════════════════════════════════════════════════════
function findBestAnswer(input, knowledgeBase) {
  const lower = input.toLowerCase().replace(/[?!.,]/g, "");

  // MASALAH 4 (Bagian 1): Filter stopwords agar tidak ikut diproses Levenshtein
  const words = lower
    .split(/\s+/)
    .filter((word) => !STOPWORDS.includes(word) && word.length > 0);

  let bestMatch = null;
  let bestScore = 0;

  for (const entry of knowledgeBase) {
    let score = 0;

    for (const keyword of entry.keywords) {
      // MASALAH 2: Menggunakan Regex \b agar "visi" tidak me-match "televisi"
      const exactMatchRegex = new RegExp("\\b" + keyword + "\\b", "i");

      if (exactMatchRegex.test(lower)) {
        score += 5; // Poin besar jika keyword-nya match sempurna 1 frasa utuh
        continue; // MASALAH 3: Hentikan pengecekan kata-per-kata di bawahnya agar skor tidak ganda
      }

      // Jika tidak match frasa utuh, pecah keyword dan lakukan Fuzzy per kata
      const kwWords = keyword.split(/\s+/);
      for (const kw of kwWords) {
        if (kw.length < 3) continue; // FITUR 3: Skip keyword < 3 huruf dari proses fuzzy

        for (const word of words) {
          if (word.length < 3) continue; // FITUR 3: Skip input user < 3 huruf dari proses fuzzy

          if (isFuzzyMatch(word, kw)) {
            score += 2;
            break; // MASALAH 4: Jika 1 kata user sudah match dgn kw ini, stop perulangan agar tidak dihitung dua kali
          }
        }
      }
    }

    if (score > bestScore) {
      bestScore = score;
      bestMatch = entry;
    }
  }

  // FITUR 2: Naikkan threshold dinamis ke skor 4 (Setara dengan 1 frasa utuh ATAU 2 kata typo)
  return bestScore >= 4 ? bestMatch : null;
}

const GREETINGS = {
  patterns: [
    "halo",
    "hai",
    "hi",
    "hello",
    "hey",
    "selamat pagi",
    "selamat siang",
    "selamat sore",
    "selamat malam",
    "pagi",
    "siang",
    "sore",
    "malam",
    "assalamualaikum",
    "apa kabar",
    "good morning",
    "good afternoon",
    "good evening",
    "konnichiwa",
    "ohayou",
    "ohayo",
    "konbanwa",
    "how are you",
  ],
  responses: {
    id: [
      "Halo! 😊 Saya SCS Pintar. Ada yang bisa saya bantu tentang PT Sinar Cerah Sempurna?",
      "Hai! 👋 Senang bisa membantu Anda. Mau tanya apa tentang SCS ke SCS Pintar?",
    ],
    en: [
      "Hello! 😊 I am SCS Pintar. How can I help you regarding PT Sinar Cerah Sempurna?",
      "Hi! 👋 Glad to help. What would you like to ask SCS Pintar about SCS?",
    ],
  },
};

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
    "who made",
  ],
  response: {
    id: {
      text: "🎉 Easter egg unlocked!\n\nWebsite ini dibuat dengan ❤️ oleh tim developer keren ini:\n\n👨‍💻 Tim Web Developer SCS\n\nMereka adalah otak di balik layar yang membangun website PT Sinar Cerah Sempurna dari nol! 🚀",
      image: "/team-photo.jpg",
    },
    en: {
      text: "🎉 Easter egg unlocked!\n\nThis website was built with ❤️ by this awesome developer team:\n\n👨‍💻 SCS Web Developer Team\n\nThey are the brains behind the scenes who built the PT Sinar Cerah Sempurna website from scratch! 🚀",
      image: "/team-photo.jpg",
    },
  },
};

function checkSmallTalk(input, lang) {
  const lower = input.toLowerCase().replace(/[?!.,]/g, "");
  const words = lower.split(/\s+/);

  const isMatch = GREETINGS.patterns.some((p) => {
    if (p.includes(" ")) return lower.includes(p);
    return words.some((w) => w === p || isFuzzyMatch(w, p));
  });

  if (isMatch) {
    return GREETINGS.responses[lang][
      Math.floor(Math.random() * GREETINGS.responses[lang].length)
    ];
  }
  return null;
}

function checkEasterEgg(input) {
  const lower = input.toLowerCase();
  return EASTER_EGG.patterns.some(
    (p) => lower.includes(p) || isFuzzyMatch(lower, p),
  );
}

function generateResponse(input, settings, lang) {
  if (checkEasterEgg(input)) {
    return {
      text: EASTER_EGG.response[lang].text,
      image: EASTER_EGG.response[lang].image,
      type: "easter_egg",
      topic: "default",
    };
  }

  const knowledgeBase = getDynamicKnowledgeBase(settings, lang);
  const match = findBestAnswer(input, knowledgeBase);
  if (match) return { text: match.answer, type: "bot", topic: match.topic };

  const smallTalk = checkSmallTalk(input, lang);
  if (smallTalk) return { text: smallTalk, type: "bot", topic: "default" };

  const fallbacks = {
    id: [
      "Hmm, SCS Pintar belum menangkap maksudnya. 🤔 Coba tanyakan tentang layanan, lokasi, atau profil PT Sinar Cerah Sempurna!",
    ],
    en: [
      "Hmm, SCS Pintar didn't quite get that. 🤔 Try asking about the services, location, or profile of PT Sinar Cerah Sempurna!",
    ],
  };
  return { text: fallbacks[lang][0], type: "bot", topic: "default" };
}

// ═══════════════════════════════════════════════════════════
// COMPONENT UTAMA
// ═══════════════════════════════════════════════════════════
export default function ChatbotButton({ settings = {} }) {
  const [isOpen, setIsOpen] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);
  const [lang, setLang] = useState("id");

  const [messages, setMessages] = useState([
    {
      id: "welcome-msg",
      type: "bot",
      isWelcome: true,
      text: "Halo! 👋 Saya SCS Pintar, asisten virtual PT Sinar Cerah Sempurna.\n\nSilakan pilih pertanyaan di bawah atau ketik langsung apa yang ingin Anda tanyakan!",
      reaction: null,
    },
  ]);

  const [showFaq, setShowFaq] = useState(true);
  const [activeTopic, setActiveTopic] = useState("default");
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const [feedbackState, setFeedbackState] = useState("none");

  const messagesEndRef = useRef(null);
  const inactivityTimerRef = useRef(null);

  const langRef = useRef(lang);
  useEffect(() => {
    langRef.current = lang;
  }, [lang]);

  const isOpenRef = useRef(isOpen);
  useEffect(() => {
    isOpenRef.current = isOpen;
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping, feedbackState, activeTopic]);

  const triggerFeedback = (delay = 0) => {
    const feedbackExists = messages.some((m) => m.type === "feedback_prompt");
    if (feedbackExists) return;

    setFeedbackState((prev) => {
      if (prev !== "none") return prev;

      setTimeout(() => {
        setMessages((msgs) => {
          if (msgs.some((m) => m.type === "feedback_prompt")) return msgs;

          return [
            ...msgs,
            {
              id: "feedback-prompt",
              type: "feedback_prompt",
              text:
                langRef.current === "id"
                  ? "Apakah jawaban SCS Pintar membantu sejauh ini?"
                  : "Has SCS Pintar been helpful so far?",
            },
          ];
        });

        if (!isOpenRef.current) {
          setHasUnread(true);
        }
      }, delay);

      return "prompted";
    });
  };

  useEffect(() => {
    if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);

    const userHasInteracted = messages.some((m) => m.type === "user");

    if (userHasInteracted && feedbackState === "none") {
      inactivityTimerRef.current = setTimeout(() => {
        triggerFeedback(0);
      }, 180000);
    }

    return () => clearTimeout(inactivityTimerRef.current);
  }, [messages, feedbackState]);

  const sendFeedbackToAdmin = async (type, detail = "") => {
    try {
      await fetch("/api/chatbot/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          detail,
          timestamp: new Date().toISOString(),
        }),
      });
    } catch (e) {
      console.error("Failed to send feedback", e);
    }
  };

  const addBotMessage = (responseObj) => {
    setIsTyping(true);
    const textLength = responseObj.text.length;
    const delay = Math.min(400 + textLength * 2, 1500);

    setTimeout(() => {
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          type: responseObj.type || "bot",
          text: responseObj.text,
          image: responseObj.image,
          reaction: null,
        },
      ]);
    }, delay);
  };

  const processUserInput = (text) => {
    setMessages((prev) => [
      ...prev,
      { id: `user-${Date.now()}`, type: "user", text, reaction: null },
    ]);
    setInputValue("");
    setShowFaq(false);

    if (feedbackState === "awaiting_text") {
      addBotMessage({
        text:
          lang === "id"
            ? "Terima kasih atas masukannya! SCS Pintar akan belajar menjadi lebih baik. 🙏"
            : "Thank you for your feedback! SCS Pintar will learn to be better. 🙏",
        type: "bot",
      });
      setFeedbackState("done");
      sendFeedbackToAdmin("negative_suggestion", text);
      setTimeout(() => setShowFaq(true), 1800);
      return;
    }

    const responseData = generateResponse(text, settings, lang);
    addBotMessage(responseData);

    setActiveTopic(responseData.topic);
    setTimeout(() => setShowFaq(true), 1800);

    const isEndOfBranch =
      responseData.topic !== "default" && !FAQ_TREE[responseData.topic];

    if (isEndOfBranch) {
      triggerFeedback(3500);
    }
  };

  const handleFeedbackSelect = (emoji) => {
    sendFeedbackToAdmin("emoji_rating", emoji);

    if (emoji === "😢") {
      setFeedbackState("awaiting_text");
      addBotMessage({
        text:
          lang === "id"
            ? "Maaf jika jawaban SCS Pintar belum memuaskan. 😔 Boleh beritahu apa yang bisa diperbaiki?"
            : "Sorry if SCS Pintar's answer wasn't satisfactory. 😔 Could you tell me what can be improved?",
        type: "bot",
      });
    } else {
      setFeedbackState("done");
      addBotMessage({
        text:
          lang === "id"
            ? "Terima kasih atas tanggapannya! Senang bisa membantu. ✨"
            : "Thank you for the feedback! Happy to help. ✨",
        type: "bot",
      });
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && inputValue.trim()) {
      processUserInput(inputValue.trim());
    }
  };

  const toggleLanguage = () => {
    setLang((prevLang) => {
      const newLang = prevLang === "id" ? "en" : "id";
      setMessages((prevMessages) => {
        if (prevMessages.length === 1 && prevMessages[0].isWelcome) {
          return [
            {
              id: prevMessages[0].id,
              type: "bot",
              isWelcome: true,
              reaction: null,
              text:
                newLang === "id"
                  ? "Halo! 👋 Saya SCS Pintar, asisten virtual PT Sinar Cerah Sempurna.\n\nSilakan pilih pertanyaan di bawah atau ketik langsung apa yang ingin Anda tanyakan!"
                  : "Hello! 👋 I am SCS Pintar, PT Sinar Cerah Sempurna's virtual assistant.\n\nPlease select a question below or directly type what you want to ask!",
            },
          ];
        }
        return prevMessages;
      });
      return newLang;
    });
  };

  const toggleReaction = (msgId) => {
    setMessages((prev) =>
      prev.map((m) =>
        m.id === msgId ? { ...m, reaction: m.reaction ? null : "❤️" } : m,
      ),
    );
  };

  const handleToggleChat = () => {
    if (!isOpen) setHasUnread(false);
    setIsOpen(!isOpen);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end font-['Plus_Jakarta_Sans']">
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
            transition={{ type: "spring", damping: 24, stiffness: 220 }}
            className="bg-white shadow-2xl border border-neutral-200 overflow-hidden flex flex-col absolute bottom-[70px] right-0 origin-bottom-right"
          >
            <div className="w-[340px] h-[480px] flex flex-col justify-between shrink-0">
              {/* Header */}
              <div className="bg-[#004282] px-4 py-3.5 text-white flex items-center justify-between shrink-0 shadow-sm z-10">
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
                      SCS Pintar
                    </span>
                    <div className="flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-[10px] text-white/80">Online</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={toggleLanguage}
                  className="text-[11px] font-bold bg-white/20 px-2.5 py-1.5 rounded-md hover:bg-white/30 transition-colors border border-white/10 cursor-pointer"
                >
                  {lang === "id" ? "EN" : "ID"}
                </button>
              </div>

              {/* Area Pesan */}
              <div className="flex-grow p-4 overflow-y-auto overscroll-contain space-y-4 bg-[#f7f7f8] pb-6">
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, scale: 0.95, y: 12 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}
                  >
                    {msg.type === "feedback_prompt" ? (
                      <div className="flex flex-col gap-1.5 w-full items-start">
                        <div className="bg-white text-[#1E1E1E] border border-neutral-200 px-3.5 py-2.5 rounded-2xl rounded-bl-md shadow-sm max-w-[85%] text-[13px]">
                          {msg.text}
                        </div>
                        {feedbackState === "prompted" && (
                          <div className="flex gap-1.5 mt-0.5">
                            {["❤️", "👍", "😢"].map((emoji) => (
                              <button
                                key={emoji}
                                onClick={() => handleFeedbackSelect(emoji)}
                                className="bg-white border border-neutral-200 shadow-sm px-4 py-1.5 rounded-full text-sm hover:bg-blue-50 active:scale-95 transition-all flex items-center justify-center"
                              >
                                {emoji}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="relative group">
                        <div
                          className={`px-3.5 py-2.5 rounded-2xl text-[13px] leading-relaxed max-w-[240px] whitespace-pre-line relative ${
                            msg.type === "user"
                              ? "bg-[#004282] text-white rounded-br-md"
                              : "bg-white text-[#1E1E1E] border border-neutral-200 rounded-bl-md shadow-sm"
                          }`}
                        >
                          {msg.text}
                          {msg.image && (
                            <CldImg
                              src={msg.image}
                              alt="Image"
                              className="w-full rounded-xl mt-2 shadow-sm border border-neutral-100"
                            />
                          )}

                          {msg.reaction && (
                            <div
                              className={`absolute -bottom-2.5 ${
                                msg.type === "user" ? "right-2" : "left-2"
                              } bg-white border border-neutral-200 shadow-sm rounded-full px-1.5 py-0.5 text-[11px] z-10 scale-100 animate-in zoom-in-50`}
                            >
                              {msg.reaction}
                            </div>
                          )}
                        </div>

                        <button
                          onClick={() => toggleReaction(msg.id)}
                          className={`absolute bottom-0 opacity-0 group-hover:opacity-100 transition-opacity bg-white shadow-md border border-neutral-100 rounded-full p-1 text-xs z-10 hover:scale-110 ${
                            msg.type === "user" ? "-left-6" : "-right-6"
                          }`}
                          title="Love message"
                        >
                          ❤️
                        </button>
                      </div>
                    )}
                  </motion.div>
                ))}

                {isTyping && (
                  <div className="flex justify-start">
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
                  </div>
                )}

                <AnimatePresence>
                  {showFaq &&
                    !isTyping &&
                    feedbackState !== "awaiting_text" && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 4 }}
                        className="flex flex-wrap gap-1.5 pt-1"
                      >
                        {getDynamicFaq(lang, activeTopic).map((q, idx) => (
                          <button
                            key={idx}
                            onClick={() => processUserInput(q)}
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
              <div className="p-3 border-t border-neutral-200 bg-white flex gap-2 shrink-0 z-10">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={
                    feedbackState === "awaiting_text"
                      ? lang === "id"
                        ? "Ketik saran Anda..."
                        : "Type your suggestion..."
                      : lang === "id"
                        ? "Ketik pertanyaan Anda..."
                        : "Type your question..."
                  }
                  className="flex-grow border border-neutral-300 rounded-xl px-3.5 py-2.5 text-[13px] focus:outline-none focus:border-[#004282] focus:ring-1 focus:ring-[#004282]/20 transition-all"
                  autoFocus
                />
                <button
                  onClick={() => {
                    if (inputValue.trim()) processUserInput(inputValue.trim());
                  }}
                  disabled={!inputValue.trim()}
                  className="bg-[#004282] text-white px-4 py-2.5 rounded-xl text-[13px] font-bold hover:bg-blue-900 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  {lang === "id" ? "Kirim" : "Send"}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tombol Utama */}
      <button
        onClick={handleToggleChat}
        className="relative w-14 h-14 bg-yellow-400 hover:bg-yellow-500 text-[#004282] rounded-full shadow-xl transition-all duration-200 focus:outline-none group active:scale-95 flex items-center justify-center z-10 cursor-pointer"
      >
        {/* Titik Merah Notifikasi */}
        {hasUnread && !isOpen && (
          <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-red-500 border-2 border-white rounded-full"></span>
        )}

        <motion.svg
          animate={{ rotate: isOpen ? 180 : 0, scale: isOpen ? 0.95 : 1 }}
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
