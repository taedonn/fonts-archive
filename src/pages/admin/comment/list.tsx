// next hooks
import { NextSeo } from 'next-seo';

// react hooks
import React, { useState, useRef, useEffect } from 'react';

// api
import axios from 'axios';
import { CheckIfSessionExists } from "@/pages/api/user/checkifsessionexists";
import { FetchUserInfo } from "@/pages/api/user/fetchuserinfo";

import { FetchCommentsLength } from '@/pages/api/admin/comment';
import { FetchComments } from '@/pages/api/admin/comment';

// components
import Header from "@/components/header";
import AdminDeleteCommentModal from '@/components/admindeletecommentmodal';
import { Pagination } from '@mui/material';

const CommentList = ({params}: any) => {
    // 디바이스 체크
    const isMac: boolean = params.userAgent.includes("Mac OS") ? true : false;

    // 빈 함수
    const emptyFn = () => { return; }

    // 댓글 목록 state
    const [comments, setComments] = useState(JSON.parse(params.comments));
    const [count, setCount] = useState<number>(params.count);
    const [text, setText] = useState<string>('');
    const [filter, setFilter] = useState<string>('');

    // 댓글 목록 ref
    const selectRef = useRef<HTMLSelectElement>(null);
    const textRef = useRef<HTMLInputElement>(null);

    // 댓글 목록 페이지 변경
    const [page, setPage] = useState<number>(1);
    const handleChange = (e: React.ChangeEvent<unknown>, value: number) => {
        setPage(value);
    };

    // 페이지 변경 시 데이터 다시 불러오기
    useEffect(() => {
        const fetchNewComments = async () => {
            await axios.get('/api/admin/comment', {
                params: {
                    action: 'list',
                    page: page,
                    text: text,
                    filter: filter,
                }
            })
            .then((res) => {
                setComments(res.data.comments);
            })
            .catch(err => console.log(err));
        }
        fetchNewComments();
    }, [params.user.user_no, page, text, filter]);

    // 댓글 필터 버튼 클릭 시 값 state에 저장 후, API 호출
    const handleClick = async () => {
        if (selectRef &&selectRef.current && textRef && textRef.current) {
            // state 저장
            setPage(1);
            setText(textRef.current.value);
            setFilter(selectRef.current.value);
            
            // API 호출
            await axios.get('/api/admin/comment', {
                params: {
                    action: 'list',
                    page: 1,
                    text: textRef.current.value,
                    filter: selectRef.current.value,
                }
            })
            .then((res) => {
                setComments(res.data.comments);
                setCount(res.data.count);
            })
            .catch(err => console.log(err));
        }
    }

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

    return (
        <>
            {/* Head 부분*/}
            <NextSeo 
                title={"댓글 관리 · 폰트 아카이브"}
                description={"댓글 관리 - 상업용 무료 한글 폰트 저장소"}
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

            {/* 댓글 삭제 모달 */}
            <AdminDeleteCommentModal
                display={deleteModalDisplay}
                close={deleteCommentModalClose}
                font_id={fontId}
                comment_id={commentId}
                user_id={0}
                update={updateComments}
                page={page}
                text={text}
                filter={filter}
            />

            {/* 메인 */}
            <form onSubmit={e => e.preventDefault()} className='w-[100%] flex flex-col justify-center items-center'>
                <div className='w-[720px] tmd:w-[100%] flex flex-col justify-center items-start my-[100px] tlg:my-[40px]'>
                    <h2 className='text-[20px] tlg:text-[18px] text-theme-3 dark:text-theme-9 font-medium mb-[16px] tlg:mb-[12px]'>댓글 목록</h2>
                    <div className='w-content flex items-center p-[6px] mb-[12px] tlg:mb-[8px] rounded-[6px] text-theme-10 dark:text-theme-9 bg-theme-5 dark:bg-theme-3'>
                        <select ref={selectRef} className='w-[80px] h-[32px] tlg:h-[28px] text-[12px] pt-px px-[14px] bg-transparent rounded-[6px] outline-none border border-theme-6 dark:border-theme-5 cursor-pointer'>
                            <option value='all' defaultChecked>전체</option>
                            <option value='font'>폰트</option>
                            <option value='user'>작성자</option>
                            <option value='comment'>댓글</option>
                        </select>
                        <input ref={textRef} type='textbox' placeholder='폰트/작성자/댓글' className='w-[200px] tlg:w-[160px] h-[32px] tlg:h-[28px] ml-[8px] px-[12px] text-[12px] bg-transparent border rounded-[6px] border-theme-6 dark:border-theme-5'/>
                        <button onClick={handleClick} className='w-[68px] h-[32px] tlg:h-[28px] ml-[8px] text-[12px] border rounded-[6px] bg-theme-6/40 hover:bg-theme-6/60 tlg:hover:bg-theme-6/40 dark:bg-theme-4 hover:dark:bg-theme-5 tlg:hover:dark:bg-theme-4'>검색</button>
                    </div>
                    <div className='w-[100%] rounded-[8px] overflow-hidden overflow-x-auto'>
                        <table className='w-[720px] text-[12px] text-theme-10 dark:text-theme-9 bg-theme-4 dark:bg-theme-4'>
                            <thead className='text-left bg-theme-5 dark:bg-theme-3'>
                                <tr>
                                    <th className='h-[40px] tlg:h-[34px] w-[52px] pl-[16px]'>번호</th>
                                    <th className='w-[100px] pl-[16px]'>폰트</th>
                                    <th className='w-[100px] pl-[16px]'>작성자</th>
                                    <th className='pl-[16px]'>댓글</th>
                                    <th className='w-[120px] pl-[16px]'>수정 날짜</th>
                                    <th className='w-[120px] pl-[16px]'>작성 날짜</th>
                                    <th className='w-[68px]'>댓글 삭제</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    comments && comments.length > 0
                                    ? <>
                                        {
                                            comments.map((comment: any) => {
                                                return (
                                                    <tr key={comment.comment_id} className='border-t border-theme-5 dark:border-theme-3'>
                                                        <td className='h-[40px] tlg:h-[34px] pl-[16px] py-[10px]'>{comment.comment_id}</td>
                                                        <td className='pl-[16px] py-[10px] break-keep'><a href={`/post/${comment.font_family.replaceAll(" ", "+")}`} className='text-theme-yellow dark:text-theme-blue-1 focus:underline hover:underline tlg:hover:no-underline'>{comment.name}</a></td>
                                                        <td className='pl-[16px] py-[10px] break-keep'><a href={`/admin/user/${comment.user_no}`} className='focus:underline hover:underline tlg:hover:no-underline'>{comment.user_name}</a></td>
                                                        <td className='pl-[16px] py-[10px] break-keep'><a href={`/post/${comment.font_family.replaceAll(" ", "+")}#c${comment.comment_id}`} className='focus:underline hover:underline tlg:hover:no-underline'>{comment.comment}</a></td>
                                                        <td className='pl-[16px] py-[10px]'>{commentsDateFormat(comment.updated_at)}</td>
                                                        <td className='pl-[16px] py-[10px]'>{commentsDateFormat(comment.created_at)}</td>
                                                        <td className='py-[10px] relative'>
                                                            <div className='absolute w-[100%] h-[100%] left-0 top-0 flex items-center'>
                                                                <button onClick={deleteCommentModalOpen} data-font={comment.font_id} data-comment={comment.comment_id} className='group w-[20px] h-[20px] ml-[16px] flex justify-center items-center'>
                                                                    <svg className='w-[14px] fill-theme-10 group-hover:fill-theme-yellow tlg:group-hover:fill-theme-10 dark:fill-theme-9 group-hover:dark:fill-theme-blue-1 tlg:group-hover:dark:fill-theme-9' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6Z"/><path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1ZM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118ZM2.5 3h11V2h-11v1Z"/></svg>
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )
                                            })
                                        }
                                    </>
                                    : <tr className='h-[60px]'>
                                        <td colSpan={7} className='text-center'>댓글이 없습니다.</td>
                                    </tr>
                                }
                            </tbody>
                        </table>
                    </div>
                    <div className='w-[100%] flex justify-center mt-[12px]'>
                        <Pagination count={count} page={page} onChange={handleChange} shape='rounded' showFirstButton showLastButton/>
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

        // 쿠키에 저장된 세션ID가 유효하지 않다면, 메인페이지로 이동, 유효하면 클리이언트로 유저 정보 return
        if (user === null || user.user_no !== 1) {
            return {
                redirect: {
                    destination: '/404',
                    permanent: false,
                }
            }
        } else {
            // 유저 목록 페이지 수
            const count = await FetchCommentsLength();

            // 첫 유저 목록 가져오기
            const comments: any = await FetchComments(undefined);

            return {
                props: {
                    params: {
                        theme: cookieTheme,
                        userAgent: userAgent,
                        user: JSON.parse(JSON.stringify(user)),
                        comments: JSON.stringify(comments),
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

export default CommentList;