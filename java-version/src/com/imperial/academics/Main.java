package com.imperial.academics;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.util.*;

public class Main {
    private static final String DATA_FILE = "students_db.csv";
    private static List<Subject> subjects = new ArrayList<>();
    private static List<Student> students = new ArrayList<>();

    public static void main(String[] args) {
        initializeData();
        showWelcomeBanner();

        Scanner scanner = new Scanner(System.in);
        while (true) {
            System.out.print("\n\u001B[32mimperial-terminal> \u001B[0m");
            String line = scanner.nextLine().trim();
            if (line.isEmpty()) continue;

            String[] tokens = line.split("\\s+");
            String command = tokens[0].toLowerCase();
            String[] cmdArgs = Arrays.copyOfRange(tokens, 1, tokens.length);

            switch (command) {
                case "help":
                    showHelp();
                    break;
                case "list":
                    listStudents();
                    break;
                case "add":
                    addStudentFromCli(cmdArgs);
                    break;
                case "analyze":
                    displayAnalytics();
                    break;
                case "subjects":
                    listSubjects();
                    break;
                case "delete":
                    deleteStudentByCli(cmdArgs);
                    break;
                case "save":
                    saveDataToFile();
                    break;
                case "load":
                    loadDataFromFile();
                    break;
                case "exit":
                case "quit":
                    System.out.println("Shutting down Imperial Academics Terminal. Goodbye!");
                    scanner.close();
                    return;
                default:
                    System.out.println("\u001B[31m[ERROR] Command '" + command + "' unrecognized. Type 'help' to review instructions.\u001B[0m");
            }
        }
    }

    private static void initializeData() {
        // Build initial core subject syllabus
        subjects.add(new Subject("math", "Mathematics", 100, 35));
        subjects.add(new Subject("science", "General Science", 100, 40));
        subjects.add(new Subject("english", "English Literature", 100, 35));
        subjects.add(new Subject("history", "History & Civics", 100, 35));
        subjects.add(new Subject("cs", "Computer Studies", 100, 45));

        // Read dynamic storage entries
        loadDataFromFile();
    }

    private static void populateDefaults() {
        // Populate initial high-caliber student records
        Student s1 = new Student("st-1", "Liam Anderson", "S2026-01", "Class 10 A", "2026");
        s1.addMark("math", 88);
        s1.addMark("science", 92);
        s1.addMark("english", 81);
        s1.addMark("history", 78);
        s1.addMark("cs", 95);
        s1.setCustomRemarks("Excellent critical thinking capacity and mathematical intuition. Highly recommended for Advanced Calculus.");
        students.add(s1);

        Student s2 = new Student("st-2", "Emma Richardson", "S2026-02", "Class 10 A", "2026");
        s2.addMark("math", 42);
        s2.addMark("science", 58);
        s2.addMark("english", 75);
        s2.addMark("history", 64);
        s2.addMark("cs", 51);
        s2.setCustomRemarks("Solid performance in humanitarian studies. Quantitative analysis needs coaching.");
        students.add(s2);

        Student s3 = new Student("st-3", "Aarav Patel", "S2026-03", "Class 10 A", "2026");
        s3.addMark("math", 95);
        s3.addMark("science", 88);
        s3.addMark("english", 90);
        s3.addMark("history", 92);
        s3.addMark("cs", 98);
        s3.setCustomRemarks("Stellar curriculum record. Promising scholarly future.");
        students.add(s3);
    }

    private static void loadDataFromFile() {
        File file = new File(DATA_FILE);
        if (!file.exists()) {
            System.out.println("\u001B[33m[INFO] Local system storage database directory clean. Instantiating seed records...\u001B[0m");
            populateDefaults();
            saveDataToFile();
            return;
        }

        students.clear();
        
        // Demonstrating dynamic File Reading utilizing Java try-with-resources statement & Multi-catch blocks
        try (BufferedReader reader = new BufferedReader(new FileReader(file))) {
            String header = reader.readLine(); // Ignore CSV Column definitions
            String line;
            
            while ((line = reader.readLine()) != null) {
                if (line.trim().isEmpty()) continue;
                
                String[] parts = line.split(",", -1);
                if (parts.length < 11) {
                    System.out.println("\u001B[31m[WARNING] Malformed database entry line bypassed: " + line + "\u001B[0m");
                    continue;
                }
                
                String id = parts[0];
                String name = parts[1];
                String rollNumber = parts[2];
                String gradeClass = parts[3];
                String academicYear = parts[4];
                String customRemarks = decodeValue(parts[5]);
                
                Student st = new Student(id, name, rollNumber, gradeClass, academicYear);
                st.setCustomRemarks(customRemarks);
                
                // Read and Parse custom subject parameters safely
                st.addMark("math", parseMarkSafe(parts[6]));
                st.addMark("science", parseMarkSafe(parts[7]));
                st.addMark("english", parseMarkSafe(parts[8]));
                st.addMark("history", parseMarkSafe(parts[9]));
                st.addMark("cs", parseMarkSafe(parts[10]));
                
                students.add(st);
            }
            System.out.println("\u001B[32m[SUCCESS] Loaded " + students.size() + " student entries cleanly from physical file storage: '" + DATA_FILE + "'.\u001B[0m");
        } catch (IOException e) {
            System.out.println("\u001B[31m[FATAL ERR] File system blocking or access permission failure during disk load.\u001B[0m");
            System.out.println("Details: " + e.getMessage());
        } catch (Exception e) {
            System.out.println("\u001B[31m[ERROR] High-level parser constraint error occurred: " + e.getMessage() + "\u001B[0m");
        }
    }

    private static void saveDataToFile() {
        File file = new File(DATA_FILE);
        
        // Demonstrating File Output Streams utilizing Auto-Closing try write channels
        try (BufferedWriter writer = new BufferedWriter(new FileWriter(file))) {
            // Write columns configuration metadata
            writer.write("id,name,rollNumber,gradeClass,academicYear,customRemarks,mathScore,scienceScore,englishScore,historyScore,csScore");
            writer.newLine();

            for (Student s : students) {
                String encodedRemarks = encodeValue(s.getCustomRemarks());
                String row = String.format("%s,%s,%s,%s,%s,%s,%d,%d,%d,%d,%d",
                        s.getId(),
                        s.getName(),
                        s.getRollNumber(),
                        s.getGradeClass(),
                        s.getAcademicYear(),
                        encodedRemarks,
                        s.getMarks().getOrDefault("math", 0),
                        s.getMarks().getOrDefault("science", 0),
                        s.getMarks().getOrDefault("english", 0),
                        s.getMarks().getOrDefault("history", 0),
                        s.getMarks().getOrDefault("cs", 0)
                );
                writer.write(row);
                writer.newLine();
            }
            System.out.println("\u001B[32m[SYSTEM CLOUD] State successfully persisted to disk: '" + DATA_FILE + "' committed.\u001B[0m");
        } catch (IOException e) {
            System.out.println("\u001B[31m[FATAL ERR] Disk full, permissions denied or lock failure committing records.\u001B[0m");
            System.out.println("Details: " + e.getMessage());
        }
    }

    private static int parseMarkSafe(String val) {
        // Try-Catch mechanism for clean input casting & conversion guard rails
        try {
            return Integer.parseInt(val.trim());
        } catch (NumberFormatException | NullPointerException e) {
            return 0; // Guard against blank or corrupted CSV record values
        }
    }

    private static String encodeValue(String input) {
        if (input == null) return "";
        return input.replace(",", "[COMMA_ESC]").replace("\n", "[NEWLINE_ESC]");
    }

    private static String decodeValue(String input) {
        if (input == null) return "";
        return input.replace("[COMMA_ESC]", ",").replace("[NEWLINE_ESC]", "\n");
    }

    private static void showWelcomeBanner() {
        System.out.println("=========================================================================");
        System.out.println("        IMPERIAL ACADEMICS DIVISION - OFFICIAL TRANSCRIPT ENGINE        ");
        System.out.println("=========================================================================");
        System.out.println("  * Powered by Java JRE Platform & Local Disk I/O");
        System.out.println("  * Active Persistence Storage Database: " + DATA_FILE);
        System.out.println("  * Type 'help' to review cataloged commands, parameters, and examples.");
        System.out.println("=========================================================================");
    }

    private static void showHelp() {
        System.out.println("\nAVAILABLE ACADEMIC COMMANDS:");
        System.out.println("  help                         Display current instructions sheet");
        System.out.println("  list                         Display all enrolled students & transcripts");
        System.out.println("  subjects                     Inspect course-wide boundaries & pass levels");
        System.out.println("  add <name> <roll> <marks...> Register student (e.g. add JohnDoe S104 80 90 75 88 95)");
        System.out.println("  analyze                      Trigger Central Classroom statistics");
        System.out.println("  delete <roll>                Decommission dynamic student roll transcript");
        System.out.println("  load                         Manually read/re-populate records from students_db.csv");
        System.out.println("  save                         Manually serialize active records back to students_db.csv");
        System.out.println("  exit                         Exits the command prompt safely");
    }

    private static void listStudents() {
        if (students.isEmpty()) {
            System.out.println("\u001B[33mNo student transcripts registered in current active memory.\u001B[0m");
            return;
        }

        System.out.println("\n--- ENROLLED STUDENT DATA REGISTRY ---");
        System.out.printf("%-12s | %-18s | %-8s | %-6s | %-5s | %-6s\n", "ROLL CODE", "STUDENT NAME", "CLASS", "AVG %", "GPA", "STATUS");
        System.out.println("-------------------------------------------------------------------------");

        for (Student st : students) {
            AcademicEngine.EvaluationResult res = AcademicEngine.evaluateStudent(st, subjects);
            String ansiColor = res.status.equals("PASS") ? "\u001B[32m" : "\u001B[31m";
            System.out.printf("%-12s | %-18s | %-8s | %-5.1f%% | %-5.1f | %s%s\u001B[0m\n",
                    st.getRollNumber(), st.getName(), st.getGradeClass(), res.percentage, res.cgpa, ansiColor, res.status);
        }
    }

    private static void listSubjects() {
        System.out.println("\n--- SYLLABUS COURSE CONFIGURATION ---");
        System.out.printf("%-10s | %-22s | %-10s | %-10s\n", "CODE KEY", "SUBJECT DESCRIPTION", "MAX MARK", "PASS THRESHOLD");
        System.out.println("-------------------------------------------------------------------------");
        for (Subject sub : subjects) {
            System.out.printf("%-10s | %-22s | %-10d | %-10d\n", sub.getId(), sub.getName(), sub.getMaxMarks(), sub.getPassMarks());
        }
    }

    private static void displayAnalytics() {
        AcademicEngine.Analytics stats = AcademicEngine.computeAnalytics(students, subjects);
        System.out.println("\n--- CENTRAL CLASSROOM ANALYTICAL SUMMARY ---");
        System.out.println("  Total Enrolled  : " + stats.totalStudents);
        System.out.println("  Promotions (Pass) : \u001B[32m" + stats.passedStudents + " (" + stats.passPercentage + "%)\u001B[0m");
        System.out.println("  Assessments (Fail): \u001B[31m" + stats.failedStudents + "\u001B[0m");
        System.out.println("  Classroom Mean %  : " + stats.classAveragePercentage + "%");
        
        if (stats.topScorer != null) {
            System.out.println("  Top Valedictorian: \u001B[33m" + stats.topScorer.getName() + " (" + stats.topScorerPercentage + "% under Roll " + stats.topScorer.getRollNumber() + ")\u001B[0m");
        } else {
            System.out.println("  Top Valedictorian: N/A");
        }
    }

    private static void addStudentFromCli(String[] args) {
        // High density resilient parsing matching our TerminalConsole specifications
        if (args.length < 2) {
            System.out.println("\u001B[31m[ERROR] Invalid parameters: Please enter name and roll ID. Example:\u001B[0m");
            System.out.println("  add \"Jane Doe\" S109 85 90 95 80 88");
            return;
        }

        // Gather numerical scores from the end
        List<Integer> parsedMarks = new ArrayList<>();
        int nameAndRollTokensCount = args.length;
        
        for (int i = args.length - 1; i >= 0; i--) {
            try {
                int val = Integer.parseInt(args[i]);
                parsedMarks.add(0, val);
                nameAndRollTokensCount--;
            } catch (NumberFormatException e) {
                // Not a number, we hit the biographical fields
                break;
            }
        }

        if (nameAndRollTokensCount < 2) {
            System.out.println("\u001B[31m[ERROR] Insufficient inputs for Name and Roll identifier.\u001B[0m");
            return;
        }

        String rollNumber = args[nameAndRollTokensCount - 1].toUpperCase();
        
        // Assemble name
        StringBuilder nameBuilder = new StringBuilder();
        for (int i = 0; i < nameAndRollTokensCount - 1; i++) {
            nameBuilder.append(args[i]).append(" ");
        }
        String name = nameBuilder.toString().trim().replaceAll("^\"|\"$", "");

        // Guard duplicates
        for (Student s : students) {
            if (s.getRollNumber().equalsIgnoreCase(rollNumber)) {
                System.out.println("\u001B[31m[ERROR] Roll ID '" + rollNumber + "' already registered to student '" + s.getName() + "'.\u001B[0m");
                return;
            }
        }

        Student st = new Student("st-" + System.currentTimeMillis(), name, rollNumber, "Class 10 A", "2026");
        st.setCustomRemarks("Command line enrollment transcript created natively.");

        // Map marks to active courses
        for (int i = 0; i < subjects.size(); i++) {
            Subject sub = subjects.get(i);
            int score = 0;
            if (i < parsedMarks.size()) {
                score = Math.min(Math.max(parsedMarks.get(i), 0), 100);
            }
            st.addMark(sub.getId(), score);
        }

        if (parsedMarks.size() != subjects.size() && !parsedMarks.isEmpty()) {
            System.out.println("\u001B[33m[WARNING] Score count mismatch with curriculum courses. Missing padded with 0.\u001B[0m");
        }

        students.add(st);
        System.out.println("\u001B[32m[SUCCESS] Student \"" + name + "\" registered under Roll \"" + rollNumber + "\" with metrics. Central ledger synced.\u001B[0m");
        
        // Save database
        saveDataToFile();
    }

    private static void deleteStudentByCli(String[] args) {
        if (args.length == 0) {
            System.out.println("\u001B[31m[ERROR] Please specify target Roll ID to delete, e.g. delete S2026-02\u001B[0m");
            return;
        }

        String targetRoll = args[0].toUpperCase();
        boolean removed = students.removeIf(s -> s.getRollNumber().equalsIgnoreCase(targetRoll));

        if (removed) {
            System.out.println("\u001B[32m[SUCCESS] Dismantled student entry matching Roll ID '" + targetRoll + "' from academic tables.\u001B[0m");
            // Sync dynamic changes back on disk database
            saveDataToFile();
        } else {
            System.out.println("\u001B[31m[ERROR] Student record matching '" + targetRoll + "' not found.\u001B[0m");
        }
    }
}
