import jibreelPhoto from "@assets/537192047_3171003243056690_158928708899493792_n_1755788916870.jpg";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Hero() {
  const { t } = useLanguage();

  const scrollToContact = () => {
    const element = document.getElementById("contact");
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const scrollToProjects = () => {
    const element = document.getElementById("projects");
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <section id="home" className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-primary-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-primary-900">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-200 dark:bg-primary-900 rounded-full opacity-20 animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-200 dark:bg-blue-900 rounded-full opacity-20 animate-float animation-delay-3000"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Text Content */}
          <div className="space-y-8 animate-fade-in-up">
            <div className="space-y-4">
              <p className="text-lg text-primary-600 dark:text-primary-400 font-medium">
                {t("hero.greeting")}
              </p>
              <h1 className="text-5xl lg:text-7xl font-bold gradient-text">
                {t("hero.name")}
              </h1>
              <p className="text-xl lg:text-2xl text-gray-600 dark:text-gray-300">
                {t("hero.title")}
              </p>
            </div>
            
            <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
              {t("hero.description")}
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={scrollToContact}
                className="px-8 py-4 bg-primary-500 hover:bg-primary-600 text-white rounded-xl font-semibold transition-all duration-200 premium-shadow hover:scale-105"
                data-testid="button-contact"
              >
                {t("hero.contact")}
              </button>
              <button
                onClick={scrollToProjects}
                className="px-8 py-4 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-white border-2 border-gray-200 dark:border-gray-600 rounded-xl font-semibold transition-all duration-200 hover:scale-105"
                data-testid="button-work"
              >
                {t("hero.work")}
              </button>
            </div>
          </div>

          {/* Professional Photo */}
          <div className="flex justify-center lg:justify-end animate-slide-in-right">
            <div className="relative">
              <div className="w-80 h-80 lg:w-96 lg:h-96 rounded-full overflow-hidden premium-shadow">
                <img 
                  src={jibreelPhoto} 
                  alt="Jibreel Bornat Professional Photo" 
                  className="w-full h-full object-cover" 
                  data-testid="img-profile"
                />
              </div>
              {/* Decorative elements */}
              <div className="absolute -top-4 -left-4 w-20 h-20 bg-primary-500 rounded-full opacity-20 animate-float"></div>
              <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-blue-500 rounded-full opacity-30 animate-float animation-delay-2000"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
