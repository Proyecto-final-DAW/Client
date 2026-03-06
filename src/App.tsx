import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { AuthProvider } from './context/AuthProvider';
import { Landing } from './features/user/ui/components/landing/Landing';
import { Login } from './features/user/ui/components/Login';
import { ProtectedRoute } from './routes/ProtectedRoute';

// Páginas temporales
const Dashboard = () => <h1>Dashboard</h1>;

export const App = (): React.JSX.Element => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};
