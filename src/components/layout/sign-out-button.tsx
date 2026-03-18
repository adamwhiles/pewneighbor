"use client";

import { LogOut } from "lucide-react";
import { signOutAction } from "@/lib/auth/actions";

export function SignOutButton() {
  return (
    <form action={signOutAction}>
      <button
        type="submit"
        className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
        title="Sign out"
      >
        <LogOut className="h-5 w-5" />
      </button>
    </form>
  );
}
