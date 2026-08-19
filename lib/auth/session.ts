import { createHash, randomBytes } from "node:crypto";
import { Role } from "@prisma/client";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { SESSION_COOKIE } from "@/lib/auth/constants";
import { SessionUser, UserRole } from "@/types/auth";

const SESSION_DURATION_MS = 8 * 60 * 60 * 1000;

const roleFromDb: Record<Role, UserRole> = {
  [Role.EMPLOYEE]: UserRole.Employee,
  [Role.PRODUCT_OWNER]: UserRole.ProductOwner,
  [Role.ADMIN]: UserRole.Admin,
};

function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export async function createSession(userId: string): Promise<void> {
  const token = randomBytes(32).toString("base64url");
  const expiresAt = new Date(Date.now() + SESSION_DURATION_MS);

  await prisma.session.create({
    data: { userId, tokenHash: hashToken(token), expiresAt },
  });

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.SESSION_COOKIE_SECURE === "true",
    expires: expiresAt,
    path: "/",
  });
}

export async function deleteSession(): Promise<void> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (token) {
    await prisma.session.deleteMany({ where: { tokenHash: hashToken(token) } });
  }
  cookieStore.delete(SESSION_COOKIE);
}

export async function getSessionUser(): Promise<SessionUser | null> {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const session = await prisma.session.findUnique({
    where: { tokenHash: hashToken(token) },
    include: { user: true },
  });
  if (!session || session.expiresAt <= new Date()) {
    if (session) await prisma.session.delete({ where: { id: session.id } });
    return null;
  }

  return {
    id: session.user.id,
    email: session.user.email,
    name: session.user.name,
    role: roleFromDb[session.user.role],
  };
}

export function canCurate(user: SessionUser): boolean {
  return user.role === UserRole.ProductOwner || user.role === UserRole.Admin;
}

export function isAdmin(user: SessionUser): boolean {
  return user.role === UserRole.Admin;
}
