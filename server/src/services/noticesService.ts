import { supabaseAdmin } from '../config/supabase.js';

export interface NoticeItem {
  id: string;
  title: string;
  category: string;
  content: string;
  posted_by: string;
  ward_scope: string;
  pin_color: string;
  is_pinned: boolean;
  time_ago?: string;
}

const mockNotices: NoticeItem[] = [
  {
    id: 'g1000000-0000-0000-0000-000000000001',
    title: 'Chavang Kut Handloom Exhibition & Stall Allotment',
    category: 'FESTIVAL',
    content: 'Applications are open for local weaver SHGs to exhibit Saipikhup, Thangsuo, and tribal weaves at the main Kut ground.',
    posted_by: 'Kut Committee',
    ward_scope: 'All Wards',
    pin_color: '#D9A441',
    is_pinned: true,
    time_ago: '2 days ago',
  },
  {
    id: 'g1000000-0000-0000-0000-000000000002',
    title: 'PHED Scheduled Water Maintenance — Tuibong Sector',
    category: 'UTILITY',
    content: 'Main pipeline cleaning scheduled for Wednesday 6am to 2pm. Residents requested to store water beforehand.',
    posted_by: 'PHED Sub-Division',
    ward_scope: 'Tuibong Sector',
    pin_color: '#2B3A55',
    is_pinned: false,
    time_ago: 'Yesterday',
  },
];

export class NoticesService {
  static async getNotices() {
    try {
      const { data, error } = await supabaseAdmin.from('town_notices').select('*').order('is_pinned', { ascending: false });
      if (!error && data && data.length > 0) {
        return data;
      }
    } catch (e) {
      console.warn('Using mock town notices');
    }
    return mockNotices;
  }
}
