/* ==========================================================================
   SchemaMorph 3NF - Main Application Controller & Orchestration
   ========================================================================== */

class AppController {
  constructor() {
    this.currentStageIndex = 0;
    this.currentTab = "storyboard";
    this.isPlaying = false;
    this.playInterval = null;
    this.theme = "light";
  }

  init() {
    this.setupEventListeners();
    this.setupKeyboardShortcuts();
    this.initTheme();
    this.renderStage();
    this.renderSqlStudio();
    this.updateTelemetryHUD(0);

    if (window.anomalySim) window.anomalySim.init();
    if (window.depGraph) window.depGraph.init();
    if (window.sandboxLab) window.sandboxLab.init();
    if (window.presenterEngine) window.presenterEngine.init();
  }

  setupEventListeners() {
    // Navigation tabs
    document.querySelectorAll(".nav-tab-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const tab = btn.dataset.tab;
        this.switchTab(tab);
      });
    });

    // Sound toggle
    const soundBtn = document.getElementById("soundToggleBtn");
    if (soundBtn) {
      soundBtn.addEventListener("click", () => {
        const enabled = window.soundEngine.toggleSound();
        soundBtn.innerHTML = enabled ? "🔊" : "🔇";
        soundBtn.title = enabled ? "Sound Effects Enabled" : "Sound Effects Muted";
        this.showToast(enabled ? "🔊 Sound Effects Enabled" : "🔇 Sound Effects Muted");
      });
    }

    // Theme toggle
    const themeBtn = document.getElementById("themeToggleBtn");
    if (themeBtn) {
      themeBtn.addEventListener("click", () => {
        this.toggleTheme();
      });
    }

    // Shortcuts modal button
    const shortcutsBtn = document.getElementById("shortcutsBtn");
    if (shortcutsBtn) {
      shortcutsBtn.addEventListener("click", () => {
        const modal = document.getElementById("shortcutsModal");
        if (modal) modal.style.display = "flex";
      });
    }

    // Close modals on overlay click
    document.querySelectorAll(".modal-overlay").forEach(overlay => {
      overlay.addEventListener("click", (e) => {
        if (e.target === overlay) {
          overlay.style.display = "none";
        }
      });
    });
  }

  setupKeyboardShortcuts() {
    window.addEventListener("keydown", (e) => {
      // Avoid triggering when focused on input/textarea if any
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;

      if (e.code === "Space" || e.code === "ArrowRight") {
        if (this.currentTab === "storyboard") {
          e.preventDefault();
          this.nextStage();
        }
      } else if (e.code === "ArrowLeft") {
        if (this.currentTab === "storyboard") {
          e.preventDefault();
          this.prevStage();
        }
      } else if (e.key === "p" || e.key === "P") {
        if (window.presenterEngine) window.presenterEngine.toggleTeleprompter();
      } else if (e.key === "v" || e.key === "V") {
        if (window.presenterEngine) window.presenterEngine.openVivaModal();
      } else if (e.key === "t" || e.key === "T") {
        this.toggleTheme();
      } else if (e.key === "m" || e.key === "M") {
        const soundBtn = document.getElementById("soundToggleBtn");
        if (soundBtn) soundBtn.click();
      } else if (e.key === "?" || e.key === "/") {
        const modal = document.getElementById("shortcutsModal");
        if (modal) modal.style.display = modal.style.display === "flex" ? "none" : "flex";
      } else if (e.code === "Escape") {
        document.querySelectorAll(".modal-overlay").forEach(m => m.style.display = "none");
        if (window.presenterEngine && window.presenterEngine.isTeleprompterExpanded) {
          window.presenterEngine.toggleTeleprompter();
        }
      } else if (["1", "2", "3", "4", "5"].includes(e.key)) {
        const tabs = ["storyboard", "anomaly", "graph", "sandbox", "sql"];
        const idx = parseInt(e.key) - 1;
        if (tabs[idx]) this.switchTab(tabs[idx]);
      }
    });
  }

  initTheme() {
    const savedTheme = localStorage.getItem("schemamorph_theme") || "light";
    if (savedTheme === "dark") {
      document.body.classList.add("dark-theme");
      this.theme = "dark";
    }
  }

  toggleTheme() {
    if (window.soundEngine) window.soundEngine.playClick();
    document.body.classList.toggle("dark-theme");
    this.theme = document.body.classList.contains("dark-theme") ? "dark" : "light";
    localStorage.setItem("schemamorph_theme", this.theme);
    if (window.particleMatrix) window.particleMatrix.setTheme(this.theme);
    this.showToast(this.theme === "dark" ? "🌌 Cyberpunk Dark Mode" : "💎 Frost Glass Light Mode");
  }

  switchTab(tabName) {
    if (window.soundEngine) window.soundEngine.playClick();
    this.currentTab = tabName;

    // Update active tab buttons
    document.querySelectorAll(".nav-tab-btn").forEach(btn => {
      btn.classList.toggle("active", btn.dataset.tab === tabName);
    });

    // Update view sections
    document.querySelectorAll(".view-section").forEach(sec => {
      sec.classList.remove("active");
    });
    const targetSection = document.getElementById(`view_${tabName}`);
    if (targetSection) targetSection.classList.add("active");

    // Initialize/Refresh views if needed
    if (tabName === "graph" && window.depGraph) {
      setTimeout(() => window.depGraph.renderGraph(), 60);
    } else if (tabName === "anomaly" && window.anomalySim) {
      window.anomalySim.init();
    } else if (tabName === "sandbox" && window.sandboxLab) {
      window.sandboxLab.init();
    }
  }

  // Storyboard Step Controls
  goToStage(stageIdx) {
    if (stageIdx < 0 || stageIdx >= window.NORMALIZATION_STAGES.length) return;
    this.currentStageIndex = stageIdx;
    
    if (window.soundEngine) {
      if (stageIdx === 3) {
        window.soundEngine.playSuccess();
        if (window.confettiCannon) {
          window.confettiCannon.fire(window.innerWidth / 2, window.innerHeight * 0.4, 110);
        }
      } else {
        window.soundEngine.playMorph();
      }
    }
    
    this.renderStage();
    this.updateTelemetryHUD(stageIdx);
  }

  nextStage() {
    if (this.currentStageIndex < window.NORMALIZATION_STAGES.length - 1) {
      this.goToStage(this.currentStageIndex + 1);
    }
  }

  prevStage() {
    if (this.currentStageIndex > 0) {
      this.goToStage(this.currentStageIndex - 1);
    }
  }

  toggleAutoPlay() {
    const playBtn = document.getElementById("autoPlayBtn");
    if (this.isPlaying) {
      clearInterval(this.playInterval);
      this.isPlaying = false;
      if (playBtn) playBtn.innerHTML = "▶️ Auto Morph";
    } else {
      this.isPlaying = true;
      if (playBtn) playBtn.innerHTML = "⏸️ Pause";
      if (this.currentStageIndex === window.NORMALIZATION_STAGES.length - 1) {
        this.goToStage(0);
      }
      this.playInterval = setInterval(() => {
        if (this.currentStageIndex < window.NORMALIZATION_STAGES.length - 1) {
          this.nextStage();
        } else {
          this.toggleAutoPlay();
        }
      }, 4500);
    }
  }

  updateTelemetryHUD(stageIdx) {
    const redundancyEl = document.getElementById("redundancyScore");
    const redundancyBar = document.getElementById("redundancyBarFill");
    const acidEl = document.getElementById("acidScore");
    const acidBar = document.getElementById("acidBarFill");
    const riskPill = document.getElementById("anomalyRiskPill");
    const relationsCountEl = document.getElementById("relationsCount");
    const stageBadge = document.getElementById("telemetryStageBadge");

    const telemetryData = [
      {
        redundancy: 98,
        redundancyColor: "#E11D48",
        acid: 15,
        acidColor: "#E11D48",
        riskHtml: "🚨 Critical Risk",
        riskClass: "risk-critical",
        relations: "1 Monolith Table",
        stageName: "UNF",
        badgeClass: "badge-partial"
      },
      {
        redundancy: 74,
        redundancyColor: "#D97706",
        acid: 40,
        acidColor: "#D97706",
        riskHtml: "⚠️ High Risk (Partial FDs)",
        riskClass: "risk-high",
        relations: "1 Table (Expanded)",
        stageName: "1NF",
        badgeClass: "badge-atomic"
      },
      {
        redundancy: 28,
        redundancyColor: "#7C3AED",
        acid: 75,
        acidColor: "#7C3AED",
        riskHtml: "🟡 Moderate (Transitive FDs)",
        riskClass: "risk-moderate",
        relations: "4 Decomposed Tables",
        stageName: "2NF",
        badgeClass: "badge-pk"
      },
      {
        redundancy: 0,
        redundancyColor: "#059669",
        acid: 100,
        acidColor: "#059669",
        riskHtml: "🟢 Pure 3NF (Zero Anomalies)",
        riskClass: "risk-zero",
        relations: "6 Modular Relations",
        stageName: "3NF",
        badgeClass: "badge-atomic"
      }
    ];

    const d = telemetryData[stageIdx];
    if (!d) return;

    if (redundancyEl) {
      redundancyEl.innerText = `${d.redundancy}%`;
      redundancyEl.style.color = d.redundancyColor;
    }
    if (redundancyBar) {
      redundancyBar.style.width = `${d.redundancy}%`;
      redundancyBar.style.backgroundColor = d.redundancyColor;
    }
    if (acidEl) {
      acidEl.innerText = `${d.acid}%`;
      acidEl.style.color = d.acidColor;
    }
    if (acidBar) {
      acidBar.style.width = `${d.acid}%`;
      acidBar.style.backgroundColor = d.acidColor;
    }
    if (riskPill) {
      riskPill.className = `telemetry-pill-badge ${d.riskClass}`;
      riskPill.innerHTML = d.riskHtml;
    }
    if (relationsCountEl) {
      relationsCountEl.innerText = d.relations;
    }
    if (stageBadge) {
      stageBadge.className = `stage-pill ${d.badgeClass}`;
      stageBadge.innerText = d.stageName;
    }
  }

  renderStage() {
    const stage = window.NORMALIZATION_STAGES[this.currentStageIndex];
    if (!stage) return;

    // Update Stage Stepper Nodes
    const stepperContainer = document.getElementById("stageStepper");
    if (stepperContainer) {
      stepperContainer.innerHTML = window.NORMALIZATION_STAGES.map((s, idx) => `
        <div class="step-node ${idx === this.currentStageIndex ? 'active' : ''} ${idx < this.currentStageIndex ? 'completed' : ''}"
             onclick="window.app.goToStage(${idx})">
          <div class="step-number">${idx < this.currentStageIndex ? '✓' : idx}</div>
          <div class="step-label">${s.shortName}</div>
        </div>
        ${idx < window.NORMALIZATION_STAGES.length - 1 ? `<div class="step-divider ${idx < this.currentStageIndex ? 'filled' : ''}"></div>` : ''}
      `).join('');
    }

    // Update Step Controls Disabled State
    const prevBtn = document.getElementById("prevStageBtn");
    const nextBtn = document.getElementById("nextStageBtn");
    if (prevBtn) prevBtn.disabled = this.currentStageIndex === 0;
    if (nextBtn) nextBtn.disabled = this.currentStageIndex === window.NORMALIZATION_STAGES.length - 1;

    // Update Stage Info Card
    const titleEl = document.getElementById("stageTitle");
    const descEl = document.getElementById("stageDesc");
    const pillEl = document.getElementById("stagePill");
    const justificationEl = document.getElementById("stageJustification");
    const mathFormulaEl = document.getElementById("stageMathFormula");
    const rulesListEl = document.getElementById("stageRulesList");

    if (titleEl) titleEl.innerText = stage.title;
    if (descEl) descEl.innerText = stage.description;
    if (pillEl) {
      pillEl.className = `stage-pill ${stage.badgeClass}`;
      pillEl.innerText = stage.badge;
    }
    if (justificationEl) {
      justificationEl.innerHTML = `<strong>Justification:</strong> ${stage.justification}`;
    }
    if (mathFormulaEl) {
      mathFormulaEl.innerText = stage.mathFormula;
    }
    if (rulesListEl) {
      rulesListEl.innerHTML = stage.rules.map(r => `<li>${r}</li>`).join('');
    }

    // Render Tables
    const tablesContainer = document.getElementById("tablesDisplayGrid");
    if (tablesContainer) {
      tablesContainer.className = `tables-grid ${stage.gridClass}`;
      tablesContainer.innerHTML = stage.tables.map(tbl => this.generateTableHtml(tbl, stage)).join('');
    }
  }

  generateTableHtml(table, stage) {
    return `
      <div class="schema-table-card">
        <div class="table-card-header">
          <div class="table-name-group">
            <span class="table-icon">${table.icon}</span>
            <span class="table-title">${table.title}</span>
            <span class="table-row-count">${table.rowCount} tuples</span>
          </div>
          <div class="table-tags">
            ${table.columns.some(c => c.isPk) ? `<span class="key-badge pk">PK Defined</span>` : ''}
            ${table.columns.some(c => c.isFk) ? `<span class="key-badge fk">FK Linked</span>` : ''}
          </div>
        </div>

        <div class="data-table-wrapper">
          <table class="schema-data-table">
            <thead>
              <tr>
                ${table.columns.map(col => `
                  <th class="${col.isPk ? 'highlight-pk' : ''} ${col.isFk ? 'highlight-fk' : ''}">
                    <div class="col-th-inner">
                      ${col.isPk ? '<span class="key-badge pk">PK</span>' : ''}
                      ${col.isFk ? '<span class="key-badge fk">FK</span>' : ''}
                      <span>${col.label}</span>
                    </div>
                  </th>
                `).join('')}
              </tr>
            </thead>
            <tbody>
              ${table.rows.map(row => `
                <tr>
                  ${table.columns.map(col => {
                    const val = row[col.key] !== undefined ? row[col.key] : "-";
                    let cellClass = "";
                    if (col.isMultiValue) cellClass = "multi-value-cell";
                    if (col.isAtomic) cellClass = "atomic-split-pill";
                    return `<td class="${cellClass}">${val}</td>`;
                  }).join('')}
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  runSampleQuery(queryType) {
    if (window.soundEngine) window.soundEngine.playLaser();
    const resultArea = document.getElementById("sqlQueryResultArea");
    const metaEl = document.getElementById("sqlResultMeta");
    const tableContainer = document.getElementById("sqlResultTableContainer");

    if (!resultArea || !metaEl || !tableContainer) return;
    resultArea.style.display = "block";

    let metaText = "";
    let headers = [];
    let rows = [];

    if (queryType === "join") {
      metaText = "⚡ EXPLAIN ANALYZE: SELECT * FROM Students NATURAL JOIN Enrollments WHERE Grade = 'A+' | Time: 0.28ms | Index: PK_Students_StudentID";
      headers = ["StudentID", "StudentName", "DepartmentID", "CourseID", "Grade", "Semester"];
      rows = [
        ["TCET-2026-01", "Aarav Mehta", "DEPT-CS", "CS301", "A+", "Sem V"],
        ["TCET-2026-04", "Priya Verma", "DEPT-AI", "CS301", "A+", "Sem V"]
      ];
    } else if (queryType === "insert") {
      metaText = "⚡ EXECUTION: INSERT INTO Courses (CourseID, CourseTitle, Credits, InstructorID) VALUES ('CS601', 'Quantum AI', 4, 'INS-101') | 1 Row Inserted • Zero Student Locking";
      headers = ["CourseID", "CourseTitle", "Credits", "InstructorID", "Status"];
      rows = [
        ["CS601", "Quantum AI", "4", "INS-101", "COMMITTED ✅ (ACID Clean)"]
      ];
    } else if (queryType === "update") {
      metaText = "⚡ EXECUTION: UPDATE Instructors SET OfficeRoom = 'Room 777' WHERE InstructorID = 'INS-101' | 1 Row Updated • Global Consistency Guaranteed";
      headers = ["InstructorID", "InstructorName", "OfficeRoom", "DepartmentID", "Consistency"];
      rows = [
        ["INS-101", "Dr. Rajesh Sharma", "Room 777 (Updated)", "DEPT-CS", "100% Synced Across All Enrollments ✅"]
      ];
    } else if (queryType === "instructors") {
      metaText = "⚡ EXPLAIN: SELECT i.InstructorName, d.DepartmentName, d.DeptBuilding FROM Instructors i JOIN Departments d ON i.DepartmentID = d.DepartmentID | Time: 0.31ms";
      headers = ["InstructorName", "DepartmentName", "DeptBuilding"];
      rows = [
        ["Dr. Rajesh Sharma", "Computer Engineering", "TCET Main Block (Floor 4)"],
        ["Dr. Ananya Iyer", "Computer Engineering", "TCET Main Block (Floor 4)"],
        ["Prof. Vikram Patel", "Information Tech", "TCET IT Wing (Floor 2)"]
      ];
    }

    metaEl.innerText = metaText;
    tableContainer.innerHTML = `
      <table class="schema-data-table" style="margin-top: 0.5rem;">
        <thead>
          <tr>${headers.map(h => `<th>${h}</th>`).join('')}</tr>
        </thead>
        <tbody>
          ${rows.map(r => `<tr>${r.map(c => `<td>${c}</td>`).join('')}</tr>`).join('')}
        </tbody>
      </table>
    `;
    this.showToast(`⚡ Query '${queryType}' executed in 0.3ms`);
  }

  renderSqlStudio() {
    const unfSqlEl = document.getElementById("unfSqlCode");
    const threeNfSqlEl = document.getElementById("threeNfSqlCode");

    if (unfSqlEl) {
      unfSqlEl.innerHTML = `
<span class="sql-comment">-- ========================================================</span>
<span class="sql-comment">-- DENORMALIZED MONOLITHIC SCHEMA (UNF / 1NF)</span>
<span class="sql-comment">-- Severe Redundancy, Update & Deletion Anomaly Vulnerabilities</span>
<span class="sql-comment">-- ========================================================</span>

<span class="sql-keyword">CREATE TABLE</span> <span class="sql-table">University_Enrollment_Monolith</span> (
    StudentID <span class="sql-type">VARCHAR(15)</span>,
    StudentName <span class="sql-type">VARCHAR(50)</span>,
    PhoneNumbers <span class="sql-type">VARCHAR(100)</span>, <span class="sql-comment">-- Violates Atomicity (1NF)</span>
    DepartmentID <span class="sql-type">VARCHAR(10)</span>,
    DepartmentName <span class="sql-type">VARCHAR(50)</span>, <span class="sql-comment">-- Transitive via Dept_ID</span>
    DeptBuilding <span class="sql-type">VARCHAR(50)</span>,
    CourseID <span class="sql-type">VARCHAR(10)</span>,
    CourseName <span class="sql-type">VARCHAR(50)</span>, <span class="sql-comment">-- Partial on {StudentID, CourseID}</span>
    Credits <span class="sql-type">INT</span>,
    InstructorID <span class="sql-type">VARCHAR(10)</span>,
    InstructorName <span class="sql-type">VARCHAR(50)</span>, <span class="sql-comment">-- Transitive via Instructor_ID</span>
    InstructorOffice <span class="sql-type">VARCHAR(30)</span>,
    Semester <span class="sql-type">VARCHAR(10)</span>,
    Grade <span class="sql-type">VARCHAR(2)</span>,
    <span class="sql-keyword">PRIMARY KEY</span> (StudentID, CourseID)
);
      `;
    }

    if (threeNfSqlEl) {
      threeNfSqlEl.innerHTML = `
<span class="sql-comment">-- ========================================================</span>
<span class="sql-comment">-- NORMALIZED 3NF RELATIONAL SCHEMA (TCET SPEC)</span>
<span class="sql-comment">-- Lossless Join Decomposition & ACID Safe</span>
<span class="sql-comment">-- ========================================================</span>

<span class="sql-keyword">CREATE TABLE</span> <span class="sql-table">Departments</span> (
    DepartmentID <span class="sql-type">VARCHAR(10)</span> <span class="sql-keyword">PRIMARY KEY</span>,
    DepartmentName <span class="sql-type">VARCHAR(50)</span> <span class="sql-keyword">NOT NULL</span>,
    DeptBuilding <span class="sql-type">VARCHAR(50)</span>
);

<span class="sql-keyword">CREATE TABLE</span> <span class="sql-table">Students</span> (
    StudentID <span class="sql-type">VARCHAR(15)</span> <span class="sql-keyword">PRIMARY KEY</span>,
    StudentName <span class="sql-type">VARCHAR(50)</span> <span class="sql-keyword">NOT NULL</span>,
    DepartmentID <span class="sql-type">VARCHAR(10)</span>,
    <span class="sql-keyword">FOREIGN KEY</span> (DepartmentID) <span class="sql-keyword">REFERENCES</span> <span class="sql-table">Departments</span>(DepartmentID)
);

<span class="sql-keyword">CREATE TABLE</span> <span class="sql-table">Student_Contacts</span> (
    StudentID <span class="sql-type">VARCHAR(15)</span>,
    PhoneNumber <span class="sql-type">VARCHAR(15)</span>,
    <span class="sql-keyword">PRIMARY KEY</span> (StudentID, PhoneNumber),
    <span class="sql-keyword">FOREIGN KEY</span> (StudentID) <span class="sql-keyword">REFERENCES</span> <span class="sql-table">Students</span>(StudentID) <span class="sql-keyword">ON DELETE CASCADE</span>
);

<span class="sql-keyword">CREATE TABLE</span> <span class="sql-table">Instructors</span> (
    InstructorID <span class="sql-type">VARCHAR(10)</span> <span class="sql-keyword">PRIMARY KEY</span>,
    InstructorName <span class="sql-type">VARCHAR(50)</span> <span class="sql-keyword">NOT NULL</span>,
    InstructorOffice <span class="sql-type">VARCHAR(30)</span>,
    DepartmentID <span class="sql-type">VARCHAR(10)</span>,
    <span class="sql-keyword">FOREIGN KEY</span> (DepartmentID) <span class="sql-keyword">REFERENCES</span> <span class="sql-table">Departments</span>(DepartmentID)
);

<span class="sql-keyword">CREATE TABLE</span> <span class="sql-table">Courses</span> (
    CourseID <span class="sql-type">VARCHAR(10)</span> <span class="sql-keyword">PRIMARY KEY</span>,
    CourseTitle <span class="sql-type">VARCHAR(50)</span> <span class="sql-keyword">NOT NULL</span>,
    Credits <span class="sql-type">INT</span> <span class="sql-keyword">CHECK</span> (Credits &gt; 0),
    InstructorID <span class="sql-type">VARCHAR(10)</span>,
    <span class="sql-keyword">FOREIGN KEY</span> (InstructorID) <span class="sql-keyword">REFERENCES</span> <span class="sql-table">Instructors</span>(InstructorID)
);

<span class="sql-keyword">CREATE TABLE</span> <span class="sql-table">Enrollments</span> (
    StudentID <span class="sql-type">VARCHAR(15)</span>,
    CourseID <span class="sql-type">VARCHAR(10)</span>,
    Semester <span class="sql-type">VARCHAR(10)</span>,
    Grade <span class="sql-type">VARCHAR(2)</span>,
    <span class="sql-keyword">PRIMARY KEY</span> (StudentID, CourseID),
    <span class="sql-keyword">FOREIGN KEY</span> (StudentID) <span class="sql-keyword">REFERENCES</span> <span class="sql-table">Students</span>(StudentID),
    <span class="sql-keyword">FOREIGN KEY</span> (CourseID) <span class="sql-keyword">REFERENCES</span> <span class="sql-table">Courses</span>(CourseID)
);
      `;
    }
  }

  copyCode(codeElementId) {
    const el = document.getElementById(codeElementId);
    if (!el) return;
    const text = el.innerText;
    navigator.clipboard.writeText(text).then(() => {
      if (window.soundEngine) window.soundEngine.playClick();
      this.showToast("📋 SQL Schema copied to clipboard!");
    });
  }

  showToast(msg) {
    const container = document.getElementById("toastContainer");
    if (!container) return;

    const toast = document.createElement("div");
    toast.className = "toast glass-panel";
    toast.innerHTML = `<span>✨</span> ${msg}`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transform = "translateY(15px)";
      toast.style.transition = "all 0.3s ease";
      setTimeout(() => toast.remove(), 300);
    }, 2800);
  }
}

window.app = new AppController();
document.addEventListener("DOMContentLoaded", () => {
  window.app.init();
});
