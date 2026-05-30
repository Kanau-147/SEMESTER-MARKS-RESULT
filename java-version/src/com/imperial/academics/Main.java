package com.imperial.academics;

import java.util.*;

public class Main {
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

    private static void showWelcomeBanner() {
        System.out.println("=========================================================================");
        System.out.println("        IMPERIAL ACADEMICS DIVISION - OFFICIAL TRANSCRIPT ENGINE        ");
        System.out.println("=========================================================================");
        System.out.println("  * Powered by Java JRE Platform");
        System.out.println("  * Dynamic ledger analytics matching browser terminal specs");
        System.out.println("  * Type 'help' to review cataloged commands, parameters, and examples.");
        System.out.println("=========================================================================");
    }

    private static void showHelp() {
        System.out.println("\nAVAILABLE ACADEMIC COMMANDS:");
        System.out.println("  help                         Display current instructions sheet");
        System.out.println("  list                         Display all enrolled students & transcripts");
        System.out.println("  subjects                     Inspect course-wide boundaries & pass levels");
        System.out.println("  add <name> <roll> <marks...> Register student (e.g. add JohnDoe S104 80 90 75 88 95)");
        System.out.println("  analyze                      Trigger central classroom statistics");
        System.out.println("  delete <roll>                Decommission dynamic student roll transcript");
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
        } else {
            System.out.println("\u001B[31m[ERROR] Student record matching '" + targetRoll + "' not found.\u001B[0m");
        }
    }
}
