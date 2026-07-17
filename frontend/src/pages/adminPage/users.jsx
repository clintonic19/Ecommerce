/**
 * ADMIN USERS PAGE
 * =================
 * Admin page component for viewing and deleting registered users.
 *
 * This component displays a table of all users registered in the
 * ecommerce platform. It fetches user data from the protected admin
 * API endpoint on mount and renders it in a Card/Table layout.
 *
 * FEATURES:
 * - View all registered users (name, email, role, join date)
 * - Delete users with confirmation dialog
 * - Prevents admin from deleting their own account (backend enforced)
 * - Role badges with color coding (admin = red, user = green)
 *
 * STATE MANAGEMENT:
 * - Uses Redux (adminUsersSlice) for user data and loading state
 * - Auth via httpOnly JWT cookie (withCredentials: true)
 */

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { Button } from "../../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import { getAllUsers, deleteUser } from "../../store/admin/users-slice/usersSlice";

const AdminUsers = () => {
  const dispatch = useDispatch();
  const { userList, isLoading, error } = useSelector((state) => state.adminUsers);
  const { user } = useSelector((state) => state.auth);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  /**
   * Fetch all users on component mount.
   *
   * Authentication is handled automatically via the httpOnly JWT cookie.
   * The backend `protectedRoute` middleware reads the token from req.cookies.token.
   */
  useEffect(() => {
    dispatch(getAllUsers());
  }, [dispatch]);

  /**
   * Format a date string into a human-readable format.
   * Example: "2024-01-15T10:30:00.000Z" -> "Jan 15, 2024"
   */
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  /**
   * Determine display color for user role badges.
   * Admin accounts get a distinct color for quick visual identification.
   */
  const getRoleBadgeColor = (role) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-800";
      default:
        return "bg-green-100 text-green-800";
    }
  };

  /**
   * Open the delete confirmation dialog for a specific user.
   * Stores the user object so we can display their name in the dialog.
   */
  const handleDeleteClick = (targetUser) => {
    setUserToDelete(targetUser);
    setDeleteDialogOpen(true);
  };

  /**
   * Confirm and execute the delete action.
   * Dispatches the deleteUser thunk, then re-fetches the user list
   * to reflect the deletion immediately in the UI.
   */
  const handleConfirmDelete = () => {
    if (userToDelete?._id) {
      dispatch(deleteUser(userToDelete._id)).then(() => {
        dispatch(getAllUsers());
      });
    }
    setDeleteDialogOpen(false);
    setUserToDelete(null);
  };

  /**
   * Cancel the delete action and close the dialog.
   */
  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
    setUserToDelete(null);
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Loading users...</CardTitle>
        </CardHeader>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-red-600">Error loading users</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{error}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>All Registered Users ({userList?.length || 0})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {userList && userList?.length > 0 ? (
                userList?.map((u) => (
                  <TableRow key={u?._id}>
                    <TableCell className="font-medium">
                      {u?.firstName} {u?.lastName}
                    </TableCell>
                    <TableCell>{u?.email}</TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(
                          u?.role
                        )}`}
                      >
                        {u?.role}
                      </span>
                    </TableCell>
                    <TableCell>{formatDate(u?.createdAt)}</TableCell>
                    <TableCell>
                      {u?.role !== "admin" && u?._id !== user?._id && (
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteClick(u)}
                        >
                          Delete
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-gray-500">
                    No users found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete User</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete{" "}
              <strong>
                {userToDelete?.firstName} {userToDelete?.lastName}
              </strong>
              ({userToDelete?.email})? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={handleCancelDelete}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleConfirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AdminUsers;
