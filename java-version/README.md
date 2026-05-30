# Imperial Academics - Java Reference Engine (File Persisted & Error Handled)

This directory contains the production-ready **Java translation** of the Students Grade Ledger & Academic Evaluation Transcript system. It contains identical statistical calculations, grade evaluations, class metrics mapping, and an interactive CLI shell matching the web terminal's exact behavior.

It includes **live CSV file handling** and **robust try-catch blocks** for resilient local storage.

## Key Java Concept Paradigms Implemented

1. **Auto-Closing File Streams (I/O File Handling)**: Uses `try-with-resources` to open, read, and write data blocks safely to custom persistent tables (`students_db.csv`). This guarantees resources like `FileReader` and `FileWriter` are auto-disposed correctly.
2. **Resilient Type Conversion Guards (Try-Catch Multi-Catch Blocks)**: Implements native safe parsing catch-guards for dynamic numbers (`NumberFormatException`) and missing items (`NullPointerException`) internally to prevent critical JVM crashes on corrupted database profiles or partial records.
3. **Escaped Separation Protocol**: Custom mapping functions safe-split characters like raw commas or newline commands within custom notes, avoiding malformation errors.

---

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
                └── Main.java             # Interactive CLI Terminal interface (with persistence & error handlers)
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
    *   *Example:* `add Emma Richardson S2026-05 85 90 78 82 95`
*   `delete <roll_id>`: Remove a registered student record matching their active roll identifier (e.g. `delete S2026-02`).
*   `save`: Force manual backup commitment of the active memory database cache to `students_db.csv`.
*   `load`: Force manual dynamic refresh and memory rebuilding of records directly from `students_db.csv`.
*   `exit`: Safely shut down the JVM terminal loop.
