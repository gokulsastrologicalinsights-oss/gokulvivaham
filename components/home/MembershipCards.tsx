"use client";

import { useState } from "react";
import { Check, X, Sparkles, Crown, Gem } from "lucide-react";
import { membershipPlans } from "@/lib/data";

const planIcons = {
  silver: "🥈",
  gold: "🥇",
  platinum: "💎",
};

const planGradients = {
  silver: "from-gray-100 to-gray-50 border-gray-200",
  gold: "from-gold-50 to-ivory-100 border-gold-300",
  platinum: "from-maroon-50 to-ivory-100 border-maroon-300",
};

const planBadgeBg = {
  silver: "bg-gray-100 text-gray-500",
  gold: "bg-gold-100 text-gold-700",
  platinum: "bg-maroon-100 text-maroon-700",
};

const planButtonStyle = {
  silver:
    "bg-gray-700 hover:bg-gray-600 text-white shadow-gray-700/20",
  gold:
    "bg-gradient-to-r from-gold-600 to-gold-500 hover:from-gold-500 hover:to-gold-400 text-white shadow-gold-500/30",
  platinum:
    "bg-gradient-to-r from-maroon-800 to-maroon-700 hover:from-maroon-700 hover:to-maroon-600 text-white shadow-maroon-800/30",
};

export default function MembershipCards() {
  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");

  return (
    <section
      className="section-padding bg-ivory-100 relative overflow-hidden"
      id="membership"
    >
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gold-100 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-maroon-100 rounded-full blur-3xl opacity-30 translate-y-1/2 -translate-x-1/2" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14">
          <span className="inline-flex items-center gap-2 text-maroon-700 text-xs font-bold uppercase tracking-widest mb-3 bg-maroon-50 border border-maroon-200 px-4 py-1.5 rounded-full">
            <Crown className="w-3.5 h-3.5" />
            Premium Plans
          </span>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-maroon-900 mb-4">
            Choose Your{" "}
            <span className="bg-gradient-to-r from-maroon-800 to-gold-600 bg-clip-text text-transparent">
              Membership
            </span>
          </h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto mb-8">
            Unlock premium features and find your perfect match faster. All
            plans include a 7-day free trial.
          </p>

          {/* Billing toggle */}
          <div className="inline-flex items-center gap-1 bg-white border border-gray-200 rounded-full p-1 shadow-sm">
            <button
              onClick={() => setBilling("monthly")}
              className={`px-5 py-2 text-sm font-semibold rounded-full transition-all duration-200 cursor-pointer ${
                billing === "monthly"
                  ? "bg-maroon-800 text-white shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBilling("yearly")}
              className={`px-5 py-2 text-sm font-semibold rounded-full transition-all duration-200 cursor-pointer ${
                billing === "yearly"
                  ? "bg-maroon-800 text-white shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Yearly
              <span className="ml-1.5 text-[10px] bg-gold-100 text-gold-700 px-1.5 py-0.5 rounded-full font-bold">
                SAVE 20%
              </span>
            </button>
          </div>
        </div>

        {/* Plan Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-start">
          {membershipPlans.map((plan) => {
            const color = plan.color as keyof typeof planGradients;
            const price =
              billing === "yearly"
                ? Math.round(plan.price * 0.8)
                : plan.price;

            return (
              <div
                key={plan.id}
                className={`relative rounded-3xl border-2 bg-gradient-to-br p-8 transition-all duration-400 hover:shadow-2xl ${
                  plan.popular
                    ? `${planGradients[color]} shadow-xl shadow-gold-200/50 scale-[1.02] hover:scale-[1.04]`
                    : `${planGradients[color]} shadow-md hover:-translate-y-1`
                }`}
              >
                {/* Popular badge */}
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <div className="flex items-center gap-1.5 bg-gradient-to-r from-gold-600 to-gold-500 text-white text-xs font-bold px-5 py-2 rounded-full shadow-lg shadow-gold-500/30 whitespace-nowrap">
                      <Sparkles className="w-3.5 h-3.5" />
                      Most Popular
                    </div>
                  </div>
                )}

                {/* Plan badge */}
                <div
                  className={`inline-flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-full mb-5 ${planBadgeBg[color]}`}
                >
                  <span>{planIcons[color]}</span>
                  <span>{plan.name}</span>
                </div>

                {/* Tamil name */}
                <div
                  className="text-sm text-gray-400 mb-1"
                  style={{ fontFamily: "var(--font-tamil)" }}
                >
                  {plan.nameInTamil} திட்டம்
                </div>

                {/* Price */}
                <div className="mb-6">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-extrabold text-maroon-900">
                      ₹{price.toLocaleString("en-IN")}
                    </span>
                    {billing === "yearly" && (
                      <span className="text-sm text-gray-400 line-through ml-2">
                        ₹{plan.price.toLocaleString("en-IN")}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    for {plan.duration}
                  </p>
                </div>

                {/* Divider */}
                <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent mb-6" />

                {/* Features */}
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-700">{feature}</span>
                    </li>
                  ))}
                  {plan.notIncluded.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-3 opacity-40"
                    >
                      <X className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-500">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <button
                  id={`plan-${plan.name.toLowerCase()}-btn`}
                  className={`w-full py-3.5 font-bold rounded-2xl shadow-lg transition-all duration-300 hover:scale-[1.02] cursor-pointer ${planButtonStyle[color]}`}
                >
                  Get {plan.name} Plan
                </button>

                <p className="text-center text-xs text-gray-400 mt-3">
                  7-day free trial • Cancel anytime
                </p>
              </div>
            );
          })}
        </div>

        {/* Money-back guarantee */}
        <div className="text-center mt-10">
          <p className="text-sm text-gray-500 flex items-center justify-center gap-2">
            <span className="text-green-500">✅</span>
            30-day money-back guarantee • No questions asked
          </p>
        </div>
      </div>
    </section>
  );
}
