"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Eye, Ban } from "lucide-react";
import { toast } from "sonner";
import { UserDetailsDialog } from "@/components/admin/users/user-details-dialog";

interface User {
  id: string;
  email: string;
  name: string | null;
  role: string;
  createdAt: string;
  lastLogin: string | null;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    try {
      const response = await fetch("/api/admin/users");
      if (!response.ok) throw new Error();
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  }

  async function toggleUserStatus(id: string) {
    try {
      const response = await fetch(`/api/admin/users/${id}/toggle-status`, {
        method: "POST"
      });
      if (!response.ok) throw new Error();
      
      const updatedUser = await response.json();
      setUsers(users.map(user => 
        user.id === id ? updatedUser : user
      ));
      
      toast.success("User status updated");
    } catch (error) {
      toast.error("Failed to update user status");
    }
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Users</h1>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead>Last Login</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.name || "Anonymous"}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>
                  {format(new Date(user.createdAt), "PPP")}
                </TableCell>
                <TableCell>
                  {user.lastLogin 
                    ? format(new Date(user.lastLogin), "PPP")
                    : "Never"
                  }
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedUser(user.id)}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleUserStatus(user.id)}
                  >
                    <Ban className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <UserDetailsDialog
        userId={selectedUser}
        open={!!selectedUser}
        onOpenChange={() => setSelectedUser(null)}
      />
    </div>
  );
}