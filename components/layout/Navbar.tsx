"use client";

import { useState, useEffect, useRef } from "react";
import { Menu, X, Heart, ChevronDown, Search } from "lucide-react";
import { navLinks } from "@/lib/data";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeLink, setActiveLink] = useState("/");
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-white/95 backdrop-blur-xl shadow-lg shadow-maroon-900/5 border-b border-gold-100"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-18 py-3">
            {/* Logo */}
            <a
              href="/"
              className="flex items-center gap-2.5 group flex-shrink-0"
              aria-label="Gokul Vivaham - Home"
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-maroon-900 to-maroon-700 flex items-center justify-center shadow-lg group-hover:shadow-maroon-900/30 group-hover:scale-105 transition-all duration-300">
                <Heart className="w-5 h-5 text-gold-400 fill-current" />
              </div>
              <div className="leading-none">
                <div
                  className={`font-bold text-lg transition-colors duration-300 ${
                    scrolled ? "text-maroon-900" : "text-white"
                  }`}
                >
                  Gokul{" "}
                  <span className="text-gold-500">Vivaham</span>
                </div>
                <div
                  className={`text-[9px] font-medium tracking-widest uppercase transition-colors duration-300 ${
                    scrolled ? "text-maroon-600" : "text-gold-200"
                  }`}
                  style={{ fontFamily: "var(--font-tamil)" }}
                >
                  கோகுல் விவாஹம்
                </div>
              </div>
            </a>

            {/* Desktop Nav Links */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setActiveLink(link.href)}
                  className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                    activeLink === link.href
                      ? scrolled
                        ? "text-maroon-900 bg-maroon-50"
                        : "text-gold-300 bg-white/10"
                      : scrolled
                      ? "text-gray-700 hover:text-maroon-800 hover:bg-maroon-50/70"
                      : "text-white/90 hover:text-white hover:bg-white/10"
                  }`}
                >
                  {link.name}
                  {activeLink === link.href && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-gold-500" />
                  )}
                </a>
              ))}
            </div>

            {/* Desktop CTA Buttons */}
            <div className="hidden lg:flex items-center gap-3">
              <a
                href="/login"
                className={`px-5 py-2 text-sm font-semibold rounded-xl border-2 transition-all duration-300 ${
                  scrolled
                    ? "text-maroon-800 border-maroon-700 hover:bg-maroon-50"
                    : "text-white border-white/40 hover:border-white hover:bg-white/10"
                }`}
              >
                Login
              </a>
              <a
                href="/register"
                className="px-5 py-2 text-sm font-semibold rounded-xl bg-gradient-to-r from-gold-600 to-gold-500 text-white hover:from-gold-500 hover:to-gold-400 shadow-lg hover:shadow-gold-500/30 transition-all duration-300 hover:scale-[1.03]"
              >
                Register Free
              </a>
            </div>

            {/* Mobile Hamburger */}
            <button
              id="mobile-menu-toggle"
              onClick={() => setIsOpen(!isOpen)}
              className={`lg:hidden p-2 rounded-xl transition-all duration-200 ${
                scrolled
                  ? "text-maroon-800 hover:bg-maroon-50"
                  : "text-white hover:bg-white/10"
              }`}
              aria-label={isOpen ? "Close menu" : "Open menu"}
              aria-expanded={isOpen}
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-40 lg:hidden transition-all duration-300 ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />

        {/* Drawer */}
        <div
          ref={menuRef}
          className={`absolute top-0 right-0 h-full w-[80%] max-w-sm bg-white shadow-2xl transition-transform duration-400 ease-out flex flex-col ${
            isOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          {/* Drawer Header */}
          <div className="bg-gradient-to-r from-maroon-900 to-maroon-800 px-6 py-6 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-gold-500/20 border border-gold-400/30 flex items-center justify-center">
                <Heart className="w-4.5 h-4.5 text-gold-400 fill-current" />
              </div>
              <div>
                <div className="font-bold text-base text-white">
                  Gokul <span className="text-gold-400">Vivaham</span>
                </div>
                <div
                  className="text-[9px] text-gold-300 tracking-widest uppercase"
                  style={{ fontFamily: "var(--font-tamil)" }}
                >
                  கோகுல் விவாஹம்
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 text-white/60 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Nav Links */}
          <div className="flex-1 overflow-y-auto py-6 px-4">
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest px-3 mb-3">
              Navigation
            </p>
            <nav className="space-y-1">
              {navLinks.map((link, idx) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => { setActiveLink(link.href); setIsOpen(false); }}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                    activeLink === link.href
                      ? "bg-maroon-50 text-maroon-800 border-l-4 border-maroon-700"
                      : "text-gray-700 hover:bg-maroon-50/50 hover:text-maroon-800"
                  }`}
                  style={{ animationDelay: `${idx * 50}ms` }}
                >
                  {link.name}
                </a>
              ))}
            </nav>

            {/* Quick Search */}
            <div className="mt-6 px-3">
              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-3">
                Quick Search
              </p>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search profiles..."
                  className="w-full pl-9 pr-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-maroon-400 focus:ring-1 focus:ring-maroon-400 transition-all"
                />
              </div>
            </div>
          </div>

          {/* Drawer Footer CTA */}
          <div className="flex-shrink-0 p-4 border-t border-gray-100 space-y-3">
            <a
              href="/register"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-center w-full py-3 text-sm font-bold text-white bg-gradient-to-r from-gold-600 to-gold-500 rounded-xl shadow-lg hover:shadow-gold-500/30 transition-all duration-300"
            >
              Register Free — Start Today
            </a>
            <a
              href="/login"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-center w-full py-3 text-sm font-semibold text-maroon-800 border-2 border-maroon-200 rounded-xl hover:bg-maroon-50 transition-all duration-200"
            >
              Already a Member? Login
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
