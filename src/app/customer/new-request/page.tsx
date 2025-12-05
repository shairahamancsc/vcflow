'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useState } from 'react';
import { Bot, Sparkles, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

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
import { useAuth } from '@/context/auth-context';
import { getSupabase } from '@/lib/supabaseClient';

const formSchema = z.object({
  printerModel: z.string().min(3, { message: 'Printer model is required.' }),
  issueDescription: z.string().min(10, { message: 'Please describe the issue in at least 10 characters.' }),
});

export default function NewRequestPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
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
    if (!user) {
        toast({ variant: 'destructive', title: 'Not logged in', description: 'You must be logged in to submit a request.' });
        return;
    }
    setIsSubmitting(true);
    const supabase = getSupabase();
    
    const { error } = await supabase.from('service_requests').insert({
        customerId: user.id,
        customerName: user.name,
        printerModel: values.printerModel,
        issueDescription: values.issueDescription,
        status: 'Request Received',
    });

    if (error) {
      toast({
        variant: 'destructive',
        title: 'Submission Failed',
        description: error.message,
      });
      setIsSubmitting(false);
    } else {
      toast({
        title: 'Request Submitted!',
        description: 'Your request has been received. We will assign a technician shortly.',
      });
      router.push('/customer/dashboard');
    }
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
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isSubmitting ? 'Submitting...' : 'Submit Request'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
