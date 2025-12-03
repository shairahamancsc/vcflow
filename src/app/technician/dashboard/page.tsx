import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { serviceRequests } from '@/lib/data';
import { StatusBadge } from '@/components/dashboard/status-badge';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export default function TechnicianDashboard() {
  // Mock: Filter requests for a specific technician (e.g., Chintu, ID '2')
  const assignedRequests = serviceRequests.filter(req => req.technicianId === '2' && req.status !== 'Case Closed');
  
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
          {assignedRequests.length > 0 ? (
            <div className="space-y-4">
              {assignedRequests.map(request => (
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
