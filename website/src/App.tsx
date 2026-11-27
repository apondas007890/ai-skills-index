import { lazy, Suspense } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout';
import { HomePage } from './pages/HomePage';

const ExplorePage = lazy(() => import('./pages/ExplorePage').then((m) => ({ default: m.ExplorePage })));
const CategoryPage = lazy(() => import('./pages/CategoryPage').then((m) => ({ default: m.CategoryPage })));
const SkillDetailPage = lazy(() => import('./pages/SkillDetailPage').then((m) => ({ default: m.SkillDetailPage })));
const SubmitSkillPage = lazy(() => import('./pages/SubmitSkillPage').then((m) => ({ default: m.SubmitSkillPage })));

export default function App() {
  const rawBase = import.meta.env.BASE_URL || '/';
  const basename = rawBase.endsWith('/') && rawBase.length > 1 ? rawBase.slice(0, -1) : rawBase;

  return (
    <BrowserRouter basename={basename}>
      <Layout>
        <Suspense
          fallback={
            <div className="py-12 text-center text-sm text-zinc-500 dark:text-zinc-400">
              Loading…
            </div>
          }
        >
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/explore" element={<ExplorePage />} />
            <Route path="/submit" element={<SubmitSkillPage />} />
            <Route path="/category/:categoryId" element={<CategoryPage />} />
            <Route path="/skill/:skillId" element={<SkillDetailPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </Layout>
    </BrowserRouter>
  );
}
