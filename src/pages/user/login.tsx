// next hooks
import Link from 'next/link';
import { NextSeo } from 'next-seo';

// react hooks
import { useState, useEffect } from 'react';

// hooks
import axios from 'axios';
import { useCookies } from 'react-cookie';

// components
import Header from "@/components/header";

const Login = ({params}: any) => {
    // 쿠키 훅
    const [, setCookie] = useCookies<string>([]);

    // 디바이스 체크
    const isMac: boolean = params.userAgent.includes("Mac OS") ? true : false;

    // 빈 함수
    const emptyFn = () => { return; }

    // 폼 state
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [idVal, setIdVal] = useState<string>('');
    const [idChk, setIdChk] = useState<string>('');
    const [pwVal, setPwVal] = useState<string>('');
    const [pwChk, setPwChk] = useState<string>('');
    const [emailConfirmChk, setEmailConfirmChk] = useState<boolean>(true);
    const [history, setHistory] = useState<string>('/');

    // 뒤로가기 시 history가 남아있으면 state 변경
    useEffect(() => {
        const formId = document.getElementById('id') as HTMLInputElement;
        const formPw = document.getElementById('pw') as HTMLInputElement;
        const formStayLoggedIn = document.getElementById('stay-logged-in') as HTMLInputElement;

        if (formId.value !== '') { setIdVal(formId.value); }
        if (formPw.value !== '') { setPwVal(formPw.value); }
        setStayLoggedIn(formStayLoggedIn.checked);

        // 세션 스토리지의 history 불러오기
        setHistory(sessionStorage.getItem("login_history") ? sessionStorage.getItem("login_history") as string : '/');
    }, []);

    // 아이디 입력 시 state에 저장
    const handleIdChange = (e: React.ChangeEvent<HTMLInputElement>) => { setIdChk(''); setIdVal(e.target.value); }

    // 비밀번호 입력 시 state에 저장
    const handlePwChange = (e: React.ChangeEvent<HTMLInputElement>) => { setPwChk(''); setPwVal(e.target.value); }

    // 로그인 상태 유지하기 state
    const [stayLoggedIn, setStayLoggedIn] = useState<boolean>(false);

    /** 로그인 상태 유지하기 */
    const handleStayLoggedIn = (e: React.ChangeEvent<HTMLInputElement>) => {
        setStayLoggedIn(e.target.checked);
    }

    // 로그인 버튼 클릭
    const handleLogin = async () => {
        // 폼 유효성 검사
        if (idVal === '') { setIdChk('empty'); }
        else if (pwVal === '') { setPwChk('empty'); }
        else {
            // 로딩 스피너 실행
            setIsLoading(true);

            // 유효성 검사 성공 시, 로그인 API 실행
            await axios.get('/api/user/login', {
                params: {
                    id: idVal,
                    pw: pwVal,
                }
            })
            .then(res => {
                if (res.data.status === 'wrong-id') {
                    // "아이디가 존재하지 않습니다." 표시
                    setIdChk('wrong-id');

                    // 로딩 스피너 정지
                    setIsLoading(false);
                }
                else if (res.data.status === 'wrong-pw') {
                    // "비밀번호가 올바르지 않습니다." 표시
                    setPwChk('wrong-pw');

                    // 로딩 스피너 정지
                    setIsLoading(false);
                }
                else if (res.data.status === 'not-confirmed') {
                    // "이메일 인증을 완료해 주세요." 표시
                    setEmailConfirmChk(false);

                    // 로딩 스피너 정지
                    setIsLoading(false);
                }
                else if (res.data.status === 'success') {
                    // 쿠키 유효 기간 설정
                    if (stayLoggedIn) {
                        const expires = new Date();
                        expires.setFullYear(expires.getFullYear() + 1);
                        setCookie('session', res.data.session, {path:'/', expires: expires, secure:true, sameSite:'none'});
                    } else {
                        setCookie('session', res.data.session, {path:'/', secure:true, sameSite:'none'});
                    }

                    // 세션 스토리지가 저장되어 있으면, 해당 페이지로 이동
                    sessionStorage.removeItem("login_history");
                    location.href = history as string; // 이전 페이지로 이동
                }
            })
            .catch(err => {
                console.log(err);

                // 로딩 스피너 실행
                setIsLoading(false);
            });
        }
    }

    // 엔터키 입력 시 가입하기 버튼 클릭
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

    /** 알럿창 닫기 */
    const handleAlertClose = () => { setEmailConfirmChk(true); }

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
                user={null}
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
            <div className='w-[100%] flex flex-col justify-center items-center'>
                <div className='w-[360px] flex flex-col justify-center items-start my-[100px] tlg:my-[40px]'>
                    <h2 className='text-[20px] tlg:text-[18px] text-theme-4 dark:text-theme-9 font-medium mb-[12px] tlg:mb-[8px]'>로그인</h2>
                    <form onSubmit={e => e.preventDefault()} className='w-[100%] p-[20px] rounded-[8px] text-theme-10 dark:text-theme-9 bg-theme-5 dark:bg-theme-3 drop-shadow-default dark:drop-shadow-dark'>
                        <label htmlFor='id' className='block text-[14px] ml-px'>아이디</label>
                        <input onChange={handleIdChange} type='text' id='id' tabIndex={1} autoComplete='on' placeholder='이메일을 입력해 주세요.' className={`${idChk === '' ? 'border-theme-4 focus:border-theme-yellow dark:border-theme-blue-2 focus:dark:border-theme-blue-1' : 'border-theme-red focus:border-theme-red dark:border-theme-red focus:dark:border-theme-red'} w-[100%] text-[14px] mt-[6px] px-[14px] py-[8px] rounded-[8px] border-[2px] placeholder-theme-7 dark:placeholder-theme-6 bg-theme-4 dark:bg-theme-blue-2 autofill:bg-theme-4 autofill:dark:bg-theme-blue-2`}/>
                        {
                            idChk === ''
                            ? <></>
                            : ( idChk === 'empty'
                                ? <span className='block text-[12px] text-theme-red mt-[4px] ml-[16px]'>아이디를 입력해 주세요.</span>
                                : <span className='block text-[12px] text-theme-red mt-[4px] ml-[16px]'>아이디가 존재하지 않습니다.</span>
                            )
                        }
                        <label htmlFor='pw' className='w-[100%] flex flex-row justify-between items-center text-[14px] ml-px mt-[18px]'>
                            <span>비밀번호</span>
                            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
                            <a href="/user/findpw" className='text-[12px] text-theme-yellow dark:text-theme-blue-1 hover:underline tlg:hover:no-underline'>비밀번호를 잊으셨나요?</a>
                        </label>
                        <input onChange={handlePwChange} type='password' id='pw' tabIndex={2} autoComplete='on' placeholder='비밀번호를 입력해 주세요.' className={`${pwChk === '' ? 'border-theme-4 focus:border-theme-yellow dark:border-theme-blue-2 focus:dark:border-theme-blue-1' : 'border-theme-red focus:border-theme-red dark:border-theme-red focus:dark:border-theme-red'} w-[100%] text-[14px] mt-[6px] px-[14px] py-[8px] rounded-[8px] border-[2px] placeholder-theme-7 dark:placeholder-theme-6 bg-theme-4 dark:bg-theme-blue-2`}/>
                        {
                            pwChk === ''
                            ? <></>
                            : ( pwChk === 'empty'
                                ? <span className='block text-[12px] text-theme-red mt-[4px] ml-[16px]'>비밀번호를 입력해 주세요.</span>
                                : <span className='block text-[12px] text-theme-red mt-[4px] ml-[16px]'>비밀번호가 올바르지 않습니다.</span>
                            )
                        }
                        {
                            emailConfirmChk === false
                            ? <>
                                <div className='w-[100%] h-[40px] px-[10px] mt-[8px] flex flex-row justify-between items-center rounded-[6px] border-[2px] border-theme-red/80 dark:border-theme-red/60 text-[12px] text-theme-10 dark:text-theme-9 bg-theme-red/20'>
                                    <div className='flex flex-row justify-start items-center'>
                                        <svg className='w-[14px] fill-theme-red/80 dark:fill-theme-red/60' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/><path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/></svg>
                                        <div className='ml-[6px]'>이메일 인증을 완료해 주세요.</div>
                                    </div>
                                    <div onClick={handleAlertClose} className='flex flex-row justify-center items-center cursor-pointer'>
                                        <svg className='w-[18px] fill-theme-10 dark:fill-theme-9' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/></svg>
                                    </div>
                                </div>
                            </>
                            : <></>
                        }
                        <label htmlFor='stay-logged-in' className="flex items-center mt-[8px] ml-[2px] fill-theme-yellow dark:fill-theme-blue-1 text-theme-8 dark:text-theme-7 cursor-pointer">
                            <input onChange={handleStayLoggedIn} type='checkbox' id='stay-logged-in' className='hidden peer'/>
                            <svg className="block peer-checked:hidden w-[15px]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
                                <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/>
                                <path d="M10.97 4.97a.75.75 0 0 1 1.071 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.235.235 0 0 1 .02-.022z"/>
                            </svg>
                            <svg className="hidden peer-checked:block w-[15px]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
                                <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm10.03 4.97a.75.75 0 0 1 .011 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.75.75 0 0 1 1.08-.022z"/>
                            </svg>
                            <div className="text-[13px] ml-[6px] mt-[2px]">로그인 상태 유지하기</div>
                        </label>
                        <button onClick={handleLogin} className='w-[100%] h-[40px] flex flex-row justify-center items-center rounded-[8px] mt-[16px] text-[14px] font-medium text-theme-4 dark:text-theme-blue-2 bg-theme-yellow/80 hover:bg-theme-yellow tlg:hover:bg-theme-yellow/80 dark:bg-theme-blue-1/80 hover:dark:bg-theme-blue-1 tlg:hover:dark:bg-theme-blue-1/80'>
                            {
                                isLoading === true
                                ? <span className='loader loader-register w-[18px] h-[18px]'></span>
                                : '로그인'
                            }
                        </button>
                    </form>
                    <div className='w-[100%] h-[52px] flex flex-row justify-center items-center mt-[16px] text-[14px] rounded-[8px] border border-theme-7 dark:border-theme-4'>
                        <span className='text-theme-4 dark:text-theme-9 mr-[12px]'>처음 방문하셨나요?</span>
                        {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
                        <a href="/user/register" className='text-theme-yellow dark:text-theme-blue-1 hover:underline tlg:hover:no-underline'>회원가입하기</a>
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

        // 세션ID 쿠키 제거
        ctx.res.setHeader('Set-Cookie', [`session=deleted; max-Age=0; path=/`]);
        
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