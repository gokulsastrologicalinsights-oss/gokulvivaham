"use client";

import Link from "next/link";
import {
  Heart,
  Mail,
  Phone,
  MapPin,
  Instagram,
  Facebook,
  Twitter,
  Youtube,
  ArrowUpRight,
  MessageCircle,
} from "lucide-react";
import { footerLinks } from "@/lib/data";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-br from-maroon-950 via-maroon-900 to-maroon-950 text-white">
      {/* Top wave decoration */}
      <div className="h-px bg-gradient-to-r from-transparent via-gold-500/50 to-transparent" />

      {/* Main footer content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 group mb-6">
              <div className="w-10 h-10 rounded-full bg-gold-500/20 border border-gold-400/30 flex items-center justify-center group-hover:bg-gold-500/30 transition-colors">
                <Heart className="w-5 h-5 text-gold-400 fill-current" />
              </div>
              <div>
                <div className="font-bold text-xl text-white">
                  Gokul <span className="text-gold-400">Vivaham</span>
                </div>
                <div
                  className="text-[9px] text-gold-300/70 tracking-widest uppercase"
                  style={{ fontFamily: "var(--font-tamil)" }}
                >
                  கோகுல் விவாஹம்
                </div>
              </div>
            </Link>

            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Trusted by over 5,00,000 Tamil families worldwide. We believe
              every soul deserves to find their perfect match — with love,
              trust, and tradition.
            </p>

            {/* Social Media */}
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-3">
                Follow Us
              </p>
              <div className="flex items-center gap-2.5">
                {[
                  { icon: Facebook, label: "Facebook", href: "#" },
                  { icon: Instagram, label: "Instagram", href: "#" },
                  { icon: Twitter, label: "Twitter/X", href: "#" },
                  { icon: Youtube, label: "YouTube", href: "#" },
                  { icon: MessageCircle, label: "WhatsApp", href: "#" },
                ].map(({ icon: Icon, label, href }) => (
                  <a
                    key={label}
                    href={href}
                    aria-label={label}
                    className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-gold-400 hover:bg-gold-500/10 hover:border-gold-500/30 transition-all duration-200"
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-6 flex items-center gap-2">
              <span className="w-5 h-0.5 bg-gold-500 inline-block" />
              Quick Links
            </h3>
            <ul className="space-y-3">
              {footerLinks.quickLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-gold-400 text-sm flex items-center gap-1.5 group transition-colors duration-200"
                  >
                    <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all duration-200" />
                    <span className="group-hover:translate-x-0.5 transition-transform duration-200">
                      {link.name}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-6 flex items-center gap-2">
              <span className="w-5 h-0.5 bg-gold-500 inline-block" />
              Legal
            </h3>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-gold-400 text-sm flex items-center gap-1.5 group transition-colors duration-200"
                  >
                    <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all duration-200" />
                    <span className="group-hover:translate-x-0.5 transition-transform duration-200">
                      {link.name}
                    </span>
                  </a>
                </li>
              ))}
            </ul>

            {/* App Download */}
            <div className="mt-8">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-3">
                Download App
              </p>
              <div className="space-y-2">
                <a
                  href="#"
                  className="flex items-center gap-2 text-xs text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 px-3 py-2 rounded-lg transition-all duration-200"
                >
                  📱 App Store
                </a>
                <a
                  href="#"
                  className="flex items-center gap-2 text-xs text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 px-3 py-2 rounded-lg transition-all duration-200"
                >
                  🤖 Google Play
                </a>
              </div>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-6 flex items-center gap-2">
              <span className="w-5 h-0.5 bg-gold-500 inline-block" />
              Contact Us
            </h3>
            <div className="space-y-4">
              <a
                href={`mailto:${footerLinks.contact.email}`}
                className="flex items-start gap-3 group"
              >
                <div className="w-8 h-8 rounded-lg bg-gold-500/10 border border-gold-500/20 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:bg-gold-500/20 transition-colors">
                  <Mail className="w-4 h-4 text-gold-400" />
                </div>
                <div>
                  <p className="text-[10px] text-gray-500 uppercase tracking-wider">Email</p>
                  <p className="text-sm text-gray-300 group-hover:text-gold-400 transition-colors break-all">
                    {footerLinks.contact.email}
                  </p>
                </div>
              </a>

              <a
                href={`tel:${footerLinks.contact.phone.replace(/\s/g, "")}`}
                className="flex items-start gap-3 group"
              >
                <div className="w-8 h-8 rounded-lg bg-gold-500/10 border border-gold-500/20 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:bg-gold-500/20 transition-colors">
                  <Phone className="w-4 h-4 text-gold-400" />
                </div>
                <div>
                  <p className="text-[10px] text-gray-500 uppercase tracking-wider">Phone</p>
                  <p className="text-sm text-gray-300 group-hover:text-gold-400 transition-colors">
                    {footerLinks.contact.phone}
                  </p>
                </div>
              </a>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-gold-500/10 border border-gold-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <MapPin className="w-4 h-4 text-gold-400" />
                </div>
                <div>
                  <p className="text-[10px] text-gray-500 uppercase tracking-wider">Address</p>
                  <p className="text-sm text-gray-300 leading-relaxed">
                    {footerLinks.contact.address}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Gold divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-gold-500/30 to-transparent" />

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-500 text-center sm:text-left">
            © {currentYear} Gokul Vivaham. All rights reserved.{" "}
            <span className="text-gray-600">Made with</span>{" "}
            <span className="text-maroon-500">❤️</span>{" "}
            <span className="text-gray-600">in Tamil Nadu</span>
          </p>
          <div className="flex items-center gap-4">
            <span className="text-[10px] text-gray-600 bg-white/5 px-3 py-1 rounded-full border border-white/10">
              🔒 SSL Secured
            </span>
            <span className="text-[10px] text-gray-600 bg-white/5 px-3 py-1 rounded-full border border-white/10">
              ✅ ISO Certified
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
