import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import Backend from "i18next-xhr-backend";
import detector from "i18next-browser-languagedetector";
import { i18nextPlugin } from "translation-check";

i18n.use(Backend)
    .use(detector)
    .use(initReactI18next)
    .use(i18nextPlugin)
    .init({
        supportedLngs: ["en", "ar_sa"],
        backend: {
            loadPath: "/locales/{{lng}}.json",
        },
        fallbackLng: ["en", "ar_sa"],
    });

export default i18n;
