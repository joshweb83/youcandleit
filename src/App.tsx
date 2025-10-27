/**
 * 메인 App 컴포넌트
 *
 * React Router를 사용하여 페이지 라우팅을 설정합니다.
 */

import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { MainLayout } from './components/layout/MainLayout'
import { MapPage } from './pages/MapPage'
import { EventListPage } from './pages/EventListPage'
import { LivePage } from './pages/LivePage'
import { CommunityPage } from './pages/CommunityPage'
import { MyPage } from './pages/MyPage'

function App() {
  return (
    <BrowserRouter>
      <MainLayout>
        <Routes>
          <Route path="/" element={<MapPage />} />
          <Route path="/events" element={<EventListPage />} />
          <Route path="/live" element={<LivePage />} />
          <Route path="/community" element={<CommunityPage />} />
          <Route path="/my" element={<MyPage />} />
        </Routes>
      </MainLayout>
    </BrowserRouter>
  )
}

export default App
