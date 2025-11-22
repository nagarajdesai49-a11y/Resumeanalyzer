"use client";

import { useRef, type Dispatch, type SetStateAction } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Upload, Wand2 } from 'lucide-react';

interface ResumeInputProps {
  resumeText: string;
  setResumeText: Dispatch<SetStateAction<string>>;
  onAnalyze: () => void;
  isLoading: boolean;
}

const ResumeInput = ({ resumeText, setResumeText, onAnalyze, isLoading }: ResumeInputProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'text/plain') {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result;
        if (typeof text === 'string') {
          setResumeText(text);
        }
      };
      reader.readAsText(file);
    }
    // Reset file input to allow re-uploading the same file
    if(event.target) {
      event.target.value = '';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Resume</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea
          placeholder="Paste your resume here..."
          value={resumeText}
          onChange={(e) => setResumeText(e.target.value)}
          rows={15}
          className="resize-y"
          disabled={isLoading}
        />
        <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
          <Button 
            onClick={() => fileInputRef.current?.click()}
            variant="outline"
            className="w-full"
            disabled={isLoading}
          >
            <Upload />
            Upload .txt file
          </Button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".txt"
            className="hidden"
          />
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
