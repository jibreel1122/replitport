import { useEffect, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

interface Page { slug: string; titleEn?: string; titleAr?: string; contentEn?: string; contentAr?: string; }

export default function AboutPage() {
	const { language } = useLanguage();
	const [page, setPage] = useState<Page | null>(null);

	useEffect(() => {
		fetch('/api/pages/about').then(r => r.json()).then(setPage).catch(()=>setPage(null));
	}, []);

	return (
		<div className="container mx-auto px-4 py-10 space-y-8">
			<h1 className="text-3xl font-bold">{language==='en' ? (page?.titleEn || 'About Us') : (page?.titleAr || page?.titleEn || 'من نحن')}</h1>
			<div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: language==='en' ? (page?.contentEn || '') : (page?.contentAr || page?.contentEn || '') }} />

			<section className="space-y-6">
				<h2 className="text-2xl font-semibold">{language==='en' ? 'Leadership' : 'القيادة'}</h2>
				<div className="grid md:grid-cols-3 gap-6">
					<div className="glass rounded-xl p-4">
						<h3 className="font-semibold">Emad Burnat</h3>
						<p className="text-sm text-muted-foreground">{language==='en' ? 'Filmmaker, activist from Bil’in.' : 'مخرج وناشط من بلعين.'}</p>
					</div>
					<div className="glass rounded-xl p-4">
						<h3 className="font-semibold">Iyad Burnat</h3>
						<p className="text-sm text-muted-foreground">{language==='en' ? 'Community leader and organizer.' : 'قائد مجتمعي ومنظم.'}</p>
					</div>
					<div className="glass rounded-xl p-4">
						<h3 className="font-semibold">Jibreel Burnat</h3>
						<p className="text-sm text-muted-foreground">{language==='en' ? 'Community advocate and coordinator.' : 'مدافع عن المجتمع ومنسق.'}</p>
					</div>
				</div>
			</section>
		</div>
	);
}