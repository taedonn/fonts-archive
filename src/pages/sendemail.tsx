// next hooks
import { NextSeo } from 'next-seo';

// react hooks
import React from 'react';

// components
import Header from "@/components/header";
import TextAnimation from '@/components/textanimation';

const SendEmail = ({params}: any) => {
    // 디바이스 체크
    const isMac: boolean = params.userAgent.includes("Mac OS") ? true : false;

    // 빈 함수
    const emptyFn = () => { return; }

    return (
        <>
            {/* Head 부분*/}
            <NextSeo 
                title={"폰트 아카이브"}
                description={"상업용 무료 한글 폰트 아카이브"}
            />

            {/* 헤더 */}
            <Header
                isMac={isMac}
                theme={params.theme}
                page={"login"}
                lang={""}
                type={""}
                sort={""}
                source={""}
                handleTextChange={emptyFn}
                handleLangOptionChange={emptyFn}
                handleTypeOptionChange={emptyFn}
                handleSortOptionChange={emptyFn}
                handleSearch={emptyFn}
            />

            {/* 메인 */}
            <div className='w-[100%] flex flex-col justify-start items-center mt-[60px] tlg:mt-[56px]'>
                <div className='w-content text-theme-4 dark:text-theme-9 flex flex-col justify-center items-center'>
                    <TextAnimation
                        text={'FONTS ARCHIVE'}
                    />
                    <h2 className='text-[18px] text-center font-medium leading-relaxed'>
                        인증메일이 (으)로 전송되었습니다. <br/>
                        받으신 이메일의 링크를 클릭하면 가입이 완료됩니다.
                    </h2>
                    <h3 className='text-[14px] text-theme-6 dark:text-theme-7 font-light mt-[20px] flex flex-row justify-center items-center'>
                        이메일을 확인할 수 없나요?
                        <div className='text-theme-yellow dark:text-theme-blue-1 hover:underline tlg:hover:no-underline ml-[8px] cursor-pointer'>인증 메일 다시 보내기</div>
                    </h3>
                </div>
            </div>
        </>
    );
}

export async function getServerSideProps(ctx: any) {
    try {
        // 필터링 쿠키 체크
        const cookieTheme = ctx.req.cookies.theme === undefined ? "dark" : ctx.req.cookies.theme;

        // 디바이스 체크
        const userAgent = ctx.req ? ctx.req.headers['user-agent'] : navigator.userAgent;

        return {
            props: {
                params: {
                    theme: cookieTheme,
                    userAgent: userAgent,
                }
            }
        }
    }
    catch (error) {
        console.log(error);
    }
}

export default SendEmail;