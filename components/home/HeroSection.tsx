"use client";

import { useState, useEffect } from "react";
import { ArrowRight, Play, ChevronDown, Sparkles, Star } from "lucide-react";
import { stats } from "@/lib/data";

const heroSlides = [
  {
    tagline: "கோகுல் விவாஹம்",
    headline: "Find Your",
    highlight: "Perfect Tamil",
    subheadline: "Life Partner",
    description:
      "Where tradition meets hearts. Connect with verified Tamil profiles across the globe and begin your forever story with us.",
    gradient: "from-maroon-950 via-maroon-900 to-[#2D0A0A]",
  },
  {
    tagline: "50,000+ திருமணங்கள்",
    headline: "Your Soulmate",
    highlight: "Awaits You",
    subheadline: "On Gokul Vivaham",
    description:
      "Join 5 lakh+ Tamil families who found love, trust, and a blessed union through our premium matrimony platform.",
    gradient: "from-[#1A0A1A] via-maroon-900 to-maroon-950",
  },
];

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const slide = heroSlides[currentSlide];

  return (
    <section
      className={`relative min-h-screen flex flex-col bg-gradient-to-br ${slide.gradient} overflow-hidden transition-all duration-1000`}
      id="hero"
    >
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 hero-pattern" />

      {/* Radial glow */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gold-500/5 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-maroon-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "2s" }} />

      {/* Traditional kolam border pattern (top) */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-gold-500 to-transparent opacity-60" />

      {/* Floating decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute text-gold-500/10 text-6xl select-none"
            style={{
              top: `${15 + i * 14}%`,
              left: `${5 + (i % 3) * 35}%`,
              transform: `rotate(${i * 30}deg)`,
              animationDelay: `${i * 0.5}s`,
            }}
          >
            ❋
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex-1 flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-32 lg:py-40">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left Content */}
            <div
              className={`transition-all duration-1000 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
            >
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-gold-500/15 border border-gold-400/30 text-gold-300 text-xs font-semibold px-4 py-2 rounded-full mb-6 backdrop-blur-sm">
                <Sparkles className="w-3.5 h-3.5" />
                <span style={{ fontFamily: "var(--font-tamil)" }}>
                  {slide.tagline}
                </span>
              </div>

              {/* Headline */}
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-tight mb-6">
                <span className="text-white block">{slide.headline}</span>
                <span className="bg-gradient-to-r from-gold-400 via-gold-300 to-gold-500 bg-clip-text text-transparent block">
                  {slide.highlight}
                </span>
                <span className="text-white/90 block">{slide.subheadline}</span>
              </h1>

              {/* Description */}
              <p className="text-gray-300 text-lg leading-relaxed mb-10 max-w-lg">
                {slide.description}
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-4 mb-12">
                <a
                  id="hero-create-profile-btn"
                  href="/register"
                  className="group inline-flex items-center gap-2.5 px-8 py-4 bg-gradient-to-r from-gold-600 to-gold-500 text-white font-bold text-base rounded-2xl shadow-2xl shadow-gold-500/25 hover:shadow-gold-500/40 hover:from-gold-500 hover:to-gold-400 transition-all duration-300 hover:scale-[1.03]"
                >
                  Create Profile
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </a>
                <a
                  id="hero-search-profiles-btn"
                  href="/search"
                  className="group inline-flex items-center gap-2.5 px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-bold text-base rounded-2xl border-2 border-white/20 hover:bg-white/20 hover:border-white/40 transition-all duration-300"
                >
                  Search Profiles
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </a>
              </div>

              {/* Trust badges */}
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <div className="flex -space-x-1.5">
                    {["priya", "kavitha", "meena"].map((seed) => (
                      <img
                        key={seed}
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}&backgroundColor=b6e3f4`}
                        alt=""
                        className="w-7 h-7 rounded-full border-2 border-maroon-800 bg-ivory-200"
                      />
                    ))}
                  </div>
                  <span className="text-xs text-gray-400">
                    <strong className="text-white">5,00,000+</strong> registered
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 text-gold-400 fill-current" />
                  ))}
                  <span className="text-xs text-gray-400 ml-1">
                    <strong className="text-white">4.9</strong>/5 Rating
                  </span>
                </div>
              </div>
            </div>

            {/* Right — Quick Search Card */}
            <div
              className={`transition-all duration-1000 delay-300 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
            >
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl">
                <div className="text-center mb-6">
                  <p className="text-gold-300 text-xs font-semibold uppercase tracking-widest mb-1">
                    Start Your Journey
                  </p>
                  <h2 className="text-white text-2xl font-bold">
                    Find Your Match
                  </h2>
                </div>

                <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                  {/* Gender */}
                  <div>
                    <label className="text-xs text-gray-300 font-medium mb-1.5 block">
                      Looking for
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {["Bride", "Groom"].map((g) => (
                        <label
                          key={g}
                          className="flex items-center justify-center gap-2 p-3 bg-white/10 border border-white/20 hover:bg-white/20 hover:border-gold-400/50 rounded-xl cursor-pointer transition-all duration-200 text-white text-sm font-medium"
                        >
                          <input type="radio" name="gender" value={g} className="sr-only" />
                          {g === "Bride" ? "👰" : "🤵"} {g}
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Age Range */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-gray-300 font-medium mb-1.5 block">
                        Age From
                      </label>
                      <select className="w-full bg-white/10 border border-white/20 text-white rounded-xl px-3 py-3 text-sm focus:outline-none focus:border-gold-400 transition-colors [&>option]:text-gray-800">
                        {Array.from({ length: 23 }, (_, i) => 18 + i).map((age) => (
                          <option key={age} value={age}>{age} yrs</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs text-gray-300 font-medium mb-1.5 block">
                        Age To
                      </label>
                      <select className="w-full bg-white/10 border border-white/20 text-white rounded-xl px-3 py-3 text-sm focus:outline-none focus:border-gold-400 transition-colors [&>option]:text-gray-800">
                        {Array.from({ length: 22 }, (_, i) => 21 + i).map((age) => (
                          <option key={age} value={age}>{age} yrs</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Religion */}
                  <div>
                    <label className="text-xs text-gray-300 font-medium mb-1.5 block">
                      Religion
                    </label>
                    <select className="w-full bg-white/10 border border-white/20 text-white rounded-xl px-3 py-3 text-sm focus:outline-none focus:border-gold-400 transition-colors [&>option]:text-gray-800">
                      <option value="hindu">Hindu</option>
                      <option value="christian">Christian</option>
                      <option value="muslim">Muslim</option>
                    </select>
                  </div>

                  {/* Search Button */}
                  <button
                    id="hero-search-btn"
                    type="submit"
                    className="w-full py-4 bg-gradient-to-r from-gold-600 to-gold-500 hover:from-gold-500 hover:to-gold-400 text-white font-bold rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-gold-500/30 cursor-pointer"
                  >
                    Search Profiles →
                  </button>
                </form>

                <p className="text-center text-xs text-gray-400 mt-4">
                  Free to browse •{" "}
                  <a href="/register" className="text-gold-400 hover:underline">
                    Register for free
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="relative z-10 border-t border-white/10 bg-black/20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, idx) => (
              <div key={idx} className="text-center">
                <div className="text-2xl sm:text-3xl font-extrabold text-gold-400 mb-1">
                  {stat.value}
                </div>
                <div className="text-xs text-gray-400 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 hidden md:flex flex-col items-center gap-1.5">
        <span className="text-white/40 text-[10px] uppercase tracking-widest">Scroll</span>
        <div className="w-5 h-8 border-2 border-white/20 rounded-full flex items-start justify-center pt-1.5">
          <div className="w-1 h-2 bg-gold-400 rounded-full animate-bounce" />
        </div>
      </div>

      {/* Slide indicators */}
      <div className="absolute bottom-8 right-8 z-10 flex gap-2">
        {heroSlides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentSlide(i)}
            className={`rounded-full transition-all duration-300 cursor-pointer ${
              i === currentSlide
                ? "w-6 h-2 bg-gold-400"
                : "w-2 h-2 bg-white/30 hover:bg-white/50"
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
