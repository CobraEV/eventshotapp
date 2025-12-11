"use client";

import { motion } from "framer-motion";
import type { Step } from "./steps-section";

interface Props {
  step: Step;
  index: number;
}

export function StepItem({ step, index }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="flex flex-col items-center gap-3 border border-border bg-secondary/30 rounded-2xl px-6 py-8 shadow-sm"
    >
      <div className="relative">
        <div className="bg-primary/10 p-4 rounded-full">{step.icon}</div>
      </div>
      <h4 className="text-base font-semibold">{step.title}</h4>
      <p className="text-sm text-muted-foreground">{step.text}</p>
    </motion.div>
  );
}
