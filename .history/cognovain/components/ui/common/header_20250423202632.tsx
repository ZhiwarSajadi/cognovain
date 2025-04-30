'use client'

import { Brain, Menu, X, ExternalLink, Sun, Moon } from 'lucide-react';
import Link from 'next/link';
import { SignedIn, SignedOut } from '@clerk/nextjs';
import { UserButton } from '@clerk/nextjs';
import { cn } from "@/lib/utils";
import { Button } from '@/components/ui/button';
import NavLink from '@/components/ui/common/nav-link';
import { useState, useEffect } from 'react';

export default function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [theme, setTheme] = useState<"light" | "dark">("light");
    
    // Initialize theme from localStorage or system preference
    useEffect(() => {
        // Check if user has a saved preference
        const savedTheme = localStorage.getItem("theme");
        if (savedTheme === "dark" || savedTheme === "light") {
            setTheme(savedTheme as "light" | "dark");
        } else {
            // Check system preference
            const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
            setTheme(systemPrefersDark ? "dark" : "light");
        }
    }, []);
    
    // Apply theme changes
    useEffect(() => {
        if (theme === "dark") {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
        localStorage.setItem("theme", theme);
    }, [theme]);
    
    const toggleTheme = () => {
        setTheme(theme === "light" ? "dark" : "light");
    };
    
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 10);
        };
        
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return ( 
    <header className={cn(
        "sticky top-0 z-50 w-full border-b backdrop-blur transition-all duration-200",
        scrolled 
            ? "border-border/40 bg-background/95 supports-[backdrop-filter]:bg-background/80 shadow-sm" 
            : "border-transparent bg-background/50 supports-[backdrop-filter]:bg-background/40"
    )}>
      <nav className="container flex h-16 items-center justify-between">
        {/* Logo and Name */}
        <NavLink href="/" className="flex items-center gap-2 transition-all duration-200 hover:opacity-80">  
          <div className="flex items-center justify-center rounded-md bg-gradient-to-br from-rose-500 to-rose-700 p-1.5 shadow-sm">
            <Brain className="h-5 w-5 text-white" />
          </div>
          <span className="font-extrabold text-xl bg-gradient-to-r from-rose-600 to-rose-500 bg-clip-text text-transparent">Cognovain</span>
        </NavLink>

        {/* Navigation Links - Desktop */}
        <div className="hidden md:flex items-center gap-8 absolute left-1/2 transform -translate-x-1/2">
          <NavLink href="/#how-it-works" className="text-sm font-medium transition-all hover:text-rose-600">
            How It Works
          </NavLink>
          <NavLink href="/#plans" className="text-sm font-medium transition-all hover:text-rose-600">
            Plans
          </NavLink>
          <NavLink href="/#faq" className="text-sm font-medium transition-all hover:text-rose-600">
            FAQ
          </NavLink>
        </div>

        {/* Theme Toggle and Sign In / User Actions */}
        <div className="flex items-center gap-4">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
          >
            {theme === "light" ? (
              <Moon className="h-5 w-5 text-gray-600" />
            ) : (
              <Sun className="h-5 w-5 text-yellow-300" />
            )}
          </button>
          <SignedIn>
            <div className="flex items-center gap-4">
              <NavLink 
                href="/submit" 
                className="text-sm font-medium text-rose-600 hover:text-rose-500 flex items-center gap-1.5"
              >
                <span>Submit Entry</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </NavLink>
              <NavLink 
                href="/dashboard" 
                className="text-sm font-medium text-rose-600 hover:text-rose-500"
              >
                Dashboard
              </NavLink>
              <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-rose-100 text-rose-700 hover:bg-rose-200">
                Pro
              </span>
              <UserButton afterSignOutUrl="/" />
            </div>
          </SignedIn>
          <SignedOut>
            <div className="flex items-center gap-4">
              <NavLink 
                href="/sign-up" 
                className="text-sm font-medium hidden sm:inline-flex"
              >
                Sign Up
              </NavLink>
              <Button asChild size="sm" className="shadow-sm bg-rose-600 hover:bg-rose-700 text-white">
                <Link href="/sign-in">Sign In</Link>
              </Button>
            </div>
          </SignedOut>

          {/* Mobile menu button */}
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-md p-2 text-muted-foreground md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <span className="sr-only">Open main menu</span>
            {mobileMenuOpen ? (
              <X className="h-6 w-6" aria-hidden="true" />
            ) : (
              <Menu className="h-6 w-6" aria-hidden="true" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile menu, show/hide based on menu state */}
      {mobileMenuOpen && (
        <div className="md:hidden">
          <div className="space-y-1 px-4 pb-3 pt-2">
            <NavLink
              href="/#how-it-works"
              className="block py-2 text-base font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              How It Works
            </NavLink>
            <NavLink
              href="/#plans"
              className="block py-2 text-base font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              Plans
            </NavLink>
            <NavLink
              href="/#faq"
              className="block py-2 text-base font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              FAQ
            </NavLink>
            <SignedIn>
              <NavLink
                href="/submit"
                className="block py-2 text-base font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Submit Entry
              </NavLink>
              <NavLink
                href="/dashboard"
                className="block py-2 text-base font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Dashboard
              </NavLink>
            </SignedIn>
            <SignedOut>
              <NavLink
                href="/sign-up"
                className="block py-2 text-base font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Sign Up
              </NavLink>
            </SignedOut>
          </div>
        </div>
      )}
    </header>
    );
}