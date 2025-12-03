import React, { useState } from 'react';
import { useElection } from '../context/ElectionContext';
import { Department, VoteSelection } from '../types';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { CheckCircle, AlertCircle } from 'lucide-react';

export const VoterDashboard: React.FC = () => {
  const { candidates, castVote, logout } = useElection();
  const [selections, setSelections] = useState<VoteSelection>({});
  const [activeDepartment, setActiveDepartment] = useState<Department>(Department.PRESIDENT);

  const departments = Object.values(Department);
  const currentCandidates = candidates.filter(c => c.department === activeDepartment);
  
  const handleSelect = (candidateId: string) => {
    setSelections(prev => ({
      ...prev,
      [activeDepartment]: candidateId
    }));
  };

  const isLastStep = departments.indexOf(activeDepartment) === departments.length - 1;
  const isSelectionComplete = departments.every(d => selections[d]);

  const handleNext = () => {
    const currentIndex = departments.indexOf(activeDepartment);
    if (currentIndex < departments.length - 1) {
      setActiveDepartment(departments[currentIndex + 1]);
    }
  };

  const handlePrev = () => {
    const currentIndex = departments.indexOf(activeDepartment);
    if (currentIndex > 0) {
      setActiveDepartment(departments[currentIndex - 1]);
    }
  };

  const handleSubmit = () => {
    if (window.confirm("Are you sure you want to submit your vote? This action cannot be undone.")) {
      castVote(selections);
    }
  };

  return (
    <div className="space-y-6">
      {/* Progress */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-4">Official Ballot</h2>
        <div className="flex items-center justify-between relative">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-200 -z-10"></div>
            {departments.map((dept, idx) => {
                const isCompleted = selections[dept];
                const isActive = dept === activeDepartment;
                return (
                    <div key={dept} className="flex flex-col items-center bg-slate-50 px-2">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all duration-300 
                            ${isActive ? 'border-blue-600 bg-white text-blue-600 scale-110' : 
                              isCompleted ? 'border-green-500 bg-green-500 text-white' : 'border-slate-300 bg-white text-slate-400'}`}>
                            {isCompleted ? <CheckCircle size={16} /> : idx + 1}
                        </div>
                        <span className={`text-xs font-medium mt-2 ${isActive ? 'text-blue-600' : 'text-slate-500'}`}>{dept}</span>
                    </div>
                );
            })}
        </div>
      </div>

      {/* Candidates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentCandidates.map(candidate => (
          <div 
            key={candidate.id}
            onClick={() => handleSelect(candidate.id)}
            className={`cursor-pointer group relative overflow-hidden rounded-xl border-2 transition-all duration-300 hover:shadow-lg
                ${selections[activeDepartment] === candidate.id 
                    ? 'border-blue-600 bg-blue-50/30 ring-2 ring-blue-600 ring-offset-2' 
                    : 'border-slate-200 bg-white hover:border-blue-300'}`}
          >
             <div className="aspect-w-16 aspect-h-9 w-full bg-slate-200 h-48 relative">
                <img 
                    src={candidate.imageUrl} 
                    alt={candidate.name} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {selections[activeDepartment] === candidate.id && (
                    <div className="absolute inset-0 bg-blue-600/20 flex items-center justify-center">
                        <div className="bg-blue-600 text-white p-2 rounded-full shadow-lg">
                            <CheckCircle size={32} />
                        </div>
                    </div>
                )}
             </div>
             <div className="p-4">
                <h3 className="text-xl font-bold text-slate-900">{candidate.name}</h3>
                <p className="text-sm text-slate-500 mb-2">{candidate.department}</p>
                <p className="text-sm text-slate-600 leading-relaxed">{candidate.bio}</p>
             </div>
          </div>
        ))}
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center pt-8 border-t border-slate-200">
        <Button 
            variant="outline" 
            onClick={handlePrev} 
            disabled={departments.indexOf(activeDepartment) === 0}
        >
            Previous Department
        </Button>
        
        {isLastStep ? (
             <Button 
                variant="primary" 
                size="lg"
                onClick={handleSubmit} 
                disabled={!isSelectionComplete}
                className={isSelectionComplete ? 'animate-pulse' : ''}
             >
                Submit Official Vote
             </Button>
        ) : (
            <Button 
                variant="primary" 
                onClick={handleNext}
                disabled={!selections[activeDepartment]}
            >
                Next Department
            </Button>
        )}
      </div>

      {!isSelectionComplete && isLastStep && (
          <div className="flex items-center justify-center gap-2 text-amber-600 bg-amber-50 p-3 rounded-lg">
              <AlertCircle size={20} />
              <span className="text-sm font-medium">Please select a candidate for all departments before submitting.</span>
          </div>
      )}
    </div>
  );
};
