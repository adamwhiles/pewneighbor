import { signOut } from "@/lib/auth";
import { LogOut } from "lucide-react";

export function SignOutButton() {
  return (
    <form
      action={async () => {
        "use server";
        await signOut({ redirectTo: "/" });
      }}
    >
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
