// next
import Link from 'next/link';
import { useRouter } from 'next/router';
import { NextSeo } from 'next-seo';

// next-auth
import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]';

// react
import React, { useEffect, useState } from 'react';

// libraries
import axios from 'axios';

// components
import Header from "@/components/header";
import Footer from '@/components/footer';

const Register = ({params}: any) => {
    const { theme, userAgent } = params;

    // 디바이스 체크
    const isMac: boolean = userAgent.includes("Mac OS") ? true : false;

    const router = useRouter();

    // 폼 유효성 검사 state
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [nameChk, setNameChk] = useState<string>("");
    const [nameVal, setNameVal] = useState<string>("");
    const [idChk, setIdChk] = useState<string>("");
    const [idVal, setIdVal] = useState<string>("");
    const [pwChk, setPwChk] = useState<string>("");
    const [pwVal, setPwVal] = useState<string>("");
    const [pwConfirmChk, setPwConfirmChk] = useState<string>("");
    const [pwConfirmVal, setPwConfirmVal] = useState<string>("");
    const [termsChk, setTermsChk] = useState<boolean>(false);
    const [privacyChk, setPrivacyChk] = useState<boolean>(false);
    const [alertDisplay, setAlertDisplay] = useState<boolean>(false);

    // 뒤로가기 시 history가 남아있으면 state 변경
    useEffect(() => {
        const formName = document.getElementById('name') as HTMLInputElement;
        const formId = document.getElementById('id') as HTMLInputElement;
        const formPw = document.getElementById('pw') as HTMLInputElement;
        const formPwConfirm = document.getElementById('pw-confirm') as HTMLInputElement;
        const formTerms = document.getElementById('terms-check') as HTMLInputElement;
        const formPrivacy = document.getElementById('privacy-check') as HTMLInputElement;

        if (formName.value !== '') { setNameVal(formName.value); }
        if (formId.value !== '') { setIdVal(formId.value); }
        if (formPw.value !== '') { setPwVal(formPw.value); }
        if (formPwConfirm.value !== '') { setPwConfirmVal(formPwConfirm.value); }
        if (formTerms.checked) { setTermsChk(true); }
        if (formPrivacy.checked) { setPrivacyChk(true); }
    }, []);

    /** 폼 서밋 전 유효성 검사 */
    const handleOnSubmit = async () => {
        // 로딩 스피너 실행
        setIsLoading(true);

        // 유효성 검사
        if (await handleValidateChk()) {
            // 약관 동의 체크
            if (handleTermsAndPrivacyChk()) {
                // 약관 동의 시 Form 서밋
                await axios.post('/api/user/register', {
                    action: "register",
                    id: idVal,
                    pw: pwVal,
                    name: nameVal,
                })
                .then(async (res) => {
                    // 이메일 보내기
                    await axios.post('/api/user/register', {
                        action: "send-email",
                        id: res.data.id,
                        name: res.data.name,
                        email_token: res.data.email_token,
                    })
                    .then(res => {
                        // 이메일 토큰을 가져와 회원가입 완료 페이지로 이동
                        router.push('/user/sendemail?token=' + res.data.email_token);
                    })
                    .catch(err => {
                        console.log(err);

                        // 로딩 스피너 실행
                        setIsLoading(false);
                    });
                });
            } else {
                // 약관 미동의 시 알럿 표시
                setAlertDisplay(true);
            }
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
        // 유효성 패턴
        const emailPattern = /^[A-Za-z0-9_.-]+@[A-Za-z0-9-]+\.[A-Za-z0-9-]+/; // 이메일 패턴
        const pwPattern = /^(?=.*?[a-zA-Z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,20}$/; // 비밀번호 패턴

        // 이메일 중복 체크 state
        let isIdExists = false;

        // 이메일 중복 체크 api 호출
        await axios.get('/api/user/register', {
            params: {
                action: "check-id",
                id: idVal
            }
        })
        .then(res => {
            // 이름 유효성 검사
            if (nameVal=== '') { setNameChk('empty'); }

            // 이메일 유효성 검사
            isIdExists = res.data.check;
            if (idVal === '') { setIdChk('empty'); }
            else if (!emailPattern.test(idVal)) { setIdChk('wrong-pattern'); }
            else if (isIdExists) { setIdChk('is-used'); }

            // 비밀번호 유효성 검사
            if (pwVal === '') { setPwChk('empty'); }
            else if (!pwPattern.test(pwVal)) { setPwChk('wrong-pattern'); }

            // 비밀번호 재입력 유효성 검사
            if (pwConfirmVal === '') { setPwConfirmChk('empty'); }
            else if (pwConfirmVal !== pwVal) { setPwConfirmChk('unmatch'); }
        })
        .catch(err => console.log(err));

        // 유효성 검사 결과 return
        if (nameVal !== '' && idVal !== '' && emailPattern.test(idVal) && !isIdExists && pwVal !== '' && pwPattern.test(pwVal) && pwConfirmVal !== '' && pwConfirmVal === pwVal) { return true; } 
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

    /** 유효성 검사 후 다시 이름 입력 시 경고 메시지 해제 */
    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNameVal(e.target.value);
        setNameChk('');
    }

    /** 유효성 검사 후 다시 아이디 입력 시 경고 메시지 해제 */
    const handleIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setIdVal(e.target.value);
        setIdChk('');
    }

    /** 유효성 검사 후 다시 비밀번호 입력 시 경고 메시지 해제 */
    const handlePwChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPwVal(e.target.value);
        setPwChk('');
        setPwConfirmChk('');
    }

    /** 유효성 검사 후 다시 비밀번호 재입력 입력 시 경고 메시지 해제 */
    const handlePwConfirmChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPwConfirmVal(e.target.value);
        setPwChk('');
        setPwConfirmChk('');
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
                theme={theme}
                user={null}
            />

            {/* 메인 */}
            <div className='w-full flex flex-col justify-center items-center'>
                <div className='w-[360px] flex flex-col justify-center items-start my-[100px] tlg:my-10'>
                    <h2 className='text-xl tlg:text-lg text-theme-3 dark:text-theme-9 font-medium mb-3 tlg:mb-2'>회원가입</h2>
                    <form onSubmit={e => e.preventDefault()} id='register-form' className='w-full p-5 rounded-lg text-theme-10 dark:text-theme-9 bg-theme-5 dark:bg-theme-3 drop-shadow-default dark:drop-shadow-dark'>
                        <label htmlFor='name' className='block text-sm ml-px'>이름</label>
                        <input onChange={handleNameChange} type='text' id='name' tabIndex={1} autoComplete='on' placeholder='홍길동' className={`${nameChk === '' ? 'border-theme-4 focus:border-theme-yellow dark:border-theme-blue-2 focus:dark:border-theme-blue-1' : 'border-theme-red focus:border-theme-red dark:border-theme-red focus:dark:border-theme-red'} w-full text-sm mt-1.5 px-3.5 py-2 rounded-lg border-2 placeholder-theme-7 dark:placeholder-theme-6 bg-theme-4 dark:bg-theme-blue-2 autofill:bg-theme-4 autofill:dark:bg-theme-blue-2`}/>
                        {
                            nameChk === ''
                            ? <></>
                            : <span className='block text-xs text-theme-red mt-1 ml-4'>이름을 입력해 주세요.</span>
                        }
                        <label htmlFor='id' className='block text-sm ml-px mt-6'>이메일</label>
                        <input onChange={handleIdChange} type='text' id='id' tabIndex={2} autoComplete='on' placeholder='example@example.com' className={`${idChk === '' ? 'border-theme-4 focus:border-theme-yellow dark:border-theme-blue-2 focus:dark:border-theme-blue-1' : 'border-theme-red focus:border-theme-red dark:border-theme-red focus:dark:border-theme-red'} w-full text-sm mt-1.5 px-3.5 py-2 rounded-lg border-2 placeholder-theme-7 dark:placeholder-theme-6 bg-theme-4 dark:bg-theme-blue-2 autofill:bg-theme-4 autofill:dark:bg-theme-blue-2`}/>
                        {
                            idChk === ''
                            ? <></>
                            : ( idChk === 'empty'
                                ? <span className='block text-xs text-theme-red mt-1 ml-4'>이메일을 입력해 주세요.</span>
                                : ( idChk === 'wrong-pattern'
                                    ? <span className='block text-xs text-theme-red mt-1 ml-4'>이메일 형식이 올바르지 않습니다.</span>
                                    : ( idChk === 'is-used'
                                        ? <span className='block text-xs text-theme-red mt-1 ml-4'>이미 등록된 이메일입니다.</span>
                                        : <></>
                                    )
                                )
                            )
                        }
                        <label htmlFor='pw' className='w-full flex flex-row justify-between items-center text-sm ml-px mt-6'>비밀번호</label>
                        <input onChange={handlePwChange} type='password' id='pw' tabIndex={3} autoComplete='on' placeholder='영문, 숫자, 특수문자 포함 8~20자' className={`${pwChk === '' ? 'border-theme-4 focus:border-theme-yellow dark:border-theme-blue-2 focus:dark:border-theme-blue-1' : 'border-theme-red focus:border-theme-red dark:border-theme-red focus:dark:border-theme-red'} w-full text-sm mt-1.5 px-3.5 py-2 rounded-lg border-2 placeholder-theme-7 dark:placeholder-theme-6 bg-theme-4 dark:bg-theme-blue-2`}/>
                        {
                            pwChk === ''
                            ? <></>
                            : ( pwChk === 'empty'
                                ? <span className='block text-xs text-theme-red mt-1 ml-4'>비밀번호를 입력해 주세요.</span>
                                : <span className='block text-xs text-theme-red mt-1 ml-4'>비밀번호 형식이 올바르지 않습니다.</span>
                            )
                        }
                        <input onChange={handlePwConfirmChange} type='password' id='pw-confirm' tabIndex={4} autoComplete='on' placeholder='비밀번호 재입력' className={`${pwConfirmChk === '' ? 'border-theme-4 focus:border-theme-yellow dark:border-theme-blue-2 focus:dark:border-theme-blue-1' : 'border-theme-red focus:border-theme-red dark:border-theme-red focus:dark:border-theme-red'} w-full text-sm mt-1.5 px-3.5 py-2 rounded-lg border-2 placeholder-theme-7 dark:placeholder-theme-6 bg-theme-4 dark:bg-theme-blue-2`}/>
                        {
                            pwConfirmChk === ''
                            ? <></>
                            : ( pwConfirmChk === 'empty'
                                ? <span className='block text-xs text-theme-red mt-1 ml-4'>비밀번호를 다시 입력해 주세요.</span>
                                : <span className='block text-xs text-theme-red mt-1 ml-4'>비밀번호가 일치하지 않습니다.</span>
                            )
                        }
                        <div className='w-full h-px my-6 bg-theme-4/80 dark:bg-theme-blue-2/80'></div>
                        {
                            alertDisplay === true
                                && <div className='w-full h-8 px-2.5 mb-2 flex flex-row justify-between items-center rounded-lg border-2 border-theme-red/80 dark:border-theme-red/60 text-xs text-theme-10 dark:text-theme-9 bg-theme-red/20'>
                                    <div className='flex flex-row justify-start items-center'>
                                        <i className="text-sm text-theme-10 dark:text-theme-9 fa-solid fa-land-mine-on"></i>
                                        <div className='ml-2'>약관에 동의해 주세요.</div>
                                    </div>
                                    <div onClick={handleAlertClose} className='flex flex-row justify-center items-center cursor-pointer'>
                                        <i className="text-sm text-theme-10 dark:text-theme-9 fa-solid fa-xmark"></i>
                                    </div>
                                </div>
                        }
                        <div className='w-full flex flex-col justify-start items-start'>
                            <div className='w-full flex flex-row justify-between items-center'>
                                <div className='flex flex-row justify-start items-center'>
                                    <input onChange={handleTermsChange} type='checkbox' id='terms-check' className='hidden'/>
                                    <label htmlFor='terms-check' className='w-5 h-5 flex flex-row justify-center items-center cursor-pointer'>
                                        <i className="uncheck text-lg text-theme-yellow dark:text-theme-blue-1 fa-regular fa-square-check"></i>
                                        <i className="check text-lg text-theme-yellow dark:text-theme-blue-1 fa-solid fa-square-check"></i>
                                    </label>
                                    <p className='text-[13px] text-theme-10 dark:text-theme-9 mt-px ml-1.5'>서비스 이용약관 (필수)</p>
                                </div>
                                <Link href="/terms" target='_blank' rel="noopener noreferrer" className='text-xs text-theme-6 dark:text-theme-7 flex flex-row justify-center items-center hover:underline tlg:hover:no-underline'>전문보기</Link>
                            </div>
                            <div className='w-full flex flex-row justify-between items-center mt-2'>
                                <div className='flex flex-row justify-start items-center'>
                                    <input onChange={handlePrivacyChange} type='checkbox' id='privacy-check' className='hidden'/>
                                    <label htmlFor='privacy-check' className='w-5 h-5 flex flex-row justify-center items-center cursor-pointer'>
                                        <i className="uncheck text-lg text-theme-yellow dark:text-theme-blue-1 fa-regular fa-square-check"></i>
                                        <i className="check text-lg text-theme-yellow dark:text-theme-blue-1 fa-solid fa-square-check"></i>
                                    </label>
                                    <p className='text-[13px] text-theme-10 dark:text-theme-9 mt-px ml-1.5'>개인정보 처리방침 (필수)</p>
                                </div>
                                <Link href="/privacy" target='_blank' rel="noopener noreferrer" className='text-xs text-theme-6 dark:text-theme-7 flex flex-row justify-center items-center hover:underline tlg:hover:no-underline'>전문보기</Link>
                            </div>
                        </div>
                        <button onClick={handleOnSubmit} className='w-full h-10 rounded-lg mt-6 flex flex-row justify-center items-center text-sm font-medium text-theme-4 dark:text-theme-blue-2 bg-theme-yellow/80 hover:bg-theme-yellow tlg:hover:bg-theme-yellow/80 dark:bg-theme-blue-1/80 hover:dark:bg-theme-blue-1 tlg:hover:dark:bg-theme-blue-1/80'>
                            {
                                isLoading === true
                                ? <span className='loader loader-register w-[18px] h-[18px]'></span>
                                : '이메일 인증 후 가입하기'
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

export default Register;