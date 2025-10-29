import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { GradientCard } from "@/components/ui/gradient-card";
import { XPBar } from "@/components/XPBar";
import { 
  Trophy, 
  Award, 
  Target,
  Crown,
  Star,
  Shield,
  Sword,
  Zap,
  ArrowLeft,
  TrendingUp
} from "lucide-react";

const Progress = () => {
  const navigate = useNavigate();

  const userData = {
    username: "CodeWarrior",
    level: 5,
    currentXP: 750,
    maxXP: 1000,
    totalXP: 4750,
    rank: 42,
  };

  const badges = [
    { id: 1, name: "First Steps", description: "Complete your first quest", icon: Star, earned: true, color: "gold" },
    { id: 2, name: "Array Master", description: "Complete 10 array challenges", icon: Trophy, earned: true, color: "success" },
    { id: 3, name: "Loop Legend", description: "Master all loop challenges", icon: Target, earned: true, color: "primary" },
    { id: 4, name: "Debug Detective", description: "Fix 50 bugs", icon: Shield, earned: false, color: "secondary" },
    { id: 5, name: "Speed Coder", description: "Complete a quest in under 5 minutes", icon: Zap, earned: true, color: "gold" },
    { id: 6, name: "Syntax Warrior", description: "Write 1000 lines of code", icon: Sword, earned: false, color: "destructive" },
    { id: 7, name: "Perfect Score", description: "Get 100% on 5 quests", icon: Crown, earned: true, color: "gold" },
    { id: 8, name: "Helping Hand", description: "Help 10 other players", icon: Award, earned: false, color: "success" },
  ];

  const leaderboard = [
    { rank: 1, username: "DragonCoder", level: 15, xp: 15420 },
    { rank: 2, username: "NinjaDevDev", level: 14, xp: 14680 },
    { rank: 3, username: "WizardPro", level: 13, xp: 13950 },
    { rank: 42, username: "CodeWarrior", level: 5, xp: 4750, isCurrentUser: true },
    { rank: 43, username: "ByteBuster", level: 5, xp: 4620 },
    { rank: 44, username: "LogicLord", level: 5, xp: 4580 },
  ];

  const getColorClasses = (color: string) => {
    switch (color) {
      case "gold": return "bg-gold/10 text-gold border-gold/30";
      case "success": return "bg-success/10 text-success border-success/30";
      case "primary": return "bg-primary/10 text-primary border-primary/30";
      case "secondary": return "bg-secondary/10 text-secondary border-secondary/30";
      case "destructive": return "bg-destructive/10 text-destructive border-destructive/30";
      default: return "bg-muted/10 text-muted-foreground border-muted/30";
    }
  };

  return (
    <div className="min-h-screen p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between animate-slide-up">
        <div>
          <Button 
            variant="outline" 
            onClick={() => navigate("/dashboard")}
            className="gap-2 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Button>
          <h1 className="text-4xl font-bold gradient-primary bg-clip-text text-transparent">
            Your Progress
          </h1>
          <p className="text-muted-foreground mt-2">Track your coding journey</p>
        </div>
        
        <GradientCard className="p-4" glowEffect>
          <div className="text-center">
            <div className="text-3xl font-bold gradient-gold bg-clip-text text-transparent">
              #{userData.rank}
            </div>
            <div className="text-sm text-muted-foreground">Global Rank</div>
          </div>
        </GradientCard>
      </div>

      {/* XP Progress */}
      <GradientCard className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
        <XPBar 
          currentXP={userData.currentXP} 
          maxXP={userData.maxXP} 
          level={userData.level} 
        />
        <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
          <TrendingUp className="w-4 h-4" />
          <span>Total XP earned: {userData.totalXP}</span>
        </div>
      </GradientCard>

      {/* Achievements */}
      <div className="space-y-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
        <div className="flex items-center gap-2">
          <Trophy className="w-6 h-6 text-gold" />
          <h2 className="text-2xl font-bold">Achievements</h2>
          <span className="text-muted-foreground text-sm">
            ({badges.filter(b => b.earned).length}/{badges.length} unlocked)
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {badges.map((badge, index) => (
            <GradientCard
              key={badge.id}
              className={`relative overflow-hidden ${
                badge.earned ? "" : "opacity-50 grayscale"
              }`}
              glowEffect={badge.earned}
              style={{ animationDelay: `${0.3 + index * 0.05}s` }}
            >
              {badge.earned && (
                <div className="absolute top-2 right-2">
                  <div className="w-6 h-6 rounded-full gradient-success flex items-center justify-center shadow-glow-success">
                    <Star className="w-3 h-3 text-success-foreground fill-current" />
                  </div>
                </div>
              )}
              
              <div className="text-center space-y-3">
                <div className={`w-16 h-16 mx-auto rounded-full ${getColorClasses(badge.color)} flex items-center justify-center border-2 ${
                  badge.earned ? "shadow-glow" : ""
                }`}>
                  <badge.icon className="w-8 h-8" />
                </div>
                
                <div>
                  <h3 className="font-bold">{badge.name}</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    {badge.description}
                  </p>
                </div>
              </div>
            </GradientCard>
          ))}
        </div>
      </div>

      {/* Leaderboard */}
      <div className="space-y-4 animate-slide-up" style={{ animationDelay: '0.6s' }}>
        <div className="flex items-center gap-2">
          <Crown className="w-6 h-6 text-gold" />
          <h2 className="text-2xl font-bold">Global Leaderboard</h2>
        </div>

        <GradientCard className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-4 font-semibold">Rank</th>
                  <th className="text-left p-4 font-semibold">Player</th>
                  <th className="text-left p-4 font-semibold">Level</th>
                  <th className="text-left p-4 font-semibold">Total XP</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.map((player, index) => (
                  <tr
                    key={index}
                    className={`border-b border-border last:border-0 transition-colors ${
                      player.isCurrentUser
                        ? "bg-primary/5"
                        : "hover:bg-muted/20"
                    }`}
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        {player.rank <= 3 ? (
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                            player.rank === 1 ? "gradient-gold text-gold-foreground shadow-glow-gold" :
                            player.rank === 2 ? "bg-muted text-foreground" :
                            "bg-destructive/20 text-destructive"
                          }`}>
                            {player.rank}
                          </div>
                        ) : (
                          <span className={`font-semibold ${
                            player.isCurrentUser ? "text-primary" : ""
                          }`}>
                            #{player.rank}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`font-semibold ${
                        player.isCurrentUser ? "text-primary" : ""
                      }`}>
                        {player.username}
                        {player.isCurrentUser && (
                          <span className="ml-2 text-xs text-muted-foreground">(You)</span>
                        )}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1">
                        <Zap className="w-4 h-4 text-gold" />
                        <span>{player.level}</span>
                      </div>
                    </td>
                    <td className="p-4 font-semibold">
                      {player.xp.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GradientCard>
      </div>
    </div>
  );
};

export default Progress;
