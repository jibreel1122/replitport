import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { useAuth } from "@/hooks/useAuth";
import Portfolio from "@/pages/Portfolio";
import Landing from "@/pages/Landing";
import NotFound from "@/pages/not-found";
import FloatingCodeWords from "@/components/FloatingCodeWords";
import Home from "@/pages/Home";
import AboutPage from "@/pages/AboutPage";
import ProgramsPage from "@/pages/ProgramsPage";
import GuestHousePage from "@/pages/GuestHousePage";
import EducationFundPage from "@/pages/EducationFundPage";
import NewsList from "@/pages/NewsList";
import NewsDetail from "@/pages/NewsDetail";
import ProjectsPage from "@/pages/ProjectsPage";
import GalleryList from "@/pages/GalleryList";
import AlbumDetail from "@/pages/AlbumDetail";
import ContactPage from "@/pages/ContactPage";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="relative">
      <FloatingCodeWords />
      <div className="relative z-10">
        <Switch>
          <Route path="/" component={Portfolio} />
          <Route path="/home" component={Home} />
          <Route path="/about" component={AboutPage} />
          <Route path="/programs" component={ProgramsPage} />
          <Route path="/guest-house" component={GuestHousePage} />
          <Route path="/education-fund" component={EducationFundPage} />
          <Route path="/news" component={NewsList} />
          <Route path="/news/:slug" component={NewsDetail} />
          <Route path="/projects" component={ProjectsPage} />
          <Route path="/gallery" component={GalleryList} />
          <Route path="/gallery/:id" component={AlbumDetail} />
          <Route path="/contact" component={ContactPage} />
          <Route path="/admin" component={AdminDashboard} />
          <Route component={NotFound} />
        </Switch>
      </div>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <LanguageProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </LanguageProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
