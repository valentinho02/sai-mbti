'use client';
import {useEffect,useState} from 'react';
import {failure,logFailure} from '../lib/errors';
import {ErrorNotice} from '../components/error-notice';
export default function ErrorPage({reset}:{error:Error&{digest?:string};reset:()=>void}){
 const [problem]=useState(()=>failure('UI_RENDER',crypto.randomUUID()));
 useEffect(()=>{logFailure(problem);},[problem]);
 return <main className="document"><h1>화면을 다시 열어볼까요?</h1><ErrorNotice message={problem.error} diagnostic={problem.diagnostic}/><p>저장하지 않은 답변은 화면을 다시 열면 사라질 수 있어요.</p><button className="primary" onClick={reset}>화면 다시 열기</button></main>;
}
