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
import { StatusBadge } from '@/components/dashboard/status-badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getSupabase } from '@/lib/supabaseClient';
import type { ServiceRequest, User } from '@/lib/data';
import { Skeleton } from '@/components/ui/skeleton';

export default function AdminDashboard() {
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [technicians, setTechnicians] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const supabase = getSupabase();
    const fetchData = async () => {
      setLoading(true);
      const { data: requestsData, error: requestsError } = await supabase
        .from('service_requests')
        .select('*')
        .order('updatedAt', { ascending: false });
      
      const { data: techsData, error: techsError } = await supabase
        .from('profiles')
        .select('id, name, email, role')
        .eq('role', 'technician');

      if (requestsError) console.error('Error fetching requests:', requestsError);
      else setRequests(requestsData as ServiceRequest[]);

      if (techsError) console.error('Error fetching technicians:', techsError);
      else setTechnicians(techsData as User[]);
      
      setLoading(false);
    };

    fetchData();
  }, []);

  const technicianWorkloads = technicians.map(tech => {
    const assigned = requests.filter(req => req.technicianId === tech.id && req.status !== 'Case Closed');
    return { ...tech, workload: assigned.length };
  });

  const unassignedRequests = requests.filter(req => req.status === 'Request Received');

  const handleRowClick = (requestId: string) => {
    router.push(`/technician/requests/${requestId}`);
  };

  if (loading) {
    return (
      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <Skeleton className="h-8 w-1/2" />
              <Skeleton className="h-4 w-3/4" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <Skeleton className="h-8 w-3/4" />
               <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-3">
      <div className="md:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>All Service Requests</CardTitle>
            <CardDescription>
              An overview of all service requests in the system. Click a row to view details.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Request ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Printer</TableHead>
                  <TableHead>Technician</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Updated</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requests.map((request) => (
                  <TableRow key={request.id} onClick={() => handleRowClick(request.id)} className="cursor-pointer">
                    <TableCell className="font-medium">{request.id}</TableCell>
                    <TableCell>{request.customerName}</TableCell>
                    <TableCell>{request.printerModel}</TableCell>
                    <TableCell>{request.technicianName || 'Unassigned'}</TableCell>
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
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Technician Workloads</CardTitle>
            <CardDescription>Active jobs per technician.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {technicianWorkloads.map(tech => {
                const avatarData = PlaceHolderImages.find(img => img.id === `avatar-${tech.name.toLowerCase()}`);
                return (
                  <div key={tech.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Avatar>
                            {avatarData && <AvatarImage src={avatarData.imageUrl} data-ai-hint={avatarData.imageHint} />}
                            <AvatarFallback>{tech.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <p className="font-medium">{tech.name}</p>
                    </div>
                    <p className="text-muted-foreground">{tech.workload} active job(s)</p>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
        
        <Card>
            <CardHeader>
                <CardTitle className="text-destructive">Action Required</CardTitle>
                <CardDescription>Assign technicians to new requests.</CardDescription>
            </CardHeader>
            <CardContent>
                {unassignedRequests.length > 0 ? (
                    <div className="space-y-2">
                    {unassignedRequests.map(req => (
                        <div key={req.id} className="text-sm p-2 bg-red-50/50 border border-destructive/20 rounded-md">
                            <p><strong>ID: {req.id}</strong> ({req.printerModel}) needs assignment.</p>
                        </div>
                    ))}
                    </div>
                ) : (
                    <p className="text-sm text-muted-foreground">No unassigned requests.</p>
                )}
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
