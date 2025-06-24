
import { db } from '@/lib/firebaseClient';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';
import type { BlogPostDoc } from '@/types/firestore';
import { notFound } from 'next/navigation';
import type { Metadata, ResolvingMetadata } from 'next';
import Image from 'next/image';
import { format } from 'date-fns';
import { Calendar, User } from 'lucide-react';

type Props = {
  params: { slug: string };
};

async function getPostBySlug(slug: string): Promise<(BlogPostDoc & { id: string }) | null> {
  if (!db) return null;
  try {
    const q = query(
      collection(db, "blog_posts"),
      where("slug", "==", slug),
      where("is_published", "==", true),
      limit(1)
    );
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      return null;
    }
    const doc = querySnapshot.docs[0];
    return { id: doc.id, ...doc.data() } as (BlogPostDoc & { id: string });
  } catch (error) {
    console.error(`Error fetching post with slug ${slug}:`, error);
    return null;
  }
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const post = await getPostBySlug(params.slug);

  if (!post) {
    return {
      title: 'Makala Haikupatikana | HSCM Connect',
    };
  }

  const description = post.content.substring(0, 160).replace(/\s\w+$/, '...');

  return {
    title: `${post.title} | HSCM Connect Blog`,
    description: description,
    openGraph: {
      title: post.title,
      description: description,
      images: post.image_url ? [{ url: post.image_url }] : [],
      type: 'article',
      publishedTime: post.published_at.toDate().toISOString(),
      authors: [post.author],
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const post = await getPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  return (
    <article className="container mx-auto max-w-3xl py-8 px-4">
      <header className="mb-8">
        <h1 className="font-headline text-4xl md:text-5xl text-foreground mb-4">
          {post.title}
        </h1>
        <div className="flex items-center space-x-4 text-muted-foreground font-body text-sm">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span>Na {post.author}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <time dateTime={post.published_at.toDate().toISOString()}>
              {format(post.published_at.toDate(), 'MMMM d, yyyy')}
            </time>
          </div>
        </div>
      </header>
      
      {post.image_url && (
        <div className="relative aspect-video w-full rounded-lg overflow-hidden mb-8 shadow-md">
          <Image
            src={post.image_url}
            alt={post.title}
            fill
            style={{ objectFit: 'cover' }}
            priority
            data-ai-hint={post.ai_hint || 'blog post abstract'}
          />
        </div>
      )}

      <div className="prose prose-lg dark:prose-invert max-w-none font-body leading-relaxed">
        {post.content.split('\\n').map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>

    </article>
  );
}
