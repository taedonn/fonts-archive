// next
import Link from 'next/link';
import { NextSeo } from 'next-seo';

// next-auth
import { getServerSession } from "next-auth";
import { authOptions } from '@/pages/api/auth/[...nextauth]';

// react
import React, { useState, useRef, useEffect } from 'react';

// api
import { FetchUsers, FetchUsersLength } from '@/pages/api/admin/user';

// libraries
import axios from 'axios';
import { Pagination } from '@mui/material';

// components
import Header from "@/components/header";
import Footer from '@/components/footer';

// common
import { timeFormat } from '@/libs/common';

const UserList = ({params}: any) => {
    const { theme, userAgent, user, list, count } = params;

    // 디바이스 체크
    const isMac: boolean = userAgent.includes("Mac OS") ? true : false;

    // 유저 목록 state
    const [thisList, setList] = useState(list);
    const [thisCount, setCount] = useState<number>(count);
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
                <div className='w-[720px] tmd:w-full flex flex-col justify-center items-start my-[100px] tlg:my-10'>
                    <h2 className='text-xl tlg:text-lg text-theme-3 dark:text-theme-9 font-medium mb-4 tlg:mb-3'>유저 목록</h2>
                    <div className='w-max flex items-center p-1.5 mb-3 tlg:mb-2 rounded-md text-theme-10 dark:text-theme-9 bg-theme-5 dark:bg-theme-3'>
                        <select ref={selectRef} className='w-[80px] h-8 tlg:h-7 text-xs pt-px px-2.5 bg-transparent rounded-md outline-none border border-theme-6 dark:border-theme-5 cursor-pointer'>
                            <option value='all' defaultChecked>전체</option>
                            <option value='email-confirmed'>확인된 이메일만</option>
                            <option value='nickname-reported'>닉네임 신고 많은 순</option>
                        </select>
                        <input ref={textRef} type='textbox' placeholder='유저명/유저 아이디' className='w-[200px] tlg:w-40 h-8 tlg:h-7 ml-2 px-3 text-xs bg-transparent border rounded-md border-theme-6 dark:border-theme-5'/>
                        <button onClick={handleClick} className='w-[68px] h-8 tlg:h-7 ml-2 text-xs border rounded-md bg-theme-6/40 hover:bg-theme-6/60 tlg:hover:bg-theme-6/40 dark:bg-theme-4 hover:dark:bg-theme-5 tlg:hover:dark:bg-theme-4'>검색</button>
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
                                    thisList && thisList.length > 0
                                    ? <>
                                        {
                                            thisList.map((user: any) => {
                                                return (
                                                    <div key={user.code} className='h-10 tlg:h-9 relative flex items-center border-t border-theme-5 dark:border-theme-3 hover:bg-theme-yellow/20 tlg:hover:bg-transparent hover:dark:bg-theme-blue-1/20 tlg:hover:dark:bg-transparent'>
                                                        <div className='w-[52px] pl-3 shrink-0'>{user.user_no}</div>
                                                        <div className='w-20 pl-3 shrink-0'><Link href={`/admin/user/${user.user_no}`} className='font-size text-theme-yellow dark:text-theme-blue-1 focus:underline hover:underline tlg:hover:no-underline'>{user.user_name}</Link></div>
                                                        <div className='w-full pl-3 overflow-hidden'><div className='font-size'>{user.user_id}</div></div>
                                                        <div className='w-[100px] pl-3 shrink-0'>{timeFormat(user.updated_at)}</div>
                                                        <div className='w-[100px] pl-3 shrink-0'>{timeFormat(user.created_at)}</div>
                                                        <div className='w-20 shrink-0 text-center'>{user.nickname_reported}</div>
                                                        <div className='w-24 pl-3 shrink-0'>
                                                            {
                                                                user.user_email_confirm
                                                                ? <>
                                                                    <span className='text-theme-green'>확인 됨</span>
                                                                    <svg className='inline-block w-2 ml-1 mb-px fill-theme-green' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z"/></svg>
                                                                </> : <>
                                                                    <span className='text-theme-red'>확인 안됨</span>
                                                                    <svg className='inline-block w-2 ml-1 mb-px fill-theme-red' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/></svg>
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
        // 쿠키 체크
        const { theme } = ctx.req.cookies;

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
            const count = await FetchUsersLength();

            // 첫 유저 목록 가져오기
            const list: any = await FetchUsers(undefined);

            return {
                props: {
                    params: {
                        theme: theme ? theme : 'light',
                        userAgent: userAgent,
                        user: session === null ? null : session.user,
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