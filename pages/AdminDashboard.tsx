import React, { useState, useEffect } from 'react';
import { useElection } from '../context/ElectionContext';
import { Candidate, Department } from '../types';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { generateCandidateBio, analyzeElectionResults } from '../services/gemini';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Trash2, Edit2, Plus, Sparkles, X, Save } from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { candidates, voters, addCandidate, removeCandidate, updateCandidate } = useElection();
  
  // Local State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCandidate, setEditingCandidate] = useState<Candidate | null>(null);
  const [aiAnalysis, setAiAnalysis] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState<Partial<Candidate>>({
    name: '',
    department: Department.PRESIDENT,
    bio: '',
    imageUrl: 'https://picsum.photos/200/200'
  });
  const [isGeneratingBio, setIsGeneratingBio] = useState(false);

  const totalVotes = voters.filter(v => v.hasVoted).length;
  
  // Prepare Chart Data
  const chartData = candidates.map(c => ({
    name: c.name.split(' ')[0], // First name for chart label
    votes: c.votes,
    department: c.department
  }));
  
  const COLORS = ['#2563eb', '#3b82f6', '#60a5fa', '#93c5fd', '#1e40af', '#1d4ed8'];

  const handleEdit = (candidate: Candidate) => {
    setEditingCandidate(candidate);
    setFormData(candidate);
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setEditingCandidate(null);
    setFormData({
        name: '',
        department: Department.PRESIDENT,
        bio: '',
        imageUrl: `https://picsum.photos/200/200?random=${Math.floor(Math.random() * 1000)}`
    });
    setIsModalOpen(true);
  };

  const handleGenerateBio = async () => {
    if (!formData.name) return;
    setIsGeneratingBio(true);
    const bio = await generateCandidateBio(formData.name!, formData.department!);
    setFormData(prev => ({ ...prev, bio }));
    setIsGeneratingBio(false);
  };

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    const analysis = await analyzeElectionResults(candidates);
    setAiAnalysis(analysis);
    setIsAnalyzing(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCandidate) {
        updateCandidate({ ...editingCandidate, ...formData } as Candidate);
    } else {
        addCandidate({ 
            ...formData, 
            id: Date.now().toString(), 
            votes: 0 
        } as Candidate);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-8">
      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-blue-600 to-blue-700 text-white">
            <CardContent>
                <p className="text-blue-100 text-sm font-medium">Total Votes Cast</p>
                <h3 className="text-4xl font-bold mt-2">{totalVotes}</h3>
            </CardContent>
        </Card>
        <Card>
            <CardContent>
                <p className="text-slate-500 text-sm font-medium">Registered Voters</p>
                <h3 className="text-4xl font-bold mt-2 text-slate-900">{voters.length}</h3>
            </CardContent>
        </Card>
        <Card className="border-blue-100 bg-blue-50/50">
            <CardContent>
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-slate-500 text-sm font-medium">AI Analysis</p>
                        <p className="text-sm mt-2 text-slate-700 leading-relaxed">
                            {aiAnalysis || "Click analyze to get insights."}
                        </p>
                    </div>
                    <Button size="sm" variant="outline" onClick={handleAnalyze} isLoading={isAnalyzing} className="ml-2">
                        <Sparkles size={16} className="mr-1" /> Analyze
                    </Button>
                </div>
            </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <Card>
        <CardHeader title="Live Vote Tally" subtitle="Real-time distribution across all candidates" />
        <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip cursor={{ fill: '#f1f5f9' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                    <Bar dataKey="votes" radius={[4, 4, 0, 0]}>
                        {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Candidate Management */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-slate-900">Manage Candidates</h2>
            <Button onClick={handleAddNew}>
                <Plus size={18} className="mr-2" /> Add Candidate
            </Button>
        </div>

        <div className="grid grid-cols-1 gap-4">
            {candidates.map(candidate => (
                <Card key={candidate.id} className="flex flex-col md:flex-row items-center p-4 gap-4">
                    <img src={candidate.imageUrl} alt={candidate.name} className="w-16 h-16 rounded-full object-cover border border-slate-200" />
                    <div className="flex-1 text-center md:text-left">
                        <h3 className="font-bold text-slate-900">{candidate.name}</h3>
                        <span className="inline-block px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-xs mt-1">
                            {candidate.department}
                        </span>
                        <p className="text-sm text-slate-500 mt-1 line-clamp-1">{candidate.bio}</p>
                    </div>
                    <div className="flex items-center gap-4 border-l border-slate-100 pl-4">
                        <div className="text-center mr-4">
                            <span className="block text-2xl font-bold text-blue-600">{candidate.votes}</span>
                            <span className="text-xs text-slate-400">Votes</span>
                        </div>
                        <div className="flex gap-2">
                            <Button size="sm" variant="outline" onClick={() => handleEdit(candidate)}>
                                <Edit2 size={16} />
                            </Button>
                            <Button size="sm" variant="danger" onClick={() => removeCandidate(candidate.id)}>
                                <Trash2 size={16} />
                            </Button>
                        </div>
                    </div>
                </Card>
            ))}
        </div>
      </div>

      {/* Edit/Add Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-fade-in-up">
                <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100 bg-slate-50">
                    <h3 className="font-bold text-lg">{editingCandidate ? 'Edit Candidate' : 'Add New Candidate'}</h3>
                    <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                        <X size={24} />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <Input 
                        label="Full Name" 
                        required 
                        value={formData.name} 
                        onChange={e => setFormData({...formData, name: e.target.value})} 
                    />
                    
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Department</label>
                        <select 
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={formData.department}
                            onChange={e => setFormData({...formData, department: e.target.value as Department})}
                        >
                            {Object.values(Department).map(dept => (
                                <option key={dept} value={dept}>{dept}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            Bio 
                            <button 
                                type="button" 
                                onClick={handleGenerateBio} 
                                className="ml-2 text-xs text-blue-600 hover:underline flex-inline items-center gap-1"
                                disabled={!formData.name}
                            >
                                {isGeneratingBio ? 'Generating...' : <><Sparkles size={12} /> Auto-Generate with AI</>}
                            </button>
                        </label>
                        <textarea 
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-24"
                            value={formData.bio}
                            onChange={e => setFormData({...formData, bio: e.target.value})}
                            required
                        />
                    </div>

                    <Input 
                        label="Image URL" 
                        value={formData.imageUrl} 
                        onChange={e => setFormData({...formData, imageUrl: e.target.value})} 
                    />

                    <div className="flex justify-end gap-3 pt-4">
                        <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                        <Button type="submit">
                            <Save size={16} className="mr-2" /> Save Candidate
                        </Button>
                    </div>
                </form>
            </div>
        </div>
      )}
    </div>
  );
};
