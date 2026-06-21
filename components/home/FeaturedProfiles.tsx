/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Filter } from "lucide-react";
import ProfileCard from "@/components/ui/ProfileCard";
import { featuredProfiles, Profile } from "@/lib/data";
import { getProfiles } from "@/lib/api";

const filters = ["All", "Bride", "Groom", "Doctor", "Engineer", "Premium"];

export default function FeaturedProfiles() {
  const [activeFilter, setActiveFilter] = useState("All");
  const scrollRef = useRef<HTMLDivElement>(null);
  const [profiles, setProfiles] = useState<Profile[]>(featuredProfiles as any[]);

  useEffect(() => {
    getProfiles(1, 10).then(({ profiles: data }) => {
      if (data && data.length > 0) {
        const fp = data.filter((p) => p.gender === "Female").slice(0, 10);
        setProfiles(fp as any);
      }
    });
  }, []);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: direction === "left" ? -320 : 320,
        behavior: "smooth",
      });
    }
  };

  return (
    <section
      className="section-padding bg-ivory-100"
      id="featured-profiles"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-2 text-gold-600 text-xs font-bold uppercase tracking-widest mb-3 bg-gold-50 border border-gold-200 px-4 py-1.5 rounded-full">
            ✨ Handpicked for You
          </span>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-maroon-900 mb-4">
            Featured{" "}
            <span className="bg-gradient-to-r from-maroon-800 to-gold-600 bg-clip-text text-transparent">
              Profiles
            </span>
          </h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            Browse our curated selection of verified Tamil profiles — educated,
            professional, and ready to begin a new chapter.
          </p>
          <div className="gold-divider mt-6 max-w-xs mx-auto" />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          <Filter className="w-4 h-4 text-gray-400" />
          {filters.map((filter) => (
            <button
              key={filter}
              id={`filter-${filter.toLowerCase()}`}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 cursor-pointer ${
                activeFilter === filter
                  ? "bg-maroon-800 text-white shadow-md shadow-maroon-800/20"
                  : "bg-white text-gray-600 border border-gray-200 hover:border-maroon-300 hover:text-maroon-700"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Scroll controls */}
        <div className="relative">
          <button
            onClick={() => scroll("left")}
            id="profiles-scroll-left"
            className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white border border-gray-200 rounded-full shadow-lg flex items-center justify-center text-maroon-700 hover:bg-maroon-50 hover:border-maroon-300 transition-all duration-200 hidden md:flex cursor-pointer"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div
            ref={scrollRef}
            className="flex gap-5 overflow-x-auto pb-4 scroll-smooth snap-x snap-mandatory
              [scrollbar-width:none] [&::-webkit-scrollbar]:hidden
              md:grid md:grid-cols-2 md:overflow-visible lg:grid-cols-3"
          >
            {profiles.map((profile) => (
              <div key={profile.id} className="flex-shrink-0 w-72 md:w-auto snap-start">
                <ProfileCard
                  name={profile.name}
                  age={profile.age}
                  location={profile.location}
                  education={profile.degree}
                  profession={profile.occupation}
                  rasi={profile.rasi}
                  nakshatra={profile.nakshatra}
                  image={profile.images?.[0] || ""}
                  verified={profile.verified}
                  premium={profile.premium}
                  onViewProfile={() => console.log("View profile:", profile.id)}
                  onSendInterest={() => console.log("Send interest:", profile.id)}
                />
              </div>
            ))}
          </div>

          <button
            onClick={() => scroll("right")}
            id="profiles-scroll-right"
            className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white border border-gray-200 rounded-full shadow-lg flex items-center justify-center text-maroon-700 hover:bg-maroon-50 hover:border-maroon-300 transition-all duration-200 hidden md:flex cursor-pointer"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <p className="text-gray-500 text-sm mb-4">
            Showing 6 of <strong className="text-maroon-800">5,00,000+</strong> profiles
          </p>
          <a
            id="view-all-profiles-btn"
            href="/search"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-maroon-800 hover:bg-maroon-700 text-white font-semibold rounded-2xl shadow-lg hover:shadow-maroon-800/25 transition-all duration-300 hover:scale-[1.02]"
          >
            View All Profiles
            <ChevronRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
