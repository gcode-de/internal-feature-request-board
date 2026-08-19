import { PrismaClient, Role } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();
const passwordHash = await hash(process.env.SEED_PASSWORD ?? "ChangeMe123!", 12);

for (const user of [
  { email: "employee@example.com", name: "Erika Employee", role: Role.EMPLOYEE },
  { email: "owner@example.com", name: "Paul Product", role: Role.PRODUCT_OWNER },
  { email: "admin@example.com", name: "Ada Admin", role: Role.ADMIN },
]) {
  await prisma.user.upsert({
    where: { email: user.email },
    update: { name: user.name, role: user.role, passwordHash },
    create: { ...user, passwordHash },
  });
}

await prisma.$disconnect();
