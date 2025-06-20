
"use client";

import * as React from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import {
  Bell,
  Bookmark,
  Settings,
  Edit,
  ImageIcon,
  Lock,
  LogOut,
  Pencil,
  Share2,
  User,
  UserPlus,
  Users,
} from "lucide-react";

function WithAvatar() {
  return (
    <ContextMenu>
      <ContextMenuTrigger className="flex cursor-pointer items-center gap-2 p-4 text-xs rounded-md border shadow-sm hover:shadow-md transition-shadow">
        <Avatar className="size-8">
          <AvatarFallback>PJ</AvatarFallback>
        </Avatar>
        <span className="font-medium text-foreground">Right Click Here</span>
      </ContextMenuTrigger>
      <ContextMenuContent className="w-64">
        <ContextMenuItem>
          <User className="mr-2 size-4" />
          View Profile
        </ContextMenuItem>
        <ContextMenuItem>
          <Edit className="mr-2 size-4" />
          Edit Profile
        </ContextMenuItem>
        <ContextMenuItem>
          <ImageIcon className="mr-2 size-4" />
          Change Avatar
        </ContextMenuItem>
        <ContextMenuItem>
          <Pencil className="mr-2 size-4" />
          Update Bio
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem>
          <Bookmark className="mr-2 size-4" />
          View Bookmarks
        </ContextMenuItem>
        <ContextMenuItem>
          <Share2 className="mr-2 size-4" />
          View Shared Bookmarks
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem>
          <UserPlus className="mr-2 size-4" />
          Manage Followers
        </ContextMenuItem>
        <ContextMenuItem>
          <Users className="mr-2 size-4" />
          Manage Following
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem>
          <Settings className="mr-2 size-4" />
          Account Settings
        </ContextMenuItem>
        <ContextMenuItem>
          <Lock className="mr-2 size-4" />
          Privacy Settings
        </ContextMenuItem>
        <ContextMenuItem>
          <Bell className="mr-2 size-4" />
          Notification Settings
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem>
          <LogOut className="mr-2 size-4" />
          Logout
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}

export default function ContextMenuDemoPage() {
  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="font-headline text-3xl text-foreground mb-8 text-center">
        ContextMenu Demo
      </h1>
      <p className="font-body text-muted-foreground mb-10 text-center max-w-xl mx-auto">
        This page demonstrates the usage of the <code>ContextMenu</code> component. 
        Right-click on the "PJ" avatar and text below to see it in action.
      </p>
      <Card>
        <CardHeader>
          <CardTitle>Context Menu Example</CardTitle>
          <CardDescription>
            Right-click on the items below to see their context menus.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-start gap-4">
          <p>This card contains an element that has a context menu attached. Try right-clicking on the avatar and the text next to it.</p>
          <WithAvatar />
        </CardContent>
      </Card>
    </div>
  );
}
