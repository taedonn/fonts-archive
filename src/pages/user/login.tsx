// next hooks
import Link from 'next/link';
import { useRouter } from 'next/router';
import { NextSeo } from 'next-seo';

// next-auth
import { signIn } from 'next-auth/react';
import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]';

// react hooks
import { useState, useEffect } from 'react';

// components
import Header from "@/components/header";
import Footer from '@/components/footer';

const Login = ({params}: any) => {
    // 디바이스 체크
    const isMac: boolean = params.userAgent.includes("Mac OS") ? true : false;

    // 빈 함수
    const emptyFn = () => { return; }

    // 라우터 훅
    const router = useRouter();

    // 폼 state
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [alertDisplay, setAlertDisplay] = useState<boolean>(false);
    const [idVal, setIdVal] = useState<string>('');
    const [idChk, setIdChk] = useState<string>('');
    const [pwVal, setPwVal] = useState<string>('');
    const [pwChk, setPwChk] = useState<string>('');
    const [history, setHistory] = useState<string>('/');

    // 뒤로가기 시 history가 남아있으면 state 변경
    useEffect(() => {
        const formId = document.getElementById('id') as HTMLInputElement;
        const formPw = document.getElementById('pw') as HTMLInputElement;

        if (formId.value !== '') { setIdVal(formId.value); }
        if (formPw.value !== '') { setPwVal(formPw.value); }

        // 세션 스토리지의 history 불러오기
        setHistory(sessionStorage.getItem("login_history") ? sessionStorage.getItem("login_history") as string : '/');
    }, []);

    // 아이디 입력 시 state에 저장
    const handleIdChange = (e: React.ChangeEvent<HTMLInputElement>) => { setIdChk(''); setIdVal(e.target.value); }

    // 비밀번호 입력 시 state에 저장
    const handlePwChange = (e: React.ChangeEvent<HTMLInputElement>) => { setPwChk(''); setPwVal(e.target.value); }

    // 엔터키 입력 시 로그인 버튼 클릭
    useEffect(() => {
        const keys: any = [];
        const handleKeydown = (e: KeyboardEvent) => { keys[e.key] = true; if (keys["Enter"]) { handleLogin(); } }
        const handleKeyup = (e: KeyboardEvent) => {keys[e.key] = false;}

        window.addEventListener("keydown", handleKeydown, false);
        window.addEventListener("keyup", handleKeyup, false);

        return () => {
            window.removeEventListener("keydown", handleKeydown);
            window.removeEventListener("keyup", handleKeyup);
        }
    });

    const handleLogin = async () => {
        // 폼 유효성 검사
        if (idVal === '') { setIdChk('empty'); }
        else if (pwVal === '') { setPwChk('empty'); }
        else {
            setIsLoading(true);

            const res = await signIn("credentials", {
                redirect: false,
                email: idVal,
                password: pwVal,
                callbackUrl: history,
            });

            if (res?.error) {
                setIsLoading(false);
                setAlertDisplay(true);
            }
            else {
                router.push(history);
            }
        }
    }

    /** 알럿창 닫기 */
    const handleAlertClose = () => { setAlertDisplay(false); }

    /** OAuth 로그인 */
    const googleLogin = async () => { signIn("google", { callbackUrl: history }); }
    const kakaoLogin = async () => { signIn("kakao", { callbackUrl: history }); }
    const githubLogin = async () => { signIn("github", { callbackUrl: history }); }

    return (
        <>
            {/* Head 부분*/}
            <NextSeo 
                title={"로그인 · 폰트 아카이브"}
                description={"로그인 - 폰트 아카이브 · 상업용 무료 한글 폰트 저장소"}
            />

            {/* 헤더 */}
            <Header
                isMac={isMac}
                theme={params.theme}
                user={null}
                page={""}
                license={""}
                lang={""}
                type={""}
                sort={""}
                source={""}
                handleTextChange={emptyFn}
                handleLicenseOptionChange={emptyFn}
                handleLangOptionChange={emptyFn}
                handleTypeOptionChange={emptyFn}
                handleSortOptionChange={emptyFn}
                handleSearch={emptyFn}
            />

            {/* 메인 */}
            <div className='w-[100%] flex flex-col justify-center items-center'>
                <div className='w-[360px] flex flex-col justify-center items-start my-[100px] tlg:my-[40px]'>
                    <h2 className='text-[20px] tlg:text-[18px] text-theme-3 dark:text-theme-9 font-medium mb-[12px] tlg:mb-[8px]'>로그인</h2>
                    {
                        alertDisplay &&
                            <div className='w-[100%] h-[32px] px-[10px] mb-[8px] flex flex-row justify-between items-center rounded-[6px] border-[2px] border-theme-red/80 dark:border-theme-red/60 text-[12px] text-theme-10 dark:text-theme-9 bg-theme-red/20'>
                                <div className='flex flex-row justify-start items-center'>
                                    <svg className='w-[14px] fill-theme-red/80 dark:fill-theme-red/60' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/><path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/></svg>
                                    <div className='ml-[6px]'>로그인에 실패했습니다.</div>
                                </div>
                                <div onClick={handleAlertClose} className='flex flex-row justify-center items-center cursor-pointer'>
                                    <svg className='w-[18px] fill-theme-10 dark:fill-theme-9' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/></svg>
                                </div>
                            </div>
                    }
                    <form onSubmit={e => e.preventDefault()} className='w-[100%] p-[20px] mb-[16px] rounded-[8px] text-theme-10 dark:text-theme-9 bg-theme-5 dark:bg-theme-3 drop-shadow-default dark:drop-shadow-dark'>
                        <label htmlFor='id' className='block text-[14px] ml-px'>아이디</label>
                        <input onChange={handleIdChange} type='text' id='id' tabIndex={1} autoComplete='on' placeholder='이메일을 입력해 주세요.' className={`${idChk === '' ? 'border-theme-4 focus:border-theme-yellow dark:border-theme-blue-2 focus:dark:border-theme-blue-1' : 'border-theme-red focus:border-theme-red dark:border-theme-red focus:dark:border-theme-red'} w-[100%] text-[14px] mt-[6px] px-[14px] py-[8px] rounded-[8px] border-[2px] placeholder-theme-7 dark:placeholder-theme-6 bg-theme-4 dark:bg-theme-blue-2 autofill:bg-theme-4 autofill:dark:bg-theme-blue-2`}/>
                        {
                            idChk === ''
                            ? <></>
                            : <span className='block text-[12px] text-theme-red mt-[4px] ml-[16px]'>아이디를 입력해 주세요.</span>
                        }
                        <label htmlFor='pw' className='w-[100%] flex flex-row justify-between items-center text-[14px] ml-px mt-[18px]'>
                            <span>비밀번호</span>
                            <Link href="/user/findpw" className='text-[12px] text-theme-yellow dark:text-theme-blue-1 hover:underline tlg:hover:no-underline'>비밀번호를 잊으셨나요?</Link>
                        </label>
                        <input onChange={handlePwChange} type='password' id='pw' tabIndex={2} autoComplete='on' placeholder='비밀번호를 입력해 주세요.' className={`${pwChk === '' ? 'border-theme-4 focus:border-theme-yellow dark:border-theme-blue-2 focus:dark:border-theme-blue-1' : 'border-theme-red focus:border-theme-red dark:border-theme-red focus:dark:border-theme-red'} w-[100%] text-[14px] mt-[6px] px-[14px] py-[8px] rounded-[8px] border-[2px] placeholder-theme-7 dark:placeholder-theme-6 bg-theme-4 dark:bg-theme-blue-2`}/>
                        {
                            pwChk === ''
                            ? <></>
                            : <span className='block text-[12px] text-theme-red mt-[4px] ml-[16px]'>비밀번호를 입력해 주세요.</span>
                        }
                        <button onClick={handleLogin} className='w-[100%] h-[40px] flex flex-row justify-center items-center rounded-[8px] mt-[16px] text-[14px] font-medium text-theme-4 dark:text-theme-blue-2 bg-theme-yellow/80 hover:bg-theme-yellow tlg:hover:bg-theme-yellow/80 dark:bg-theme-blue-1/80 hover:dark:bg-theme-blue-1 tlg:hover:dark:bg-theme-blue-1/80'>
                            {
                                isLoading === true
                                ? <span className='loader loader-register w-[18px] h-[18px]'></span>
                                : '로그인'
                            }
                        </button>
                    </form>
                    <div className='w-[100%] h-[52px] text-[14px] rounded-[8px] mb-[8px] gap-[8px] flex justify-center items-center border border-theme-7 dark:border-theme-4'>
                        {/* <div className='w-[28px] h-[28px] rounded-[6px] group relative flex justify-center items-center cursor-pointer bg-theme-naver'>
                            <svg className='w-[14px] fill-theme-10' viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M16.273 12.845 7.376 0H0v24h7.726V11.156L16.624 24H24V0h-7.727v12.845Z"/></svg>
                            <div className="login-method login-naver w-content absolute z-10 left-[50%] top-[-36px] text-[12px] font-medium leading-none px-[12px] py-[6px] rounded-[4px] hidden group-hover:block tlg:group-hover:hidden group-hover:animate-fontbox-zoom-in bg-theme-naver text-theme-3">네이버로 로그인</div>
                        </div> */}
                        <div onClick={kakaoLogin} className='w-[28px] h-[28px] rounded-[6px] group relative flex justify-center items-center cursor-pointer bg-theme-kakao'>
                            <svg className='w-[20px] fill-theme-1' viewBox="0 0 512 512" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M255.5 48C299.345 48 339.897 56.5332 377.156 73.5996C414.415 90.666 443.871 113.873 465.522 143.22C487.174 172.566 498 204.577 498 239.252C498 273.926 487.174 305.982 465.522 335.42C443.871 364.857 414.46 388.109 377.291 405.175C340.122 422.241 299.525 430.775 255.5 430.775C241.607 430.775 227.262 429.781 212.467 427.795C148.233 472.402 114.042 494.977 109.892 495.518C107.907 496.241 106.012 496.15 104.208 495.248C103.486 494.706 102.945 493.983 102.584 493.08C102.223 492.177 102.043 491.365 102.043 490.642V489.559C103.126 482.515 111.335 453.169 126.672 401.518C91.8486 384.181 64.1974 361.2 43.7185 332.575C23.2395 303.951 13 272.843 13 239.252C13 204.577 23.8259 172.566 45.4777 143.22C67.1295 113.873 96.5849 90.666 133.844 73.5996C171.103 56.5332 211.655 48 255.5 48Z"></path></svg>
                            <div className="login-method login-kakao w-content absolute z-10 left-[50%] top-[-36px] text-[12px] font-medium leading-none px-[12px] py-[6px] rounded-[4px] hidden group-hover:block tlg:group-hover:hidden group-hover:animate-fontbox-zoom-in bg-theme-kakao text-theme-3">카카오로 로그인</div>
                        </div>
                        {/* <div onClick={googleLogin} className='w-[28px] h-[28px] rounded-[6px] group relative flex justify-center items-center cursor-pointer bg-theme-10'>
                            <svg className='w-[20px] fill-theme-10' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/><path d="M1 1h22v22H1z" fill="none"/></svg>
                            <div className="login-method login-google w-content absolute z-10 left-[50%] top-[-36px] text-[12px] font-medium leading-none px-[12px] py-[6px] rounded-[4px] hidden group-hover:block tlg:group-hover:hidden group-hover:animate-fontbox-zoom-in bg-theme-10 text-theme-3">구글로 로그인</div>
                        </div> */}
                        <div onClick={githubLogin} className='w-[28px] h-[28px] rounded-[6px] group relative flex justify-center items-center cursor-pointer bg-theme-1 dark:bg-theme-10'>
                            <svg className='w-[20px] fill-theme-10 dark:fill-theme-1' viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
                            <div className="login-method login-github w-content absolute z-10 left-[50%] top-[-36px] text-[12px] font-medium leading-none px-[12px] py-[6px] rounded-[4px] hidden group-hover:block tlg:group-hover:hidden group-hover:animate-fontbox-zoom-in bg-theme-1 dark:bg-theme-10 text-theme-10 dark:text-theme-3">깃허브로 로그인</div>
                        </div>
                    </div>
                    <div className='w-[100%] h-[52px] text-[14px] rounded-[8px] flex flex-row justify-center items-center border border-theme-7 dark:border-theme-4'>
                        <span className='text-theme-4 dark:text-theme-9 mr-[12px]'>처음 방문하셨나요?</span>
                        <Link href="/user/register" className='text-theme-yellow dark:text-theme-blue-1 hover:underline tlg:hover:no-underline'>회원가입하기</Link>
                    </div>
                    <div className='w-[100%] flex flex-row justify-center items-center text-[12px] mt-[12px]'>
                        <Link href="/terms" target="_blank" rel="noopener noreferrer" className='text-theme-5 dark:text-theme-6 hover:underline tlg:hover:underline'>서비스 이용약관</Link>
                        <div className='text-theme-5 dark:text-theme-6 mx-[4px]'>·</div>
                        <Link href="/privacy" target="_blank" rel="noopener noreferrer" className='text-theme-5 dark:text-theme-6 hover:underline tlg:hover:underline'>개인정보처리방침</Link>
                    </div>
                </div>
            </div>

            {/* 풋터 */}
            <Footer/>
        </>
    );
}

export async function getServerSideProps(ctx: any) {
    try {
        // 필터링 쿠키 체크
        const cookieTheme = ctx.req.cookies.theme === undefined ? "dark" : ctx.req.cookies.theme;

        // 디바이스 체크
        const userAgent = ctx.req ? ctx.req.headers['user-agent'] : navigator.userAgent;

        // 유저 정보 불러오기
        const session = await getServerSession(ctx.req, ctx.res, authOptions);
        
        if (session === null || session.user === undefined) {
            return {
                props: {
                    params: {
                        theme: cookieTheme,
                        userAgent: userAgent,
                    }
                }
            }
        } else {
            return {
                redirect: {
                    destination: '/404',
                    permanent: false,
                }
            }
        }
    }
    catch (error) {
        console.log(error);
    }
}

export default Login;