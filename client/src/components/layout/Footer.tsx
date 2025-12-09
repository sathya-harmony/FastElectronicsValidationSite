import { Link } from "wouter";

export function Footer() {
  return (
    <footer className="border-t border-black/5 bg-secondary/30 py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-12">
          <div>
            <h4 className="font-semibold text-sm mb-5">ThunderFast</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link href="/about" className="hover:text-foreground transition-colors duration-300">About Us</Link></li>
              <li><Link href="/careers" className="hover:text-foreground transition-colors duration-300">Careers</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-sm mb-5">For Stores</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link href="/partner" className="hover:text-foreground transition-colors duration-300">Become a Partner</Link></li>
              <li><Link href="/admin" className="hover:text-foreground transition-colors duration-300">Store Dashboard</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-sm mb-5">Support</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link href="/help" className="hover:text-foreground transition-colors duration-300">Help Center</Link></li>
              <li><Link href="/contact" className="hover:text-foreground transition-colors duration-300">Contact Us</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-sm mb-5">Legal</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link href="/privacy" className="hover:text-foreground transition-colors duration-300">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-foreground transition-colors duration-300">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-black/5 pt-10 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <p>© 2024 ThunderFast Electronics. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="font-medium">Bangalore, India</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
