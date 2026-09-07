# 🎙️ SPEAKER 59 CHEAT-SHEET (Speaker 11 • Roll No. 59)
## Topic: Interactive Live Sandbox Verification & Algorithmic Validation
**Institution:** Thakur College Of Engineering Technology (TCET) • Module 5 Inquiry-Based Learning  
**Target Screen:** 🎮 Decomposition Sandbox  
**Time Limit:** 60–90 Seconds

---

### 1. 📌 Your Role & What's on Screen
You demonstrate the **interactive gamified Sandbox** live. You click on attribute tags, slot them into decomposed tables, and click **"✨ Verify Decomposition"** to prove the underlying algorithm validates the relational logic dynamically.

---

### 2. 🗣️ Your Speaking Script
> *"To prove the practical robustness of our normalization logic, we engineered an interactive Decomposition Sandbox laboratory.*
>
> *We invite everyone to test relational decomposition interactively.*
>
> *For example, in Mission 1 on screen, we identify and isolate the multi-valued Phone_Numbers attribute to enforce 1NF domain atomicity.*
>
> *When we click '✨ Verify Decomposition', our underlying validation engine checks the candidate keys, awards instant score feedback (+150 XP), and advances to the next normal form challenge!"*

---

### 3. 🧠 Core Concepts You Must Know
- **Attribute Closure ($X^+$):** The complete set of attributes that are functionally determined by attribute set $X$ under a given set of functional dependencies $F$.
- **Decomposition Algorithm:** Checking whether $R_1 \cup R_2 = R$, computing keys, and verifying that non-key attributes are fully dependent on the chosen determinant.
- **Inquiry-Based Learning:** An active pedagogical approach where students learn by exploring, testing hypotheses, and verifying theoretical models in interactive environments.

---

### 4. 💡 Top 3 Anticipated Viva Questions & Model Answers

**Q1: How does an algorithm determine if a chosen attribute set $X$ is a Candidate Key?**
> **Ans:** It computes the attribute closure $X^+$ using Armstrong's axioms. If $X^+$ includes all attributes of relation $R$ ($X^+ = R$) and no proper subset of $X$ determines $R$, then $X$ is a Candidate Key.

**Q2: What are Armstrong's Axioms for Functional Dependencies?**
> **Ans:** 
> 1. **Reflexivity:** If $Y \subseteq X$, then $X \rightarrow Y$.
> 2. **Augmentation:** If $X \rightarrow Y$, then $XZ \rightarrow YZ$.
> 3. **Transitivity:** If $X \rightarrow Y$ and $Y \rightarrow Z$, then $X \rightarrow Z$.

**Q3: How does the Sandbox verify that 1NF is achieved?**
> **Ans:** It checks that no multi-valued attributes remain in the primary entity relation and that a valid composite candidate key uniquely identifies every atomic row.
