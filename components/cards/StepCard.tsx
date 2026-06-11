import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

type StepCardProps = {
  icon: LucideIcon;
  step: string;
  title: string;
  desc: string;
};

export default function StepCard({
  icon: Icon,
  step,
  title,
  desc,
}: StepCardProps) {
  return (
    <Card className="relative bg-white border border-[#FBCFE8] hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      
      <CardContent className="p-8">

        {/* Top row */}
        <div className="flex items-center justify-between mb-6">
          <Icon className="w-7 h-7 text-[#E11D48]" />

          <span className="text-5xl font-serif text-[#FBCFE8]">
            {step}
          </span>
        </div>

        {/* Content */}
        <h3 className="text-base font-bold text-[#2B1B22] mb-2">
          {title}
        </h3>

        <p className="text-sm text-[#5A3B45] leading-relaxed">
          {desc}
        </p>

      </CardContent>
    </Card>
  );
}