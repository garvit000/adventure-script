import { cn } from "@/lib/utils";
import { ReactNode, CSSProperties } from "react";

interface GradientCardProps {
  children: ReactNode;
  className?: string;
  glowEffect?: boolean;
  animated?: boolean;
  style?: CSSProperties;
}

export const GradientCard = ({ 
  children, 
  className, 
  glowEffect = false,
  animated = true,
  style
}: GradientCardProps) => {
  return (
    <div
      className={cn(
        "bg-card rounded-lg p-6 gradient-card border border-primary/20",
        glowEffect && "shadow-glow",
        animated && "transition-smooth hover:scale-105 hover:shadow-card",
        className
      )}
      style={style}
    >
      {children}
    </div>
  );
};
