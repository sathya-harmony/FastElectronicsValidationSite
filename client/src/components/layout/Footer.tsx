import { Link } from "wouter";

export function Footer() {
  return (
    <footer className="border-t bg-white py-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h4 className="font-medium text-sm mb-4">ThunderFast</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/about" className="hover:text-foreground transition-colors">About Us</Link></li>
              <li><Link href="/careers" className="hover:text-foreground transition-colors">Careers</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-sm mb-4">For Stores</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/partner" className="hover:text-foreground transition-colors">Become a Partner</Link></li>
              <li><Link href="/admin" className="hover:text-foreground transition-colors">Store Dashboard</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-sm mb-4">Support</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/help" className="hover:text-foreground transition-colors">Help Center</Link></li>
              <li><Link href="/contact" className="hover:text-foreground transition-colors">Contact Us</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-sm mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-foreground transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground">
          <p>© 2024 ThunderFast Electronics. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span>Bangalore</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
