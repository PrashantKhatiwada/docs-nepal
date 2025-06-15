import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Heart, Coffee, Gift, Star, Zap } from "lucide-react"
import Link from "next/link"

export default function DonatePage() {
  return (
    <div className="container mx-auto py-12 px-4">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Support DocsNepal</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          DocsNepal is completely free for everyone. Your donations help us maintain and improve the service.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {/* Why Donate */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Heart className="h-5 w-5 text-red-500 mr-2" />
              Why Donate?
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="mt-1 mr-4 bg-primary/10 p-2 rounded-full">
                  <Coffee className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Keep DocsNepal Free</h3>
                  <p className="text-sm text-muted-foreground">
                    Your donations help us keep DocsNepal free for everyone, especially those who need it most.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="mt-1 mr-4 bg-primary/10 p-2 rounded-full">
                  <Zap className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Improve & Expand</h3>
                  <p className="text-sm text-muted-foreground">
                    We use donations to add new templates, improve existing ones, and enhance the platform.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="mt-1 mr-4 bg-primary/10 p-2 rounded-full">
                  <Star className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Support Local Innovation</h3>
                  <p className="text-sm text-muted-foreground">
                    DocsNepal is built by Nepalese for Nepalese. Your support helps local tech innovation thrive.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-muted p-4 rounded-lg">
              <p className="text-sm italic">
                "We believe that access to proper documentation should be a right, not a privilege. That's why DocsNepal
                is and will always remain free for everyone."
              </p>
              <p className="text-sm font-medium mt-2">— The DocsNepal Team</p>
            </div>
          </CardContent>
        </Card>

        {/* Donation Options */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Gift className="h-5 w-5 text-primary mr-2" />
              Make a Donation
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-muted/30 p-4 rounded-lg">
              <div className="flex items-center mb-3">
                <Zap className="h-5 w-5 text-primary mr-2" />
                <h3 className="font-medium">Payment Integration Coming Soon</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                We're currently working on integrating eSewa and Khalti payment gateways directly into our website. In
                the meantime, you can support us by sending your donation to our eSewa account.
              </p>
            </div>

            <div className="border border-primary/20 rounded-lg p-4">
              <h3 className="font-medium text-center mb-3">eSewa Details</h3>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">eSewa ID:</span>
                <span className="font-mono bg-muted px-3 py-1 rounded text-sm">9863711426</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Account Name:</span>
                <span className="text-sm">Prashant Khatiwada</span>
              </div>
              <div className="mt-4 text-xs text-muted-foreground">
                Please include your name and email in the payment remarks so we can thank you for your support.
              </div>
            </div>

            <div className="text-center text-xs text-muted-foreground">
              <p>For international donations or bank transfers, please contact us at support@docsnepal.com</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Impact Section */}
      <div className="mt-20">
        <h2 className="text-3xl font-bold text-center mb-12">Your Impact</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-4xl font-bold text-primary mb-2">10+</div>
              <p className="text-muted-foreground">Documents Generated</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-4xl font-bold text-primary mb-2">5+</div>
              <p className="text-muted-foreground">Active Users</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-4xl font-bold text-primary mb-2">10+</div>
              <p className="text-muted-foreground">Templates Available</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Testimonials */}
      <div className="mt-20">
        <h2 className="text-3xl font-bold text-center mb-12">What Users Say</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Card>
            <CardContent className="pt-6">
              <p className="italic mb-4">
                "DocsNepal saved me hours of formatting and worrying about the correct format for my leave application.
                Thank you for making this free for everyone!"
              </p>
              <p className="font-medium">— Ramesh S., Kathmandu</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="italic mb-4">
                "As a Nepali living abroad, I needed documents in both English and Nepali. DocsNepal was a lifesaver for
                preparing my marriage affidavit."
              </p>
              <p className="font-medium">— Sunita P., Australia</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* CTA Section */}
      <div className="mt-20 text-center bg-primary text-primary-foreground rounded-lg p-12">
        <h2 className="text-3xl font-bold mb-4">Ready to Support DocsNepal?</h2>
        <p className="text-xl mb-8 opacity-90">
          Your contribution helps us continue providing free document services to all Nepalese
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" variant="secondary">
            <Heart className="mr-2 h-5 w-5" />
            Donate Now
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/templates">Use Templates</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
