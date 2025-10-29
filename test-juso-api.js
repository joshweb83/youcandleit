/**
 * 도로명주소 API 테스트 스크립트
 *
 * 실행 방법: node test-juso-api.js
 */

const API_KEY = 'U01TX0FVVEgyMDI1MTAyOTE5MjkwMTExNjM4MDQ=';

async function testJusoAPI(keyword) {
  console.log(`\n🔍 검색어: "${keyword}"`);
  console.log('━'.repeat(60));

  try {
    const url = new URL('https://business.juso.go.kr/addrlink/addrLinkApi.do');
    url.searchParams.append('confmKey', API_KEY);
    url.searchParams.append('currentPage', '1');
    url.searchParams.append('countPerPage', '5');
    url.searchParams.append('keyword', keyword);
    url.searchParams.append('resultType', 'json');

    console.log('📡 API 호출 중...');

    const response = await fetch(url.toString());

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    console.log('\n✅ API 응답 성공!');
    console.log('━'.repeat(60));

    const common = data.results.common;
    console.log(`📊 총 검색 결과: ${common.totalCount}건`);
    console.log(`📄 현재 페이지: ${common.currentPage}`);
    console.log(`❗ 에러 코드: ${common.errorCode} (0이면 정상)`);

    if (common.errorMessage) {
      console.log(`⚠️  에러 메시지: ${common.errorMessage}`);
    }

    if (data.results.juso && data.results.juso.length > 0) {
      console.log('\n📍 검색 결과 (최대 5개):');
      console.log('━'.repeat(60));

      data.results.juso.forEach((addr, index) => {
        console.log(`\n${index + 1}. ${addr.roadAddr}`);
        console.log(`   지번: ${addr.jibunAddr}`);
        console.log(`   우편번호: ${addr.zipNo}`);
      });
    } else {
      console.log('\n❌ 검색 결과가 없습니다.');
    }

  } catch (error) {
    console.error('\n❌ API 호출 실패:', error.message);
  }

  console.log('\n' + '━'.repeat(60) + '\n');
}

// 여러 검색어로 테스트
async function runTests() {
  console.log('🚀 도로명주소 API 테스트 시작');
  console.log('═'.repeat(60));

  await testJusoAPI('광화문');
  await testJusoAPI('세종대로');
  await testJusoAPI('강남역');

  console.log('✅ 모든 테스트 완료!');
}

runTests();
