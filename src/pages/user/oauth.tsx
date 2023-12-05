// next hooks
import Link from 'next/link';
import { useRouter } from 'next/router';
import { NextSeo } from 'next-seo';

// next-auth
import { verifyAccessToken } from '../api/auth/oauth';

// react hooks
import React, { useEffect, useState } from 'react';

// hooks
import axios from 'axios';

// components
import Header from "@/components/header";
import Footer from '@/components/footer';

const Register = ({params}: any) => {
    // 디바이스 체크
    const isMac: boolean = params.userAgent.includes("Mac OS") ? true : false;

    // 빈 함수
    const emptyFn = () => { return; }

    const router = useRouter();
    const user = params.user;

    // 폼 유효성 검사 state
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [termsChk, setTermsChk] = useState<boolean>(false);
    const [privacyChk, setPrivacyChk] = useState<boolean>(false);
    const [mainAlertDisplay, setMainAlertDisplay] = useState<string>("");
    const [alertDisplay, setAlertDisplay] = useState<boolean>(false);

    // 뒤로가기 시 history가 남아있으면 state 변경
    useEffect(() => {
        const formTerms = document.getElementById('terms-check') as HTMLInputElement;
        const formPrivacy = document.getElementById('privacy-check') as HTMLInputElement;

        if (formTerms.checked) { setTermsChk(true); }
        if (formPrivacy.checked) { setPrivacyChk(true); }
    }, []);

    /** 폼 서밋 전 유효성 검사 */
    const handleOnSubmit = async () => {
        const email = document.getElementById("id") as HTMLInputElement;
        const name = document.getElementById("name") as HTMLInputElement;

        // 로딩 스피너 실행
        setIsLoading(true);

        // 유효성 검사
        if (email.value === "" || name.value === "") {
            setMainAlertDisplay("token-expired");
        }
        else if (handleTermsAndPrivacyChk()) { // 약관 체크 검사
            if (await handleValidateChk()) {
                // Form 서밋
                await axios.post('/api/auth/oauth', {
                    action: "register",
                    id: user.email,
                    name: user.name,
                    image: user.image,
                })
                .then(res => {
                    // 회원가입 완료 페이지로 이동
                    router.push(`/confirm?token=${res.data.emailToken}`);
                })
                .catch(err => {
                    console.log(err);
                    setIsLoading(false);
                });
            } else { // 아이디 중복 알럿
                setMainAlertDisplay("invalid-id");
                setIsLoading(false);
            }
        } else { // 약관 미동의 시 알럿 표시
            setAlertDisplay(true);
            setIsLoading(false);
        }
    }

    // 엔터키 입력 시 가입하기 버튼 클릭
    useEffect(() => {
        const keys: any = [];
        const handleKeydown = (e: KeyboardEvent) => { keys[e.key] = true; if (keys["Enter"]) { handleOnSubmit(); } }
        const handleKeyup = (e: KeyboardEvent) => {keys[e.key] = false;}

        window.addEventListener("keydown", handleKeydown, false);
        window.addEventListener("keyup", handleKeyup, false);
        return () => {
            window.removeEventListener("keydown", handleKeydown);
            window.removeEventListener("keyup", handleKeyup);
        }
    });

    /** 유효성 검사 */
    const handleValidateChk = async () => {
        // 이메일 중복 체크 state
        let isIdExists = false;

        // 이메일 중복 체크 api 호출
        await axios.get('/api/auth/oauth', {
            params: {
                action: "check-id",
                id: user.name,
            }
        })
        .then(res => {
            // 이메일 유효성 검사
            isIdExists = res.data.check;
        })
        .catch(err => console.log(err));

        // 유효성 검사 결과 return
        if (!isIdExists) { return true; } 
        else {
            setIsLoading(false);
            return false;
        }
    }

    /** 약관 동의 체크 */
    const handleTermsAndPrivacyChk = () => {
        if (termsChk && privacyChk) {
            setAlertDisplay(false);
            return true;
        }
        else {
            setAlertDisplay(true);
            setIsLoading(false);
            return false;
        }
    }

    /** 서비스 이용약관 체크 이벤트 */
    const handleTermsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) { setTermsChk(true); }
        else { setTermsChk(false); }
    }

    /** 개인정보 처리방침 체크 이벤트 */
    const handlePrivacyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) { setPrivacyChk(true); }
        else { setPrivacyChk(false); }
    }

    /** 아이디 중복 알럿창 닫기 */
    const handleMainAlertClose = () => { setMainAlertDisplay(""); }
    
    /** 알럿창 닫기 */
    const handleAlertClose = () => { setAlertDisplay(false); }

    return (
        <>
            {/* Head 부분*/}
            <NextSeo 
                title={"회원가입 · 폰트 아카이브"}
                description={"회원가입 - 폰트 아카이브 · 상업용 무료 한글 폰트 저장소"}
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
                <div className='w-[360px] flex flex-col justify-center items-start my-[100px] tlg:my-[40px] mb-[40px]'>
                    <h2 className='text-[20px] tlg:text-[18px] text-theme-3 dark:text-theme-9 font-medium'>회원가입</h2>
                    <h3 className='text-[14px] mt-[4px] mb-[12px] text-theme-3 dark:text-theme-7'>약관에 동의하시면 회원가입이 완료됩니다.</h3>
                    {
                        mainAlertDisplay === "invalid-id"
                            ? <div className='w-[100%] h-[32px] px-[10px] mb-[8px] flex flex-row justify-between items-center rounded-[6px] border-[2px] border-theme-red/80 dark:border-theme-red/60 text-[12px] text-theme-10 dark:text-theme-9 bg-theme-red/20'>
                                <div className='flex flex-row justify-start items-center'>
                                    <svg className='w-[14px] fill-theme-red/80 dark:fill-theme-red/60' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/><path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/></svg>
                                    <div className='ml-[6px]'>아이디가 이미 등록되어 있습니다 (SNS 로그인 포함)</div>
                                </div>
                                <div onClick={handleMainAlertClose} className='flex flex-row justify-center items-center cursor-pointer'>
                                    <svg className='w-[18px] fill-theme-10 dark:fill-theme-9' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/></svg>
                                </div>
                            </div>
                            : mainAlertDisplay === "token-expired"
                                ? <div className='w-[100%] h-[32px] px-[10px] mb-[8px] flex flex-row justify-between items-center rounded-[6px] border-[2px] border-theme-red/80 dark:border-theme-red/60 text-[12px] text-theme-10 dark:text-theme-9 bg-theme-red/20'>
                                    <div className='flex flex-row justify-start items-center'>
                                        <svg className='w-[14px] fill-theme-red/80 dark:fill-theme-red/60' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/><path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/></svg>
                                        <div className='ml-[6px]'>세션이 만료되었습니다. 다시 시도해 주세요.</div>
                                    </div>
                                    <div onClick={handleMainAlertClose} className='flex flex-row justify-center items-center cursor-pointer'>
                                        <svg className='w-[18px] fill-theme-10 dark:fill-theme-9' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/></svg>
                                    </div>
                                </div>
                                : <></>
                    }
                    <form onSubmit={e => e.preventDefault()} id='register-form' className='w-[100%] p-[20px] rounded-[8px] text-theme-10 dark:text-theme-9 bg-theme-5 dark:bg-theme-3 drop-shadow-default dark:drop-shadow-dark'>
                        <label htmlFor='name' className='block text-[14px] ml-px'>이름</label>
                        <input type='text' id='name' tabIndex={1} placeholder='홍길동' defaultValue={user.name} disabled className={`w-[100%] text-[14px] mt-[6px] px-[14px] py-[8px] rounded-[8px] border-[2px] text-theme-7 dark:text-theme-6 placeholder-theme-7 dark:placeholder-theme-6 border-theme-4 dark:border-theme-2 bg-theme-4 dark:bg-theme-2`}/>
                        <label htmlFor='id' className='block text-[14px] ml-px mt-[24px]'>이메일</label>
                        <input type='text' id='id' tabIndex={2} placeholder='example@example.com' defaultValue={user.email} disabled className={`w-[100%] text-[14px] mt-[6px] px-[14px] py-[8px] rounded-[8px] border-[2px] text-theme-7 dark:text-theme-6 placeholder-theme-7 dark:placeholder-theme-6 border-theme-4 dark:border-theme-2 bg-theme-4 dark:bg-theme-2`}/>
                        <div className='w-[100%] h-px my-[24px] bg-theme-4/80 dark:bg-theme-blue-2/80'></div>
                        {
                            alertDisplay === true
                            ? <>
                                <div className='w-[100%] h-[32px] px-[10px] mb-[8px] flex flex-row justify-between items-center rounded-[6px] border-[2px] border-theme-red/80 dark:border-theme-red/60 text-[12px] text-theme-10 dark:text-theme-9 bg-theme-red/20'>
                                    <div className='flex flex-row justify-start items-center'>
                                        <svg className='w-[14px] fill-theme-red/80 dark:fill-theme-red/60' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/><path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/></svg>
                                        <div className='ml-[6px]'>약관에 동의해 주세요.</div>
                                    </div>
                                    <div onClick={handleAlertClose} className='flex flex-row justify-center items-center cursor-pointer'>
                                        <svg className='w-[18px] fill-theme-10 dark:fill-theme-9' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/></svg>
                                    </div>
                                </div>
                            </>
                            : <></>
                        }
                        <div className='w-[100%] flex flex-col justify-start items-start'>
                            <div className='w-[100%] flex flex-row justify-between items-center'>
                                <div className='flex flex-row justify-start items-center'>
                                    <input onChange={handleTermsChange} type='checkbox' id='terms-check' className='hidden'/>
                                    <label htmlFor='terms-check' className='w-[20px] h-[20px] flex flex-row justify-center items-center cursor-pointer'>
                                        <svg className='uncheck w-[16px] fill-theme-yellow dark:fill-theme-blue-1' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/><path d="M10.97 4.97a.75.75 0 0 1 1.071 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.235.235 0 0 1 .02-.022z"/></svg>
                                        <svg className='check w-[16px] fill-theme-yellow dark:fill-theme-blue-1' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm10.03 4.97a.75.75 0 0 1 .011 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.75.75 0 0 1 1.08-.022z"/></svg>
                                    </label>
                                    <p className='text-[13px] text-theme-10 dark:text-theme-9 mt-px ml-[6px]'>서비스 이용약관 (필수)</p>
                                </div>
                                <Link href="/terms" target='_blank' rel="noopener noreferrer" className='text-[12px] text-theme-8 dark:text-theme-7 flex flex-row justify-center items-center hover:underline tlg:hover:no-underline'>전문보기</Link>
                            </div>
                            <div className='w-[100%] flex flex-row justify-between items-center mt-[8px]'>
                                <div className='flex flex-row justify-start items-center'>
                                    <input onChange={handlePrivacyChange} type='checkbox' id='privacy-check' className='hidden'/>
                                    <label htmlFor='privacy-check' className='w-[20px] h-[20px] flex flex-row justify-center items-center cursor-pointer'>
                                        <svg className='uncheck w-[16px] fill-theme-yellow dark:fill-theme-blue-1' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/><path d="M10.97 4.97a.75.75 0 0 1 1.071 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.235.235 0 0 1 .02-.022z"/></svg>
                                        <svg className='check w-[16px] fill-theme-yellow dark:fill-theme-blue-1' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm10.03 4.97a.75.75 0 0 1 .011 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.75.75 0 0 1 1.08-.022z"/></svg>
                                    </label>
                                    <p className='text-[13px] text-theme-10 dark:text-theme-9 mt-px ml-[6px]'>개인정보 처리방침 (필수)</p>
                                </div>
                                <Link href="/privacy" target='_blank' rel="noopener noreferrer" className='text-[12px] text-theme-8 dark:text-theme-7 flex flex-row justify-center items-center hover:underline tlg:hover:no-underline'>전문보기</Link>
                            </div>
                        </div>
                        <button onClick={handleOnSubmit} className='w-[100%] h-[40px] rounded-[8px] mt-[24px] flex flex-row justify-center items-center text-[14px] font-medium text-theme-4 dark:text-theme-blue-2 bg-theme-yellow/80 hover:bg-theme-yellow tlg:hover:bg-theme-yellow/80 dark:bg-theme-blue-1/80 hover:dark:bg-theme-blue-1 tlg:hover:dark:bg-theme-blue-1/80'>
                            {
                                isLoading === true
                                ? <span className='loader loader-register w-[18px] h-[18px]'></span>
                                : '가입하기'
                            }
                        </button>
                    </form>
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

        // refreshToken 제거
        ctx.res.setHeader('Set-Cookie', [`refreshToken=; max-Age=0; path=/`]);

        // accessToken
        const token = ctx.query.token;

        if (token === null || token === "") {
            return {
                redirect: {
                    destination: '/404',
                    permanent: false,
                }
            }
        } else {
            const user = await verifyAccessToken(token);

            return {
                props: {
                    params: {
                        theme: cookieTheme,
                        userAgent: userAgent,
                        user: JSON.parse(JSON.stringify(user)),
                    }
                }
            }
        }
    }
    catch (error) {
        console.log(error);
    }
}

export default Register;