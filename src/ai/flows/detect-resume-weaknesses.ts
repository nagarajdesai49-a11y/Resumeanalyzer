'use server';

/**
 * @fileOverview Detects potential weaknesses in a resume using AI.
 *
 * - detectResumeWeaknesses - A function that handles the resume weakness detection process.
 * - DetectResumeWeaknessesInput - The input type for the detectResumeWeaknesses function.
 * - DetectResumeWeaknessesOutput - The return type for the detectResumeWeaknesses function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DetectResumeWeaknessesInputSchema = z.object({
  resumeText: z.string().describe('The text content of the resume to analyze.'),
});
export type DetectResumeWeaknessesInput = z.infer<typeof DetectResumeWeaknessesInputSchema>;

const DetectResumeWeaknessesOutputSchema = z.object({
  weaknesses: z.array(
    z.string().describe('A list of potential weaknesses identified in the resume.')
  ).describe('The weaknesses detected in the resume.'),
  suggestions: z.array(
    z.string().describe('A list of suggestions for improvement for each weaknesses identified in the resume.')
  ).describe('The suggestions to improve the weaknesses detected in the resume.'),
});
export type DetectResumeWeaknessesOutput = z.infer<typeof DetectResumeWeaknessesOutputSchema>;

export async function detectResumeWeaknesses(input: DetectResumeWeaknessesInput): Promise<DetectResumeWeaknessesOutput> {
  return detectResumeWeaknessesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'detectResumeWeaknessesPrompt',
  input: {schema: DetectResumeWeaknessesInputSchema},
  output: {schema: DetectResumeWeaknessesOutputSchema},
  prompt: `You are an expert career coach specializing in identifying resume weaknesses and providing suggestions. Analyze the provided resume text and identify potential areas for improvement. Provide specific suggestions for addressing each weakness.

Resume Text:
{{resumeText}}

Output the weaknesses and improvement suggestions in a JSON array format.

Example:
{
  "weaknesses": [
      "Lack of specific accomplishments",
      "Poor formatting",
      "Missing keywords"
    ],
  "suggestions": [
      "Quantify achievements with metrics",
      "Use a clean and modern template",
      "Incorporate industry-specific keywords"
    ]
}

Ensure the output is a valid JSON format that strictly adheres to the schema.`,
});

const detectResumeWeaknessesFlow = ai.defineFlow(
  {
    name: 'detectResumeWeaknessesFlow',
    inputSchema: DetectResumeWeaknessesInputSchema,
    outputSchema: DetectResumeWeaknessesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
