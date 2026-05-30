/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Student, Subject, StudentCalculated, SubjectResult, ClassAnalytics } from './types';

/**
 * Returns the letter grade and course grade point based on score percentage
 */
export function getGradeAndGP(percentage: number): { grade: string; gp10: number; gp4: number } {
  if (percentage >= 90) return { grade: 'A+', gp10: 10.0, gp4: 4.0 };
  if (percentage >= 80) return { grade: 'A', gp10: 9.0, gp4: 3.7 };
  if (percentage >= 70) return { grade: 'B+', gp10: 8.0, gp4: 3.3 };
  if (percentage >= 60) return { grade: 'B', gp10: 7.0, gp4: 3.0 };
  if (percentage >= 50) return { grade: 'C+', gp10: 6.0, gp4: 2.3 };
  if (percentage >= 40) return { grade: 'C', gp10: 5.0, gp4: 2.0 };
  if (percentage >= 35) return { grade: 'D', gp10: 4.0, gp4: 1.0 };
  return { grade: 'F', gp10: 0.0, gp4: 0.0 };
}

/**
 * Process raw student data and compute results
 */
export function calculateStudentResults(student: Student, subjects: Subject[]): StudentCalculated {
  let totalObtained = 0;
  let totalMax = 0;
  let allPassed = true;
  const subjectResults: Record<string, SubjectResult> = {};
  
  let gpaSum10 = 0;
  let gpaSum4 = 0;
  let subjectCount = 0;

  subjects.forEach((sub) => {
    const marks = student.marks[sub.id] !== undefined ? student.marks[sub.id] : 0;
    const max = sub.maxMarks;
    const pass = sub.passMarks;
    const percentage = max > 0 ? (marks / max) * 100 : 0;
    const status = marks >= pass ? 'PASS' : 'FAIL';
    
    if (status === 'FAIL') {
      allPassed = false;
    }

    const { grade, gp10, gp4 } = getGradeAndGP(percentage);
    
    totalObtained += marks;
    totalMax += max;
    
    gpaSum10 += gp10;
    gpaSum4 += gp4;
    subjectCount++;

    subjectResults[sub.id] = {
      subjectId: sub.id,
      subjectName: sub.name,
      marks,
      maxMarks: max,
      passMarks: pass,
      percentage,
      grade,
      status
    };
  });

  const overallPercentage = totalMax > 0 ? (totalObtained / totalMax) * 100 : 0;
  
  // Calculate average GPA
  const cgpa = subjectCount > 0 ? Number((gpaSum10 / subjectCount).toFixed(2)) : 0;
  const gpa = subjectCount > 0 ? Number((gpaSum4 / subjectCount).toFixed(2)) : 0;
  
  // Overall Grade represents average percentage grade
  const overallGrade = getGradeAndGP(overallPercentage).grade;
  const finalStatus = allPassed ? 'PASS' : 'FAIL';

  return {
    student,
    totalObtained,
    totalMax,
    percentage: Number(overallPercentage.toFixed(2)),
    cgpa,
    gpa,
    grade: overallGrade,
    status: finalStatus,
    subjectResults
  };
}

/**
 * Computes classroom statistics and subject comparison trends
 */
export function calculateClassAnalytics(students: Student[], subjects: Subject[]): ClassAnalytics {
  const totalStudents = students.length;
  if (totalStudents === 0) {
    return {
      totalStudents: 0,
      passedStudents: 0,
      failedStudents: 0,
      passPercentage: 0,
      classAveragePercentage: 0,
      topScorer: null,
      subjectPerformance: {}
    };
  }

  const calculated = students.map(st => calculateStudentResults(st, subjects));
  
  const passedStudents = calculated.filter(st => st.status === 'PASS').length;
  const failedStudents = totalStudents - passedStudents;
  const passPercentage = Number(((passedStudents / totalStudents) * 100).toFixed(1));
  
  const sumPercentage = calculated.reduce((sum, st) => sum + st.percentage, 0);
  const classAveragePercentage = Number((sumPercentage / totalStudents).toFixed(1));

  // Find top scorer
  let topSt = calculated[0];
  calculated.forEach(st => {
    if (st.percentage > topSt.percentage) {
      topSt = st;
    }
  });

  const topScorer = topSt ? {
    name: topSt.student.name,
    rollNumber: topSt.student.rollNumber,
    percentage: topSt.percentage
  } : null;

  // Initialize subject performance dictionary
  const subjectPerformance: Record<string, {
    subjectName: string;
    average: number;
    highest: number;
    passCount: number;
  }> = {};

  subjects.forEach(sub => {
    let subSum = 0;
    let subHighest = 0;
    let subPassCount = 0;

    calculated.forEach(st => {
      const res = st.subjectResults[sub.id];
      if (res) {
        subSum += res.marks;
        if (res.marks > subHighest) {
          subHighest = res.marks;
        }
        if (res.status === 'PASS') {
          subPassCount++;
        }
      }
    });

    subjectPerformance[sub.id] = {
      subjectName: sub.name,
      average: Number((subSum / totalStudents).toFixed(1)),
      highest: subHighest,
      passCount: subPassCount
    };
  });

  return {
    totalStudents,
    passedStudents,
    failedStudents,
    passPercentage,
    classAveragePercentage,
    topScorer,
    subjectPerformance
  };
}
