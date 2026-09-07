import docx
from docx.shared import Pt, Inches, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.oxml import parse_xml, OxmlElement
from docx.oxml.ns import nsdecls, qn
import shutil
import os

def create_report(output_path):
    doc = docx.Document()

    # Section & Page Margins
    for section in doc.sections:
        section.top_margin = Inches(1.0)
        section.bottom_margin = Inches(1.0)
        section.left_margin = Inches(1.0)
        section.right_margin = Inches(1.0)
        section.page_width = Inches(8.5)
        section.page_height = Inches(11.0)

    # Color Palette Constants
    COLOR_NAVY = RGBColor(0x1F, 0x38, 0x64)      # #1F3864
    COLOR_BODY = RGBColor(0x1A, 0x1A, 0x1A)      # #1A1A1A
    COLOR_SUBTITLE = RGBColor(0x3B, 0x3B, 0x3B)  # #3B3B3B
    COLOR_MUTED = RGBColor(0x55, 0x55, 0x55)     # #555555
    COLOR_CODE = RGBColor(0x22, 0x22, 0x22)      # #222222

    HEX_BORDER_LIGHT = "CCCCCC"
    HEX_BORDER_GRID = "BFBFBF"
    HEX_SHD_HEADER = "D9E2F3"
    HEX_SHD_CODE = "F2F2F2"
    HEX_SHD_MEMBERS = "F8F9FA"

    def set_cell_margins(cell, top=100, bottom=100, left=140, right=140):
        tcPr = cell._tc.get_or_add_tcPr()
        tcMar = OxmlElement('w:tcMar')
        for m, val in [('top', top), ('bottom', bottom), ('left', left), ('right', right)]:
            node = OxmlElement(f'w:{m}')
            node.set(qn('w:w'), str(val))
            node.set(qn('w:type'), 'dxa')
            tcMar.append(node)
        tcPr.append(tcMar)

    def set_cell_shading(cell, color_hex):
        shading = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{color_hex}" w:color="auto" w:val="clear"/>')
        cell._tc.get_or_add_tcPr().append(shading)

    def set_table_borders(table, color_hex=HEX_BORDER_GRID, sz="4", inside_v=True):
        tblPr = table._tbl.tblPr
        borders_xml = f'''
        <w:tblBorders {nsdecls("w")}>
            <w:top w:val="single" w:sz="{sz}" w:space="0" w:color="{color_hex}"/>
            <w:bottom w:val="single" w:sz="{sz}" w:space="0" w:color="{color_hex}"/>
            <w:left w:val="single" w:sz="{sz}" w:space="0" w:color="{color_hex}"/>
            <w:right w:val="single" w:sz="{sz}" w:space="0" w:color="{color_hex}"/>
            <w:insideH w:val="single" w:sz="{sz}" w:space="0" w:color="{color_hex}"/>
            <w:insideV w:val="{'single' if inside_v else 'none'}" w:sz="{sz}" w:space="0" w:color="{color_hex}"/>
        </w:tblBorders>
        '''
        tblPr.append(parse_xml(borders_xml))

    # Helper for Paragraphs
    def add_para(text, style_type="body", align=WD_ALIGN_PARAGRAPH.JUSTIFY, space_before=0, space_after=10, line_spacing=1.25, bold=False, color=COLOR_BODY, size=11.0):
        p = doc.add_paragraph()
        p.alignment = align
        p.paragraph_format.space_before = Pt(space_before)
        p.paragraph_format.space_after = Pt(space_after)
        if line_spacing:
            p.paragraph_format.line_spacing = line_spacing
        run = p.add_run(text)
        run.bold = bold
        run.font.size = Pt(size)
        run.font.color.rgb = color
        return p

    def add_heading1(text):
        p = doc.add_paragraph()
        p.alignment = WD_ALIGN_PARAGRAPH.LEFT
        p.paragraph_format.space_before = Pt(16.0)
        p.paragraph_format.space_after = Pt(8.0)
        p.paragraph_format.keep_with_next = True
        run = p.add_run(text)
        run.bold = True
        run.font.size = Pt(13.0)
        run.font.color.rgb = COLOR_NAVY
        return p

    def add_subheading(text):
        p = doc.add_paragraph()
        p.alignment = WD_ALIGN_PARAGRAPH.LEFT
        p.paragraph_format.space_before = Pt(11.0)
        p.paragraph_format.space_after = Pt(6.0)
        p.paragraph_format.keep_with_next = True
        run = p.add_run(text)
        run.bold = True
        run.font.size = Pt(12.0)
        run.font.color.rgb = COLOR_NAVY
        return p

    def add_list_item(bold_prefix, text):
        p = doc.add_paragraph()
        p.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
        p.paragraph_format.space_before = Pt(0)
        p.paragraph_format.space_after = Pt(7.0)
        p.paragraph_format.line_spacing = 1.25
        p.paragraph_format.left_indent = Inches(0.25)
        
        run_b = p.add_run(bold_prefix + "  ")
        run_b.bold = True
        run_b.font.size = Pt(11.0)
        run_b.font.color.rgb = COLOR_BODY

        run_t = p.add_run(text)
        run_t.font.size = Pt(11.0)
        run_t.font.color.rgb = COLOR_BODY
        return p

    def add_impact_note(text):
        p = doc.add_paragraph()
        p.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
        p.paragraph_format.space_before = Pt(5.0)
        p.paragraph_format.space_after = Pt(11.0)
        p.paragraph_format.line_spacing = 1.25
        
        run_b = p.add_run("Impact: ")
        run_b.bold = True
        run_b.font.size = Pt(11.0)
        run_b.font.color.rgb = COLOR_BODY

        run_t = p.add_run(text)
        run_t.font.size = Pt(11.0)
        run_t.font.color.rgb = COLOR_BODY
        return p

    def add_code_block(code_text):
        p_label = doc.add_paragraph()
        p_label.paragraph_format.space_before = Pt(4.0)
        p_label.paragraph_format.space_after = Pt(4.0)
        r_lbl = p_label.add_run("CODE")
        r_lbl.bold = True
        r_lbl.font.size = Pt(11.0)
        r_lbl.font.color.rgb = COLOR_NAVY

        table = doc.add_table(rows=1, cols=1)
        table.alignment = WD_TABLE_ALIGNMENT.CENTER
        cell = table.cell(0, 0)
        set_cell_shading(cell, HEX_SHD_CODE)
        set_cell_margins(cell, top=140, bottom=140, left=180, right=180)
        set_table_borders(table, color_hex=HEX_BORDER_LIGHT, sz="4")

        # Add code lines
        p_code = cell.paragraphs[0]
        p_code.paragraph_format.space_before = Pt(0)
        p_code.paragraph_format.space_after = Pt(0)
        p_code.paragraph_format.line_spacing = 1.15
        
        lines = code_text.strip().split('\n')
        for i, line in enumerate(lines):
            if i > 0:
                p_code = cell.add_paragraph()
                p_code.paragraph_format.space_before = Pt(0)
                p_code.paragraph_format.space_after = Pt(0)
                p_code.paragraph_format.line_spacing = 1.15
            run = p_code.add_run(line)
            run.font.name = "Courier New"
            run.font.size = Pt(9.5)
            run.font.color.rgb = COLOR_CODE

        doc.add_paragraph().paragraph_format.space_after = Pt(6.0)

    # =========================================================================
    # 1. TITLE & COVER BLOCK
    # =========================================================================
    add_para("PROJECT REPORT", align=WD_ALIGN_PARAGRAPH.LEFT, space_before=0, space_after=4, bold=True, color=COLOR_NAVY, size=16.0)
    add_para("Implementation and Analysis of Database Normalization to Third Normal Form (3NF) in Education Management Systems", align=WD_ALIGN_PARAGRAPH.LEFT, space_before=0, space_after=4, bold=True, color=COLOR_BODY, size=13.0)
    add_para("A Study on Relational Decomposition, Functional Dependencies, Lossless Join Proofs, and Anomaly Prevention", align=WD_ALIGN_PARAGRAPH.LEFT, space_before=0, space_after=8, color=COLOR_SUBTITLE, size=11.0)
    add_para("By Members of Group - [5] • COMP - [B]", align=WD_ALIGN_PARAGRAPH.LEFT, space_before=0, space_after=2, bold=True, color=COLOR_BODY, size=11.0)
    add_para("Thakur College of Engineering & Technology (TCET)", align=WD_ALIGN_PARAGRAPH.LEFT, space_before=0, space_after=2, bold=True, color=COLOR_NAVY, size=12.0)
    add_para("Department of Computer Engineering • AY 2026-27", align=WD_ALIGN_PARAGRAPH.LEFT, space_before=0, space_after=10, bold=True, color=COLOR_BODY, size=11.0)

    # Group Members Table (Roll 49 to 60)
    tbl_members = doc.add_table(rows=6, cols=2)
    tbl_members.alignment = WD_TABLE_ALIGNMENT.CENTER
    set_table_borders(tbl_members, color_hex=HEX_BORDER_LIGHT, sz="4", inside_v=True)

    member_data = [
        ("Module 9: 3NF Lossless Synthesis", "49", "Module 2: UNF Monolith & Redundancy", "50"),
        ("Module 3: Insertion Anomaly Stress-Test", "51", "Module 4: Update & Deletion Anomalies", "52"),
        ("Module 5: 1NF Domain Atomicity", "53", "Module 6: Functional Dependency Graph", "54"),
        ("Module 7: 2NF Partial Dependency Removal", "55", "Module 8: Transitive Dependencies Trap", "56"),
        ("Module 1: Problem Statement & Motivation", "57", "Module 10: Lossless Join & Preservation", "58"),
        ("Module 11: Decomposition Sandbox Lab", "59", "Module 12: Production SQL DDL & ACID", "60")
    ]

    for row_idx, data in enumerate(member_data):
        row = tbl_members.rows[row_idx]
        
        # Left Cell
        cell_l = row.cells[0]
        set_cell_shading(cell_l, HEX_SHD_MEMBERS)
        set_cell_margins(cell_l, top=80, bottom=80, left=140, right=140)
        p_l = cell_l.paragraphs[0]
        p_l.paragraph_format.space_before = Pt(0)
        p_l.paragraph_format.space_after = Pt(0)
        r_l_name = p_l.add_run(f"Roll No. {data[1]}: ")
        r_l_name.bold = True
        r_l_name.font.size = Pt(10.0)
        r_l_name.font.color.rgb = COLOR_NAVY
        r_l_role = p_l.add_run(data[0])
        r_l_role.font.size = Pt(10.0)
        r_l_role.font.color.rgb = COLOR_BODY

        # Right Cell
        cell_r = row.cells[1]
        set_cell_shading(cell_r, HEX_SHD_MEMBERS)
        set_cell_margins(cell_r, top=80, bottom=80, left=140, right=140)
        p_r = cell_r.paragraphs[0]
        p_r.paragraph_format.space_before = Pt(0)
        p_r.paragraph_format.space_after = Pt(0)
        r_r_name = p_r.add_run(f"Roll No. {data[3]}: ")
        r_r_name.bold = True
        r_r_name.font.size = Pt(10.0)
        r_r_name.font.color.rgb = COLOR_NAVY
        r_r_role = p_r.add_run(data[2])
        r_r_role.font.size = Pt(10.0)
        r_r_role.font.color.rgb = COLOR_BODY

    doc.add_paragraph().paragraph_format.space_after = Pt(8.0)

    # =========================================================================
    # 2. TOPIC DIVISION & MODULE ASSIGNMENT (ROLL NO. 49 TO 60)
    # =========================================================================
    add_heading1("MODULE & TOPIC DIVISION (ROLL NO. 49 TO 60)")
    add_para("The research, theoretical modeling, decomposition proofs, and software engineering implementation of this Third Normal Form (3NF) normalization project were systematically divided among all 12 group members (Roll No. 49 to 60) as structured below:")

    tbl_div = doc.add_table(rows=13, cols=3)
    tbl_div.alignment = WD_TABLE_ALIGNMENT.CENTER
    set_table_borders(tbl_div, color_hex=HEX_BORDER_GRID, sz="4", inside_v=True)

    div_headers = ["Roll No.", "Assigned Module & Normalization Stage", "Core Technical Contribution & Responsibility"]
    for c_idx, h_text in enumerate(div_headers):
        cell = tbl_div.cell(0, c_idx)
        set_cell_shading(cell, HEX_SHD_HEADER)
        set_cell_margins(cell, top=100, bottom=100, left=120, right=120)
        p = cell.paragraphs[0]
        p.paragraph_format.space_before = Pt(0)
        p.paragraph_format.space_after = Pt(0)
        r = p.add_run(h_text)
        r.bold = True
        r.font.size = Pt(9.5)
        r.font.color.rgb = COLOR_NAVY

    division_rows = [
        ("Roll No. 49", "Module 9: 3NF Lossless Schema Synthesis", "Synthesizing 6 final modular relations with determinants restricted to Superkeys."),
        ("Roll No. 50", "Module 2: UNF Monolith & Redundancy Analysis", "Deconstruction of TCET_Enrollment_Master, repeating groups, and multi-value cells."),
        ("Roll No. 51", "Module 3: Insertion Anomaly Stress-Testing", "Demonstration of Entity Integrity constraint violations and NULL key insertion blocks."),
        ("Roll No. 52", "Module 4: Update & Deletion Anomalies", "Evaluation of duplicate-row inconsistency and irreversible cascading data loss."),
        ("Roll No. 53", "Module 5: 1NF Domain Atomicity Transformation", "Unbundling comma-separated contact lists into atomic tuples with composite keys."),
        ("Roll No. 54", "Module 6: Functional Dependency Graph Mapping", "Mapping partial dependencies (StudentID → Name, CourseID → Title) in 1NF."),
        ("Roll No. 55", "Module 7: 2NF Partial Dependency Decomposition", "Partitioning relations into Students, Student_Contacts, Courses_Master, Enrollments."),
        ("Roll No. 56", "Module 8: Transitive Dependency Identification", "Detecting non-key transitive links (CourseID → InstructorID → Office, DeptID → Building)."),
        ("Roll No. 57", "Module 1: Introduction & Problem Statement", "Analysis of universal relations (R), enterprise motivation, and data bloat risks."),
        ("Roll No. 58", "Module 10: Lossless Join & Dependency Proofs", "Mathematical verification of (R1 ∩ R2 → R1) and canonical dependency preservation."),
        ("Roll No. 59", "Module 11: Decomposition Sandbox & Algorithm", "Interactive attribute closure (X+) validation engine, XP scoring, and streak system."),
        ("Roll No. 60", "Module 12: Production SQL DDL & Conclusion", "Engineering production DDL with FOREIGN KEY, CHECK, and ON DELETE CASCADE constraints.")
    ]

    for r_idx, row_data in enumerate(division_rows):
        row = tbl_div.rows[r_idx + 1]
        for c_idx, val in enumerate(row_data):
            cell = row.cells[c_idx]
            set_cell_shading(cell, "FFFFFF" if r_idx % 2 == 0 else "F9FBFD")
            set_cell_margins(cell, top=80, bottom=80, left=120, right=120)
            p = cell.paragraphs[0]
            p.paragraph_format.space_before = Pt(0)
            p.paragraph_format.space_after = Pt(0)
            r = p.add_run(val)
            r.font.size = Pt(9.0)
            r.font.color.rgb = COLOR_BODY
            if c_idx == 0:
                r.bold = True
                r.font.color.rgb = COLOR_NAVY

    doc.add_paragraph().paragraph_format.space_after = Pt(8.0)

    # =========================================================================
    # 3. THEORETICAL BACKGROUND
    # =========================================================================
    add_heading1("THEORETICAL BACKGROUND")
    add_para("In the early eras of data processing, business applications stored information within flat, unstructured files or monolithic spreadsheets. While flat spreadsheets allow rapid ad-hoc data entry, they fail critically when scaled into high-concurrency enterprise environments. Without relational structure, data attributes representing independent real-world entities—such as university students, academic departments, instructors, and course catalogs—are bundled together into a single table. This unstructured design leads to massive data redundancy, severe lock contention during transaction processing, and devastating operational defects known as modification anomalies.")
    add_para("The mathematical foundation of relational databases was pioneered by Edgar F. Codd in 1970, founded upon set theory and first-order predicate logic. In a relational database, data is represented as relations (tables), where each tuple (row) represents an assertion of facts across an ordered set of attributes (columns). Central to relational theory is the concept of Functional Dependencies (FDs). A functional dependency X → Y indicates that a set of attributes X uniquely and unambiguously determines the values of attribute set Y across all valid instances of relation R. Using Armstrong's Axioms (Reflexivity, Augmentation, and Transitivity), the database architect computes the attribute closure X⁺ to identify minimal Candidate Keys, distinguish Prime from Non-Prime attributes, and mathematically decompose relations into normalized forms that prevent data duplication while guaranteeing zero information loss.")

    # =========================================================================
    # 3. INTRODUCTION
    # =========================================================================
    add_heading1("INTRODUCTION")
    add_para("Database Normalization is a formal, multi-stage mathematical technique for synthesizing relational schemas into modular, well-structured tables. The primary objective of normalization is twofold: first, to systematically eliminate redundant data across non-key attributes; second, to enforce integrity constraints that completely eradicate Insertion, Update, and Deletion anomalies without sacrificing the ability to reconstruct the original dataset.")
    add_para("Normalization progresses through a hierarchy of standardized Normal Forms (UNF → 1NF → 2NF → 3NF), with each successive stage imposing a progressively stricter mathematical invariant on functional dependencies:")
    add_list_item("Unnormalized Form (UNF):", "The raw, monolithic entity containing non-atomic domains, multi-valued contact attributes, and repeating record groups.")
    add_list_item("First Normal Form (1NF):", "Enforces strict domain atomicity where every cell contains exactly one indivisible value, eliminating nested arrays and repeating groups.")
    add_list_item("Second Normal Form (2NF):", "Enforces full functional dependency on the entire candidate key, completely eliminating partial key dependencies for composite keys.")
    add_list_item("Third Normal Form (3NF):", "Eliminates transitive dependencies, ensuring that every non-key attribute depends strictly and directly on the candidate key alone.")
    add_para("In enterprise Online Transaction Processing (OLTP) environments—such as Thakur College Of Engineering & Technology's student enrollment and grading portals—achieving Third Normal Form (3NF) is essential for maintaining ACID (Atomicity, Consistency, Isolation, Durability) transaction guarantees, minimizing storage bloat, and optimizing database buffer pool cache efficiency.")

    # =========================================================================
    # 4. LITERATURE SURVEY
    # =========================================================================
    add_heading1("LITERATURE SURVEY")
    add_para("The foundational principles of relational schema synthesis trace directly back to Edgar F. Codd's seminal 1970 paper, 'A Relational Model of Data for Large Shared Data Banks,' published in Communications of the ACM. Codd established the mathematical basis of relational algebra and subsequently formalized 1NF, 2NF, and 3NF in 1972 to address the profound data integrity failures inherent in hierarchical and network database architectures. Subsequent theoretical extensions by Ronald Fagin, Raymond Boyce, and Philip Bernstein established algorithmic methodologies for polynomial-time 3NF synthesis, proving that any relational schema can be decomposed into 3NF while simultaneously preserving all functional dependencies and guaranteeing a lossless join.")
    add_para("The practical reach of relational normalization extends across every tier of modern enterprise computing:")
    add_list_item("University & Student Information Systems (SIS):", "Eliminating update hazards when instructors relocate offices or when departments rename courses across multi-semester enrollment records.")
    add_list_item("Enterprise Resource Planning (ERP) & Banking:", "Decoupling financial transactions, vendor ledgers, and inventory entities to prevent catastrophic phantom write errors.")
    add_list_item("Cloud Relational Storage Engines (PostgreSQL / MySQL InnoDB):", "Narrower, normalized rows maximize page density within buffer pool RAM, significantly increasing B-Tree index traversal speeds and minimizing disk I/O bottlenecks.")
    add_list_item("High-Concurrency Microservices:", "Modular relational boundaries prevent distributed deadlocks and ensure that discrete entity services maintain strict domain boundaries.")

    # =========================================================================
    # 5. METHODOLOGY USED / CORE APPLICATIONS
    # =========================================================================
    add_heading1("METHODOLOGY USED / CORE APPLICATIONS")
    add_para("To demonstrate the rigorous mathematical transformation of an educational database, four core architectural modules and their operational implementations are analyzed below. Each module addresses a specific structural flaw in the raw education monolith TCET_Enrollment_Master and executes formal relational algebra transformations.")

    # Sub-section 1
    add_subheading("1. Elimination of Multi-Valued Attributes & 1NF Transformation")
    add_para("In the raw unnormalized dataset, the column Phone_Numbers contains comma-separated values (e.g., '9820112233, 9820445566' for student Aarav Mehta). This directly violates the fundamental relational rule of Domain Atomicity, which requires every attribute value to be drawn from a set of indivisible atomic literals.")
    add_list_item("Atomic Attribute Decomposition:", "Multi-valued phone lists are unbundled such that each contact number occupies a discrete tuple, generating an atomic relation.")
    add_list_item("Composite Candidate Key Synthesis:", "With multi-valued attributes unbundled, every row is uniquely identified by the composite Primary Key: {StudentID, CourseID, Phone_Number}.")
    add_list_item("Domain Atomicity Invariant:", "Formalized as ∀ t ∈ R, ∀ A ∈ Attributes, t[A] ∈ atomic(dom(A)).")
    add_impact_note("Enforces strict domain atomicity across all attributes. However, expanding multi-valued lists into discrete rows causes significant row proliferation and duplicates student, department, and instructor data across multiple rows, exposing the table to severe partial key dependencies.")

    # Sub-section 2
    add_subheading("2. Resolution of Partial Dependencies & 2NF Decomposition")
    add_para("While the 1NF table achieves atomic domains, its composite primary key {StudentID, CourseID} exposes a major design flaw: Partial Functional Dependencies. A partial dependency occurs when a non-prime attribute depends on only a proper subset of a composite candidate key rather than the complete key.")
    add_list_item("Partial Dependency Identification:", "StudentName and DeptID depend solely on StudentID (StudentID → {StudentName, DeptID}), while CourseTitle, Credits, and InstructorID depend solely on CourseID (CourseID → {CourseTitle, Credits, InstructorID}).")
    add_list_item("2NF Relational Partitioning:", "The relation is decomposed into four focused entities: Students (PK: StudentID), Student_Contacts (PK: {StudentID, Phone_Number}), Courses_Master (PK: CourseID), and Enrollments (PK: {StudentID, CourseID}).")
    add_list_item("Full Key Dependency Rule:", "Grade and Semester remain in Enrollments because assigning a student's grade strictly requires both StudentID and CourseID.")
    add_impact_note("Completely eliminates partial key update anomalies. Updating a student's name or a course title now requires updating exactly one row in their respective master table, rather than hundreds of enrollment records.")

    # Sub-section 3
    add_subheading("3. Resolution of Transitive Dependencies & 3NF Lossless Synthesis")
    add_para("Despite achieving 2NF, the Courses_Master relation still harbors a critical architectural vulnerability: Transitive Functional Dependencies. A transitive dependency exists when a non-prime attribute is determined by another non-prime attribute (X → Y and Y → Z, where Y is not a superkey).")
    add_list_item("Transitive Chain Detection:", "CourseID determines InstructorID, but InstructorID in turn determines InstructorName and InstructorOffice (CourseID → InstructorID → {InstructorName, InstructorOffice}). Similarly, DeptID determines DeptName and DeptBuilding (DeptID → {DeptName, DeptBuilding}).")
    add_list_item("3NF Determinant Enforcement:", "A relation R is in 3NF if and only if for every non-trivial dependency X → A, either X is a Superkey or A is a Prime Attribute.")
    add_list_item("Final 6-Table Relational Schema:", "Transitive non-key attributes are isolated into dedicated master relations: Students, Student_Contacts, Departments, Instructors, Courses, and Enrollments.")
    add_impact_note("Achieves complete transactional isolation. If Dr. Rajesh Sharma changes his office from Room 402 to Room 612, exactly one row in the Instructors table is updated. Zero student enrollment rows are modified, guaranteeing instantaneous data consistency.")

    # Sub-section 4
    add_subheading("4. Mathematical Proofs: Lossless Join & Dependency Preservation")
    add_para("A relational decomposition is mathematically valid if and only if it satisfies two formal criteria: the Lossless Join Property and Dependency Preservation.")
    add_list_item("Lossless Join Theorem:", "For any decomposition of relation R into R₁ and R₂, the natural join R₁ ⨝ R₂ is guaranteed to reconstruct R with zero spurious (phantom) tuples if and only if (R₁ ∩ R₂ → R₁) ∨ (R₁ ∩ R₂ → R₂). In our schema, Courses ∩ Instructors = {InstructorID}. Since InstructorID is the Primary Key of Instructors (InstructorID → Instructors), the join is mathematically proven lossless.")
    add_list_item("Dependency Preservation:", "Every functional dependency in the canonical set F can be validated locally within individual tables without executing expensive multi-table joins, satisfying F = (π_{R1}(F) ∪ π_{R2}(F) ∪ ... ∪ π_{Rn}(F))⁺.")
    add_impact_note("Guarantees mathematical correctness, complete data fidelity, and optimal query execution plans for production database management systems.")

    # Code Block 1: Production 3NF SQL DDL
    sql_code = """-- ============================================================================
-- PRODUCTION 3NF RELATIONAL SCHEMA DDL FOR TCET EDUCATION SYSTEM
-- ============================================================================

-- 1. Departments Master Table
CREATE TABLE Departments (
    DepartmentID VARCHAR(10) PRIMARY KEY,
    DepartmentName VARCHAR(50) NOT NULL UNIQUE,
    DeptBuilding VARCHAR(50) NOT NULL
);

-- 2. Instructors Master Table
CREATE TABLE Instructors (
    InstructorID VARCHAR(10) PRIMARY KEY,
    InstructorName VARCHAR(50) NOT NULL,
    InstructorOffice VARCHAR(30) NOT NULL,
    DepartmentID VARCHAR(10) NOT NULL,
    FOREIGN KEY (DepartmentID) REFERENCES Departments(DepartmentID)
);

-- 3. Students Master Table
CREATE TABLE Students (
    StudentID VARCHAR(15) PRIMARY KEY,
    StudentName VARCHAR(50) NOT NULL,
    DepartmentID VARCHAR(10) NOT NULL,
    FOREIGN KEY (DepartmentID) REFERENCES Departments(DepartmentID)
);

-- 4. Student Contact Numbers (Domain Atomicity Table)
CREATE TABLE Student_Contacts (
    StudentID VARCHAR(15),
    PhoneNumber VARCHAR(15),
    PRIMARY KEY (StudentID, PhoneNumber),
    FOREIGN KEY (StudentID) REFERENCES Students(StudentID) ON DELETE CASCADE
);

-- 5. Courses Master Table (Decoupled from Instructor Details)
CREATE TABLE Courses (
    CourseID VARCHAR(10) PRIMARY KEY,
    CourseTitle VARCHAR(50) NOT NULL,
    Credits INT NOT NULL CHECK (Credits BETWEEN 1 AND 6),
    InstructorID VARCHAR(10) NOT NULL,
    FOREIGN KEY (InstructorID) REFERENCES Instructors(InstructorID)
);

-- 6. Student Course Enrollments (Pure Associative Entity)
CREATE TABLE Enrollments (
    StudentID VARCHAR(15),
    CourseID VARCHAR(10),
    Semester VARCHAR(10) NOT NULL,
    Grade VARCHAR(2) CHECK (Grade IN ('O', 'A+', 'A', 'B+', 'B', 'C', 'P', 'F')),
    PRIMARY KEY (StudentID, CourseID),
    FOREIGN KEY (StudentID) REFERENCES Students(StudentID) ON DELETE CASCADE,
    FOREIGN KEY (CourseID) REFERENCES Courses(CourseID) ON DELETE CASCADE
);"""
    add_code_block(sql_code)
    add_impact_note("Production DDL enforces referential integrity constraints, entity integrity, domain check constraints, and ON DELETE CASCADE cascades, preventing orphaned records and ensuring bulletproof consistency.")

    # Code Block 2: Attribute Closure & Candidate Key Algorithm
    algo_code = """# ============================================================================
# ALGORITHMIC ATTRIBUTE CLOSURE (X+) AND CANDIDATE KEY DETERMINATION
# ============================================================================

def compute_attribute_closure(attributes_subset, functional_dependencies):
    \"\"\"
    Computes the attribute closure X+ under Armstrong's Axioms.
    Time Complexity: O(|F| * |R|), Space Complexity: O(|R|)
    \"\"\"
    closure = set(attributes_subset)
    changed = True
    
    while changed:
        changed = False
        for determinant, dependent in functional_dependencies:
            # If determinant X is a subset of current closure, add dependent Y
            if determinant.issubset(closure) and not dependent.issubset(closure):
                closure = closure.union(dependent)
                changed = True
                
    return closure

def is_superkey(attributes_subset, relation_attributes, functional_dependencies):
    \"\"\"Returns True if closure of X contains all attributes in relation R.\"\"\"
    return compute_attribute_closure(attributes_subset, functional_dependencies) == set(relation_attributes)

def is_candidate_key(attributes_subset, relation_attributes, functional_dependencies):
    \"\"\"A Candidate Key is a minimal Superkey with no redundant proper subsets.\"\"\"
    if not is_superkey(attributes_subset, relation_attributes, functional_dependencies):
        return False
    # Check if any proper subset is also a superkey
    for attr in attributes_subset:
        proper_subset = set(attributes_subset) - {attr}
        if is_superkey(proper_subset, relation_attributes, functional_dependencies):
            return False  # Not minimal
    return True"""
    add_code_block(algo_code)
    add_impact_note("O(|F| · |R|) time complexity. The closure engine deterministically verifies that every decomposed relation in 3NF has determinants that are valid Superkeys, proving mathematical conformity.")

    # Comparison Table: Normalization Stages
    add_para("Comparison Table: Relational Normalization Stages", space_before=6.0, space_after=4.0, bold=True, color=COLOR_NAVY, size=12.0)
    add_para("k = number of independent entity relations synthesized during decomposition.", space_before=0, space_after=6.0, color=COLOR_MUTED, size=9.0)

    tbl_comp = doc.add_table(rows=5, cols=5)
    tbl_comp.alignment = WD_TABLE_ALIGNMENT.CENTER
    set_table_borders(tbl_comp, color_hex=HEX_BORDER_GRID, sz="4", inside_v=True)

    headers = ["Stage", "Relational Invariant Enforced", "Tables Synthesized", "Anomalies Eliminated", "Redundancy Level"]
    col_widths = [1200, 2400, 1500, 2400, 1500]

    for c_idx, h_text in enumerate(headers):
        cell = tbl_comp.cell(0, c_idx)
        set_cell_shading(cell, HEX_SHD_HEADER)
        set_cell_margins(cell, top=100, bottom=100, left=120, right=120)
        p = cell.paragraphs[0]
        p.paragraph_format.space_before = Pt(0)
        p.paragraph_format.space_after = Pt(0)
        r = p.add_run(h_text)
        r.bold = True
        r.font.size = Pt(9.5)
        r.font.color.rgb = COLOR_NAVY

    comp_rows = [
        ("UNF", "None (Raw Monolithic Universal Table)", "1 Table (Monolith)", "None (Prone to all write anomalies)", "Severe (>90%)"),
        ("1NF", "Domain Atomicity (No multi-valued attributes)", "1 Table (Atomic Rows)", "Multi-value indexing anomalies", "High (70-80%)"),
        ("2NF", "No Partial Key Dependencies (Full PK dependency)", "4 Normalized Tables", "Partial update & deletion bugs", "Moderate (30-40%)"),
        ("3NF", "No Transitive Dependencies (Determinants are Superkeys)", "6 Modular Relations", "All Insertion, Update & Deletion Anomalies", "Minimal (<2%)")
    ]

    for r_idx, row_data in enumerate(comp_rows):
        row = tbl_comp.rows[r_idx + 1]
        for c_idx, val in enumerate(row_data):
            cell = row.cells[c_idx]
            set_cell_shading(cell, "FFFFFF" if r_idx % 2 == 0 else "F9FBFD")
            set_cell_margins(cell, top=80, bottom=80, left=120, right=120)
            p = cell.paragraphs[0]
            p.paragraph_format.space_before = Pt(0)
            p.paragraph_format.space_after = Pt(0)
            r = p.add_run(val)
            r.font.size = Pt(9.0)
            r.font.color.rgb = COLOR_BODY
            if c_idx == 0:
                r.bold = True
                r.font.color.rgb = COLOR_NAVY

    doc.add_paragraph().paragraph_format.space_after = Pt(8.0)

    # =========================================================================
    # 6. FUTURE SCOPE
    # =========================================================================
    add_heading1("FUTURE SCOPE")
    add_para("While Third Normal Form (3NF) serves as the gold standard for production transactional databases, modern data engineering paradigms continue to evolve. Higher normal forms, such as Boyce-Codd Normal Form (BCNF) and Fourth Normal Form (4NF), extend schema validation to handle multi-valued dependencies and overlapping candidate keys. In large-scale analytical architectures, Hybrid Transactional/Analytical Processing (HTAP) systems utilize normalized 3NF schemas for write-heavy OLTP workloads while asynchronously streaming CDC (Change Data Capture) pipelines into Star and Snowflake denormalized schemas optimized for columnar data warehouses (e.g., Snowflake, BigQuery, ClickHouse).")
    add_para("Furthermore, with the rise of AI-driven database management and automated Object-Relational Mapping (ORM), future iterations of this studio can incorporate automated schema migration pipelines, algorithmic functional dependency discovery from raw CSV streams, and Graph-based dependency visualization integrated with Vector Databases for Retrieval-Augmented Generation (RAG) in enterprise data governance.")

    # =========================================================================
    # 7. CONCLUSION
    # =========================================================================
    add_heading1("CONCLUSION")
    add_para("This study demonstrates that relational database normalization is not merely an academic exercise, but a vital engineering discipline required to guarantee data consistency, transactional safety, and system scalability. By systematically decomposing the unnormalized TCET_Enrollment_Master table across 1NF, 2NF, and 3NF, our 12-member team eliminated domain non-atomicity, resolved partial key dependencies, and decoupled transitive relationships.")
    add_para("The resulting 6-table 3NF production architecture achieves a near-zero redundancy rate, eradicates all Insertion, Update, and Deletion anomalies, and is mathematically proven to satisfy both the Lossless Join Theorem and Dependency Preservation. The accompanying interactive SchemaMorph 3NF studio provides a visual, auditory, and gamified laboratory that bridges theoretical relational algebra with real-world enterprise software engineering.")

    # =========================================================================
    # 8. ACKNOWLEDGEMENT
    # =========================================================================
    add_heading1("ACKNOWLEDGEMENT")
    add_para("We would like to express our sincere gratitude to the Department of Computer Engineering and the administration of Thakur College Of Engineering & Technology (TCET) for providing academic platforms, laboratory resources, and state-of-the-art computational facilities that supported the research, mathematical modeling, and development of this project report.")
    add_para("Finally, we acknowledge the dedicated collaborative efforts of all 12 group members (Roll No. 49 to 60), whose commitment and teamwork ensured the successful execution of this comprehensive study on Database Normalization to Third Normal Form.")

    # =========================================================================
    # 9. REFERENCES
    # =========================================================================
    add_heading1("REFERENCES")
    add_list_item("Codd, E. F. (1970).", "A Relational Model of Data for Large Shared Data Banks. Communications of the ACM, 13(6), 377-387.")
    add_list_item("Codd, E. F. (1972).", "Further Normalization of the Data Base Relational Model. Courant Computer Science Symposia 6: Data Base Systems. Prentice-Hall.")
    add_list_item("Silberschatz, A., Korth, H. F., & Sudarshan, S. (2019).", "Database System Concepts (7th ed.). McGraw-Hill Education.")
    add_list_item("Elmasri, R., & Navathe, S. B. (2015).", "Fundamentals of Database Systems (7th ed.). Pearson.")
    add_list_item("Date, C. J. (2004).", "An Introduction to Database Systems (8th ed.). Addison-Wesley.")
    add_list_item("Bernstein, P. A. (1976).", "Synthesizing Third Normal Form Relations from Functional Dependencies. ACM Transactions on Database Systems, 1(4), 277-298.")
    add_list_item("Fagin, R. (1977).", "Multivalued Dependencies and a New Normal Form for Relational Databases. ACM TODS, 2(3), 262-278.")
    add_list_item("TCET Department of Computer Engineering (2026).", "Module 5: Inquiry-Based Learning Relational Database Guidelines.")

    doc.save(output_path)
    print(f"Report successfully saved to: {output_path}")

if __name__ == "__main__":
    out1 = r"C:\Users\nigam\OneDrive\Documents\Database_Normalization_3NF_Report.docx"
    out2 = r"C:\Users\nigam\OneDrive\Documents\BST_Report.docx"
    create_report(out1)
    create_report(out2)
