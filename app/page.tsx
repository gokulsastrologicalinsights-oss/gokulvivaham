import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/home/HeroSection";
import FeaturedProfiles from "@/components/home/FeaturedProfiles";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import MembershipCards from "@/components/home/MembershipCards";
import SuccessStories from "@/components/home/SuccessStories";

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
