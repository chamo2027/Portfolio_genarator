import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import CreatePortfolioPage from './pages/CreatePortfolioPage';
import PreviewPage from './pages/PreviewPage';
import PublicPortfolioPage from './pages/PublicPortfolioPage';
import EditPortfolioPage from './pages/EditPortfolioPage';
import ExplorePage from './pages/ExplorePage';
import NotFoundPage from './pages/NotFoundPage';
import { ToastProvider } from './components/Toast';

const AppLayout = () => {
  const location = useLocation();

  // Hide the global DevFolio navbar/footer on standalone public portfolio page
  const isStandalonePublicPortfolio =
    location.pathname.startsWith('/portfolio/') &&
    !location.pathname.includes('/preview');

  return (
    <div className="app-root" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {!isStandalonePublicPortfolio && <Navbar />}

      <main style={{ flexGrow: 1 }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/explore" element={<ExplorePage />} />
          <Route path="/create" element={<CreatePortfolioPage />} />
          <Route path="/preview" element={<PreviewPage />} />
          <Route path="/portfolio/:username" element={<PublicPortfolioPage />} />
          <Route path="/edit/:username" element={<EditPortfolioPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>

      {!isStandalonePublicPortfolio && <Footer />}
    </div>
  );
};

function App() {
  return (
    <ToastProvider>
      <AppLayout />
    </ToastProvider>
  );
}

export default App;
