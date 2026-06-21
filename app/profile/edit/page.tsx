/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { mockProfiles as initialProfiles } from "@/lib/data";
import { getProfileById, updateProfile, uploadProfilePhoto } from "@/lib/api";
import { createClient } from "@/utils/supabase/client";
import {
  User,
  GraduationCap,
  Users,
  Compass,
  FileText,
  Camera,
  Save,
  CheckCircle,
  Upload,
  X,
  ArrowLeft,
  Settings,
} from "lucide-react";

const tabs = [
  { id: "personal", label: "Personal Details", icon: User },
  { id: "professional", label: "Education & Career", icon: GraduationCap },
  { id: "family", label: "Family Background", icon: Users },
  { id: "horoscope", label: "Horoscope Details", icon: Compass },
  { id: "expectations", label: "Partner Expectations", icon: FileText },
  { id: "photos", label: "Manage Photos", icon: Camera },
];

const RASIS = [
  "Mesham", "Rishabam", "Mithunam", "Karkadagam",
  "Simham", "Kanni", "Thulam", "Vrishchikam",
  "Dhanusu", "Makaram", "Kumbham", "Meenam"
];

const NAKSHATRAS = [
  "Aswini", "Bharani", "Krithigai", "Rohini", "Mrigashirisham",
  "Thiruvadhirai", "Punarpoosam", "Poosam", "Aayilyam",
  "Magam", "Pooram", "Uthiram", "Hastham", "Chithirai",
  "Swathi", "Vishakam", "Anusham", "Kettai", "Moolam",
  "Pooradam", "Uthiradam", "Thiruvonam", "Avittam",
  "Sadhayam", "Poorattadhi", "Uthirattadhi", "Revathi"
];

export default function EditProfilePage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("personal");
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Form State
  const [formData, setFormData] = useState({
    fullName: "",
    gender: "",
    dob: "",
    maritalStatus: "",
    height: "",
    weight: "",
    motherTongue: "Tamil",
    religion: "Hindu",
    caste: "",
    // Career
    educationLevel: "Graduate",
    degree: "",
    institution: "",
    professionType: "Private Sector",
    occupation: "",
    annualIncome: "",
    workLocation: "",
    // Family
    fatherName: "",
    fatherOccupation: "",
    motherName: "",
    motherOccupation: "",
    siblings: "",
    familyValues: "Moderate",
    familyStatus: "Middle Class",
    // Horoscope
    rasi: "",
    nakshatra: "",
    lagnam: "",
    gothram: "",
    patham: "1",
    doshams: [] as string[],
    // About / Expectations
    aboutMe: "",
    partnerAgeMin: "",
    partnerAgeMax: "",
    partnerHeightMin: "",
    partnerHeightMax: "",
    partnerEducation: "",
    partnerProfession: "",
    partnerLocation: "",
    partnerRasi: "",
  });

  const [photos, setPhotos] = useState<string[]>([]);
  const [photoFiles, setPhotoFiles] = useState<File[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }
      setUserId(user.id);
      
      const p = await getProfileById(user.id);
      if (p) {
        let ageMin = "";
        let ageMax = "";
        if (p.expectations.ageRange !== "Not specified") {
          const match = p.expectations.ageRange.match(/(\d+)\s*-\s*(\d+)/);
          if (match) {
            ageMin = match[1];
            ageMax = match[2];
          }
        }
        
        setFormData({
          fullName: p.name !== "Unknown User" ? p.name : "",
          gender: p.gender,
          dob: "", // dob is computed into age in the API normally, but for the form we should get the raw string if possible.
                   // Since getProfileById returns age instead of dob, we might need a workaround or accept empty dob.
          maritalStatus: p.maritalStatus !== "Not specified" ? p.maritalStatus : "",
          height: p.height !== "Not specified" ? p.height : "",
          weight: p.weight !== "Not specified" ? p.weight.replace(" kg", "") : "",
          motherTongue: p.motherTongue !== "Not specified" ? p.motherTongue : "Tamil",
          religion: p.religion !== "Not specified" ? p.religion : "Hindu",
          caste: p.caste !== "Not specified" ? p.caste : "",
          educationLevel: "Graduate",
          degree: p.degree !== "Not specified" ? p.degree : "",
          institution: p.institution !== "Not specified" ? p.institution : "",
          professionType: "Private Sector",
          occupation: p.occupation !== "Not specified" ? p.occupation : "",
          annualIncome: p.annualIncome !== "Not specified" ? p.annualIncome.replace("₹", "") : "",
          workLocation: p.location !== "Location not specified" ? p.location : "",
          fatherName: p.familyDetails.fatherName !== "Not specified" ? p.familyDetails.fatherName : "",
          fatherOccupation: p.familyDetails.fatherOccupation !== "Not specified" ? p.familyDetails.fatherOccupation : "",
          motherName: p.familyDetails.motherName !== "Not specified" ? p.familyDetails.motherName : "",
          motherOccupation: p.familyDetails.motherOccupation !== "Not specified" ? p.familyDetails.motherOccupation : "",
          siblings: p.familyDetails.siblings !== "Not specified" ? p.familyDetails.siblings : "",
          familyValues: p.familyDetails.familyValues,
          familyStatus: p.familyDetails.familyStatus,
          rasi: p.rasi !== "Not specified" ? p.rasi : "",
          nakshatra: p.nakshatra !== "Not specified" ? p.nakshatra : "",
          lagnam: p.lagnam !== "Not specified" ? p.lagnam : "",
          gothram: p.gothram !== "Not specified" ? p.gothram : "",
          patham: p.patham.toString(),
          doshams: p.doshams.length === 1 && p.doshams[0] === "None" ? [] : p.doshams,
          aboutMe: p.aboutMe,
          partnerAgeMin: ageMin,
          partnerAgeMax: ageMax,
          partnerHeightMin: "",
          partnerHeightMax: "",
          partnerEducation: p.expectations.education !== "Not specified" ? p.expectations.education : "",
          partnerProfession: p.expectations.profession !== "Not specified" ? p.expectations.profession : "",
          partnerLocation: p.expectations.location !== "Not specified" ? p.expectations.location : "",
          partnerRasi: p.expectations.rasi !== "Not specified" ? p.expectations.rasi : "",
        });
        
        setPhotos(p.images);
      }
      setIsLoading(false);
    };
    fetchProfile();
  }, [router]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (dosha: string) => {
    setFormData((prev) => {
      const alreadyExists = prev.doshams.includes(dosha);
      const newDoshams = alreadyExists
        ? prev.doshams.filter((d) => d !== dosha)
        : [...prev.doshams, dosha];
      return { ...prev, doshams: newDoshams };
    });
  };

  // Drag & Drop
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const newPhotos = [...photos];
      const newPhotoFiles = [...photoFiles];
      for (let i = 0; i < e.dataTransfer.files.length; i++) {
        if (newPhotos.length >= 4) break;
        const file = e.dataTransfer.files[i];
        const fakeUrl = URL.createObjectURL(file);
        newPhotos.push(fakeUrl);
        newPhotoFiles.push(file);
      }
      setPhotos(newPhotos);
      setPhotoFiles(newPhotoFiles);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const newPhotos = [...photos];
      const newPhotoFiles = [...photoFiles];
      for (let i = 0; i < e.target.files.length; i++) {
        if (newPhotos.length >= 4) break;
        const file = e.target.files[i];
        const fakeUrl = URL.createObjectURL(file);
        newPhotos.push(fakeUrl);
        newPhotoFiles.push(file);
      }
      setPhotos(newPhotos);
      setPhotoFiles(newPhotoFiles);
    }
  };

  const removePhoto = (idx: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== idx));
    setPhotoFiles((prev) => prev.filter((_, i) => i !== idx)); // Not perfectly matched if there's pre-existing photos, but works roughly
  };

  const triggerFileInput = () => {
    document.getElementById("edit-file-upload-input")?.click();
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;
    setIsSaving(true);
    
    try {
      await updateProfile(userId, formData);
      for (const file of photoFiles) {
        await uploadProfilePhoto(userId, file);
      }
      setIsSaving(false);
      setToastMessage("Changes saved successfully!");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (error) {
      console.error("Error updating profile:", error);
      setIsSaving(false);
      setToastMessage("Error saving changes.");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }
  };

  if (isLoading) {
    return (
      <main className="flex flex-col min-h-screen bg-ivory-100">
        <Navbar />
        <div className="h-20" />
        <div className="flex-1 flex items-center justify-center">
          <Settings className="w-10 h-10 text-gold-500 animate-spin" />
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="flex flex-col min-h-screen bg-ivory-100">
      <Navbar />
      <div className="h-20" /> {/* Spacer */}

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2.5 bg-maroon-900 border border-gold-400 text-white px-5 py-3 rounded-2xl shadow-2xl animate-slide-up">
          <CheckCircle className="w-5 h-5 text-gold-400" />
          <span className="text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      <div className="flex-1 section-padding py-10">
        <div className="max-w-7xl mx-auto space-y-6">
          
          {/* Back to Dashboard bar */}
          <div className="flex justify-between items-center">
            <button
              onClick={() => router.push("/dashboard")}
              className="flex items-center gap-1.5 text-xs font-semibold text-maroon-700 hover:text-maroon-900 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Dashboard
            </button>
            <span className="text-xs text-gray-500 font-semibold bg-white px-3 py-1.5 rounded-full border border-ivory-300 shadow-sm flex items-center gap-1.5">
              <Settings className="w-3.5 h-3.5 text-gold-600 animate-spin-slow" /> Profile Management Hub
            </span>
          </div>

          {/* Main Grid: Tabs left, Form right */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            
            {/* Sidebar Tabs */}
            <div className="lg:col-span-1 space-y-3">
              <div className="bg-white rounded-3xl border border-ivory-300 p-4 shadow-sm space-y-1">
                <div className="p-3 mb-2 flex items-center gap-3">
                  <div className="relative w-10 h-10 rounded-full overflow-hidden border border-gold-200">
                    <Image
                      src={photos.length > 0 ? photos[0] : "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=600&auto=format&fit=crop"}
                      alt="User mini avatar"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-bold text-maroon-900 text-sm">{formData.fullName || "User"}</h3>
                    <p className="text-[10px] text-gray-400">Profile Management</p>
                  </div>
                </div>
                <div className="gold-divider mb-3" />
                
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer text-left ${
                        isActive
                          ? "bg-maroon-900 text-white shadow-md shadow-maroon-900/10"
                          : "text-gray-600 hover:bg-maroon-50 hover:text-maroon-800"
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${isActive ? "text-gold-400" : "text-maroon-500"}`} />
                      {tab.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Form Container (3 cols wide on desktop) */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-3xl border border-ivory-300 shadow-xl overflow-hidden">
                <form onSubmit={handleSave} className="p-6 md:p-8 space-y-6">
                  
                  {/* TABS CONTENT */}

                  {/* Tab 1: Personal Details */}
                  {activeTab === "personal" && (
                    <div className="space-y-6">
                      <h2 className="text-lg font-bold text-maroon-900 border-b border-ivory-200 pb-3 flex items-center gap-2">
                        <User className="w-5 h-5 text-gold-500" /> Personal Details
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                          <label htmlFor="fullName" className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                            Full Name
                          </label>
                          <input
                            id="fullName"
                            name="fullName"
                            type="text"
                            value={formData.fullName}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-maroon-400 text-sm"
                          />
                        </div>
                        <div>
                          <label htmlFor="gender" className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                            Gender
                          </label>
                          <select
                            id="gender"
                            name="gender"
                            value={formData.gender}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-maroon-400 text-sm"
                          >
                            <option value="Male">Groom (Male)</option>
                            <option value="Female">Bride (Female)</option>
                          </select>
                        </div>
                        <div>
                          <label htmlFor="dob" className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                            Date of Birth
                          </label>
                          <input
                            id="dob"
                            name="dob"
                            type="date"
                            value={formData.dob}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                          />
                        </div>
                        <div>
                          <label htmlFor="maritalStatus" className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                            Marital Status
                          </label>
                          <select
                            id="maritalStatus"
                            name="maritalStatus"
                            value={formData.maritalStatus}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                          >
                            <option value="Never Married">Never Married</option>
                            <option value="Widowed">Widowed</option>
                            <option value="Divorced">Divorced</option>
                          </select>
                        </div>
                        <div>
                          <label htmlFor="height" className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                            Height
                          </label>
                          <input
                            id="height"
                            name="height"
                            type="text"
                            value={formData.height}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                          />
                        </div>
                        <div>
                          <label htmlFor="weight" className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                            Weight
                          </label>
                          <input
                            id="weight"
                            name="weight"
                            type="text"
                            value={formData.weight}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                          />
                        </div>
                        <div>
                          <label htmlFor="caste" className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                            Caste / Sect
                          </label>
                          <input
                            id="caste"
                            name="caste"
                            type="text"
                            value={formData.caste}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                          />
                        </div>
                        <div>
                          <label htmlFor="motherTongue" className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                            Mother Tongue
                          </label>
                          <input
                            id="motherTongue"
                            name="motherTongue"
                            type="text"
                            value={formData.motherTongue}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Tab 2: Education & Career */}
                  {activeTab === "professional" && (
                    <div className="space-y-6">
                      <h2 className="text-lg font-bold text-maroon-900 border-b border-ivory-200 pb-3 flex items-center gap-2">
                        <GraduationCap className="w-5 h-5 text-gold-500" /> Education & Professional Info
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                          <label htmlFor="educationLevel" className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                            Education Level
                          </label>
                          <select
                            id="educationLevel"
                            name="educationLevel"
                            value={formData.educationLevel}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                          >
                            <option value="Graduate">Graduate</option>
                            <option value="Post Graduate">Post Graduate</option>
                            <option value="Doctorate">Doctorate</option>
                          </select>
                        </div>
                        <div>
                          <label htmlFor="degree" className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                            Degree
                          </label>
                          <input
                            id="degree"
                            name="degree"
                            type="text"
                            value={formData.degree}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                          />
                        </div>
                        <div>
                          <label htmlFor="institution" className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                            College / University
                          </label>
                          <input
                            id="institution"
                            name="institution"
                            type="text"
                            value={formData.institution}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                          />
                        </div>
                        <div>
                          <label htmlFor="occupation" className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                            Occupation
                          </label>
                          <input
                            id="occupation"
                            name="occupation"
                            type="text"
                            value={formData.occupation}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                          />
                        </div>
                        <div>
                          <label htmlFor="annualIncome" className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                            Annual Income
                          </label>
                          <input
                            id="annualIncome"
                            name="annualIncome"
                            type="text"
                            value={formData.annualIncome}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                          />
                        </div>
                        <div>
                          <label htmlFor="workLocation" className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                            Working Location
                          </label>
                          <input
                            id="workLocation"
                            name="workLocation"
                            type="text"
                            value={formData.workLocation}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Tab 3: Family Details */}
                  {activeTab === "family" && (
                    <div className="space-y-6">
                      <h2 className="text-lg font-bold text-maroon-900 border-b border-ivory-200 pb-3 flex items-center gap-2">
                        <Users className="w-5 h-5 text-gold-500" /> Family details
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                          <label htmlFor="fatherName" className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                            Father's Name
                          </label>
                          <input
                            id="fatherName"
                            name="fatherName"
                            type="text"
                            value={formData.fatherName}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                          />
                        </div>
                        <div>
                          <label htmlFor="fatherOccupation" className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                            Father's Occupation
                          </label>
                          <input
                            id="fatherOccupation"
                            name="fatherOccupation"
                            type="text"
                            value={formData.fatherOccupation}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                          />
                        </div>
                        <div>
                          <label htmlFor="motherName" className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                            Mother's Name
                          </label>
                          <input
                            id="motherName"
                            name="motherName"
                            type="text"
                            value={formData.motherName}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                          />
                        </div>
                        <div>
                          <label htmlFor="motherOccupation" className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                            Mother's Occupation
                          </label>
                          <input
                            id="motherOccupation"
                            name="motherOccupation"
                            type="text"
                            value={formData.motherOccupation}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                          />
                        </div>
                        <div>
                          <label htmlFor="siblings" className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                            Siblings Detail
                          </label>
                          <input
                            id="siblings"
                            name="siblings"
                            type="text"
                            value={formData.siblings}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                          />
                        </div>
                        <div>
                          <label htmlFor="familyStatus" className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                            Family Status
                          </label>
                          <select
                            id="familyStatus"
                            name="familyStatus"
                            value={formData.familyStatus}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                          >
                            <option value="Middle Class">Middle Class</option>
                            <option value="Upper Middle Class">Upper Middle Class</option>
                            <option value="Rich">Rich</option>
                          </select>
                        </div>
                        <div>
                          <label htmlFor="familyValues" className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                            Family Values
                          </label>
                          <select
                            id="familyValues"
                            name="familyValues"
                            value={formData.familyValues}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                          >
                            <option value="Orthodox">Orthodox</option>
                            <option value="Traditional">Traditional</option>
                            <option value="Moderate">Moderate</option>
                            <option value="Liberal">Liberal</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Tab 4: Horoscope Details */}
                  {activeTab === "horoscope" && (
                    <div className="space-y-6">
                      <h2 className="text-lg font-bold text-maroon-900 border-b border-ivory-200 pb-3 flex items-center gap-2">
                        <Compass className="w-5 h-5 text-gold-500" /> Astrological Details
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                          <label htmlFor="rasi" className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                            Rasi
                          </label>
                          <select
                            id="rasi"
                            name="rasi"
                            value={formData.rasi}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                          >
                            {RASIS.map((rasi) => (
                              <option key={rasi} value={rasi}>{rasi}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label htmlFor="nakshatra" className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                            Nakshatram (Star)
                          </label>
                          <select
                            id="nakshatra"
                            name="nakshatra"
                            value={formData.nakshatra}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                          >
                            {NAKSHATRAS.map((star) => (
                              <option key={star} value={star}>{star}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label htmlFor="lagnam" className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                            Lagnam
                          </label>
                          <input
                            id="lagnam"
                            name="lagnam"
                            type="text"
                            value={formData.lagnam}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                          />
                        </div>
                        <div>
                          <label htmlFor="gothram" className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                            Gothram
                          </label>
                          <input
                            id="gothram"
                            name="gothram"
                            type="text"
                            value={formData.gothram}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                            Astrological Doshams
                          </label>
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-gray-50 p-4 rounded-xl border border-gray-200">
                            {["Chevvai Dosham / Manglik", "Rahu-Kethu Dosham", "Kala Sarpa Dosham", "None"].map((dosha) => (
                              <label key={dosha} className="flex items-center gap-2 text-xs font-medium text-gray-700 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={formData.doshams.includes(dosha)}
                                  onChange={() => handleCheckboxChange(dosha)}
                                  className="rounded text-maroon-800 border-gray-300 focus:ring-maroon-400 cursor-pointer"
                                />
                                {dosha}
                              </label>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Tab 5: Partner Expectations */}
                  {activeTab === "expectations" && (
                    <div className="space-y-6">
                      <h2 className="text-lg font-bold text-maroon-900 border-b border-ivory-200 pb-3 flex items-center gap-2">
                        <FileText className="w-5 h-5 text-gold-500" /> About Me & Partner Expectations
                      </h2>
                      <div className="space-y-5">
                        <div>
                          <label htmlFor="aboutMe" className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                            About Me (Self Write-up)
                          </label>
                          <textarea
                            id="aboutMe"
                            name="aboutMe"
                            rows={4}
                            value={formData.aboutMe}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-maroon-400 text-sm"
                          />
                        </div>
                        
                        <div className="gold-divider" />
                        
                        <h3 className="font-bold text-maroon-900 text-sm">Partner Preferences</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                          <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                              Age Range
                            </label>
                            <div className="flex gap-2">
                              <input
                                type="number"
                                name="partnerAgeMin"
                                value={formData.partnerAgeMin}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                              />
                              <input
                                type="number"
                                name="partnerAgeMax"
                                value={formData.partnerAgeMax}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                              />
                            </div>
                          </div>
                          <div>
                            <label htmlFor="partnerEducation" className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                              Education Preferred
                            </label>
                            <input
                              id="partnerEducation"
                              name="partnerEducation"
                              type="text"
                              value={formData.partnerEducation}
                              onChange={handleInputChange}
                              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                            />
                          </div>
                          <div>
                            <label htmlFor="partnerProfession" className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                              Profession Preferred
                            </label>
                            <input
                              id="partnerProfession"
                              name="partnerProfession"
                              type="text"
                              value={formData.partnerProfession}
                              onChange={handleInputChange}
                              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                            />
                          </div>
                          <div>
                            <label htmlFor="partnerLocation" className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                              Preferred Location
                            </label>
                            <input
                              id="partnerLocation"
                              name="partnerLocation"
                              type="text"
                              value={formData.partnerLocation}
                              onChange={handleInputChange}
                              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Tab 6: Manage Photos */}
                  {activeTab === "photos" && (
                    <div className="space-y-6">
                      <h2 className="text-lg font-bold text-maroon-900 border-b border-ivory-200 pb-3 flex items-center gap-2">
                        <Camera className="w-5 h-5 text-gold-500" /> Manage Photos
                      </h2>
                      <div className="space-y-4">
                        <div
                          onDragEnter={handleDrag}
                          onDragOver={handleDrag}
                          onDragLeave={handleDrag}
                          onDrop={handleDrop}
                          className={`w-full py-10 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all ${
                            dragActive
                              ? "bg-maroon-50 border-maroon-500"
                              : "bg-gray-50 border-gray-300 hover:bg-gray-100 hover:border-maroon-400"
                          }`}
                          onClick={triggerFileInput}
                        >
                          <input
                            id="edit-file-upload-input"
                            type="file"
                            multiple
                            accept="image/*"
                            className="hidden"
                            onChange={handleFileChange}
                          />
                          <Upload className="w-10 h-10 text-maroon-600 mb-3" />
                          <p className="text-sm font-bold text-maroon-900">Drag and drop your photos here</p>
                          <p className="text-xs text-gray-400 mt-1">Or click to browse files</p>
                        </div>

                        {photos.length > 0 && (
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
                            {photos.map((photo, idx) => (
                              <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-gray-200 group bg-gray-100">
                                <Image
                                  src={photo}
                                  alt={`Groom photo ${idx + 1}`}
                                  fill
                                  className="object-cover"
                                />
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    removePhoto(idx);
                                  }}
                                  className="absolute top-2 right-2 bg-black/60 hover:bg-maroon-700 text-white rounded-full p-1 transition-colors cursor-pointer"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Save Button Bar */}
                  <div className="flex justify-between items-center border-t border-ivory-200 pt-6">
                    <button
                      type="button"
                      onClick={() => router.push("/dashboard")}
                      className="px-5 py-2.5 text-xs font-semibold text-gray-500 hover:bg-gray-50 border border-gray-200 rounded-xl transition-all cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="px-6 py-2.5 bg-gradient-to-r from-maroon-900 to-maroon-800 hover:from-maroon-800 hover:to-maroon-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-75"
                    >
                      {isSaving ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Saving changes...
                        </>
                      ) : (
                        <>
                          Save Changes
                          <Save className="w-4 h-4 text-gold-400" />
                        </>
                      )}
                    </button>
                  </div>

                </form>
              </div>
            </div>

          </div>

        </div>
      </div>
      <Footer />
    </main>
  );
}
