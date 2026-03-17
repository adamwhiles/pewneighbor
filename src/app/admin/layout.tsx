import Link from "next/link";
import Image from "next/image";
import { SignOutButton } from "@/components/layout/sign-out-button";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white px-6 py-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/logo.svg" alt="PewNeighbor" width={32} height={32} />
            <span className="text-lg font-bold text-navy-800">PewNeighbor</span>
            <span className="ml-2 rounded-md bg-navy-100 px-2 py-0.5 text-xs font-semibold text-navy-700">
              Admin
            </span>
          </Link>
          <nav className="flex items-center gap-4 text-sm">
            <Link href="/admin/churches" className="text-slate-600 hover:text-slate-900 font-medium">
              Churches
            </Link>
            <Link href="/discover" className="text-slate-600 hover:text-slate-900">
              Back to app
            </Link>
            <SignOutButton />
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-8">
        {children}
      </main>
    </div>
  );
}
