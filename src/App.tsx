import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { AuthProvider } from './context/AuthProvider';
import { AchievementsView } from './features/achievements/ui/AchievementsView';
import { Dashboard } from './features/dashboard/ui/DashboardView';
import { ExercisesView } from './features/exercises/ui/ExercisesView';
import { OnboardingView } from './features/onboarding/ui/OnboardingView';
import { ProfileView } from './features/profile/ui/ProfileView';
import { ProgressView } from './features/progress/ui/ProgressView';
import { RoutinesView } from './features/routines/ui/RoutinesView';
import { SessionHistoryView } from './features/sessionHistory/ui/SessionHistoryView';
import { Landing } from './features/user/ui/components/landing/Landing';
import { Login } from './features/user/ui/components/Login';
import { Register } from './features/user/ui/components/Register';
import { DashboardLayout } from './layouts/DashboardLayout';
import { ProtectedRoute } from './routes/ProtectedRoute';

const Dieta = () => <h1>Dieta</h1>;
const Perfil = () => <h1>Perfil</h1>;

export const App = (): React.JSX.Element => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/exercises" element={<ExercisesView />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/onboarding" element={<OnboardingView />} />
            <Route element={<DashboardLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/progress" element={<ProgressView />} />
              <Route path="/routines" element={<RoutinesView />} />
              <Route path="/diet" element={<Dieta />} />
              <Route path="/achievements" element={<AchievementsView />} />
              <Route path="/my-profile" element={<Perfil />} />
              <Route path="/session-history" element={<SessionHistoryView />} />
            </Route>

            <Route path="/profile" element={<ProfileView />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};
