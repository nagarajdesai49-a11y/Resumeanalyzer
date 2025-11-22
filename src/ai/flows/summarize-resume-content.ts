'use server';
/**
 * @fileOverview A resume summarization AI agent.
 *
 * - summarizeResumeContent - A function that handles the resume summarization process.
 * - SummarizeResumeContentInput - The input type for the summarizeResumeContent function.
 * - SummarizeResumeContentOutput - The return type for the summarizeResumeContent function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeResumeContentInputSchema = z.object({
  resumeText: z.string().describe('The text content of the resume to summarize.'),
});
export type SummarizeResumeContentInput = z.infer<typeof SummarizeResumeContentInputSchema>;

const SummarizeResumeContentOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the resume content.'),
});
export type SummarizeResumeContentOutput = z.infer<typeof SummarizeResumeContentOutputSchema>;

export async function summarizeResumeContent(input: SummarizeResumeContentInput): Promise<SummarizeResumeContentOutput> {
  return summarizeResumeContentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeResumeContentPrompt',
  input: {schema: SummarizeResumeContentInputSchema},
  output: {schema: SummarizeResumeContentOutputSchema},
  prompt: `You are an AI assistant specialized in summarizing resumes. Please provide a concise and informative summary of the following resume content:\n\n{{{resumeText}}}`,
});

const summarizeResumeContentFlow = ai.defineFlow(
  {
    name: 'summarizeResumeContentFlow',
    inputSchema: SummarizeResumeContentInputSchema,
    outputSchema: SummarizeResumeContentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
