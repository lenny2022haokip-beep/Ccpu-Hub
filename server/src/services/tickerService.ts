import { supabaseAdmin } from '../config/supabase.js';

const mockTickerHeadlines = [
  'Featured Handloom: Traditional Kuki Saipikhup & Thangsuo Shawls direct from Hiangtam Lamka weavers',
  'Celebrating the 9 Handloom Traditions of Churachandpur: Kuki, Paite, Hmar, Vaiphei, Zou, Gangte, Simte, Tedim & Kom',
  'District Hospital Churachandpur opens new OPD wing for pediatric care',
  '0% Middleman Commission on all direct maker-to-buyer handloom orders this season',
];

export class TickerService {
  static async getHeadlines(): Promise<string[]> {
    try {
      const { data, error } = await supabaseAdmin.from('news_ticker_items').select('headline').eq('is_active', true).order('priority');
      if (!error && data && data.length > 0) {
        return data.map((item: any) => item.headline);
      }
    } catch (e) {
      console.warn('Using mock ticker headlines');
    }
    return mockTickerHeadlines;
  }
}
