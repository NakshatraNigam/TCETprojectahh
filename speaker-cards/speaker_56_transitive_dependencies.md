# 🎙️ SPEAKER 56 CHEAT-SHEET (Speaker 8 • Roll No. 56)
## Topic: 2NF Residual Flaws: The Transitive Dependency Trap
**Institution:** Thakur College Of Engineering Technology (TCET) • Module 5 Inquiry-Based Learning  
**Target Screen:** 🕸️ Dependency Graph (Filter: Transitive FDs)  
**Time Limit:** 60–90 Seconds

---

### 1. 📌 Your Role & What's on Screen
You demonstrate why **2NF is not enough for enterprise databases**. You switch to the Dependency Graph, click the **"Transitive (3NF Violations)"** filter chip, and trace the purple glowing dependency chains.

---

### 2. 🗣️ Your Speaking Script
> *"While 2NF eliminated partial dependencies, our Courses_Master table still harbors a dangerous flaw: Transitive Dependencies.*
>
> *Look at the purple glowing arcs on our Dependency Graph:*
> - *Chain 1: CourseID determines InstructorID, but InstructorID determines InstructorName and OfficeRoom ($CourseID \rightarrow InstructorID \rightarrow \{Name, Office\}$).*
> - *Chain 2: DeptID determines DeptName and DeptBuilding ($DeptID \rightarrow \{Name, Building\}$).*
>
> *This is a Transitive Dependency: attribute A determines B, and B determines C, where B is NOT a candidate key. If Dr. Sharma changes offices, we still have update anomalies in 2NF!"*

---

### 3. 🧠 Core Concepts You Must Know
- **Transitive Dependency:** A functional dependency $X \rightarrow Z$ that exists indirectly because $X \rightarrow Y$ and $Y \rightarrow Z$, where $Y$ is not a superkey and $Y \not\rightarrow X$.
- **Non-Key Determinant:** A column that determines other columns but is not itself a primary/candidate key of the table (e.g. `InstructorID` inside `Courses_Master`).
- **Residual Anomaly in 2NF:** 2NF tables still suffer from insert/update/delete anomalies if transitive chains exist among non-prime attributes.

---

### 4. 💡 Top 3 Anticipated Viva Questions & Model Answers

**Q1: What is the formal mathematical definition of a Transitive Dependency?**
> **Ans:** Given relation $R$ with functional dependencies $X \rightarrow Y$ and $Y \rightarrow Z$: if $Y \not\rightarrow X$, $Y$ is not a superkey, and $Z \not\subseteq X \cup Y$, then $X \rightarrow Z$ is a transitive dependency.

**Q2: Give a real-world example from our TCET dataset of a Transitive Dependency.**
> **Ans:** In `Courses_Master`, `CourseID → InstructorID` and `InstructorID → InstructorOffice`. The faculty office is transitively dependent on `CourseID` through `InstructorID`.

**Q3: Why can't we leave `InstructorName` and `InstructorOffice` inside the `Courses` table?**
> **Ans:** Because if an instructor teaches 4 different courses, their name and office room are redundantly stored in 4 rows. Updating their office requires 4 updates instead of 1, reintroducing update anomalies.
