import Link from "next/link"
import { FileText, Mail, Phone, MapPin, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Footer() {
  return (
    <footer className="bg-muted/50 border-t ml-5">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <FileText className="h-6 w-6 text-primary" />
              <span className="font-bold text-xl">DocsNepal</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Generate official and personal documents in Nepali — easily, quickly, and correctly.
            </p>
            <div className="pt-2">
              <Button variant="outline" size="sm" asChild>
                <Link href="/donate" className="flex items-center">
                  <Heart className="h-4 w-4 mr-2 text-red-500" />
                  Support DocsNepal
                </Link>
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold">Quick Links</h3>
            <div className="space-y-2">
              <Link href="/templates" className="block text-sm text-muted-foreground hover:text-primary">
                Templates
              </Link>
              <Link href="/donate" className="block text-sm text-muted-foreground hover:text-primary">
                Donate
              </Link>
              <Link href="/about" className="block text-sm text-muted-foreground hover:text-primary">
                About Us
              </Link>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold">Categories</h3>
            <div className="space-y-2">
              <Link
                href="/templates?category=personal"
                className="block text-sm text-muted-foreground hover:text-primary"
              >
                Personal
              </Link>
              <Link href="/templates?category=legal" className="block text-sm text-muted-foreground hover:text-primary">
                Legal
              </Link>
              <Link
                href="/templates?category=employment"
                className="block text-sm text-muted-foreground hover:text-primary"
              >
                Employment
              </Link>
              <Link
                href="/templates?category=education"
                className="block text-sm text-muted-foreground hover:text-primary"
              >
                Education
              </Link>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold">Contact</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>support@docnepal.com</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4" />
                <span>+977-1-4444444</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>Kathmandu, Nepal</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>&copy; 2024 DocsNepal. All rights reserved. DocsNepal is free for everyone.</p>
        </div>
      </div>
    </footer>
  )
}
