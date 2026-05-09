import { lazy, Suspense } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import { AuthProvider } from './context/AuthProvider';
import { CharacterProvider } from './context/CharacterProvider';
import { DashboardLayout } from './layouts/DashboardLayout';
import { ProtectedRoute } from './routes/ProtectedRoute';
import { ErrorBoundary } from './shared/components/ErrorBoundary';
import { LoadingPixel } from './shared/components/LoadingPixel';

// Every route is code-split. Each `lazy(import(...))` becomes its own
// chunk that's only fetched when the user navigates to that path.
// Before this, the initial page load pulled in Landing + Login +
// Register + Dashboard + every protected view at once — heavy bundles
// like the workout flow (which the user only needs after onboarding)
// were blocking first paint for everyone.
//
// The `.then(m => ({ default: m.X }))` adapters are because the views
// are exported as named exports, not default exports. Cheaper to wrap
// here than to touch every file.
const Landing = lazy(() =>
  import('./features/user/ui/components/landing/Landing').then((m) => ({
    default: m.Landing,
  }))
);
const Login = lazy(() =>
  import('./features/user/ui/components/Login').then((m) => ({
    default: m.Login,
  }))
);
const Register = lazy(() =>
  import('./features/user/ui/components/Register').then((m) => ({
    default: m.Register,
  }))
);
const OnboardingView = lazy(() =>
  import('./features/onboarding/ui/OnboardingView').then((m) => ({
    default: m.OnboardingView,
  }))
);
const LiveWorkoutView = lazy(() =>
  import('./features/workout/ui/LiveWorkoutView').then((m) => ({
    default: m.LiveWorkoutView,
  }))
);
const Dashboard = lazy(() =>
  import('./features/dashboard/ui/DashboardView').then((m) => ({
    default: m.Dashboard,
  }))
);
const ProgressView = lazy(() =>
  import('./features/progress/ui/ProgressView').then((m) => ({
    default: m.ProgressView,
  }))
);
const RoutinesView = lazy(() =>
  import('./features/routines/ui/RoutinesView').then((m) => ({
    default: m.RoutinesView,
  }))
);
const ExercisesView = lazy(() =>
  import('./features/exercises/ui/ExercisesView').then((m) => ({
    default: m.ExercisesView,
  }))
);
const DietView = lazy(() =>
  import('./features/diet/ui/DietView').then((m) => ({
    default: m.DietView,
  }))
);
const AchievementsView = lazy(() =>
  import('./features/achievements/ui/AchievementsView').then((m) => ({
    default: m.AchievementsView,
  }))
);
const ClassTreeView = lazy(() =>
  import('./features/character/ui/ClassTreeView').then((m) => ({
    default: m.ClassTreeView,
  }))
);
const TemplatesView = lazy(() =>
  import('./features/templates/ui/TemplatesView').then((m) => ({
    default: m.TemplatesView,
  }))
);
const TemplateDetailView = lazy(() =>
  import('./features/templates/ui/TemplateDetailView').then((m) => ({
    default: m.TemplateDetailView,
  }))
);
const SessionHistoryView = lazy(() =>
  import('./features/sessionHistory/ui/SessionHistoryView').then((m) => ({
    default: m.SessionHistoryView,
  }))
);
const ProfileView = lazy(() =>
  import('./features/profile/ui/ProfileView').then((m) => ({
    default: m.ProfileView,
  }))
);

export const App = (): React.JSX.Element => {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <CharacterProvider>
          <BrowserRouter>
            <Suspense fallback={<LoadingPixel />}>
              <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route element={<ProtectedRoute />}>
                  <Route path="/onboarding" element={<OnboardingView />} />
                  <Route
                    path="/workout/:routineId"
                    element={<LiveWorkoutView />}
                  />
                  <Route element={<DashboardLayout />}>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/progress" element={<ProgressView />} />
                    <Route path="/routines" element={<RoutinesView />} />
                    <Route path="/exercises" element={<ExercisesView />} />
                    <Route path="/diet" element={<DietView />} />
                    <Route
                      path="/achievements"
                      element={<AchievementsView />}
                    />
                    <Route path="/clases" element={<ClassTreeView />} />
                    <Route path="/templates" element={<TemplatesView />} />
                    <Route
                      path="/templates/:id"
                      element={<TemplateDetailView />}
                    />
                    <Route
                      path="/session-history"
                      element={<SessionHistoryView />}
                    />
                    <Route path="/profile" element={<ProfileView />} />
                  </Route>
                </Route>
                {/* Catch-all: any unknown path bounces to landing.
                    Prevents the previous "blank Suspense fallback
                    forever" silent failure when a typo URL hits the
                    SPA — feels like the app is broken, when really
                    no route matched. */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </CharacterProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
};
