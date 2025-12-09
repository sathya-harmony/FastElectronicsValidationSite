import { Link } from "wouter";

export function Footer() {
  return (
    <footer className="border-t bg-background py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h4 className="font-bold mb-4">ThunderFast</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/about">About Us</Link></li>
              <li><Link href="/careers">Careers</Link></li>
              <li><Link href="/blog">Blog</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">For Stores</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/partner">Become a Partner</Link></li>
              <li><Link href="/dashboard">Store Dashboard</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Support</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/help">Help Center</Link></li>
              <li><Link href="/returns">Returns</Link></li>
              <li><Link href="/contact">Contact Us</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/privacy">Privacy Policy</Link></li>
              <li><Link href="/terms">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground">
          <p>© 2024 ThunderFast Electronics. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span>Currently serving Bangalore only</span>
            <span className="h-1 w-1 bg-muted-foreground rounded-full"></span>
            <span>Pilot Project</span>
            <span className="h-1 w-1 bg-muted-foreground rounded-full"></span>
            <Link href="/admin">Admin</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
