import { Link, useLocation } from "wouter";
import { Search, ShoppingBag, User, Zap } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export function Header() {
  const [location, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setLocation(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/">
          <a className="flex items-center gap-2 font-bold text-xl tracking-tight hover:opacity-90 transition-opacity">
            <div className="bg-primary text-primary-foreground p-1 rounded-sm">
              <Zap size={20} fill="currentColor" />
            </div>
            <span>ThunderFast</span>
          </a>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
          <Link href="/"><a className="hover:text-foreground transition-colors">Home</a></Link>
          <Link href="/stores"><a className="hover:text-foreground transition-colors">Stores</a></Link>
          <Link href="/how-it-works"><a className="hover:text-foreground transition-colors">How it Works</a></Link>
          <Link href="/contact"><a className="hover:text-foreground transition-colors">Contact</a></Link>
        </nav>

        {/* Search Bar - Desktop Centered (sort of) */}
        <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-4 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            type="search" 
            placeholder="Search electronics in Bangalore..." 
            className="pl-9 bg-secondary/50 border-transparent focus:bg-background focus:border-primary transition-all rounded-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </form>

        {/* Icons */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
            <User className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground relative">
            <ShoppingBag className="h-5 w-5" />
            <span className="absolute top-1 right-1 h-2 w-2 bg-primary rounded-full"></span>
          </Button>
        </div>
      </div>
      
      {/* Mobile Search - Visible only on small screens */}
      <div className="md:hidden px-4 pb-3">
        <form onSubmit={handleSearch} className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            type="search" 
            placeholder="Search electronics..." 
            className="pl-9 bg-secondary/50 border-transparent focus:bg-background focus:border-primary rounded-full w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </form>
      </div>
    </header>
  );
}
