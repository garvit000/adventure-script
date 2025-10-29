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
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{
        backgroundImage: `url(${heroBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
      
      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <Sparkles className="absolute top-20 left-20 w-8 h-8 text-primary animate-float opacity-50" />
        <Sparkles className="absolute top-40 right-40 w-6 h-6 text-gold animate-float opacity-60" style={{ animationDelay: '1s' }} />
        <Sparkles className="absolute bottom-20 left-1/3 w-7 h-7 text-success animate-float opacity-40" style={{ animationDelay: '2s' }} />
      </div>

      {/* Login Card */}
      <GradientCard 
        className="w-full max-w-md z-10 animate-scale-in" 
        glowEffect
      >
        <div className="text-center mb-8">
          <div className="flex justify-center gap-3 mb-4">
            <Sword className="w-12 h-12 text-primary animate-float" />
            <Shield className="w-12 h-12 text-secondary animate-float" style={{ animationDelay: '0.5s' }} />
          </div>
          <h1 className="text-4xl font-bold mb-2 gradient-primary bg-clip-text text-transparent">
            Code Adventure RPG
          </h1>
          <p className="text-muted-foreground">
            {isLogin ? "Welcome back, hero!" : "Begin your coding quest"}
          </p>
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
              placeholder="your@email.com"
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
            className="w-full gradient-primary hover:opacity-90 transition-smooth shadow-glow"
            size="lg"
            disabled={loading}
          >
            {loading ? (isLogin ? "Signing in..." : "Creating...") : (isLogin ? "Start Quest" : "Create Hero")}
          </Button>

          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={handleGuestLogin}
          >
            Continue as Guest
          </Button>

          <div className="text-center">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm text-primary hover:underline"
            >
              {isLogin ? "Need an account? Sign up" : "Already have an account? Login"}
            </button>
          </div>
        </form>
      </GradientCard>
    </div>
  );
};

export default Login;
