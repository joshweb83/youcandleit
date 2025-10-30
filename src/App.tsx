/**
 * 메인 App 컴포넌트
 *
 * React Router를 사용하여 페이지 라우팅을 설정합니다.
 * React.lazy를 사용하여 코드 스플리팅을 구현합니다.
 */

import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { MainLayout } from './components/layout/MainLayout'
import { PageLoader } from './components/common/PageLoader'

// 코드 스플리팅: 각 페이지를 lazy load
const MapPage = lazy(() => import('./pages/MapPage').then(m => ({ default: m.MapPage })))
const EventListPage = lazy(() => import('./pages/EventListPage').then(m => ({ default: m.EventListPage })))
const EventDetailPage = lazy(() => import('./pages/EventDetailPage').then(m => ({ default: m.EventDetailPage })))
const AdminEventCreatePage = lazy(() => import('./pages/AdminEventCreatePage').then(m => ({ default: m.AdminEventCreatePage })))
const LivePage = lazy(() => import('./pages/LivePage').then(m => ({ default: m.LivePage })))
const CommunityPage = lazy(() => import('./pages/CommunityPage').then(m => ({ default: m.CommunityPage })))
const MyPage = lazy(() => import('./pages/MyPage').then(m => ({ default: m.MyPage })))
const DevToolsPage = lazy(() => import('./pages/DevToolsPage').then(m => ({ default: m.DevToolsPage })))

function App() {
  return (
    <BrowserRouter>
      <MainLayout>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<MapPage />} />
            <Route path="/events" element={<EventListPage />} />
            <Route path="/events/:id" element={<EventDetailPage />} />
            <Route path="/admin/events/create" element={<AdminEventCreatePage />} />
            <Route path="/live" element={<LivePage />} />
            <Route path="/community" element={<CommunityPage />} />
            <Route path="/my" element={<MyPage />} />
            <Route path="/dev-tools" element={<DevToolsPage />} />
          </Routes>
        </Suspense>
      </MainLayout>
    </BrowserRouter>
  )
}

export default App
