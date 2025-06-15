"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { FileText, Menu, LogOut, LayoutDashboard, User } from "lucide-react"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useAuth } from "@/lib/auth"
// Import the ThemeSwitcher component at the top of the file
import { ThemeSwitcher } from "@/components/theme-switcher"

const navigation = [
  { name: "Home", href: "/" },
  { name: "Templates", href: "/templates" },
  { name: "Donate", href: "/donate" },
  { name: "About", href: "/about" },
]

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const { user, signOut } = useAuth()

  const handleSignOut = async () => {
    await signOut()
    setIsOpen(false)
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center space-x-4 ml-5">
          <Link href="/" className="flex items-center space-x-2">
            <FileText className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl">DocsNepal</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                pathname === item.href ? "text-primary" : "text-muted-foreground",
              )}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="flex items-center space-x-4">
          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-2">
            <ThemeSwitcher />
            {user ? (
              <div className="relative">
                {/* Simple button with dropdown functionality */}
                <div className="flex items-center space-x-2 cursor-pointer">
                  <Button variant="ghost" className="flex items-center space-x-2" asChild>
                    <Link href="/dashboard">
                      <Avatar className="h-8 w-8 mr-2">
                        <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                        <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium hidden sm:inline-block">{user.name}</span>
                    </Link>
                  </Button>
                  <Button variant="destructive" size="sm" onClick={handleSignOut}>
                    Log Out
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <Button variant="ghost" asChild>
                  <Link href="/login">Login</Link>
                </Button>
                <Button asChild>
                  <Link href="/login">Get Started</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile Navigation */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="sm">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <nav className="flex flex-col space-y-4">
                <div className="flex justify-end mb-2">
                  <ThemeSwitcher />
                </div>
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "text-sm font-medium transition-colors hover:text-primary",
                      pathname === item.href ? "text-primary" : "text-muted-foreground",
                    )}
                    onClick={() => setIsOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
                <div className="pt-4 border-t">
                  {user ? (
                    <div className="flex flex-col space-y-2">
                      <div className="flex items-center space-x-2 p-2 bg-muted/30 rounded-lg">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                          <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-sm">{user.name}</p>
                          <p className="text-xs text-muted-foreground">{user.email}</p>
                        </div>
                      </div>
                      <Button variant="ghost" className="justify-start" asChild onClick={() => setIsOpen(false)}>
                        <Link href="/dashboard">
                          <LayoutDashboard className="h-4 w-4 mr-2" />
                          Dashboard
                        </Link>
                      </Button>
                      <Button variant="ghost" className="justify-start" asChild onClick={() => setIsOpen(false)}>
                        <Link href="/profile">
                          <User className="h-4 w-4 mr-2" />
                          Profile
                        </Link>
                      </Button>
                      <Button variant="destructive" className="justify-start" onClick={handleSignOut}>
                        <LogOut className="h-4 w-4 mr-2" />
                        Logout
                      </Button>
                    </div>
                  ) : (
                    <div className="flex flex-col space-y-2">
                      <Button variant="ghost" asChild onClick={() => setIsOpen(false)}>
                        <Link href="/login">Login</Link>
                      </Button>
                      <Button asChild onClick={() => setIsOpen(false)}>
                        <Link href="/login">Get Started</Link>
                      </Button>
                    </div>
                  )}
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
