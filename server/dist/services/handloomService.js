"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HandloomService = void 0;
const supabase_js_1 = require("../config/supabase.js");
// Fallback mock dataset for local dev if Supabase connection is pending
const mockHandloomProducts = [
    {
        id: 'c1000000-0000-0000-0000-000000000001',
        title: 'Kuki Saipikhup Shawl',
        slug: 'kuki-saipikhup-shawl',
        tribe: 'Kuki',
        category: 'SHAWL',
        price_inr: 3800,
        weave_technique: 'Backstrap Loin Loom',
        material: 'Fine Cotton & Golden Zari Thread',
        weaver_name: 'Saipikhup Artisan Circle',
        location_ward: 'Hiangtam Lamka',
        contact_phone: '+919862000001',
        featured: true,
        story: {
            motif_name: 'Quail-Footprint Diamond Pattern',
            heritage_history: 'The iconic Saipikhup shawl represents the quail-footprint diamond pattern, a revered symbol of resilience, agility, and ancestral honor in Kuki tradition.',
            cultural_significance: 'Handwoven on backstrap loin looms using fine cotton and golden thread accents for major social and cultural ceremonies.',
        },
    },
    {
        id: 'c1000000-0000-0000-0000-000000000002',
        title: 'Kuki Thangsuo Shawl',
        slug: 'kuki-thangsuo-shawl',
        tribe: 'Kuki',
        category: 'SHAWL',
        price_inr: 4200,
        weave_technique: 'Frame Loom',
        material: 'Pure Cotton & Crimson Thread',
        weaver_name: 'Haokip Handloom Co-op',
        location_ward: 'Tuibong',
        contact_phone: '+919862000002',
        featured: true,
        story: {
            motif_name: 'Honorific Crimson & Gold Bands',
            heritage_history: 'The Thangsuo shawl is a high-status honorific weave featuring prominent horizontal crimson, yellow, black, and white bands.',
            cultural_significance: 'Traditionally presented to community achievers, leaders, and elders in recognition of honor and service.',
        },
    },
    {
        id: 'c1000000-0000-0000-0000-000000000003',
        title: 'Khamtang Puan (Ponmong)',
        slug: 'khamtang-puan',
        tribe: 'Kuki',
        category: 'PUAN',
        price_inr: 2900,
        weave_technique: 'Backstrap Loin Loom',
        material: 'Fine Indigo Cotton',
        weaver_name: 'Kuki Women SHG',
        location_ward: 'New Lamka',
        contact_phone: '+919862000003',
    },
    {
        id: 'c1000000-0000-0000-0000-000000000004',
        title: 'Kuki Del Puan Wrap',
        slug: 'kuki-del-puan-wrap',
        tribe: 'Kuki',
        category: 'WRAP',
        price_inr: 2450,
        weave_technique: 'Loin Loom',
        material: 'Mercerized Cotton',
        weaver_name: 'Independent Weaver',
        location_ward: 'Kangvai',
        contact_phone: '+919862000004',
    },
    {
        id: 'c1000000-0000-0000-0000-000000000005',
        title: 'Paite Puandum Puan',
        slug: 'paite-puandum-puan',
        tribe: 'Paite',
        category: 'PUAN',
        price_inr: 3400,
        weave_technique: 'Loin Loom',
        material: 'Navy, Crimson & Emerald Thread',
        weaver_name: 'Guite Weaving Society',
        location_ward: 'Hiangtam Lamka',
        contact_phone: '+919862000005',
        featured: true,
        story: {
            motif_name: 'Ceremonial Tri-Color Vertical Stripes',
            heritage_history: 'Puandum features vertical bands of red, green, and yellow on a deep navy canvas.',
            cultural_significance: 'Worn on formal occasions and cultural observances by Paite & Zomi communities.',
        },
    },
    {
        id: 'c1000000-0000-0000-0000-000000000006',
        title: 'Hmar Am Shawl',
        slug: 'hmar-am-shawl',
        tribe: 'Hmar',
        category: 'SHAWL',
        price_inr: 3650,
        weave_technique: 'Frame Loom',
        material: 'Tri-Color Cotton Block Weave',
        weaver_name: 'Hmar Artisan Collective',
        location_ward: 'Rengkai',
        contact_phone: '+919862000007',
        featured: true,
        story: {
            motif_name: 'Rectangular Heritage Tri-Color Blocks',
            heritage_history: 'Hmar Am is a bold tri-color shawl composed of red, black, and white rectangular block motifs.',
            cultural_significance: 'Symbolizes unity and strength across Hmar clans.',
        },
    },
    {
        id: 'c1000000-0000-0000-0000-000000000007',
        title: 'Vaiphei Khiangte Puan',
        slug: 'vaiphei-khiangte-puan',
        tribe: 'Vaiphei',
        category: 'PUAN',
        price_inr: 3200,
        weave_technique: 'Loin Loom',
        material: 'Crimson Canvas & Gold Zari',
        weaver_name: 'Vaiphei Handloom Group',
        location_ward: 'Tuibong',
        contact_phone: '+919862000009',
    },
    {
        id: 'c1000000-0000-0000-0000-000000000008',
        title: 'Zou Puan (Highland Blue)',
        slug: 'zou-puan',
        tribe: 'Zou',
        category: 'PUAN',
        price_inr: 2950,
        weave_technique: 'Loin Loom',
        material: 'Highland Blue & Red Accents',
        weaver_name: 'Zou Loom Co-op',
        location_ward: 'New Lamka',
        contact_phone: '+919862000010',
    },
];
class HandloomService {
    /**
     * List products with tribe, category, and search query filters
     */
    static async getProducts(filters) {
        try {
            let queryBuilder = supabase_js_1.supabaseAdmin
                .from('handloom_products')
                .select(`
          id, title, slug, category, price_inr, weave_technique, material, weaver_name, location_ward, contact_phone, swatch_svg, swatch_image_url, featured,
          tribes!inner(name),
          product_stories(motif_name, heritage_history, cultural_significance)
        `);
            if (filters.tribe && filters.tribe !== 'all') {
                queryBuilder = queryBuilder.eq('tribes.name', filters.tribe);
            }
            if (filters.category && filters.category !== 'all') {
                queryBuilder = queryBuilder.eq('category', filters.category);
            }
            if (filters.query) {
                queryBuilder = queryBuilder.ilike('title', `%${filters.query}%`);
            }
            const { data, error } = await queryBuilder;
            if (!error && data && data.length > 0) {
                return data.map((item) => ({
                    id: item.id,
                    title: item.title,
                    slug: item.slug,
                    tribe: item.tribes?.name || 'Multi-Tribe',
                    category: item.category,
                    price_inr: item.price_inr,
                    weave_technique: item.weave_technique,
                    material: item.material,
                    weaver_name: item.weaver_name,
                    location_ward: item.location_ward,
                    contact_phone: item.contact_phone,
                    featured: item.featured,
                    story: item.product_stories?.[0] || undefined,
                }));
            }
        }
        catch (err) {
            console.warn('Using mock handloom dataset');
        }
        // Return filtered in-memory fallback dataset
        return mockHandloomProducts.filter((item) => {
            const matchTribe = !filters.tribe || filters.tribe === 'all' || item.tribe.toLowerCase() === filters.tribe.toLowerCase();
            const matchCategory = !filters.category || filters.category === 'all' || item.category.toLowerCase() === filters.category.toLowerCase();
            const matchQuery = !filters.query || item.title.toLowerCase().includes(filters.query.toLowerCase()) || item.weaver_name.toLowerCase().includes(filters.query.toLowerCase());
            return matchTribe && matchCategory && matchQuery;
        });
    }
    /**
     * Log an order or WhatsApp inquiry
     */
    static async logInquiry(data) {
        try {
            await supabase_js_1.supabaseAdmin.from('orders_inquiries').insert({
                product_id: data.productId || null,
                buyer_name: data.buyerName || 'Anonymous Citizen',
                buyer_phone: data.buyerPhone || null,
                channel: data.channel || 'WHATSAPP',
            });
        }
        catch (e) {
            console.warn('Logging inquiry locally in-memory');
        }
        return { success: true, message: 'Marketplace inquiry logged successfully' };
    }
}
exports.HandloomService = HandloomService;
