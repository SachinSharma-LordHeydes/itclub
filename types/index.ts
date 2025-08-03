export type UserRole = 'admin' | 'user';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  skills: string[];
  year: string;
  avatar?: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: Date;
  time: string;
  location: string;
  type: 'workshop' | 'hackathon' | 'meeting' | 'webinar';
  capacity: number;
  registered: number;
  tags: string[];
}

export interface Resource {
  id: string;
  title: string;
  description: string;
  type: 'tutorial' | 'document' | 'video' | 'tool';
  category: string;
  downloadUrl: string;
  author: string;
  createdAt: Date;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  author: User;
  githubUrl?: string;
  liveUrl?: string;
  createdAt: Date;
  likes: number;
}

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: 'internship' | 'full-time' | 'part-time' | 'contract';
  skills: string[];
  description: string;
  applyUrl: string;
  postedAt: Date;
}