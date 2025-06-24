
import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Music, Video, Download, FileArchive, ImageIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { ResourceDoc } from '@/types/firestore';

interface ResourceCardProps {
  resource: ResourceDoc;
}

const getIconForFileType = (fileType: ResourceDoc['fileType']) => {
  const iconProps = { className: "h-8 w-8 text-primary" };
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

export function ResourceCard({ resource }: ResourceCardProps) {
  return (
    <Card className="flex flex-col h-full overflow-hidden border rounded-lg hover:shadow-lg transition-shadow duration-300">
      {/* Visual Header Part */}
      {resource.thumbnailUrl ? (
        <div className="relative aspect-video w-full group overflow-hidden">
          <Image
            src={resource.thumbnailUrl}
            alt={`Preview for ${resource.title}`}
            fill
            style={{ objectFit: 'cover' }}
            className="bg-muted transition-transform duration-300 ease-in-out group-hover:scale-105"
            data-ai-hint={resource.aiHint || 'resource background abstract'}
          />
        </div>
      ) : (
        <div className="p-6 h-[150px] flex justify-center items-center bg-muted/30">
          <div className="p-4 bg-primary/10 rounded-full">
            {getIconForFileType(resource.fileType)}
          </div>
        </div>
      )}

      {/* Text Content Part */}
      <CardHeader>
        <Badge variant="outline" className="font-body text-primary border-primary mb-2 w-fit">{resource.category}</Badge>
        <CardTitle className="font-headline text-xl text-foreground">
            {resource.title}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-grow">
        <CardDescription className="font-body text-sm line-clamp-3">
            {resource.description}
        </CardDescription>
      </CardContent>
      
      {/* Footer Part */}
      <CardFooter>
        <Button asChild className="w-full font-headline" size="sm">
          <a href={resource.fileUrl} download target="_blank" rel="noopener noreferrer">
            <Download className="mr-2 h-4 w-4" />
            Pakua ({resource.fileType})
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
}
