# 🎙️ SPEAKER 57 CHEAT-SHEET (Speaker 9 • Roll No. 57)
## Topic: Third Normal Form (3NF) Final Lossless Decomposition
**Institution:** Thakur College Of Engineering Technology (TCET) • Module 5 Inquiry-Based Learning  
**Target Screen:** 🎬 Morph Studio (`3NF` Stage)  
**Time Limit:** 60–90 Seconds

---

### 1. 📌 Your Role & What's on Screen
You advance to **Stage 3 (3NF)** in Morph Studio. You present the formal 3NF condition and demonstrate the final decomposition into 6 independent, foreign-key-linked relations with zero transitive redundancy.

---

### 2. 🗣️ Your Speaking Script
> *"We now achieve our final normalized state: Third Normal Form (3NF).*
>
> *The formal 3NF rule states: A relation is in 3NF if it is in 2NF and for every non-trivial functional dependency X → A, at least one of two conditions holds:*
> 1. *X is a Superkey, OR*
> 2. *A is a Prime Attribute (member of a candidate key).*
>
> *On screen, we resolve all transitive dependencies by extracting 'Instructors' and 'Departments' into dedicated relations.*
>
> *Notice the blue Foreign Key badges: Courses now contains only InstructorID as an FK, which in turn references DepartmentID. All 6 tables are clean, modular, and completely anomaly-free!"*

---

### 3. 🧠 Core Concepts You Must Know
- **3NF Formal Definition:** $3\text{NF} \iff 2\text{NF} \land (\forall X \rightarrow A, X \text{ is Superkey} \lor A \in \text{Prime-Attributes})$.
- **Final 6 Decomposed 3NF Relations:**
  1. `Departments(DepartmentID [PK], DepartmentName, DeptBuilding)`
  2. `Instructors(InstructorID [PK], InstructorName, OfficeRoom, DepartmentID [FK])`
  3. `Courses(CourseID [PK], CourseTitle, Credits, InstructorID [FK])`
  4. `Students(StudentID [PK], StudentName, DepartmentID [FK])`
  5. `Student_Contacts(StudentID [PK/FK], PhoneNumber [PK])`
  6. `Enrollments(StudentID [PK/FK], CourseID [PK/FK], Semester, Grade)`
- **Referential Integrity:** Foreign keys ensure that child records cannot reference non-existent parent records.

---

### 4. 💡 Top 3 Anticipated Viva Questions & Model Answers

**Q1: What is the exact difference between 3NF and BCNF (Boyce-Codd Normal Form)?**
> **Ans:** 
> - **3NF** allows $X \rightarrow A$ if $A$ is a Prime Attribute (even if $X$ is not a superkey).
> - **BCNF** is stricter: it requires $X$ to be a Superkey for *every* non-trivial functional dependency, with no exception for prime attributes.

**Q2: What is a Superkey vs. a Candidate Key?**
> **Ans:** 
> - A **Superkey** is any set of attributes that uniquely identifies a tuple (may contain extraneous attributes).
> - A **Candidate Key** is a minimal superkey (no proper subset is a superkey).

**Q3: How do Foreign Keys maintain data consistency across our 6 decomposed tables?**
> **Ans:** Foreign Key constraints enforce Referential Integrity: an enrollment cannot be created for a non-existent student or course, and an instructor cannot be assigned to an invalid department.
