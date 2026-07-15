import { AboutSection } from "@/components/home/aboutSection";
import { CatalogPreview } from "@/components/home/catalogPreview";
import { Hero } from "@/components/home/hero";
import { HowItWorks } from "@/components/home/howItWorks";
import { TopoBackground } from "@/components/layout/topoBackground";

export default function HomePage() {
  return (
    <>
      <TopoBackground />
      <Hero />
      <CatalogPreview />
      <AboutSection />
      <HowItWorks />
    </>
  );
}
