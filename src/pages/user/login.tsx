// next hooks
import Link from 'next/link';
import { NextSeo } from 'next-seo';

// components
import Header from "@/components/header";

const Login = ({params}: any) => {
    // 디바이스 체크
    const isMac: boolean = params.userAgent.includes("Mac OS") ? true : false;

    // 빈 함수
    const emptyFn = () => { return; }

    return (
        <>
            {/* Head 부분*/}
            <NextSeo 
                title={"로그인 · 폰트 아카이브"}
                description={"로그인 - 상업용 무료 한글 폰트 아카이브"}
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
            <div className='w-[100%] flex flex-col justify-center items-center mt-[60px] tlg:mt-[56px]'>
                <div className='w-[360px] flex flex-col justify-center items-start mt-[100px] tlg:mt-[40px]'>
                    <h2 className='text-[20px] tlg:text-[18px] text-theme-4 dark:text-theme-9 font-medium mb-[12px] tlg:mb-[8px]'>로그인</h2>
                    <form className='w-[100%] p-[20px] rounded-[8px] text-theme-10 dark:text-theme-9 bg-theme-5 dark:bg-theme-3 drop-shadow-default dark:drop-shadow-dark'>
                        <label htmlFor='id' className='block text-[14px] ml-px'>아이디</label>
                        <input type='text' id='id' tabIndex={1} autoComplete='on' placeholder='이메일을 입력해 주세요.' className='w-[100%] text-[14px] mt-[6px] px-[14px] py-[8px] rounded-[8px] border-[2px] border-theme-4 focus:border-theme-yellow dark:border-theme-blue-2 focus:dark:border-theme-blue-1 placeholder-theme-7 dark:placeholder-theme-6 bg-theme-4 dark:bg-theme-blue-2 autofill:bg-theme-4 autofill:dark:bg-theme-blue-2'/>
                        <label htmlFor='pw' className='w-[100%] flex flex-row justify-between items-center text-[14px] ml-px mt-[18px]'>
                            <span>비밀번호</span>
                            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
                            <a href="/user/findpw" className='text-[12px] text-theme-yellow dark:text-theme-blue-1 hover:underline tlg:hover:no-underline'>비밀번호를 잊으셨나요?</a>
                        </label>
                        <input type='password' id='pw' tabIndex={2} autoComplete='on' placeholder='비밀번호를 입력해 주세요.' className='w-[100%] text-[14px] mt-[6px] px-[14px] py-[8px] rounded-[8px] border-[2px] border-theme-4 focus:border-theme-yellow dark:border-theme-blue-2 focus:dark:border-theme-blue-1 placeholder-theme-7 dark:placeholder-theme-6 bg-theme-4 dark:bg-theme-blue-2'/>
                        <button className='w-[100%] h-[40px] rounded-[8px] mt-[14px] text-[14px] font-medium text-theme-4 dark:text-theme-blue-2 bg-theme-yellow/80 hover:bg-theme-yellow tlg:hover:bg-theme-yellow/80 dark:bg-theme-blue-1/80 hover:dark:bg-theme-blue-1 tlg:hover:dark:bg-theme-blue-1/80'>로그인</button>
                    </form>
                    <div className='w-[100%] h-[52px] flex flex-row justify-center items-center mt-[16px] text-[14px] rounded-[8px] border border-theme-7 dark:border-theme-4'>
                        <span className='text-theme-4 dark:text-theme-9 mr-[12px]'>처음 방문하셨나요?</span>
                        {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
                        <a href="/user/regist" className='text-theme-yellow dark:text-theme-blue-1 hover:underline tlg:hover:no-underline'>회원가입하기</a>
                    </div>
                    <div className='w-[100%] flex flex-row justify-center items-center text-[12px] mt-[12px]'>
                        <Link href="/user/terms" target="_blank" className='text-theme-5 dark:text-theme-6 hover:underline tlg:hover:underline'>서비스 이용약관</Link>
                        <div className='text-theme-5 dark:text-theme-6 mx-[4px]'>·</div>
                        <Link href="/user/privacy" target="_blank" className='text-theme-5 dark:text-theme-6 hover:underline tlg:hover:underline'>개인정보처리방침</Link>
                    </div>
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

export default Login;