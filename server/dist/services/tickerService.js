"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TickerService = void 0;
const supabase_js_1 = require("../config/supabase.js");
const mockTickerHeadlines = [
    'Featured Handloom: Traditional Kuki Saipikhup & Thangsuo Shawls direct from Hiangtam Lamka weavers',
    'Celebrating the 9 Handloom Traditions of Churachandpur: Kuki, Paite, Hmar, Vaiphei, Zou, Gangte, Simte, Tedim & Kom',
    'District Hospital Churachandpur opens new OPD wing for pediatric care',
    '0% Middleman Commission on all direct maker-to-buyer handloom orders this season',
];
class TickerService {
    static async getHeadlines() {
        try {
            const { data, error } = await supabase_js_1.supabaseAdmin.from('news_ticker_items').select('headline').eq('is_active', true).order('priority');
            if (!error && data && data.length > 0) {
                return data.map((item) => item.headline);
            }
        }
        catch (e) {
            console.warn('Using mock ticker headlines');
        }
        return mockTickerHeadlines;
    }
}
exports.TickerService = TickerService;
