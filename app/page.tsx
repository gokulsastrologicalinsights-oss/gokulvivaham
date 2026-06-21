import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import dynamic from "next/dynamic";
import HeroSection from "@/components/home/HeroSection";

const FeaturedProfiles = dynamic(() => import("@/components/home/FeaturedProfiles"), { ssr: true });
const WhyChooseUs = dynamic(() => import("@/components/home/WhyChooseUs"), { ssr: true });
const MembershipCards = dynamic(() => import("@/components/home/MembershipCards"), { ssr: true });
const SuccessStories = dynamic(() => import("@/components/home/SuccessStories"), { ssr: true });

export default function HomePage() {
  return (
    <main className="flex flex-col min-h-screen">
      <Navbar />
      <HeroSection />
      <FeaturedProfiles />
      <WhyChooseUs />
      <MembershipCards />
      <SuccessStories />
      <Footer />
    </main>
  );
}
