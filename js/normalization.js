/* ==========================================================================
   SchemaMorph 3NF - Normalization Logic & Transformation Engine
   Thakur College Of Engineering Technology - Module 5 Inquiry-Based Learning
   ========================================================================== */

const NORMALIZATION_STAGES = [
  // --------------------------------------------------------------------------
  // STAGE 0: UNF (Unnormalized Form)
  // --------------------------------------------------------------------------
  {
    id: "unf",
    stageNumber: 0,
    shortName: "UNF",
    name: "Unnormalized Form (UNF)",
    badge: "Messy & Non-Atomic",
    badgeClass: "badge-partial",
    title: "Raw TCET Education Monolithic Sheet",
    description: "Contains repeating groups, multi-valued contact numbers, non-atomic attributes, and heavy data duplication across student registrations.",
    justification: "In UNF, all student, course, instructor, and department attributes reside in a single monolithic table. Multiple contact numbers exist within single cells (violating atomicity), leading to critical update, deletion, and insertion anomalies.",
    mathFormula: "Rule: Multiple values and repeating groups must not be stored in a single cell.",
    rules: [
      "Multi-valued attribute 'Phone_Numbers' contains comma-separated values.",
      "Repeating groups for students taking multiple courses.",
      "No strictly defined single Primary Key candidate without redundancy."
    ],
    gridClass: "grid-1",
    tables: [
      {
        id: "tbl_unf",
        title: "TCET_Enrollment_Master",
        icon: "📑",
        rowCount: 5,
        columns: [
          { key: "StudentID", label: "Student_ID", type: "VARCHAR(15)", isPk: false, isFk: false },
          { key: "StudentName", label: "Student_Name", type: "VARCHAR(50)", isPk: false, isFk: false },
          { key: "PhoneNumbers", label: "Phone_Numbers", type: "VARCHAR(100)", isMultiValue: true, highlight: "partial" },
          { key: "DepartmentID", label: "Dept_ID", type: "VARCHAR(10)", isPk: false, isFk: false },
          { key: "DepartmentName", label: "Dept_Name", type: "VARCHAR(50)", isPk: false, isFk: false, highlight: "transitive" },
          { key: "DeptBuilding", label: "Dept_Building", type: "VARCHAR(50)", isPk: false, isFk: false, highlight: "transitive" },
          { key: "CourseID", label: "Course_ID", type: "VARCHAR(10)", isPk: false, isFk: false },
          { key: "CourseName", label: "Course_Title", type: "VARCHAR(50)", isPk: false, isFk: false, highlight: "partial" },
          { key: "Credits", label: "Credits", type: "INT", isPk: false, isFk: false, highlight: "partial" },
          { key: "InstructorID", label: "Instructor_ID", type: "VARCHAR(10)", isPk: false, isFk: false },
          { key: "InstructorName", label: "Instructor_Name", type: "VARCHAR(50)", isPk: false, isFk: false, highlight: "transitive" },
          { key: "InstructorOffice", label: "Instructor_Office", type: "VARCHAR(30)", isPk: false, isFk: false, highlight: "transitive" },
          { key: "Semester", label: "Semester", type: "VARCHAR(10)", isPk: false, isFk: false },
          { key: "Grade", label: "Grade", type: "VARCHAR(2)", isPk: false, isFk: false }
        ],
        rows: [
          {
            StudentID: "TCET-2026-01",
            StudentName: "Aarav Mehta",
            PhoneNumbers: "9820112233, 9820445566",
            DepartmentID: "DEPT-CS",
            DepartmentName: "Computer Engineering",
            DeptBuilding: "TCET Main Block (Floor 4)",
            CourseID: "CS301",
            CourseName: "Database Systems",
            Credits: 4,
            InstructorID: "INS-101",
            InstructorName: "Dr. Rajesh Sharma",
            InstructorOffice: "Room 402",
            Semester: "Sem V",
            Grade: "A+"
          },
          {
            StudentID: "TCET-2026-01",
            StudentName: "Aarav Mehta",
            PhoneNumbers: "9820112233, 9820445566",
            DepartmentID: "DEPT-CS",
            DepartmentName: "Computer Engineering",
            DeptBuilding: "TCET Main Block (Floor 4)",
            CourseID: "CS201",
            CourseName: "Data Structures",
            Credits: 4,
            InstructorID: "INS-102",
            InstructorName: "Dr. Ananya Iyer",
            InstructorOffice: "Room 305",
            Semester: "Sem V",
            Grade: "O"
          },
          {
            StudentID: "TCET-2026-02",
            StudentName: "Diya Nair",
            PhoneNumbers: "9819998877",
            DepartmentID: "DEPT-IT",
            DepartmentName: "Information Tech",
            DeptBuilding: "TCET IT Wing (Floor 2)",
            CourseID: "CS301",
            CourseName: "Database Systems",
            Credits: 4,
            InstructorID: "INS-101",
            InstructorName: "Dr. Rajesh Sharma",
            InstructorOffice: "Room 402",
            Semester: "Sem V",
            Grade: "A"
          },
          {
            StudentID: "TCET-2026-03",
            StudentName: "Rohan Shah",
            PhoneNumbers: "9833441122, 9867001144",
            DepartmentID: "DEPT-CS",
            DepartmentName: "Computer Engineering",
            DeptBuilding: "TCET Main Block (Floor 4)",
            CourseID: "AI401",
            CourseName: "Machine Learning",
            Credits: 3,
            InstructorID: "INS-103",
            InstructorName: "Prof. Vikram Patel",
            InstructorOffice: "Room 510",
            Semester: "Sem VII",
            Grade: "B+"
          },
          {
            StudentID: "TCET-2026-04",
            StudentName: "Priya Verma",
            PhoneNumbers: "9870123456",
            DepartmentID: "DEPT-AI",
            DepartmentName: "AI & Data Science",
            DeptBuilding: "TCET R&D Block (Floor 1)",
            CourseID: "CS201",
            CourseName: "Data Structures",
            Credits: 4,
            InstructorID: "INS-102",
            InstructorName: "Dr. Ananya Iyer",
            InstructorOffice: "Room 305",
            Semester: "Sem III",
            Grade: "A"
          }
        ]
      }
    ]
  },

  // --------------------------------------------------------------------------
  // STAGE 1: 1NF (First Normal Form)
  // --------------------------------------------------------------------------
  {
    id: "1nf",
    stageNumber: 1,
    shortName: "1NF",
    name: "First Normal Form (1NF)",
    badge: "Atomic Attributes & Primary Key",
    badgeClass: "badge-atomic",
    title: "1NF Transformation: Atomicity Enforced",
    description: "Multi-valued phone numbers are unbundled into atomic entries. A composite primary key (StudentID, CourseID, ContactNumber) uniquely identifies every tuple.",
    justification: "1NF Transformation Rule: A relation is in 1NF if and only if all underlying domains contain only atomic (indivisible) values, and there are no repeating groups. Multi-valued Contact Numbers are split into distinct records, ensuring each column value is atomic.",
    mathFormula: "Rule: Every attribute in every row must hold exactly ONE single atomic value.",
    rules: [
      "All attribute domains are strictly atomic (no comma-separated phone strings).",
      "Composite Primary Key identified: {Student_ID, Course_ID, Phone_Number}.",
      "However, Partial Functional Dependencies still exist (violating 2NF)."
    ],
    gridClass: "grid-1",
    tables: [
      {
        id: "tbl_1nf",
        title: "TCET_Enrollment_1NF",
        icon: "⚡",
        rowCount: 7,
        columns: [
          { key: "StudentID", label: "Student_ID", type: "VARCHAR(15)", isPk: true },
          { key: "StudentName", label: "Student_Name", type: "VARCHAR(50)", isPk: false, highlight: "partial" },
          { key: "PhoneNumbers", label: "Phone_Number", type: "VARCHAR(15)", isPk: true, isAtomic: true },
          { key: "DepartmentID", label: "Dept_ID", type: "VARCHAR(10)", isPk: false },
          { key: "DepartmentName", label: "Dept_Name", type: "VARCHAR(50)", isPk: false, highlight: "transitive" },
          { key: "DeptBuilding", label: "Dept_Building", type: "VARCHAR(50)", isPk: false, highlight: "transitive" },
          { key: "CourseID", label: "Course_ID", type: "VARCHAR(10)", isPk: true },
          { key: "CourseName", label: "Course_Title", type: "VARCHAR(50)", isPk: false, highlight: "partial" },
          { key: "Credits", label: "Credits", type: "INT", isPk: false, highlight: "partial" },
          { key: "InstructorID", label: "Instructor_ID", type: "VARCHAR(10)", isPk: false },
          { key: "InstructorName", label: "Instructor_Name", type: "VARCHAR(50)", isPk: false, highlight: "transitive" },
          { key: "InstructorOffice", label: "Instructor_Office", type: "VARCHAR(30)", isPk: false, highlight: "transitive" },
          { key: "Semester", label: "Semester", type: "VARCHAR(10)", isPk: false },
          { key: "Grade", label: "Grade", type: "VARCHAR(2)", isPk: false }
        ],
        rows: [
          { StudentID: "TCET-2026-01", StudentName: "Aarav Mehta", PhoneNumbers: "9820112233", DepartmentID: "DEPT-CS", DepartmentName: "Computer Engineering", DeptBuilding: "TCET Main Block", CourseID: "CS301", CourseName: "Database Systems", Credits: 4, InstructorID: "INS-101", InstructorName: "Dr. Rajesh Sharma", InstructorOffice: "Room 402", Semester: "Sem V", Grade: "A+" },
          { StudentID: "TCET-2026-01", StudentName: "Aarav Mehta", PhoneNumbers: "9820445566", DepartmentID: "DEPT-CS", DepartmentName: "Computer Engineering", DeptBuilding: "TCET Main Block", CourseID: "CS301", CourseName: "Database Systems", Credits: 4, InstructorID: "INS-101", InstructorName: "Dr. Rajesh Sharma", InstructorOffice: "Room 402", Semester: "Sem V", Grade: "A+" },
          { StudentID: "TCET-2026-01", StudentName: "Aarav Mehta", PhoneNumbers: "9820112233", DepartmentID: "DEPT-CS", DepartmentName: "Computer Engineering", DeptBuilding: "TCET Main Block", CourseID: "CS201", CourseName: "Data Structures", Credits: 4, InstructorID: "INS-102", InstructorName: "Dr. Ananya Iyer", InstructorOffice: "Room 305", Semester: "Sem V", Grade: "O" },
          { StudentID: "TCET-2026-02", StudentName: "Diya Nair", PhoneNumbers: "9819998877", DepartmentID: "DEPT-IT", DepartmentName: "Information Tech", DeptBuilding: "TCET IT Wing", CourseID: "CS301", CourseName: "Database Systems", Credits: 4, InstructorID: "INS-101", InstructorName: "Dr. Rajesh Sharma", InstructorOffice: "Room 402", Semester: "Sem V", Grade: "A" },
          { StudentID: "TCET-2026-03", StudentName: "Rohan Shah", PhoneNumbers: "9833441122", DepartmentID: "DEPT-CS", DepartmentName: "Computer Engineering", DeptBuilding: "TCET Main Block", CourseID: "AI401", CourseName: "Machine Learning", Credits: 3, InstructorID: "INS-103", InstructorName: "Prof. Vikram Patel", InstructorOffice: "Room 510", Semester: "Sem VII", Grade: "B+" },
          { StudentID: "TCET-2026-03", StudentName: "Rohan Shah", PhoneNumbers: "9867001144", DepartmentID: "DEPT-CS", DepartmentName: "Computer Engineering", DeptBuilding: "TCET Main Block", CourseID: "AI401", CourseName: "Machine Learning", Credits: 3, InstructorID: "INS-103", InstructorName: "Prof. Vikram Patel", InstructorOffice: "Room 510", Semester: "Sem VII", Grade: "B+" },
          { StudentID: "TCET-2026-04", StudentName: "Priya Verma", PhoneNumbers: "9870123456", DepartmentID: "DEPT-AI", DepartmentName: "AI & Data Science", DeptBuilding: "TCET R&D Block", CourseID: "CS201", CourseName: "Data Structures", Credits: 4, InstructorID: "INS-102", InstructorName: "Dr. Ananya Iyer", InstructorOffice: "Room 305", Semester: "Sem III", Grade: "A" }
        ]
      }
    ]
  },

  // --------------------------------------------------------------------------
  // STAGE 2: 2NF (Second Normal Form)
  // --------------------------------------------------------------------------
  {
    id: "2nf",
    stageNumber: 2,
    shortName: "2NF",
    name: "Second Normal Form (2NF)",
    badge: "No Partial Dependencies",
    badgeClass: "badge-pk",
    title: "2NF Transformation: Full Functional Dependency",
    description: "Elimination of Partial Dependencies. Attributes depending only on a subset of the candidate key (StudentID or CourseID) are decomposed into distinct tables.",
    justification: "2NF Transformation Rule: A relation is in 2NF if it is in 1NF and no non-prime attribute is partially dependent on any candidate key. Student details depend solely on StudentID, while Course details depend solely on CourseID. We split the relation into Students, Student_Phones, Courses, and Student_Enrollments.",
    mathFormula: "Rule: Must be in 1NF + No partial key dependencies (every non-key depends on full PK).",
    rules: [
      "Partial FD: StudentID → StudentName, DepartmentID eliminated.",
      "Partial FD: CourseID → CourseName, Credits, InstructorID eliminated.",
      "Enrollment table maintains composite key {StudentID, CourseID} for Grade and Semester.",
      "However, Transitive Dependencies (InstructorID → InstructorName, DeptID → DeptBuilding) still exist in Courses."
    ],
    gridClass: "grid-2",
    tables: [
      {
        id: "tbl_2nf_students",
        title: "Students (2NF)",
        icon: "👨‍🎓",
        rowCount: 4,
        columns: [
          { key: "StudentID", label: "Student_ID", isPk: true },
          { key: "StudentName", label: "Student_Name", isPk: false },
          { key: "DepartmentID", label: "Dept_ID", isPk: false }
        ],
        rows: [
          { StudentID: "TCET-2026-01", StudentName: "Aarav Mehta", DepartmentID: "DEPT-CS" },
          { StudentID: "TCET-2026-02", StudentName: "Diya Nair", DepartmentID: "DEPT-IT" },
          { StudentID: "TCET-2026-03", StudentName: "Rohan Shah", DepartmentID: "DEPT-CS" },
          { StudentID: "TCET-2026-04", StudentName: "Priya Verma", DepartmentID: "DEPT-AI" }
        ]
      },
      {
        id: "tbl_2nf_contacts",
        title: "Student_Contacts (2NF)",
        icon: "📱",
        rowCount: 6,
        columns: [
          { key: "StudentID", label: "Student_ID", isPk: true, isFk: true },
          { key: "PhoneNumbers", label: "Phone_Number", isPk: true }
        ],
        rows: [
          { StudentID: "TCET-2026-01", PhoneNumbers: "9820112233" },
          { StudentID: "TCET-2026-01", PhoneNumbers: "9820445566" },
          { StudentID: "TCET-2026-02", PhoneNumbers: "9819998877" },
          { StudentID: "TCET-2026-03", PhoneNumbers: "9833441122" },
          { StudentID: "TCET-2026-03", PhoneNumbers: "9867001144" },
          { StudentID: "TCET-2026-04", PhoneNumbers: "9870123456" }
        ]
      },
      {
        id: "tbl_2nf_courses",
        title: "Courses_Master (2NF - Has Transitive FDs)",
        icon: "📚",
        rowCount: 3,
        columns: [
          { key: "CourseID", label: "Course_ID", isPk: true },
          { key: "CourseName", label: "Course_Title", isPk: false },
          { key: "Credits", label: "Credits", isPk: false },
          { key: "InstructorID", label: "Instructor_ID", isPk: false },
          { key: "InstructorName", label: "Instructor_Name", isPk: false, highlight: "transitive" },
          { key: "InstructorOffice", label: "Instructor_Office", isPk: false, highlight: "transitive" },
          { key: "DepartmentID", label: "Dept_ID", isPk: false, highlight: "transitive" },
          { key: "DepartmentName", label: "Dept_Name", isPk: false, highlight: "transitive" },
          { key: "DeptBuilding", label: "Dept_Building", isPk: false, highlight: "transitive" }
        ],
        rows: [
          { CourseID: "CS301", CourseName: "Database Systems", Credits: 4, InstructorID: "INS-101", InstructorName: "Dr. Rajesh Sharma", InstructorOffice: "Room 402", DepartmentID: "DEPT-CS", DepartmentName: "Computer Engineering", DeptBuilding: "TCET Main Block" },
          { CourseID: "CS201", CourseName: "Data Structures", Credits: 4, InstructorID: "INS-102", InstructorName: "Dr. Ananya Iyer", InstructorOffice: "Room 305", DepartmentID: "DEPT-CS", DepartmentName: "Computer Engineering", DeptBuilding: "TCET Main Block" },
          { CourseID: "AI401", CourseName: "Machine Learning", Credits: 3, InstructorID: "INS-103", InstructorName: "Prof. Vikram Patel", InstructorOffice: "Room 510", DepartmentID: "DEPT-CS", DepartmentName: "Computer Engineering", DeptBuilding: "TCET Main Block" }
        ]
      },
      {
        id: "tbl_2nf_enrollments",
        title: "Enrollments (2NF)",
        icon: "📝",
        rowCount: 5,
        columns: [
          { key: "StudentID", label: "Student_ID", isPk: true, isFk: true },
          { key: "CourseID", label: "Course_ID", isPk: true, isFk: true },
          { key: "Semester", label: "Semester", isPk: false },
          { key: "Grade", label: "Grade", isPk: false }
        ],
        rows: [
          { StudentID: "TCET-2026-01", CourseID: "CS301", Semester: "Sem V", Grade: "A+" },
          { StudentID: "TCET-2026-01", CourseID: "CS201", Semester: "Sem V", Grade: "O" },
          { StudentID: "TCET-2026-02", CourseID: "CS301", Semester: "Sem V", Grade: "A" },
          { StudentID: "TCET-2026-03", CourseID: "AI401", Semester: "Sem VII", Grade: "B+" },
          { StudentID: "TCET-2026-04", CourseID: "CS201", Semester: "Sem III", Grade: "A" }
        ]
      }
    ]
  },

  // --------------------------------------------------------------------------
  // STAGE 3: 3NF (Third Normal Form) - TARGET STATE
  // --------------------------------------------------------------------------
  {
    id: "3nf",
    stageNumber: 3,
    shortName: "3NF",
    name: "Third Normal Form (3NF)",
    badge: "Fully Normalized (No Transitive FDs)",
    badgeClass: "badge-transitive",
    title: "3NF Transformation: Lossless & Transitive-Free",
    description: "All transitive dependencies (CourseID → InstructorID → Instructor Details, DeptID → Dept Details) are decomposed into dedicated Instructors and Departments tables.",
    justification: "3NF Transformation Rule: A relation is in 3NF if it is in 2NF and for every functional dependency X → A, either X is a superkey, or A is a prime attribute (part of candidate key). By separating Instructors and Departments, we eliminate all transitive anomalies while preserving dependencies and ensuring lossless join decomposition.",
    mathFormula: "Rule: Must be in 2NF + No transitive dependencies (no non-key determines another non-key).",
    rules: [
      "Transitive Chain 1: CourseID → InstructorID → {InstructorName, InstructorOffice, DeptID} resolved into 'Instructors'.",
      "Transitive Chain 2: DeptID → {DeptName, DeptBuilding} resolved into 'Departments'.",
      "Preserves all Functional Dependencies (Lossless Join Decomposition).",
      "All Anomaly Stress-Tests now pass flawlessly."
    ],
    gridClass: "grid-3",
    tables: [
      {
        id: "tbl_3nf_students",
        title: "Students",
        icon: "👨‍🎓",
        rowCount: 4,
        columns: [
          { key: "StudentID", label: "StudentID", isPk: true },
          { key: "StudentName", label: "StudentName", isPk: false },
          { key: "DepartmentID", label: "DepartmentID", isFk: true, fkRef: "Departments.DepartmentID" }
        ],
        rows: [
          { StudentID: "TCET-2026-01", StudentName: "Aarav Mehta", DepartmentID: "DEPT-CS" },
          { StudentID: "TCET-2026-02", StudentName: "Diya Nair", DepartmentID: "DEPT-IT" },
          { StudentID: "TCET-2026-03", StudentName: "Rohan Shah", DepartmentID: "DEPT-CS" },
          { StudentID: "TCET-2026-04", StudentName: "Priya Verma", DepartmentID: "DEPT-AI" }
        ]
      },
      {
        id: "tbl_3nf_contacts",
        title: "Student_Contacts",
        icon: "📱",
        rowCount: 6,
        columns: [
          { key: "StudentID", label: "StudentID", isPk: true, isFk: true, fkRef: "Students.StudentID" },
          { key: "PhoneNumbers", label: "PhoneNumber", isPk: true }
        ],
        rows: [
          { StudentID: "TCET-2026-01", PhoneNumbers: "9820112233" },
          { StudentID: "TCET-2026-01", PhoneNumbers: "9820445566" },
          { StudentID: "TCET-2026-02", PhoneNumbers: "9819998877" },
          { StudentID: "TCET-2026-03", PhoneNumbers: "9833441122" },
          { StudentID: "TCET-2026-03", PhoneNumbers: "9867001144" },
          { StudentID: "TCET-2026-04", PhoneNumbers: "9870123456" }
        ]
      },
      {
        id: "tbl_3nf_departments",
        title: "Departments",
        icon: "🏛️",
        rowCount: 3,
        columns: [
          { key: "DepartmentID", label: "DepartmentID", isPk: true },
          { key: "DepartmentName", label: "DepartmentName", isPk: false },
          { key: "DeptBuilding", label: "BuildingLocation", isPk: false }
        ],
        rows: [
          { DepartmentID: "DEPT-CS", DepartmentName: "Computer Engineering", DeptBuilding: "TCET Main Block (Fl 4)" },
          { DepartmentID: "DEPT-IT", DepartmentName: "Information Tech", DeptBuilding: "TCET IT Wing (Fl 2)" },
          { DepartmentID: "DEPT-AI", DepartmentName: "AI & Data Science", DeptBuilding: "TCET R&D Block (Fl 1)" }
        ]
      },
      {
        id: "tbl_3nf_instructors",
        title: "Instructors",
        icon: "👩‍🏫",
        rowCount: 3,
        columns: [
          { key: "InstructorID", label: "InstructorID", isPk: true },
          { key: "InstructorName", label: "InstructorName", isPk: false },
          { key: "InstructorOffice", label: "OfficeRoom", isPk: false },
          { key: "DepartmentID", label: "DepartmentID", isFk: true, fkRef: "Departments.DepartmentID" }
        ],
        rows: [
          { InstructorID: "INS-101", InstructorName: "Dr. Rajesh Sharma", InstructorOffice: "Room 402", DepartmentID: "DEPT-CS" },
          { InstructorID: "INS-102", InstructorName: "Dr. Ananya Iyer", InstructorOffice: "Room 305", DepartmentID: "DEPT-CS" },
          { InstructorID: "INS-103", InstructorName: "Prof. Vikram Patel", InstructorOffice: "Room 510", DepartmentID: "DEPT-CS" }
        ]
      },
      {
        id: "tbl_3nf_courses",
        title: "Courses",
        icon: "📚",
        rowCount: 3,
        columns: [
          { key: "CourseID", label: "CourseID", isPk: true },
          { key: "CourseName", label: "CourseTitle", isPk: false },
          { key: "Credits", label: "Credits", isPk: false },
          { key: "InstructorID", label: "InstructorID", isFk: true, fkRef: "Instructors.InstructorID" }
        ],
        rows: [
          { CourseID: "CS301", CourseName: "Database Systems", Credits: 4, InstructorID: "INS-101" },
          { CourseID: "CS201", CourseName: "Data Structures", Credits: 4, InstructorID: "INS-102" },
          { CourseID: "AI401", CourseName: "Machine Learning", Credits: 3, InstructorID: "INS-103" }
        ]
      },
      {
        id: "tbl_3nf_enrollments",
        title: "Enrollments",
        icon: "📝",
        rowCount: 5,
        columns: [
          { key: "StudentID", label: "StudentID", isPk: true, isFk: true, fkRef: "Students.StudentID" },
          { key: "CourseID", label: "CourseID", isPk: true, isFk: true, fkRef: "Courses.CourseID" },
          { key: "Semester", label: "Semester", isPk: false },
          { key: "Grade", label: "Grade", isPk: false }
        ],
        rows: [
          { StudentID: "TCET-2026-01", CourseID: "CS301", Semester: "Sem V", Grade: "A+" },
          { StudentID: "TCET-2026-01", CourseID: "CS201", Semester: "Sem V", Grade: "O" },
          { StudentID: "TCET-2026-02", CourseID: "CS301", Semester: "Sem V", Grade: "A" },
          { StudentID: "TCET-2026-03", CourseID: "AI401", Semester: "Sem VII", Grade: "B+" },
          { StudentID: "TCET-2026-04", CourseID: "CS201", Semester: "Sem III", Grade: "A" }
        ]
      }
    ]
  }
];

window.NORMALIZATION_STAGES = NORMALIZATION_STAGES;
