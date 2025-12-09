import { Link } from "wouter";
import heroImage from "@assets/stock_images/robot_holding_drone__274d2016.jpg";

export function Hero() {
  return (
    <section className="relative w-full bg-[#c4c4c4] overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[500px] lg:min-h-[600px]">
          <div className="flex flex-col justify-center px-6 lg:px-12 py-16 lg:py-24 z-10">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black italic tracking-tight text-foreground leading-[1.1] mb-8">
              INNOVATE. BUILD.<br />
              CONQUER.<br />
              30 MINUTES.
            </h1>
            
            <Link 
              href="/search?q="
              className="inline-flex items-center justify-center px-6 py-3 text-sm font-medium bg-foreground text-white rounded-none hover:bg-gray-800 transition-colors w-fit"
              data-testid="button-shop-all"
            >
              Shop all
            </Link>
          </div>

          <div className="relative h-[400px] lg:h-full">
            <img 
              src={heroImage}
              alt="Robot holding drone" 
              className="absolute inset-0 w-full h-full object-cover object-center"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
