import { useState } from "react";
import { Menu, X, Sun, Moon, Settings } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/hooks/useAuth";

interface NavigationProps {
  onAdminClick: () => void;
}

export default function Navigation({ onAdminClick }: NavigationProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { language, toggleLanguage, t } = useLanguage();
  const { isAuthenticated } = useAuth();

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <span className="text-2xl font-bold gradient-text">
              {t("hero.name")}
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className={`${language === 'ar' ? 'mr-10' : 'ml-10'} flex items-baseline ${language === 'ar' ? 'space-x-reverse space-x-8' : 'space-x-8'}`}>
              <button
                onClick={() => scrollToSection("home")}
                className="nav-link hover:text-primary-500 transition-colors duration-200"
                data-testid="nav-home"
              >
                {t("nav.home")}
              </button>
              <button
                onClick={() => scrollToSection("about")}
                className="nav-link hover:text-primary-500 transition-colors duration-200"
                data-testid="nav-about"
              >
                {t("nav.about")}
              </button>
              <button
                onClick={() => scrollToSection("skills")}
                className="nav-link hover:text-primary-500 transition-colors duration-200"
                data-testid="nav-skills"
              >
                {t("nav.skills")}
              </button>
              <button
                onClick={() => scrollToSection("projects")}
                className="nav-link hover:text-primary-500 transition-colors duration-200"
                data-testid="nav-projects"
              >
                {t("nav.projects")}
              </button>
              <button
                onClick={() => scrollToSection("contact")}
                className="nav-link hover:text-primary-500 transition-colors duration-200"
                data-testid="nav-contact"
              >
                {t("nav.contact")}
              </button>
            </div>
          </div>

          {/* Theme and Language toggles */}
          <div className={`flex items-center ${language === 'ar' ? 'space-x-reverse space-x-4' : 'space-x-4'}`}>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
              data-testid="theme-toggle"
            >
              {theme === "light" ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </button>
            <button
              onClick={toggleLanguage}
              className="p-2 px-4 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
              data-testid="language-toggle"
            >
              {t("nav.language")}
            </button>
            <button
              onClick={() => {
                if (isAuthenticated) {
                  onAdminClick();
                } else {
                  window.location.href = "/api/login";
                }
              }}
              className="p-2 px-4 rounded-lg bg-primary-500 text-white hover:bg-primary-600 transition-colors duration-200"
              data-testid="admin-toggle"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
              data-testid="mobile-menu-toggle"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden glass">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <button
              onClick={() => scrollToSection("home")}
              className="block px-3 py-2 w-full text-left hover:text-primary-500 transition-colors duration-200"
              data-testid="mobile-nav-home"
            >
              {t("nav.home")}
            </button>
            <button
              onClick={() => scrollToSection("about")}
              className="block px-3 py-2 w-full text-left hover:text-primary-500 transition-colors duration-200"
              data-testid="mobile-nav-about"
            >
              {t("nav.about")}
            </button>
            <button
              onClick={() => scrollToSection("skills")}
              className="block px-3 py-2 w-full text-left hover:text-primary-500 transition-colors duration-200"
              data-testid="mobile-nav-skills"
            >
              {t("nav.skills")}
            </button>
            <button
              onClick={() => scrollToSection("projects")}
              className="block px-3 py-2 w-full text-left hover:text-primary-500 transition-colors duration-200"
              data-testid="mobile-nav-projects"
            >
              {t("nav.projects")}
            </button>
            <button
              onClick={() => scrollToSection("contact")}
              className="block px-3 py-2 w-full text-left hover:text-primary-500 transition-colors duration-200"
              data-testid="mobile-nav-contact"
            >
              {t("nav.contact")}
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
