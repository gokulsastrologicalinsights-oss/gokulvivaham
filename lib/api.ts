import { createClient } from '@/utils/supabase/client';
import { Profile } from './data';
import { Database } from '../types/database.types';

const supabase = createClient();

type ProfileRow = Database['public']['Tables']['profiles']['Row'];
type GalleryRow = Database['public']['Tables']['galleries']['Row'];

// Helper to calculate height from cm to feet/inches
function formatHeight(cm: number | null): string {
  if (!cm) return "Not specified";
  const inches = Math.round(cm / 2.54);
  const feet = Math.floor(inches / 12);
  const remainingInches = inches % 12;
  return `${feet}' ${remainingInches}"`;
}

function calculateAge(dob: string | null): number {
  if (!dob) return 0;
  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

export function mapProfileRowToProfile(p: any, prefs: any = {}): Profile {
  return {
    id: p.id,
    name: `${p.first_name || ''} ${p.last_name || ''}`.trim() || 'Unknown User',
    gender: (p.gender === 'Male' ? 'Male' : 'Female') as "Male" | "Female",
    age: calculateAge(p.date_of_birth),
    location: `${p.location_city || ''}, ${p.location_state || ''}`.replace(/^, | ,$/, '').trim() || 'Location not specified',
    religion: p.religion || 'Hindu',
    caste: p.caste || 'Not specified',
    motherTongue: p.mother_tongue || 'Tamil',
    maritalStatus: p.marital_status || 'Never Married',
    height: formatHeight(p.height),
    weight: p.weight ? `${p.weight} kg` : 'Not specified',
    education: p.education || 'Not specified',
    degree: p.education || 'Not specified',
    institution: 'Not specified',
    profession: p.profession || 'Not specified',
    occupation: p.profession || 'Not specified',
    annualIncome: p.annual_income ? `₹${p.annual_income}` : 'Not specified',
    rasi: p.rasi || 'Not specified',
    nakshatra: p.nakshatra || 'Not specified',
    lagnam: p.lagnam || 'Not specified',
    gothram: p.gothram || 'Not specified',
    patham: 0,
    doshams: p.doshams || ['None'],
    rasiChart: ["", "", "", "", "", "", "", "", "", "", "", ""],
    aboutMe: p.about_me || '',
    familyDetails: {
      fatherName: 'Not specified',
      fatherOccupation: 'Not specified',
      motherName: 'Not specified',
      motherOccupation: 'Not specified',
      siblings: 'Not specified',
      familyValues: "Moderate" as "Moderate" | "Orthodox" | "Traditional" | "Liberal",
      familyStatus: "Middle Class" as "Middle Class" | "Upper Middle Class" | "Rich",
    },
    expectations: {
      ageRange: prefs.age_min && prefs.age_max ? `${prefs.age_min} - ${prefs.age_max} years` : "Not specified",
      heightRange: "Not specified",
      education: prefs.education_pref?.join(', ') || "Not specified",
      profession: prefs.occupation_pref?.join(', ') || "Not specified",
      location: prefs.location_state_pref?.join(', ') || "Not specified",
      rasi: "Not specified",
    },
    images: p.galleries && p.galleries.length > 0 
      ? (p.galleries as { image_url: string }[]).map((img: any) => img.image_url) 
      : ["https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=600&auto=format&fit=crop"],
    verified: !!p.is_verified,
    premium: !!p.is_premium,
  };
}

export async function getProfiles(page: number = 1, limit: number = 20): Promise<{ profiles: Profile[], count: number }> {
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const { data: profiles, count, error } = await supabase
    .from('profiles')
    .select(`
      *,
      galleries ( image_url )
    `, { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, to);

  if (error || !profiles) {
    console.error("Error fetching profiles:", error);
    return { profiles: [], count: 0 };
  }

  return { profiles: profiles.map((p) => mapProfileRowToProfile(p)), count: count || 0 };
}



export async function getSuccessStories() {
  const { data, error } = await supabase
    .from('success_stories')
    .select(`*`);

  if (error || !data) return [];
  
  return data.map((story) => ({
    id: story.id,
    bride: story.bride_name,
    groom: story.groom_name,
    location: story.location,
    date: story.marriage_date || "Unknown Date",
    story: story.story || "",
    brideImage: story.image_url || "https://api.dicebear.com/7.x/avataaars/svg?seed=bride&backgroundColor=ffd5dc",
    groomImage: story.image_url || "https://api.dicebear.com/7.x/avataaars/svg?seed=groom&backgroundColor=b6e3f4",
    rating: story.rating || 5,
  }));
}

export async function getMembershipPlans() {
  const { data, error } = await supabase
    .from('membership_plans')
    .select('*')
    .order('price', { ascending: true });

  if (error || !data) return [];

  return data.map((plan) => ({
    id: plan.id,
    name: plan.name,
    nameInTamil: plan.name_in_tamil || plan.name,
    price: plan.price,
    duration: plan.duration_months ? `${plan.duration_months} months` : 'N/A',
    color: plan.color_theme || 'gold',
    features: plan.features || [],
    notIncluded: plan.not_included || [],
    popular: !!plan.is_popular,
  }));
}

export async function getProfileById(userId: string): Promise<Profile | null> {
  const { data: p, error } = await supabase
    .from('profiles')
    .select(`
      *,
      partner_preferences(*),
      galleries ( image_url )
    `)
    .eq('id', userId)
    .single();

  if (error || !p) {
    console.error("Error fetching profile by ID:", error);
    return null;
  }

  const prefs = (Array.isArray(p.partner_preferences) ? p.partner_preferences[0] : p.partner_preferences) || {} as any;

  return mapProfileRowToProfile(p, prefs);
}

export async function uploadProfilePhoto(userId: string, file: File): Promise<string | null> {
  const fileExt = file.name.split('.').pop();
  const fileName = `${userId}-${Math.random()}.${fileExt}`;
  const filePath = `${userId}/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from('galleries')
    .upload(filePath, file);

  if (uploadError) {
    console.error("Error uploading photo:", uploadError);
    return null;
  }

  const { data } = supabase.storage
    .from('galleries')
    .getPublicUrl(filePath);

  if (data?.publicUrl) {
    // Insert into galleries table
    await supabase.from('galleries').insert({
      profile_id: userId,
      image_url: data.publicUrl,
      is_primary: false,
      status: 'approved'
    });
    return data.publicUrl;
  }
  return null;
}

export async function createProfile(userId: string, data: any) {
  // Map form data to database fields
  const names = data.fullName.split(' ');
  const firstName = names[0] || '';
  const lastName = names.slice(1).join(' ') || '';

  let heightInCm = null;
  if (data.height) {
     const match = data.height.match(/(\d+)ft\s*(\d+)in/);
     if (match) heightInCm = (parseInt(match[1]) * 12 + parseInt(match[2])) * 2.54;
     else heightInCm = parseFloat(data.height);
  }

  let weightInKg = null;
  if (data.weight) {
      const wMatch = data.weight.match(/(\d+)/);
      if (wMatch) weightInKg = parseFloat(wMatch[1]);
  }

  const profileRow = {
    id: userId,
    first_name: firstName,
    last_name: lastName,
    gender: data.gender,
    date_of_birth: data.dob || null,
    marital_status: data.maritalStatus,
    height: heightInCm,
    weight: weightInKg,
    mother_tongue: data.motherTongue,
    religion: data.religion,
    caste: data.caste,
    rasi: data.rasi,
    nakshatra: data.nakshatra,
    lagnam: data.lagnam,
    gothram: data.gothram,
    education: data.degree || data.educationLevel,
    profession: data.occupation || data.professionType,
    annual_income: data.annualIncome,
    location_city: data.workLocation,
    about_me: data.aboutMe,
    status: 'active'
  };

  const { error: profileError } = await supabase
    .from('profiles')
    .upsert(profileRow);

  if (profileError) {
    console.error("Error creating profile:", profileError);
    throw profileError;
  }

  const prefsRow = {
    profile_id: userId,
    age_min: parseInt(data.partnerAgeMin) || null,
    age_max: parseInt(data.partnerAgeMax) || null,
    education_pref: data.partnerEducation ? [data.partnerEducation] : [],
    occupation_pref: data.partnerProfession ? [data.partnerProfession] : [],
    location_state_pref: data.partnerLocation ? [data.partnerLocation] : []
  };

  const { error: prefsError } = await supabase
    .from('partner_preferences')
    .upsert(prefsRow, { onConflict: 'profile_id' });

  if (prefsError) {
    console.error("Error creating preferences:", prefsError);
  }
}

export async function updateProfile(userId: string, data: any) {
  // Reuse the mapping logic
  return createProfile(userId, data);
}

export function calculateProfileCompletion(profile: any): number {
  if (!profile) return 0;
  
  let filled = 0;
  let total = 0;
  
  const fieldsToCheck = [
    'first_name', 'gender', 'date_of_birth', 'marital_status', 
    'height', 'mother_tongue', 'religion', 'caste', 
    'education', 'profession', 'location_city', 'about_me'
  ];

  fieldsToCheck.forEach(field => {
    total++;
    if (profile[field] && profile[field] !== 'Not specified' && profile[field] !== '') {
      filled++;
    }
  });

  return Math.round((filled / total) * 100);
}

export interface SearchFilters {
  gender?: string;
  ageMin?: number;
  ageMax?: number;
  heightMin?: number; // in cm
  heightMax?: number; // in cm
  religion?: string;
  caste?: string;
  education?: string;
  profession?: string;
  location?: string;
  rasis?: string[];
  nakshatras?: string[];
  doshams?: string[];
  maritalStatus?: string;
  verifiedOnly?: boolean;
  premiumOnly?: boolean;
  searchQuery?: string;
}

export async function searchProfiles(
  filters: SearchFilters,
  page: number = 1,
  pageSize: number = 10
): Promise<{ profiles: Profile[]; totalCount: number }> {
  let query = supabase
    .from('profiles')
    .select(`*, galleries ( image_url )`, { count: 'exact' });

  // Exclude suspended/deleted if status exists
  query = query.eq('status', 'active');

  // Apply filters
  if (filters.gender) query = query.eq('gender', filters.gender);
  
  if (filters.ageMin || filters.ageMax) {
    const today = new Date();
    if (filters.ageMin) {
      const maxDate = new Date(today.getFullYear() - filters.ageMin, today.getMonth(), today.getDate());
      query = query.lte('date_of_birth', maxDate.toISOString().split('T')[0]);
    }
    if (filters.ageMax) {
      const minDate = new Date(today.getFullYear() - filters.ageMax - 1, today.getMonth(), today.getDate() + 1);
      query = query.gte('date_of_birth', minDate.toISOString().split('T')[0]);
    }
  }

  if (filters.heightMin) query = query.gte('height', filters.heightMin);
  if (filters.heightMax) query = query.lte('height', filters.heightMax);

  if (filters.religion) query = query.eq('religion', filters.religion);
  if (filters.caste) query = query.eq('caste', filters.caste);
  if (filters.education) query = query.ilike('education', `%${filters.education}%`);
  if (filters.profession) query = query.ilike('profession', `%${filters.profession}%`);
  
  if (filters.location) {
    const parts = filters.location.split(',').map(s => s.trim());
    if (parts.length > 0) {
      query = query.ilike('location_city', `%${parts[0]}%`);
    }
  }

  if (filters.rasis && filters.rasis.length > 0) {
    query = query.in('rasi', filters.rasis);
  }
  
  if (filters.nakshatras && filters.nakshatras.length > 0) {
    query = query.in('nakshatra', filters.nakshatras);
  }

  if (filters.doshams && filters.doshams.length > 0) {
    query = query.contains('doshams', filters.doshams);
  }

  if (filters.maritalStatus) query = query.eq('marital_status', filters.maritalStatus);

  if (filters.verifiedOnly) query = query.eq('is_verified', true);
  if (filters.premiumOnly) query = query.eq('is_premium', true);

  if (filters.searchQuery) {
    query = query.or(`first_name.ilike.%${filters.searchQuery}%,last_name.ilike.%${filters.searchQuery}%,education.ilike.%${filters.searchQuery}%,profession.ilike.%${filters.searchQuery}%`);
  }

  // Pagination
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  
  const { data: profiles, count, error } = await query
    .order('created_at', { ascending: false })
    .range(from, to);

  if (error || !profiles) {
    console.error("Error searching profiles:", error);
    return { profiles: [], totalCount: 0 };
  }

  const mappedProfiles = profiles.map((p) => mapProfileRowToProfile(p));

  return { profiles: mappedProfiles, totalCount: count || 0 };
}

export interface InterestRecord {
  id: string;
  status: string;
  created_at: string;
  updated_at: string;
  sender_id: string;
  receiver_id: string;
  profile: Profile;
}

export async function sendInterest(senderId: string, receiverId: string) {
  const { data, error } = await supabase
    .from('interests')
    .insert({ sender_id: senderId, receiver_id: receiverId, status: 'pending' })
    .select()
    .single();
  if (error) {
    console.error("Error sending interest:", error);
    return null;
  }
  return data;
}

export async function acceptInterest(interestId: string) {
  const { data, error } = await supabase
    .from('interests')
    .update({ status: 'accepted', updated_at: new Date().toISOString() })
    .eq('id', interestId)
    .select()
    .single();
  if (error) {
    console.error("Error accepting interest:", error);
    return null;
  }
  return data;
}

export async function declineInterest(interestId: string) {
  const { data, error } = await supabase
    .from('interests')
    .update({ status: 'declined', updated_at: new Date().toISOString() })
    .eq('id', interestId)
    .select()
    .single();
  if (error) {
    console.error("Error declining interest:", error);
    return null;
  }
  return data;
}

export async function cancelInterest(interestId: string) {
  const { error } = await supabase
    .from('interests')
    .delete()
    .eq('id', interestId);
  if (error) {
    console.error("Error canceling interest:", error);
    return false;
  }
  return true;
}

export async function getReceivedInterests(userId: string, status?: string, page: number = 1, limit: number = 20): Promise<{ interests: InterestRecord[], count: number }> {
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let query = supabase
    .from('interests')
    .select(`
      *,
      sender:profiles!sender_id (
        *,
        galleries ( image_url )
      )
    `, { count: 'exact' })
    .eq('receiver_id', userId)
    .order('created_at', { ascending: false });
    
  if (status) {
    query = query.eq('status', status);
  }

  const { data, count, error } = await query.range(from, to);
  if (error || !data) {
    console.error("Error fetching received interests:", error);
    return { interests: [], count: 0 };
  }

  const mapped = data.map((interest: any) => ({
    id: interest.id,
    status: interest.status,
    created_at: interest.created_at,
    updated_at: interest.updated_at,
    sender_id: interest.sender_id,
    receiver_id: interest.receiver_id,
    profile: mapProfileRowToProfile(interest.sender),
  }));

  return { interests: mapped, count: count || 0 };
}

export async function getSentInterests(userId: string, status?: string): Promise<InterestRecord[]> {
  let query = supabase
    .from('interests')
    .select(`
      *,
      receiver:profiles!receiver_id (
        *,
        galleries ( image_url )
      )
    `)
    .eq('sender_id', userId)
    .order('created_at', { ascending: false });

  if (status) {
    query = query.eq('status', status);
  }

  const { data, error } = await query;
  if (error || !data) {
    console.error("Error fetching sent interests:", error);
    return [];
  }

  return data.map((interest: any) => ({
    id: interest.id,
    status: interest.status,
    created_at: interest.created_at,
    updated_at: interest.updated_at,
    sender_id: interest.sender_id,
    receiver_id: interest.receiver_id,
    profile: mapProfileRowToProfile(interest.receiver),
  }));
}

export async function checkInterestStatus(userId1: string, userId2: string) {
  const { data, error } = await supabase
    .from('interests')
    .select('*')
    .or(`and(sender_id.eq.${userId1},receiver_id.eq.${userId2}),and(sender_id.eq.${userId2},receiver_id.eq.${userId1})`)
    .maybeSingle();

  if (error) {
    console.error("Error checking interest status:", error);
  }
  return data;
}

// ==========================================
// CHAT API FUNCTIONS
// ==========================================

export async function getChats(userId: string) {
  const { data, error } = await supabase
    .from('chats')
    .select(`
      *,
      participant1:profiles!participant1_id(*, galleries(image_url)),
      participant2:profiles!participant2_id(*, galleries(image_url)),
      messages(content, is_read, created_at, sender_id)
    `)
    .or(`participant1_id.eq.${userId},participant2_id.eq.${userId}`)
    .order('updated_at', { ascending: false });

  if (error) {
    console.error("Error fetching chats:", error);
    return [];
  }

  // Map chats to include the "other user" profile and latest message
  return data.map(chat => {
    const otherParticipant = chat.participant1_id === userId ? chat.participant1 : chat.participant2;
    const latestMessage = chat.messages && chat.messages.length > 0 
      ? chat.messages.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0]
      : null;
      
    // Count unread messages
    const unreadCount = chat.messages?.filter((m: any) => m.sender_id !== userId && !m.is_read).length || 0;

    return {
      ...chat,
      otherParticipant: mapProfileRowToProfile(otherParticipant),
      latestMessage,
      unreadCount
    };
  });
}

export async function getMessages(chatId: string) {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('chat_id', chatId)
    .order('created_at', { ascending: true });

  if (error) {
    console.error("Error fetching messages:", error);
    return [];
  }
  return data;
}

export async function sendMessage(chatId: string, senderId: string, content: string, imageUrl: string | null = null) {
  const { data, error } = await supabase
    .from('messages')
    .insert({ chat_id: chatId, sender_id: senderId, content, image_url: imageUrl })
    .select()
    .single();

  if (error) {
    console.error("Error sending message:", error);
    return null;
  }
  
  // Update chat updated_at
  await supabase.from('chats').update({ updated_at: new Date().toISOString() }).eq('id', chatId);

  return data;
}

export async function markMessagesAsRead(chatId: string, userId: string) {
  const { error } = await supabase
    .from('messages')
    .update({ is_read: true })
    .eq('chat_id', chatId)
    .neq('sender_id', userId)
    .eq('is_read', false);

  if (error) {
    console.error("Error marking messages as read:", error);
  }
}

export async function uploadChatImage(chatId: string, file: File): Promise<string | null> {
  const fileExt = file.name.split('.').pop();
  const fileName = `${chatId}-${Math.random()}.${fileExt}`;
  
  const { error: uploadError } = await supabase.storage
    .from('chat-images')
    .upload(fileName, file);

  if (uploadError) {
    console.error("Error uploading chat image:", uploadError);
    return null;
  }

  const { data } = supabase.storage
    .from('chat-images')
    .getPublicUrl(fileName);

  return data?.publicUrl || null;
}

export async function blockChat(chatId: string, blockedById: string) {
  const { error } = await supabase
    .from('chats')
    .update({ status: 'blocked', blocked_by_id: blockedById })
    .eq('id', chatId);
    
  if (error) {
    console.error("Error blocking chat:", error);
    return false;
  }
  return true;
}

export async function unblockChat(chatId: string) {
  const { error } = await supabase
    .from('chats')
    .update({ status: 'active', blocked_by_id: null })
    .eq('id', chatId);
    
  if (error) {
    console.error("Error unblocking chat:", error);
    return false;
  }
  return true;
}

export async function getOrCreateChat(userId1: string, userId2: string) {
  // Try to find existing chat
  const { data: existingChat, error: fetchError } = await supabase
    .from('chats')
    .select('*')
    .or(`and(participant1_id.eq.${userId1},participant2_id.eq.${userId2}),and(participant1_id.eq.${userId2},participant2_id.eq.${userId1})`)
    .maybeSingle();

  if (existingChat) return existingChat;

  // Ensure consistent ordering to avoid duplicates
  const p1 = userId1 < userId2 ? userId1 : userId2;
  const p2 = userId1 < userId2 ? userId2 : userId1;

  const { data: newChat, error: createError } = await supabase
    .from('chats')
    .insert({ participant1_id: p1, participant2_id: p2, status: 'active' })
    .select()
    .single();

  if (createError) {
    console.error("Error creating chat:", createError);
    return null;
  }

  return newChat;
}
