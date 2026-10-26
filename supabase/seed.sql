-- ====================================================================
-- Knowly-Yo — Production Seed SQL
-- ====================================================================

-- Insert Sample Subjects
INSERT INTO public.subjects (id, owner_id, name, description, icon, color) VALUES
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '00000000-0000-0000-0000-000000000001', 'Java & Object-Oriented Programming', 'Core Java, OOP principles, Collections Framework, Multithreading, and JVM internals.', 'Coffee', '#f59e0b'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', '00000000-0000-0000-0000-000000000001', 'SQL & Database Systems', 'Relational design, complex queries, indexing strategies, ACID transactions, and normalization.', 'Database', '#0ea5e9'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', '00000000-0000-0000-0000-000000000001', 'Data Structures & Algorithms', 'Arrays, Two Pointers, Trees, Graphs, Dynamic Programming, and Time Complexity.', 'Binary', '#10b981')
ON CONFLICT (id) DO NOTHING;

-- Insert Sample Chapters
INSERT INTO public.chapters (id, subject_id, title, sort_order) VALUES
('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b11', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '01. Java Basics & Memory Model', 1),
('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b12', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '02. OOP Principles & Dynamic Dispatch', 2),
('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b13', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', '01. Relational Schema Design & DDL', 1),
('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b14', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', '02. Joins & Aggregations', 2)
ON CONFLICT (id) DO NOTHING;
