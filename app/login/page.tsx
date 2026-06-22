"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { Heart, Eye, EyeOff, Mail, Lock, ArrowRight, Phone } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();
  const [loginMethod, setLoginMethod] = useState<"email" | "phone">("email");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier || !password) {
      setError("Please enter both email/phone and password.");
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      if (loginMethod === "email") {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: identifier,
          password: password,
        });
        
        if (signInError) throw signInError;
        
        router.push("/profile");
        router.refresh();
      } else {
        throw new Error("Phone login is currently not available.");
      }
    } catch (err: any) {
      setError(err.message || "Failed to sign in. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-black">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: 'url("https://images.unsplash.com/photo-1583939000140-5e206ab6d418?q=80&w=2070&auto=format&fit=crop")',
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/40 backdrop-blur-[2px]" />

      <div className="relative z-10 w-full max-w-[440px] px-4">
        {/* Logo outside card */}
        <div className="flex flex-col items-center justify-center mb-8 gap-2">
          <Link href="/" className="flex flex-col items-center justify-center gap-2 group">
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
                கோகுல் விவாகம்
              </div>
            </div>
          </Link>
        </div>

        {/* Glassmorphism Card (Light theme style) */}
        <div className="glass-card rounded-[2rem] p-8 sm:p-10 shadow-2xl relative overflow-hidden">
          {/* Card Top Border Accent */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#c9a84c] to-transparent" />

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-extrabold text-maroon-900 mb-2">
              Welcome Back
            </h1>
            <p className="text-gray-500 text-sm font-medium">
              Enter your credentials to access your dashboard
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email / Phone Input */}
            <div className="space-y-1.5 w-full">
              <label htmlFor="identifier" className="block text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">
                {loginMethod === "email" ? "Email Address" : "Phone Number"}
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-maroon-700 transition-colors">
                  {loginMethod === "email" ? <Mail className="w-4.5 h-4.5" /> : <Phone className="w-4.5 h-4.5" />}
                </div>
                <input
                  id="identifier"
                  type={loginMethod === "email" ? "email" : "tel"}
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder={loginMethod === "email" ? "your@email.com" : "+91 98765 43210"}
                  className="block w-full pl-11 pr-4 py-3 bg-white/60 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-maroon-500 focus:border-maroon-500 transition-all text-sm shadow-sm"
                  autoComplete={loginMethod === "email" ? "email" : "tel"}
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-1.5 w-full">
              <div className="flex justify-between items-center ml-1">
                <label htmlFor="password" className="block text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Password
                </label>
                <Link href="/forgot-password" className="text-xs font-semibold text-maroon-600 hover:text-maroon-800 hover:underline transition-colors">
                  Forgot Password?
                </Link>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-maroon-700 transition-colors">
                  <Lock className="w-4.5 h-4.5" />
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="block w-full pl-11 pr-12 py-3 bg-white/60 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-maroon-500 focus:border-maroon-500 transition-all text-sm shadow-sm"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                </button>
              </div>
            </div>

            {/* Options */}
            <div className="flex items-center justify-between mt-2">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 text-maroon-700 rounded border-gray-300 focus:ring-maroon-500 accent-maroon-700"
                />
                <span className="text-xs text-gray-500 group-hover:text-gray-700 transition-colors font-medium">Remember me</span>
              </label>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm text-center">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-4 bg-maroon-800 hover:bg-maroon-700 text-white font-bold text-sm uppercase tracking-widest rounded-full transition-all duration-300 shadow-lg shadow-maroon-900/20 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed mt-6"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Social Login Separator */}
          <div className="mt-8 flex items-center gap-4">
            <div className="flex-1 border-t border-gray-200" />
            <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Or continue with</span>
            <div className="flex-1 border-t border-gray-200" />
          </div>

          {/* Social Login Buttons */}
          <div className="mt-6 grid grid-cols-2 gap-3">
            <button
              type="button"
              className="flex items-center justify-center gap-2 py-2.5 px-4 bg-white hover:bg-gray-50 border border-gray-200 rounded-xl transition-colors shadow-sm"
            >
              <svg className="w-4.5 h-4.5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              <span className="text-sm font-semibold text-gray-700">Google</span>
            </button>
            <button
              type="button"
              className="flex items-center justify-center gap-2 py-2.5 px-4 bg-[#1877F2] hover:bg-[#166FE5] border border-transparent rounded-xl transition-colors shadow-sm"
            >
              <svg className="w-4.5 h-4.5 fill-white" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              <span className="text-sm font-semibold text-white">Facebook</span>
            </button>
          </div>

          {/* Footer Text */}
          <div className="mt-8 text-center text-sm text-gray-500 font-medium">
            New to Gokul Vivaham?{" "}
            <Link href="/register" className="font-bold text-maroon-700 hover:text-maroon-900 hover:underline transition-colors">
              Create New Account
            </Link>
          </div>
        </div>
        
        {/* Trust Indicators at bottom */}
        <div className="mt-8 flex items-center justify-center gap-6">
          <span className="text-xs text-gray-400 flex items-center gap-1.5 opacity-80 hover:opacity-100 transition-opacity">
            🔒 256-bit SSL
          </span>
          <span className="text-gray-600">|</span>
          <span className="text-xs text-gray-400 flex items-center gap-1.5 opacity-80 hover:opacity-100 transition-opacity">
            🛡️ Privacy Protected
          </span>
        </div>
      </div>
    </div>
  );
}
