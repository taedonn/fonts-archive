// react
import { useState } from 'react';

// next
import { NextSeo } from 'next-seo';

// api
import { getServerSession } from 'next-auth';
import { authOptions } from './api/auth/[...nextauth]';
import { FetchAllNotices } from './api/notices';

// libraries
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
    const { theme, userAgent, user, notices } = params;

    // 디바이스 체크
    const isMac: boolean = userAgent.includes("Mac OS") ? true : false;

    // 공지 - 목록
    const [noticesList, setNoticesList] = useState(notices);

    // 공지 - 전체
    const [all, setAll] = useState(notices);

    // 공지 - 서비스
    const [services, setServices] = useState(notices.filter((notice: notices) => notice.notice_type === "service"));
    
    // 공지 - 폰트
    const [fonts, setFonts] = useState(notices.filter((notice: notices) => notice.notice_type === "font"));

    // 공지 타입 저장
    const [type, setType] = useState<string>("all");

    /** 서비스 유형 선택 시 */
    const handleTypeOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.id === "all") {
            setNoticesList(all);
            setType("all");
        }
        else if (e.target.id === "service") {
            setNoticesList(services);
            setType("service");
        }
        else {
            setNoticesList(fonts);
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

                if (type === "all") { setNoticesList(res.data.notices); }
                else if (type === "service") { setNoticesList(res.data.notices.filter((notice: notices) => notice.notice_type === "service")); }
                else { setNoticesList(res.data.notices.filter((notice: notices) => notice.notice_type === "font")); }
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
                theme={theme}
                user={user}
            />

            {/* 고정 메뉴 */}
            <Tooltip/>

            {/* 메인 */}
            <div className='w-full flex flex-col justify-center items-center py-[60px]'>
                <div className='notices w-[720px] tmd:w-full flex flex-col justify-center items-start'>
                    <div className='flex items-center mb-4'>
                        <h2 className='text-[22px] text-theme-3 dark:text-theme-9 font-medium'>공지사항</h2>
                        <h3 className='text-sm ml-3.5 text-theme-5 dark:text-theme-7'>폰트 업데이트 & 소식</h3>
                    </div>
                    <div className='relative mb-9'>
                        <i className="text-sm absolute left-[18px] top-1/2 -translate-y-1/2 text-theme-5 dark:text-theme-7 fa-solid fa-magnifying-glass"></i>
                        <input onKeyUp={handleKeyUp} type="text" id="search" placeholder="검색어 입력" className="w-[300px] h-10 text-sm pl-10 pr-5 border rounded-full border-theme-7 dark:border-theme-5 text-theme-5 dark:text-theme-7 placeholder:text-theme-5 dark:placeholder:text-theme-7 bg-transparent"/>
                    </div>
                    <div className='flex items-center gap-1.5 mb-4'>
                        <div>
                            <input onChange={handleTypeOnChange} type="radio" id="all" name="type" className="hidden peer" defaultChecked/>
                            <label htmlFor='all' className='w-20 h-8 text-sm pt-px flex justify-center items-center cursor-pointer border rounded-full border-theme-7 dark:border-theme-5 peer-checked:border-theme-yellow peer-checked:dark:border-theme-blue-1 text-theme-5 dark:text-theme-7 peer-checked:text-theme-3 peer-checked:dark:text-theme-blue-2 peer-checked:bg-theme-yellow peer-checked:dark:bg-theme-blue-1'>전체<div className='text-[13px] ml-0.5'>({all.length})</div></label>
                        </div>
                        <div>
                            <input onChange={handleTypeOnChange} type="radio" id="service" name="type" className="hidden peer"/>
                            <label htmlFor='service' className='w-20 h-8 text-sm pt-px flex justify-center items-center cursor-pointer border rounded-full border-theme-7 dark:border-theme-5 peer-checked:border-theme-yellow peer-checked:dark:border-theme-blue-1 text-theme-5 dark:text-theme-7 peer-checked:text-theme-3 peer-checked:dark:text-theme-blue-2 peer-checked:bg-theme-yellow peer-checked:dark:bg-theme-blue-1'>서비스<div className='text-[13px] ml-0.5'>({services.length})</div></label>
                        </div>
                        <div>
                            <input onChange={handleTypeOnChange} type="radio" id="font" name="type" className="hidden peer"/>
                            <label htmlFor='font' className='w-20 h-8 text-sm pt-px flex justify-center items-center cursor-pointer border rounded-full border-theme-7 dark:border-theme-5 peer-checked:border-theme-yellow peer-checked:dark:border-theme-blue-1 text-theme-5 dark:text-theme-7 peer-checked:text-theme-3 peer-checked:dark:text-theme-blue-2 peer-checked:bg-theme-yellow peer-checked:dark:bg-theme-blue-1'>폰트<div className='text-[13px] ml-0.5'>({fonts.length})</div></label>
                        </div>
                    </div>
                    {
                        noticesList && noticesList.length > 0
                        ?  noticesList.map((notice: notices) => {
                            return <div key={notice.notice_id.toString()} className='notice w-full flex flex-col'>
                                <input type='checkbox' id={`notice-${notice.notice_id}`} className='hidden peer/expand'/>
                                <label htmlFor={`notice-${notice.notice_id}`} className='cursor-pointer hover:bg-theme-7/20 hover:dark:bg-theme-5/20'>
                                    <div className='w-full h-14 text-sm flex justify-between items-center border-t text-theme-3 dark:text-theme-9 border-theme-7 dark:border-theme-5'>
                                        <div className='flex items-center'>
                                            <div className='w-[100px] tlg:w-20 shrink-0 flex justify-center items-center'><div className='px-[4px] border-b-2 dark:border-theme-blue-1'>{notice.notice_type === "service" ? "서비스" : "폰트"}</div></div>
                                            <div className='w-full ml-[12px]'><div className='ellipsed-text'>{notice.notice_title}</div></div>
                                        </div>
                                        <div className='flex items-center mr-[20px]'>
                                            <div className='w-20 text-theme-5 dark:text-theme-7'>{dateFormat(notice.notice_created_at)}</div>
                                            <i className="text-xs ml-5 text-theme-5 dark:text-theme-7 duration-100 fa-solid fa-angle-right"></i>
                                        </div>
                                    </div>
                                </label>
                                <pre className='w-full h-0 whitespace-pre-wrap peer-checked/expand:h-[auto] px-8 peer-checked/expand:py-5 text-sm duration-100 flex items-center overflow-hidden peer-checked/expand:border-t border-theme-7 dark:border-theme-5 text-theme-3 dark:text-theme-9 bg-theme-7/20 dark:bg-theme-5/20'>{notice.notice_content}</pre>
                            </div>
                        })
                        : <div className='w-full h-[68px] text-sm flex justify-center items-center text-center border-t border-theme-7 dark:border-theme-5 text-theme-3 dark:text-theme-9'>공지사항을 찾을 수 없습니다.</div>
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
        // 쿠키 체크
        const { theme } = ctx.req.cookies;

        // 디바이스 체크
        const userAgent = ctx.req ? ctx.req.headers['user-agent'] : navigator.userAgent;

        // 유저 정보 불러오기
        const session = await getServerSession(ctx.req, ctx.res, authOptions);

        // 공지 사항 조회
        const notices = await FetchAllNotices();

        return {
            props: {
                params: {
                    theme: theme ? theme : 'light',
                    userAgent: userAgent,
                    user: session === null ? null : session.user,
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