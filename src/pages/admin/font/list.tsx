// next hooks
import { NextSeo } from 'next-seo';

// react hooks
import React, { useEffect, useState, useRef } from 'react';

// api
import axios from 'axios';
import { CheckIfSessionExists } from '@/pages/api/user/checkifsessionexists';
import { FetchUserInfo } from '@/pages/api/user/fetchuserinfo';
import { FetchFontsLength } from '@/pages/api/admin/font';
import { FetchFonts } from '@/pages/api/admin/font';

// components
import Header from "@/components/header";
import { Pagination } from '@mui/material';

const FontsList = ({params}: any) => {
    // 디바이스 체크
    const isMac: boolean = params.userAgent.includes("Mac OS") ? true : false;

    // 빈 함수
    const emptyFn = () => { return; }

    // 목록 state
    const [fonts, setFonts] = useState(params.fonts);
    const [count, setCount] = useState<number>(params.count);
    const [filter, setFilter] = useState<string>('all');
    const [text, setText] = useState<string>('');

    // 목록 ref
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

    /** 시간 포맷 */
    const timeFormat = (time: string) => {
        const splitTime = time.split(':');
        return splitTime[0] + ':' + splitTime[1];
    }

    /** 날짜 포맷 */
    const dateFormat = (date: string) => {
        const splitDate = date.split('-');
        return splitDate[0].replace("20", "") + '.' + splitDate[1] + '.' + timeFormat(splitDate[2].replace('T', ' ').replace('Z', ''));
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
                    <h2 className='text-[20px] tlg:text-[18px] text-theme-3 dark:text-theme-9 font-medium mb-[16px] tlg:mb-[12px]'>폰트 목록</h2>
                    <div className='w-content flex items-center p-[6px] mb-[12px] tlg:mb-[8px] rounded-[6px] text-theme-10 dark:text-theme-9 bg-theme-5 dark:bg-theme-3'>
                        <select ref={selectRef} className='w-[80px] h-[32px] tlg:h-[28px] text-[12px] pt-px px-[14px] bg-transparent rounded-[6px] outline-none border border-theme-6 dark:border-theme-5 cursor-pointer'>
                            <option value='all' defaultChecked>전체</option>
                            <option value='kr'>한글</option>
                            <option value='en'>영문</option>
                            <option value='show'>보임</option>
                            <option value='hide'>숨김</option>
                        </select>
                        <input ref={textRef} type='textbox' placeholder='폰트명 입력' className='w-[200px] tlg:w-[160px] h-[32px] tlg:h-[28px] ml-[8px] px-[12px] text-[12px] bg-transparent border rounded-[6px] border-theme-6 dark:border-theme-5'/>
                        <button onClick={handleClick} className='w-[68px] h-[32px] tlg:h-[28px] ml-[8px] text-[12px] border rounded-[6px] bg-theme-6/40 hover:bg-theme-6/60 tlg:hover:bg-theme-6/40 dark:bg-theme-4 hover:dark:bg-theme-5 tlg:hover:dark:bg-theme-4'>검색</button>
                    </div>
                    <div className='w-[100%] rounded-[8px] overflow-hidden overflow-x-auto'>
                    <div className='w-[720px] text-[12px] text-theme-10 dark:text-theme-9 bg-theme-4 dark:bg-theme-4'>
                            <div className='text-left bg-theme-5 dark:bg-theme-3'>
                                <div className='h-[40px] tlg:h-[34px] flex items-center'>
                                    <div className='w-[60px] pl-[12px] shrink-0'>코드</div>
                                    <div className='w-[100%] pl-[12px]'>폰트명</div>
                                    <div className='w-[60px] pl-[12px] shrink-0'>조회수</div>
                                    <div className='w-[60px] pl-[12px] shrink-0'>좋아요</div>
                                    <div className='w-[60px] pl-[12px] shrink-0'>언어</div>
                                    <div className='w-[60px] pl-[12px] shrink-0'>타입</div>
                                    <div className='w-[60px] pl-[12px] shrink-0'>보임</div>
                                    <div className='w-[112px] pl-[12px] shrink-0'>생성 날짜</div>
                                    <div className='w-[112px] pl-[12px] shrink-0'>수정 날짜</div>
                                </div>
                            </div>
                            <div>
                                {
                                    fonts && fonts.length > 0
                                    ? <>
                                        {
                                            fonts.map((font: any) => {
                                                return (
                                                    <div key={font.code} className='h-[40px] tlg:h-[34px] relative flex items-center border-t border-theme-5 dark:border-theme-3'>
                                                        <a href={`/admin/font/edit?code=${font.code}`} className='w-[100%] h-[100%] block absolute z-10 left-0 top-0 hover:bg-theme-yellow/20 tlg:hover:bg-transparent hover:dark:bg-theme-blue-1/20 tlg:hover:dark:bg-transparent'></a>
                                                        <div className='w-[60px] pl-[12px] shrink-0 break-keep'>{font.code}</div>
                                                        <div className='w-[100%] pl-[12px] break-keep'><div className='font-size'>{font.name}</div></div>
                                                        <div className='w-[60px] pl-[12px] shrink-0 break-keep'>{formatNumber(font.view)}</div>
                                                        <div className='w-[60px] pl-[12px] shrink-0 break-keep'>{formatNumber(font.like)}</div>
                                                        <div className='w-[60px] pl-[12px] shrink-0 break-keep'>{font.lang}</div>
                                                        <div className='w-[60px] pl-[12px] shrink-0 break-keep'>{formatType(font.font_type)}</div>
                                                        <div className='w-[60px] pl-[12px] shrink-0 break-keep text-theme-green'>{font.show_type ? "보임" : "숨김"}</div>
                                                        <div className='w-[112px] pl-[12px] shrink-0 break-keep'>{dateFormat(font.created_at)}</div>
                                                        <div className='w-[112px] pl-[12px] shrink-0 break-keep'>{dateFormat(font.updated_at)}</div>
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
                    <div className='w-[100%] flex justify-center mt-[12px]'>
                        <Pagination count={count} page={page} onChange={handleChange} shape='rounded' showFirstButton showLastButton/>
                    </div>
                </div>
            </form>
        </>
    );
}

export async function getServerSideProps(ctx: any) {
    try {
        // 필터링 쿠키 체크
        const cookieTheme = ctx.req.cookies.theme === undefined ? "dark" : ctx.req.cookies.theme;

        // 디바이스 체크
        const userAgent = ctx.req ? ctx.req.headers['user-agent'] : navigator.userAgent;

        // 쿠키에 저장된 세션ID가 유효하면, 유저 정보 가져오기
        const session = ctx.req.cookies.session;
        const user = session === undefined
            ? null
            : await CheckIfSessionExists(session)
                ? await FetchUserInfo(session)
                : null;

        // 쿠키에 저장된 세션ID가 유효하지 않다면, 메인페이지로 이동, 유효하면 클리이언트로 유저 정보 return
        if (user === null || user.user_no !== 1) {
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
                        theme: cookieTheme,
                        userAgent: userAgent,
                        user: JSON.parse(JSON.stringify(user)),
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