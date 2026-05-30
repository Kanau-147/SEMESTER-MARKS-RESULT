package com.imperial.academics;

import java.util.*;

public class AcademicEngine {

    public static class EvaluationResult {
        public double percentage;
        public String letterGrade;
        public double cgpa;
        public String status; // "PASS" or "FAIL"
        public int totalObtained;
        public int totalMax;

        public EvaluationResult(double percentage, String letterGrade, double cgpa, String status, int totalObtained, int totalMax) {
            this.percentage = percentage;
            this.letterGrade = letterGrade;
            this.cgpa = cgpa;
            this.status = status;
            this.totalObtained = totalObtained;
            this.totalMax = totalMax;
        }
    }

    public static class Analytics {
        public int totalStudents;
        public int passedStudents;
        public int failedStudents;
        public double passPercentage;
        public double classAveragePercentage;
        public Student topScorer;
        public double topScorerPercentage;

        public Analytics() {
            this.totalStudents = 0;
            this.passedStudents = 0;
            this.failedStudents = 0;
            this.passPercentage = 0.0;
            this.classAveragePercentage = 0.0;
            this.topScorer = null;
            this.topScorerPercentage = 0.0;
        }
    }

    /**
     * Conduct academic transcript evaluation for a student.
     */
    public static EvaluationResult evaluateStudent(Student student, List<Subject> subjects) {
        if (subjects.isEmpty()) {
            return new EvaluationResult(0.0, "N/A", 0.0, "PASS", 0, 0);
        }

        int totalObtained = 0;
        int totalMax = 0;
        boolean failedAny = false;

        for (Subject sub : subjects) {
            int score = student.getMarks().getOrDefault(sub.getId(), 0);
            totalObtained += score;
            totalMax += sub.getMaxMarks();

            if (score < sub.getPassMarks()) {
                failedAny = true;
            }
        }

        double percentage = totalMax > 0 ? ((double) totalObtained / totalMax) * 100 : 0.0;
        percentage = Math.round(percentage * 100.0) / 100.0; // Round to 2 decimal places

        // Determine Letter Grade
        String letterGrade;
        if (percentage >= 90) letterGrade = "A+";
        else if (percentage >= 80) letterGrade = "A";
        else if (percentage >= 70) letterGrade = "B";
        else if (percentage >= 60) letterGrade = "C";
        else if (percentage >= 50) letterGrade = "D";
        else letterGrade = "F";

        // Calculate CGPA (points on a scale of 10.0 matching the ledger dashboard)
        double cgpa = percentage / 10.0;
        cgpa = Math.round(cgpa * 10.0) / 10.0; // Rounded to 1 decimal place

        String status = failedAny ? "FAIL" : "PASS";

        return new EvaluationResult(percentage, letterGrade, cgpa, status, totalObtained, totalMax);
    }

    /**
     * Calculate administrative classroom analytics.
     */
    public static Analytics computeAnalytics(List<Student> students, List<Subject> subjects) {
        Analytics analytics = new Analytics();
        if (students.isEmpty()) {
            return analytics;
        }

        analytics.totalStudents = students.size();
        double sumPercentages = 0.0;

        for (Student st : students) {
            EvaluationResult res = evaluateStudent(st, subjects);
            sumPercentages += res.percentage;

            if (res.status.equals("PASS")) {
                analytics.passedStudents++;
            } else {
                analytics.failedStudents++;
            }

            if (analytics.topScorer == null || res.percentage > analytics.topScorerPercentage) {
                analytics.topScorer = st;
                analytics.topScorerPercentage = res.percentage;
            }
        }

        analytics.passPercentage = Math.round(((double) analytics.passedStudents / analytics.totalStudents) * 10000.0) / 100.0;
        analytics.classAveragePercentage = Math.round((sumPercentages / analytics.totalStudents) * 100.0) / 100.0;

        return analytics;
    }
}
