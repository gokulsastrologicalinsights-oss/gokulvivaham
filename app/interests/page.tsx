"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { getReceivedInterests, getSentInterests, acceptInterest, declineInterest, cancelInterest, InterestRecord } from "@/lib/api";
import { createClient } from "@/utils/supabase/client";
import { Heart, CheckCircle2, XCircle, Clock, Trash2 } from "lucide-react";

export default function InterestsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"received" | "sent" | "history">("received");
  
  const [receivedInterests, setReceivedInterests] = useState<InterestRecord[]>([]);
  const [sentInterests, setSentInterests] = useState<InterestRecord[]>([]);
  const [historyInterests, setHistoryInterests] = useState<InterestRecord[]>([]);
  
  const [user, setUser] = useState<any>(null);
  
  const queryClient = useQueryClient();
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        setUser(data.user);
      }
    });
  }, [supabase]);

  const { data: receivedData, isLoading: isLoadingReceived } = useQuery({
    queryKey: ['interests', 'received', user?.id],
    queryFn: () => getReceivedInterests(user!.id, undefined, 1, 50),
    enabled: !!user?.id
  });

  const { data: sentData, isLoading: isLoadingSent } = useQuery({
    queryKey: ['interests', 'sent', user?.id],
    queryFn: () => getSentInterests(user!.id),
    enabled: !!user?.id
  });

  const isLoading = isLoadingReceived || isLoadingSent;

  useEffect(() => {
    if (receivedData?.interests && sentData) {
      const received = receivedData.interests;
      const sent = sentData;
      
      setReceivedInterests(received.filter(i => i.status === 'pending'));
      setSentInterests(sent.filter(i => i.status === 'pending'));
      
      const history1 = received.filter(i => i.status !== 'pending');
      const history2 = sent.filter(i => i.status !== 'pending');
      
      setHistoryInterests([...history1, ...history2].sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()));
    }
  }, [receivedData, sentData]);

  const handleAccept = async (id: string) => {
    await acceptInterest(id);
    if (user) queryClient.invalidateQueries({ queryKey: ['interests', 'received', user.id] });
  };

  const handleDecline = async (id: string) => {
    await declineInterest(id);
    if (user) queryClient.invalidateQueries({ queryKey: ['interests', 'received', user.id] });
  };

  const handleCancel = async (id: string) => {
    await cancelInterest(id);
    if (user) queryClient.invalidateQueries({ queryKey: ['interests', 'sent', user.id] });
  };

  return (
    <main className="flex flex-col min-h-screen bg-ivory-100">
      <Navbar />
      <div className="h-20" />
      
      <div className="flex-1 section-padding py-10">
        <div className="max-w-4xl mx-auto space-y-8">
          
          <div className="bg-white rounded-3xl border border-gold-300/20 shadow-lg p-6 relative">
            <h1 className="text-2xl font-bold text-maroon-900 font-serif mb-6 flex items-center gap-2">
              <Heart className="w-6 h-6 text-gold-500" />
              Manage Interests
            </h1>
            
            {/* Tabs */}
            <div className="flex border-b border-gray-200 mb-6 gap-6">
              <button
                className={`pb-3 text-sm font-bold transition-all ${activeTab === 'received' ? 'text-maroon-900 border-b-2 border-maroon-900' : 'text-gray-500 hover:text-maroon-700'}`}
                onClick={() => setActiveTab('received')}
              >
                Received ({receivedInterests.length})
              </button>
              <button
                className={`pb-3 text-sm font-bold transition-all ${activeTab === 'sent' ? 'text-maroon-900 border-b-2 border-maroon-900' : 'text-gray-500 hover:text-maroon-700'}`}
                onClick={() => setActiveTab('sent')}
              >
                Sent ({sentInterests.length})
              </button>
              <button
                className={`pb-3 text-sm font-bold transition-all ${activeTab === 'history' ? 'text-maroon-900 border-b-2 border-maroon-900' : 'text-gray-500 hover:text-maroon-700'}`}
                onClick={() => setActiveTab('history')}
              >
                History ({historyInterests.length})
              </button>
            </div>

            {/* List */}
            {isLoading ? (
              <div className="py-10 text-center text-gray-500">Loading...</div>
            ) : (
              <div className="space-y-4">
                {activeTab === 'received' && receivedInterests.length === 0 && (
                  <div className="text-center py-8 text-gray-500">No pending received interests.</div>
                )}
                {activeTab === 'sent' && sentInterests.length === 0 && (
                  <div className="text-center py-8 text-gray-500">No pending sent interests.</div>
                )}
                {activeTab === 'history' && historyInterests.length === 0 && (
                  <div className="text-center py-8 text-gray-500">No interest history.</div>
                )}

                {(activeTab === 'received' ? receivedInterests : activeTab === 'sent' ? sentInterests : historyInterests).map((interest) => (
                  <div
                    key={interest.id}
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl border border-gold-300/10 hover:border-gold-300/30 transition-all bg-gradient-to-r from-ivory-50/30 to-ivory-100/10"
                  >
                    <div
                      className="flex items-center gap-4 cursor-pointer flex-1"
                      onClick={() => router.push(`/profile/${interest.profile.id}`)}
                    >
                      <div className="relative w-14 h-14 rounded-full overflow-hidden border border-gold-300/80 bg-white p-0.5 flex-shrink-0">
                        <Image
                          src={interest.profile.images[0]}
                          alt={interest.profile.name}
                          fill
                          className="object-cover rounded-full"
                        />
                      </div>
                      <div>
                        <h3 className="font-bold text-maroon-900 text-sm font-serif">
                          {interest.profile.name}
                        </h3>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {interest.profile.age} Yrs • {interest.profile.location}
                        </p>
                        {activeTab === 'history' && (
                          <p className={`text-[10px] font-bold mt-1 uppercase tracking-wider ${interest.status === 'accepted' ? 'text-green-600' : 'text-gray-500'}`}>
                            {interest.status} • {new Date(interest.updated_at).toLocaleDateString()}
                          </p>
                        )}
                        {activeTab !== 'history' && (
                           <p className="text-[10px] text-gray-400 mt-1">
                             {new Date(interest.created_at).toLocaleDateString()}
                           </p>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      {activeTab === 'received' && (
                        <>
                          <button
                            onClick={() => handleDecline(interest.id)}
                            className="px-4 py-2 text-xs font-semibold text-gray-500 bg-white border border-gray-200 hover:bg-gray-50 rounded-xl transition-all"
                          >
                            Decline
                          </button>
                          <button
                            onClick={() => handleAccept(interest.id)}
                            className="px-4 py-2 text-xs font-extrabold text-white bg-gradient-to-r from-maroon-900 to-maroon-800 hover:from-maroon-800 hover:to-maroon-700 rounded-xl transition-all shadow-md border border-gold-400/20"
                          >
                            Accept
                          </button>
                        </>
                      )}
                      
                      {activeTab === 'sent' && (
                        <button
                          onClick={() => handleCancel(interest.id)}
                          className="px-4 py-2 text-xs font-semibold text-red-500 bg-white border border-red-200 hover:bg-red-50 rounded-xl transition-all"
                        >
                          Cancel
                        </button>
                      )}
                      
                      {activeTab === 'history' && interest.status === 'accepted' && (
                        <div className="flex items-center gap-1.5 text-xs text-green-700 bg-green-50 px-3 py-1.5 rounded-lg border border-green-200 font-bold">
                           <CheckCircle2 className="w-4 h-4" /> Accepted
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
      
      <Footer />
    </main>
  );
}
