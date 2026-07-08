import { prisma } from "@/lib/prisma";

export async function getHeroes() {
  const heroes = await prisma.hero.findMany({
    where: { isActive: true },
    orderBy: { createdAt: "desc" },
  });
  return heroes;
}

export async function getAbouts() {
  const abouts = await prisma.about.findMany({
    orderBy: { createdAt: "desc" },
  });
  return abouts;
}

export async function getProjects(category) {
  const where = category && category !== "Semua" ? { isActive: true, category } : { isActive: true };
  const projects = await prisma.project.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });
  return projects;
}

export async function getNews(status = "PUBLISHED") {
  const news = await prisma.news.findMany({
    where: { status },
    orderBy: { publishedAt: "desc" },
  });
  return news;
}

export async function getPartners() {
  const partners = await prisma.partner.findMany({
    orderBy: { createdAt: "desc" },
  });
  return partners;
}

export async function getContacts() {
  const contacts = await prisma.contact.findMany({
    orderBy: { createdAt: "asc" },
  });
  return contacts;
}

export async function getStatistics() {
  const statistics = await prisma.statistic.findMany({
    orderBy: { createdAt: "asc" },
  });
  return statistics;
}

export async function getSetting(key) {
  const setting = await prisma.setting.findUnique({ where: { key } });
  return setting?.value || null;
}

export async function getAllSettings() {
  const settings = await prisma.setting.findMany();
  const map = {};
  for (const s of settings) {
    map[s.key] = s.value;
  }
  return map;
}