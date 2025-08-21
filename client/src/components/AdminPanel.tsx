import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { X, Plus, Edit2, Trash2, Save, Ban, Upload, Image } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import type { Project, InsertProject, UpdateProject } from "@shared/schema";

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AdminPanel({ isOpen, onClose }: AdminPanelProps) {
  const { t } = useLanguage();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [formData, setFormData] = useState<InsertProject>({
    nameEn: "",
    nameAr: "",
    descriptionEn: "",
    descriptionAr: "",
    imageUrl: "",
    demoUrl: "",
    technologies: [],
    isFeatured: false,
  });

  const { data: projects = [], isLoading } = useQuery<Project[]>({
    queryKey: ["/api/projects"],
    enabled: isOpen,
  });

  const createProjectMutation = useMutation({
    mutationFn: async (data: InsertProject) => {
      await apiRequest("POST", "/api/projects", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      toast({
        title: "Success",
        description: t("admin.success"),
        variant: "default",
      });
      resetForm();
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: t("unauthorized"),
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: error.message || "Failed to create project",
        variant: "destructive",
      });
    },
  });

  const updateProjectMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateProject }) => {
      await apiRequest("PUT", `/api/projects/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      toast({
        title: "Success",
        description: "Project updated successfully!",
        variant: "default",
      });
      setEditingProject(null);
      resetForm();
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: t("unauthorized"),
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: error.message || "Failed to update project",
        variant: "destructive",
      });
    },
  });

  const deleteProjectMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/projects/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      toast({
        title: "Success",
        description: "Project deleted successfully!",
        variant: "default",
      });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: t("unauthorized"),
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: error.message || "Failed to delete project",
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    setFormData({
      nameEn: "",
      nameAr: "",
      descriptionEn: "",
      descriptionAr: "",
      imageUrl: "",
      demoUrl: "",
      technologies: [],
      isFeatured: false,
    });
    setEditingProject(null);
    setSelectedImage(null);
    setImagePreview("");
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setFormData({
      nameEn: project.nameEn,
      nameAr: project.nameAr || "",
      descriptionEn: project.descriptionEn,
      descriptionAr: project.descriptionAr || "",
      imageUrl: project.imageUrl,
      demoUrl: project.demoUrl || "",
      technologies: project.technologies,
      isFeatured: project.isFeatured || false,
    });
    setSelectedImage(null);
    setImagePreview(project.imageUrl);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      ...formData,
      technologies: typeof formData.technologies === 'string' 
        ? (formData.technologies as string).split(',').map(t => t.trim()).filter(t => t)
        : formData.technologies
    };

    if (editingProject) {
      updateProjectMutation.mutate({ id: editingProject.id, data });
    } else {
      createProjectMutation.mutate(data);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setImagePreview(result);
        setFormData(prev => ({
          ...prev,
          imageUrl: result // Use base64 data URL for now
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      deleteProjectMutation.mutate(id);
    }
  };

  const techString = Array.isArray(formData.technologies) 
    ? formData.technologies.join(', ')
    : formData.technologies;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 backdrop-blur-sm" data-testid="admin-panel">
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="glass rounded-2xl w-full max-w-6xl max-h-[90vh] overflow-y-auto premium-shadow">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold" data-testid="text-admin-title">
                {t("admin.title")}
              </h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
                data-testid="button-close-admin"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          <div className="p-6">
            {/* Add/Edit Project Form */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-4">
                {editingProject ? "Edit Project" : t("admin.add")}
              </h3>
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4" data-testid="form-project">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    {t("admin.name")}
                  </label>
                  <input
                    type="text"
                    name="nameEn"
                    value={formData.nameEn}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500"
                    required
                    data-testid="input-name-en"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    {t("admin.name.ar")}
                  </label>
                  <input
                    type="text"
                    name="nameAr"
                    value={formData.nameAr || ""}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500"
                    data-testid="input-name-ar"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    {t("admin.description")}
                  </label>
                  <input
                    type="text"
                    name="descriptionEn"
                    value={formData.descriptionEn}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500"
                    required
                    data-testid="input-description-en"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    {t("admin.description.ar")}
                  </label>
                  <input
                    type="text"
                    name="descriptionAr"
                    value={formData.descriptionAr || ""}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500"
                    data-testid="input-description-ar"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    {t("admin.image")}
                  </label>
                  <div className="space-y-4">
                    {/* File Upload */}
                    <div className="flex items-center gap-4">
                      <label className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg cursor-pointer transition-colors">
                        <Upload className="w-4 h-4" />
                        Upload Image
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                          data-testid="input-image-upload"
                        />
                      </label>
                      <span className="text-sm text-gray-500">
                        {selectedImage ? selectedImage.name : "or enter URL below"}
                      </span>
                    </div>
                    
                    {/* URL Input */}
                    <input
                      type="url"
                      name="imageUrl"
                      value={formData.imageUrl}
                      onChange={handleInputChange}
                      placeholder="https://example.com/image.jpg"
                      className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500"
                      data-testid="input-image-url"
                    />
                    
                    {/* Image Preview */}
                    {imagePreview && (
                      <div className="mt-4">
                        <label className="block text-sm font-medium mb-2">Preview:</label>
                        <div className="glass rounded-lg p-2 inline-block">
                          <img 
                            src={imagePreview} 
                            alt="Preview" 
                            className="w-32 h-20 object-cover rounded"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    {t("admin.demo")}
                  </label>
                  <input
                    type="url"
                    name="demoUrl"
                    value={formData.demoUrl || ""}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500"
                    data-testid="input-demo-url"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    {t("admin.technologies")}
                  </label>
                  <input
                    type="text"
                    name="technologies"
                    value={techString}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500"
                    placeholder="React, JavaScript, Next.js"
                    data-testid="input-technologies"
                  />
                </div>
                <div className="flex items-end">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="isFeatured"
                      checked={formData.isFeatured || false}
                      onChange={handleInputChange}
                      className="rounded"
                      data-testid="checkbox-featured"
                    />
                    <span className="text-sm">{t("admin.featured")}</span>
                  </label>
                </div>
                <div className="md:col-span-2 flex gap-4">
                  <button
                    type="submit"
                    disabled={createProjectMutation.isPending || updateProjectMutation.isPending}
                    className="px-6 py-2 bg-primary-500 hover:bg-primary-600 disabled:opacity-50 text-white rounded-lg font-semibold transition-all duration-200 flex items-center gap-2"
                    data-testid="button-save-project"
                  >
                    <Save className="w-4 h-4" />
                    {editingProject ? "Update Project" : t("admin.add.button")}
                  </button>
                  {editingProject && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingProject(null);
                        resetForm();
                      }}
                      className="px-6 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-semibold transition-all duration-200 flex items-center gap-2"
                      data-testid="button-cancel-edit"
                    >
                      <Ban className="w-4 h-4" />
                      Ban
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* Existing Projects Management */}
            <div>
              <h3 className="text-xl font-semibold mb-4">{t("admin.manage")}</h3>
              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="animate-pulse glass rounded-lg p-4">
                      <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/2 mb-2"></div>
                      <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4" data-testid="projects-list">
                  {projects.map((project) => (
                    <div 
                      key={project.id}
                      className="glass rounded-lg p-4 flex justify-between items-center"
                      data-testid={`project-item-${project.id}`}
                    >
                      <div>
                        <h4 className="font-semibold flex items-center gap-2">
                          {project.nameEn}
                          {project.isFeatured && (
                            <span className="px-2 py-1 bg-primary-500 text-white rounded-full text-xs">
                              Featured
                            </span>
                          )}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {project.descriptionEn}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(project)}
                          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm transition-colors duration-200 flex items-center gap-1"
                          data-testid={`button-edit-${project.id}`}
                        >
                          <Edit2 className="w-3 h-3" />
                          {t("admin.edit")}
                        </button>
                        <button
                          onClick={() => handleDelete(project.id)}
                          disabled={deleteProjectMutation.isPending}
                          className="px-4 py-2 bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white rounded-lg text-sm transition-colors duration-200 flex items-center gap-1"
                          data-testid={`button-delete-${project.id}`}
                        >
                          <Trash2 className="w-3 h-3" />
                          {t("admin.delete")}
                        </button>
                      </div>
                    </div>
                  ))}
                  {projects.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      No projects found. Add your first project above!
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
