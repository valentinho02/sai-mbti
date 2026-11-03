import {analyze} from '../../../lib/analyze';
/** /api/analyze is the HTTP entrypoint; the testable request pipeline lives in lib/. */
export async function POST(request:Request){return analyze(request);}
