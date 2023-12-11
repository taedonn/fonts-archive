// next hooks
import Link from 'next/link';
import { NextSeo } from 'next-seo';

// next-auth
import { getServerSession } from "next-auth";
import { authOptions } from '@/pages/api/auth/[...nextauth]';

// react hooks
import React, { useState, useRef, useEffect } from 'react';

// api
import axios from 'axios';
import { FetchBugs } from '@/pages/api/admin/bug';
import { FetchBugsLength } from '@/pages/api/admin/bug';

// components
import Header from "@/components/header";
import Footer from '@/components/footer';
import { Pagination } from '@mui/material';

// common
import { timeFormat } from '@/libs/common';

const BugList = ({params}: any) => {
    // 디바이스 체크
    const isMac: boolean = params.userAgent.includes("Mac OS") ? true : false;

    // 빈 함수
    const emptyFn = () => { return; }

    // 유저 목록 state
    const [list, setList] = useState(params.list);
    const [count, setCount] = useState<number>(params.count);
    const [filter, setFilter] = useState<string>('all');
    const [text, setText] = useState<string>('');

    // 유저 목록 ref
    const selectRef = useRef<HTMLSelectElement>(null);
    const textRef = useRef<HTMLInputElement>(null);

    // 유저 목록 페이지 변경
    const [page, setPage] = useState<number>(1);
    const handleChange = (e: React.ChangeEvent<unknown>, value: number) => { setPage(value); };

    // 페이지 변경 시 데이터 다시 불러오기
    useEffect(() => {
        const fetchNewComments = async () => {
            await axios.post('/api/admin/bug', {
                action: "list",
                page: page,
                filter: filter,
                text: text
            })
            .then((res) => { setList(res.data.list); })
            .catch(err => console.log(err));
        }
        fetchNewComments();
    }, [filter, text, page]);

    // 검색 버튼 클릭 시 값 state에 저장 후, API 호출
    const handleClick = async () => {
        if (selectRef &&selectRef.current && textRef && textRef.current) {
            // state 저장
            setPage(1);
            setFilter(selectRef.current.value);
            setText(textRef.current.value);
            
            // API 호출
            await axios.post('/api/admin/bug', {
                action: "list",
                page: 1,
                filter: selectRef.current.value,
                text: textRef.current.value
            })
            .then((res) => {
                setList(res.data.list);
                setCount(res.data.count);
            })
            .catch(err => console.log(err));
        }
    }

    return (
        <>
            {/* Head 부분*/}
            <NextSeo 
                title={"버그 제보 목록 · 폰트 아카이브"}
                description={"버그 제보 목록 - 폰트 아카이브 · 상업용 무료 한글 폰트 저장소"}
            />

            {/* 헤더 */}
            <Header
                isMac={isMac}
                theme={params.theme}
                user={params.user}
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
            <form onSubmit={e => e.preventDefault()} className='w-[100%] flex flex-col justify-center items-center'>
                <div className='w-[720px] tmd:w-[100%] flex flex-col justify-center items-start my-[100px] tlg:my-[40px]'>
                    <h2 className='text-[20px] tlg:text-[18px] text-theme-3 dark:text-theme-9 font-medium mb-[16px] tlg:mb-[12px]'>버그 제보 목록</h2>
                    <div className='w-content flex items-center p-[6px] mb-[12px] tlg:mb-[8px] rounded-[6px] text-theme-10 dark:text-theme-9 bg-theme-5 dark:bg-theme-3'>
                        <select ref={selectRef} className='w-[80px] h-[32px] tlg:h-[28px] text-[12px] pt-px px-[10px] bg-transparent rounded-[6px] outline-none border border-theme-6 dark:border-theme-5 cursor-pointer'>
                            <option value='all' defaultChecked>전체</option>
                            <option value='issue_opened'>해결중</option>
                        </select>
                        <input ref={textRef} type='textbox' placeholder='제목/이메일' className='w-[200px] tlg:w-[160px] h-[32px] tlg:h-[28px] ml-[8px] px-[12px] text-[12px] bg-transparent border rounded-[6px] border-theme-6 dark:border-theme-5'/>
                        <button onClick={handleClick} className='w-[68px] h-[32px] tlg:h-[28px] ml-[8px] text-[12px] border rounded-[6px] bg-theme-6/40 hover:bg-theme-6/60 tlg:hover:bg-theme-6/40 dark:bg-theme-4 hover:dark:bg-theme-5 tlg:hover:dark:bg-theme-4'>검색</button>
                    </div>
                    <div className='w-[100%] rounded-[8px] overflow-hidden overflow-x-auto'>
                        <div className='w-[720px] text-[12px] text-theme-10 dark:text-theme-9 bg-theme-4 dark:bg-theme-4'>
                            <div className='text-left bg-theme-5 dark:bg-theme-3'>
                                <div className='h-[40px] tlg:h-[34px] flex items-center'>
                                    <div className='w-[48px] pl-[16px] shrink-0'>번호</div>
                                    <div className='w-[120px] pl-[16px] shrink-0'>제목</div>
                                    <div className='w-[100%] pl-[16px]'>이메일</div>
                                    <div className='w-[112px] pl-[16px] shrink-0'>생성 날짜</div>
                                    <div className='w-[112px] pl-[16px] shrink-0'>종료 날짜</div>
                                    <div className='w-[88px] pl-[16px] shrink-0'>해결 여부</div>
                                </div>
                            </div>
                            <div>
                                {
                                    list && list.length > 0
                                    ? <>
                                        {
                                            list.map((issue: any) => {
                                                return (
                                                    <div key={issue.issue_id} className='h-[40px] tlg:h-[34px] relative flex items-center border-t border-theme-5 dark:border-theme-3 hover:bg-theme-yellow/20 tlg:hover:bg-transparent hover:dark:bg-theme-blue-1/20 tlg:hover:dark:bg-transparent cursor-pointer'>
                                                        <Link href={`/admin/bug/${issue.issue_id}`} className='w-[100%] h-[100%] absolute z-10 left-0 top-0'></Link>
                                                        <div className='w-[48px] pl-[16px] py-[10px] shrink-0'>{issue.issue_id}</div>
                                                        <div className='w-[120px] pl-[16px] py-[10px] shrink-0'><div className='font-size'>{issue.issue_title}</div></div>
                                                        <div className='w-[100%] pl-[16px] py-[10px]'><div className='font-size'>{issue.issue_email}</div></div>
                                                        <div className='w-[112px] pl-[16px] py-[10px] shrink-0'>{timeFormat(issue.issue_created_at)}</div>
                                                        <div className='w-[112px] pl-[16px] py-[10px] shrink-0'>{timeFormat(issue.issue_closed_at)}</div>
                                                        <div className='w-[88px] pl-[16px] py-[10px] break-keep shrink-0'>
                                                            {
                                                                issue.issue_closed
                                                                ? <>
                                                                    <span className='text-theme-green'>해결 됨</span>
                                                                    <svg className='inline-block w-[8px] ml-[4px] mb-px fill-theme-green' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z"/></svg>
                                                                </> : <>
                                                                    <span className='text-theme-9'>해결 중...</span>
                                                                </>
                                                            }
                                                        </div>
                                                    </div>
                                                )
                                            })
                                        }
                                    </>
                                    : <div className='h-[60px] flex justify-center items-center'>제보가 없습니다.</div>
                                }
                            </div>
                        </div>
                    </div>
                    <div className='w-[100%] flex justify-center mt-[12px]'>
                        <Pagination count={count} page={page} onChange={handleChange} shape='rounded' showFirstButton showLastButton/>
                    </div>
                </div>
            </form>

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
        const session: any = await getServerSession(ctx.req, ctx.res, authOptions);

        if (session === null || session.user === undefined || session.user.id !== 1) {
            return {
                redirect: {
                    destination: '/404',
                    permanent: false,
                }
            }
        } else {
            // 유저 목록 페이지 수
            const count = await FetchBugsLength();

            // 첫 유저 목록 가져오기
            const list = await FetchBugs(undefined);

            return {
                props: {
                    params: {
                        theme: cookieTheme,
                        userAgent: userAgent,
                        user: session === null ? null : session.user,
                        list: JSON.parse(JSON.stringify(list)),
                        count: count,
                    }
                }
            }
        }
    }
    catch (error) {
        console.log(error);
    }
}

export default BugList;