"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import {
  Heart,
  User,
  Calendar,
  BookOpen,
  Briefcase,
  MapPin,
  Phone,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  Star,
} from "lucide-react";

// ─── Form Data Interface ─────────────────────────────────────────────────────
interface FormData {
  // Personal
  fullName: string;
  gender: "male" | "female" | "";
  dateOfBirth: string;
  // Religious
  religion: string;
  caste: string;
  rasi: string;
  nakshatra: string;
  // Professional
  education: string;
  profession: string;
  // Contact
  location: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

const INITIAL_DATA: FormData = {
  fullName: "",
  gender: "",
  dateOfBirth: "",
  religion: "",
  caste: "",
  rasi: "",
  nakshatra: "",
  education: "",
  profession: "",
  location: "",
  email: "",
  phone: "",
  password: "",
  confirmPassword: "",
};

// ─── Steps ───────────────────────────────────────────────────────────────────
const steps = [
  { id: 1, label: "Personal", icon: User, desc: "Basic details" },
  { id: 2, label: "Religious", icon: Star, desc: "Religion & horoscope" },
  { id: 3, label: "Career", icon: Briefcase, desc: "Education & work" },
  { id: 4, label: "Account", icon: Lock, desc: "Contact & password" },
];

// ─── Tamil-specific data ─────────────────────────────────────────────────────
const rasiList = [
  "Mesham (Aries)", "Rishabam (Taurus)", "Mithuna (Gemini)",
  "Karkadagam (Cancer)", "Simha (Leo)", "Kanni (Virgo)",
  "Thula (Libra)", "Viruchigam (Scorpio)", "Thanusu (Sagittarius)",
  "Makaram (Capricorn)", "Kumbam (Aquarius)", "Meenam (Pisces)",
];

const nakshatraList = [
  "Ashwini", "Bharani", "Krithigai", "Rohini", "Mirugasirisham",
  "Thiruvadhirai", "Punarpoosam", "Poosam", "Ayilyam", "Magam",
  "Pooram", "Uthiram", "Hastham", "Chithirai", "Swathi", "Vishakam",
  "Anusham", "Kettai", "Moolam", "Pooradam", "Uthiradam", "Thiruvonam",
  "Avittam", "Sadhayam", "Poorattadhi", "Uthirattadhi", "Revathi",
];

const educationLevels = [
  "High School", "Diploma", "B.A", "B.Sc", "B.Com", "B.E / B.Tech",
  "B.Arch", "MBBS", "BDS", "LLB", "M.A", "M.Sc", "M.Com", "M.E / M.Tech",
  "MBA", "MCA", "MD / MS", "PhD", "CA / CMA", "Other",
];

const professionList = [
  "Software Engineer", "Doctor", "Lawyer", "Teacher / Professor",
  "Business Owner", "Government Employee", "Bank Employee",
  "Engineer (Civil/Mechanical)", "Chartered Accountant", "Architect",
  "Nurse", "Pharmacist", "Police / Defence", "Farmer", "Artist",
  "Journalist", "Other",
];

// ─── Select field helper ──────────────────────────────────────────────────────
function FormSelect({
  id, label, value, onChange, options, placeholder,
}: {
  id: string; label: string; value: string;
  onChange: (v: string) => void; options: string[]; placeholder?: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-semibold text-gray-700 mb-2">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-gray-900 focus:outline-none focus:border-maroon-400 focus:ring-2 focus:ring-maroon-100 transition-all duration-200 text-sm"
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((opt) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    </div>
  );
}

// ─── Text input helper ────────────────────────────────────────────────────────
function FormInput({
  id, label, type = "text", value, onChange, placeholder, icon: Icon, autoComplete,
}: {
  id: string; label: string; type?: string; value: string;
  onChange: (v: string) => void; placeholder?: string;
  icon?: React.ElementType; autoComplete?: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-semibold text-gray-700 mb-2">
        {label}
      </label>
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        )}
        <input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className={`w-full ${Icon ? "pl-11" : "pl-4"} pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-maroon-400 focus:ring-2 focus:ring-maroon-100 transition-all duration-200 text-sm`}
        />
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function RegisterPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(INITIAL_DATA);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  const update = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    if (currentStep < steps.length) setCurrentStep((s) => s + 1);
  };
  const prevStep = () => {
    if (currentStep > 1) setCurrentStep((s) => s - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (!formData.email) {
      setError("Email is required for registration");
      return;
    }
    
    setError(null);
    setIsLoading(true);
    
    try {
      const { error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
            gender: formData.gender,
            date_of_birth: formData.dateOfBirth,
            religion: formData.religion,
            caste: formData.caste,
            rasi: formData.rasi,
            nakshatra: formData.nakshatra,
            education: formData.education,
            profession: formData.profession,
            location: formData.location,
            phone: formData.phone,
          }
        }
      });
      
      if (signUpError) throw signUpError;
      
      setIsSubmitted(true);
    } catch (err: any) {
      setError(err.message || "Failed to register. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-ivory-100 px-4">
        <div className="text-center max-w-md">
          <div className="w-24 h-24 rounded-full bg-green-50 border-4 border-green-100 flex items-center justify-center mx-auto mb-6 shadow-xl">
            <CheckCircle2 className="w-12 h-12 text-green-500" />
          </div>
          <h2 className="text-3xl font-extrabold text-maroon-900 mb-3">
            Profile Created! 🎉
          </h2>
          <p className="text-gray-500 mb-8 leading-relaxed">
            Welcome to Gokul Vivaham, <strong>{formData.fullName || "Friend"}</strong>!
            Your profile has been submitted for verification. We will notify you
            within 24 hours.
          </p>
          <a
            href="/login"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-maroon-900 to-maroon-800 text-white font-bold rounded-2xl shadow-lg hover:shadow-maroon-900/30 transition-all duration-300 hover:scale-[1.02]"
          >
            Sign In to Your Profile
            <ChevronRight className="w-5 h-5" />
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden bg-black py-12">
      {/* Background Image with Overlay */}
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: 'url("https://images.unsplash.com/photo-1583939000140-5e206ab6d418?q=80&w=2070&auto=format&fit=crop")',
        }}
      />
      <div className="fixed inset-0 bg-gradient-to-t from-black via-black/60 to-black/40 backdrop-blur-[2px]" />

      <div className="relative z-10 w-full max-w-3xl px-4 flex flex-col items-center mx-auto">
        {/* Top logo bar */}
        <div className="flex flex-col items-center justify-center mb-8 gap-2">
          <a href="/" className="flex flex-col items-center justify-center gap-2 group">
            <div className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-lg group-hover:border-white/40 transition-colors">
              <Heart className="w-6 h-6 text-[#8b1a1a] fill-[#8b1a1a]" />
            </div>
            <div className="text-center">
              <div className="font-extrabold text-3xl text-white tracking-tight drop-shadow-md">
                Gokul Vivaham
              </div>
              <div
                className="text-[10px] text-[#c9a84c] tracking-[0.2em] font-semibold uppercase mt-1 drop-shadow-md"
                style={{ fontFamily: "var(--font-tamil)" }}
              >
                கோகுல் விவாஹம்
              </div>
            </div>
          </a>
        </div>

        <div className="w-full">
          {/* Page title */}
          <div className="text-center mb-8 glass-card rounded-[2rem] p-6">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-maroon-900 mb-2">
              Create Your{" "}
              <span className="bg-gradient-to-r from-maroon-800 to-gold-600 bg-clip-text text-transparent">
                Free Profile
              </span>
            </h1>
            <p className="text-gray-600 text-sm font-medium">
              Already registered?{" "}
              <a href="/login" className="text-maroon-700 font-bold hover:underline">
                Sign In
              </a>
            </p>
          </div>

        {/* Step progress */}
        <div className="glass-card rounded-[2rem] border border-ivory-300 shadow-sm p-5 mb-6">
          <div className="flex items-center justify-between relative">
            {/* Progress line */}
            <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-100 mx-8">
              <div
                className="h-full bg-gradient-to-r from-maroon-800 to-gold-600 transition-all duration-500 rounded-full"
                style={{
                  width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
                }}
              />
            </div>

            {steps.map((step) => {
              const Icon = step.icon;
              const isComplete = currentStep > step.id;
              const isActive = currentStep === step.id;
              return (
                <div
                  key={step.id}
                  className="relative flex flex-col items-center gap-2 z-10"
                >
                  <div
                    className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                      isComplete
                        ? "bg-maroon-800 border-maroon-800"
                        : isActive
                        ? "bg-white border-maroon-700 shadow-lg shadow-maroon-100"
                        : "bg-white border-gray-200"
                    }`}
                  >
                    {isComplete ? (
                      <CheckCircle2 className="w-5 h-5 text-white" />
                    ) : (
                      <Icon
                        className={`w-4.5 h-4.5 ${
                          isActive ? "text-maroon-700" : "text-gray-400"
                        }`}
                      />
                    )}
                  </div>
                  <div className="text-center hidden sm:block">
                    <p
                      className={`text-xs font-bold ${
                        isActive ? "text-maroon-800" : isComplete ? "text-maroon-600" : "text-gray-400"
                      }`}
                    >
                      {step.label}
                    </p>
                    <p className="text-[10px] text-gray-400">{step.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Form card */}
        <div className="glass-card rounded-[2rem] border border-ivory-300 shadow-xl shadow-maroon-100/20 p-8 sm:p-10 relative overflow-hidden">
          {/* Card Top Border Accent */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#c9a84c] to-transparent" />
          <form onSubmit={handleSubmit}>
            {/* ── Step 1: Personal Info ── */}
            {currentStep === 1 && (
              <div>
                <div className="flex items-center gap-3 mb-7">
                  <div className="w-10 h-10 rounded-2xl bg-maroon-50 border border-maroon-200 flex items-center justify-center">
                    <User className="w-5 h-5 text-maroon-700" />
                  </div>
                  <div>
                    <h2 className="font-bold text-maroon-900 text-xl">Personal Information</h2>
                    <p className="text-xs text-gray-400">Tell us about yourself</p>
                  </div>
                </div>

                <div className="space-y-5">
                  <FormInput
                    id="reg-full-name"
                    label="Full Name"
                    value={formData.fullName}
                    onChange={(v) => update("fullName", v)}
                    placeholder="e.g. Priya Lakshmi"
                    icon={User}
                    autoComplete="name"
                  />

                  {/* Gender */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Gender
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {(["female", "male"] as const).map((g) => (
                        <label
                          key={g}
                          className={`flex items-center gap-3 p-4 rounded-2xl border-2 cursor-pointer transition-all duration-200 ${
                            formData.gender === g
                              ? "border-maroon-700 bg-maroon-50"
                              : "border-gray-200 hover:border-maroon-300 hover:bg-gray-50"
                          }`}
                        >
                          <input
                            id={`gender-${g}`}
                            type="radio"
                            name="gender"
                            value={g}
                            checked={formData.gender === g}
                            onChange={() => update("gender", g)}
                            className="sr-only"
                          />
                          <span className="text-2xl">{g === "female" ? "👰" : "🤵"}</span>
                          <span className="font-semibold text-gray-700 capitalize">
                            {g === "female" ? "Bride" : "Groom"}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <FormInput
                    id="reg-dob"
                    label="Date of Birth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(v) => update("dateOfBirth", v)}
                    icon={Calendar}
                  />
                </div>
              </div>
            )}

            {/* ── Step 2: Religious Info ── */}
            {currentStep === 2 && (
              <div>
                <div className="flex items-center gap-3 mb-7">
                  <div className="w-10 h-10 rounded-2xl bg-gold-50 border border-gold-200 flex items-center justify-center">
                    <Star className="w-5 h-5 text-gold-600" />
                  </div>
                  <div>
                    <h2 className="font-bold text-maroon-900 text-xl">Religious & Astrological Details</h2>
                    <p className="text-xs text-gray-400">Horoscope & community info</p>
                  </div>
                </div>

                <div className="space-y-5">
                  <FormSelect
                    id="reg-religion"
                    label="Religion"
                    value={formData.religion}
                    onChange={(v) => update("religion", v)}
                    options={["Hindu", "Christian", "Muslim", "Jain", "Buddhist", "Other"]}
                    placeholder="Select religion"
                  />

                  <FormInput
                    id="reg-caste"
                    label="Caste / Community"
                    value={formData.caste}
                    onChange={(v) => update("caste", v)}
                    placeholder="e.g. Pillai, Mudaliar, Nadar..."
                    icon={BookOpen}
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <FormSelect
                      id="reg-rasi"
                      label="Rasi (Moon Sign)"
                      value={formData.rasi}
                      onChange={(v) => update("rasi", v)}
                      options={rasiList}
                      placeholder="Select Rasi"
                    />

                    <FormSelect
                      id="reg-nakshatra"
                      label="Nakshatra (Star)"
                      value={formData.nakshatra}
                      onChange={(v) => update("nakshatra", v)}
                      options={nakshatraList}
                      placeholder="Select Nakshatra"
                    />
                  </div>

                  {/* Info note */}
                  <div className="bg-gold-50 border border-gold-200 rounded-2xl p-4 flex gap-3">
                    <span className="text-gold-500 text-lg flex-shrink-0">⭐</span>
                    <p className="text-sm text-gold-700 leading-relaxed">
                      Accurate Rasi & Nakshatra details help us provide better horoscope
                      matches for you. You can update these later from your profile.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* ── Step 3: Career Info ── */}
            {currentStep === 3 && (
              <div>
                <div className="flex items-center gap-3 mb-7">
                  <div className="w-10 h-10 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center">
                    <Briefcase className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="font-bold text-maroon-900 text-xl">Education & Career</h2>
                    <p className="text-xs text-gray-400">Your academic & professional background</p>
                  </div>
                </div>

                <div className="space-y-5">
                  <FormSelect
                    id="reg-education"
                    label="Highest Education"
                    value={formData.education}
                    onChange={(v) => update("education", v)}
                    options={educationLevels}
                    placeholder="Select education level"
                  />

                  <FormSelect
                    id="reg-profession"
                    label="Profession / Occupation"
                    value={formData.profession}
                    onChange={(v) => update("profession", v)}
                    options={professionList}
                    placeholder="Select profession"
                  />

                  <FormInput
                    id="reg-location"
                    label="Current Location (City)"
                    value={formData.location}
                    onChange={(v) => update("location", v)}
                    placeholder="e.g. Chennai, Coimbatore, Singapore"
                    icon={MapPin}
                  />
                </div>
              </div>
            )}

            {/* ── Step 4: Account Setup ── */}
            {currentStep === 4 && (
              <div>
                <div className="flex items-center gap-3 mb-7">
                  <div className="w-10 h-10 rounded-2xl bg-maroon-50 border border-maroon-200 flex items-center justify-center">
                    <Lock className="w-5 h-5 text-maroon-700" />
                  </div>
                  <div>
                    <h2 className="font-bold text-maroon-900 text-xl">Account Setup</h2>
                    <p className="text-xs text-gray-400">Phone & secure password</p>
                  </div>
                </div>

                <div className="space-y-5">
                  {/* Email */}
                  <div>
                    <label
                      htmlFor="reg-email"
                      className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        id="reg-email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => update("email", e.target.value)}
                        placeholder="your@email.com"
                        autoComplete="email"
                        className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-maroon-400 focus:ring-2 focus:ring-maroon-100 transition-all duration-200 text-sm"
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  <div>
                    <label
                      htmlFor="reg-phone"
                      className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                      Phone Number
                    </label>
                    <div className="flex gap-2">
                      <div className="flex items-center gap-2 px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-sm text-gray-600 font-medium flex-shrink-0">
                        🇮🇳 +91
                      </div>
                      <input
                        id="reg-phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => update("phone", e.target.value)}
                        placeholder="98765 43210"
                        autoComplete="tel"
                        className="flex-1 px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-maroon-400 focus:ring-2 focus:ring-maroon-100 transition-all duration-200 text-sm"
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div>
                    <label
                      htmlFor="reg-password"
                      className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                      Create Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        id="reg-password"
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        onChange={(e) => update("password", e.target.value)}
                        placeholder="Min 8 characters"
                        autoComplete="new-password"
                        className="w-full pl-11 pr-12 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-maroon-400 focus:ring-2 focus:ring-maroon-100 transition-all duration-200 text-sm"
                      />
                      <button
                        id="toggle-new-password-btn"
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {/* Password strength hint */}
                    {formData.password && (
                      <div className="flex gap-1 mt-2">
                        {[1, 2, 3, 4].map((level) => (
                          <div
                            key={level}
                            className={`flex-1 h-1 rounded-full transition-all duration-300 ${
                              formData.password.length >= level * 2
                                ? level <= 2
                                  ? "bg-red-400"
                                  : level === 3
                                  ? "bg-yellow-400"
                                  : "bg-green-400"
                                : "bg-gray-100"
                            }`}
                          />
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label
                      htmlFor="reg-confirm-password"
                      className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                      Confirm Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        id="reg-confirm-password"
                        type={showConfirmPassword ? "text" : "password"}
                        value={formData.confirmPassword}
                        onChange={(e) => update("confirmPassword", e.target.value)}
                        placeholder="Repeat your password"
                        autoComplete="new-password"
                        className={`w-full pl-11 pr-12 py-3.5 bg-gray-50 border rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-200 text-sm ${
                          formData.confirmPassword && formData.password !== formData.confirmPassword
                            ? "border-red-300 focus:border-red-400 focus:ring-red-100"
                            : "border-gray-200 focus:border-maroon-400 focus:ring-maroon-100"
                        }`}
                      />
                      <button
                        id="toggle-confirm-password-btn"
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                      >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                      <p className="text-xs text-red-500 mt-1.5">Passwords do not match</p>
                    )}
                  </div>

                  {/* Terms */}
                  <div className="bg-maroon-50 border border-maroon-100 rounded-2xl p-4">
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        id="reg-terms"
                        type="checkbox"
                        className="mt-0.5 w-4 h-4 rounded border-gray-300 text-maroon-700 focus:ring-maroon-400 cursor-pointer"
                      />
                      <span className="text-sm text-gray-600 leading-relaxed">
                        I agree to the{" "}
                        <a href="/terms" className="text-maroon-700 font-semibold hover:underline">
                          Terms of Service
                        </a>{" "}
                        and{" "}
                        <a href="/privacy" className="text-maroon-700 font-semibold hover:underline">
                          Privacy Policy
                        </a>
                        . I confirm that all information provided is accurate.
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm text-center">
                {error}
              </div>
            )}

            {/* ── Navigation ── */}
            <div className="flex items-center gap-3 mt-8 pt-6 border-t border-gray-100">
              {currentStep > 1 && (
                <button
                  id="reg-prev-btn"
                  type="button"
                  onClick={prevStep}
                  className="flex items-center gap-2 px-6 py-3 border-2 border-gray-200 hover:border-maroon-300 hover:bg-maroon-50 text-gray-600 hover:text-maroon-700 font-semibold rounded-2xl transition-all duration-200 text-sm cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Back
                </button>
              )}

              <div className="flex-1" />

              {currentStep < steps.length ? (
                <button
                  id="reg-next-btn"
                  type="button"
                  onClick={nextStep}
                  className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-maroon-900 to-maroon-800 hover:from-maroon-800 hover:to-maroon-700 text-white font-bold rounded-2xl shadow-lg shadow-maroon-900/20 hover:shadow-maroon-900/30 transition-all duration-300 hover:scale-[1.02] text-sm cursor-pointer"
                >
                  Continue
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  id="reg-submit-btn"
                  type="submit"
                  disabled={isLoading}
                  className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-gold-600 to-gold-500 hover:from-gold-500 hover:to-gold-400 text-white font-bold rounded-2xl shadow-lg shadow-gold-500/20 hover:shadow-gold-500/30 transition-all duration-300 hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed text-sm cursor-pointer"
                >
                  {isLoading ? "Creating Profile..." : "Create My Profile 🎉"}
                  {!isLoading && <Heart className="w-4 h-4 fill-current" />}
                </button>
              )}
            </div>

            {/* Step counter */}
            <p className="text-center text-xs text-gray-400 mt-4">
              Step {currentStep} of {steps.length}
            </p>
          </form>
        </div>

        {/* Trust row */}
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 mt-8">
          {["🔒 SSL Secured", "✅ 100% Free Registration", "🛡️ Privacy Protected", "📞 24/7 Support"].map(
            (badge) => (
              <span key={badge} className="text-xs text-gray-400">
                {badge}
              </span>
            )
          )}
        </div>
      </div>
    </div>
  );
}
