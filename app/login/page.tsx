"use client";

import { useState } from "react";
import {
  Heart,
  Eye,
  EyeOff,
  Mail,
  Lock,
  ArrowRight,
  Phone,
} from "lucide-react";

export default function LoginPage() {
  const [loginMethod, setLoginMethod] = useState<"email" | "phone">("email");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate loading
    setTimeout(() => setIsLoading(false), 1500);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left — Decorative Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-maroon-950 via-maroon-900 to-maroon-800 relative overflow-hidden flex-col items-center justify-center p-12">
        {/* Background patterns */}
        <div className="absolute inset-0 hero-pattern" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold-400/50 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold-400/50 to-transparent" />

        {/* Decorative circles */}
        <div className="absolute top-1/4 -left-16 w-80 h-80 border border-gold-400/10 rounded-full" />
        <div className="absolute top-1/4 -left-24 w-96 h-96 border border-gold-400/5 rounded-full" />
        <div className="absolute bottom-1/4 -right-16 w-80 h-80 border border-gold-400/10 rounded-full" />

        {/* Floating decorative elements */}
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="absolute text-gold-500/10 text-7xl select-none"
            style={{
              top: `${10 + i * 20}%`,
              left: `${5 + (i % 2) * 70}%`,
              transform: `rotate(${i * 45}deg)`,
            }}
          >
            ❋
          </div>
        ))}

        {/* Content */}
        <div className="relative z-10 text-center max-w-md">
          {/* Logo */}
          <div className="flex items-center justify-center gap-3 mb-10">
            <div className="w-14 h-14 rounded-full bg-gold-500/20 border-2 border-gold-400/30 flex items-center justify-center shadow-2xl">
              <Heart className="w-7 h-7 text-gold-400 fill-current" />
            </div>
            <div className="text-left">
              <div className="font-extrabold text-2xl text-white">
                Gokul <span className="text-gold-400">Vivaham</span>
              </div>
              <div
                className="text-xs text-gold-300/70 tracking-widest"
                style={{ fontFamily: "var(--font-tamil)" }}
              >
                கோகுல் விவாஹம்
              </div>
            </div>
          </div>

          <h2 className="text-4xl font-extrabold text-white mb-5 leading-tight">
            Welcome Back to Your{" "}
            <span className="bg-gradient-to-r from-gold-400 to-gold-300 bg-clip-text text-transparent">
              Journey
            </span>
          </h2>
          <p className="text-gray-400 text-base leading-relaxed mb-10">
            Your perfect Tamil match is waiting. Sign in to continue your
            matrimony journey with thousands of verified profiles.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { value: "5L+", label: "Profiles" },
              { value: "50K+", label: "Marriages" },
              { value: "4.9★", label: "Rating" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="bg-white/5 border border-white/10 rounded-2xl p-4"
              >
                <div className="text-2xl font-extrabold text-gold-400">
                  {stat.value}
                </div>
                <div className="text-xs text-gray-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right — Login Form */}
      <div className="flex-1 flex flex-col items-center justify-center bg-ivory-100 px-4 sm:px-8 py-12">
        {/* Mobile logo */}
        <div className="lg:hidden flex items-center gap-2.5 mb-8">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-maroon-900 to-maroon-700 flex items-center justify-center shadow-lg">
            <Heart className="w-5 h-5 text-gold-400 fill-current" />
          </div>
          <div>
            <div className="font-bold text-lg text-maroon-900">
              Gokul <span className="text-gold-500">Vivaham</span>
            </div>
          </div>
        </div>

        {/* Card */}
        <div className="w-full max-w-md">
          <div className="bg-white rounded-3xl shadow-2xl shadow-maroon-100/40 border border-ivory-300 p-8 sm:p-10">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-extrabold text-maroon-900 mb-2">
                Sign In
              </h1>
              <p className="text-gray-500 text-sm">
                Don't have an account?{" "}
                <a
                  href="/register"
                  className="text-gold-600 font-semibold hover:text-gold-700 hover:underline"
                >
                  Register Free
                </a>
              </p>
            </div>

            {/* Login method toggle */}
            <div className="flex bg-gray-100 rounded-2xl p-1 mb-6 gap-1">
              <button
                id="login-email-tab"
                type="button"
                onClick={() => setLoginMethod("email")}
                className={`flex-1 py-2.5 text-sm font-semibold rounded-xl flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer ${
                  loginMethod === "email"
                    ? "bg-white text-maroon-800 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <Mail className="w-4 h-4" />
                Email
              </button>
              <button
                id="login-phone-tab"
                type="button"
                onClick={() => setLoginMethod("phone")}
                className={`flex-1 py-2.5 text-sm font-semibold rounded-xl flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer ${
                  loginMethod === "phone"
                    ? "bg-white text-maroon-800 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <Phone className="w-4 h-4" />
                Phone
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email / Phone Input */}
              <div>
                <label
                  htmlFor="login-identifier"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  {loginMethod === "email" ? "Email Address" : "Phone Number"}
                </label>
                <div className="relative">
                  {loginMethod === "email" ? (
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
                  ) : (
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
                  )}
                  <input
                    id="login-identifier"
                    type={loginMethod === "email" ? "email" : "tel"}
                    placeholder={
                      loginMethod === "email"
                        ? "your@email.com"
                        : "+91 98765 43210"
                    }
                    className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-maroon-400 focus:ring-2 focus:ring-maroon-100 transition-all duration-200 text-sm"
                    autoComplete={loginMethod === "email" ? "email" : "tel"}
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <label
                  htmlFor="login-password"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
                  <input
                    id="login-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    className="w-full pl-11 pr-12 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-maroon-400 focus:ring-2 focus:ring-maroon-100 transition-all duration-200 text-sm"
                    autoComplete="current-password"
                  />
                  <button
                    id="toggle-password-btn"
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4.5 h-4.5" />
                    ) : (
                      <Eye className="w-4.5 h-4.5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Remember me + Forgot password */}
              <div className="flex items-center justify-between">
                <label
                  htmlFor="remember-me"
                  className="flex items-center gap-2.5 cursor-pointer group"
                >
                  <input
                    id="remember-me"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 text-maroon-700 focus:ring-maroon-400 cursor-pointer"
                  />
                  <span className="text-sm text-gray-600 group-hover:text-gray-800 transition-colors">
                    Remember me
                  </span>
                </label>
                <a
                  href="/forgot-password"
                  className="text-sm text-maroon-600 font-semibold hover:text-maroon-800 hover:underline transition-colors"
                >
                  Forgot password?
                </a>
              </div>

              {/* Submit button */}
              <button
                id="login-submit-btn"
                type="submit"
                disabled={isLoading}
                className="w-full py-4 bg-gradient-to-r from-maroon-900 to-maroon-800 hover:from-maroon-800 hover:to-maroon-700 text-white font-bold text-base rounded-2xl shadow-lg shadow-maroon-900/20 hover:shadow-maroon-900/30 transition-all duration-300 hover:scale-[1.01] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2.5 cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-4 my-6">
              <div className="flex-1 h-px bg-gray-100" />
              <span className="text-xs text-gray-400 font-medium">
                Or sign in with
              </span>
              <div className="flex-1 h-px bg-gray-100" />
            </div>

            {/* Social login */}
            <div className="grid grid-cols-2 gap-3">
              <button
                id="login-google-btn"
                type="button"
                className="flex items-center justify-center gap-2.5 py-3 bg-white border border-gray-200 hover:border-gray-300 hover:bg-gray-50 rounded-2xl text-sm font-medium text-gray-700 transition-all duration-200 shadow-sm cursor-pointer"
              >
                <svg className="w-4.5 h-4.5" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Google
              </button>
              <button
                id="login-facebook-btn"
                type="button"
                className="flex items-center justify-center gap-2.5 py-3 bg-[#1877F2] hover:bg-[#166FE5] rounded-2xl text-sm font-medium text-white transition-all duration-200 shadow-sm cursor-pointer"
              >
                <svg className="w-4.5 h-4.5 fill-white" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                Facebook
              </button>
            </div>

            {/* Register link */}
            <p className="text-center text-sm text-gray-500 mt-6">
              New to Gokul Vivaham?{" "}
              <a
                href="/register"
                className="text-maroon-700 font-bold hover:text-maroon-900 hover:underline transition-colors"
              >
                Create Free Profile →
              </a>
            </p>
          </div>

          {/* Trust indicators */}
          <div className="flex items-center justify-center gap-6 mt-6">
            <span className="text-xs text-gray-400 flex items-center gap-1.5">
              🔒 SSL Secured
            </span>
            <span className="text-gray-200">|</span>
            <span className="text-xs text-gray-400 flex items-center gap-1.5">
              ✅ 100% Verified
            </span>
            <span className="text-gray-200">|</span>
            <span className="text-xs text-gray-400 flex items-center gap-1.5">
              🛡️ Privacy Protected
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
