"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { useTranslations } from 'next-intl';
import Link from "next/link";
import Image from "next/image";
import { Sun, Moon, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { CategoryNav } from "./category-nav";
import { SearchInput } from "./search/search-input";
import { LanguageSwitcher } from "./language-switcher";
import { useSiteSettings } from "@/lib/hooks/use-site-settings";

export function SiteHeader() {
  const { setTheme } = useTheme();
  const { settings } = useSiteSettings();
  const t = useTranslations('common');
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`sticky top-0 z-50 w-full transition-all duration-200 ${
      isScrolled ? 'bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b' : 'bg-transparent'
    }`}>
      <div className="container mx-auto px-4">
        <div className="h-16 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2">
            {settings.logo && (
              <Image
                src={settings.logo}
                alt={settings.siteName}
                width={32}
                height={32}
                className="w-8 h-8 object-contain"
              />
            )}
            <span className="font-bold text-xl hidden sm:inline-block">
              {settings.siteName}
            </span>
          </Link>

          <div className="hidden md:flex flex-1 max-w-xl mx-8">
            <SearchInput />
          </div>

          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(useTheme().theme === 'dark' ? 'light' : 'dark')}
            >
              <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">{t('theme.toggle')}</span>
            </Button>

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <nav className="flex flex-col gap-4">
                  <SearchInput />
                  <CategoryNav className="flex-col items-start" />
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        <div className="h-12 -mx-4 hidden md:block">
          <CategoryNav />
        </div>
      </div>
    </header>
  );
}