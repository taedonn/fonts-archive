// 서버로 요청이 들어왔을 때 가장 먼저 실행되는 component

// next hooks
import type { AppProps } from "next/app";
import { DefaultSeo } from 'next-seo';

// react-query hooks
import { QueryClientProvider, QueryClient } from "react-query";
const queryClient = new QueryClient();

// styles
import '../styles/globals.css';
import '../styles/mailanimation.css';

export default function App({ Component, pageProps }: AppProps) {
    return (
        <>
            <QueryClientProvider client={queryClient}>
                <DefaultSeo
                    title="폰트 아카이브 · 상업용 무료 한글 폰트 저장소"
                    description="상업용 무료 한글 폰트 저장소"
                    canonical="https://fonts.taedonn.com"
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