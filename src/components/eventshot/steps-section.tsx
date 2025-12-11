import { StepItem } from "@/components/eventshot/step-item";

export interface Step {
  title: string;
  text: string;
  icon: React.ReactNode;
}

interface StepsSectionProps {
  steps: Step[];
}

export function StepsSection({ steps }: StepsSectionProps) {
  return (
    <section className="bg-linear-to-t from-background to-muted/30 py-20">
      <div className="max-w-xl mx-auto px-4 text-center space-y-12">
        <h2 className="text-2xl font-semibold">So funktioniert&apos;s</h2>
        <div className="space-y-8">
          {steps.map((step, index) => (
            <StepItem key={index} step={step} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
