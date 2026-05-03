import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { AuthProvider } from './context/AuthProvider';
import { AchievementsView } from './features/achievements/ui/AchievementsView';
import { Dashboard } from './features/dashboard/ui/DashboardView';
import { DietView } from './features/diet/ui/DietView';
import { ExercisesView } from './features/exercises/ui/ExercisesView';
import { OnboardingView } from './features/onboarding/ui/OnboardingView';
import { ProfileView } from './features/profile/ui/ProfileView';
import { ProgressView } from './features/progress/ui/ProgressView';
import { RoutinesView } from './features/routines/ui/RoutinesView';
import { SessionHistoryView } from './features/sessionHistory/ui/SessionHistoryView';
import { NewSessionView } from './features/sessions/ui/NewSessionView';
import { TemplateDetailView } from './features/templates/ui/TemplateDetailView';
import { TemplatesView } from './features/templates/ui/TemplatesView';
import { Landing } from './features/user/ui/components/landing/Landing';
import { Login } from './features/user/ui/components/Login';
import { Register } from './features/user/ui/components/Register';
import { LiveWorkoutView } from './features/workout/ui/LiveWorkoutView';
import { DashboardLayout } from './layouts/DashboardLayout';
import { ProtectedRoute } from './routes/ProtectedRoute';

export const App = (): React.JSX.Element => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/onboarding" element={<OnboardingView />} />
            <Route path="/workout/:routineId" element={<LiveWorkoutView />} />
            <Route element={<DashboardLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/progress" element={<ProgressView />} />
              <Route path="/routines" element={<RoutinesView />} />
              <Route path="/exercises" element={<ExercisesView />} />
              <Route path="/diet" element={<DietView />} />
              <Route path="/sessions/new" element={<NewSessionView />} />
              <Route path="/achievements" element={<AchievementsView />} />
              <Route path="/templates" element={<TemplatesView />} />
              <Route path="/templates/:id" element={<TemplateDetailView />} />
              <Route path="/session-history" element={<SessionHistoryView />} />
              <Route path="/profile" element={<ProfileView />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};
