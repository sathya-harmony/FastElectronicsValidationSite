import { Link, useLocation } from "wouter";
import { Search, ShoppingBag, User, X } from "lucide-react";
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
    <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link 
          href="/" 
          className="text-base font-semibold tracking-tight text-foreground hover:opacity-70 transition-all duration-300" 
          data-testid="link-home"
        >
          ThunderFast
        </Link>

        <nav className="hidden md:flex items-center gap-10 text-sm font-medium text-muted-foreground">
          <Link href="/" className="hover:text-foreground transition-colors duration-300" data-testid="nav-home">Home</Link>
          <Link href="/search?q=" className="hover:text-foreground transition-colors duration-300" data-testid="nav-products">Products</Link>
          <Link href="/contact" className="hover:text-foreground transition-colors duration-300" data-testid="nav-contact">Contact</Link>
        </nav>

        <div className="flex items-center gap-5">
          <button 
            onClick={() => setSearchOpen(!searchOpen)}
            className="p-2 text-muted-foreground hover:text-foreground hover:bg-black/5 rounded-full transition-all duration-300"
            data-testid="button-search"
          >
            {searchOpen ? <X className="h-5 w-5" /> : <Search className="h-5 w-5" />}
          </button>
          <button 
            className="p-2 text-muted-foreground hover:text-foreground hover:bg-black/5 rounded-full transition-all duration-300" 
            data-testid="button-user"
          >
            <User className="h-5 w-5" />
          </button>
          <Link 
            href="/cart" 
            className="relative p-2 text-muted-foreground hover:text-foreground hover:bg-black/5 rounded-full transition-all duration-300" 
            data-testid="button-cart"
          >
            <ShoppingBag className="h-5 w-5" />
            {itemCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-black text-white text-[10px] font-semibold rounded-full h-5 w-5 flex items-center justify-center shadow-lg">
                {itemCount > 9 ? "9+" : itemCount}
              </span>
            )}
          </Link>
        </div>
      </div>
      
      <div className={`overflow-hidden transition-all duration-300 ease-out ${searchOpen ? 'max-h-24 opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="border-t border-white/10 glass">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <form onSubmit={handleSearch} className="flex gap-3">
              <input 
                type="search" 
                placeholder="Search products..." 
                className="flex-1 px-5 py-3 text-sm bg-white/60 border border-black/5 rounded-full focus:outline-none focus:ring-2 focus:ring-black/10 transition-all duration-300"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus={searchOpen}
                data-testid="input-search"
              />
              <button 
                type="submit"
                className="px-8 py-3 text-sm font-medium bg-black text-white rounded-full hover:bg-gray-800 hover:scale-[1.02] transition-all duration-300 shadow-lg"
                data-testid="button-search-submit"
              >
                Search
              </button>
            </form>
          </div>
        </div>
      </div>
    </header>
  );
}
