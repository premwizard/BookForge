"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuthStore } from "@/stores/authStore";

export default function SettingsPage() {
  const { user } = useAuthStore();

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Manage your account settings and preferences.</p>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="api">API Keys</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your personal information.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" defaultValue={user?.email || "user@example.com"} disabled />
                <p className="text-xs text-gray-500">Your email address is used for login and cannot be changed.</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Account Role</Label>
                <Input id="role" type="text" defaultValue={user?.role || "User"} disabled />
              </div>
            </CardContent>
            <CardFooter className="border-t border-gray-100 dark:border-zinc-800 pt-6">
              <Button>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="account">
          <Card>
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
              <CardDescription>Ensure your account is using a long, random password to stay secure.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">Current Password</Label>
                <Input id="current-password" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input id="new-password" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <Input id="confirm-password" type="password" />
              </div>
            </CardContent>
            <CardFooter className="border-t border-gray-100 dark:border-zinc-800 pt-6">
              <Button>Update Password</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="billing">
          <Card>
            <CardHeader>
              <CardTitle>Subscription Plan</CardTitle>
              <CardDescription>Manage your billing and subscription status.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 border border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-900/10 rounded-lg">
                <div>
                  <h3 className="font-semibold text-blue-900 dark:text-blue-100">Pro Plan</h3>
                  <p className="text-sm text-blue-700 dark:text-blue-300">Unlimited documents & AI formatting</p>
                </div>
                <div className="text-right">
                  <div className="font-bold text-xl text-blue-900 dark:text-blue-100">$49/mo</div>
                  <p className="text-xs text-blue-700 dark:text-blue-300">Next billing date: Aug 16, 2026</p>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">Payment Method</h4>
                <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-zinc-800 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="h-8 w-12 bg-gray-200 dark:bg-zinc-800 rounded flex items-center justify-center text-xs font-bold">VISA</div>
                    <div>
                      <p className="text-sm font-medium">Visa ending in 4242</p>
                      <p className="text-xs text-gray-500">Expires 12/28</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">Update</Button>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t border-gray-100 dark:border-zinc-800 pt-6 flex justify-between">
              <Button variant="outline" className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 border-red-200 dark:border-red-900/50">Cancel Subscription</Button>
              <Button>View Billing History</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Email Notifications</CardTitle>
              <CardDescription>Choose what updates you want to receive.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Formatting Complete</Label>
                  <p className="text-sm text-gray-500">Receive an email when your document has finished processing.</p>
                </div>
                {/* Normally a Switch component goes here */}
                <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Validation Errors</Label>
                  <p className="text-sm text-gray-500">Receive an email if document validation fails.</p>
                </div>
                <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600" defaultChecked />
              </div>
            </CardContent>
            <CardFooter className="border-t border-gray-100 dark:border-zinc-800 pt-6">
              <Button>Save Preferences</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="api">
          <Card>
            <CardHeader>
              <CardTitle>API Access</CardTitle>
              <CardDescription>Manage your API keys for programmatic access to BookForge.</CardDescription>
            </CardHeader>
            <CardContent>
               <div className="bg-gray-50 dark:bg-zinc-900 p-4 rounded-md font-mono text-sm break-all border border-gray-200 dark:border-zinc-800">
                  sk_live_***************************89f2
               </div>
            </CardContent>
            <CardFooter className="border-t border-gray-100 dark:border-zinc-800 pt-6 flex justify-between">
              <Button variant="outline">Revoke Key</Button>
              <Button>Generate New Key</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
