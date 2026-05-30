package com.imperial.academics;

import java.util.HashMap;
import java.util.Map;

public class Student {
    private String id;
    private String name;
    private String rollNumber;
    private String gradeClass;
    private String academicYear;
    private Map<String, Integer> marks; // Mapped by Subject ID
    private String customRemarks;
    private String aiRemarks;

    public Student(String id, String name, String rollNumber, String gradeClass, String academicYear) {
        this.id = id;
        this.name = name;
        this.rollNumber = rollNumber;
        this.gradeClass = gradeClass;
        this.academicYear = academicYear;
        this.marks = new HashMap<>();
        this.customRemarks = "";
        this.aiRemarks = "";
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getRollNumber() { return rollNumber; }
    public void setRollNumber(String rollNumber) { this.rollNumber = rollNumber; }

    public String getGradeClass() { return gradeClass; }
    public void setGradeClass(String gradeClass) { this.gradeClass = gradeClass; }

    public String getAcademicYear() { return academicYear; }
    public void setAcademicYear(String academicYear) { this.academicYear = academicYear; }

    public Map<String, Integer> getMarks() { return marks; }
    public void setMarks(Map<String, Integer> marks) { this.marks = marks; }

    public String getCustomRemarks() { return customRemarks; }
    public void setCustomRemarks(String customRemarks) { this.customRemarks = customRemarks; }

    public String getAiRemarks() { return aiRemarks; }
    public void setAiRemarks(String aiRemarks) { this.aiRemarks = aiRemarks; }

    public void addMark(String subjectId, int score) {
        this.marks.put(subjectId, score);
    }
}
