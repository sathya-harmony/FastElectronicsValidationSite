import { Link, useLocation } from "wouter";
import { Search, ShoppingBag, User, X, Menu } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/lib/cartContext";
import { motion, AnimatePresence } from "framer-motion";

const appleEasing: [number, number, number, number] = [0.25, 0.1, 0.25, 1];

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
    <motion.header
      className="fixed top-0 left-0 right-0 z-50 apple-glass border-b border-white/20"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: appleEasing }}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/">
          <motion.span
            className="text-base font-semibold tracking-tight text-foreground cursor-pointer"
            data-testid="link-home"
            whileHover={{ opacity: 0.7 }}
            transition={{ duration: 0.2 }}
          >
            ThunderFast
          </motion.span>
        </Link>

        <nav className="hidden md:flex items-center gap-10 text-sm font-medium text-muted-foreground">
          {[
            { href: "/", label: "Home", testId: "nav-home" },
            { href: "/search?q=", label: "Products", testId: "nav-products" },
            { href: "/contact", label: "Contact", testId: "nav-contact" },
          ].map((item, i) => (
            <Link key={item.href} href={item.href}>
              <motion.span
                className="relative cursor-pointer hover:text-foreground transition-colors duration-300"
                data-testid={item.testId}
                whileHover={{ y: -2 }}
                transition={{ duration: 0.2 }}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {item.label}
              </motion.span>
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <motion.button
            onClick={() => setSearchOpen(!searchOpen)}
            className="p-2.5 text-muted-foreground hover:text-foreground hover:bg-black/5 rounded-full transition-colors duration-300"
            data-testid="button-search"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <AnimatePresence mode="wait">
              {searchOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <X className="h-5 w-5" />
                </motion.div>
              ) : (
                <motion.div
                  key="search"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Search className="h-5 w-5" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>

          <motion.button
            className="p-2.5 text-muted-foreground hover:text-foreground hover:bg-black/5 rounded-full transition-colors duration-300"
            data-testid="button-user"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <User className="h-5 w-5" />
          </motion.button>

          <Link href="/cart">
            <motion.span
              className="relative p-2.5 text-muted-foreground hover:text-foreground hover:bg-black/5 rounded-full transition-colors duration-300 block cursor-pointer"
              data-testid="button-cart"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <ShoppingBag className="h-5 w-5" />
              <AnimatePresence>
                {itemCount > 0 && (
                  <motion.span
                    className="absolute -top-0.5 -right-0.5 bg-black text-white text-[10px] font-semibold rounded-full h-5 w-5 flex items-center justify-center shadow-lg"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 25 }}
                  >
                    {itemCount > 9 ? "9+" : itemCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.span>
          </Link>
        </div>
      </div>

      <AnimatePresence>
        {searchOpen && (
          <motion.div
            className="border-t border-white/10 glass overflow-hidden"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: appleEasing }}
          >
            <div className="max-w-7xl mx-auto px-6 py-4">
              <form onSubmit={handleSearch} className="flex gap-3">
                <motion.input
                  type="search"
                  placeholder="Search products, categories..."
                  className="flex-1 px-5 py-3.5 text-sm bg-white/60 border border-black/5 rounded-full focus:outline-none focus:ring-2 focus:ring-black/10 transition-all duration-300"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.1, duration: 0.3 }}
                  data-testid="input-search"
                />
                <motion.button
                  type="submit"
                  className="px-8 py-3.5 text-sm font-medium bg-black text-white rounded-full shadow-lg"
                  whileHover={{ scale: 1.03, boxShadow: "0 20px 40px -15px rgba(0,0,0,0.3)" }}
                  whileTap={{ scale: 0.97 }}
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.15, duration: 0.3 }}
                  data-testid="button-search-submit"
                >
                  Search
                </motion.button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
