// next
import Link from 'next/link';
import { NextSeo } from 'next-seo';

// next-auth
import { getServerSession } from "next-auth";
import { authOptions } from '@/pages/api/auth/[...nextauth]';

// react
import React, { useState, useRef, useEffect } from 'react';

// api
import { FetchNoticesLength } from '@/pages/api/admin/notices';
import { FetchNotices } from '@/pages/api/admin/notices';

// libraries
import axios from 'axios';
import { Pagination } from '@mui/material';

// components
import Header from "@/components/header";
import Footer from '@/components/footer';

// common
import { timeFormat } from '@/libs/common';

const NoticeList = ({params}: any) => {
    const { theme, userAgent, user, list, count } = params;

    // 디바이스 체크
    const isMac: boolean = userAgent.includes("Mac OS") ? true : false;

    // states
    const [thisList, setList] = useState(list);
    const [thisCount, setCount] = useState<number>(count);
    const [filter, setFilter] = useState<string>('all');
    const [text, setText] = useState<string>('');

    // refs
    const selectRef = useRef<HTMLSelectElement>(null);
    const textRef = useRef<HTMLInputElement>(null);

    // 페이지 변경
    const [page, setPage] = useState<number>(1);
    const handleChange = (e: React.ChangeEvent<unknown>, value: number) => { setPage(value); };

    // 페이지 변경 시 데이터 다시 불러오기
    useEffect(() => {
        const fetchNewData = async () => {
            await axios.get('/api/admin/notices', {
                params: {
                    action: "list",
                    page: page,
                    filter: filter,
                    text: text,
                }
            })
            .then((res) => { setList(res.data.list); })
            .catch(err => console.log(err));
        }
        fetchNewData();
    }, [page, filter, text]);

    // 검색 버튼 클릭 시 값 state에 저장 후, API 호출
    const handleClick = async () => {
        if (selectRef &&selectRef.current && textRef && textRef.current) {
            // state 저장
            setPage(1);
            setFilter(selectRef.current.value);
            setText(textRef.current.value);
            
            // API 호출
            await axios.get('/api/admin/notices', {
                params: {
                    action: "list",
                    page: 1,
                    filter: selectRef.current.value,
                    text: textRef.current.value,
                }
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
                title={"공지 목록 · 폰트 아카이브"}
                description={"공지 목록 - 폰트 아카이브 · 상업용 무료 한글 폰트 저장소"}
            />

            {/* 헤더 */}
            <Header
                isMac={isMac}
                theme={theme}
                user={user}
            />

            {/* 메인 */}
            <form onSubmit={e => e.preventDefault()} className='w-full flex flex-col justify-center items-center'>
                <div className='w-[720px] tmd:w-full flex flex-col justify-center items-start my-[100px] tlg:my-10'>
                    <h2 className='text-xl tlg:text-lg text-theme-3 dark:text-theme-9 font-medium mb-4 tlg:mb-3'>공지 목록</h2>
                    <div className='w-max flex items-center p-1.5 mb-3 tlg:mb-2 rounded-md text-theme-10 dark:text-theme-9 bg-theme-5 dark:bg-theme-3'>
                        <select ref={selectRef} className='w-20 h-8 tlg:h-7 text-xs pt-px px-2.5 bg-transparent rounded-md outline-none border border-theme-6 dark:border-theme-5 cursor-pointer'>
                            <option value='all' defaultChecked>전체</option>
                            <option value='service'>서비스</option>
                            <option value='font'>폰트</option>
                        </select>
                        <input ref={textRef} type='textbox' placeholder='제목/내용' className='w-[200px] tlg:w-40 h-8 tlg:h-7 ml-2 px-3 text-xs bg-transparent border rounded-md border-theme-6 dark:border-theme-5'/>
                        <button onClick={handleClick} className='w-[68px] h-8 tlg:h-7 ml-2 text-xs border rounded-md bg-theme-6/40 hover:bg-theme-6/60 tlg:hover:bg-theme-6/40 dark:bg-theme-4 hover:dark:bg-theme-5 tlg:hover:dark:bg-theme-4'>검색</button>
                    </div>
                    <div className='w-full rounded-lg overflow-hidden overflow-x-auto'>
                        <div className='w-[720px] text-xs text-theme-10 dark:text-theme-9 bg-theme-4 dark:bg-theme-4'>
                            <div className='text-left bg-theme-5 dark:bg-theme-3'>
                                <div className='h-10 tlg:h-9 flex items-center'>
                                    <div className='w-12 pl-4 shrink-0'>번호</div>
                                    <div className='w-[60px] pl-4 shrink-0'>유형</div>
                                    <div className='w-[120px] pl-4 shrink-0'>제목</div>
                                    <div className='w-full pl-4'>내용</div>
                                    <div className='w-20 pl-4 shrink-0'>숨김 여부</div>
                                    <div className='w-[120px] pl-4 shrink-0'>생성 날짜</div>
                                    <div className='w-[120px] pl-4 shrink-0'>수정 날짜</div>
                                </div>
                            </div>
                            <div>
                                {
                                    thisList && thisList.length > 0
                                    ? <>
                                        {
                                            thisList.map((notice: any) => {
                                                return (
                                                    <div key={notice.notice_id} className='h-10 tlg:h-9 relative flex items-center border-t border-theme-5 dark:border-theme-3 hover:bg-theme-yellow/20 tlg:hover:bg-transparent hover:dark:bg-theme-blue-1/20 tlg:hover:dark:bg-transparent cursor-pointer'>
                                                        <Link href={`/admin/notices/${notice.notice_id}`} className='w-full h-full absolute z-10 left-0 top-0'></Link>
                                                        <div className='w-12 pl-4 py-2.5 shrink-0'>{notice.notice_id}</div>
                                                        <div className='w-[60px] pl-4 py-2.5 shrink-0'>{notice.notice_type === "service" ? "서비스" : "폰트"}</div>
                                                        <div className='w-[120px] pl-4 py-2.5 shrink-0'><div className='font-size'>{notice.notice_title}</div></div>
                                                        <div className='w-full pl-4 py-2.5 overflow-hidden'><div className='font-size'>{notice.notice_content}</div></div>
                                                        <div className='w-20 py-2.5 shrink-0 text-center text-theme-green'>
                                                            {
                                                                notice.notice_show_type
                                                                ? <span>보임</span> 
                                                                : <span>숨김</span>
                                                            }
                                                        </div>
                                                        <div className='w-[120px] pl-4 py-2.5 shrink-0'>{timeFormat(notice.notice_created_at)}</div>
                                                        <div className='w-[120px] pl-4 py-2.5 shrink-0'>{timeFormat(notice.notice_updated_at)}</div>
                                                    </div>
                                                )
                                            })
                                        }
                                    </>
                                    : <div className='h-[60px] flex justify-center items-center'>공지가 없습니다.</div>
                                }
                            </div>
                        </div>
                    </div>
                    <div className='w-full flex justify-center mt-3'>
                        <Pagination count={thisCount} page={page} onChange={handleChange} shape='rounded' showFirstButton showLastButton/>
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
        // 쿠키 체크
        const { theme } = ctx.req.cookies;

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
            const count = await FetchNoticesLength();

            // 첫 유저 목록 가져오기
            const list = await FetchNotices(undefined);

            return {
                props: {
                    params: {
                        theme: theme ? theme : 'light',
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

export default NoticeList;