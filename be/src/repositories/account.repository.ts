import { prisma } from "../lib/prisma";

const select = { id: true, username: true, email: true } as const;

export const adminRepository = {
  findById: (id: number) => prisma.admin.findUnique({ where: { id } }),
  findByUsername: (username: string) => prisma.admin.findUnique({ where: { username } }),
};

export const userRepository = {
  select,
  findAll: () => prisma.user.findMany({ select, orderBy: { id: "asc" } }),
  findById: (id: number) => prisma.user.findUnique({ where: { id } }),
  findPublicById: (id: number) => prisma.user.findUnique({ where: { id }, select }),
  findByUsername: (username: string) => prisma.user.findUnique({ where: { username } }),
  findByEmail: (email: string) => prisma.user.findUnique({ where: { email } }),
  findByGoogleId: (googleId: string) => prisma.user.findUnique({ where: { googleId } }),
  linkGoogle: (id: number, googleId: string) =>
    prisma.user.update({ where: { id }, data: { googleId } }),
  createFromGoogle: (data: { username: string; email: string; googleId: string }) =>
    prisma.user.create({ data }),
  create: (data: { username: string; password: string; email: string }) =>
    prisma.user.create({ data, select }),
  update: (id: number, data: { username?: string; password?: string; email?: string }) =>
    prisma.user.update({ where: { id }, data, select }),
  delete: (id: number) => prisma.user.delete({ where: { id } }),
};
