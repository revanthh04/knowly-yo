import { createBrowserRouter, Navigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { DashboardPage } from '@/features/dashboard/DashboardPage';
import { KnowledgePage } from '@/features/subjects/KnowledgePage';
import { NoteEditorPage } from '@/features/notes/NoteEditorPage';
import { LearningTrackerPage } from '@/features/learning/LearningTrackerPage';
import { RevisionCenterPage } from '@/features/revisions/RevisionCenterPage';
import { TeachingPlannerPage } from '@/features/teaching/TeachingPlannerPage';
import { BatchesPage } from '@/features/batches/BatchesPage';
import { QuestionBankPage } from '@/features/questions/QuestionBankPage';
import { AssignmentsPage } from '@/features/assignments/AssignmentsPage';
import { StudentAssignmentsPage } from '@/features/assignments/StudentAssignmentsPage';
import { AIAssistantPage } from '@/features/ai/AIAssistantPage';
import { SettingsPage } from '@/features/settings/SettingsPage';
import { NotFoundPage } from '@/features/common/NotFoundPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      { path: 'dashboard', element: <DashboardPage /> },
      { path: 'knowledge', element: <KnowledgePage /> },
      { path: 'notes/:id', element: <NoteEditorPage /> },
      { path: 'learning', element: <LearningTrackerPage /> },
      { path: 'revisions', element: <RevisionCenterPage /> },
      { path: 'planner', element: <TeachingPlannerPage /> },
      { path: 'batches', element: <BatchesPage /> },
      { path: 'question-bank', element: <QuestionBankPage /> },
      { path: 'assignments', element: <AssignmentsPage /> },
      { path: 'my-assignments', element: <StudentAssignmentsPage /> },
      { path: 'ai-assistant', element: <AIAssistantPage /> },
      { path: 'settings', element: <SettingsPage /> },
      { path: '*', element: <NotFoundPage /> }
    ]
  }
]);
