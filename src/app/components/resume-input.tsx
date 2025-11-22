"use client";

import type { Dispatch, type SetStateAction } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Wand2 } from 'lucide-react';

interface ResumeInputProps {
  resumeText: string;
  setResumeText: Dispatch<SetStateAction<string>>;
  onAnalyze: () => void;
  isLoading: boolean;
}

const ResumeInput = ({ resumeText, setResumeText, onAnalyze, isLoading }: ResumeInputProps) => {
  
  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setResumeText(event.target.value);
  };

  const handleDragOver = (event: React.DragEvent<HTMLTextAreaElement>) => {
    event.preventDefault();
  };
  
  const handleDrop = (event: React.DragEvent<HTMLTextAreaElement>) => {
    event.preventDefault();
    const text = event.dataTransfer.getData('text/plain');
    if (text) {
      setResumeText(resumeText + text);
    }
  };


  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Resume</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea
          placeholder="Paste or drag your resume here..."
          value={resumeText}
          onChange={handleInputChange}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          rows={15}
          className="resize-y"
          disabled={isLoading}
        />
        <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
          <Button onClick={onAnalyze} className="w-full" disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="animate-spin" />
            ) : (
              <Wand2 />
            )}
            Analyze with AI
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ResumeInput;
