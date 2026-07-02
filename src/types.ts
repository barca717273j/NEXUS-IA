export interface Sale {
  id: string;
  value: number;
  date: string;
  note?: string;
}

export interface Avatar {
  name: string;
  idealAudience: string;
  age: string;
  gender: string;
  profession: string;
  income: string;
  city: string;
  country: string;
  interests: string[];
  pains: string[];
  dreams: string[];
}

export interface Research {
  avatar: Avatar;
  objections: string[];
  tomDeVoz: string;
  palavrasConvertem: string[];
  promessas: string[];
  beneficios: string[];
  argumentos: string[];
}

export interface Community {
  name: string;
  description: string;
  size: string;
}

export interface OutreachGroup {
  category: string;
  communities: Community[];
  templateMessage: string;
}

export interface Chapter {
  title: string;
  content: string;
}

export interface EbookContent {
  title: string;
  subtitle: string;
  summary: string;
  introduction: string;
  conclusion: string;
  cta: string;
  chapters: Chapter[];
}

export interface LandingPageContent {
  productName: string;
  niche: string;
  objective: string;
  headline: string;
  subheadline: string;
  benefits: string[];
  problems: string[];
  solutions: string[];
  testimonials: {
    name: string;
    role: string;
    text: string;
  }[];
  guarantee: string;
  faqs: { question: string; answer: string }[];
  cta: string;
}

export interface SiteFeature {
  title: string;
  description: string;
}

export interface SiteContent {
  name: string;
  niche: string;
  objective: string;
  heroTitle: string;
  heroSubtitle: string;
  aboutText: string;
  contactEmail: string;
  contactPhone: string;
  faqs: { question: string; answer: string }[];
  features: SiteFeature[];
  theme?: "nexus" | "oceanic" | "amber" | "slate";
  layout?: "tech" | "business" | "creative" | "clean";
  pages?: string[];
}

export interface ProjectMilestones {
  ebookCreated: boolean;
  researchCompleted: boolean;
  messagesReady: boolean;
  communitiesAnalyzed: boolean;
  firstPromoDone: boolean;
  firstSaleRegistered: boolean;
}

export interface Project {
  id: string;
  type?: "ebook" | "landing_page" | "site";
  name: string;
  niche: string;
  objective: string;
  pages: number;
  language: string;
  coverUrl: string;
  coverLocalUrl?: string; // Option for uploaded local cover
  createdAt: string;
  ebook: EbookContent;
  research: Research;
  landingPage?: LandingPageContent; // Optional, added for LP
  site?: SiteContent; // Optional, added for Site
  x1: {
    facebook: OutreachGroup;
    telegram: OutreachGroup;
    whatsapp: OutreachGroup;
    discord: OutreachGroup;
    reddit: OutreachGroup;
    forums: OutreachGroup;
  };
  milestones: ProjectMilestones;
  sales: Sale[];
  creditsUsed?: number;
  lastEditAt?: string;
  chatMessagesCount?: number;
  aiChatHistory?: { role: "user" | "model"; content: string; timestamp: string }[];
}

export interface UserStats {
  totalEbooks: number;
  activeProjects: number;
  totalRevenue: number;
  monthlyGoal: number;
}
