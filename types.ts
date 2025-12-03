export enum UserRole {
  ADMIN = 'ADMIN',
  VOTER = 'VOTER',
  GUEST = 'GUEST'
}

export enum Department {
  PRESIDENT = 'President',
  VICE_PRESIDENT = 'Vice President',
  SECRETARY = 'Secretary',
  TREASURER = 'Treasurer'
}

export interface Candidate {
  id: string;
  name: string;
  department: Department;
  bio: string;
  imageUrl: string;
  votes: number;
}

export interface Voter {
  email: string;
  hasVoted: boolean;
  otp?: string; // In a real app, this would be hashed or server-side only
}

export interface User {
  email: string;
  role: UserRole;
}

export interface VoteSelection {
  [department: string]: string; // department -> candidateId
}

export type Page = 'LOGIN' | 'VOTER_DASHBOARD' | 'ADMIN_DASHBOARD' | 'SUCCESS';
