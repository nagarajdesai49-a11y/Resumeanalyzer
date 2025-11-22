
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
  
  const handleDrop = (e: React.DragEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (isLoading) return;

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type === "text/plain") {
        const reader = new FileReader();
        reader.onload = (loadEvent) => {
          const text = loadEvent.target?.result;
          if (typeof text === 'string') {
            setResumeText(text);
          }
        };
        reader.readAsText(file);
      }
    } else {
        const text = e.dataTransfer.getData('text/plain');
        if (text) {
            setResumeText(text);
        }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };
  
  const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (isLoading) return;
    const text = e.clipboardData.getData('text/plain');
    if (text) {
      setResumeText(document.execCommand('insertText', false, text));
    }
  };


  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Resume</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea
          placeholder="Paste or drop your resume here..."
          value={resumeText}
          onChange={(e) => setResumeText(e.target.value)}
          rows={15}
          className="resize-y"
          disabled={isLoading}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onPaste={handlePaste}
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
