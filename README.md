# ⚡ SchemaMorph 3NF | Interactive Database Normalization Studio

> **Thakur College Of Engineering & Technology (TCET)**  
> **Module 5: Inquiry-Based Learning — Database Normalization to Third Normal Form (3NF)**  
> **Group Presentation: Roll No. 49 to 60**

---

## 🌟 Overview

**SchemaMorph 3NF** is an interactive, visual, and mathematical database normalization studio. It demonstrates the complete step-by-step transformation of an unnormalized education database (`UNF`) into clean, ACID-compliant **Third Normal Form (3NF)** with zero data loss.

---

## 🚀 Key Features

1. **🎬 Morph Studio**: Interactive stepper and live visual decomposition from `UNF` → `1NF` → `2NF` → `3NF` with real-time relational telemetry (Redundancy, ACID score, Anomaly Risk).
2. **💥 Anomaly Crash-Lab**: Live stress-testing of **Insertion**, **Update**, and **Deletion** anomalies with simulated terminal logs and side-by-side comparison against 3NF.
3. **🕸️ Functional Dependency Laser Graph**: Interactive SVG dependency mapping with animated laser photon flow for Partial, Transitive, and Full FDs.
4. **🎮 Decomposition Sandbox**: Gamified relational decomposition lab with score XP, flame streaks, and celebration confetti.
5. **📜 SQL & Schema Studio**: Side-by-side comparison of denormalized vs. 3NF production DDL with an in-memory SQL query tester.
6. **🎙️ 12-Speaker Presenter Mode**: Dedicated teleprompter cue cards and live viva defense handbook for **Speakers 49 through 60**.
7. **🌓 Theme Customizer**: Switch between **Frost Glass Light** and **Cyberpunk Neon Dark** modes.

---

## 🛠️ How to Run Locally

### Using Node.js (Recommended):
```bash
node local_server.js
```
Open **[http://localhost:5000](http://localhost:5000)** in your browser.

### Using Python:
```bash
python -m http.server 5000
```
Open **[http://localhost:5000](http://localhost:5000)** in your browser.

---

## ⌨️ Presentation Keyboard Shortcuts

| Shortcut | Description |
|---|---|
| <kbd>Space</kbd> / <kbd>→</kbd> | Advance to next normal form / speaker |
| <kbd>←</kbd> | Previous normal form / speaker |
| <kbd>P</kbd> | Toggle 12-speaker teleprompter drawer |
| <kbd>V</kbd> | Open Viva Defense Hub (Q&A flashcards) |
| <kbd>T</kbd> | Toggle Dark Cyber / Frost Light theme |
| <kbd>M</kbd> | Toggle procedural Web Audio sound FX |
| <kbd>1</kbd>–<kbd>5</kbd> | Switch tabs |

---

## 📁 Repository Structure

```
edu-db-normalizer/
├── index.html              # Main single-page application structure
├── styles.css              # Cyberpunk & Neumorphic Design System
├── vercel.json             # Static deployment configuration
├── js/                     # Application JavaScript modules
│   ├── app.js              # Application controller & state management
│   ├── particles.js        # Particle canvas & confetti celebration engine
│   ├── soundFx.js          # Procedural Web Audio synthesizer
│   ├── normalization.js    # Normalization schemas, tables, and proofs
│   ├── dependencyGraph.js  # Interactive SVG laser dependency graph
│   ├── anomalySimulator.js # Crash-Lab stress-test simulation engine
│   ├── sandboxLab.js       # Gamified decomposition sandbox
│   └── presenterMode.js    # 12-Speaker presenter HUD & viva engine
├── speaker-cards/          # 12 Speaker cue cards (Speakers 49 to 60)
│   ├── ALL_12_SPEAKERS_MASTER_CARDS.md
│   ├── speaker_49_intro_and_problem.md
│   ├── speaker_50_unf_monolith.md
│   └── ... (up to speaker_60)
└── README.md
```

---

## 🎓 Academic Viva Defense Reference

All 12 speaker cue cards and model viva questions are located in the [`speaker-cards/`](speaker-cards/) directory and inside the app's **Viva Defense Hub** modal (<kbd>V</kbd>).
