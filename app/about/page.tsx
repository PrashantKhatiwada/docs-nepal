import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { FileText, Users, Target, Heart, Mail, Phone, MapPin } from "lucide-react"
import Link from "next/link"

export default function AboutPage() {
  return (
    <div className="container mx-auto py-12 px-4">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <Badge variant="secondary" className="mb-4">
          About DocsNepal
        </Badge>
        <h1 className="text-4xl md:text-5xl font-bold mb-6">Simplifying Documentation for Every Nepali</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          We believe that creating official documents shouldn't be complicated. DocsNepal was born from the need to make
          document generation accessible, accurate, and effortless for everyone in Nepal.
        </p>
      </div>

      {/* Mission Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
        <Card className="text-center">
          <CardHeader>
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Target className="h-6 w-6 text-primary" />
            </div>
            <CardTitle>Our Mission</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              To democratize access to properly formatted legal and official documents for every Nepali, regardless of
              their technical expertise or location.
            </p>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardHeader>
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <CardTitle>Our Vision</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              To become Nepal's most trusted platform for document generation, helping citizens navigate bureaucracy
              with confidence and ease.
            </p>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardHeader>
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Heart className="h-6 w-6 text-primary" />
            </div>
            <CardTitle>Our Values</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Accuracy, accessibility, and authenticity. We ensure every document meets official standards while being
              easy to create and understand.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Story Section */}
      <div className="mb-20">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">Our Story</h2>
          <div className="prose prose-lg mx-auto text-muted-foreground">
            <p className="text-center mb-6">
              DocsNepal launched in 2025 to solve a problem I faced personally — the struggle of creating official documents that are clear, correctly formatted, and legally acceptable in Nepal. Whether it was writing a simple leave application or drafting a complex affidavit, the process was often confusing, time-consuming, and filled with uncertainty.
            </p>
            <p className="text-center mb-6">
              Seeing how many Nepalis deal with the same issues — from unclear formats to legal jargon — I built DocsNepal to make document creation effortless. Instead of guessing how to write something official, users can now generate professional, legally sound documents just by filling out a guided form.
            </p>
            <p className="text-center">
              While we've only just launched, DocsNepal is already helping people across Nepal and beyond take control of their paperwork — faster, easier, and with confidence.
            </p>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-muted/30 rounded-lg p-12 mb-20">
        <h2 className="text-3xl font-bold text-center mb-12">DocsNepal by the Numbers</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-4xl font-bold text-primary mb-2">10+</div>
            <p className="text-muted-foreground">Documents Generated</p>
          </div>
          <div>
            <div className="text-4xl font-bold text-primary mb-2">5+</div>
            <p className="text-muted-foreground">Active Users</p>
          </div>
          <div>
            <div className="text-4xl font-bold text-primary mb-2">10+</div>
            <p className="text-muted-foreground">Template Options</p>
          </div>
          <div>
            <div className="text-4xl font-bold text-primary mb-2">99.9%</div>
            <p className="text-muted-foreground">Uptime</p>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="mb-20">
        <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div>
            <h3 className="font-semibold mb-3">Is DocsNepal legally compliant?</h3>
            <p className="text-muted-foreground text-sm mb-6">
              Yes, all our templates are created by legal experts and follow official Nepali government formats and
              requirements. However, we recommend consulting with a lawyer for complex legal matters.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-3">Can I use DocsNepal from outside Nepal?</h3>
            <p className="text-muted-foreground text-sm mb-6">
              DocsNepal is designed for Nepalis worldwide. Many of our users are from the diaspora who need official
              Nepali documents for various purposes.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-3">How accurate are the document formats?</h3>
            <p className="text-muted-foreground text-sm mb-6">
              Our templates are regularly updated to match current official formats. We work with legal professionals
              and government liaisons to ensure accuracy.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-3">Do you store my personal information?</h3>
            <p className="text-muted-foreground text-sm mb-6">
              We prioritize your privacy. Personal information is only stored if you create an account, and you can
              delete your data at any time. We never share your information with third parties.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-3">Can I suggest new templates?</h3>
            <p className="text-muted-foreground text-sm mb-6">
              Yes! We actively encourage user feedback and template suggestions. Contact us through our support channels
              with your ideas.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-3">What if I need help with a document?</h3>
            <p className="text-muted-foreground text-sm mb-6">
              We offer comprehensive guides for each template, and our support team is available via email. Premium
              users get priority support.
            </p>
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div>
          <h2 className="text-3xl font-bold mb-6">Get in Touch</h2>
          <p className="text-muted-foreground mb-8">
            Have questions, suggestions, or need help? We'd love to hear from you. Our team is here to help make your
            document creation experience as smooth as possible.
          </p>

          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Mail className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium">Email</p>
                <p className="text-muted-foreground">support@docsnepal.com</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Phone className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium">Phone</p>
                <p className="text-muted-foreground">+977-1-4444444</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <MapPin className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium">Address</p>
                <p className="text-muted-foreground">Kathmandu, Nepal</p>
              </div>
            </div>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Send us a Message</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" placeholder="Your first name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" placeholder="Your last name" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="your.email@example.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input id="subject" placeholder="What's this about?" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea id="message" placeholder="Tell us how we can help you..." rows={5} />
              </div>
              <Button className="w-full">Send Message</Button>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* CTA Section */}
      <div className="mt-20 text-center bg-primary text-primary-foreground rounded-lg p-12">
        <h2 className="text-3xl font-bold mb-4">Ready to Create Your Documents?</h2>
        <p className="text-xl mb-8 opacity-90">
          Join thousands of Nepalis who trust DocsNepal for their document needs
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" variant="secondary" asChild>
            <Link href="/templates">
              <FileText className="mr-2 h-5 w-5" />
              Browse Templates
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
