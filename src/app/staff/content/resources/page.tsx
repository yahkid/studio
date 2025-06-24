
"use client";

import * as React from "react";
import { useState, useEffect, useTransition } from 'react';
import Link from 'next/link';
import { db } from '@/lib/firebaseClient';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import type { ResourceDoc } from '@/types/firestore';
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useToast } from "@/hooks/use-toast";
import { deleteResource } from "./actions";
import { Loader2, PlusCircle, Trash2, Edit, AlertCircle, Download, FileArchive, ImageIcon, FileText, Music, Video } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Card, CardHeader, CardContent, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { ResourceForm } from "./resource-form";

interface EnrichedResource extends ResourceDoc {
    id: string;
}

const getIconForFileType = (fileType: ResourceDoc['fileType']) => {
  const iconProps = { className: "h-6 w-6 text-primary" };
  switch (fileType) {
    case 'PDF': return <FileText {...iconProps} />;
    case 'DOCX': return <FileText {...iconProps} />;
    case 'MP3': return <Music {...iconProps} />;
    case 'MP4': return <Video {...iconProps} />;
    case 'ZIP': return <FileArchive {...iconProps} />;
    case 'JPG': return <ImageIcon {...iconProps} />;
    case 'PNG': return <ImageIcon {...iconProps} />;
    default: return <FileText {...iconProps} />;
  }
};


export default function ResourceManagerPage() {
    const [resources, setResources] = useState<EnrichedResource[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [editingResource, setEditingResource] = useState<EnrichedResource | null>(null);
    const [isDeleting, startDeleteTransition] = useTransition();
    const { toast } = useToast();

    const fetchResources = React.useCallback(async () => {
        setIsLoading(true);
        try {
            const resourcesQuery = query(collection(db, "resources"), orderBy("order", "asc"));
            const querySnapshot = await getDocs(resourcesQuery);
            const fetchedResources = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as EnrichedResource[];
            setResources(fetchedResources);
        } catch (error) {
            console.error("Error fetching resources:", error);
            toast({ title: "Error", description: "Could not fetch resource data.", variant: "destructive" });
        } finally {
            setIsLoading(false);
        }
    }, [toast]);

    useEffect(() => {
        fetchResources();
    }, [fetchResources]);

    const handleEdit = (resource: EnrichedResource) => {
        setEditingResource(resource);
        setIsSheetOpen(true);
    };
    
    const handleAdd = () => {
        setEditingResource(null);
        setIsSheetOpen(true);
    };

    const handleDelete = (resourceId: string) => {
        startDeleteTransition(async () => {
            const result = await deleteResource(resourceId);
            if (result.success) {
                toast({ title: "Resource Deleted" });
                fetchResources();
            } else {
                toast({ title: "Error", description: result.error, variant: "destructive" });
            }
        });
    };

    const handleFormSubmit = () => {
      setIsSheetOpen(false);
      fetchResources();
    }

    return (
        <div className="p-4 sm:p-6 lg:p-8">
            <div className="mb-8 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div>
                    <Link href="/staff/content" className="text-sm text-primary hover:underline">&larr; Back to Content Management</Link>
                    <h1 className="text-3xl font-bold tracking-tight font-headline flex items-center gap-3 mt-2">
                        <Download className="h-8 w-8 text-primary" />
                        Resource Manager
                    </h1>
                    <p className="text-muted-foreground font-body">
                        Create, edit, and manage downloadable resources.
                    </p>
                </div>
                <Button onClick={handleAdd} suppressHydrationWarning={true}><PlusCircle className="mr-2 h-4 w-4" /> Add New Resource</Button>
            </div>

            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                <SheetContent className="w-full sm:max-w-2xl">
                    <SheetHeader>
                        <SheetTitle>{editingResource ? "Edit Resource" : "Add New Resource"}</SheetTitle>
                        <SheetDescription>Fill out the details for the downloadable resource.</SheetDescription>
                    </SheetHeader>
                    <div className="mt-4 pr-4 h-[calc(100vh-8rem)] overflow-y-auto">
                       <ResourceForm onFormSubmit={handleFormSubmit} resource={editingResource} />
                    </div>
                </SheetContent>
            </Sheet>

            {isLoading ? (
                 <div className="flex justify-center items-center py-20"><Loader2 className="h-10 w-10 animate-spin text-primary" /></div>
            ) : resources.length === 0 ? (
                <Alert><AlertCircle className="h-4 w-4" /><AlertTitle>No Resources Found</AlertTitle><AlertDescription>Click "Add New Resource" to get started.</AlertDescription></Alert>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {resources.map(resource => (
                        <Card key={resource.id} className="flex flex-col">
                             <CardHeader className="flex-row items-start gap-4 space-y-0">
                                <div className="p-3 bg-muted rounded-full">
                                    {getIconForFileType(resource.fileType)}
                                </div>
                                <div>
                                    <CardTitle className="font-headline text-lg">{resource.title}</CardTitle>
                                    <CardDescription className="text-xs">{resource.category}</CardDescription>
                                </div>
                            </CardHeader>
                             <CardContent className="flex-grow">
                                <p className="text-sm text-muted-foreground line-clamp-3">{resource.description}</p>
                            </CardContent>
                            <CardFooter className="flex justify-end gap-2">
                                <Button variant="ghost" size="icon" onClick={() => handleEdit(resource)}><Edit className="h-4 w-4" /></Button>
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button variant="destructive" size="icon" disabled={isDeleting}><Trash2 className="h-4 w-4"/></Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader><AlertDialogTitle>Are you sure?</AlertDialogTitle><AlertDialogDescription>This action cannot be undone.</AlertDialogDescription></AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction onClick={() => handleDelete(resource.id)} disabled={isDeleting}>
                                                {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                                Yes, delete
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
}
