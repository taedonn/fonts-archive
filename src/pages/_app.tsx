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
import { AnimatePresence } from "framer-motion";

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
                        color={theme === "dark" ? "#8AB4F8" : "#1B73E7"}
                    />
                    <AnimatePresence
                        mode="wait" // 새 페이지 로딩 전 페이지 아웃 애니메이션 끝까지 실행
                        // initial={false} // false 시 첫 페이지 로딩 애니메이션 안함
                        onExitComplete={() => window.scrollTo(0, 0)} // 페이지 아웃 애니메이션 끝나면 스크롤 이동
                    >
                        <Component {...pageProps}/>
                    </AnimatePresence>
                </main>
            </SessionProvider>
        </QueryClientProvider>
    );
}; 