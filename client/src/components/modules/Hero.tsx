import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { neighborhoods } from "@/lib/mockData";
import { ArrowRight, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "wouter";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-background pt-10 pb-16 md:pt-20 md:pb-32">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col gap-6 z-10"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium w-fit">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              Now Live in Bangalore
            </div>
            
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-foreground leading-[1.1]">
              Electronics <br />
              at your door <br />
              <span className="text-primary">in 60 mins.</span>
            </h1>
            
            <p className="text-lg text-muted-foreground max-w-lg">
              Sourced directly from trusted local stores like Vishal Electronics and Robocraze. 
              The fastest way to prototype in Bangalore.
            </p>

            <div className="flex flex-wrap gap-4 mt-2">
              <Link href="/search?q=">
                <Button size="lg" className="h-14 px-8 text-lg rounded-full shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all">
                  Start Shopping <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/stores">
                <Button variant="outline" size="lg" className="h-14 px-8 text-lg rounded-full border-2">
                  Browse Stores
                </Button>
              </Link>
            </div>

            {/* Area Selector */}
            <div className="mt-8 p-4 bg-secondary/30 rounded-2xl border border-border/50 backdrop-blur-sm">
              <div className="flex flex-col sm:flex-row gap-3 items-end sm:items-center">
                <div className="flex-1 w-full">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">
                    Check Availability
                  </label>
                  <div className="flex gap-2">
                    <Select defaultValue={neighborhoods[0]}>
                      <SelectTrigger className="w-full bg-background border-border shadow-sm h-10">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-primary" />
                          <SelectValue placeholder="Select Area" />
                        </div>
                      </SelectTrigger>
                      <SelectContent>
                        {neighborhoods.map(area => (
                          <SelectItem key={area} value={area}>{area}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="text-xs text-muted-foreground sm:max-w-[150px] leading-tight">
                  Serving select neighborhoods in Bangalore.
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Image */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, x: 20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative h-[400px] md:h-[600px] w-full flex items-center justify-center"
          >
            {/* Abstract Background Blur */}
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 via-transparent to-transparent blur-3xl rounded-full opacity-60 transform translate-y-10"></div>
            
            <img 
              src="/attached_assets/image_1765293409908.png" 
              alt="Futuristic Drone Delivery" 
              className="relative z-10 w-full h-full object-contain drop-shadow-2xl"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
