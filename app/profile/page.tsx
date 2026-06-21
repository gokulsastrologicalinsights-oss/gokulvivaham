import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { User, Mail, Calendar, Settings } from "lucide-react";

export default async function MyProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  // Basic calculation for completion percentage
  let completionPercentage = 0;
  if (profile) {
    let filled = 0;
    let total = 0;
    const fields = ['first_name', 'gender', 'date_of_birth', 'marital_status', 'height', 'mother_tongue', 'religion', 'caste', 'education', 'profession', 'location_city', 'about_me'];
    fields.forEach(f => {
      total++;
      if (profile[f as keyof typeof profile]) filled++;
    });
    completionPercentage = Math.round((filled / total) * 100);
  }

  // A logged-in user must never see another user's profile dashboard
  // This page inherently only shows the logged-in user's own data from the secure session.

  return (
    <main className="flex flex-col min-h-screen bg-ivory-100">
      <Navbar />
      <div className="h-20" />

      <div className="flex-1 max-w-4xl mx-auto w-full p-6 md:p-10">
        <h1 className="text-3xl font-bold text-maroon-900 font-serif mb-6 flex items-center gap-3">
          <User className="w-8 h-8 text-gold-500" />
          My Profile Dashboard
        </h1>

        {completionPercentage < 100 && (
          <div className="mb-6 bg-gold-50 border border-gold-200 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex-1">
              <h3 className="font-bold text-maroon-900">Profile Completion: {completionPercentage}%</h3>
              <div className="w-full bg-gold-200 rounded-full h-2.5 mt-2">
                <div className="bg-gold-500 h-2.5 rounded-full" style={{ width: `${completionPercentage}%` }}></div>
              </div>
            </div>
            <a href="/profile/edit" className="px-5 py-2 bg-maroon-900 text-white rounded-xl text-sm font-semibold hover:bg-maroon-800 transition-colors">
              Complete Profile
            </a>
          </div>
        )}

        <div className="bg-white rounded-3xl border border-gold-300/20 shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-maroon-950 to-maroon-800 p-8 text-white flex flex-col md:flex-row items-center gap-6">
            <div className="w-24 h-24 rounded-full bg-gold-500/20 border-2 border-gold-400 flex items-center justify-center text-3xl shadow-xl overflow-hidden">
              {profile?.profile_picture_url ? (
                 <img src={profile.profile_picture_url} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                 profile?.first_name?.charAt(0) || "U"
              )}
            </div>
            <div className="text-center md:text-left">
              <h2 className="text-2xl font-bold">{(profile?.first_name || '') + ' ' + (profile?.last_name || '') || "Valued Member"}</h2>
              <p className="text-gold-300 text-sm mt-1 flex items-center justify-center md:justify-start gap-1.5">
                <Mail className="w-4 h-4" />
                {user.email}
              </p>
            </div>
            <div className="md:ml-auto flex justify-center">
              <a href="/profile/edit" className="px-4 py-2 border border-gold-400 text-gold-400 rounded-xl text-sm font-semibold hover:bg-gold-400 hover:text-maroon-900 transition-colors flex items-center gap-2">
                <Settings className="w-4 h-4" /> Edit Profile
              </a>
            </div>
          </div>

          {/* Details */}
          <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-maroon-900 border-b border-gray-100 pb-2">
                Personal Information
              </h3>
              
              <div className="space-y-4 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 font-semibold">Gender</span>
                  <span className="font-bold text-gray-900 capitalize">{profile?.gender || "Not specified"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 font-semibold">Date of Birth</span>
                  <span className="font-bold text-gray-900">{profile?.date_of_birth || "Not specified"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 font-semibold">Location</span>
                  <span className="font-bold text-gray-900">{profile?.location_city || "Not specified"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 font-semibold">Mother Tongue</span>
                  <span className="font-bold text-gray-900">{profile?.mother_tongue || "Not specified"}</span>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-lg font-bold text-maroon-900 border-b border-gray-100 pb-2">
                Astrology & Community
              </h3>
              
              <div className="space-y-4 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 font-semibold">Religion</span>
                  <span className="font-bold text-gray-900">{profile?.religion || "Not specified"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 font-semibold">Caste / Community</span>
                  <span className="font-bold text-gray-900">{profile?.caste || "Not specified"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 font-semibold">Rasi</span>
                  <span className="font-bold text-gray-900">{profile?.rasi || "Not specified"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 font-semibold">Nakshatra</span>
                  <span className="font-bold text-gray-900">{profile?.nakshatra || "Not specified"}</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-6 md:col-span-2">
              <h3 className="text-lg font-bold text-maroon-900 border-b border-gray-100 pb-2">
                Education & Career
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 font-semibold">Education</span>
                  <span className="font-bold text-gray-900">{profile?.education || "Not specified"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 font-semibold">Profession</span>
                  <span className="font-bold text-gray-900">{profile?.profession || "Not specified"}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
