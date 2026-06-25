"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

import { getAuthToken } from "@/lib/api";

export function AuthGuard({ children }: Readonly<{ children: React.ReactNode }>) {
  const pathname = usePathname();
  const router = useRouter();
  const [isAuthenticated] = useState(() => Boolean(getAuthToken()));

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace(`/login?next=${encodeURIComponent(pathname)}`);
    }
  }, [isAuthenticated, pathname, router]);

  if (!isAuthenticated) {
    return (
      <div className="grid min-h-screen place-items-center bg-slate-50 text-slate-500">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return children;
}
