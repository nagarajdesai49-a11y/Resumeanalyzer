'use server';

/**
 * @fileOverview A flow to extract key skills from a resume using AI.
 *
 * - extractKeySkills - A function that handles the extraction of key skills from a resume.
 * - ExtractKeySkillsInput - The input type for the extractKeySkills function.
 * - ExtractKeySkillsOutput - The return type for the extractKeySkills function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExtractKeySkillsInputSchema = z.object({
  resumeText: z.string().describe('The text content of the resume.'),
});
export type ExtractKeySkillsInput = z.infer<typeof ExtractKeySkillsInputSchema>;

const ExtractKeySkillsOutputSchema = z.object({
  skills: z.array(z.string()).describe('An array of key skills extracted from the resume.'),
});
export type ExtractKeySkillsOutput = z.infer<typeof ExtractKeySkillsOutputSchema>;

export async function extractKeySkills(input: ExtractKeySkillsInput): Promise<ExtractKeySkillsOutput> {
  return extractKeySkillsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'extractKeySkillsPrompt',
  input: {schema: ExtractKeySkillsInputSchema},
  output: {schema: ExtractKeySkillsOutputSchema},
  prompt: `You are an AI assistant specialized in resume analysis.
  Your task is to extract the key skills from the given resume text.
  Return the skills as an array of strings.

  Resume Text: {{{resumeText}}}
  `,
});

const extractKeySkillsFlow = ai.defineFlow(
  {
    name: 'extractKeySkillsFlow',
    inputSchema: ExtractKeySkillsInputSchema,
    outputSchema: ExtractKeySkillsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
