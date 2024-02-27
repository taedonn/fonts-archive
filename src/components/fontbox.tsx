// react
import React, { useEffect, useState } from 'react';
import { useInfiniteQuery } from 'react-query';
import { useInView } from 'react-intersection-observer';

// next
import Link from 'next/link';

// libraries
import { throttle } from 'lodash';

// components
import DummyText from '@/components/dummytext';
import SkeletonBox from '@/components/skeletonbox';
import KakaoAdFitTopBanner from '@/components/kakaoAdFitTopBanner';

// common
import { onMouseDown, onMouseUp, onMouseOut } from '@/libs/common';

interface FontBox {
    expand: boolean,
    license: string,
    lang: string,
    type: string,
    sort: string,
    user: any,
    filter: string,
    searchword: string,
    text: string,
    num: number,
}

interface LikedUser {
    font_id: number,
    user_auth: string,
    user_email: string,
    user_id: string,
}

export default function FontBox ({
    expand,
    license,
    lang,
    type,
    sort,
    user,
    filter,
    searchword,
    text,
    num
}: FontBox) {        
    // states
    const [alertDisplay, setAlertDisplay] = useState<boolean>(false);
    const [hoverDisplay, setHoverDisplay] = useState<boolean>(true);

    /** 스켈레톤 박스 반복문 */
    const skeletonLoop = () => {
        const limit = 20;
        const arr = [];
        for (let i = 0; i < limit; i++) arr.push(<SkeletonBox key={i}/>);
        return arr;
    }
    
    // react-intersection-observer 훅
    const { ref, inView } = useInView();

    // useInfiniteQuery 사용해 다음에 불러올 데이터 업데이트
    const {
        isLoading,
        data,
        remove,
        refetch,
        fetchNextPage,
        hasNextPage
    } = useInfiniteQuery(
        ['fonts', {keepPreviousData: true}],
        async ({ pageParam = '' }) => {
            await new Promise((res) => setTimeout(res, 100));
            const url = "/api/fontlist?";
            const options = {
                method: "GET",
                headers: { "Content-Type": "application/json" }
            }
            const params = {
                user_id: user ? user.id : null,
                id: pageParam,
                license: license,
                lang: lang,
                type: type,
                sort: sort,
                searchword: searchword,
                filter: filter
            }
            const query = new URLSearchParams(params).toString();

            const res = await fetch(url + query, options);
            const data = res.json();
            return data;
        },
        {
            getNextPageParam: (lastPage) => lastPage.nextId ?? false,
            refetchOnMount: false,
            refetchOnWindowFocus: false,
            staleTime: 60 * 1000,
        }
    );

    // react-intersection-observer 사용해 ref를 지정한 요소가 viewport에 있을 때 fetchNextPage 함수 실행
    useEffect(() => {
        if (inView && hasNextPage) { fetchNextPage(); }
    }, [inView, hasNextPage, fetchNextPage]);

    // 폰트 검색 필터링 값 변경 시 기존 데이터 지우고 useInfiniteQuery 재실행
    useEffect(() => {
        remove();
        refetch();
    }, [license, lang, type, sort, searchword, filter, remove, refetch]);

    /** 로그인 중이 아닐 때 좋아요 클릭 방지 */
    const handleLikeClick = (e: React.MouseEvent<HTMLInputElement>) => {
        if (user === null) {
            setAlertDisplay(true);
            e.preventDefault();
        }
    }

    /** 좋아요 버튼 체인지 이벤트 */
    const handleLikeChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (user !== null) {
            // 좋아요 버튼 눌렀을 때 호버창 지우기
            setHoverDisplay(false);

            const url = "/api/post/updatelike?";
            const options = {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    action: e.target.checked ? "increase" : "decrease",
                    code: e.target.id,
                    id: user.id,
                    email: user.email,
                    provider: user.provider,
                })
            }

            await fetch(url, options)
            .then(res => res.json())
            .then(data => {
                let hoverEl = e.target.nextSibling?.nextSibling as HTMLDivElement;
                if (data.like) { hoverEl.innerText='좋아요 해제'; }
                else { hoverEl.innerText='좋아요'; }

                // 좋아요 버튼 눌렀을 때 호버창 다시 띄우기
                setHoverDisplay(true);
            })
            .catch(err => console.log(err));
        }
    }

    /** 렌더링 시 좋아요 되어있는 폰트들은 체크된 상태로 변경 */
    const handleDefaultLike = (fontId: number, liked_user: any) => {
        if (!user) return false;
        else {
            const liked = liked_user.some((obj: LikedUser) => obj.user_id === user.id && obj.font_id === fontId);
            return liked ? true : false
        }
    }

    /** 알럿창 닫기 */
    const handleAlertClose = () => { setAlertDisplay(false); }

    /** 스크롤 시 알럿창 닫기 */
    const handleScroll = () => { setAlertDisplay(false); }
    const throttledScroll = throttle(handleScroll, 500);

    // lodash/throttle을 이용해 스크롤 제어
    useEffect(() => {
        window.addEventListener('scroll', throttledScroll);
        return () => { window.removeEventListener('scroll', throttledScroll); }
    });

    // 폰트 로딩 콜백 - hook
    const FontFaceObserver = require('fontfaceobserver');

    // 폰트 로딩 콜백 - 투명도 변경
    useEffect(() => {
        if (data) {
            for (let i = 0; i < data.pages[data.pages.length-1].fonts.length; i++) {
                let font = new FontFaceObserver(data.pages[data.pages.length-1].fonts[i].font_family)
                font.load(null, 5000).then(function() { // 폰트 로딩 시 텍스트 컬러 변경 (timeout 5초)
                    let thisFont = document.getElementsByClassName(data.pages[data.pages.length-1].fonts[i].code + '-text');
                    if (thisFont.length !== 0) {
                        thisFont[0].classList.add('text-l-2', 'dark:text-white');
                        thisFont[0].classList.remove('text-l-b', 'dark:text-d-6');   
                    }
                }, function() { // 폰트 로딩 실패 시에도 텍스트 컬러 변경
                    let thisFont = document.getElementsByClassName(data.pages[data.pages.length-1].fonts[i].code + '-text');
                    if (thisFont.length !== 0) {
                        thisFont[0].classList.add('text-l-2', 'dark:text-white');
                        thisFont[0].classList.remove('text-l-b', 'dark:text-d-6');   
                    }
                });
            }
        }
    }, [data, FontFaceObserver]);

    return (
        <>
            <div className={`${expand ? "w-[calc(100%-320px)] tlg:w-full" : "w-full"} pt-12 px-8 tlg:px-4 duration-200`}>
                <div className="w-full mt-4 lg:mt-8 mb-32 relative flex flex-col">
                    <div className='w-full flex'>
                        <KakaoAdFitTopBanner marginBottom={1}/>
                    </div>
                    
                    {/* 로그인 중이 아닐 때 좋아요 alert창 팝업 */}
                    {
                        alertDisplay
                        && <div className='fixed z-20 top-6 right-8 tlg:right-4 w-max h-16 px-4 flex justify-between items-center rounded-lg text-sm text-l-2 dark:text-white bg-l-e dark:bg-d-4'>
                            <div className='flex flex-row justify-start items-center'>
                                <i className="text-lg text-h-1 dark:text-f-8 bi bi-stars"></i>
                                <div className='ml-3'>
                                    좋아요 기능은 로그인 시 이용 가능합니다. <br/>
                                    <Link href="/user/login" className='text-h-1 dark:text-f-8 hover:underline'>로그인 하러 가기</Link>
                                </div>
                            </div>
                            <div onClick={handleAlertClose} onMouseDown={e => onMouseDown(e, 0.85, true)} onMouseUp={onMouseUp} onMouseOut={onMouseOut} className='flex justify-center items-center ml-3 cursor-pointer'>
                                <i className="text-lg fa-solid fa-xmark"></i>
                            </div>
                        </div>
                    }
                    
                    {/* fetchNextPage */}
                    <div className='w-full'>
                        {data && data.pages.map((page) => {
                            return (
                                <React.Fragment key={page.nextId ?? 'lastPage'}>
                                    {page.fonts.map((font: {
                                        code: number
                                        name: string
                                        lang: string
                                        date: string
                                        source: string
                                        font_family: string
                                        font_type: string
                                        cdn_url: string
                                        liked_user: LikedUser
                                    }) => (
                                        <div aria-label="font-link" key={font.code} className="w-full group/wrap relative pt-8 tlg:pt-6 pb-2 hover:rounded-lg tlg:hover:rounded-none border-t first:border-t-0 last:border-b border-l-b dark:border-d-4 tlg:hover:border-l-b tlg:hover:dark:border-d-4 [&+div]:hover:border-transparent tlg:[&+div]:hover:border-l-b tlg:[&+div]:hover:dark:border-d-4 hover:border-transparent hover:bg-l-e hover:dark:bg-d-4 tlg:hover:bg-transparent tlg:hover:dark:bg-transparent text-l-2 dark:text-white animate-fade-in-fontbox cursor-pointer">
                                            <Link href={`/post/${font.font_family.replaceAll(" ", "+")}`} className='w-full h-full absolute z-10 left-0 top-0'></Link>
                                            <link href={font.cdn_url} rel="stylesheet" type="text/css" itemProp="url"></link>
                                            <div className='w-max pl-8 tlg:pl-4 relative tlg:static flex tlg:flex-col items-center tlg:items-start'>
                                                <div className="text-xl tlg:text-lg tlg:mb-2">{font.name}</div>
                                                <div className='w-px h-4 mx-3 tlg:hidden bg-l-b dark:bg-d-9'></div>
                                                <div className="text-l-5 dark:text-d-9">by {font.source}</div>
                                                <div className='group absolute z-20 -right-4 tlg:right-8 top-1/2 tlg:top-12 translate-x-full -translate-y-1/2'>
                                                    <input onClick={handleLikeClick} onChange={handleLikeChange} type="checkbox" id={font.code.toString()} className='peer hidden' defaultChecked={handleDefaultLike(font.code, font.liked_user)}/>
                                                    <label htmlFor={font.code.toString()} onMouseDown={e => onMouseDown(e, 0.8, true)} onMouseUp={onMouseUp} onMouseOut={onMouseOut} className='block group cursor-pointer'>
                                                        <i className="block peer-checked:group-[]:hidden text-xl tlg:text-lg bi bi-heart"></i>
                                                        <i className="hidden peer-checked:group-[]:block text-xl tlg:text-lg text-h-r bi bi-heart-fill"></i>
                                                    </label>
                                                    <div className={`${hoverDisplay === true ? 'group-hover:block' : 'group-hover:hidden'} tlg:group-hover:hidden tooltip w-max absolute left-1/2 -top-10 px-3 py-2 text-sm font-medium leading-none origin-bottom rounded-lg hidden group-hover:animate-zoom-in-fontbox after:bg-h-r bg-h-r text-white`}>{handleDefaultLike(font.code, font.liked_user) === false ? '좋아요' : '좋아요 해제'}</div>
                                                </div>
                                            </div>
                                            <div className="w-full relative py-6 tlg:py-4 overflow-hidden">
                                                <div style={{fontFamily:"'"+font.font_family+"'"}} className="w-full pl-8 tlg:pl-4 text-4xl tlg:text-3xl text-normal">
                                                    <p className={`${font.code + '-text'} whitespace-nowrap text-l-b dark:text-d-6`}><DummyText lang={font.lang} text={text} num={num}/></p>
                                                </div>
                                                <div className='w-40 h-14 absolute right-0 top-1/2 -translate-y-1/2 bg-gradient-to-l from-white dark:from-d-2 from-25% group-hover/wrap:from-l-e group-hover/wrap:dark:from-d-4 tlg:group-hover/wrap:from-white tlg:group-hover/wrap:dark:from-d-2'></div>
                                            </div>
                                        </div>
                                    ))}
                                </React.Fragment>
                            )
                        })}
                    </div>

                    {/* 로딩 스켈레톤 */}
                    {
                        isLoading 
                        && <div className="w-full">{ skeletonLoop() }</div>
                    }

                    {/* 폰트가 없을 때 */}
                    {
                        data && data.pages[0].fonts.length === 0
                            && <div className='w-full py-14 flex flex-col justify-center items-center rounded-lg text-h-1 dark:text-white bg-h-e dark:bg-d-3'>
                                <i className="text-[100px] leading-none bi bi-emoji-tear"></i>
                                <div className='text-xl mt-6 text-center font-bold'>찾으시는 폰트가 없습니다.</div>
                            </div>
                    }

                    {/* 뷰포트 만날 시 다음 데이터 로딩 */}
                    <span className="w-full" ref={ref}></span>

                    {/* 로딩 바 */}
                    {hasNextPage && <div className="w-full h-20 absolute left-0 bottom-0 translate-y-full flex justify-center items-center"><span className="loader w-9 h-9 border-2 border-h-e dark:border-d-6 border-b-h-1 dark:border-b-f-8"></span></div>}
                </div>
            </div>
        </>
    )
}