"use client";

import Image from "next/image";
import { ShieldCheck, Star, MapPin, GraduationCap, Briefcase, Award, Heart } from "lucide-react";

interface ProfileCardProps {
  name: string;
  age: number;
  location: string;
  education: string;
  profession: string;
  rasi: string;
  nakshatra: string;
  image: string;
  verified?: boolean;
  premium?: boolean;
  isShortlisted?: boolean;
  onViewProfile?: () => void;
  onSendInterest?: () => void;
  onToggleShortlist?: () => void;
}

export default function ProfileCard({
  name,
  age,
  location,
  education,
  profession,
  rasi,
  nakshatra,
  image,
  verified = false,
  premium = false,
  isShortlisted = false,
  onViewProfile,
  onSendInterest,
  onToggleShortlist,
}: ProfileCardProps) {
  return (
    <div className="group relative bg-white rounded-3xl overflow-hidden border border-gold-300/20 hover:border-gold-500/60 shadow-lg hover:shadow-2xl hover:shadow-maroon-900/15 -translate-y-0 hover:-translate-y-2.5 transition-all duration-500 bg-gradient-to-b from-white to-ivory-50/50">
      
      {/* Decorative luxury corners */}
      <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-gold-400/0 group-hover:border-gold-400/40 transition-all duration-500 rounded-tl-3xl pointer-events-none" />
      <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-gold-400/0 group-hover:border-gold-400/40 transition-all duration-500 rounded-tr-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-gold-400/0 group-hover:border-gold-400/40 transition-all duration-500 rounded-bl-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-gold-400/0 group-hover:border-gold-400/40 transition-all duration-500 rounded-br-3xl pointer-events-none" />

      {/* Premium Badge */}
      {premium && (
        <div className="absolute top-4 left-4 z-10 bg-gradient-to-r from-gold-600 via-gold-500 to-gold-650 text-maroon-950 text-[10px] font-extrabold px-3 py-1 rounded-full flex items-center gap-1.5 shadow-lg border border-gold-300 animate-pulse">
          <Award className="w-3 h-3 fill-current text-maroon-950" />
          PRIME PREMIUM
        </div>
      )}

      {/* Shortlist Button */}
      {onToggleShortlist && (
        <button 
          onClick={(e) => { e.stopPropagation(); onToggleShortlist(); }}
          className="absolute top-4 right-4 z-20 p-2 bg-white/90 backdrop-blur-sm hover:bg-white rounded-full shadow-md transition-all duration-300 cursor-pointer border border-ivory-300 hover:border-maroon-300 hover:scale-110"
        >
          <Heart className={`w-5 h-5 transition-colors ${isShortlisted ? "fill-maroon-600 text-maroon-600" : "text-gray-400 hover:text-maroon-600"}`} />
        </button>
      )}

      {/* Verified Badge */}
      {verified && (
        <div className={`absolute top-4 ${onToggleShortlist ? 'right-16' : 'right-4'} z-10 bg-white/95 backdrop-blur-sm text-maroon-900 text-[10px] font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-md border border-maroon-100/50`}>
          <ShieldCheck className="w-3.5 h-3.5 text-maroon-700 fill-maroon-50" />
          Verified
        </div>
      )}

      {/* Image Gallery Mock Wrapper */}
      <div className="relative h-60 overflow-hidden bg-gradient-to-br from-ivory-100 to-ivory-300 border-b border-ivory-200">
        <Image
          src={image || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=8b1a1a&color=faf6f0&size=300&font-size=0.4`}
          alt={`${name}'s photo`}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
        />
        
        {/* Luxury Gold Shimmer overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-maroon-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* Decorative floral accent overlay */}
        <div className="absolute bottom-2 right-3 text-gold-400/80 text-xl select-none opacity-0 group-hover:opacity-100 transition-opacity duration-500 font-serif">
          ❈
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-4">
        
        {/* Header Name & Age */}
        <div className="flex justify-between items-start gap-2">
          <div>
            <h3 className="font-bold text-maroon-900 text-lg group-hover:text-gold-700 transition-colors duration-300">
              {name}
            </h3>
            <p className="text-maroon-600 text-xs font-semibold tracking-wide uppercase mt-0.5">
              {age} Yrs
            </p>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-gold-700 font-extrabold bg-gold-50 border border-gold-300/40 px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm">
              {rasi}
            </span>
          </div>
        </div>

        {/* Horizontal Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-gold-300/40 to-transparent" />

        {/* Details Grid */}
        <div className="grid grid-cols-1 gap-2.5 text-gray-600 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-maroon-50 flex items-center justify-center text-maroon-700 flex-shrink-0">
              <MapPin className="w-3.5 h-3.5" />
            </div>
            <span className="truncate font-medium">{location}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-maroon-50 flex items-center justify-center text-maroon-700 flex-shrink-0">
              <GraduationCap className="w-3.5 h-3.5" />
            </div>
            <span className="truncate font-medium">{education}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-maroon-50 flex items-center justify-center text-maroon-700 flex-shrink-0">
              <Briefcase className="w-3.5 h-3.5" />
            </div>
            <span className="truncate font-medium">{profession}</span>
          </div>
        </div>

        {/* Astrological Star */}
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] text-maroon-900 bg-ivory-200 border border-ivory-300 px-2.5 py-1 rounded-full font-bold flex items-center gap-1 shadow-sm">
            ✨ Nakshatram: {nakshatra}
          </span>
        </div>

        {/* Card Action Buttons */}
        <div className="flex gap-2.5 pt-2">
          <button
            onClick={onViewProfile}
            className="flex-1 py-3 text-xs font-bold text-maroon-800 bg-ivory-100 hover:bg-gold-50 border border-gold-300/30 hover:border-gold-400 rounded-xl transition-all duration-300 cursor-pointer shadow-sm text-center"
          >
            View Details
          </button>
          
          <button
            onClick={onSendInterest}
            className="flex-1 py-3 text-xs font-extrabold text-white bg-gradient-to-r from-maroon-900 via-maroon-800 to-maroon-950 hover:from-maroon-850 hover:to-maroon-800 rounded-xl transition-all duration-350 shadow-md shadow-maroon-900/10 hover:shadow-lg cursor-pointer flex items-center justify-center gap-1"
          >
            <Star className="w-3 h-3 fill-current text-gold-400" />
            Connect
          </button>
        </div>

      </div>
    </div>
  );
}

