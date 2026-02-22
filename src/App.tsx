import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { AuthProvider } from './context/AuthProvider';
import OnboardingView from './features/onboarding/ui/OnboardingView';
import { Login } from './features/user/ui/components/Login';
import { ProtectedRoute } from './routes/ProtectedRoute';

const Landing = () => <h1>Landing Page</h1>;
const Dashboard = () => <h1>Dashboard</h1>;

export const App = (): React.JSX.Element => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/onboarding" element={<OnboardingView />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};
