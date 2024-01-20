import { PrismaClient } from "@prisma/client";

declare global {
  var prisma: PrismaClient | undefined;
}

const prisma = globalThis.prisma || new PrismaClient();

// hack: ensures that hot reload doesn't cause a new client to be created on each reload
if (process.env.NODE_ENV !== "production") globalThis.prisma = prisma;
