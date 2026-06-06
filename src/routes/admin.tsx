import { createFileRoute, Navigate } from "@tanstack/react-router";
import { authClient } from "../lib/auth-client.ts";
import { MagneticButton } from "../components/ui/MagneticButton";
import { useState, useEffect } from "react";
import { Switch } from "../components/ui/switch";
import { Label } from "../components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { Badge } from "../components/ui/badge";
import { toast } from "sonner";

export const Route = createFileRoute("/admin")({
  component: AdminDashboard,
});

function AdminDashboard() {
  const { data: session, isPending } = authClient.useSession();
  
  // Admin states
  const [settings, setSettings] = useState({ bounceValidationEnabled: true, emailVerificationRequired: true });
  const [users, setUsers] = useState<any[]>([]);
  const [isAdminLoading, setIsAdminLoading] = useState(true);

  const user = session?.user;
  const isAdmin = user?.email === "ab@gmail.com";

  useEffect(() => {
    if (isAdmin) {
      fetchDashboardData();
    }
  }, [isAdmin]);

  const fetchDashboardData = async () => {
    setIsAdminLoading(true);
    try {
      const [settingsRes, usersRes] = await Promise.all([
        fetch("http://localhost:5001/api/admin/settings", { credentials: "include" }),
        fetch("http://localhost:5001/api/admin/users", { credentials: "include" })
      ]);

      if (settingsRes.ok) {
        setSettings(await settingsRes.json());
      }
      if (usersRes.ok) {
        setUsers(await usersRes.json());
      }
    } catch (error) {
      console.error("Error fetching admin data", error);
      toast.error("Failed to load admin data");
    } finally {
      setIsAdminLoading(false);
    }
  };

  const updateSetting = async (key: string, value: boolean) => {
    const previousSettings = { ...settings };
    setSettings((prev) => ({ ...prev, [key]: value }));

    try {
      const res = await fetch("http://localhost:5001/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ [key]: value }),
      });

      if (!res.ok) throw new Error("Failed to update setting");
      toast.success("Setting updated successfully");
    } catch (error) {
      setSettings(previousSettings);
      toast.error("Failed to update setting");
    }
  };

  if (isPending) {
    return (
      <main className="px-8 py-32 pt-32 sm:px-12 lg:px-20 flex justify-center items-center">
        <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground animate-pulse">Loading session...</p>
      </main>
    );
  }

  if (!user || !isAdmin) return <Navigate to="/auth" />;

  const handleSignOut = async () => {
    await authClient.signOut();
  };

  return (
    <main className="px-8 py-32 pt-32 sm:px-12 lg:px-20 min-h-screen">
      <div className="mx-auto max-w-6xl">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Admin Dashboard</p>
            <h1 className="mt-3 font-display text-6xl">Bonjour, {user.name?.split(" ")[0]}.</h1>
            <p className="mt-4 text-sm text-muted-foreground">
              You're signed in as a {user.role || "admin"}. {user.email}
            </p>
          </div>
          <MagneticButton variant="outline" onClick={handleSignOut}>Sign out</MagneticButton>
        </div>

        <div className="mt-20 space-y-12 border-t pt-16 border-border">
          <div>
            <h1 className="font-display text-4xl">System Configuration</h1>
            <p className="mt-4 text-muted-foreground">Manage system configuration and view registered users.</p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Bounce-Off Email Validation</CardTitle>
                <CardDescription>
                  When ON, new registrations validate email addresses via ZeroBounce before creating the account.
                  When OFF, email validation is skipped entirely.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <Label htmlFor="bounce-toggle" className="text-base font-medium">Enable Validation</Label>
                  <Switch 
                    id="bounce-toggle" 
                    checked={settings.bounceValidationEnabled}
                    onCheckedChange={(v) => updateSetting("bounceValidationEnabled", v)}
                    disabled={isAdminLoading}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Email Link Verification Requirement</CardTitle>
                <CardDescription>
                  When ON, users must click the link sent to their email to verify their account before full access.
                  When OFF, new users are instantly verified and can complete onboarding immediately.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <Label htmlFor="verification-toggle" className="text-base font-medium">Require Verification</Label>
                  <Switch 
                    id="verification-toggle" 
                    checked={settings.emailVerificationRequired}
                    onCheckedChange={(v) => updateSetting("emailVerificationRequired", v)}
                    disabled={isAdminLoading}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Registered Users ({users.length})</CardTitle>
              <CardDescription>A complete list of all users registered in the system.</CardDescription>
            </CardHeader>
            <CardContent>
              {isAdminLoading ? (
                <div className="h-32 flex items-center justify-center text-muted-foreground">Loading users...</div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Verified</TableHead>
                        <TableHead>Created At</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users.map((u) => (
                        <TableRow key={u._id || u.id}>
                          <TableCell className="font-medium">{u.name}</TableCell>
                          <TableCell>{u.email}</TableCell>
                          <TableCell>
                            <Badge variant={u.role === "admin" ? "default" : "secondary"}>
                              {u.role}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {u.emailVerified ? (
                              <Badge variant="default" className="bg-green-500 hover:bg-green-600">Yes</Badge>
                            ) : (
                              <Badge variant="destructive">No</Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-muted-foreground text-sm">
                            {new Date(u.createdAt).toLocaleDateString()}
                          </TableCell>
                        </TableRow>
                      ))}
                      {users.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={5} className="h-24 text-center">
                            No users found.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
