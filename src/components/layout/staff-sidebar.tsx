
"use client";

import * as React from "react";
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthFirebase } from '@/contexts/AuthContextFirebase';

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel
} from "@/components/ui/sidebar";
import {
  Shield,
  ShieldCheck,
  Newspaper,
  DollarSign,
  HandHeart,
  BarChart3,
  Settings,
  LayoutDashboard,
  LogOut,
  Home,
  User,
  Globe,
  UsersRound,
  Baby,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from "../ui/button";

export function StaffSidebar() {
  const pathname = usePathname();
  const { user } = useAuthFirebase();

  const getInitials = (name?: string | null) => {
    if (!name) return '';
    const nameParts = name.trim().split(' ');
    if (nameParts.length === 0 || nameParts[0] === '') return '';
    if (nameParts.length === 1) return nameParts[0].substring(0, 2).toUpperCase();
    return nameParts.map((part) => part[0]).join('').toUpperCase().substring(0, 2);
  };
  
  const menuItems = [
    { href: '/staff', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/review-testimonies', label: 'Review Testimonies', icon: ShieldCheck },
    { href: '/staff/pastoral', label: 'Pastoral Care', icon: HandHeart },
    { href: '/staff/content', label: 'Content', icon: Newspaper },
    { href: '/staff/humanitarian', label: 'Humanitarian', icon: Globe },
    { href: '/staff/youth', label: 'Youth Ministry', icon: UsersRound },
    { href: '/staff/children', label: "Children's Ministry", icon: Baby },
    { href: '/staff/transport-security', label: 'Transport & Security', icon: Shield },
    { href: '/staff/finance', label: 'Finance', icon: DollarSign },
    { href: '/staff/analytics', label: 'Analytics', icon: BarChart3 },
  ];
  
  return (
    <>
      <SidebarHeader>
        <div className="flex items-center gap-2">
            <Image
                src="/hscm-logo.png"
                alt="HSCM Connect Logo"
                width={32}
                height={32}
                className="size-8"
            />
            <span className="text-lg font-semibold group-data-[collapsible=icon]:hidden">
                HSCM Staff
            </span>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <Link href={item.href}>
                <SidebarMenuButton
                  isActive={pathname.startsWith(item.href) && (item.href !== '/staff' || pathname === '/staff')}
                  tooltip={item.label}
                >
                  <item.icon />
                  <span>{item.label}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter>
        <SidebarGroup>
          <SidebarGroupLabel>Account</SidebarGroupLabel>
          <SidebarMenu>
             <SidebarMenuItem>
              <Link href="/staff/settings">
                <SidebarMenuButton tooltip="Settings" isActive={pathname === '/staff/settings'}>
                  <Settings/>
                  <span>Settings</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
             <SidebarMenuItem>
              <Link href="/">
                <SidebarMenuButton tooltip="Return to Site">
                  <Home />
                  <span>Return to Site</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
        
        {user && (
           <div className="flex items-center gap-3 rounded-md p-2 transition-colors">
              <Avatar className="size-8">
                {user.photoURL && <AvatarImage src={user.photoURL} alt="User avatar" />}
                <AvatarFallback>{getInitials(user.displayName)}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col overflow-hidden group-data-[collapsible=icon]:hidden">
                <p className="truncate text-sm font-medium">{user.displayName || "Staff Member"}</p>
                <p className="truncate text-xs text-sidebar-foreground/70">{user.email}</p>
              </div>
          </div>
        )}
      </SidebarFooter>
    </>
  );
}
