"use client";

import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import type { AnalysisResult } from '@/lib/types';
import { summarizeResumeContent } from "@/ai/flows/summarize-resume-content";
import { extractKeySkills } from "@/ai/flows/extract-key-skills";
import { detectResumeWeaknesses } from "@/ai/flows/detect-resume-weaknesses";
import { generateOptimizedResume } from "@/ai/flows/generate-optimized-resume";
import { useHistory } from '@/hooks/use-history';
import ResumeInput from './resume-input';
import AnalysisPanel from './analysis-panel';
import HistoryPanel from './history-panel';

const ResumeAnalyzer = () => {
  const [resumeText, setResumeText] = useState('');
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { addHistoryItem } = useHistory();

  const handleAnalyze = async () => {
    if (!resumeText.trim()) {
      toast({
        title: "Resume is empty",
        description: "Please paste or upload your resume before analyzing.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setAnalysisResult(null);

    try {
      const [summary, skills, weaknesses, optimized] = await Promise.all([
        summarizeResumeContent({ resumeText }),
        extractKeySkills({ resumeText }),
        detectResumeWeaknesses({ resumeText }),
        generateOptimizedResume({ resumeText }),
      ]);

      const newResult: AnalysisResult = {
        id: new Date().toISOString(),
        timestamp: new Date().toISOString(),
        originalResume: resumeText,
        summary,
        skills,
        weaknesses,
        optimized,
      };

      setAnalysisResult(newResult);
      addHistoryItem(newResult);
    } catch (error) {
      console.error("AI analysis failed:", error);
      toast({
        title: "Analysis Failed",
        description: "Something went wrong while analyzing your resume. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectHistory = (item: AnalysisResult) => {
    setResumeText(item.originalResume);
    setAnalysisResult(item);
  };

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
      <div className="lg:col-span-1">
        <div className="space-y-8">
          <ResumeInput
            resumeText={resumeText}
            setResumeText={setResumeText}
            onAnalyze={handleAnalyze}
            isLoading={isLoading}
          />
          <HistoryPanel onSelectHistory={handleSelectHistory} />
        </div>
      </div>
      <div className="lg:col-span-2">
        <AnalysisPanel analysisResult={analysisResult} isLoading={isLoading} />
      </div>
    </div>
  );
};

export default ResumeAnalyzer;
