import {
  ScrollReveal,
  StaggerContainer,
  StaggerItem,
} from "@/components/ui/motion";
import { features } from "@/lib/constants";
import { Camera, Image, Projector } from "lucide-react";

const iconMap = {
  Camera,
  Projector,
  Image,
};

export function Features() {
  return (
    <section id="features" className="py-16 bg-muted">
      <div className="container">
        <ScrollReveal>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Alles, was du für unvergessliche Event-Fotos brauchst
            </h2>
            <p className="text-muted-foreground text-lg">
              Unsere Plattform macht es einfach, Fotos während deiner Events zu
              sammeln, live anzuzeigen und zu teilen – mit Funktionen, die für
              maximale Beteiligung sorgen.
            </p>
          </div>
        </ScrollReveal>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((feature, index) => {
            const IconComponent = iconMap[feature.icon as keyof typeof iconMap];

            return (
              <StaggerItem key={index}>
                <div className="bg-card rounded-xl p-6 h-full border border-border/50 hover:border-primary/50 transition-colors shadow-sm hover:shadow-md">
                  <div className="mb-4 p-3 bg-primary/10 rounded-lg w-fit">
                    {IconComponent && (
                      <IconComponent className="w-6 h-6 text-primary" />
                    )}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      </div>
    </section>
  );
}
