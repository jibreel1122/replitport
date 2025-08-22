import { useEffect, useState } from "react";
import { useParams } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";

interface Photo { id: string; url: string; captionEn?: string; captionAr?: string; }
interface Album { id: string; nameEn: string; nameAr?: string; photos?: Photo[]; }

export default function AlbumDetail() {
	const params = useParams<{ id: string }>();
	const { language } = useLanguage();
	const [album, setAlbum] = useState<Album | null>(null);
	useEffect(()=>{ fetch(`/api/albums/${params.id}`).then(r=>r.json()).then(setAlbum); }, [params.id]);
	if (!album) return null;
	return (
		<div className="container mx-auto px-4 py-10 space-y-6">
			<h1 className="text-3xl font-bold">{language==='en'?album.nameEn:(album.nameAr||album.nameEn)}</h1>
			<div className="grid md:grid-cols-3 gap-4">
				{album.photos?.map(p => (
					<figure key={p.id} className="rounded-lg overflow-hidden">
						<img src={p.url} className="w-full h-60 object-cover" />
						{(p.captionEn || p.captionAr) && <figcaption className="text-sm text-muted-foreground p-2">{language==='en'?p.captionEn:(p.captionAr||p.captionEn)}</figcaption>}
					</figure>
				))}
			</div>
		</div>
	);
}