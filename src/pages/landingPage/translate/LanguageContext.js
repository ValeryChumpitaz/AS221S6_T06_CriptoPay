import React, { createContext, useState, useContext } from "react";
import Espanol from "./Español";
import Ingles from "./Ingles";

const translations = {
  es: Espanol,
  en: Ingles,
};

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState("es");

  const switchLanguage = (lang) => setLanguage(lang);

  const value = {
    language,
    switchLanguage,
    texts: translations[language],
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);

export default LanguageContext;
