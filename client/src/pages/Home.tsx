import { useEffect, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Link } from "wouter";

interface NewsItem { id: string; slug: string; titleEn: string; titleAr?: string; summaryEn?: string; summaryAr?: string; images: string[]; publishedAt?: string; }
interface Project { id: string; nameEn: string; nameAr?: string; descriptionEn: string; descriptionAr?: string; imageUrl: string; isFeatured?: boolean; }
interface Album { id: string; nameEn: string; nameAr?: string; coverImageUrl?: string; }

export default function Home() {
	const { language, isRtl } = useLanguage();
	const [news, setNews] = useState<NewsItem[]>([]);
	const [featured, setFeatured] = useState<Project | null>(null);
	const [albums, setAlbums] = useState<Album[]>([]);

	useEffect(() => {
		fetch('/api/news?limit=3').then(r => r.json()).then(setNews).catch(() => setNews([]));
		fetch('/api/projects').then(r => r.json()).then((rows: Project[]) => {
			const f = rows.find(p => p.isFeatured);
			setFeatured(f || rows[0] || null);
		});
		fetch('/api/albums').then(r => r.json()).then(setAlbums).catch(() => setAlbums([]));
	}, []);

	return (
		<div className="min-h-screen space-y-16">
			<section className="container mx-auto px-4 py-16">
				<div className="grid md:grid-cols-2 gap-8 items-center">
					<div>
						<h1 className="text-4xl md:text-5xl font-extrabold mb-4">Friends of Freedom and Justice – Bil’in</h1>
						<p className="text-lg text-muted-foreground mb-6">{language === 'en' ? 'Community-led peaceful resistance and empowerment in Bil’in, Palestine.' : 'المقاومة السلمية وتمكين المجتمع في بلعين، فلسطين.'}</p>
						<div className="flex gap-3">
							<Link href="/education-fund" className="px-6 py-3 bg-primary-500 text-white rounded-lg">{language === 'en' ? 'Support Education Fund' : 'ادعم صندوق التعليم'}</Link>
							<Link href="/about" className="px-6 py-3 border rounded-lg">{language === 'en' ? 'Learn More' : 'اعرف المزيد'}</Link>
						</div>
					</div>
					<div className="rounded-xl overflow-hidden premium-shadow">
						<img src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee" alt="Bil'in" className="w-full h-72 object-cover" />
					</div>
				</div>
			</section>

			<section className="container mx-auto px-4">
				<h2 className="text-2xl font-bold mb-4">{language === 'en' ? 'Latest News' : 'آخر الأخبار'}</h2>
				<div className="grid md:grid-cols-3 gap-6">
					{news.map(item => (
						<Link key={item.id} href={`/news/${item.slug}`} className="glass rounded-xl overflow-hidden block">
							{item.images?.[0] && <img src={item.images[0]} alt="" className="w-full h-40 object-cover" />}
							<div className="p-4">
								<h3 className="font-semibold mb-2">{language === 'en' ? item.titleEn : (item.titleAr || item.titleEn)}</h3>
								<p className="text-sm text-muted-foreground">{language === 'en' ? (item.summaryEn || '') : (item.summaryAr || item.summaryEn || '')}</p>
							</div>
						</Link>
					))}
				</div>
			</section>

			{featured && (
				<section className="container mx-auto px-4">
					<h2 className="text-2xl font-bold mb-4">{language === 'en' ? 'Featured Project' : 'مشروع مميز'}</h2>
					<div className="grid md:grid-cols-2 gap-6 items-center glass rounded-xl p-6">
						<img src={featured.imageUrl} alt="" className="w-full h-60 object-cover rounded-lg" />
						<div>
							<h3 className="text-xl font-semibold mb-2">{language === 'en' ? featured.nameEn : (featured.nameAr || featured.nameEn)}</h3>
							<p className="text-muted-foreground mb-4">{language === 'en' ? featured.descriptionEn : (featured.descriptionAr || featured.descriptionEn)}</p>
							<Link href="/projects" className="px-5 py-2 bg-primary-500 text-white rounded-lg">{language === 'en' ? 'View Projects' : 'عرض المشاريع'}</Link>
						</div>
					</div>
				</section>
			)}

			<section className="container mx-auto px-4">
				<h2 className="text-2xl font-bold mb-4">{language === 'en' ? 'Photo Highlights' : 'لمحات مصورة'}</h2>
				<div className="grid md:grid-cols-4 gap-4">
					{albums.slice(0,4).map(a => (
						<Link key={a.id} href={`/gallery/${a.id}`} className="rounded-lg overflow-hidden block premium-shadow">
							<img src={a.coverImageUrl || 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee'} alt="" className="w-full h-40 object-cover" />
							<div className="p-2 text-sm font-medium">{language === 'en' ? a.nameEn : (a.nameAr || a.nameEn)}</div>
						</Link>
					))}
				</div>
			</section>
		</div>
	);
}