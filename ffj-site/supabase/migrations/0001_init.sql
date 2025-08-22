-- Schema: FFJ content management
create extension if not exists pgcrypto;

-- Users
create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  name text,
  role text not null check (role in ('admin','editor','viewer')) default 'viewer',
  created_at timestamp with time zone default now()
);

-- Posts
create table if not exists posts (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  status text not null check (status in ('draft','published')) default 'draft',
  pinned boolean not null default false,
  published_at timestamp with time zone,
  created_by uuid references users(id) on delete set null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

create table if not exists post_translations (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references posts(id) on delete cascade,
  locale text not null check (locale in ('en','ar')),
  title text not null,
  summary text,
  body jsonb,
  unique (post_id, locale)
);

create table if not exists post_meta (
  post_id uuid primary key references posts(id) on delete cascade,
  cover_image_url text,
  tags text[] default '{}',
  category text
);

-- Projects
create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  status text not null check (status in ('active','completed')) default 'active',
  start_date date,
  end_date date,
  donation_url text,
  location text,
  created_by uuid references users(id) on delete set null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

create table if not exists project_translations (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  locale text not null check (locale in ('en','ar')),
  title text not null,
  description jsonb,
  unique (project_id, locale)
);

create table if not exists project_media (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  image_url text not null,
  caption text,
  taken_at date,
  credit text
);

-- Albums
create table if not exists albums (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  cover_image_url text,
  taken_at date,
  location text,
  created_at timestamp with time zone default now()
);

create table if not exists album_translations (
  id uuid primary key default gen_random_uuid(),
  album_id uuid not null references albums(id) on delete cascade,
  locale text not null check (locale in ('en','ar')),
  title text not null,
  description text,
  unique (album_id, locale)
);

create table if not exists album_images (
  id uuid primary key default gen_random_uuid(),
  album_id uuid not null references albums(id) on delete cascade,
  image_url text not null,
  caption text,
  credit text
);

-- Pages
create table if not exists pages (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null
);

create table if not exists page_translations (
  id uuid primary key default gen_random_uuid(),
  page_id uuid not null references pages(id) on delete cascade,
  locale text not null check (locale in ('en','ar')),
  title text not null,
  body jsonb,
  unique (page_id, locale)
);

-- Contacts
create table if not exists contacts (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  message text not null,
  created_at timestamp with time zone default now()
);

-- Indexes
create unique index if not exists idx_posts_slug on posts(slug);
create unique index if not exists idx_projects_slug on projects(slug);
create unique index if not exists idx_albums_slug on albums(slug);
create index if not exists idx_post_meta_tags_gin on post_meta using gin (tags);

-- RLS: Enable and policies
alter table posts enable row level security;
alter table post_translations enable row level security;
alter table post_meta enable row level security;
alter table projects enable row level security;
alter table project_translations enable row level security;
alter table project_media enable row level security;
alter table albums enable row level security;
alter table album_translations enable row level security;
alter table album_images enable row level security;
alter table pages enable row level security;
alter table page_translations enable row level security;
alter table contacts enable row level security;

-- Helper function to get role from users table by auth.uid()
create or replace function auth_role() returns text language sql stable as $$
  select coalesce((select role from users where id = auth.uid()), 'viewer');
$$;

-- Public read-only for published content
create policy if not exists anon_read_published_posts on posts
for select to anon using (status = 'published');

create policy if not exists anon_read_post_translations on post_translations
for select to anon using (exists (select 1 from posts p where p.id = post_id and p.status = 'published'));

create policy if not exists anon_read_post_meta on post_meta
for select to anon using (exists (select 1 from posts p where p.id = post_id and p.status = 'published'));

create policy if not exists anon_read_projects on projects
for select to anon using (true);

create policy if not exists anon_read_project_translations on project_translations
for select to anon using (true);

create policy if not exists anon_read_project_media on project_media
for select to anon using (true);

create policy if not exists anon_read_albums on albums
for select to anon using (true);

create policy if not exists anon_read_album_translations on album_translations
for select to anon using (true);

create policy if not exists anon_read_album_images on album_images
for select to anon using (true);

create policy if not exists anon_read_pages on pages
for select to anon using (true);

create policy if not exists anon_read_page_translations on page_translations
for select to anon using (true);

-- Contacts: allow insert for anon, no select
create policy if not exists anon_insert_contacts on contacts
for insert to anon with check (true);

-- Authenticated CRUD policies
create policy if not exists auth_read_all_posts on posts for select to authenticated using (true);
create policy if not exists editor_modify_posts on posts for all to authenticated using (
  auth_role() in ('admin','editor')
) with check (auth_role() in ('admin','editor'));

create policy if not exists editor_modify_post_translations on post_translations for all to authenticated using (
  auth_role() in ('admin','editor')
) with check (auth_role() in ('admin','editor'));

create policy if not exists editor_modify_post_meta on post_meta for all to authenticated using (
  auth_role() in ('admin','editor')
) with check (auth_role() in ('admin','editor'));

create policy if not exists editor_modify_projects on projects for all to authenticated using (
  auth_role() in ('admin','editor')
) with check (auth_role() in ('admin','editor'));

create policy if not exists editor_modify_project_translations on project_translations for all to authenticated using (
  auth_role() in ('admin','editor')
) with check (auth_role() in ('admin','editor'));

create policy if not exists editor_modify_project_media on project_media for all to authenticated using (
  auth_role() in ('admin','editor')
) with check (auth_role() in ('admin','editor'));

create policy if not exists editor_modify_albums on albums for all to authenticated using (
  auth_role() in ('admin','editor')
) with check (auth_role() in ('admin','editor'));

create policy if not exists editor_modify_album_translations on album_translations for all to authenticated using (
  auth_role() in ('admin','editor')
) with check (auth_role() in ('admin','editor'));

create policy if not exists editor_modify_album_images on album_images for all to authenticated using (
  auth_role() in ('admin','editor')
) with check (auth_role() in ('admin','editor'));

create policy if not exists editor_modify_pages on pages for all to authenticated using (
  auth_role() in ('admin','editor')
) with check (auth_role() in ('admin','editor'));

create policy if not exists editor_modify_page_translations on page_translations for all to authenticated using (
  auth_role() in ('admin','editor')
) with check (auth_role() in ('admin','editor'));

-- Only admin can manage users
alter table users enable row level security;
create policy if not exists admin_manage_users on users for all to authenticated using (auth_role() = 'admin') with check (auth_role() = 'admin');