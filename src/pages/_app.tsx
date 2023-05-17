// 서버로 요청이 들어왔을 때 가장 먼저 실행되는 component

// 훅
import type { AppProps } from "next/app";
import { NextSeo } from 'next-seo';

// react-query
import { QueryClientProvider, QueryClient } from "react-query";
const queryClient = new QueryClient();

// 스타일
import '../styles/globals.css';

export default function App({ Component, pageProps }: AppProps) {
    return (
        <>
            <QueryClientProvider client={queryClient}>
                <NextSeo
                    title="FONTS ARCHIVE"
                    description="A website that archives license free Korean fonts"
                    additionalLinkTags={[
                        {
                            rel:"icon",
                            href: "/favicon.svg"
                        }
                    ]}
                />
                <main>
                    <Component {...pageProps}/>
                </main>
            </QueryClientProvider>
        </>
    );
}; 