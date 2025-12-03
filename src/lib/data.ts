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

export const users: User[] = [
  { id: '1', email: 'rajib@example.com', name: 'Rajib', role: 'customer' },
  { id: '2', email: 'chintu@example.com', name: 'Chintu', role: 'technician' },
  { id: '3', email: 'admin@example.com', name: 'Admin', role: 'admin' },
  { id: '4', email: 'suresh@example.com', name: 'Suresh', role: 'technician' },
];

export const serviceRequests: ServiceRequest[] = [
  {
    id: 'SR001',
    customerId: '1',
    customerName: 'Rajib',
    technicianId: '2',
    technicianName: 'Chintu',
    printerModel: 'HP LaserJet Pro M404dn',
    issueDescription: 'Printer is not turning on. No lights, no sounds.',
    status: 'In Repair',
    createdAt: '2024-07-28T10:00:00Z',
    updatedAt: '2024-07-30T14:30:00Z',
    partsChanged: 'Power supply unit replaced.',
  },
  {
    id: 'SR002',
    customerId: '1',
    customerName: 'Rajib',
    technicianId: '2',
    technicianName: 'Chintu',
    printerModel: 'Brother HL-L2350DW',
    issueDescription: 'Paper jams every time I try to print a document.',
    status: 'Ready to Deliver',
    createdAt: '2024-07-25T11:30:00Z',
    updatedAt: '2024-07-29T09:00:00Z',
    partsChanged: 'Rollers cleaned and a small plastic fragment removed from the paper path.',
  },
  {
    id: 'SR003',
    customerId: '1',
    customerName: 'Rajib',
    technicianId: null,
    technicianName: null,
    printerModel: 'Epson EcoTank ET-2720',
    issueDescription: 'The print quality is very poor, with streaks and faded colors.',
    status: 'Request Received',
    createdAt: '2024-07-31T08:45:00Z',
    updatedAt: '2024-07-31T08:45:00Z',
    partsChanged: null,
  },
  {
    id: 'SR004',
    customerId: '1',
    customerName: 'Rajib',
    technicianId: '4',
    technicianName: 'Suresh',
    printerModel: 'Canon PIXMA TR4520',
    issueDescription: 'Scanner is not working. The software says it cannot communicate with the device.',
    status: 'Picked Up',
    createdAt: '2024-07-29T16:20:00Z',
    updatedAt: '2024-07-30T11:00:00Z',
    partsChanged: null,
  },
   {
    id: 'SR005',
    customerId: '1',
    customerName: 'Rajib',
    technicianId: '2',
    technicianName: 'Chintu',
    printerModel: 'HP OfficeJet 3830',
    issueDescription: 'Wi-Fi connection keeps dropping, unable to print wirelessly.',
    status: 'Technician Assigned',
    createdAt: '2024-08-01T09:00:00Z',
    updatedAt: '2024-08-01T09:30:00Z',
    partsChanged: null,
  },
];
