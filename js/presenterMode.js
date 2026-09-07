/* ==========================================================================
   SchemaMorph 3NF - 12-Speaker Presentation Flow & Stage Director Engine
   Thakur College Of Engineering Technology - Module 5 Inquiry-Based Learning
   ========================================================================== */

const PRESENTATION_SPEAKERS = [
  {
    speakerNumber: 49,
    title: "49. Introduction & The Problem Statement",
    subtitle: "Setting the Stage: Why Database Normalization is Crucial",
    targetTab: "storyboard",
    targetStage: 0,
    timeLimit: "90 Seconds",
    actionPrompt: "Open Morph Studio on the UNF Monolithic Table",
    script: [
      "Good morning respected professors and peers. We are presenting our TCET Module 5 Inquiry-Based Learning project on Database Normalization to Third Normal Form (3NF).",
      "In real-world educational institutions, unnormalized data architectures lead to catastrophic redundancy, storage inflation, and data corruption.",
      "Today, our team (Roll No. 49 to 60) will take you through a live visual and mathematical decomposition of an unnormalized education database, proving why each transformation step is essential."
    ],
    speakingPoints: [
      "Introduce the TCET Module 5 Inquiry-Based task.",
      "Explain the concept of an unnormalized universal relation (R).",
      "State the goal: achieving a lossless, dependency-preserving 3NF architecture."
    ],
    vivaQuestion: "Why can't large enterprises just store everything in one denormalized table for fast reads?",
    vivaAnswer: "While single tables avoid JOIN overhead for simple reads, they suffer from critical write anomalies (insert, update, delete) and violate ACID principles as data scales."
  },
  {
    speakerNumber: 50,
    title: "50. Anatomy of the Unnormalized Monolith (UNF)",
    subtitle: "Exposing Multi-Valued Attributes & Data Redundancy",
    targetTab: "storyboard",
    targetStage: 0,
    timeLimit: "90 Seconds",
    actionPrompt: "Hover over the Phone_Numbers and Instructor columns in the UNF table",
    script: [
      "Here on screen is our unnormalized universal table: TCET_Enrollment_Master.",
      "Notice the red-highlighted 'Phone_Numbers' column: student Aarav Mehta has multiple contact numbers crammed into a single cell, separated by commas.",
      "Furthermore, faculty details like 'Dr. Rajesh Sharma', his office 'Room 402', and department info are repeated across every single course enrollment record. This directly sets the stage for data anomalies."
    ],
    speakingPoints: [
      "Highlight non-atomic multi-valued attributes (violates 1NF definition).",
      "Point out data redundancy across instructor office locations and department blocks.",
      "Explain that no single attribute can serve as a non-redundant primary key."
    ],
    vivaQuestion: "What mathematical property is violated by multi-valued attributes?",
    vivaAnswer: "The Relational Model domain atomicity requirement: every attribute value must be an indivisible atomic element from dom(A)."
  },
  {
    speakerNumber: 51,
    title: "51. Live Demonstration: Insertion Anomaly",
    subtitle: "The Danger of Coupled Primary Keys",
    targetTab: "anomaly",
    anomalyIndex: 0,
    timeLimit: "90 Seconds",
    actionPrompt: "Click '⚡ Run Anomaly Stress-Test' on Insertion Anomaly",
    script: [
      "I will now demonstrate the Insertion Anomaly live in our Crash-Lab.",
      "Suppose TCET introduces a brand new advanced elective: 'CS505 - Cloud Computing' taught by Prof. Vikram Patel before any students have registered.",
      "In the unnormalized schema, because StudentID is required for the candidate key, inserting a course without a student causes a NULL Primary Key error (Entity Integrity Constraint violation). As you see on screen, 3NF solves this by isolating Courses into its own table."
    ],
    speakingPoints: [
      "Trigger the Insertion Anomaly stress test.",
      "Demonstrate why courses cannot exist without student enrollments in UNF.",
      "Compare the failure against the clean atomic 3NF INSERT statement."
    ],
    vivaQuestion: "What is Entity Integrity Constraint and how does it cause the Insertion Anomaly?",
    vivaAnswer: "Entity Integrity states that no primary key attribute can contain NULL. Because StudentID is part of the composite key, courses without students cannot be stored."
  },
  {
    speakerNumber: 52,
    title: "52. Live Demonstration: Update & Deletion Anomalies",
    subtitle: "Data Inconsistency Hazards & Irreversible Data Loss",
    targetTab: "anomaly",
    anomalyIndex: 1,
    timeLimit: "90 Seconds",
    actionPrompt: "Switch to Update Anomaly & Deletion Anomaly and run tests",
    script: [
      "Let's look at the Update and Deletion Anomalies.",
      "When Dr. Rajesh Sharma relocates his office to Room 612, an unnormalized system must update thousands of individual student records. If one update packet drops, data becomes contradictory.",
      "Even worse, as demonstrated in our Deletion test: when student Rohan Shah drops his elective AI401, deleting his record wipes out the entire course information from the university system! In 3NF, deleting an enrollment tuple leaves the course and instructor records 100% intact."
    ],
    speakingPoints: [
      "Demonstrate Update Anomaly: inconsistent duplicate data states.",
      "Demonstrate Deletion Anomaly: loss of valuable course/instructor knowledge.",
      "Show how 3NF separates concerns into independent relational entities."
    ],
    vivaQuestion: "How does 3NF eliminate modification anomalies mathematically?",
    vivaAnswer: "By ensuring every determinant is a superkey, every fact is stored exactly once, eliminating redundant update targets."
  },
  {
    speakerNumber: 53,
    title: "53. First Normal Form (1NF) Transformation",
    subtitle: "Enforcing Strict Domain Atomicity & Composite Keys",
    targetTab: "storyboard",
    targetStage: 1,
    timeLimit: "90 Seconds",
    actionPrompt: "Advance to Stage 1 (1NF) in Morph Studio",
    script: [
      "We now execute our first mathematical transformation: First Normal Form (1NF).",
      "To satisfy 1NF, every attribute must hold only indivisible, atomic values. We unbundle the comma-separated telephone strings into distinct atomic rows, shown by the green split badges.",
      "Every tuple is now uniquely identified by the composite candidate key: {StudentID, CourseID, PhoneNumber}. However, while 1NF solves atomicity, it introduces massive key-subset redundancy."
    ],
    speakingPoints: [
      "Explain the formal definition: 1NF ⟺ ∀ t ∈ R, ∀ A, t[A] ∈ atomic(dom(A)).",
      "Show the atomic expansion of contact numbers.",
      "Identify the composite primary key: {StudentID, CourseID, PhoneNumber}."
    ],
    vivaQuestion: "Is 1NF sufficient to eliminate data duplication?",
    vivaAnswer: "No, 1NF only enforces atomicity. Partial and transitive functional dependencies still cause extreme duplication across composite keys."
  },
  {
    speakerNumber: 54,
    title: "54. Functional Dependencies & The Math Behind 1NF Flaws",
    subtitle: "Mapping Determinants and Dependent Attribute Sets",
    targetTab: "graph",
    filterType: "all",
    timeLimit: "90 Seconds",
    actionPrompt: "Open Dependency Graph and click on StudentID and CourseID nodes",
    script: [
      "To understand why 1NF fails, we must analyze the Functional Dependencies (FDs) shown on our interactive SVG graph.",
      "A functional dependency X → Y means attribute X uniquely determines attribute Y.",
      "Notice our composite key is {StudentID, CourseID}. But look at the red dashed lines: StudentName and DeptID depend solely on StudentID! Meanwhile, CourseTitle and Credits depend solely on CourseID. These are Partial Dependencies, which violate Second Normal Form."
    ],
    speakingPoints: [
      "Define Functional Dependency: X determines Y uniquely.",
      "Highlight the red dashed lines representing Partial Dependencies.",
      "Explain why non-prime attributes depending on key subsets cause anomalies."
    ],
    vivaQuestion: "What is the formal difference between a Prime and Non-Prime attribute?",
    vivaAnswer: "A Prime attribute is an attribute that is a member of any candidate key. A Non-Prime attribute is not part of any candidate key."
  },
  {
    speakerNumber: 55,
    title: "55. Second Normal Form (2NF) Transformation",
    subtitle: "Elimination of Partial Functional Dependencies",
    targetTab: "storyboard",
    targetStage: 2,
    timeLimit: "90 Seconds",
    actionPrompt: "Advance to Stage 2 (2NF) in Morph Studio and inspect table split",
    script: [
      "We now advance to Second Normal Form (2NF).",
      "The 2NF rule dictates: A relation is in 2NF if it is in 1NF and no non-prime attribute is partially dependent on any candidate key.",
      "Watch the table physically split on screen: student attributes migrate to 'Students', contact numbers to 'Student_Contacts', course attributes to 'Courses_Master', and enrollment grades to 'Enrollments'."
    ],
    speakingPoints: [
      "Formal Rule: 2NF ⟺ 1NF ∧ (No non-prime attribute is partially dependent on any candidate key).",
      "Show the decomposition into 4 focused relations.",
      "Confirm that Grade and Semester remain in Enrollments because they require both keys."
    ],
    vivaQuestion: "Can a relation with a single-attribute primary key violate 2NF?",
    vivaAnswer: "No! If a primary key consists of only a single attribute, partial key dependencies are mathematically impossible, so it is automatically in 2NF."
  },
  {
    speakerNumber: 56,
    title: "56. 2NF Residual Flaws: The Transitive Trap",
    subtitle: "Why 2NF is Not Enough for Enterprise Databases",
    targetTab: "graph",
    filterType: "transitive",
    timeLimit: "90 Seconds",
    actionPrompt: "Click 'Transitive (3NF Violations)' filter chip on the Dependency Graph",
    script: [
      "While 2NF eliminated partial dependencies, our Courses table still harbors dangerous transitive dependencies.",
      "Look at the purple glowing arcs on screen: CourseID determines InstructorID, and InstructorID determines InstructorName and OfficeRoom. Similarly, DeptID determines BuildingLocation.",
      "This is a Transitive Dependency: X → Y and Y → Z, where neither Y nor Z are candidate keys. If an instructor changes offices, we still have update anomalies in 2NF!"
    ],
    speakingPoints: [
      "Isolate the purple transitive dependency chains: CourseID → InstructorID → {Name, Office}.",
      "Explain the transitive department chain: DeptID → {Name, Building}.",
      "Demonstrate why non-key to non-key dependencies violate 3NF."
    ],
    vivaQuestion: "What is a Transitive Dependency in formal terms?",
    vivaAnswer: "If X → Y and Y → Z, where Y ⊄ X, X does not functionally determine Y, and Y is not a superkey, then X → Z is a transitive dependency."
  },
  {
    speakerNumber: 57,
    title: "57. Third Normal Form (3NF) Final Decomposition",
    subtitle: "Achieving Pure, Transitive-Free Relational Architecture",
    targetTab: "storyboard",
    targetStage: 3,
    timeLimit: "90 Seconds",
    actionPrompt: "Advance to Stage 3 (3NF) in Morph Studio",
    script: [
      "We now achieve our target state: Third Normal Form (3NF).",
      "The 3NF condition requires that for every non-trivial dependency X → A, either X is a superkey, or A is a prime attribute.",
      "We extract 'Instructors' and 'Departments' into their own dedicated relations. Notice the blue Foreign Key badges: Courses now references InstructorID, which references DepartmentID. Everything is cleanly linked with zero transitive redundancy!"
    ],
    speakingPoints: [
      "State 3NF formal condition: ∀ X → A, X is Superkey ∨ A is Prime Attribute.",
      "Show the 6 final clean relational tables.",
      "Highlight Primary Key (gold) and Foreign Key (sky blue) relational wiring."
    ],
    vivaQuestion: "What is the difference between 3NF and BCNF (Boyce-Codd Normal Form)?",
    vivaAnswer: "3NF allows X → A if A is a prime attribute even if X is not a superkey. BCNF strictly requires X to be a superkey for every functional dependency without exception."
  },
  {
    speakerNumber: 58,
    title: "58. Mathematical Proofs: Lossless Join & Dependency Preservation",
    subtitle: "Rigorous Verification of Relational Integrity",
    targetTab: "storyboard",
    targetStage: 3,
    timeLimit: "90 Seconds",
    actionPrompt: "Highlight the Mathematical Theorem box on the 3NF stage card",
    script: [
      "A decomposition is only valid if it satisfies two rigorous mathematical proofs: Lossless Join and Dependency Preservation.",
      "Lossless Join Theorem proves that R1 ∩ R2 must functionally determine either R1 or R2. In our schema, Courses ∩ Instructors = {InstructorID}, which is the Primary Key of Instructors.",
      "Therefore, joining these tables with SQL reconstructs the original dataset with 100% accuracy and zero spurious tuples. Furthermore, all functional dependencies in set F are fully preserved."
    ],
    speakingPoints: [
      "State the Lossless Join property: (R1 ∩ R2 → R1) ∨ (R1 ∩ R2 → R2).",
      "Explain why no spurious records are generated during natural joins.",
      "Confirm 100% dependency preservation across decomposed relations."
    ],
    vivaQuestion: "What is a spurious tuple, and why does a non-lossless decomposition create them?",
    vivaAnswer: "Spurious tuples are false, phantom records created during a JOIN when decomposition is done on a non-candidate key, corrupting data integrity."
  },
  {
    speakerNumber: 59,
    title: "59. Interactive Live Sandbox & Audience Challenge",
    subtitle: "Hands-On Decomposition Verification",
    targetTab: "sandbox",
    timeLimit: "90 Seconds",
    actionPrompt: "Click an attribute tag in the Sandbox and click 'Verify Decomposition'",
    script: [
      "To prove the robustness of our architecture, we built an interactive Decomposition Sandbox game.",
      "We invite our professors and peers to test attribute decomposition hands-on.",
      "For example, in Mission 1, we isolate the multi-valued Phone_Numbers attribute to achieve 1NF atomicity. When we click 'Verify Decomposition', our algorithm validates the mathematical decomposition and awards instant score feedback."
    ],
    speakingPoints: [
      "Demonstrate interactive attribute tagging in the sandbox.",
      "Click 'Verify Decomposition' to show real-time algorithm validation.",
      "Show how gamification reinforces normalization learning."
    ],
    vivaQuestion: "How does the Sandbox algorithm verify if a decomposition is correct?",
    vivaAnswer: "It computes the attribute closure (X+) of the selected attributes and verifies that all non-key attributes are fully determined by the candidate key."
  },
  {
    speakerNumber: 60,
    title: "60. Production SQL DDL & Engineering Conclusion",
    subtitle: "From Theory to Production-Ready Database Engineering",
    targetTab: "sql",
    timeLimit: "90 Seconds",
    actionPrompt: "Open SQL & Schema tab and show the 3NF DDL schema with Foreign Keys",
    script: [
      "To conclude our presentation, we examine our production SQL DDL schema.",
      "Notice how our 3NF DDL incorporates strict PRIMARY KEY definitions, FOREIGN KEY integrity constraints with ON DELETE CASCADE, and domain CHECK constraints.",
      "In summary, our team has normalized a complex education database from an anomaly-ridden monolith into a scalable, ACID-compliant, lossless 3NF schema for Thakur College Of Engineering Technology. Thank you, and we now welcome any viva questions!"
    ],
    speakingPoints: [
      "Review the production DDL statements with Foreign Key relationships.",
      "Summarize the journey: UNF (Anomalies) → 1NF (Atomic) → 2NF (Full FDs) → 3NF (Zero Transitive).",
      "Conclude and invite professor evaluation and questions."
    ],
    vivaQuestion: "What is ON DELETE CASCADE and why is it used on Student_Contacts?",
    vivaAnswer: "ON DELETE CASCADE ensures that if a student tuple is deleted, their associated contact numbers are automatically removed, preventing orphaned records."
  }
];

class PresenterModeEngine {
  constructor() {
    this.currentSpeakerIndex = 0;
    this.isOpen = false;
    this.isTeleprompterExpanded = true;
    this.timerSeconds = 90;
    this.timerInterval = null;
  }

  init() {
    this.renderPresenterHUD();
    this.renderTeleprompter();
    this.setupKeyboardShortcuts();
  }

  setupKeyboardShortcuts() {
    window.addEventListener("keydown", (e) => {
      // Don't trigger if typing in an input
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;

      if (e.key === "ArrowRight" || e.key === "PageDown") {
        this.nextSpeaker();
      } else if (e.key === "ArrowLeft" || e.key === "PageUp") {
        this.prevSpeaker();
      } else if (e.key === "p" || e.key === "P") {
        this.toggleTeleprompter();
      }
    });
  }

  goToSpeaker(speakerIdx) {
    if (speakerIdx < 0 || speakerIdx >= PRESENTATION_SPEAKERS.length) return;
    if (window.soundEngine) window.soundEngine.playClick();
    this.currentSpeakerIndex = speakerIdx;
    const speaker = PRESENTATION_SPEAKERS[speakerIdx];

    // Reset and start timer
    this.resetTimer();

    // Automatically navigate to relevant tab & stage
    if (speaker.targetTab && window.app) {
      window.app.switchTab(speaker.targetTab);

      if (speaker.targetTab === "storyboard" && typeof speaker.targetStage === "number") {
        setTimeout(() => window.app.goToStage(speaker.targetStage), 100);
      } else if (speaker.targetTab === "anomaly" && typeof speaker.anomalyIndex === "number" && window.anomalySim) {
        setTimeout(() => window.anomalySim.selectScenario(speaker.anomalyIndex), 100);
      } else if (speaker.targetTab === "graph" && speaker.filterType && window.depGraph) {
        setTimeout(() => window.depGraph.setFilter(speaker.filterType), 100);
      }
    }

    this.renderPresenterHUD();
    this.renderTeleprompter();
  }

  nextSpeaker() {
    if (this.currentSpeakerIndex < PRESENTATION_SPEAKERS.length - 1) {
      this.goToSpeaker(this.currentSpeakerIndex + 1);
    }
  }

  prevSpeaker() {
    if (this.currentSpeakerIndex > 0) {
      this.goToSpeaker(this.currentSpeakerIndex - 1);
    }
  }

  toggleTeleprompter() {
    this.isTeleprompterExpanded = !this.isTeleprompterExpanded;
    this.renderTeleprompter();
  }

  resetTimer() {
    clearInterval(this.timerInterval);
    this.timerSeconds = 90;
    this.updateTimerDisplay();
    this.timerInterval = setInterval(() => {
      if (this.timerSeconds > 0) {
        this.timerSeconds--;
        this.updateTimerDisplay();
      } else {
        clearInterval(this.timerInterval);
      }
    }, 1000);
  }

  updateTimerDisplay() {
    const el = document.getElementById("speakerTimerDisplay");
    if (!el) return;
    const mins = Math.floor(this.timerSeconds / 60);
  startTimer() {
    // Disabled for clean background presentation mode
  }

  stopTimer() {
    // Disabled
  }

  updateTimerDisplay() {
    // Disabled
  }

  renderPresenterHUD() {
    // Clean background presentation mode: no HUD bar rendered
  }

  renderTeleprompter() {
    // Clean background presentation mode: no teleprompter rendered
  }

  toggleTeleprompter() {
    // Open viva modal instead
    this.openVivaModal();
  }

  openVivaModal() {
    if (window.soundEngine) window.soundEngine.playClick();
    const modal = document.getElementById("vivaModal");
    const container = document.getElementById("vivaFlashcardsList");
    if (!modal || !container) return;

    container.innerHTML = PRESENTATION_SPEAKERS.map((s, idx) => `
      <div class="viva-flashcard">
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <span class="viva-card-speaker">🎙️ Speaker ${s.speakerNumber} (Roll ${s.speakerNumber})</span>
          <span class="academic-tag" style="font-size: 0.65rem; padding: 2px 6px;">Speaker ${idx + 1}/12</span>
        </div>
        <div class="viva-card-q">
          ❓ "${s.vivaQuestion}"
        </div>
        <button class="ctrl-btn" style="font-size: 0.75rem; padding: 0.35rem 0.75rem; align-self: flex-start;" 
                onclick="const ans = document.getElementById('vivaAns_${idx}'); ans.style.display = ans.style.display === 'none' ? 'block' : 'none';">
          👁️ Toggle Model Answer
        </button>
        <div id="vivaAns_${idx}" class="viva-card-ans" style="display: block;">
          <strong>Model Viva Answer:</strong> ${s.vivaAnswer}
        </div>
      </div>
    `).join('');

    modal.style.display = "flex";
  }

  closeVivaModal() {
    const modal = document.getElementById("vivaModal");
    if (modal) modal.style.display = "none";
  }
}

window.presenterEngine = new PresenterModeEngine();

