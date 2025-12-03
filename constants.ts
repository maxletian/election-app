import { Candidate, Department } from './types';

export const ADMIN_EMAIL = 'letianmax27@gmail.com';
export const ADMIN_PASSWORD = 'chryseler';

export const INITIAL_CANDIDATES: Candidate[] = [
  {
    id: 'c1',
    name: 'Elena Rodriguez',
    department: Department.PRESIDENT,
    bio: 'Visionary leader focused on sustainable growth and community empowerment.',
    imageUrl: 'https://picsum.photos/200/200?random=1',
    votes: 45
  },
  {
    id: 'c2',
    name: 'Marcus Chen',
    department: Department.PRESIDENT,
    bio: 'Tech innovator bringing efficiency and transparency to governance.',
    imageUrl: 'https://picsum.photos/200/200?random=2',
    votes: 38
  },
  {
    id: 'c3',
    name: 'Sarah Johnson',
    department: Department.VICE_PRESIDENT,
    bio: 'Dedicated advocate for student welfare and academic excellence.',
    imageUrl: 'https://picsum.photos/200/200?random=3',
    votes: 42
  },
  {
    id: 'c4',
    name: 'David Okafor',
    department: Department.VICE_PRESIDENT,
    bio: 'Bridge builder connecting diverse groups for a unified voice.',
    imageUrl: 'https://picsum.photos/200/200?random=4',
    votes: 40
  },
  {
    id: 'c5',
    name: 'Emily Blunt',
    department: Department.SECRETARY,
    bio: 'Organized and detail-oriented professional ensuring smooth operations.',
    imageUrl: 'https://picsum.photos/200/200?random=5',
    votes: 55
  },
  {
    id: 'c6',
    name: 'James Smith',
    department: Department.TREASURER,
    bio: 'Fiscal conservative with a knack for strategic resource allocation.',
    imageUrl: 'https://picsum.photos/200/200?random=6',
    votes: 60
  }
];
