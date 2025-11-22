'use server';

/**
 * @fileOverview AI flow for suggesting resume improvements based on detected weaknesses.
 *
 * - suggestResumeImprovements - A function that generates tailored suggestions for improving a resume.
 * - SuggestResumeImprovementsInput - The input type for the suggestResumeImprovements function.
 * - SuggestResumeImprovementsOutput - The return type for the suggestResumeImprovements function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestResumeImprovementsInputSchema = z.object({
  resumeText: z
    .string()
    .describe('The text content of the resume to analyze and improve.'),
  detectedWeaknesses: z
    .string()
    .describe('The detected weaknesses in the resume that need improvement.'),
});
export type SuggestResumeImprovementsInput = z.infer<
  typeof SuggestResumeImprovementsInputSchema
>;

const SuggestResumeImprovementsOutputSchema = z.object({
  improvementSuggestions: z
    .string()
    .describe('Tailored suggestions for improving the resume based on the detected weaknesses.'),
});
export type SuggestResumeImprovementsOutput = z.infer<
  typeof SuggestResumeImprovementsOutputSchema
>;

export async function suggestResumeImprovements(
  input: SuggestResumeImprovementsInput
): Promise<SuggestResumeImprovementsOutput> {
  return suggestResumeImprovementsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestResumeImprovementsPrompt',
  input: {schema: SuggestResumeImprovementsInputSchema},
  output: {schema: SuggestResumeImprovementsOutputSchema},
  prompt: `You are an expert resume improvement assistant. Given the resume text and the detected weaknesses, generate tailored suggestions for improving the resume. Be specific and provide actionable advice.

Resume Text: {{{resumeText}}}

Detected Weaknesses: {{{detectedWeaknesses}}}

Suggestions:
`,
});

const suggestResumeImprovementsFlow = ai.defineFlow(
  {
    name: 'suggestResumeImprovementsFlow',
    inputSchema: SuggestResumeImprovementsInputSchema,
    outputSchema: SuggestResumeImprovementsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
