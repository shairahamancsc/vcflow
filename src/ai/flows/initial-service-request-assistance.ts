'use server';

/**
 * @fileOverview This file defines a Genkit flow for providing initial troubleshooting assistance for printer service requests.
 *
 * The flow takes a customer's description of a printer issue and uses GenAI to suggest initial troubleshooting steps or potential solutions.
 *
 * @interface InitialServiceRequestAssistanceInput - Input schema for the flow, containing the customer's issue description.
 * @interface InitialServiceRequestAssistanceOutput - Output schema for the flow, containing the suggested troubleshooting steps.
 * @function initialServiceRequestAssistance - The main function that triggers the flow and returns the troubleshooting suggestions.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const InitialServiceRequestAssistanceInputSchema = z.object({
  issueDescription: z
    .string()
    .describe("The customer's description of the printer issue."),
});
export type InitialServiceRequestAssistanceInput = z.infer<
  typeof InitialServiceRequestAssistanceInputSchema
>;

const InitialServiceRequestAssistanceOutputSchema = z.object({
  suggestedSolutions: z
    .string()
    .describe('Suggested troubleshooting steps or potential solutions.'),
});
export type InitialServiceRequestAssistanceOutput = z.infer<
  typeof InitialServiceRequestAssistanceOutputSchema
>;

export async function initialServiceRequestAssistance(
  input: InitialServiceRequestAssistanceInput
): Promise<InitialServiceRequestAssistanceOutput> {
  return initialServiceRequestAssistanceFlow(input);
}

const initialServiceRequestAssistancePrompt = ai.definePrompt({
  name: 'initialServiceRequestAssistancePrompt',
  input: {schema: InitialServiceRequestAssistanceInputSchema},
  output: {schema: InitialServiceRequestAssistanceOutputSchema},
  prompt: `You are an experienced printer technician. Based on the customer's description of the printer issue, suggest initial troubleshooting steps or potential solutions.

  Customer's Description: {{{issueDescription}}}

  Provide a concise and actionable list of suggestions.
  `,
});

const initialServiceRequestAssistanceFlow = ai.defineFlow(
  {
    name: 'initialServiceRequestAssistanceFlow',
    inputSchema: InitialServiceRequestAssistanceInputSchema,
    outputSchema: InitialServiceRequestAssistanceOutputSchema,
  },
  async input => {
    const {output} = await initialServiceRequestAssistancePrompt(input);
    return output!;
  }
);
