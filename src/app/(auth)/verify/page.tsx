import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";

export const metadata = { title: "Check Your Email" };

export default function VerifyPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4">
      <Link href="/" className="mb-8 flex items-center gap-2">
        <Image src="/logo.svg" alt="PewNeighbor" width={36} height={36} />
                  <span className="text-xl font-bold text-navy-800">PewNeighbor</span>
      </Link>

      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="mb-2 text-5xl">📬</div>
          <CardTitle>Check your email</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-slate-600">
            We&apos;ve sent a sign-in link to your email address. Click the link
            to sign in to PewNeighbor.
          </p>
          <p className="text-sm text-slate-500">
            The link expires in <strong>10 minutes</strong>. If you don&apos;t
            see the email, check your spam folder.
          </p>
          <Link
            href="/sign-in"
            className="block text-sm text-navy-700 hover:underline"
          >
            ← Back to sign in
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
