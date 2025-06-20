
"use client";

import * as React from "react";
import { ExpandableTabs } from "@/components/ui/expandable-tabs";
import { Card } from "@/components/ui/card"; // Import Card
import { Bell, Home, HelpCircle, Settings, Shield, Mail, User, FileText, Lock, TrendingUp } from "lucide-react";
// import type { Metadata } from 'next'; // Removed

// Client components cannot export metadata directly.
// If metadata is needed, it should be in a parent Server Component or layout.
// export const metadata: Metadata = {
//   title: 'Expandable Tabs Demo | HSCM Connect',
//   description: 'Demonstration of the ExpandableTabs component.',
// };

function DefaultDemo() {
  const tabs = [
    { title: "Dashboard", icon: Home },
    { title: "Notifications", icon: Bell },
    { type: "separator" as const }, 
    { title: "Settings", icon: Settings },
    { title: "Support", icon: HelpCircle },
    { title: "Security", icon: Shield },
  ];

  return (
    <div className="flex flex-col gap-4">
      <ExpandableTabs tabs={tabs} onChange={(index) => console.log('DefaultDemo selected index:', index)} />
    </div>
  );
}

function CustomColorDemo() {
  const tabs = [
    { title: "Profile", icon: User },
    { title: "Messages", icon: Mail },
    { type: "separator" as const }, 
    { title: "Documents", icon: FileText },
    { title: "Privacy", icon: Lock },
  ];

  return (
    <div className="flex flex-col gap-4">
      <ExpandableTabs 
        tabs={tabs} 
        activeColor="text-blue-500 dark:text-blue-400"
        className="border-blue-200 dark:border-blue-800" 
        onChange={(index) => console.log('CustomColorDemo selected index:', index)}
      />
    </div>
  );
}

export default function ExpandableTabsDemoPage() {
  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="font-headline text-3xl text-foreground mb-8 text-center">
        Expandable Tabs Demo
      </h1>
      <p className="font-body text-muted-foreground mb-10 text-center max-w-xl mx-auto">
        This page demonstrates the usage of the <code>ExpandableTabs</code> component. 
        Click on the icons to see the tabs expand and change their active state.
      </p>
      <div className="space-y-12">
        <div>
          <h2 className="font-headline text-2xl text-foreground mb-4">Default Style</h2>
          <Card> {/* Use Card component */}
            <div className="flex justify-center p-6 md:p-8"> {/* Padding changed */}
              <DefaultDemo />
            </div>
          </Card>
        </div>
        <div>
          <h2 className="font-headline text-2xl text-foreground mb-4">Custom Color Style</h2>
           <Card> {/* Use Card component */}
            <div className="flex justify-center p-6 md:p-8"> {/* Padding changed */}
              <CustomColorDemo />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
