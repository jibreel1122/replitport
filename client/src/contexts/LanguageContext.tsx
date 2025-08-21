import { createContext, useContext, useEffect, useState } from "react";

type Language = "en" | "ar";

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  isRtl: boolean;
}

const translations = {
  en: {
    // Navigation
    "nav.home": "Home",
    "nav.about": "About",
    "nav.skills": "Skills",
    "nav.projects": "Projects",
    "nav.contact": "Contact",
    "nav.language": "عربي",
    
    // Hero
    "hero.greeting": "Hello, I'm",
    "hero.name": "Jibreel Bornat",
    "hero.title": "Computer Engineering Student at Birzeit University",
    "hero.description": "Passionate about creating innovative digital solutions and learning cutting-edge technologies to build exceptional web experiences.",
    "hero.contact": "Get In Touch",
    "hero.work": "View My Work",
    
    // About
    "about.title": "About Me",
    "about.subtitle": "Passionate about creating digital solutions that make a difference",
    "about.section.title": "Computer Engineering Student",
    "about.section.description": "Born and raised in Ramallah - Billin, Palestine, I bring a unique perspective to the world of technology. Currently studying Computer Engineering at Birzeit University, my journey is driven by a passion for innovation and a desire to create meaningful digital experiences.",
    "about.section.description2": "I specialize in building modern web applications using cutting-edge technologies. I believe in writing clean, maintainable code and creating user interfaces that are both beautiful and functional.",
    "about.technologies": "Core Technologies",
    "about.expertise.web": "Web Development",
    "about.expertise.web.desc": "Building modern web applications with cutting-edge technologies",
    "about.expertise.ui": "UI/UX Design",
    "about.expertise.ui.desc": "Creating intuitive and beautiful user interfaces",
    "about.expertise.problem": "Problem Solving",
    "about.expertise.problem.desc": "Analytical thinking and creative solutions",
    "about.expertise.global": "Global Perspective", 
    "about.expertise.global.desc": "Palestinian student bringing diverse insights",
    "about.stats": "Professional Stats",
    
    // Skills
    "skills.title": "Programming Languages",
    "skills.subtitle": "Core technologies I work with",
    
    // Projects
    "projects.title": "Featured Projects",
    "projects.subtitle": "A showcase of my latest work and technical achievements",
    "projects.filter.all": "All Projects",
    "projects.filter.featured": "Featured",
    "projects.demo": "Live Demo",
    "projects.featured": "Featured",
    
    // Contact
    "contact.title": "Get In Touch",
    "contact.subtitle": "Ready to bring your ideas to life? Let's discuss your next project",
    "contact.connect": "Let's Connect",
    "contact.email": "Email",
    "contact.phone": "Phone",
    "contact.location": "Location",
    "contact.location.value": "Ramallah - Billin, Palestine",
    "contact.follow": "Follow Me",
    "contact.form.title": "Send a Message",
    "contact.form.name": "Name *",
    "contact.form.name.placeholder": "Your full name",
    "contact.form.email": "Email *",
    "contact.form.subject": "Subject *",
    "contact.form.subject.placeholder": "Project discussion, collaboration, etc.",
    "contact.form.message": "Message *",
    "contact.form.message.placeholder": "Tell me about your project, timeline, and requirements...",
    "contact.form.send": "Send Message",
    "contact.success": "Your message has been sent successfully!",
    
    // Footer
    "footer.description": "Palestinian Computer Engineer crafting exceptional digital experiences",
    "footer.links": "Quick Links",
    "footer.made": "Made with",
    "footer.in": "in Palestine",
    "footer.rights": "© 2025 Jibreel Bornat. All rights reserved.",
    
    // Admin
    "admin.title": "Admin Panel - Project Management",
    "admin.add": "Add New Project",
    "admin.manage": "Manage Existing Projects",
    "admin.name": "Project Name",
    "admin.name.ar": "Project Name (Arabic)",
    "admin.description": "Description",
    "admin.description.ar": "Description (Arabic)",
    "admin.image": "Image URL",
    "admin.demo": "Demo URL",
    "admin.technologies": "Technologies (comma-separated)",
    "admin.featured": "Featured Project",
    "admin.add.button": "Add Project",
    "admin.edit": "Edit",
    "admin.delete": "Delete",
    "admin.success": "Project added successfully!",
    
    // Common
    "loading": "Loading...",
    "error": "Something went wrong",
    "unauthorized": "You are logged out. Logging in again...",
  },
  ar: {
    // Navigation
    "nav.home": "الرئيسية",
    "nav.about": "حول",
    "nav.skills": "المهارات",
    "nav.projects": "المشاريع",
    "nav.contact": "اتصال",
    "nav.language": "English",
    
    // Hero
    "hero.greeting": "مرحباً، أنا",
    "hero.name": "جبريل برناط",
    "hero.title": "طالب هندسة حاسوب في جامعة بيرزيت",
    "hero.description": "شغوف بإنشاء حلول رقمية مبتكرة وتعلم التقنيات الحديثة لبناء تجارب ويب استثنائية.",
    "hero.contact": "تواصل معي",
    "hero.work": "عرض أعمالي",
    
    // About
    "about.title": "عني",
    "about.subtitle": "شغوف بإنشاء الحلول الرقمية التي تحدث فرقاً",
    "about.section.title": "طالب هندسة حاسوب",
    "about.section.description": "وُلدت ونشأت في رام الله - بلين، فلسطين، وأجلب منظوراً فريداً لعالم التكنولوجيا. أدرس حالياً هندسة الحاسوب في جامعة بيرزيت، وتقودني رحلتي شغف بالابتكار ورغبة في إنشاء تجارب رقمية ذات معنى.",
    "about.section.description2": "أتخصص في بناء تطبيقات الويب الحديثة باستخدام أحدث التقنيات. أؤمن بكتابة كود نظيف وقابل للصيانة وإنشاء واجهات مستخدم جميلة ووظيفية.",
    "about.technologies": "التقنيات الأساسية",
    "about.expertise.web": "تطوير الويب",
    "about.expertise.web.desc": "بناء تطبيقات ويب حديثة بأحدث التقنيات",
    "about.expertise.ui": "تصميم واجهات",
    "about.expertise.ui.desc": "إنشاء واجهات مستخدم بديهية وجميلة",
    "about.expertise.problem": "حل المشاكل",
    "about.expertise.problem.desc": "تفكير تحليلي وحلول إبداعية",
    "about.expertise.global": "منظور عالمي", 
    "about.expertise.global.desc": "طالب فلسطيني يجلب رؤى متنوعة",
    "about.stats": "الإحصائيات المهنية",
    
    // Skills
    "skills.title": "لغات البرمجة",
    "skills.subtitle": "التقنيات الأساسية التي أعمل بها",
    
    // Projects
    "projects.title": "المشاريع المميزة",
    "projects.subtitle": "عرض لأحدث أعمالي وإنجازاتي التقنية",
    "projects.filter.all": "جميع المشاريع",
    "projects.filter.featured": "مميز",
    "projects.demo": "عرض مباشر",
    "projects.featured": "مميز",
    
    // Contact
    "contact.title": "تواصل معي",
    "contact.subtitle": "مستعد لتحويل أفكارك إلى واقع؟ دعنا نناقش مشروعك القادم",
    "contact.connect": "دعنا نتواصل",
    "contact.email": "البريد الإلكتروني",
    "contact.phone": "الهاتف",
    "contact.location": "الموقع",
    "contact.location.value": "رام الله - بلين، فلسطين",
    "contact.follow": "تابعني",
    "contact.form.title": "إرسال رسالة",
    "contact.form.name": "الاسم *",
    "contact.form.name.placeholder": "اسمك الكامل",
    "contact.form.email": "البريد الإلكتروني *",
    "contact.form.subject": "الموضوع *",
    "contact.form.subject.placeholder": "مناقشة مشروع، تعاون، إلخ",
    "contact.form.message": "الرسالة *",
    "contact.form.message.placeholder": "أخبرني عن مشروعك والجدول الزمني والمتطلبات...",
    "contact.form.send": "إرسال الرسالة",
    "contact.success": "تم إرسال رسالتك بنجاح!",
    
    // Footer
    "footer.description": "مهندس حاسوب فلسطيني يصنع تجارب رقمية استثنائية",
    "footer.links": "روابط سريعة",
    "footer.made": "صنع بـ",
    "footer.in": "في فلسطين",
    "footer.rights": "© 2025 جبريل برنات. جميع الحقوق محفوظة.",
    
    // Admin
    "admin.title": "لوحة الإدارة - إدارة المشاريع",
    "admin.add": "إضافة مشروع جديد",
    "admin.manage": "إدارة المشاريع الحالية",
    "admin.name": "اسم المشروع",
    "admin.name.ar": "اسم المشروع (عربي)",
    "admin.description": "الوصف",
    "admin.description.ar": "الوصف (عربي)",
    "admin.image": "رابط الصورة",
    "admin.demo": "رابط العرض",
    "admin.technologies": "التقنيات (مفصولة بفواصل)",
    "admin.featured": "مشروع مميز",
    "admin.add.button": "إضافة مشروع",
    "admin.edit": "تعديل",
    "admin.delete": "حذف",
    "admin.success": "تم إضافة المشروع بنجاح!",
    
    // Common
    "loading": "جاري التحميل...",
    "error": "حدث خطأ ما",
    "unauthorized": "تم تسجيل خروجك. جاري تسجيل الدخول مرة أخرى...",
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("language") as Language) || "en";
    }
    return "en";
  });

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute("dir", language === "ar" ? "rtl" : "ltr");
    root.setAttribute("lang", language);
    document.body.classList.toggle("rtl", language === "ar");
    localStorage.setItem("language", language);
  }, [language]);

  const setLanguage = (newLanguage: Language) => {
    setLanguageState(newLanguage);
  };

  const toggleLanguage = () => {
    setLanguageState(prev => prev === "en" ? "ar" : "en");
  };

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations[typeof language]] || key;
  };

  const isRtl = language === "ar";

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, setLanguage, t, isRtl }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
