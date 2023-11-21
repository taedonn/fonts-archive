// next hooks
import Link from 'next/link';
import { NextSeo } from 'next-seo';

// react hooks
import React, { useState, useEffect } from 'react';

// hooks
import axios from 'axios';

// components
import Header from "@/components/header";

const FindPw = ({params}: any) => {
    // 디바이스 체크
    const isMac: boolean = params.userAgent.includes("Mac OS") ? true : false;

    // 빈 함수
    const emptyFn = () => { return; }

    // 폼 state
    const [nameVal, setNameVal] = useState<string>('');
    const [nameChk, setNameChk] = useState<string>('');
    const [idVal, setIdVal] = useState<string>('');
    const [idChk, setIdChk] = useState<string>('');
    const [alertDisplay, setAlertDisplay] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    // 뒤로가기 시 history가 남아있으면 state 변경
    useEffect(() => {
        const formName = document.getElementById('name') as HTMLInputElement;
        const formId = document.getElementById('id') as HTMLInputElement;
        if (formName.value !== '') { setNameVal(formName.value); }
        if (formId.value !== '') { setIdVal(formId.value); }
    }, []);

    // 이름 체인지 이벤트
    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => { setNameChk(''); setNameVal(e.target.value); }

    // 아이디 체인지 이벤트
    const handleIdChange = (e: React.ChangeEvent<HTMLInputElement>) => { setIdChk(''); setIdVal(e.target.value); }

    /** 폼 서밋 */
    const handleOnSubmit = async () => {
        // 로딩 스피너 실행 
        setIsLoading(true);

        if (nameVal === '') {
            setNameChk('empty');
        } else if (idVal === '') {
            setIdChk('empty');
        } else {
            await axios
            .post('/api/user/findpw', {
                id: idVal,
                name: nameVal,
            })
            .then(res => {
                if (res.data.valid === 'wrong-name') { setNameChk('wrong-name'); }
                else if (res.data.valid === 'wrong-id') { setIdChk('wrong-id'); }
                else { setAlertDisplay(true); }
            })
            .catch(err => console.log(err));
        }

        // 로딩 스피너 정지 
        setIsLoading(false);
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

    /** 알럿창 닫기 */
    const handleAlertClose = () => { setAlertDisplay(false); }

    return (
        <>
            {/* Head 부분*/}
            <NextSeo 
                title={"비밀번호 찾기 · 폰트 아카이브"}
                description={"비밀번호 찾기 - 폰트 아카이브 · 상업용 무료 한글 폰트 저장소"}
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
                    <h2 className='text-[20px] tlg:text-[18px] text-theme-3 dark:text-theme-9 font-medium mb-[12px] tlg:mb-[8px]'>비밀번호 찾기</h2>
                    {
                        alertDisplay === true
                        ? <>
                            <div className='w-[100%] h-[40px] px-[10px] mb-[10px] flex flex-row justify-between items-center rounded-[6px] border-[2px] border-theme-yellow dark:border-theme-blue-1/80 text-[12px] text-theme-3 dark:text-theme-9 bg-theme-yellow/40 dark:bg-theme-blue-1/20'>
                                <div className='flex flex-row justify-start items-center'>
                                    <svg className='w-[14px] fill-theme-yellow dark:fill-theme-blue-1/80' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/><path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/></svg>
                                    <div className='ml-[6px]'>이메일로 임시 비밀번호가 발급되었습니다. <Link href="/user/login" className='ml-[8px] text-theme-yellow dark:text-theme-blue-1 hover:underline tlg:hover:no-underline'>로그인 하기</Link></div>
                                </div>
                                <div onClick={handleAlertClose} className='flex flex-row justify-center items-center cursor-pointer'>
                                    <svg className='w-[18px] fill-theme-3 dark:fill-theme-9' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/></svg>
                                </div>
                            </div>
                        </>
                        : <></>
                    }
                    <form onSubmit={e => e.preventDefault()} className='w-[100%] p-[20px] rounded-[8px] text-theme-10 dark:text-theme-9 bg-theme-5 dark:bg-theme-3 drop-shadow-default dark:drop-shadow-dark'>
                        <label htmlFor='name' className='block text-[14px] ml-px'>이름</label>
                        <input onChange={handleNameChange} type='text' id='name' tabIndex={1} autoComplete='on' placeholder='홍길동' className={`${nameChk === '' ? 'border-theme-4 focus:border-theme-yellow dark:border-theme-blue-2 focus:dark:border-theme-blue-1' : 'border-theme-red focus:border-theme-red dark:border-theme-red focus:dark:border-theme-red'} w-[100%] text-[14px] mt-[6px] px-[14px] py-[8px] rounded-[8px] border-[2px] placeholder-theme-7 dark:placeholder-theme-6 bg-theme-4 dark:bg-theme-blue-2 autofill:bg-theme-4 autofill:dark:bg-theme-blue-2`}/>
                        {
                            nameChk === 'empty'
                            ? <span className='block text-[12px] text-theme-red mt-[4px] ml-[16px]'>이름을 입력해 주세요.</span>
                            : ( nameChk === 'wrong-name'
                                ? <span className='block text-[12px] text-theme-red mt-[4px] ml-[16px]'>이름이 아이디와 일치하지 않습니다.</span>
                                : <></>
                            )
                        }
                        <label htmlFor='id' className='block text-[14px] mt-[18px] ml-px'>아이디</label>
                        <input onChange={handleIdChange} type='text' id='id' tabIndex={2} autoComplete='on' placeholder='이메일을 입력해 주세요.' className={`${idChk === '' ? 'border-theme-4 focus:border-theme-yellow dark:border-theme-blue-2 focus:dark:border-theme-blue-1' : 'border-theme-red focus:border-theme-red dark:border-theme-red focus:dark:border-theme-red'} w-[100%] text-[14px] mt-[6px] px-[14px] py-[8px] rounded-[8px] border-[2px] placeholder-theme-7 dark:placeholder-theme-6 bg-theme-4 dark:bg-theme-blue-2 autofill:bg-theme-4 autofill:dark:bg-theme-blue-2`}/>
                        {
                            idChk === 'empty'
                            ? <span className='block text-[12px] text-theme-red mt-[4px] ml-[16px]'>아이디를 입력해 주세요.</span>
                            : ( idChk === 'wrong-id'
                                ? <span className='block text-[12px] text-theme-red mt-[4px] ml-[16px]'>조회된 아이디가 없습니다.</span>
                                : <></>
                            )
                        }
                        <button onClick={handleOnSubmit} className='w-[100%] h-[40px] rounded-[8px] mt-[14px] text-[14px] font-medium text-theme-4 dark:text-theme-blue-2 bg-theme-yellow/80 hover:bg-theme-yellow tlg:hover:bg-theme-yellow/80 dark:bg-theme-blue-1/80 hover:dark:bg-theme-blue-1 tlg:hover:dark:bg-theme-blue-1/80'>
                            {
                                isLoading === true
                                ? <span className='loader loader-register w-[18px] h-[18px] mt-[4px]'></span>
                                : '다음'
                            }
                        </button>
                    </form>
                    <div className='w-[100%] flex flex-row justify-center items-center text-[12px] mt-[12px]'>
                        <Link href="/user/terms" target="_blank" rel="noopener noreferrer" className='text-theme-5 dark:text-theme-6 hover:underline tlg:hover:underline'>서비스 이용약관</Link>
                        <div className='text-theme-5 dark:text-theme-6 mx-[4px]'>·</div>
                        <Link href="/user/privacy" target="_blank" rel="noopener noreferrer" className='text-theme-5 dark:text-theme-6 hover:underline tlg:hover:underline'>개인정보처리방침</Link>
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

export default FindPw;