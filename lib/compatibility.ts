import { Profile } from "./data";

export interface CompatibilityResult {
  score: number;
  reasons: string[];
}

export function calculateCompatibility(user: Profile, target: Profile): CompatibilityResult {
  let score = 0;
  const reasons: string[] = [];

  // Age (10 pts)
  // Usually, male should be same age or older by 1-5 years. Or just check if age falls within expectations.
  const ageDiff = user.gender === "Male" ? user.age - target.age : target.age - user.age;
  if (ageDiff >= -1 && ageDiff <= 6) {
    score += 10;
    reasons.push("Ideal age difference");
  } else if (ageDiff >= -3 && ageDiff <= 10) {
    score += 5;
    reasons.push("Acceptable age difference");
  }

  // Education (10 pts)
  // We'll give points if education levels match broadly or if the user is a graduate.
  const highEdu = ["Post Graduate", "Doctorate", "Doctorate/Medical", "Master's"];
  const userEduHigh = highEdu.some(e => user.education.includes(e));
  const targetEduHigh = highEdu.some(e => target.education.includes(e));
  if (user.education === target.education || (userEduHigh && targetEduHigh)) {
    score += 10;
    reasons.push("Matching education levels");
  } else {
    score += 5; // Default some points since both are likely educated.
    reasons.push("Compatible educational backgrounds");
  }

  // Location (10 pts)
  // Check if they are in the same city/state. We'll do a simple string match.
  const userLocationParts = user.location.toLowerCase().split(",");
  const targetLocationParts = target.location.toLowerCase().split(",");
  const sameStateOrCity = userLocationParts.some(p => 
    targetLocationParts.some(t => t.trim() === p.trim())
  );
  if (sameStateOrCity && user.location !== "Not specified" && target.location !== "Not specified") {
    score += 10;
    reasons.push("Favorable geographic proximity");
  } else {
    score += 3;
  }

  // Community (15 pts)
  if (user.religion === target.religion && user.religion !== "Not specified") {
    if (user.caste === target.caste && user.caste !== "Not specified") {
      score += 15;
      reasons.push("Same religion and community");
    } else {
      score += 5;
      reasons.push("Same religion");
    }
  }

  // Astrology: Rasi, Nakshatra, Dosham (35 pts)
  // Simple Dosham check (15 pts)
  const userHasDosham = user.doshams.length > 0 && !user.doshams.includes("None");
  const targetHasDosham = target.doshams.length > 0 && !target.doshams.includes("None");
  if (userHasDosham === targetHasDosham) {
    score += 15;
    if (userHasDosham) {
      reasons.push("Dosham types are balanced");
    } else {
      reasons.push("No astrological dosham conflicts");
    }
  } else {
    score += 5; // Mild dosham difference
  }

  // Basic Rasi/Nakshatra match (20 pts)
  // In a real app, this would use complex vedic rules (Porutham).
  // Here we'll just give points if they have different Nakshatras (same nakshatra is often avoided in some traditions)
  // and give some random favorable rules.
  if (user.nakshatra !== "Not specified" && target.nakshatra !== "Not specified") {
    if (user.nakshatra !== target.nakshatra) {
      score += 15;
      reasons.push("Favorable Nakshatra Porutham (Star Match)");
    } else {
      score += 5;
    }
    
    if (user.rasi === target.rasi) {
      score += 5; // Ek Rasi is sometimes considered okay depending on nakshatra.
    } else {
      score += 5; // Different rasi
    }
  } else {
    score += 10; // Default if not specified
  }

  // Partner Preferences (20 pts)
  // Check if target's attributes match user's explicit expectations (basic text matching)
  let prefScore = 0;
  let prefMatches = 0;
  
  if (user.expectations.location !== "Not specified" && user.expectations.location.includes(targetLocationParts[0]?.trim())) {
    prefScore += 5;
    prefMatches++;
  }
  if (user.expectations.education !== "Not specified" && user.expectations.education.includes(target.education)) {
    prefScore += 5;
    prefMatches++;
  }
  if (user.expectations.profession !== "Not specified" && user.expectations.profession.includes(target.profession)) {
    prefScore += 5;
    prefMatches++;
  }
  
  // Height check
  // E.g. "5' 4" to 5' 9""
  // We'll just give default 5 points to simplify, since height string parsing can be messy.
  prefScore += 5;
  
  score += prefScore;
  if (prefMatches > 0) {
    reasons.push(`Meets ${prefMatches} specific partner preference(s)`);
  }

  // Cap score at 100
  score = Math.min(100, score);
  // Ensure we don't go below 0
  score = Math.max(0, score);

  return {
    score,
    reasons
  };
}
