'use server';

/**
 * @fileOverview A flow to generate an optimized version of a resume using AI.
 *
 * - generateOptimizedResume - A function that generates an optimized resume.
 * - GenerateOptimizedResumeInput - The input type for the generateOptimizedResume function.
 * - GenerateOptimizedResumeOutput - The return type for the generateOptimizedResume function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateOptimizedResumeInputSchema = z.string().describe('The resume text to optimize.');
export type GenerateOptimizedResumeInput = z.infer<typeof GenerateOptimizedResumeInputSchema>;

const GenerateOptimizedResumeOutputSchema = z.string().describe('The optimized resume text.');
export type GenerateOptimizedResumeOutput = z.infer<typeof GenerateOptimizedResumeOutputSchema>;

export async function generateOptimizedResume(input: GenerateOptimizedResumeInput): Promise<GenerateOptimizedResumeOutput> {
  return generateOptimizedResumeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateOptimizedResumePrompt',
  input: {schema: GenerateOptimizedResumeInputSchema},
  output: {schema: GenerateOptimizedResumeOutputSchema},
  prompt: `You are an expert resume writer. Please take the following resume and optimize it for better readability and impact. Incorporate modern resume writing best practices.  Focus on making it ATS friendly.

Resume: {{{$input}}}`,
});

const generateOptimizedResumeFlow = ai.defineFlow(
  {
    name: 'generateOptimizedResumeFlow',
    inputSchema: GenerateOptimizedResumeInputSchema,
    outputSchema: GenerateOptimizedResumeOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
