import { 
  Code, 
  Palette, 
  Lightbulb, 
  Globe,
  Parentheses,
  Terminal,
  Coffee,
  Smartphone,
  Database,
  GitBranch,
  TrendingUp,
  Award,
  Zap,
  Target
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useQuery } from "@tanstack/react-query";
import type { Project } from "@shared/schema";

export default function About() {
  const { t } = useLanguage();

  // Fetch projects to get dynamic count
  const { data: projects = [] } = useQuery<Project[]>({
    queryKey: ["/api/projects"],
  });

  // Programming languages with skill percentages
  const programmingLanguages = [
    { name: "JavaScript", skill: 97, logo: "🟨" },
    { name: "TypeScript", skill: 94, logo: "🔷" },
    { name: "Java", skill: 91, logo: "☕" },
    { name: "C++", skill: 93, logo: "⚡" },
    { name: "PHP", skill: 92, logo: "🐘" },
    { name: "Python", skill: 90, logo: "🐍" },
  ];

  // Stats data
  const stats = [
    { icon: TrendingUp, label: "Years of Study", value: "2+", color: "text-blue-500" },
    { icon: Award, label: "Technologies", value: "15+", color: "text-green-500" },
    { icon: Zap, label: "Projects", value: `${projects.length}+`, color: "text-purple-500" },
    { icon: Target, label: "Dedication", value: "100%", color: "text-red-500" },
  ];

  const frameworks = [
    { name: "React", icon: Code, color: "text-blue-400" },
    { name: "Next.js", icon: Code, color: "text-gray-800 dark:text-white" },
    { name: "Node.js", icon: Database, color: "text-green-600" },
    { name: "PostgreSQL", icon: Database, color: "text-blue-700" },
    { name: "MongoDB", icon: Database, color: "text-green-700" },
    { name: "Git", icon: GitBranch, color: "text-orange-500" },
  ];

  const expertiseAreas = [
    {
      icon: Code,
      title: t("about.expertise.web"),
      description: t("about.expertise.web.desc"),
      color: "text-primary-500"
    },
    {
      icon: Palette,
      title: t("about.expertise.ui"),
      description: t("about.expertise.ui.desc"),
      color: "text-pink-500"
    },
    {
      icon: Lightbulb,
      title: t("about.expertise.problem"),
      description: t("about.expertise.problem.desc"),
      color: "text-yellow-500"
    },
    {
      icon: Globe,
      title: t("about.expertise.global"),
      description: t("about.expertise.global.desc"),
      color: "text-blue-500"
    },
  ];

  return (
    <section id="about" className="py-20 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6" data-testid="text-about-title">
            {t("about.title")}
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400" data-testid="text-about-subtitle">
            {t("about.subtitle")}
          </p>
        </div>

        {/* About Me Content - Centered and Balanced */}
        <div className="max-w-4xl mx-auto">
          <div className="glass rounded-2xl p-12 premium-shadow">
            <h3 className="text-3xl font-semibold mb-6 gradient-text text-center">
              {t("about.section.title")}
            </h3>
            <div className="space-y-6 text-lg leading-relaxed">
              <p className="text-gray-600 dark:text-gray-400">
                {t("about.section.description")}
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                {t("about.section.description2")}
              </p>
            </div>

            {/* Expertise Areas */}
            <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {expertiseAreas.map((area, index) => (
                <div 
                  key={index}
                  className="glass rounded-xl p-6 text-center premium-shadow hover:scale-105 transition-transform duration-200 bg-white/20 dark:bg-gray-800/20"
                  data-testid={`expertise-${area.title.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  <area.icon className={`w-10 h-10 ${area.color} mx-auto mb-4`} />
                  <h4 className="font-semibold mb-2">{area.title}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{area.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-16 glass rounded-2xl p-8 premium-shadow">
          <h3 className="text-2xl font-semibold mb-8 gradient-text text-center">
            {t("about.stats")}
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div 
                key={index}
                className="text-center"
                data-testid={`stat-${stat.label.toLowerCase().replace(/\s+/g, '-')}`}
              >
                <stat.icon className={`w-12 h-12 ${stat.color} mx-auto mb-3`} />
                <div className="text-3xl font-bold mb-2">{stat.value}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Programming Languages Section */}
        <div className="mt-16 glass rounded-2xl p-8 premium-shadow">
          <h3 className="text-2xl font-semibold mb-8 gradient-text text-center">
            Programming Languages
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {programmingLanguages.map((lang, index) => (
              <div 
                key={index}
                className="bg-white/10 dark:bg-gray-800/20 rounded-lg p-4"
                data-testid={`language-${lang.name.toLowerCase()}`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{lang.logo}</span>
                    <span className="font-semibold">{lang.name}</span>
                  </div>
                  <span className="font-bold text-primary-500">{lang.skill}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-primary-500 to-primary-600 h-3 rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${lang.skill}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
