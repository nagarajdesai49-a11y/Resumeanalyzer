"use client";

import { useState } from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from "@/hooks/use-toast";
import type { AnalysisResult } from '@/lib/types';
import { Check, Clipboard, FileCheck2, Lightbulb, NotebookText, Sparkles, ThumbsDown } from 'lucide-react';

interface AnalysisPanelProps {
  analysisResult: AnalysisResult | null;
  isLoading: boolean;
}

const AnalysisPanel = ({ analysisResult, isLoading }: AnalysisPanelProps) => {
  const { toast } = useToast();
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    if (!analysisResult?.optimized) return;
    navigator.clipboard.writeText(analysisResult.optimized.optimizedResume).then(() => {
      setIsCopied(true);
      toast({ title: "Copied to clipboard!" });
      setTimeout(() => setIsCopied(false), 2000);
    }).catch(err => {
      console.error('Failed to copy text: ', err);
      toast({ title: "Failed to copy", variant: "destructive" });
    });
  };

  const renderSkeletons = () => (
    <div className="space-y-4 p-4">
      <Skeleton className="h-6 w-1/4" />
      <Skeleton className="h-20 w-full" />
      <Skeleton className="h-6 w-1/3" />
      <div className="flex flex-wrap gap-2">
        {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-8 w-24" />)}
      </div>
    </div>
  );

  const renderInitialState = () => (
    <div className="flex h-full min-h-[500px] flex-col items-center justify-center rounded-lg border-2 border-dashed bg-card p-12 text-center">
      <Wand2 className="mx-auto h-12 w-12 text-muted-foreground" />
      <h3 className="mt-4 text-lg font-semibold text-foreground">AI Analysis Panel</h3>
      <p className="mt-2 text-sm text-muted-foreground">
        Your resume analysis will appear here once you submit your resume.
      </p>
    </div>
  );
  
  const Wand2 = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 3v2.24l3.33 3.33-2.24 2.24 3.33 3.33-2.24 2.24 3.33 3.33V21M3 12h2.24l3.33-3.33-2.24-2.24L9.67 3 3 9.67V12m18 0h-2.24l-3.33 3.33 2.24 2.24-3.33 3.33 3.33-3.33H21zM9.67 21l-3.33-3.33 2.24-2.24-3.33-3.33L3 14.33 9.67 21z"/>
    </svg>
  );

  if (isLoading) {
    return (
      <Card className="h-full">
        <CardHeader>
          <Skeleton className="h-8 w-48" />
        </CardHeader>
        <CardContent>
          {renderSkeletons()}
        </CardContent>
      </Card>
    );
  }

  if (!analysisResult) {
    return renderInitialState();
  }

  return (
    <Tabs defaultValue="summary" className="w-full">
      <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
        <TabsTrigger value="summary"><NotebookText />Summary</TabsTrigger>
        <TabsTrigger value="skills"><Sparkles />Skills</TabsTrigger>
        <TabsTrigger value="improvements"><Lightbulb />Improvements</TabsTrigger>
        <TabsTrigger value="optimized"><FileCheck2 />Optimized</TabsTrigger>
      </TabsList>
      
      <Card className="mt-4">
        <TabsContent value="summary" className="p-0">
          <CardHeader>
            <CardTitle>Resume Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap text-muted-foreground">{analysisResult.summary.summary}</p>
          </CardContent>
        </TabsContent>
        <TabsContent value="skills" className="p-0">
          <CardHeader>
            <CardTitle>Key Skills</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {analysisResult.skills.skills.map((skill, index) => (
                <Badge key={index} variant="secondary" className="text-base font-medium">{skill}</Badge>
              ))}
            </div>
          </CardContent>
        </TabsContent>
        <TabsContent value="improvements" className="p-0">
          <CardHeader>
            <CardTitle>Weaknesses & Suggestions</CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {analysisResult.weaknesses.weaknesses.map((weakness, index) => (
                <AccordionItem value={`item-${index}`} key={index}>
                  <AccordionTrigger className="text-left">
                    <ThumbsDown className="mr-2 h-4 w-4 text-destructive flex-shrink-0" /> {weakness}
                  </AccordionTrigger>
                  <AccordionContent className="whitespace-pre-wrap text-muted-foreground">
                    <p className="flex">
                      <Lightbulb className="mr-2 mt-1 h-4 w-4 text-accent flex-shrink-0" />
                      <span>{analysisResult.weaknesses.suggestions[index]}</span>
                    </p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </TabsContent>
        <TabsContent value="optimized" className="p-0">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Optimized Resume</CardTitle>
            <Button variant="ghost" size="sm" onClick={handleCopy}>
              {isCopied ? <Check /> : <Clipboard />}
              {isCopied ? 'Copied!' : 'Copy'}
            </Button>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm dark:prose-invert max-w-none rounded-md border bg-muted/50 p-4">
              <p className="whitespace-pre-wrap">{analysisResult.optimized.optimizedResume}</p>
            </div>
          </CardContent>
        </TabsContent>
      </Card>
    </Tabs>
  );
};

export default AnalysisPanel;
