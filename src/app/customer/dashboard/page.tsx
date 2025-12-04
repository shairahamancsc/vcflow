'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { ServiceRequest } from '@/lib/data';
import { StatusBadge } from '@/components/dashboard/status-badge';
import { useAuth } from '@/context/auth-context';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';

export default function CustomerDashboard() {
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
        .eq('customerId', user.id)
        .order('createdAt', { ascending: false });

      if (error) {
        console.error('Error fetching service requests:', error);
      } else {
        setRequests(data as ServiceRequest[]);
      }
      setLoading(false);
    };

    fetchRequests();
  }, [user]);

  if (loading) {
     return (
       <Card>
         <CardHeader>
           <Skeleton className="h-8 w-1/3" />
           <Skeleton className="h-4 w-2/3" />
         </CardHeader>
         <CardContent>
            <div className="space-y-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
         </CardContent>
       </Card>
     );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>My Service Requests</CardTitle>
          <CardDescription>
            A history of all your printer service requests.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {requests.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Request ID</TableHead>
                  <TableHead>Printer Model</TableHead>
                  <TableHead>Technician</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Updated</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell className="font-medium">{request.id}</TableCell>
                    <TableCell>{request.printerModel}</TableCell>
                    <TableCell>{request.technicianName || 'Not Assigned'}</TableCell>
                    <TableCell>
                      <StatusBadge status={request.status} />
                    </TableCell>
                    <TableCell>
                      {new Date(request.updatedAt).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
                <h3 className="text-lg font-semibold">No requests yet!</h3>
                <p>You haven&apos;t submitted any service requests.</p>
                <Button asChild className="mt-4">
                  <Link href="/customer/new-request">Create a New Request</Link>
                </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
