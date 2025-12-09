import { Link } from "wouter";
import robert from "@assets/robert.png";

export function Hero() {
  return (
    <section className="relative w-full min-h-[600px] lg:min-h-[700px] overflow-hidden">
      <img 
        src={robert}
        alt="Robot holding electronics" 
        className="absolute inset-0 w-full h-full object-cover object-center"
      />
      
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 h-full min-h-[600px] lg:min-h-[700px] flex flex-col justify-center">
        <div className="max-w-xl space-y-8 animate-fade-in">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight text-white leading-[1.05]">
            <span className="block">INNOVATE.</span>
            <span className="block">BUILD.</span>
            <span className="block">CONQUER.</span>
            <span className="block mt-4 text-white/90 font-semibold text-3xl sm:text-4xl lg:text-5xl">
              30 Minutes.
            </span>
          </h1>
          
          <p className="text-lg text-white/70 max-w-md leading-relaxed">
            Premium electronics delivered to your doorstep in Bangalore. Skip the traffic, get what you need.
          </p>
          
          <Link 
            href="/search?q="
            className="inline-flex items-center justify-center px-8 py-4 text-sm font-medium bg-white text-black rounded-full hover:bg-white/90 hover:scale-[1.02] transition-all duration-300 shadow-lg shadow-white/20"
            data-testid="button-shop-all"
          >
            Explore Products
          </Link>
        </div>
      </div>
    </section>
  );
}
