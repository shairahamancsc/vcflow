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
import { serviceRequests, users } from '@/lib/data';
import { StatusBadge } from '@/components/dashboard/status-badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function AdminDashboard() {
  const allRequests = serviceRequests;
  const technicians = users.filter((u) => u.role === 'technician');
  
  const technicianWorkloads = technicians.map(tech => {
    const assigned = allRequests.filter(req => req.technicianId === tech.id && req.status !== 'Case Closed');
    return { ...tech, workload: assigned.length };
  });

  const unassignedRequests = allRequests.filter(req => req.status === 'Request Received');

  return (
    <div className="grid gap-6 md:grid-cols-3">
      <div className="md:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>All Service Requests</CardTitle>
            <CardDescription>
              An overview of all service requests in the system.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Request ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Technician</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {allRequests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell className="font-medium">{request.id}</TableCell>
                    <TableCell>{request.customerName}</TableCell>
                    <TableCell>{request.technicianName || 'Unassigned'}</TableCell>
                    <TableCell>
                      <StatusBadge status={request.status} />
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
