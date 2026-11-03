/** Only these fixed, reviewed fields may reach logs or the browser. Never attach raw exceptions. */
export const catalog = {
 INVALID_JSON:['input','app/api/analyze/route.ts','요청 형식이 올바르지 않아요.','JSON 요청을 해석할 수 없음','입력 화면에서 다시 제출해 주세요.',400,false],
 BODY_TOO_LARGE:['input','app/api/analyze/route.ts','답변이 너무 길어요.','요청 본문이 100,000바이트 한도를 초과','답변 길이를 줄여 주세요.',413,false],
 INVALID_INPUT:['input','app/api/analyze/route.ts','12개 답변과 전송 동의를 확인해 주세요.','문항 수·답변 길이·전송 동의 검증 실패','각 답변을 10~3,000자로 작성하고 전송에 동의해 주세요.',400,false],
 NOT_CONFIGURED:['configuration','lib/analyze.ts','AI 채점 연결을 준비 중이에요.','서버에 OPENAI_API_KEY 설정이 없음','운영자가 서버의 비밀 설정을 확인해야 합니다.',503,false],
 API_AUTH:['provider_request','lib/analyze.ts','AI 채점 연결을 확인해야 해요.','외부 API가 인증 실패를 반환','운영자가 API 키의 유효성과 만료일을 확인해야 합니다.',502,false],
 API_QUOTA:['provider_request','lib/analyze.ts','AI 채점 사용 한도에 도달했어요.','외부 API의 잔액 또는 사용 한도가 소진됨','운영자가 API 결제·사용 한도를 확인해야 합니다.',503,false],
 API_RATE_LIMIT:['provider_request','lib/analyze.ts','요청이 몰리고 있어요. 잠시 후 다시 시도해 주세요.','외부 API가 일시적인 요청 제한을 반환','잠시 기다린 뒤 다시 제출해 주세요.',429,true],
 API_ACCESS:['provider_request','lib/analyze.ts','채점 모델 연결을 확인해야 해요.','외부 API가 접근 또는 모델 사용 오류를 반환','운영자가 모델 이름과 프로젝트 접근 권한을 확인해야 합니다.',502,false],
 API_UNAVAILABLE:['provider_request','lib/analyze.ts','AI 채점 서비스가 일시적으로 응답하지 않아요.','외부 API가 실패 상태를 반환','잠시 후 다시 시도하고 반복되면 운영자에게 문의해 주세요.',502,true],
 API_TIMEOUT:['provider_request','lib/analyze.ts','채점 응답 시간이 초과됐어요.','외부 API 요청의 제한 시간 초과 또는 중단','답변은 남아 있어요. 잠시 후 다시 시도해 주세요.',504,true],
 API_NETWORK:['provider_request','lib/analyze.ts','AI 채점 서버에 연결하지 못했어요.','API HTTP 응답을 받기 전 연결 실패','운영자가 서버의 외부 연결 상태를 확인해야 합니다.',502,true],
 MODEL_REFUSAL:['provider_response','lib/analyze.ts','이 답변으로는 채점을 완료하지 못했어요.','모델이 채점 요청을 거부함','불필요한 개인정보를 제거하고 답변을 확인해 주세요.',422,false],
 MODEL_INCOMPLETE:['provider_response','lib/analyze.ts','채점 결과를 끝까지 받지 못했어요.','모델 응답이 완료되지 않았거나 텍스트가 없음','잠시 후 다시 시도해 주세요.',502,true],
 MODEL_JSON:['provider_response','lib/analyze.ts','채점 결과 형식을 확인하지 못했어요.','외부 응답 또는 모델 출력이 유효한 JSON이 아님','재시도 후 반복되면 운영자가 모델 출력 설정을 확인해야 합니다.',502,true],
 INVALID_RESULT:['result_validation','lib/analyze.ts','채점 결과가 기준을 충족하지 못했어요.','문항 ID·점수·근거·원문 인용 검증 실패','운영자가 출력 계약과 루브릭의 일치 여부를 확인해야 합니다.',502,true],
 SCORING_FAILED:['scoring','lib/assessment.ts','선호 점수를 계산하지 못했어요.','검증된 문항 점수의 합산 과정 실패','운영자가 선호 계산 함수를 확인해야 합니다.',500,false],
 INTERNAL_ERROR:['internal','lib/analyze.ts','채점을 완료하지 못했어요.','서버 내부 처리 중 분류되지 않은 예외','문의 번호와 함께 운영자에게 알려 주세요.',500,false],
 CLIENT_NETWORK:['client_request','app/page.tsx','연결을 확인하고 다시 시도해 주세요.','브라우저에서 채점 서버의 HTTP 응답을 받지 못함','네트워크 연결을 확인해 주세요. 답변은 그대로 남아 있어요.',0,true],
 CLIENT_RESPONSE:['client_response','app/page.tsx','서버 응답을 읽지 못했어요.','응답 JSON 또는 결과 구조를 확인할 수 없음','잠시 후 다시 시도하고 반복되면 문의 번호를 알려 주세요.',0,true],
 UI_RENDER:['render','app/error.tsx','화면을 표시하지 못했어요.','화면 렌더링 중 예외가 발생함','화면을 다시 열고 반복되면 문의 번호를 알려 주세요.',500,true],
 WORKER_FAILURE:['worker','worker/index.ts','서비스 요청을 처리하지 못했어요.','애플리케이션이 오류 응답을 만들기 전 Worker 예외 발생','문의 번호와 함께 운영자에게 알려 주세요.',500,true],
} as const;
export type ErrorCode=keyof typeof catalog;
export type Diagnostic={code:ErrorCode;stage:string;source:string;reason:string;action:string;retryable:boolean;requestId:string;upstreamStatus?:number};
export type Failure={error:string;diagnostic:Diagnostic};
export function failure(code:ErrorCode,requestId:string,upstreamStatus?:number):Failure{
 const [stage,source,error,reason,action,,retryable]=catalog[code];
 return {error,diagnostic:{code,stage,source,reason,action,retryable,requestId,...(upstreamStatus===undefined?{}:{upstreamStatus})}};
}
export function logFailure(value:Failure,write:(event:string)=>void=console.error){
 // Reconstruct from the catalog; injected properties, provider bodies, answer text and exception messages are discarded.
 const d=value.diagnostic;const safe=failure(d.code,d.requestId,d.upstreamStatus);
 write(JSON.stringify({event:'sai.error',timestamp:new Date().toISOString(),...safe.diagnostic}));
}
export function errorResponse(code:ErrorCode,requestId:string,upstreamStatus?:number,write?:(event:string)=>void){
 const value=failure(code,requestId,upstreamStatus);logFailure(value,write);
 return Response.json(value,{status:catalog[code][5]||500,headers:{'Cache-Control':'no-store','X-Request-ID':requestId}});
}
