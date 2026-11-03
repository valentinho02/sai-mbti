# 오류 운영 안내

## 확인 순서

1. 화면의 문의 번호(`requestId`)와 오류 코드 확인
2. “문제 발생 위치와 해결 방법”을 펼쳐 단계·관련 파일·분류된 원인 확인
3. 로컬 터미널 또는 호스팅 Worker 로그에서 같은 `requestId` 검색
4. 아래 표의 조치를 수행하고 동일 테스트 또는 요청을 재현

서버 로그는 `sai.error` 이벤트의 JSON 한 줄로 기록합니다. 이 프로젝트 자체에는 로그 DB나 관리자 로그 조회 화면이 없습니다. 호스팅 플랫폼의 로그 보존·열람 기능을 사용하며, 브라우저 자체 오류는 브라우저 콘솔에 기록됩니다. 브라우저 오류를 서버로 자동 수집하지는 않습니다.

## 주요 코드

| 오류 | 단계 / 점검 파일 | 분류된 원인과 조치 |
| --- | --- | --- |
| `INVALID_JSON`, `BODY_TOO_LARGE`, `INVALID_INPUT` | input / `app/api/analyze/route.ts` | 요청 형식·100KB 본문 한도·답변·동의 확인. 실제 검증 구현은 `lib/analyze.ts`에 위임 |
| `NOT_CONFIGURED` | configuration / `lib/analyze.ts` | 서버 비밀 설정 없음 |
| `API_AUTH` | provider_request / `lib/analyze.ts` | 키 만료·무효 여부 확인 |
| `API_QUOTA` | provider_request / `lib/analyze.ts` | 잔액·사용 한도 확인. 단순한 반복 재시도로 해결하지 않음 |
| `API_RATE_LIMIT` | provider_request / `lib/analyze.ts` | 일시적인 요청 제한. 잠시 기다린 뒤 재시도 |
| `API_ACCESS` | provider_request / `lib/analyze.ts` | 모델 이름·프로젝트 접근 권한 확인 |
| `API_NETWORK`, `API_TIMEOUT`, `API_UNAVAILABLE` | provider_request / `lib/analyze.ts` | 외부 연결·90초 제한·외부 서비스 실패를 구분 |
| `MODEL_REFUSAL`, `MODEL_INCOMPLETE`, `MODEL_JSON` | provider_response / `lib/analyze.ts` | 거부·미완료·JSON 해석 실패 구분 |
| `INVALID_RESULT` | result_validation / `lib/analyze.ts` | 12개 고유 문항 ID, 점수, 근거 여부, 원문 인용, 해설 검증 |
| `SCORING_FAILED` | scoring / `lib/assessment.ts` | 검증 후 선호 합산 중 예외 |
| `CLIENT_NETWORK`, `CLIENT_RESPONSE` | client_request 또는 client_response / `app/page.tsx` | 브라우저 연결 실패와 잘못된 서버 응답 구분 |
| `UI_RENDER` | render / `app/error.tsx` | 화면 경계가 감지한 렌더링 오류. 실제 원인 컴포넌트는 추가 재현으로 확인 |
| `WORKER_FAILURE` | worker / `worker/index.ts` | 앱 바깥 요청 처리 예외 |

예시 로그(실제 장애 기록이 아닌 형식 예시):

```json
{"event":"sai.error","requestId":"example-request-id","code":"API_QUOTA","stage":"provider_request","source":"lib/analyze.ts","reason":"외부 API의 잔액 또는 사용 한도가 소진됨","upstreamStatus":429}
```

로그와 클라이언트 응답에는 API 키, 사용자 답변, 원문 인용, 외부 API의 원본 오류 본문, 원본 예외 메시지·스택을 넣지 않습니다. 고정 카탈로그에서 검토한 문구만 기록합니다. 따라서 장애 위치는 안전하게 분류된 점검 위치이며, 자동 근본 원인 분석이나 정확한 파일 행 번호 추적은 아닙니다.

## 복구 범위와 제한

- API 오류 응답에는 `X-Request-ID`와 `Cache-Control: no-store`를 설정합니다.
- 실패 시 가짜 성공 결과나 예시 결과를 대신 반환하지 않습니다.
- 서버가 200으로 반환한 뒤 브라우저 렌더링이 실패하는 경우는 화면 경계에서 처리합니다.
- `app/error.tsx`는 루트 레이아웃, 브라우저 종료, 모든 이벤트 핸들러 오류까지 보장하는 전역 수집기가 아닙니다.
- 설치 실패·타입 오류·빌드 실패는 런타임 코드로 잡을 수 없습니다. `npm run typecheck`, `npm test`, `npm run build`의 터미널 출력을 확인합니다.
- Worker 자체가 시작하지 못하거나 플랫폼이 요청을 차단하면 사용자 정의 오류 형식을 반환할 수 없습니다. 플랫폼 로그를 확인해야 합니다.
- 외부 요청을 자동으로 반복하지 않습니다. 같은 요청을 재제출하면 API 비용이 다시 발생할 수 있습니다.

## 검증

`npm test`는 네트워크와 실제 API 키 없이 외부 응답을 대체해 정상·오류 경로를 확인합니다. 이는 실제 API 채점의 품질이나 실제 서비스 전체 성공을 입증하는 검사가 아닙니다.
