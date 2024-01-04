// next
import Link from 'next/link';
import { NextSeo } from 'next-seo';

// next-auth
import { getServerSession } from "next-auth";
import { authOptions } from '@/pages/api/auth/[...nextauth]';

// react
import React, { useEffect, useState, useRef } from 'react';

// api
import { FetchFontsLength } from '@/pages/api/admin/font';
import { FetchFonts } from '@/pages/api/admin/font';

// libraries
import axios from 'axios';
import { Pagination } from '@mui/material';

// components
import Header from "@/components/header";
import Footer from '@/components/footer';

// common
import { timeFormat } from '@/libs/common';

const FontsList = ({params}: any) => {
    const { theme, userAgent, user, count, fonts } = params;

    // 디바이스 체크
    const isMac: boolean = userAgent.includes("Mac OS") ? true : false;

    // states
    const [thisFonts, setFonts] = useState(fonts);
    const [thisCount, setCount] = useState<number>(count);
    const [filter, setFilter] = useState<string>('all');
    const [text, setText] = useState<string>('');

    // refs
    const selectRef = useRef<HTMLSelectElement>(null);
    const textRef = useRef<HTMLInputElement>(null);

    // 목록 페이지 변경
    const [page, setPage] = useState<number>(1);
    const handleChange = (e: React.ChangeEvent<unknown>, value: number) => {
        setPage(value);
    };

    // 페이지 변경 시 데이터 다시 불러오기
    useEffect(() => {
        const fetchNewFonts = async () => {
            await axios.get('/api/admin/font', {
                params: {
                    action: "fetch-fonts",
                    page: page,
                    filter: filter,
                    text: text,
                }
            })
            .then((res) => {
                setFonts(res.data.fonts);
                setCount(res.data.count);
            })
            .catch(err => console.log(err));
        }
        fetchNewFonts();
    }, [page, filter, text]);

    // 검색 버튼 클릭 시 값 state에 저장 후, API 호출
    const handleClick = async () => {
        if (selectRef &&selectRef.current && textRef && textRef.current) {
            // state 저장
            setPage(1);
            setFilter(selectRef.current.value);
            setText(textRef.current.value);
            
            // API 호출
            await axios.get('/api/admin/font', {
                params: {
                    action: "fetch-fonts",
                    page: 1,
                    filter: selectRef.current.value,
                    text: textRef.current.value
                }
            })
            .then((res) => {
                setFonts(res.data.fonts);
                setCount(res.data.count);
            })
            .catch(err => console.log(err));
        }
    }

    /** 조회수 단위 변경 : 1000 => 1K */
    const ranges = [
        { divider: 1e6 , suffix: 'M' },
        { divider: 1e3 , suffix: 'k' }
    ];
    const formatNumber = (n: number | null) => {
        if (n === null) {
            return ""
        }
        else {
            for (let i = 0; i < ranges.length; i++) {
                if (n >= ranges[i].divider) {
                    return (n / ranges[i].divider).toString() + ranges[i].suffix;
                }
            }
        }
        return n.toString();
    }

    /** 폰트 타입 변경 */
    const formatType = (type: string) => {
        if (type === "Sans Serif") return "고딕";
        else if (type === "Serif") return "명조";
        else if (type === "Hand Writing") return "손글씨";
        else if (type === "Display") return "장식체";
        else return "픽셀체";
    }

    return (
        <>
            {/* Head 부분*/}
            <NextSeo 
                title={"폰트 목록 · 폰트 아카이브"}
                description={"폰트 목록 - 폰트 아카이브 · 상업용 무료 한글 폰트 저장소"}
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
                    <h2 className='text-xl tlg:text-lg text-theme-3 dark:text-theme-9 font-medium mb-4 tlg:mb-3'>폰트 목록</h2>
                    <div className='w-max flex items-center p-1.5 mb-3 tlg:mb-2 rounded-md text-theme-10 dark:text-theme-9 bg-theme-5 dark:bg-theme-3'>
                        <select ref={selectRef} className='w-20 h-8 tlg:h-7 text-xs pt-px px-3.5 bg-transparent rounded-md outline-none border border-theme-6 dark:border-theme-5 cursor-pointer'>
                            <option value='all' defaultChecked>전체</option>
                            <option value='kr'>한글</option>
                            <option value='en'>영문</option>
                            <option value='show'>보임</option>
                            <option value='hide'>숨김</option>
                        </select>
                        <input ref={textRef} type='textbox' placeholder='폰트명 입력' className='w-[200px] tlg:w-40 h-8 tlg:h-7 ml-2 px-3 text-xs bg-transparent border rounded-md border-theme-6 dark:border-theme-5'/>
                        <button onClick={handleClick} className='w-[68px] h-8 tlg:h-7 ml-2 text-xs border rounded-md bg-theme-6/40 hover:bg-theme-6/60 tlg:hover:bg-theme-6/40 dark:bg-theme-4 hover:dark:bg-theme-5 tlg:hover:dark:bg-theme-4'>검색</button>
                    </div>
                    <div className='w-full rounded-lg overflow-hidden overflow-x-auto'>
                        <div className='w-[720px] text-xs text-theme-10 dark:text-theme-9 bg-theme-4 dark:bg-theme-4'>
                            <div className='text-left bg-theme-5 dark:bg-theme-3'>
                                <div className='h-10 tlg:h-9 flex items-center'>
                                    <div className='w-[60px] pl-3 shrink-0'>코드</div>
                                    <div className='w-full pl-3'>폰트명</div>
                                    <div className='w-[60px] pl-3 shrink-0'>조회수</div>
                                    <div className='w-[60px] pl-3 shrink-0'>좋아요</div>
                                    <div className='w-[60px] pl-3 shrink-0'>언어</div>
                                    <div className='w-[60px] pl-3 shrink-0'>타입</div>
                                    <div className='w-[60px] pl-3 shrink-0'>보임</div>
                                    <div className='w-28 pl-3 shrink-0'>생성 날짜</div>
                                    <div className='w-28 pl-3 shrink-0'>수정 날짜</div>
                                </div>
                            </div>
                            <div>
                                {
                                    thisFonts && thisFonts.length > 0
                                    ? <>
                                        {
                                            thisFonts.map((font: any) => {
                                                return (
                                                    <div key={font.code} className='h-10 tlg:h-9 relative flex items-center border-t border-theme-5 dark:border-theme-3 hover:bg-theme-yellow/20 tlg:hover:bg-transparent hover:dark:bg-theme-blue-1/20 tlg:hover:dark:bg-transparent'>
                                                        <Link href={`/admin/font/edit?code=${font.code}`} className='w-full h-full block absolute z-10 left-0 top-0'></Link>
                                                        <div className='w-[60px] pl-3 shrink-0'>{font.code}</div>
                                                        <div className='w-full pl-3 overflow-hidden'><div className='font-size'>{font.name}</div></div>
                                                        <div className='w-[60px] pl-3 shrink-0'>{formatNumber(font.view)}</div>
                                                        <div className='w-[60px] pl-3 shrink-0'>{formatNumber(font.like)}</div>
                                                        <div className='w-[60px] pl-3 shrink-0'>{font.lang}</div>
                                                        <div className='w-[60px] pl-3 shrink-0'>{formatType(font.font_type)}</div>
                                                        <div className='w-[60px] pl-3 shrink-0 text-theme-green'>{font.show_type ? "보임" : "숨김"}</div>
                                                        <div className='w-28 pl-3 shrink-0'>{timeFormat(font.created_at)}</div>
                                                        <div className='w-28 pl-3 shrink-0'>{timeFormat(font.updated_at)}</div>
                                                    </div>
                                                )
                                            })
                                        }
                                    </>
                                    : <div className='h-[60px]'>
                                        <div className='leading-[60px] text-center'>폰트가 없습니다.</div>
                                    </div>
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
            // 폰트 페이지 수
            const length = await FetchFontsLength();
            const count = Number(length) % 10 > 0 ? Math.floor(Number(length)/10) + 1 : Math.floor(Number(length)/10);

            // 첫 폰트 목록 가져오기
            const fonts = await FetchFonts(undefined);

            return {
                props: {
                    params: {
                        theme: theme ? theme : 'light',
                        userAgent: userAgent,
                        user: session === null ? null : session.user,
                        count: count,
                        fonts: JSON.parse(JSON.stringify(fonts))
                    }
                }
            }
        }
    }
    catch (error) {
        console.log(error);
    }
}

export default FontsList;