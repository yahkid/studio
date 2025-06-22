'use server';
/**
 * @fileOverview An AI flow to summarize user testimonies.
 *
 * - summarizeTestimony - A function that handles the testimony summarization process.
 * - SummarizeTestimonyInput - The input type for the summarizeTestimony function.
 * - SummarizeTestimonyOutput - The return type for the summarizeTestimony function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const SummarizeTestimonyInputSchema = z.object({
  story: z.string().describe('The full text of the user-submitted testimony.'),
});
export type SummarizeTestimonyInput = z.infer<typeof SummarizeTestimonyInputSchema>;

const SummarizeTestimonyOutputSchema = z.object({
  suggestedQuote: z
    .string()
    .describe(
      'A short, powerful, and impactful quote extracted from the testimony. This should be a single sentence that captures the core of the transformation.'
    ),
  summary: z
    .string()
    .describe(
      'A brief, one to two-sentence summary of the testimony, suitable for use as a caption or introduction.'
    ),
});
export type SummarizeTestimonyOutput = z.infer<
  typeof SummarizeTestimonyOutputSchema
>;

/**
 * An asynchronous wrapper function that calls the Genkit flow to summarize a testimony.
 * @param input The testimony story to be summarized.
 * @returns A promise that resolves to the suggested quote and summary.
 */
export async function summarizeTestimony(
  input: SummarizeTestimonyInput
): Promise<SummarizeTestimonyOutput> {
  return summarizeTestimonyFlow(input);
}

const summarizeTestimonyPrompt = ai.definePrompt({
  name: 'summarizeTestimonyPrompt',
  input: { schema: SummarizeTestimonyInputSchema },
  output: { schema: SummarizeTestimonyOutputSchema },
  prompt: `You are an expert editor for a church website. Your task is to analyze the following user-submitted testimony and extract key information for content creation.

Read the user's story carefully. Based on the text provided, generate a "suggestedQuote" and a "summary".

- The "suggestedQuote" should be the single most powerful and uplifting sentence from the testimony. It should be concise and suitable for being featured prominently.
- The "summary" should be a brief, 1-2 sentence overview of the user's journey or transformation described in the testimony.

Focus on the themes of faith, hope, transformation, and connection with God.

User Testimony:
{{{story}}}
`,
});

const summarizeTestimonyFlow = ai.defineFlow(
  {
    name: 'summarizeTestimonyFlow',
    inputSchema: SummarizeTestimonyInputSchema,
    outputSchema: SummarizeTestimonyOutputSchema,
  },
  async (input) => {
    const { output } = await summarizeTestimonyPrompt(input);
    return output!;
  }
);
