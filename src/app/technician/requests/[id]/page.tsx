'use client';

import { useState } from 'react';
import { notFound } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ServiceRequest, serviceRequests } from '@/lib/data';
import { StatusBadge } from '@/components/dashboard/status-badge';
import { useToast } from '@/hooks/use-toast';
import { Bot, Sparkles } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { technicianDecisionSupport } from '@/ai/flows/technician-decision-support';
import { Skeleton } from '@/components/ui/skeleton';

const availableStatuses: ServiceRequest['status'][] = [
  'Picked Up',
  'In Repair',
  'Ready to Deliver',
  'Delivered',
  'Case Closed',
];

// In a real app, this would fetch data from your database based on the ID.
const getRequestById = (id: string): ServiceRequest | undefined => {
  return serviceRequests.find((req) => req.id === id);
};

export default function RequestDetailPage({ params }: { params: { id: string } }) {
  const request = getRequestById(params.id);
  const { toast } = useToast();

  const [status, setStatus] = useState(request?.status);
  const [partsChanged, setPartsChanged] = useState(request?.partsChanged || '');
  const [isSaving, setIsSaving] = useState(false);
  
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState<{ suggestedAction: string; reasoning: string } | null>(null);

  if (!request) {
    notFound();
  }

  const handleUpdate = () => {
    setIsSaving(true);
    // Mock update
    console.log({ status, partsChanged });
    setTimeout(() => {
      toast({
        title: 'Request Updated',
        description: `Status for ${request.id} has been saved.`,
      });
      setIsSaving(false);
    }, 1000);
  };
  
  const handleAiSuggest = async () => {
    if (!status) return;
    setIsAiLoading(true);
    setAiSuggestion(null);
    try {
        const availableActions = availableStatuses.filter(s => s !== status);
        const result = await technicianDecisionSupport({
            serviceRequestDetails: `${request.printerModel}: ${request.issueDescription}`,
            printerStatus: status,
            availableActions,
        });
        setAiSuggestion(result);
    } catch (error) {
        console.error('AI suggestion failed:', error);
        toast({
            variant: 'destructive',
            title: 'AI Assistant Error',
            description: 'Could not get a suggestion.',
        });
    } finally {
        setIsAiLoading(false);
    }
  }

  return (
    <div className="grid gap-6 md:grid-cols-3">
      <div className="md:col-span-2 space-y-6">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
                <div>
                    <CardTitle>Request Details</CardTitle>
                    <CardDescription>ID: {request.id}</CardDescription>
                </div>
                {status && <StatusBadge status={status} />}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="font-semibold">Customer</Label>
              <p>{request.customerName}</p>
            </div>
            <div>
              <Label className="font-semibold">Printer Model</Label>
              <p>{request.printerModel}</p>
            </div>
            <div>
              <Label className="font-semibold">Reported Issue</Label>
              <p className="text-muted-foreground">{request.issueDescription}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
            <CardHeader>
                <CardTitle>Update Request</CardTitle>
                <CardDescription>Update the status and record any parts changed.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="status">Update Status</Label>
                    <Select value={status} onValueChange={(value) => setStatus(value as ServiceRequest['status'])}>
                        <SelectTrigger id="status">
                            <SelectValue placeholder="Select a status" />
                        </SelectTrigger>
                        <SelectContent>
                            {availableStatuses.map(s => (
                                <SelectItem key={s} value={s}>{s}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="parts-changed">Parts Changed / Repair Notes</Label>
                    <Textarea
                        id="parts-changed"
                        placeholder="e.g., Replaced fuser assembly unit."
                        value={partsChanged}
                        onChange={(e) => setPartsChanged(e.target.value)}
                        className="min-h-[100px]"
                    />
                </div>
            </CardContent>
            <CardFooter>
                 <Button onClick={handleUpdate} disabled={isSaving}>
                    {isSaving ? 'Saving...' : 'Save Update'}
                </Button>
            </CardFooter>
        </Card>
      </div>
      <div className="md:col-span-1">
        <Card className="sticky top-6">
            <CardHeader>
                <CardTitle>AI Decision Support</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">Get an AI-powered suggestion for the next best action.</p>
                <Button variant="outline" className="w-full" onClick={handleAiSuggest} disabled={isAiLoading}>
                    {isAiLoading ? 'Analyzing...' : 'Suggest Next Step'}
                    <Sparkles className="ml-2 h-4 w-4" />
                </Button>
                
                {isAiLoading && (
                    <div className="space-y-4 pt-4">
                        <Skeleton className="h-4 w-1/2" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-3/4" />
                    </div>
                )}
                {aiSuggestion && (
                    <Alert className="mt-4">
                        <Bot className="h-4 w-4" />
                        <AlertTitle>Suggested Action: {aiSuggestion.suggestedAction}</AlertTitle>
                        <AlertDescription className="mt-2">
                            <p className="font-semibold">Reasoning:</p>
                            <p className="text-xs">{aiSuggestion.reasoning}</p>
                        </AlertDescription>
                    </Alert>
                )}
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
