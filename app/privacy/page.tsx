import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Restaurant Menus",
  description: "Our privacy policy explains how we collect, use, and protect your information when you use our website.",
};

export default function PrivacyPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-white">
      <section className="relative overflow-hidden pt-16 hero-pattern-modern">
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
          <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-primary/20 blur-3xl" />
          <div className="absolute top-1/2 -left-24 h-72 w-72 rounded-full bg-emerald-400/15 blur-3xl" />
        </div>
        <div className="container relative mx-auto px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <Link
            href="/home"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-primary transition-colors mb-6"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to home
          </Link>
          <div className="mx-auto max-w-3xl">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl lg:text-5xl">
              Privacy Policy
            </h1>
            <p className="mt-4 text-gray-600">
              Last updated: February 2025
            </p>
          </div>
        </div>
      </section>

      <article className="border-t border-gray-100 bg-white pb-20">
        <div className="container mx-auto px-4 py-10 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl space-y-8 text-gray-700">
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">1. Introduction</h2>
              <p className="leading-relaxed">
                Restaurant Menus (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) operates a website that helps you discover
                restaurants and view their menus across Ghana, and provides event management and
                attendee registration services. This Privacy Policy explains how we collect, use,
                and protect information when you use our website. By using our site, you agree to
                this policy.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">2. Information We Collect</h2>
              <p className="leading-relaxed mb-4">
                We collect limited information to provide and improve our services:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Login credentials:</strong> When you sign in, we process your email and
                  password to authenticate you. Passwords are not stored in plain text. Your role
                  (admin or attendee) is stored locally to route you to the appropriate section.
                </li>
                <li>
                  <strong>Registration data:</strong> When you register as a member or attendee, we
                  may collect your name, email, phone, organization, dietary requirements, and notes.
                  This data is used to manage event attendance and communicate with you.
                </li>
                <li>
                  <strong>Location data:</strong> When you use the &quot;Find near me&quot; feature on
                  restaurant listings, your browser may request access to your device&apos;s geographic
                  location. This data is used only in your browser to show restaurants within
                  approximately 5 km of you. We do not store or transmit your location to our
                  servers.
                </li>
                <li>
                  <strong>Usage data:</strong> Our hosting provider may log standard technical data
                  such as your IP address, browser type, and pages visited.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">3. Third-Party Services</h2>
              <p className="leading-relaxed mb-4">
                Our website uses third-party services that may process data:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Google Fonts:</strong> We load fonts from Google. This may result in your
                  IP address being sent to Google&apos;s servers. See{" "}
                  <a
                    href="https://policies.google.com/privacy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-primary hover:text-primary-dark underline"
                  >
                    Google&apos;s Privacy Policy
                  </a>
                  .
                </li>
                <li>
                  <strong>Maps:</strong> Our maps use map tiles from providers such as OpenStreetMap.
                  Loading map content may involve requests to third-party servers.
                </li>
                <li>
                  <strong>Google Maps links:</strong> Restaurant pages may include links to Google
                  Maps for directions. Clicking those links takes you to Google&apos;s website and is
                  subject to Google&apos;s privacy practices.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">4. Cookies and Local Storage</h2>
              <p className="leading-relaxed">
                We may use browser local storage to keep you signed in and remember your role after
                login. Third-party services (e.g. Google Fonts) may use their own cookies. We do
                not currently use tracking or advertising cookies. If we add cookies in the future,
                we will update this policy.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">5. How We Use Your Information</h2>
              <p className="leading-relaxed">
                We use collected information to operate the website, authenticate users, manage
                events and registrations, show relevant restaurants and menus, and improve the
                user experience. We do not sell or rent your personal information.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">6. Data Protection (Ghana)</h2>
              <p className="leading-relaxed">
                If you are in Ghana, we aim to comply with applicable data protection principles
                under Ghana&apos;s Data Protection Act. You may contact us to request access to or
                correction of any personal data we hold about you.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">7. Your Rights</h2>
              <p className="leading-relaxed mb-4">
                Depending on your location, you may have rights to access, correct, delete, or
                restrict processing of your personal data. To exercise these rights or ask
                questions, contact us using the details below.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">8. Changes</h2>
              <p className="leading-relaxed">
                We may update this Privacy Policy from time to time. The &quot;Last updated&quot; date
                will be revised when we make changes. Continued use of the site after changes
                constitutes acceptance of the updated policy.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">9. Contact Us</h2>
              <p className="leading-relaxed">
                If you have questions about this Privacy Policy or our practices, contact us at:
              </p>
              <ul className="mt-3 space-y-1 text-gray-700">
                <li>Email: info@restaurantmenus.com</li>
                <li>Phone: +1 (555) 123-4567</li>
                <li>Address: 123 Food Street, City</li>
              </ul>
            </section>
          </div>
        </div>
      </article>

      <section className="border-t border-gray-100 bg-gray-50/60 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <Link
              href="/home"
              className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-primary-dark"
            >
              Back to home
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
