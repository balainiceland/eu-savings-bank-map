export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-2xl mx-auto bg-white border-2 border-black rounded-2xl shadow-[4px_4px_0_0_rgba(0,0,0,1)] p-8">
        <h1 className="text-2xl font-bold text-black mb-6">Privacy Policy</h1>
        <p className="text-gray-400 text-sm mb-8">Last updated: February 2026</p>

        <div className="space-y-6 text-gray-600 text-sm leading-relaxed">
          <section>
            <h2 className="text-lg font-semibold text-black mb-2">What We Collect</h2>
            <p>
              When you sign in — via email magic link or a social provider (Google, LinkedIn, X) —
              we store only your <strong className="text-black">email address</strong> to verify
              you are an authorized user. We do not request or store any other profile data.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-black mb-2">Why We Collect It</h2>
            <p>
              Your email is used solely to grant access to the European Savings Bank Map.
              It is checked against an authorized-users list maintained by the site administrators.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-black mb-2">Third-Party Services</h2>
            <p>
              Authentication is handled by <strong className="text-black">Supabase</strong>.
              If you choose social sign-in, the OAuth flow is managed by the respective provider
              (Google, LinkedIn, or X). We receive only your email from these providers.
              We do not share your data with any other third parties.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-black mb-2">Data Retention</h2>
            <p>
              Your email remains in our authorized-users table for as long as your access is active.
              You may request removal at any time by contacting the site administrator.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-black mb-2">Contact</h2>
            <p>
              For questions or data removal requests, contact the site administrator
              at <strong className="text-black">bala@startupiceland.com</strong>.
            </p>
          </section>
        </div>

        <div className="mt-8 pt-6 border-t-2 border-black">
          <a href="/" className="text-esb-royal hover:text-black text-sm font-bold transition-colors">
            &larr; Back to map
          </a>
        </div>
      </div>
    </div>
  );
}
