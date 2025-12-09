import { motion, type Variants, type Transition } from "framer-motion";
import { ReactNode, forwardRef } from "react";

export const appleEasing: [number, number, number, number] = [0.25, 0.1, 0.25, 1];
export const springTransition: Transition = {
  type: "spring",
  stiffness: 400,
  damping: 30,
};
export const smoothTransition: Transition = {
  duration: 0.5,
  ease: appleEasing,
};

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: appleEasing }
  },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: 0.5, ease: appleEasing }
  },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { duration: 0.4, ease: appleEasing }
  },
};

export const slideInLeft: Variants = {
  hidden: { opacity: 0, x: -30 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.5, ease: appleEasing }
  },
};

export const slideInRight: Variants = {
  hidden: { opacity: 0, x: 30 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.5, ease: appleEasing }
  },
};

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.4, ease: appleEasing }
  },
};

export const heroTextReveal: Variants = {
  hidden: { opacity: 0, y: 40, filter: "blur(10px)" },
  visible: { 
    opacity: 1, 
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.8, ease: appleEasing }
  },
};

export const buttonHover = {
  scale: 1.02,
  transition: springTransition,
};

export const buttonTap = {
  scale: 0.98,
  transition: { duration: 0.1 },
};

export const cardHover = {
  y: -8,
  transition: { duration: 0.3, ease: appleEasing as [number, number, number, number] },
};

interface MotionButtonProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  "data-testid"?: string;
}

export const MotionButton = forwardRef<HTMLButtonElement, MotionButtonProps>(
  ({ children, className, onClick, type = "button", disabled, ...props }, ref) => (
    <motion.button
      ref={ref}
      type={type}
      className={className}
      onClick={onClick}
      disabled={disabled}
      whileHover={!disabled ? buttonHover : undefined}
      whileTap={!disabled ? buttonTap : undefined}
      {...props}
    >
      {children}
    </motion.button>
  )
);

interface MotionCardProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  "data-testid"?: string;
}

export const MotionCard = ({ children, className, delay = 0, ...props }: MotionCardProps) => (
  <motion.div
    className={className}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, margin: "-50px" }}
    variants={{
      hidden: { opacity: 0, y: 30, scale: 0.98 },
      visible: { 
        opacity: 1, 
        y: 0,
        scale: 1,
        transition: { duration: 0.5, delay, ease: appleEasing }
      },
    }}
    whileHover={{ y: -8, transition: { duration: 0.3, ease: appleEasing } }}
    {...props}
  >
    {children}
  </motion.div>
);

interface MotionSectionProps {
  children: ReactNode;
  className?: string;
}

export const MotionSection = ({ children, className }: MotionSectionProps) => (
  <motion.section
    className={className}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, margin: "-100px" }}
    variants={staggerContainer}
  >
    {children}
  </motion.section>
);

export const MotionLink = motion.a;

export { motion };
