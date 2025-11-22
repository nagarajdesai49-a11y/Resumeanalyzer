"use client";

import type { Dispatch, type SetStateAction } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Upload, Wand2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useRef } from 'react';
import * as pdfjsLib from 'pdfjs-dist';

// The workerSrc property shall be specified.
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

interface ResumeInputProps {
  resumeText: string;
  setResumeText: Dispatch<SetStateAction<string>>;
  onAnalyze: () => void;
  isLoading: boolean;
}

const ResumeInput = ({ resumeText, setResumeText, onAnalyze, isLoading }: ResumeInputProps) => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setResumeText(event.target.value);
  };
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type === 'text/plain') {
        const reader = new FileReader();
        reader.onload = (e) => {
          const text = e.target?.result as string;
          setResumeText(text);
        };
        reader.readAsText(file);
      } else if (file.type === 'application/pdf') {
        const reader = new FileReader();
        reader.onload = async (e) => {
          const data = e.target?.result;
          if (data) {
            try {
              const pdf = await pdfjsLib.getDocument({data: data as ArrayBuffer}).promise;
              let content = '';
              for (let i = 1; i <= pdf.numPages; i++) {
                const page = await pdf.getPage(i);
                const textContent = await page.getTextContent();
                content += textContent.items.map((item: any) => item.str).join(' ');
              }
              setResumeText(content);
            } catch (error) {
              console.error('Failed to parse PDF:', error);
              toast({
                title: 'PDF Parsing Error',
                description: 'Could not extract text from the PDF. Please try a different file.',
                variant: 'destructive',
              });
            }
          }
        };
        reader.readAsArrayBuffer(file);
      } else {
        toast({
          title: 'Invalid File Type',
          description: 'Please upload a .txt or .pdf file.',
          variant: 'destructive',
        });
      }
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
  };
  
  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    if (file) {
      if (file.type === 'text/plain') {
        const reader = new FileReader();
        reader.onload = (e) => {
          const text = e.target?.result as string;
          setResumeText(text);
        };
        reader.readAsText(file);
      } else if (file.type === 'application/pdf') {
        const reader = new FileReader();
        reader.onload = async (e) => {
          const data = e.target?.result;
          if (data) {
            try {
              const pdf = await pdfjsLib.getDocument({data: data as ArrayBuffer}).promise;
              let content = '';
              for (let i = 1; i <= pdf.numPages; i++) {
                const page = await pdf.getPage(i);
                const textContent = await page.getTextContent();
                content += textContent.items.map((item: any) => item.str).join(' ');
              }
              setResumeText(content);
            } catch (error) {
              console.error('Failed to parse PDF:', error);
              toast({
                title: 'PDF Parsing Error',
                description: 'Could not extract text from the PDF. Please try a different file.',
                variant: 'destructive',
              });
            }
          }
        };
        reader.readAsArrayBuffer(file);
      } else {
         toast({
          title: 'Invalid File Type',
          description: 'Please drag and drop a .txt or .pdf file.',
          variant: 'destructive',
        });
      }
    } else {
        const text = event.dataTransfer.getData('text/plain');
        if (text) {
          setResumeText(resumeText + text);
        }
    }
  };

  const handlePaste = (event: React.ClipboardEvent<HTMLTextAreaElement>) => {
    event.preventDefault();
    const pastedText = event.clipboardData.getData('text');
    setResumeText(pastedText);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Resume</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea
          placeholder="Paste your resume here, or drag and drop a .txt or .pdf file..."
          value={resumeText}
          onChange={handleInputChange}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onPaste={handlePaste}
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
          <Button onClick={handleUploadClick} variant="outline" className="w-full" disabled={isLoading}>
            <Upload />
            Upload File
          </Button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".txt,.pdf"
            className="hidden"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default ResumeInput;
