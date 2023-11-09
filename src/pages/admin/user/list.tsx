// next hooks
import { NextSeo } from 'next-seo';

// react hooks
import React, { useState, useRef, useEffect } from 'react';

// api
import axios from 'axios';
import { CheckIfSessionExists } from "@/pages/api/user/checkifsessionexists";
import { FetchUserInfo } from "@/pages/api/user/fetchuserinfo";

import { FetchUsers } from '@/pages/api/admin/user';
import { FetchUsersLength } from '@/pages/api/admin/user';

// components
import Header from "@/components/header";
import { Pagination } from '@mui/material';

const UserList = ({params}: any) => {
    // 디바이스 체크
    const isMac: boolean = params.userAgent.includes("Mac OS") ? true : false;

    // 빈 함수
    const emptyFn = () => { return; }

    // 유저 목록 state
    const [list, setList] = useState(params.list);
    const [count, setCount] = useState<number>(params.count);
    const [filter, setFilter] = useState<string>('all');
    const [text, setText] = useState<string>('');

    // 유저 목록 ref
    const selectRef = useRef<HTMLSelectElement>(null);
    const textRef = useRef<HTMLInputElement>(null);

    // 유저 목록 페이지 변경
    const [page, setPage] = useState<number>(1);
    const handleChange = (e: React.ChangeEvent<unknown>, value: number) => { setPage(value); };

    // 페이지 변경 시 데이터 다시 불러오기
    useEffect(() => {
        const fetchNewComments = async () => {
            await axios.post('/api/admin/user', {
                action: "list",
                page: page,
                filter: filter,
                text: text
            })
            .then((res) => { setList(res.data.list); })
            .catch(err => console.log(err));
        }
        fetchNewComments();
    }, [filter, text, page]);

    // 검색 버튼 클릭 시 값 state에 저장 후, API 호출
    const handleClick = async () => {
        if (selectRef &&selectRef.current && textRef && textRef.current) {
            // state 저장
            setPage(1);
            setFilter(selectRef.current.value);
            setText(textRef.current.value);
            
            // API 호출
            await axios.post('/api/admin/user', {
                action: "list",
                page: 1,
                filter: selectRef.current.value,
                text: textRef.current.value
            })
            .then((res) => {
                setList(res.data.list);
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

    return (
        <>
            {/* Head 부분*/}
            <NextSeo 
                title={"유저 관리 · 폰트 아카이브"}
                description={"유저 관리 - 상업용 무료 한글 폰트 저장소"}
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

            {/* 메인 */}
            <form onSubmit={e => e.preventDefault()} className='w-[100%] flex flex-col justify-center items-center'>
                <div className='w-[720px] tmd:w-[100%] flex flex-col justify-center items-start my-[100px] tlg:my-[40px]'>
                    <h2 className='text-[20px] tlg:text-[18px] text-theme-3 dark:text-theme-9 font-medium mb-[16px] tlg:mb-[12px]'>유저 목록</h2>
                    <div className='w-content flex items-center p-[6px] mb-[12px] tlg:mb-[8px] rounded-[6px] text-theme-10 dark:text-theme-9 bg-theme-5 dark:bg-theme-3'>
                        <select ref={selectRef} className='w-[80px] h-[32px] tlg:h-[28px] text-[12px] pt-px px-[10px] bg-transparent rounded-[6px] outline-none border border-theme-6 dark:border-theme-5 cursor-pointer'>
                            <option value='all' defaultChecked>전체</option>
                            <option value='email-confirmed'>확인된 이메일만</option>
                            <option value='nickname-reported'>닉네임 신고 많은 순</option>
                        </select>
                        <input ref={textRef} type='textbox' placeholder='유저명/유저 아이디' className='w-[200px] tlg:w-[160px] h-[32px] tlg:h-[28px] ml-[8px] px-[12px] text-[12px] bg-transparent border rounded-[6px] border-theme-6 dark:border-theme-5'/>
                        <button onClick={handleClick} className='w-[68px] h-[32px] tlg:h-[28px] ml-[8px] text-[12px] border rounded-[6px] bg-theme-6/40 hover:bg-theme-6/60 tlg:hover:bg-theme-6/40 dark:bg-theme-4 hover:dark:bg-theme-5 tlg:hover:dark:bg-theme-4'>검색</button>
                    </div>
                    <div className='w-[100%] rounded-[8px] overflow-hidden overflow-x-auto'>
                        <table className='w-[720px] text-[12px] text-theme-10 dark:text-theme-9 bg-theme-4 dark:bg-theme-4'>
                            <thead className='text-left bg-theme-5 dark:bg-theme-3'>
                                <tr>
                                    <th className='h-[40px] tlg:h-[34px] w-[52px] pl-[16px]'>번호</th>
                                    <th className='w-[80px] pl-[16px]'>유저명</th>
                                    <th className='pl-[16px]'>유저 아이디</th>
                                    <th className='w-[108px] pl-[16px]'>수정 날짜</th>
                                    <th className='w-[100px] pl-[16px]'>생성 날짜</th>
                                    <th className='w-[88px] pl-[16px]'>닉네임 신고</th>
                                    <th className='w-[100px] pl-[16px]'>이메일 확인</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    list && list.length > 0
                                    ? <>
                                        {
                                            list.map((user: any) => {
                                                return (
                                                    <tr key={user.user_no} className='border-t border-theme-5 dark:border-theme-3'>
                                                        <td className='h-[40px] tlg:h-[34px] pl-[16px] py-[10px]'>{user.user_no}</td>
                                                        <td className='pl-[16px] py-[10px] break-all'><a href={`/admin/user/${user.user_no}`} className='text-theme-yellow dark:text-theme-blue-1 focus:underline hover:underline tlg:hover:no-underline'>{user.user_name}</a></td>
                                                        <td className='pl-[16px] py-[10px] break-all'>{user.user_id}</td>
                                                        <td className='pl-[16px] py-[10px]'>{commentsDateFormat(user.updated_at)}</td>
                                                        <td className='pl-[16px] py-[10px]'>{commentsDateFormat(user.created_at)}</td>
                                                        <td className='py-[10px] break-keep text-center'>{user.nickname_reported}</td>
                                                        <td className='pl-[16px] py-[10px] break-keep'>
                                                            {
                                                                user.user_email_confirm
                                                                ? <>
                                                                    <span className='text-theme-green'>확인 됨</span>
                                                                    <svg className='inline-block w-[8px] ml-[4px] mb-px fill-theme-green' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z"/></svg>
                                                                </> : <>
                                                                    <span className='text-theme-red'>확인 안됨</span>
                                                                    <svg className='inline-block w-[8px] ml-[4px] mb-px fill-theme-red' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/></svg>
                                                                </>
                                                            }
                                                        </td>
                                                    </tr> 
                                                )
                                            })
                                        }
                                    </>
                                    : <tr className='h-[60px]'>
                                        <td colSpan={7} className='text-center'>유저가 없습니다.</td>
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
            const count = await FetchUsersLength();

            // 첫 유저 목록 가져오기
            const list: any = await FetchUsers(undefined);

            return {
                props: {
                    params: {
                        theme: cookieTheme,
                        userAgent: userAgent,
                        user: JSON.parse(JSON.stringify(user)),
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