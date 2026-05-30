/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Subject, Student, StudentCalculated } from '../types';
import { calculateStudentResults } from '../utils';
import { Printer, Sparkles, BrainCircuit, Calendar, Award, FileText, Check, LoaderCircle, GraduationCap } from 'lucide-react';

interface ReportCardProps {
  student: Student;
  subjects: Subject[];
  onUpdateStudent: (updated: Student) => void;
}

export default function ReportCard({ student, subjects, onUpdateStudent }: ReportCardProps) {
  const [loadingAI, setLoadingAI] = useState(false);
  const [aiError, setAiError] = useState('');

  const result: StudentCalculated = calculateStudentResults(student, subjects);

  const handleGenerateAIRemarks = async () => {
    setLoadingAI(true);
    setAiError('');

    try {
      const response = await fetch('/api/generate-remarks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentName: student.name,
          rollNumber: student.rollNumber,
          gradeClass: student.gradeClass,
          subjects: subjects.map(sub => ({
            name: sub.name,
            score: student.marks[sub.id] !== undefined ? student.marks[sub.id] : 0,
            max: sub.maxMarks,
            pass: sub.passMarks,
            grade: result.subjectResults[sub.id]?.grade || 'F',
            status: result.subjectResults[sub.id]?.status || 'FAIL'
          })),
          overallPercentage: result.percentage,
          overallGrade: result.grade,
          overallStatus: result.status,
          cgpa: result.cgpa
        })
      });

      if (!response.ok) {
        throw new Error('Failed to reach AI feedback service. Verify server connection.');
      }

      const data = await response.json();
      
      if (data.remarks) {
        onUpdateStudent({
          ...student,
          aiRemarks: data.remarks
        });
      } else {
        throw new Error('Empirical AI response template empty.');
      }
    } catch (err: any) {
      setAiError(err.message || 'Connecting to Gemini AI failed. Please try again.');
    } finally {
      setLoadingAI(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div id="report-card-view-wrapper" className="space-y-4">
      
      {/* Top Controller Bar */}
      <div id="report-controls" className="flex flex-wrap items-center justify-between gap-3 bg-panel p-3 rounded border border-border-custom print:hidden">
        <div className="flex items-center gap-1.5">
          <GraduationCap className="text-accent w-4 h-4 shrink-0" />
          <h3 className="font-sans font-bold text-xs text-ink">
            Active Student: <span className="font-black text-accent">{student.name}</span>
          </h3>
        </div>
        
        <div className="flex items-center gap-2">
          {/* AI Generation Button */}
          <button
            id="ai-generate-remarks-btn"
            onClick={handleGenerateAIRemarks}
            disabled={loadingAI}
            className={`flex items-center gap-1 text-[11px] font-bold py-1 px-2.5 rounded border transition-all cursor-pointer select-none ${
              student.aiRemarks 
                ? 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border-emerald-200'
                : 'bg-accent text-white border-accent hover:bg-accent-hover'
            }`}
          >
            {loadingAI ? (
              <LoaderCircle className="w-3.5 h-3.5 animate-spin text-white" />
            ) : student.aiRemarks ? (
              <Check className="w-3.5 h-3.5 text-emerald-600" />
            ) : (
              <Sparkles className="w-3.5 h-3.5 text-white" />
            )}
            {loadingAI ? 'Analyzing with AI...' : student.aiRemarks ? 'Regenerate AI Remarks' : 'Compute AI Remarks'}
          </button>

          {/* Standard Browser Print */}
          <button
            id="print-report-card-btn"
            onClick={handlePrint}
            className="flex items-center gap-1 text-[11px] font-bold text-ink bg-white border border-border-custom hover:bg-gray-50 py-1 px-2.5 rounded transition-all cursor-pointer"
          >
            <Printer className="w-3 h-3 text-ink-muted" />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {aiError && (
        <div id="ai-error-banner" className="bg-red-50 text-red-700 text-[11px] p-2.5 rounded border border-red-250 flex gap-1.5 items-center shrink-0 print:hidden">
          <BrainCircuit className="w-3.5 h-3.5 text-red-650" />
          <span><strong>AI Evaluation Error:</strong> {aiError} (Check that you have input your `GEMINI_API_KEY` in settings).</span>
        </div>
      )}

      {/* The Printable Report Card Document Sheet */}
      <div 
        id="printable-report-card" 
        className="bg-panel border border-border-custom p-6 md:p-8 rounded shadow-sm max-w-4xl mx-auto font-sans relative overflow-hidden print:border-0 print:shadow-none print:p-0"
      >
        
        {/* Certificate Style Border Accent */}
        <div className="absolute inset-1.5 border border-gray-100 rounded pointer-events-none print:hidden"></div>

        {/* School Crest and Heading */}
        <div className="text-center space-y-2 relative z-10 border-b border-ink pb-4 mb-5">
          <div className="flex justify-center mb-0.5">
            <span className="p-1.5 bg-gray-50 border border-ink rounded inline-block">
              <GraduationCap className="w-6 h-6 text-ink" />
            </span>
          </div>
          <div>
            <h1 className="font-serif tracking-tight text-base sm:text-lg font-bold text-ink uppercase">
              Imperial College of Sciences & Arts
            </h1>
            <p className="text-[9px] font-mono tracking-widest text-ink-muted uppercase mt-0.5">
              Accredited Secondary Board of Education • Academic Division
            </p>
          </div>
          <div className="w-full h-px bg-ink mt-2"></div>
          <h2 className="font-sans font-black tracking-widest text-[11px] text-ink uppercase mt-1.5">
            Official Report Card & Evaluation Transcript
          </h2>
        </div>

        {/* Student Biographical Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-y-3 gap-x-4 text-[11px] border-b border-gray-100 pb-4 mb-4">
          <div>
            <span className="block text-[8px] font-bold text-ink-muted uppercase tracking-wider">Student Name:</span>
            <span className="text-xs font-bold text-ink">{student.name}</span>
          </div>
          <div>
            <span className="block text-[8px] font-bold text-ink-muted uppercase tracking-wider">Roll Number:</span>
            <span className="text-xs font-mono font-bold text-ink uppercase">{student.rollNumber}</span>
          </div>
          <div>
            <span className="block text-[8px] font-bold text-ink-muted uppercase tracking-wider">Class / Section:</span>
            <span className="text-xs font-bold text-ink-muted">{student.gradeClass}</span>
          </div>
          <div>
            <span className="block text-[8px] font-bold text-ink-muted uppercase tracking-wider">Academic Session:</span>
            <span className="text-xs font-bold text-ink-muted">{student.academicYear} - Term</span>
          </div>
        </div>

        {/* Subjects Grading Sheet Table */}
        <div className="mb-5">
          <h3 className="text-[10px] font-black text-ink uppercase tracking-widest mb-2 flex items-center gap-1 border-b border-border-custom pb-1">
            <span className="p-0.5 bg-ink text-white rounded shrink-0">
              <FileText className="w-2.5 h-2.5" />
            </span>
            I. Academic Subject Performance
          </h3>
          
          <table className="w-full text-left font-sans text-xs border-collapse">
            <thead>
              <tr className="border-b border-ink bg-gray-50 text-[9px] font-bold text-ink uppercase tracking-wider">
                <th className="py-1 px-2.5">Subject Description</th>
                <th className="py-1 px-2.5 text-center">Max Score</th>
                <th className="py-1 px-2.5 text-center">Pass Threshold</th>
                <th className="py-1 px-2.5 text-center">Marks Obtained</th>
                <th className="py-1 px-2.5 text-center">Percentage</th>
                <th className="py-1 px-2.5 text-center">Letter Grade</th>
                <th className="py-1 px-2.5 text-right">Result Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {subjects.map((sub) => {
                const row = result.subjectResults[sub.id];
                const marksVal = row ? row.marks : 0;
                const statusVal = row ? row.status : 'FAIL';
                const gradeVal = row ? row.grade : 'F';
                const percentVal = row ? Number(row.percentage.toFixed(1)) : 0;

                return (
                  <tr key={sub.id} className="hover:bg-gray-55">
                    <td className="py-2 px-2.5 font-bold text-ink">{sub.name}</td>
                    <td className="py-2 px-2.5 text-center font-mono text-ink-muted">{sub.maxMarks}</td>
                    <td className="py-2 px-2.5 text-center font-mono text-ink-muted">{sub.passMarks}</td>
                    <td className={`py-2 px-2.5 text-center font-mono font-bold ${marksVal < sub.passMarks ? 'text-red-700 bg-red-55' : 'text-ink'}`}>
                      {marksVal}
                    </td>
                    <td className="py-2 px-2.5 text-center font-mono text-ink-muted">{percentVal}%</td>
                    <td className="py-2 px-2.5 text-center font-mono font-extrabold text-ink">{gradeVal}</td>
                    <td className="py-2 px-2.5 text-right">
                      <span className={`inline-block text-[8px] font-bold uppercase tracking-wider py-0.5 px-1 rounded ${
                        statusVal === 'PASS' ? 'pill-pass' : 'pill-fail'
                      }`}>
                        {statusVal}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Summary Metric Counters */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 p-3 bg-gray-50 rounded border border-border-custom mb-5">
          <div>
            <span className="block text-[8px] font-bold text-ink-muted uppercase tracking-wider">Aggregate score:</span>
            <span className="text-xs font-black font-mono text-ink">
              {result.totalObtained} <span className="text-[10px] text-ink-muted">/ {result.totalMax}</span>
            </span>
          </div>
          <div>
            <span className="block text-[8px] font-bold text-ink-muted uppercase tracking-wider">Overall Percentage:</span>
            <span className="text-xs font-black font-mono text-ink">{result.percentage}%</span>
          </div>
          <div>
            <span className="block text-[8px] font-bold text-ink-muted uppercase tracking-wider">Cumulative GPA:</span>
            <span className="text-xs font-black font-mono text-accent">
              {result.cgpa} <span className="text-[9px] text-ink-muted font-normal font-sans">CGPA</span>
            </span>
          </div>
          <div>
            <span className="block text-[8px] font-bold text-ink-muted uppercase tracking-wider">Enrollment Status:</span>
            <span className={`inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-wider ${
              result.status === 'PASS' ? 'text-emerald-800 font-extrabold' : 'text-red-800 font-extrabold'
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${result.status === 'PASS' ? 'bg-emerald-600' : 'bg-red-650'}`}></span>
              {result.status === 'PASS' ? 'PASSED / PROMOTED' : 'FAILED / RE-ASSESS'}
            </span>
          </div>
        </div>

        {/* Remarks and Comments Double Column */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-gray-150 pt-4 mb-6">
          {/* Section A: Class Teacher Remarks */}
          <div className="space-y-1">
            <h4 className="text-[9px] font-black text-ink uppercase tracking-widest border-b border-gray-100 pb-0.5">
              II. Homeroom Instructor Remarks
            </h4>
            <div className="bg-gray-50/50 p-3 rounded border border-border-custom text-[11px] leading-snug text-ink italic min-h-[70px] flex items-center">
              {student.customRemarks ? (
                <span>&ldquo;{student.customRemarks}&rdquo;</span>
              ) : (
                <span className="text-ink-muted not-italic">No custom progress notes submitted. Standard course parameters are successfully updated.</span>
              )}
            </div>
          </div>

          {/* Section B: Smart AI Remarks */}
          <div className="space-y-1">
            <h4 className="text-[9px] font-black text-ink uppercase tracking-widest border-b border-gray-100 pb-0.5 flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5 text-accent print:hidden shrink-0" />
              III. AI Academic Counselor Remarks
            </h4>
            <div className="bg-blue-50/15 p-3 rounded border border-border-custom text-[10px] sm:text-[11px] leading-snug text-ink min-h-[70px] relative">
              {student.aiRemarks ? (
                <div id="school-remarks-ai">
                  <div className="absolute top-1.5 right-1.5 text-[7px] uppercase tracking-wider bg-emerald-50 border border-emerald-200 text-emerald-800 py-0.5 px-1 rounded font-extrabold print:hidden shrink-0">
                    AI Verified
                  </div>
                  <span className="text-ink">{student.aiRemarks}</span>
                </div>
              ) : (
                <div className="h-full flex flex-col justify-center items-center text-center py-1 shrink-0">
                  <p className="text-ink-muted font-bold block text-[10px]">No generative remarks on file.</p>
                  <button
                    id="ai-generate-in-box-btn"
                    onClick={handleGenerateAIRemarks}
                    disabled={loadingAI}
                    className="mt-1.5 text-[9px] font-black text-accent bg-white hover:bg-gray-50 border border-border-custom py-0.5 px-2 rounded transition-colors print:hidden shrink-0 cursor-pointer"
                  >
                    {loadingAI ? 'Calculating Insight Metrics...' : 'Compute AI Guidance Remarks'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Certificate / Official Signatures Section */}
        <div className="grid grid-cols-3 gap-3 text-center mt-6 pt-5 border-t border-ink text-[9px] font-bold text-ink-muted uppercase tracking-widest">
          <div className="space-y-2">
            <div className="h-6 border-b border-border-custom mx-2"></div>
            <span>Academic Registrar</span>
          </div>
          <div className="space-y-2 flex flex-col justify-end items-center">
            {/* Round School Seal Drawn via CSS */}
            <div className="w-12 h-12 border border-dashed border-border-custom rounded-full flex items-center justify-center text-[7px] font-black opacity-60 relative shrink-0">
              <span className="absolute text-[5px]">IMPERIAL</span>
              <span className="rotate-45 relative translate-y-1">BOARD</span>
            </div>
            <span>Official Seal</span>
          </div>
          <div className="space-y-2">
            <div className="h-6 border-b border-border-custom mx-2"></div>
            <span>Guardian Signature</span>
          </div>
        </div>

      </div>

    </div>
  );
}
