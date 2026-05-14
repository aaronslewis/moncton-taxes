import { Outlet, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Layout from './components/Layout.jsx';
import Home from './pages/Home.jsx';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function AppLayout() {
  return (
    <Layout>
      <ScrollToTop />
      <Outlet />
    </Layout>
  );
}

function NotFound() {
  return (
    <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
      <h1>Page Not Found</h1>
      <p style={{ marginTop: '1rem', color: 'var(--colour-grey-600)' }}>
        The page you're looking for doesn't exist.
      </p>
      <a href="/" className="btn btn-primary" style={{ marginTop: '1.5rem', display: 'inline-flex' }}>
        Back to Home
      </a>
    </div>
  );
}

export const routes = [
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'methodology', lazy: async () => ({ Component: (await import('./pages/Methodology.jsx')).default }) },
      { path: 'about',       lazy: async () => ({ Component: (await import('./pages/About.jsx')).default }) },
      { path: 'voices',      lazy: async () => ({ Component: (await import('./pages/Voices.jsx')).default }) },
      { path: '*',           element: <NotFound /> },
    ],
  },
];
