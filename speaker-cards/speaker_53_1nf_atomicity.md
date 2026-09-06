# 🎙️ SPEAKER 53 CHEAT-SHEET (Speaker 5 • Roll No. 53)
## Topic: First Normal Form (1NF) Transformation & Domain Atomicity
**Institution:** Thakur College Of Engineering Technology (TCET) • Module 5 Inquiry-Based Learning  
**Target Screen:** 🎬 Morph Studio (`1NF` Stage)  
**Time Limit:** 60–90 Seconds

---

### 1. 📌 Your Role & What's on Screen
You demonstrate the **First Normal Form (1NF)** transformation. You advance to Stage 1 in Morph Studio and explain how comma-separated phone numbers are split into atomic records, and how the composite key is formed.

---

### 2. 🗣️ Your Speaking Script
> *"We now execute our first mathematical normalization step: First Normal Form (1NF).*
>
> *The formal definition of 1NF requires that all attribute domains contain strictly atomic, indivisible values, with no repeating groups.*
>
> *On screen, you can see our transformation: the comma-separated telephone entries are unbundled into distinct atomic records, indicated by the green split badges.*
>
> *Every row is now uniquely identifiable by the composite Primary Key: {StudentID, CourseID, Phone_Number}. While 1NF achieves domain atomicity, it severely inflates row count and exposes partial key dependencies."*

---

### 3. 🧠 Core Concepts You Must Know
- **1NF Definition:** A relation $R$ is in 1NF if and only if all underlying domains contain only atomic values ($\forall t \in R, \forall A, t[A] \in \text{atomic}(\text{dom}(A))$).
- **Atomic Value:** A scalar value that cannot be divided into smaller meaningful components by the DBMS.
- **Composite Primary Key:** A primary key made of two or more attributes combined to uniquely identify a tuple.

---

### 4. 💡 Top 3 Anticipated Viva Questions & Model Answers

**Q1: What are the two essential requirements to declare a relation in 1NF?**
> **Ans:** 
> 1. Each cell must contain only a single atomic scalar value (no sets, lists, or multi-valued attributes).
> 2. There must be a designated Primary Key (or Composite Key) that uniquely identifies every tuple without duplicate rows.

**Q2: Does converting a table to 1NF eliminate data redundancy?**
> **Ans:** No! In fact, splitting multi-valued attributes in 1NF often increases redundancy because all other columns (`StudentName`, `DeptName`, `InstructorName`) must be duplicated across the newly generated atomic rows.

**Q3: Why can't `StudentID` alone be the primary key in our 1NF table?**
> **Ans:** Because a single student can have multiple phone numbers and can enroll in multiple courses, resulting in multiple rows with the same `StudentID`. Unique identification requires `{StudentID, CourseID, PhoneNumber}`.
