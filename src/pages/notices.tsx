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
                page="notices"
            />

            {/* 고정 메뉴 */}
            <Tooltip/>

            {/* 메인 */}
            <div className='w-full px-4 flex flex-col justify-center items-center mt-16 mb-32 tmd:mt-12 tmd:mb-24'>
                <div className='notices w-[720px] tmd:w-full flex flex-col justify-center items-start'>
                    <div className='flex items-center mb-4'>
                        <h2 className='text-2xl text-h-2 dark:text-white font-bold'>공지사항</h2>
                        <h3 className='ml-4 text-l-5 dark:text-d-c'>폰트 업데이트 & 소식</h3>
                    </div>
                    <div className='relative mb-10 text-l-2 dark:text-white'>
                        <i className="text-sm absolute left-5 top-1/2 -translate-y-1/2 fa-solid fa-magnifying-glass"></i>
                        <input onKeyUp={handleKeyUp} type="text" id="search" placeholder="검색어 입력" className="w-80 h-10 text-sm pl-12 pr-6 rounded-full border-2 border-transparent focus:border-h-1 focus:dark:border-f-8 text-l-2 dark:text-white placeholder:text-l-5 dark:placeholder:text-d-c bg-l-e dark:bg-d-4"/>
                    </div>
                    <div className='flex items-center gap-1.5 mb-4'>
                        <div>
                            <input onChange={handleTypeOnChange} type="radio" id="all" name="type" className="hidden peer" defaultChecked/>
                            <label htmlFor='all' className='w-20 h-8 text-sm flex justify-center items-center cursor-pointer border rounded-full border-l-b dark:border-d-6 peer-checked:border-h-1 peer-checked:dark:border-f-8 text-l-5 dark:text-d-c peer-checked:text-white peer-checked:dark:text-d-2 peer-checked:bg-h-1 peer-checked:dark:bg-f-8'>전체<div className='text-[13px] ml-1'>({all.length})</div></label>
                        </div>
                        <div>
                            <input onChange={handleTypeOnChange} type="radio" id="service" name="type" className="hidden peer"/>
                            <label htmlFor='service' className='w-20 h-8 text-sm flex justify-center items-center cursor-pointer border rounded-full border-l-b dark:border-d-6 peer-checked:border-h-1 peer-checked:dark:border-f-8 text-l-5 dark:text-d-c peer-checked:text-white peer-checked:dark:text-d-2 peer-checked:bg-h-1 peer-checked:dark:bg-f-8'>서비스<div className='text-[13px] ml-1'>({services.length})</div></label>
                        </div>
                        <div>
                            <input onChange={handleTypeOnChange} type="radio" id="font" name="type" className="hidden peer"/>
                            <label htmlFor='font' className='w-20 h-8 text-sm flex justify-center items-center cursor-pointer border rounded-full border-l-b dark:border-d-6 peer-checked:border-h-1 peer-checked:dark:border-f-8 text-l-5 dark:text-d-c peer-checked:text-white peer-checked:dark:text-d-2 peer-checked:bg-h-1 peer-checked:dark:bg-f-8'>폰트<div className='text-[13px] ml-1'>({fonts.length})</div></label>
                        </div>
                    </div>
                    {
                        noticesList && noticesList.length > 0
                        ?  noticesList.map((notice: notices) => {
                            return <div key={notice.notice_id.toString()} className='notice group w-full flex flex-col'>
                                <input type='checkbox' id={`notice-${notice.notice_id}`} className='hidden peer/expand'/>
                                <label htmlFor={`notice-${notice.notice_id}`} className='group/label cursor-pointer hover:bg-l-e hover:dark:bg-d-4'>
                                    <div className='w-full h-14 text-sm flex justify-between items-center border-t text-l-2 dark:text-white border-l-b dark:border-d-6 group-last:border-b'>
                                        <div className='flex items-center'>
                                            <div className='w-[100px] tlg:w-20 shrink-0 flex justify-center items-center'><div className='px-1 border-b-2 border-h-1 dark:border-f-8 selection:bg-transparent'>{notice.notice_type === "service" ? "서비스" : "폰트"}</div></div>
                                            <div className='w-full ml-3 selection:bg-transparent'><div className='ellipsed-text'>{notice.notice_title}</div></div>
                                        </div>
                                        <div className='flex items-center mr-5 text-l-5 dark:text-d-c'>
                                            <div className='w-20'>{dateFormat(notice.notice_created_at)}</div>
                                            <i className="text-xs ml-5 duration-100 peer-checked/expand:group-[]/label:rotate-90 fa-solid fa-angle-right"></i>
                                        </div>
                                    </div>
                                </label>
                                <pre className='font-sans w-full h-0 whitespace-pre-wrap peer-checked/expand:h-[auto] px-8 peer-checked/expand:py-6 text-sm leading-6 duration-100 flex items-center overflow-hidden peer-checked/expand:border-t border-l-b dark:border-d-6 text-l-2 dark:text-white hover:bg-l-e hover:dark:bg-d-4 group-last:peer-checked/expand:border-t-0 group-last:peer-checked/expand:border-b'>{notice.notice_content}</pre>
                            </div>
                        })
                        : <div className='w-full h-[68px] text-sm flex justify-center items-center text-center border-t border-l-b dark:border-d-6 text-l-2 dark:text-white'>공지사항을 찾을 수 없습니다.</div>
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