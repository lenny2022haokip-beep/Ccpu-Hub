-- Lamka Hub: Supabase PostgreSQL Database Schema
-- Multi-Tribal Community Platform (Churachandpur / Lamka)
-- Migration: 20260811000000_init_lamka_hub_schema.sql

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- -------------------------------------------------------------
-- ENUM TYPES
-- -------------------------------------------------------------
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('BUYER', 'ARTISAN', 'EMPLOYER', 'WARD_ADMIN', 'SUPER_ADMIN');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE product_category AS ENUM ('SHAWL', 'PUAN', 'WRAP', 'ACCESSORY');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE job_type AS ENUM ('FULL_TIME', 'PART_TIME', 'FREELANCE', 'GIG', 'CONTRACT');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE application_status AS ENUM ('SUBMITTED', 'REVIEWED', 'SHORTLISTED', 'HIRED', 'REJECTED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE notice_category AS ENUM ('UTILITY', 'CIVIC', 'FESTIVAL', 'HEALTH', 'GENERAL');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE inquiry_channel AS ENUM ('WHATSAPP', 'DIRECT_CALL', 'WEB_FORM');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE inquiry_status AS ENUM ('INITIATED', 'CONTACTED', 'COMPLETED', 'CANCELLED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- -------------------------------------------------------------
-- TABLES
-- -------------------------------------------------------------

-- 1. Tribes Reference Table
CREATE TABLE IF NOT EXISTS tribes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    badge_color VARCHAR(30) DEFAULT '#171512',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Users Table (WhatsApp Phone Auth)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    phone_number VARCHAR(20) UNIQUE NOT NULL,
    full_name VARCHAR(100),
    role user_role DEFAULT 'BUYER',
    tribe_id UUID REFERENCES tribes(id) ON DELETE SET NULL,
    ward_name VARCHAR(100),
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. WhatsApp OTP Auth Sessions
CREATE TABLE IF NOT EXISTS whatsapp_otps (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    phone_number VARCHAR(20) NOT NULL,
    otp_code VARCHAR(10) NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Artisan Collectives / SHGs
CREATE TABLE IF NOT EXISTS artisan_groups (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(120) NOT NULL,
    leader_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    location_ward VARCHAR(100) NOT NULL,
    contact_phone VARCHAR(20) NOT NULL,
    whatsapp_number VARCHAR(20),
    description TEXT,
    monogram VARCHAR(10) DEFAULT 'SHG',
    monogram_bg VARCHAR(20) DEFAULT '#B23A2D',
    is_verified BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Handloom Products Marketplace
CREATE TABLE IF NOT EXISTS handloom_products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(150) NOT NULL,
    slug VARCHAR(180) UNIQUE NOT NULL,
    tribe_id UUID REFERENCES tribes(id) ON DELETE RESTRICT,
    artisan_group_id UUID REFERENCES artisan_groups(id) ON DELETE SET NULL,
    category product_category NOT NULL,
    price_inr NUMERIC(10, 2) NOT NULL,
    swatch_svg TEXT,
    swatch_image_url TEXT,
    weave_technique VARCHAR(100) DEFAULT 'Backstrap Loin Loom',
    material VARCHAR(100) DEFAULT 'Fine Cotton & Silk Thread',
    weaver_name VARCHAR(100) NOT NULL,
    location_ward VARCHAR(100) NOT NULL,
    contact_phone VARCHAR(20) NOT NULL,
    in_stock BOOLEAN DEFAULT TRUE,
    featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Product Motif Heritage Stories
CREATE TABLE IF NOT EXISTS product_stories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID UNIQUE REFERENCES handloom_products(id) ON DELETE CASCADE,
    motif_name VARCHAR(120) NOT NULL,
    heritage_history TEXT NOT NULL,
    cultural_significance TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Orders & Contact Inquiries Logging
CREATE TABLE IF NOT EXISTS orders_inquiries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES handloom_products(id) ON DELETE SET NULL,
    buyer_name VARCHAR(100),
    buyer_phone VARCHAR(20),
    channel inquiry_channel DEFAULT 'WHATSAPP',
    status inquiry_status DEFAULT 'INITIATED',
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Directory Categories
CREATE TABLE IF NOT EXISTS directory_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(80) UNIQUE NOT NULL,
    icon VARCHAR(40) DEFAULT 'building',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Directory Listings
CREATE TABLE IF NOT EXISTS directory_listings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(150) NOT NULL,
    category_id UUID REFERENCES directory_categories(id) ON DELETE CASCADE,
    owner_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    short_description TEXT NOT NULL,
    phone VARCHAR(30) NOT NULL,
    emergency_helpline VARCHAR(30),
    location_ward VARCHAR(100) NOT NULL,
    address TEXT,
    logo_monogram VARCHAR(10) DEFAULT 'HUB',
    monogram_bg VARCHAR(20) DEFAULT '#171512',
    is_emergency BOOLEAN DEFAULT FALSE,
    is_verified BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. Job Postings
CREATE TABLE IF NOT EXISTS job_postings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(150) NOT NULL,
    company_name VARCHAR(150) NOT NULL,
    employer_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    location_ward VARCHAR(100) NOT NULL,
    job_type job_type DEFAULT 'FULL_TIME',
    salary_range VARCHAR(80),
    description TEXT NOT NULL,
    requirements TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. Job Applications
CREATE TABLE IF NOT EXISTS job_applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    job_id UUID REFERENCES job_postings(id) ON DELETE CASCADE,
    applicant_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    experience_bio TEXT,
    resume_url TEXT,
    status application_status DEFAULT 'SUBMITTED',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. Town Notices
CREATE TABLE IF NOT EXISTS town_notices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(200) NOT NULL,
    category notice_category DEFAULT 'GENERAL',
    content TEXT NOT NULL,
    posted_by VARCHAR(100) NOT NULL,
    ward_scope VARCHAR(100) DEFAULT 'All Wards',
    pin_color VARCHAR(30) DEFAULT '#B23A2D',
    is_pinned BOOLEAN DEFAULT FALSE,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. News Ticker Headlines
CREATE TABLE IF NOT EXISTS news_ticker_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    headline VARCHAR(255) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    priority INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- -------------------------------------------------------------
-- INDEXES
-- -------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_products_tribe ON handloom_products(tribe_id);
CREATE INDEX IF NOT EXISTS idx_products_category ON handloom_products(category);
CREATE INDEX IF NOT EXISTS idx_directory_category ON directory_listings(category_id);
CREATE INDEX IF NOT EXISTS idx_directory_ward ON directory_listings(location_ward);
CREATE INDEX IF NOT EXISTS idx_jobs_active ON job_postings(is_active);
CREATE INDEX IF NOT EXISTS idx_notices_pinned ON town_notices(is_pinned, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_otps_phone ON whatsapp_otps(phone_number, expires_at);

-- -------------------------------------------------------------
-- ROW LEVEL SECURITY (RLS) POLICIES
-- -------------------------------------------------------------
ALTER TABLE tribes ENABLE ROW LEVEL SECURITY;
ALTER TABLE handloom_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE directory_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_postings ENABLE ROW LEVEL SECURITY;
ALTER TABLE town_notices ENABLE ROW LEVEL SECURITY;
ALTER TABLE news_ticker_items ENABLE ROW LEVEL SECURITY;

-- Public read access for consumer-facing features
CREATE POLICY "Public read tribes" ON tribes FOR SELECT USING (true);
CREATE POLICY "Public read products" ON handloom_products FOR SELECT USING (true);
CREATE POLICY "Public read product stories" ON product_stories FOR SELECT USING (true);
CREATE POLICY "Public read directory" ON directory_listings FOR SELECT USING (true);
CREATE POLICY "Public read jobs" ON job_postings FOR SELECT USING (true);
CREATE POLICY "Public read town notices" ON town_notices FOR SELECT USING (true);
CREATE POLICY "Public read news ticker" ON news_ticker_items FOR SELECT USING (true);

-- -------------------------------------------------------------
-- SEED DATA FOR LAMKA HUB (Churachandpur District)
-- -------------------------------------------------------------

-- Seed 9 Tribal Communities
INSERT INTO tribes (id, name, description, badge_color) VALUES
('b1000000-0000-0000-0000-000000000001', 'Kuki', 'Traditional diamond Saipikhup and honorific Thangsuo weaving traditions', '#B23A2D'),
('b1000000-0000-0000-0000-000000000002', 'Paite', 'Iconic Puandum ceremonial drapes with tri-color vertical stripes', '#2B3A55'),
('b1000000-0000-0000-0000-000000000003', 'Hmar', 'Bold Hmar Am tri-color rectangular weave block motifs', '#3F5C48'),
('b1000000-0000-0000-0000-000000000004', 'Vaiphei', 'Khiangte Puan featuring delicate gold thread line work', '#5c3f4e'),
('b1000000-0000-0000-0000-000000000005', 'Zou', 'Zou Highland Blue drapes with emerald and crimson stripes', '#2a4d5c'),
('b1000000-0000-0000-0000-000000000006', 'Gangte', 'Gangte Puanchei festive patterns with crisp borders', '#8C2C21'),
('b1000000-0000-0000-0000-000000000007', 'Simte', 'Simte Puanchei traditional wear woven with gold zari edges', '#D9A441'),
('b1000000-0000-0000-0000-000000000008', 'Tedim Chin', 'Tangcip Puan diamond lattice weaves with golden center motifs', '#2B3A55'),
('b1000000-0000-0000-0000-000000000009', 'Kom', 'Kom Puan zig-zag border drapes on deep red canvas', '#8C2C21')
ON CONFLICT (name) DO NOTHING;

-- Seed Artisan SHGs
INSERT INTO artisan_groups (id, name, location_ward, contact_phone, whatsapp_number, description, monogram, monogram_bg) VALUES
('a1000000-0000-0000-0000-000000000001', 'Saipikhup Artisan Circle', 'Hiangtam Lamka', '+919862000001', '+919862000001', 'Cooperative producing authentic Kuki Saipikhup diamond shawls and custom handloom drapes.', 'KS', '#B23A2D'),
('a1000000-0000-0000-0000-000000000002', 'Thangzam Weavers Group', 'New Lamka', '+919862000002', '+919862000002', 'Traditional handloom weaving unit specializing in Zo Puan, Thangsuo shawls, and festive wear.', 'TW', '#2B3A55')
ON CONFLICT DO NOTHING;

-- Seed Handloom Products
INSERT INTO handloom_products (id, title, slug, tribe_id, artisan_group_id, category, price_inr, weave_technique, material, weaver_name, location_ward, contact_phone, featured) VALUES
('c1000000-0000-0000-0000-000000000001', 'Kuki Saipikhup Shawl', 'kuki-saipikhup-shawl', 'b1000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000001', 'SHAWL', 3800.00, 'Backstrap Loin Loom', 'Cotton & Golden Zari Thread', 'Saipikhup Artisan Circle', 'Hiangtam Lamka', '+919862000001', true),
('c1000000-0000-0000-0000-000000000002', 'Kuki Thangsuo Shawl', 'kuki-thangsuo-shawl', 'b1000000-0000-0000-0000-000000000001', NULL, 'SHAWL', 4200.00, 'Frame Loom', 'Pure Cotton & Crimson Thread', 'Haokip Handloom Co-op', 'Tuibong', '+919862000002', true),
('c1000000-0000-0000-0000-000000000003', 'Khamtang Puan (Ponmong)', 'khamtang-puan', 'b1000000-0000-0000-0000-000000000001', NULL, 'PUAN', 2900.00, 'Backstrap Loin Loom', 'Fine Indigo Cotton', 'Kuki Women SHG', 'New Lamka', '+919862000003', false),
('c1000000-0000-0000-0000-000000000004', 'Kuki Del Puan Wrap', 'kuki-del-puan-wrap', 'b1000000-0000-0000-0000-000000000001', NULL, 'WRAP', 2450.00, 'Loin Loom', 'Mercerized Cotton', 'Independent Weaver', 'Kangvai', '+919862000004', false),
('c1000000-0000-0000-0000-000000000005', 'Paite Puandum Puan', 'paite-puandum-puan', 'b1000000-0000-0000-0000-000000000002', NULL, 'PUAN', 3400.00, 'Loin Loom', 'Navy, Crimson & Emerald Thread', 'Guite Weaving Society', 'Hiangtam Lamka', '+919862000005', true),
('c1000000-0000-0000-0000-000000000006', 'Hmar Am Shawl', 'hmar-am-shawl', 'b1000000-0000-0000-0000-000000000003', NULL, 'SHAWL', 3650.00, 'Frame Loom', 'Tri-Color Cotton Block Weave', 'Hmar Artisan Collective', 'Rengkai', '+919862000007', true),
('c1000000-0000-0000-0000-000000000007', 'Vaiphei Khiangte Puan', 'vaiphei-khiangte-puan', 'b1000000-0000-0000-0000-000000000004', NULL, 'PUAN', 3200.00, 'Loin Loom', 'Crimson Canvas & Gold Zari', 'Vaiphei Handloom Group', 'Tuibong', '+919862000009', false),
('c1000000-0000-0000-0000-000000000008', 'Zou Puan (Highland Blue)', 'zou-puan', 'b1000000-0000-0000-0000-000000000005', NULL, 'PUAN', 2950.00, 'Loin Loom', 'Highland Blue & Red Accents', 'Zou Loom Co-op', 'New Lamka', '+919862000010', false)
ON CONFLICT (slug) DO NOTHING;

-- Seed Product Stories
INSERT INTO product_stories (product_id, motif_name, heritage_history, cultural_significance) VALUES
('c1000000-0000-0000-0000-000000000001', 'Quail-Footprint Diamond Pattern', 'The iconic Saipikhup shawl represents the quail-footprint diamond pattern, a revered symbol of resilience, agility, and ancestral honor in Kuki tradition.', 'Handwoven on backstrap loin looms using fine cotton and golden thread accents for major social and cultural ceremonies.'),
('c1000000-0000-0000-0000-000000000002', 'Honorific Crimson & Gold Bands', 'The Thangsuo shawl is a high-status honorific weave featuring prominent horizontal crimson, yellow, black, and white bands.', 'Traditionally presented to community achievers, leaders, and elders in recognition of honor and service.'),
('c1000000-0000-0000-0000-000000000005', 'Ceremonial Tri-Color Vertical Stripes', 'Puandum features vertical bands of red, green, and yellow on a deep navy canvas.', 'Worn on formal occasions and cultural observances by Paite & Zomi communities.'),
('c1000000-0000-0000-0000-000000000006', 'Rectangular Heritage Tri-Color Blocks', 'Hmar Am is a bold tri-color shawl composed of red, black, and white rectangular block motifs.', 'Symbolizes unity and strength across Hmar clans.')
ON CONFLICT (product_id) DO NOTHING;

-- Seed Directory Categories
INSERT INTO directory_categories (id, name, icon) VALUES
('d1000000-0000-0000-0000-000000000001', 'Artisan & Weaving SHGs', 'palette'),
('d1000000-0000-0000-0000-000000000002', 'Healthcare & Clinics', 'first-aid'),
('d1000000-0000-0000-0000-000000000003', 'Yarn & Material Suppliers', 'shopping-bag'),
('d1000000-0000-0000-0000-000000000004', 'Vehicle Rentals & Freight', 'truck')
ON CONFLICT (name) DO NOTHING;

-- Seed Directory Listings
INSERT INTO directory_listings (id, title, category_id, short_description, phone, emergency_helpline, location_ward, logo_monogram, monogram_bg, is_emergency) VALUES
('e1000000-0000-0000-0000-000000000001', 'Saipikhup Artisans & Weavers SHG', 'd1000000-0000-0000-0000-000000000001', 'Cooperative producing authentic Kuki Saipikhup diamond shawls and custom handloom drapes.', '+91 98620 00001', NULL, 'Hiangtam Lamka', 'KS', '#B23A2D', false),
('e1000000-0000-0000-0000-000000000002', 'Thangzam Weavers Group', 'd1000000-0000-0000-0000-000000000001', 'Traditional handloom weaving unit specializing in Zo Puan, Thangsuo shawls, and festive wear.', '+91 98620 00002', NULL, 'New Lamka', 'TW', '#2B3A55', false),
('e1000000-0000-0000-0000-000000000003', 'District Hospital Churachandpur', 'd1000000-0000-0000-0000-000000000002', 'Primary district healthcare center with 24/7 emergency care, pediatric OPD, and ambulance services.', '03874-233855', '102', 'IB Road, Lamka', 'DH', '#3F5C48', true),
('e1000000-0000-0000-0000-000000000004', 'Sielmat Family Clinic & Pharmacy', 'd1000000-0000-0000-0000-000000000002', 'General healthcare, diagnostic services, maternal care, and weekend community health camps.', '03874-233990', NULL, 'Sielmat Main Road', 'SP', '#D9A441', false)
ON CONFLICT DO NOTHING;

-- Seed Job Postings
INSERT INTO job_postings (id, title, company_name, location_ward, job_type, salary_range, description, requirements) VALUES
('f1000000-0000-0000-0000-000000000001', 'Loom Supervisor & Master Weaver', 'Saipikhup Artisans SHG', 'Hiangtam Lamka', 'FULL_TIME', '₹14,000–18,000 / mo', 'Supervise daily production of traditional Kuki Saipikhup and Thangsuo shawls on backstrap and frame looms.', 'Minimum 5 years experience in traditional loin loom weaving & motif design'),
('f1000000-0000-0000-0000-000000000002', 'Handloom Product Photography (Freelance)', 'Thangzam Weavers Group', 'New Lamka', 'FREELANCE', 'Per-session rate', 'Photograph authentic handwoven shawls and drapes for the online catalog. 2–3 sessions per month.', 'Must possess camera gear and experience with textile photography')
ON CONFLICT DO NOTHING;

-- Seed Town Notices
INSERT INTO town_notices (id, title, category, content, posted_by, ward_scope, pin_color, is_pinned) VALUES
('g1000000-0000-0000-0000-000000000001', 'Chavang Kut Handloom Exhibition & Stall Allotment', 'FESTIVAL', 'Applications are open for local weaver SHGs to exhibit Saipikhup, Thangsuo, and tribal weaves at the main Kut ground.', 'Kut Committee', 'All Wards', '#D9A441', true),
('g1000000-0000-0000-0000-000000000002', 'PHED Scheduled Water Maintenance — Tuibong Sector', 'UTILITY', 'Main pipeline cleaning scheduled for Wednesday 6am to 2pm. Residents requested to store water beforehand.', 'PHED Sub-Division', 'Tuibong Sector', '#2B3A55', false)
ON CONFLICT DO NOTHING;

-- Seed Ticker Items
INSERT INTO news_ticker_items (headline, priority) VALUES
('Featured Handloom: Traditional Kuki Saipikhup & Thangsuo Shawls direct from Hiangtam Lamka weavers', 1),
('Celebrating the 9 Handloom Traditions of Churachandpur: Kuki, Paite, Hmar, Vaiphei, Zou, Gangte, Simte, Tedim & Kom', 2),
('District Hospital Churachandpur opens new OPD wing for pediatric care', 3),
('0% Middleman Commission on all direct maker-to-buyer handloom orders this season', 4)
ON CONFLICT DO NOTHING;
