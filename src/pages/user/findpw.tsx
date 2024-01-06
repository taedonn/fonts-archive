// next
import Link from 'next/link';
import { NextSeo } from 'next-seo';

// next-auth
import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]';

// react
import React, { useState, useEffect } from 'react';

// libraries
import axios from 'axios';

// components
import Header from "@/components/header";
import Footer from '@/components/footer';

const FindPw = ({params}: any) => {
    const { theme, userAgent } = params;

    // 디바이스 체크
    const isMac: boolean = userAgent.includes("Mac OS") ? true : false;

    // states
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
                theme={theme}
                user={null}
            />

            {/* 메인 */}
            <div className='w-full flex flex-col justify-center items-center'>
                <div className='w-[360px] flex flex-col justify-center items-start my-[100px] tlg:my-10'>
                    <h2 className='text-xl tlg:text-lg text-theme-3 dark:text-theme-9 font-medium mb-3 tlg:mb-2'>비밀번호 찾기</h2>
                    {
                        alertDisplay === true
                        ? <>
                            <div className='w-full h-10 px-2.5 mb-2.5 flex flex-row justify-between items-center rounded-md border-2 border-theme-yellow dark:border-theme-blue-1/80 text-xs text-theme-3 dark:text-theme-9 bg-theme-yellow/40 dark:bg-theme-blue-1/20'>
                                <div className='flex flex-row justify-start items-center'>
                                    <i className="text-sm text-theme-yellow dark:text-theme-blue-1 fa-regular fa-bell"></i>
                                    <div className='ml-1.5'>이메일로 임시 비밀번호가 발급되었습니다. <Link href="/user/login" className='ml-2 text-theme-yellow dark:text-theme-blue-1 hover:underline tlg:hover:no-underline'>로그인 하기</Link></div>
                                </div>
                                <div onClick={handleAlertClose} className='flex flex-row justify-center items-center cursor-pointer'>
                                    <i className="text-sm text-theme-3 dark:text-theme-9 fa-solid fa-xmark"></i>
                                </div>
                            </div>
                        </>
                        : <></>
                    }
                    <form onSubmit={e => e.preventDefault()} className='w-full p-5 rounded-lg text-theme-10 dark:text-theme-9 bg-theme-5 dark:bg-theme-3 drop-shadow-default dark:drop-shadow-dark'>
                        <label htmlFor='name' className='block text-sm ml-px'>이름</label>
                        <input onChange={handleNameChange} type='text' id='name' tabIndex={1} autoComplete='on' placeholder='홍길동' className={`${nameChk === '' ? 'border-theme-4 focus:border-theme-yellow dark:border-theme-blue-2 focus:dark:border-theme-blue-1' : 'border-theme-red focus:border-theme-red dark:border-theme-red focus:dark:border-theme-red'} w-full text-sm mt-1.5 px-3.5 py-2 rounded-lg border-2 placeholder-theme-7 dark:placeholder-theme-6 bg-theme-4 dark:bg-theme-blue-2 autofill:bg-theme-4 autofill:dark:bg-theme-blue-2`}/>
                        {
                            nameChk === 'empty'
                            ? <span className='block text-xs text-theme-red mt-1 ml-4'>이름을 입력해 주세요.</span>
                            : ( nameChk === 'wrong-name'
                                ? <span className='block text-xs text-theme-red mt-1 ml-4'>이름이 아이디와 일치하지 않습니다.</span>
                                : <></>
                            )
                        }
                        <label htmlFor='id' className='block text-sm mt-[18px] ml-px'>아이디</label>
                        <input onChange={handleIdChange} type='text' id='id' tabIndex={2} autoComplete='on' placeholder='이메일을 입력해 주세요.' className={`${idChk === '' ? 'border-theme-4 focus:border-theme-yellow dark:border-theme-blue-2 focus:dark:border-theme-blue-1' : 'border-theme-red focus:border-theme-red dark:border-theme-red focus:dark:border-theme-red'} w-full text-sm mt-1.5 px-3.5 py-2 rounded-lg border-2 placeholder-theme-7 dark:placeholder-theme-6 bg-theme-4 dark:bg-theme-blue-2 autofill:bg-theme-4 autofill:dark:bg-theme-blue-2`}/>
                        {
                            idChk === 'empty'
                            ? <span className='block text-xs text-theme-red mt-1 ml-4'>아이디를 입력해 주세요.</span>
                            : ( idChk === 'wrong-id'
                                ? <span className='block text-xs text-theme-red mt-1 ml-4'>조회된 아이디가 없습니다.</span>
                                : <></>
                            )
                        }
                        <button onClick={handleOnSubmit} className='w-full h-10 rounded-lg mt-3.5 text-sm font-medium text-theme-4 dark:text-theme-blue-2 bg-theme-yellow/80 hover:bg-theme-yellow tlg:hover:bg-theme-yellow/80 dark:bg-theme-blue-1/80 hover:dark:bg-theme-blue-1 tlg:hover:dark:bg-theme-blue-1/80'>
                            {
                                isLoading === true
                                ? <span className='loader loader-register w-[18px] h-[18px] mt-1'></span>
                                : '다음'
                            }
                        </button>
                    </form>
                    <div className='w-full flex flex-row justify-center items-center text-xs mt-3'>
                        <Link href="/terms" target="_blank" rel="noopener noreferrer" className='text-theme-5 dark:text-theme-6 hover:underline tlg:hover:underline'>서비스 이용약관</Link>
                        <div className='text-theme-5 dark:text-theme-6 mx-1'>·</div>
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

export default FindPw;