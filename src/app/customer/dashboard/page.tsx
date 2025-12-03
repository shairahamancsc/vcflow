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
import { serviceRequests } from '@/lib/data';
import { StatusBadge } from '@/components/dashboard/status-badge';

// In a real app, this would be a server component fetching data for the logged-in user.
export default function CustomerDashboard() {
  const userRequests = serviceRequests; // Mock: assuming all requests belong to the logged-in user.

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
              {userRequests.map((request) => (
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
        </CardContent>
      </Card>
    </div>
  );
}
