import type { SummarizeResumeContentOutput } from "@/ai/flows/summarize-resume-content";
import type { ExtractKeySkillsOutput } from "@/ai/flows/extract-key-skills";
import type { DetectResumeWeaknessesOutput } from "@/ai/flows/detect-resume-weaknesses";

export type AnalysisResult = {
  id: string;
  timestamp: string;
  summary: SummarizeResumeContentOutput;
  skills: ExtractKeySkillsOutput;
  weaknesses: DetectResumeWeaknessesOutput;
  optimized: string;
  originalResume: string;
};
