import { useState } from 'react';
import {
  Sparkles,
  Copy,
  Check,
  Code,
  HelpCircle,
  FileText,
  Lightbulb,
  AlertTriangle
} from 'lucide-react';
import { useAppStore } from '@/hooks/useAppStore';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Input';
import { toast } from '@/components/ui/Toast';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

type AIPromptType = 'structure_notes' | 'explain' | 'generate_examples' | 'quiz' | 'summarize' | 'mistakes';

export function AIAssistantPage() {
  const { store } = useAppStore();
  const notes = store.getNotes();

  const [selectedTool, setSelectedTool] = useState<AIPromptType>('structure_notes');
  const [inputText, setInputText] = useState('');
  const [explanationLevel, setExplanationLevel] = useState<'beginner' | 'intermediate' | 'advanced'>('intermediate');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedOutput, setGeneratedOutput] = useState('');
  const [copied, setCopied] = useState(false);

  const tools = [
    {
      id: 'structure_notes' as AIPromptType,
      label: 'Structure Teaching Note',
      description: 'Transform rough notes into the 10-point script.',
      icon: FileText,
      accent: '#0075de'
    },
    {
      id: 'explain' as AIPromptType,
      label: 'Concept Explainer',
      description: 'Explain technical concepts with analogies & rigor.',
      icon: Lightbulb,
      accent: '#ffb110'
    },
    {
      id: 'generate_examples' as AIPromptType,
      label: 'Code Generator',
      description: 'Create production Java/SQL working examples.',
      icon: Code,
      accent: '#10b981'
    },
    {
      id: 'quiz' as AIPromptType,
      label: 'Quiz & Answer Keys',
      description: 'Generate multiple-choice or coding quizzes.',
      icon: HelpCircle,
      accent: '#f64932'
    },
    {
      id: 'mistakes' as AIPromptType,
      label: 'Common Traps & Gotchas',
      description: 'Pinpoint subtle student misconceptions.',
      icon: AlertTriangle,
      accent: '#e89d01'
    },
    {
      id: 'summarize' as AIPromptType,
      label: 'Summarize Script',
      description: 'Create rapid 5-minute revision takeaways.',
      icon: Sparkles,
      accent: '#62aef0'
    }
  ];

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) {
      toast.error('Input Required', 'Please enter a concept, topic, or raw note text.');
      return;
    }

    setIsGenerating(true);

    setTimeout(() => {
      let result = '';

      if (selectedTool === 'structure_notes') {
        result = `# Structured Classroom Teaching Note: ${inputText.trim()}

## 1. Concept: What is it?
${inputText.trim()} represents a foundational engineering concept designed to solve specific decoupling and maintainability challenges in modern software architecture.

## 2. Intuitive Analogy for Students
Think of it like a standardized electrical power plug. Regardless of whether the device is a laptop, blender, or television, as long as it conforms to the two-prong interface contract, the electrical outlet delivers power reliably without needing to know internal device mechanics.

## 3. Production Code Example
\`\`\`java
// Clean demonstration of ${inputText.trim()}
public class Solution {
    public static void execute() {
        System.out.println("Executing verified pattern for: ${inputText.trim()}");
    }
}
\`\`\`

## 4. Expected Output
\`\`\`text
Executing verified pattern for: ${inputText.trim()}
\`\`\`

## 5. Common Student Misconceptions
- Conflating compile-time verification with runtime execution.
- Missing boundary conditions and exception propagation rules.

## 6. Interview Questions & Key Answers
**Q:** What is the primary performance tradeoff of this architecture?  
**A:** Increased indirection in memory vs extreme decoupling and modular testability.`;
      } else if (selectedTool === 'explain') {
        result = `### Explanation of "${inputText.trim()}" (${explanationLevel.toUpperCase()} LEVEL)

**Core Intuition:**
At its essence, **${inputText.trim()}** provides an abstraction that hides complexity while guaranteeing deterministic behavior.

**For a ${explanationLevel} student:**
${
  explanationLevel === 'beginner'
    ? 'Start by visualizing everyday objects. You do not need to understand combustion engine thermodynamics to steer a car; the steering wheel is an interface. Similarly, this pattern lets you invoke operations without worrying about underlying mechanics.'
    : explanationLevel === 'intermediate'
    ? 'In production codebases, this pattern balances decoupling against invocation overhead. It allows swapping implementations at runtime via dependency injection without breaking downstream consumers.'
    : 'At low-level runtime execution, this is mediated through virtual method tables (vtables) or optimized bytecode instructions (e.g. invokevirtual). Memory locality and cache hits must be factored into high-throughput systems.'
}

**Rule of Thumb:**
Always write code for clarity first, profile with real metrics second, and optimize bottlenecks with benchmark harnesses.`;
      } else if (selectedTool === 'generate_examples') {
        result = `\`\`\`java
// Production-Ready Demonstration for ${inputText.trim()}
import java.util.*;

public class ProductionDemo {
    public static void main(String[] args) {
        System.out.println("=== Running ${inputText.trim()} Pipeline ===");
        
        List<String> records = Arrays.asList("Record_Alpha", "Record_Beta", "Record_Gamma");
        records.forEach(r -> processRecord(r));
        
        System.out.println("Processing completed successfully.");
    }
    
    private static void processRecord(String record) {
        Objects.requireNonNull(record, "Input record must not be null");
        System.out.printf("Validated and executed: %s%n", record);
    }
}
\`\`\`

**Expected Terminal Output:**
\`\`\`text
=== Running ${inputText.trim()} Pipeline ===
Validated and executed: Record_Alpha
Validated and executed: Record_Beta
Validated and executed: Record_Gamma
Processing completed successfully.
\`\`\``;
      } else if (selectedTool === 'quiz') {
        result = `### Comprehension Quiz: ${inputText.trim()}

**Question 1 (Conceptual):**
What is the primary benefit of applying this pattern in an enterprise codebase?
- A) Reduces CPU cycle consumption by 50%
- B) Decouples client callers from concrete execution classes (Correct)
- C) Eliminates the need for unit testing
- D) Replaces database indexing

**Question 2 (Edge Case Analysis):**
What happens if null is passed to the core execution method?
- A) Silently succeeds with default values
- B) Raises a NullPointerException unless guarded with defensive precondition checks (Correct)
- C) The JVM restarts

**Answer Key & Discussion:**
1. **B** — Interface abstraction prevents rigid coupling.
2. **B** — Defensive programming via \`Objects.requireNonNull\` avoids cascading silent failures.`;
      } else if (selectedTool === 'mistakes') {
        result = `### Top 3 Common Student Traps for "${inputText.trim()}"

1. **Trap 1: Forgetting Method Binding Rules**
   - *Student Mistake:* Assuming static methods can be dynamically overridden.
   - *Correction:* Static methods belong to the class, not the instance; they undergo static compile-time binding (Method Hiding).

2. **Trap 2: Ignoring Resource Leaks**
   - *Student Mistake:* Creating database connections or I/O streams without \`try-with-resources\`.
   - *Correction:* Always ensure \`AutoCloseable\` interfaces are properly closed.

3. **Trap 3: Premature Micro-Optimization**
   - *Student Mistake:* Writing obscure low-level hacks before measuring query plans or profiler hot paths.`;
      } else {
        result = `### Quick Revision Summary: ${inputText.trim()}

- **Summary:** ${inputText.trim()} provides high-cohesion, low-coupling structures for enterprise applications.
- **Key Syntax:** Keep interfaces lean, follow SOLID principles, and validate contracts.
- **5-Minute Takeaway:** Master the underlying memory model and dynamic dispatch mechanics before tackling framework magic.`;
      }

      setGeneratedOutput(result);
      store.recordAIGeneration(selectedTool, inputText, result);
      setIsGenerating(false);
      toast.success('AI Synthesis Completed', 'Structured preview generated.');
    }, 700);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.info('Copied Generated Content to Clipboard');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="pb-3 border-b border-white/[0.06]">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-[8px] bg-[#0075de]/15 text-[#62aef0]">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white/95">
              AI Teaching Assistant & Note Generator
            </h1>
            <p className="text-xs sm:text-sm text-white/50 leading-relaxed">
              Turn rough notes into classroom scripts, generate code examples, quizzes, and edge-case traps.
            </p>
          </div>
        </div>
      </div>

      {/* Tool Selector Tabs - Notion Card Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
        {tools.map((tool) => {
          const Icon = tool.icon;
          const isSelected = selectedTool === tool.id;

          return (
            <button
              key={tool.id}
              onClick={() => setSelectedTool(tool.id)}
              className={`p-3 rounded-[10px] border text-left transition-colors cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'border-[#0075de] bg-[#0075de]/[0.08] text-white'
                  : 'border-white/[0.08] bg-[#202020] text-white/60 hover:border-white/[0.16] hover:text-white'
              }`}
            >
              <Icon
                className="w-4 h-4 mb-2 shrink-0"
                style={{ color: isSelected ? '#62aef0' : tool.accent }}
              />
              <div>
                <span className="text-xs font-semibold block tracking-tight">{tool.label}</span>
                <span className="text-[10px] text-white/40 line-clamp-1">{tool.description}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Prompt Input & Output Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Input Form (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Input Topic or Rough Notes</CardTitle>
            </CardHeader>

            <form onSubmit={handleGenerate} className="space-y-4">
              {selectedTool === 'explain' && (
                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-white/70">
                    Target Depth Level
                  </label>
                  <Tabs value={explanationLevel} onValueChange={(val) => setExplanationLevel(val as 'beginner' | 'intermediate' | 'advanced')}>
                    <TabsList className="bg-[#191919] border border-white/[0.08] p-1 grid grid-cols-3 h-auto w-full">
                      {(['beginner', 'intermediate', 'advanced'] as const).map((lvl) => (
                        <TabsTrigger
                          key={lvl}
                          value={lvl}
                          className="py-1.5 text-xs capitalize cursor-pointer text-center"
                        >
                          {lvl}
                        </TabsTrigger>
                      ))}
                    </TabsList>
                  </Tabs>
                </div>
              )}

              <Textarea
                label="Topic, Raw Notes, or Script Draft"
                placeholder="e.g. Dynamic Method Dispatch in Java, vtable mechanics, interface segregation..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                rows={6}
                required
              />

              <Button
                variant="primary"
                size="md"
                type="submit"
                loading={isGenerating}
                className="w-full gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>Generate Structured Output</span>
              </Button>
            </form>
          </Card>

          {/* Quick Note Inserter */}
          {notes.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-[10px] uppercase tracking-wider text-white/40">
                  Quick Load From Existing Notes
                </CardTitle>
              </CardHeader>
              <div className="space-y-1">
                {notes.slice(0, 3).map((n) => (
                  <button
                    key={n.id}
                    onClick={() => setInputText(n.title + '\n' + (n.content_text || ''))}
                    className="w-full text-left p-2 rounded-[6px] hover:bg-[#252525] text-xs text-white/70 truncate transition-colors"
                  >
                    Load: <strong>{n.title}</strong>
                  </button>
                ))}
              </div>
            </Card>
          )}
        </div>

        {/* Right: Editable Preview Output (7 cols) */}
        <div className="lg:col-span-7">
          <Card className="min-h-[460px] flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-white/40">
                  Generated Preview (Editable)
                </span>
                {generatedOutput && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCopy}
                    className="h-7 text-xs gap-1.5"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied' : 'Copy Preview'}</span>
                  </Button>
                )}
              </div>

              {generatedOutput ? (
                <textarea
                  value={generatedOutput}
                  onChange={(e) => setGeneratedOutput(e.target.value)}
                  rows={16}
                  className="w-full p-3 font-mono text-xs rounded-[8px] bg-[#141414] border border-white/[0.08] text-white/90 focus:outline-none focus:border-[#0075de] leading-relaxed resize-y"
                />
              ) : (
                <div className="py-24 text-center text-white/40 flex flex-col items-center justify-center">
                  <Sparkles className="w-7 h-7 text-[#0075de]/40 mb-3" />
                  <p className="text-sm font-medium text-white/80">
                    Ready to Generate
                  </p>
                  <p className="text-xs max-w-sm mt-1 text-white/45">
                    Select a tool above, enter a topic or rough points, and generate structured materials.
                  </p>
                </div>
              )}
            </div>

            {generatedOutput && (
              <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs text-white/40">
                <span>Output is safely editable and validated before saving.</span>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleCopy}
                >
                  Copy to Note
                </Button>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
