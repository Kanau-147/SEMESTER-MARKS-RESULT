package com.imperial.academics;

public class Subject {
    private String id;
    private String name;
    private int maxMarks;
    private int passMarks;

    public Subject(String id, String name, int maxMarks, int passMarks) {
        this.id = id;
        this.name = name;
        this.maxMarks = maxMarks;
        this.passMarks = passMarks;
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public int getMaxMarks() { return maxMarks; }
    public void setMaxMarks(int maxMarks) { this.maxMarks = maxMarks; }

    public int getPassMarks() { return passMarks; }
    public void setPassMarks(int passMarks) { this.passMarks = passMarks; }
}
