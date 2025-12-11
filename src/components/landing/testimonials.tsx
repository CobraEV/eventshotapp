import {
  ScrollReveal,
  StaggerContainer,
  StaggerItem,
} from "@/components/ui/motion";
import { testimonials } from "@/lib/constants";
import { QuoteIcon } from "lucide-react";
import TestimonialsBg from "./testimonials-bg";

export function Testimonials() {
  return (
    <section id="testimonials" className="py-16 relative overflow-hidden">
      <TestimonialsBg />

      <div className="container relative z-10">
        <ScrollReveal>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Das sagen unsere Kunden
            </h2>
            <p className="text-muted-foreground text-lg">
              EventShot hat bereits unzählige Veranstaltungen mit
              unvergesslichen Foto-Erlebnissen bereichert.
            </p>
          </div>
        </ScrollReveal>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {testimonials.map((testimonial, index) => (
            <StaggerItem key={index}>
              <div className="bg-card rounded-xl p-6 h-full border border-border shadow-sm relative">
                <QuoteIcon className="absolute top-6 right-6 h-8 w-8 text-primary/10" />

                <p className="mb-6 text-muted-foreground italic relative">
                  &quot;{testimonial.quote}&quot;
                </p>

                <div className="flex items-center gap-4">
                  <div>
                    <h4 className="font-semibold">{testimonial.author}</h4>
                    <p className="text-sm text-muted-foreground">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
