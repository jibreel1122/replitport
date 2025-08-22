/* FFJ Schema Migration */

-- Enable UUID if not already
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Roles on users
ALTER TABLE IF EXISTS users ADD COLUMN IF NOT EXISTS role VARCHAR DEFAULT 'editor';

-- Extend projects
ALTER TABLE IF EXISTS projects ADD COLUMN IF NOT EXISTS status VARCHAR DEFAULT 'active';
ALTER TABLE IF EXISTS projects ADD COLUMN IF NOT EXISTS progress INTEGER DEFAULT 0;

-- Project images
CREATE TABLE IF NOT EXISTS project_images (
	id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
	project_id VARCHAR NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
	url TEXT NOT NULL,
	caption_en TEXT,
	caption_ar TEXT,
	order_index INTEGER DEFAULT 0,
	created_at TIMESTAMP DEFAULT NOW()
);

-- News
CREATE TABLE IF NOT EXISTS news (
	id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
	slug VARCHAR NOT NULL UNIQUE,
	title_en TEXT NOT NULL,
	title_ar TEXT,
	summary_en TEXT,
	summary_ar TEXT,
	content_en TEXT,
	content_ar TEXT,
	images TEXT[] NOT NULL DEFAULT '{}',
	tags TEXT[] NOT NULL DEFAULT '{}',
	category VARCHAR,
	status VARCHAR DEFAULT 'draft',
	published_at TIMESTAMP,
	created_at TIMESTAMP DEFAULT NOW(),
	updated_at TIMESTAMP DEFAULT NOW()
);

-- Pages
CREATE TABLE IF NOT EXISTS pages (
	id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
	slug VARCHAR NOT NULL UNIQUE,
	title_en TEXT,
	title_ar TEXT,
	content_en TEXT,
	content_ar TEXT,
	status VARCHAR DEFAULT 'published',
	created_at TIMESTAMP DEFAULT NOW(),
	updated_at TIMESTAMP DEFAULT NOW()
);

-- Albums
CREATE TABLE IF NOT EXISTS albums (
	id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
	name_en TEXT NOT NULL,
	name_ar TEXT,
	description_en TEXT,
	description_ar TEXT,
	cover_image_url TEXT,
	created_at TIMESTAMP DEFAULT NOW()
);

-- Photos
CREATE TABLE IF NOT EXISTS photos (
	id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
	album_id VARCHAR NOT NULL REFERENCES albums(id) ON DELETE CASCADE,
	url TEXT NOT NULL,
	caption_en TEXT,
	caption_ar TEXT,
	order_index INTEGER DEFAULT 0,
	created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_news_published_at ON news (published_at DESC);
CREATE INDEX IF NOT EXISTS idx_news_status ON news (status);
CREATE INDEX IF NOT EXISTS idx_albums_created_at ON albums (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_photos_album ON photos (album_id, order_index);

-- RLS enable
ALTER TABLE news ENABLE ROW LEVEL SECURITY;
ALTER TABLE pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE albums ENABLE ROW LEVEL SECURITY;
ALTER TABLE photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_images ENABLE ROW LEVEL SECURITY;

-- Public read policies
CREATE POLICY IF NOT EXISTS "News published are publicly readable"
	ON news FOR SELECT TO public USING (status = 'published');

CREATE POLICY IF NOT EXISTS "Pages are publicly readable"
	ON pages FOR SELECT TO public USING (status = 'published');

CREATE POLICY IF NOT EXISTS "Albums are publicly readable"
	ON albums FOR SELECT TO public USING (true);

CREATE POLICY IF NOT EXISTS "Photos are publicly readable"
	ON photos FOR SELECT TO public USING (true);

CREATE POLICY IF NOT EXISTS "Project images are publicly readable"
	ON project_images FOR SELECT TO public USING (true);

-- Authenticated manage policies
CREATE POLICY IF NOT EXISTS "Authenticated can manage news"
	ON news FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY IF NOT EXISTS "Authenticated can manage pages"
	ON pages FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY IF NOT EXISTS "Authenticated can manage albums"
	ON albums FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY IF NOT EXISTS "Authenticated can manage photos"
	ON photos FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY IF NOT EXISTS "Authenticated can manage project images"
	ON project_images FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Seed content
INSERT INTO pages (slug, title_en, title_ar, content_en, content_ar, status)
VALUES
	('about', 'About FFJ', 'من نحن', 'Friends of Freedom and Justice – Bil’in (FFJ) is a community organization committed to peaceful resistance and community empowerment.', 'جمعية أصدقاء العدالة والحرية – بلعين هي منظمة مجتمعية ملتزمة بالمقاومة السلمية وتمكين المجتمع.', 'published')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO pages (slug, title_en, title_ar, content_en, content_ar, status)
VALUES
	('programs', 'Programs', 'البرامج', 'Delegation program, volunteer opportunities, and summer camp.', 'برنامج الوفود، فرص التطوع، والمعسكر الصيفي.', 'published')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO pages (slug, title_en, title_ar, content_en, content_ar, status)
VALUES
	('guest-house', 'Guest House', 'بيت الضيافة', 'Information about the Bil’in Guest House and how to book.', 'معلومات عن بيت الضيافة في بلعين وكيفية الحجز.', 'published')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO pages (slug, title_en, title_ar, content_en, content_ar, status)
VALUES
	('education-fund', 'Bil’in Education Fund', 'صندوق التعليم في بلعين', 'Support education for Bil’in youth.', 'ادعم التعليم لشباب بلعين.', 'published')
ON CONFLICT (slug) DO NOTHING;

-- Seed sample news
INSERT INTO news (slug, title_en, summary_en, status, published_at)
VALUES
	('hebron-detention', 'Israeli forces detain two 14-year-old Palestinians in Hebron', 'Short summary for Hebron detention', 'published', NOW()),
	('impossible-bail', 'Impossible bail sums for Palestinian family', 'Short summary for impossible bail', 'published', NOW()),
	('bilin-demonstration-2017-03-03', "Bil’in weekly demonstration 3/3/2017", 'Weekly demonstration in Bil’in', 'published', NOW()),
	('12-years-of-resistance', '12 Years of Peaceful Resistance', 'Reflecting on 12 years of peaceful resistance in Bil’in', 'published', NOW()),
	('valentines-raid', 'Valentines Raid', 'Incursion on Valentine''s Day', 'published', NOW())
ON CONFLICT (slug) DO NOTHING;

-- Seed sample album
INSERT INTO albums (name_en, name_ar, description_en, description_ar, cover_image_url)
VALUES ('Friday Demonstrations', 'مظاهرات الجمعة', 'Photos from weekly Friday demonstrations', 'صور من مظاهرات الجمعة الأسبوعية', 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee')
ON CONFLICT DO NOTHING;