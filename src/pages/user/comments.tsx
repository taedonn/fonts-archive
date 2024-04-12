// next
import Link from 'next/link';
import { useRouter } from 'next/router';

// next-auth
import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]';

// react
import { useState } from 'react';

// api
import { FetchCommentsLength, FetchComments } from '../api/user/fetchcomments'

// libraries
import { Pagination } from '@mui/material';
import { NextSeo } from 'next-seo';

// components
import Motion from '@/components/motion';
import Header from "@/components/header";
import Footer from '@/components/footer';
import SearchInput from '@/components/searchinput';
import DeleteCommentModal from '@/components/deletecommentmodal';
import AdSense from '@/components/adSense';

// common
import { timeFormat, onMouseDown, onMouseUp, onMouseOut } from '@/libs/common';

const Comments = ({params}: any) => {
    const { theme, userAgent, user, page, filter, search, count, comments } = params;
    
    // 디바이스 체크
    const isMac: boolean = userAgent.includes("Mac OS") ? true : false;

    // router
    const router = useRouter();

    // states
    const [fontId, setFontId] = useState<number>(0);
    const [commentId, setCommentId] = useState<number>(0);
    const [bundleId, setBundleId] = useState<number>(0);
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
        setBundleId(Number(e.currentTarget.dataset.bundle));
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
                bundle_id={bundleId}
            />

            {/* 메인 */}
            <Motion
                initialOpacity={0}
                animateOpacity={1}
                exitOpacity={0}
                transitionType="spring"
            >
                <form onSubmit={e => e.preventDefault()} className='w-full px-4 flex flex-col justify-center items-center text-l-2 dark:text-white'>
                    <div className='w-full md:w-[45.5rem] flex flex-col justify-center my-16 lg:my-24 mt-8 lg:mt-16'>
                        <h2 className='text-2xl font-bold mb-6'>내 댓글 목록</h2>
                        <div className='flex items-center mb-10'>
                            <SearchInput id="search" placeholder="폰트/댓글" value={search} color="light"/>
                            <button onClick={handleSearchClick} className="hidden">검색</button>
                        </div>
                        <div className='w-full flex'>
                            <AdSense
                                pc={{
                                    style: 'display: inline-block; width: 728px; height: 90px;',
                                    client: 'ca-pub-7819549426971576',
                                    slot: '3707368535'
                                }}
                                mobile={{
                                    style: 'display: inline-block; width: 300px; height: 100px;',
                                    client: 'ca-pub-7819549426971576',
                                    slot: '1032069893'
                                }}
                                marginBottom={1}
                            />
                        </div>
                        <div className='flex items-center gap-1.5 mb-4'>
                            <button onClick={handleFilterChange} value="date" onMouseDown={e => onMouseDown(e, 0.9, true)} onMouseUp={onMouseUp} onMouseOut={onMouseOut} className={`${filter === "date" ? "bg-h-1 dark:bg-f-8 text-white dark:text-d-2" : "text-l-5 dark:text-d-c lg:hover:text-h-1 lg:hover:dark:text-f-8"} w-20 h-9 flex justify-center items-center rounded-lg`}>최신순</button>
                            <button onClick={handleFilterChange} value="name" onMouseDown={e => onMouseDown(e, 0.9, true)} onMouseUp={onMouseUp} onMouseOut={onMouseOut} className={`${filter === "name" ? "bg-h-1 dark:bg-f-8 text-white dark:text-d-2" : "text-l-5 dark:text-d-c lg:hover:text-h-1 lg:hover:dark:text-f-8"} w-20 h-9 flex justify-center items-center rounded-lg`}>이름순</button>
                        </div>
                        <div className='w-full'>
                            <div className='w-full text-sm'>
                                <div className='flex flex-col gap-3'>
                                    {
                                        comments && comments.length > 0
                                        ? <>
                                            {
                                                comments.map((comment: any) => {
                                                    return (
                                                        <div key={comment.comment_id} className='px-6 py-4 relative rounded-lg bg-l-f dark:bg-d-3'>
                                                            <div className="flex tlg:flex-col lg:items-center gap-2 mb-2">
                                                                <Link href={`/post/${comment.font_family.replaceAll(" ", "+")}`} className="block text-h-1 dark:text-f-8 lg:hover:underline">{comment.font_name}</Link>
                                                                <div className="flex gap-2 items-center">
                                                                    <div className='text-xs text-l-5 dark:text-d-c'>{timeFormat(comment.created_at)}</div>
                                                                    <div className='text-xs text-l-5 dark:text-d-c'>신고수: {comment.reported_politics + comment.reported_swearing + comment.reported_etc}</div>
                                                                </div>
                                                            </div>
                                                            <div className="pr-10"><Link href={`/post/${comment.font_family.replaceAll(" ", "+")}#c${comment.comment_id}`} className='ellipsed-text w-full lg:hover:underline'>{comment.comment}</Link></div>
                                                            <button onClick={deleteCommentModalOpen} data-font={comment.font_id} data-comment={comment.comment_id} data-bundle={comment.bundle_id} className='group absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex justify-center items-center lg:hover:bg-l-e lg:hover:dark:bg-d-4'>
                                                                <i className="text-base fa-regular fa-trash-can"></i>
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
                        <div className='w-full flex justify-center mt-6'>
                            <Pagination count={count} page={Number(page)} onChange={handlePageChange} shape='rounded'/>
                        </div>
                        <div className='w-full flex'>
                            <AdSense
                                pc={{
                                    style: 'display: inline-block; width: 728px; height: 90px;',
                                    client: 'ca-pub-7819549426971576',
                                    slot: '3707368535'
                                }}
                                mobile={{
                                    style: 'display: inline-block; width: 300px; height: 100px;',
                                    client: 'ca-pub-7819549426971576',
                                    slot: '1032069893'
                                }}
                                marginTop={2}
                            />
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