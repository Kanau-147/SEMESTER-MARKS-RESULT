/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { Subject, Student, StudentCalculated } from '../types';
import { calculateStudentResults } from '../utils';
import { Search, SlidersHorizontal, Trash2, Edit, FileText, CheckCircle2, AlertCircle } from 'lucide-react';

interface StudentListProps {
  students: Student[];
  subjects: Subject[];
  onSelectStudent: (student: Student) => void;
  onEditStudent: (student: Student) => void;
  onDeleteStudent: (id: string) => void;
  selectedStudentId: string | null;
}

export default function StudentList({
  students,
  subjects,
  onSelectStudent,
  onEditStudent,
  onDeleteStudent,
  selectedStudentId
}: StudentListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PASS' | 'FAIL'>('ALL');
  const [classFilter, setClassFilter] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'name' | 'roll' | 'percentage' | 'cgpa'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Compute calculated results for active filtering
  const calculatedList = useMemo(() => {
    return students.map((st) => calculateStudentResults(st, subjects));
  }, [students, subjects]);

  // Extract unique classes
  const uniqueClasses = useMemo(() => {
    const classes = new Set<string>();
    students.forEach((st) => {
      if (st.gradeClass) classes.add(st.gradeClass);
    });
    return Array.from(classes);
  }, [students]);

  // Filter & Sort list
  const filteredAndSortedList = useMemo(() => {
    let result = [...calculatedList];

    // Apply Search (Search by name or roll number)
    if (searchTerm.trim() !== '') {
      const q = searchTerm.toLowerCase();
      result = result.filter(
        (item) =>
          item.student.name.toLowerCase().includes(q) ||
          item.student.rollNumber.toLowerCase().includes(q)
      );
    }

    // Apply Status Filter
    if (statusFilter !== 'ALL') {
      result = result.filter((item) => item.status === statusFilter);
    }

    // Apply Class Filter
    if (classFilter !== 'ALL') {
      result = result.filter((item) => item.student.gradeClass === classFilter);
    }

    // Apply Sorting
    result.sort((a, b) => {
      let valA: any = '';
      let valB: any = '';

      if (sortBy === 'name') {
        valA = a.student.name.toLowerCase();
        valB = b.student.name.toLowerCase();
      } else if (sortBy === 'roll') {
        valA = a.student.rollNumber.toLowerCase();
        valB = b.student.rollNumber.toLowerCase();
      } else if (sortBy === 'percentage') {
        valA = a.percentage;
        valB = b.percentage;
      } else if (sortBy === 'cgpa') {
        valA = a.cgpa;
        valB = b.cgpa;
      }

      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [calculatedList, searchTerm, statusFilter, classFilter, sortBy, sortOrder]);

  const handleSort = (field: 'name' | 'roll' | 'percentage' | 'cgpa') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  return (
    <div id="student-list-container" className="bg-panel border border-border-custom rounded p-4">
      
      {/* Search and Filters Header */}
      <div className="flex flex-col gap-3 mb-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-sans font-bold tracking-tight text-xs text-ink uppercase">
              Grade Registry & Results Ledger
            </h3>
            <p className="text-ink-muted text-[10px] mt-0.5">
              Select student row to review transcript certificates, generate AI remarks, and display diagnostics.
            </p>
          </div>
          <span className="text-[10px] bg-gray-100 font-mono py-0.5 px-1.5 rounded text-ink-muted border border-border-custom select-text">
            Records: {filteredAndSortedList.length}/{students.length}
          </span>
        </div>

        {/* Dynamic Filters Bar */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-2">
          {/* Search Box */}
          <div className="md:col-span-5 relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-2 text-ink-muted">
              <Search className="w-3.5 h-3.5" />
            </span>
            <input
              id="student-search-input"
              type="text"
              placeholder="Search Name or Roll..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full text-xs font-medium pl-7 pr-2 py-1 bg-white border border-border-custom rounded bg-white text-ink focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent placeholder:text-gray-400"
            />
          </div>

          {/* Class Filter */}
          <div className="md:col-span-3">
            <select
              id="class-filter-select"
              value={classFilter}
              onChange={(e) => setClassFilter(e.target.value)}
              className="w-full text-xs py-1 px-2 border border-border-custom rounded text-ink bg-white focus:outline-none focus:border-accent"
            >
              <option value="ALL">All Classes</option>
              {uniqueClasses.map((cl) => (
                <option key={cl} value={cl}>
                  {cl}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="md:col-span-2">
            <select
              id="status-filter-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="w-full text-xs py-1 px-2 border border-border-custom rounded text-ink bg-white focus:outline-none focus:border-accent"
            >
              <option value="ALL">All Status</option>
              <option value="PASS">Pass Only</option>
              <option value="FAIL">Fail Only</option>
            </select>
          </div>

          {/* Sort Reset Toggle */}
          <div className="md:col-span-2">
            <button
              id="clear-filters-btn"
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('ALL');
                setClassFilter('ALL');
                setSortBy('name');
                setSortOrder('asc');
              }}
              className="w-full text-xs font-bold text-ink bg-white border border-border-custom hover:bg-gray-50 py-1 px-2 rounded transition-colors flex items-center justify-center gap-1 cursor-pointer"
            >
              <SlidersHorizontal className="w-3 h-3" />
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* Main Students Roster Table */}
      <div className="overflow-x-auto border border-border-custom rounded">
        {filteredAndSortedList.length === 0 ? (
          <div className="text-center py-6 px-4 bg-gray-50/50">
            <p className="text-xs text-ink-muted font-bold">No student records found.</p>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-[10px] font-bold uppercase tracking-wider text-ink-muted border-b border-border-custom">
                <th
                  onClick={() => handleSort('name')}
                  className="py-1.5 px-3 cursor-pointer select-none hover:text-accent transition-colors"
                >
                  Student Name {sortBy === 'name' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}
                </th>
                <th
                  onClick={() => handleSort('roll')}
                  className="py-1.5 px-3 cursor-pointer select-none hover:text-accent transition-colors"
                >
                  Roll Number {sortBy === 'roll' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}
                </th>
                <th className="py-1.5 px-3">Class</th>
                <th
                  onClick={() => handleSort('percentage')}
                  className="py-1.5 px-3 cursor-pointer select-none hover:text-accent transition-colors text-right"
                >
                  Avg % {sortBy === 'percentage' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}
                </th>
                <th
                  onClick={() => handleSort('cgpa')}
                  className="py-1.5 px-3 cursor-pointer select-none hover:text-accent transition-colors text-right"
                >
                  GPA/Grade {sortBy === 'cgpa' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}
                </th>
                <th className="py-1.5 px-3 text-center">Status</th>
                <th className="py-1.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredAndSortedList.map((row) => {
                const isSelected = row.student.id === selectedStudentId;
                return (
                  <tr
                    key={row.student.id}
                    id={`student-row-${row.student.id}`}
                    onClick={() => onSelectStudent(row.student)}
                    className={`text-xs hover:bg-gray-50 transition-colors cursor-pointer select-none ${
                      isSelected ? 'bg-blue-50/40 border-l-2 border-accent' : ''
                    }`}
                  >
                    {/* Student Name */}
                    <td className="py-1.5 px-3 font-sans text-xs font-bold text-ink">
                      {row.student.name}
                    </td>

                    {/* Roll Number */}
                    <td className="py-1.5 px-3 font-mono text-[11px] text-ink-muted">
                      {row.student.rollNumber}
                    </td>

                    {/* Class */}
                    <td className="py-1.5 px-3 text-[11px] text-ink-muted">
                      {row.student.gradeClass}
                    </td>

                    {/* Percentage */}
                    <td className="py-1.5 px-3 text-right font-mono font-bold text-ink">
                      {row.percentage}%
                    </td>

                    {/* CGPA and Letter Grade */}
                    <td className="py-1.5 px-3 text-right">
                      <span className="font-mono font-bold text-xs text-ink">{row.cgpa}</span>
                      <span className="ml-1 inline-block text-[9px] bg-gray-50 border border-border-custom text-ink-muted py-[1px] px-[3px] rounded font-extrabold uppercase">
                        {row.grade}
                      </span>
                    </td>

                    {/* Status Badge */}
                    <td className="py-1.5 px-3 text-center">
                      <span
                        className={`inline-flex items-center gap-0.5 text-[9px] font-bold uppercase tracking-wider py-0.5 px-1.5 rounded ${
                          row.status === 'PASS' ? 'pill-pass' : 'pill-fail'
                        }`}
                      >
                        {row.status}
                      </span>
                    </td>

                    {/* Action buttons */}
                    <td className="py-1.5 px-3 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1">
                        <button
                          id={`view-card-btn-${row.student.id}`}
                          title="Generate & View Report Card"
                          onClick={() => onSelectStudent(row.student)}
                          className="p-1 bg-white text-ink-muted hover:text-accent border border-border-custom rounded transition-colors cursor-pointer"
                        >
                          <FileText className="w-3 h-3" />
                        </button>
                        
                        <button
                          id={`edit-record-btn-${row.student.id}`}
                          title="Edit Student Record"
                          onClick={() => onEditStudent(row.student)}
                          className="p-1 bg-white text-ink-muted hover:text-amber-655 border border-border-custom rounded transition-colors cursor-pointer"
                        >
                          <Edit className="w-3 h-3" />
                        </button>

                        <button
                          id={`delete-record-btn-${row.student.id}`}
                          title="Delete Student Record"
                          onClick={() => {
                            if (confirm(`Are you absolutely sure you want to delete ${row.student.name}'s record?`)) {
                              onDeleteStudent(row.student.id);
                            }
                          }}
                          className="p-1 bg-white text-ink-muted hover:text-red-655 border border-border-custom rounded transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
