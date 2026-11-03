import type {Diagnostic} from '../lib/errors';
export function ErrorNotice({message,diagnostic}:{message:string;diagnostic?:Diagnostic}){
 return <div role="alert" className="error"><p>{message}</p>{diagnostic&&<><small>문의 번호: {diagnostic.requestId}</small><details><summary>문제 발생 위치와 해결 방법</summary><dl><dt>코드 / 단계</dt><dd>{diagnostic.code} / {diagnostic.stage}</dd><dt>감지 위치</dt><dd><code>{diagnostic.source}</code></dd><dt>분류된 원인</dt><dd>{diagnostic.reason}</dd><dt>다음 조치</dt><dd>{diagnostic.action}</dd></dl></details></>}</div>;
}
