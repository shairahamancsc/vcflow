'use client';

import { useState, useEffect } from 'react';
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
import type { User } from '@/lib/data';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, PlusCircle, Trash, Edit, Loader2 } from 'lucide-react';
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
import { supabase } from '@/lib/supabaseClient';

const userFormSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email.' }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters.' }),
  role: z.enum(['customer', 'technician']),
});

const editUserSchema = z.object({
    id: z.string(),
    name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
    email: z.string().email({ message: 'Please enter a valid email.' }),
    role: z.enum(['customer', 'technician']),
});


export default function ManageUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUserFormOpen, setIsUserFormOpen] = useState(false);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const { toast } = useToast();

  const fetchUsers = async () => {
    setIsLoading(true);
    const { data, error } = await supabase.from('profiles').select('*');
    if (error) {
      toast({ variant: 'destructive', title: 'Error fetching users', description: error.message });
    } else {
      setUsers(data as User[]);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const form = useForm<z.infer<typeof userFormSchema>>({
    resolver: zodResolver(userFormSchema),
    defaultValues: { name: '', email: '', password: '', role: 'customer' },
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
  
  const confirmDelete = async () => {
    if (!selectedUser) return;

    // This requires elevated privileges, typically done in a serverless function.
    // For this prototype, we assume the admin has rights to call this.
    // In production, you MUST secure this in a Supabase Edge Function.
    const { error: authError } = await supabase.auth.admin.deleteUser(selectedUser.id);

    if (authError) {
        toast({ variant: 'destructive', title: 'Failed to remove user from Auth', description: authError.message });
        setIsDeleteAlertOpen(false);
        return;
    }
    
    // Also remove from our public 'profiles' table
    const { error: profileError } = await supabase.from('profiles').delete().eq('id', selectedUser.id);
    
    if (profileError) {
        toast({ variant: 'destructive', title: 'Failed to remove user profile', description: profileError.message });
    } else {
        toast({ title: 'User Removed', description: `${selectedUser.name} has been removed.` });
        fetchUsers(); // Refresh the list
    }
    setIsDeleteAlertOpen(false);
    setSelectedUser(null);
  };

  const onUserFormSubmit = async (values: z.infer<typeof userFormSchema> | z.infer<typeof editUserSchema>) => {
    setIsSubmitting(true);
    if (selectedUser) { // Editing existing user
      const { error } = await supabase
        .from('profiles')
        .update({ name: values.name, role: values.role })
        .eq('id', selectedUser.id);

      if (error) {
        toast({ variant: 'destructive', title: 'Update Failed', description: error.message });
      } else {
        toast({ title: 'User Updated', description: `Details for ${values.name} have been updated.` });
        fetchUsers();
      }
    } else { // Adding new user
        const newUserData = values as z.infer<typeof userFormSchema>;
        // Create user in Supabase Auth
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email: newUserData.email,
            password: newUserData.password,
            options: { data: { name: newUserData.name, role: newUserData.role } }
        });

        if (authError || !authData.user) {
            toast({ variant: 'destructive', title: 'Signup Failed', description: authError?.message || 'Could not create user.' });
        } else {
            // The onAuthStateChange trigger in `auth-context` should handle the profile creation,
            // but we can add it here explicitly for robustness if needed.
             const { error: profileError } = await supabase.from('profiles').insert({
                id: authData.user.id,
                name: newUserData.name,
                email: newUserData.email,
                role: newUserData.role
            });

            if (profileError) {
                 toast({ variant: 'destructive', title: 'Profile Creation Failed', description: profileError.message });
            } else {
                 toast({ title: 'User Added', description: `${newUserData.name} has been added.` });
                 fetchUsers();
            }
        }
    }
    setIsSubmitting(false);
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
          {isLoading ? (
            <div className="flex justify-center items-center h-48">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
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
          )}
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
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
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
                <strong>{selectedUser?.name}</strong> from the system and Supabase Authentication.
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
