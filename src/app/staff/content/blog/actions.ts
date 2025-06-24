
'use server';

import { revalidatePath } from 'next/cache';
import { db, storage } from '@/lib/firebaseClient';
import { collection, addDoc, updateDoc, deleteDoc, doc, getDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { z } from 'zod';
import type { BlogPostDoc } from '@/types/firestore';

const blogPostSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters.'),
  slug: z.string().min(3, 'Slug must be at least 3 characters.'),
  author: z.string().min(2, 'Author name is required.'),
  content: z.string().min(50, 'Content must be at least 50 characters long.'),
  tags: z.string().optional(),
  is_published: z.coerce.boolean(),
  aiHint: z.string().optional(),
});

function slugify(text: string) {
    return text.toString().toLowerCase()
      .replace(/\s+/g, '-')           // Replace spaces with -
      .replace(/[^\w-]+/g, '')       // Remove all non-word chars
      .replace(/--+/g, '-')         // Replace multiple - with single -
      .replace(/^-+/, '')             // Trim - from start of text
      .replace(/-+$/, '');            // Trim - from end of text
}

export async function upsertBlogPost(formData: FormData) {
  const postId = formData.get('id') as string | null;
  const rawData = {
    title: formData.get('title'),
    slug: formData.get('slug') || slugify(formData.get('title') as string),
    author: formData.get('author'),
    content: formData.get('content'),
    tags: (formData.get('tags') as string | null) ?? undefined,
    is_published: formData.get('is_published') === 'true',
    aiHint: (formData.get('aiHint') as string | null) ?? undefined,
  };

  const validatedFields = blogPostSchema.safeParse(rawData);
  if (!validatedFields.success) {
    return { success: false, error: JSON.stringify(validatedFields.error.flatten().fieldErrors) };
  }
  
  const imageFile = formData.get('image_url') as File | null;
  let imageUrl = formData.get('currentImageUrl') as string || '';

  try {
    const docRef = postId ? doc(db, 'blog_posts', postId) : null;

    if (imageFile && imageFile.size > 0) {
      if (docRef) {
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const oldData = docSnap.data() as BlogPostDoc;
          if (oldData.image_url && oldData.image_url.includes('firebasestorage.googleapis.com')) {
            try { await deleteObject(ref(storage, oldData.image_url)); } 
            catch (e: any) { if (e.code !== 'storage/object-not-found') console.warn("Could not delete old image:", e); }
          }
        }
      }
      const imageRef = ref(storage, `blog_images/${Date.now()}_${imageFile.name}`);
      const snapshot = await uploadBytes(imageRef, imageFile);
      imageUrl = await getDownloadURL(snapshot.ref);
    }
    
    const dataToSave = {
      ...validatedFields.data,
      image_url: imageUrl,
      tags: validatedFields.data.tags ? validatedFields.data.tags.split(',').map(tag => tag.trim()).filter(Boolean) : [],
    };

    if (docRef) {
      await updateDoc(docRef, dataToSave);
    } else {
      await addDoc(collection(db, 'blog_posts'), {
        ...dataToSave,
        published_at: serverTimestamp(),
      });
    }

    revalidatePath('/staff/content/blog');
    revalidatePath('/blog'); // For future public blog page
    revalidatePath(`/blog/${dataToSave.slug}`);

    return { success: true };

  } catch (error: any) {
    console.error("Error upserting blog post:", error);
    return { success: false, error: error.message || "An unknown error occurred." };
  }
}

export async function deleteBlogPost(postId: string) {
  if (!postId) {
    return { success: false, error: "Post ID is required." };
  }

  try {
    const docRef = doc(db, 'blog_posts', postId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        const data = docSnap.data() as BlogPostDoc;
        if (data.image_url && data.image_url.includes('firebasestorage.googleapis.com')) {
            try { await deleteObject(ref(storage, data.image_url)); } 
            catch (e: any) { if (e.code !== 'storage/object-not-found') console.warn("Could not delete blog image:", e); }
        }
    }
    
    await deleteDoc(docRef);

    revalidatePath('/staff/content/blog');
    revalidatePath('/blog');
    return { success: true };
  } catch (error: any) {
    console.error("Error deleting blog post:", error);
    return { success: false, error: error.message || "An unknown error occurred." };
  }
}
