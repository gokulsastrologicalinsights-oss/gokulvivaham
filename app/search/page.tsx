"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProfileCard from "@/components/ui/ProfileCard";
import { mockProfiles, Profile } from "@/lib/data";
import {
  Search,
  Filter,
  X,
  ChevronDown,
  RotateCcw,
  Sparkles,
  UserCheck,
} from "lucide-react";

const RASIS = [
  "Mesham", "Rishabam", "Mithunam", "Karkadagam",
  "Simham", "Kanni", "Thulam", "Vrishchikam",
  "Dhanusu", "Makaram", "Kumbham", "Meenam"
];

const LOCATIONS = [
  "Chennai, Tamil Nadu",
  "Coimbatore, Tamil Nadu",
  "Madurai, Tamil Nadu",
  "Trichy, Tamil Nadu",
  "Tirunelveli, Tamil Nadu",
  "Salem, Tamil Nadu",
  "Bangalore, Karnataka",
  "Singapore"
];

const CASTES = [
  "Iyer", "Gounder", "Pillai", "Mudaliar", "Naicker", "Vanniyar"
];

function SearchProfilesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Filter States
  const [gender, setGender] = useState<string>("Female"); // Default search for Brides (Female)
  const [ageMin, setAgeMin] = useState<number>(21);
  const [ageMax, setAgeMax] = useState<number>(35);
  const [selectedRasis, setSelectedRasis] = useState<string[]>([]);
  const [location, setLocation] = useState<string>("");
  const [caste, setCaste] = useState<string>("");
  const [verifiedOnly, setVerifiedOnly] = useState<boolean>(false);
  const [premiumOnly, setPremiumOnly] = useState<boolean>(false);
  
  // Mobile filter drawer state
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Search input state
  const [searchQuery, setSearchQuery] = useState("");

  // Sent interest tracking
  const [sentInterestIds, setSentInterestIds] = useState<number[]>([]);

  // Initialize filters from URL parameters if present
  useEffect(() => {
    const rasiParam = searchParams.get("rasi");
    if (rasiParam && RASIS.includes(rasiParam)) {
      setSelectedRasis([rasiParam]);
    }
    const genderParam = searchParams.get("gender");
    if (genderParam === "Male" || genderParam === "Female") {
      setGender(genderParam);
    }
  }, [searchParams]);

  // Filter logic
  const filteredProfiles = mockProfiles.filter((profile) => {
    // 1. Gender Filter
    if (gender && profile.gender !== gender) return false;

    // 2. Age Filter
    if (profile.age < ageMin || profile.age > ageMax) return false;

    // 3. Rasi Filter
    if (selectedRasis.length > 0 && !selectedRasis.includes(profile.rasi)) return false;

    // 4. Location Filter
    if (location && profile.location !== location) return false;

    // 5. Caste Filter
    if (caste && profile.caste !== caste) return false;

    // 6. Verified Filter
    if (verifiedOnly && !profile.verified) return false;

    // 7. Premium Filter
    if (premiumOnly && !profile.premium) return false;

    // 8. Search query (matches name, education, or occupation)
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchName = profile.name.toLowerCase().includes(query);
      const matchEd = profile.degree.toLowerCase().includes(query);
      const matchOcc = profile.occupation.toLowerCase().includes(query);
      if (!matchName && !matchEd && !matchOcc) return false;
    }

    return true;
  });

  const handleRasiToggle = (rasi: string) => {
    setSelectedRasis((prev) =>
      prev.includes(rasi) ? prev.filter((r) => r !== rasi) : [...prev, rasi]
    );
  };

  const handleSendInterest = (id: number) => {
    if (sentInterestIds.includes(id)) return;
    setSentInterestIds((prev) => [...prev, id]);
  };

  const resetFilters = () => {
    setAgeMin(21);
    setAgeMax(35);
    setSelectedRasis([]);
    setLocation("");
    setCaste("");
    setVerifiedOnly(false);
    setPremiumOnly(false);
    setSearchQuery("");
  };

  const activeFilterCount =
    (selectedRasis.length > 0 ? 1 : 0) +
    (location ? 1 : 0) +
    (caste ? 1 : 0) +
    (verifiedOnly ? 1 : 0) +
    (premiumOnly ? 1 : 0) +
    (ageMin > 21 || ageMax < 35 ? 1 : 0);

  return (
    <main className="flex flex-col min-h-screen bg-ivory-100">
      <Navbar />
      <div className="h-20" /> {/* Spacer */}

      <div className="flex-1 section-padding py-8">
        <div className="max-w-7xl mx-auto space-y-6">
          
          {/* Page Title & Search Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white rounded-3xl border border-ivory-300 p-6 shadow-sm">
            <div>
              <h1 className="text-2xl font-bold text-maroon-900 flex items-center gap-2">
                <Search className="w-6 h-6 text-gold-500" />
                Find Your Life Partner
              </h1>
              <p className="text-gray-500 text-xs mt-1">
                Browse through verified profiles matches by casting, astrology, and location.
              </p>
            </div>
            
            {/* Search Input Widget */}
            <div className="relative w-full md:max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, education, or job..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:border-maroon-400 focus:ring-1 focus:ring-maroon-400 text-sm"
              />
            </div>
          </div>

          {/* Mobile Filter Toggle Bar */}
          <div className="flex lg:hidden justify-between items-center bg-white px-5 py-3 rounded-2xl border border-ivory-300 shadow-sm">
            <span className="text-xs text-gray-600 font-semibold">
              Showing {filteredProfiles.length} profiles
            </span>
            <button
              onClick={() => setIsMobileFilterOpen(true)}
              className="flex items-center gap-1.5 px-3 py-2 bg-maroon-50 border border-maroon-100 rounded-xl text-maroon-800 text-xs font-bold cursor-pointer"
            >
              <Filter className="w-3.5 h-3.5" />
              Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
            </button>
          </div>

          {/* Main Grid: Filters Sidebar (Desktop) + Results */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
            
            {/* 1. Desktop Filters Sidebar */}
            <aside className="hidden lg:block bg-white rounded-3xl border border-ivory-300 p-6 shadow-sm space-y-6 sticky top-24">
              <div className="flex items-center justify-between border-b border-ivory-200 pb-3">
                <h2 className="font-bold text-maroon-900 text-sm flex items-center gap-2">
                  <Filter className="w-4 h-4 text-gold-500" /> Filters
                </h2>
                {activeFilterCount > 0 && (
                  <button
                    onClick={resetFilters}
                    className="text-[10px] text-maroon-700 hover:text-maroon-950 font-bold flex items-center gap-0.5 hover:underline cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3" /> Reset
                  </button>
                )}
              </div>

              {/* Gender Toggle */}
              <div className="space-y-2">
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider">I am looking for</label>
                <div className="flex bg-gray-100 rounded-xl p-1 gap-1">
                  <button
                    onClick={() => setGender("Female")}
                    className={`flex-1 py-1.5 text-xs font-bold rounded-lg text-center transition-all cursor-pointer ${
                      gender === "Female" ? "bg-white text-maroon-800 shadow-sm" : "text-gray-500 hover:text-gray-800"
                    }`}
                  >
                    Brides
                  </button>
                  <button
                    onClick={() => setGender("Male")}
                    className={`flex-1 py-1.5 text-xs font-bold rounded-lg text-center transition-all cursor-pointer ${
                      gender === "Male" ? "bg-white text-maroon-800 shadow-sm" : "text-gray-500 hover:text-gray-800"
                    }`}
                  >
                    Grooms
                  </button>
                </div>
              </div>

              {/* Age Range Filter */}
              <div className="space-y-3">
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider">Age Preference</label>
                <div className="flex items-center gap-2">
                  <select
                    value={ageMin}
                    onChange={(e) => setAgeMin(Number(e.target.value))}
                    className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg text-xs"
                  >
                    {[...Array(20)].map((_, i) => (
                      <option key={i} value={20 + i}>{20 + i} Years</option>
                    ))}
                  </select>
                  <span className="text-gray-400 text-xs">to</span>
                  <select
                    value={ageMax}
                    onChange={(e) => setAgeMax(Number(e.target.value))}
                    className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg text-xs"
                  >
                    {[...Array(20)].map((_, i) => (
                      <option key={i} value={25 + i}>{25 + i} Years</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Location Select */}
              <div className="space-y-2">
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider">Location</label>
                <select
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs"
                >
                  <option value="">Any Location</option>
                  {LOCATIONS.map((loc) => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>
              </div>

              {/* Caste Select */}
              <div className="space-y-2">
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider">Caste / Sect</label>
                <select
                  value={caste}
                  onChange={(e) => setCaste(e.target.value)}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs"
                >
                  <option value="">Any Caste</option>
                  {CASTES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              {/* Rasi Checkboxes */}
              <div className="space-y-2.5">
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider">Rasi (Moon Sign)</label>
                <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto pr-1">
                  {RASIS.map((rasi) => (
                    <label key={rasi} className="flex items-center gap-1.5 text-xs text-gray-600 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedRasis.includes(rasi)}
                        onChange={() => handleRasiToggle(rasi)}
                        className="rounded text-maroon-800 border-gray-300 focus:ring-maroon-400 cursor-pointer"
                      />
                      {rasi}
                    </label>
                  ))}
                </div>
              </div>

              <div className="gold-divider" />

              {/* Extra Filters */}
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-xs font-semibold text-gray-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={verifiedOnly}
                    onChange={(e) => setVerifiedOnly(e.target.checked)}
                    className="rounded text-maroon-800 border-gray-300 focus:ring-maroon-400 cursor-pointer"
                  />
                  <UserCheck className="w-3.5 h-3.5 text-maroon-600" />
                  Verified Profiles Only
                </label>
                
                <label className="flex items-center gap-2 text-xs font-semibold text-gray-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={premiumOnly}
                    onChange={(e) => setPremiumOnly(e.target.checked)}
                    className="rounded text-maroon-800 border-gray-300 focus:ring-maroon-400 cursor-pointer"
                  />
                  <Sparkles className="w-3.5 h-3.5 text-gold-600 fill-current" />
                  Premium Members Only
                </label>
              </div>
            </aside>

            {/* 2. Results Content Column */}
            <section className="lg:col-span-3 space-y-6">
              
              {/* Active Filters / Search Count Header */}
              <div className="flex flex-wrap items-center justify-between gap-3 bg-white px-5 py-4 rounded-2xl border border-ivory-300 shadow-sm">
                <div className="text-xs text-gray-500 font-medium">
                  We found <span className="font-bold text-maroon-900">{filteredProfiles.length}</span> matching profiles
                </div>
                
                {/* Badges for active filters */}
                {activeFilterCount > 0 && (
                  <div className="flex flex-wrap gap-1.5 items-center">
                    {location && (
                      <span className="inline-flex items-center gap-1 bg-maroon-50 text-maroon-800 text-[10px] px-2 py-0.5 rounded-full border border-maroon-100 font-bold">
                        {location.split(",")[0]}
                        <X className="w-2.5 h-2.5 cursor-pointer hover:text-maroon-950" onClick={() => setLocation("")} />
                      </span>
                    )}
                    {caste && (
                      <span className="inline-flex items-center gap-1 bg-maroon-50 text-maroon-800 text-[10px] px-2 py-0.5 rounded-full border border-maroon-100 font-bold">
                        {caste}
                        <X className="w-2.5 h-2.5 cursor-pointer hover:text-maroon-950" onClick={() => setCaste("")} />
                      </span>
                    )}
                    {selectedRasis.map((r) => (
                      <span key={r} className="inline-flex items-center gap-1 bg-maroon-50 text-maroon-800 text-[10px] px-2 py-0.5 rounded-full border border-maroon-100 font-bold">
                        {r}
                        <X className="w-2.5 h-2.5 cursor-pointer hover:text-maroon-950" onClick={() => handleRasiToggle(r)} />
                      </span>
                    ))}
                    {(ageMin > 21 || ageMax < 35) && (
                      <span className="inline-flex items-center gap-1 bg-maroon-50 text-maroon-800 text-[10px] px-2 py-0.5 rounded-full border border-maroon-100 font-bold">
                        Age: {ageMin}-{ageMax}
                        <X className="w-2.5 h-2.5 cursor-pointer hover:text-maroon-950" onClick={() => { setAgeMin(21); setAgeMax(35); }} />
                      </span>
                    )}
                    {verifiedOnly && (
                      <span className="inline-flex items-center gap-1 bg-maroon-50 text-maroon-800 text-[10px] px-2 py-0.5 rounded-full border border-maroon-100 font-bold">
                        Verified
                        <X className="w-2.5 h-2.5 cursor-pointer hover:text-maroon-950" onClick={() => setVerifiedOnly(false)} />
                      </span>
                    )}
                    {premiumOnly && (
                      <span className="inline-flex items-center gap-1 bg-maroon-50 text-maroon-800 text-[10px] px-2 py-0.5 rounded-full border border-maroon-100 font-bold">
                        Premium
                        <X className="w-2.5 h-2.5 cursor-pointer hover:text-maroon-950" onClick={() => setPremiumOnly(false)} />
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Profiles Grid */}
              {filteredProfiles.length === 0 ? (
                /* Empty state */
                <div className="bg-white rounded-3xl border border-ivory-300 p-12 text-center max-w-xl mx-auto space-y-4">
                  <div className="text-5xl">🔍</div>
                  <h3 className="text-lg font-bold text-maroon-900">No matching profiles found</h3>
                  <p className="text-gray-500 text-xs leading-relaxed max-w-sm mx-auto">
                    We couldn't find any profiles matching your exact filter preferences. Try broadening your criteria or resetting filters.
                  </p>
                  <button
                    onClick={resetFilters}
                    className="px-5 py-2.5 bg-maroon-900 hover:bg-maroon-800 text-white font-semibold text-xs rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-1.5 mx-auto"
                  >
                    <RotateCcw className="w-3.5 h-3.5" /> Clear All Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredProfiles.map((profile) => (
                    <ProfileCard
                      key={profile.id}
                      name={profile.name}
                      age={profile.age}
                      location={profile.location}
                      education={profile.degree}
                      profession={profile.occupation}
                      rasi={profile.rasi}
                      nakshatra={profile.nakshatra}
                      image={profile.images[0]}
                      verified={profile.verified}
                      premium={profile.premium}
                      onViewProfile={() => router.push(`/profile/${profile.id}`)}
                      onSendInterest={() => handleSendInterest(profile.id)}
                    />
                  ))}
                </div>
              )}

            </section>
          </div>
        </div>
      </div>

      {/* 3. Mobile Filter Drawer (Overlay) */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex justify-end animate-fade-in">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsMobileFilterOpen(false)}
          />

          {/* Drawer Panel */}
          <div className="relative w-[85%] max-w-sm bg-white h-full shadow-2xl flex flex-col z-10 animate-slide-left">
            
            {/* Header */}
            <div className="px-5 py-4 bg-gradient-to-r from-maroon-900 to-maroon-800 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Filter className="w-4.5 h-4.5 text-gold-400" />
                <h3 className="font-bold text-sm">Refine Search</h3>
              </div>
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="p-1 text-white/70 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Filters */}
            <div className="flex-1 overflow-y-auto p-5 space-y-6">
              
              {/* Gender Toggle */}
              <div className="space-y-2">
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider">Search For</label>
                <div className="flex bg-gray-100 rounded-xl p-1 gap-1">
                  <button
                    onClick={() => setGender("Female")}
                    className={`flex-1 py-1.5 text-xs font-bold rounded-lg text-center transition-all cursor-pointer ${
                      gender === "Female" ? "bg-white text-maroon-800 shadow-sm" : "text-gray-500 hover:text-gray-800"
                    }`}
                  >
                    Brides
                  </button>
                  <button
                    onClick={() => setGender("Male")}
                    className={`flex-1 py-1.5 text-xs font-bold rounded-lg text-center transition-all cursor-pointer ${
                      gender === "Male" ? "bg-white text-maroon-800 shadow-sm" : "text-gray-500 hover:text-gray-800"
                    }`}
                  >
                    Grooms
                  </button>
                </div>
              </div>

              {/* Age Preference */}
              <div className="space-y-2">
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider">Age Preference</label>
                <div className="flex items-center gap-2">
                  <select
                    value={ageMin}
                    onChange={(e) => setAgeMin(Number(e.target.value))}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs"
                  >
                    {[...Array(20)].map((_, i) => (
                      <option key={i} value={20 + i}>{20 + i} Years</option>
                    ))}
                  </select>
                  <span className="text-gray-400 text-xs">to</span>
                  <select
                    value={ageMax}
                    onChange={(e) => setAgeMax(Number(e.target.value))}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs"
                  >
                    {[...Array(20)].map((_, i) => (
                      <option key={i} value={25 + i}>{25 + i} Years</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Location Select */}
              <div className="space-y-2">
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider">Location</label>
                <select
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs"
                >
                  <option value="">Any Location</option>
                  {LOCATIONS.map((loc) => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>
              </div>

              {/* Caste Select */}
              <div className="space-y-2">
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider">Caste</label>
                <select
                  value={caste}
                  onChange={(e) => setCaste(e.target.value)}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs"
                >
                  <option value="">Any Caste</option>
                  {CASTES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              {/* Rasi Checkboxes */}
              <div className="space-y-2">
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider">Rasi</label>
                <div className="grid grid-cols-2 gap-2 max-h-36 overflow-y-auto">
                  {RASIS.map((rasi) => (
                    <label key={rasi} className="flex items-center gap-1.5 text-xs text-gray-600 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedRasis.includes(rasi)}
                        onChange={() => handleRasiToggle(rasi)}
                        className="rounded text-maroon-800 border-gray-300 cursor-pointer"
                      />
                      {rasi}
                    </label>
                  ))}
                </div>
              </div>

              <div className="gold-divider" />

              {/* Toggle Indicators */}
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-xs font-semibold text-gray-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={verifiedOnly}
                    onChange={(e) => setVerifiedOnly(e.target.checked)}
                    className="rounded text-maroon-800 border-gray-300 cursor-pointer"
                  />
                  Verified Profiles Only
                </label>
                <label className="flex items-center gap-2 text-xs font-semibold text-gray-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={premiumOnly}
                    onChange={(e) => setPremiumOnly(e.target.checked)}
                    className="rounded text-maroon-800 border-gray-300 cursor-pointer"
                  />
                  Premium Profiles Only
                </label>
              </div>

            </div>

            {/* Footer buttons */}
            <div className="p-4 border-t border-gray-150 flex gap-2">
              <button
                onClick={() => { resetFilters(); setIsMobileFilterOpen(false); }}
                className="flex-1 py-3 text-center text-xs font-bold text-gray-500 bg-gray-50 hover:bg-gray-100 rounded-xl transition-all border border-gray-250 cursor-pointer"
              >
                Reset All
              </button>
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="flex-1 py-3 text-center text-xs font-bold text-white bg-maroon-900 hover:bg-maroon-800 rounded-xl transition-all shadow-md cursor-pointer"
              >
                Apply Filters
              </button>
            </div>

          </div>
        </div>
      )}

      <Footer />
    </main>
  );
}

export default function SearchProfilesPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-ivory-100 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-maroon-900 border-t-gold-500 rounded-full animate-spin" />
      </div>
    }>
      <SearchProfilesContent />
    </Suspense>
  );
}
