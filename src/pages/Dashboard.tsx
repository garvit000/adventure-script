import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { GradientCard } from "@/components/ui/gradient-card";
import { XPBar } from "@/components/XPBar";
import { 
  Sword, 
  Trophy, 
  Target, 
  Sparkles, 
  Code2, 
  Zap,
  BookOpen,
  Users
} from "lucide-react";

const Dashboard = () => {
  const navigate = useNavigate();
  
  // Mock user data
  const userData = {
    username: "CodeWarrior",
    level: 5,
    currentXP: 750,
    maxXP: 1000,
    completedQuests: 12,
    totalQuests: 50,
  };

  const dailyQuests = [
    {
      id: 1,
      title: "Array Master",
      description: "Complete 3 array manipulation challenges",
      difficulty: "Easy",
      xpReward: 100,
      icon: Code2,
      color: "success",
    },
    {
      id: 2,
      title: "Loop Legend",
      description: "Solve the mysterious loop puzzle",
      difficulty: "Medium",
      xpReward: 200,
      icon: Target,
      color: "primary",
    },
    {
      id: 3,
      title: "Debug Dungeon",
      description: "Find and fix 5 bugs in legacy code",
      difficulty: "Hard",
      xpReward: 350,
      icon: Sparkles,
      color: "gold",
    },
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy": return "text-success";
      case "Medium": return "text-primary";
      case "Hard": return "text-destructive";
      default: return "text-foreground";
    }
  };

  return (
    <div className="min-h-screen p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div className="space-y-2 animate-slide-up">
          <h1 className="text-4xl font-bold">
            Welcome back, <span className="gradient-primary bg-clip-text text-transparent">{userData.username}</span>!
          </h1>
          <p className="text-muted-foreground text-lg">Ready for your next adventure?</p>
        </div>
        
        <GradientCard className="p-4" glowEffect>
          <div className="flex items-center gap-3">
            <div className="w-16 h-16 rounded-full gradient-primary flex items-center justify-center shadow-glow">
              <Sword className="w-8 h-8 text-primary-foreground" />
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Rank</div>
              <div className="text-xl font-bold">Silver Knight</div>
            </div>
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
      </GradientCard>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
        <GradientCard className="flex items-center gap-4">
          <div className="p-3 rounded-full bg-success/10">
            <Trophy className="w-6 h-6 text-success" />
          </div>
          <div>
            <div className="text-2xl font-bold">{userData.completedQuests}</div>
            <div className="text-sm text-muted-foreground">Quests Completed</div>
          </div>
        </GradientCard>

        <GradientCard className="flex items-center gap-4">
          <div className="p-3 rounded-full bg-primary/10">
            <Zap className="w-6 h-6 text-primary" />
          </div>
          <div>
            <div className="text-2xl font-bold">{userData.currentXP}</div>
            <div className="text-sm text-muted-foreground">Total XP</div>
          </div>
        </GradientCard>

        <GradientCard className="flex items-center gap-4">
          <div className="p-3 rounded-full bg-gold/10">
            <Target className="w-6 h-6 text-gold" />
          </div>
          <div>
            <div className="text-2xl font-bold">#{Math.floor(Math.random() * 100)}</div>
            <div className="text-sm text-muted-foreground">Global Rank</div>
          </div>
        </GradientCard>
      </div>

      {/* Main Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-slide-up" style={{ animationDelay: '0.3s' }}>
        <GradientCard glowEffect className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-full gradient-primary shadow-glow">
              <Sword className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h3 className="text-xl font-bold">Start New Quest</h3>
              <p className="text-sm text-muted-foreground">Begin your coding adventure</p>
            </div>
          </div>
          <Button 
            className="w-full gradient-primary hover:opacity-90 transition-smooth"
            size="lg"
            onClick={() => navigate("/quest")}
          >
            Enter Quest
          </Button>
        </GradientCard>

        <GradientCard className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-full gradient-success shadow-glow-success">
              <Trophy className="w-6 h-6 text-success-foreground" />
            </div>
            <div>
              <h3 className="text-xl font-bold">View Progress</h3>
              <p className="text-sm text-muted-foreground">Check your achievements</p>
            </div>
          </div>
          <Button 
            className="w-full bg-success hover:bg-success/90 text-success-foreground"
            size="lg"
            onClick={() => navigate("/progress")}
          >
            View Achievements
          </Button>
        </GradientCard>
      </div>

      {/* Daily Quests */}
      <div className="space-y-4 animate-slide-up" style={{ animationDelay: '0.4s' }}>
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-gold" />
            Today's Quests
          </h2>
          <span className="text-sm text-muted-foreground">Resets in 8h 23m</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {dailyQuests.map((quest, index) => (
            <GradientCard 
              key={quest.id}
              className="space-y-3"
              style={{ animationDelay: `${0.5 + index * 0.1}s` }}
            >
              <div className="flex items-start justify-between">
                <div className={`p-3 rounded-full bg-${quest.color}/10`}>
                  <quest.icon className={`w-6 h-6 text-${quest.color}`} />
                </div>
                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${getDifficultyColor(quest.difficulty)}`}>
                  {quest.difficulty}
                </span>
              </div>
              
              <div>
                <h3 className="font-bold text-lg">{quest.title}</h3>
                <p className="text-sm text-muted-foreground">{quest.description}</p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-border">
                <div className="flex items-center gap-1 text-gold">
                  <Zap className="w-4 h-4" />
                  <span className="font-semibold">{quest.xpReward} XP</span>
                </div>
                <Button size="sm" variant="outline">
                  Start
                </Button>
              </div>
            </GradientCard>
          ))}
        </div>
      </div>

      {/* Additional Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-slide-up" style={{ animationDelay: '0.8s' }}>
        <Button 
          variant="outline" 
          size="lg"
          className="h-20"
        >
          <Users className="w-5 h-5 mr-2" />
          View Leaderboard
        </Button>
        <Button 
          variant="outline" 
          size="lg"
          className="h-20"
        >
          <BookOpen className="w-5 h-5 mr-2" />
          Learning Path
        </Button>
      </div>
    </div>
  );
};

export default Dashboard;
