// next
import Link from 'next/link';
import { useRouter } from 'next/router';

// next-auth
import { getServerSession } from "next-auth";
import { authOptions } from '@/pages/api/auth/[...nextauth]';

// api
import { FetchUsers, FetchUsersLength } from '@/pages/api/admin/user';

// libraries
import { Pagination } from '@mui/material';
import { NextSeo } from 'next-seo';

// components
import Motion from '@/components/motion';
import Header from "@/components/header";
import Footer from '@/components/footer';
import SearchInput from '@/components/searchinput';

// common
import { timeFormat, onMouseDown, onMouseUp, onMouseOut } from '@/libs/common';

const UserList = ({params}: any) => {
    const { theme, userAgent, user, page, filter, search, list, count } = params;

    // 디바이스 체크
    const isMac: boolean = userAgent.includes("Mac OS") ? true : false;

    // router
    const router = useRouter();

    // 페이지 변경
    const handlePageChange = (e: React.ChangeEvent<unknown>, value: number) => {
        router.push(`/admin/user/list${value === 1 ? "" : `?page=${value}`}${filter === "date" ? "" : `${value === 1 ? "?" : "&"}filter=${filter}`}${search === "" ? "" : `${value === 1 && filter === "date" ? "?" : "&"}search=${search}`}`);
    }

    // 핕터 변경
    const handleFilterChange = (e: React.MouseEvent<HTMLButtonElement>) => {
        router.push(`/admin/user/list${e.currentTarget.value === "date" ? "" : `?filter=${e.currentTarget.value}`}${search === "" ? "" : `${page === 1 && e.currentTarget.value === "date" ? "?" : "&"}search=${search}`}`);
    }

    // 검색어 변경
    const handleSearchClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        const input = document.getElementById("search") as HTMLInputElement;
        router.push(`/admin/user/list${filter === "date" ? "" : `?filter=${filter}`}${input.value === "" ? "" : `${page === 1 && filter === "date" ? "?" : "&"}search=${input.value}`}`);
    }

    return (
        <>
            {/* Head 부분*/}
            <NextSeo 
                title={"유저 관리 · 폰트 아카이브"}
                description={"유저 관리 - 폰트 아카이브 · 상업용 무료 한글 폰트 저장소"}
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
                transitionType="spring"
            >
                <form onSubmit={e => e.preventDefault()} className='w-full px-4 flex flex-col justify-center items-center'>
                    <div className='w-[45rem] tmd:w-full flex flex-col justify-center items-start my-16 lg:my-24 mt-8 lg:mt-16'>
                        <h2 className='text-2xl text-l-2 dark:text-white font-bold mb-4'>유저 목록</h2>
                        <div className='flex items-center mb-10'>
                            <SearchInput id="search" placeholder="이름/아이디" value={search}/>
                            <button onClick={handleSearchClick} className="hidden">검색</button>
                        </div>
                        <div className='flex items-center gap-1.5 mb-4'>
                            <button onClick={handleFilterChange} value="date" onMouseDown={e => onMouseDown(e, 0.9, true)} onMouseUp={onMouseUp} onMouseOut={onMouseOut} className={`${filter === "date" ? "bg-h-1 dark:bg-f-8 text-white dark:text-d-2" : "text-l-5 dark:text-d-c hover:text-h-1 hover:dark:text-f-8"} w-20 h-9 flex justify-center items-center rounded-lg`}>최신순</button>
                            <button onClick={handleFilterChange} value="name" onMouseDown={e => onMouseDown(e, 0.9, true)} onMouseUp={onMouseUp} onMouseOut={onMouseOut} className={`${filter === "name" ? "bg-h-1 dark:bg-f-8 text-white dark:text-d-2" : "text-l-5 dark:text-d-c hover:text-h-1 hover:dark:text-f-8"} w-20 h-9 flex justify-center items-center rounded-lg`}>이름순</button>
                            <button onClick={handleFilterChange} value="report" onMouseDown={e => onMouseDown(e, 0.9, true)} onMouseUp={onMouseUp} onMouseOut={onMouseOut} className={`${filter === "report" ? "bg-h-1 dark:bg-f-8 text-white dark:text-d-2" : "text-l-5 dark:text-d-c hover:text-h-1 hover:dark:text-f-8"} w-20 h-9 flex justify-center items-center rounded-lg`}>신고순</button>
                        </div>
                        <div className='w-full'>
                            <div className='w-full text-sm text-l-2 dark:text-white'>
                                <div className='flex flex-col gap-3'>
                                    {
                                        list && list.length > 0
                                        ? <>
                                            {
                                                list.map((user: any) => {
                                                    return (
                                                        <div key={user.user_no} className='px-6 py-4 relative rounded-lg bg-l-e dark:bg-d-4'>
                                                            <div className="flex tlg:flex-col items-center tlg:items-start gap-2 mb-2">
                                                                <Link href={`/admin/user/${user.user_no}`} className="block text-h-1 dark:text-f-8 hover:underline tlg:hover:no-underline">{user.user_name}</Link>
                                                                <div className="flex gap-2 items-center">
                                                                    <div className='text-xs text-l-5 dark:text-d-c'>{timeFormat(user.created_at)}</div>
                                                                    <div className='text-xs text-l-5 dark:text-d-c'>신고수: {user.nickname_reported}</div>
                                                                </div>
                                                            </div>
                                                            <div className='w-full overflow-hidden'>{user.user_id}</div>
                                                        </div>
                                                    )
                                                })
                                            }
                                        </>
                                        : <div className='h-16 text-base flex justify-center items-center text-center'>유저가 없습니다.</div>
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
            // 유저 목록 페이지 수
            const count = await FetchUsersLength(search);

            // 첫 유저 목록 가져오기
            const list: any = await FetchUsers(page, filter, search);

            return {
                props: {
                    params: {
                        theme: theme ? theme : 'light',
                        userAgent: userAgent,
                        user: session === null ? null : session.user,
                        page: page,
                        filter: filter,
                        search: search,
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

export default UserList;