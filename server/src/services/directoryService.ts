import { supabaseAdmin } from '../config/supabase.js';

export interface DirectoryItem {
  id: string;
  title: string;
  category: string;
  short_description: string;
  phone: string;
  emergency_helpline?: string;
  location_ward: string;
  logo_monogram: string;
  monogram_bg: string;
  is_emergency: boolean;
}

const mockDirectoryListings: DirectoryItem[] = [
  {
    id: 'e1000000-0000-0000-0000-000000000001',
    title: 'Saipikhup Artisans & Weavers SHG',
    category: 'Artisan & Weaving SHGs',
    short_description: 'Cooperative producing authentic Kuki Saipikhup diamond shawls and custom handloom drapes.',
    phone: '+91 98620 00001',
    location_ward: 'Hiangtam Lamka',
    logo_monogram: 'KS',
    monogram_bg: '#B23A2D',
    is_emergency: false,
  },
  {
    id: 'e1000000-0000-0000-0000-000000000002',
    title: 'Thangzam Weavers Group',
    category: 'Artisan & Weaving SHGs',
    short_description: 'Traditional handloom weaving unit specializing in Zo Puan, Thangsuo shawls, and festive wear.',
    phone: '+91 98620 00002',
    location_ward: 'New Lamka',
    logo_monogram: 'TW',
    monogram_bg: '#2B3A55',
    is_emergency: false,
  },
  {
    id: 'e1000000-0000-0000-0000-000000000003',
    title: 'District Hospital Churachandpur',
    category: 'Healthcare & Clinics',
    short_description: 'Primary district healthcare center with 24/7 emergency care, pediatric OPD, and ambulance services.',
    phone: '03874-233855',
    emergency_helpline: '102',
    location_ward: 'IB Road, Lamka',
    logo_monogram: 'DH',
    monogram_bg: '#3F5C48',
    is_emergency: true,
  },
  {
    id: 'e1000000-0000-0000-0000-000000000004',
    title: 'Sielmat Family Clinic & Pharmacy',
    category: 'Healthcare & Clinics',
    short_description: 'General healthcare, diagnostic services, maternal care, and weekend community health camps.',
    phone: '03874-233990',
    location_ward: 'Sielmat Main Road',
    logo_monogram: 'SP',
    monogram_bg: '#D9A441',
    is_emergency: false,
  },
];

export class DirectoryService {
  static async getListings(query?: string, category?: string) {
    try {
      const { data, error } = await supabaseAdmin
        .from('directory_listings')
        .select('*, directory_categories(name)');

      if (!error && data && data.length > 0) {
        return data.map((item: any) => ({
          id: item.id,
          title: item.title,
          category: item.directory_categories?.name || 'General',
          short_description: item.short_description,
          phone: item.phone,
          emergency_helpline: item.emergency_helpline,
          location_ward: item.location_ward,
          logo_monogram: item.logo_monogram,
          monogram_bg: item.monogram_bg,
          is_emergency: item.is_emergency,
        }));
      }
    } catch (e) {
      console.warn('Using mock directory dataset');
    }

    return mockDirectoryListings.filter((item) => {
      const matchQuery = !query || item.title.toLowerCase().includes(query.toLowerCase()) || item.short_description.toLowerCase().includes(query.toLowerCase());
      const matchCat = !category || category === 'all' || item.category.toLowerCase() === category.toLowerCase();
      return matchQuery && matchCat;
    });
  }
}
