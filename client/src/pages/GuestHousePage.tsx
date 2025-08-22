import { useEffect, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

interface Page { slug: string; titleEn?: string; titleAr?: string; contentEn?: string; contentAr?: string; }

export default function GuestHousePage() {
	const { language } = useLanguage();
	const [page, setPage] = useState<Page | null>(null);

	useEffect(() => {
		fetch('/api/pages/guest-house').then(r => r.json()).then(setPage).catch(()=>setPage(null));
	}, []);

	return (
		<div className="container mx-auto px-4 py-10 space-y-8">
			<h1 className="text-3xl font-bold">{language==='en' ? (page?.titleEn || 'Guest House') : (page?.titleAr || page?.titleEn || 'بيت الضيافة')}</h1>
			<div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: language==='en' ? (page?.contentEn || '') : (page?.contentAr || page?.contentEn || '') }} />
			<a href="/contact" className="inline-block px-6 py-3 bg-primary-500 text-white rounded-lg">{language==='en'?'Book / Contact':'حجز / تواصل'}</a>
		</div>
	);
}