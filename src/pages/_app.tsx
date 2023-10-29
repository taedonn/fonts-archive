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
                    additionalLinkTags={[
                        {
                            rel:"icon",
                            href: "/favicon.svg"
                        }
                    ]}
                    openGraph={{
                        type: 'website',
                        locale: 'ko_KR',
                        url: 'https://fonts.taedonn.com',
                        siteName: '폰트 아카이브 · 상업용 무료 한글 폰트 저장소',
                        images: [
                            {
                                url: 'https://fonts-archive.s3.ap-northeast-2.amazonaws.com/meta_image.png',
                                width: 1280,
                                height: 720,
                                alt: '폰트 아카이브 메타 이미지',
                            },
                        ],
                    }}
                    twitter={{
                        handle: '@handle',
                        site: '@site',
                        cardType: 'summary_large_image',
                    }}
                />
                <main>
                    <Component {...pageProps}/>
                </main>
            </QueryClientProvider>
        </>
    );
}; 