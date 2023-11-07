// react hooks
import { useState } from 'react';

// next hooks
import { NextSeo } from 'next-seo';

// api
import { CheckIfSessionExists } from './api/user/checkifsessionexists';
import { FetchUserInfo } from './api/user/fetchuserinfo';
import { FetchAllNotices } from './api/notices';

// components
import Header from "@/components/header";
import Tooltip from '@/components/tooltip';

// type
interface Notice {
    notice_id: number,
    notice_type: string,
    notice_title: string,
    notice_content: string,
    notice_show_type: boolean,
    notice_created_at: string,
    notice_updated_at: string,
}

const Notices = ({params}: any) => {
    // 디바이스 체크
    const isMac: boolean = params.userAgent.includes("Mac OS") ? true : false;

    // 빈 함수
    const emptyFn = () => { return; }

    // 공지 - 전체
    const [notices, setNotices] = useState(params.notices);

    // 공지 - 서비스
    const services = params.notices.filter((notice: Notice) => notice.notice_type === "service");
    
    // 공지 - 폰트
    const fonts = params.notices.filter((notice: Notice) => notice.notice_type === "font");

    /** 날짜 포맷 */
    const dateFormat = (date: string) => {
        const splitDate = date.split('-');
        return splitDate[0] + '-' + splitDate[1] + '-' + splitDate[2].split("T")[0];
    }

    /** 서비스 유형 선택 시 */
    const handleTypeOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.id === "all") { setNotices(params.notices); }
        else if (e.target.id === "service") { setNotices(services); }
        else { setNotices(fonts); }
    }

    return (
        <>
            {/* Head 부분*/}
            <NextSeo 
                title={"공지사항 · 폰트 아카이브"}
                description={"공지사항 - 상업용 무료 한글 폰트 저장소"}
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
                <div className='w-[720px] tmd:w-[100%] flex flex-col justify-center items-start'>
                    <div className='flex items-center mb-[16px]'>
                        <h2 className='text-[22px] text-theme-3 dark:text-theme-9 font-medium'>공지사항</h2>
                        <h3 className='text-[14px] ml-[14px] text-theme-5 dark:text-theme-7'>폰트 업데이트 & 소식</h3>
                    </div>
                    <div className='relative mb-[36px]'>
                        <svg className='w-[14px] absolute left-[18px] top-[50%] translate-y-[-50%] fill-theme-5 dark:fill-theme-7' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z"/></svg>
                        <input type="text" id="search" placeholder="검색어 입력" className="w-[300px] h-[40px] text-[14px] pl-[40px] pr-[20px] border rounded-full border-theme-7 dark:border-theme-5 text-theme-5 dark:text-theme-7 placeholder:text-theme-5 dark:placeholder:text-theme-7 bg-transparent"/>
                    </div>
                    <div className='flex items-center gap-[6px] mb-[16px]'>
                        <div>
                            <input onChange={handleTypeOnChange} type="radio" id="all" name="type" className="hidden peer" defaultChecked/>
                            <label htmlFor='all' className='w-[80px] h-[32px] text-[14px] pt-px flex justify-center items-center cursor-pointer border rounded-full border-theme-7 dark:border-theme-5 peer-checked:border-theme-yellow peer-checked:dark:border-theme-blue-1 text-theme-5 dark:text-theme-7 peer-checked:text-theme-3 peer-checked:dark:text-theme-blue-2 peer-checked:bg-theme-yellow peer-checked:dark:bg-theme-blue-1'>전체<div className='text-[13px] ml-[2px]'>({params.notices.length})</div></label>
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
                        notices && notices.map((notice: Notice , idx: number) => {
                            return <div key={idx} className='w-[100%] flex flex-col'>
                                <div className='w-[100%] h-[56px] text-[14px] flex justify-between items-center border-t border-b text-theme-3 dark:text-theme-9 border-theme-7 dark:border-theme-5'>
                                    <div className='flex items-center'>
                                        <div className='w-[100px] flex justify-center items-center'><div className='px-[4px] border-b-[2px] dark:border-theme-blue-1'>{notice.notice_type === "service" ? "서비스" : "폰트"}</div></div>
                                        <div className='ml-[12px]'><div className='font-size'>{notice.notice_title}</div></div>
                                    </div>
                                    <div className='flex items-center mr-[20px]'>
                                        <div className='w-[80px] text-theme-5 dark:text-theme-7'>{dateFormat(notice.notice_created_at)}</div>
                                        <svg className='w-[8px] ml-[20px] fill-theme-5 dark:fill-theme-7' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path d="M278.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-160 160c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L210.7 256 73.4 118.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l160 160z"/></svg>
                                    </div>
                                </div>
                            </div>
                        })
                    }
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

        // 쿠키에 저장된 세션ID가 유효하면, 유저 정보 가져오기
        const user = ctx.req.cookies.session === undefined ? null : (
            await CheckIfSessionExists(ctx.req.cookies.session) === true 
            ? await FetchUserInfo(ctx.req.cookies.session)
            : null
        );

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