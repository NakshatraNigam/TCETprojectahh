/* ==========================================================================
   SchemaMorph 3NF - Interactive Decomposition Sandbox Game Engine
   ========================================================================== */

const SANDBOX_MISSIONS = [
  {
    missionId: 1,
    targetForm: "1NF",
    title: "Mission 1: Enforce 1NF Domain Atomicity",
    description: "Identify and isolate the multi-valued attribute that violates First Normal Form.",
    poolAttributes: [
      { id: "StudentID", label: "StudentID", isTarget: false },
      { id: "StudentName", label: "StudentName", isTarget: false },
      { id: "PhoneNumbers", label: "Phone_Numbers (Multi-Valued)", isTarget: true },
      { id: "CourseID", label: "CourseID", isTarget: false },
      { id: "Credits", label: "Credits", isTarget: false }
    ],
    hint: "Look for the attribute holding comma-separated telephone entries!",
    correctExplanation: "Excellent! 1NF requires atomic values. Separating Phone_Numbers into individual atomic records ensures each cell holds strictly indivisible values."
  },
  {
    missionId: 2,
    targetForm: "2NF",
    title: "Mission 2: Eliminate Partial Dependencies",
    description: "Select attributes that depend ONLY on CourseID (subset of candidate key {StudentID, CourseID}) to extract the Course entity.",
    poolAttributes: [
      { id: "CourseID", label: "CourseID [PK]", isTarget: true },
      { id: "CourseName", label: "CourseTitle", isTarget: true },
      { id: "Credits", label: "Credits", isTarget: true },
      { id: "Grade", label: "Grade (Requires Both)", isTarget: false },
      { id: "Semester", label: "Semester (Requires Both)", isTarget: false },
      { id: "StudentName", label: "StudentName (Depends on StudentID)", isTarget: false }
    ],
    hint: "Which attributes depend solely on CourseID and do NOT need StudentID?",
    correctExplanation: "Perfect! CourseTitle and Credits depend solely on CourseID. Extracting them eliminates partial dependencies and achieves 2NF."
  },
  {
    missionId: 3,
    targetForm: "3NF",
    title: "Mission 3: Eliminate Transitive Dependencies",
    description: "Identify attributes that form a transitive chain from InstructorID to extract the Instructors relation.",
    poolAttributes: [
      { id: "InstructorID", label: "InstructorID [Det]", isTarget: true },
      { id: "InstructorName", label: "InstructorName", isTarget: true },
      { id: "InstructorOffice", label: "OfficeRoom", isTarget: true },
      { id: "DepartmentID", label: "DepartmentID", isTarget: true },
      { id: "Grade", label: "Grade", isTarget: false },
      { id: "Credits", label: "Course Credits", isTarget: false }
    ],
    hint: "Find attributes that describe the faculty member (Instructor) rather than the Course directly.",
    correctExplanation: "Outstanding! CourseID → InstructorID → {InstructorName, OfficeRoom, DepartmentID} is a transitive dependency. Decomposing it into 'Instructors' achieves pure 3NF!"
  }
];

class SandboxLab {
  constructor() {
    this.currentMissionIndex = 0;
    this.selectedAttributes = new Set();
    this.score = 0;
    this.streak = 0;
  }

  init() {
    this.renderHUD();
    this.renderBoard();
  }

  renderHUD() {
    const mission = SANDBOX_MISSIONS[this.currentMissionIndex];
    const scoreEl = document.getElementById("sandboxScore");
    const streakEl = document.getElementById("sandboxStreak");
    const targetFormEl = document.getElementById("sandboxTargetForm");

    if (scoreEl) scoreEl.innerText = this.score;
    if (streakEl) streakEl.innerText = this.streak;
    if (targetFormEl) targetFormEl.innerText = mission.targetForm;

    const missionTitleEl = document.getElementById("sandboxMissionTitle");
    const missionDescEl = document.getElementById("sandboxMissionDesc");
    if (missionTitleEl) missionTitleEl.innerText = mission.title;
    if (missionDescEl) missionDescEl.innerText = mission.description;
  }

  renderBoard() {
    const mission = SANDBOX_MISSIONS[this.currentMissionIndex];
    const poolContainer = document.getElementById("sandboxAttrPool");
    const targetContainer = document.getElementById("sandboxSelectedPool");
    const feedbackBox = document.getElementById("sandboxFeedbackBox");

    if (!poolContainer || !targetContainer) return;

    if (feedbackBox) feedbackBox.style.display = "none";

    poolContainer.innerHTML = mission.poolAttributes
      .filter(attr => !this.selectedAttributes.has(attr.id))
      .map(attr => `
        <div class="draggable-attr-tag" onclick="window.sandboxLab.toggleSelect('${attr.id}')">
          <span>🏷️</span> ${attr.label}
        </div>
      `).join('');

    targetContainer.innerHTML = Array.from(this.selectedAttributes).map(attrId => {
      const attr = mission.poolAttributes.find(a => a.id === attrId);
      return `
        <div class="draggable-attr-tag selected" onclick="window.sandboxLab.toggleSelect('${attrId}')">
          <span>✨</span> ${attr ? attr.label : attrId} &times;
        </div>
      `;
    }).join('') || `<div style="color: var(--text-muted); font-size: 0.82rem; padding: 1rem;">Click attributes on the left to add them to your decomposed table...</div>`;
  }

  toggleSelect(attrId) {
    if (window.soundEngine) window.soundEngine.playClick();
    if (this.selectedAttributes.has(attrId)) {
      this.selectedAttributes.delete(attrId);
    } else {
      this.selectedAttributes.add(attrId);
    }
    this.renderBoard();
  }

  verifySolution() {
    const mission = SANDBOX_MISSIONS[this.currentMissionIndex];
    const targetIds = mission.poolAttributes.filter(a => a.isTarget).map(a => a.id);
    const selectedArray = Array.from(this.selectedAttributes);

    const isMatch = targetIds.length === selectedArray.length && targetIds.every(id => this.selectedAttributes.has(id));

    const feedbackBox = document.getElementById("sandboxFeedbackBox");

    if (isMatch) {
      if (window.soundEngine) {
        window.soundEngine.playSuccess();
        window.soundEngine.playXP();
      }
      if (window.confettiCannon) {
        window.confettiCannon.fire(window.innerWidth / 2, window.innerHeight * 0.5, 90);
      }

      this.score += 150;
      this.streak += 1;
      this.renderHUD();

      if (window.app) window.app.showToast("🎉 Mission Completed! +150 XP Earned!");

      if (feedbackBox) {
        feedbackBox.style.display = "block";
        feedbackBox.className = "status-alert-box success";
        feedbackBox.innerHTML = `
          <div>
            <strong>✅ DECOMPOSITION VERIFIED! (+150 XP • 🔥 Streak x${this.streak})</strong>
            <p style="margin-top: 4px;">${mission.correctExplanation}</p>
          </div>
        `;
      }

      setTimeout(() => {
        if (this.currentMissionIndex < SANDBOX_MISSIONS.length - 1) {
          this.currentMissionIndex++;
          this.selectedAttributes.clear();
          this.renderHUD();
          this.renderBoard();
        } else {
          // Final 3NF Mastery Victory
          if (window.confettiCannon) {
            window.confettiCannon.fire(window.innerWidth / 2, window.innerHeight * 0.4, 150);
          }
          if (feedbackBox) {
            feedbackBox.innerHTML = `
              <div>
                <strong>🏆 3NF RELATIONAL MASTERY CERTIFIED! (+500 BONUS XP)</strong>
                <p style="margin-top: 4px;">You have successfully decomposed and validated all normal forms for Thakur College Of Engineering Technology Module 5!</p>
              </div>
            `;
          }
          if (window.app) window.app.showToast("🏆 3NF Master Certification Awarded!");
        }
      }, 2400);

    } else {
      if (window.soundEngine) window.soundEngine.playAnomaly();
      this.streak = 0;
      this.renderHUD();

      if (feedbackBox) {
        feedbackBox.style.display = "block";
        feedbackBox.className = "status-alert-box danger";
        feedbackBox.innerHTML = `
          <div>
            <strong>❌ INCORRECT DECOMPOSITION</strong>
            <p style="margin-top: 4px;">Hint: ${mission.hint}</p>
          </div>
        `;
      }
    }
  }

  resetCurrentMission() {
    if (window.soundEngine) window.soundEngine.playClick();
    this.selectedAttributes.clear();
    this.renderBoard();
  }
}

window.sandboxLab = new SandboxLab();
