'use client';

import { useState } from 'react';
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
import { Badge } from '@/components/ui/badge';
import { User, users as initialUsers } from '@/lib/data';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, PlusCircle, Trash, Edit } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

const userFormSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email.' }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters.' }).optional(),
  role: z.enum(['customer', 'technician']),
});

const editUserSchema = userFormSchema.omit({ password: true });

export default function ManageUsersPage() {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [isUserFormOpen, setIsUserFormOpen] = useState(false);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof userFormSchema>>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      role: 'customer',
    },
  });
  
  const editForm = useForm<z.infer<typeof editUserSchema>>({
    resolver: zodResolver(editUserSchema),
  });

  const handleAddNewUser = () => {
    setSelectedUser(null);
    form.reset({ name: '', email: '', password: '', role: 'customer' });
    setIsUserFormOpen(true);
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    editForm.reset({ id: user.id, name: user.name, email: user.email, role: user.role });
    setIsUserFormOpen(true);
  };
  
  const handleDeleteUser = (user: User) => {
    setSelectedUser(user);
    setIsDeleteAlertOpen(true);
  };
  
  const confirmDelete = () => {
    if (!selectedUser) return;
    // In a real app, you'd call an API to delete the user.
    setUsers(users.filter(u => u.id !== selectedUser.id));
    toast({
      title: 'User Removed',
      description: `${selectedUser.name} has been removed from the system.`,
    });
    setIsDeleteAlertOpen(false);
    setSelectedUser(null);
  };

  const onUserFormSubmit = (values: z.infer<typeof userFormSchema | typeof editUserSchema>) => {
    if (selectedUser) { // Editing existing user
      setUsers(users.map(u => u.id === selectedUser.id ? { ...u, ...values } : u));
      toast({
        title: 'User Updated',
        description: `Details for ${values.name} have been updated.`,
      });
    } else { // Adding new user
      const newUser: User = { ...values, id: `user-${Date.now()}` } as User;
      setUsers([...users, newUser]);
      toast({
        title: 'User Added',
        description: `${values.name} has been added to the system.`,
      });
    }
    setIsUserFormOpen(false);
    setSelectedUser(null);
  };

  const roleBadgeVariant = {
    admin: 'destructive',
    technician: 'secondary',
    customer: 'outline',
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
            <div>
                <CardTitle>Manage Users</CardTitle>
                <CardDescription>
                View, add, edit, and remove users from the system.
                </CardDescription>
            </div>
            <Button onClick={handleAddNewUser}>
                <PlusCircle className="mr-2" />
                Add User
            </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => {
                  const avatarData = PlaceHolderImages.find(img => img.id === `avatar-${user.name.toLowerCase()}`);
                  return (
                      <TableRow key={user.id}>
                          <TableCell>
                              <div className="flex items-center gap-3">
                                  <Avatar>
                                      {avatarData && <AvatarImage src={avatarData.imageUrl} data-ai-hint={avatarData.imageHint} />}
                                      <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                                  </Avatar>
                                  <span className="font-medium">{user.name}</span>
                              </div>
                          </TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>
                              <Badge variant={roleBadgeVariant[user.role] as any} className="capitalize">{user.role}</Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            {user.role !== 'admin' ? (
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                        <MoreHorizontal className="h-4 w-4" />
                                        <span className="sr-only">User Actions</span>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => handleEditUser(user)}>
                                        <Edit className="mr-2" /> Edit
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="text-destructive" onClick={() => handleDeleteUser(user)}>
                                        <Trash className="mr-2" /> Remove
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            ) : (
                                <span className="text-xs text-muted-foreground">No actions</span>
                            )}
                          </TableCell>
                      </TableRow>
                  )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add/Edit User Dialog */}
      <Dialog open={isUserFormOpen} onOpenChange={setIsUserFormOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{selectedUser ? 'Edit User' : 'Add New User'}</DialogTitle>
            <DialogDescription>
              {selectedUser ? 'Update the details for this user.' : 'Enter the details for the new user.'}
            </DialogDescription>
          </DialogHeader>
          <Form {...(selectedUser ? editForm : form)}>
            <form onSubmit={selectedUser ? editForm.handleSubmit(onUserFormSubmit) : form.handleSubmit(onUserFormSubmit)} className="space-y-4 py-4">
              <FormField
                control={selectedUser ? editForm.control : form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={selectedUser ? editForm.control : form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="john.doe@example.com" {...field} disabled={!!selectedUser} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {!selectedUser && (
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="••••••••" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
               <FormField
                control={selectedUser ? editForm.control : form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="customer">Customer</SelectItem>
                        <SelectItem value="technician">Technician</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                  <DialogClose asChild>
                    <Button type="button" variant="outline">Cancel</Button>
                  </DialogClose>
                  <Button type="submit">
                    {selectedUser ? 'Save Changes' : 'Create User'}
                  </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
        <AlertDialogContent>
            <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
                This action cannot be undone. This will permanently remove{' '}
                <strong>{selectedUser?.name}</strong> from the system.
            </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive hover:bg-destructive/90">
                Delete
            </AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
