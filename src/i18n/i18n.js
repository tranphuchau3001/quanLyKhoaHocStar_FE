import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// Language resources
const resources = {
  en: {
    translation: {
      "profile account": "Profile",
      "setting account": "Setting",
    },
  },
  vi: {
    translation: {
      "profile account": "Thông tin tài khoản",
      "setting account": "Cài đặt",
    },
  },
};

// Initialize i18next
i18n.use(initReactI18next).init({
  resources,
  lng: "vi", // Default language
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
