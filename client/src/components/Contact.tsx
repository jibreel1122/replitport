import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Mail, Phone, MapPin, Github, Linkedin, Send } from "lucide-react";
import { SiFacebook } from "react-icons/si";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { InsertContactMessage } from "@shared/schema";

export default function Contact() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const contactMutation = useMutation({
    mutationFn: async (data: InsertContactMessage) => {
      await apiRequest("POST", "/api/contact", data);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: t("contact.success"),
        variant: "default",
      });
      setFormData({ name: "", email: "", subject: "", message: "" });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to send message",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    contactMutation.mutate(formData);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const socialLinks = [
    { icon: Linkedin, href: "https://www.linkedin.com/in/jibreel-bornat-140718330", color: "bg-blue-600 hover:bg-blue-700", label: "LinkedIn" },
    { icon: Github, href: "https://github.com/jibreel1122", color: "bg-gray-800 hover:bg-gray-900", label: "GitHub" },
    { icon: SiFacebook, href: "https://facebook.com/jibreel.e.bornat", color: "bg-blue-700 hover:bg-blue-800", label: "Facebook" },
  ];

  return (
    <section id="contact" className="py-20 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6" data-testid="text-contact-title">
            {t("contact.title")}
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400" data-testid="text-contact-subtitle">
            {t("contact.subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-semibold mb-8" data-testid="text-connect-title">
                {t("contact.connect")}
              </h3>
              
              <div className="space-y-6">
                <div className="glass rounded-xl p-6 premium-shadow">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-primary-500 rounded-full flex items-center justify-center">
                      <Mail className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold">{t("contact.email")}</h4>
                      <a 
                        href="mailto:jibreelebornat@gmail.com"
                        className="text-gray-600 dark:text-gray-400 hover:text-primary-500 transition-colors"
                        data-testid="link-email"
                      >
                        jibreelebornat@gmail.com
                      </a>
                    </div>
                  </div>
                </div>

                <div className="glass rounded-xl p-6 premium-shadow">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-primary-500 rounded-full flex items-center justify-center">
                      <Phone className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold">{t("contact.phone")}</h4>
                      <a 
                        href="tel:+972599765211"
                        className="text-gray-600 dark:text-gray-400 hover:text-primary-500 transition-colors"
                        data-testid="link-phone"
                      >
                        +972 59 976 5211
                      </a>
                    </div>
                  </div>
                </div>

                <div className="glass rounded-xl p-6 premium-shadow">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-primary-500 rounded-full flex items-center justify-center">
                      <MapPin className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold">{t("contact.location")}</h4>
                      <p className="text-gray-600 dark:text-gray-400" data-testid="text-location">
                        {t("contact.location.value")}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Media Links */}
            <div>
              <h4 className="text-xl font-semibold mb-6">{t("contact.follow")}</h4>
              <div className="flex space-x-4">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-12 h-12 ${social.color} text-white rounded-full flex items-center justify-center transition-colors duration-200`}
                    data-testid={`link-social-${social.label.toLowerCase()}`}
                    title={social.label}
                  >
                    <social.icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="glass rounded-2xl p-8 premium-shadow">
            <h3 className="text-2xl font-semibold mb-8" data-testid="text-form-title">
              {t("contact.form.title")}
            </h3>
            
            <form className="space-y-6" onSubmit={handleSubmit} data-testid="form-contact">
              <div>
                <label className="block text-sm font-medium mb-2">
                  {t("contact.form.name")}
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                  placeholder={t("contact.form.name.placeholder")}
                  required
                  data-testid="input-name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  {t("contact.form.email")}
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                  placeholder="your@email.com"
                  required
                  data-testid="input-email"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  {t("contact.form.subject")}
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                  placeholder={t("contact.form.subject.placeholder")}
                  required
                  data-testid="input-subject"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  {t("contact.form.message")}
                </label>
                <textarea
                  rows={5}
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 resize-none"
                  placeholder={t("contact.form.message.placeholder")}
                  required
                  data-testid="textarea-message"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={contactMutation.isPending}
                className="w-full py-4 bg-primary-500 hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-semibold transition-all duration-200 premium-shadow hover:scale-105 flex items-center justify-center gap-2"
                data-testid="button-send"
              >
                {contactMutation.isPending ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    {t("contact.form.send")}
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
