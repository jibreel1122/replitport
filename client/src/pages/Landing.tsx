import { useState } from "react";
import { LogIn, User, Shield, Globe } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";

export default function Landing() {
  const { t, toggleLanguage } = useLanguage();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-primary-900 flex items-center justify-center">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-200 dark:bg-primary-900 rounded-full opacity-20 animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-200 dark:bg-blue-900 rounded-full opacity-20 animate-float animation-delay-3000"></div>
      </div>

      {/* Theme and Language controls */}
      <div className="absolute top-8 right-8 flex items-center space-x-4">
        <button
          onClick={toggleTheme}
          className="p-3 glass rounded-full premium-shadow hover:scale-110 transition-all duration-200"
          data-testid="landing-theme-toggle"
        >
          {theme === "light" ? "🌙" : "☀️"}
        </button>
        <button
          onClick={toggleLanguage}
          className="p-3 glass rounded-full premium-shadow hover:scale-110 transition-all duration-200"
          data-testid="landing-language-toggle"
        >
          🌍
        </button>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <div className="space-y-8 animate-fade-in-up">
          {/* Logo/Brand */}
          <div className="space-y-4">
            <div className="w-24 h-24 bg-primary-500 rounded-full flex items-center justify-center mx-auto premium-shadow">
              <User className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-5xl lg:text-7xl font-bold gradient-text">
              {t("hero.name")}
            </h1>
            <p className="text-xl lg:text-2xl text-gray-600 dark:text-gray-300">
              Portfolio & Admin Portal
            </p>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-12">
            <div className="glass rounded-xl p-6 premium-shadow hover:scale-105 transition-transform duration-200">
              <Globe className="w-8 h-8 text-primary-500 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Bilingual Portfolio</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Professional portfolio in both English and Arabic with RTL support
              </p>
            </div>
            <div className="glass rounded-xl p-6 premium-shadow hover:scale-105 transition-transform duration-200">
              <Shield className="w-8 h-8 text-primary-500 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Secure Admin Panel</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Manage projects and content with authenticated access
              </p>
            </div>
            <div className="glass rounded-xl p-6 premium-shadow hover:scale-105 transition-transform duration-200">
              <User className="w-8 h-8 text-primary-500 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Premium Design</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Modern, responsive design with dark/light theme support
              </p>
            </div>
          </div>

          {/* Call to Action */}
          <div className="space-y-6">
            <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed max-w-2xl mx-auto">
              Welcome to Jibreel Bornat's professional portfolio. Access the admin panel to manage projects 
              and content, or explore the public portfolio.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/api/login"
                className="px-8 py-4 bg-primary-500 hover:bg-primary-600 text-white rounded-xl font-semibold transition-all duration-200 premium-shadow hover:scale-105 flex items-center justify-center gap-2"
                data-testid="button-admin-login"
              >
                <LogIn className="w-5 h-5" />
                Admin Login
              </a>
              <button
                onClick={() => window.location.reload()}
                className="px-8 py-4 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-white border-2 border-gray-200 dark:border-gray-600 rounded-xl font-semibold transition-all duration-200 hover:scale-105"
                data-testid="button-view-portfolio"
              >
                View Portfolio
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="pt-8 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              © 2025 {t("hero.name")}. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
