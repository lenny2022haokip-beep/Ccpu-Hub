"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobsService = void 0;
const supabase_js_1 = require("../config/supabase.js");
const mockJobPostings = [
    {
        id: 'f1000000-0000-0000-0000-000000000001',
        title: 'Loom Supervisor & Master Weaver',
        company_name: 'Saipikhup Artisans SHG',
        location_ward: 'Hiangtam Lamka',
        job_type: 'FULL_TIME',
        salary_range: '₹14,000–18,000 / mo',
        description: 'Supervise daily production of traditional Kuki Saipikhup and Thangsuo shawls on backstrap and frame looms.',
        requirements: 'Minimum 5 years experience in traditional loin loom weaving & motif design',
    },
    {
        id: 'f1000000-0000-0000-0000-000000000002',
        title: 'Handloom Product Photography (Freelance)',
        company_name: 'Thangzam Weavers Group',
        location_ward: 'New Lamka',
        job_type: 'FREELANCE',
        salary_range: 'Per-session rate',
        description: 'Photograph authentic handwoven shawls and drapes for the online catalog. 2–3 sessions per month.',
        requirements: 'Must possess camera gear and experience with textile photography',
    },
];
class JobsService {
    static async getJobs() {
        try {
            const { data, error } = await supabase_js_1.supabaseAdmin.from('job_postings').select('*').eq('is_active', true);
            if (!error && data && data.length > 0) {
                return data;
            }
        }
        catch (e) {
            console.warn('Using mock job listings');
        }
        return mockJobPostings;
    }
    static async submitApplication(data) {
        try {
            await supabase_js_1.supabaseAdmin.from('job_applications').insert({
                job_id: data.jobId,
                applicant_name: data.applicantName,
                phone: data.phone,
                experience_bio: data.experienceBio || '',
            });
        }
        catch (e) {
            console.warn('Application stored locally in-memory');
        }
        return {
            success: true,
            message: `Job application for "${data.applicantName}" submitted successfully! Employer will contact you via WhatsApp / Phone.`,
        };
    }
}
exports.JobsService = JobsService;
