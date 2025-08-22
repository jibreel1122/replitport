import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";

interface NewsItem { id: string; slug: string; titleEn: string; titleAr?: string; summaryEn?: string; summaryAr?: string; tags: string[]; category?: string; publishedAt?: string; }

export default function NewsList() {
	const { language } = useLanguage();
	const [items, setItems] = useState<NewsItem[]>([]);
	const [q, setQ] = useState("");
	const [category, setCategory] = useState("");
	const [year, setYear] = useState("");
	const [tags, setTags] = useState<string>("");
	const [location, setLocation] = useLocation();

	useEffect(() => {
		const params = new URLSearchParams();
		if (q) params.set('q', q);
		if (category) params.set('category', category);
		if (year) params.set('year', year);
		if (tags) params.set('tags', tags);
		const qs = params.toString();
		fetch(`/api/news${qs ? `?${qs}` : ''}`).then(r => r.json()).then(setItems);
	}, [q, category, year, tags]);

	const years = useMemo(() => {
		const set = new Set<string>();
		items.forEach(i => { if (i.publishedAt) set.add(String(new Date(i.publishedAt).getFullYear())); });
		return Array.from(set).sort((a,b) => Number(b)-Number(a));
	}, [items]);

	return (
		<div className="container mx-auto px-4 py-10 space-y-6">
			<h1 className="text-3xl font-bold">{language === 'en' ? 'News' : 'الأخبار'}</h1>
			<div className="grid md:grid-cols-4 gap-4">
				<input className="border rounded px-3 py-2" placeholder={language==='en'?'Search':'بحث'} value={q} onChange={e=>setQ(e.target.value)} />
				<input className="border rounded px-3 py-2" placeholder={language==='en'?'Category':'فئة'} value={category} onChange={e=>setCategory(e.target.value)} />
				<select className="border rounded px-3 py-2" value={year} onChange={e=>setYear(e.target.value)}>
					<option value="">{language==='en'?'All years':'كل السنوات'}</option>
					{years.map(y=> <option key={y} value={y}>{y}</option>)}
				</select>
				<input className="border rounded px-3 py-2" placeholder={language==='en'?'Tags (comma separated)':'وسوم (افصل بفواصل)'} value={tags} onChange={e=>setTags(e.target.value)} />
			</div>
			<div className="grid md:grid-cols-3 gap-6">
				{items.map(item => (
					<Link key={item.id} href={`/news/${item.slug}`} className="block glass rounded-xl p-4">
						<h3 className="font-semibold mb-2">{language==='en'? item.titleEn : (item.titleAr || item.titleEn)}</h3>
						<p className="text-sm text-muted-foreground">{language==='en' ? (item.summaryEn || '') : (item.summaryAr || item.summaryEn || '')}</p>
					</Link>
				))}
			</div>
		</div>
	);
}