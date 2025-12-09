import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { CheckCircle2, Rocket } from "lucide-react";

interface PilotModalProps {
  isOpen: boolean;
  onClose: () => void;
  productName?: string;
}

export function PilotModal({ isOpen, onClose, productName }: PilotModalProps) {
  const [step, setStep] = useState<'form' | 'success'>('form');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would send data to the admin endpoint
    // For now, we simulate success
    setTimeout(() => {
      setStep('success');
      // Track this event
      console.log(`Pilot interest registered for ${productName}`);
    }, 500);
  };

  const handleClose = () => {
    onClose();
    setTimeout(() => setStep('form'), 300); // Reset after animation
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        {step === 'form' ? (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-xl">
                <Rocket className="h-5 w-5 text-primary" />
                Pilot in Progress
              </DialogTitle>
              <DialogDescription className="pt-2">
                We're currently testing rapid delivery in Bangalore. Live ordering will be available soon!
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="grid gap-4 py-4">
              <div className="bg-secondary/50 p-3 rounded-lg text-sm text-muted-foreground mb-2">
                <p>Get early access and <strong>₹200 OFF</strong> your first order when we launch.</p>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" placeholder="you@example.com" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="area">Area / Pincode</Label>
                <Input id="area" placeholder="e.g. Indiranagar, 560038" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="notes">What are you building? (Optional)</Label>
                <Textarea id="notes" placeholder="I'm working on a drone project..." />
              </div>
              <DialogFooter className="mt-4">
                <Button type="submit" className="w-full">Join Waitlist</Button>
              </DialogFooter>
            </form>
          </>
        ) : (
          <div className="py-8 flex flex-col items-center text-center animate-in fade-in zoom-in duration-300">
            <div className="h-16 w-16 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold mb-2">You're on the list!</h3>
            <p className="text-muted-foreground mb-6">
              Thanks for your interest in ThunderFast. We'll notify you as soon as we start delivering to your area.
            </p>
            <Button onClick={handleClose} variant="outline">Back to Browsing</Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
