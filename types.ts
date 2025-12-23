
export enum Screen {
  LOGIN = 'login',
  MAIN = 'main',
  LEAK_ALERT = 'leak_alert',
  ANALYTICS = 'analytics',
  AI_ASSISTANT = 'ai_assistant',
  SETTINGS = 'settings',
  DEVICES = 'devices',
  ACHIEVEMENTS = 'achievements',
  COMMUNITY = 'community'
}

export interface WaterUsageData {
  day: string;
  amount: number;
}

export interface Device {
  id: string;
  name: string;
  status: 'Active' | 'Low Battery' | 'Offline';
  lastSync: string;
  type: 'Sensor' | 'Valve';
}

export interface Achievement {
  id: string;
  title: string;
  icon: string;
  color: string;
  unlocked: boolean;
}

// Fix: Adding missing ProjectStatus enum required by ProjectCard component
export enum ProjectStatus {
  PUBLISHED = 'Published',
  REVIEW = 'In Review',
  DRAFT = 'Draft'
}

// Fix: Adding missing Project interface required by ProjectCard component
export interface Project {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  status: ProjectStatus;
  author: string;
  lastModified: string;
}
