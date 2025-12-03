'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useState } from 'react';
import { Bot, Sparkles } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { initialServiceRequestAssistance } from '@/ai/flows/initial-service-request-assistance';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const formSchema = z.object({
  printerModel: z.string().min(3, { message: 'Printer model is required.' }),
  issueDescription: z.string().min(10, { message: 'Please describe the issue in at least 10 characters.' }),
});

export default function NewRequestPage() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      printerModel: '',
      issueDescription: '',
    },
  });

  async function handleAiAssist() {
    const issueDescription = form.getValues('issueDescription');
    if (!issueDescription || issueDescription.length < 10) {
      form.trigger('issueDescription');
      return;
    }
    setIsAiLoading(true);
    setAiSuggestion(null);
    try {
      const result = await initialServiceRequestAssistance({ issueDescription });
      setAiSuggestion(result.suggestedSolutions);
    } catch (error) {
      console.error('AI assistance failed:', error);
      toast({
        variant: 'destructive',
        title: 'AI Assistant Error',
        description: 'Could not get troubleshooting suggestions.',
      });
    } finally {
      setIsAiLoading(false);
    }
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    console.log('New service request:', values);
    
    // Mock API call
    setTimeout(() => {
      toast({
        title: 'Request Submitted!',
        description: 'A technician will be assigned to your request shortly.',
      });
      form.reset();
      setAiSuggestion(null);
      setIsSubmitting(false);
    }, 1500);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Submit a New Service Request</CardTitle>
        <CardDescription>
          Describe your printer issue, and we&apos;ll get a technician on it.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="printerModel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Printer Model</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., HP LaserJet Pro M404dn" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="issueDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Issue Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g., The printer is making a loud grinding noise and won't feed paper."
                      className="min-h-[120px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-4">
              <Button type="button" variant="outline" onClick={handleAiAssist} disabled={isAiLoading}>
                {isAiLoading ? 'Thinking...' : 'Get AI Troubleshooting Tips'}
                <Sparkles className="ml-2 h-4 w-4" />
              </Button>

              {aiSuggestion && (
                 <Alert>
                  <Bot className="h-4 w-4" />
                  <AlertTitle>AI Suggestions</AlertTitle>
                  <AlertDescription>
                    <p className="whitespace-pre-wrap font-mono text-sm">{aiSuggestion}</p>
                    <p className="mt-4 text-xs text-muted-foreground">If these steps don&apos;t work, feel free to submit the service request below.</p>
                  </AlertDescription>
                </Alert>
              )}
            </div>

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Submit Request'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
