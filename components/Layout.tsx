import React from 'react';
import { useElection } from '../context/ElectionContext';
import { LogOut, Vote } from 'lucide-react';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout, notification } = useElection();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 relative">
      {/* Toast Notification */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg text-white font-medium transform transition-all duration-300 animate-fade-in-down ${
          notification.type === 'success' ? 'bg-green-600' :
          notification.type === 'error' ? 'bg-red-600' : 'bg-blue-600'
        }`}>
          {notification.message}
        </div>
      )}

      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-blue-600 rounded-lg">
                <Vote className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-blue-500">
                SecureVote AI
              </span>
            </div>
            
            {user && (
              <div className="flex items-center gap-4">
                <span className="text-sm text-slate-600 hidden sm:inline">
                  {user.email} <span className="px-2 py-0.5 rounded-full bg-slate-100 text-xs border border-slate-200 uppercase">{user.role}</span>
                </span>
                <button 
                  onClick={logout}
                  className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                  title="Logout"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-slate-500">
          <p>© 2024 SecureVote AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};
