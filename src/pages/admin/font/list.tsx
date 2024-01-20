// next
import Link from 'next/link';
import { useRouter } from 'next/router';

// next-auth
import { getServerSession } from "next-auth";
import { authOptions } from '@/pages/api/auth/[...nextauth]';

// api
import { FetchFontsLength } from '@/pages/api/admin/font';
import { FetchFonts } from '@/pages/api/admin/font';

// libraries
import { Pagination } from '@mui/material';
import { NextSeo } from 'next-seo';

// components
import Motion from '@/components/motion';
import Header from "@/components/header";
import Footer from '@/components/footer';
import SearchInput from '@/components/searchinput';

// common
import { dateFormat } from '@/libs/common';

const FontsList = ({params}: any) => {
    const { theme, userAgent, user, page, filter, search, count, fonts } = params;

    // 디바이스 체크
    const isMac: boolean = userAgent.includes("Mac OS") ? true : false;

    // router
    const router = useRouter();

    // 페이지 변경
    const handlePageChange = (e: React.ChangeEvent<unknown>, value: number) => {
        router.push(`/admin/font/list${value === 1 ? "" : `?page=${value}`}${filter === "date" ? "" : `${value === 1 ? "?" : "&"}filter=${filter}`}${search === "" ? "" : `${value === 1 && filter === "date" ? "?" : "&"}search=${search}`}`);
    }

    // 핕터 변경
    const handleFilterChange = (e: React.MouseEvent<HTMLButtonElement>) => {
        router.push(`/admin/font/list${e.currentTarget.value === "date" ? "" : `?filter=${e.currentTarget.value}`}${search === "" ? "" : `${page === 1 && e.currentTarget.value === "date" ? "?" : "&"}search=${search}`}`);
    }

    // 검색어 변경
    const handleSearchClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        const input = document.getElementById("search") as HTMLInputElement;
        router.push(`/admin/font/list${filter === "date" ? "" : `?filter=${filter}`}${input.value === "" ? "" : `${page === 1 && filter === "date" ? "?" : "&"}search=${input.value}`}`);
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
            <Motion
                initialOpacity={0}
                animateOpacity={1}
                exitOpacity={0}
                initialY={-50}
                animateY={0}
                exitY={-50}
                transitionType="spring"
            >
                <form onSubmit={e => e.preventDefault()} className='w-full px-4 flex flex-col justify-center items-center'>
                    <div className='w-[45rem] tmd:w-full flex flex-col justify-center items-start my-24 tlg:my-16'>
                        <h2 className='text-2xl tlg:text-xl text-l-2 dark:text-white font-bold mb-4'>폰트 목록</h2>
                        <div className='flex items-center mb-10'>
                            <SearchInput id="search" placeholder="폰트 검색" value={search}/>
                            <button onClick={handleSearchClick} className="hidden">검색</button>
                        </div>
                        <div className='flex items-center gap-1.5 mb-4'>
                            <button onClick={handleFilterChange} value="date" className={`${filter === "date" ? "bg-h-1 dark:bg-f-8 text-white dark:text-d-2" : "text-l-5 dark:text-d-c hover:text-h-1 hover:dark:text-f-8"} w-20 h-9 flex justify-center items-center rounded-lg`}>최신순</button>
                            <button onClick={handleFilterChange} value="name" className={`${filter === "name" ? "bg-h-1 dark:bg-f-8 text-white dark:text-d-2" : "text-l-5 dark:text-d-c hover:text-h-1 hover:dark:text-f-8"} w-20 h-9 flex justify-center items-center rounded-lg`}>이름순</button>
                            <button onClick={handleFilterChange} value="view" className={`${filter === "view" ? "bg-h-1 dark:bg-f-8 text-white dark:text-d-2" : "text-l-5 dark:text-d-c hover:text-h-1 hover:dark:text-f-8"} w-20 h-9 flex justify-center items-center rounded-lg`}>조회순</button>
                            <button onClick={handleFilterChange} value="like" className={`${filter === "like" ? "bg-h-1 dark:bg-f-8 text-white dark:text-d-2" : "text-l-5 dark:text-d-c hover:text-h-1 hover:dark:text-f-8"} w-20 h-9 flex justify-center items-center rounded-lg`}>좋아요순</button>
                        </div>
                        <div className='w-full'>
                            <div className='w-full text-sm text-l-2 dark:text-white'>
                                <div className='flex flex-col gap-3'>
                                    {
                                        fonts && fonts.length > 0
                                        ? <>
                                            {
                                                fonts.map((font: any) => {
                                                    return (
                                                        <div key={font.code} className='px-6 py-4 relative rounded-lg bg-l-e dark:bg-d-4'>
                                                            <div className="flex tlg:flex-col items-center tlg:items-start gap-2 mb-2">
                                                                <Link href={`/admin/font/edit?code=${font.code}`} className="block text-h-1 dark:text-f-8 hover:underline tlg:hover:no-underline">{font.name}</Link>
                                                                <div className='flex gap-2 items-center'>
                                                                    <div className='text-xs text-l-5 dark:text-d-c'>{dateFormat(font.created_at)}</div>
                                                                    <div className='text-xs text-l-5 dark:text-d-c'>{font.lang}</div>
                                                                </div>
                                                            </div>
                                                            <div className='w-full flex gap-3 text-sm'>
                                                                <div>
                                                                    [{
                                                                        font.font_type === "Sans Serif"
                                                                            ? "고딕체"
                                                                            : font.font_type === "Serif"
                                                                                ? "명조체"
                                                                                : font.font_type === "Hand Writing"
                                                                                    ? "손글씨체"
                                                                                    : font.font_type === "Display"
                                                                                        ? "장식체"
                                                                                        : "픽셀체"
                                                                    }]
                                                                </div>
                                                                <div>조회수: {font.view}</div>
                                                                <div>좋아요수: {font.like}</div>
                                                            </div>
                                                        </div>
                                                    )
                                                })
                                            }
                                        </>
                                        : <div className='h-16 text-base flex justify-center items-center text-center'>폰트가 없습니다.</div>
                                    }
                                </div>
                            </div>
                        </div>
                        <div className='w-full flex justify-center mt-3'>
                            <Pagination count={count} page={Number(page)} onChange={handlePageChange} shape='rounded'/>
                        </div>
                    </div>
                </form>
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

        // 쿼리 체크
        const page = ctx.query.page === undefined ? 1 : ctx.query.page;
        const filter = ctx.query.filter === undefined ? "date" : ctx.query.filter;
        const search = ctx.query.search === undefined ? "" : ctx.query.search;

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
            const count = await FetchFontsLength(search);

            // 첫 폰트 목록 가져오기
            const fonts = await FetchFonts(page, filter, search);

            return {
                props: {
                    params: {
                        theme: theme ? theme : 'light',
                        userAgent: userAgent,
                        user: session === null ? null : session.user,
                        page: page,
                        filter: filter,
                        search: search,
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