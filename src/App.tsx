import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { AuthProvider } from './contexts/AuthContext';
import { useAuth } from './hooks/useAuth';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import theme from './theme/theme';

// Layout
import MainLayout from './components/Layout/MainLayout';

// Pages (existing, kept)
import EmailVerification from './pages/EmailVerification/EmailVerification';
import Registration from './pages/Registration/Registration';
import ConfirmRegistration from './pages/Registration/ConfirmRegistration';
import Login from './pages/Login/Login';
import ForgotPassword from './pages/ForgotPassword/ForgotPassword';
import SetPassword from './pages/SetPassword/SetPassword';

// New/Re-created Pages
import Dashboard from './pages/Dashboard/Dashboard';
import KidsPage from './pages/Kids/KidsPage';
import ProfilePage from './pages/Profile/ProfilePage';
import QuizPage from './pages/Kids/QuizPage/QuizPage';

const queryClient = new QueryClient();

// Using theme from theme.ts

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return user ? <MainLayout>{children}</MainLayout> : <Navigate to="/login" replace />;
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <Router>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<EmailVerification />} />
              <Route path="/registration" element={<Registration />} />
              <Route path="/confirm-registration" element={<ConfirmRegistration />} />
              <Route path="/login" element={<Login />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/set-password" element={<SetPassword />} />

              {/* Protected Routes */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/kids"
                element={
                  <ProtectedRoute>
                    <KidsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/kids/quiz"
                element={
                  <ProtectedRoute>
                    <QuizPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                }
              />

              {/* Redirect any unknown routes to login */}
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </Router>
        </AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
