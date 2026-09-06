# 🎙️ SPEAKER 55 CHEAT-SHEET (Speaker 7 • Roll No. 55)
## Topic: Second Normal Form (2NF) Transformation & Table Decomposition
**Institution:** Thakur College Of Engineering Technology (TCET) • Module 5 Inquiry-Based Learning  
**Target Screen:** 🎬 Morph Studio (`2NF` Stage)  
**Time Limit:** 60–90 Seconds

---

### 1. 📌 Your Role & What's on Screen
You advance to **Stage 2 (2NF)** in Morph Studio. You explain the formal 2NF rule, show how the single monolithic table physically splits into 4 distinct relations, and verify that partial dependencies are eliminated.

---

### 2. 🗣️ Your Speaking Script
> *"We now advance to Second Normal Form (2NF).*
>
> *The 2NF rule states: A relation is in 2NF if and only if it is in 1NF and no non-prime attribute is partially dependent on any candidate key. In other words: every non-prime attribute must depend on the whole key.*
>
> *Watch the table physically decompose on screen into 4 focused relations:*
> 1. *Students (StudentID → StudentName, DepartmentID)*
> 2. *Student_Contacts (StudentID, PhoneNumber)*
> 3. *Courses_Master (CourseID → CourseTitle, Credits, Instructor Details)*
> 4. *Enrollments (StudentID, CourseID → Semester, Grade)*
>
> *Notice that Grade and Semester remain in Enrollments because they require both StudentID AND CourseID."*

---

### 3. 🧠 Core Concepts You Must Know
- **2NF Rule:** $2\text{NF} \iff 1\text{NF} \land (\forall X \rightarrow A, X \text{ is not a proper subset of any Candidate Key})$.
- **Elimination of Partial Dependencies:** Moving partially dependent attributes into separate relations where the partial determinant becomes the full Primary Key.
- **Composite Bridge Table:** `Enrollments` maintains the many-to-many relationship between Students and Courses.

---

### 4. 💡 Top 3 Anticipated Viva Questions & Model Answers

**Q1: If a table has a single-attribute Primary Key (e.g. only `StudentID`), can it violate 2NF?**
> **Ans:** No! If the primary key consists of only one single attribute, there are no proper subsets of the key. Therefore, partial key dependencies are mathematically impossible, and the table is automatically in 2NF.

**Q2: Why did `Semester` and `Grade` stay in the `Enrollments` table?**
> **Ans:** Because `Grade` and `Semester` are fully functionally dependent on `{StudentID, CourseID}`. A student doesn't have a grade without taking a course, and a course doesn't have a grade without a student.

**Q3: Is our database now free of all anomalies in 2NF?**
> **Ans:** No. Although 2NF eliminates partial dependencies, `Courses_Master` still suffers from Transitive Dependencies ($CourseID \rightarrow InstructorID \rightarrow InstructorOffice$), which will be resolved in 3NF.
