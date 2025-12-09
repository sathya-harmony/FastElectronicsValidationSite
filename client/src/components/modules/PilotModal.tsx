import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

interface PilotModalProps {
  isOpen: boolean;
  onClose: () => void;
  productName?: string;
}

export function PilotModal({ isOpen, onClose, productName }: PilotModalProps) {
  const [step, setStep] = useState<'form' | 'success'>('form');
  const [email, setEmail] = useState('');
  const [area, setArea] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/pilot-signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          area,
          notes,
          productInterest: productName
        })
      });
      
      if (response.ok) {
        setStep('success');
      }
    } catch (error) {
      console.error('Signup error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setStep('form');
      setEmail('');
      setArea('');
      setNotes('');
    }, 300);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[400px]">
        {step === 'form' ? (
          <>
            <DialogHeader>
              <DialogTitle className="text-lg font-medium">
                Join the Waitlist
              </DialogTitle>
              <DialogDescription className="pt-2 text-sm">
                We're testing rapid delivery in Bangalore. Get notified when we launch.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="email" className="text-sm">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="you@example.com" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-10"
                  data-testid="input-email"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="area" className="text-sm">Area / Pincode</Label>
                <Input 
                  id="area" 
                  placeholder="e.g. Indiranagar, 560038" 
                  required
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  className="h-10"
                  data-testid="input-area"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="notes" className="text-sm">What are you building? (Optional)</Label>
                <Textarea 
                  id="notes" 
                  placeholder="I'm working on a project..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="resize-none"
                  rows={3}
                  data-testid="input-notes"
                />
              </div>
              <DialogFooter className="mt-2">
                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={isSubmitting}
                  data-testid="button-submit-waitlist"
                >
                  {isSubmitting ? 'Joining...' : 'Join Waitlist'}
                </Button>
              </DialogFooter>
            </form>
          </>
        ) : (
          <div className="py-8 flex flex-col items-center text-center">
            <div className="h-12 w-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-lg font-medium mb-2">You're on the list</h3>
            <p className="text-sm text-muted-foreground mb-6">
              We'll notify you when we start delivering to your area.
            </p>
            <Button onClick={handleClose} variant="outline" size="sm">
              Continue Browsing
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
