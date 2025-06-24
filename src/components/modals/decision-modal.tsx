"use client"

import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { DecisionForm } from "@/components/forms/decision-form";

interface DecisionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DecisionModal({ open, onOpenChange }: DecisionModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-0 sm:max-w-lg border-0 bg-transparent shadow-none">
        <DecisionForm />
      </DialogContent>
    </Dialog>
  );
}
