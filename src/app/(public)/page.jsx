import ScrollWrapper from "@/components/views/landing/ScrollWrapper";
import { prisma } from "@/lib/prisma";
import { getAllSettings } from "@/lib/data";

export const revalidate = 60;

export default async function HomePage() {
  // Ambil semua data secara paralel
  const [heroes, stats, projects, news, partners, settings] = await Promise.all([
    prisma.hero.findMany({ where: { page: "home", isActive: true } }),
    prisma.statistic.findMany(),
    prisma.project.findMany({
      where: { isActive: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.news.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { publishedAt: "desc" },
      take: 3,
    }),
    prisma.partner.findMany(),
    getAllSettings(),
  ]);

  const heroData = heroes[0] || null;

  // Gabungkan data hero dengan setting foto kecil
  const heroWithImages = heroData ? {
    ...heroData,
    heroImage2: settings["hero_home_image2"] || null,
    heroImage3: settings["hero_home_image3"] || null,
  } : null;

  return (
    <ScrollWrapper
      heroData={heroWithImages}
      statsData={stats}
      projectsData={projects}
      newsData={news}
      partnersData={partners}
    />
  );
}
