import React from 'react';
import { ElectionProvider, useElection } from './context/ElectionContext';
import { Layout } from './components/Layout';
import { Login } from './pages/Login';
import { VoterDashboard } from './pages/VoterDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { Button } from './components/ui/Button';
import { CheckCircle } from 'lucide-react';

const AppContent: React.FC = () => {
  const { currentPage, logout } = useElection();

  if (currentPage === 'LOGIN') {
    return (
      <Layout>
        <Login />
      </Layout>
    );
  }

  if (currentPage === 'SUCCESS') {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
            <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center animate-bounce">
                <CheckCircle size={48} />
            </div>
            <div>
                <h1 className="text-3xl font-bold text-slate-900">Vote Submitted Successfully!</h1>
                <p className="text-slate-600 mt-2">Thank you for participating in the election.</p>
                <p className="text-sm text-slate-500 mt-1">For security reasons, this session will close shortly.</p>
            </div>
            <Button onClick={logout} variant="outline">
                Return to Home
            </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {currentPage === 'VOTER_DASHBOARD' && <VoterDashboard />}
      {currentPage === 'ADMIN_DASHBOARD' && <AdminDashboard />}
    </Layout>
  );
};

const App: React.FC = () => {
  return (
    <ElectionProvider>
      <AppContent />
    </ElectionProvider>
  );
};

export default App;
