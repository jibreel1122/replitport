import { useState } from "react";
import AdminPanel from "@/components/AdminPanel";

export default function AdminDashboard() {
	const [open, setOpen] = useState(true);
	return (
		<div className="container mx-auto px-4 py-10">
			<h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
			<p className="text-muted-foreground mb-6">Manage content: projects, news, pages, galleries.</p>
			<button onClick={()=>setOpen(true)} className="px-4 py-2 bg-primary-500 text-white rounded">Open Projects Manager</button>
			<AdminPanel isOpen={open} onClose={()=>setOpen(false)} />
		</div>
	);
}