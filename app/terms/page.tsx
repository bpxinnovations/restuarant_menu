import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | Restaurant Menus",
  description: "Terms of service for using our restaurant discovery and event management website.",
};

export default function TermsPage() {
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
              Terms of Service
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
              <h2 className="text-xl font-bold text-gray-900 mb-3">1. Acceptance of Terms</h2>
              <p className="leading-relaxed">
                By accessing or using the Restaurant Menus website (&quot;the Site&quot;), you agree to be
                bound by these Terms of Service. If you do not agree, please do not use the Site.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">2. Description of Service</h2>
              <p className="leading-relaxed">
                Restaurant Menus provides: (a) a directory of restaurants and their menus, primarily
                in Ghana; (b) an event and attendee management platform for organizers; and
                (c) member and attendee registration forms. Access to certain features (e.g. admin
                dashboard, registration forms) requires sign-in. Restaurant listings are
                informational only—we do not take bookings, process orders, or handle payments.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">3. Accounts and Access</h2>
              <p className="leading-relaxed">
                You must provide accurate information when signing in. You are responsible for
                keeping your credentials secure. Access to organizer/admin and attendee sections is
                role-based. Do not share your login details or attempt to access areas you are not
                authorized to use.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">4. Accuracy of Information</h2>
              <p className="leading-relaxed mb-4">
                We strive to keep restaurant and menu information accurate and up to date. However:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Menus, prices, opening hours, and other details may change without notice</li>
                <li>We do not guarantee that all information is complete, current, or error-free</li>
                <li>Restaurants are responsible for their own operations and offerings</li>
              </ul>
              <p className="leading-relaxed mt-4">
                Always verify critical information directly with the restaurant before visiting or
                ordering.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">5. Disclaimer of Warranties</h2>
              <p className="leading-relaxed">
                The Site and all content are provided &quot;as is&quot; and &quot;as available&quot; without
                warranties of any kind. We disclaim all warranties, including implied warranties of
                merchantability, fitness for a particular purpose, and non-infringement. We do not
                warrant that the Site will be uninterrupted, error-free, or free of harmful
                components.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">6. Limitation of Liability</h2>
              <p className="leading-relaxed">
                To the fullest extent permitted by law, Restaurant Menus and its operators shall not
                be liable for any indirect, incidental, special, consequential, or punitive damages
                arising from your use of the Site. This includes issues arising from inaccurate
                menu information, restaurant quality, food safety, dietary needs, event management,
                registrations, or transactions with third parties.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">7. Third-Party Links</h2>
              <p className="leading-relaxed">
                The Site may contain links to third-party websites (e.g. Google Maps, restaurant
                websites, social media). We do not control these sites and are not responsible for
                their content, privacy practices, or terms.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">8. Acceptable Use</h2>
              <p className="leading-relaxed mb-4">
                You agree to use the Site only for lawful purposes. You shall not:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Use the Site in any way that violates applicable laws</li>
                <li>Attempt to gain unauthorised access to our systems, networks, or data</li>
                <li>Use automated means to extract data without permission</li>
                <li>Transmit malware, spam, or other harmful content</li>
                <li>Impersonate another person or entity</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">9. Intellectual Property</h2>
              <p className="leading-relaxed">
                The Site&apos;s design, structure, text, and original content are owned by Restaurant
                Menus or its licensors. Restaurant names, logos, images, and menu content may be
                owned by the respective restaurants. You may not copy, modify, distribute, or
                commercially exploit our content without written permission.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">10. Governing Law</h2>
              <p className="leading-relaxed">
                These Terms shall be governed by the laws of Ghana. Any disputes shall be subject
                to the exclusive jurisdiction of the courts of Ghana.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">11. Contact</h2>
              <p className="leading-relaxed">
                For questions about these Terms, contact us at:
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
