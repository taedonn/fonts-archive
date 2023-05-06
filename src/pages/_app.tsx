// 서버로 요청이 들어왔을 때 가장 먼저 실행되는 component

// 훅
import type { AppProps } from "next/app";
import Head from 'next/head';

export const metadata = {
    title: 'FONTS ARCHIVE',
    description: 'A website that archives license-free Korean fonts',
}

export default function App({ Component, pageProps }: AppProps) {
    return (
        <>
            <Head>
                <title>FONTS ARCHIVE</title>
                <meta name="description" content="A website that archives license-free Korean fonts"></meta>
                <link rel='icon' href='/favicon.svg'/>
            </Head>
            <Component {...pageProps} />
        </>
    );
};