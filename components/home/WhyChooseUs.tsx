"use client";

import {
  ShieldCheck,
  Star,
  Users,
  Heart,
  Globe,
  Lock,
  CheckCircle2,
} from "lucide-react";
import { whyChooseUs } from "@/lib/data";

const iconMap: Record<string, React.ElementType> = {
  "shield-check": ShieldCheck,
  star: Star,
  users: Users,
  heart: Heart,
  globe: Globe,
  lock: Lock,
};

export default function WhyChooseUs() {
  return (
    <section
      className="section-padding bg-gradient-to-br from-maroon-950 via-maroon-900 to-maroon-950 relative overflow-hidden"
      id="why-choose-us"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 hero-pattern opacity-50" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold-500/40 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold-500/40 to-transparent" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-2 text-gold-400 text-xs font-bold uppercase tracking-widest mb-4 bg-gold-500/10 border border-gold-400/30 px-4 py-1.5 rounded-full">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Trusted by 5 Lakh+ Families
          </span>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-white mb-5">
            Why Choose{" "}
            <span className="bg-gradient-to-r from-gold-400 to-gold-300 bg-clip-text text-transparent">
              Gokul Vivaham?
            </span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
            We are not just a matrimony platform — we are your trusted family
            advisor, connecting Tamil hearts with care, tradition, and
            integrity since 2010.
          </p>
          <div className="mt-6 h-px max-w-xs mx-auto bg-gradient-to-r from-transparent via-gold-500/50 to-transparent" />
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {whyChooseUs.map((item, idx) => {
            const Icon = iconMap[item.icon] || Star;
            return (
              <div
                key={item.id}
                className="group relative bg-white/5 hover:bg-white/10 backdrop-blur-sm border border-white/10 hover:border-gold-400/30 rounded-3xl p-7 transition-all duration-400 hover:-translate-y-1 hover:shadow-xl hover:shadow-gold-500/5"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                {/* Icon */}
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-gold-600/20 to-gold-500/10 border border-gold-500/20 flex items-center justify-center mb-5 group-hover:scale-110 group-hover:from-gold-500/30 transition-all duration-300">
                  <Icon className="w-7 h-7 text-gold-400" />
                </div>

                {/* Content */}
                <h3 className="text-white font-bold text-lg mb-3">
                  {item.title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {item.description}
                </p>

                {/* Hover glow */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-gold-500/0 to-gold-500/0 group-hover:from-gold-500/5 group-hover:to-transparent transition-all duration-500 pointer-events-none" />
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center gap-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl px-8 py-6">
            <div className="text-left">
              <p className="text-white font-bold text-lg">
                Ready to find your perfect match?
              </p>
              <p className="text-gray-400 text-sm">
                Join free today — no credit card required
              </p>
            </div>
            <a
              href="/register"
              id="why-choose-cta-btn"
              className="flex-shrink-0 px-6 py-3 bg-gradient-to-r from-gold-600 to-gold-500 hover:from-gold-500 hover:to-gold-400 text-white font-bold rounded-2xl transition-all duration-300 hover:shadow-lg hover:shadow-gold-500/30 hover:scale-[1.03] whitespace-nowrap"
            >
              Get Started Free →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
