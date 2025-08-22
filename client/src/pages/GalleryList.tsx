import { useEffect, useState } from "react";
import { Link } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";

interface Album { id: string; nameEn: string; nameAr?: string; coverImageUrl?: string; }

export default function GalleryList() {
	const { language } = useLanguage();
	const [albums, setAlbums] = useState<Album[]>([]);
	useEffect(()=>{ fetch('/api/albums').then(r=>r.json()).then(setAlbums); }, []);
	return (
		<div className="container mx-auto px-4 py-10 space-y-6">
			<h1 className="text-3xl font-bold">{language==='en'?'Gallery':'المعرض'}</h1>
			<div className="grid md:grid-cols-4 gap-4">
				{albums.map(a => (
					<Link key={a.id} href={`/gallery/${a.id}`} className="block rounded-lg overflow-hidden premium-shadow">
						<img src={a.coverImageUrl || 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee'} className="w-full h-40 object-cover" />
						<div className="p-2 text-sm font-medium">{language==='en'?a.nameEn:(a.nameAr||a.nameEn)}</div>
					</Link>
				))}
			</div>
		</div>
	);
}