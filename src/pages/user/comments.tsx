// next hooks
import { NextSeo } from 'next-seo';

// react hooks
import React, { useEffect, useState } from 'react';
import { useQuery, useQueryClient, QueryClient, QueryClientProvider } from "react-query";

// api
import axios from 'axios';
import { CheckIfSessionExists } from "../api/user/checkifsessionexists";
import { FetchUserInfo } from "../api/user/fetchuserinfo";
import { FetchComments } from '../api/user/fetchcomments'

// components
import Header from "@/components/header";
import { Pagination } from '@mui/material';;

const SendEmail = ({params}: any) => {
    // 디바이스 체크
    const isMac: boolean = params.userAgent.includes("Mac OS") ? true : false;

    // 빈 함수
    const emptyFn = () => { return; }

    // Pagination
    async function fetchProjects(page: number) {
        const { data } = await axios.get("/api/user/fetchcomments", {
            params: {
                page: page,
                user_id: params.user.user_no 
            }
        });
        return data;
    }

    const queryClient = useQueryClient();
    const [page, setPage] = useState<number>(0);
    // const [isLoading] = useState<boolean>(true);
    const {
        data,
        isLoading,
        isPreviousData
    } = useQuery(
        ["comments", page],
        () => fetchProjects(page),
        {
            staleTime: 5000,
            keepPreviousData: true,
            select: (data) => {
                return {
                    comments: data.comments,
                    hasMore: data.totalPages > page
                };
            }
        }
    )

    useEffect(() => {
        if (data?.hasMore) {
            queryClient.prefetchQuery(["projects", page + 1], () => fetchProjects(page + 1) );
        }
    }, [data, page, queryClient]);

    /** 댓글 시간 포맷 */
    const commentsTimeFormat = (time: string) => {
        const splitTime = time.split(':');
        return splitTime[0] + ':' + splitTime[1];
    }

    /** 댓글 날짜 포맷 */
    const commentsDateFormat = (date: string) => {
        const splitDate = date.split('-');
        return splitDate[0].replace("20", "") + '.' + splitDate[1] + '.' + commentsTimeFormat(splitDate[2].replace('T', ' ').replace('Z', ''));
    }

    return (
        <>
            {/* Head 부분*/}
            <NextSeo 
                title={"댓글 목록 · 폰트 아카이브"}
                description={"댓글 목록 - 상업용 무료 한글 폰트 아카이브"}
            />

            {/* 헤더 */}
            <Header
                isMac={isMac}
                theme={params.theme}
                user={params.user}
                page={"login"}
                lang={""}
                type={""}
                sort={""}
                source={""}
                handleTextChange={emptyFn}
                handleLangOptionChange={emptyFn}
                handleTypeOptionChange={emptyFn}
                handleSortOptionChange={emptyFn}
                handleSearch={emptyFn}
            />

            {/* 메인 */}
            <form onSubmit={e => e.preventDefault()} className='w-[100%] flex flex-col justify-center items-center'>
                <div className='w-[720px] tmd:w-[100%] flex flex-col justify-center items-start my-[100px] tlg:my-[40px]'>
                    <h2 className='text-[20px] tlg:text-[18px] text-theme-4 dark:text-theme-9 font-medium mb-[12px]'>내 댓글 목록</h2>
                    <div className='w-content flex items-center p-[6px] mb-[8px] rounded-[6px] text-theme-10 dark:text-theme-9 bg-theme-5 dark:bg-theme-3'>
                        <select className='w-[80px] h-[32px] text-[12px] pt-px px-[14px] bg-transparent rounded-[6px] outline-none border border-theme-6 dark:border-theme-5 cursor-pointer'>
                            <option defaultChecked>댓글</option>
                            <option>답글</option>
                        </select>
                        <input type='textbox' className='w-[200px] h-[32px] ml-[8px] px-[12px] text-[12px] bg-transparent border rounded-[6px] border-theme-6 dark:border-theme-5'/>
                        <button className='w-[68px] h-[32px] ml-[8px] text-[12px] border rounded-[6px] bg-theme-6/40 hover:bg-theme-6/60 tlg:hover:bg-theme-6/40 dark:bg-theme-4 hover:dark:bg-theme-5 tlg:hover:dark:bg-theme-4'>검색</button>
                    </div>
                    <div className='w-[100%] rounded-[8px] border border-theme-5 dark:border-theme-3 overflow-hidden'>
                        <table className='w-[100%] text-[12px] text-theme-10 dark:text-theme-9'>
                            <thead className='h-[40px] text-left bg-theme-5 dark:bg-theme-3'>
                                <tr>
                                    <th className='w-[128px] pl-[20px]'>폰트</th>
                                    <th className='pl-[20px]'>댓글</th>
                                    <th className='w-[128px] pl-[20px]'>작성 날짜</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    isLoading
                                    ? <>
                                        <tr className='h-[40px]'><td className='pl-[20px] py-[10px]'><div className='w-[80%] h-[16px] rounded-[4px] skeleton-gradient'></div></td><td className='pl-[20px] py-[10px]'><div className='w-[80%] h-[16px] rounded-[4px] skeleton-gradient'></div></td><td className='pl-[20px] py-[10px]'><div className='w-[80%] h-[16px] rounded-[4px] skeleton-gradient'></div></td></tr>
                                        <tr className='h-[40px]'><td className='pl-[20px] py-[10px]'><div className='w-[80%] h-[16px] rounded-[4px] skeleton-gradient'></div></td><td className='pl-[20px] py-[10px]'><div className='w-[80%] h-[16px] rounded-[4px] skeleton-gradient'></div></td><td className='pl-[20px] py-[10px]'><div className='w-[80%] h-[16px] rounded-[4px] skeleton-gradient'></div></td></tr>
                                        <tr className='h-[40px]'><td className='pl-[20px] py-[10px]'><div className='w-[80%] h-[16px] rounded-[4px] skeleton-gradient'></div></td><td className='pl-[20px] py-[10px]'><div className='w-[80%] h-[16px] rounded-[4px] skeleton-gradient'></div></td><td className='pl-[20px] py-[10px]'><div className='w-[80%] h-[16px] rounded-[4px] skeleton-gradient'></div></td></tr>
                                        <tr className='h-[40px]'><td className='pl-[20px] py-[10px]'><div className='w-[80%] h-[16px] rounded-[4px] skeleton-gradient'></div></td><td className='pl-[20px] py-[10px]'><div className='w-[80%] h-[16px] rounded-[4px] skeleton-gradient'></div></td><td className='pl-[20px] py-[10px]'><div className='w-[80%] h-[16px] rounded-[4px] skeleton-gradient'></div></td></tr>
                                        <tr className='h-[40px]'><td className='pl-[20px] py-[10px]'><div className='w-[80%] h-[16px] rounded-[4px] skeleton-gradient'></div></td><td className='pl-[20px] py-[10px]'><div className='w-[80%] h-[16px] rounded-[4px] skeleton-gradient'></div></td><td className='pl-[20px] py-[10px]'><div className='w-[80%] h-[16px] rounded-[4px] skeleton-gradient'></div></td></tr>
                                        <tr className='h-[40px]'><td className='pl-[20px] py-[10px]'><div className='w-[80%] h-[16px] rounded-[4px] skeleton-gradient'></div></td><td className='pl-[20px] py-[10px]'><div className='w-[80%] h-[16px] rounded-[4px] skeleton-gradient'></div></td><td className='pl-[20px] py-[10px]'><div className='w-[80%] h-[16px] rounded-[4px] skeleton-gradient'></div></td></tr>
                                        <tr className='h-[40px]'><td className='pl-[20px] py-[10px]'><div className='w-[80%] h-[16px] rounded-[4px] skeleton-gradient'></div></td><td className='pl-[20px] py-[10px]'><div className='w-[80%] h-[16px] rounded-[4px] skeleton-gradient'></div></td><td className='pl-[20px] py-[10px]'><div className='w-[80%] h-[16px] rounded-[4px] skeleton-gradient'></div></td></tr>
                                        <tr className='h-[40px]'><td className='pl-[20px] py-[10px]'><div className='w-[80%] h-[16px] rounded-[4px] skeleton-gradient'></div></td><td className='pl-[20px] py-[10px]'><div className='w-[80%] h-[16px] rounded-[4px] skeleton-gradient'></div></td><td className='pl-[20px] py-[10px]'><div className='w-[80%] h-[16px] rounded-[4px] skeleton-gradient'></div></td></tr>
                                        <tr className='h-[40px]'><td className='pl-[20px] py-[10px]'><div className='w-[80%] h-[16px] rounded-[4px] skeleton-gradient'></div></td><td className='pl-[20px] py-[10px]'><div className='w-[80%] h-[16px] rounded-[4px] skeleton-gradient'></div></td><td className='pl-[20px] py-[10px]'><div className='w-[80%] h-[16px] rounded-[4px] skeleton-gradient'></div></td></tr>
                                        <tr className='h-[40px]'><td className='pl-[20px] py-[10px]'><div className='w-[80%] h-[16px] rounded-[4px] skeleton-gradient'></div></td><td className='pl-[20px] py-[10px]'><div className='w-[80%] h-[16px] rounded-[4px] skeleton-gradient'></div></td><td className='pl-[20px] py-[10px]'><div className='w-[80%] h-[16px] rounded-[4px] skeleton-gradient'></div></td></tr>
                                    </>
                                    : data && data.comments.length > 0
                                        ? <>
                                            {
                                                data.comments.map((comment: any) => {
                                                    return (
                                                        <tr key={comment.comment_id} className='h-[40px] border-t border-theme-5 dark:border-theme-3'>
                                                            <td className='pl-[20px] py-[10px]'>{comment.name}</td>
                                                            <td className='pl-[20px] py-[10px]'><a href={`/detailpage/${comment.code}#c${comment.comment_id}`} target="_blank" className='hover:underline tlg:hover:no-underline'>{comment.comment}</a></td>
                                                            <td className='pl-[20px] py-[10px]'>{commentsDateFormat(comment.created_at)}</td>
                                                        </tr> 
                                                    )
                                                })
                                            }
                                        </>
                                        : <tr className='h-[60px]'>
                                            <td colSpan={3} className='text-center'>아직 댓글이 없습니다.</td>
                                        </tr>
                                }
                            </tbody>
                        </table>
                    </div>
                    <div className='w-[100%] flex justify-center mt-[12px]'>
                        <Pagination count={params.count} shape='rounded'/>
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
        const user = ctx.req.cookies.session === undefined ? null : (
            await CheckIfSessionExists(ctx.req.cookies.session) === true 
            ? await FetchUserInfo(ctx.req.cookies.session)
            : null
        )

        // 댓글 length 가져오기
        const length = await FetchComments(user.user_no);
        const count = Number(length) % 10 > 0 ? Math.floor(Number(length)/10) + 1 : Math.floor(Number(length)/10);

        // 쿠키에 저장된 세션ID가 유효하지 않다면, 메인페이지로 이동, 유효하면 클리이언트로 유저 정보 return
        if (user === null) {
            return {
                redirect: {
                    destination: '/',
                    permanent: false,
                }
            }
        } else {
            return {
                props: {
                    params: {
                        theme: cookieTheme,
                        userAgent: userAgent,
                        user: user,
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

export default SendEmail;