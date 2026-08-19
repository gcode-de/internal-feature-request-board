"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { roleLabels, SessionUser } from "@/types/auth";

export function UserMenu() {
  const router = useRouter();
  const [user, setUser] = useState<SessionUser | null>(null);

  useEffect(() => {
    fetch("/api/auth/session")
      .then((response) => (response.ok ? response.json() : null))
      .then((body) => setUser(body?.user ?? null));
  }, []);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  if (!user) return null;

  return (
    <div className="flex items-center gap-3 text-sm">
      <div className="hidden text-right sm:block">
        <p className="font-medium">{user.name}</p>
        <p className="text-xs text-muted-foreground">{roleLabels[user.role]}</p>
      </div>
      <Button variant="outline" size="sm" onClick={logout}>
        Sign out
      </Button>
    </div>
  );
}
