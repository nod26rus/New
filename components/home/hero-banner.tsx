"use client";

import { motion } from "framer-motion";
import { useTranslations } from 'next-intl';
import { SiteSettings } from "@/lib/types/settings";

interface HeroBannerProps {
  settings: SiteSettings;
}

export function HeroBanner({ settings }: HeroBannerProps) {
  const t = useTranslations('home');

  return (
    <div className="relative h-[80vh] min-h-[600px] w-full overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url('${settings.bannerImage}')` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 to-background" />
      </div>

      <motion.div 
        className="relative h-full flex items-center justify-center text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="container px-4">
          <motion.h1 
            className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {settings.siteName}
          </motion.h1>
          
          <motion.p 
            className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            {settings.funnelText}
          </motion.p>
        </div>
      </motion.div>
    </div>
  );
}