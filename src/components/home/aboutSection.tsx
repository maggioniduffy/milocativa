import { Reveal } from "@/components/motion/reveal";
import { homeContent } from "@/content/home";

export function AboutSection() {
  const { about } = homeContent;

  return (
    <section id={about.anchorId} className="bg-subtle">
      <div className="mx-auto max-w-3xl px-4 py-12 text-center sm:px-6 sm:py-16">
        <Reveal>
          <h2 className="text-2xl font-bold tracking-tight text-copy-primary sm:text-3xl">
            {about.title}
          </h2>
          <p className="mt-4 text-base text-copy-secondary sm:text-lg">
            {about.body}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
