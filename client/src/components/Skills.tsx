import { useLanguage } from "@/contexts/LanguageContext";
import { useEffect, useRef, useState } from "react";

export default function Skills() {
  const { t } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);
  const skillsRef = useRef<HTMLDivElement>(null);

  const skills = [
    { name: "JavaScript", icon: "fab fa-js-square", color: "from-yellow-500 to-yellow-600", percentage: 95 },
    { name: "Python", icon: "fab fa-python", color: "from-green-500 to-green-600", percentage: 88 },
    { name: "Java", icon: "fab fa-java", color: "from-red-500 to-red-600", percentage: 85 },
    { name: "C", icon: "fas fa-code", color: "from-blue-600 to-blue-700", percentage: 80 },
    { name: "React", icon: "fab fa-react", color: "from-blue-400 to-blue-500", percentage: 93 },
    { name: "Node.js", icon: "fab fa-node-js", color: "from-green-600 to-green-700", percentage: 87 },
    { name: "Next.js", icon: "fas fa-bolt", color: "from-gray-800 to-gray-900", percentage: 91 },
    { name: "Flutter", icon: "fas fa-mobile-alt", color: "from-cyan-500 to-cyan-600", percentage: 78 },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (skillsRef.current) {
      observer.observe(skillsRef.current);
    }

    return () => {
      if (skillsRef.current) {
        observer.unobserve(skillsRef.current);
      }
    };
  }, []);

  return (
    <section id="skills" className="py-20 bg-white dark:bg-gray-900" ref={skillsRef}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6" data-testid="text-skills-title">
            {t("skills.title")}
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400" data-testid="text-skills-subtitle">
            {t("skills.subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {skills.map((skill, index) => (
            <div 
              key={skill.name}
              className="glass rounded-xl p-6 premium-shadow"
              data-testid={`skill-${skill.name.toLowerCase().replace('.', '')}`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <i className={`${skill.icon} text-3xl`} style={{ 
                    color: skill.name === "JavaScript" ? "#f7df1e" :
                           skill.name === "Python" ? "#3776ab" :
                           skill.name === "Java" ? "#f89820" :
                           skill.name === "C" ? "#00599c" :
                           skill.name === "React" ? "#61dafb" :
                           skill.name === "Node.js" ? "#339933" :
                           skill.name === "Next.js" ? "currentColor" :
                           "#00d4aa"
                  }}></i>
                  <span className="text-xl font-semibold">{skill.name}</span>
                </div>
                <span className="text-primary-500 font-semibold" data-testid={`skill-percentage-${skill.name.toLowerCase().replace('.', '')}`}>
                  {skill.percentage}%
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  className={`skill-bar bg-gradient-to-r ${skill.color} h-2 rounded-full transition-all duration-2000 ease-in-out`}
                  style={{ 
                    width: isVisible ? `${skill.percentage}%` : "0%" 
                  }}
                  data-testid={`skill-bar-${skill.name.toLowerCase().replace('.', '')}`}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
