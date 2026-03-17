import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How PewNeighbor collects, uses, and protects your personal information.",
};

const LAST_UPDATED = "March 16, 2026";
const CONTACT_EMAIL = "privacy@pewneighbor.com";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-slate-200 px-6 py-4">
        <Link href="/" className="flex items-center gap-2 w-fit">
          <Image src="/logo.svg" alt="PewNeighbor" width={36} height={36} />
                    <span className="text-xl font-bold text-navy-800">PewNeighbor</span>
        </Link>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-12">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Privacy Policy</h1>
        <p className="text-sm text-slate-500 mb-10">Last updated: {LAST_UPDATED}</p>

        <div className="prose prose-slate max-w-none space-y-8 text-slate-700">

          <section>
            <p className="text-lg">
              PewNeighbor is built on a simple promise: your personal information stays private,
              belongs to you, and will never be sold. This policy explains exactly what we collect,
              why we collect it, and how you can control it.
            </p>
          </section>

          <Section title="1. Who We Are">
            <p>
              PewNeighbor (&ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;) operates the
              website at pewneighbor.com and the PewNeighbor service. To ask questions or exercise
              your rights, contact us at <a href={`mailto:${CONTACT_EMAIL}`} className="text-navy-700 underline">{CONTACT_EMAIL}</a>.
            </p>
          </Section>

          <Section title="2. What We Collect">
            <Subsection title="Information you provide">
              <ul>
                <li><strong>Account information:</strong> Your email address when you sign up.</li>
                <li><strong>Profile information:</strong> Your display name (first name only), age range, gender, a short bio, interests, availability, and whether you are joining as an individual or a couple.</li>
                <li><strong>Church membership:</strong> The church you join, established by entering a join code provided by your church administrator.</li>
                <li><strong>Messages:</strong> The content of private messages you send to other members through our platform.</li>
                <li><strong>Meetup suggestions:</strong> Activity, date, and location details you enter when suggesting a meetup.</li>
                <li><strong>Reports:</strong> Information you submit when reporting a member for a policy violation.</li>
                <li><strong>Church registration:</strong> If you register a church, we collect the church name, location, denomination, website, and your contact email.</li>
              </ul>
            </Subsection>
            <Subsection title="Information collected automatically">
              <ul>
                <li><strong>Session data:</strong> We use secure, server-side sessions to keep you signed in. Session tokens are stored in httpOnly cookies inaccessible to JavaScript.</li>
                <li><strong>Basic server logs:</strong> Standard web server logs (IP address, browser type, pages visited) retained for up to 30 days for security and debugging purposes.</li>
              </ul>
            </Subsection>
            <Subsection title="What we do not collect">
              <ul>
                <li>Your last name</li>
                <li>Your exact date of birth or age (only an age range)</li>
                <li>Your phone number</li>
                <li>Your precise location or GPS data</li>
                <li>Payment information (handled directly by our payment processor, Stripe)</li>
                <li>Information from third-party data brokers</li>
              </ul>
            </Subsection>
          </Section>

          <Section title="3. How We Use Your Information">
            <p>We use your information only to operate and improve PewNeighbor:</p>
            <ul>
              <li>To authenticate you and maintain your session</li>
              <li>To display your profile to other members of your church community</li>
              <li>To match you with compatible members based on interests and preferences</li>
              <li>To deliver messages between connected members</li>
              <li>To send you transactional emails (sign-in links, wave notifications, connection alerts)</li>
              <li>To allow church administrators to manage their community</li>
              <li>To investigate reports of policy violations and enforce our Terms of Service</li>
              <li>To comply with applicable law</li>
            </ul>
            <p>
              We do not use your information for advertising, behavioral profiling, or any purpose
              unrelated to operating the service.
            </p>
          </Section>

          <Section title="4. Who Can See Your Information">
            <Subsection title="Other members of your church">
              <p>
                Members of your church community can see your display name, age range, interests,
                availability, looking-for type, and bio. Your profile photo is only visible to
                members you are mutually connected with. Your exact email address is never shown
                to other members.
              </p>
            </Subsection>
            <Subsection title="Church administrators">
              <p>
                The administrator of your church can see your display name and the date you joined.
                Church administrators <strong>cannot</strong> see your profile photo, read your
                private messages, or see who you have waved at.
              </p>
            </Subsection>
            <Subsection title="PewNeighbor staff">
              <p>
                PewNeighbor staff can access your account information and, where necessary to
                investigate a report or policy violation, message content. Staff access is logged
                and limited to what is necessary.
              </p>
            </Subsection>
            <Subsection title="No public profiles">
              <p>
                Your profile is never publicly visible. It is not indexed by search engines.
                No one outside your church community can see your information.
              </p>
            </Subsection>
            <Subsection title="Third-party service providers">
              <p>We share limited data with the following service providers, solely to operate the service:</p>
              <ul>
                <li><strong>Neon (database hosting):</strong> Stores your encrypted data on servers in the United States.</li>
                <li><strong>Microsoft Azure (cloud hosting):</strong> Hosts the application and profile photo storage.</li>
                <li><strong>Resend (email delivery):</strong> Receives your email address to deliver transactional emails.</li>
                <li><strong>Stripe (payment processing):</strong> Processes church subscription payments. Stripe&apos;s privacy policy governs payment data.</li>
              </ul>
              <p>We do not sell, rent, or trade your personal information to any third party.</p>
            </Subsection>
          </Section>

          <Section title="5. Message Encryption">
            <p>
              Private messages on PewNeighbor are encrypted using AES-256-GCM encryption before
              being stored in our database. The encryption keys are stored separately from the
              message data. This means that even in the unlikely event of a database breach,
              message content is not readable without the separate encryption keys.
            </p>
          </Section>

          <Section title="6. Data Retention">
            <p>We retain your information for as long as your account is active. When you delete your account:</p>
            <ul>
              <li>Your email address and profile information are permanently deleted within 30 days.</li>
              <li>Your profile photo is deleted from our storage immediately.</li>
              <li>Your messages are anonymized — the content is deleted and the sender reference is replaced with a tombstone marker.</li>
              <li>All active sessions are immediately invalidated.</li>
              <li>A deletion audit log (containing only a hashed identifier and timestamp, no personal data) is retained for 90 days for security purposes.</li>
            </ul>
            <p>
              You can request deletion of your account at any time from your account settings.
            </p>
          </Section>

          <Section title="7. Your Rights">
            <p>Depending on where you live, you may have the right to:</p>
            <ul>
              <li><strong>Access:</strong> Request a copy of the personal data we hold about you.</li>
              <li><strong>Correction:</strong> Update inaccurate information in your profile settings.</li>
              <li><strong>Deletion:</strong> Delete your account and all associated data from your settings page.</li>
              <li><strong>Portability:</strong> Export your profile data and message history as a JSON file from your settings page.</li>
              <li><strong>Objection:</strong> Object to certain processing of your data.</li>
            </ul>
            <p>
              To exercise any of these rights, use your account settings or contact us at{" "}
              <a href={`mailto:${CONTACT_EMAIL}`} className="text-navy-700 underline">{CONTACT_EMAIL}</a>.
              We will respond within 30 days.
            </p>
          </Section>

          <Section title="8. Cookies">
            <p>
              We use one essential cookie: a secure, httpOnly session cookie that keeps you signed
              in. We do not use advertising cookies, tracking pixels, or third-party analytics
              cookies. You cannot opt out of the session cookie as it is required for the service
              to function.
            </p>
          </Section>

          <Section title="9. Children's Privacy">
            <p>
              PewNeighbor is intended for users 18 years of age and older. We do not knowingly
              collect personal information from anyone under 18. If you believe a minor has
              created an account, please contact us at{" "}
              <a href={`mailto:${CONTACT_EMAIL}`} className="text-navy-700 underline">{CONTACT_EMAIL}</a>{" "}
              and we will delete the account promptly.
            </p>
          </Section>

          <Section title="10. Security">
            <p>
              We protect your data with industry-standard safeguards including TLS encryption in
              transit, AES-256-GCM encryption for messages at rest, private (non-public) blob
              storage for profile photos, httpOnly and Secure cookie flags, and regular security
              reviews. No method of transmission over the internet is 100% secure, and we cannot
              guarantee absolute security.
            </p>
          </Section>

          <Section title="11. Changes to This Policy">
            <p>
              We may update this policy from time to time. When we make material changes, we will
              notify you by email and update the &ldquo;Last updated&rdquo; date at the top of
              this page. Continued use of PewNeighbor after changes take effect constitutes
              acceptance of the updated policy.
            </p>
          </Section>

          <Section title="12. Contact">
            <p>
              Questions, concerns, or requests regarding your privacy should be directed to:{" "}
              <a href={`mailto:${CONTACT_EMAIL}`} className="text-navy-700 underline">{CONTACT_EMAIL}</a>.
            </p>
          </Section>

        </div>
      </main>

      <footer className="border-t border-slate-200 px-6 py-6 text-center text-sm text-slate-500">
        <Link href="/terms" className="hover:text-slate-700 underline">Terms of Service</Link>
        {" · "}
        <Link href="/" className="hover:text-slate-700">Home</Link>
      </footer>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3">
      <h2 className="text-xl font-semibold text-slate-900">{title}</h2>
      {children}
    </section>
  );
}

function Subsection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <h3 className="font-semibold text-slate-800">{title}</h3>
      {children}
    </div>
  );
}
