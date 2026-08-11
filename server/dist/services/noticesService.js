"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NoticesService = void 0;
const supabase_js_1 = require("../config/supabase.js");
const mockNotices = [
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
class NoticesService {
    static async getNotices() {
        try {
            const { data, error } = await supabase_js_1.supabaseAdmin.from('town_notices').select('*').order('is_pinned', { ascending: false });
            if (!error && data && data.length > 0) {
                return data;
            }
        }
        catch (e) {
            console.warn('Using mock town notices');
        }
        return mockNotices;
    }
}
exports.NoticesService = NoticesService;
