import type { SummarizeResumeContentOutput } from "@/ai/flows/summarize-resume-content";
import type { ExtractKeySkillsOutput } from "@/ai/flows/extract-key-skills";
import type { DetectResumeWeaknessesOutput } from "@/ai/flows/detect-resume-weaknesses";
import type { GenerateOptimizedResumeOutput } from "@/ai/flows/generate-optimized-resume";

export type AnalysisResult = {
  id: string;
  timestamp: string;
  summary: SummarizeResumeContentOutput;
  skills: ExtractKeySkillsOutput;
  weaknesses: DetectResumeWeaknessesOutput;
  optimized: GenerateOptimizedResumeOutput;
  originalResume: string;
};
