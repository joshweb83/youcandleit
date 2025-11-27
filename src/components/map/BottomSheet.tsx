/**
 * BottomSheet 컴포넌트
 *
 * 지도 하단에서 드래그하여 확장/축소 가능한 슬라이드 패널
 * 3단계 상태: collapsed (최소화), peek (미리보기), expanded (전체)
 */

import { useState, useRef, useEffect, ReactNode } from 'react'
import { ChevronUp } from 'lucide-react'

type SheetState = 'collapsed' | 'peek' | 'expanded'

interface BottomSheetProps {
  children: ReactNode
  onStateChange?: (state: SheetState) => void
}

export function BottomSheet({ children, onStateChange }: BottomSheetProps) {
  const [sheetState, setSheetState] = useState<SheetState>('peek')
  const [isDragging, setIsDragging] = useState(false)
  const [startY, setStartY] = useState(0)
  const [currentY, setCurrentY] = useState(0)
  const sheetRef = useRef<HTMLDivElement>(null)

  // 각 상태별 높이 (vh 단위)
  const heights = {
    collapsed: 8,  // 8vh - 드래그 핸들과 제목만
    peek: 35,      // 35vh - 1-2개 카드 보임
    expanded: 85,  // 85vh - 거의 전체 화면
  }

  // 현재 높이 계산
  const getCurrentHeight = (): string | number => {
    if (isDragging) {
      const windowHeight = window.innerHeight
      const baseHeight = (heights[sheetState] / 100) * windowHeight
      const dragOffset = startY - currentY
      const newHeight = baseHeight + dragOffset
      return Math.max(
        (heights.collapsed / 100) * windowHeight,
        Math.min((heights.expanded / 100) * windowHeight, newHeight)
      )
    }
    return `${heights[sheetState]}vh`
  }

  // 가장 가까운 상태로 스냅
  const snapToNearestState = (currentHeightValue: number) => {
    const windowHeight = window.innerHeight
    const collapsedPx = (heights.collapsed / 100) * windowHeight
    const peekPx = (heights.peek / 100) * windowHeight
    const expandedPx = (heights.expanded / 100) * windowHeight

    const distances = {
      collapsed: Math.abs(currentHeightValue - collapsedPx),
      peek: Math.abs(currentHeightValue - peekPx),
      expanded: Math.abs(currentHeightValue - expandedPx),
    }

    const nearest = Object.entries(distances).reduce((a, b) =>
      a[1] < b[1] ? a : b
    )[0] as SheetState

    setSheetState(nearest)
    onStateChange?.(nearest)
  }

  // 터치/마우스 시작
  const handleStart = (clientY: number) => {
    setIsDragging(true)
    setStartY(clientY)
    setCurrentY(clientY)
  }

  // 터치/마우스 이동
  const handleMove = (clientY: number) => {
    if (!isDragging) return
    setCurrentY(clientY)
  }

  // 터치/마우스 종료
  const handleEnd = () => {
    if (!isDragging) return
    setIsDragging(false)

    const heightValue = getCurrentHeight()
    const currentHeightPx =
      typeof heightValue === 'number'
        ? heightValue
        : (parseFloat(heightValue) / 100) * window.innerHeight

    snapToNearestState(currentHeightPx)
  }

  // 마우스 이벤트
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => handleMove(e.clientY)
    const handleMouseUp = () => handleEnd()

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDragging])

  // 핸들 클릭으로 상태 토글
  const handleToggle = () => {
    if (sheetState === 'collapsed') {
      setSheetState('peek')
      onStateChange?.('peek')
    } else if (sheetState === 'peek') {
      setSheetState('expanded')
      onStateChange?.('expanded')
    } else {
      setSheetState('peek')
      onStateChange?.('peek')
    }
  }

  return (
    <>
      {/* 배경 오버레이 (expanded 상태일 때만) */}
      {sheetState === 'expanded' && (
        <div
          className="fixed inset-0 bg-black/30 z-40 transition-opacity"
          onClick={() => {
            setSheetState('peek')
            onStateChange?.('peek')
          }}
        />
      )}

      {/* 하단 시트 */}
      <div
        ref={sheetRef}
        className="fixed bottom-0 left-0 right-0 bg-gray-900 rounded-t-3xl shadow-2xl z-50 transition-all duration-300 ease-out"
        style={{
          height: getCurrentHeight(),
          touchAction: 'none',
        }}
      >
        {/* 드래그 핸들 영역 */}
        <div
          className="flex flex-col items-center pt-3 pb-2 cursor-grab active:cursor-grabbing"
          onMouseDown={(e) => handleStart(e.clientY)}
          onTouchStart={(e) => handleStart(e.touches[0].clientY)}
          onTouchMove={(e) => handleMove(e.touches[0].clientY)}
          onTouchEnd={handleEnd}
          onClick={handleToggle}
        >
          {/* 드래그 바 */}
          <div className="w-12 h-1.5 bg-gray-700 rounded-full mb-3" />

          {/* 제목 영역 */}
          <div className="flex items-center space-x-2 text-white">
            <ChevronUp
              className={`w-5 h-5 transition-transform duration-300 ${
                sheetState === 'expanded' ? 'rotate-180' : ''
              }`}
            />
            <h2 className="text-lg font-bold">
              {sheetState === 'collapsed' ? '집회 목록' : '진행 중인 집회'}
            </h2>
          </div>
        </div>

        {/* 컨텐츠 영역 */}
        <div
          className="overflow-y-auto h-full pb-20"
          style={{
            maxHeight: `calc(${getCurrentHeight()} - 80px)`,
          }}
        >
          {children}
        </div>
      </div>
    </>
  )
}
