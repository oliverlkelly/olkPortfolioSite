export interface Project {
  id: string;
  title: string;
  description: string;
  long_description: string | null;
  tech_stack: string[];
  github_url: string | null;
  live_url: string | null;
  image_url: string | null;
  featured: boolean;
  display_order: number;
  start_date: string | null;
  end_date: string | null;
}

export interface Experience {
  id: string;
  company: string;
  role: string;
  location: string | null;
  employment_type: string;
  description: string;
  achievements: string[];
  tech_stack: string[];
  start_date: string;
  end_date: string | null;
  is_current: boolean;
  company_url: string | null;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field_of_study: string | null;
  location: string | null;
  description: string | null;
  achievements: string[];
  grade: string | null;
  start_date: string;
  end_date: string | null;
  is_current: boolean;
  institution_url: string | null;
}

export interface Profile {
  id: string;
  name: string;
  title: string;
  bio: string | null;
  email: string | null;
  github_url: string | null;
  linkedin_url: string | null;
  twitter_url: string | null;
  location: string | null;
  skills: string[];
  resume_url: string | null;
}

export interface PortfolioData {
  profile: Profile | null;
  projects: Project[];
  experience: Experience[];
  education: Education[];
}
