import { useSyncExternalStore } from 'react';
import { appStore } from '@/lib/supabase/store';

export function useAppStore() {
  const store = useSyncExternalStore(
    (callback) => appStore.subscribe(callback),
    () => appStore,
    () => appStore
  );

  const currentUser = store.getCurrentUser();
  const isTeacher = currentUser.role === 'teacher';
  const isStudent = currentUser.role === 'student';

  return {
    store,
    currentUser,
    isTeacher,
    isStudent,
    switchUser: (id: string) => store.switchUser(id),
    setRole: (role: 'teacher' | 'student') => store.setRole(role),
    resetToDefaults: () => store.resetToDefaults()
  };
}
