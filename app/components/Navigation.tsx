"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

export default function Navigation() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinks = [
    { href: "/blogs", label: "Blog" },
    { href: "/contact", label: "Contact Us" },
  ];

  return (
    <nav
    className={`fixed top-0 left-0 right-0 z-50 border-b transition-all duration-300 ${
      scrolled
        ? "border-gray-200/80 bg-white/80 shadow-sm backdrop-blur-md"
        : "border-gray-100 bg-white"
    }`}
  >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo - primary icon + text */}
          <Link href="/home" className="flex items-center gap-2.5 text-xl font-bold text-gray-900 hover:opacity-90 transition-opacity">
            <div className="flex items-center justify-center w-9 h-9">
              <svg viewBox="0 0 32 32" fill="none" className="w-8 h-8 text-primary">
                <path d="M4 8 L16 4 L28 8 L28 24 L16 28 L4 24 Z" stroke="currentColor" strokeWidth="2" fill="none" strokeLinejoin="round"/>
                <path d="M16 4 L16 28 M4 8 L16 12 L28 8 M4 24 L16 20 L28 24" stroke="currentColor" strokeWidth="1.5" fill="none"/>
              </svg>
            </div>
            <span className="text-lg font-bold text-primary">RESTAURANTS</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors ${
                  pathname === link.href || (link.href === "/blogs" && pathname.startsWith("/blogs")) || (link.href === "/contact" && pathname === "/contact") ? "text-gray-900" : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="flex items-center gap-4 ml-4 pl-4 border-l border-gray-200">
              <Link
                href="/menus"
                className="inline-flex items-center justify-center rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-primary-dark"
                aria-label="View restaurant menus"
              >
                View Menu
              </Link>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden rounded-lg p-2 text-gray-700 hover:bg-gray-100 transition-colors"
            aria-label="Toggle menu"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-100 py-4 flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} onClick={() => setIsMenuOpen(false)} className="text-base font-medium text-gray-700 hover:text-gray-900">
                {link.label}
              </Link>
            ))}
            <Link href="/menus" onClick={() => setIsMenuOpen(false)} className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white text-center" aria-label="View restaurant menus">
              View Menu
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
