import { AboutSection } from "@/components/home/aboutSection";
import { CatalogPreview } from "@/components/home/catalogPreview";
import { Hero } from "@/components/home/hero";
import { HowItWorks } from "@/components/home/howItWorks";

export default function HomePage() {
  return (
    <>
      <Hero />
      <AboutSection />
      <CatalogPreview />
      <HowItWorks />
    </>
  );
}
