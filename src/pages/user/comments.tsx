// next
import Link from 'next/link';
import { useRouter } from 'next/router';

// next-auth
import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]';

// react
import { useState } from 'react';

// api
import { FetchCommentsLength } from '../api/user/fetchcomments'
import { FetchComments } from '../api/user/fetchcomments';

// libraries
import { Pagination } from '@mui/material';
import { NextSeo } from 'next-seo';

// components
import Header from "@/components/header";
import Footer from '@/components/footer';
import Tooltip from '@/components/tooltip';
import SearchInput from '@/components/searchinput';
import DeleteCommentModal from '@/components/deletecommentmodal';

// common
import { timeFormat } from '@/libs/common';

const Comments = ({params}: any) => {
    const { theme, userAgent, user, page, filter, search, count, comments } = params;
    
    // 디바이스 체크
    const isMac: boolean = userAgent.includes("Mac OS") ? true : false;

    // router
    const router = useRouter();

    // states
    const [fontId, setFontId] = useState<number>(0);
    const [commentId, setCommentId] = useState<number>(0);
    const [deleteModalDisplay, setDeleteModalDisplay] = useState<boolean>(false);

    // 페이지 변경
    const handlePageChange = (e: React.ChangeEvent<unknown>, value: number) => {
        router.push(`/user/comments${value === 1 ? "" : `?page=${value}`}${filter === "date" ? "" : `${value === 1 ? "?" : "&"}filter=${filter}`}${search === "" ? "" : `${value === 1 && filter === "date" ? "?" : "&"}search=${search}`}`);
    }

    // 핕터 변경
    const handleFilterChange = (e: React.MouseEvent<HTMLButtonElement>) => {
        router.push(`/user/comments${e.currentTarget.value === "date" ? "" : `?filter=${e.currentTarget.value}`}${search === "" ? "" : `${page === 1 && e.currentTarget.value === "date" ? "?" : "&"}search=${search}`}`);
    }

    // 검색어 변경
    const handleSearchClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        const input = document.getElementById("search") as HTMLInputElement;
        router.push(`/user/comments${filter === "date" ? "" : `?filter=${filter}`}${input.value === "" ? "" : `${page === 1 && filter === "date" ? "?" : "&"}search=${input.value}`}`);
    }

     /** 댓글 삭제 모달창 열기 */
     const deleteCommentModalOpen = (e: React.MouseEvent<HTMLButtonElement>) => {
        setDeleteModalDisplay(true);
        setFontId(Number(e.currentTarget.dataset.font));
        setCommentId(Number(e.currentTarget.dataset.comment));
    }

    /** 댓글 삭제 모달창 닫기 */
    const deleteCommentModalClose = () => { setDeleteModalDisplay(false); }

    /** 댓글 삭제 시 댓글 업데이트 */
    const updateComments = () => { router.reload(); }

    return (
        <>
            {/* Head 부분*/}
            <NextSeo 
                title={"댓글 목록 · 폰트 아카이브"}
                description={"댓글 목록 - 폰트 아카이브 · 상업용 무료 한글 폰트 저장소"}
            />

            {/* 헤더 */}
            <Header
                isMac={isMac}
                theme={theme}
                user={user}
            />

            {/* 댓글 삭제 모달 */}
            <DeleteCommentModal
                display={deleteModalDisplay}
                close={deleteCommentModalClose}
                font_id={fontId}
                comment_id={commentId}
                user_id={user.user_no}
                update={updateComments}
            />

            {/* 메인 */}
            <form onSubmit={e => e.preventDefault()} className='w-full flex flex-col justify-center items-center'>
                <div className='w-[45rem] tmd:w-full px-4 flex flex-col justify-center items-start my-24 tlg:my-16'>
                    <h2 className='text-2xl tlg:text-xl text-l-2 dark:text-white font-bold mb-4'>내 댓글 목록</h2>
                    <div className='flex items-center mb-10'>
                        <SearchInput id="search" placeholder="폰트/댓글" value={search}/>
                        <button onClick={handleSearchClick} className="hidden">검색</button>
                    </div>
                    <div className='flex items-center gap-1.5 mb-4'>
                        <button onClick={handleFilterChange} value="date" className={`${filter === "date" ? "bg-h-1 dark:bg-f-8 text-white dark:text-d-2" : "text-l-5 dark:text-d-c hover:text-h-1 hover:dark:text-f-8"} w-20 h-9 flex justify-center items-center rounded-lg`}>최신순</button>
                        <button onClick={handleFilterChange} value="name" className={`${filter === "name" ? "bg-h-1 dark:bg-f-8 text-white dark:text-d-2" : "text-l-5 dark:text-d-c hover:text-h-1 hover:dark:text-f-8"} w-20 h-9 flex justify-center items-center rounded-lg`}>이름순</button>
                    </div>
                    <div className='w-full'>
                        <div className='w-full text-sm text-l-2 dark:text-white'>
                            <div className='flex flex-col gap-3'>
                                {
                                    comments && comments.length > 0
                                    ? <>
                                        {
                                            comments.map((comment: any) => {
                                                return (
                                                    <div key={comment.comment_id} className='px-6 py-4 relative rounded-lg bg-l-e dark:bg-d-4'>
                                                        <div className="flex tlg:flex-col items-center tlg:items-start gap-2 mb-2">
                                                            <Link href={`/post/${comment.font_family.replaceAll(" ", "+")}`} className="block text-h-1 dark:text-f-8 hover:underline tlg:hover:no-underline">{comment.font_name}</Link>
                                                            <div className="flex gap-2 items-center">
                                                                <div className='text-xs text-l-5 dark:text-d-c'>{timeFormat(comment.created_at)}</div>
                                                                <div className='text-xs text-l-5 dark:text-d-c'>신고수: {comment.reported_politics + comment.reported_swearing + comment.reported_etc}</div>
                                                            </div>
                                                        </div>
                                                        <div className="pr-10"><Link href={`/post/${comment.font_family.replaceAll(" ", "+")}#comment-section`} className='ellipsed-text w-full hover:underline tlg:hover:no-underline'>{comment.comment}</Link></div>
                                                        <button onClick={deleteCommentModalOpen} data-font={comment.font_id} data-comment={comment.comment_id} className='group absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex justify-center items-center hover:bg-l-d hover:dark:bg-d-6 tlg:hover:bg-transparent tlg:hover:dark:bg-transparent'>
                                                            <i className="text-base text-l-2 dark:text-white fa-regular fa-trash-can"></i>
                                                        </button>
                                                    </div>
                                                )
                                            })
                                        }
                                    </>
                                    : <div className='h-16 text-base flex justify-center items-center text-center'>댓글이 없습니다.</div>
                                }
                            </div>
                        </div>
                    </div>
                    <div className='w-full flex justify-center mt-3'>
                        <Pagination count={count} page={Number(page)} onChange={handlePageChange} shape='rounded'/>
                    </div>
                </div>
            </form>

            <Tooltip/>

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
        const session = await getServerSession(ctx.req, ctx.res, authOptions);

        if (session === null || session.user === undefined) {
            return {
                redirect: {
                    destination: '/404',
                    permanent: false,
                }
            }
        } else {
            // 댓글 페이지 수
            const count = await FetchCommentsLength(session.user, search);

            // 첫 댓글 목록 가져오기
            const comments = await FetchComments(session.user, page, filter, search);

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
                        comments: JSON.parse(JSON.stringify(comments))
                    }
                }
            }
        }
    }
    catch (error) {
        console.log(error);
    }
}

export default Comments;