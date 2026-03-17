"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { SignOutButton } from "./sign-out-button";
import { cn } from "@/lib/utils";
import {
  Compass,
  MessageCircle,
  Hand,
  User,
  Settings,
} from "lucide-react";

const navItems = [
  { href: "/discover", label: "Discover", icon: Compass },
  { href: "/waves", label: "Waves", icon: Hand },
  { href: "/messages", label: "Messages", icon: MessageCircle },
  { href: "/profile", label: "Profile", icon: User },
];

interface AppShellProps {
  children: React.ReactNode;
  userName?: string;
}

export function AppShell({ children, userName }: AppShellProps) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      {/* Top bar — desktop */}
      <header className="hidden border-b border-slate-200 bg-white md:block">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <Link href="/discover" className="flex items-center gap-2">
<Image src="/logo.svg" alt="PewNeighbor" width={36} height={36} />
<span className="text-xl font-bold text-navy-800">PewNeighbor</span>

          </Link>

          <nav className="flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-navy-50 text-navy-800"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <Link
              href="/settings"
              className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
            >
              <Settings className="h-5 w-5" />
            </Link>
            <SignOutButton />
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 pb-24 md:pb-6">
        {children}
      </main>

      {/* Bottom nav — mobile */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-slate-200 bg-white md:hidden">
        <div className="flex">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-1 flex-col items-center gap-0.5 py-3 text-xs font-medium transition-colors",
                  isActive ? "text-navy-800" : "text-slate-500"
                )}
              >
                <Icon
                  className={cn(
                    "h-5 w-5",
                    isActive ? "text-navy-800" : "text-slate-400"
                  )}
                />
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
