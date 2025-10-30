/**
 * 개발자 도구 페이지
 *
 * 샘플 데이터를 쉽게 추가하고 테스트할 수 있는 개발 전용 페이지
 */

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Database, MapPin, MessageSquare, Flame } from 'lucide-react'
import { addAllSampleDataToFirebase } from '../scripts/addSampleDataToFirebase'

export function DevToolsPage() {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState<'success' | 'error' | 'info'>('info')

  const showMessage = (text: string, type: 'success' | 'error' | 'info') => {
    setMessage(text)
    setMessageType(type)
    setTimeout(() => setMessage(''), 5000)
  }

  const handleAddSampleData = async () => {
    setIsLoading(true)
    showMessage('샘플 데이터 추가 중...', 'info')

    try {
      await addAllSampleDataToFirebase()
      showMessage('✅ 샘플 데이터가 성공적으로 추가되었습니다!', 'success')
    } catch (error) {
      console.error('샘플 데이터 추가 실패:', error)
      showMessage('❌ 샘플 데이터 추가에 실패했습니다. 콘솔을 확인하세요.', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* 헤더 */}
      <header className="border-b border-gray-800 bg-gray-950">
        <div className="container mx-auto px-4 py-4">
          <button
            onClick={() => navigate('/')}
            className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>돌아가기</span>
          </button>
        </div>
      </header>

      {/* 메인 컨텐츠 */}
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <Database className="w-8 h-8 text-yellow-500" />
            <h1 className="text-3xl font-bold">개발자 도구</h1>
          </div>
          <p className="text-gray-400">
            샘플 데이터를 추가하고 기능을 테스트할 수 있습니다.
          </p>
        </div>

        {/* 메시지 표시 */}
        {message && (
          <div
            className={`mb-6 p-4 rounded-lg ${
              messageType === 'success'
                ? 'bg-green-900/50 text-green-300 border border-green-700'
                : messageType === 'error'
                  ? 'bg-red-900/50 text-red-300 border border-red-700'
                  : 'bg-blue-900/50 text-blue-300 border border-blue-700'
            }`}
          >
            {message}
          </div>
        )}

        {/* 샘플 데이터 추가 섹션 */}
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">샘플 참여자 데이터 추가</h2>

          <div className="space-y-4 mb-6">
            <div className="flex items-start space-x-3">
              <MapPin className="w-5 h-5 text-yellow-500 mt-1" />
              <div>
                <h3 className="font-semibold text-yellow-500">체크인 데이터</h3>
                <p className="text-sm text-gray-400">
                  GPS 인증 참여자 - 이벤트 주변에 노란색 마커로 표시됩니다.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Flame className="w-5 h-5 text-orange-500 mt-1" />
              <div>
                <h3 className="font-semibold text-orange-500">촛불 데이터 (Realtime DB)</h3>
                <p className="text-sm text-gray-400">
                  현장/원격 참여자 - 현장 참여자는 GPS 좌표를 가지며 지도에 표시됩니다.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <MessageSquare className="w-5 h-5 text-blue-500 mt-1" />
              <div>
                <h3 className="font-semibold text-blue-500">댓글 데이터</h3>
                <p className="text-sm text-gray-400">
                  온라인 참여자 위치 - 50% 확률로 GPS 좌표가 포함되어 파란색 마커로 표시됩니다.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gray-900 rounded p-4 mb-6">
            <h3 className="font-semibold mb-2 text-yellow-500">⚠️ 주의사항</h3>
            <ul className="text-sm text-gray-400 space-y-1 list-disc list-inside">
              <li>
                Firebase에서 실제 이벤트 ID를 확인하고{' '}
                <code className="bg-gray-800 px-2 py-1 rounded">
                  src/scripts/generateSampleParticipants.ts
                </code>
                의 <code className="bg-gray-800 px-2 py-1 rounded">SAMPLE_EVENTS</code> 배열을
                수정해야 합니다.
              </li>
              <li>이벤트별로 자동으로 다양한 수의 참여자가 생성됩니다.</li>
              <li>진행 중인 이벤트는 더 많은 참여자가 생성됩니다.</li>
            </ul>
          </div>

          <button
            onClick={handleAddSampleData}
            disabled={isLoading}
            className="w-full bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-700 disabled:cursor-not-allowed text-gray-900 font-bold py-3 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900"></div>
                <span>추가 중...</span>
              </>
            ) : (
              <>
                <Database className="w-5 h-5" />
                <span>샘플 참여자 추가</span>
              </>
            )}
          </button>
        </div>

        {/* 추가 정보 */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">사용 방법</h2>

          <ol className="space-y-3 text-gray-400">
            <li className="flex items-start space-x-3">
              <span className="flex-shrink-0 w-6 h-6 bg-yellow-500 text-gray-900 rounded-full flex items-center justify-center font-bold text-sm">
                1
              </span>
              <span>
                Firebase Console에서 Firestore의 <code className="bg-gray-900 px-2 py-1 rounded">events</code> 컬렉션을 열고
                실제 이벤트 ID를 확인합니다.
              </span>
            </li>

            <li className="flex items-start space-x-3">
              <span className="flex-shrink-0 w-6 h-6 bg-yellow-500 text-gray-900 rounded-full flex items-center justify-center font-bold text-sm">
                2
              </span>
              <span>
                <code className="bg-gray-900 px-2 py-1 rounded">
                  src/scripts/generateSampleParticipants.ts
                </code>{' '}
                파일을 열고 <code className="bg-gray-900 px-2 py-1 rounded">SAMPLE_EVENTS</code>{' '}
                배열의 <code className="bg-gray-900 px-2 py-1 rounded">id</code> 필드를 실제
                이벤트 ID로 수정합니다.
              </span>
            </li>

            <li className="flex items-start space-x-3">
              <span className="flex-shrink-0 w-6 h-6 bg-yellow-500 text-gray-900 rounded-full flex items-center justify-center font-bold text-sm">
                3
              </span>
              <span>위의 "샘플 참여자 추가" 버튼을 클릭합니다.</span>
            </li>

            <li className="flex items-start space-x-3">
              <span className="flex-shrink-0 w-6 h-6 bg-yellow-500 text-gray-900 rounded-full flex items-center justify-center font-bold text-sm">
                4
              </span>
              <span>
                지도 페이지(<code className="bg-gray-900 px-2 py-1 rounded">/map</code>)로 이동하여
                참여자 마커가 표시되는지 확인합니다.
              </span>
            </li>
          </ol>

          <div className="mt-6 pt-6 border-t border-gray-700">
            <h3 className="font-semibold mb-2">유용한 링크</h3>
            <div className="space-y-2">
              <button
                onClick={() => navigate('/map')}
                className="block w-full text-left px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded transition-colors"
              >
                🗺️  지도 페이지로 이동
              </button>
              <button
                onClick={() => navigate('/')}
                className="block w-full text-left px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded transition-colors"
              >
                🏠 홈으로 이동
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
