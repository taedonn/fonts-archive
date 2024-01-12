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
import SelectBox from '@/components/selectbox';

// common
import { timeFormat } from '@/libs/common';

const Comments = ({params}: any) => {
    const { theme, userAgent, user, count, comments } = params;
    // 디바이스 체크
    const isMac: boolean = userAgent.includes("Mac OS") ? true : false;

    // 댓글 목록 state
    const [thisComments, setComments] = useState(comments);
    const [thisCount, setCount] = useState<number>(count);
    const [filter, setFilter] = useState<string>('all');
    const [text, setText] = useState<string>('');

    // 댓글 목록 ref
    const selectRef = useRef<HTMLSelectElement>(null);
    const textRef = useRef<HTMLInputElement>(null);

    // 댓글 목록 페이지 변경
    const [page, setPage] = useState<number>(1);
    const handleChange = (e: React.ChangeEvent<unknown>, value: number) => { setPage(value); };

    // 페이지 변경 시 데이터 다시 불러오기
    useEffect(() => {
        const fetchNewComments = async () => {
            await axios.get('/api/user/fetchcomments', {
                params: {
                    email: user.email,
                    provider: user.provider,
                    page: page,
                    filter: filter,
                    text: text
                }
            })
            .then((res) => {
                setComments(res.data.comments);
                setCount(res.data.count);
            })
            .catch(err => console.log(err));
        }
        fetchNewComments();
    }, [user.email, user.provider, page, filter, text]);

    // 댓글 필터 버튼 클릭 시 값 state에 저장 후, API 호출
    const handleClick = async () => {
        if (selectRef &&selectRef.current && textRef && textRef.current) {
            // state 저장
            setPage(1);
            setFilter(selectRef.current.value);
            setText(textRef.current.value);
            
            // API 호출
            await axios.get('/api/user/fetchcomments', {
                params: {
                    email: user.email,
                    provider: user.provider,
                    page: 1,
                    filter: selectRef.current.value,
                    text: textRef.current.value
                }
            })
            .then((res) => {
                setComments(res.data.comments);
                setCount(res.data.count);
            })
            .catch(err => console.log(err));
        }
    }

    // 댓글 삭제
    const [fontId, setFontId] = useState<number>(0);
    const [commentId, setCommentId] = useState<number>(0);
    const [deleteModalDisplay, setDeleteModalDisplay] = useState<boolean>(false);

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

    const emptyFn = () => { return; }

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
                text={text}
                filter={filter}
            />

            {/* 메인 */}
            <form onSubmit={e => e.preventDefault()} className='w-full flex flex-col justify-center items-center'>
                <div className='w-[720px] tmd:w-full flex flex-col justify-center items-start my-[100px] tlg:my-16'>
                    <h2 className='text-2xl tlg:text-xl text-l-2 dark:text-white font-bold mb-4'>내 댓글 목록</h2>
                    <div className='flex items-center mb-8'>
                        {/* <select ref={selectRef} className='w-[80px] h-8 tlg:h-7 text-xs pt-px px-3.5 bg-transparent rounded-md outline-none border border-theme-6 dark:border-theme-5 cursor-pointer'>
                            <option value='all' defaultChecked>전체</option>
                            <option value='font'>폰트</option>
                            <option value='comment'>댓글</option>
                        </select> */}
                        {/* <input ref={textRef} type='textbox' placeholder='폰트/댓글' className='w-[200px] tlg:w-40 h-8 tlg:h-7 ml-2 px-3 text-xs bg-transparent border rounded-md border-theme-6 dark:border-theme-5'/>
                        <button onClick={handleClick} className='w-[68px] h-8 tlg:h-7 ml-2 text-xs border rounded-md bg-theme-6/40 hover:bg-theme-6/60 tlg:hover:bg-theme-6/40 dark:bg-theme-4 hover:dark:bg-theme-5 tlg:hover:dark:bg-theme-4'>검색</button> */}
                        <div className="w-44 rounded-lg bg-l-e">
                            <SelectBox
                                height={48}
                                title="필터"
                                icon="bi-globe2"
                                value="filter"
                                select={filter}
                                options={[
                                    { value: "all", name: "전체" },
                                    { value: "kr", name: "폰트" },
                                    { value: "en", name: "댓글" },
                                ]}
                                optionChange={emptyFn}
                            />
                        </div>
                    </div>
                    <div className='w-full rounded-lg overflow-hidden overflow-x-auto'>
                        <div className='w-[720px] text-xs text-theme-10 dark:text-theme-9 bg-theme-4 dark:bg-theme-4'>
                            <div className='text-left bg-theme-5 dark:bg-theme-3'>
                                <div className='h-10 tlg:h-9 flex items-center'>
                                    <div className='w-[120px] pl-4 shrink-0'>폰트</div>
                                    <div className='w-full pl-4'>댓글</div>
                                    <div className='w-[120px] pl-4 shrink-0'>수정 날짜</div>
                                    <div className='w-[120px] pl-4 shrink-0'>작성 날짜</div>
                                    <div className='w-[52px] text-center shrink-0'>신고수</div>
                                    <div className='w-[88px] text-center shrink-0'>댓글 삭제</div>
                                </div>
                            </div>
                            <div>
                                {
                                    thisComments && thisComments.length > 0
                                    ? <>
                                        {
                                            thisComments.map((comment: any) => {
                                                return (
                                                    <div key={comment.comment_id} className='h-10 tlg:h-9 relative flex items-center border-t border-theme-5 dark:border-theme-3'>
                                                        <div className='w-[120px] pl-4 shrink-0'><Link href={`/post/${comment.font_family.replaceAll(" ", "+")}`} className='ellipsed-text text-theme-yellow dark:text-theme-blue-1 focus:underline hover:underline tlg:hover:no-underline'>{comment.font_name}</Link></div>
                                                        <div className='w-full pl-4'><Link href={`/post/${comment.font_family.replaceAll(" ", "+")}#c${comment.comment_id}`} className='ellipsed-text focus:underline hover:underline tlg:hover:no-underline'>{comment.comment}</Link></div>
                                                        <div className='w-[120px] pl-4 shrink-0'>{timeFormat(comment.updated_at)}</div>
                                                        <div className='w-[120px] pl-4 shrink-0'>{timeFormat(comment.created_at)}</div>
                                                        <div className='w-[52px] shrink-0 flex justify-center'>{comment.reported_politics + comment.reported_swearing + comment.reported_etc}</div>
                                                        <div className='w-[88px] shrink-0 relative flex justify-center'>
                                                            <button onClick={deleteCommentModalOpen} data-font={comment.font_id} data-comment={comment.comment_id} className='group w-5 h-5 flex justify-center items-center'>
                                                                <i className="text-xs text-theme-10 group-hover:text-theme-yellow tlg:group-hover:text-theme-10 dark:text-theme-9 group-hover:dark:text-theme-blue-1 tlg:group-hover:dark:text-theme-9 fa-regular fa-trash-can"></i>
                                                            </button>
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
                        <Pagination count={thisCount} page={page} onChange={handleChange} shape='rounded' showFirstButton showLastButton/>
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
        // 체크
        const { theme } = ctx.req.cookies;

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
            const length = await FetchCommentsLength(session.user);
            const count = Number(length) % 10 > 0 ? Math.floor(Number(length)/10) + 1 : Math.floor(Number(length)/10);

            // 첫 댓글 목록 가져오기
            const comments = await FetchComments(session.user, undefined);

            return {
                props: {
                    params: {
                        theme: theme ? theme : 'light',
                        userAgent: userAgent,
                        user: session === null ? null : session.user,
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