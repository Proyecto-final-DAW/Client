import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { AuthProvider } from './context/AuthProvider';
import { Dashboard } from './features/dashboard/Dashboard';
import { ExercisesView } from './features/exercises/ui/ExercisesView';
import OnboardingView from './features/onboarding/ui/OnboardingView';
import { Landing } from './features/user/ui/components/landing/Landing';
import { Login } from './features/user/ui/components/Login';
import { ProtectedRoute } from './routes/ProtectedRoute';

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
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};
