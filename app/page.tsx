import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { FileText, Download, Globe, Shield, Star, Zap } from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <div className="container mx-auto text-center">
          <Badge variant="secondary" className="mb-4">
            🇳🇵 Made for Nepal
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Generate Nepali Documents Instantly
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Nibedan, CV, Patta, Affidavits — fill a form and get ready-to-use
            documents in proper Nepali format.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button size="lg" asChild>
              <Link href="/templates">
                <FileText className="mr-2 h-5 w-5" />
                Browse Templates
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/templates">
                <Zap className="mr-2 h-5 w-5" />
                Generate Now
              </Link>
            </Button>
          </div>

          {/* Document Preview */}
          <div className="max-w-2xl mx-auto">
            <Card className="overflow-hidden shadow-2xl">
              <CardContent className="p-0">
                <div className="bg-white p-8 text-black min-h-[600px] font-serif">
                  <div className="text-center mb-6">
                    <h3 className="text-xl font-bold text-black">
                      बिदाको लागि निवेदन पत्र
                    </h3>
                    <p className="text-sm text-gray-600">
                      Sample Leave Application
                    </p>
                  </div>

                  <div className="space-y-4 text-sm text-black">
                    <div className="text-right">
                      <p>मिति: २०८२ असार ०१ गते</p>
                    </div>

                    <div className="text-left">
                      <p>श्रीमान्,</p>
                      <p>कार्यालय प्रमुख</p>
                      <p>ज्ञानोदय पब्लिक स्कूल</p>
                      <p>कालिमाटी, काठमाडौं</p>
                    </div>

                    <div className="mt-4">
                      <p>
                        <strong>विषय:</strong> तीन दिन बिदा स्वीकृत गरिपाऊँ।
                      </p>
                    </div>

                    <div className="mt-4">
                      <p className="text-left">महोदय,</p>
                      <p class="text-left">
                        उपरोक्त सम्बन्धमा, म यस विद्यालयमा प्राथमिक तहको
                        शिक्षकको रूपमा कार्यरत छु। मलाई मिति २०८२ असार ०२
                        गतेदेखि २०८२ असार ०४ गतेसम्म (जम्मा ३ दिन) ज्वरोको
                        कारणले बिदा चाहिएको हुँदा बिदा स्वीकृत गरिदिनुहुन
                        हार्दिक अनुरोध गर्दछु।
                      </p>
                      <p class="text-left">
                        यस अवधिमा मेरो अनुपस्थितिले विद्यार्थीको पढाइमा कुनै
                        बाधा नपरोस् भनी मैले आफ्नो जिम्मेवारी सहकर्मी श्री
                        [सहकर्मीको नाम] लाई हस्तान्तरण गरेको छु। बिदा समाप्त
                        भएपश्चात म नियमित रूपमा विद्यालयमा उपस्थित हुनेछु।
                      </p>
                    </div>

                    <div class="pt-5 text-right">
                      <p>धन्यवाद सहित,</p>
                      <div class="mt-4">
                        <p>भवदीय,</p>
                        <p>राम प्रसाद शर्मा</p>
                        <p>प्राथमिक तहको शिक्षक</p>
                        <p>सम्पर्क नम्बर: ९८७६५४३२१०</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why Choose DocsNepal?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Professional document generation made simple for every Nepali
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center p-6">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">10+ Templates</h3>
              <p className="text-sm text-muted-foreground">
                Comprehensive collection of official and personal document
                templates
              </p>
            </Card>

            <Card className="text-center p-6">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Globe className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Nepali & English</h3>
              <p className="text-sm text-muted-foreground">
                Full support for both Nepali and English document generation
              </p>
            </Card>

            <Card className="text-center p-6">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Download className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">PDF & DOC Export</h3>
              <p className="text-sm text-muted-foreground">
                Download your documents in PDF or editable DOC format
              </p>
            </Card>

            <Card className="text-center p-6">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Legal Accuracy</h3>
              <p className="text-sm text-muted-foreground">
                Properly formatted documents that meet official standards
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Popular Templates */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Popular Templates
            </h2>
            <p className="text-xl text-muted-foreground">
              Most used document templates by our users
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "CV/Resume Generator",
                description: "Professional CV in Nepali and English format",
                category: "Personal",
                popular: true,
              },
              {
                title: "Leave Application (निवेदन)",
                description: "General leave application for office use",
                category: "Employment",
                popular: true,
              },
              {
                title: "Marriage Affidavit",
                description: "Legal marriage affidavit document",
                category: "Legal",
                popular: false,
              },
              {
                title: "Rent Agreement",
                description: "House/room rental agreement contract",
                category: "Legal",
                popular: false,
              },
              {
                title: "RTI Application",
                description: "Right to Information request form",
                category: "Legal",
                popular: false,
              },
              {
                title: "Character Certificate",
                description: "Character certificate application",
                category: "Personal",
                popular: true,
              },
            ].map((template, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <Badge variant={template.popular ? "default" : "secondary"}>
                      {template.category}
                    </Badge>
                    {template.popular && (
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    )}
                  </div>
                  <h3 className="font-semibold mb-2">{template.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {template.description}
                  </p>
                  <Button size="sm" variant="outline" className="w-full">
                    Use Template
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button size="lg" asChild>
              <Link href="/templates">View All Templates</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-primary mb-2">
                10+
              </div>
              <p className="text-muted-foreground">Documents Generated</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">5+</div>
              <p className="text-muted-foreground">Happy Users</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">10+</div>
              <p className="text-muted-foreground">Template Options</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-primary text-primary-foreground">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Generate Your Documents?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of Nepalis who trust DocsNepal for their document
            needs
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild>
              <Link href="/templates">Get Started</Link>
            </Button>
            <Button size="lg" variant="secondary" asChild>
              <Link href="/donate">Support Us</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
