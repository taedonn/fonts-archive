// next
import Link from 'next/link';
import { useRouter } from 'next/router';
import { NextSeo } from 'next-seo';

// next-auth
import { signIn } from 'next-auth/react';
import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]';

// react
import { useState, useEffect } from 'react';

// components
import Motion from '@/components/motion';
import Header from "@/components/header";
import Footer from '@/components/footer';
import Button from '@/components/button';
import TextInput from '@/components/textinput';
import KakaoAdFitLeftBanner from '@/components/kakaoAdFitLeftBanner';
import KakaoAdFitRightBanner from '@/components/kakaoAdFitRightBanner';

// common
import { onMouseDown, onMouseUp, onMouseOut } from '@/libs/common';

const Login = ({params}: any) => {
    const { theme, userAgent } = params;

    // 디바이스 체크
    const isMac: boolean = userAgent.includes("Mac OS") ? true : false;

    // 라우터
    const router = useRouter();

    // states
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
    const naverLogin = async () => { signIn("naver", { callbackUrl: history }); }
    const kakaoLogin = async () => { signIn("kakao", { callbackUrl: history }); }
    const googleLogin = async () => { signIn("google", { callbackUrl: history }); }
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
                theme={theme}
                user={null}
            />

            {/* 메인 */}
            <Motion
                initialOpacity={0}
                animateOpacity={1}
                exitOpacity={0}
                initialY={-50}
                animateY={0}
                exitY={-50}
                transitionType="spring"
            >
                <div className='w-full flex flex-col justify-center items-center'>
                    <div className='flex fixed left-0 top-36'>
                        <KakaoAdFitLeftBanner marginLeft={2}/>
                    </div>
                    <div className='flex fixed right-0 top-36'>
                        <KakaoAdFitRightBanner marginRight={2}/>
                    </div>
                    <div className='w-[22.5rem] flex flex-col justify-center items-start my-16 lg:my-24 mt-8 lg:mt-16'>
                        <h2 className='text-2xl text-l-2 dark:text-white font-bold mb-4'>로그인</h2>
                        {
                            alertDisplay &&
                                <div className='w-full h-10 px-2.5 mb-3 flex justify-between items-center rounded-lg border-2 border-h-r text-xs text-l-2 dark:text-white bg-h-r/20'>
                                    <div className='flex justify-start items-center'>
                                        <i className="text-sm text-h-r fa-regular fa-bell"></i>
                                        <div className='ml-2'>로그인에 실패했습니다.</div>
                                    </div>
                                    <div onClick={handleAlertClose} className='flex justify-center items-center cursor-pointer'>
                                        <i className="text-sm fa-solid fa-xmark"></i>
                                    </div>
                                </div>
                        }
                        <form onSubmit={e => e.preventDefault()} className='w-full p-5 mb-4 rounded-lg text-l-2 dark:text-white bg-l-e dark:bg-d-3 drop-shadow-default dark:drop-shadow-dark'>
                            <TextInput
                                onchange={handleIdChange}
                                state={idChk}
                                stateMsg={[
                                    { state: "", msg: "" },
                                    { state: "empty", msg: "아이디를 입력해 주세요." },
                                ]}
                                id='id'
                                tabindex={1}
                                placeholder='이메일을 입력해 주세요.'
                                label="아이디"
                            />
                            <label htmlFor='pw' className='w-full font-medium flex justify-between items-center ml-px mt-8'>
                                <span>비밀번호</span>
                                <Link href="/user/findpw" className='text-sm font-normal text-h-1 dark:text-f-8 hover:underline tlg:hover:no-underline'>비밀번호를 잊으셨나요?</Link>
                            </label>
                            <TextInput
                                onchange={handlePwChange}
                                state={pwChk}
                                stateMsg={[
                                    { state: "", msg: "" },
                                    { state: "empty", msg: "비밀번호를 입력해 주세요." },
                                ]}
                                type='password'
                                id='pw'
                                tabindex={2}
                                placeholder='비밀번호를 입력해 주세요.'
                                isLabeled={false}
                                marginTop={0.5}
                            />
                            <Button marginTop={1}>
                                <button onClick={handleLogin} className='w-full h-full flex justify-center items-center'>
                                    {
                                        isLoading
                                        ? <span className='loader border-2 border-h-e dark:border-d-6 border-b-h-1 dark:border-b-f-8 w-4 h-4'></span>
                                        : '로그인'
                                    }
                                </button>
                            </Button>
                        </form>
                        <div className='w-full h-14 text-sm rounded-lg mb-2.5 gap-2 flex justify-center items-center border border-l-b dark:border-d-6'>
                            <div onClick={naverLogin} onMouseDown={e => onMouseDown(e, 0.9, true)} onMouseUp={onMouseUp} onMouseOut={onMouseOut} className='w-8 h-8 rounded-md group relative flex justify-center items-center cursor-pointer bg-theme-naver'>
                                <svg className='w-3.5 fill-white' viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M16.273 12.845 7.376 0H0v24h7.726V11.156L16.624 24H24V0h-7.727v12.845Z"/></svg>
                                <div className="tooltip after:bg-theme-naver w-max absolute z-10 left-1/2 -top-11 text-sm font-medium leading-none px-3 py-2 rounded-md hidden group-hover:block tlg:group-hover:hidden group-hover:animate-zoom-in-fontbox bg-theme-naver text-l-2">네이버로 로그인</div>
                            </div>
                            <div onClick={kakaoLogin} onMouseDown={e => onMouseDown(e, 0.9, true)} onMouseUp={onMouseUp} onMouseOut={onMouseOut} className='w-8 h-8 rounded-md group relative flex justify-center items-center cursor-pointer bg-theme-kakao'>
                                <svg className='w-5 fill-black' viewBox="0 0 512 512" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M255.5 48C299.345 48 339.897 56.5332 377.156 73.5996C414.415 90.666 443.871 113.873 465.522 143.22C487.174 172.566 498 204.577 498 239.252C498 273.926 487.174 305.982 465.522 335.42C443.871 364.857 414.46 388.109 377.291 405.175C340.122 422.241 299.525 430.775 255.5 430.775C241.607 430.775 227.262 429.781 212.467 427.795C148.233 472.402 114.042 494.977 109.892 495.518C107.907 496.241 106.012 496.15 104.208 495.248C103.486 494.706 102.945 493.983 102.584 493.08C102.223 492.177 102.043 491.365 102.043 490.642V489.559C103.126 482.515 111.335 453.169 126.672 401.518C91.8486 384.181 64.1974 361.2 43.7185 332.575C23.2395 303.951 13 272.843 13 239.252C13 204.577 23.8259 172.566 45.4777 143.22C67.1295 113.873 96.5849 90.666 133.844 73.5996C171.103 56.5332 211.655 48 255.5 48Z"></path></svg>
                                <div className="tooltip after:bg-theme-kakao w-max absolute z-10 left-1/2 -top-11 text-sm font-medium leading-none px-3 py-2 rounded-md hidden group-hover:block tlg:group-hover:hidden group-hover:animate-zoom-in-fontbox bg-theme-kakao text-l-2">카카오로 로그인</div>
                            </div>
                            <div onClick={googleLogin} onMouseDown={e => onMouseDown(e, 0.9, true)} onMouseUp={onMouseUp} onMouseOut={onMouseOut} className='w-8 h-8 rounded-md group relative flex justify-center items-center cursor-pointer bg-black dark:bg-white'>
                                <svg className='w-5 fill-white' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/><path d="M1 1h22v22H1z" fill="none"/></svg>
                                <div className="tooltip after:bg-black after:dark:bg-white w-max absolute z-10 left-1/2 -top-11 text-sm font-medium leading-none px-3 py-2 rounded-md hidden group-hover:block tlg:group-hover:hidden group-hover:animate-zoom-in-fontbox bg-black dark:bg-white text-white dark:text-black">구글로 로그인</div>
                            </div>
                            <div onClick={githubLogin} onMouseDown={e => onMouseDown(e, 0.9, true)} onMouseUp={onMouseUp} onMouseOut={onMouseOut} className='w-8 h-8 rounded-md group relative flex justify-center items-center cursor-pointer bg-black dark:bg-white'>
                                <svg className='w-5 fill-white dark:fill-black' viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
                                <div className="tooltip after:bg-black after:dark:bg-white w-max absolute z-10 left-1/2 -top-11 text-sm font-medium leading-none px-3 py-2 rounded-md hidden group-hover:block tlg:group-hover:hidden group-hover:animate-zoom-in-fontbox bg-black dark:bg-white text-white dark:text-black">깃허브로 로그인</div>
                            </div>
                        </div>
                        <div className='w-full h-14 rounded-lg flex justify-center items-center border border-l-b dark:border-d-6'>
                            <span className='text-l-5 dark:text-d-c mr-3'>처음 방문하셨나요?</span>
                            <Link href="/user/register" className='text-h-1 dark:text-f-8 hover:underline tlg:hover:no-underline'>회원가입하기</Link>
                        </div>
                        <div className='w-full flex justify-center items-center text-sm mt-4 text-l-5 dark:text-d-c'>
                            <Link href="/terms" target="_blank" rel="noopener noreferrer" className='hover:underline tlg:hover:no-underline'>서비스 이용약관</Link>
                            <div className='mx-1'>·</div>
                            <Link href="/privacy" target="_blank" rel="noopener noreferrer" className='hover:underline tlg:hover:no-underline'>개인정보처리방침</Link>
                        </div>
                    </div>
                </div>
            </Motion>

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

        // 유저 정보 불러오기
        const session = await getServerSession(ctx.req, ctx.res, authOptions);
        
        if (session === null || session.user === undefined) {
            return {
                props: {
                    params: {
                        theme: theme ? theme : 'light',
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