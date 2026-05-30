/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo } from 'react';
import { Subject, Student } from '../types';
import { calculateClassAnalytics, calculateStudentResults, getGradeAndGP } from '../utils';
import { BarChart3, TrendingUp, Award, Users, BookOpen, ThumbsUp, CheckCircle, HelpCircle } from 'lucide-react';

interface AnalyticsDashboardProps {
  students: Student[];
  subjects: Subject[];
}

export default function AnalyticsDashboard({ students, subjects }: AnalyticsDashboardProps) {
  const analytics = useMemo(() => {
    return calculateClassAnalytics(students, subjects);
  }, [students, subjects]);

  // Compile Grade Letter Distributions for visual bars
  const gradeDistribution = useMemo(() => {
    const gradesCount: Record<string, number> = {
      'A+': 0,
      'A': 0,
      'B+': 0,
      'B': 0,
      'C+': 0,
      'C': 0,
      'D': 0,
      'F': 0
    };

    students.forEach((st) => {
      const res = calculateStudentResults(st, subjects);
      if (gradesCount[res.grade] !== undefined) {
        gradesCount[res.grade]++;
      } else {
        gradesCount['F']++;
      }
    });

    return Object.entries(gradesCount).map(([grade, count]) => ({
      grade,
      count,
      percent: students.length > 0 ? (count / students.length) * 100 : 0
    }));
  }, [students, subjects]);

  if (students.length === 0) {
    return (
      <div id="analytics-empty-state" className="text-center py-8 px-4 bg-panel border border-border-custom rounded">
        <BarChart3 className="w-8 h-8 text-ink-muted mx-auto mb-2" />
        <h3 className="font-sans font-bold text-xs text-ink uppercase">Analytics Engines Offline</h3>
        <p className="text-ink-muted text-[10px] mt-1 max-w-sm mx-auto">
          Please add student records with examination marks to populate the aggregate performance metrics dashboard.
        </p>
      </div>
    );
  }

  return (
    <div id="analytics-dashboard-grid" className="space-y-4">
      
      {/* 4 Bento Statistical Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Core A: Total Enrolled */}
        <div className="bg-panel border border-border-custom p-3.5 rounded">
          <div className="flex items-center justify-between pb-1.5 border-b border-gray-100 mb-2">
            <span className="text-[9px] font-black text-ink-muted uppercase tracking-wider">Total Enrolled</span>
            <span className="p-1 bg-gray-50 border border-border-custom rounded text-ink-muted">
              <Users className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-lg font-black text-ink font-mono">{analytics.totalStudents}</span>
            <span className="text-[10px] text-ink-muted font-bold font-sans uppercase">Students</span>
          </div>
          <div className="flex items-center gap-1 text-[9px] text-ink-muted mt-1.5">
            <span className="w-1 h-1 rounded-full bg-emerald-500"></span>
            <span>All records fully calculated</span>
          </div>
        </div>

        {/* Core B: Promotion Pass Rate */}
        <div className="bg-panel border border-border-custom p-3.5 rounded">
          <div className="flex items-center justify-between pb-1.5 border-b border-gray-100 mb-2">
            <span className="text-[9px] font-black text-ink-muted uppercase tracking-wider">Promoted Pass Rate</span>
            <span className="p-1 bg-emerald-50 border border-emerald-200 rounded text-emerald-805">
              <CheckCircle className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-lg font-black text-emerald-805 font-mono">{analytics.passPercentage}%</span>
            <span className="text-[10px] text-ink-muted font-bold font-sans uppercase">Class Passing</span>
          </div>
          <div className="flex items-center gap-1 text-[9px] text-ink-muted mt-1.5">
            <span className="font-extrabold text-emerald-800 font-mono">{analytics.passedStudents}</span> Passed • 
            <span className="font-extrabold text-red-650 font-mono">{analytics.failedStudents}</span> Failed
          </div>
        </div>

        {/* Core C: Class Roster Average */}
        <div className="bg-panel border border-border-custom p-3.5 rounded">
          <div className="flex items-center justify-between pb-1.5 border-b border-gray-100 mb-2">
            <span className="text-[9px] font-black text-ink-muted uppercase tracking-wider">Class Average</span>
            <span className="p-1 bg-blue-50 border border-blue-200 rounded text-accent">
              <TrendingUp className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-lg font-black text-accent font-mono">{analytics.classAveragePercentage}%</span>
            <span className="text-[10px] text-ink-muted font-bold font-sans uppercase">Score Mean</span>
          </div>
          <div className="flex items-center gap-1 text-[9px] text-ink-muted mt-1.5">
            <span>Overall subject grading benchmark</span>
          </div>
        </div>

        {/* Core D: Valedictorian Leader */}
        <div className="bg-panel border border-border-custom p-3.5 rounded">
          <div className="flex items-center justify-between pb-1.5 border-b border-gray-100 mb-2">
            <span className="text-[9px] font-black text-ink-muted uppercase tracking-wider">Top Valedictorian</span>
            <span className="p-1 bg-amber-50 border border-amber-200 rounded text-amber-700">
              <Award className="w-3.5 h-3.5" />
            </span>
          </div>
          {analytics.topScorer ? (
            <div>
              <div className="flex items-baseline justify-between">
                <span className="text-xs font-black text-ink truncate max-w-[95px] block">{analytics.topScorer.name}</span>
                <span className="text-xs font-black font-mono text-amber-700 shrink-0">{analytics.topScorer.percentage}%</span>
              </div>
              <p className="text-[9px] text-ink-muted font-mono mt-1">Roll / Admission: {analytics.topScorer.rollNumber}</p>
            </div>
          ) : (
            <p className="text-[10px] text-ink-muted font-bold">Calculating...</p>
          )}
        </div>
      </div>

      {/* Grid of Graphs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Graph 1: Grade Distributions CSS Bar Chart */}
        <div className="bg-panel border border-border-custom p-4 rounded">
          <div className="flex items-center gap-1 border-b border-gray-100 pb-2 mb-3.5">
            <BarChart3 className="w-3.5 h-3.5 text-accent shrink-0" />
            <h4 id="grade-breakdown-heading" className="font-sans font-bold tracking-tight text-xs text-ink uppercase">
              Grade Letter Distribution (Class Spread)
            </h4>
          </div>
 
          <div className="space-y-2">
            {gradeDistribution.map((item) => (
              <div key={item.grade} className="flex items-center gap-2 text-xs">
                {/* Grade label */}
                <span className="w-6 font-mono font-black text-right text-xs text-ink">{item.grade}</span>
                
                {/* Horizontal dynamic gauge */}
                <div className="flex-1 bg-gray-100 h-5 rounded overflow-hidden relative border border-gray-50">
                  <div 
                    className={`h-full transition-all duration-700 ${
                      item.grade.startsWith('A') 
                        ? 'bg-emerald-500/85' 
                        : item.grade.startsWith('B')
                        ? 'bg-blue-500/85'
                        : item.grade.startsWith('C')
                        ? 'bg-amber-500/85'
                        : item.grade === 'D'
                        ? 'bg-orange-400/80'
                        : 'bg-red-500/80'
                    }`}
                    style={{ width: `${Math.max(item.percent, 3)}%` }}
                  ></div>
                  
                  {/* Floating count badge */}
                  {item.count > 0 && (
                    <span className="absolute inset-y-0 left-2 flex items-center font-bold text-[9px] text-black drop-shadow-sm font-mono">
                      {item.count} Student{item.count > 1 ? 's' : ''} ({Math.round(item.percent)}%)
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Graph 2: Subject Performance Metrics */}
        <div className="bg-panel border border-border-custom p-4 rounded">
          <div className="flex items-center gap-1 border-b border-gray-100 pb-2 mb-3.5">
            <BookOpen className="w-3.5 h-3.5 text-accent shrink-0" />
            <h4 id="subject-performance-heading" className="font-sans font-bold tracking-tight text-xs text-ink uppercase">
              Subject Scores & Evaluation Benchmarks
            </h4>
          </div>
 
          <div className="space-y-3.5 pt-0.5">
            {subjects.map((sub) => {
              const performance = analytics.subjectPerformance[sub.id];
              const average = performance ? performance.average : 0;
              const highest = performance ? performance.highest : 0;
              const passCount = performance ? performance.passCount : 0;
              const passRatio = analytics.totalStudents > 0 ? (passCount / analytics.totalStudents) * 100 : 0;

              return (
                <div key={sub.id} className="space-y-1 text-xs">
                  <div className="flex justify-between items-baseline">
                    <span className="font-sans font-bold text-ink">{sub.name}</span>
                    <span className="font-mono text-[9px] text-ink-muted">
                      Mean: <strong className="text-ink font-bold">{average}/100</strong> • Max: <strong className="text-accent font-bold">{highest}</strong>
                    </span>
                  </div>

                  {/* Range and marker bar */}
                  <div className="relative pt-0.5 pb-0.5">
                    {/* Clear background bar */}
                    <div className="w-full bg-gray-150 h-2.5 rounded overflow-hidden border border-gray-50 relative">
                      {/* Pass threshold line marker */}
                      <div 
                        className="absolute top-0 bottom-0 w-px bg-red-400 z-10" 
                        title="Passing Threshold"
                        style={{ left: `${sub.passMarks}%` }}
                      ></div>
                      
                      {/* Mean performance score bar */}
                      <div 
                        className={`h-full rounded transition-all duration-700 ${
                          average >= 75 
                            ? 'bg-emerald-500' 
                            : average >= 50 
                            ? 'bg-blue-400' 
                            : average >= 35 
                            ? 'bg-amber-400' 
                            : 'bg-red-400'
                        }`}
                        style={{ width: `${average}%` }}
                      ></div>
                    </div>
                    
                    {/* Ticks */}
                    <div className="flex justify-between text-[8px] text-ink-muted pt-0.5 font-mono">
                      <span>Pass threshold: {sub.passMarks}</span>
                      <span>Pass ratio: {Math.round(passRatio)}%</span>
                      <span>Max: 100</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
}
