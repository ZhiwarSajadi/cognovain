import HeroSection from "@/components/home/hero-section";
import BgGradient from "@/components/ui/common/bg-gradient";
import DemoSection from "@/components/home/demo-section";
import HowIsWorkSection from "@/components/home/how-it-works-section";
import PlansSection from "@/components/home/plans-section";
import FaqSection from "@/components/home/faq-section";
import CTASection from "@/components/home/cta-section";

export default function Home() {
  return (
    <div className="relative w-full">
      <BgGradient />
      <div className="flex flex-col">
        <HeroSection />
      </div>
      <DemoSection />
      <HowIsWorkSection />
      <PlansSection />
      <FaqSection />
      <CTASection />
    </div>
  );
}
