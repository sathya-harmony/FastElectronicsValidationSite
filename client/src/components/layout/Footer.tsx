import { Link } from "wouter";
import { motion } from "framer-motion";

const appleEasing: [number, number, number, number] = [0.25, 0.1, 0.25, 1];

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05, delayChildren: 0.1 },
  },
};

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: appleEasing }
  },
};

const footerLinks = [
  {
    title: "Rapid Electronics",
    links: [
      { href: "/about", label: "About Us" },
      { href: "/careers", label: "Careers" },
    ],
  },
  {
    title: "For Stores",
    links: [
      { href: "/partner", label: "Become a Partner" },
      { href: "/admin", label: "Store Dashboard" },
    ],
  },
  {
    title: "Support",
    links: [
      { href: "/help", label: "Help Center" },
      { href: "/contact", label: "Contact Us" },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "/privacy", label: "Privacy Policy" },
      { href: "/terms", label: "Terms of Service" },
    ],
  },
];

export function Footer() {
  return (
    <motion.footer
      className="border-t border-black/5 bg-secondary/30 py-16"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={staggerContainer}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-12">
          {footerLinks.map((section, sectionIndex) => (
            <motion.div key={section.title} variants={fadeInUp}>
              <h4 className="font-semibold text-sm mb-5">{section.title}</h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href}>
                      <motion.span
                        className="hover:text-foreground transition-colors duration-300 cursor-pointer"
                        whileHover={{ x: 4 }}
                        transition={{ duration: 0.2 }}
                      >
                        {link.label}
                      </motion.span>
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
        <motion.div
          className="border-t border-black/5 pt-10 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground"
          variants={fadeInUp}
        >
          <p>© 2024 Rapid Electronics. All rights reserved.</p>
          <motion.div
            className="flex items-center gap-6"
            whileHover={{ scale: 1.02 }}
          >
            <span className="font-medium">Bangalore, India</span>
          </motion.div>
        </motion.div>
      </div>
    </motion.footer>
  );
}
