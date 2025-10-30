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

  // Languages available for quests
  const languages = [
    { key: "cpp", label: "C++" },
    { key: "java", label: "Java" },
    { key: "python", label: "Python" },
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
      <div className="flex flex-col md:flex-row justify-between items-start gap-4">
        <div className="space-y-2 animate-slide-up">
          <h1 className="text-3xl md:text-4xl font-bold">
            Welcome back,
            <span className="ml-2 gradient-primary bg-clip-text text-transparent">{userData.username}</span>!
          </h1>
          <p className="text-muted-foreground text-sm md:text-lg">Ready for your next adventure?</p>
        </div>

        <GradientCard className="p-4 flex items-center gap-3" glowEffect>
          <div className="w-14 h-14 rounded-full gradient-primary flex items-center justify-center shadow-glow">
            <Sword className="w-7 h-7 text-primary-foreground" />
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Rank</div>
            <div className="text-lg font-bold">Silver Knight</div>
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

      {/* Language-based mini-games */}
      <div className="space-y-4 animate-slide-up" style={{ animationDelay: '0.4s' }}>
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-gold" />
            Play by Language
          </h2>
          <span className="text-sm text-muted-foreground">Choose a language and a challenge</span>
        </div>

        {/* Language selector */}
        <div className="flex gap-3 mb-2">
          {languages.map((lang) => (
            <button
              key={lang.key}
              onClick={() => navigate(`/quest?lang=${lang.key}`)}
              className="px-3 py-1 rounded-full bg-muted/50 text-sm hover:bg-muted transition-smooth"
            >
              {lang.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {languages.map((lang, idx) => (
            <GradientCard key={lang.key} className="space-y-3" style={{ animationDelay: `${0.2 + idx * 0.08}s` }}>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-lg">{lang.label}</h3>
                  <div className="text-sm text-muted-foreground">Mini-games available: Typing & Fill-in-the-Blank</div>
                </div>
                <div className="text-xs text-muted-foreground">Language</div>
              </div>

              <div className="grid grid-cols-1 gap-3">
                <div className="p-3 rounded-lg bg-muted/50 flex items-center justify-between">
                  <div>
                    <div className="font-semibold">Typing Challenge</div>
                    <div className="text-sm text-muted-foreground">Type code snippets for {lang.label}.</div>
                  </div>
                  <Button size="sm" onClick={() => navigate(`/quest?mode=typing&lang=${lang.key}`)}>Start</Button>
                </div>

                <div className="p-3 rounded-lg bg-muted/50 flex items-center justify-between">
                  <div>
                    <div className="font-semibold">Fill-in-the-Blank</div>
                    <div className="text-sm text-muted-foreground">Complete small code fragments in {lang.label}.</div>
                  </div>
                  <Button size="sm" onClick={() => navigate(`/quest?mode=fill&lang=${lang.key}`)}>Start</Button>
                </div>
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
