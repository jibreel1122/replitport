import { useEffect, useState } from "react";
import { Link } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";

interface Project { id: string; nameEn: string; nameAr?: string; descriptionEn: string; descriptionAr?: string; imageUrl: string; status?: string; progress?: number; }

export default function ProjectsPage() {
	const { language } = useLanguage();
	const [projects, setProjects] = useState<Project[]>([]);
	useEffect(() => { fetch('/api/projects').then(r=>r.json()).then(setProjects); }, []);
	return (
		<div className="container mx-auto px-4 py-10 space-y-6">
			<h1 className="text-3xl font-bold">{language==='en'?'Projects':'المشاريع'}</h1>
			<div className="grid md:grid-cols-3 gap-6">
				{projects.map(p => (
					<div key={p.id} className="glass rounded-xl overflow-hidden">
						<img src={p.imageUrl} className="w-full h-40 object-cover" />
						<div className="p-4">
							<h3 className="font-semibold">{language==='en'?p.nameEn:(p.nameAr||p.nameEn)}</h3>
							<p className="text-sm text-muted-foreground">{language==='en'?p.descriptionEn:(p.descriptionAr||p.descriptionEn)}</p>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}