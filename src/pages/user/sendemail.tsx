// next
import { NextSeo } from 'next-seo';

// react
import React from 'react';

// api
import { FetchUserInfoFromToken } from '../api/auth/auth';

// components
import Header from "@/components/header";
import Footer from '@/components/footer';
import MailAnimation from '@/components/mailanimation';

const SendEmail = ({params}: any) => {
    const { theme, userAgent, user } = params;

    // 디바이스 체크
    const isMac: boolean = userAgent.includes("Mac OS") ? true : false;

    // 이메일 다시 보내기
    const resendEmail = async () => {
        const url = "/api/user/register";
        const options = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                action: "send-email",
                id: user.user_id,
                name: user.user_name,
                email_token: user.user_email_token,
            })
        }

        await fetch(url, options)
        .then(() => location.reload())
        .catch(err => console.log(err));
    }

    return (
        <>
            {/* Head 부분*/}
            <NextSeo 
                title={"폰트 아카이브"}
                description={"폰트 아카이브 · 상업용 무료 한글 폰트 저장소"}
            />

            {/* 헤더 */}
            <Header
                isMac={isMac}
                theme={theme}
                user={null}
            />

            {/* 메인 */}
            <div className='w-full mb-24 md:mb-32 flex flex-col items-center text-l-2 dark:text-white'>
                <div className='w-full px-4 text-l-5 dark:text-d-c relative flex flex-col justify-center items-center tlg:text-sm'>
                    <MailAnimation/>
                    <h2 className='mt-12 text-center leading-relaxed break-keep'>
                        <span className='font-bold'>[{user.user_id}]</span>(으)로 메일이 전송되었습니다. <br className='txs:hidden'/>
                        받으신 이메일의 링크를 클릭하시면 가입이 완료됩니다.
                    </h2>
                    <h3 className='mt-7 text-sm flex justify-center items-center'>
                        이메일을 확인할 수 없나요?
                        <div onClick={resendEmail} className='text-h-1 dark:text-f-8 lg:hover:underline ml-2 cursor-pointer'>인증 메일 다시 보내기</div>
                    </h3>
                </div>
            </div>

            {/* 풋터 */}
            <Footer/>
        </>
    );
}

export async function getServerSideProps(ctx: any) {
    try {
        // 쿠키 체크
        const { theme } = ctx.req.cookies;

        // 디바이스 체크
        const userAgent = ctx.req ? ctx.req.headers['user-agent'] : navigator.userAgent;

        // 토큰 유효성 검사
        const token = ctx.query.token;
        const user = await FetchUserInfoFromToken(token);

        if (token === undefined || token === "" || user === null || user.user_email_confirm) {
            return {
                redirect: {
                    destination: "/404",
                    permanent: false,
                }
            }
        } else {
            return {
                props: {
                    params: {
                        theme: theme ? theme : 'light',
                        userAgent: userAgent,
                        user: JSON.parse(JSON.stringify(user)),
                    }
                }
            }
        }
    } catch (error) {
        console.log(error);
    }
}

export default SendEmail;