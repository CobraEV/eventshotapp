import { ScrollReveal } from "@/components/ui/motion";

export function Video() {
  return (
    <section id="gallery" className="py-16 bg-muted/50">
      <div className="container">
        <ScrollReveal>
          <div className="text-center max-w-3xl mx-auto mb-4">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Erlebe EventShot live
            </h2>
            <p className="text-muted-foreground text-lg">
              Sieh dir an, wie EventShot echte Momente auf Events in Echtzeit
              zum Leben erweckt.
            </p>
          </div>
        </ScrollReveal>

        <div className="relative max-w-4xl mx-auto rounded-2xl overflow-hidden shadow-xl">
          <video
            src="/eventshot-demo.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-auto rounded-2xl"
          />
        </div>
      </div>
    </section>
  );
}
