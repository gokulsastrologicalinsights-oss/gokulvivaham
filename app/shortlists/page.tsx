"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProfileCard from "@/components/ui/ProfileCard";
import { Heart, Search, Loader2 } from "lucide-react";
import { getShortlistedProfiles, removeShortlist } from "@/app/actions/shortlist";
import { Profile } from "@/lib/data";

export default function ShortlistsPage() {
  const router = useRouter();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchShortlists() {
      const { profiles } = await getShortlistedProfiles();
      setProfiles(profiles || []);
      setLoading(false);
    }
    fetchShortlists();
  }, []);

  const handleToggleShortlist = async (id: string) => {
    // Optimistic remove
    setProfiles(prev => prev.filter(p => p.id !== id));
    
    const { error } = await removeShortlist(id);
    if (error) {
       // Ideally we revert the state here, but for simplicity we could just fetch again
       const { profiles } = await getShortlistedProfiles();
       setProfiles(profiles || []);
    }
  };

  const handleSendInterest = (id: string) => {
    // Navigate to profile or send interest logic
    router.push(`/profile/${id}`);
  };

  return (
    <main className="flex flex-col min-h-screen bg-ivory-100">
      <Navbar />
      <div className="h-20" />

      <div className="flex-1 section-padding py-12">
        <div className="max-w-7xl mx-auto space-y-8">
          
          <div className="flex items-center gap-3 border-b border-ivory-300 pb-6">
            <div className="w-12 h-12 rounded-xl bg-maroon-50 flex items-center justify-center">
              <Heart className="w-6 h-6 text-maroon-800" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-maroon-900">Your Shortlisted Profiles</h1>
              <p className="text-gray-500 text-sm mt-1">
                Profiles you have saved for later consideration.
              </p>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
               <Loader2 className="w-10 h-10 animate-spin text-maroon-800" />
            </div>
          ) : profiles.length === 0 ? (
            <div className="bg-white rounded-3xl border border-ivory-300 p-16 text-center max-w-2xl mx-auto space-y-5">
              <div className="w-20 h-20 mx-auto bg-maroon-50 rounded-full flex items-center justify-center">
                <Heart className="w-10 h-10 text-maroon-200" />
              </div>
              <h3 className="text-2xl font-bold text-maroon-900">No profiles shortlisted yet</h3>
              <p className="text-gray-500 text-sm leading-relaxed max-w-sm mx-auto">
                Explore matches and click the heart icon to save profiles you are interested in.
              </p>
              <button 
                onClick={() => router.push("/search")} 
                className="px-6 py-3 bg-maroon-900 hover:bg-maroon-800 text-white font-bold text-sm rounded-xl shadow-lg hover:shadow-xl transition-all cursor-pointer inline-flex items-center gap-2"
              >
                <Search className="w-4 h-4" /> Start Searching
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
                  isShortlisted={true}
                  onViewProfile={() => router.push(`/profile/${profile.id}`)}
                  onSendInterest={() => handleSendInterest(profile.id)}
                  onToggleShortlist={() => handleToggleShortlist(profile.id)}
                />
              ))}
            </div>
          )}

        </div>
      </div>

      <Footer />
    </main>
  );
}
