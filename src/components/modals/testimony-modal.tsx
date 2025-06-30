"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { TestimonyForm } from "@/components/forms/testimony-form";
import { Sparkles } from "lucide-react";

interface TestimonyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TestimonyModal({ open, onOpenChange }: TestimonyModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-headline text-2xl flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            Shiriki Hadithi Yako
          </DialogTitle>
          <DialogDescription className="font-body">
            Ushuhuda wako unaweza kumtia moyo mtu mwingine. Tueleze jinsi Mungu alivyogusa maisha yako.
          </DialogDescription>
        </DialogHeader>
        <TestimonyForm onFormSubmit={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  );
}
