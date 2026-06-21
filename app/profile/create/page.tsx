"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { createClient } from "@/utils/supabase/client";
import { createProfile, uploadProfilePhoto } from "@/lib/api";
import {
  User,
  GraduationCap,
  Users,
  Compass,
  FileText,
  Camera,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  Upload,
  X,
  Sparkles,
} from "lucide-react";

const steps = [
  { id: "personal", label: "Personal Details", icon: User },
  { id: "professional", label: "Education & Career", icon: GraduationCap },
  { id: "family", label: "Family Details", icon: Users },
  { id: "horoscope", label: "Horoscope Details", icon: Compass },
  { id: "expectations", label: "About & Expectations", icon: FileText },
  { id: "photos", label: "Photo Upload", icon: Camera },
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

export default function CreateProfilePage() {
  const router = useRouter();
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    // Personal Details
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
    educationLevel: "",
    degree: "",
    institution: "",
    professionType: "",
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
    partnerAgeMin: "21",
    partnerAgeMax: "30",
    partnerHeightMin: "",
    partnerHeightMax: "",
    partnerEducation: "",
    partnerProfession: "",
    partnerLocation: "",
    partnerRasi: "",
  });

  // Simulated photo uploads state
  const [photos, setPhotos] = useState<string[]>([]);
  const [photoFiles, setPhotoFiles] = useState<File[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  
  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        setUserId(data.user.id);
      } else {
        router.push("/login");
      }
    });
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
      // Add photo URL and files
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

  const triggerFileInput = () => {
    document.getElementById("file-upload-input")?.click();
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
    setPhotoFiles((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleNext = () => {
    if (currentStepIdx < steps.length - 1) {
      setCurrentStepIdx((prev) => prev + 1);
      window.scrollTo(0, 0);
    }
  };

  const handleBack = () => {
    if (currentStepIdx > 0) {
      setCurrentStepIdx((prev) => prev - 1);
      window.scrollTo(0, 0);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;
    
    setIsSubmitting(true);
    
    try {
      await createProfile(userId, formData);
      
      // Upload photos
      for (const file of photoFiles) {
        await uploadProfilePhoto(userId, file);
      }
      
      setIsSubmitting(false);
      setIsSuccess(true);
    } catch (error) {
      console.error("Error creating profile:", error);
      setIsSubmitting(false);
    }
  };

  const activeStep = steps[currentStepIdx];
  const StepIcon = activeStep.icon;

  return (
    <main className="flex flex-col min-h-screen bg-ivory-100">
      <Navbar />
      <div className="h-20" /> {/* Spacer */}

      <div className="flex-1 section-padding py-10">
        <div className="max-w-6xl mx-auto">
          
          {/* Header */}
          <div className="text-center mb-10">
            <span className="text-xs bg-maroon-50 text-maroon-700 px-3 py-1 rounded-full font-bold border border-maroon-100 tracking-wider inline-flex items-center gap-1 uppercase">
              <Sparkles className="w-3.5 h-3.5 text-gold-500 fill-current" />
              Start Your Journey
            </span>
            <h1 className="text-3xl md:text-4xl font-extrabold text-maroon-900 mt-2">
              Create Your Matrimony Profile
            </h1>
            <p className="text-gray-500 text-sm mt-2 max-w-lg mx-auto">
              Tell us about yourself and find your perfect Tamil life partner. All profiles are manually verified for safety.
            </p>
          </div>

          {/* Progress Indicator - Stepper */}
          <div className="mb-10 bg-white rounded-2xl border border-ivory-300 p-4 shadow-sm">
            {/* Desktop Stepper */}
            <div className="hidden md:flex justify-between items-center relative">
              <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-0.5 bg-ivory-200 z-0" />
              <div
                className="absolute left-6 top-1/2 -translate-y-1/2 h-0.5 bg-gold-400 transition-all duration-500 z-0"
                style={{ width: `${(currentStepIdx / (steps.length - 1)) * 92}%` }}
              />
              
              {steps.map((step, idx) => {
                const Icon = step.icon;
                const isCompleted = idx < currentStepIdx;
                const isActive = idx === currentStepIdx;
                return (
                  <button
                    key={step.id}
                    onClick={() => setCurrentStepIdx(idx)}
                    className="relative z-10 flex flex-col items-center group cursor-pointer"
                  >
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all duration-300 ${
                        isCompleted
                          ? "bg-gold-500 border-gold-600 text-white"
                          : isActive
                          ? "bg-maroon-900 border-maroon-900 text-white shadow-lg shadow-maroon-900/20 scale-110"
                          : "bg-white border-ivory-300 text-gray-400 group-hover:border-maroon-400 group-hover:text-maroon-800"
                      }`}
                    >
                      {isCompleted ? <CheckCircle className="w-5 h-5" /> : <Icon className="w-4.5 h-4.5" />}
                    </div>
                    <span
                      className={`text-[10px] font-bold mt-2 transition-colors ${
                        isActive ? "text-maroon-900" : "text-gray-500 group-hover:text-maroon-800"
                      }`}
                    >
                      {step.label}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Mobile Stepper */}
            <div className="flex md:hidden items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-maroon-900 text-white flex items-center justify-center font-bold text-xs">
                  {currentStepIdx + 1}
                </div>
                <div>
                  <h3 className="font-bold text-maroon-900 text-xs">{activeStep.label}</h3>
                  <p className="text-[10px] text-gray-400">Step {currentStepIdx + 1} of {steps.length}</p>
                </div>
              </div>
              <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gold-500 rounded-full transition-all duration-300"
                  style={{ width: `${((currentStepIdx + 1) / steps.length) * 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* Form Card Layout */}
          {!isSuccess ? (
            <div className="bg-white rounded-3xl border border-ivory-300 shadow-xl overflow-hidden">
              <form onSubmit={handleSubmit} className="p-6 md:p-10 space-y-8">
                
                {/* 1. PERSONAL DETAILS */}
                {currentStepIdx === 0 && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-bold text-maroon-900 border-b border-ivory-200 pb-3 flex items-center gap-2">
                      <User className="w-5 h-5 text-gold-500" /> Personal Information
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label htmlFor="fullName" className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                          Full Name *
                        </label>
                        <input
                          id="fullName"
                          name="fullName"
                          type="text"
                          required
                          value={formData.fullName}
                          onChange={handleInputChange}
                          placeholder="Enter your full name"
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-maroon-400 focus:ring-1 focus:ring-maroon-400 text-sm"
                        />
                      </div>

                      <div>
                        <label htmlFor="gender" className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                          Gender *
                        </label>
                        <select
                          id="gender"
                          name="gender"
                          required
                          value={formData.gender}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-maroon-400 focus:ring-1 focus:ring-maroon-400 text-sm"
                        >
                          <option value="">Select Gender</option>
                          <option value="Male">Groom (Male)</option>
                          <option value="Female">Bride (Female)</option>
                        </select>
                      </div>

                      <div>
                        <label htmlFor="dob" className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                          Date of Birth *
                        </label>
                        <input
                          id="dob"
                          name="dob"
                          type="date"
                          required
                          value={formData.dob}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-maroon-400 focus:ring-1 focus:ring-maroon-400 text-sm"
                        />
                      </div>

                      <div>
                        <label htmlFor="maritalStatus" className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                          Marital Status *
                        </label>
                        <select
                          id="maritalStatus"
                          name="maritalStatus"
                          required
                          value={formData.maritalStatus}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-maroon-400 focus:ring-1 focus:ring-maroon-400 text-sm"
                        >
                          <option value="">Select Status</option>
                          <option value="Never Married">Never Married</option>
                          <option value="Widowed">Widowed</option>
                          <option value="Divorced">Divorced</option>
                          <option value="Awaiting Divorce">Awaiting Divorce</option>
                        </select>
                      </div>

                      <div>
                        <label htmlFor="height" className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                          Height *
                        </label>
                        <input
                          id="height"
                          name="height"
                          type="text"
                          required
                          placeholder="e.g. 5ft 6in or 168 cm"
                          value={formData.height}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-maroon-400 focus:ring-1 focus:ring-maroon-400 text-sm"
                        />
                      </div>

                      <div>
                        <label htmlFor="weight" className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                          Weight (kg)
                        </label>
                        <input
                          id="weight"
                          name="weight"
                          type="text"
                          placeholder="e.g. 60 kg"
                          value={formData.weight}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-maroon-400 focus:ring-1 focus:ring-maroon-400 text-sm"
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
                          placeholder="e.g. Iyer, Pillai, Mudaliar"
                          value={formData.caste}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-maroon-400 focus:ring-1 focus:ring-maroon-400 text-sm"
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
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-maroon-400 focus:ring-1 focus:ring-maroon-400 text-sm"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. EDUCATION & CAREER */}
                {currentStepIdx === 1 && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-bold text-maroon-900 border-b border-ivory-200 pb-3 flex items-center gap-2">
                      <GraduationCap className="w-5 h-5 text-gold-500" /> Education & Professional Info
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label htmlFor="educationLevel" className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                          Education Level *
                        </label>
                        <select
                          id="educationLevel"
                          name="educationLevel"
                          required
                          value={formData.educationLevel}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-maroon-400 focus:ring-1 focus:ring-maroon-400 text-sm"
                        >
                          <option value="">Select Level</option>
                          <option value="Graduate">Graduate (Bachelors)</option>
                          <option value="Post Graduate">Post Graduate (Masters)</option>
                          <option value="Doctorate/Medical">Doctorate / MBBS / PhD</option>
                          <option value="High School">High School / Diploma</option>
                        </select>
                      </div>

                      <div>
                        <label htmlFor="degree" className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                          Degree *
                        </label>
                        <input
                          id="degree"
                          name="degree"
                          type="text"
                          required
                          placeholder="e.g. B.E - Computer Science"
                          value={formData.degree}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-maroon-400 focus:ring-1 focus:ring-maroon-400 text-sm"
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
                          placeholder="e.g. Anna University"
                          value={formData.institution}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-maroon-400 focus:ring-1 focus:ring-maroon-400 text-sm"
                        />
                      </div>

                      <div>
                        <label htmlFor="professionType" className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                          Employment Sector
                        </label>
                        <select
                          id="professionType"
                          name="professionType"
                          value={formData.professionType}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-maroon-400 focus:ring-1 focus:ring-maroon-400 text-sm"
                        >
                          <option value="">Select Sector</option>
                          <option value="Private Sector">Private Corporate Sector</option>
                          <option value="Government Job">Government Sector</option>
                          <option value="Business Owner">Business Owner / Self Employed</option>
                          <option value="Medical/Doctor">Medical Field</option>
                          <option value="Not Working">Not Working</option>
                        </select>
                      </div>

                      <div>
                        <label htmlFor="occupation" className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                          Occupation / Designation *
                        </label>
                        <input
                          id="occupation"
                          name="occupation"
                          type="text"
                          required
                          placeholder="e.g. Software Engineer"
                          value={formData.occupation}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-maroon-400 focus:ring-1 focus:ring-maroon-400 text-sm"
                        />
                      </div>

                      <div>
                        <label htmlFor="annualIncome" className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                          Annual Income *
                        </label>
                        <input
                          id="annualIncome"
                          name="annualIncome"
                          type="text"
                          required
                          placeholder="e.g. ₹12,00,000 or $90,000"
                          value={formData.annualIncome}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-maroon-400 focus:ring-1 focus:ring-maroon-400 text-sm"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label htmlFor="workLocation" className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                          Working Location *
                        </label>
                        <input
                          id="workLocation"
                          name="workLocation"
                          type="text"
                          required
                          placeholder="e.g. Chennai, Tamil Nadu"
                          value={formData.workLocation}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-maroon-400 focus:ring-1 focus:ring-maroon-400 text-sm"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* 3. FAMILY DETAILS */}
                {currentStepIdx === 2 && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-bold text-maroon-900 border-b border-ivory-200 pb-3 flex items-center gap-2">
                      <Users className="w-5 h-5 text-gold-500" /> Family Background
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
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-maroon-400 focus:ring-1 focus:ring-maroon-400 text-sm"
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
                          placeholder="e.g. Retired Teacher"
                          value={formData.fatherOccupation}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-maroon-400 focus:ring-1 focus:ring-maroon-400 text-sm"
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
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-maroon-400 focus:ring-1 focus:ring-maroon-400 text-sm"
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
                          placeholder="e.g. Homemaker"
                          value={formData.motherOccupation}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-maroon-400 focus:ring-1 focus:ring-maroon-400 text-sm"
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
                          placeholder="e.g. 1 Elder Sister (Married)"
                          value={formData.siblings}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-maroon-400 focus:ring-1 focus:ring-maroon-400 text-sm"
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
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-maroon-400 focus:ring-1 focus:ring-maroon-400 text-sm"
                        >
                          <option value="Middle Class">Middle Class</option>
                          <option value="Upper Middle Class">Upper Middle Class</option>
                          <option value="Rich">Rich / Wealthy</option>
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
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-maroon-400 focus:ring-1 focus:ring-maroon-400 text-sm"
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

                {/* 4. HOROSCOPE DETAILS */}
                {currentStepIdx === 3 && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-bold text-maroon-900 border-b border-ivory-200 pb-3 flex items-center gap-2">
                      <Compass className="w-5 h-5 text-gold-500" /> Horoscope (Jathagam) Details
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label htmlFor="rasi" className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                          Rasi (Moon Sign) *
                        </label>
                        <select
                          id="rasi"
                          name="rasi"
                          required
                          value={formData.rasi}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-maroon-400 focus:ring-1 focus:ring-maroon-400 text-sm"
                        >
                          <option value="">Select Rasi</option>
                          {RASIS.map((rasi) => (
                            <option key={rasi} value={rasi}>{rasi}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label htmlFor="nakshatra" className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                          Nakshatram (Star) *
                        </label>
                        <select
                          id="nakshatra"
                          name="nakshatra"
                          required
                          value={formData.nakshatra}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-maroon-400 focus:ring-1 focus:ring-maroon-400 text-sm"
                        >
                          <option value="">Select Star</option>
                          {NAKSHATRAS.map((star) => (
                            <option key={star} value={star}>{star}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label htmlFor="lagnam" className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                          Lagnam (Ascendant)
                        </label>
                        <input
                          id="lagnam"
                          name="lagnam"
                          type="text"
                          placeholder="e.g. Simham"
                          value={formData.lagnam}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-maroon-400 focus:ring-1 focus:ring-maroon-400 text-sm"
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
                          placeholder="e.g. Kasyapa"
                          value={formData.gothram}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-maroon-400 focus:ring-1 focus:ring-maroon-400 text-sm"
                        />
                      </div>

                      <div>
                        <label htmlFor="patham" className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                          Patham (Quarter)
                        </label>
                        <select
                          id="patham"
                          name="patham"
                          value={formData.patham}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-maroon-400 focus:ring-1 focus:ring-maroon-400 text-sm"
                        >
                          <option value="1">1</option>
                          <option value="2">2</option>
                          <option value="3">3</option>
                          <option value="4">4</option>
                        </select>
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                          Astrological Doshams (Select all that apply)
                        </label>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-gray-50 p-4 rounded-xl border border-gray-150">
                          {["Chevvai Dosham / Manglik", "Rahu-Kethu Dosham", "Kala Sarpa Dosham", "None"].map((dosha) => (
                            <label
                              key={dosha}
                              className="flex items-center gap-2 text-xs font-medium text-gray-700 cursor-pointer"
                            >
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

                {/* 5. ABOUT & EXPECTATIONS */}
                {currentStepIdx === 4 && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-bold text-maroon-900 border-b border-ivory-200 pb-3 flex items-center gap-2">
                      <FileText className="w-5 h-5 text-gold-500" /> About Me & Partner Expectations
                    </h2>
                    
                    <div className="space-y-5">
                      <div>
                        <label htmlFor="aboutMe" className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                          About Myself * (Describe personality, family, career)
                        </label>
                        <textarea
                          id="aboutMe"
                          name="aboutMe"
                          required
                          rows={4}
                          value={formData.aboutMe}
                          onChange={handleInputChange}
                          placeholder="Write a few lines about your personality, values, hobbies, and career goals..."
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-maroon-400 focus:ring-1 focus:ring-maroon-400 text-sm"
                        />
                      </div>

                      <div className="gold-divider" />
                      
                      <h3 className="font-bold text-maroon-900 text-sm">Partner Expectations</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                            Partner Age Preference (years)
                          </label>
                          <div className="flex gap-2">
                            <input
                              type="number"
                              name="partnerAgeMin"
                              placeholder="Min Age"
                              value={formData.partnerAgeMin}
                              onChange={handleInputChange}
                              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                            />
                            <input
                              type="number"
                              name="partnerAgeMax"
                              placeholder="Max Age"
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
                            placeholder="e.g. Any Graduate, B.E, MBA"
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
                            placeholder="e.g. IT Professional, Doctor"
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
                            placeholder="e.g. Chennai, Bangalore, Overseas"
                            value={formData.partnerLocation}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 6. PHOTO UPLOAD */}
                {currentStepIdx === 5 && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-bold text-maroon-900 border-b border-ivory-200 pb-3 flex items-center gap-2">
                      <Camera className="w-5 h-5 text-gold-500" /> Upload Profile Photos
                    </h2>
                    
                    <div className="space-y-4">
                      <p className="text-xs text-gray-500 leading-relaxed">
                        Add up to 4 high-quality photos. Profiles with photos get 10 times more responses. JPG, PNG formats supported.
                      </p>
                      
                      {/* Drag & Drop Zone */}
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
                          id="file-upload-input"
                          type="file"
                          multiple
                          accept="image/*"
                          className="hidden"
                          onChange={handleFileChange}
                        />
                        <Upload className="w-10 h-10 text-maroon-600 mb-3" />
                        <p className="text-sm font-bold text-maroon-900">Drag and drop your photos here</p>
                        <p className="text-xs text-gray-400 mt-1">Or click to browse files from your computer</p>
                      </div>

                      {/* Photo Previews */}
                      {photos.length > 0 && (
                        <div className="space-y-3">
                          <p className="text-xs font-bold text-gray-700 uppercase tracking-wider">Uploaded Photos ({photos.length}/4)</p>
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            {photos.map((photo, idx) => (
                              <div
                                key={idx}
                                className="relative aspect-square rounded-xl overflow-hidden border border-gray-200 group bg-gray-100"
                              >
                                <Image
                                  src={photo}
                                  alt={`Upload preview ${idx + 1}`}
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
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Form Buttons */}
                <div className="flex justify-between items-center border-t border-ivory-200 pt-6">
                  <button
                    type="button"
                    onClick={handleBack}
                    disabled={currentStepIdx === 0}
                    className="px-6 py-3 border border-gray-200 text-gray-600 hover:bg-gray-50 rounded-xl transition-all font-semibold flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                  >
                    <ArrowLeft className="w-4.5 h-4.5" /> Back
                  </button>

                  {currentStepIdx < steps.length - 1 ? (
                    <button
                      type="button"
                      onClick={handleNext}
                      className="px-6 py-3 bg-maroon-900 hover:bg-maroon-800 text-white rounded-xl transition-all font-semibold flex items-center gap-2 cursor-pointer text-sm shadow-md"
                    >
                      Next Step <ArrowRight className="w-4.5 h-4.5" />
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-8 py-3 bg-gradient-to-r from-gold-600 to-gold-500 hover:from-gold-500 hover:to-gold-400 text-white rounded-xl transition-all font-bold flex items-center gap-2.5 cursor-pointer text-sm shadow-md"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          Complete Profile
                          <CheckCircle className="w-4.5 h-4.5" />
                        </>
                      )}
                    </button>
                  )}
                </div>

              </form>
            </div>
          ) : (
            /* Success State */
            <div className="bg-white rounded-3xl border border-ivory-300 shadow-xl p-8 md:p-12 text-center max-w-xl mx-auto space-y-6 animate-fade-in">
              <div className="w-20 h-20 bg-green-50 rounded-full border border-green-200 flex items-center justify-center mx-auto text-green-600 shadow-md">
                <CheckCircle className="w-10 h-10 fill-current text-green-500" />
              </div>
              <h2 className="text-3xl font-extrabold text-maroon-900">
                Vanakkam! Profile Created successfully
              </h2>
              <p className="text-gray-600 text-sm leading-relaxed max-w-md mx-auto">
                Your profile has been created and submitted for verification. It usually takes 2-4 hours to approve. In the meantime, you can explore dashboard and search matches!
              </p>
              <div className="gold-divider" />
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={() => router.push("/dashboard")}
                  className="px-6 py-3 bg-maroon-900 hover:bg-maroon-800 text-white rounded-xl font-bold transition-all shadow-md cursor-pointer text-sm"
                >
                  Go to Dashboard
                </button>
                <button
                  onClick={() => router.push("/search")}
                  className="px-6 py-3 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-xl font-bold transition-all cursor-pointer text-sm"
                >
                  Search Partners
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
      
      <Footer />
    </main>
  );
}
