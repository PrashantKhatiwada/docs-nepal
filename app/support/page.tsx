import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, LifeBuoy, Clock, FileText } from "lucide-react"

export default function SupportPage() {
  return (
    <div className="container mx-auto py-12 px-4">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="text-center space-y-3">
          <h1 className="text-4xl font-bold">Support</h1>
          <p className="text-muted-foreground">
            Need help with sign in, verification, templates, or document generation? We are here to help.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-primary" />
              Contact Support
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>Email: support@docsnepal.com</p>
            <p>Response time: Usually within 24-48 hours</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LifeBuoy className="h-5 w-5 text-primary" />
              Common Help Topics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>- Email verification with OTP codes</p>
            <p>- Account login and password reset</p>
            <p>- Saving and editing existing documents</p>
            <p>- PDF generation and download issues</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Before You Contact Us
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>- Include the template name and exact error message</p>
            <p>- Mention your browser and device</p>
            <p>- Share screenshots when possible</p>
          </CardContent>
        </Card>

        <div className="text-xs text-muted-foreground text-center flex items-center justify-center gap-2">
          <Clock className="h-4 w-4" />
          Support availability may vary during holidays in Nepal.
        </div>
      </div>
    </div>
  )
}
