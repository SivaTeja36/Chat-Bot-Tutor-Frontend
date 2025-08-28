import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { AuthProvider } from './contexts/AuthContext';
import { useAuth } from './hooks/useAuth';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import theme from './theme/theme';

// Layout
import MainLayout from './components/Layout/MainLayout';

// Pages
import EmailVerification from './pages/EmailVerification/EmailVerification';
import Registration from './pages/Registration/Registration';
import ConfirmRegistration from './pages/Registration/ConfirmRegistration';
import Login from './pages/Login/Login';
import ForgotPassword from './pages/ForgotPassword/ForgotPassword';
import SetPassword from './pages/SetPassword/SetPassword';

import Dashboard from './pages/Dashboard/Dashboard';
import KidsPage from './pages/Kids/KidsPage';
import ProfilePage from './pages/Profile/ProfilePage';
import RestrictionsPage from './pages/Restrictions/RestrictionsPage';

// Handover related routes and wrappers
import HandoverLayout from './pages/Kids/Handover/HandoverLayout';
import ChatPageWrapper from './pages/Kids/Handover/ChatPageWrapper';
import QuizPageWrapper from './pages/Kids/Handover/QuizPageWrapper';

// Auth wrappers
const queryClient = new QueryClient();

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoading } = useAuth();
  if (isLoading) return <div>Loading...</div>;
  return user ? <MainLayout>{children}</MainLayout> : <Navigate to="/login" replace />;
};

// No need to wrap HandoverLayout in HandoverRoute, protect the route, NOT the layout!
// HandoverRoute simply confirms auth and renders its children via <Outlet />
const HandoverRoute: React.FC = () => {
  const { user, isLoading } = useAuth();
  if (isLoading) return <div>Loading...</div>;
  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <Router>
            <Routes>
              {/* Public */}
              <Route path="/" element={<EmailVerification />} />
              <Route path="/registration" element={<Registration />} />
              <Route path="/confirm-registration" element={<ConfirmRegistration />} />
              <Route path="/login" element={<Login />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/set-password" element={<SetPassword />} />

              {/* Protected */}
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/kids" element={<ProtectedRoute><KidsPage /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
              <Route path="/restrictions" element={<ProtectedRoute><RestrictionsPage /></ProtectedRoute>} />

              {/* Nested handover routes, with auth protection */}
              <Route path="/handover/:kidId" element={<HandoverRoute />}>
                <Route element={<HandoverLayout />}>
                  <Route index element={<Navigate to="chat" replace />} />
                  <Route path="chat" element={<ChatPageWrapper />} />
                  <Route path="quiz" element={<QuizPageWrapper />} />
                </Route>
              </Route>

              {/* Catch-all */}
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </Router>
        </AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
