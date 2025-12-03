import React, { useState } from 'react';
import { useElection } from '../context/ElectionContext';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import { ADMIN_EMAIL, ADMIN_PASSWORD } from '../constants';
import { Lock, UserCheck, Mail } from 'lucide-react';

export const Login: React.FC = () => {
  const { loginAdmin, registerVoter, verifyOtp, isLoading } = useElection();
  const [activeTab, setActiveTab] = useState<'voter' | 'admin'>('voter');
  
  // Form States
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPass, setAdminPass] = useState('');
  const [voterEmail, setVoterEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [showOtpInput, setShowOtpInput] = useState(false);

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminEmail !== ADMIN_EMAIL) {
        alert("Invalid Admin Email"); // Simple alert for fallback, context handles success/fail mostly
        return;
    }
    if (adminPass !== ADMIN_PASSWORD) {
        alert("Invalid Password");
        return;
    }
    loginAdmin(adminPass);
  };

  const handleVoterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (showOtpInput) {
      verifyOtp(voterEmail, otp);
    } else {
      registerVoter(voterEmail);
      setShowOtpInput(true);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[80vh]">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Welcome to SecureVote</h1>
            <p className="text-slate-600">Secure, Transparent, and Intelligent Voting.</p>
        </div>

        <Card className="border-0 shadow-xl ring-1 ring-slate-900/5">
            <div className="flex border-b border-slate-200">
                <button
                    className={`flex-1 py-4 text-sm font-medium text-center transition-colors ${activeTab === 'voter' ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50' : 'text-slate-500 hover:text-slate-700'}`}
                    onClick={() => setActiveTab('voter')}
                >
                    <div className="flex items-center justify-center gap-2">
                        <UserCheck size={18} />
                        Voter Access
                    </div>
                </button>
                <button
                    className={`flex-1 py-4 text-sm font-medium text-center transition-colors ${activeTab === 'admin' ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50' : 'text-slate-500 hover:text-slate-700'}`}
                    onClick={() => setActiveTab('admin')}
                >
                    <div className="flex items-center justify-center gap-2">
                        <Lock size={18} />
                        Admin Portal
                    </div>
                </button>
            </div>

            <CardContent className="p-8">
                {activeTab === 'voter' ? (
                    <form onSubmit={handleVoterSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
                                <input 
                                    type="email" 
                                    required
                                    disabled={showOtpInput}
                                    value={voterEmail}
                                    onChange={(e) => setVoterEmail(e.target.value)}
                                    className="pl-10 w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-slate-100 disabled:text-slate-500"
                                    placeholder="enter your email..."
                                />
                            </div>
                        </div>

                        {showOtpInput && (
                            <div className="space-y-2 animate-fade-in-up">
                                <label className="text-sm font-medium text-slate-700">One-Time Pin (OTP)</label>
                                <Input 
                                    type="text" 
                                    required
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    placeholder="Enter 6-digit OTP"
                                    maxLength={6}
                                    className="text-center tracking-widest text-lg font-mono"
                                />
                                <p className="text-xs text-center text-slate-500">Check your email notification.</p>
                            </div>
                        )}

                        <Button type="submit" className="w-full" size="lg" isLoading={isLoading}>
                            {showOtpInput ? 'Verify & Enter Voting Booth' : 'Send Verification Code'}
                        </Button>
                        
                        {showOtpInput && (
                             <button 
                                type="button" 
                                onClick={() => setShowOtpInput(false)}
                                className="w-full text-sm text-blue-600 hover:text-blue-800"
                             >
                                Use a different email
                             </button>
                        )}
                    </form>
                ) : (
                    <form onSubmit={handleAdminLogin} className="space-y-4">
                        <Input 
                            label="Admin Email"
                            type="email"
                            required
                            value={adminEmail}
                            onChange={(e) => setAdminEmail(e.target.value)}
                            placeholder="admin@securevote.com"
                        />
                        <Input 
                            label="Password"
                            type="password"
                            required
                            value={adminPass}
                            onChange={(e) => setAdminPass(e.target.value)}
                            placeholder="••••••••"
                        />
                         <div className="pt-2">
                            <Button type="submit" className="w-full" size="lg">
                                Access Dashboard
                            </Button>
                        </div>
                    </form>
                )}
            </CardContent>
        </Card>
      </div>
    </div>
  );
};
