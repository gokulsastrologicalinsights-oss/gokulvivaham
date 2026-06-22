/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProfileCard from "@/components/ui/ProfileCard";
import { mockProfiles as initialProfiles, Profile } from "@/lib/data";
import { getProfiles, getReceivedInterests, acceptInterest, declineInterest, InterestRecord } from "@/lib/api";
import { getShortlistIds, addShortlist, removeShortlist } from "@/app/actions/shortlist";
import { createClient } from "@/utils/supabase/client";
import {
  Heart,
  Eye,
  CheckCircle2,
  Award,
  Sparkles,
  ChevronRight,
  User,
  Plus,
  Compass,
  MessageSquare,
  TrendingUp,
  Gem,
  Gift,
} from "lucide-react";

export default function DashboardClient({ user, profile }: { user: any; profile: any }) {
  const router = useRouter();
  const [mockProfiles, setMockProfiles] = useState<Profile[]>(initialProfiles);

  // user is passed from the server component

  const queryClient = useQueryClient();

  const { data: profilesData } = useQuery({
    queryKey: ['profiles'],
    queryFn: () => getProfiles(1, 20)
  });

  useEffect(() => {
    if (profilesData?.profiles && profilesData.profiles.length > 0) {
      setMockProfiles(profilesData.profiles as any);
    }
  }, [profilesData]);
  
  // Real authenticated user augmented with UI mock stats
  const currentUser = {
    name: profile?.first_name ? `${profile.first_name} ${profile.last_name || ''}`.trim() : "Valued Member",
    id: user?.id || "7",
    gender: profile?.gender || "Not specified",
    premium: true,
    completeness: 85,
    views: 124,
    interestsReceived: 6,
    shortlists: 18,
    matches: 12,
  };

  const [pendingInterests, setPendingInterests] = useState<InterestRecord[]>([]);
  const [acceptedIds, setAcceptedIds] = useState<string[]>([]);
  const [declinedIds, setDeclinedIds] = useState<string[]>([]);
  const [sentInterestIds, setSentInterestIds] = useState<string[]>([]);
  const [shortlistedIds, setShortlistedIds] = useState<string[]>([]);

  useEffect(() => {
    if (user?.id) {
      getReceivedInterests(user.id, 'pending', 1, 20).then(({ interests }) => {
        setPendingInterests(interests);
      });
      getShortlistIds().then(({ ids }) => {
        if (ids) setShortlistedIds(ids);
      });
    }
  }, [user]);

  // Recommended matches: Female profiles that are premium / highly compatible
  const recommendations = mockProfiles.filter(
    (p) => p.gender !== currentUser.gender
  );

  const handleAcceptInterest = async (interestId: string) => {
    setAcceptedIds((prev) => [...prev, interestId]);
    await acceptInterest(interestId);
    setTimeout(() => {
      setPendingInterests((prev) => prev.filter((p) => p.id !== interestId));
    }, 1500);
  };

  const handleDeclineInterest = async (interestId: string) => {
    setDeclinedIds((prev) => [...prev, interestId]);
    await declineInterest(interestId);
    setTimeout(() => {
      setPendingInterests((prev) => prev.filter((p) => p.id !== interestId));
    }, 1500);
  };

  const handleSendInterest = (id: string) => {
    if (sentInterestIds.includes(id)) return;
    setSentInterestIds((prev) => [...prev, id]);
  };

  const handleToggleShortlist = async (id: string) => {
    const isShortlisted = shortlistedIds.includes(id);
    setShortlistedIds((prev) => isShortlisted ? prev.filter(i => i !== id) : [...prev, id]);

    if (isShortlisted) {
      const { error } = await removeShortlist(id);
      if (error) setShortlistedIds((prev) => [...prev, id]); // revert
    } else {
      const { error } = await addShortlist(id);
      if (error) setShortlistedIds((prev) => prev.filter(i => i !== id)); // revert
    }
  };

  return (
    <main className="flex flex-col min-h-screen bg-ivory-100">
      <Navbar />
      
      {/* Spacer for sticky navbar */}
      <div className="h-20" />

      {/* Main Dashboard Section */}
      <div className="flex-1 section-padding py-10">
        <div className="max-w-7xl mx-auto space-y-10">
          
          {/* LUXURY WELCOME BANNER (Wedding invitation style) */}
          <div className="relative bg-gradient-to-br from-maroon-950 via-maroon-900 to-maroon-950 rounded-3xl overflow-hidden shadow-2xl border-2 border-gold-400 p-8 md:p-10">
            <div className="absolute inset-0 hero-pattern opacity-15" />
            
            {/* Elegant corner patterns */}
            <div className="absolute top-2 left-2 text-gold-400/30 text-2xl select-none">❈</div>
            <div className="absolute top-2 right-2 text-gold-400/30 text-2xl select-none">❈</div>
            <div className="absolute bottom-2 left-2 text-gold-400/30 text-2xl select-none">❈</div>
            <div className="absolute bottom-2 right-2 text-gold-400/30 text-2xl select-none">❈</div>
            
            <div className="absolute top-0 right-0 w-80 h-80 bg-gold-400/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
              
              <div className="flex items-center gap-6">
                
                {/* Luxury Gilded Profile Picture Frame */}
                <div className="relative flex-shrink-0">
                  <div className="w-22 h-22 rounded-full border-2 border-gold-400 bg-white/10 overflow-hidden flex items-center justify-center p-1 shadow-inner">
                    <Image
                      src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=200&auto=format&fit=crop"
                      alt="User profile"
                      fill
                      className="object-cover rounded-full"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.name)}&background=8b1a1a&color=faf6f0&size=100`;
                      }}
                    />
                  </div>
                  {/* Floating star on avatar frame */}
                  <div className="absolute -bottom-1 -right-1 bg-gold-500 text-maroon-950 p-1 rounded-full shadow-lg border border-gold-300">
                    <Sparkles className="w-3.5 h-3.5 fill-current" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] bg-gradient-to-r from-gold-600 via-gold-500 to-gold-600 text-maroon-950 px-3 py-1 rounded-full font-extrabold tracking-wider flex items-center gap-1 shadow border border-gold-300">
                      <Award className="w-3 h-3 fill-current" />
                      GOLD PRIME MEMBER
                    </span>
                  </div>
                  <h1 className="text-3xl md:text-4xl font-extrabold text-white font-serif tracking-wide">
                    Vanakkam, {currentUser.name}
                  </h1>
                  <p className="text-gold-200/80 text-xs font-semibold tracking-widest uppercase">
                    ID: GV-0000{currentUser.id} • Iyer Groom • Chennai
                  </p>
                </div>
              </div>

              {/* Profile Completeness - Gold Bar style */}
              <div className="bg-white/5 backdrop-blur-lg border border-gold-400/20 rounded-2xl p-5 md:w-80 w-full shadow-xl">
                <div className="flex justify-between items-center text-xs text-white mb-2">
                  <span className="font-extrabold tracking-wider uppercase text-gold-300">Profile Strength</span>
                  <span className="font-black text-gold-400">{currentUser.completeness}% Completed</span>
                </div>
                <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden border border-white/5 p-[1px]">
                  <div
                    className="h-full bg-gradient-to-r from-gold-600 via-gold-400 to-gold-500 rounded-full transition-all duration-500"
                    style={{ width: `${currentUser.completeness}%` }}
                  />
                </div>
                <div className="flex justify-between items-center mt-4">
                  <p className="text-[10px] text-gray-300">
                    Complete horoscope to match astrology
                  </p>
                  <button
                    onClick={() => router.push("/profile/edit")}
                    className="text-xs text-gold-400 font-extrabold hover:text-gold-300 transition-colors flex items-center gap-0.5 cursor-pointer underline hover:no-underline"
                  >
                    Complete Now <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

            </div>
          </div>

          {/* Luxury Metric Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              {
                label: "Interests Received",
                value: currentUser.interestsReceived,
                icon: Heart,
                color: "text-maroon-800 bg-maroon-50 border-gold-300/30",
              },
              {
                label: "Profile Views",
                value: currentUser.views,
                icon: Eye,
                color: "text-gold-700 bg-gold-50/70 border-gold-300/30",
              },
              {
                label: "Compatible Matches",
                value: currentUser.matches,
                icon: Sparkles,
                color: "text-purple-800 bg-purple-50 border-purple-100/50",
              },
              {
                label: "Shortlisted Profiles",
                value: currentUser.shortlists,
                icon: Compass,
                color: "text-blue-800 bg-blue-50 border-blue-100/50",
              },
            ].map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <div
                  key={idx}
                  className={`bg-white p-6 rounded-2xl border ${stat.color} shadow-md hover:shadow-xl transition-all duration-350 flex items-center justify-between hover:-translate-y-1`}
                >
                  <div>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">{stat.label}</p>
                    <p className="text-3xl font-black text-maroon-950 mt-1 font-serif">{stat.value}</p>
                  </div>
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center border border-gold-300/20 bg-ivory-100 text-maroon-700">
                    <Icon className="w-6 h-6" />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Grid Layout: Main & Side column */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Main Content Column */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* Connection Requests (Interests Received) */}
              <div className="bg-white rounded-3xl border border-gold-300/20 shadow-lg p-6 md:p-8 relative">
                
                {/* Decorative border frame */}
                <div className="absolute inset-2 border border-gold-400/10 rounded-2xl pointer-events-none" />

                <div className="flex items-center justify-between mb-6 relative z-10">
                  <div className="flex items-center gap-2.5">
                    <div className="w-1.5 h-6 bg-gold-500 rounded-full" />
                    <h2 className="text-xl font-bold text-maroon-900 font-serif">
                      Pending Connection Requests ({pendingInterests.length})
                    </h2>
                  </div>
                  {pendingInterests.length > 0 && (
                    <span className="text-[10px] bg-maroon-900 text-white px-3 py-1 rounded-full font-bold uppercase tracking-widest border border-gold-400 animate-pulse">
                      Pending Action
                    </span>
                  )}
                </div>

                {pendingInterests.length === 0 ? (
                  <div className="text-center py-12 bg-ivory-50/50 rounded-2xl border border-dashed border-gold-300/30 relative z-10">
                    <Heart className="w-12 h-12 text-gold-300 mx-auto mb-3" />
                    <h3 className="font-bold text-maroon-950 text-sm font-serif">All caught up!</h3>
                    <p className="text-xs text-gray-500 mt-1 max-w-xs mx-auto leading-relaxed">
                      You have no pending requests. Use Search to explore verified matches and send interests!
                    </p>
                    <button
                      onClick={() => router.push("/search")}
                      className="mt-5 px-6 py-2.5 text-xs font-extrabold text-white bg-gradient-to-r from-maroon-900 to-maroon-800 hover:from-maroon-800 hover:to-maroon-700 rounded-xl transition-all shadow-md cursor-pointer border border-gold-400/25"
                    >
                      Browse Luxury Profiles
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4 relative z-10">
                    {pendingInterests.map((interest) => {
                      const profile = interest.profile;
                      const isAccepted = acceptedIds.includes(interest.id);
                      const isDeclined = declinedIds.includes(interest.id);

                      return (
                        <div
                          key={interest.id}
                          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl border border-gold-300/10 hover:border-gold-300/30 transition-all duration-300 bg-gradient-to-r from-ivory-50/30 to-ivory-100/10 hover:from-gold-50/10 hover:to-gold-50/20"
                        >
                          <div
                            className="flex items-center gap-4 cursor-pointer"
                            onClick={() => router.push(`/profile/${profile.id}`)}
                          >
                            <div className="relative w-16 h-16 rounded-full overflow-hidden border border-gold-300/80 bg-white p-0.5 shadow-md">
                              <Image
                                src={profile.images[0]}
                                alt={profile.name}
                                fill
                                className="object-cover rounded-full"
                              />
                            </div>
                            <div>
                              <h3 className="font-bold text-maroon-900 text-sm hover:underline hover:text-gold-700 transition-colors flex items-center gap-1.5 font-serif">
                                {profile.name}
                                {profile.premium && (
                                  <span className="text-[8px] bg-gradient-to-r from-gold-600 to-gold-500 text-white font-extrabold px-2 py-0.5 rounded border border-gold-300 shadow">
                                    PRIME
                                  </span>
                                )}
                              </h3>
                              <p className="text-xs text-gray-500 mt-0.5">
                                {profile.age} Yrs • {profile.rasi} • {profile.nakshatra}
                              </p>
                              <p className="text-[11px] text-maroon-700 font-bold mt-1">
                                {profile.occupation}
                              </p>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex gap-2 w-full sm:w-auto">
                            {isAccepted ? (
                              <div className="flex items-center gap-1.5 text-xs text-green-700 bg-green-50 px-4 py-2.5 rounded-xl border border-green-200 font-bold w-full sm:w-auto justify-center animate-fade-in">
                                <CheckCircle2 className="w-4.5 h-4.5" /> Accepted! Contact Unlocked
                              </div>
                            ) : isDeclined ? (
                              <div className="text-xs text-gray-400 bg-gray-50 px-4 py-2.5 rounded-xl border border-gray-200 w-full sm:w-auto text-center font-semibold">
                                Request Declined
                              </div>
                            ) : (
                              <>
                                <button
                                  onClick={() => handleDeclineInterest(interest.id)}
                                  className="flex-1 sm:flex-none px-4 py-2.5 text-xs font-semibold text-gray-500 bg-white border border-gray-200 hover:bg-gray-50 rounded-xl transition-all cursor-pointer"
                                >
                                  Decline
                                </button>
                                <button
                                  onClick={() => handleAcceptInterest(interest.id)}
                                  className="flex-1 sm:flex-none px-4 py-2.5 text-xs font-extrabold text-white bg-gradient-to-r from-maroon-900 via-maroon-800 to-maroon-900 hover:from-maroon-800 hover:to-maroon-700 rounded-xl transition-all shadow-md border border-gold-400/20 cursor-pointer"
                                >
                                  Accept Call
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Recommended Profiles */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-1.5 h-6 bg-gold-500 rounded-full" />
                    <h2 className="text-xl font-bold text-maroon-900 font-serif">
                      Luxury Matches For You
                    </h2>
                  </div>
                  <button
                    onClick={() => router.push("/search")}
                    className="text-xs text-gold-700 font-extrabold hover:text-gold-800 hover:underline flex items-center gap-0.5 cursor-pointer uppercase tracking-wider"
                  >
                    View All Matches <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {recommendations.slice(0, 4).map((profile) => (
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
                      isShortlisted={shortlistedIds.includes(profile.id)}
                      onViewProfile={() => router.push(`/profile/${profile.id}`)}
                      onSendInterest={() => handleSendInterest(profile.id)}
                      onToggleShortlist={() => handleToggleShortlist(profile.id)}
                    />
                  ))}
                </div>
              </div>

            </div>

            {/* Sidebar Column */}
            <div className="space-y-6">
              
              {/* Daily Astrology Match Card */}
              <div className="bg-white rounded-3xl border border-gold-300/30 shadow-lg overflow-hidden relative">
                
                {/* Decorative border frame */}
                <div className="absolute inset-1.5 border border-gold-400/5 rounded-2xl pointer-events-none" />

                <div className="bg-gradient-to-r from-gold-650 via-gold-500 to-gold-600 p-5 text-maroon-950 border-b border-gold-300">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 fill-current text-maroon-950" />
                    <h3 className="font-extrabold text-xs uppercase tracking-wider font-serif">Luxury Astrology Match</h3>
                  </div>
                  <p className="text-[10px] text-maroon-900 font-bold mt-1">Gokul Vivaham Jathagam Compatibility</p>
                </div>
                
                <div className="p-5 space-y-4 relative z-10">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-gold-50 border border-gold-300/50 flex items-center justify-center flex-shrink-0 text-gold-700 shadow-sm">
                      ❈
                    </div>
                    <div>
                      <h4 className="font-extrabold text-maroon-900 text-xs">Krithigai & Magam Match</h4>
                      <p className="text-gray-500 text-xs mt-1.5 leading-relaxed">
                        Highly compatible Jathagam alignment found for your star Magam with profiles containing Krithigai star.
                      </p>
                    </div>
                  </div>
                  <div className="gold-divider" />
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Rasi matching</span>
                      <span className="font-bold text-green-700 bg-green-50 px-2 py-0.5 rounded">8/10 Porutham</span>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Dhosha matching</span>
                      <span className="font-bold text-green-700 bg-green-50 px-2 py-0.5 rounded">Compatible</span>
                    </div>
                  </div>
                  <button
                    onClick={() => router.push("/search?rasi=Rishabam")}
                    className="w-full py-3 text-xs font-bold text-maroon-950 bg-gradient-to-b from-[#fff7dd] to-gold-200 hover:from-gold-200 hover:to-gold-300 border border-gold-300/70 rounded-xl transition-all shadow-sm cursor-pointer"
                  >
                    View Krithigai Matches
                  </button>
                </div>
              </div>

              {/* Premium Perks Widget */}
              <div className="bg-gradient-to-br from-maroon-950 via-maroon-900 to-maroon-950 text-white rounded-3xl border border-gold-400 p-6 shadow-xl space-y-4 relative">
                <div className="absolute inset-1.5 border border-gold-400/10 rounded-2xl pointer-events-none" />
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gold-500/20 border border-gold-400/30 flex items-center justify-center text-gold-400 shadow-lg">
                    <Gem className="w-5 h-5 fill-current" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-gold-400 font-serif">Gokul Elite Perks</h3>
                    <p className="text-[10px] text-gold-200/60 uppercase tracking-widest font-semibold">Premium Privileges</p>
                  </div>
                </div>
                <ul className="space-y-2 text-[11px] text-gray-300 font-medium">
                  <li className="flex items-center gap-2">✨ Direct family call coordinators</li>
                  <li className="flex items-center gap-2">✨ Unlimited verified phone requests</li>
                  <li className="flex items-center gap-2">✨ Priority profile highlight in search</li>
                </ul>
                <button
                  onClick={() => router.push("/membership")}
                  className="w-full py-3 text-xs font-bold text-maroon-950 bg-gradient-to-r from-gold-500 to-gold-400 hover:from-gold-400 hover:to-gold-300 rounded-xl shadow-lg border border-gold-300/40 transition-all cursor-pointer uppercase tracking-wider"
                >
                  Upgrade Membership
                </button>
              </div>

              {/* Chat Support Widget */}
              <div className="bg-white rounded-3xl border border-gold-300/20 shadow-lg p-5 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-maroon-50 border border-maroon-100 flex items-center justify-center text-maroon-700">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-maroon-900 text-sm font-serif">Relationship Manager</h3>
                    <p className="text-xs text-gray-400">Personal Assistance</p>
                  </div>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Have questions? Connect with a dedicated advisor to schedule horoscope compatibility audits or call setups.
                </p>
                <a
                  href="https://wa.me/919876543210"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full py-3 text-center text-xs font-bold text-white bg-green-600 hover:bg-green-700 rounded-xl transition-all shadow-md border border-green-600/30"
                >
                  💬 Message Advisor
                </a>
              </div>

            </div>

          </div>

        </div>
      </div>

      <Footer />
    </main>
  );
}
