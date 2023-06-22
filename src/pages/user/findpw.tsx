// next hooks
import Link from 'next/link';
import { NextSeo } from 'next-seo';

// react hooks
import React, { useState, useEffect } from 'react';

// hooks
import axios from 'axios';

// components
import Header from "@/components/header";

const SendEmail = ({params}: any) => {
    // 디바이스 체크
    const isMac: boolean = params.userAgent.includes("Mac OS") ? true : false;

    // 빈 함수
    const emptyFn = () => { return; }

    // 폼 state
    const [nameVal, setNameVal] = useState<string>('');
    const [nameChk, setNameChk] = useState<string>('');
    const [idVal, setIdVal] = useState<string>('');
    const [idChk, setIdChk] = useState<string>('');

    // 뒤로가기 시 history가 남아있으면 state 변경
    useEffect(() => {
        const formName = document.getElementById('name') as HTMLInputElement;
        const formId = document.getElementById('id') as HTMLInputElement;
        if (formName.value !== '') { setIdVal(formName.value); }
        if (formId.value !== '') { setIdVal(formId.value); }
    }, []);

    // 이름 체인지 이벤트
    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => { setNameChk(''); setNameVal(e.target.value); }

    // 아이디 체인지 이벤트
    const handleIdChange = (e: React.ChangeEvent<HTMLInputElement>) => { setIdChk(''); setIdVal(e.target.value); }

    /** 폼 서밋 */
    const handleOnSubmit = async () => {
        if (nameVal === '') {
            setNameChk('empty');
        } else if (idVal === '') {
            setIdChk('empty');
        } else {
            await axios
            .post('/api/user/sendpwemail', null, { params: {
                name: nameVal,
                id: idVal
            }})
            .then(res => {
                if (res.data.exists === 'wrong-name') { setNameChk('wrong-name'); }
                else if (res.data.exists === 'wrong-id') { setIdChk('wrong-id'); }
                else {

                }
            })
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

    return (
        <>
            {/* Head 부분*/}
            <NextSeo 
                title={"비밀번호 찾기 · 폰트 아카이브"}
                description={"비밀번호 찾기 - 상업용 무료 한글 폰트 아카이브"}
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
                <div className='w-[360px] flex flex-col justify-center items-start mt-[100px] tlg:mt-[40px]'>
                    <h2 className='text-[20px] tlg:text-[18px] text-theme-4 dark:text-theme-9 font-medium mb-[12px] tlg:mb-[8px]'>비밀번호 찾기</h2>
                    <form onSubmit={e => e.preventDefault()} className='w-[100%] p-[20px] rounded-[8px] text-theme-10 dark:text-theme-9 bg-theme-5 dark:bg-theme-3 drop-shadow-default dark:drop-shadow-dark'>
                        <label htmlFor='name' className='block text-[14px] ml-px'>이름</label>
                        <input onChange={handleNameChange} type='text' id='name' tabIndex={1} autoComplete='on' placeholder='홍길동' className={`${nameChk === '' ? 'border-theme-4 focus:border-theme-yellow dark:border-theme-blue-2 focus:dark:border-theme-blue-1' : 'border-theme-red focus:border-theme-red dark:border-theme-red focus:dark:border-theme-red'} w-[100%] text-[14px] mt-[6px] px-[14px] py-[8px] rounded-[8px] border-[2px] placeholder-theme-7 dark:placeholder-theme-6 bg-theme-4 dark:bg-theme-blue-2 autofill:bg-theme-4 autofill:dark:bg-theme-blue-2`}/>
                        {
                            nameChk === 'empty'
                            ? <span className='block text-[12px] text-theme-red mt-[4px] ml-[16px]'>이름을 입력해 주세요.</span>
                            : ( nameChk === 'wrong-name'
                                ? <span className='block text-[12px] text-theme-red mt-[4px] ml-[16px]'>조회된 이름이 없습니다.</span>
                                : <></>
                            )
                        }
                        <label htmlFor='id' className='block text-[14px] mt-[18px] ml-px'>아이디</label>
                        <input onChange={handleIdChange} type='text' id='id' tabIndex={1} autoComplete='on' placeholder='이메일을 입력해 주세요.' className={`${idChk === '' ? 'border-theme-4 focus:border-theme-yellow dark:border-theme-blue-2 focus:dark:border-theme-blue-1' : 'border-theme-red focus:border-theme-red dark:border-theme-red focus:dark:border-theme-red'} w-[100%] text-[14px] mt-[6px] px-[14px] py-[8px] rounded-[8px] border-[2px] placeholder-theme-7 dark:placeholder-theme-6 bg-theme-4 dark:bg-theme-blue-2 autofill:bg-theme-4 autofill:dark:bg-theme-blue-2`}/>
                        {
                            idChk === 'empty'
                            ? <span className='block text-[12px] text-theme-red mt-[4px] ml-[16px]'>아이디를 입력해 주세요.</span>
                            : ( idChk === 'wrong-id'
                                ? <span className='block text-[12px] text-theme-red mt-[4px] ml-[16px]'>아이디가 이름과 일치하지 않습니다.</span>
                                : <></>
                            )
                        }
                        <button onClick={handleOnSubmit} className='w-[100%] h-[40px] rounded-[8px] mt-[14px] text-[14px] font-medium text-theme-4 dark:text-theme-blue-2 bg-theme-yellow/80 hover:bg-theme-yellow tlg:hover:bg-theme-yellow/80 dark:bg-theme-blue-1/80 hover:dark:bg-theme-blue-1 tlg:hover:dark:bg-theme-blue-1/80'>다음</button>
                    </form>
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

export default SendEmail;