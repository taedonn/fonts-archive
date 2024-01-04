// 서버로 요청이 들어왔을 때 가장 먼저 실행되는 component

// react
import { useEffect, useState } from "react";

// next
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import { DefaultSeo } from 'next-seo';

// next-auth
import { SessionProvider } from "next-auth/react";

// react-query
import { QueryClientProvider, QueryClient } from "react-query";
const queryClient = new QueryClient();

// libraries
import NextNProgress from 'nextjs-progressbar';

// styles
import '@/styles/globals.css';

export default function App({Component, pageProps: { session, ...pageProps }}: AppProps) {
    const [theme, setTheme] = useState<string>("dark");
    const router = useRouter();
    
    useEffect(() => {
        const start = () => {
            const thisHTML = document.getElementsByTagName("html")[0];
            if (thisHTML.classList.contains("dark")) setTheme("dark");
            else setTheme("light");
        }
        router.events.on("routeChangeStart", start);
    }, [router]);

    return (
        <QueryClientProvider client={queryClient}>
            <SessionProvider session={session}>
                <DefaultSeo
                    title="폰트 아카이브 · 상업용 무료 한글 폰트 저장소"
                    description="폰트 아카이브 · 상업용 무료 한글 폰트 저장소"
                    additionalLinkTags={[
                        {
                            rel:"icon",
                            href: "/favicon.ico"
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
                                width: 1000,
                                height: 1000,
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
                    <NextNProgress
                        color={theme === "dark" ? "#8AB4F8" : "#FCBE11"}
                    />
                    <Component {...pageProps}/>
                </main>
            </SessionProvider>
        </QueryClientProvider>
    );
}; 