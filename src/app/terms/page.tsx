import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "The terms and conditions governing your use of PewNeighbor.",
};

const LAST_UPDATED = "March 16, 2026";
const CONTACT_EMAIL = "legal@pewneighbor.com";
const GOVERNING_STATE = "Tennessee";

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-slate-200 px-6 py-4">
        <Link href="/" className="flex items-center gap-2 w-fit">
          <Image src="/logo.svg" alt="PewNeighbor" width={36} height={36} />
                    <span className="text-xl font-bold text-navy-800">PewNeighbor</span>
        </Link>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-12">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Terms of Service</h1>
        <p className="text-sm text-slate-500 mb-10">Last updated: {LAST_UPDATED}</p>

        <div className="prose prose-slate max-w-none space-y-8 text-slate-700">

          <section>
            <p className="text-lg">
              Please read these Terms of Service carefully before using PewNeighbor. By creating
              an account or using our service, you agree to be bound by these terms.
            </p>
          </section>

          <Section title="1. About PewNeighbor">
            <p>
              PewNeighbor is a friendship-finding platform for members of church communities.
              It is designed to help people find friends and couple-friends within their church.{" "}
              <strong>PewNeighbor is not a dating service</strong> and must not be used as one.
              Creating an account with romantic intent toward other members is a violation of
              these Terms and may result in immediate account termination.
            </p>
            <p>
              PewNeighbor is operated as a private platform. Access is limited to members of
              registered church communities. We reserve the right to refuse service to anyone
              for any reason consistent with applicable law.
            </p>
          </Section>

          <Section title="2. Eligibility">
            <p>To use PewNeighbor you must:</p>
            <ul>
              <li>Be at least 18 years of age.</li>
              <li>Be a member of a registered church community on the platform.</li>
              <li>Provide accurate information when creating your account and profile.</li>
              <li>Not have previously been banned from PewNeighbor for a Terms violation.</li>
              <li>Have the legal capacity to enter into a binding agreement in your jurisdiction.</li>
            </ul>
          </Section>

          <Section title="3. Account Registration and Security">
            <p>
              You are responsible for maintaining the confidentiality of your sign-in credentials
              and for all activity that occurs under your account. You must notify us immediately
              at <a href={`mailto:${CONTACT_EMAIL}`} className="text-navy-700 underline">{CONTACT_EMAIL}</a> if
              you believe your account has been compromised.
            </p>
            <p>
              You may only create one account. Creating multiple accounts to circumvent a ban or
              restriction is prohibited.
            </p>
            <p>
              You agree to provide accurate, current, and complete information during registration
              and to keep your profile information up to date.
            </p>
          </Section>

          <Section title="4. Church Accounts">
            <Subsection title="Registration">
              <p>
                Churches may apply to register on PewNeighbor. Approval is at our sole discretion.
                By registering a church, the church administrator represents that:
              </p>
              <ul>
                <li>They are authorized to act on behalf of the church.</li>
                <li>The church is a legitimate, active religious community.</li>
                <li>The information provided during registration is accurate.</li>
              </ul>
            </Subsection>
            <Subsection title="Administrator responsibilities">
              <p>Church administrators are responsible for:</p>
              <ul>
                <li>Distributing the church join code only to actual members of their congregation.</li>
                <li>Reviewing and acting on member reports in a timely manner.</li>
                <li>Removing members who violate these Terms.</li>
                <li>Keeping their church&apos;s account information current.</li>
              </ul>
              <p>
                PewNeighbor is not responsible for the actions of church administrators or
                their failure to moderate their community.
              </p>
            </Subsection>
            <Subsection title="Subscriptions and billing">
              <p>
                Church accounts are subject to the subscription tiers displayed on our pricing
                page. Subscription fees are billed monthly or annually in advance. All fees are
                non-refundable except where required by law. We reserve the right to change
                pricing with 30 days&apos; notice to the church&apos;s administrator email.
              </p>
              <p>
                If a church exceeds its member limit, new members will be unable to join until
                the church upgrades to a higher tier or existing members are removed.
              </p>
            </Subsection>
          </Section>

          <Section title="5. Acceptable Use">
            <p>You agree not to use PewNeighbor to:</p>
            <ul>
              <li>Harass, threaten, intimidate, stalk, or harm any other user.</li>
              <li>Use the platform for romantic or sexual solicitation of any kind.</li>
              <li>Post or transmit content that is defamatory, obscene, pornographic, or otherwise objectionable.</li>
              <li>Impersonate any person or misrepresent your affiliation with any organization.</li>
              <li>Collect or harvest personal information about other users.</li>
              <li>Send unsolicited commercial messages or spam.</li>
              <li>Attempt to gain unauthorized access to any account, system, or network.</li>
              <li>Reverse-engineer, decompile, or attempt to extract the source code of PewNeighbor.</li>
              <li>Use automated tools (bots, scrapers) to access or interact with the service.</li>
              <li>Violate any applicable local, state, national, or international law or regulation.</li>
              <li>Facilitate or encourage any of the above activities.</li>
            </ul>
          </Section>

          <Section title="6. Content">
            <Subsection title="Your content">
              <p>
                You retain ownership of the content you submit to PewNeighbor (profile text,
                messages, photos). By submitting content, you grant PewNeighbor a limited,
                non-exclusive, royalty-free license to store, display, and transmit that content
                solely for the purpose of operating the service.
              </p>
            </Subsection>
            <Subsection title="Content standards">
              <p>
                All content you post must be accurate, lawful, and consistent with these Terms.
                You must not post content that violates any third party&apos;s rights, including
                intellectual property rights or privacy rights.
              </p>
            </Subsection>
            <Subsection title="Content moderation">
              <p>
                We reserve the right (but not the obligation) to review, edit, or remove any
                content that violates these Terms or that we determine, in our sole discretion,
                is harmful or inappropriate. Removal of content does not constitute a waiver of
                our right to take further action, including account termination.
              </p>
            </Subsection>
          </Section>

          <Section title="7. Privacy">
            <p>
              Your use of PewNeighbor is subject to our{" "}
              <Link href="/privacy" className="text-navy-700 underline">Privacy Policy</Link>,
              which is incorporated into these Terms by reference.
            </p>
          </Section>

          <Section title="8. Termination">
            <Subsection title="By you">
              <p>
                You may delete your account at any time from your account settings. Deletion is
                permanent and irreversible. We do not offer refunds of any prepaid subscription
                fees upon account deletion.
              </p>
            </Subsection>
            <Subsection title="By us">
              <p>
                We may suspend or terminate your account immediately and without notice if we
                determine, in our sole discretion, that you have violated these Terms, that your
                use of the service creates legal risk for us or other users, or that continued
                access is otherwise inappropriate. We will generally attempt to notify you by
                email unless doing so would be harmful or impractical.
              </p>
            </Subsection>
            <Subsection title="Effect of termination">
              <p>
                Upon termination, your right to use the service ceases immediately. Sections of
                these Terms that by their nature should survive termination will survive,
                including Sections 9, 10, 11, and 12.
              </p>
            </Subsection>
          </Section>

          <Section title="9. Disclaimers">
            <p>
              PEWNEIGHBOR IS PROVIDED &ldquo;AS IS&rdquo; AND &ldquo;AS AVAILABLE&rdquo; WITHOUT
              WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO
              IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND
              NON-INFRINGEMENT.
            </p>
            <p>
              We do not warrant that the service will be uninterrupted, error-free, or secure.
              We do not verify the identity of users beyond the information they provide, and we
              make no representations about the character, intentions, or suitability of any user
              you may connect with through PewNeighbor.
            </p>
            <p>
              <strong>
                PewNeighbor is a technology platform, not a church, counseling service, or
                background-check service. You are solely responsible for exercising your own
                judgment in all interactions with other users, including when agreeing to meet
                in person.
              </strong>
            </p>
          </Section>

          <Section title="10. Limitation of Liability">
            <p>
              TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, PEWNEIGHBOR AND ITS OWNERS,
              EMPLOYEES, AND AGENTS SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL,
              CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING LOSS OF PROFITS, DATA, GOODWILL, OR
              OTHER INTANGIBLE LOSSES, ARISING OUT OF OR IN CONNECTION WITH YOUR USE OF OR
              INABILITY TO USE THE SERVICE.
            </p>
            <p>
              IN NO EVENT WILL OUR TOTAL LIABILITY TO YOU FOR ALL CLAIMS EXCEED THE GREATER OF
              (A) THE AMOUNT YOU PAID TO US IN THE 12 MONTHS PRECEDING THE CLAIM, OR (B) $100.
            </p>
            <p>
              Some jurisdictions do not allow the exclusion of certain warranties or limitation
              of liability, so some of the above limitations may not apply to you.
            </p>
          </Section>

          <Section title="11. Indemnification">
            <p>
              You agree to defend, indemnify, and hold harmless PewNeighbor and its owners,
              employees, and agents from and against any claims, liabilities, damages, losses,
              and expenses, including reasonable legal fees, arising out of or in any way
              connected with your access to or use of the service, your violation of these Terms,
              or your violation of any rights of another person or entity.
            </p>
          </Section>

          <Section title="12. Governing Law and Disputes">
            <p>
              These Terms are governed by and construed in accordance with the laws of the State
              of {GOVERNING_STATE}, without regard to its conflict of law provisions.
            </p>
            <p>
              Any dispute arising from these Terms or your use of PewNeighbor that cannot be
              resolved informally will be submitted to binding arbitration in {GOVERNING_STATE}
              under the rules of the American Arbitration Association, except that either party
              may seek injunctive or other equitable relief in a court of competent jurisdiction
              to prevent the actual or threatened misappropriation or infringement of intellectual
              property rights. You waive any right to participate in a class action lawsuit
              or class-wide arbitration.
            </p>
          </Section>

          <Section title="13. Changes to These Terms">
            <p>
              We may update these Terms from time to time. When we make material changes, we will
              notify registered users by email and update the &ldquo;Last updated&rdquo; date.
              Your continued use of PewNeighbor after changes take effect constitutes acceptance
              of the updated Terms. If you do not agree to the updated Terms, you must stop using
              the service and delete your account.
            </p>
          </Section>

          <Section title="14. Contact">
            <p>
              Questions about these Terms should be directed to:{" "}
              <a href={`mailto:${CONTACT_EMAIL}`} className="text-navy-700 underline">{CONTACT_EMAIL}</a>.
            </p>
          </Section>

        </div>
      </main>

      <footer className="border-t border-slate-200 px-6 py-6 text-center text-sm text-slate-500">
        <Link href="/privacy" className="hover:text-slate-700 underline">Privacy Policy</Link>
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
