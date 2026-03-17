import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function HomePage() {
  const session = await auth();
  if (session?.user) redirect("/discover");

  return (
    <div className="flex min-h-screen flex-col bg-white">
      {/* Nav */}
      <header className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2">
          <Image src="/logo.svg" alt="PewNeighbor" width={36} height={36} />
          <span className="text-xl font-bold text-navy-800">PewNeighbor</span>

        </div>
        <div className="flex items-center gap-3">
          <Link href="/sign-in">
            <Button variant="ghost" size="sm">Sign in</Button>
          </Link>
          <Link href="/churches/register">
            <Button variant="outline" size="sm">Register your church</Button>
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="flex flex-1 flex-col items-center justify-center px-6 py-20 text-center">
        <div className="max-w-2xl">
          <div className="mb-6 inline-flex items-center rounded-full bg-navy-50 px-4 py-2 text-sm font-medium text-navy-700">
            🕊️ Friendship, not dating
          </div>
          <h1 className="mb-6 text-5xl font-bold leading-tight tracking-tight text-slate-900 md:text-6xl">
            Find your{" "}
            <span className="text-navy-800">pew neighbors</span>
          </h1>
          <p className="mb-10 text-xl leading-relaxed text-slate-600">
            Meeting people at church can be hard — especially if you&apos;re introverted.
            PewNeighbor helps you connect with fellow church members who share your
            interests, at your own pace.
          </p>
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link href="/sign-in">
              <Button size="lg" className="w-full sm:w-auto">
                Find friends in my church
              </Button>
            </Link>
            <Link href="/churches/register">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Register my church
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-slate-50 px-6 py-20">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-12 text-center text-3xl font-bold text-slate-900">
            How it works
          </h2>
          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                emoji: "⛪",
                title: "Your church joins",
                body: "A church admin registers your congregation. You get a private join code to share with your members.",
              },
              {
                emoji: "👋",
                title: "Create your profile",
                body: "Share your first name, age range, interests, and what kind of friendship you're looking for. No last names, no public profiles.",
              },
              {
                emoji: "☕",
                title: "Wave & connect",
                body: "Browse members in your church. Wave at someone who looks like a good match. Mutual waves unlock a private chat.",
              },
            ].map((step) => (
              <div
                key={step.title}
                className="flex flex-col items-center rounded-xl bg-white p-8 text-center shadow-sm"
              >
                <div className="mb-4 text-4xl">{step.emoji}</div>
                <h3 className="mb-3 text-lg font-semibold text-slate-900">
                  {step.title}
                </h3>
                <p className="text-slate-600">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Privacy promise */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-6 text-3xl font-bold text-slate-900">
            Privacy first, always
          </h2>
          <p className="mb-10 text-lg text-slate-600">
            Your profile is only visible to members of your own church.
            No public pages, no search engine indexing, no data selling.
            You&apos;re in control of your information.
          </p>
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
            {[
              { emoji: "🔒", label: "Church-only visibility" },
              { emoji: "🚫", label: "No public profiles" },
              { emoji: "💬", label: "Encrypted messages" },
              { emoji: "🗑️", label: "Delete anytime" },
            ].map((item) => (
              <div
                key={item.label}
                className="flex flex-col items-center gap-2 rounded-lg bg-slate-50 p-4"
              >
                <span className="text-2xl">{item.emoji}</span>
                <span className="text-sm font-medium text-slate-700">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="bg-navy-800 px-6 py-20 text-white">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-4 text-center text-3xl font-bold">
            Simple pricing for churches
          </h2>
          <p className="mb-12 text-center text-navy-200">
            Members always use PewNeighbor free. Churches pay only when they grow.
          </p>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                name: "Seed",
                price: "Free",
                period: "forever",
                limit: "Up to 75 active members",
                features: ["Full discovery features", "Private messaging", "Church admin dashboard"],
                highlight: false,
              },
              {
                name: "Community",
                price: "$12",
                period: "/ month",
                limit: "Up to 300 members",
                features: ["Everything in Seed", "Priority support", "Aggregate analytics"],
                highlight: true,
              },
              {
                name: "Parish",
                price: "$29",
                period: "/ month",
                limit: "Unlimited members",
                features: ["Everything in Community", "Custom church branding", "Dedicated support"],
                highlight: false,
              },
            ].map((tier) => (
              <div
                key={tier.name}
                className={`rounded-xl p-6 ${
                  tier.highlight
                    ? "bg-white text-slate-900 ring-2 ring-white"
                    : "bg-navy-700 text-white"
                }`}
              >
                <div className="mb-4">
                  <h3 className="text-lg font-semibold">{tier.name}</h3>
                  <div className="mt-1 flex items-baseline gap-1">
                    <span className="text-3xl font-bold">{tier.price}</span>
                    <span className={tier.highlight ? "text-slate-500" : "text-navy-300"}>
                      {tier.period}
                    </span>
                  </div>
                  <p className={`mt-1 text-sm ${tier.highlight ? "text-slate-600" : "text-navy-300"}`}>
                    {tier.limit}
                  </p>
                </div>
                <ul className="space-y-2">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm">
                      <span>✓</span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 px-6 py-8">
        <div className="mx-auto flex max-w-4xl flex-col items-center gap-4 text-center text-sm text-slate-500 md:flex-row md:justify-between">
          <div className="flex items-center gap-2">
            <Image src="/logo.svg" alt="PewNeighbor" width={30} height={30} />
            <span className="font-semibold text-slate-700">PewNeighbor</span>
          </div>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-slate-700">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-slate-700">Terms of Service</Link>
            <Link href="/churches/register" className="hover:text-slate-700">Register Church</Link>
          </div>
          <p>© {new Date().getFullYear()} PewNeighbor. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
