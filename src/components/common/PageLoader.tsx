/**
 * 로딩 컴포넌트
 *
 * 페이지 로딩 중 표시되는 fallback 컴포넌트
 */

export function PageLoader() {
  return (
    <div className="h-screen flex items-center justify-center bg-gray-900">
      <div className="text-center">
        <div className="text-6xl mb-4 animate-pulse">🕯️</div>
        <p className="text-gray-400">로딩 중...</p>
      </div>
    </div>
  )
}
