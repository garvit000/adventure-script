import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GradientCard } from "@/components/ui/gradient-card";
import { Sword, Shield, Sparkles } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import heroBg from "@/assets/hero-bg.jpg";

// Using a Java backend for auth via JDBC. Backend base URL can be configured with VITE_API_BASE_URL
const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:7000";

const Login = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const callApi = async (path: string, payload: Record<string, unknown>) => {
    const response = await fetch(`${API_BASE}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const rawText = await response.text();
    let data: any = null;
    if (rawText) {
      try {
        data = JSON.parse(rawText);
      } catch (parseError) {
        console.error("Failed to parse JSON", parseError, rawText);
        throw new Error("Server returned invalid JSON. Check backend logs for details.");
      }
    }

    const ok = response.ok;
    if (!ok) {
      const message = data?.error || data?.message || rawText || response.statusText || "Request failed";
      throw new Error(message);
    }

    return data ?? {};
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isLogin) {
        await callApi("/api/login", { email: formData.email, password: formData.password });
        toast({ title: "Welcome back, adventurer!", description: "Your quest continues..." });
      } else {
        await callApi("/api/register", {
          username: formData.username,
          email: formData.email,
          password: formData.password,
        });
        toast({ title: "Account created!", description: "Your coding adventure begins now!" });
      }

      navigate("/dashboard");
    } catch (err: any) {
      const message = err?.message || "Authentication failed";
      toast({ title: "Error", description: message });
    } finally {
      setLoading(false);
    }
  };

  const handleGuestLogin = () => {
    toast({
      title: "Guest mode activated",
      description: "Exploring as a guest adventurer",
    });
    navigate("/dashboard");
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-6 bg-background text-foreground"
      style={{
        backgroundImage: `url(${heroBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />

      <div className="relative z-10 w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        {/* Left promo panel */}
        <div className="hidden md:flex flex-col gap-6 p-8 rounded-2xl gradient-card shadow-card animate-slide-up">
          <div className="flex items-center gap-3">
            <Sword className="w-12 h-12 text-primary" />
            <div>
              <h2 className="text-3xl font-extrabold gradient-primary bg-clip-text text-transparent">Code Adventure RPG</h2>
              <p className="text-muted-foreground">Learn to code through short, gamified quests. Earn XP, level up, and show off your skills.</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="p-3 rounded-lg bg-success/10">
                <Sparkles className="w-5 h-5 text-success" />
              </div>
              <div>
                <div className="font-semibold">Daily Challenges</div>
                <div className="text-sm text-muted-foreground">Bite-sized tasks to practice and improve.</div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-3 rounded-lg bg-primary/10">
                <Shield className="w-5 h-5 text-primary" />
              </div>
              <div>
                <div className="font-semibold">Progress Tracking</div>
                <div className="text-sm text-muted-foreground">Your progress is saved to the backend for persistence.</div>
              </div>
            </div>
          </div>
        </div>

        {/* Form panel */}
        <GradientCard className="p-8 z-20 animate-scale-in" glowEffect>
          <div className="flex flex-col items-center text-center mb-6">
            <div className="flex items-center gap-3 mb-3">
              <Sword className="w-10 h-10 text-primary" />
              <Shield className="w-10 h-10 text-secondary" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold mb-1">{isLogin ? "Welcome back" : "Create your hero"}</h1>
            <p className="text-muted-foreground">{isLogin ? "Sign in to continue your adventure." : "Create an account to save progress."}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  placeholder="Choose your hero name"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="bg-muted/50 border-primary/20"
                  required
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@domain.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="bg-muted/50 border-primary/20"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="bg-muted/50 border-primary/20"
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full gradient-primary hover:opacity-95 transition-smooth shadow-glow"
              size="lg"
              disabled={loading}
            >
              {loading ? (isLogin ? "Signing in..." : "Creating...") : (isLogin ? "Sign in" : "Create account")}
            </Button>

            <div className="flex gap-3">
              <Button type="button" variant="outline" className="flex-1" onClick={handleGuestLogin}>
                Continue as Guest
              </Button>
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-sm text-primary underline-offset-2 hover:underline"
              >
                {isLogin ? "Sign up" : "Login"}
              </button>
            </div>
          </form>
        </GradientCard>
      </div>
    </div>
  );
};

export default Login;
