/**
 * Google Gemini AI 서비스
 *
 * AI 응원 메시지 생성, 집회 요약 등을 제공합니다.
 */

import { GoogleGenerativeAI } from '@google/generative-ai'

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY

// API 키가 없으면 경고만 출력하고 계속 진행
const genAI = API_KEY ? new GoogleGenerativeAI(API_KEY) : null

/**
 * AI 응원 메시지 생성
 */
export async function generateSupportMessage(eventTitle: string): Promise<string> {
  if (!genAI) {
    return '함께해요! 우리의 목소리를 내요! 💪'
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' })

    const prompt = `다음 집회에 대한 간단하고 따뜻한 응원 메시지를 1-2문장으로 작성해주세요. 이모지를 포함하고, 긍정적이고 격려하는 톤으로 작성해주세요.

집회: ${eventTitle}

응원 메시지:`

    const result = await model.generateContent(prompt)
    const response = await result.response
    return response.text().trim()
  } catch (error) {
    console.error('AI 응원 메시지 생성 실패:', error)
    return '함께해요! 우리의 목소리를 내요! 💪'
  }
}

/**
 * AI 집회 요약 생성
 */
export async function generateEventSummary(eventDescription: string): Promise<string> {
  if (!genAI) {
    return '이 집회는 중요한 사회적 이슈에 대한 시민들의 목소리를 모으는 자리입니다.'
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' })

    const prompt = `다음 집회 설명을 읽고, 핵심 내용을 2-3문장으로 요약해주세요. 집회의 목적과 의의를 명확하게 전달해주세요.

집회 설명: ${eventDescription}

요약:`

    const result = await model.generateContent(prompt)
    const response = await result.response
    return response.text().trim()
  } catch (error) {
    console.error('AI 집회 요약 생성 실패:', error)
    return '이 집회는 중요한 사회적 이슈에 대한 시민들의 목소리를 모으는 자리입니다.'
  }
}

/**
 * AI 날씨 기반 조언 생성
 */
export async function generateWeatherAdvice(
  weather: string,
  temperature: number
): Promise<string> {
  if (!genAI) {
    return '날씨를 확인하고 적절한 복장을 준비하세요!'
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' })

    const prompt = `다음 날씨 정보를 바탕으로 집회 참여자를 위한 실용적인 조언을 1-2문장으로 작성해주세요. 준비물이나 복장에 대한 구체적인 팁을 포함해주세요.

날씨: ${weather}
기온: ${temperature}°C

조언:`

    const result = await model.generateContent(prompt)
    const response = await result.response
    return response.text().trim()
  } catch (error) {
    console.error('AI 날씨 조언 생성 실패:', error)
    return '날씨를 확인하고 적절한 복장을 준비하세요!'
  }
}
