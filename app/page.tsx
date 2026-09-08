import Navbar from "@/components/landing/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import TrustStats from "@/components/landing/TrustStats";
import AboutSection from "@/components/landing/AboutSection";
import HowItWorks from "@/components/landing/HowItWorks";
import FeaturesGrid from "@/components/landing/FeaturesGrid";
import AudiencePaths from "@/components/landing/AudiencePaths";
import FAQSection from "@/components/landing/FAQSection";
import FinalCTABanner from "@/components/landing/FinalCTABanner";
import Footer from "@/components/landing/Footer";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-[#F7F8F9] font-sans antialiased text-[#1C2126]">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <TrustStats />
        <AboutSection />
        <HowItWorks />
        <FeaturesGrid />
        <AudiencePaths />
        <FAQSection />
        <FinalCTABanner />
      </main>
      <Footer />
    </div>
  );
}
