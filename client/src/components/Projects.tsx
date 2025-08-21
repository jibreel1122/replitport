import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { ExternalLink, Filter } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import type { Project } from "@shared/schema";

export default function Projects() {
  const { t, language } = useLanguage();
  const [filter, setFilter] = useState<"all" | "featured">("all");

  const { data: projects = [], isLoading } = useQuery<Project[]>({
    queryKey: ["/api/projects"],
  });

  const filteredProjects = projects.filter(project => 
    filter === "all" || (filter === "featured" && project.isFeatured)
  );

  const featuredCount = projects.filter(p => p.isFeatured).length;

  if (isLoading) {
    return (
      <section id="projects" className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded w-64 mx-auto mb-4"></div>
              <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-96 mx-auto"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="projects" className="py-20 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6" data-testid="text-projects-title">
            {t("projects.title")}
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400" data-testid="text-projects-subtitle">
            {t("projects.subtitle")}
          </p>
        </div>

        {/* Project Filters */}
        <div className="flex justify-center mb-12">
          <div className="glass rounded-xl p-2 inline-flex space-x-2">
            <button
              onClick={() => setFilter("all")}
              className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 ${
                filter === "all" 
                  ? "bg-primary-500 text-white" 
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
              data-testid="filter-all"
            >
              {t("projects.filter.all")} ({projects.length})
            </button>
            <button
              onClick={() => setFilter("featured")}
              className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 ${
                filter === "featured" 
                  ? "bg-primary-500 text-white" 
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
              data-testid="filter-featured"
            >
              {t("projects.filter.featured")} ({featuredCount})
            </button>
          </div>
        </div>

        {/* Projects List */}
        <div className="space-y-8">
          {filteredProjects.length === 0 ? (
            <div className="text-center py-12">
              <Filter className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                No projects found for the selected filter.
              </p>
            </div>
          ) : (
            filteredProjects.map((project) => (
              <div 
                key={project.id}
                className="glass rounded-2xl overflow-hidden premium-shadow hover:scale-[1.02] transition-all duration-300"
                data-testid={`project-card-${project.id}`}
                style={{ aspectRatio: '6.67/1' }} // width:height = 1:0.15
              >
                <div className="flex h-full">
                  {/* Project Image */}
                  <div className="relative w-1/3 min-w-0">
                    <img 
                      src={project.imageUrl} 
                      alt={language === "ar" ? project.nameAr || project.nameEn : project.nameEn}
                      className="w-full h-full object-cover" 
                    />
                    {project.isFeatured && (
                      <div className="absolute top-4 right-4 bg-primary-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                        {t("projects.featured")}
                      </div>
                    )}
                  </div>
                  
                  {/* Project Content */}
                  <div className="flex-1 p-6 flex flex-col justify-between">
                    <div>
                      <h3 className="text-2xl font-semibold mb-3" data-testid={`project-title-${project.id}`}>
                        {language === "ar" ? project.nameAr || project.nameEn : project.nameEn}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm leading-relaxed" data-testid={`project-description-${project.id}`}>
                        {language === "ar" ? project.descriptionAr || project.descriptionEn : project.descriptionEn}
                      </p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {project.technologies.map((tech, index) => (
                          <span 
                            key={index}
                            className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-xs"
                            data-testid={`project-tech-${project.id}-${index}`}
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    {/* Action Button */}
                    {project.demoUrl && (
                      <div className="flex justify-end">
                        <a
                          href={project.demoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-6 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-semibold transition-all duration-200 flex items-center gap-2"
                          data-testid={`project-demo-${project.id}`}
                        >
                          <ExternalLink className="w-4 h-4" />
                          {t("projects.demo")}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
