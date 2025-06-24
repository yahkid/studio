
import Link from 'next/link';
import Image from 'next/image';
import type { BlogPostDoc } from '@/types/firestore';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, Calendar } from 'lucide-react';
import { format } from 'date-fns';

interface BlogCardProps {
  post: BlogPostDoc & { id: string };
}

export function BlogCard({ post }: BlogCardProps) {
  return (
    <Card className="flex flex-col h-full overflow-hidden border rounded-lg hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="p-0 relative group">
        <Link href={`/blog/${post.slug}`} aria-label={`Soma makala: ${post.title}`}>
          <div className="aspect-[16/9] w-full overflow-hidden">
            <Image
              src={post.image_url || "https://placehold.co/600x338.png"}
              alt={`Picha ya jalada ya ${post.title}`}
              width={600}
              height={338}
              className="object-cover w-full h-full transition-transform duration-300 ease-in-out group-hover:scale-105"
              data-ai-hint={post.ai_hint || 'blog post abstract'}
            />
          </div>
        </Link>
      </CardHeader>
      <CardContent className="flex-grow p-4 space-y-3">
        <Link href={`/blog/${post.slug}`} className="block">
          <CardTitle className="font-headline text-xl text-foreground hover:text-primary transition-colors duration-200 line-clamp-2">
            {post.title}
          </CardTitle>
        </Link>
        <div className="flex items-center text-xs text-muted-foreground pt-1">
            <User className="h-3 w-3 mr-1.5" />
            <span>{post.author}</span>
            <span className="mx-2">|</span>
            <Calendar className="h-3 w-3 mr-1.5" />
            <span>{format(post.published_at.toDate(), 'MMM d, yyyy')}</span>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button asChild className="w-full font-headline" size="sm">
          <Link href={`/blog/${post.slug}`}>
            Soma Zaidi
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
