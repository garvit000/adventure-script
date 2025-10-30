import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { GradientCard } from "@/components/ui/gradient-card";
import { Textarea } from "@/components/ui/textarea";
import { 
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Zap,
  Lightbulb,
  Trophy
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:7000";

const typingSnippetsByLang: Record<string, string[]> = {
  java: [
    `for (int i = 0; i < n; i++) { System.out.println(arr[i]); }`,
    `if (x > 0) { return x * factorial(x - 1); } else { return 1; }`,
    `List<String> names = Arrays.asList("Alice","Bob","Eve"); names.forEach(System.out::println);`,
    `try { BufferedReader r = new BufferedReader(new FileReader("in.txt")); String line = r.readLine(); r.close(); } catch (Exception e) { e.printStackTrace(); }`
  ],
  cpp: [
    `for (int i = 0; i < n; ++i) { std::cout << arr[i] << std::endl; }`,
    `if (x > 0) return x * factorial(x - 1); else return 1;`,
    `std::vector<std::string> names = {"Alice","Bob","Eve"}; for (auto &n : names) std::cout << n << std::endl;`,
    `try { /* C++ exceptions example */ } catch (const std::exception &e) { std::cerr << e.what(); }`
  ],
  python: [
    `for i in range(n): print(arr[i])`,
    `def factorial(x):\n    return x * factorial(x-1) if x>0 else 1`,
    `names = ["Alice","Bob","Eve"]\nfor n in names:\n    print(n)`,
    `try:\n    with open('in.txt') as f:\n        print(f.readline())\nexcept Exception as e:\n    print(e)`
  ]
};

const fillBlankTemplatesByLang: Record<string, { code: string; blanks: string[] }> = {
  java: {
    code: `public class Main {\n  public static void main(String[] args) {\n    int sum = 0;\n    int[] data = {1, 2, 3, 4};\n    // fill blanks below\n    for (int i = 0; i < ___; i++) {\n      sum += ___;\n    }\n    System.out.println(sum);\n  }\n}`,
    blanks: ["data.length", "data[i]"]
  },
  cpp: {
    code: `#include <iostream>\nint main() {\n  int sum = 0;\n  int data[] = {1,2,3,4};\n  // fill blanks below\n  for (int i = 0; i < ___; ++i) {\n    sum += ___;\n  }\n  std::cout << sum << std::endl;\n  return 0;\n}`,
    blanks: ["sizeof(data)/sizeof(data[0])", "data[i]"]
  },
  python: {
    code: `def main():\n  sum = 0\n  data = [1,2,3,4]\n  # fill blanks below\n  for i in range(___):\n    sum += ___\n  print(sum)\n\nif __name__ == '__main__':\n  main()`,
    blanks: ["len(data)", "data[i]"]
  }
};

const Quest = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialMode = (searchParams.get("mode") as "typing" | "fill") || "typing";
  const initialLang = searchParams.get("lang") || "java";
  const [selected, setSelected] = useState<"typing" | "fill">(initialMode);
  const [language, setLanguage] = useState<string>(initialLang);

  // simple email storage so progress can be tied to a user in DB
  const [email, setEmail] = useState(() => localStorage.getItem("playerEmail") || "");

  // Typing quest state
  const [snippetIndex, setSnippetIndex] = useState(0);
  const [typed, setTyped] = useState("");
  const [typingProgress, setTypingProgress] = useState(0);

  // Fill-in-the-blank state
  const [blanks, setBlanks] = useState<string[]>(() => {
    const tmpl = fillBlankTemplatesByLang[initialLang] ?? fillBlankTemplatesByLang.java;
    return tmpl.blanks.map(() => "");
  });
  const [fillProgress, setFillProgress] = useState(0);

  const typingInputRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    localStorage.setItem("playerEmail", email);
  }, [email]);

  useEffect(() => {
    // recalc typing progress when typed or snippet changes
    const snippets = typingSnippetsByLang[language] ?? typingSnippetsByLang.java;
    const target = snippets[snippetIndex % snippets.length];
    const correct = countCorrectPrefix(target, typed);
    const pct = Math.floor((correct / target.length) * 100);
    setTypingProgress(pct);
    saveProgress(email, `typing-${language}-${snippetIndex}`, pct, JSON.stringify({ typed }));
  }, [typed, snippetIndex]);

  useEffect(() => {
    // recalc fill progress
    const tmpl = fillBlankTemplatesByLang[language] ?? fillBlankTemplatesByLang.java;
    const total = tmpl.blanks.length;
    let correct = 0;
    for (let i = 0; i < total; i++) {
      if ((blanks[i] || "").trim() === tmpl.blanks[i]) correct++;
    }
    const pct = Math.floor((correct / total) * 100);
    setFillProgress(pct);
    saveProgress(email, `fill-${language}-1`, pct, JSON.stringify({ answers: blanks }));
  }, [blanks]);

  function countCorrectPrefix(target: string, typedStr: string) {
    let i = 0;
    while (i < typedStr.length && i < target.length && typedStr[i] === target[i]) i++;
    return i;
  }

  async function saveProgress(emailVal: string, questId: string, progress: number, data: string) {
    if (!emailVal) return; // require email to save
    try {
      await fetch(`${API_BASE}/api/progress`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailVal, questId, progress, data }),
      });
    } catch (e) {
      // ignore silently for now
      console.error("Failed to save progress", e);
    }
  }

  const handleTypingChange = (v: string) => {
    setTyped(v);
  };

  const handleNextSnippet = () => {
    const snippets = typingSnippetsByLang[language] ?? typingSnippetsByLang.java;
    setSnippetIndex((s) => (s + 1) % snippets.length);
    setTyped("");
    if (typingInputRef.current) typingInputRef.current.focus();
  };

  const handleFillChange = (index: number, val: string) => {
    setBlanks((prev) => {
      const next = [...prev];
      next[index] = val;
      return next;
    });
  };

  const handleComplete = (quest: string) => {
    toast({ title: "Quest Complete", description: `Saved progress for ${quest}` });
  };

  return (
    <div className="min-h-screen p-6 space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={() => navigate("/dashboard")}> 
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Button>
        <div className="flex items-center gap-3">
          <div className="text-sm text-muted-foreground">Player Email (saved locally):</div>
          <input
            className="px-3 py-1 rounded border"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <GradientCard className="p-4">
          <h3 className="font-bold text-lg">Available Quests</h3>
          <div className="mt-4 space-y-3">
            <div className={`p-3 rounded-lg ${selected === 'typing' ? 'bg-primary/10' : 'bg-muted/50'}`}>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold">Typing Challenge</div>
                  <div className="text-sm text-muted-foreground">Type code snippets accurately. Language: {language.toUpperCase()}.</div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => setSelected('typing')}>Open</Button>
                </div>
              </div>
            </div>

            <div className={`p-3 rounded-lg ${selected === 'fill' ? 'bg-primary/10' : 'bg-muted/50'}`}>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold">Fill-in-the-Blank</div>
                  <div className="text-sm text-muted-foreground">Provide missing code pieces to complete the program. Language: {language.toUpperCase()}.</div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => setSelected('fill')}>Open</Button>
                </div>
              </div>
            </div>
          </div>
        </GradientCard>

        <div className="lg:col-span-2">
          {selected === 'typing' ? (
            <GradientCard className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-lg">Typing Challenge</h3>
                  {(() => {
                    const snippets = typingSnippetsByLang[language] ?? typingSnippetsByLang.java;
                    return <div className="text-sm text-muted-foreground">Snippet {snippetIndex + 1} of {snippets.length} — {language.toUpperCase()}</div>;
                  })()}
                </div>
                <div className="flex items-center gap-3">
                  <div className="px-3 py-1 rounded-full bg-primary/10 text-primary font-semibold">Progress: {typingProgress}%</div>
                  <Button size="sm" onClick={handleNextSnippet}>Next Snippet</Button>
                </div>
              </div>

              <div className="mt-4 font-mono text-sm bg-muted/50 rounded p-3">
                {(() => {
                  const snippets = typingSnippetsByLang[language] ?? typingSnippetsByLang.java;
                  const cur = snippets[snippetIndex % snippets.length];
                  return <pre className="whitespace-pre-wrap">{cur}</pre>;
                })()}
              </div>

              <div className="mt-4">
                <Textarea
                  ref={typingInputRef}
                  value={typed}
                  onChange={(e) => handleTypingChange(e.target.value)}
                  placeholder="Type the above code exactly..."
                  className="font-mono text-sm min-h-[120px]"
                />
              </div>

              <div className="flex gap-2 mt-4">
                <Button onClick={() => { setTyped(""); toast({ title: 'Reset', description: 'Typed input cleared' }); }}>Reset</Button>
                <Button className="bg-success text-success-foreground" onClick={() => {
                  const snippets = typingSnippetsByLang[language] ?? typingSnippetsByLang.java;
                  const cur = snippets[snippetIndex % snippets.length];
                  saveProgress(email, `typing-${language}-${snippetIndex}`, 100, JSON.stringify({ typed: cur }));
                  handleComplete('typing');
                }}>Mark Complete</Button>
              </div>
            </GradientCard>
          ) : (
            <GradientCard className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-lg">Fill-in-the-Blank</h3>
                  <div className="text-sm text-muted-foreground">Replace the blanks with correct expressions.</div>
                </div>
                <div className="px-3 py-1 rounded-full bg-primary/10 text-primary font-semibold">Progress: {fillProgress}%</div>
              </div>

              <div className="mt-4 font-mono text-sm bg-muted/50 rounded p-3">
                {(() => {
                  const tmpl = fillBlankTemplatesByLang[language] ?? fillBlankTemplatesByLang.java;
                  let blankCounter = 0;
                  return tmpl.code.split('\n').map((line, idx) => {
                    if (line.includes('___')) {
                      const segments = line.split('___');
                      // interleave segments with inputs
                      const children: any[] = [];
                      for (let i = 0; i < segments.length; i++) {
                        children.push(<span key={`s-${idx}-${i}`}>{segments[i]}</span>);
                        if (i < segments.length - 1) {
                          const bIndex = blankCounter;
                          children.push(
                            <input
                              key={`i-${idx}-${i}`}
                              className="px-2 py-1 border rounded font-mono"
                              value={blanks[bIndex] || ''}
                              onChange={(e) => handleFillChange(bIndex, e.target.value)}
                            />
                          );
                          blankCounter++;
                        }
                      }
                      return (
                        <div key={idx} className="flex items-center gap-2">
                          {children}
                        </div>
                      );
                    }
                    return <div key={idx}>{line}</div>;
                  });
                })()}
              </div>

              <div className="flex gap-2 mt-4">
                <Button onClick={() => {
                  const tmpl = fillBlankTemplatesByLang[language] ?? fillBlankTemplatesByLang.java;
                  setBlanks([...tmpl.blanks.map(() => '')]);
                  toast({ title: 'Reset', description: 'Blanks cleared' });
                }}>Reset</Button>
                <Button className="bg-success text-success-foreground" onClick={() => {
                  const tmpl = fillBlankTemplatesByLang[language] ?? fillBlankTemplatesByLang.java;
                  saveProgress(email, `fill-${language}-1`, 100, JSON.stringify({ answers: tmpl.blanks }));
                  handleComplete('fill');
                }}>Mark Complete</Button>
              </div>
            </GradientCard>
          )}
        </div>
      </div>
    </div>
  );
};

export default Quest;
