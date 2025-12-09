import { Store } from "@/lib/mockData";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Star, MapPin } from "lucide-react";
import { Link } from "wouter";

interface StoreCardProps {
  store: Store;
}

export function StoreCard({ store }: StoreCardProps) {
  return (
    <Link href={`/store/${store.id}`}>
      <Card className="group h-full overflow-hidden hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 border-transparent hover:border-primary/20 bg-secondary/20 cursor-pointer">
        <CardHeader className="p-0">
          <div className="h-32 bg-muted relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60 z-10"></div>
            {/* Store Logo/Brand Background */}
            <img 
              src={store.logo} 
              alt={store.name} 
              className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute bottom-4 left-4 z-20 flex items-center gap-3">
              <div className="h-12 w-12 rounded-lg bg-background p-1 shadow-md">
                 <img src={store.logo} alt="logo" className="w-full h-full object-contain rounded-md" />
              </div>
              <div className="text-white">
                <h3 className="font-bold text-lg leading-tight">{store.name}</h3>
                <div className="flex items-center gap-1 text-xs opacity-90">
                  <MapPin className="h-3 w-3" /> {store.neighborhood}
                </div>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4 pt-6">
          <div className="flex justify-between items-center mb-4">
            <Badge variant="secondary" className="font-normal flex gap-1 items-center">
              <Clock className="h-3 w-3" /> {store.deliveryTimeRange}
            </Badge>
            <div className="flex items-center gap-1 text-sm font-semibold text-foreground">
              <Star className="h-4 w-4 fill-primary text-primary" />
              {store.rating}
            </div>
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {store.description}
          </p>
        </CardContent>
        <CardFooter className="p-4 pt-0 flex justify-between items-center text-sm">
           <span className="font-medium text-muted-foreground">{store.priceLevel} Pricing</span>
           <span className="text-primary font-semibold group-hover:translate-x-1 transition-transform">Visit Store →</span>
        </CardFooter>
      </Card>
    </Link>
  );
}
