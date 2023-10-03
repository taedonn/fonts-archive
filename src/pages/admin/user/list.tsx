// next hooks
import { NextSeo } from 'next-seo';

// react hooks
import React, { useEffect, useState, useRef } from 'react';

// api
import axios from 'axios';
import { CheckIfSessionExists } from "@/pages/api/user/checkifsessionexists";
import { FetchUserInfo } from "@/pages/api/user/fetchuserinfo";

import { FetchUsers } from '@/pages/api/admin/user';
import { FetchUsersLength } from '@/pages/api/admin/user';

// components
import Header from "@/components/header";
import { Pagination } from '@mui/material';

const SendEmail = ({params}: any) => {
    // 디바이스 체크
    const isMac: boolean = params.userAgent.includes("Mac OS") ? true : false;

    // 빈 함수
    const emptyFn = () => { return; }

    // 유저 목록 state
    const [list, setList] = useState(params.list);
    const [count, setCount] = useState<number>(params.count);
    const [filter, setFilter] = useState<string>('all');
    const [text, setText] = useState<string>('');

    // 댓글 목록 ref
    const selectRef = useRef<HTMLSelectElement>(null);
    const textRef = useRef<HTMLInputElement>(null);

    // 댓글 목록 페이지 변경
    const [page, setPage] = useState<number>(1);
    const handleChange = (e: React.ChangeEvent<unknown>, value: number) => {
        setPage(value);
    };

    // 페이지 변경 시 데이터 다시 불러오기
    // useEffect(() => {
    //     const fetchNewComments = async () => {
    //         await axios.get('/api/user/fetchcomments', {
    //             params: {
    //                 user_id: params.user.user_no,
    //                 page: page,
    //                 filter: filter,
    //                 text: text
    //             }
    //         })
    //         .then((res) => { setComments(res.data.comments); })
    //         .catch(err => console.log(err));
    //     }
    //     fetchNewComments();
    // }, [filter, page, params.user.user_no, text]);

    // 댓글 필터 버튼 클릭 시 값 state에 저장 후, API 호출
    // const handleClick = async () => {
    //     if (selectRef &&selectRef.current && textRef && textRef.current) {
    //         // state 저장
    //         setPage(1);
    //         setFilter(selectRef.current.value);
    //         setText(textRef.current.value);
            
    //         // API 호출
    //         await axios.get('/api/user/fetchcomments', {
    //             params: {
    //                 user_id: params.user.user_no,
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
                title={"유저 관리 · 폰트 아카이브"}
                description={"유저 관리 - 상업용 무료 한글 폰트 아카이브"}
            />

            {/* 헤더 */}
            <Header
                isMac={isMac}
                theme={params.theme}
                user={params.user}
                page={"admin"}
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
                    <h2 className='text-[20px] tlg:text-[18px] text-theme-4 dark:text-theme-9 font-medium mb-[16px] tlg:mb-[12px]'>유저 목록</h2>
                    <div className='w-content flex items-center p-[6px] mb-[12px] tlg:mb-[8px] rounded-[6px] text-theme-10 dark:text-theme-9 bg-theme-5 dark:bg-theme-3'>
                        <select ref={selectRef} className='w-[80px] h-[32px] tlg:h-[28px] text-[12px] pt-px px-[14px] bg-transparent rounded-[6px] outline-none border border-theme-6 dark:border-theme-5 cursor-pointer'>
                            <option value='all' defaultChecked>전체</option>
                            <option value='comment'>댓글</option>
                            <option value='reply'>답글</option>
                        </select>
                        <input ref={textRef} type='textbox' className='w-[200px] tlg:w-[160px] h-[32px] tlg:h-[28px] ml-[8px] px-[12px] text-[12px] bg-transparent border rounded-[6px] border-theme-6 dark:border-theme-5'/>
                        <button className='w-[68px] h-[32px] tlg:h-[28px] ml-[8px] text-[12px] border rounded-[6px] bg-theme-6/40 hover:bg-theme-6/60 tlg:hover:bg-theme-6/40 dark:bg-theme-4 hover:dark:bg-theme-5 tlg:hover:dark:bg-theme-4'>검색</button>
                    </div>
                    <div className='w-[100%] rounded-[8px] overflow-hidden'>
                        <table className='w-[100%] text-[12px] text-theme-10 dark:text-theme-9 bg-theme-4 dark:bg-theme-blue-2'>
                            <thead className='h-[40px] tlg:h-[34px] text-left bg-theme-5 dark:bg-theme-3'>
                                <tr>
                                    <th className='w-[80px] pl-[20px] tlg:pl-[16px]'>유저 번호</th>
                                    <th className='w-[100px] pl-[20px] tlg:pl-[16px]'>유저명</th>
                                    <th className='pl-[20px] tlg:pl-[16px]'>유저 아이디</th>
                                    <th className='w-[100px] pl-[20px] tlg:pl-[16px]'>이메일 확인</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    list && list.length > 0
                                    ? <>
                                        {
                                            list.map((user: any) => {
                                                return (
                                                    <tr key={user.user_no} className='h-[40px] tlg:h-[34px] border-t border-theme-5 dark:border-theme-3'>
                                                        <td className='pl-[20px] tlg:pl-[16px] py-[10px] break-keep'><a href={`/detailpage/${user.user_no}`} className='hover:underline tlg:hover:no-underline'>{user.user_name}</a></td>
                                                        <td className='pl-[20px] tlg:pl-[16px] py-[10px] break-keep'><a href={`/detailpage/${user.user_no}#c${user.comment_id}`} className='hover:underline tlg:hover:no-underline'>{user.user_name}</a></td>
                                                        <td className='pl-[20px] tlg:pl-[16px] py-[10px] break-keep'>{user.user_email_confirm}</td>
                                                    </tr> 
                                                )
                                            })
                                        }
                                    </>
                                    : <tr className='h-[60px]'>
                                        <td colSpan={3} className='text-center'>댓글이 없습니다.</td>
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
                    destination: '/',
                    permanent: false,
                }
            }
        } else {
            // 유저 목록 페이지 수
            const length = await FetchUsersLength();
            const count = Number(length) % 10 > 0 ? Math.floor(Number(length)/10) + 1 : Math.floor(Number(length)/10);

            // 첫 유저 목록 가져오기
            const list: any = await FetchUsers(undefined);

            return {
                props: {
                    params: {
                        theme: cookieTheme,
                        userAgent: userAgent,
                        user: user,
                        list: list,
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