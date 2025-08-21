import { Heart } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Footer() {
  const { t } = useLanguage();

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-gray-50 dark:bg-gray-800 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-2xl font-bold gradient-text mb-4" data-testid="text-footer-name">
              {t("hero.name")}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6" data-testid="text-footer-description">
              {t("footer.description")}
            </p>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">{t("footer.links")}</h4>
            <div className="flex flex-wrap gap-6">
              <button
                onClick={() => scrollToSection("about")}
                className="text-gray-600 dark:text-gray-400 hover:text-primary-500 transition-colors duration-200"
                data-testid="footer-link-about"
              >
                {t("nav.about")}
              </button>
              <button
                onClick={() => scrollToSection("skills")}
                className="text-gray-600 dark:text-gray-400 hover:text-primary-500 transition-colors duration-200"
                data-testid="footer-link-skills"
              >
                {t("nav.skills")}
              </button>
              <button
                onClick={() => scrollToSection("projects")}
                className="text-gray-600 dark:text-gray-400 hover:text-primary-500 transition-colors duration-200"
                data-testid="footer-link-projects"
              >
                {t("nav.projects")}
              </button>
              <button
                onClick={() => scrollToSection("contact")}
                className="text-gray-600 dark:text-gray-400 hover:text-primary-500 transition-colors duration-200"
                data-testid="footer-link-contact"
              >
                {t("nav.contact")}
              </button>
            </div>
          </div>
        </div>
        
        <hr className="my-8 border-gray-200 dark:border-gray-700" />
        
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <span>{t("footer.made")}</span>
            <Heart className="w-4 h-4 text-red-500" />
            <span>{t("footer.in")}</span>
          </div>
          <div className="flex items-center space-x-4">
            <p className="text-gray-600 dark:text-gray-400" data-testid="text-footer-rights">
              {t("footer.rights")}
            </p>
            <button
              onClick={scrollToTop}
              className="text-gray-600 dark:text-gray-400 hover:text-primary-500 transition-colors duration-200 text-sm"
              data-testid="button-back-to-top"
            >
              Back to Top
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
