
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Music, Video, Download, FileArchive } from 'lucide-react';
import { Badge } from '@/components/ui/badge';


interface Resource {
  id: string;
  title: string;
  description: string;
  category: string;
  fileUrl: string;
  fileType: 'PDF' | 'DOCX' | 'MP3' | 'MP4' | 'ZIP';
}

interface ResourceCardProps {
  resource: Resource;
}

const getIconForFileType = (fileType: Resource['fileType']) => {
  const iconProps = { className: "h-8 w-8 text-primary" };
  switch (fileType) {
    case 'PDF':
      return <FileText {...iconProps} />;
    case 'DOCX':
      return <FileText {...iconProps} />;
    case 'MP3':
      return <Music {...iconProps} />;
    case 'MP4':
      return <Video {...iconProps} />;
    case 'ZIP':
        return <FileArchive {...iconProps} />;
    default:
      return <FileText {...iconProps} />;
  }
};


export function ResourceCard({ resource }: ResourceCardProps) {
  return (
    <Card className="flex flex-col h-full overflow-hidden border rounded-lg hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        <div className="flex justify-between items-start">
            <div className="flex-grow">
                <Badge variant="outline" className="font-body text-primary border-primary mb-2">{resource.category}</Badge>
                <CardTitle className="font-headline text-xl text-foreground">
                    {resource.title}
                </CardTitle>
            </div>
            <div className="flex-shrink-0 ml-4 bg-primary/10 p-3 rounded-full">
                {getIconForFileType(resource.fileType)}
            </div>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <CardDescription className="font-body text-sm line-clamp-3">
            {resource.description}
        </CardDescription>
      </CardContent>
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
