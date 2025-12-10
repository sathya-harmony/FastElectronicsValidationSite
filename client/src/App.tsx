import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CartProvider } from "@/lib/cartContext";
import { LocationProvider } from "@/lib/locationContext";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import SearchPage from "@/pages/Search";
import StorePage from "@/pages/Store";
import CartPage from "@/pages/Cart";
import AdminDashboard from "@/pages/Admin";
import ContactPage from "@/pages/Contact";
import SurveyPage from "@/pages/Survey";
import { LocationPrompt } from "@/components/modules/LocationPrompt";

import { useLocation } from "wouter";
import { AnimatePresence, motion } from "framer-motion";

function Router() {
  const [location] = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location}
        initial={{ opacity: 0, y: 10, scale: 0.99 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -10, scale: 0.99 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }} // Apple-style easing
        className="w-full min-h-screen"
      >
        <Switch location={location}>
          <Route path="/" component={Home} />
          <Route path="/search" component={SearchPage} />
          <Route path="/store/:id" component={StorePage} />
          <Route path="/stores" component={Home} />
          <Route path="/cart" component={CartPage} />
          <Route path="/admin" component={AdminDashboard} />
          <Route path="/contact" component={ContactPage} />
          <Route path="/survey" component={SurveyPage} />
          <Route component={NotFound} />
        </Switch>
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
