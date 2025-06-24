
import { type Metadata } from 'next';
import { db } from '@/lib/firebaseClient';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import type { BlogPostDoc } from '@/types/firestore';
import { BlogCard } from '@/components/cards/blog-card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { FileText, Search } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Blog | HSCM Connect',
  description: 'Soma makala za kutia moyo, mafundisho ya kina, na habari za huduma kutoka HSCM Connect.',
};

async function getBlogPosts(): Promise<(BlogPostDoc & { id: string })[]> {
  if (!db) return [];
  try {
    const postsQuery = query(
      collection(db, "blog_posts"),
      where("is_published", "==", true),
      orderBy("published_at", "desc")
    );
    const querySnapshot = await getDocs(postsQuery);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as (BlogPostDoc & { id: string })[];
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    return [];
  }
}

export default async function BlogPage() {
  const posts = await getBlogPosts();

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
        <FileText className="mx-auto h-16 w-16 text-primary mb-6" />
        <h1 className="font-headline text-4xl md:text-5xl text-foreground mb-4">
          Blog ya HSCM Connect
        </h1>
        <p className="font-body text-xl text-muted-foreground">
          Pata maarifa, msukumo, na habari za hivi punde kutoka kwa timu yetu.
        </p>
      </div>

      {posts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {posts.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <Alert className="max-w-xl mx-auto">
            <Search className="h-4 w-4" />
            <AlertTitle>Hakuna Makala Zilizopatikana</AlertTitle>
            <AlertDescription>
              Samahani, hakuna makala zilizochapishwa kwa sasa. Tafadhali angalia tena hivi karibuni!
            </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
