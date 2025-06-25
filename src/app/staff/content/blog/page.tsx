
"use client";

import * as React from "react";
import { useState, useEffect, useTransition } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { db } from '@/lib/firebaseClient';
import { collection, getDocs, query, orderBy, Timestamp } from 'firebase/firestore';
import type { BlogPostDoc } from '@/types/firestore';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useToast } from "@/hooks/use-toast";
import { deleteBlogPost } from "./actions";
import { Loader2, PlusCircle, Trash2, Edit, AlertCircle, FileText, BadgeCheck } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { BlogForm } from "./blog-form";
import { format } from "date-fns";
import { sw } from 'date-fns/locale';

interface EnrichedPost extends BlogPostDoc {
    id: string;
}

export default function BlogManagerPage() {
    const [posts, setPosts] = useState<EnrichedPost[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [editingPost, setEditingPost] = useState<EnrichedPost | null>(null);
    const [isDeleting, startDeleteTransition] = useTransition();
    const { toast } = useToast();

    const fetchPosts = React.useCallback(async () => {
        setIsLoading(true);
        try {
            const postsQuery = query(collection(db, "blog_posts"), orderBy("published_at", "desc"));
            const querySnapshot = await getDocs(postsQuery);
            const fetchedPosts = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as EnrichedPost[];
            setPosts(fetchedPosts);
        } catch (error) {
            console.error("Kosa la kupata machapisho:", error);
            toast({ title: "Kosa", description: "Imeshindwa kupata machapisho ya blogu.", variant: "destructive" });
        } finally {
            setIsLoading(false);
        }
    }, [toast]);

    useEffect(() => {
        fetchPosts();
    }, [fetchPosts]);

    const handleEdit = (post: EnrichedPost) => {
        setEditingPost(post);
        setIsSheetOpen(true);
    };
    
    const handleAdd = () => {
        setEditingPost(null);
        setIsSheetOpen(true);
    };

    const handleDelete = (postId: string) => {
        startDeleteTransition(async () => {
            const result = await deleteBlogPost(postId);
            if (result.success) {
                toast({ title: "Makala Imefutwa" });
                fetchPosts();
            } else {
                toast({ title: "Kosa", description: result.error, variant: "destructive" });
            }
        });
    };

    const handleFormSubmit = () => {
      setIsSheetOpen(false);
      fetchPosts();
    }

    return (
        <div className="p-4 sm:p-6 lg:p-8">
            <div className="mb-8 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div>
                    <Link href="/staff/content" className="text-sm text-primary hover:underline">&larr; Rudi kwenye Usimamizi wa Maudhui</Link>
                    <h1 className="text-3xl font-bold tracking-tight font-headline flex items-center gap-3 mt-2">
                        <FileText className="h-8 w-8 text-primary" />
                        Meneja wa Blogu
                    </h1>
                    <p className="text-muted-foreground font-body">
                        Unda, hariri, na chapisha makala.
                    </p>
                </div>
                <Button onClick={handleAdd} suppressHydrationWarning={true}><PlusCircle className="mr-2 h-4 w-4" /> Ongeza Makala Mpya</Button>
            </div>

            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                <SheetContent className="w-full sm:max-w-2xl">
                    <SheetHeader>
                        <SheetTitle>{editingPost ? "Hariri Makala" : "Ongeza Makala Mpya"}</SheetTitle>
                        <SheetDescription>Jaza maelezo ya makala ya blogu.</SheetDescription>
                    </SheetHeader>
                    <div className="mt-4 pr-4 h-[calc(100vh-8rem)] overflow-y-auto">
                       <BlogForm onFormSubmit={handleFormSubmit} post={editingPost} />
                    </div>
                </SheetContent>
            </Sheet>

            {isLoading ? (
                 <div className="flex justify-center items-center py-20"><Loader2 className="h-10 w-10 animate-spin text-primary" /></div>
            ) : posts.length === 0 ? (
                <Alert><AlertCircle className="h-4 w-4" /><AlertTitle>Hakuna Makala Zilizopatikana</AlertTitle><AlertDescription>Bofya "Ongeza Makala Mpya" ili kuanza.</AlertDescription></Alert>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {posts.map(post => (
                        <Card key={post.id} className="flex flex-col">
                            <CardHeader className="p-0 relative">
                                <Image 
                                    src={post.image_url || 'https://placehold.co/600x400.png'} 
                                    alt={post.title} 
                                    width={600} 
                                    height={400} 
                                    className="aspect-video object-cover rounded-t-lg"
                                    data-ai-hint={post.ai_hint || 'blog post abstract'}
                                />
                                <Badge variant={post.is_published ? "default" : "secondary"} className="absolute top-2 right-2">{post.is_published ? "Imechapishwa" : "Rasimu"}</Badge>
                            </CardHeader>
                             <CardContent className="pt-4 flex-grow">
                                <p className="text-xs text-muted-foreground">{post.published_at ? format(post.published_at.toDate(), 'PPP', { locale: sw }) : ''}</p>
                                <CardTitle className="font-headline text-lg mt-1">{post.title}</CardTitle>
                                <CardDescription className="text-xs mt-1">Na: {post.author}</CardDescription>
                            </CardContent>
                            <CardFooter className="flex justify-end gap-2">
                                <Button variant="ghost" size="icon" onClick={() => handleEdit(post)}><Edit className="h-4 w-4" /></Button>
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button variant="destructive" size="icon" disabled={isDeleting}><Trash2 className="h-4 w-4"/></Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader><AlertDialogTitle>Una uhakika?</AlertDialogTitle><AlertDialogDescription>Kitendo hiki hakiwezi kutenduliwa.</AlertDialogDescription></AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Ghairi</AlertDialogCancel>
                                            <AlertDialogAction onClick={() => handleDelete(post.id)} disabled={isDeleting}>
                                                {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                                Ndio, futa
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
