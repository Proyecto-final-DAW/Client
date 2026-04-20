import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { AuthProvider } from './context/AuthProvider';
import { ExercisesView } from './features/exercises/ui/ExercisesView';
import OnboardingView from './features/onboarding/ui/OnboardingView';
import { ProfileView } from './features/profile/ui/ProfileView';
import { RoutinesView } from './features/routines/ui/components/RoutinesView';
import { Landing } from './features/user/ui/components/landing/Landing';
import { Login } from './features/user/ui/components/Login';
import { DashboardLayout } from './layouts/DashboardLayout';
import { ProtectedRoute } from './routes/ProtectedRoute';

const Dashboard = () => <h1>Dashboard</h1>;
const Progreso = () => <h1>Progreso</h1>;
const Dieta = () => <h1>Dieta</h1>;
const Perfil = () => <h1>Perfil</h1>;

export const App = (): React.JSX.Element => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />

          <Route path="/login" element={<Login />} />
          <Route path="/exercises" element={<ExercisesView />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/onboarding" element={<OnboardingView />} />
            <Route element={<DashboardLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/Rutinas" element={<RoutinesView />} />
              <Route path="/Progreso" element={<Progreso />} />
              <Route path="/Dieta" element={<Dieta />} />
              <Route path="/Perfil" element={<Perfil />} />
            </Route>

            <Route path="/profile" element={<ProfileView />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};
