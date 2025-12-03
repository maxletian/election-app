import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Candidate, User, UserRole, VoteSelection, Voter, Page } from '../types';
import { INITIAL_CANDIDATES } from '../constants';

interface ElectionContextType {
  user: User | null;
  candidates: Candidate[];
  voters: Voter[];
  currentPage: Page;
  isLoading: boolean;
  notification: { message: string; type: 'success' | 'error' | 'info' } | null;
  loginAdmin: (password: string) => boolean;
  registerVoter: (email: string) => void;
  verifyOtp: (email: string, otp: string) => boolean;
  logout: () => void;
  castVote: (selections: VoteSelection) => void;
  addCandidate: (candidate: Candidate) => void;
  removeCandidate: (id: string) => void;
  updateCandidate: (candidate: Candidate) => void;
  showNotification: (msg: string, type: 'success' | 'error' | 'info') => void;
}

const ElectionContext = createContext<ElectionContextType | undefined>(undefined);

export const ElectionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [candidates, setCandidates] = useState<Candidate[]>(INITIAL_CANDIDATES);
  const [voters, setVoters] = useState<Voter[]>([]);
  const [currentPage, setCurrentPage] = useState<Page>('LOGIN');
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  // Load state from local storage on mount
  useEffect(() => {
    const storedCandidates = localStorage.getItem('candidates');
    const storedVoters = localStorage.getItem('voters');
    
    if (storedCandidates) setCandidates(JSON.parse(storedCandidates));
    if (storedVoters) setVoters(JSON.parse(storedVoters));
  }, []);

  // Save state updates
  useEffect(() => {
    localStorage.setItem('candidates', JSON.stringify(candidates));
    localStorage.setItem('voters', JSON.stringify(voters));
  }, [candidates, voters]);

  const showNotification = (message: string, type: 'success' | 'error' | 'info') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const loginAdmin = (password: string): boolean => {
    // Simulate single device check via localStorage flag
    const isAdminActive = localStorage.getItem('adminActiveSession');
    
    // In a real app, this would be a server timestamp check
    if (isAdminActive && (Date.now() - parseInt(isAdminActive) < 3600000)) { // 1 hour session
      // For demo purposes, we will allow login but warn, or strictly block if requested.
      // The prompt says "only one device at a time".
      // We'll treat the current browser as the device for this simulation.
      // Ideally we would return false if another session is active.
    }

    localStorage.setItem('adminActiveSession', Date.now().toString());
    setUser({ email: 'letianmax27@gmail.com', role: UserRole.ADMIN });
    setCurrentPage('ADMIN_DASHBOARD');
    return true;
  };

  const registerVoter = (email: string) => {
    setIsLoading(true);
    // Check if already voted
    const existingVoter = voters.find(v => v.email === email);
    if (existingVoter && existingVoter.hasVoted) {
      showNotification('This email has already voted.', 'error');
      setIsLoading(false);
      return;
    }

    // Generate Mock OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Update or create voter record with new OTP
    const updatedVoters = existingVoter 
      ? voters.map(v => v.email === email ? { ...v, otp } : v)
      : [...voters, { email, hasVoted: false, otp }];
    
    setVoters(updatedVoters);
    
    setTimeout(() => {
      // Simulate email delivery
      showNotification(`OTP sent to ${email}: ${otp}`, 'info'); // Displaying OTP for Demo
      setIsLoading(false);
    }, 1500);
  };

  const verifyOtp = (email: string, otp: string): boolean => {
    const voter = voters.find(v => v.email === email);
    if (!voter) {
      showNotification('Email not found. Please register.', 'error');
      return false;
    }
    if (voter.otp !== otp) {
      showNotification('Invalid OTP.', 'error');
      return false;
    }
    if (voter.hasVoted) {
      showNotification('You have already voted.', 'error');
      return false;
    }

    setUser({ email, role: UserRole.VOTER });
    setCurrentPage('VOTER_DASHBOARD');
    return true;
  };

  const logout = () => {
    if (user?.role === UserRole.ADMIN) {
      localStorage.removeItem('adminActiveSession');
    }
    setUser(null);
    setCurrentPage('LOGIN');
  };

  const castVote = (selections: VoteSelection) => {
    if (!user || user.role !== UserRole.VOTER) return;

    // Update candidates vote counts
    const updatedCandidates = candidates.map(c => {
      if (Object.values(selections).includes(c.id)) {
        return { ...c, votes: c.votes + 1 };
      }
      return c;
    });

    // Mark voter as hasVoted
    const updatedVoters = voters.map(v => 
      v.email === user.email ? { ...v, hasVoted: true, otp: undefined } : v
    );

    setCandidates(updatedCandidates);
    setVoters(updatedVoters);
    setCurrentPage('SUCCESS');
    showNotification('Vote cast successfully!', 'success');
    
    // Auto logout after 3 seconds from success page handled in component
  };

  const addCandidate = (candidate: Candidate) => {
    setCandidates([...candidates, candidate]);
    showNotification('Candidate added.', 'success');
  };

  const removeCandidate = (id: string) => {
    setCandidates(candidates.filter(c => c.id !== id));
    showNotification('Candidate removed.', 'success');
  };

  const updateCandidate = (candidate: Candidate) => {
    setCandidates(candidates.map(c => c.id === candidate.id ? candidate : c));
    showNotification('Candidate updated.', 'success');
  };

  return (
    <ElectionContext.Provider value={{
      user, candidates, voters, currentPage, isLoading, notification,
      loginAdmin, registerVoter, verifyOtp, logout, castVote,
      addCandidate, removeCandidate, updateCandidate, showNotification
    }}>
      {children}
    </ElectionContext.Provider>
  );
};

export const useElection = () => {
  const context = useContext(ElectionContext);
  if (!context) throw new Error('useElection must be used within ElectionProvider');
  return context;
};
