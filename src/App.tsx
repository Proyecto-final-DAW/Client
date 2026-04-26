import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { AuthProvider } from './context/AuthProvider';
import { Dashboard } from './features/dashboard/ui/DashboardView';
import { DietView } from './features/diet/ui/DietView';
import { ExercisesView } from './features/exercises/ui/ExercisesView';
import { OnboardingView } from './features/onboarding/ui/OnboardingView';
import { ProfileView } from './features/profile/ui/ProfileView';
import { RoutinesView } from './features/routines/ui/RoutinesView';
import { SessionHistoryView } from './features/sessionHistory/ui/SessionHistoryView';
import { Landing } from './features/user/ui/components/landing/Landing';
import { Login } from './features/user/ui/components/Login';
import { Register } from './features/user/ui/components/Register';
import { DashboardLayout } from './layouts/DashboardLayout';
import { ProtectedRoute } from './routes/ProtectedRoute';

const Progreso = () => <h1>Progreso</h1>;
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

              <Route path="/routines" element={<RoutinesView />} />
              <Route path="/progress" element={<Progreso />} />
              <Route path="/my-profile" element={<Perfil />} />
              <Route path="/session-history" element={<SessionHistoryView />} />
              <Route path="/diet" element={<DietView />} />
            </Route>

            <Route path="/profile" element={<ProfileView />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};
