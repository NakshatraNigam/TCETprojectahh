# 🎙️ SPEAKER 51 CHEAT-SHEET (Speaker 3 • Roll No. 51)
## Topic: Live Demonstration: The Insertion Anomaly
**Institution:** Thakur College Of Engineering Technology (TCET) • Module 5 Inquiry-Based Learning  
**Target Screen:** 💥 Anomaly Crash-Lab (Scenario 1: Insertion Anomaly)  
**Time Limit:** 60–90 Seconds

---

### 1. 📌 Your Role & What's on Screen
You demonstrate the **Insertion Anomaly** live in the Crash-Lab. You click **"⚡ Run Anomaly Stress-Test"** to show why adding a new elective course (`CS505 - Cloud Computing`) fails in UNF vs. succeeds cleanly in 3NF.

---

### 2. 🗣️ Your Speaking Script
> *"I will now demonstrate the Insertion Anomaly live in our Crash-Lab.*
>
> *Suppose TCET introduces a brand new advanced elective: 'CS505 - Cloud Computing' taught by Prof. Vikram Patel, before any students have enrolled.*
>
> *In the unnormalized schema, because StudentID is an essential part of the composite primary key, we CANNOT insert this course without a student record! Inserting NULL into StudentID violates the Entity Integrity Constraint. If we force it by adding a fake student like 'TCET-DUMMY', we corrupt our database with dirty data.*
>
> *As shown on the right side, in 3NF, Courses is an independent entity: we insert CS505 with zero student dependencies!"*

---

### 3. 🧠 Core Concepts You Must Know
- **Insertion Anomaly:** The inability to insert valid data about one entity (e.g. Course/Faculty) without artificially creating a record for another unrelated entity (e.g. Student).
- **Entity Integrity Constraint:** No primary key attribute can accept a `NULL` value ($\text{PK} \neq \text{NULL}$).
- **Composite Key Coupling:** Forcing multiple entities into one primary key prevents independent record creation.

---

### 4. 💡 Top 3 Anticipated Viva Questions & Model Answers

**Q1: Why can't we just set `StudentID = NULL` when inserting a new course in UNF?**
> **Ans:** Because `StudentID` is part of the Primary Key. The Entity Integrity rule of relational databases strictly forbids `NULL` in any primary key component to guarantee unique tuple identification.

**Q2: How does 3NF solve the insertion anomaly?**
> **Ans:** 3NF separates the `Courses` entity into its own table with `CourseID` as its single Primary Key. Courses can be created, updated, and queried independently of student enrollments.

**Q3: What is "dummy data pollution"?**
> **Ans:** In unnormalized schemas, developers often insert placeholder rows (e.g., `StudentID = 'DUMMY'`) to bypass key constraints, which pollutes aggregate queries (`COUNT`, `AVG`) and distorts business metrics.
