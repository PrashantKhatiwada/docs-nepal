export default function PrivacyPage() {
  return (
    <div className="container mx-auto py-12 px-4">
      <div className="max-w-3xl mx-auto space-y-6">
        <h1 className="text-4xl font-bold">Privacy Policy</h1>
        <p className="text-sm text-muted-foreground">Last updated: April 2026</p>

        <section className="space-y-2 text-sm text-muted-foreground">
          <h2 className="text-lg font-semibold text-foreground">1. Data We Collect</h2>
          <p>
            We collect account information (such as name and email) and document content you choose to save in your
            account.
          </p>
        </section>

        <section className="space-y-2 text-sm text-muted-foreground">
          <h2 className="text-lg font-semibold text-foreground">2. How We Use Data</h2>
          <p>
            Data is used to provide authentication, save your documents, and improve product quality. We do not sell
            your personal data.
          </p>
        </section>

        <section className="space-y-2 text-sm text-muted-foreground">
          <h2 className="text-lg font-semibold text-foreground">3. Storage and Security</h2>
          <p>
            Your data is stored in managed cloud infrastructure. While we apply security controls, no system can be
            guaranteed 100% secure.
          </p>
        </section>

        <section className="space-y-2 text-sm text-muted-foreground">
          <h2 className="text-lg font-semibold text-foreground">4. Your Choices</h2>
          <p>You may request support for account or data-related issues by contacting support@docsnepal.com.</p>
        </section>

        <section className="space-y-2 text-sm text-muted-foreground">
          <h2 className="text-lg font-semibold text-foreground">5. Contact</h2>
          <p>Privacy questions: support@docsnepal.com</p>
        </section>
      </div>
    </div>
  )
}
