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
  const hashedPassword = await bcrypt.hash("admin123", 12);
  await prisma.admin.upsert({
    where: { username: "admin" },
    update: {},
    create: {
      username: "admin",
      password: hashedPassword,
      role: "ADMIN",
    },
  });
  console.log("✅ Admin account created: admin / admin123");

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

  // 4. Seed Projects
  const projects = [
    { title: "Renovasi Eks Kantor menjadi Gedung Paviliun", description: "Proyek renovasi dan transformasi eks kantor menjadi gedung paviliun rumah sakit dengan standar kualitas tinggi.", category: "Rumah Sakit", location: "RSUD Aji Muhammad Parikesit", client: "Pemerintah Kabupaten Kutai Kartanegara", imageUrl: "/carousel1.svg", completedDate: "2025", isActive: true },
    { title: "Pembangunan Gedung Rektorat", description: "Pembangunan gedung rektorat modern dengan konsep hijau dan berkelanjutan.", category: "Gedung Pendidikan", location: "Universitas Diponegoro", client: "Kemenristekdikti", imageUrl: "/carousel2.svg", completedDate: "2024", isActive: true },
    { title: "Ekspansi Mall Central", description: "Proyek ekspansi pusat perbelanjaan dengan penambahan area ritel dan fasilitas hiburan.", category: "Pusat Perbelanjaan", location: "Semarang Tengah", client: "PT Retail Indo", imageUrl: "/carousel3.svg", completedDate: "2024", isActive: true },
  ];
  for (const project of projects) {
    await prisma.project.create({ data: project });
  }
  console.log("✅ Projects seeded");

  // 5. Seed News
  const newsArticles = [
    { slug: "peresmian-kantor-baru", title: "Peresmian Kantor Baru PT Sinar Cerah Sempurna", excerpt: "Peresmian kantor baru ini tidak hanya menandai bertambahnya fasilitas operasional.", content: "PT Sinar Cerah Sempurna resmi meresmikan kantor barunya di Semarang. Peresmian ini menandai babak baru dalam perjalanan perusahaan.", imageUrl: "/carousel1.svg",      status: "PUBLISHED" as const, publishedAt: new Date("2025-06-15") },
    { slug: "penghargaan-kontraktor-terbaik", title: "Penghargaan Kontraktor Terbaik 2025", excerpt: "SCS berhasil meraih penghargaan nasional berkat komitmen pada standar keselamatan.", content: "PT Sinar Cerah Sempurna berhasil meraih penghargaan sebagai Kontraktor Terbaik tahun 2025.", imageUrl: "/carousel2.svg",      status: "PUBLISHED" as const, publishedAt: new Date("2025-03-20") },
    { slug: "penerapan-beton-ramah-lingkungan", title: "Penerapan Beton Ramah Lingkungan", excerpt: "Implementasi material konstruksi hijau untuk mendukung kelestarian alam.", content: "SCS mulai mengimplementasikan penggunaan beton ramah lingkungan yang memiliki jejak karbon lebih rendah.", imageUrl: "/carousel3.svg",      status: "PUBLISHED" as const, publishedAt: new Date("2025-01-10") },
  ];
  for (const article of newsArticles) {
    await prisma.news.create({ data: article });
  }
  console.log("✅ News seeded");

  // 6. Seed Contacts
  const contacts = [
    { label: "Alamat", value: "Jl. Karangrejo Barat No 09, Tinjomoyo, Semarang", icon: "\uD83D\uDCCD", type: "address" },
    { label: "Telepon", value: "024 8502010", icon: "\uD83D\uDCDE", type: "phone" },
    { label: "Email", value: "info@ptsinarcerahsempurna.com", icon: "\uD83D\uDCE7", type: "email" },
    { label: "Jam Operasional", value: "Senin - Jumat: 08.00 - 17.00 WIB", icon: "\uD83D\uDD50", type: "general" },
  ];
  for (const contact of contacts) {
    await prisma.contact.create({ data: contact });
  }
  console.log("✅ Contacts seeded");

  // 7. Seed Statistics
  const statistics = [
    { label: "Proyek Selesai", value: 5, icon: "\uD83C\uDFD7\uFE0F" },
    { label: "Klien Puas", value: 50, icon: "\uD83E\uDD1D" },
    { label: "Tahun Pengalaman", value: 25, icon: "\uD83D\uDCC5" },
    { label: "Tim Profesional", value: 200, icon: "\uD83D\uDC77" },
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
  console.log("Admin login: admin / admin123");
}

main()
  .catch((e) => {
    console.error("Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });