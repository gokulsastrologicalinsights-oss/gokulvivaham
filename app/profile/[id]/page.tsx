"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProfileCard from "@/components/ui/ProfileCard";
import { mockProfiles, Profile } from "@/lib/data";
import {
  ShieldCheck,
  Star,
  MapPin,
  GraduationCap,
  Briefcase,
  Heart,
  Calendar,
  User,
  Users,
  Compass,
  MessageCircle,
  Bookmark,
  ArrowLeft,
  FileText,
  Phone,
  Sparkles,
  Award,
  Lock,
} from "lucide-react";

interface ProfileDetailsProps {
  params: Promise<{ id: string }>;
}

export default function ProfileDetailsPage({ params }: ProfileDetailsProps) {
  const router = useRouter();
  const { id } = use(params);
  const profileId = Number(id);

  // Find the profile details
  const profile = mockProfiles.find((p) => p.id === profileId);

  // States
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [interestSent, setInterestSent] = useState(false);
  const [isShortlisted, setIsShortlisted] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);

  // Handle case where profile is not found
  if (!profile) {
    return (
      <main className="flex flex-col min-h-screen bg-ivory-100">
        <Navbar />
        <div className="h-20" />
        <div className="flex-1 flex flex-col items-center justify-center py-20 px-4 text-center">
          <div className="text-6xl mb-4">🕉️</div>
          <h1 className="text-2xl font-bold text-maroon-900 font-serif">Profile Not Found</h1>
          <p className="text-gray-500 text-sm mt-1 max-w-sm">
            The profile you are looking for does not exist or has been removed from the directory.
          </p>
          <button
            onClick={() => router.push("/search")}
            className="mt-6 px-5 py-2.5 bg-maroon-900 hover:bg-maroon-800 text-white rounded-xl font-bold text-sm shadow-md transition-all cursor-pointer"
          >
            Back to Search
          </button>
        </div>
        <Footer />
      </main>
    );
  }

  // Get similar profiles (same gender, excluding current profile)
  const similarProfiles = mockProfiles
    .filter((p) => p.gender === profile.gender && p.id !== profile.id)
    .slice(0, 3);

  // Helper to place planets into the 4x4 Grid cells
  // Grid cells indexed 0 to 15 (4x4 matrix)
  // Index mapping to mock astrology clockwise array (12 houses)
  const getGridContent = (cellIdx: number): { label: string; planets: string } => {
    // Clockwise mapped rasi indices
    const cellToRasiIndex: { [key: number]: number } = {
      0: 0,   // Pisces / Meenam (R1C1)
      1: 1,   // Aries / Mesham (R1C2)
      2: 2,   // Taurus / Rishabam (R1C3)
      3: 3,   // Gemini / Mithunam (R1C4)
      7: 4,   // Cancer / Katakam (R2C4)
      11: 5,  // Leo / Simham (R3C4)
      15: 6,  // Virgo / Kanni (R4C4)
      14: 7,  // Libra / Thulam (R4C3)
      13: 8,  // Scorpio / Vrishchikam (R4C2)
      12: 9,  // Sagittarius / Dhanusu (R4C1)
      8: 10,  // Capricorn / Makaram (R3C1)
      4: 11,  // Aquarius / Kumbham (R2C1)
    };

    const rasiNames: { [key: number]: string } = {
      0: "மீனம்\n(Pisces)",
      1: "மேஷம்\n(Aries)",
      2: "ரிஷபம்\n(Taurus)",
      3: "மிதுனம்\n(Gemini)",
      4: "கடகம்\n(Cancer)",
      5: "சிம்மம்\n(Leo)",
      6: "கன்னி\n(Virgo)",
      7: "துலாம்\n(Libra)",
      8: "விருச்\n(Scorpio)",
      9: "தனுசு\n(Sag)",
      10: "மகரம்\n(Capri)",
      11: "கும்பம்\n(Aquar)"
    };

    const rasiIdx = cellToRasiIndex[cellIdx];
    if (rasiIdx !== undefined) {
      return {
        label: rasiNames[rasiIdx],
        planets: profile.rasiChart[rasiIdx] || "",
      };
    }
    return { label: "", planets: "" };
  };

  const isCenterCell = (cellIdx: number) => {
    const centerCells = [5, 6, 9, 10];
    return centerCells.includes(cellIdx);
  };

  return (
    <main className="flex flex-col min-h-screen bg-ivory-100">
      <Navbar />
      <div className="h-20" /> {/* Spacer */}

      <div className="flex-1 section-padding py-8">
        <div className="max-w-7xl mx-auto space-y-6">
          
          {/* Back button */}
          <button
            onClick={() => router.back()}
            className="flex items-center gap-1.5 text-xs font-semibold text-maroon-700 hover:text-maroon-900 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" /> Back to matches
          </button>

          {/* Main Layout: Left Gallery + Actions, Right Details */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            
            {/* COLUMN 1: IMAGE GALLERY & ACTIONS */}
            <div className="lg:col-span-1 space-y-6">
              
              {/* Photo Gallery Card with Luxury Gilded Frame */}
              <div className="bg-white rounded-3xl border border-gold-300/30 overflow-hidden shadow-xl p-5 space-y-5 relative">
                
                {/* Decorative border frame */}
                <div className="absolute inset-2 border border-gold-400/10 rounded-2xl pointer-events-none" />

                <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-50 border-2 border-gold-300 p-0.5 shadow-md">
                  <img
                    src={profile.images[activeImageIdx]}
                    alt={`${profile.name} photo`}
                    className="w-full h-full object-cover rounded-2xl transition-all duration-500"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.name)}&background=8b1a1a&color=faf6f0&size=400`;
                    }}
                  />
                  {profile.premium && (
                    <div className="absolute top-4 left-4 bg-gradient-to-r from-gold-600 via-gold-500 to-gold-650 text-maroon-950 text-[10px] font-extrabold px-3 py-1 rounded-full flex items-center gap-1 shadow-lg border border-gold-300">
                      <Star className="w-3 h-3 fill-current" />
                      PRIME MEMBER
                    </div>
                  )}
                  {profile.verified && (
                    <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm text-maroon-900 text-[10px] font-extrabold px-3 py-1 rounded-full flex items-center gap-1 shadow border border-maroon-100">
                      <ShieldCheck className="w-3.5 h-3.5 text-maroon-600 fill-maroon-50" />
                      Verified Profile
                    </div>
                  )}
                </div>

                {/* Thumbnails */}
                {profile.images.length > 1 && (
                  <div className="flex gap-2.5 justify-center relative z-10">
                    {profile.images.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveImageIdx(idx)}
                        className={`w-14 h-14 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                          activeImageIdx === idx ? "border-gold-500 scale-105 shadow-md" : "border-transparent opacity-65 hover:opacity-100"
                        }`}
                      >
                        <img src={img} alt="thumbnail" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Buttons Box */}
              <div className="bg-white rounded-3xl border border-gold-300/20 p-5 shadow-lg space-y-3 relative">
                
                <div className="absolute inset-1.5 border border-gold-400/5 rounded-2xl pointer-events-none" />

                <button
                  onClick={() => setInterestSent(true)}
                  className={`w-full py-4 rounded-xl font-extrabold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md ${
                    interestSent
                      ? "bg-green-600 text-white border border-green-700 shadow-green-600/10"
                      : "bg-gradient-to-r from-maroon-950 via-maroon-800 to-maroon-950 hover:from-maroon-900 hover:to-maroon-750 text-gold-300 border border-gold-400/35"
                  }`}
                >
                  <Heart className={`w-5 h-5 ${interestSent ? "fill-current" : ""}`} />
                  {interestSent ? "Interest Sent Successfully" : "Send Marriage Interest"}
                </button>

                <div className="grid grid-cols-2 gap-3.5 relative z-10">
                  <button
                    onClick={() => setIsShortlisted(!isShortlisted)}
                    className={`py-3.5 px-2 border rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      isShortlisted
                        ? "bg-gold-50 border-gold-400 text-gold-800"
                        : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <Bookmark className={`w-4 h-4 ${isShortlisted ? "fill-current" : ""}`} />
                    {isShortlisted ? "Shortlisted" : "Shortlist"}
                  </button>
                  
                  <button
                    onClick={() => setShowContactModal(true)}
                    className="py-3.5 px-2 border border-maroon-250 bg-maroon-50 hover:bg-maroon-100 text-maroon-900 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-sm"
                  >
                    <Phone className="w-4 h-4 text-maroon-700" />
                    View Contact
                  </button>
                </div>
              </div>

              {/* Safety banner */}
              <div className="bg-gradient-to-br from-ivory-200 via-ivory-200 to-gold-100/30 rounded-3xl border border-gold-350/30 p-5 space-y-2 relative shadow-inner">
                <h4 className="font-extrabold text-maroon-950 text-xs flex items-center gap-1.5">
                  👑 Safe Marriage Search
                </h4>
                <p className="text-[10px] text-gray-600 leading-relaxed font-medium">
                  We check identity document claims before verification tags are issued. Please verify credentials independently before agreeing to wedding ceremonies or transactions. Do not send cash to other members.
                </p>
              </div>

            </div>

            {/* COLUMN 2: DETAILED MATRIMONIAL PROFILES */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* Profile Main Header Card */}
              <div className="bg-white rounded-3xl border border-gold-300/20 p-6 md:p-8 shadow-lg relative">
                
                {/* Decorative border frame */}
                <div className="absolute inset-1.5 border border-gold-400/5 rounded-2xl pointer-events-none" />

                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 relative z-10">
                  <div>
                    <div className="flex items-center gap-3 flex-wrap">
                      <h1 className="text-3xl md:text-4xl font-bold text-maroon-900 font-serif">{profile.name}</h1>
                      <span className="text-[10px] bg-gold-50 border border-gold-400/40 text-gold-800 font-extrabold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                        {profile.maritalStatus}
                      </span>
                    </div>
                    
                    <p className="text-xs text-gray-500 mt-2 flex items-center gap-1.5 font-medium">
                      <MapPin className="w-4 h-4 text-gold-600 flex-shrink-0" />
                      {profile.location}
                    </p>
                    
                    <div className="flex gap-4 flex-wrap mt-4 text-xs text-gray-600 font-semibold bg-ivory-100/60 p-3 rounded-xl border border-ivory-200">
                      <span className="flex items-center gap-1">🎂 Age: {profile.age} Years</span>
                      <span className="flex items-center gap-1">📏 Height: {profile.height}</span>
                      <span className="flex items-center gap-1">🗣️ Language: {profile.motherTongue}</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-start sm:items-end gap-2">
                    <span className="text-xs text-maroon-950 font-black bg-gradient-to-r from-gold-600 via-gold-450 to-gold-500 px-4 py-1.5 rounded-xl border border-gold-300 shadow flex items-center gap-1">
                      <Compass className="w-3.5 h-3.5 fill-current" />
                      Rasi: {profile.rasi}
                    </span>
                    <span className="text-[10px] text-gray-500 font-bold bg-gray-50 px-2 py-0.5 rounded border border-gray-150">
                      Nakshatra: {profile.nakshatra}
                    </span>
                  </div>
                </div>
              </div>

              {/* About Me Section */}
              <div className="bg-white rounded-3xl border border-gold-300/10 p-6 md:p-8 shadow-lg space-y-4 relative">
                <div className="absolute inset-1.5 border border-gold-400/5 rounded-2xl pointer-events-none" />
                <h3 className="text-xl font-bold text-maroon-900 border-b border-ivory-200 pb-3 flex items-center gap-2 font-serif">
                  <User className="w-5 h-5 text-gold-500" />
                  Self-Introduction
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line font-medium relative z-10">
                  {profile.aboutMe}
                </p>
              </div>

              {/* Education & Profession Details */}
              <div className="bg-white rounded-3xl border border-gold-300/10 p-6 md:p-8 shadow-lg space-y-5 relative">
                <div className="absolute inset-1.5 border border-gold-400/5 rounded-2xl pointer-events-none" />
                <h3 className="text-xl font-bold text-maroon-900 border-b border-ivory-200 pb-3 flex items-center gap-2 font-serif">
                  <GraduationCap className="w-5 h-5 text-gold-500" />
                  Education & Professional Standing
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
                  {[
                    { label: "Education Level", value: profile.education, icon: GraduationCap },
                    { label: "Degree & Field", value: profile.degree, icon: GraduationCap },
                    { label: "College / University", value: profile.institution || "Not specified", icon: GraduationCap },
                    { label: "Employment Sector", value: profile.profession, icon: Briefcase },
                    { label: "Designation / Role", value: profile.occupation, icon: Briefcase },
                    { label: "Annual Income Range", value: profile.annualIncome, icon: Sparkles },
                  ].map((item, idx) => {
                    const Icon = item.icon;
                    return (
                      <div key={idx} className="flex gap-3.5 items-start p-4 bg-gradient-to-br from-ivory-50 to-ivory-100/50 rounded-2xl border border-gold-300/10 hover:border-gold-300/30 transition-all duration-300">
                        <div className="w-9 h-9 rounded-xl bg-gold-50 border border-gold-300/40 flex items-center justify-center text-maroon-800 flex-shrink-0 shadow-sm">
                          <Icon className="w-4.5 h-4.5" />
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{item.label}</p>
                          <p className="text-xs font-bold text-maroon-950 mt-1">{item.value}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Horoscope details & Traditional South Indian Rasi Chart */}
              <div className="bg-white rounded-3xl border border-gold-300/20 p-6 md:p-8 shadow-lg space-y-6 relative">
                <div className="absolute inset-1.5 border border-gold-400/5 rounded-2xl pointer-events-none" />
                <h3 className="text-xl font-bold text-maroon-900 border-b border-ivory-200 pb-3 flex items-center gap-2 font-serif">
                  <Compass className="w-5 h-5 text-gold-500" />
                  Astrological Horoscope (ஜாதகம்) compatibility
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-5 gap-8 items-center relative z-10">
                  
                  {/* Astro details table */}
                  <div className="md:col-span-2 space-y-3.5">
                    {[
                      { label: "Rasi (Moon Sign)", value: profile.rasi },
                      { label: "Nakshatram (Star)", value: profile.nakshatra },
                      { label: "Lagnam (Ascendant)", value: profile.lagnam },
                      { label: "Gothram (Clan)", value: profile.gothram },
                      { label: "Patham (Quarter)", value: profile.patham },
                      { label: "Astrological Doshams", value: profile.doshams.join(", ") },
                    ].map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center text-xs py-1.5 border-b border-dashed border-gray-150">
                        <span className="text-gray-500 font-bold">{item.label}</span>
                        <span className="font-extrabold text-maroon-950 bg-ivory-100/50 px-2 py-0.5 rounded border border-ivory-200">{item.value}</span>
                      </div>
                    ))}
                  </div>

                  {/* Luxury 4x4 Rasi Grid Chart */}
                  <div className="md:col-span-3 flex flex-col items-center">
                    <span className="text-[10px] font-black text-maroon-700 bg-gold-50 border border-gold-300/40 px-3 py-1 rounded-full uppercase tracking-widest mb-3 shadow-sm flex items-center gap-1">
                      ✨ ராசி கட்டம்
                    </span>
                    
                    <div className="w-full max-w-[300px] aspect-square bg-gradient-to-b from-[#fffbf0] to-[#fff3d4] border-2 border-gold-500 grid grid-cols-4 grid-rows-4 rounded-2xl overflow-hidden shadow-xl p-1">
                      {[...Array(16)].map((_, cellIdx) => {
                        const isCenter = isCenterCell(cellIdx);
                        
                        if (isCenter) {
                          if (cellIdx === 5) {
                            return (
                              <div
                                key={cellIdx}
                                className="col-span-2 row-span-2 border border-gold-500 bg-gradient-to-br from-maroon-950 to-maroon-900 flex flex-col items-center justify-center p-2 text-center rounded-xl shadow-inner border-double border-4 border-gold-400"
                              >
                                <span className="text-[10px] font-bold text-gold-300 leading-none">ராசி கட்டம்</span>
                                <span className="text-[8px] font-black text-white uppercase tracking-widest mt-1 bg-white/10 px-2 py-0.5 rounded">
                                  {profile.rasi}
                                </span>
                              </div>
                            );
                          }
                          return null;
                        }

                        const cellData = getGridContent(cellIdx);

                        return (
                          <div
                            key={cellIdx}
                            className="border border-gold-450/40 p-1 flex flex-col justify-between items-center relative min-h-[55px] max-h-[72px] bg-white/20 select-none hover:bg-white/50 transition-colors"
                          >
                            <span className="text-[7.5px] text-maroon-900 font-extrabold text-center leading-normal whitespace-pre-line absolute top-1 left-0.5 right-0.5">
                              {cellData.label}
                            </span>
                            <span className="text-[9px] font-black text-maroon-950 bg-gold-400/40 px-1.5 py-0.2 rounded-md mt-6 text-center leading-none tracking-tighter">
                              {cellData.planets}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                </div>
              </div>

              {/* Family Background */}
              <div className="bg-white rounded-3xl border border-gold-300/10 p-6 md:p-8 shadow-lg space-y-4 relative">
                <div className="absolute inset-1.5 border border-gold-400/5 rounded-2xl pointer-events-none" />
                <h3 className="text-xl font-bold text-maroon-900 border-b border-ivory-200 pb-3 flex items-center gap-2 font-serif">
                  <Users className="w-5 h-5 text-gold-500" />
                  Family Legacy & Social Info
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
                  {[
                    { label: "Father's Name", value: profile.familyDetails.fatherName },
                    { label: "Father's Career status", value: profile.familyDetails.fatherOccupation },
                    { label: "Mother's Name", value: profile.familyDetails.motherName },
                    { label: "Mother's Career status", value: profile.familyDetails.motherOccupation },
                    { label: "Siblings details", value: profile.familyDetails.siblings },
                    { label: "Family Social Status", value: profile.familyDetails.familyStatus },
                    { label: "Family Core Values", value: profile.familyDetails.familyValues },
                  ].map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center text-xs py-2 border-b border-dashed border-gray-150">
                      <span className="text-gray-500 font-bold">{item.label}</span>
                      <span className="font-extrabold text-maroon-950 text-right">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Partner Expectations */}
              <div className="bg-white rounded-3xl border border-gold-300/10 p-6 md:p-8 shadow-lg space-y-4 relative">
                <div className="absolute inset-1.5 border border-gold-400/5 rounded-2xl pointer-events-none" />
                <h3 className="text-xl font-bold text-maroon-900 border-b border-ivory-200 pb-3 flex items-center gap-2 font-serif">
                  <FileText className="w-5 h-5 text-gold-500" />
                  Partner Expectations
                </h3>
                <div className="space-y-3 relative z-10">
                  {[
                    { label: "Ideal Age Group", value: profile.expectations.ageRange },
                    { label: "Height Preferred", value: profile.expectations.heightRange },
                    { label: "Minimum Education", value: profile.expectations.education },
                    { label: "Occupational sectors", value: profile.expectations.profession },
                    { label: "Location preference", value: profile.expectations.location },
                    { label: "Astrological Compatibility", value: profile.expectations.rasi },
                  ].map((item, idx) => (
                    <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between py-3 border-b border-gray-100 gap-1 text-xs">
                      <span className="text-gray-500 font-bold uppercase tracking-wider">{item.label}</span>
                      <span className="font-extrabold text-maroon-950 bg-gradient-to-r from-gold-50 to-gold-100/50 px-4 py-1.5 rounded-xl border border-gold-300/30">
                        {item.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>

          {/* SIMILAR PROFILES SECTION */}
          <div className="space-y-6 pt-6">
            <div className="flex items-center gap-2.5">
              <div className="w-1.5 h-6 bg-gold-500 rounded-full" />
              <h2 className="text-2xl font-bold text-maroon-900 font-serif">
                Similar Handpicked Matches
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {similarProfiles.map((p) => (
                <ProfileCard
                  key={p.id}
                  name={p.name}
                  age={p.age}
                  location={p.location}
                  education={p.degree}
                  profession={p.occupation}
                  rasi={p.rasi}
                  nakshatra={p.nakshatra}
                  image={p.images[0]}
                  verified={p.verified}
                  premium={p.premium}
                  onViewProfile={() => {
                    router.push(`/profile/${p.id}`);
                    window.scrollTo(0, 0);
                  }}
                  onSendInterest={() => {}}
                />
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Luxury Contact Modal Popup */}
      {showContactModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setShowContactModal(false)} />
          
          <div className="relative bg-gradient-to-br from-white to-ivory-50 rounded-3xl border-2 border-gold-450 max-w-sm w-full p-6 text-center space-y-4 shadow-2xl z-10 animate-scale-up">
            
            {/* Corner decorations */}
            <div className="absolute top-2 left-2 text-gold-400/20 text-md">❈</div>
            <div className="absolute top-2 right-2 text-gold-400/20 text-md">❈</div>
            <div className="absolute bottom-2 left-2 text-gold-400/20 text-md">❈</div>
            <div className="absolute bottom-2 right-2 text-gold-400/20 text-md">❈</div>

            <div className="w-14 h-14 bg-gradient-to-r from-gold-600 via-gold-500 to-gold-600 border border-gold-400 rounded-full flex items-center justify-center mx-auto text-xl shadow-lg animate-bounce-slow">
              👑
            </div>
            
            <h3 className="text-xl font-bold text-maroon-900 font-serif">Gokul Elite Matrimony</h3>
            <p className="text-xs text-gray-550 leading-relaxed font-semibold">
              Unlock direct telephone phone logs, physical address registries, and relationship manager matching features.
            </p>
            <div className="gold-divider" />
            <div className="space-y-2 relative z-10">
              <div className="flex justify-between items-center text-xs bg-ivory-200/50 p-3 rounded-xl border border-gold-300/10 text-gray-400 select-none">
                <span className="font-semibold">Direct Contact</span>
                <span className="flex items-center gap-1 font-bold"><Lock className="w-3.5 h-3.5 text-gold-600" /> GV-HIDDEN</span>
              </div>
              <div className="flex justify-between items-center text-xs bg-ivory-200/50 p-3 rounded-xl border border-gold-300/10 text-gray-400 select-none">
                <span className="font-semibold">Family Registrar</span>
                <span className="flex items-center gap-1 font-bold"><Lock className="w-3.5 h-3.5 text-gold-600" /> GV-HIDDEN</span>
              </div>
            </div>
            
            <div className="flex gap-3 pt-2 relative z-10">
              <button
                onClick={() => setShowContactModal(false)}
                className="flex-1 py-3 text-xs font-bold text-gray-500 hover:bg-gray-50 border border-gray-200 rounded-xl cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={() => { setShowContactModal(false); router.push("/membership"); }}
                className="flex-1 py-3 text-xs font-extrabold text-white bg-gradient-to-r from-maroon-950 to-maroon-800 hover:from-maroon-900 hover:to-maroon-750 border border-gold-400/30 rounded-xl shadow-md cursor-pointer"
              >
                Unlock Premium
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </main>
  );
}
