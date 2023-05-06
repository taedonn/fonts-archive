// 서버로 요청이 들어왔을 때 가장 먼저 실행되는 component

import type { AppProps } from "next/app";

export const metadata = {
    title: 'FONTS ARCHIVE',
    description: 'A website that archives license-free Korean fonts',
}

export default function App({ Component, pageProps }: AppProps) {
    return <Component {...pageProps} />;
};