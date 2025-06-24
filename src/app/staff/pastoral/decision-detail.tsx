
"use client";

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { EnrichedDecision } from './page';
import type { ContactLogDoc } from '@/types/firestore';
import { getContactLogs, logNewContact, updateDecisionStatus } from './actions';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { useTransition } from 'react';

import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Loader2, MessageSquareQuote, Send } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

const logContactSchema = z.object({
    notes: z.string().min(5, { message: "Notes must be at least 5 characters long." }),
});

type LogContactFormValues = z.infer<typeof logContactSchema>;

export function DecisionDetail({ decision }: { decision: EnrichedDecision }) {
    const { toast } = useToast();
    const [contactLogs, setContactLogs] = React.useState<ContactLogDoc[]>([]);
    const [isLoadingLogs, setIsLoadingLogs] = React.useState(true);
    const [isSubmitting, startSubmitTransition] = useTransition();

    const form = useForm<LogContactFormValues>({
        resolver: zodResolver(logContactSchema),
        defaultValues: { notes: '' },
    });

    const fetchLogs = React.useCallback(async () => {
        setIsLoadingLogs(true);
        const logs = await getContactLogs(decision.id);
        setContactLogs(logs);
        setIsLoadingLogs(false);
    }, [decision.id]);

    React.useEffect(() => {
        fetchLogs();
    }, [fetchLogs]);

    const onLogSubmit = async (values: LogContactFormValues) => {
        startSubmitTransition(async () => {
            const result = await logNewContact(decision.id, values.notes);
            if (result.success) {
                toast({ title: "Contact Logged", description: "The new contact has been saved." });
                form.reset();
                await fetchLogs(); // Refresh logs after submitting
            } else {
                toast({ title: "Error", description: result.error, variant: "destructive" });
            }
        });
    };

    const handleStatusChange = async (newStatus: 'new' | 'contacted' | 'resolved') => {
        const result = await updateDecisionStatus(decision.id, newStatus);
        if (result.success) {
            toast({ title: "Status Updated" });
        } else {
            toast({ title: "Error", description: result.error, variant: "destructive" });
        }
    };

    return (
        <div className="h-full flex flex-col pt-4">
            <div className="px-4 space-y-4 mb-4">
                <div>
                    <h4 className="text-sm font-semibold text-muted-foreground">Decision</h4>
                    <p className="font-medium">{decision.decision_type}</p>
                </div>
                 {decision.comments && (
                    <div>
                        <h4 className="text-sm font-semibold text-muted-foreground">Original Comments</h4>
                        <blockquote className="mt-1 text-sm italic border-l-2 pl-3">"{decision.comments}"</blockquote>
                    </div>
                )}
                 <div>
                    <h4 className="text-sm font-semibold text-muted-foreground">Status</h4>
                     <Select defaultValue={decision.status} onValueChange={handleStatusChange}>
                        <SelectTrigger className="w-[180px] h-8 mt-1">
                            <SelectValue placeholder="Set status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="new">New</SelectItem>
                            <SelectItem value="contacted">Contacted</SelectItem>
                            <SelectItem value="resolved">Resolved</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
            
            <Separator />

            <div className="flex-grow flex flex-col min-h-0">
                <h3 className="p-4 text-lg font-semibold">Contact History</h3>
                <ScrollArea className="flex-grow px-4">
                    {isLoadingLogs ? (
                        <div className="flex justify-center items-center py-8"><Loader2 className="h-6 w-6 animate-spin"/></div>
                    ) : contactLogs.length === 0 ? (
                        <p className="text-center text-sm text-muted-foreground py-8">No contact logs yet.</p>
                    ) : (
                        <div className="space-y-4">
                            {contactLogs.map(log => (
                                <div key={log.id} className="text-sm p-3 bg-muted/50 rounded-md">
                                    <div className="flex justify-between items-center mb-1">
                                        <p className="font-semibold text-foreground">{log.pastor_name}</p>
                                        <p className="text-xs text-muted-foreground">{format(log.log_date.toDate(), 'MMM d, yyyy h:mm a')}</p>
                                    </div>
                                    <p className="text-muted-foreground whitespace-pre-wrap">{log.notes}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </ScrollArea>

                <div className="p-4 border-t bg-background">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onLogSubmit)} className="space-y-3">
                            <FormField
                                control={form.control}
                                name="notes"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="flex items-center gap-2"><MessageSquareQuote className="h-4 w-4"/> Log New Contact</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Add notes about your call, email, or visit..."
                                                {...field}
                                                rows={3}
                                                disabled={isSubmitting}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" className="w-full" disabled={isSubmitting}>
                                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
                                {isSubmitting ? 'Saving...' : <><Send className="mr-2 h-4 w-4" /> Save Log</>}
                            </Button>
                        </form>
                    </Form>
                </div>
            </div>
        </div>
    );
}
