/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Student, Subject } from './types';

export const DEFAULT_SUBJECTS: Subject[] = [
  { id: 'math', name: 'Mathematics', maxMarks: 100, passMarks: 35 },
  { id: 'science', name: 'Science', maxMarks: 100, passMarks: 35 },
  { id: 'english', name: 'English', maxMarks: 100, passMarks: 35 },
  { id: 'history', name: 'History', maxMarks: 100, passMarks: 35 },
  { id: 'computer', name: 'Computer Science', maxMarks: 100, passMarks: 35 }
];

export const INITIAL_STUDENTS: Student[] = [
  {
    id: 'st-01',
    name: 'Aarav Sharma',
    rollNumber: 'S2026-01',
    gradeClass: 'Class 10 A',
    academicYear: '2026',
    marks: {
      math: 95,
      science: 89,
      english: 84,
      history: 76,
      computer: 98
    },
    customRemarks: 'Aarav is an exceptional student. He displays sharp logical clarity and problem-solving skills, and maintains a perfect performance in computer sciences.',
    aiRemarks: 'Aarav has displayed stellar academic proficiency across all subjects, particularly in Computer Science and Mathematics. He displays sharp analytical focus. Keep maintaining this exceptional momentum!'
  },
  {
    id: 'st-02',
    name: 'Emily Watson',
    rollNumber: 'S2026-02',
    gradeClass: 'Class 10 A',
    academicYear: '2026',
    marks: {
      math: 82,
      science: 90,
      english: 95,
      history: 88,
      computer: 85
    },
    customRemarks: 'Emily possesses marvelous presentation skills. Her command over language and literature is exemplary.',
    aiRemarks: 'Emily shows outstanding competency. Her English literature scores are exemplary. Her dedication to details is highly commendable. Great work!'
  },
  {
    id: 'st-03',
    name: 'Rohan Das',
    rollNumber: 'S2026-03',
    gradeClass: 'Class 10 B',
    academicYear: '2026',
    marks: {
      math: 42,
      science: 55,
      english: 50,
      history: 63,
      computer: 58
    },
    customRemarks: 'Rohan is a well-behaved student. However, he is encouraged to focus on quantitative topics in Mathematics.',
    aiRemarks: 'Rohan has successfully cleared all subjects. While his creative performance is sound, standard mathematical training and homework assistance will help him score much better in the next term.'
  },
  {
    id: 'st-04',
    name: 'Priya Patel',
    rollNumber: 'S2026-04',
    gradeClass: 'Class 10 A',
    academicYear: '2026',
    marks: {
      math: 88,
      science: 30,
      english: 72,
      history: 65,
      computer: 81
    },
    customRemarks: 'Priya is highly capable, but failed in Science by reaching only 30. A re-test in Science is scheduled.',
    aiRemarks: 'Priya exhibits great potential in Mathematics and Computer Science. Unfortunately, she fell short of the pass mark in Science. With targeted remedial help in physics and lab theories, she will comfortably pass other evaluations.'
  }
];
