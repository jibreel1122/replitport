import { useEffect, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

interface Page { slug: string; titleEn?: string; titleAr?: string; contentEn?: string; contentAr?: string; }

export default function ProgramsPage() {
	const { language } = useLanguage();
	const [page, setPage] = useState<Page | null>(null);

	useEffect(() => {
		fetch('/api/pages/programs').then(r => r.json()).then(setPage).catch(()=>setPage(null));
	}, []);

	return (
		<div className="container mx-auto px-4 py-10 space-y-8">
			<h1 className="text-3xl font-bold">{language==='en' ? (page?.titleEn || 'Programs') : (page?.titleAr || page?.titleEn || 'البرامج')}</h1>
			<div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: language==='en' ? (page?.contentEn || '') : (page?.contentAr || page?.contentEn || '') }} />
		</div>
	);
}