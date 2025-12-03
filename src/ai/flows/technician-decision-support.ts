'use server';

/**
 * @fileOverview This file defines a Genkit flow for technician decision support.
 *
 * The flow evaluates service request details and printer status to suggest the most appropriate next action for a technician.
 *
 * @interface TechnicianDecisionSupportInput - Input type for the technician decision support flow.
 * @interface TechnicianDecisionSupportOutput - Output type for the technician decision support flow.
 * @function technicianDecisionSupport - Main function to initiate the technician decision support flow.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TechnicianDecisionSupportInputSchema = z.object({
  serviceRequestDetails: z.string().describe('Details of the service request, including customer information, printer model, and reported issue.'),
  printerStatus: z.string().describe('Current status of the printer (e.g., Request Received, Picked Up, In Repair, Ready to Deliver).'),
  availableActions: z.array(z.string()).describe('List of available actions the technician can take (e.g., Mark as Picked Up, Update Repair Details, Ready to Deliver, Close Case).'),
});

export type TechnicianDecisionSupportInput = z.infer<typeof TechnicianDecisionSupportInputSchema>;

const TechnicianDecisionSupportOutputSchema = z.object({
  suggestedAction: z.string().describe('The most appropriate next action for the technician to take based on the service request details and printer status.'),
  reasoning: z.string().describe('The reasoning behind the suggested action.'),
});

export type TechnicianDecisionSupportOutput = z.infer<typeof TechnicianDecisionSupportOutputSchema>;

export async function technicianDecisionSupport(input: TechnicianDecisionSupportInput): Promise<TechnicianDecisionSupportOutput> {
  return technicianDecisionSupportFlow(input);
}

const technicianDecisionSupportPrompt = ai.definePrompt({
  name: 'technicianDecisionSupportPrompt',
  input: {schema: TechnicianDecisionSupportInputSchema},
  output: {schema: TechnicianDecisionSupportOutputSchema},
  prompt: `You are an AI assistant helping a technician manage printer service requests.
  Given the service request details, the current printer status, and the available actions, suggest the most appropriate next action for the technician.
  Explain your reasoning for the suggested action.

  Service Request Details: {{{serviceRequestDetails}}}
  Printer Status: {{{printerStatus}}}
  Available Actions: {{#each availableActions}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}

  Consider all available information to provide the best possible recommendation.

  Output the suggested action and reasoning in a structured format.
  `, 
});

const technicianDecisionSupportFlow = ai.defineFlow(
  {
    name: 'technicianDecisionSupportFlow',
    inputSchema: TechnicianDecisionSupportInputSchema,
    outputSchema: TechnicianDecisionSupportOutputSchema,
  },
  async input => {
    const {output} = await technicianDecisionSupportPrompt(input);
    return output!;
  }
);
