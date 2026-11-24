import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Lang = "fr" | "en";
export const langs: Lang[] = ["fr", "en"];
export const isLang = (v: unknown): v is Lang => v === "fr" || v === "en";

const dict = {
  en: {
    tagline: (n: number) => (n ? `${n} services. Scroll to see them one by one.` : "No services configured yet."),
    sections: "Sections",
    language: "Language",
    go: "Getting there",
    online: "Online",
    offline: "Offline",
    checking: "Checking",
  },
  fr: {
    tagline: (n: number) =>
      n ? `${n} services. Faites défiler pour les voir un par un.` : "Aucun service configuré pour le moment.",
    sections: "Sections",
    language: "Langue",
    go: "On y va",
    online: "En ligne",
    offline: "Hors ligne",
    checking: "Vérification",
  },
};

type Ctx = { lang: Lang; setLang: (l: Lang) => void; t: (typeof dict)[Lang] };
const I18nContext = createContext<Ctx>(null!);
export const useI18n = () => useContext(I18nContext);

export function I18nProvider({ defaultLang, children }: { defaultLang: Lang; children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    try {
      const saved = localStorage.getItem("lang");
      if (isLang(saved)) return saved;
    } catch {}
    return defaultLang;
  });

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = (l: Lang) => {
    setLangState(l);
    try {
      localStorage.setItem("lang", l);
    } catch {}
  };

  return <I18nContext.Provider value={{ lang, setLang, t: dict[lang] }}>{children}</I18nContext.Provider>;
}
