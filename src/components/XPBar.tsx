import { Progress } from "@/components/ui/progress";
import { Zap } from "lucide-react";

interface XPBarProps {
  currentXP: number;
  maxXP: number;
  level: number;
}

export const XPBar = ({ currentXP, maxXP, level }: XPBarProps) => {
  const percentage = (currentXP / maxXP) * 100;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-gold text-gold-foreground font-bold">
            <Zap className="w-4 h-4" />
            <span>Level {level}</span>
          </div>
        </div>
        <span className="text-muted-foreground">
          {currentXP} / {maxXP} XP
        </span>
      </div>
      <div className="relative">
        <Progress 
          value={percentage} 
          className="h-3 bg-muted"
        />
        <div 
          className="absolute top-0 left-0 h-3 gradient-gold rounded-full transition-all duration-500 shadow-glow-gold"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
