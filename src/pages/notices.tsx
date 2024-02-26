// react
import { useState } from 'react';

// next
import { NextSeo } from 'next-seo';

// api
import { getServerSession } from 'next-auth';
import { authOptions } from './api/auth/[...nextauth]';
import { FetchAllNotices } from './api/notices';

// components
import Motion from '@/components/motion';
import Header from "@/components/header";
import Footer from '@/components/footer';
import SearchInput from '@/components/searchinput';

// common
import { dateFormat, onMouseDown, onMouseUp, onMouseOut } from '@/libs/common';

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
            const url = "/api/notices?";
            const options = {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            }
            const params = {
                action: "search",
                text: e.currentTarget.value,
            }
            const query = new URLSearchParams(params).toString();

            await fetch(url + query, options)
            .then(res => res.json())
            .then(data => {
                setAll(data.notices);
                setServices(data.notices.filter((notice: notices) => notice.notice_type === "service"));
                setFonts(data.notices.filter((notice: notices) => notice.notice_type === "font"));

                if (type === "all") { setNoticesList(data.notices); }
                else if (type === "service") { setNoticesList(data.notices.filter((notice: notices) => notice.notice_type === "service")); }
                else { setNoticesList(data.notices.filter((notice: notices) => notice.notice_type === "font")); }
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

            {/* 메인 */}
            <Motion
                initialOpacity={0}
                animateOpacity={1}
                exitOpacity={0}
                initialY={-50}
                animateY={0}
                exitY={-50}
                transitionType="spring"
            >
                <div className='w-full px-4 flex flex-col justify-center items-center my-16 lg:my-24 mt-8 lg:mt-16'>
                    <div className='notices w-[45rem] tmd:w-full flex flex-col justify-center items-start'>
                        <div className='flex items-center mb-4'>
                            <h2 className='text-2xl text-h-2 dark:text-white font-bold'>공지사항</h2>
                            <h3 className='ml-4 text-l-5 dark:text-d-c'>폰트 업데이트 & 소식</h3>
                        </div>
                        <div className='relative mb-10 text-l-2 dark:text-white'>
                            <SearchInput onkeyup={handleKeyUp} id="search" placeholder="검색어 입력"/>
                        </div>
                        <div className='flex items-center gap-1.5 mb-4'>
                            <div>
                                <input onChange={handleTypeOnChange} type="radio" id="all" name="type" className="hidden peer" defaultChecked/>
                                <label htmlFor='all' onMouseDown={e => onMouseDown(e, 0.9, true)} onMouseUp={onMouseUp} onMouseOut={onMouseOut} className='w-24 h-9 flex justify-center items-center cursor-pointer rounded-lg text-l-5 dark:text-d-c peer-checked:text-white peer-checked:dark:text-d-2 peer-checked:bg-h-1 peer-checked:dark:bg-f-8'>전체<div className='text-sm ml-0.5'>({all.length})</div></label>
                            </div>
                            <div>
                                <input onChange={handleTypeOnChange} type="radio" id="service" name="type" className="hidden peer"/>
                                <label htmlFor='service' onMouseDown={e => onMouseDown(e, 0.9, true)} onMouseUp={onMouseUp} onMouseOut={onMouseOut} className='w-24 h-9 flex justify-center items-center cursor-pointer rounded-lg text-l-5 dark:text-d-c peer-checked:text-white peer-checked:dark:text-d-2 peer-checked:bg-h-1 peer-checked:dark:bg-f-8'>서비스<div className='text-sm ml-0.5'>({services.length})</div></label>
                            </div>
                            <div>
                                <input onChange={handleTypeOnChange} type="radio" id="font" name="type" className="hidden peer"/>
                                <label htmlFor='font' onMouseDown={e => onMouseDown(e, 0.9, true)} onMouseUp={onMouseUp} onMouseOut={onMouseOut} className='w-24 h-9 flex justify-center items-center cursor-pointer rounded-lg text-l-5 dark:text-d-c peer-checked:text-white peer-checked:dark:text-d-2 peer-checked:bg-h-1 peer-checked:dark:bg-f-8'>폰트<div className='text-sm ml-0.5'>({fonts.length})</div></label>
                            </div>
                        </div>
                        {
                            noticesList && noticesList.length > 0
                            ?  noticesList.map((notice: notices) => {
                                return <div key={notice.notice_id.toString()} className='notice group w-full flex flex-col gap-3'>
                                    <input type='checkbox' id={`notice-${notice.notice_id}`} className='hidden peer/expand'/>
                                    <label htmlFor={`notice-${notice.notice_id}`} className='group/label rounded-lg cursor-pointer border-2 border-transparent text-l-2 dark:text-white bg-l-e dark:bg-d-4 hover:border-h-1 hover:dark:border-f-8 tlg:hover:border-transparent tlg:hover:dark:border-transparent peer-checked/expand:border-h-1 peer-checked/expand:dark:border-f-8 peer-checked/expand:bg-transparent'>
                                        <div className='w-full h-14 text-sm flex justify-between items-center'>
                                            <div className='flex items-center'>
                                                <div className='w-[6.25rem] tlg:w-20 shrink-0 flex justify-center items-center'><div className='px-1 border-b-2 border-h-1 dark:border-f-8 selection:bg-transparent'>{notice.notice_type === "service" ? "서비스" : "폰트"}</div></div>
                                                <div className='w-full ml-3 selection:bg-transparent'><div className='ellipsed-text'>{notice.notice_title}</div></div>
                                            </div>
                                            <div className='flex items-center mr-5 text-l-5 dark:text-d-c'>
                                                <div className='w-20 selection:bg-transparent'>{dateFormat(notice.notice_created_at)}</div>
                                                <i className="text-xs ml-5 duration-100 peer-checked/expand:group-[]/label:rotate-90 fa-solid fa-angle-right"></i>
                                            </div>
                                        </div>
                                    </label>
                                    <pre className='font-sans w-full h-0 whitespace-pre-wrap peer-checked/expand:h-[auto] px-8 peer-checked/expand:py-6 peer-checked/expand:mb-3 text-sm leading-6 duration-100 flex items-center rounded-lg overflow-hidden bg-l-e dark:bg-d-4 text-l-2 dark:text-white'>{notice.notice_content}</pre>
                                </div>
                            })
                            : <div className='w-full h-20 flex justify-center items-center text-sm text-center border-t border-l-b dark:border-d-6 text-l-2 dark:text-white'>공지사항을 찾을 수 없습니다.</div>
                        }
                    </div>
                </div>
            </Motion>

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