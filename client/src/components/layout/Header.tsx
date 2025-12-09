import { Link, useLocation } from "wouter";
import { Search, ShoppingBag, User } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/lib/cartContext";

export function Header() {
  const [location, setLocation] = useLocation();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { getItemCount } = useCart();
  const itemCount = getItemCount();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setLocation(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchOpen(false);
    }
  };

  return (
    <header className="w-full bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link href="/" className="text-sm font-medium tracking-tight text-foreground hover:opacity-70 transition-opacity" data-testid="link-home">
          ThunderFast Electronics
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground transition-colors" data-testid="nav-home">Home</Link>
          <Link href="/search?q=" className="hover:text-foreground transition-colors" data-testid="nav-products">Products</Link>
          <Link href="/contact" className="hover:text-foreground transition-colors" data-testid="nav-contact">Contact</Link>
        </nav>

        <div className="flex items-center gap-4">
          <button 
            onClick={() => setSearchOpen(!searchOpen)}
            className="text-muted-foreground hover:text-foreground transition-colors"
            data-testid="button-search"
          >
            <Search className="h-5 w-5" />
          </button>
          <button className="text-muted-foreground hover:text-foreground transition-colors" data-testid="button-user">
            <User className="h-5 w-5" />
          </button>
          <Link href="/cart" className="relative text-muted-foreground hover:text-foreground transition-colors" data-testid="button-cart">
            <ShoppingBag className="h-5 w-5" />
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs font-medium rounded-full h-5 w-5 flex items-center justify-center">
                {itemCount > 9 ? "9+" : itemCount}
              </span>
            )}
          </Link>
        </div>
      </div>
      
      {searchOpen && (
        <div className="border-t border-gray-100 bg-white">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <form onSubmit={handleSearch} className="flex gap-3">
              <input 
                type="search" 
                placeholder="Search products..." 
                className="flex-1 px-4 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-300"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                data-testid="input-search"
              />
              <button 
                type="submit"
                className="px-6 py-2 text-sm bg-foreground text-white rounded-md hover:bg-gray-800 transition-colors"
                data-testid="button-search-submit"
              >
                Search
              </button>
            </form>
          </div>
        </div>
      )}
    </header>
  );
}
