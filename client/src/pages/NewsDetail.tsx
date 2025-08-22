import { useEffect, useState } from "react";
import { useParams } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";

interface Article { id: string; slug: string; titleEn: string; titleAr?: string; contentEn?: string; contentAr?: string; images: string[]; publishedAt?: string; }

export default function NewsDetail() {
	const params = useParams<{ slug: string }>();
	const { language } = useLanguage();
	const [article, setArticle] = useState<Article | null>(null);

	useEffect(() => {
		fetch(`/api/news/${params.slug}`).then(r => r.json()).then(setArticle);
	}, [params.slug]);

	if (!article) return null;

	const title = language==='en' ? article.titleEn : (article.titleAr || article.titleEn);
	const content = language==='en' ? (article.contentEn || '') : (article.contentAr || article.contentEn || '');
	const shareUrl = typeof window !== 'undefined' ? window.location.href : '';

	return (
		<div className="container mx-auto px-4 py-10 space-y-6">
			<h1 className="text-3xl font-bold">{title}</h1>
			{article.images?.length > 0 && (
				<div className="grid md:grid-cols-3 gap-4">
					{article.images.map((url, idx) => (
						<img key={idx} src={url} className="rounded-lg w-full h-56 object-cover" />
					))}
				</div>
			)}
			<div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: content }} />
			<div className="flex gap-3">
				<a className="px-4 py-2 border rounded" target="_blank" href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(title)}`}>Twitter</a>
				<a className="px-4 py-2 border rounded" target="_blank" href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}>Facebook</a>
			</div>
		</div>
	);
}