// 서버로 요청이 들어왔을 때 가장 먼저 실행되는 component

// next hooks
import type { AppProps } from "next/app";
import { NextSeo } from 'next-seo';

// react-query hooks
import { QueryClientProvider, QueryClient } from "react-query";
const queryClient = new QueryClient();

// styles
import '../styles/globals.css';
import '../styles/textanimation.css';

export default function App({ Component, pageProps }: AppProps) {
    return (
        <>
            <QueryClientProvider client={queryClient}>
                <NextSeo
                    title="폰트 아카이브"
                    description="상업용 무료 한글 폰트 아카이브"
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