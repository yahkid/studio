
"use client";

import * as React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';
import { sw } from 'date-fns/locale';
import { useToast } from '@/hooks/use-toast';
import { useTransition } from 'react';

import { db } from '@/lib/firebaseClient';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import type { CommunityNeedDoc } from '@/types/firestore';
import { addCommunityNeed, updateNeedStatus } from './actions';

import { Loader2, PlusCircle, AlertCircle, HandHelping, Send, User, Phone } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from '@/components/ui/badge';


interface EnrichedNeed extends CommunityNeedDoc {
  id: string;
}

const addNeedSchema = z.object({
  need_description: z.string().min(10, { message: "Maelezo lazima yawe na angalau herufi 10." }),
  contact_person: z.string().optional(),
  contact_info: z.string().optional(),
});
type AddNeedFormValues = z.infer<typeof addNeedSchema>;


export function NeedsRegistryTab() {
  const [needs, setNeeds] = React.useState<EnrichedNeed[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isAddNeedOpen, setIsAddNeedOpen] = React.useState(false);
  const { toast } = useToast();

  const fetchNeeds = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const q = query(collection(db, "community_needs"), orderBy("created_at", "desc"));
      const querySnapshot = await getDocs(q);
      setNeeds(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as EnrichedNeed[]);
    } catch (error: any) {
      console.error("Kosa la kupata mahitaji:", error);
      toast({ title: "Kosa", description: "Imeshindwa kupata daftari la mahitaji.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  React.useEffect(() => {
    fetchNeeds();
  }, [fetchNeeds]);
  
  const handleStatusChange = async (needId: string, newStatus: 'new' | 'in_progress' | 'resolved') => {
      const result = await updateNeedStatus({ needId, status: newStatus });
      if (result.success) {
          toast({ title: "Hali Imesasishwa" });
          fetchNeeds(); // Refresh data
      } else {
          toast({ title: "Kosa", description: result.error, variant: "destructive" });
      }
  };

  const getStatusBadgeVariant = (status: CommunityNeedDoc['status']) => {
    switch (status) {
      case 'new': return 'destructive';
      case 'in_progress': return 'secondary';
      case 'resolved': return 'default';
      default: return 'outline';
    }
  };

  const AddNeedDialog = () => {
    const [isPending, startTransition] = useTransition();
    const form = useForm<AddNeedFormValues>({
        resolver: zodResolver(addNeedSchema),
        defaultValues: { need_description: '', contact_person: '', contact_info: '' },
    });

    const onSubmit = (values: AddNeedFormValues) => {
        startTransition(async () => {
            const result = await addCommunityNeed(values);
            if(result.success) {
                toast({ title: 'Hitaji Limeongezwa', description: 'Hitaji jipya la jamii limehifadhiwa.' });
                setIsAddNeedOpen(false);
                fetchNeeds();
            } else {
                toast({ title: 'Kosa', description: result.error, variant: 'destructive' });
            }
        });
    }

    return (
        <Dialog open={isAddNeedOpen} onOpenChange={setIsAddNeedOpen}>
            <DialogTrigger asChild>
                <Button><PlusCircle className="mr-2 h-4 w-4" /> Ongeza Hitaji</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Ongeza Hitaji Jipya</DialogTitle>
                    <DialogDescription>
                        Andika maelezo ya hitaji lililotambuliwa katika jamii au kwa mshiriki.
                    </DialogDescription>
                </DialogHeader>
                 <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField control={form.control} name="need_description" render={({ field }) => (
                            <FormItem><FormLabel>Maelezo ya Hitaji</FormLabel><FormControl><Textarea placeholder="Eleza hitaji kwa undani..." {...field} /></FormControl><FormMessage /></FormItem>
                        )}/>
                        <FormField control={form.control} name="contact_person" render={({ field }) => (
                            <FormItem><FormLabel>Mhusika (Hiari)</FormLabel><div className="relative"><User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" /><FormControl><Input placeholder="Jina la mtu anayehitaji" className="pl-10" {...field} /></FormControl></div><FormMessage /></FormItem>
                        )}/>
                        <FormField control={form.control} name="contact_info" render={({ field }) => (
                            <FormItem><FormLabel>Mawasiliano (Hiari)</FormLabel><div className="relative"><Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" /><FormControl><Input placeholder="Namba ya simu au barua pepe" className="pl-10" {...field} /></FormControl></div><FormMessage /></FormItem>
                        )}/>
                        <DialogFooter>
                            <Button type="submit" disabled={isPending}>
                                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                <Send className="mr-2 h-4 w-4" /> Hifadhi Hitaji
                            </Button>
                        </DialogFooter>
                    </form>
                 </Form>
            </DialogContent>
        </Dialog>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
            <CardTitle>Daftari la Mahitaji ya Jamii</CardTitle>
            <CardDescription>Fuatilia na simamia mahitaji yaliyoripotiwa.</CardDescription>
        </div>
        <AddNeedDialog />
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center items-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
        ) : needs.length === 0 ? (
          <Alert><AlertCircle className="h-4 w-4" /><AlertTitle>Hakuna Mahitaji Yaliyoorodheshwa</AlertTitle><AlertDescription>Bofya "Ongeza Hitaji" ili kuanza kufuatilia mahitaji ya jamii.</AlertDescription></Alert>
        ) : (
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Hitaji</TableHead>
                  <TableHead>Mawasiliano</TableHead>
                  <TableHead>Iliingizwa na</TableHead>
                  <TableHead>Tarehe</TableHead>
                  <TableHead>Hali</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {needs.map(need => (
                  <TableRow key={need.id}>
                    <TableCell className="font-medium max-w-sm"><p className="line-clamp-3">{need.need_description}</p></TableCell>
                    <TableCell className="text-xs">
                        {need.contact_person && <p className="font-semibold">{need.contact_person}</p>}
                        {need.contact_info && <p className="text-muted-foreground">{need.contact_info}</p>}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">{need.submitted_by_name}</TableCell>
                    <TableCell className="text-xs">{format(need.created_at.toDate(), 'PPP', { locale: sw })}</TableCell>
                    <TableCell>
                        <Select defaultValue={need.status} onValueChange={(newStatus: 'new' | 'in_progress' | 'resolved') => handleStatusChange(need.id, newStatus)}>
                            <SelectTrigger className="w-[130px] h-8">
                                <SelectValue asChild>
                                    <Badge variant={getStatusBadgeVariant(need.status)} className="capitalize">{need.status.replace('_', ' ')}</Badge>
                                </SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="new">Mpya</SelectItem>
                                <SelectItem value="in_progress">Inashughulikiwa</SelectItem>
                                <SelectItem value="resolved">Imetatuliwa</SelectItem>
                            </SelectContent>
                        </Select>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
