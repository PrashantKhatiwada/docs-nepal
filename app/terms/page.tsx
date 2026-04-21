export default function TermsPage() {
  return (
    <div className="container mx-auto py-12 px-4">
      <div className="max-w-3xl mx-auto space-y-6">
        <h1 className="text-4xl font-bold">Terms of Service</h1>
        <p className="text-sm text-muted-foreground">Last updated: April 2026</p>

        <section className="space-y-2 text-sm text-muted-foreground">
          <h2 className="text-lg font-semibold text-foreground">1. Service Overview</h2>
          <p>
            DocsNepal helps users generate document drafts using template-based forms. Generated output should be
            reviewed before official submission.
          </p>
        </section>

        <section className="space-y-2 text-sm text-muted-foreground">
          <h2 className="text-lg font-semibold text-foreground">2. Account Responsibility</h2>
          <p>You are responsible for keeping your account credentials secure and for all activity under your account.</p>
        </section>

        <section className="space-y-2 text-sm text-muted-foreground">
          <h2 className="text-lg font-semibold text-foreground">3. Acceptable Use</h2>
          <p>
            You agree not to use the service for fraud, impersonation, harassment, or unlawful activities. We may
            suspend accounts that violate these terms.
          </p>
        </section>

        <section className="space-y-2 text-sm text-muted-foreground">
          <h2 className="text-lg font-semibold text-foreground">4. Legal Disclaimer</h2>
          <p>
            DocsNepal does not provide legal advice. Templates are informational tools and may not fit all legal or
            procedural contexts.
          </p>
        </section>

        <section className="space-y-2 text-sm text-muted-foreground">
          <h2 className="text-lg font-semibold text-foreground">5. Contact</h2>
          <p>Questions about these terms: support@docsnepal.com</p>
        </section>
      </div>
    </div>
  )
}
