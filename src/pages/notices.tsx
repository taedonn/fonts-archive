// react hooks
import { useState } from 'react';

// next hooks
import { NextSeo } from 'next-seo';

// api
import { Auth, getAccessToken } from './api/user/auth';
import { FetchAllNotices } from './api/notices';
import axios from 'axios';

// components
import Header from "@/components/header";
import Footer from '@/components/footer';
import Tooltip from '@/components/tooltip';

// common
import { dateFormat } from '@/libs/common';

// type
import { notices } from '@/libs/global';

const Notices = ({params}: any) => {
    // 디바이스 체크
    const isMac: boolean = params.userAgent.includes("Mac OS") ? true : false;

    // 빈 함수
    const emptyFn = () => { return; }

    // 공지 - 목록
    const [notices, setNotices] = useState(params.notices);

    // 공지 - 전체
    const [all, setAll] = useState(params.notices);

    // 공지 - 서비스
    const [services, setServices] = useState(params.notices.filter((notice: notices) => notice.notice_type === "service"));
    
    // 공지 - 폰트
    const [fonts, setFonts] = useState(params.notices.filter((notice: notices) => notice.notice_type === "font"));

    // 공지 타입 저장
    const [type, setType] = useState<string>("all");

    /** 서비스 유형 선택 시 */
    const handleTypeOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.id === "all") {
            setNotices(all);
            setType("all");
        }
        else if (e.target.id === "service") {
            setNotices(services);
            setType("service");
        }
        else {
            setNotices(fonts);
            setType("font");
        }
    }

    /** 엔터키 입력 */
    const handleKeyUp = async (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            await axios.get("/api/notices", {
                params: {
                    action: "search",
                    text: e.currentTarget.value,
                }
            })
            .then(res => {
                setAll(res.data.notices);
                setServices(res.data.notices.filter((notice: notices) => notice.notice_type === "service"));
                setFonts(res.data.notices.filter((notice: notices) => notice.notice_type === "font"));

                if (type === "all") { setNotices(res.data.notices); }
                else if (type === "service") { setNotices(res.data.notices.filter((notice: notices) => notice.notice_type === "service")); }
                else { setNotices(res.data.notices.filter((notice: notices) => notice.notice_type === "font")); }
            })
            .catch(err => console.log(err));
        }
    }

    return (
        <>
            {/* Head 부분*/}
            <NextSeo 
                title={"공지사항 · 폰트 아카이브"}
                description={"공지사항 - 폰트 아카이브 · 상업용 무료 한글 폰트 저장소"}
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

            {/* 고정 메뉴 */}
            <Tooltip/>

            {/* 메인 */}
            <div className='w-[100%] flex flex-col justify-center items-center py-[60px]'>
                <div className='notices w-[720px] tmd:w-[100%] flex flex-col justify-center items-start'>
                    <div className='flex items-center mb-[16px]'>
                        <h2 className='text-[22px] text-theme-3 dark:text-theme-9 font-medium'>공지사항</h2>
                        <h3 className='text-[14px] ml-[14px] text-theme-5 dark:text-theme-7'>폰트 업데이트 & 소식</h3>
                    </div>
                    <div className='relative mb-[36px]'>
                        <svg className='w-[14px] absolute left-[18px] top-[50%] translate-y-[-50%] fill-theme-5 dark:fill-theme-7' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z"/></svg>
                        <input onKeyUp={handleKeyUp} type="text" id="search" placeholder="검색어 입력" className="w-[300px] h-[40px] text-[14px] pl-[40px] pr-[20px] border rounded-full border-theme-7 dark:border-theme-5 text-theme-5 dark:text-theme-7 placeholder:text-theme-5 dark:placeholder:text-theme-7 bg-transparent"/>
                    </div>
                    <div className='flex items-center gap-[6px] mb-[16px]'>
                        <div>
                            <input onChange={handleTypeOnChange} type="radio" id="all" name="type" className="hidden peer" defaultChecked/>
                            <label htmlFor='all' className='w-[80px] h-[32px] text-[14px] pt-px flex justify-center items-center cursor-pointer border rounded-full border-theme-7 dark:border-theme-5 peer-checked:border-theme-yellow peer-checked:dark:border-theme-blue-1 text-theme-5 dark:text-theme-7 peer-checked:text-theme-3 peer-checked:dark:text-theme-blue-2 peer-checked:bg-theme-yellow peer-checked:dark:bg-theme-blue-1'>전체<div className='text-[13px] ml-[2px]'>({all.length})</div></label>
                        </div>
                        <div>
                            <input onChange={handleTypeOnChange} type="radio" id="service" name="type" className="hidden peer"/>
                            <label htmlFor='service' className='w-[80px] h-[32px] text-[14px] pt-px flex justify-center items-center cursor-pointer border rounded-full border-theme-7 dark:border-theme-5 peer-checked:border-theme-yellow peer-checked:dark:border-theme-blue-1 text-theme-5 dark:text-theme-7 peer-checked:text-theme-3 peer-checked:dark:text-theme-blue-2 peer-checked:bg-theme-yellow peer-checked:dark:bg-theme-blue-1'>서비스<div className='text-[13px] ml-[2px]'>({services.length})</div></label>
                        </div>
                        <div>
                            <input onChange={handleTypeOnChange} type="radio" id="font" name="type" className="hidden peer"/>
                            <label htmlFor='font' className='w-[80px] h-[32px] text-[14px] pt-px flex justify-center items-center cursor-pointer border rounded-full border-theme-7 dark:border-theme-5 peer-checked:border-theme-yellow peer-checked:dark:border-theme-blue-1 text-theme-5 dark:text-theme-7 peer-checked:text-theme-3 peer-checked:dark:text-theme-blue-2 peer-checked:bg-theme-yellow peer-checked:dark:bg-theme-blue-1'>폰트<div className='text-[13px] ml-[2px]'>({fonts.length})</div></label>
                        </div>
                    </div>
                    {
                        notices && notices.length > 0
                        ?  notices.map((notice: notices) => {
                            return <div key={notice.notice_id.toString()} className='notice w-[100%] flex flex-col'>
                                <input type='checkbox' id={`notice-${notice.notice_id}`} className='hidden peer/expand'/>
                                <label htmlFor={`notice-${notice.notice_id}`} className='cursor-pointer hover:bg-theme-7/20 hover:dark:bg-theme-5/20'>
                                    <div className='w-[100%] h-[56px] text-[14px] flex justify-between items-center border-t text-theme-3 dark:text-theme-9 border-theme-7 dark:border-theme-5'>
                                        <div className='flex items-center'>
                                            <div className='w-[100px] tlg:w-[80px] shrink-0 flex justify-center items-center'><div className='px-[4px] border-b-[2px] dark:border-theme-blue-1'>{notice.notice_type === "service" ? "서비스" : "폰트"}</div></div>
                                            <div className='w-[100%] ml-[12px]'><div className='font-size'>{notice.notice_title}</div></div>
                                        </div>
                                        <div className='flex items-center mr-[20px]'>
                                            <div className='w-[80px] text-theme-5 dark:text-theme-7'>{dateFormat(notice.notice_created_at)}</div>
                                            <svg className='w-[8px] ml-[20px] fill-theme-5 dark:fill-theme-7 duration-100' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path d="M278.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-160 160c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L210.7 256 73.4 118.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l160 160z"/></svg>
                                        </div>
                                    </div>
                                </label>
                                <pre className='h-0 peer-checked/expand:h-[auto] px-[32px] peer-checked/expand:py-[20px] text-[14px] duration-100 flex items-center overflow-hidden peer-checked/expand:border-t border-theme-7 dark:border-theme-5 text-theme-3 dark:text-theme-9 bg-theme-7/20 dark:bg-theme-5/20'>{notice.notice_content}</pre>
                            </div>
                        })
                        : <div className='w-[100%] h-[68px] text-[14px] flex justify-center items-center text-center border-t border-theme-7 dark:border-theme-5 text-theme-3 dark:text-theme-9'>공지사항을 찾을 수 없습니다.</div>
                    }
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

        // refreshToken 불러오기
        const refreshToken = ctx.req.cookies.refreshToken;

        // accessToken으로 유저 정보 가져오기
        const accessToken = refreshToken === undefined
            ? null
            : await getAccessToken(refreshToken);

        // accessToken으로 유저 정보 불러오기
        const user = accessToken === null
            ? null
            : await Auth(accessToken);

        // 공지 사항 조회
        const notices = await FetchAllNotices();

        return {
            props: {
                params: {
                    theme: cookieTheme,
                    userAgent: userAgent,
                    user: JSON.parse(JSON.stringify(user)),
                    notices: JSON.parse(JSON.stringify(notices)),
                }
            }
        }
    }
    catch (error) {
        console.log(error);
    }
}

export default Notices;