'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import type { ServiceRequest } from '@/lib/data';
import { StatusBadge } from '@/components/dashboard/status-badge';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Loader2 } from 'lucide-react';
import { useAuth } from '@/context/auth-context';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function TechnicianDashboard() {
  const { user } = useAuth();
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchRequests = async () => {
      if (!user) return;
      setLoading(true);
      const { data, error } = await supabase
        .from('service_requests')
        .select('*')
        .eq('technicianId', user.id)
        .neq('status', 'Case Closed')
        .order('updatedAt', { ascending: false });

      if (error) {
        console.error("Error fetching technician's requests:", error);
      } else {
        setRequests(data as ServiceRequest[]);
      }
      setLoading(false);
    };

    fetchRequests();
  }, [user]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>My Assigned Service Requests</CardTitle>
          <CardDescription>
            Here are the jobs currently assigned to you.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center h-48">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : requests.length > 0 ? (
            <div className="space-y-4">
              {requests.map(request => (
                <Card key={request.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{request.printerModel}</CardTitle>
                        <CardDescription>Request ID: {request.id}</CardDescription>
                      </div>
                      <StatusBadge status={request.status} />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      <strong>Customer:</strong> {request.customerName}
                      <br />
                      <strong>Issue:</strong> {request.issueDescription}
                    </p>
                    <Button asChild>
                      <Link href={`/technician/requests/${request.id}`}>
                        View Details <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
                <h3 className="text-lg font-semibold">No active requests</h3>
                <p>You have no service requests assigned to you at the moment.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
