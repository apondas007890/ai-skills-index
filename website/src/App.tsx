import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout';
import { HomePage } from './pages/HomePage';
import { ExplorePage } from './pages/ExplorePage';
import { CategoryPage } from './pages/CategoryPage';
import { SkillDetailPage } from './pages/SkillDetailPage';
import { SubmitSkillPage } from './pages/SubmitSkillPage';

export default function App() {
  const rawBase = import.meta.env.BASE_URL || '/';
  const basename = rawBase.endsWith('/') && rawBase.length > 1 ? rawBase.slice(0, -1) : rawBase;

  return (
    <BrowserRouter basename={basename}>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/explore" element={<ExplorePage />} />
          <Route path="/submit" element={<SubmitSkillPage />} />
          <Route path="/category/:categoryId" element={<CategoryPage />} />
          <Route path="/skill/:skillId" element={<SkillDetailPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
