# Knowly-Yo — Teacher Knowledge Hub & Student Learning Platform

> A full-stack, production-grade web platform combining technical knowledge management, classroom teaching preparation, learning progress tracking, spaced revision planning, and student collaboration.

---

## 🚀 Key Architectural Highlights

- **Dual-Role Authorization System:** 
  - **Instructor (Teacher):** Create & organize subjects, nested chapters, and topics; maintain private teaching scripts; publish selected notes to student cohorts; schedule classes with checklists; record post-class logs; assign homework; review and grade student submissions; moderate the student question bank.
  - **Student:** Access published notes by subject & chapter; track personal topic confidence ratings (1–5) and learning statuses; schedule spaced revisions; submit code homework; ask questions in the question bank and mark verified answers.
  - **Real-Time Role Switcher:** An instant switcher in the top bar allows immediate toggling between Teacher view (`Revanth`) and Student view (`Alex Chen`) to verify authorization boundaries and UI experiences in real-time.
- **Tiptap Rich-Text Editor & Teaching Template:**
  - Full WYSIWYG formatting: Headings H1–H3, bold, italic, strikethrough, blockquotes, ordered/bullet lists, task checklists.
  - Code blocks with syntax highlighting and instant copy button.
  - Built-in **10-Point Classroom Teaching Template**:
    1. Concept: What is it?
    2. Simple explanation for students (intuitive real-world analogy)
    3. Syntax & structure skeleton
    4. Working production example
    5. Expected terminal output
    6. Common student mistakes & traps
    7. Interview questions & answers
    8. Practice exercises for class
    9. Personal understanding & runtime internals
    10. 5-Minute revision takeaways
  - **Distraction-Free Presentation Mode:** Fullscreen, large-typography mode optimized for presenting on classroom projectors without UI clutter.
  - **Real PDF Export:** Print stylesheet formatting with preserved code blocks and zero awkward page breaks.
  - **Reliable Debounced Autosave:** Visible state transitions (`Saving...` → `Saved at HH:MM:SS` → `Save failed`).
- **Personal Learning Tracker & Analytics:**
  - Statuses: `Not Started`, `Learning`, `Practiced`, `Mastered`.
  - Confidence rating from 1 to 5 stars per chapter.
  - Focused practice session logger (duration in minutes + reflections/difficulties).
  - Visual analytics with **Recharts**:
    - Subject mastery breakdown bar chart.
    - Status distribution donut chart.
    - Automated detection of weak topics requiring attention.
- **Spaced Revision Center:**
  - Automated spaced repetition intervals (1, 3, 7, 14 days, or custom).
  - Filters: `Due Today`, `Overdue`, `Upcoming`, `All Active`, `Completed`.
  - Snooze / Reschedule actions (+1d, +3d, +7d).
  - Confetti streak celebrations on completion.
- **Teaching & Lesson Planner:**
  - Scheduled classes with date, time, and batch assignment.
  - Interactive pre-class preparation checklist.
  - Post-class log recording actual topics covered, postponed topics, homework assigned, and student questions asked.
- **Cohort Batches & Assignment Workflow:**
  - Unique batch join codes for students.
  - Assignments with deadlines, max scores, and instructions.
  - Student submission interface with code editors and approach breakdown.
  - Teacher grading dialog with numerical scoring and feedback.
- **Student Question Bank:**
  - Filterable by subject, tags, and status (`Open`, `Answered`, `Resolved`).
  - Code snippet support in questions and explanations.
  - Teacher/author verification marker for **Accepted Answers**.
- **AI Teaching Assistant:**
  - Built-in educational synthesis prompts:
    - *Structure Teaching Note* (convert rough bullets into the 10-point script).
    - *Concept Explainer* (adapt depth for Beginner, Intermediate, or Advanced learners).
    - *Code Generator* (production Java/SQL working examples with expected output).
    - *Quiz Generator* (multiple-choice questions with answer key).
    - *Common Mistakes* (compiler gotchas and student traps).
    - *Summarize* (rapid 5-minute revision notes).
  - Editable preview dialog before inserting or replacing content.
- **PostgreSQL & Supabase Row Level Security (RLS):**
  - Full 20-table schema in `supabase/migrations/20261026000000_init_schema.sql`.
  - Enforces database-level access rules (students can only read published notes; users only modify their own learning records and submissions).
  - Offline-first resilient client store pre-seeded with rich sample content for **Java, SQL & DBMS, DSA, and React & Spring Boot**.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Frontend Framework** | React 19 + TypeScript + Vite |
| **Styling** | Tailwind CSS v4 + Custom Graphite Dark / Light Design System |
| **Icons** | Lucide React |
| **Routing** | React Router DOM v7 |
| **Rich-Text Editor** | Tiptap (StarterKit, TaskList, TaskItem, Placeholder) |
| **Analytics & Charts** | Recharts (Donut Pie, Bar Charts, Tooltips) |
| **Database & Auth** | Supabase JavaScript Client + PostgreSQL + Row Level Security |
| **Testing** | Vitest + Testing Library |

---

## 📁 Project Directory Structure

```
knowly-yo/
├── public/
├── src/
│   ├── components/
│   │   ├── layout/            # Sidebar, Topbar, MobileDrawer, AppShell
│   │   └── ui/                # Button, Badge, Card, Modal, Input, Toast, EmptyState, CommandPalette
│   ├── features/
│   │   ├── dashboard/         # Real computed analytics and quick action launchpad
│   │   ├── subjects/          # Knowledge Hub & chapter hierarchy explorer
│   │   ├── notes/             # Tiptap rich-text editor, presentation mode, PDF export
│   │   ├── learning/          # Mastery tracker, practice session logger, Recharts
│   │   ├── revisions/         # Spaced repetition queue & interval scheduler
│   │   ├── teaching/          # Lesson planner, prep checklists, and class logs
│   │   ├── batches/           # Batch enrollment and student invite codes
│   │   ├── assignments/       # Assignment creation, student submission, and grading
│   │   ├── questions/         # Student Q&A bank with verified accepted answers
│   │   ├── ai/                # AI pedagogical prompt generation suite
│   │   ├── settings/          # Theme toggle, database connectivity, backup export
│   │   └── common/            # 404 NotFound page
│   ├── hooks/                 # useAppStore, useTheme
│   ├── lib/
│   │   └── supabase/          # client.ts, store.ts (persistent store), seedData.ts
│   ├── routes/                # createBrowserRouter definitions & route guards
│   ├── types/                 # TypeScript interfaces for all 20 entities
│   ├── index.css              # Custom themes (Graphite dark default & light mode)
│   ├── main.tsx
│   └── App.tsx
├── supabase/
│   ├── migrations/            # 20-table PostgreSQL DDL + Row Level Security policies
│   └── seed.sql               # Seed data for production databases
├── tests/
│   └── auth_and_store.test.ts # Vitest automated tests verifying RLS and workflows
├── .env.example
├── vite.config.ts
├── tsconfig.json
└── package.json
```

---

## 💻 Running the Application

### 1. Install Dependencies
```powershell
npm install
```

### 2. Run the Development Server
```powershell
npm run dev
```
Open your browser at `http://localhost:5173`.

### 3. Run Automated Tests
```powershell
npm run test
```

### 4. Build for Production
```powershell
npm run build
```

---

## 🔐 Database & Row Level Security Setup (Optional Remote Supabase)

To link Knowly-Yo to a live Supabase PostgreSQL instance:
1. Copy `.env.example` to `.env`:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```
2. In your Supabase SQL Editor, run `supabase/migrations/20261026000000_init_schema.sql`.
3. Optionally run `supabase/seed.sql` to populate sample subjects and chapters.
4. Restart the Vite dev server. The app will automatically connect to remote PostgreSQL while preserving local fallback capabilities.
