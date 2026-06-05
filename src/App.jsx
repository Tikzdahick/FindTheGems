import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import Layout from './components/Layout';
import AuthScreen from './components/AuthScreen';
import Onboarding from './components/Onboarding';
import DiscoverPage from './pages/DiscoverPage';
import CommunityPage from './pages/CommunityPage';
import SearchPage from './pages/SearchPage';
import SavedPage from './pages/SavedPage';
import ProfilePage from './pages/ProfilePage';
import ArtistProfilePage from './pages/ArtistProfilePage';

function AppContent() {
  const { user, onboarded } = useApp();

  if (!user)      return <AuthScreen />;
  if (!onboarded) return <Onboarding />;

  return (
    <Layout>
      <Routes>
        <Route path="/"          element={<DiscoverPage />} />
        <Route path="/community" element={<CommunityPage />} />
        <Route path="/search"    element={<SearchPage />} />
        <Route path="/saved"     element={<SavedPage />} />
        <Route path="/profile"   element={<ProfilePage />} />
        <Route path="/artist"    element={<ArtistProfilePage />} />
        <Route path="*"          element={<DiscoverPage />} />
      </Routes>
    </Layout>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </BrowserRouter>
  );
}
