
"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useAuthFirebase } from "@/contexts/AuthContextFirebase";
import { StaffSidebar } from "@/components/layout/staff-sidebar";
import {
  SidebarProvider,
  Sidebar,
  SidebarInset,
} from "@/components/ui/sidebar";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ADMIN_UID = process.env.NEXT_PUBLIC_ADMIN_UID;

export default function StaffLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading, initialLoadingComplete } = useAuthFirebase();
  const router = useRouter();
  const { toast } = useToast();
  const [isAuthorized, setIsAuthorized] = React.useState(false);

  React.useEffect(() => {
    if (initialLoadingComplete) {
      if (!user || user.uid !== ADMIN_UID) {
        toast({
          title: "Access Denied",
          description: "You do not have permission to view this page.",
          variant: "destructive",
        });
        router.replace("/"); // Use replace to prevent going back to the protected page
      } else {
        setIsAuthorized(true);
      }
    }
  }, [user, initialLoadingComplete, router, toast]);

  if (loading || !initialLoadingComplete || !isAuthorized) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="mr-2 h-8 w-8 animate-spin" />
        <span>Verifying access...</span>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <Sidebar>
        <StaffSidebar />
      </Sidebar>
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  );
}
