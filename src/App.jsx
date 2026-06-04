import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Layout from './components/Layout';
import DiscoverPage from './pages/DiscoverPage';
import CommunityPage from './pages/CommunityPage';
import SearchPage from './pages/SearchPage';
import SavedPage from './pages/SavedPage';
import ArtistProfilePage from './pages/ArtistProfilePage';

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <Layout>
          <Routes>
            <Route path="/"          element={<DiscoverPage />} />
            <Route path="/community" element={<CommunityPage />} />
            <Route path="/search"    element={<SearchPage />} />
            <Route path="/saved"     element={<SavedPage />} />
            <Route path="/artist"    element={<ArtistProfilePage />} />
            <Route path="*"          element={<DiscoverPage />} />
          </Routes>
        </Layout>
      </AppProvider>
    </BrowserRouter>
  );
}
