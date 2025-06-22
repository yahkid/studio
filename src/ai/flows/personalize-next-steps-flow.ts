'use server';
/**
 * @fileOverview An AI flow to generate personalized next steps for a user based on their faith decision.
 *
 * - personalizeNextSteps - A function that handles generating the personalized response.
 * - PersonalizeNextStepsInput - The input type for the personalizeNextSteps function.
 * - PersonalizeNextStepsOutput - The return type for the personalizeNextSteps function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const PersonalizeNextStepsInputSchema = z.object({
  userName: z.string().describe('The name of the user who made the decision.'),
  decisionType: z
    .enum(['faith', 'rededication', 'baptism', 'membership', 'other'])
    .describe('The type of decision the user made.'),
});
export type PersonalizeNextStepsInput = z.infer<
  typeof PersonalizeNextStepsInputSchema
>;

const NextStepSchema = z.object({
    title: z.string().describe("A short, encouraging title for the recommended next step."),
    description: z.string().describe("A one-sentence description of what this next step involves."),
    url: z.string().url().describe("The full URL for the recommended resource or page."),
    icon: z.enum(['BookOpen', 'Users', 'HeartHandshake', 'Info']).describe("An appropriate icon name for the step.")
});

const PersonalizeNextStepsOutputSchema = z.object({
  greeting: z.string().describe('A warm, personal, and encouraging greeting for the user, addressing them by name.'),
  nextSteps: z
    .array(NextStepSchema)
    .min(1).max(3)
    .describe('A list of 1 to 3 concrete, actionable next steps for the user to take.'),
});
export type PersonalizeNextStepsOutput = z.infer<
  typeof PersonalizeNextStepsOutputSchema
>;

/**
 * An asynchronous wrapper function that calls the Genkit flow to generate personalized next steps.
 * @param input The user's name and decision type.
 * @returns A promise that resolves to the personalized greeting and next steps.
 */
export async function personalizeNextSteps(
  input: PersonalizeNextStepsInput
): Promise<PersonalizeNextStepsOutput> {
  return personalizeNextStepsFlow(input);
}

const personalizeNextStepsPrompt = ai.definePrompt({
  name: 'personalizeNextStepsPrompt',
  input: { schema: PersonalizeNextStepsInputSchema },
  output: { schema: PersonalizeNextStepsOutputSchema },
  prompt: `You are a warm, wise, and encouraging pastor at HSCM Connect. Your role is to provide immediate, personalized guidance to someone who has just made a significant faith decision online.

The user's name is {{{userName}}}.
The decision they made is: '{{{decisionType}}}'.

Based on their decision, generate a warm, personal 'greeting' and a list of 1-3 concrete 'nextSteps'.

Your tone should be celebratory, welcoming, and pastoral. Make them feel seen and excited about their journey.

**Decision-Specific Guidance:**

*   **If 'decisionType' is 'faith' (first-time commitment):** This is the most important one. Congratulate them enthusiastically. The next steps should be foundational.
    1.  Suggest a "New Believers" course. Use the URL '/kozi/kusikia-sauti-ya-mungu'.
    2.  Encourage them to connect with the community. Suggest planning a visit using the URL '/new'.
    3.  Tell them we are praying for them.

*   **If 'decisionType' is 'rededication':** Welcome them back with open arms. No judgment.
    1.  Suggest a course on prayer or spiritual disciplines. Use the URL '/kozi/maisha-ya-maombi'.
    2.  Encourage them to join a small group or serve. Use the URL '/huduma'.

*   **If 'decisionType' is 'baptism':** Affirm their desire to take this public step.
    1.  Provide a link to learn more about what baptism means. Use the URL '/beliefs'.
    2.  Explain that a pastor will contact them to discuss it.

*   **If 'decisionType' is 'membership':** Express excitement about them officially joining the family.
    1.  Suggest they learn more about the church's vision. Use the URL '/about'.
    2.  Mention that the team will reach out with details on the membership process.

*   **If 'decisionType' is 'other':** Acknowledge their response and let them know the pastoral team will review their comments and reach out personally. Provide a general encouragement link. Use the URL '/#tazama-na-ukue'.

For each 'nextStep', provide a relevant 'title', 'description', 'url', and an appropriate 'icon' from the allowed list: 'BookOpen', 'Users', 'HeartHandshake', 'Info'.

Generate the response now.
`,
});

const personalizeNextStepsFlow = ai.defineFlow(
  {
    name: 'personalizeNextStepsFlow',
    inputSchema: PersonalizeNextStepsInputSchema,
    outputSchema: PersonalizeNextStepsOutputSchema,
  },
  async (input) => {
    const { output } = await personalizeNextStepsPrompt(input);
    return output!;
  }
);
