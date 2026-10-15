import "dotenv/config";
import bcrypt from "bcryptjs";
import { prisma } from "./lib/prisma";

async function main() {
  const username = process.env.ADMIN_USERNAME ?? "admin";
  await prisma.admin.upsert({
    where: { username },
    update: {},
    create: {
      username,
      password: await bcrypt.hash(process.env.ADMIN_PASSWORD ?? "admin123", 10),
      email: process.env.ADMIN_EMAIL ?? "admin@example.com",
    },
  });
  console.log(`Admin "${username}" ready`);
}

main().finally(() => prisma.$disconnect());
