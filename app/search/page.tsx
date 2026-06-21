/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, Suspense, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProfileCard from "@/components/ui/ProfileCard";
import { searchProfiles, SearchFilters } from "@/lib/api";
import { Profile } from "@/lib/data";
import {
  Search, Filter, X, ChevronDown, RotateCcw, Sparkles, UserCheck, ChevronLeft, ChevronRight
} from "lucide-react";
import { addShortlist, removeShortlist, getShortlistIds } from "@/app/actions/shortlist";

// --- Options Constants ---
const RASIS = ["Mesham", "Rishabam", "Mithunam", "Karkadagam", "Simham", "Kanni", "Thulam", "Vrishchikam", "Dhanusu", "Makaram", "Kumbham", "Meenam"];
const NAKSHATRAS = ["Aswini", "Bharani", "Krithigai", "Rohini", "Mrigashiras", "Arudra", "Punarvasu", "Pushyam", "Aslesha", "Magam", "Pooram", "Uthiram", "Hastham", "Chitra", "Swathi", "Visakam", "Anusham", "Kettai", "Moolam", "Pooradam", "Uthiradam", "Thiruvonam", "Avittam", "Sadhayam", "Poorattadhi", "Uthirattadhi", "Revathi"];
const DOSHAMS = ["None", "Chevvai Dosham", "Rahu-Kethu Dosham", "Kala Sarpa Dosham", "Sarpa Dosham", "Kalathra Dosham"];
const RELIGIONS = ["Hindu", "Muslim", "Christian", "Jain", "Sikh", "Buddhist"];
const MARITAL_STATUSES = ["Never Married", "Divorced", "Widowed", "Awaiting Divorce"];
const LOCATIONS = ["Chennai, Tamil Nadu", "Coimbatore, Tamil Nadu", "Madurai, Tamil Nadu", "Trichy, Tamil Nadu", "Tirunelveli, Tamil Nadu", "Salem, Tamil Nadu", "Bangalore, Karnataka", "Singapore"];
const CASTES = ["Iyer", "Gounder", "Pillai", "Mudaliar", "Naicker", "Vanniyar", "Chettiar", "Nadar", "Thevar"];

const HEIGHT_OPTIONS = [
  { label: "4' 5\"", cm: 134 }, { label: "4' 6\"", cm: 137 }, { label: "4' 7\"", cm: 139 }, { label: "4' 8\"", cm: 142 }, { label: "4' 9\"", cm: 144 }, { label: "4' 10\"", cm: 147 }, { label: "4' 11\"", cm: 149 },
  { label: "5' 0\"", cm: 152 }, { label: "5' 1\"", cm: 154 }, { label: "5' 2\"", cm: 157 }, { label: "5' 3\"", cm: 160 }, { label: "5' 4\"", cm: 162 }, { label: "5' 5\"", cm: 165 }, { label: "5' 6\"", cm: 167 }, { label: "5' 7\"", cm: 170 }, { label: "5' 8\"", cm: 172 }, { label: "5' 9\"", cm: 175 }, { label: "5' 10\"", cm: 177 }, { label: "5' 11\"", cm: 180 },
  { label: "6' 0\"", cm: 182 }, { label: "6' 1\"", cm: 185 }, { label: "6' 2\"", cm: 187 }, { label: "6' 3\"", cm: 190 }, { label: "6' 4\"", cm: 193 },
];

function SearchProfilesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Basic Filter States
  const [gender, setGender] = useState<string>("Female");
  const [ageMin, setAgeMin] = useState<number>(21);
  const [ageMax, setAgeMax] = useState<number>(60);
  const [location, setLocation] = useState<string>("");
  const [caste, setCaste] = useState<string>("");
  const [verifiedOnly, setVerifiedOnly] = useState<boolean>(false);
  const [premiumOnly, setPremiumOnly] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Advanced Filter States
  const [heightMin, setHeightMin] = useState<number>(134);
  const [heightMax, setHeightMax] = useState<number>(193);
  const [religion, setReligion] = useState<string>("");
  const [maritalStatus, setMaritalStatus] = useState<string>("");
  const [education, setEducation] = useState<string>("");
  const [profession, setProfession] = useState<string>("");
  const [selectedRasis, setSelectedRasis] = useState<string[]>([]);
  const [selectedNakshatras, setSelectedNakshatras] = useState<string[]>([]);
  const [selectedDoshams, setSelectedDoshams] = useState<string[]>([]);

  // UI State
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Pagination & Data State
  const [page, setPage] = useState<number>(1);
  const [pageSize] = useState<number>(9);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  // Sent interest tracking
  const [sentInterestIds, setSentInterestIds] = useState<string[]>([]);
  
  // Shortlist tracking
  const [shortlistedIds, setShortlistedIds] = useState<string[]>([]);

  // Initialize filters from URL
  useEffect(() => {
    const rasiParam = searchParams.get("rasi");
    if (rasiParam && RASIS.includes(rasiParam)) {
      setSelectedRasis([rasiParam]);
    }
    const genderParam = searchParams.get("gender");
    if (genderParam === "Male" || genderParam === "Female") {
      setGender(genderParam);
    }
    
    // Load initial shortlists
    async function loadShortlists() {
      const { ids } = await getShortlistIds();
      if (ids) setShortlistedIds(ids);
    }
    loadShortlists();
  }, [searchParams]);

  // Fetch Profiles logic with Debounce
  const fetchProfiles = useCallback(async () => {
    setIsLoading(true);
    
    const filters: SearchFilters = {
      gender,
      ageMin: ageMin > 21 ? ageMin : undefined,
      ageMax: ageMax < 60 ? ageMax : undefined,
      heightMin: heightMin > 134 ? heightMin : undefined,
      heightMax: heightMax < 193 ? heightMax : undefined,
      religion: religion || undefined,
      caste: caste || undefined,
      education: education || undefined,
      profession: profession || undefined,
      location: location || undefined,
      maritalStatus: maritalStatus || undefined,
      verifiedOnly: verifiedOnly || undefined,
      premiumOnly: premiumOnly || undefined,
      searchQuery: searchQuery || undefined,
      rasis: selectedRasis.length > 0 ? selectedRasis : undefined,
      nakshatras: selectedNakshatras.length > 0 ? selectedNakshatras : undefined,
      doshams: selectedDoshams.length > 0 ? selectedDoshams : undefined,
    };

    const result = await searchProfiles(filters, page, pageSize);
    setProfiles(result.profiles);
    setTotalCount(result.totalCount);
    setIsLoading(false);
  }, [
    gender, ageMin, ageMax, heightMin, heightMax, religion, caste, education, 
    profession, location, maritalStatus, verifiedOnly, premiumOnly, searchQuery, 
    selectedRasis, selectedNakshatras, selectedDoshams, page, pageSize
  ]);

  useEffect(() => {
    // Debounce to avoid querying on every keystroke
    const handler = setTimeout(() => {
      fetchProfiles();
    }, 400);
    return () => clearTimeout(handler);
  }, [fetchProfiles]);

  const handleArrayToggle = (item: string, setter: React.Dispatch<React.SetStateAction<string[]>>) => {
    setter((prev) =>
      prev.includes(item) ? prev.filter((r) => r !== item) : [...prev, item]
    );
    setPage(1); // Reset page on filter change
  };

  const handleSendInterest = (id: string) => {
    if (sentInterestIds.includes(id)) return;
    setSentInterestIds((prev) => [...prev, id]);
  };

  const handleToggleShortlist = async (id: string) => {
    const isShortlisted = shortlistedIds.includes(id);
    
    // Optimistic update
    setShortlistedIds((prev) => isShortlisted ? prev.filter(i => i !== id) : [...prev, id]);

    if (isShortlisted) {
      const { error } = await removeShortlist(id);
      if (error) setShortlistedIds((prev) => [...prev, id]); // revert
    } else {
      const { error } = await addShortlist(id);
      if (error) setShortlistedIds((prev) => prev.filter(i => i !== id)); // revert
    }
  };

  const resetFilters = () => {
    setAgeMin(21);
    setAgeMax(60);
    setHeightMin(134);
    setHeightMax(193);
    setReligion("");
    setCaste("");
    setMaritalStatus("");
    setEducation("");
    setProfession("");
    setLocation("");
    setSelectedRasis([]);
    setSelectedNakshatras([]);
    setSelectedDoshams([]);
    setVerifiedOnly(false);
    setPremiumOnly(false);
    setSearchQuery("");
    setPage(1);
  };

  // When any filter changes (except page itself), reset to page 1
  const handleFilterChange = (setter: any, value: any) => {
    setter(value);
    setPage(1);
  };

  const activeFilterCount =
    (selectedRasis.length > 0 ? 1 : 0) +
    (selectedNakshatras.length > 0 ? 1 : 0) +
    (selectedDoshams.length > 0 ? 1 : 0) +
    (location ? 1 : 0) +
    (caste ? 1 : 0) +
    (religion ? 1 : 0) +
    (maritalStatus ? 1 : 0) +
    (education ? 1 : 0) +
    (profession ? 1 : 0) +
    (verifiedOnly ? 1 : 0) +
    (premiumOnly ? 1 : 0) +
    (ageMin > 21 || ageMax < 60 ? 1 : 0) +
    (heightMin > 134 || heightMax < 193 ? 1 : 0);

  const totalPages = Math.ceil(totalCount / pageSize) || 1;

  // Render Sidebar content separately for reuse in mobile drawer
  const FilterContent = () => (
    <>
      {/* Gender Toggle */}
      <div className="space-y-2">
        <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider">I am looking for</label>
        <div className="flex bg-gray-100 rounded-xl p-1 gap-1">
          <button onClick={() => handleFilterChange(setGender, "Female")} className={`flex-1 py-1.5 text-xs font-bold rounded-lg text-center transition-all cursor-pointer ${gender === "Female" ? "bg-white text-maroon-800 shadow-sm" : "text-gray-500 hover:text-gray-800"}`}>Brides</button>
          <button onClick={() => handleFilterChange(setGender, "Male")} className={`flex-1 py-1.5 text-xs font-bold rounded-lg text-center transition-all cursor-pointer ${gender === "Male" ? "bg-white text-maroon-800 shadow-sm" : "text-gray-500 hover:text-gray-800"}`}>Grooms</button>
        </div>
      </div>

      {/* Age & Height */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider">Age (Years)</label>
          <div className="flex items-center gap-1">
            <input type="number" min="18" max="80" value={ageMin} onChange={(e) => handleFilterChange(setAgeMin, Number(e.target.value))} className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg text-xs" />
            <span className="text-gray-400 text-[10px]">to</span>
            <input type="number" min="18" max="80" value={ageMax} onChange={(e) => handleFilterChange(setAgeMax, Number(e.target.value))} className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg text-xs" />
          </div>
        </div>
        <div className="space-y-2">
          <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider">Height</label>
          <div className="flex items-center gap-1">
            <select value={heightMin} onChange={(e) => handleFilterChange(setHeightMin, Number(e.target.value))} className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg text-[10px]">
              {HEIGHT_OPTIONS.map(h => <option key={`min-${h.cm}`} value={h.cm}>{h.label}</option>)}
            </select>
            <span className="text-gray-400 text-[10px]">to</span>
            <select value={heightMax} onChange={(e) => handleFilterChange(setHeightMax, Number(e.target.value))} className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg text-[10px]">
              {HEIGHT_OPTIONS.map(h => <option key={`max-${h.cm}`} value={h.cm}>{h.label}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Marital Status */}
      <div className="space-y-2">
        <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider">Marital Status</label>
        <select value={maritalStatus} onChange={(e) => handleFilterChange(setMaritalStatus, e.target.value)} className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs">
          <option value="">Any</option>
          {MARITAL_STATUSES.map(m => <option key={m} value={m}>{m}</option>)}
        </select>
      </div>

      {/* Religion & Caste */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider">Religion</label>
          <select value={religion} onChange={(e) => handleFilterChange(setReligion, e.target.value)} className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs">
            <option value="">Any</option>
            {RELIGIONS.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>
        <div className="space-y-2">
          <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider">Community/Caste</label>
          <select value={caste} onChange={(e) => handleFilterChange(setCaste, e.target.value)} className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs">
            <option value="">Any</option>
            {CASTES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      {/* Location */}
      <div className="space-y-2">
        <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider">Location</label>
        <select value={location} onChange={(e) => handleFilterChange(setLocation, e.target.value)} className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs">
          <option value="">Any Location</option>
          {LOCATIONS.map(loc => <option key={loc} value={loc}>{loc}</option>)}
        </select>
      </div>

      <div className="gold-divider" />

      {/* Advanced toggle */}
      <button onClick={() => setShowAdvanced(!showAdvanced)} className="w-full flex items-center justify-between text-xs font-bold text-maroon-800 py-1 cursor-pointer hover:text-maroon-600">
        <span>Astrological & Career Filters</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${showAdvanced ? "rotate-180" : ""}`} />
      </button>

      {showAdvanced && (
        <div className="space-y-5 animate-fade-in pt-2">
          {/* Rasi Checkboxes */}
          <div className="space-y-2.5">
            <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider">Rasi</label>
            <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto custom-scrollbar pr-1">
              {RASIS.map(rasi => (
                <label key={rasi} className="flex items-center gap-1.5 text-[11px] text-gray-600 cursor-pointer truncate">
                  <input type="checkbox" checked={selectedRasis.includes(rasi)} onChange={() => handleArrayToggle(rasi, setSelectedRasis)} className="rounded text-maroon-800 border-gray-300 focus:ring-maroon-400 cursor-pointer" />
                  {rasi}
                </label>
              ))}
            </div>
          </div>

          {/* Nakshatra Checkboxes */}
          <div className="space-y-2.5">
            <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider">Nakshatra</label>
            <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto custom-scrollbar pr-1">
              {NAKSHATRAS.map(n => (
                <label key={n} className="flex items-center gap-1.5 text-[11px] text-gray-600 cursor-pointer truncate">
                  <input type="checkbox" checked={selectedNakshatras.includes(n)} onChange={() => handleArrayToggle(n, setSelectedNakshatras)} className="rounded text-maroon-800 border-gray-300 focus:ring-maroon-400 cursor-pointer" />
                  {n}
                </label>
              ))}
            </div>
          </div>

          {/* Doshams */}
          <div className="space-y-2.5">
            <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider">Dosham</label>
            <div className="grid grid-cols-1 gap-2">
              {DOSHAMS.map(d => (
                <label key={d} className="flex items-center gap-1.5 text-[11px] text-gray-600 cursor-pointer">
                  <input type="checkbox" checked={selectedDoshams.includes(d)} onChange={() => handleArrayToggle(d, setSelectedDoshams)} className="rounded text-maroon-800 border-gray-300 focus:ring-maroon-400 cursor-pointer" />
                  {d}
                </label>
              ))}
            </div>
          </div>

          {/* Education & Profession */}
          <div className="space-y-3">
            <input type="text" placeholder="Education (e.g., B.E, MBBS)" value={education} onChange={(e) => handleFilterChange(setEducation, e.target.value)} className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-maroon-400 focus:border-maroon-400" />
            <input type="text" placeholder="Profession (e.g., Engineer)" value={profession} onChange={(e) => handleFilterChange(setProfession, e.target.value)} className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-maroon-400 focus:border-maroon-400" />
          </div>
        </div>
      )}

      <div className="gold-divider" />

      {/* Extra Filters */}
      <div className="space-y-3">
        <label className="flex items-center gap-2 text-xs font-semibold text-gray-700 cursor-pointer">
          <input type="checkbox" checked={verifiedOnly} onChange={(e) => handleFilterChange(setVerifiedOnly, e.target.checked)} className="rounded text-maroon-800 border-gray-300 focus:ring-maroon-400 cursor-pointer" />
          <UserCheck className="w-3.5 h-3.5 text-maroon-600" /> Verified Profiles Only
        </label>
        <label className="flex items-center gap-2 text-xs font-semibold text-gray-700 cursor-pointer">
          <input type="checkbox" checked={premiumOnly} onChange={(e) => handleFilterChange(setPremiumOnly, e.target.checked)} className="rounded text-maroon-800 border-gray-300 focus:ring-maroon-400 cursor-pointer" />
          <Sparkles className="w-3.5 h-3.5 text-gold-600 fill-current" /> Premium Members Only
        </label>
      </div>
    </>
  );

  return (
    <main className="flex flex-col min-h-screen bg-ivory-100">
      <Navbar />
      <div className="h-20" />

      <div className="flex-1 section-padding py-8">
        <div className="max-w-7xl mx-auto space-y-6">
          
          {/* Header & Search Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white rounded-3xl border border-ivory-300 p-6 shadow-sm">
            <div>
              <h1 className="text-2xl font-bold text-maroon-900 flex items-center gap-2">
                <Search className="w-6 h-6 text-gold-500" />
                Find Your Life Partner
              </h1>
              <p className="text-gray-500 text-xs mt-1">
                Browse through verified profiles using advanced filtering.
              </p>
            </div>
            <div className="relative w-full md:max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, education, or job..."
                value={searchQuery}
                onChange={(e) => handleFilterChange(setSearchQuery, e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:border-maroon-400 focus:ring-1 focus:ring-maroon-400 text-sm"
              />
            </div>
          </div>

          {/* Mobile Filter Toggle */}
          <div className="flex lg:hidden justify-between items-center bg-white px-5 py-3 rounded-2xl border border-ivory-300 shadow-sm">
            <span className="text-xs text-gray-600 font-semibold">Showing {totalCount} profiles</span>
            <button onClick={() => setIsMobileFilterOpen(true)} className="flex items-center gap-1.5 px-3 py-2 bg-maroon-50 border border-maroon-100 rounded-xl text-maroon-800 text-xs font-bold cursor-pointer">
              <Filter className="w-3.5 h-3.5" /> Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
            </button>
          </div>

          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
            
            {/* Desktop Sidebar */}
            <aside className="hidden lg:block bg-white rounded-3xl border border-ivory-300 p-6 shadow-sm space-y-5 sticky top-24 max-h-[85vh] overflow-y-auto custom-scrollbar">
              <div className="flex items-center justify-between border-b border-ivory-200 pb-3">
                <h2 className="font-bold text-maroon-900 text-sm flex items-center gap-2">
                  <Filter className="w-4 h-4 text-gold-500" /> Filters
                </h2>
                {activeFilterCount > 0 && (
                  <button onClick={resetFilters} className="text-[10px] text-maroon-700 font-bold flex items-center gap-0.5 hover:underline cursor-pointer">
                    <RotateCcw className="w-3 h-3" /> Reset
                  </button>
                )}
              </div>
              <FilterContent />
            </aside>

            {/* Results */}
            <section className="lg:col-span-3 space-y-6">
              
              {/* Active Filters Badges */}
              <div className="flex flex-wrap items-center justify-between gap-3 bg-white px-5 py-4 rounded-2xl border border-ivory-300 shadow-sm min-h-[56px]">
                <div className="text-xs text-gray-500 font-medium">
                  We found <span className="font-bold text-maroon-900">{totalCount}</span> matching profiles
                </div>
                {activeFilterCount > 0 && (
                  <div className="flex flex-wrap gap-1.5 items-center">
                    {location && <Badge label={location.split(",")[0]} onRemove={() => handleFilterChange(setLocation, "")} />}
                    {caste && <Badge label={caste} onRemove={() => handleFilterChange(setCaste, "")} />}
                    {religion && <Badge label={religion} onRemove={() => handleFilterChange(setReligion, "")} />}
                    {maritalStatus && <Badge label={maritalStatus} onRemove={() => handleFilterChange(setMaritalStatus, "")} />}
                    {selectedRasis.map(r => <Badge key={r} label={r} onRemove={() => handleArrayToggle(r, setSelectedRasis)} />)}
                    {selectedNakshatras.map(n => <Badge key={n} label={n} onRemove={() => handleArrayToggle(n, setSelectedNakshatras)} />)}
                    {selectedDoshams.map(d => <Badge key={d} label={d} onRemove={() => handleArrayToggle(d, setSelectedDoshams)} />)}
                  </div>
                )}
              </div>

              {/* Grid */}
              {isLoading ? (
                <div className="flex items-center justify-center py-20">
                  <div className="w-10 h-10 border-4 border-maroon-900 border-t-gold-500 rounded-full animate-spin" />
                </div>
              ) : profiles.length === 0 ? (
                <div className="bg-white rounded-3xl border border-ivory-300 p-12 text-center max-w-xl mx-auto space-y-4">
                  <div className="text-5xl">🔍</div>
                  <h3 className="text-lg font-bold text-maroon-900">No matching profiles found</h3>
                  <p className="text-gray-500 text-xs leading-relaxed max-w-sm mx-auto">
                    We couldn't find any profiles matching your exact filter preferences. Try broadening your criteria.
                  </p>
                  <button onClick={resetFilters} className="px-5 py-2.5 bg-maroon-900 hover:bg-maroon-800 text-white font-semibold text-xs rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-1.5 mx-auto">
                    <RotateCcw className="w-3.5 h-3.5" /> Clear Filters
                  </button>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {profiles.map((profile) => (
                      <ProfileCard
                        key={profile.id}
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
                        isShortlisted={shortlistedIds.includes(profile.id)}
                        onViewProfile={() => router.push(`/profile/${profile.id}`)}
                        onSendInterest={() => handleSendInterest(profile.id)}
                        onToggleShortlist={() => handleToggleShortlist(profile.id)}
                      />
                    ))}
                  </div>

                  {/* Pagination Controls */}
                  {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-4 mt-8">
                      <button 
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="p-2 bg-white border border-ivory-300 rounded-xl disabled:opacity-50 hover:bg-maroon-50 text-maroon-900 transition-colors cursor-pointer disabled:cursor-not-allowed"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <span className="text-sm font-semibold text-gray-700">
                        Page {page} of {totalPages}
                      </span>
                      <button 
                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages}
                        className="p-2 bg-white border border-ivory-300 rounded-xl disabled:opacity-50 hover:bg-maroon-50 text-maroon-900 transition-colors cursor-pointer disabled:cursor-not-allowed"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </div>
                  )}
                </>
              )}
            </section>
          </div>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex justify-end animate-fade-in">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsMobileFilterOpen(false)} />
          <div className="relative w-[85%] max-w-sm bg-white h-full shadow-2xl flex flex-col z-10 animate-slide-left">
            <div className="px-5 py-4 bg-gradient-to-r from-maroon-900 to-maroon-800 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Filter className="w-4.5 h-4.5 text-gold-400" />
                <h3 className="font-bold text-sm">Refine Search</h3>
              </div>
              <button onClick={() => setIsMobileFilterOpen(false)} className="p-1 text-white/70 hover:text-white rounded-lg hover:bg-white/10 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-5 space-y-6">
              <FilterContent />
            </div>
            <div className="p-4 border-t border-gray-150 flex gap-2">
              <button onClick={() => { resetFilters(); setIsMobileFilterOpen(false); }} className="flex-1 py-3 text-center text-xs font-bold text-gray-500 bg-gray-50 hover:bg-gray-100 rounded-xl border border-gray-250 cursor-pointer">
                Reset All
              </button>
              <button onClick={() => setIsMobileFilterOpen(false)} className="flex-1 py-3 text-center text-xs font-bold text-white bg-maroon-900 hover:bg-maroon-800 rounded-xl shadow-md cursor-pointer">
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

// Helper component for badges
const Badge = ({ label, onRemove }: { label: string; onRemove: () => void }) => (
  <span className="inline-flex items-center gap-1 bg-maroon-50 text-maroon-800 text-[10px] px-2 py-0.5 rounded-full border border-maroon-100 font-bold max-w-[120px] truncate">
    <span className="truncate">{label}</span>
    <X className="w-2.5 h-2.5 cursor-pointer hover:text-maroon-950 flex-shrink-0" onClick={onRemove} />
  </span>
);

export default function SearchPage() {
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
