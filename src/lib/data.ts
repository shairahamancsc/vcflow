export type User = {
  id: string;
  email: string;
  password?: string;
  name: string;
  role: 'customer' | 'technician' | 'admin';
};

export type ServiceRequest = {
  id: string;
  customerId: string;
  customerName: string;
  technicianId: string | null;
  technicianName: string | null;
  printerModel: string;
  issueDescription: string;
  status: 'Request Received' | 'Technician Assigned' | 'Picked Up' | 'In Repair' | 'Ready to Deliver' | 'Delivered' | 'Case Closed';
  createdAt: string;
  updatedAt: string;
  partsChanged: string | null;
};

// Mock data is no longer needed as we will be using Supabase.
// Keeping the types for reference in the application.

export const users: User[] = [];

export const serviceRequests: ServiceRequest[] = [];
