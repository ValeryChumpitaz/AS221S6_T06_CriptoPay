import { useLanguage } from "./LanguageContext";

const useTranslate = () => {
  const { language, translations } = useLanguage();
  return translations[language];
};

export default useTranslate;
