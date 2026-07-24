import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import bcrypt from "bcryptjs";
import "dotenv/config";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Seeding database...");

  // Clean existing data to make script idempotent
  console.log("Cleaning existing data...");
  await prisma.visitStats.deleteMany();
  await prisma.uniqueVisitor.deleteMany();
  await prisma.pageContent.deleteMany();
  await prisma.setting.deleteMany();
  await prisma.partner.deleteMany();
  await prisma.statistic.deleteMany();
  await prisma.contact.deleteMany();
  await prisma.news.deleteMany();
  await prisma.project.deleteMany();
  await prisma.about.deleteMany();
  await prisma.hero.deleteMany();
  await prisma.admin.deleteMany();
  console.log("✅ Cleaned existing data");

  // 1. Create Admin Account
  // Credentials diambil dari environment variable — jangan hardcode!
  const adminUsername = process.env.ADMIN_USERNAME || "admin";
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword) {
    console.warn(
      "⚠️  ADMIN_PASSWORD tidak dikonfigurasi! " +
      "Set ADMIN_PASSWORD di .env Lewati pembuatan admin..."
    );
  } else {
    const hashedPassword = await bcrypt.hash(adminPassword, 12);
    await prisma.admin.upsert({
      where: { username: adminUsername },
      update: {},
      create: {
        username: adminUsername,
        password: hashedPassword,
        role: "ADMIN",
      },
    });
    console.log(`✅ Admin account "${adminUsername}" created`);
  }

  // 2. Seed Heroes (per page)
  const heroes = [
    { page: "home", title: "**Integrity** isn't just a **policy**—it's the **standard** we build by. Your **trust** is our greatest **structure**.", subtitle: "**PT SINAR CERAH SEMPURNA**", description: "Perusahaan **konstruksi** dan **infrastruktur** terpercaya yang berpengalaman dalam pembangunan **gedung**, **jalan**, **jembatan**, dan berbagai proyek strategis lainnya.", imageUrl: "/hero-bg.svg", isActive: true },
    { page: "about", title: "Membangun dengan **Kepercayaan**, Berkarya dengan **Kualitas**.", subtitle: "Berpegang teguh pada motto **'Memberi Kepuasan Kepada Relasi'**, kami terus membangun **kepercayaan** dalam industri **konstruksi**.", description: "", imageUrl: "/hero-bg.svg", isActive: true },
    { page: "projects", title: "**Visi** Kami dalam **Karya**", subtitle: "", description: "**Dedikasi** kami tertuang dalam setiap **detail** proyek. Kami menggabungkan **inovasi** konstruksi dengan standar **kualitas** tertinggi.", imageUrl: "/hero-bg.svg", isActive: true },
    { page: "news", title: "**Kilas Balik** & **Berita Terkini**", subtitle: "", description: "Simak **perjalanan** dan **perkembangan** terbaru dari proyek-proyek **strategis** kami.", imageUrl: "/hero-bg.svg", isActive: true },
  ];
  for (const hero of heroes) {
    await prisma.hero.create({ data: hero });
  }
  console.log("✅ Heroes seeded (home, about, projects, news)");

  // 3. Seed About
  await prisma.about.create({
    data: {
      title: "Tentang PT Sinar Cerah Sempurna",
      subtitle: "Berpegang teguh pada motto 'Memberi Kepuasan Kepada Relasi', kami terus membangun kepercayaan dalam industri konstruksi melalui dedikasi tinggi.",
      content: "PT Sinar Cerah Sempurna adalah perusahaan konstruksi dan infrastruktur yang berpengalaman dalam pembangunan gedung, jalan, jembatan, dan berbagai proyek infrastruktur lainnya di Indonesia.",
      vision: "Menjadi perusahaan konstruksi dan infrastruktur terdepan serta terpercaya di Indonesia, yang diakui karena keunggulan dalam kualitas, keselamatan, dan pembangunan berkelanjutan.",
      mission: "Memberikan layanan konstruksi berkualitas tinggi yang melampaui ekspektasi klien dan memenuhi standar internasional.\nMenerapkan praktik terbaik dalam pengelolaan kesehatan, keselamatan kerja, dan lingkungan pada setiap proyek.\nMendorong inovasi melalui adopsi teknologi dan metodologi konstruksi mutakhir.\nMembangun hubungan jangka panjang dengan klien, mitra, dan pemangku kepentingan berdasarkan kepercayaan dan transparansi.\nMengembangkan kapabilitas profesional tim kami melalui pelatihan berkelanjutan dan pengembangan karir.\nBerkontribusi pada pembangunan berkelanjutan infrastruktur dan lingkungan binaan Indonesia.",
    },
  });
  console.log("✅ About seeded");

  // Shared gallery image sets
  const G1 = ["/carousel1.svg", "/carousel2.svg", "/carousel3.svg"];
  const G2 = ["/carousel2.svg", "/carousel3.svg", "/carousel1.svg"];
  const G3 = ["/carousel3.svg", "/carousel1.svg", "/carousel2.svg"];
  const G4 = ["/carousel1.svg", "/carousel3.svg"];
  const G5 = ["/carousel2.svg", "/carousel1.svg"];

  // 4. Seed Projects (20 items)
  const projects = [
    { title: "Renovasi Eks Kantor menjadi Gedung Paviliun", description: "Proyek renovasi dan transformasi eks kantor menjadi gedung paviliun rumah sakit dengan standar kualitas tinggi.", category: "Rumah Sakit", location: "RSUD Aji Muhammad Parikesit", client: "Pemerintah Kabupaten Kutai Kartanegara", imageUrl: "/carousel1.svg", completedDate: "2025", isActive: true, galleryImages: G1 },
    { title: "Pembangunan Gedung Rektorat", description: "Pembangunan gedung rektorat modern dengan konsep hijau dan berkelanjutan.", category: "Gedung Pendidikan", location: "Universitas Diponegoro", client: "Kemenristekdikti", imageUrl: "/carousel2.svg", completedDate: "2024", isActive: true, galleryImages: G2 },
    { title: "Ekspansi Mall Central", description: "Proyek ekspansi pusat perbelanjaan dengan penambahan area ritel dan fasilitas hiburan.", category: "Pusat Perbelanjaan", location: "Semarang Tengah", client: "PT Retail Indo", imageUrl: "/carousel3.svg", completedDate: "2024", isActive: true, galleryImages: G3 },
    { title: "Pembangunan Jembatan Penghubung Kawasan Industri", description: "Proyek pembangunan jembatan sepanjang 1,2 km yang menghubungkan dua kawasan industri strategis untuk memperlancar distribusi logistik.", category: "Infrastruktur Publik", location: "Kawasan Industri Kendal", client: "Pemerintah Provinsi Jawa Tengah", imageUrl: "/carousel1.svg", completedDate: "2025", isActive: true, galleryImages: G4 },
    { title: "Gedung Olahraga Multifungsi", description: "Pembangunan GOR multifungsi dengan kapasitas 5.000 penonton yang dilengkapi fasilitas olahraga modern dan area parkir luas.", category: "Fasilitas Olahraga", location: "Semarang", client: "Pemerintah Kota Semarang", imageUrl: "/carousel2.svg", completedDate: "2024", isActive: true, galleryImages: G5 },
    { title: "Perumahan Green Residence", description: "Pembangunan kompleks perumahan hijau dengan konsep ramah lingkungan mencakup 500 unit rumah tapak dan fasilitas umum.", category: "Perumahan", location: "Ungaran, Semarang", client: "PT Properti Hijau Nusantara", imageUrl: "/carousel3.svg", completedDate: "2025", isActive: true, galleryImages: G1 },
    { title: "Gedung Perkantoran BizCentre Tower", description: "Pembangunan gedung perkantoran 15 lantai dengan standar internasional, dilengkapi smart building system dan area komersial.", category: "Komersial & Perkantoran", location: "Semarang", client: "PT BizCentre Properti", imageUrl: "/carousel1.svg", completedDate: "2024", isActive: true, galleryImages: G2 },
    { title: "Pembangunan Rumah Sakit Tipe C", description: "Proyek pembangunan rumah sakit tipe C dengan kapasitas 150 tempat tidur dan peralatan medis modern.", category: "Rumah Sakit", location: "Kabupaten Batang", client: "Pemerintah Kabupaten Batang", imageUrl: "/carousel2.svg", completedDate: "2025", isActive: true, galleryImages: G3 },
    { title: "Renovasi Gedung Perpustakaan Universitas", description: "Renovasi total gedung perpustakaan universitas menjadi pusat belajar modern dengan area digital dan ruang diskusi.", category: "Gedung Pendidikan", location: "Universitas Semarang", client: "Yayasan Pendidikan Semarang", imageUrl: "/carousel3.svg", completedDate: "2024", isActive: true, galleryImages: G4 },
    { title: "Pembangunan Jalan Tol Semarang-Demak", description: "Proyek pembangunan jalan tol sepanjang 27 km yang menghubungkan Kota Semarang dengan Kabupaten Demak.", category: "Infrastruktur Publik", location: "Semarang-Demak", client: "Pemerintah Pusat", imageUrl: "/carousel1.svg", completedDate: "2025", isActive: true, galleryImages: G5 },
    { title: "Renovasi Stadion Olahraga Kota", description: "Renovasi total stadion olahraga kota dengan standar internasional untuk pertandingan dan acara publik.", category: "Fasilitas Olahraga", location: "Semarang", client: "Pemerintah Kota Semarang", imageUrl: "/carousel2.svg", completedDate: "2024", isActive: true, galleryImages: G1 },
    { title: "Kompleks Perumahan Citra Garden", description: "Pembangunan kompleks perumahan modern dengan 300 unit rumah dan fasilitas cluster eksklusif.", category: "Perumahan", location: "Semarang Barat", client: "PT Citra Properti Mandiri", imageUrl: "/carousel3.svg", completedDate: "2025", isActive: true, galleryImages: G2 },
    { title: "Gedung Parkir & Pusat Perbelanjaan", description: "Pembangunan gedung parkir bertingkat yang terintegrasi dengan pusat perbelanjaan di pusat kota.", category: "Pusat Perbelanjaan", location: "Simpang Lima Semarang", client: "PT Parkir Nusantara", imageUrl: "/carousel1.svg", completedDate: "2024", isActive: true, galleryImages: G3 },
    { title: "Pusat Inovasi & Teknologi Universitas", description: "Pembangunan pusat inovasi dan teknologi sebagai wadah riset dan pengembangan mahasiswa.", category: "Gedung Pendidikan", location: "Universitas Negeri Semarang", client: "Kemenristekdikti", imageUrl: "/carousel2.svg", completedDate: "2025", isActive: true, galleryImages: G4 },
    { title: "Pembangunan RSUD Kabupaten", description: "Pembangunan rumah sakit umum daerah baru dengan kapasitas 200 tempat tidur dan fasilitas kesehatan lengkap.", category: "Rumah Sakit", location: "Kabupaten Kendal", client: "Pemerintah Kabupaten Kendal", imageUrl: "/carousel3.svg", completedDate: "2025", isActive: true, galleryImages: G5 },
    { title: "Gedung Serbaguna Kecamatan", description: "Pembangunan gedung serbaguna untuk kegiatan masyarakat dan pelayanan kecamatan.", category: "Lainnya", location: "Kecamatan Tembalang Semarang", client: "Pemerintah Kota Semarang", imageUrl: "/carousel1.svg", completedDate: "2024", isActive: true, galleryImages: G1 },
    { title: "Kawasan Industri Terpadu", description: "Pembangunan kawasan industri terpadu dengan infrastruktur lengkap dan sistem pengelolaan limbah terpusat.", category: "Infrastruktur Publik", location: "Kawasan Industri Terpadu Batang", client: "Pemerintah Provinsi Jawa Tengah", imageUrl: "/carousel2.svg", completedDate: "2025", isActive: true, galleryImages: G2 },
    { title: "Gedung Olahraga Basket Indoor", description: "Pembangunan gedung olahraga basket indoor standar FIBA dengan kapasitas 3.000 penonton.", category: "Fasilitas Olahraga", location: "Semarang", client: "KONI Jawa Tengah", imageUrl: "/carousel3.svg", completedDate: "2024", isActive: true, galleryImages: G3 },
    { title: "Perumahan Griya Asri Sejahtera", description: "Pembangunan perumahan subsidi dengan 600 unit rumah bagi masyarakat berpenghasilan rendah.", category: "Perumahan", location: "Kabupaten Demak", client: "Kementerian PUPR", imageUrl: "/carousel1.svg", completedDate: "2025", isActive: true, galleryImages: G4 },
    { title: "Gedung Kantor & Convention Hall", description: "Pembangunan gedung perkantoran 8 lantai dilengkapi convention hall untuk acara korporasi dan publik.", category: "Komersial & Perkantoran", location: "Semarang", client: "PT Graha Utama Properti", imageUrl: "/carousel2.svg", completedDate: "2024", isActive: true, galleryImages: G5 },
  ];
  for (const project of projects) {
    await prisma.project.create({ data: project });
  }
  console.log("✅ Projects seeded");

  // 5. Seed News (20 items)
  const newsArticles = [
    { slug: "peresmian-kantor-baru", title: "Peresmian Kantor Baru PT Sinar Cerah Sempurna", excerpt: "Peresmian kantor baru ini tidak hanya menandai bertambahnya fasilitas operasional, tetapi juga komitmen kami untuk terus berkembang.", content: "PT Sinar Cerah Sempurna resmi meresmikan kantor barunya di Semarang pada bulan Juni 2025. Peresmian ini menandai babak baru dalam perjalanan perusahaan untuk memberikan pelayanan terbaik kepada seluruh klien dan mitra kerja. Kantor baru ini dilengkapi dengan fasilitas modern dan ruang kerja yang nyaman untuk mendukung produktivitas tim.", imageUrl: "/carousel1.svg",      status: "PUBLISHED" as const, publishedAt: new Date("2025-06-15"), galleryImages: G1 },
    { slug: "penghargaan-kontraktor-terbaik", title: "Penghargaan Kontraktor Terbaik 2025", excerpt: "SCS berhasil meraih penghargaan nasional berkat komitmen pada standar keselamatan dan kualitas.", content: "PT Sinar Cerah Sempurna berhasil meraih penghargaan sebagai Kontraktor Terbaik tahun 2025 dari Kementerian Pekerjaan Umum dan Perumahan Rakyat. Penghargaan ini diberikan atas dedikasi perusahaan dalam menerapkan standar keselamatan kerja yang tinggi dan kualitas konstruksi yang unggul di setiap proyek.", imageUrl: "/carousel2.svg",      status: "PUBLISHED" as const, publishedAt: new Date("2025-03-20"), galleryImages: G2 },
    { slug: "penerapan-beton-ramah-lingkungan", title: "Penerapan Beton Ramah Lingkungan", excerpt: "Implementasi material konstruksi hijau untuk mendukung kelestarian alam dan pembangunan berkelanjutan.", content: "SCS mulai mengimplementasikan penggunaan beton ramah lingkungan yang memiliki jejak karbon lebih rendah dalam proyek-proyek terbaru. Inovasi ini merupakan bagian dari komitmen perusahaan untuk mendukung pembangunan berkelanjutan dan mengurangi dampak lingkungan dari industri konstruksi.", imageUrl: "/carousel3.svg",      status: "PUBLISHED" as const, publishedAt: new Date("2025-01-10"), galleryImages: G3 },
    { slug: "kolaborasi-strategis-bumn", title: "Kolaborasi Strategis dengan BUMN Industri Konstruksi", excerpt: "SCS menjalin kemitraan strategis dengan BUMN terkemuka untuk pengembangan proyek infrastruktur nasional.", content: "PT Sinar Cerah Sempurna resmi menjalin kemitraan strategis dengan beberapa BUMN terkemuka di bidang konstruksi dan infrastruktur. Kolaborasi ini bertujuan untuk memperkuat kapasitas perusahaan dalam mengerjakan proyek-proyek berskala nasional dan meningkatkan transfer teknologi.", imageUrl: "/carousel1.svg",      status: "PUBLISHED" as const, publishedAt: new Date("2025-05-10"), galleryImages: G4 },
    { slug: "program-csr-pembangunan-sekolah", title: "Program CSR: Pembangunan Sekolah di Daerah Terpencil", excerpt: "Komitmen SCS dalam mendukung pendidikan melalui pembangunan fasilitas sekolah di daerah terpencil.", content: "Melalui program Corporate Social Responsibility (CSR), PT Sinar Cerah Sempurna membangun fasilitas sekolah di daerah terpencil di Kabupaten Pekalongan. Program ini merupakan wujud komitmen perusahaan dalam mendukung pemerataan pendidikan dan pembangunan di Indonesia.", imageUrl: "/carousel2.svg",      status: "PUBLISHED" as const, publishedAt: new Date("2025-04-05"), galleryImages: G5 },
    { slug: "sertifikasi-iso-terbaru", title: "SCS Raih Sertifikasi ISO 45001:2024", excerpt: "Perusahaan berhasil meraih sertifikasi Sistem Manajemen Kesehatan dan Keselamatan Kerja terbaru.", content: "PT Sinar Cerah Sempurna berhasil meraih sertifikasi ISO 45001:2024 untuk Sistem Manajemen Kesehatan dan Keselamatan Kerja. Sertifikasi ini menegaskan komitmen perusahaan dalam menerapkan standar keselamatan kerja tertinggi di semua lini operasional.", imageUrl: "/carousel3.svg",      status: "PUBLISHED" as const, publishedAt: new Date("2024-12-01"), galleryImages: G1 },
    { slug: "proyek-jembatan-selesai-tepat-waktu", title: "Proyek Jembatan Penghubung Selesai Tepat Waktu", excerpt: "Pembangunan jembatan penghubung kawasan industri selesai sesuai target dengan kualitas terbaik.", content: "PT Sinar Cerah Sempurna berhasil menyelesaikan pembangunan jembatan penghubung kawasan industri tepat waktu. Proyek yang berlangsung selama 18 bulan ini merupakan salah satu proyek infrastruktur strategis yang mendukung kelancaran distribusi logistik di kawasan industri.", imageUrl: "/carousel1.svg",      status: "PUBLISHED" as const, publishedAt: new Date("2025-02-15"), galleryImages: G2 },
    { slug: "inovasi-teknologi-bim", title: "Implementasi Teknologi BIM dalam Proyek Konstruksi", excerpt: "SCS mengadopsi teknologi Building Information Modeling (BIM) untuk meningkatkan efisiensi dan akurasi proyek.", content: "PT Sinar Cerah Sempurna resmi mengadopsi teknologi Building Information Modeling (BIM) dalam seluruh tahapan proyek konstruksi. Implementasi BIM memungkinkan perencanaan yang lebih akurat, deteksi dini potensi masalah, dan efisiensi biaya yang lebih baik.", imageUrl: "/carousel2.svg",      status: "PUBLISHED" as const, publishedAt: new Date("2024-10-20"), galleryImages: G3 },
    { slug: "perayaan-hut-perusahaan-ke-25", title: "Perayaan HUT ke-25 PT Sinar Cerah Sempurna", excerpt: "Perusahaan merayakan 25 tahun perjalanan dalam industri konstruksi dengan berbagai pencapaian membanggakan.", content: "PT Sinar Cerah Sempurna merayakan hari jadinya yang ke-25 dengan penuh syukur dan kebanggaan. Selama seperempat abad, perusahaan telah menyelesaikan puluhan proyek konstruksi dan infrastruktur di seluruh Indonesia. Perayaan ini menjadi momentum untuk merefleksikan perjalanan dan merencanakan masa depan yang lebih cerah.", imageUrl: "/carousel3.svg",      status: "PUBLISHED" as const, publishedAt: new Date("2024-08-08"), galleryImages: G4 },
    { slug: "pelatihan-keselamatan-kerja", title: "Pelatihan Keselamatan Kerja untuk Seluruh Karyawan", excerpt: "SCS mengadakan pelatihan K3 secara menyeluruh untuk meningkatkan standar keselamatan di lapangan.", content: "PT Sinar Cerah Sempurna mengadakan pelatihan Keselamatan dan Kesehatan Kerja (K3) bagi seluruh karyawan dan pekerja lapangan. Pelatihan ini mencakup prosedur tanggap darurat, penggunaan APD, dan identifikasi bahaya di lingkungan kerja. Program ini merupakan bagian dari komitmen perusahaan untuk mencapai zero accident.", imageUrl: "/carousel1.svg",      status: "PUBLISHED" as const, publishedAt: new Date("2025-07-01"), galleryImages: G5 },
    { slug: "pembangunan-rsud-tahap-ii", title: "Pembangunan RSUD Tahap II Dimulai", excerpt: "Proyek pembangunan RSUD di Kabupaten Batang memasuki tahap kedua dengan penambahan fasilitas.", content: "PT Sinar Cerah Sempurna memulai pembangunan tahap II RSUD Kabupaten Batang yang mencakup penambahan gedung rawat inap, ruang operasi modern, dan fasilitas diagnostik. Proyek ini ditargetkan selesai dalam 18 bulan dan akan meningkatkan kapasitas rumah sakit menjadi 250 tempat tidur.", imageUrl: "/carousel2.svg",      status: "PUBLISHED" as const, publishedAt: new Date("2025-06-20"), galleryImages: G1 },
    { slug: "workshop-teknologi-konstruksi", title: "Workshop Teknologi Konstruksi Terbaru untuk Tim Teknis", excerpt: "SCS menyelenggarakan workshop untuk meningkatkan kompetensi tim teknis dalam teknologi konstruksi modern.", content: "PT Sinar Cerah Sempurna menyelenggarakan workshop bertajuk 'Teknologi Konstruksi Masa Depan' yang diikuti oleh seluruh tim teknis dan project manager. Workshop ini mencakup materi tentang penggunaan drone untuk survey, 3D printing untuk komponen bangunan, dan Internet of Things (IoT) untuk manajemen proyek.", imageUrl: "/carousel3.svg",      status: "PUBLISHED" as const, publishedAt: new Date("2025-05-25"), galleryImages: G2 },
    { slug: "komitmen-lingkungan-scs", title: "Komitmen SCS terhadap Kelestarian Lingkungan", excerpt: "Perusahaan meluncurkan program penghijauan di setiap lokasi proyek sebagai komitmen lingkungan.", content: "PT Sinar Cerah Sempurna meluncurkan program 'SCS Hijau' yang mewajibkan setiap proyek untuk menanam minimal 100 pohon di area sekitar proyek. Program ini merupakan bagian dari komitmen perusahaan terhadap pembangunan berkelanjutan dan pengurangan dampak lingkungan dari aktivitas konstruksi.", imageUrl: "/carousel1.svg",      status: "PUBLISHED" as const, publishedAt: new Date("2025-04-20"), galleryImages: G3 },
    { slug: "kunjungan-kerja-menteri-pupr", title: "Kunjungan Kerja Menteri PUPR ke Proyek SCS", excerpt: "Menteri PUPR mengunjungi proyek strategis yang dikerjakan SCS dan mengapresiasi kualitas hasil kerja.", content: "Menteri Pekerjaan Umum dan Perumahan Rakyat melakukan kunjungan kerja ke proyek pembangunan jembatan penghubung kawasan industri yang dikerjakan oleh PT Sinar Cerah Sempurna. Dalam kunjungannya, Menteri mengapresiasi kualitas konstruksi dan manajemen proyek yang diterapkan oleh SCS.", imageUrl: "/carousel2.svg",      status: "PUBLISHED" as const, publishedAt: new Date("2025-03-10"), galleryImages: G4 },
    { slug: "scs-ekspansi-ke-pasar-timur", title: "SCS Ekspansi ke Pasar Konstruksi Indonesia Timur", excerpt: "Perusahaan membuka kantor perwakilan di Makassar untuk memperluas jangkauan bisnis ke Indonesia Timur.", content: "PT Sinar Cerah Sempurna resmi membuka kantor perwakilan di Makassar, Sulawesi Selatan sebagai langkah strategis untuk memperluas jangkauan bisnis ke kawasan Indonesia Timur. Langkah ini diharapkan dapat membuka peluang baru dalam proyek-proyek infrastruktur di Sulawesi, Maluku, dan Papua.", imageUrl: "/carousel3.svg",      status: "PUBLISHED" as const, publishedAt: new Date("2025-02-01"), galleryImages: G5 },
    { slug: "scs-gelar-bakti-sosial", title: "SCS Gelar Bakti Sosial di Bulan Ramadan", excerpt: "Kegiatan bakti sosial rutin tahunan SCS di bulan Ramadan sebagai wujud kepedulian terhadap masyarakat.", content: "PT Sinar Cerah Sempurna menggelar kegiatan bakti sosial di bulan Ramadan dengan membagikan paket sembako dan santunan kepada anak yatim di sekitar lokasi proyek. Kegiatan ini merupakan program tahunan perusahaan sebagai wujud kepedulian dan tanggung jawab sosial terhadap masyarakat sekitar.", imageUrl: "/carousel1.svg",      status: "PUBLISHED" as const, publishedAt: new Date("2025-01-25"), galleryImages: G1 },
    { slug: "raihan-penghargaan-k3", title: "SCS Raih Penghargaan K3 dari Pemerintah", excerpt: "Penghargaan diberikan atas keberhasilan SCS menerapkan sistem manajemen keselamatan kerja.", content: "PT Sinar Cerah Sempurna meraih penghargaan dari Pemerintah Provinsi Jawa Tengah atas keberhasilan dalam menerapkan Sistem Manajemen Keselamatan dan Kesehatan Kerja (SMK3) yang baik. Penghargaan ini menjadi bukti nyata komitmen perusahaan terhadap keselamatan pekerja.", imageUrl: "/carousel2.svg",      status: "PUBLISHED" as const, publishedAt: new Date("2024-11-15"), galleryImages: G2 },
    { slug: "perjanjian-kerjasama-dengan-universitas", title: "SCS Jalin Kerjasama dengan Universitas Terkemuka", excerpt: "Kerjasama bidang riset dan pengembangan teknologi konstruksi antara SCS dengan perguruan tinggi.", content: "PT Sinar Cerah Sempurna menjalin kerjasama strategis dengan beberapa universitas terkemuka di Jawa Tengah dalam bidang riset dan pengembangan teknologi konstruksi. Kerjasama ini mencakup program magang mahasiswa, riset bersama, dan pengembangan inovasi material konstruksi.", imageUrl: "/carousel3.svg",      status: "PUBLISHED" as const, publishedAt: new Date("2024-09-10"), galleryImages: G3 },
    { slug: "scs-dukung-program-pemerintah", title: "SCS Dukung Program Pembangunan Infrastruktur Pemerintah", excerpt: "Perusahaan berpartisipasi aktif dalam program strategis pembangunan infrastruktur nasional.", content: "PT Sinar Cerah Sempurna berkomitmen mendukung program strategis pemerintah dalam pembangunan infrastruktur nasional. Dengan pengalaman lebih dari 25 tahun, perusahaan siap berkontribusi dalam mewujudkan target pembangunan yang telah ditetapkan pemerintah.", imageUrl: "/carousel1.svg",      status: "PUBLISHED" as const, publishedAt: new Date("2024-07-15"), galleryImages: G4 },
  ];
  for (const article of newsArticles) {
    await prisma.news.create({ data: article });
  }
  console.log("✅ News seeded");

  // 6. Seed Contacts
  const contacts = [
    { label: "Alamat", value: "Jl. Karangrejo Barat No 09, Tinjomoyo, Semarang", icon: "/icons/map-pin.svg", type: "address" },
    { label: "Telepon", value: "024 8502010", icon: "/icons/phone.svg", type: "phone" },
    { label: "Email", value: "info@ptsinarcerahsempurna.com", icon: "/icons/envelope.svg", type: "email" },
    { label: "Jam Operasional", value: "Senin - Jumat: 08.00 - 17.00 WIB", icon: "/icons/clock.svg", type: "general" },
  ];
  for (const contact of contacts) {
    await prisma.contact.create({ data: contact });
  }
  console.log("✅ Contacts seeded");

  // 7. Seed Statistics
  const statistics = [
    { label: "Proyek Selesai", value: 50, icon: "/icons/briefcase.svg" },
    { label: "Klien Puas", value: 150, icon: "/icons/users.svg" },
    { label: "Tahun Pengalaman", value: 25, icon: "/icons/calendar-days.svg" },
    { label: "Tim Profesional", value: 200, icon: "/icons/user-group.svg" },
  ];
  for (const stat of statistics) {
    await prisma.statistic.create({ data: stat });
  }
  console.log("✅ Statistics seeded");

  // 8. Seed Partners
  const partners = [
    { name: "PT Maharani Globalindo", logoUrl: "", linkUrl: "" },
    { name: "PT Konstruksi Nusantara", logoUrl: "", linkUrl: "" },
    { name: "CV Bangun Persada", logoUrl: "", linkUrl: "" },
    { name: "PT Infrastruktur Mandiri", logoUrl: "", linkUrl: "" },
  ];
  for (const partner of partners) {
    await prisma.partner.create({ data: partner });
  }
  console.log("✅ Partners seeded");

  // 9. Seed Settings
  const settings = [
    { key: "youtube_url", value: "https://youtube.com/@ptsinarcerahsempurna", label: "YouTube URL", group: "links" },
    { key: "portal_app_url", value: "https://portal.scs.co.id", label: "Portal Aplikasi URL", group: "links" },
    { key: "sop_url", value: "https://sop.scs.co.id", label: "SOP URL", group: "links" },
    { key: "anak_perusahaan_url", value: "https://anakperusahaan.scs.co.id", label: "Anak Perusahaan URL", group: "links" },
    { key: "footer_description", value: "Perusahaan konstruksi dan infrastruktur terpercaya di Indonesia dengan komitmen tinggi pada kualitas dan inovasi.", label: "Footer Description", group: "footer" },
    { key: "footer_address", value: "Jl. Karangrejo Barat No 09. RT. 02 RW. 02 (Kp. Pentul), Tinjomoyo, Semarang", label: "Address", group: "footer" },
    { key: "footer_phone", value: "024 8502010", label: "Phone Number", group: "footer" },
    { key: "footer_email", value: "info@ptsinarcerahsempurna.com", label: "Email", group: "footer" },
    { key: "footer_copyright", value: "\u00A9 2026 PT. Sinar Cerah Sempurna. All rights reserved.", label: "Copyright Text", group: "footer" },
    { key: "company_name", value: "Sinar Cerah Sempurna", label: "Company Name", group: "company" },
  ];
  for (const setting of settings) {
    await prisma.setting.upsert({ where: { key: setting.key }, update: { value: setting.value }, create: setting });
  }
  console.log("✅ Settings seeded");

  console.log("\n\uD83C\uDF89 Seeding complete!");
  console.log("Admin login credentials: lihat di file .env.local atau dokumentasi internal");
}

main()
  .catch((e) => {
    console.error("Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
