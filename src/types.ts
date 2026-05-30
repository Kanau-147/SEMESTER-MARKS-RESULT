/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Subject {
  id: string;
  name: string;
  maxMarks: number;
  passMarks: number;
}

export interface Student {
  id: string;
  name: string;
  rollNumber: string;
  gradeClass: string;
  academicYear: string;
  marks: Record<string, number>; // Maps subject.id -> score
  customRemarks?: string;
  aiRemarks?: string;
}

export interface SubjectResult {
  subjectId: string;
  subjectName: string;
  marks: number;
  maxMarks: number;
  passMarks: number;
  percentage: number;
  grade: string;
  status: 'PASS' | 'FAIL';
}

export interface StudentCalculated {
  student: Student;
  totalObtained: number;
  totalMax: number;
  percentage: number;
  cgpa: number; // 10.0 scale
  gpa: number;  // 4.0 scale
  grade: string;
  status: 'PASS' | 'FAIL';
  subjectResults: Record<string, SubjectResult>;
}

export interface ClassAnalytics {
  totalStudents: number;
  passedStudents: number;
  failedStudents: number;
  passPercentage: number;
  classAveragePercentage: number;
  topScorer: {
    name: string;
    rollNumber: string;
    percentage: number;
  } | null;
  subjectPerformance: Record<string, {
    subjectName: string;
    average: number;
    highest: number;
    passCount: number;
  }>;
}

export interface TerminalLine {
  text: string;
  type: 'input' | 'output' | 'error' | 'success' | 'system';
  timestamp: string;
}
