// next
import Link from 'next/link';
import { NextSeo } from 'next-seo';

// next-auth
import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]';

// react
import React, { useEffect, useState, useRef } from 'react';

// api
import { FetchCommentsLength } from '../api/user/fetchcomments'
import { FetchComments } from '../api/user/fetchcomments';

// libraries
import axios from 'axios';
import { Pagination } from '@mui/material';

// components
import Header from "@/components/header";
import Footer from '@/components/footer';
import AdminDeleteCommentModal from '@/components/admindeletecommentmodal';

// common
import { timeFormat } from '@/libs/common';

const Comments = ({params}: any) => {
    const { theme, userAgent, user, page, filter, search, count, comments } = params;
    // 디바이스 체크
    const isMac: boolean = userAgent.includes("Mac OS") ? true : false;

    // 댓글 목록 state
    const [thisComments, setComments] = useState(comments);
    const [thisFilter, setFilter] = useState<string>(filter);
    const [thisSearch, setSearch] = useState<string>(search);
    const [fontId, setFontId] = useState<number>(0);
    const [commentId, setCommentId] = useState<number>(0);
    const [deleteModalDisplay, setDeleteModalDisplay] = useState<boolean>(false);

    console.log(filter);

    // 댓글 목록 페이지 변경
    const handleChange = (e: React.ChangeEvent<unknown>, value: number) => { return; }

    // 핕터 변경
    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => { setFilter(e.target.value); }

    // 페이지 변경 시 데이터 다시 불러오기
    // useEffect(() => {
    //     const fetchNewComments = async () => {
    //         await axios.get('/api/user/fetchcomments', {
    //             params: {
    //                 email: user.email,
    //                 provider: user.provider,
    //                 page: page,
    //                 filter: filter,
    //                 text: search
    //             }
    //         })
    //         .then((res) => {
    //             setComments(res.data.comments);
    //             setCount(res.data.count);
    //         })
    //         .catch(err => console.log(err));
    //     }
    //     fetchNewComments();
    // }, [user.email, user.provider, page, filter, search]);

    // 댓글 필터 버튼 클릭 시 값 state에 저장 후, API 호출
    // const handleClick = async () => {
    //     if (selectRef &&selectRef.current && textRef && textRef.current) {
    //         // state 저장
    //         setPage(1);
    //         setFilter(selectRef.current.value);
    //         setSearch(textRef.current.value);
            
    //         // API 호출
    //         await axios.get('/api/user/fetchcomments', {
    //             params: {
    //                 email: user.email,
    //                 provider: user.provider,
    //                 page: 1,
    //                 filter: selectRef.current.value,
    //                 text: textRef.current.value
    //             }
    //         })
    //         .then((res) => {
    //             setComments(res.data.comments);
    //             setCount(res.data.count);
    //         })
    //         .catch(err => console.log(err));
    //     }
    // }

     /** 댓글 삭제 모달창 열기 */
     const deleteCommentModalOpen = (e: React.MouseEvent<HTMLButtonElement>) => {
        setDeleteModalDisplay(true);
        setFontId(Number(e.currentTarget.dataset.font));
        setCommentId(Number(e.currentTarget.dataset.comment));
    }

    /** 댓글 삭제 모달창 닫기 */
    const deleteCommentModalClose = () => {
        setDeleteModalDisplay(false);
    }

    /** 댓글 삭제 시 댓글 업데이트 */
    const updateComments = (comments: any) => {
        setComments(comments);
    }

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
            <AdminDeleteCommentModal
                display={deleteModalDisplay}
                close={deleteCommentModalClose}
                font_id={fontId}
                comment_id={commentId}
                user_id={user.user_no}
                update={updateComments}
                page={page}
                text={thisSearch}
                filter={thisFilter}
            />

            {/* 메인 */}
            <form onSubmit={e => e.preventDefault()} className='w-full flex flex-col justify-center items-center'>
                <div className='w-[45rem] tmd:w-full px-4 flex flex-col justify-center items-start my-24 tlg:my-16'>
                    <h2 className='text-2xl tlg:text-xl text-l-2 dark:text-white font-bold mb-4'>내 댓글 목록</h2>
                    <div className='flex items-center mb-10'>
                        <input type="textbox" placeholder="폰트/댓글" className="w-60 h-[3.25rem] px-4 border-2 rounded-lg bg-l-e dark:bg-d-4 border-transparent focus:border-h-1 focus:dark:border-f-8 text-l-2 dark:text-white placeholder-l-5 dark:placeholder-d-c"/>
                    </div>
                    <div className='flex items-center gap-1.5 mb-4'>
                        <div>
                            <input type="radio" id="date" name="filter" className="hidden peer" defaultChecked/>
                            <label htmlFor='date' className='w-20 h-9 flex justify-center items-center cursor-pointer rounded-lg text-l-5 dark:text-d-c peer-checked:text-white peer-checked:dark:text-d-2 peer-checked:bg-h-1 peer-checked:dark:bg-f-8'>최신순</label>
                        </div>
                        <div>
                            <input type="radio" id="name" name="filter" className="hidden peer"/>
                            <label htmlFor='name' className='w-20 h-9 flex justify-center items-center cursor-pointer rounded-lg text-l-5 dark:text-d-c peer-checked:text-white peer-checked:dark:text-d-2 peer-checked:bg-h-1 peer-checked:dark:bg-f-8'>폰트순</label>
                        </div>
                    </div>
                    <div className='custom-sm-scrollbar w-full overflow-hidden overflow-x-auto'>
                        <div className='w-full text-sm text-l-2 dark:text-white'>
                            <div className='flex flex-col gap-3'>
                                {
                                    thisComments && thisComments.length > 0
                                    ? <>
                                        {
                                            thisComments.map((comment: any) => {
                                                return (
                                                    <div key={comment.comment_id} className='p-4 relative rounded-lg bg-l-e dark:bg-d-4'>
                                                        <div className="flex tlg:flex-col items-center tlg:items-start gap-2 mb-2">
                                                            <Link href={`/post/${comment.font_family.replaceAll(" ", "+")}`} className="block text-h-1 dark:text-f-8 hover:underline tlg:hover:no-underline">{comment.font_name}</Link>
                                                            <div className="flex gap-2 items-center">
                                                                <div className='text-xs text-l-5 dark:text-d-c'>{timeFormat(comment.created_at)}</div>
                                                                <div className='text-xs text-l-5 dark:text-d-c'>신고수: {comment.reported_politics + comment.reported_swearing + comment.reported_etc}</div>
                                                            </div>
                                                        </div>
                                                        <div className="pr-10"><Link href={`/post/${comment.font_family.replaceAll(" ", "+")}#c${comment.comment_id}`} className='ellipsed-text w-full hover:underline tlg:hover:no-underline'>{comment.comment}</Link></div>
                                                        <button onClick={deleteCommentModalOpen} data-font={comment.font_id} data-comment={comment.comment_id} className='group absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex justify-center items-center hover:bg-l-d hover:dark:bg-d-6 tlg:hover:bg-transparent tlg:hover:dark:bg-transparent'>
                                                            <i className="text-base text-l-2 dark:text-white fa-regular fa-trash-can"></i>
                                                        </button>
                                                    </div>
                                                )
                                            })
                                        }
                                    </>
                                    : <div className='h-16 flex justify-center items-center text-center'>댓글이 없습니다.</div>
                                }
                            </div>
                        </div>
                    </div>
                    <div className='w-full flex justify-center mt-3'>
                        <Pagination count={count} page={page} onChange={handleChange} shape='rounded' showFirstButton showLastButton/>
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
        const search = ctx.query.search === undefined ? "null" : ctx.query.search;

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
            const length = await FetchCommentsLength(session.user, search);
            const count = Number(length) % 10 > 0 ? Math.floor(Number(length)/10) + 1 : Math.floor(Number(length)/10);

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