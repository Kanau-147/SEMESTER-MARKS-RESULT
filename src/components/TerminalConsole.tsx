/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { Subject, Student, TerminalLine } from '../types';
import { calculateStudentResults, calculateClassAnalytics } from '../utils';
import { Terminal, ShieldCheck, ChevronRight, CornerDownLeft, Play } from 'lucide-react';

interface TerminalConsoleProps {
  students: Student[];
  subjects: Subject[];
  onAddStudent: (student: Student) => void;
  onDeleteStudent: (id: string) => void;
  onClearAll: () => void;
}

export default function TerminalConsole({
  students,
  subjects,
  onAddStudent,
  onDeleteStudent,
  onClearAll
}: TerminalConsoleProps) {
  const [history, setHistory] = useState<TerminalLine[]>([]);
  const [inputValue, setInputValue] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Print startup greeting
  useEffect(() => {
    initGreeting();
  }, []);

  // Auto-scroll terminal to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const initGreeting = () => {
    const timeStr = new Date().toISOString().replace('T', ' ').slice(0, 19);
    setHistory([
      { text: '==================================================', type: 'system', timestamp: timeStr },
      { text: '     IMPERIAL ACADEMIC TERMINAL SHELL v1.5a', type: 'system', timestamp: timeStr },
      { text: '     AUTHORIZED LEVEL 1 USER ADMINISTRATIVE ACCESS', type: 'system', timestamp: timeStr },
      { text: '     CORE CALCULATIONS SYNCHRONIZED WITH DATABASE', type: 'system', timestamp: timeStr },
      { text: '==================================================', type: 'system', timestamp: timeStr },
      { text: 'Type "help" or "?" to display all educational commands and syntax rules.', type: 'output', timestamp: timeStr },
      { text: 'Current database holds: ' + students.length + ' student grade sheets.', type: 'output', timestamp: timeStr }
    ]);
  };

  const handleTerminalClick = () => {
    inputRef.current?.focus();
  };

  const executeCommand = (cmdText: string) => {
    const trimmed = cmdText.trim();
    if (!trimmed) return;

    const timeStr = new Date().toISOString().replace('T', ' ').slice(0, 19);
    const newHistory = [...history, { text: `user@imperial:~$ ${trimmed}`, type: 'input', timestamp: timeStr }] as TerminalLine[];
    
    // Parse command parameters
    const parts = trimmed.split(' ');
    const command = parts[0].toLowerCase();
    const args = parts.slice(1);

    const appendOutput = (text: string, type: 'output' | 'error' | 'success' | 'system' = 'output') => {
      newHistory.push({ text, type, timestamp: timeStr });
    };

    switch (command) {
      case 'help':
      case '?':
        appendOutput('===================================================================', 'system');
        appendOutput('AVAILABLE COMMANDS AND BLUEPRINT SYNTAX:', 'system');
        appendOutput('===================================================================', 'system');
        appendOutput('  help, ?                         Show this educational directory map', 'output');
        appendOutput('  list, show                      Show and format all students in an ASCII grid', 'output');
        appendOutput('  get <roll_number>               Display comprehensive report sheet for roll ID', 'output');
        appendOutput('  add <name> <roll> <m> <s5> ...  Add student: Name must be quoted if containing spaces.', 'output');
        appendOutput('                                  Syntax: add "Full Name" S105 85 90 75 80 95', 'output');
        appendOutput('                                  Note: Marks map to standard subjects in order.', 'output');
        appendOutput('  delete <roll_number>            Remove student transcript by Roll admission code', 'output');
        appendOutput('  analyze                         Trigger collective mathematical classroom diagnostics', 'output');
        appendOutput('  clear, cls                      Clear terminal history rows', 'output');
        appendOutput('  reset                           Reload administrative shell settings', 'output');
        appendOutput('===================================================================', 'system');
        break;

      case 'clear':
      case 'cls':
        setHistory([]);
        setInputValue('');
        return;

      case 'reset':
        setHistory([]);
        setInputValue('');
        setTimeout(() => {
          initGreeting();
        }, 10);
        return;

      case 'list':
      case 'show':
        if (students.length === 0) {
          appendOutput('DATABASE EMPTY: No student transcripts found. Use "add" command or forms.', 'error');
        } else {
          appendOutput('+----------------------+-----------+-------+---------+--------+', 'system');
          appendOutput('| STUDENT NAME         | ROLL NO   | GRADE | PCT (%) | STATUS |', 'system');
          appendOutput('+----------------------+-----------+-------+---------+--------+', 'system');
          students.forEach((st) => {
            const res = calculateStudentResults(st, subjects);
            const rName = res.student.name.padEnd(20).substring(0, 20);
            const rRoll = res.student.rollNumber.padEnd(9).substring(0, 9);
            const rGrade = res.grade.padEnd(5).substring(0, 5);
            const rPercent = (res.percentage + '%').padEnd(7).substring(0, 7);
            const rStatus = res.status.padEnd(6).substring(0, 6);
            appendOutput(`| ${rName} | ${rRoll} | ${rGrade} | ${rPercent} | ${rStatus} |`, 'output');
          });
          appendOutput('+----------------------+-----------+-------+---------+--------+', 'system');
        }
        break;

      case 'get':
        if (args.length === 0) {
          appendOutput('ERROR: Syntax require Roll ID. Example: get S2026-01', 'error');
        } else {
          const searchRoll = args[0].toUpperCase();
          const found = students.find(st => st.rollNumber.toUpperCase() === searchRoll);
          if (!found) {
            appendOutput(`ERROR: Roll Number "${searchRoll}" not discovered in active registers.`, 'error');
          } else {
            const cr = calculateStudentResults(found, subjects);
            appendOutput('==============================================', 'system');
            appendOutput(`TRANSCRIPT REPORT: ${cr.student.name} (${cr.student.rollNumber})`, 'system');
            appendOutput(`CLASS: ${cr.student.gradeClass} | SESSION: ${cr.student.academicYear}`, 'system');
            appendOutput('==============================================', 'system');
            subjects.forEach((sub) => {
              const mk = cr.subjectResults[sub.id];
              const namePadded = sub.name.padEnd(18);
              const scoreHex = mk ? `${mk.marks}/${mk.maxMarks}` : '0/100';
              const sGrade = mk ? mk.grade : 'F';
              const sStatus = mk ? mk.status : 'FAIL';
              appendOutput(`  ${namePadded} : ${scoreHex} [Grade: ${sGrade} - ${sStatus}]`, 'output');
            });
            appendOutput('----------------------------------------------', 'system');
            appendOutput(`  Aggregate Obtained : ${cr.totalObtained} / ${cr.totalMax}`, 'output');
            appendOutput(`  Aggregate Ratio    : ${cr.percentage}%`, 'output');
            appendOutput(`  Cumulative GPAs    : CGPA ${cr.cgpa} (GPA ${cr.gpa})`, 'output');
            appendOutput(`  Official Evaluation: ${cr.status === 'PASS' ? 'PROMOTED (PASSED)' : 'RE-SCHED FAILURE (FAILED)'}`, cr.status === 'PASS' ? 'success' : 'error');
            appendOutput('==============================================', 'system');
          }
        }
        break;

      case 'delete':
        if (args.length === 0) {
          appendOutput('ERROR: Syntax requires Roll ID. Example: delete S2026-03', 'error');
        } else {
          const delRoll = args[0].toUpperCase();
          const target = students.find(st => st.rollNumber.toUpperCase() === delRoll);
          if (!target) {
            appendOutput(`ERROR: Student with roll code "${delRoll}" not found in database.`, 'error');
          } else {
            onDeleteStudent(target.id);
            appendOutput(`SUCCESS: Student record ${target.name} (${delRoll}) terminated from database index.`, 'success');
          }
        }
        break;

      case 'analyze':
        if (students.length === 0) {
          appendOutput('ERROR: No analytics possible. Student arrays are blank.', 'error');
        } else {
          const an = calculateClassAnalytics(students, subjects);
          appendOutput('==================================================', 'system');
          appendOutput('CLASSROOM STATISTICAL DIAGNOSTIC OUTCOMES:', 'system');
          appendOutput('==================================================', 'system');
          appendOutput(`  Total Enrolled  : ${an.totalStudents} students`, 'output');
          appendOutput(`  Passing Ratio  : ${an.passPercentage}% (${an.passedStudents} PASS, ${an.failedStudents} FAIL)`, 'output');
          appendOutput(`  Roster Average : ${an.classAveragePercentage}% cumulative`, 'output');
          if (an.topScorer) {
            appendOutput(`  Top Leader     : ${an.topScorer.name} (${an.topScorer.rollNumber}) with ${an.topScorer.percentage}%`, 'success');
          }
          appendOutput('--------------------------------------------------', 'system');
          appendOutput('Subject-Wise Class Performance averages:', 'system');
          subjects.forEach((sub) => {
            const perf = an.subjectPerformance[sub.id];
            const pAvg = perf ? perf.average : 0;
            const pHigh = perf ? perf.highest : 0;
            const subNamePadded = sub.name.padEnd(20);
            appendOutput(`  ${subNamePadded} Avg: ${pAvg}% | Highest: ${pHigh}/100`, 'output');
          });
          appendOutput('==================================================', 'system');
        }
        break;

      case 'add':
        {
          // High-density resilient parsing algorithm
          // We scan args from right to left to identify marks and roll number
          let marksArr: number[] = [];
          let tempArgs = [...args];

          // 1. Pop off any numerical marks from the end
          while (tempArgs.length > 0) {
            const lastToken = tempArgs[tempArgs.length - 1];
            if (!isNaN(Number(lastToken)) && lastToken.trim() !== '') {
              marksArr.unshift(Number(tempArgs.pop()));
            } else {
              break;
            }
          }

          // 2. The next token from the end is the Roll Number/ID (if any tokens remain)
          let sRoll = '';
          if (tempArgs.length > 0) {
            sRoll = tempArgs.pop()?.toUpperCase() || '';
          }

          // 3. Whatever remains is the student name!
          const rawName = tempArgs.join(' ').trim();
          const sName = rawName.replace(/^["'\u201C\u201D]+|["'\u201C\u201D]+$/g, '').trim();

          if (!sName || !sRoll) {
            appendOutput('ERROR: Syntax invalid. Require name and roll number. Helper example: add Liam Anderson S105 85 90 80 ...', 'error');
          } else {
            const rCheck = students.find(s => s.rollNumber.toUpperCase() === sRoll);
            if (rCheck) {
              appendOutput(`ERROR: Roll number "${sRoll}" is already registered to student "${rCheck.name}".`, 'error');
            } else {
              if (marksArr.length !== subjects.length && marksArr.length > 0) {
                appendOutput(`WARNING: Marks count (${marksArr.length}) disagrees with active subjects counts (${subjects.length}). Padding with 0 scores.`, 'error');
              }
              
              // Compile marks dictionary mapped to subjects
              const newMarks: Record<string, number> = {};
              subjects.forEach((sub, idx) => {
                const enteredValue = marksArr[idx];
                newMarks[sub.id] = isNaN(enteredValue) || enteredValue === undefined ? 0 : Math.min(Math.max(enteredValue, 0), 100);
              });

              const newlyCreatedStudent: Student = {
                id: `st-${Date.now()}`,
                name: sName,
                rollNumber: sRoll,
                gradeClass: 'Class 10 A',
                academicYear: '2026',
                marks: newMarks,
                customRemarks: 'Command line transcript creation. Registered in central database admin panel.'
              };

              onAddStudent(newlyCreatedStudent);
              appendOutput(`SUCCESS: Registered "${sName}" under Roll "${sRoll}" with marks. Database synced.`, 'success');
            }
          }
        }
        break;

      default:
        appendOutput(`bash: command "${command}" not recognized. Type "help" to list allowed operations.`, 'error');
        break;
    }

    setHistory(newHistory);
    setInputValue('');
  };

  const TRIM_EXTRA_QUOTES = (str: string) => {
    return str.replace(/[\u201C\u201D]/g, '"'); // sanitize smart quotes
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    executeCommand(inputValue);
  };

  return (
    <div 
      id="terminal-window" 
      onClick={handleTerminalClick}
      className="bg-zinc-950 text-emerald-400 font-mono text-xs rounded p-3.5 shadow-xl border border-zinc-800 relative select-text hover:border-zinc-700 transition-colors min-h-[400px] flex flex-col justify-between"
    >
      
      {/* OS Mac Terminal Style Header Rail */}
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-4 select-none">
        {/* Linux Dots */}
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-red-500 rounded-full cursor-pointer opacity-80 hover:opacity-100" title="Close" onClick={onClearAll}></div>
          <div className="w-3 h-3 bg-amber-400 rounded-full cursor-pointer opacity-80 hover:opacity-100" title="Minimize" onClick={() => {
            const timeStr = new Date().toISOString().replace('T', ' ').slice(0, 19);
            setHistory(prev => [...prev, { text: 'Terminal shell minimized. Input process live.', type: 'system', timestamp: timeStr }]);
          }}></div>
          <div className="w-3 h-3 bg-emerald-500 rounded-full cursor-pointer opacity-80 hover:opacity-100" title="Expand Roster" onClick={() => executeCommand('list')}></div>
        </div>
        
        {/* Title */}
        <div className="flex items-center gap-1.5 text-zinc-400 text-[10px] font-bold uppercase tracking-wider">
          <Terminal className="w-3.5 h-3.5 text-emerald-500" />
          <span>Core-Admin: user@imperial_bash_shell.sh - port 3000</span>
        </div>

        {/* Lock indicator */}
        <div className="flex items-center gap-1 text-[9px] text-emerald-500/80 bg-emerald-950/40 border border-emerald-900/30 px-2 py-0.5 rounded">
          <ShieldCheck className="w-3 h-3" />
          <span>SSL SECURE</span>
        </div>
      </div>

      {/* Terminal History Display Screen */}
      <div id="terminal-screen" className="flex-1 overflow-y-auto space-y-2 max-h-[340px] pr-2 scrollbar-thin scrollbar-thumb-zinc-800">
        {history.map((line, idx) => (
          <div 
            key={idx} 
            className={`whitespace-pre-wrap leading-relaxed ${
              line.type === 'input' 
                ? 'text-white font-bold' 
                : line.type === 'error'
                ? 'text-red-400 font-semibold'
                : line.type === 'success'
                ? 'text-emerald-300 font-bold'
                : line.type === 'system'
                ? 'text-blue-400 font-medium'
                : 'text-emerald-400'
            }`}
          >
            {line.text}
          </div>
        ))}
        {/* Anchor point for scroll */}
        <div ref={bottomRef} />
      </div>

      {/* Command prompt form box */}
      <form onSubmit={handleFormSubmit} className="flex items-center gap-2 pt-4 border-t border-zinc-800 mt-4 select-none relative z-10 bg-zinc-950">
        <span className="text-zinc-400 shrink-0 select-none">user@imperial:~$</span>
        <ChevronRight className="w-4 h-4 text-emerald-500 shrink-0 animate-pulse" />
        
        <input
          id="terminal-input-prompt"
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Enter shell commands (help, list, analyze, add, delete)..."
          className="flex-1 bg-transparent text-white border-none focus:outline-none focus:ring-0 font-mono text-xs select-text selection:bg-zinc-800 placeholder:text-zinc-600"
          autoFocus
          autoComplete="off"
        />

        {/* Keyboard enter key simulation */}
        <button
          id="cli-execute-btn"
          type="submit"
          title="Run Command"
          className="p-1 px-2.5 bg-zinc-900 text-zinc-400 hover:text-emerald-400 hover:bg-zinc-800 rounded border border-zinc-800 transition-all cursor-pointer flex items-center gap-1 text-[10px]"
        >
          <Play className="w-2.5 h-2.5" />
          <span>RUN</span>
        </button>
      </form>

    </div>
  );
}
