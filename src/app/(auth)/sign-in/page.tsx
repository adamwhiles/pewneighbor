import { signIn } from "@/lib/auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import Image from "next/image";

export const metadata = { title: "Sign In" };

export default function SignInPage({
  searchParams,
}: {
  searchParams: { callbackUrl?: string; error?: string };
}) {
  const error = searchParams.error;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4">
      <Link href="/" className="mb-8 flex items-center gap-2">
        <Image src="/logo.svg" alt="PewNeighbor" width={36} height={36} />
                  <span className="text-xl font-bold text-navy-800">PewNeighbor</span>
      </Link>

      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Welcome back</CardTitle>
          <CardDescription>
            Sign in to connect with your church community
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {error && (
            <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
              {error === "OAuthAccountNotLinked"
                ? "This email is already linked to a different sign-in method."
                : "Something went wrong. Please try again."}
            </div>
          )}

          {/* Magic link form */}
          <form
            action={async (formData: FormData) => {
              "use server";
              await signIn("resend", {
                email: formData.get("email") as string,
                redirectTo: searchParams.callbackUrl ?? "/discover",
              });
            }}
            className="space-y-4"
          >
            <Input
              name="email"
              type="email"
              label="Email address"
              placeholder="you@example.com"
              required
              autoComplete="email"
            />
            <Button type="submit" className="w-full" size="lg">
              Send sign-in link
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-xs text-slate-500">
              <span className="bg-white px-2">or continue with</span>
            </div>
          </div>

          {/* Google OAuth */}
          <form
            action={async () => {
              "use server";
              await signIn("google", {
                redirectTo: searchParams.callbackUrl ?? "/discover",
              });
            }}
          >
            <Button type="submit" variant="outline" className="w-full" size="lg">
              <svg className="h-4 w-4" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Continue with Google
            </Button>
          </form>

          <p className="text-center text-xs text-slate-500">
            By signing in, you agree to our{" "}
            <Link href="/terms" className="underline hover:text-slate-700">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="underline hover:text-slate-700">
              Privacy Policy
            </Link>
            .
          </p>

          <p className="text-center text-sm text-slate-600">
            Is your church not on PewNeighbor yet?{" "}
            <Link
              href="/churches/register"
              className="font-medium text-navy-700 hover:underline"
            >
              Register it here
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
