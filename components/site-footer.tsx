"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useLocale } from 'next-intl';
import { 
  Github, 
  Twitter, 
  Facebook, 
  Instagram, 
  Linkedin,
  Youtube
} from "lucide-react";

interface SocialLink {
  platform: string;
  url: string;
}

interface FooterSettings {
  socialLinks: SocialLink[];
  copyrightText: string;
}

const socialIcons = {
  github: Github,
  twitter: Twitter,
  facebook: Facebook,
  instagram: Instagram,
  linkedin: Linkedin,
  youtube: Youtube
};

export function SiteFooter() {
  const [settings, setSettings] = useState<FooterSettings>({
    socialLinks: [],
    copyrightText: ""
  });
  const locale = useLocale();

  useEffect(() => {
    async function loadFooterSettings() {
      try {
        const response = await fetch('/api/settings/footer');
        if (!response.ok) throw new Error();
        const data = await response.json();
        setSettings(data);
      } catch (error) {
        console.error('Failed to load footer settings:', error);
      }
    }

    loadFooterSettings();
  }, []);

  const copyrightText = settings.copyrightText.replace(
    '{year}', 
    new Date().getFullYear().toString()
  );

  return (
    <footer className="bg-muted/30 border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col items-center gap-8">
          {settings.socialLinks.length > 0 && (
            <motion.div 
              className="flex gap-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {settings.socialLinks.map((link, index) => {
                const Icon = socialIcons[link.platform as keyof typeof socialIcons];
                if (!Icon) return null;

                return (
                  <Link
                    key={index}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Icon className="w-5 h-5" />
                    <span className="sr-only">{link.platform}</span>
                  </Link>
                );
              })}
            </motion.div>
          )}

          <motion.p 
            className="text-sm text-muted-foreground text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {copyrightText}
          </motion.p>
        </div>
      </div>
    </footer>
  );
}