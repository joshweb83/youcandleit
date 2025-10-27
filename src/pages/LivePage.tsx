/**
 * 실시간 방송 페이지
 *
 * 실시간 스트리밍이 있는 집회만 표시합니다.
 * TODO: YouTube Live 임베드
 */

import { useTranslation } from 'react-i18next'

export function LivePage() {
  const { t } = useTranslation()

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold mb-6">{t('nav.live')}</h1>

      {/* 빈 상태 */}
      <div className="text-center py-12">
        <div className="text-6xl mb-4">📺</div>
        <p className="text-gray-400">현재 실시간 방송 중인 집회가 없습니다</p>
        <p className="text-sm text-gray-500 mt-2">
          집회 주최자가 실시간 스트리밍을 시작하면 여기에 표시됩니다
        </p>
      </div>
    </div>
  )
}
