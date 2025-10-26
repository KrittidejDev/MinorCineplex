import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";

const LanguageSwitcher: React.FC = () => {
  const router = useRouter();
  const { i18n } = useTranslation();
  const { pathname, query, asPath, locales, locale: currentLocale } = router;
  const languages = locales || [];
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Language display config
  const languageConfig: Record<string, { flag: string; name: string }> = {
    th: { flag: "🇹🇭", name: "TH" },
    en: { flag: "🇺🇸", name: "EN" },
  };

  const currentLangConfig = languageConfig[currentLocale || "en"];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLanguageChange = (newLocale: string) => {
    router.push({ pathname, query }, asPath, { locale: newLocale });
    i18n.changeLanguage(newLocale);
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className="relative inline-block z-50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2.5 rounded-xl backdrop-blur-sm  transition-all duration-300 text-white font-medium shadow-lg hover:shadow-xl group"
      >
        <span className="text-xl group-hover:scale-110 transition-transform duration-300">
          {currentLangConfig?.flag || "🌐"}
        </span>
        <span className="text-sm">
          {currentLangConfig?.name || currentLocale?.toUpperCase()}
        </span>
        <svg
          className={`w-4 h-4 transition-all duration-300 ${
            isOpen ? "rotate-180" : "rotate-0"
          }`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-50!"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-3 w-48 bg-gray-g63f backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden z-60 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="p-2">
              {languages.map((lang: string) => {
                const config = languageConfig[lang];
                const isActive = currentLocale === lang;

                return (
                  <button
                    key={lang}
                    onClick={() => handleLanguageChange(lang)}
                    className={`flex items-center gap-3 px-4 py-3 w-full text-left rounded-xl transition-all duration-200 group ${
                      isActive
                        ? " text-white shadow-md"
                        : "hover:bg-gray-100 text-gray-700"
                    }`}
                  >
                    <span
                      className={`text-2xl transition-transform duration-200 ${
                        isActive ? "scale-110" : "group-hover:scale-110"
                      }`}
                    >
                      {config?.flag || "🌐"}
                    </span>
                    <span className="font-medium flex-1">
                      {config?.name || lang.toUpperCase()}
                    </span>
                    {isActive && (
                      <svg
                        className="w-5 h-5 animate-in zoom-in duration-200"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default LanguageSwitcher;
