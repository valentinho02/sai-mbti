import type { Metadata } from 'next';
import './globals.css';
export const metadata:Metadata={title:'사이 · 이야기로 읽는 나',description:'선택지 사이에 담기지 않았던 당신. 12개의 이야기와 공개 채점기준으로 만나는 성향 탐색.'};
export default function Layout({children}:{children:React.ReactNode}){return <html lang="ko"><body>{children}</body></html>}
