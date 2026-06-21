/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { Star, Quote, ChevronLeft, ChevronRight, Heart } from "lucide-react";
import { successStories as initialStories } from "@/lib/data";
import { getSuccessStories } from "@/lib/api";

export default function SuccessStories() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [successStories, setSuccessStories] = useState(initialStories);

  useEffect(() => {
    getSuccessStories().then(data => {
      if (data && data.length > 0) setSuccessStories(data as any);
    });
  }, []);

  const goTo = (idx: number) => {
    setActiveIndex(
      (idx + successStories.length) % successStories.length
    );
  };

  const active = successStories[activeIndex];

  return (
    <section
      className="section-padding bg-ivory-100 relative overflow-hidden"
      id="success-stories"
    >
      {/* Decorative background */}
      <div className="absolute inset-0 bg-gradient-to-br from-ivory-100 via-white to-gold-50/30" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gold-100/30 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-2 text-maroon-700 text-xs font-bold uppercase tracking-widest mb-3 bg-maroon-50 border border-maroon-200 px-4 py-1.5 rounded-full">
            <Heart className="w-3.5 h-3.5 fill-current" />
            Real Love Stories
          </span>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-maroon-900 mb-4">
            Success{" "}
            <span className="bg-gradient-to-r from-maroon-800 to-gold-600 bg-clip-text text-transparent">
              Stories
            </span>
          </h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            Over 50,000 couples have found their forever partner on Gokul
            Vivaham. Here are a few of their beautiful stories.
          </p>
          <div className="gold-divider mt-6 max-w-xs mx-auto" />
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Main story card */}
          <div className="bg-white rounded-3xl shadow-2xl shadow-maroon-100/50 border border-ivory-300 overflow-hidden">
            <div className="grid md:grid-cols-5">
              {/* Left — couple images */}
              <div className="md:col-span-2 bg-gradient-to-br from-maroon-900 to-maroon-800 p-8 flex flex-col items-center justify-center relative">
                {/* Decorative patterns */}
                <div className="absolute inset-0 hero-pattern opacity-30" />

                <div className="relative z-10 flex items-end gap-3 mb-6">
                  <div className="text-center">
                    <div className="w-24 h-24 rounded-full border-4 border-gold-400 overflow-hidden bg-ivory-200 shadow-xl">
                      <img
                        src={active.brideImage}
                        alt={`${active.bride}'s photo`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${active.bride}&background=8b1a1a&color=faf6f0&size=100`;
                        }}
                      />
                    </div>
                    <p className="text-white text-xs font-medium mt-2">{active.bride}</p>
                  </div>

                  {/* Heart */}
                  <div className="flex flex-col items-center pb-6">
                    <div className="w-10 h-10 rounded-full bg-gold-500/20 border border-gold-400/40 flex items-center justify-center">
                      <Heart className="w-5 h-5 text-gold-400 fill-current" />
                    </div>
                    <div className="w-0.5 h-4 bg-gold-400/30 mt-1" />
                  </div>

                  <div className="text-center">
                    <div className="w-24 h-24 rounded-full border-4 border-gold-400 overflow-hidden bg-ivory-200 shadow-xl">
                      <img
                        src={active.groomImage}
                        alt={`${active.groom}'s photo`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${active.groom}&background=1a4a8b&color=ffffff&size=100`;
                        }}
                      />
                    </div>
                    <p className="text-white text-xs font-medium mt-2">{active.groom}</p>
                  </div>
                </div>

                {/* Wedding details */}
                <div className="relative z-10 text-center bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl px-5 py-4 w-full">
                  <p className="text-gold-300 text-xs font-semibold uppercase tracking-wider mb-1">
                    💒 Married
                  </p>
                  <p className="text-white font-bold">{active.date}</p>
                  <p className="text-gray-300 text-sm mt-1">
                    📍 {active.location}
                  </p>
                </div>
              </div>

              {/* Right — story content */}
              <div className="md:col-span-3 p-8 lg:p-10 flex flex-col justify-center">
                {/* Stars */}
                <div className="flex gap-1 mb-5">
                  {[...Array(active.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-gold-500 fill-current" />
                  ))}
                </div>

                {/* Quote */}
                <div className="relative">
                  <Quote className="w-10 h-10 text-gold-200 absolute -top-2 -left-2" />
                  <p className="text-gray-700 text-base leading-relaxed pl-6 italic">
                    {active.story}
                  </p>
                </div>

                {/* Couple name */}
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <p className="font-bold text-maroon-900 text-lg">
                    {active.bride} & {active.groom}
                  </p>
                  <p className="text-gray-400 text-sm">
                    {active.location} • {active.date}
                  </p>
                </div>

                {/* Navigation */}
                <div className="flex items-center gap-3 mt-6">
                  <button
                    onClick={() => goTo(activeIndex - 1)}
                    id="story-prev-btn"
                    className="w-10 h-10 rounded-full border-2 border-gray-200 flex items-center justify-center text-gray-500 hover:border-maroon-300 hover:text-maroon-700 hover:bg-maroon-50 transition-all duration-200 cursor-pointer"
                    aria-label="Previous story"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>

                  {/* Dots */}
                  <div className="flex gap-2 flex-1">
                    {successStories.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => goTo(i)}
                        className={`rounded-full transition-all duration-300 cursor-pointer ${
                          i === activeIndex
                            ? "w-8 h-2.5 bg-maroon-700"
                            : "w-2.5 h-2.5 bg-gray-200 hover:bg-gray-300"
                        }`}
                        aria-label={`Story ${i + 1}`}
                      />
                    ))}
                  </div>

                  <button
                    onClick={() => goTo(activeIndex + 1)}
                    id="story-next-btn"
                    className="w-10 h-10 rounded-full border-2 border-gray-200 flex items-center justify-center text-gray-500 hover:border-maroon-300 hover:text-maroon-700 hover:bg-maroon-50 transition-all duration-200 cursor-pointer"
                    aria-label="Next story"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom stats */}
          <div className="grid grid-cols-3 gap-6 mt-10">
            {[
              { value: "50,000+", label: "Marriages", icon: "💍" },
              { value: "4.9/5", label: "Avg Rating", icon: "⭐" },
              { value: "98%", label: "Success Rate", icon: "❤️" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="text-center bg-white rounded-2xl border border-ivory-300 p-5 shadow-sm"
              >
                <div className="text-2xl mb-1">{stat.icon}</div>
                <div className="text-2xl font-extrabold text-maroon-800">
                  {stat.value}
                </div>
                <div className="text-xs text-gray-500 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
