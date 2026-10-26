import { 
  Subject, 
  Chapter, 
  Note, 
  LearningRecord, 
  RevisionTask, 
  Batch, 
  Lesson, 
  Question, 
  Answer, 
  Assignment, 
  Submission, 
  AppNotification,
  Profile
} from '@/types';

export const SEED_PROFILES: Profile[] = [
  {
    id: 'user-teacher-revanth',
    email: 'revanth@knowly.dev',
    full_name: 'Revanth (Instructor)',
    role: 'teacher',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    created_at: new Date(Date.now() - 30 * 86400000).toISOString()
  },
  {
    id: 'user-student-alex',
    email: 'alex@student.knowly.dev',
    full_name: 'Alex Chen',
    role: 'student',
    avatar_url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    created_at: new Date(Date.now() - 20 * 86400000).toISOString()
  }
];

export const SEED_SUBJECTS: Subject[] = [
  {
    id: 'sub-java',
    owner_id: 'user-teacher-revanth',
    name: 'Java & Object-Oriented Programming',
    description: 'Core Java, OOP principles, Collections Framework, Multithreading, and JVM internals.',
    icon: 'Coffee',
    color: '#f59e0b',
    created_at: '2026-09-01T10:00:00Z',
    updated_at: '2026-10-20T14:30:00Z'
  },
  {
    id: 'sub-sql',
    owner_id: 'user-teacher-revanth',
    name: 'SQL & Database Systems',
    description: 'Relational design, complex queries, indexing strategies, ACID transactions, and normalization.',
    icon: 'Database',
    color: '#0ea5e9',
    created_at: '2026-09-05T10:00:00Z',
    updated_at: '2026-10-22T09:15:00Z'
  },
  {
    id: 'sub-dsa',
    owner_id: 'user-teacher-revanth',
    name: 'Data Structures & Algorithms',
    description: 'Arrays, Two Pointers, Trees, Graphs, Dynamic Programming, and Time Complexity.',
    icon: 'Binary',
    color: '#10b981',
    created_at: '2026-09-10T10:00:00Z',
    updated_at: '2026-10-24T18:00:00Z'
  },
  {
    id: 'sub-react-spring',
    owner_id: 'user-teacher-revanth',
    name: 'React & Spring Boot Full-Stack',
    description: 'Modern component-driven frontends with resilient Spring Boot RESTful microservices.',
    icon: 'Layers',
    color: '#8b5cf6',
    created_at: '2026-09-15T10:00:00Z',
    updated_at: '2026-10-25T11:45:00Z'
  }
];

export const SEED_CHAPTERS: Chapter[] = [
  // Java
  { id: 'chap-java-01', subject_id: 'sub-java', title: '01. Java Basics & Memory Model', sort_order: 1, created_at: '2026-09-01T10:00:00Z' },
  { id: 'chap-java-02', subject_id: 'sub-java', title: '02. OOP Principles (Encapsulation, Polymorphism, Inheritance)', sort_order: 2, created_at: '2026-09-01T10:00:00Z' },
  { id: 'chap-java-03', subject_id: 'sub-java', title: '03. Java Collections Framework & Generics', sort_order: 3, created_at: '2026-09-01T10:00:00Z' },
  { id: 'chap-java-04', subject_id: 'sub-java', title: '04. Concurrency & Executor Service', sort_order: 4, created_at: '2026-09-01T10:00:00Z' },

  // SQL
  { id: 'chap-sql-01', subject_id: 'sub-sql', title: '01. Relational Schema Design & DDL', sort_order: 1, created_at: '2026-09-05T10:00:00Z' },
  { id: 'chap-sql-02', subject_id: 'sub-sql', title: '02. Joins, Group By & Aggregate Analytics', sort_order: 2, created_at: '2026-09-05T10:00:00Z' },
  { id: 'chap-sql-03', subject_id: 'sub-sql', title: '03. Indexing Internals (B-Tree vs Hash) & Query Plans', sort_order: 3, created_at: '2026-09-05T10:00:00Z' },

  // DSA
  { id: 'chap-dsa-01', subject_id: 'sub-dsa', title: '01. Arrays, Sliding Window & Two Pointers', sort_order: 1, created_at: '2026-09-10T10:00:00Z' },
  { id: 'chap-dsa-02', subject_id: 'sub-dsa', title: '02. Binary Trees & BST Traversals', sort_order: 2, created_at: '2026-09-10T10:00:00Z' },

  // React & Spring
  { id: 'chap-react-01', subject_id: 'sub-react-spring', title: '01. React Hooks & State Management', sort_order: 1, created_at: '2026-09-15T10:00:00Z' },
  { id: 'chap-spring-01', subject_id: 'sub-react-spring', title: '02. Spring Boot REST Architecture & DI', sort_order: 2, created_at: '2026-09-15T10:00:00Z' }
];

export const SEED_NOTES: Note[] = [
  {
    id: 'note-java-polymorphism',
    chapter_id: 'chap-java-02',
    subject_id: 'sub-java',
    author_id: 'user-teacher-revanth',
    title: 'Polymorphism & Dynamic Method Dispatch in Java',
    status: 'ready',
    is_published: true,
    published_to_batches: ['batch-2026-java'],
    tags: ['oop', 'runtime-polymorphism', 'interview-must'],
    content_text: 'Complete classroom lecture notes on runtime polymorphism and method overriding.',
    content_json: JSON.stringify({
      type: 'doc',
      content: [
        { type: 'heading', attrs: { level: 1 }, content: [{ type: 'text', text: '1. Concept: What is Polymorphism?' }] },
        { type: 'paragraph', content: [{ type: 'text', text: 'Polymorphism (Greek for "many forms") is the ability of an object reference to take different underlying forms and behave dynamically depending on the actual runtime instance.' }] },
        { type: 'heading', attrs: { level: 2 }, content: [{ type: 'text', text: '2. Simple Explanation for Students' }] },
        { type: 'paragraph', content: [{ type: 'text', text: 'Imagine a universal remote. The button says "Play". If pointed at a Blu-ray player, it spins a disc. If pointed at Spotify on your TV, it streams audio. The interface call is identical (press play), but the actual behavior depends on the device receiving the signal.' }] },
        { type: 'heading', attrs: { level: 2 }, content: [{ type: 'text', text: '3. Syntax & Structure' }] },
        {
          type: 'codeBlock',
          attrs: { language: 'java' },
          content: [{ type: 'text', text: 'Parent obj = new Child();\nobj.action(); // Calls Child version at runtime' }]
        },
        { type: 'heading', attrs: { level: 2 }, content: [{ type: 'text', text: '4. Working Production Example' }] },
        {
          type: 'codeBlock',
          attrs: { language: 'java' },
          content: [{ type: 'text', text: 'abstract class PaymentGateway {\n    public abstract void processPayment(double amount);\n}\n\nclass StripePayment extends PaymentGateway {\n    @Override\n    public void processPayment(double amount) {\n        System.out.println("Processing $" + amount + " via Stripe SDK v3.");\n    }\n}\n\nclass PayPalPayment extends PaymentGateway {\n    @Override\n    public void processPayment(double amount) {\n        System.out.println("Processing $" + amount + " via PayPal REST API.");\n    }\n}\n\npublic class PaymentService {\n    public static void executeCheckout(PaymentGateway gateway, double amount) {\n        gateway.processPayment(amount); // Dynamic dispatch!\n    }\n    \n    public static void main(String[] args) {\n        PaymentGateway stripe = new StripePayment();\n        executeCheckout(stripe, 149.99);\n    }\n}' }]
        },
        { type: 'heading', attrs: { level: 2 }, content: [{ type: 'text', text: '5. Expected Output' }] },
        {
          type: 'codeBlock',
          attrs: { language: 'text' },
          content: [{ type: 'text', text: 'Processing $149.99 via Stripe SDK v3.' }]
        },
        { type: 'heading', attrs: { level: 2 }, content: [{ type: 'text', text: '6. Common Student Mistakes' }] },
        { type: 'bulletList', content: [
          { type: 'listItem', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Confusing method overloading (compile-time, static binding) with method overriding (runtime, dynamic dispatch).' }] }] },
          { type: 'listItem', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Thinking private or static methods can be overridden (they are resolved at compile time).' }] }] }
        ]},
        { type: 'heading', attrs: { level: 2 }, content: [{ type: 'text', text: '7. Interview Questions & Answers' }] },
        { type: 'paragraph', content: [{ type: 'text', text: 'Q: How does the JVM execute dynamic method dispatch internally?\nA: The JVM uses an internal data structure called the Virtual Method Table (vtable). Each class has its own vtable pointing to the method implementations. Method resolution looks up the offset in the runtime instance\'s table.' }] },
        { type: 'heading', attrs: { level: 2 }, content: [{ type: 'text', text: '8. Revision Notes' }] },
        { type: 'paragraph', content: [{ type: 'text', text: 'Key takeaway: Overriding needs same signature, same or broader access modifier, and compatible return types (covariant returns).' }] }
      ]
    }),
    created_at: '2026-10-18T10:00:00Z',
    updated_at: '2026-10-24T12:00:00Z'
  },
  {
    id: 'note-sql-joins',
    chapter_id: 'chap-sql-02',
    subject_id: 'sub-sql',
    author_id: 'user-teacher-revanth',
    title: 'Mastering SQL Joins & Query Execution Cost',
    status: 'ready',
    is_published: true,
    published_to_batches: ['batch-2026-java'],
    tags: ['sql', 'joins', 'performance', 'indexing'],
    content_text: 'Deep dive into Inner, Left, Full Outer Joins, and Cartesian products.',
    content_json: JSON.stringify({
      type: 'doc',
      content: [
        { type: 'heading', attrs: { level: 1 }, content: [{ type: 'text', text: '1. Concept: Relational Joins' }] },
        { type: 'paragraph', content: [{ type: 'text', text: 'Relational databases normalize tables to eliminate redundancy. SQL Joins reconnect related entities using primary key / foreign key constraints.' }] },
        { type: 'heading', attrs: { level: 2 }, content: [{ type: 'text', text: '2. Working Example: Left Join with Group By' }] },
        {
          type: 'codeBlock',
          attrs: { language: 'sql' },
          content: [{ type: 'text', text: 'SELECT \n    u.id,\n    u.full_name,\n    COUNT(o.id) AS total_orders,\n    COALESCE(SUM(o.amount), 0) AS total_spent\nFROM users u\nLEFT JOIN orders o ON u.id = o.user_id\nGROUP BY u.id, u.full_name\nHAVING COUNT(o.id) > 0\nORDER BY total_spent DESC;' }]
        },
        { type: 'heading', attrs: { level: 2 }, content: [{ type: 'text', text: '3. Common Pitfalls' }] },
        { type: 'paragraph', content: [{ type: 'text', text: 'Filtering the right table in a WHERE clause converts a LEFT JOIN into an INNER JOIN if null checking is omitted!' }] }
      ]
    }),
    created_at: '2026-10-19T14:00:00Z',
    updated_at: '2026-10-25T16:00:00Z'
  },
  {
    id: 'note-dsa-sliding-window',
    chapter_id: 'chap-dsa-01',
    subject_id: 'sub-dsa',
    author_id: 'user-teacher-revanth',
    title: 'Sliding Window Algorithm Patterns & Subarray Problems',
    status: 'ready',
    is_published: true,
    published_to_batches: ['batch-2026-java'],
    tags: ['dsa', 'arrays', 'sliding-window', 'leetcode'],
    content_text: 'Fixed and variable size sliding window optimization reducing O(n^2) to O(n).',
    content_json: JSON.stringify({
      type: 'doc',
      content: [
        { type: 'heading', attrs: { level: 1 }, content: [{ type: 'text', text: '1. Concept: Sliding Window Technique' }] },
        { type: 'paragraph', content: [{ type: 'text', text: 'The Sliding Window pattern is used to perform operations on a specific window size of a given array or linked list, reducing nested loop overhead from O(N^2) to O(N).' }] },
        {
          type: 'codeBlock',
          attrs: { language: 'java' },
          content: [{ type: 'text', text: 'public static int maxSubArraySum(int[] arr, int k) {\n    int maxSum = 0, windowSum = 0;\n    for (int i = 0; i < k; i++) windowSum += arr[i];\n    maxSum = windowSum;\n    \n    for (int i = k; i < arr.length; i++) {\n        windowSum += arr[i] - arr[i - k]; // slide window\n        maxSum = Math.max(maxSum, windowSum);\n    }\n    return maxSum;\n}' }]
        }
      ]
    }),
    created_at: '2026-10-21T09:00:00Z',
    updated_at: '2026-10-25T17:30:00Z'
  }
];

export const SEED_BATCHES: Batch[] = [
  {
    id: 'batch-2026-java',
    teacher_id: 'user-teacher-revanth',
    name: 'Java Full-Stack 2026 Elite',
    code: 'JAVA-2026',
    description: 'Intensive engineering batch covering Java, Spring Boot, PostgreSQL, and Data Structures.',
    student_count: 28,
    created_at: '2026-09-01T08:00:00Z'
  },
  {
    id: 'batch-weekend-sql',
    teacher_id: 'user-teacher-revanth',
    name: 'Weekend Database Architect Bootcamp',
    code: 'SQL-WKND',
    description: 'PostgreSQL indexing, query optimization, and transaction isolation levels.',
    student_count: 16,
    created_at: '2026-09-15T08:00:00Z'
  }
];

export const SEED_LESSONS: Lesson[] = [
  {
    id: 'lesson-01',
    batch_id: 'batch-2026-java',
    batch_name: 'Java Full-Stack 2026 Elite',
    teacher_id: 'user-teacher-revanth',
    subject_id: 'sub-java',
    title: 'Polymorphism & Interface Contracts Live Coding',
    starts_at: new Date(Date.now() + 86400000 * 1).toISOString(), // Tomorrow
    ends_at: new Date(Date.now() + 86400000 * 1 + 5400000).toISOString(),
    planned_topics: [
      'Interface default & static methods',
      'Abstract classes vs Interfaces',
      'Live refactoring of PaymentGateway sample'
    ],
    preparation_checklist: [
      { id: 'c1', label: 'Review payment gateway code snippets', checked: true },
      { id: 'c2', label: 'Verify IntelliJ presentation mode screen zoom', checked: true },
      { id: 'c3', label: 'Prepare 3 student live coding prompts', checked: false }
    ],
    status: 'scheduled',
    homework: 'Implement BankTransferPayment with validation logic and unit tests.',
    teacher_notes: 'Focus on why interface segregation prevents monolithic fat contracts.'
  },
  {
    id: 'lesson-02',
    batch_id: 'batch-2026-java',
    batch_name: 'Java Full-Stack 2026 Elite',
    teacher_id: 'user-teacher-revanth',
    subject_id: 'sub-sql',
    title: 'Query Optimization & EXPLAIN ANALYZE',
    starts_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    ends_at: new Date(Date.now() - 86400000 * 2 + 5400000).toISOString(),
    planned_topics: [
      'Sequential Scans vs Index Scans',
      'Composite indexes order of columns',
      'Benchmarking 1M row dataset'
    ],
    preparation_checklist: [
      { id: 'c4', label: 'Seed 500k demo rows', checked: true },
      { id: 'c5', label: 'Prepare query plan breakdown slides', checked: true }
    ],
    status: 'completed',
    homework: 'Write an EXPLAIN ANALYZE report comparing query cost before and after composite B-Tree.',
    teacher_notes: 'Class engaged deeply with index scans. Alex asked about bitmap index scans.',
    class_log: {
      id: 'log-01',
      lesson_id: 'lesson-02',
      actual_topics_covered: ['Sequential Scans', 'Index Scans', 'Execution Plans'],
      topics_postponed: ['Partial Indexes (moved to Friday)'],
      homework_assigned: 'Complete exercises 3.1 through 3.4 in the SQL module.',
      student_questions: ['Why does PostgreSQL choose sequential scan on small tables even with an index?'],
      next_lesson_plan: 'Deep dive into Bitmap Index Scans and VACUUM analysis.',
      recorded_at: new Date(Date.now() - 86400000 * 2 + 7200000).toISOString()
    }
  }
];

export const SEED_LEARNING_RECORDS: LearningRecord[] = [
  { id: 'lr-1', user_id: 'user-teacher-revanth', chapter_id: 'chap-java-01', subject_id: 'sub-java', status: 'mastered', confidence: 5, updated_at: '2026-10-15T10:00:00Z' },
  { id: 'lr-2', user_id: 'user-teacher-revanth', chapter_id: 'chap-java-02', subject_id: 'sub-java', status: 'mastered', confidence: 5, updated_at: '2026-10-20T10:00:00Z' },
  { id: 'lr-3', user_id: 'user-teacher-revanth', chapter_id: 'chap-java-03', subject_id: 'sub-java', status: 'practiced', confidence: 4, updated_at: '2026-10-22T10:00:00Z' },
  { id: 'lr-4', user_id: 'user-teacher-revanth', chapter_id: 'chap-java-04', subject_id: 'sub-java', status: 'learning', confidence: 3, notes: 'Revise ForkJoinPool work-stealing algorithm internals.', updated_at: '2026-10-25T10:00:00Z' },
  { id: 'lr-5', user_id: 'user-teacher-revanth', chapter_id: 'chap-sql-01', subject_id: 'sub-sql', status: 'mastered', confidence: 5, updated_at: '2026-10-18T10:00:00Z' },
  { id: 'lr-6', user_id: 'user-teacher-revanth', chapter_id: 'chap-sql-02', subject_id: 'sub-sql', status: 'mastered', confidence: 5, updated_at: '2026-10-21T10:00:00Z' },
  { id: 'lr-7', user_id: 'user-teacher-revanth', chapter_id: 'chap-sql-03', subject_id: 'sub-sql', status: 'practiced', confidence: 4, updated_at: '2026-10-24T10:00:00Z' },
  { id: 'lr-8', user_id: 'user-teacher-revanth', chapter_id: 'chap-dsa-01', subject_id: 'sub-dsa', status: 'mastered', confidence: 5, updated_at: '2026-10-19T10:00:00Z' },
  { id: 'lr-9', user_id: 'user-teacher-revanth', chapter_id: 'chap-dsa-02', subject_id: 'sub-dsa', status: 'learning', confidence: 3, notes: 'Practice Morris Inorder traversal with O(1) space.', updated_at: '2026-10-25T15:00:00Z' }
];

export const SEED_REVISIONS: RevisionTask[] = [
  {
    id: 'rev-01',
    user_id: 'user-teacher-revanth',
    chapter_id: 'chap-java-04',
    subject_id: 'sub-java',
    title: 'Java Concurrency: ExecutorService vs Virtual Threads (Project Loom)',
    due_at: new Date(Date.now() + 86400000).toISOString(),
    interval_days: 3,
    priority: 'high',
    is_completed: false,
    reminder_notes: 'Verify memory footprint comparison under 100k concurrent requests.',
    created_at: new Date(Date.now() - 86400000 * 2).toISOString()
  },
  {
    id: 'rev-02',
    user_id: 'user-teacher-revanth',
    chapter_id: 'chap-dsa-02',
    subject_id: 'sub-dsa',
    title: 'Morris Traversal & Threaded Binary Trees',
    due_at: new Date(Date.now() - 3600000 * 4).toISOString(), // Overdue today
    interval_days: 7,
    priority: 'medium',
    is_completed: false,
    reminder_notes: 'Re-derive how right child pointers are temporarily threaded to avoid recursion stack.',
    created_at: new Date(Date.now() - 86400000 * 7).toISOString()
  },
  {
    id: 'rev-03',
    user_id: 'user-teacher-revanth',
    chapter_id: 'chap-sql-03',
    subject_id: 'sub-sql',
    title: 'B-Tree Node Splits and FILLFACTOR Optimization',
    due_at: new Date(Date.now() - 86400000 * 3).toISOString(),
    interval_days: 14,
    priority: 'low',
    is_completed: true,
    completed_at: new Date(Date.now() - 86400000 * 1).toISOString(),
    reminder_notes: 'Understood page split mechanics in PostgreSQL WAL logs.',
    created_at: new Date(Date.now() - 86400000 * 15).toISOString()
  }
];

export const SEED_QUESTIONS: Question[] = [
  {
    id: 'q-01',
    author_id: 'user-student-alex',
    author_name: 'Alex Chen',
    author_role: 'student',
    subject_id: 'sub-java',
    chapter_id: 'chap-java-02',
    title: 'Why doesn\'t method overriding work on static methods in Java?',
    body: 'I tried overriding a static helper method in a child class, but when I call it through a parent reference pointing to a child object, the parent version is always executed. Why does Java behave this way?',
    code_snippet: 'class Parent {\n    static void print() { System.out.println("Parent"); }\n}\nclass Child extends Parent {\n    static void print() { System.out.println("Child"); }\n}\n\nParent p = new Child();\np.print(); // prints Parent!',
    tags: ['java', 'oop', 'static', 'method-hiding'],
    status: 'answered',
    answers_count: 1,
    has_accepted_answer: true,
    created_at: '2026-10-23T14:10:00Z'
  },
  {
    id: 'q-02',
    author_id: 'user-student-alex',
    author_name: 'Alex Chen',
    author_role: 'student',
    subject_id: 'sub-sql',
    chapter_id: 'chap-sql-03',
    title: 'When does the Postgres query optimizer ignore a B-Tree index?',
    body: 'I created an index on a status column (`is_active boolean`), but `EXPLAIN` still reports `Seq Scan on users`. Is there a threshold percentage of rows that triggers full table scan?',
    tags: ['sql', 'postgres', 'indexing', 'query-planner'],
    status: 'open',
    answers_count: 0,
    has_accepted_answer: false,
    created_at: '2026-10-25T11:20:00Z'
  }
];

export const SEED_ANSWERS: Answer[] = [
  {
    id: 'ans-01',
    question_id: 'q-01',
    author_id: 'user-teacher-revanth',
    author_name: 'Revanth (Instructor)',
    author_role: 'teacher',
    body: 'Great question Alex! In Java, `static` methods belong to the class definition rather than the individual object instance on the heap. Because of this, static method binding occurs at compile time (Static/Early Binding) based on the reference type of the variable (`Parent`), rather than runtime dynamic dispatch via the object\'s vtable. What you observed is called **Method Hiding**, not Method Overriding.',
    is_accepted: true,
    created_at: '2026-10-23T16:45:00Z'
  }
];

export const SEED_ASSIGNMENTS: Assignment[] = [
  {
    id: 'asg-01',
    batch_id: 'batch-2026-java',
    teacher_id: 'user-teacher-revanth',
    subject_id: 'sub-java',
    title: 'Assignment 1: Enterprise Payment Gateway Hierarchy',
    description: 'Design a clean OOP architecture with an abstract `PaymentProcessor` and concrete implementations for `CreditCardProcessor` and `CryptoProcessor`. Handle validation, transaction id generation, and idempotency checks.',
    due_at: new Date(Date.now() + 86400000 * 4).toISOString(),
    max_score: 100,
    created_at: '2026-10-20T10:00:00Z'
  }
];

export const SEED_SUBMISSIONS: Submission[] = [
  {
    id: 'subm-01',
    assignment_id: 'asg-01',
    assignment_title: 'Assignment 1: Enterprise Payment Gateway Hierarchy',
    student_id: 'user-student-alex',
    student_name: 'Alex Chen',
    content: 'Completed the abstract payment gateway with retry policy and mock SHA256 idempotency key validator.',
    code_solution: 'public abstract class PaymentProcessor {\n    private final String processorName;\n    // implementation details\n}',
    score: 95,
    feedback: 'Excellent separation of concerns! The exception handling for network timeouts is very realistic. Just remember to make the idempotency store thread-safe.',
    status: 'graded',
    submitted_at: '2026-10-24T18:20:00Z',
    graded_at: '2026-10-25T10:15:00Z'
  }
];

export const SEED_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif-1',
    user_id: 'user-teacher-revanth',
    type: 'question',
    title: 'New Student Question',
    message: 'Alex Chen asked: "When does the Postgres query optimizer ignore a B-Tree index?"',
    link: '/question-bank',
    created_at: new Date(Date.now() - 3600000 * 2).toISOString()
  },
  {
    id: 'notif-2',
    user_id: 'user-teacher-revanth',
    type: 'revision',
    title: 'Revision Due Today',
    message: 'Morris Traversal & Threaded Binary Trees is due for revision.',
    link: '/revisions',
    created_at: new Date(Date.now() - 3600000 * 5).toISOString()
  }
];
