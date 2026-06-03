import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '@store/store';
import AuthForm from '@components/AuthForm/AuthForm';
import UserProfile from '@components/UserProfile/UserProfile';
import ArticlesPage from '@components/ArticlesPage/ArticlesPage';
import ArticlePage from '@components/ArticlePage/ArticlePage';
import AdminPanel from '@components/AdminPanel/AdminPanel';
import Layout from '@components/Layout/Layout';

/* ─── Protected Route Wrapper ─── */
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

/* ─── Auth Route Wrapper ─── */
const AuthRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  if (isAuthenticated) {
    return <Navigate to="/profile" replace />;
  }

  return <>{children}</>;
};

/* ─── App ─── */
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={
            <AuthRoute>
              <AuthForm />
            </AuthRoute>
          }
        />
        <Route
          path="/register"
          element={
            <AuthRoute>
              <AuthForm />
            </AuthRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Layout>
                <UserProfile />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/articles"
          element={
            <ProtectedRoute>
              <Layout>
                <ArticlesPage />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/articles/:id"
          element={
            <ProtectedRoute>
              <Layout>
                <ArticlePage />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <Layout>
                <AdminPanel />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
