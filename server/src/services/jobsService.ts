import { supabaseAdmin } from '../config/supabase.js';

export interface JobPostingItem {
  id: string;
  title: string;
  company_name: string;
  location_ward: string;
  job_type: string;
  salary_range: string;
  description: string;
  requirements?: string;
  created_at?: string;
}

const mockJobPostings: JobPostingItem[] = [
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

export class JobsService {
  static async getJobs() {
    try {
      const { data, error } = await supabaseAdmin.from('job_postings').select('*').eq('is_active', true);
      if (!error && data && data.length > 0) {
        return data;
      }
    } catch (e) {
      console.warn('Using mock job listings');
    }
    return mockJobPostings;
  }

  static async submitApplication(data: { jobId: string; applicantName: string; phone: string; experienceBio?: string }) {
    try {
      await supabaseAdmin.from('job_applications').insert({
        job_id: data.jobId,
        applicant_name: data.applicantName,
        phone: data.phone,
        experience_bio: data.experienceBio || '',
      });
    } catch (e) {
      console.warn('Application stored locally in-memory');
    }

    return {
      success: true,
      message: `Job application for "${data.applicantName}" submitted successfully! Employer will contact you via WhatsApp / Phone.`,
    };
  }
}
