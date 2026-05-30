/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Subject } from '../types';
import { Plus, Trash2, ArrowUpRight, BookMarked, Check } from 'lucide-react';

interface SubjectConfigProps {
  subjects: Subject[];
  onAddSubject: (subject: Subject) => void;
  onDeleteSubject: (id: string) => void;
  onUpdateSubject: (subject: Subject) => void;
}

export default function SubjectConfig({
  subjects,
  onAddSubject,
  onDeleteSubject,
  onUpdateSubject
}: SubjectConfigProps) {
  const [newSubName, setNewSubName] = useState('');
  const [newSubMax, setNewSubMax] = useState(100);
  const [newSubPass, setNewSubPass] = useState(35);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!newSubName.trim()) {
      setError('Subject title is required');
      return;
    }

    const cleanName = newSubName.trim();
    // Check duplication
    if (subjects.some(sub => sub.name.toLowerCase() === cleanName.toLowerCase())) {
      setError(`Subject "${cleanName}" already exists in curriculum.`);
      return;
    }

    const cleanId = cleanName.toLowerCase().replace(/[^a-z0-9]/g, '-');
    
    if (newSubPass > newSubMax) {
      setError('Pass score cannot exceed maximum possible marks.');
      return;
    }

    const newSubject: Subject = {
      id: cleanId,
      name: cleanName,
      maxMarks: newSubMax,
      passMarks: newSubPass
    };

    onAddSubject(newSubject);
    setNewSubName('');
    setNewSubMax(100);
    setNewSubPass(35);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  const handleUpdateMarks = (subject: Subject, field: 'maxMarks' | 'passMarks', value: number) => {
    const updated = { ...subject };
    if (field === 'maxMarks') {
      updated.maxMarks = Math.max(value, 1);
    } else {
      updated.passMarks = Math.min(Math.max(value, 0), updated.maxMarks);
    }
    onUpdateSubject(updated);
  };

  return (
    <div id="subject-config-component" className="bg-panel border border-border-custom rounded p-4">
      <div className="border-b border-border-custom pb-2.5 mb-3.5">
        <h3 className="font-sans font-bold tracking-tight text-xs text-ink uppercase flex items-center gap-1.5">
          <BookMarked className="w-4 h-4 text-accent" />
          Academics Curriculum Setup
        </h3>
        <p className="text-ink-muted text-[10px] mt-0.5">
          Add fresh subjects to the academic schedule or redefine historical evaluation schemas.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Curricular List Side */}
        <div className="lg:col-span-7 space-y-2.5">
          <h4 className="text-[10px] font-black text-ink uppercase tracking-wider mb-1.5">Active Curriculum Course Parameters</h4>
          
          <div className="space-y-1.5 max-h-[290px] overflow-y-auto pr-1">
            {subjects.map((sub) => (
              <div 
                key={sub.id} 
                className="flex items-center justify-between p-2 bg-gray-50/50 hover:bg-gray-50 rounded border border-border-custom transition-colors group"
              >
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-ink block">{sub.name}</span>
                  <span className="text-[9px] text-ink-muted font-mono block">Key: <code className="bg-white border border-gray-200 px-1 py-0.2 rounded text-ink">{sub.id}</code></span>
                </div>

                <div className="flex items-center gap-2">
                  {/* Min and Max Adjusters */}
                  <div className="flex items-center gap-1.5 text-xs text-ink">
                    <div className="flex items-center gap-1">
                      <span className="text-[9px] text-ink-muted font-bold font-sans uppercase">Max:</span>
                      <input 
                        type="number" 
                        value={sub.maxMarks} 
                        onChange={(e) => handleUpdateMarks(sub, 'maxMarks', parseInt(e.target.value, 10) || 0)}
                        className="w-10 py-0.5 px-1 bg-white font-mono text-center border border-border-custom rounded text-ink focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent" 
                      />
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-[9px] text-ink-muted font-bold font-sans uppercase">Pass:</span>
                      <input 
                        type="number" 
                        value={sub.passMarks} 
                        onChange={(e) => handleUpdateMarks(sub, 'passMarks', parseInt(e.target.value, 10) || 0)}
                        className="w-10 py-0.5 px-1 bg-white font-mono text-center border border-border-custom rounded text-ink focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent" 
                      />
                    </div>
                  </div>

                  {/* Delete Subject Button */}
                  {subjects.length > 1 ? (
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm(`Deleting "${sub.name}" removes score attributes for ALL registered students. Proceed?`)) {
                          onDeleteSubject(sub.id);
                        }
                      }}
                      className="text-ink-muted hover:text-red-700 p-1 hover:bg-red-50 rounded transition-colors cursor-pointer"
                      title="Decommission Subject"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Input Addition Side */}
        <div className="lg:col-span-5 bg-gray-50/50 p-3 rounded border border-border-custom">
          <h4 className="text-[10px] font-black text-ink uppercase tracking-wider mb-2.5">Introduce New Subject</h4>
          
          <form onSubmit={handleSubmit} className="space-y-2.5">
            {error && <p className="text-[10px] font-bold text-red-700 bg-red-50 rounded p-1.5 border border-red-200">{error}</p>}
            {success && <p className="text-[10px] font-bold text-emerald-800 bg-emerald-50 rounded p-1.5 border border-emerald-200">Subject enrolled successfully!</p>}

            <div>
              <label htmlFor="new-course-name" className="block text-[9px] font-bold text-ink-muted uppercase tracking-widest mb-1">Course Title</label>
              <input 
                id="new-course-name"
                type="text" 
                placeholder="e.g. Art & Drawing" 
                value={newSubName}
                onChange={(e) => setNewSubName(e.target.value)}
                className="w-full text-xs py-1 px-2 bg-white border border-border-custom rounded text-ink focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent placeholder:text-gray-400"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label htmlFor="new-course-max" className="block text-[9px] font-bold text-ink-muted uppercase tracking-widest mb-1">Max Score</label>
                <input 
                  id="new-course-max"
                  type="number" 
                  value={newSubMax}
                  min="1"
                  onChange={(e) => setNewSubMax(parseInt(e.target.value, 10) || 0)}
                  className="w-full font-mono text-center text-xs py-1 px-2 bg-white border border-border-custom rounded text-ink focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent"
                />
              </div>

              <div>
                <label htmlFor="new-course-pass" className="block text-[9px] font-bold text-ink-muted uppercase tracking-widest mb-1">Pass Score</label>
                <input 
                  id="new-course-pass"
                  type="number" 
                  value={newSubPass}
                  min="0"
                  onChange={(e) => setNewSubPass(parseInt(e.target.value, 10) || 0)}
                  className="w-full font-mono text-center text-xs py-1 px-2 bg-white border border-border-custom rounded text-ink focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent"
                />
              </div>
            </div>

            <button
              id="enroll-subject-btn"
              type="submit"
              className="w-full flex items-center justify-center gap-1 text-[11px] font-bold text-white bg-accent hover:bg-accent-hover py-1.5 px-3 rounded transition-colors cursor-pointer"
            >
              <Plus className="w-3 h-3" />
              Enroll Course Subject
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
