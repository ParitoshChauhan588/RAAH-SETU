import React from "react";
import NavBar from "./NavBar";
import Footer from "./Footer";
import SOSButton from "./SOSButton";
import { motion, AnimatePresence } from "framer-motion";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground relative overflow-hidden">
      {/* Enhanced Background Elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950"></div>
        
        {/* Animated blobs */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-purple-300/20 to-pink-300/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/3 right-0 w-96 h-96 bg-gradient-to-br from-blue-300/20 to-cyan-300/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-gradient-to-br from-green-300/20 to-emerald-300/20 rounded-full blur-3xl animate-pulse delay-500"></div>
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:50px_50px] dark:bg-[linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px)]"></div>
      </div>

      <NavBar />
      <AnimatePresence mode="wait">
        <motion.main
          key={typeof window !== "undefined" ? window.location.pathname : "/"}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.45, ease: [0.2, 0.9, 0.2, 1] }}
          className="flex-1 relative z-10"
        >
          {children}
        </motion.main>
      </AnimatePresence>

      {/* Floating quick actions */}
      <div className="fixed right-6 bottom-6 z-50">
        <div className="flex flex-col items-end gap-3">
          <a
            href="/sos"
            className="inline-flex items-center gap-3 px-4 py-3 rounded-full bg-gradient-to-br from-primary to-secondary text-primary-foreground shadow-lg transform transition hover:scale-105"
          >
            Open SOS
          </a>
          <div className="relative">
            <div className="absolute -inset-1 rounded-full pulse-ring bg-[rgba(255,255,255,0.03)]"></div>
            <SOSButton />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
