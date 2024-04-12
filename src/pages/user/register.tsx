// next
import Link from 'next/link';
import { useRouter } from 'next/router';
import { NextSeo } from 'next-seo';

// next-auth
import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]';

// react
import React, { useEffect, useState } from 'react';

// components
import Motion from '@/components/motion';
import Header from "@/components/header";
import Footer from '@/components/footer';
import Button from '@/components/button';
import TextInput from '@/components/textinput';
import AdSense from '@/components/adSense';

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
                const regUrl = "/api/user/register";
                const regOptions = {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        action: "register",
                        id: idVal,
                        pw: pwVal,
                        name: nameVal,
                    })
                }
                await fetch(regUrl, regOptions)
                .then(res => res.json())
                .then(async (data) => {
                    // 이메일 보내기
                    const sendEmailUrl = "/api/user/register";
                    const sendEmailOptions = {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            action: "send-email",
                            id: data.id,
                            name: data.name,
                            email_token: data.email_token,
                        })
                    }
                    await fetch(sendEmailUrl, sendEmailOptions)
                    .then(res => res.json())
                    .then(data => {
                        // 이메일 토큰을 가져와 회원가입 완료 페이지로 이동
                        router.push('/user/sendemail?token=' + data.email_token);
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
        const url = "/api/user/register?";
        const options = {
            method: "GET",
            headers: { "Content-Type": "application/json" }
        }
        const params = {
            action: "check-id",
            id: idVal
        }
        const query = new URLSearchParams(params).toString();
        
        await fetch(url + query, options)
        .then(res => res.json())
        .then(data => {
            // 이름 유효성 검사
            if (nameVal=== '') { setNameChk('empty'); }

            // 이메일 유효성 검사
            isIdExists = data.check;
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
            <Motion
                initialOpacity={0}
                animateOpacity={1}
                exitOpacity={0}
                transitionType="spring"
            >
                <div className='w-full flex flex-col justify-center items-center text-l-2 dark:text-white'>
                    
                    {/* Google AdSense */}
                    <div className='hidden lg:flex fixed left-8 top-36'>
                        <AdSense
                            pc={{
                                style: 'display: inline-block; width: 160px; height: 600px;',
                                client: 'ca-pub-7819549426971576',
                                slot: '3299140583'
                            }}
                            mobile={{
                                style: 'display: inline-block; width: 160px; height: 600px;',
                                client: 'ca-pub-7819549426971576',
                                slot: '3299140583'
                            }}
                            marginLeft={2}
                        />
                    </div>

                    {/* Google AdSense */}
                    <div className='hidden lg:flex fixed right-8 top-36'>
                        <AdSense
                            pc={{
                                style: 'display: inline-block; width: 160px; height: 600px;',
                                client: 'ca-pub-7819549426971576',
                                slot: '3299140583'
                            }}
                            mobile={{
                                style: 'display: inline-block; width: 160px; height: 600px;',
                                client: 'ca-pub-7819549426971576',
                                slot: '3299140583'
                            }}
                            marginRight={2}
                        />
                    </div>

                    <div className='w-[22.5rem] flex flex-col justify-centert my-16 lg:my-24 mt-8 lg:mt-16'>
                        <h2 className='text-2xl font-bold mb-6'>회원가입</h2>
                        <form onSubmit={e => e.preventDefault()} id='register-form' className='w-full p-5 rounded-lg bg-l-e dark:bg-d-3 drop-shadow-default dark:drop-shadow-dark'>
                            <TextInput
                                onchange={handleNameChange}
                                state={nameChk}
                                stateMsg={[
                                    { state: "", msg: "" },
                                    { state: "empty", msg: "이름을 입력해 주세요." },
                                ]}
                                id="name"
                                tabindex={1}
                                placeholder="홍길동"
                                label="이름"
                            />
                            <TextInput
                                onchange={handleIdChange}
                                state={idChk}
                                stateMsg={[
                                    { state: "", msg: "" },
                                    { state: "empty", msg: "이메일을 입력해 주세요." },
                                    { state: "wrong-pattern", msg: "이메일 형식이 올바르지 않습니다." },
                                    { state: "is-used", msg: "이미 등록된 이메일입니다." },
                                ]}
                                id="id"
                                tabindex={2}
                                placeholder='example@example.com'
                                label="이메일"
                                marginTop={2}
                            />
                            <TextInput
                                onchange={handlePwChange}
                                state={pwChk}
                                stateMsg={[
                                    { state: "", msg: "" },
                                    { state: "empty", msg: "비밀번호를 입력해 주세요." },
                                    { state: "wrong-pattern", msg: "비밀번호 형식이 올바르지 않습니다." },
                                ]}
                                type="password"
                                id="pw"
                                tabindex={3}
                                placeholder='영문, 숫자, 특수문자 포함 8~20자'
                                label="비밀번호"
                                marginTop={2}
                            />
                            <TextInput
                                onchange={handlePwConfirmChange}
                                state={pwConfirmChk}
                                stateMsg={[
                                    { state: "", msg: "" },
                                    { state: "empty", msg: "비밀번호를 다시 입력해 주세요." },
                                    { state: "unmatch", msg: "비밀번호가 일치하지 않습니다." },
                                ]}
                                type="password"
                                id="pw-confirm"
                                tabindex={4}
                                placeholder='비밀번호 재입력'
                                isLabeled={false}
                                marginTop={0.5}
                            />
                            <div className='w-full h-px my-6 bg-l-b dark:bg-d-6'></div>
                            {
                                alertDisplay === true
                                    && <div className='w-full h-10 px-2.5 mb-3 flex justify-between items-center rounded-lg border-2 border-h-r text-xs bg-h-r/20'>
                                        <div className='flex items-center'>
                                            <i className="text-sm text-h-r fa-regular fa-bell"></i>
                                            <div className='ml-2'>약관에 동의해 주세요.</div>
                                        </div>
                                        <div onClick={handleAlertClose} className='flex justify-center items-center cursor-pointer'>
                                            <i className="text-sm fa-solid fa-xmark"></i>
                                        </div>
                                    </div>
                            }
                            <div className='w-full flex flex-col'>
                                <div className='w-full flex justify-between items-center'>
                                    <div className='flex items-center'>
                                        <input onChange={handleTermsChange} type='checkbox' id='terms-check' className='peer hidden'/>
                                        <label htmlFor='terms-check' className='group w-5 h-5 text-lg flex justify-center items-center cursor-pointer'>
                                            <i className="block peer-checked:group-[]:hidden text-h-1 dark:text-f-8 fa-regular fa-square-check"></i>
                                            <i className="hidden peer-checked:group-[]:block text-h-1 dark:text-f-8 fa-solid fa-square-check"></i>
                                        </label>
                                        <p className='text-sm ml-1.5'>서비스 이용약관 (필수)</p>
                                    </div>
                                    <Link href="/terms" target='_blank' rel="noopener noreferrer" className='text-xs text-l-6 dark:text-d-c flex justify-center items-center lg:hover:underline'>전문보기</Link>
                                </div>
                                <div className='w-full flex justify-between items-center mt-2'>
                                    <div className='flex items-center'>
                                        <input onChange={handlePrivacyChange} type='checkbox' id='privacy-check' className='peer hidden'/>
                                        <label htmlFor='privacy-check' className='group w-5 h-5 text-lg flex justify-center items-center cursor-pointer'>
                                            <i className="block peer-checked:group-[]:hidden text-h-1 dark:text-f-8 fa-regular fa-square-check"></i>
                                            <i className="hidden peer-checked:group-[]:block text-h-1 dark:text-f-8 fa-solid fa-square-check"></i>
                                        </label>
                                        <p className='text-sm ml-1.5'>개인정보 처리방침 (필수)</p>
                                    </div>
                                    <Link href="/privacy" target='_blank' rel="noopener noreferrer" className='text-xs text-l-6 dark:text-d-c flex justify-center items-center lg:hover:underline'>전문보기</Link>
                                </div>
                            </div>
                            
                            <Button marginTop={1}>
                                <button onClick={handleOnSubmit} className='w-full h-full flex justify-center items-center'>
                                    {
                                        isLoading
                                        ? <span className='loader border-2 border-h-e dark:border-d-6 border-b-h-1 dark:border-b-f-8 w-4 h-4'></span>
                                        : '이메일 인증 후 가입하기'
                                    }
                                </button>
                            </Button>
                        </form>
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

export default Register;