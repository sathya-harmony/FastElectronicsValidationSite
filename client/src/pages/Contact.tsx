import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send, ArrowRight } from "lucide-react";
import { useState } from "react";
import { MotionButton } from "@/lib/motion";

const appleEasing: [number, number, number, number] = [0.25, 0.1, 0.25, 1];

const fadeInUp = {
  hidden: { opacity: 0, y: 30, filter: "blur(8px)" },
  visible: { 
    opacity: 1, 
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.7, ease: appleEasing }
  },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.2,
    },
  },
};

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    window.location.href = `mailto:tanay.sathya@gmail.com?subject=ThunderFast Contact: ${formData.name}&body=${encodeURIComponent(formData.message)}%0A%0AFrom: ${formData.email}`;
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <section className="relative pt-32 pb-20 bg-gradient-to-b from-black via-gray-900 to-black overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(100,100,100,0.15),transparent_60%)]" />
        <motion.div 
          className="relative z-10 max-w-4xl mx-auto px-6 text-center"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          <motion.p 
            className="text-sm font-medium text-white/50 uppercase tracking-[0.3em] mb-4"
            variants={fadeInUp}
          >
            Get in Touch
          </motion.p>
          <motion.h1 
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight mb-6"
            variants={fadeInUp}
          >
            Let's Connect
          </motion.h1>
          <motion.p 
            className="text-lg text-white/60 max-w-2xl mx-auto leading-relaxed"
            variants={fadeInUp}
          >
            Have questions about ThunderFast? Want to partner with us? We'd love to hear from you. 
            Reach out and we'll respond as soon as we can.
          </motion.p>
        </motion.div>
      </section>

      <main className="flex-1 py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div 
            className="grid lg:grid-cols-2 gap-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.div className="space-y-10" variants={fadeInUp}>
              <div>
                <h2 className="text-2xl font-bold tracking-tight mb-6">Contact Information</h2>
                <p className="text-muted-foreground leading-relaxed mb-8">
                  We're here to help with any questions about our rapid electronics delivery service in Bangalore. 
                  Whether you're a customer, potential partner store, or investor, don't hesitate to reach out.
                </p>
              </div>
              
              <div className="space-y-6">
                <motion.a 
                  href="mailto:tanay.sathya@gmail.com"
                  className="flex items-center gap-5 p-5 rounded-2xl bg-secondary/50 hover:bg-secondary transition-all duration-300 group"
                  whileHover={{ x: 8 }}
                  data-testid="link-email"
                >
                  <div className="h-14 w-14 rounded-xl bg-black flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Mail className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Email us at</p>
                    <p className="font-semibold text-lg">tanay.sathya@gmail.com</p>
                  </div>
                  <ArrowRight className="h-5 w-5 ml-auto text-muted-foreground group-hover:translate-x-2 transition-transform duration-300" />
                </motion.a>
                
                <motion.div 
                  className="flex items-center gap-5 p-5 rounded-2xl bg-secondary/50"
                  whileHover={{ x: 8 }}
                >
                  <div className="h-14 w-14 rounded-xl bg-black flex items-center justify-center">
                    <MapPin className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Location</p>
                    <p className="font-semibold text-lg">Bangalore, India</p>
                  </div>
                </motion.div>
              </div>
              
              <div className="pt-6">
                <h3 className="font-semibold mb-4">Why ThunderFast?</h3>
                <ul className="space-y-3 text-muted-foreground">
                  <motion.li 
                    className="flex items-center gap-3"
                    whileHover={{ x: 4 }}
                  >
                    <div className="h-2 w-2 rounded-full bg-black" />
                    30-120 minute delivery across Bangalore
                  </motion.li>
                  <motion.li 
                    className="flex items-center gap-3"
                    whileHover={{ x: 4 }}
                  >
                    <div className="h-2 w-2 rounded-full bg-black" />
                    Premium electronics from trusted local partners
                  </motion.li>
                  <motion.li 
                    className="flex items-center gap-3"
                    whileHover={{ x: 4 }}
                  >
                    <div className="h-2 w-2 rounded-full bg-black" />
                    Compare prices across multiple stores instantly
                  </motion.li>
                </ul>
              </div>
            </motion.div>
            
            <motion.div variants={fadeInUp}>
              <div className="bg-white rounded-3xl p-8 lg:p-10 premium-shadow border border-black/5">
                <h3 className="text-xl font-bold mb-6">Send us a Message</h3>
                
                {submitted ? (
                  <motion.div 
                    className="text-center py-12"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4 }}
                  >
                    <div className="h-16 w-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                      <Send className="h-7 w-7 text-emerald-600" />
                    </div>
                    <h4 className="text-lg font-semibold mb-2">Email client opened!</h4>
                    <p className="text-muted-foreground">
                      Complete sending your message in your email app.
                    </p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                      <label className="block text-sm font-medium mb-2">Your Name</label>
                      <motion.input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full px-5 py-4 rounded-xl border border-black/10 bg-secondary/30 focus:outline-none focus:ring-2 focus:ring-black/20 transition-all duration-300"
                        placeholder="Enter your name"
                        whileFocus={{ scale: 1.01 }}
                        data-testid="input-name"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Email Address</label>
                      <motion.input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="w-full px-5 py-4 rounded-xl border border-black/10 bg-secondary/30 focus:outline-none focus:ring-2 focus:ring-black/20 transition-all duration-300"
                        placeholder="your@email.com"
                        whileFocus={{ scale: 1.01 }}
                        data-testid="input-email"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Message</label>
                      <motion.textarea
                        required
                        rows={5}
                        value={formData.message}
                        onChange={(e) => setFormData({...formData, message: e.target.value})}
                        className="w-full px-5 py-4 rounded-xl border border-black/10 bg-secondary/30 focus:outline-none focus:ring-2 focus:ring-black/20 transition-all duration-300 resize-none"
                        placeholder="How can we help you?"
                        whileFocus={{ scale: 1.01 }}
                        data-testid="input-message"
                      />
                    </div>
                    
                    <MotionButton
                      type="submit"
                      className="w-full py-4 px-8 bg-black text-white rounded-full font-medium text-base shadow-xl shadow-black/20 hover:bg-gray-800 transition-colors duration-300 flex items-center justify-center gap-2"
                      data-testid="button-submit"
                    >
                      Send Message
                      <Send className="h-4 w-4" />
                    </MotionButton>
                  </form>
                )}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
