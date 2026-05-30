/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Subject, Student } from './types';
import { DEFAULT_SUBJECTS, INITIAL_STUDENTS } from './data';
import StudentForm from './components/StudentForm';
import StudentList from './components/StudentList';
import ReportCard from './components/ReportCard';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import SubjectConfig from './components/SubjectConfig';
import TerminalConsole from './components/TerminalConsole';
import { calculateClassAnalytics } from './utils';
import { 
  Users, 
  GraduationCap, 
  BookMarked, 
  Terminal as TerminalIcon, 
  FileText, 
  TrendingUp, 
  AlertCircle 
} from 'lucide-react';

export default function App() {
  const [students, setStudents] = useState<Student[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [activeTab, setActiveTab] = useState<'roster' | 'transcript' | 'analytics' | 'syllabus' | 'terminal'>('roster');
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  // Initialize data on load from local storage or seeds
  useEffect(() => {
    const savedStudents = localStorage.getItem('school_students_db');
    const savedSubjects = localStorage.getItem('school_subjects_db');

    if (savedSubjects) {
      setSubjects(JSON.parse(savedSubjects));
    } else {
      setSubjects(DEFAULT_SUBJECTS);
      localStorage.setItem('school_subjects_db', JSON.stringify(DEFAULT_SUBJECTS));
    }

    if (savedStudents) {
      const parsed = JSON.parse(savedStudents);
      setStudents(parsed);
      if (parsed.length > 0) {
        setSelectedStudentId(parsed[0].id);
      }
    } else {
      setStudents(INITIAL_STUDENTS);
      localStorage.setItem('school_students_db', JSON.stringify(INITIAL_STUDENTS));
      if (INITIAL_STUDENTS.length > 0) {
        setSelectedStudentId(INITIAL_STUDENTS[0].id);
      }
    }
  }, []);

  // Compute live analytics for high-density stats bar
  const analyticsResult = useMemo(() => {
    return calculateClassAnalytics(students, subjects);
  }, [students, subjects]);

  // Save state changes instantly for local durability
  const saveStudents = (updatedStudents: Student[]) => {
    setStudents(updatedStudents);
    localStorage.setItem('school_students_db', JSON.stringify(updatedStudents));
  };

  const saveSubjects = (updatedSubjects: Subject[]) => {
    setSubjects(updatedSubjects);
    localStorage.setItem('school_subjects_db', JSON.stringify(updatedSubjects));
  };

  // Student Actions
  const handleSaveStudent = (savedSt: Student) => {
    const index = students.findIndex((s) => s.id === savedSt.id);
    let updatedList: Student[] = [];

    if (index >= 0) {
      // Edit student
      updatedList = [...students];
      updatedList[index] = savedSt;
    } else {
      // Add new student
      updatedList = [...students, savedSt];
    }

    saveStudents(updatedList);
    setEditingStudent(null);
    setSelectedStudentId(savedSt.id); // auto-select newly active card
  };

  const handleDeleteStudent = (id: string) => {
    const updated = students.filter((s) => s.id !== id);
    saveStudents(updated);
    
    // Clean selection states
    if (editingStudent && editingStudent.id === id) {
      setEditingStudent(null);
    }
    if (selectedStudentId === id) {
      setSelectedStudentId(updated.length > 0 ? updated[0].id : null);
    }
  };

  const handleUpdateStudentFromReport = (updatedSt: Student) => {
    const updated = students.map(s => s.id === updatedSt.id ? updatedSt : s);
    saveStudents(updated);
  };

  const handleLoadEdit = (student: Student) => {
    setEditingStudent(student);
    setActiveTab('roster'); // auto shift tab to display the editor
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectStudent = (student: Student) => {
    setSelectedStudentId(student.id);
    setActiveTab('transcript'); // open transcript instantly on card select
  };

  // Dynamic Syllabus Actions
  const handleAddSubject = (newSub: Subject) => {
    const updatedSubjects = [...subjects, newSub];
    saveSubjects(updatedSubjects);

    // Expand marks mapping for all existing students
    const updatedStudents = students.map((st) => ({
      ...st,
      marks: {
        ...st.marks,
        [newSub.id]: 0 // initialize new marks field under score 0
      }
    }));
    saveStudents(updatedStudents);
  };

  const handleDeleteSubject = (subId: string) => {
    const updatedSubjects = subjects.filter((s) => s.id !== subId);
    saveSubjects(updatedSubjects);

    // Filter score parameters for all students
    const updatedStudents = students.map((st) => {
      const copyMarks = { ...st.marks };
      delete copyMarks[subId];
      return {
        ...st,
        marks: copyMarks
      };
    });
    saveStudents(updatedStudents);
  };

  const handleUpdateSubject = (updatedSub: Subject) => {
    const updated = subjects.map(s => s.id === updatedSub.id ? updatedSub : s);
    saveSubjects(updated);
  };

  // Wipe whole roster
  const handleClearRoster = () => {
    saveStudents([]);
    setSelectedStudentId(null);
    setEditingStudent(null);
  };

  // Find currently selected student object
  const activeStudent = students.find((s) => s.id === selectedStudentId) || null;

  return (
    <div className="min-h-screen bg-bg-primary text-ink flex flex-col font-sans select-none antialiased">
      {/* Upper Navigation Premium Header */}
      <header className="bg-panel border-b border-border-custom sticky top-0 z-50 print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center py-2 md:h-12 gap-3">
            
            {/* Title Brand Layout */}
            <div className="flex items-center gap-2">
              <span className="p-1 bg-accent rounded text-white flex justify-center items-center shrink-0">
                <GraduationCap className="w-4 h-4" />
              </span>
              <div>
                <h1 className="font-sans font-black tracking-tight text-xs text-ink uppercase leading-none">
                  STUDENT.ENGINE_v2
                </h1>
                <p className="text-[9px] uppercase font-mono tracking-wider text-ink-muted mt-0.5">
                  Live computation grid
                </p>
              </div>
            </div>

            {/* Live Stats Bar in Top Nav! */}
            <div className="flex items-center gap-4 text-[11px] text-ink-muted border-t border-gray-100 md:border-t-0 pt-2 md:pt-0">
              <div className="flex items-center gap-1">
                <span>Total Students:</span>
                <span className="font-bold text-ink font-mono">{analyticsResult.totalStudents}</span>
              </div>
              <div className="h-3 w-px bg-border-custom"></div>
              <div className="flex items-center gap-1">
                <span>Avg Class score:</span>
                <span className="font-bold text-ink font-mono">{analyticsResult.classAveragePercentage}%</span>
              </div>
              <div className="h-3 w-px bg-border-custom"></div>
              <div className="flex items-center gap-1">
                <span>Promoted:</span>
                <span className="font-bold text-ink font-mono">{analyticsResult.passPercentage}%</span>
              </div>
            </div>

            {/* Dashboard Navigation Switches */}
            <nav id="dashboard-navbar" className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0">
              <button
                id="tab-roster-selector"
                onClick={() => { setActiveTab('roster'); setEditingStudent(null); }}
                className={`flex items-center gap-1 text-[11px] font-semibold py-1 px-2.5 rounded border transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'roster' 
                    ? 'bg-accent text-white border-accent shadow-sm' 
                    : 'bg-white text-ink border-border-custom hover:bg-gray-50'
                }`}
              >
                <Users className="w-3 h-3" />
                <span>Roster Control</span>
              </button>

              <button
                id="tab-card-selector"
                onClick={() => setActiveTab('transcript')}
                disabled={!activeStudent}
                className={`flex items-center gap-1 text-[11px] font-semibold py-1 px-2.5 rounded border transition-all cursor-pointer whitespace-nowrap ${
                  !activeStudent ? 'opacity-40 cursor-not-allowed' : ''
                } ${
                  activeTab === 'transcript' 
                    ? 'bg-accent text-white border-accent shadow-sm' 
                    : 'bg-white text-ink border-border-custom hover:bg-gray-50'
                }`}
              >
                <FileText className="w-3 h-3" />
                <span>Transcript</span>
              </button>

              <button
                id="tab-analytics-selector"
                onClick={() => setActiveTab('analytics')}
                className={`flex items-center gap-1 text-[11px] font-semibold py-1 px-2.5 rounded border transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'analytics' 
                    ? 'bg-accent text-white border-accent shadow-sm' 
                    : 'bg-white text-ink border-border-custom hover:bg-gray-50'
                }`}
              >
                <TrendingUp className="w-3 h-3" />
                <span>Diagnostics</span>
              </button>

              <button
                id="tab-syllabus-selector"
                onClick={() => setActiveTab('syllabus')}
                className={`flex items-center gap-1 text-[11px] font-semibold py-1 px-2.5 rounded border transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'syllabus' 
                    ? 'bg-accent text-white border-accent shadow-sm' 
                    : 'bg-white text-ink border-border-custom hover:bg-gray-50'
                }`}
              >
                <BookMarked className="w-3 h-3" />
                <span>Curriculum</span>
              </button>

              <button
                id="tab-terminal-selector"
                onClick={() => setActiveTab('terminal')}
                className={`flex items-center gap-1 text-[11px] font-semibold py-1 px-2.5 rounded border transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'terminal' 
                    ? 'bg-accent text-white border-accent shadow-sm' 
                    : 'bg-white text-ink border-border-custom hover:bg-gray-50'
                }`}
              >
                <TerminalIcon className="w-3 h-3" />
                <span>CLI Terminal</span>
              </button>
            </nav>

          </div>
        </div>
      </header>

      {/* Main Workspace Frame */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 relative">
        
        {/* Dynamic Alerts if No Students Installed */}
        {students.length === 0 && activeTab !== 'terminal' && activeTab !== 'roster' && activeTab !== 'syllabus' && (
          <div className="bg-amber-50 text-amber-900 text-xs font-semibold p-3 rounded border border-amber-200 flex items-center gap-2 mb-4">
            <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
            <span>Core notification: Please enter student records inside the roster control panel before retrieving certificates or charts.</span>
          </div>
        )}

        {/* Tab View switching */}
        <div id="dynamic-canvas" className="space-y-4">
          
          {/* TAB A: Roster control (split ledger & form inputs) */}
          {activeTab === 'roster' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              
              {/* Form Input Frame */}
              <div className="lg:col-span-4 space-y-4">
                <StudentForm 
                  subjects={subjects}
                  onSave={handleSaveStudent}
                  editingStudent={editingStudent}
                  onCancelEdit={() => setEditingStudent(null)}
                />
              </div>

              {/* Ledger Lists Frame */}
              <div className="lg:col-span-8">
                <StudentList 
                  students={students}
                  subjects={subjects}
                  onSelectStudent={handleSelectStudent}
                  onEditStudent={handleLoadEdit}
                  onDeleteStudent={handleDeleteStudent}
                  selectedStudentId={selectedStudentId}
                />
              </div>

            </div>
          )}

          {/* TAB B: Indiv report transcripts */}
          {activeTab === 'transcript' && activeStudent && (
            <ReportCard 
              student={activeStudent}
              subjects={subjects}
              onUpdateStudent={handleUpdateStudentFromReport}
            />
          )}

          {/* TAB C: Class collective analytics charts */}
          {activeTab === 'analytics' && (
            <AnalyticsDashboard 
              students={students}
              subjects={subjects}
            />
          )}

          {/* TAB D: Syllabus modifications */}
          {activeTab === 'syllabus' && (
            <SubjectConfig 
              subjects={subjects}
              onAddSubject={handleAddSubject}
              onDeleteSubject={handleDeleteSubject}
              onUpdateSubject={handleUpdateSubject}
            />
          )}

          {/* TAB E: Developer prompt terminal */}
          {activeTab === 'terminal' && (
            <div className="max-w-4xl mx-auto space-y-4">
              <div className="bg-[#111827] border border-zinc-800 p-4 rounded text-xs text-zinc-400 select-text font-mono">
                <h4 className="font-sans font-bold text-xs text-white mb-2 uppercase flex items-center gap-1.5">
                  <TerminalIcon className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  CLI Terminal Instruction Guide
                </h4>
                <p className="text-[11px] text-zinc-400">
                  Welcome to the high-density terminal console. All commands execute live on the central state:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 my-2.5 text-[11px]">
                  <span>• <code className="text-emerald-400 font-semibold font-mono">list</code> : Prints dynamic table of students</span>
                  <span>• <code className="text-emerald-400 font-semibold font-mono">analyze</code> : Triggers deep class reports</span>
                  <span>• <code className="text-emerald-400 font-semibold font-mono">get &lt;roll_code&gt;</code> : Pulls student transcript summary</span>
                  <span>• <code className="text-emerald-400 font-semibold font-mono">delete &lt;roll_code&gt;</code> : Removes roll ID registry</span>
                  <span>• <code className="text-emerald-400 font-semibold font-mono">add &quot;Name&quot; &lt;roll&gt; 95 85..</code> : Inserts custom grades</span>
                  <span>• <code className="text-emerald-400 font-semibold font-mono">clear</code> / <code className="text-emerald-400 font-semibold font-mono">reset</code> : Wipes or re-boots window rows</span>
                </div>
              </div>
              <TerminalConsole 
                students={students}
                subjects={subjects}
                onAddStudent={handleSaveStudent}
                onDeleteStudent={handleDeleteStudent}
                onClearAll={handleClearRoster}
              />
            </div>
          )}

        </div>
      </main>

      {/* Small Elegant Footer */}
      <footer className="bg-panel border-t border-border-custom py-4 text-center text-[11px] text-ink-muted mt-auto print:hidden">
        <div className="max-w-7xl mx-auto px-4">
          <p>© 2026 STUDENT.ENGINE_v2 Centralized Database Admin Panel. All local state records synchronized.</p>
        </div>
      </footer>
    </div>
  );
}
