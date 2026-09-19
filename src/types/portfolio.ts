export interface SocialLink {
  platform: string;
  url: string;
  handle: string;
  iconSvg?: string;
}

export interface ProjectItem {
  id: string;
  title: string;
  accentWord?: string;
  subtitle: string;
  category: string;
  domain?: string;
  year: string;
  image: string;
  url: string;
  githubUrl?: string;
  previewImages?: string[];
  techStack?: string;
  description?: string;
  highlights?: string[];
}

export interface HonorItem {
  id: string;
  title: string;
  accentWord?: string;
  year: string;
  description: string;
  url?: string;
}

export interface ArchiveItem {
  title: string;
  url: string;
  category?: string;
}

export interface ServiceItem {
  title: string;
  description: string;
}

export interface EducationItem {
  degree: string;
  institution: string;
  period: string;
  location: string;
  field: string;
  details?: string;
  current?: boolean;
  logo?: string;
}
