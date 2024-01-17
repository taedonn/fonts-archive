// next
import Link from 'next/link';
import { useRouter } from 'next/router';

// next-auth
import { getServerSession } from "next-auth";
import { authOptions } from '@/pages/api/auth/[...nextauth]';

// react
import { useState, useRef } from 'react';

// api
import { FetchUsers, FetchUsersLength } from '@/pages/api/admin/user';

// libraries
import { Pagination } from '@mui/material';
import { NextSeo } from 'next-seo';

// components
import Header from "@/components/header";
import Footer from '@/components/footer';

// common
import { timeFormat } from '@/libs/common';

const UserList = ({params}: any) => {
    const { theme, userAgent, user, page, filter, search, list, count } = params;

    // 디바이스 체크
    const isMac: boolean = userAgent.includes("Mac OS") ? true : false;

    const router = useRouter();

    // 페이지 변경
    const handlePageChange = (e: React.ChangeEvent<unknown>, value: number) => {
        router.push(`/admin/user/list${value === 1 ? "" : `?page=${value}`}${filter === "date" ? "" : `${value === 1 ? "?" : "&"}filter=${filter}`}${search === "" ? "" : `${value === 1 && filter === "date" ? "?" : "&"}search=${search}`}`);
    }

    // 핕터 변경
    const handleFilterChange = (e: React.MouseEvent<HTMLButtonElement>) => {
        router.push(`/admin/user/list${e.currentTarget.value === "date" ? "" : `?filter=${e.currentTarget.value}`}${search === "" ? "" : `${page === 1 && e.currentTarget.value === "date" ? "?" : "&"}search=${search}`}`);
    }

    // 검색 버튼 클릭 시 값 state에 저장 후, API 호출
    const handleClick = async () => {
        
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
            <form onSubmit={e => e.preventDefault()} className='w-full flex flex-col justify-center items-center'>
                <div className='w-[45rem] tmd:w-full px-4 flex flex-col justify-center items-start my-24 tlg:my-16'>
                    <h2 className='text-2xl tlg:text-xl text-l-2 dark:text-white font-bold mb-4'>유저 목록</h2>
                    <div className='flex items-center mb-10'>
                        <input type="textbox" id="search" placeholder="폰트/댓글" defaultValue={search} className="w-60 h-[3.25rem] px-4 border-2 rounded-lg bg-l-e dark:bg-d-4 border-transparent focus:border-h-1 focus:dark:border-f-8 text-l-2 dark:text-white placeholder-l-5 dark:placeholder-d-c"/>
                        <button onClick={handleClick} className="hidden">검색</button>
                    </div>
                    <div className='flex items-center gap-1.5 mb-4'>
                        <button onClick={handleFilterChange} value="date" className={`${filter === "date" ? "bg-h-1 dark:bg-f-8 text-white dark:text-d-2" : "text-l-5 dark:text-d-c hover:text-h-1 hover:dark:text-f-8"} w-20 h-9 flex justify-center items-center rounded-lg`}>최신순</button>
                        <button onClick={handleFilterChange} value="name" className={`${filter === "name" ? "bg-h-1 dark:bg-f-8 text-white dark:text-d-2" : "text-l-5 dark:text-d-c hover:text-h-1 hover:dark:text-f-8"} w-20 h-9 flex justify-center items-center rounded-lg`}>이름순</button>
                        <button onClick={handleFilterChange} value="report" className={`${filter === "report" ? "bg-h-1 dark:bg-f-8 text-white dark:text-d-2" : "text-l-5 dark:text-d-c hover:text-h-1 hover:dark:text-f-8"} w-20 h-9 flex justify-center items-center rounded-lg`}>신고순</button>
                    </div>
                    <div className='w-full rounded-lg overflow-hidden overflow-x-auto'>
                        <div className='w-[720px] text-xs text-theme-10 dark:text-theme-9 bg-theme-4 dark:bg-theme-4'>
                            <div className='text-left bg-theme-5 dark:bg-theme-3'>
                                <div className='h-10 tlg:h-9 flex items-center'>
                                    <div className='w-[52px] pl-3 shrink-0'>번호</div>
                                    <div className='w-20 pl-3 shrink-0'>유저명</div>
                                    <div className='w-full pl-3'>유저 아이디</div>
                                    <div className='w-[100px] pl-3 shrink-0'>수정 날짜</div>
                                    <div className='w-[100px] pl-3 shrink-0'>생성 날짜</div>
                                    <div className='w-20 pl-3 shrink-0'>닉네임 신고</div>
                                    <div className='w-24 pl-3 shrink-0'>이메일 확인</div>
                                </div>
                            </div>
                            <div>
                                {
                                    list && list.length > 0
                                    ? <>
                                        {
                                            list.map((user: any) => {
                                                return (
                                                    <div key={user.code} className='h-10 tlg:h-9 relative flex items-center border-t border-theme-5 dark:border-theme-3'>
                                                        <div className='w-[52px] pl-3 shrink-0'>{user.user_no}</div>
                                                        <div className='w-20 pl-3 shrink-0'><Link href={`/admin/user/${user.user_no}`} className='ellipsed-text text-theme-yellow dark:text-theme-blue-1 focus:underline hover:underline tlg:hover:no-underline'>{user.user_name}</Link></div>
                                                        <div className='w-full pl-3 overflow-hidden'><div className='ellipsed-text'>{user.user_id}</div></div>
                                                        <div className='w-[100px] pl-3 shrink-0'>{timeFormat(user.updated_at)}</div>
                                                        <div className='w-[100px] pl-3 shrink-0'>{timeFormat(user.created_at)}</div>
                                                        <div className='w-20 shrink-0 text-center'>{user.nickname_reported}</div>
                                                        <div className='w-24 pl-3 shrink-0'>
                                                            {
                                                                user.user_email_confirm
                                                                ? <>
                                                                    <span className='text-theme-green'>확인 됨</span>
                                                                    <i className="text-[10px] ml-1 text-theme-green fa-solid fa-check"></i>
                                                                </> : <>
                                                                    <span className='text-theme-red'>확인 안됨</span>
                                                                    <i className="text-xs ml-1 text-theme-red fa-solid fa-xmark"></i>
                                                                </>
                                                            }
                                                        </div>
                                                    </div>
                                                )
                                            })
                                        }
                                    </>
                                    : <div className='h-[60px]'>
                                        <div className='leading-[60px] text-center'>유저가 없습니다.</div>
                                    </div>
                                }
                            </div>
                        </div>
                    </div>
                    <div className='w-full flex justify-center mt-3'>
                        <Pagination count={count} page={page} onChange={handlePageChange} shape='rounded'/>
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
            const count = await FetchUsersLength(page, search);

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