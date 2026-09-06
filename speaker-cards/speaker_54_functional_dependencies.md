# 🎙️ SPEAKER 54 CHEAT-SHEET (Speaker 6 • Roll No. 54)
## Topic: Functional Dependencies & The Mathematics Behind 1NF Flaws
**Institution:** Thakur College Of Engineering Technology (TCET) • Module 5 Inquiry-Based Learning  
**Target Screen:** 🕸️ Dependency Graph (All FDs View)  
**Time Limit:** 60–90 Seconds

---

### 1. 📌 Your Role & What's on Screen
You introduce **Functional Dependencies (FDs)** on the interactive SVG graph canvas. You explain determinants, dependent attributes, and point out the red dashed lines representing **Partial Dependencies**.

---

### 2. 🗣️ Your Speaking Script
> *"To understand why 1NF is insufficient, we must analyze the Functional Dependencies shown on our interactive SVG graph.*
>
> *A functional dependency X → Y means that attribute X uniquely determines attribute Y across all valid tuples in relation R.*
>
> *Our composite candidate key in 1NF is {StudentID, CourseID}. But observe the red dashed lines on screen: StudentName and DeptID depend solely on StudentID, while CourseTitle and Credits depend solely on CourseID!*
>
> *These are Partial Functional Dependencies: non-key attributes depending on only a subset of the composite key. This directly violates Second Normal Form."*

---

### 3. 🧠 Core Concepts You Must Know
- **Functional Dependency ($X \rightarrow Y$):** A constraint between two sets of attributes where $X$ (the determinant) uniquely determines the values of $Y$.
- **Determinant:** The left-hand side attribute set ($X$) in an FD $X \rightarrow Y$.
- **Full vs. Partial Dependency:** 
  - *Full:* $Y$ depends on the entire candidate key, not on any proper subset.
  - *Partial:* $Y$ depends on a proper subset of a composite candidate key.
- **Prime vs. Non-Prime Attribute:**
  - *Prime Attribute:* An attribute that is part of any candidate key.
  - *Non-Prime Attribute:* An attribute that does not belong to any candidate key.

---

### 4. 💡 Top 3 Anticipated Viva Questions & Model Answers

**Q1: What is the formal definition of a Functional Dependency?**
> **Ans:** Given relation $R$, a functional dependency $X \rightarrow Y$ holds if for any two tuples $t_1, t_2 \in R$, whenever $t_1[X] = t_2[X]$, then $t_1[Y] = t_2[Y]$.

**Q2: What is the difference between a Prime Attribute and a Non-Prime Attribute?**
> **Ans:** A Prime attribute is any attribute that is a member of at least one candidate key (e.g. `StudentID`, `CourseID`). A Non-Prime attribute is not part of any candidate key (e.g. `StudentName`, `Credits`).

**Q3: Why are Partial Dependencies harmful in relational design?**
> **Ans:** Because they force data about independent entities (e.g., student name or course credits) to be repeated every time a new composite pair is created, generating severe update anomalies.
