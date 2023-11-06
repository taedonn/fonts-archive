// next hooks
import { NextSeo } from 'next-seo';

// api
import { CheckIfSessionExists } from '@/pages/api/user/checkifsessionexists';
import { FetchUserInfo } from '@/pages/api/user/fetchuserinfo';

// components
import Header from "@/components/header";
import Tooltip from '@/components/tooltip';

const NoticesAdd = ({params}: any) => {
    // 디바이스 체크
    const isMac: boolean = params.userAgent.includes("Mac OS") ? true : false;

    // 빈 함수
    const emptyFn = () => { return; }

    return (
        <>
            {/* Head 부분*/}
            <NextSeo 
                title={"공지사항 추가 · 폰트 아카이브"}
                description={"공지사항 추가 - 상업용 무료 한글 폰트 저장소"}
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
                        <h2 className='text-[24px] text-theme-3 dark:text-theme-9 font-medium'>공지사항</h2>
                        <h3 className='text-[16px] ml-[16px] text-theme-5 dark:text-theme-7'>폰트 업데이트 & 소식</h3>
                    </div>
                    <div className='relative mb-[32px]'>
                        <svg className='w-[14px] absolute left-[18px] top-[50%] translate-y-[-50%] fill-theme-5 dark:fill-theme-7' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z"/></svg>
                        <input type="text" id="search" placeholder="검색어 입력" className="w-[300px] h-[40px] text-[14px] pl-[40px] pr-[20px] border rounded-full border-theme-7 dark:border-theme-5 text-theme-5 dark:text-theme-7 placeholder:text-theme-5 dark:placeholder:text-theme-7 bg-transparent"/>
                    </div>
                    <div className='flex items-center gap-[8px] mb-[32px]'>
                        <div>
                            <input type="radio" id="all" name="type" className="hidden peer" defaultChecked/>
                            <label htmlFor='all' className='w-[80px] h-[34px] text-[14px] pt-px flex justify-center items-center cursor-pointer border rounded-full border-theme-3 dark:border-theme-9 peer-checked:border-theme-yellow peer-checked:dark:border-theme-blue-1 text-theme-3 dark:text-theme-9 peer-checked:text-theme-3 peer-checked:dark:text-theme-blue-2 peer-checked:bg-theme-yellow peer-checked:dark:bg-theme-blue-1'>전체</label>
                        </div>
                        <div>
                            <input type="radio" id="service" name="type" className="hidden peer"/>
                            <label htmlFor='service' className='w-[80px] h-[34px] text-[14px] pt-px flex justify-center items-center cursor-pointer border rounded-full border-theme-3 dark:border-theme-9 peer-checked:border-theme-yellow peer-checked:dark:border-theme-blue-1 text-theme-3 dark:text-theme-9 peer-checked:text-theme-3 peer-checked:dark:text-theme-blue-2 peer-checked:bg-theme-yellow peer-checked:dark:bg-theme-blue-1'>서비스</label>
                        </div>
                        <div>
                            <input type="radio" id="font" name="type" className="hidden peer"/>
                            <label htmlFor='font' className='w-[80px] h-[34px] text-[14px] pt-px flex justify-center items-center cursor-pointer border rounded-full border-theme-3 dark:border-theme-9 peer-checked:border-theme-yellow peer-checked:dark:border-theme-blue-1 text-theme-3 dark:text-theme-9 peer-checked:text-theme-3 peer-checked:dark:text-theme-blue-2 peer-checked:bg-theme-yellow peer-checked:dark:bg-theme-blue-1'>폰트</label>
                        </div>
                    </div>
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
        )

        if (user === null || user.user_no !== 1) {
            return {
                redirect: {
                    destination: '/404',
                    permanent: false,
                }
            }
        } else {
            return {
                props: {
                    params: {
                        theme: cookieTheme,
                        userAgent: userAgent,
                        user: JSON.parse(JSON.stringify(user)),
                    }
                }
            }
        }
    }
    catch (error) {
        console.log(error);
    }
}

export default NoticesAdd;