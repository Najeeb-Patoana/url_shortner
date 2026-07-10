import { Routes, Route } from 'react-router-dom';

// Layouts
import MainLayout from '../layouts/MainLayout.jsx';

// Pages
import Landing from '../pages/Landing.jsx';
import Dashboard from '../pages/Dashboard.jsx';
import Analytics from '../pages/Analytics.jsx';
import NotFound, { ExpiredLink, DisabledLink } from '../pages/errors/ErrorPages.jsx';

const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/"            element={<Landing />} />
        <Route path="/dashboard"   element={<Dashboard />} />
        <Route path="/analytics/:id" element={<Analytics />} />
        <Route path="/not-found"   element={<NotFound />} />
        <Route path="/expired"     element={<ExpiredLink />} />
        <Route path="/disabled"    element={<DisabledLink />} />
        <Route path="*"            element={<NotFound />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
