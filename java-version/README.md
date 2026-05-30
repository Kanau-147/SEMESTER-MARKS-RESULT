# Imperial Academics - Java Reference Engine

This directory contains the production-ready **Java translation** of the Students Grade Ledger & Academic Evaluation Transcript system. It contains identical statistical calculations, grade evaluations, class metrics mapping, and an interactive CLI shell matching the web terminal's exact behavior.

## Directory Structure

```text
java-version/
├── README.md
└── src
    └── com
        └── imperial
            └── academics
                ├── Subject.java          # Course curriculum settings with passing thresholds
                ├── Student.java          # Student model with test marks & commentary mapping 
                ├── AcademicEngine.java   # Calculation engine for CGPA, Grades, Status & Stats
                └── Main.java             # Interactive CLI Terminal interface
```

## How to Compile & Run (CLI)

No secondary packages, Maven frameworks, or Gradle definitions are required. The codebase uses clean, self-contained Java Standard Edition API libraries.

### Prerequisite

- Installed JDK (Java Development Kit) Version 11, 17, 21 or higher.

### Command Guide

Navigate to the project directory `/java-version` in your terminal and compile the files together:

```bash
# 1. Compile the source Java classes
javac -d bin src/com/imperial/academics/*.java

# 2. Execute the CLI Main thread
java -cp bin com.imperial.academics.Main
```

---

## Command Catalog

Once launched, you will see a command prompt `imperial-terminal> ` that supports the following active scripts:

*   `help`: Review available commands and instructions parameters.
*   `list`: Print out the current student directory roster highlighting averages, letter grades, and promotion status.
*   `subjects`: Review current active subjects setup (such as Math, General Science, CS) and minimum scoring benchmarks.
*   `add <name> <roll_id> <math_score> <science_score> <english_score> <history_score> <cs_score>`: Register a new student record dynamically.
    *   *Example:* `add Liam Anderson S2026-05 85 90 78 82 95`
*   `analyze`: Display cumulative analytical classroom statistics (e.g. passing percentages, mean classroom performance, top valedictorians score).
*   `delete <roll_id>`: Remove a registered student record matching their active roll identifier (e.g. `delete S2026-02`).
*   `exit`: Safely shut down the JVM terminal loop.
