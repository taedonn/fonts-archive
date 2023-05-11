// 서버로 요청이 들어왔을 때 가장 먼저 실행되는 component

// 훅
import type { AppProps } from "next/app";
import Head from 'next/head';

// react-query
import { QueryClientProvider, QueryClient } from "react-query";
const queryClient = new QueryClient();

// 스타일
import '../styles/globals.css';

// 폰트
import { Noto_Sans_KR } from 'next/font/google';
const notoSansKR = Noto_Sans_KR({
    weight: ['100', '300', '400', '500', '700', '900'],
    preload: false,
});
export const cls = (...classnames: string[]) => {
    return classnames.join(' ');
}

export default function App({ Component, pageProps }: AppProps) {
    return (
        <>
            <QueryClientProvider client={queryClient}>
                <Head>
                    <title>FONTS ARCHIVE</title>
                    <meta name="description" content="A website that archives license-free Korean fonts"></meta>
                    <link rel='icon' href='/favicon.svg'/>
                </Head>
                <main className={cls(notoSansKR.className)}>
                    <Component {...pageProps}/>
                </main>
            </QueryClientProvider>
        </>
    );
}; 