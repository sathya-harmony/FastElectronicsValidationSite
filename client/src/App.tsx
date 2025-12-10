import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CartProvider } from "@/lib/cartContext";
import { LocationProvider } from "@/lib/locationContext";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import { LocationPrompt } from "@/components/modules/LocationPrompt";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import React, { Suspense } from "react";

// Lazy load non-critical pages for better initial load performance
const CartPage = React.lazy(() => import("@/pages/Cart"));
const AdminDashboard = React.lazy(() => import("@/pages/Admin"));
const ContactPage = React.lazy(() => import("@/pages/Contact"));
const SurveyPage = React.lazy(() => import("@/pages/Survey"));

function Router() {
  const [location] = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2 }}
        className="flex-1 flex flex-col min-h-screen"
      >
        <Suspense
          fallback={
            <div className="flex items-center justify-center min-h-screen">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          }
        >
          <Switch location={location}>
            <Route path="/" component={Home} />
            <Route path="/cart" component={CartPage} />
            <Route path="/admin" component={AdminDashboard} />
            <Route path="/contact" component={ContactPage} />
            <Route path="/survey" component={SurveyPage} />
            <Route component={NotFound} />
          </Switch>
        </Suspense>
      </motion.div>
    </AnimatePresence>
  );
}

import { useState } from "react";
import Preloader from "@/components/Preloader";

function App() {
  const [isLoading, setIsLoading] = useState(true);

  if (isLoading) {
    return <Preloader onComplete={() => setIsLoading(false)} />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <LocationProvider>
        <LocationPrompt />
        <CartProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </CartProvider>
      </LocationProvider>
    </QueryClientProvider>
  );
}

export default App;
