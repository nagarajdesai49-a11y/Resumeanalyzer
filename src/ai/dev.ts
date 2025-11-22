import { config } from 'dotenv';
config();

import '@/ai/flows/suggest-resume-improvements.ts';
import '@/ai/flows/detect-resume-weaknesses.ts';
import '@/ai/flows/summarize-resume-content.ts';
import '@/ai/flows/extract-key-skills.ts';
import '@/ai/flows/generate-optimized-resume.ts';