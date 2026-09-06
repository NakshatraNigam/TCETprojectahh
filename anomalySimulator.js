/* ==========================================================================
   SchemaMorph 3NF - Anomaly Crash-Lab Simulator (High-Octane Edition)
   ========================================================================== */

const ANOMALY_SCENARIOS = [
  {
    id: "insert",
    name: "Insertion Anomaly",
    icon: "➕",
    pillClass: "insert-mode",
    title: "Scenario: Introducing a New Course Before Student Registration",
    description: "The University Board introduces a new elective: <strong>CS505 (Cloud Computing)</strong> taught by <strong>Prof. Vikram Patel</strong> before any student has enrolled.",
    unfActionTitle: "Execution on UNF / 1NF Schema",
    unfStatus: "danger",
    unfStatusText: "CRITICAL INTEGRITY FAILURE (Insertion Anomaly)",
    unfExplanation: "In UNF/1NF, the primary key requires <code>StudentID</code>. We CANNOT insert a course record without a student because <code>StudentID</code> cannot be NULL (Entity Integrity Constraint violation). The database either rejects the course or requires dangerous dummy student records like 'TCET-DUMMY'.",
    unfLogs: [
      "[0.01ms] BEGIN TRANSACTION TX_9041;",
      "[0.12ms] INSERT INTO TCET_Enrollment_Master (StudentID, CourseID, CourseName) VALUES (NULL, 'CS505', 'Cloud Computing');",
      "[0.25ms] ❌ ERROR: ORA-01400: cannot insert NULL into (StudentID) - Primary Key Entity Integrity violated!",
      "[0.40ms] ATTEMPTING DIRTY FALLBACK: Inserting fake student 'TCET-DUMMY'...",
      "[0.55ms] ⚠️ WARNING: Database corrupted with fake orphan tuples! Integrity compromised."
    ],
    unfMockData: [
      { StudentID: "NULL ❌ (Constraint Error)", CourseID: "CS505", CourseName: "Cloud Computing", InstructorName: "Prof. Vikram Patel" },
      { StudentID: "TCET-DUMMY ⚠️ (Dirty Data)", CourseID: "CS505", CourseName: "Cloud Computing", InstructorName: "Prof. Vikram Patel" }
    ],
    threeNfActionTitle: "Execution on 3NF Schema",
    threeNfStatus: "success",
    threeNfStatusText: "CLEAN ATOMIC INSERTION (Zero Redundancy)",
    threeNfExplanation: "In 3NF, the <code>Courses</code> entity is completely independent of <code>Enrollments</code>. We simply insert one row into the <code>Courses</code> table referencing Foreign Key <code>InstructorID='INS-103'</code>. Zero student dependencies required!",
    threeNfLogs: [
      "[0.01ms] BEGIN TRANSACTION TX_9042;",
      "[0.10ms] INSERT INTO Courses (CourseID, CourseTitle, Credits, InstructorID) VALUES ('CS505', 'Cloud Computing', 4, 'INS-103');",
      "[0.22ms] Checking FK FK_Courses_Instructors: 'INS-103' verified in Instructors table. Valid.",
      "[0.31ms] COMMIT TRANSACTION TX_9042; (Execution: 0.31ms)",
      "[0.38ms] ✅ SUCCESS: Course CS505 created independently. 0 Student records locked or required."
    ],
    threeNfSql: "INSERT INTO Courses (CourseID, CourseTitle, Credits, InstructorID) VALUES ('CS505', 'Cloud Computing', 4, 'INS-103');",
    threeNfMockData: [
      { CourseID: "CS505", CourseTitle: "Cloud Computing", Credits: 4, InstructorID: "INS-103" }
    ]
  },
  {
    id: "update",
    name: "Update / Modification Anomaly",
    icon: "🔄",
    pillClass: "update-mode",
    title: "Scenario: Relocating Dr. Rajesh Sharma's Faculty Office",
    description: "<strong>Dr. Rajesh Sharma (INS-101)</strong> relocates his faculty research office from <strong>Room 402</strong> to <strong>Innovation Hub Rm 612</strong>.",
    unfActionTitle: "Execution on UNF / 1NF Schema",
    unfStatus: "danger",
    unfStatusText: "DATA INCONSISTENCY HAZARD (Update Anomaly)",
    unfExplanation: "In UNF/1NF, Dr. Sharma's office room is duplicated across every single student enrollment record. Updating 10,000 student records is computationally slow, and if even one record fails during a batch update, the database falls into a contradictory state (Aarav sees Room 612, Diya sees Room 402).",
    unfLogs: [
      "[0.02ms] BEGIN TRANSACTION TX_9043;",
      "[0.15ms] UPDATE TCET_Enrollment_Master SET InstructorOffice = 'Room 612' WHERE InstructorID = 'INS-101';",
      "[0.88ms] Lock escalation: 10,000 rows locked across active student registrations.",
      "[1.42ms] Network timeout on batch chunk #4: 2 tuples failed to update!",
      "[1.90ms] 🚨 SEVERE: Inconsistent database state! Aarav sees Room 612 while Diya sees Room 402."
    ],
    unfMockData: [
      { Student: "Aarav Mehta", Course: "CS301", Instructor: "Dr. Rajesh Sharma", Office: "Room 612 (Updated)" },
      { Student: "Diya Nair", Course: "CS301", Instructor: "Dr. Rajesh Sharma", Office: "Room 402 ❌ (Missed / Inconsistent!)" }
    ],
    threeNfActionTitle: "Execution on 3NF Schema",
    threeNfStatus: "success",
    threeNfStatusText: "SINGLE-TUPLE ATOMIC UPDATE",
    threeNfExplanation: "In 3NF, Dr. Sharma's office exists in exactly ONE place: the <code>Instructors</code> table. A single row update guarantees 100% global consistency across all course enrollments instantly.",
    threeNfLogs: [
      "[0.01ms] BEGIN TRANSACTION TX_9044;",
      "[0.08ms] UPDATE Instructors SET OfficeRoom = 'Room 612' WHERE InstructorID = 'INS-101';",
      "[0.15ms] Row ID PK_INS-101 updated in 0.15ms.",
      "[0.22ms] COMMIT TRANSACTION TX_9044;",
      "[0.29ms] ✅ SUCCESS: Exactly 1 tuple updated. All student queries instantly reflect Room 612 via JOIN."
    ],
    threeNfSql: "UPDATE Instructors SET OfficeRoom = 'Room 612' WHERE InstructorID = 'INS-101';",
    threeNfMockData: [
      { InstructorID: "INS-101", InstructorName: "Dr. Rajesh Sharma", OfficeRoom: "Room 612 (Updated Once)" }
    ]
  },
  {
    id: "delete",
    name: "Deletion Anomaly",
    icon: "🗑️",
    pillClass: "active",
    title: "Scenario: Last Student Drops an Advanced Specialized Course",
    description: "Student <strong>Rohan Shah</strong> drops out of <strong>AI401 (Machine Learning)</strong>, where he was the only enrolled student.",
    unfActionTitle: "Execution on UNF / 1NF Schema",
    unfStatus: "danger",
    unfStatusText: "CATASTROPHIC DATA LOSS (Deletion Anomaly)",
    unfExplanation: "In UNF/1NF, deleting Rohan Shah's enrollment record physically deletes the entire row. As a side-effect, all knowledge that the course 'AI401', its syllabus credits, and Prof. Vikram Patel's teaching assignment exist is permanently wiped from the database!",
    unfLogs: [
      "[0.02ms] BEGIN TRANSACTION TX_9045;",
      "[0.18ms] DELETE FROM TCET_Enrollment_Master WHERE StudentID = 'TCET-2026-03' AND CourseID = 'AI401';",
      "[0.35ms] Physical row deletion complete. 1 tuple purged from storage.",
      "[0.65ms] 💥 CATASTROPHIC LOSS: Course AI401 syllabus and faculty assignment no longer exist anywhere in system!",
      "[0.90ms] Query 'SELECT * FROM Courses WHERE CourseID=AI401' returns 0 rows (Unintended Data Wipe)."
    ],
    unfMockData: [
      { Status: "DELETED ❌", Detail: "Row for Student TCET-2026-03 removed. AI401 Course Info & Instructor details completely LOST!" }
    ],
    threeNfActionTitle: "Execution on 3NF Schema",
    threeNfStatus: "success",
    threeNfStatusText: "ISOLATED & SAFE DELETION",
    threeNfExplanation: "In 3NF, we only delete the single tuple from the <code>Enrollments</code> bridge table. The <code>Courses</code>, <code>Instructors</code>, and <code>Departments</code> records remain completely safe and untouched!",
    threeNfLogs: [
      "[0.01ms] BEGIN TRANSACTION TX_9046;",
      "[0.09ms] DELETE FROM Enrollments WHERE StudentID = 'TCET-2026-03' AND CourseID = 'AI401';",
      "[0.16ms] 1 tuple removed from Enrollments bridge relation.",
      "[0.24ms] Courses entity intact (AI401 preserved). Instructors entity intact (Prof. Patel preserved).",
      "[0.30ms] COMMIT TRANSACTION TX_9046; ✅ 100% Relational Knowledge Preserved."
    ],
    threeNfSql: "DELETE FROM Enrollments WHERE StudentID = 'TCET-2026-03' AND CourseID = 'AI401';",
    threeNfMockData: [
      { Table: "Enrollments", Status: "1 Row Removed" },
      { Table: "Courses", Status: "AI401 Intact & Preserved ✅" },
      { Table: "Instructors", Status: "Prof. Vikram Patel Intact ✅" }
    ]
  }
];

class AnomalySimulator {
  constructor() {
    this.currentScenarioIndex = 0;
    this.simulated = false;
  }

  init() {
    this.renderSelector();
    this.renderArena();
  }

  renderSelector() {
    const container = document.getElementById("anomalySelectorList");
    if (!container) return;

    container.innerHTML = ANOMALY_SCENARIOS.map((sc, idx) => `
      <button class="anomaly-card-btn ${idx === this.currentScenarioIndex ? `active ${sc.pillClass}` : ''}" 
              onclick="window.anomalySim.selectScenario(${idx})">
        <div class="anomaly-type-title">
          <span>${sc.icon}</span> ${sc.name}
        </div>
        <div class="anomaly-desc-short">${sc.description.replace(/<[^>]*>?/gm, '').substring(0, 75)}...</div>
      </button>
    `).join('');
  }

  selectScenario(index) {
    if (window.soundEngine) window.soundEngine.playClick();
    this.currentScenarioIndex = index;
    this.simulated = false;
    this.renderSelector();
    this.renderArena();
  }

  triggerSimulation() {
    if (window.soundEngine) {
      window.soundEngine.playAnomaly();
    }
    this.simulated = true;
    this.renderArena();
    if (window.app) window.app.showToast(`⚡ Running Stress-Test on ${ANOMALY_SCENARIOS[this.currentScenarioIndex].name}...`);
  }

  renderArena() {
    const sc = ANOMALY_SCENARIOS[this.currentScenarioIndex];
    const container = document.getElementById("anomalyArenaContainer");
    if (!container) return;

    container.innerHTML = `
      <div class="glass-panel arena-controls-bar">
        <div class="arena-scenario-details">
          <h3>${sc.title}</h3>
          <p>${sc.description}</p>
        </div>
        <button class="trigger-anomaly-btn pulse-glow" onclick="window.anomalySim.triggerSimulation()">
          ⚡ Run Anomaly Stress-Test
        </button>
      </div>

      <div class="comparison-split">
        <!-- UNF Side -->
        <div class="side-by-side-card ${this.simulated ? 'pulse-glow' : ''}">
          <div class="side-by-side-header fail">
            <span>🔴 Denormalized Schema (UNF / 1NF)</span>
            <span class="academic-tag" style="border-color: #FECDD3; color: #BE123C; background: #FFF1F2;">Vulnerable</span>
          </div>

          <div class="status-alert-box danger">
            <div>
              <strong>${sc.unfStatusText}</strong>
              <p style="margin-top: 4px;">${sc.unfExplanation}</p>
            </div>
          </div>

          <!-- Transaction Terminal Logs -->
          <div style="padding: 0 1.25rem 0.75rem;">
            <div style="font-size: 0.74rem; font-weight: 800; color: #BE123C; margin-bottom: 0.35rem; text-transform: uppercase;">
              🖥️ Simulated Transaction Log:
            </div>
            <div style="background: rgba(15, 23, 42, 0.95); border: 1px solid rgba(225, 29, 72, 0.3); border-radius: 8px; padding: 0.75rem 1rem; font-family: 'JetBrains Mono', monospace; font-size: 0.75rem; color: #FDA4AF; line-height: 1.6; max-height: 120px; overflow-y: auto;">
              ${sc.unfLogs.map(l => `<div>${l}</div>`).join('')}
            </div>
          </div>

          <div class="data-table-wrapper" style="padding: 0 1.25rem 1.25rem;">
            <div style="font-size: 0.74rem; font-weight: 800; color: #BE123C; margin-bottom: 0.5rem; text-transform: uppercase;">
              Database State Under Stress:
            </div>
            <table class="schema-data-table">
              <thead>
                <tr>
                  ${Object.keys(sc.unfMockData[0]).map(k => `<th>${k}</th>`).join('')}
                </tr>
              </thead>
              <tbody>
                ${sc.unfMockData.map(row => `
                  <tr>
                    ${Object.values(row).map(v => `<td style="color: #BE123C; font-weight: 600;">${v}</td>`).join('')}
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>

        <!-- 3NF Side -->
        <div class="side-by-side-card">
          <div class="side-by-side-header pass">
            <span>🟢 Normalized 3NF Architecture</span>
            <span class="academic-tag" style="border-color: #BBF7D0; color: #15803D; background: #F0FDF4;">ACID Certified</span>
          </div>

          <div class="status-alert-box success">
            <div>
              <strong>${sc.threeNfStatusText}</strong>
              <p style="margin-top: 4px;">${sc.threeNfExplanation}</p>
            </div>
          </div>

          <!-- Transaction Terminal Logs -->
          <div style="padding: 0 1.25rem 0.75rem;">
            <div style="font-size: 0.74rem; font-weight: 800; color: #15803D; margin-bottom: 0.35rem; text-transform: uppercase;">
              🖥️ Simulated Transaction Log:
            </div>
            <div style="background: rgba(15, 23, 42, 0.95); border: 1px solid rgba(16, 185, 129, 0.3); border-radius: 8px; padding: 0.75rem 1rem; font-family: 'JetBrains Mono', monospace; font-size: 0.75rem; color: #6EE7B7; line-height: 1.6; max-height: 120px; overflow-y: auto;">
              ${sc.threeNfLogs.map(l => `<div>${l}</div>`).join('')}
            </div>
          </div>

          <div style="padding: 0 1.25rem 1.25rem;">
            <div style="font-size: 0.74rem; font-weight: 800; color: #15803D; margin-bottom: 0.4rem; text-transform: uppercase;">
              Executed Atomic DML:
            </div>
            <div style="background: var(--bg-card-inner); padding: 0.6rem 0.85rem; border-radius: 8px; font-family: 'JetBrains Mono', monospace; font-size: 0.8rem; color: #15803D; font-weight: 700; margin-bottom: 0.85rem; border: 1px solid rgba(5, 150, 105, 0.25);">
              ${sc.threeNfSql}
            </div>

            <div style="font-size: 0.74rem; font-weight: 800; color: #15803D; margin-bottom: 0.4rem; text-transform: uppercase;">
              Normalized Database Integrity:
            </div>
            <table class="schema-data-table">
              <thead>
                <tr>
                  ${Object.keys(sc.threeNfMockData[0]).map(k => `<th>${k}</th>`).join('')}
                </tr>
              </thead>
              <tbody>
                ${sc.threeNfMockData.map(row => `
                  <tr>
                    ${Object.values(row).map(v => `<td style="color: #15803D; font-weight: 700;">${v}</td>`).join('')}
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  }
}

window.anomalySim = new AnomalySimulator();
