/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Subject, Student } from '../types';
import { Plus, Save, RotateCcw, ShieldAlert, Check } from 'lucide-react';

interface StudentFormProps {
  subjects: Subject[];
  onSave: (student: Student) => void;
  editingStudent: Student | null;
  onCancelEdit: () => void;
}

export default function StudentForm({ subjects, onSave, editingStudent, onCancelEdit }: StudentFormProps) {
  const [name, setName] = useState('');
  const [rollNumber, setRollNumber] = useState('');
  const [gradeClass, setGradeClass] = useState('Class 10 A');
  const [academicYear, setAcademicYear] = useState('2026');
  const [customRemarks, setCustomRemarks] = useState('');
  const [marks, setMarks] = useState<Record<string, number>>({});
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Initialize/Reset marks when subjects or editing student change
  useEffect(() => {
    if (editingStudent) {
      setName(editingStudent.name);
      setRollNumber(editingStudent.rollNumber);
      setGradeClass(editingStudent.gradeClass);
      setAcademicYear(editingStudent.academicYear);
      setCustomRemarks(editingStudent.customRemarks || '');
      
      const newMarks: Record<string, number> = {};
      subjects.forEach((sub) => {
        newMarks[sub.id] = editingStudent.marks[sub.id] !== undefined ? editingStudent.marks[sub.id] : 0;
      });
      setMarks(newMarks);
    } else {
      resetForm();
    }
  }, [editingStudent, subjects]);

  const resetForm = () => {
    setName('');
    setRollNumber('');
    setCustomRemarks('');
    const initialMarks: Record<string, number> = {};
    subjects.forEach((sub) => {
      initialMarks[sub.id] = 0;
    });
    setMarks(initialMarks);
    setError('');
  };

  const handleMarkChange = (subjectId: string, value: string) => {
    const num = value === '' ? 0 : Math.min(Math.max(parseInt(value, 10) || 0, 0), 100);
    setMarks((prev) => ({
      ...prev,
      [subjectId]: num,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    // Validate inputs
    if (!name.trim()) {
      setError('Student name is required');
      return;
    }
    if (!rollNumber.trim()) {
      setError('Roll number or ID is required');
      return;
    }

    const studentToSave: Student = {
      id: editingStudent ? editingStudent.id : `st-${Date.now()}`,
      name: name.trim(),
      rollNumber: rollNumber.trim().toUpperCase(),
      gradeClass: gradeClass.trim(),
      academicYear: academicYear.trim(),
      marks,
      customRemarks: customRemarks.trim() || undefined,
      aiRemarks: editingStudent ? editingStudent.aiRemarks : undefined, // preserve old AI remarks unless refreshed
    };

    onSave(studentToSave);
    setSuccess(true);
    
    // Auto clear success indicator
    setTimeout(() => {
      setSuccess(false);
    }, 3000);

    if (!editingStudent) {
      resetForm();
    }
  };

  return (
    <div id="student-form-component" className="bg-panel border border-border-custom rounded p-4">
      <div className="flex items-center justify-between border-b border-border-custom pb-2.5 mb-3.5">
        <div>
          <h3 id="form-title" className="font-sans font-bold tracking-tight text-xs text-ink uppercase">
            {editingStudent ? 'Edit Student Grade' : 'New Record Entry'}
          </h3>
          <p className="text-ink-muted text-[10px] mt-0.5">
            {editingStudent ? 'Modify student parameters and update scores.' : 'Enter personal details and subject-wise metrics.'}
          </p>
        </div>
        {editingStudent && (
          <button
            id="cancel-edit-btn"
            type="button"
            onClick={onCancelEdit}
            className="text-[10px] font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 py-1 px-2 rounded border border-amber-200 transition-colors"
          >
            Cancel Edit
          </button>
        )}
      </div>

      <form id="student-record-form" onSubmit={handleSubmit} className="space-y-3.5">
        {error && (
          <div id="form-error-msg" className="flex items-start gap-1.5 bg-red-50 text-red-700 text-[11px] p-2 rounded border border-red-200">
            <ShieldAlert className="w-3.5 h-3.5 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div id="form-success-msg" className="flex items-start gap-1.5 bg-emerald-50 text-emerald-800 text-[11px] p-2 rounded border border-emerald-200">
            <Check className="w-3.5 h-3.5 shrink-0 mt-0.5" />
            <span>Success: State fully synchronized.</span>
          </div>
        )}

        {/* Text Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label htmlFor="student-name-input" className="block text-[10px] font-bold text-ink-muted uppercase tracking-wider mb-1">
              Full Student Name <span className="text-red-500">*</span>
            </label>
            <input
              id="student-name-input"
              type="text"
              placeholder="e.g. Liam Anderson"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full text-xs py-1 px-2 border border-border-custom rounded bg-white text-ink focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-colors placeholder:text-gray-400"
            />
          </div>

          <div>
            <label htmlFor="student-roll-input" className="block text-[10px] font-bold text-ink-muted uppercase tracking-wider mb-1">
              Roll/Admission ID <span className="text-red-500">*</span>
            </label>
            <input
              id="student-roll-input"
              type="text"
              placeholder="e.g. S2026-05"
              value={rollNumber}
              onChange={(e) => setRollNumber(e.target.value)}
              className="w-full text-xs py-1 px-2 border border-border-custom rounded bg-white text-ink focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-colors uppercase placeholder:text-gray-400"
            />
          </div>

          <div>
            <label htmlFor="student-grade-select" className="block text-[10px] font-bold text-ink-muted uppercase tracking-wider mb-1">
              Grade Class
            </label>
            <select
              id="student-grade-select"
              value={gradeClass}
              onChange={(e) => setGradeClass(e.target.value)}
              className="w-full text-xs py-1 px-2 border border-border-custom rounded bg-white text-ink focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-colors"
            >
              <option value="Class 10 A">Class 10 A</option>
              <option value="Class 10 B">Class 10 B</option>
              <option value="Class 11 Science">Class 11 Science</option>
              <option value="Class 11 Commerce">Class 11 Commerce</option>
              <option value="Class 12 Science">Class 12 Science</option>
            </select>
          </div>

          <div>
            <label htmlFor="student-year-input" className="block text-[10px] font-bold text-ink-muted uppercase tracking-wider mb-1">
              Academic Year
            </label>
            <input
              id="student-year-input"
              type="text"
              placeholder="e.g. 2026"
              value={academicYear}
              onChange={(e) => setAcademicYear(e.target.value)}
              className="w-full text-xs py-1 px-2 border border-border-custom rounded bg-white text-ink focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-colors placeholder:text-gray-400"
            />
          </div>
        </div>

        {/* Dynamic Marks Grid */}
        <div className="pt-2 border-t border-gray-100">
          <h4 className="text-[10px] font-black text-ink uppercase tracking-wider mb-2">
            Subject-Wise Scores (0 to 100)
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {subjects.map((sub) => (
              <div key={sub.id} className="bg-gray-50/80 p-1.5 border border-border-custom rounded flex flex-col justify-between">
                <label htmlFor={`mark-${sub.id}`} className="block text-[9px] font-bold text-ink-muted uppercase truncate mb-1">
                  {sub.name}
                </label>
                <div className="flex items-center gap-1">
                  <input
                    id={`mark-${sub.id}`}
                    type="number"
                    min="0"
                    max="100"
                    placeholder="0"
                    value={marks[sub.id] !== undefined ? marks[sub.id] : ''}
                    onChange={(e) => handleMarkChange(sub.id, e.target.value)}
                    className="w-full text-xs py-0.5 px-1 text-center font-mono font-medium border border-border-custom rounded bg-white focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent text-ink"
                  />
                  <span className="text-[9px] text-ink-muted font-mono shrink-0">/100</span>
                </div>
                <div className="text-[8px] text-ink-muted font-mono mt-0.5">
                  Pass: {sub.passMarks}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Teacher Remarks */}
        <div className="pt-2 border-t border-gray-100">
          <label htmlFor="student-remarks-input" className="block text-[10px] font-bold text-ink-muted uppercase tracking-wider mb-1">
            Teacher Progress Commentary
          </label>
          <textarea
            id="student-remarks-input"
            rows={2}
            placeholder="Write key academic highlights or recommended coaching strategies for this student..."
            value={customRemarks}
            onChange={(e) => setCustomRemarks(e.target.value)}
            className="w-full text-xs py-1.5 px-2 border border-border-custom rounded bg-white focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent text-ink transition-colors placeholder:text-gray-400 resize-none font-sans"
          />
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-end gap-2 pt-3.5 border-t border-border-custom">
          <button
            id="reset-form-btn"
            type="button"
            onClick={resetForm}
            className="flex items-center gap-1 text-[11px] font-bold text-ink bg-white border border-border-custom hover:bg-gray-50 py-1.5 px-3 rounded transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            Reset Form
          </button>
          
          <button
            id="save-record-btn"
            type="submit"
            className="flex items-center gap-1 text-[11px] font-bold text-white bg-accent hover:bg-accent-hover py-1.5 px-4 rounded transition-all cursor-pointer"
          >
            {editingStudent ? <Save className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
            {editingStudent ? 'Update Grade' : 'Append Record'}
          </button>
        </div>
      </form>
    </div>
  );
}
