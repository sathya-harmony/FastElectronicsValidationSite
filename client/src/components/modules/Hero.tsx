import { Link } from "wouter";
import { motion } from "framer-motion";
import robert from "@assets/robert.png";

const appleEasing: [number, number, number, number] = [0.25, 0.1, 0.25, 1];

const textReveal = {
  hidden: { opacity: 0, y: 50, filter: "blur(12px)" },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.8, delay: i * 0.15, ease: appleEasing },
  }),
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.3 },
  },
};

const buttonVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.9 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.6, delay: 0.8, ease: appleEasing },
  },
};

export function Hero() {
  return (
    <section className="relative w-full min-h-[600px] lg:min-h-[700px] overflow-hidden">
      <motion.img
        src={robert}
        alt="Robot holding electronics"
        className="absolute inset-0 w-full h-full object-cover object-center"
        initial={{ scale: 1.1, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.5, ease: appleEasing }}
      />

      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 h-full min-h-[600px] lg:min-h-[700px] flex flex-col justify-center">
        <motion.div
          className="max-w-xl space-y-8"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight text-white leading-[1.05]">
            <motion.span className="block" custom={0} variants={textReveal}>
              INNOVATE.
            </motion.span>
            <motion.span className="block" custom={1} variants={textReveal}>
              BUILD.
            </motion.span>
            <motion.span className="block" custom={2} variants={textReveal}>
              CONQUER.
            </motion.span>
            <motion.span
              className="block mt-4 text-white/90 font-semibold text-3xl sm:text-4xl lg:text-5xl"
              custom={3}
              variants={textReveal}
            >
              30 Minutes.
            </motion.span>
          </h1>

          <motion.p
            className="text-lg text-white/70 max-w-md leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7, ease: appleEasing }}
          >
            Essential robotics components and prototyping gear delivered in 30 minutes. Build your ideas faster.
          </motion.p>

          <motion.div variants={buttonVariants}>
            <Link href="/search?q=">
              <motion.span
                className="inline-flex items-center justify-center px-8 py-4 text-sm font-medium bg-white text-black rounded-full shadow-lg shadow-white/20 cursor-pointer"
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 25px 50px -12px rgba(255, 255, 255, 0.3)",
                }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                data-testid="button-shop-all"
              >
                Explore Products
              </motion.span>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
