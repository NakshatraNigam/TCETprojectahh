/* ==========================================================================
   SchemaMorph 3NF - Interactive SVG Functional Dependency Graph Engine (Laser Edition)
   ========================================================================== */

const FD_NODES = [
  // Primary Keys / Composite Determinants
  { id: "StudentID", label: "Student_ID", x: 70, y: 110, type: "pk", category: "student" },
  { id: "CourseID", label: "Course_ID", x: 70, y: 310, type: "pk", category: "course" },
  
  // Student Attributes (Partial on {StudentID, CourseID})
  { id: "StudentName", label: "Student_Name", x: 290, y: 60, type: "attr", category: "student" },
  { id: "DepartmentID", label: "Dept_ID", x: 290, y: 150, type: "bridge", category: "dept" },
  
  // Department Details (Transitive from Dept_ID)
  { id: "DeptName", label: "Dept_Name", x: 530, y: 110, type: "transitive", category: "dept" },
  { id: "DeptBuilding", label: "Dept_Building", x: 530, y: 180, type: "transitive", category: "dept" },

  // Course Attributes (Partial on {StudentID, CourseID})
  { id: "CourseName", label: "Course_Title", x: 290, y: 250, type: "attr", category: "course" },
  { id: "Credits", label: "Credits", x: 290, y: 320, type: "attr", category: "course" },
  { id: "InstructorID", label: "Instructor_ID", x: 290, y: 400, type: "bridge", category: "instructor" },

  // Instructor Details (Transitive from Instructor_ID)
  { id: "InstructorName", label: "Instructor_Name", x: 530, y: 360, type: "transitive", category: "instructor" },
  { id: "InstructorOffice", label: "Office_Room", x: 530, y: 430, type: "transitive", category: "instructor" },

  // Full Composite Dependencies
  { id: "Grade", label: "Grade", x: 290, y: 480, type: "full", category: "enrollment" },
  { id: "Semester", label: "Semester", x: 530, y: 480, type: "full", category: "enrollment" }
];

const FD_EDGES = [
  // Partial Dependencies from StudentID
  { source: "StudentID", target: "StudentName", type: "partial", label: "Partial FD (2NF Violation)", rule: "Student_Name is determined solely by Student_ID (proper subset of candidate key {StudentID, CourseID})." },
  { source: "StudentID", target: "DepartmentID", type: "partial", label: "Partial FD (2NF Violation)", rule: "Dept_ID depends only on Student_ID, independent of Course_ID." },

  // Transitive Dependencies from Dept_ID
  { source: "DepartmentID", target: "DeptName", type: "transitive", label: "Transitive FD (3NF Violation)", rule: "Dept_Name is determined by Dept_ID (Non-key → Non-key transitive link)." },
  { source: "DepartmentID", target: "DeptBuilding", type: "transitive", label: "Transitive FD (3NF Violation)", rule: "Dept_Building is determined by Dept_ID (Non-key → Non-key transitive link)." },

  // Partial Dependencies from CourseID
  { source: "CourseID", target: "CourseName", type: "partial", label: "Partial FD (2NF Violation)", rule: "Course_Title depends only on Course_ID, ignoring Student_ID." },
  { source: "CourseID", target: "Credits", type: "partial", label: "Partial FD (2NF Violation)", rule: "Credits depends solely on Course_ID." },
  { source: "CourseID", target: "InstructorID", type: "partial", label: "Partial FD (2NF Violation)", rule: "Instructor_ID is assigned per Course_ID." },

  // Transitive Dependencies from InstructorID
  { source: "InstructorID", target: "InstructorName", type: "transitive", label: "Transitive FD (3NF Violation)", rule: "Instructor_Name is determined by Instructor_ID (Non-prime transitive link)." },
  { source: "InstructorID", target: "InstructorOffice", type: "transitive", label: "Transitive FD (3NF Violation)", rule: "Instructor_Office is determined by Instructor_ID (Non-prime transitive link)." },

  // Full Functional Dependencies from {StudentID, CourseID}
  { source: "StudentID", target: "Grade", type: "full", label: "Full Dependency (Composite PK)", rule: "Grade requires BOTH Student_ID AND Course_ID." },
  { source: "CourseID", target: "Grade", type: "full", label: "Full Dependency (Composite PK)", rule: "Grade requires BOTH Student_ID AND Course_ID." },
  { source: "StudentID", target: "Semester", type: "full", label: "Full Dependency (Composite PK)", rule: "Semester requires both Student_ID and Course_ID." }
];

class DependencyGraphViewer {
  constructor() {
    this.currentFilter = "all";
    this.selectedEdge = null;
    this.selectedNode = null;
  }

  init() {
    this.renderGraph();
  }

  setFilter(filterType) {
    if (window.soundEngine) window.soundEngine.playLaser();
    this.currentFilter = filterType;
    
    // Update chip active states
    document.querySelectorAll(".graph-filter-chip").forEach(chip => {
      chip.classList.toggle("active", chip.dataset.filter === filterType);
    });

    this.renderGraph();
  }

  selectNode(nodeId) {
    if (window.soundEngine) window.soundEngine.playLaser();
    this.selectedNode = FD_NODES.find(n => n.id === nodeId);
    this.selectedEdge = null;
    this.updateSidebarInfo();
    this.renderGraph();
  }

  selectEdge(idx) {
    if (window.soundEngine) window.soundEngine.playLaser();
    this.selectedEdge = FD_EDGES[idx];
    this.selectedNode = null;
    this.updateSidebarInfo();
    this.renderGraph();
  }

  updateSidebarInfo() {
    const titleEl = document.getElementById("graphDetailTitle");
    const descEl = document.getElementById("graphDetailDesc");
    const formulaEl = document.getElementById("graphDetailFormula");

    if (!titleEl || !descEl || !formulaEl) return;

    if (this.selectedEdge) {
      titleEl.innerHTML = `Functional Dependency: <span style="color:var(--accent-primary);">${this.selectedEdge.source} → ${this.selectedEdge.target}</span>`;
      formulaEl.innerHTML = `${this.selectedEdge.source} &xrarr; ${this.selectedEdge.target} [${this.selectedEdge.type.toUpperCase()}]`;
      descEl.innerHTML = `<strong>${this.selectedEdge.label}</strong>: ${this.selectedEdge.rule}`;
    } else if (this.selectedNode) {
      titleEl.innerHTML = `Attribute Node: <span style="color:var(--accent-primary);">${this.selectedNode.label}</span>`;
      formulaEl.innerHTML = `Domain Type: ${this.selectedNode.type.toUpperCase()} | Entity: ${this.selectedNode.category.toUpperCase()}`;
      descEl.innerHTML = `Attribute <code>${this.selectedNode.id}</code> participates in normalization decomposition for the University relational schema.`;
    }
  }

  renderGraph() {
    const svg = document.getElementById("dependencySvgCanvas");
    if (!svg) return;

    const filteredEdges = FD_EDGES.filter(e => {
      if (this.currentFilter === "all") return true;
      return e.type === this.currentFilter;
    });

    const isDark = document.body.classList.contains("dark-theme");

    // Generate Arrowhead Defs & Laser Filters
    let html = `
      <defs>
        <marker id="arrow-partial" viewBox="0 0 10 10" refX="19" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="#E11D48" />
        </marker>
        <marker id="arrow-transitive" viewBox="0 0 10 10" refX="19" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="#7C3AED" />
        </marker>
        <marker id="arrow-full" viewBox="0 0 10 10" refX="19" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="#059669" />
        </marker>
        <filter id="laserGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
        <filter id="nodeShadow" x="-10%" y="-10%" width="130%" height="130%">
          <feDropShadow dx="2" dy="4" stdDeviation="4" flood-color="rgba(0,0,0,0.18)" />
        </filter>
      </defs>
    `;

    // Draw Edges (Bezier curves with animated photons)
    filteredEdges.forEach((edge, idx) => {
      const srcNode = FD_NODES.find(n => n.id === edge.source);
      const tgtNode = FD_NODES.find(n => n.id === edge.target);
      if (!srcNode || !tgtNode) return;

      const pathId = `fd_path_${idx}`;
      const dx = (tgtNode.x - srcNode.x) / 2;
      const pathD = `M ${srcNode.x + 130} ${srcNode.y + 17} C ${srcNode.x + 130 + dx} ${srcNode.y + 17}, ${tgtNode.x - dx} ${tgtNode.y + 17}, ${tgtNode.x} ${tgtNode.y + 17}`;
      const isSelected = this.selectedEdge === edge;

      let photonColor = "#E11D48";
      if (edge.type === "transitive") photonColor = "#7C3AED";
      if (edge.type === "full") photonColor = "#059669";

      html += `
        <g style="cursor: pointer;" onclick="window.depGraph.selectEdge(${FD_EDGES.indexOf(edge)})">
          <path id="${pathId}" d="${pathD}" class="fd-edge ${edge.type}" marker-end="url(#arrow-${edge.type})" 
                style="${isSelected ? 'stroke-width: 4.5px; filter: drop-shadow(0 0 8px ' + photonColor + ');' : ''}" />
          <!-- Animated Photon Laser Pulse -->
          <circle r="${isSelected ? 5 : 3.5}" fill="${photonColor}" filter="url(#laserGlow)">
            <animateMotion dur="${2.2 + (idx % 3) * 0.4}s" repeatCount="indefinite">
              <mpath href="#${pathId}" />
            </animateMotion>
          </circle>
        </g>
      `;
    });

    // Draw Nodes
    FD_NODES.forEach(node => {
      let strokeColor = isDark ? "rgba(255,255,255,0.15)" : "#CBD5E1";
      let fillColor = isDark ? "#1E293B" : "#FFFFFF";
      let textColor = isDark ? "#F8FAFC" : "#0F172A";

      if (node.type === "pk") {
        strokeColor = "#FCD34D";
        fillColor = isDark ? "rgba(217, 119, 6, 0.25)" : "#FFFBEB";
      } else if (node.type === "transitive") {
        strokeColor = "#DDD6FE";
        fillColor = isDark ? "rgba(124, 58, 237, 0.25)" : "#F5F3FF";
      } else if (node.type === "bridge") {
        strokeColor = "#BAE6FD";
        fillColor = isDark ? "rgba(2, 132, 199, 0.25)" : "#F0F9FF";
      }

      const isSelected = this.selectedNode === node;
      if (isSelected) {
        strokeColor = "#3B82F6";
        fillColor = isDark ? "rgba(59, 130, 246, 0.35)" : "#EFF6FF";
      }

      html += `
        <g class="fd-node" transform="translate(${node.x}, ${node.y})" onclick="window.depGraph.selectNode('${node.id}')" filter="url(#nodeShadow)">
          <rect width="130" height="34" rx="8" ry="8" fill="${fillColor}" stroke="${strokeColor}" stroke-width="${isSelected ? 2.5 : 1.5}" />
          <text x="12" y="21" fill="${textColor}" font-family="'JetBrains Mono', monospace" font-size="11" font-weight="700">${node.label}</text>
          ${node.type === 'pk' ? '<circle cx="116" cy="17" r="4.5" fill="#D97706" />' : ''}
          ${isSelected ? '<circle cx="116" cy="17" r="8" fill="none" stroke="#3B82F6" stroke-width="1.5" opacity="0.7"><animate attributeName="r" values="6;12;6" dur="1.5s" repeatCount="indefinite"/></circle>' : ''}
        </g>
      `;
    });

    svg.innerHTML = html;
  }
}

window.depGraph = new DependencyGraphViewer();
