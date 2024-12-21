import { createI18nServer } from "next-international/server";
import { createI18nClient } from "next-international/client";

export const { useI18n, useScopedI18n, I18nProviderClient } = createI18nClient({
  en: () => import("./locales/en.json"),
  ru: () => import("./locales/ru.json"),
});

export const { getI18n, getScopedI18n, I18nProvider } = createI18nServer({
  en: () => import("./locales/en.json"),
  ru: () => import("./locales/ru.json"),
});