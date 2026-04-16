import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { AuthProvider } from './context/AuthProvider';
import { ExercisesView } from './features/exercises/ui/ExercisesView';
import OnboardingView from './features/onboarding/ui/OnboardingView';
import { ProfileView } from './features/profile/ui/ProfileView';
import { Landing } from './features/user/ui/components/landing/Landing';
import { Login } from './features/user/ui/components/Login';
import { ProtectedRoute } from './routes/ProtectedRoute';

const Dashboard = () => <h1>Dashboard</h1>;

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
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<ProfileView />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};
