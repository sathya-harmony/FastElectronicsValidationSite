import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Search } from "lucide-react";
import { motion } from "framer-motion";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background relative overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-tr from-blue-50 via-white to-purple-50 opacity-50" />

      <div className="relative z-10 text-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="h-24 w-24 bg-secondary rounded-3xl mx-auto mb-8 flex items-center justify-center rotate-3 hover:rotate-6 transition-transform duration-300 shadow-xl border border-white/50">
            <Search className="h-10 w-10 text-muted-foreground" />
          </div>

          <h1 className="text-8xl font-black tracking-tighter text-foreground/10 mb-2">404</h1>
          <h2 className="text-3xl font-bold tracking-tight mb-4">Page Not Found</h2>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            The page you're looking for doesn't exist or has been moved.
          </p>

          <Link href="/">
            <Button className="h-12 px-8 rounded-full text-base shadow-lg hover:shadow-xl transition-all duration-300">
              <ArrowLeft className="mr-2 h-4 w-4" /> Return Home
            </Button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
