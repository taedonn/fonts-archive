// react hooks
import React, { useEffect, useState } from 'react';
import { useInfiniteQuery } from 'react-query';
import { useInView } from 'react-intersection-observer';

// hooks
import axios from 'axios';
import { throttle } from 'lodash';

// 컴포넌트
import DummyText from "./dummytext";
import SkeletonBox from './skeletonbox';

export default function FontBox ({lang, type, sort, user, like, filter, searchword, text, num}:{lang: string, type: string, sort: string, user: any, like: any, filter: string, searchword: string, text: string, num: number}) {
    // react-intersection-observer 훅
    const { ref, inView } = useInView();

    // react-intersection-observer 사용해 ref를 지정한 요소가 viewport에 있을 때 fetchNextPage 함수 실행
    useEffect(() => {
        if (inView && hasNextPage) { fetchNextPage(); }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [inView]);

    // 좋아요한 폰트가 있으면 array => string으로 변환 후 api에 전달
    let likedArr: string[] = [];
    like === null ? null : like.forEach((obj: any) => likedArr.push(obj.font_id));
    let liked = likedArr.join();

    // useInfiniteQuery 사용해 다음에 불러올 데이터 업데이트
    const {
        isLoading,
        data,
        remove,
        refetch,
        fetchNextPage,
        hasNextPage
    } = useInfiniteQuery('fonts', async ({ pageParam = '' }) => {
        await new Promise((res) => setTimeout(res, 100));
        const res = await axios.get('/api/fontlist', {params: { id: pageParam, lang: lang, type: type, sort: sort, searchword: searchword, filter: filter === 'liked' ? liked : '' }});
        return res.data;
    },{
        getNextPageParam: (lastPage) => lastPage.nextId ?? false,
    });

    // 폰트 검색 필터링 값 변경 시 기존 데이터 지우고 useInfiniteQuery 재실행
    useEffect(() => {
        remove();
        refetch();
    }, [lang, type, sort, searchword, remove, refetch]);

    // 즐겨찾기 state
    const [alertDisplay, setAlertDisplay] = useState<boolean>(false);

    /** 로그인 중이 아닐 때 즐겨찾기 클릭 방지 */
    const handleLikeClick = (e: React.MouseEvent<HTMLInputElement>) => {
        if (user === null) {
            setAlertDisplay(true);
            e.preventDefault();
        }
    }

    /** 알럿창 닫기 */
    const handleAlertClose = () => { setAlertDisplay(false); }

    /** 스크롤 시 알럿창 닫기 */
    const handleScroll = () => { setAlertDisplay(false); }
    const throttledScroll = throttle(handleScroll,500);

    // lodash/throttle을 이용해 스크롤 제어
    useEffect(() => {
        window.addEventListener('scroll', throttledScroll);
        return () => { window.removeEventListener('scroll', throttledScroll); }
    });

    /** 즐겨찾기 버튼 체인지 이벤트 */
    const handleLikeChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (user !== null) {
            await axios.post('/api/updatelike', null, { params: { code: e.target.id ,checked: e.target.checked, user_no: user.user_no } })
            .then(res => console.log(res.data))
            .catch(err => console.log(err));
        }
    }

    /** 렌더링 시 즐겨찾기 되어있는 폰트들은 체크된 상태로 변경 */
    const handleDefaultLike = (fontCode: number) => {
        return like === null ? false : like.some((font: any) => font.font_id === fontCode);
    }

    return (
        <>
            <div className='w-[100%] flex flex-col justify-start items-end'>
                <div className="main-menu w-[100%] relative flex flex-wrap flex-row justify-between items-stretch pt-[10px] pb-[20px]">
                    
                    {/* 로그인 중이 아닐 때 즐겨찾기 alert창 팝업 */}
                    {
                        alertDisplay === true
                        ? <div className='fixed z-20 top-[24px] tlg:top-[20px] right-[32px] tlg:right-[28px] w-content h-[60px] tlg:h-[56px] px-[12px] flex flex-row justify-between items-center rounded-[8px] border border-theme-yellow dark:border-theme-blue-1 text-[13px] tlg:text-[12px] text-theme-10/80 dark:text-theme-9/80 bg-theme-4 dark:bg-theme-blue-2'>
                            <div className='flex flex-row justify-start items-center'>
                                <svg className='w-[24px] tlg:w-[20px] fill-theme-8 dark:fill-theme-9/80' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M7.657 6.247c.11-.33.576-.33.686 0l.645 1.937a2.89 2.89 0 0 0 1.829 1.828l1.936.645c.33.11.33.576 0 .686l-1.937.645a2.89 2.89 0 0 0-1.828 1.829l-.645 1.936a.361.361 0 0 1-.686 0l-.645-1.937a2.89 2.89 0 0 0-1.828-1.828l-1.937-.645a.361.361 0 0 1 0-.686l1.937-.645a2.89 2.89 0 0 0 1.828-1.828l.645-1.937zM3.794 1.148a.217.217 0 0 1 .412 0l.387 1.162c.173.518.579.924 1.097 1.097l1.162.387a.217.217 0 0 1 0 .412l-1.162.387A1.734 1.734 0 0 0 4.593 5.69l-.387 1.162a.217.217 0 0 1-.412 0L3.407 5.69A1.734 1.734 0 0 0 2.31 4.593l-1.162-.387a.217.217 0 0 1 0-.412l1.162-.387A1.734 1.734 0 0 0 3.407 2.31l.387-1.162zM10.863.099a.145.145 0 0 1 .274 0l.258.774c.115.346.386.617.732.732l.774.258a.145.145 0 0 1 0 .274l-.774.258a1.156 1.156 0 0 0-.732.732l-.258.774a.145.145 0 0 1-.274 0l-.258-.774a1.156 1.156 0 0 0-.732-.732L9.1 2.137a.145.145 0 0 1 0-.274l.774-.258c.346-.115.617-.386.732-.732L10.863.1z"/></svg>
                                <div className='ml-[8px]'>
                                    즐겨찾기는 로그인 시 이용 가능합니다. <br/>
                                    {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
                                    <a href="/user/login" className='text-theme-yellow dark:text-theme-blue-1 hover:underline tlg:hover:no-underline'>로그인 하러 가기</a>
                                </div>
                            </div>
                            <div onClick={handleAlertClose} className='flex flex-row justify-center items-center ml-[8px] cursor-pointer'>
                                <svg className='w-[20px] fill-theme-10/80 dark:fill-theme-9' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/></svg>
                            </div>
                        </div> : <></>
                    }
                    
                    {/* fetchNextPage */}
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
                                }) => (
                                    <a aria-label="font-link" href={`/detailpage/${font.code}`} key={font.code} className="relative block w-[calc(25%-8px)] tlg:w-[calc(33.3%-6px)] tmd:w-[calc(50%-4px)] txs:w-[100%] h-[22vw] tlg:h-[30vw] tmd:h-[46vw] txs:h-[82vw] p-[1.04vw] tlg:p-[1.95vw] tmd:p-[2.6vw] txs:p-[4.17vw] mt-[12px] tlg:mt-[10px] rounded-[8px] border border-theme-7 dark:border-theme-4 hover:bg-theme-8/60 tlg:hover:bg-transparent hover:dark:bg-theme-3/40 tlg:hover:dark:bg-transparent animate-fontbox-fade-in cursor-pointer">
                                        <link href={font.cdn_url} rel="stylesheet" type="text/css" itemProp="url"></link>
                                        <div className='absolute top-[1.46vw] tlg:top-[2.73vw] tmd:top-[3.65vw] txs:top-[5.83vw] right-[1.04vw] tlg:right-[1.95vw] tmd:right-[2.6vw] txs:right-[4.17vw]'>
                                            <input onClick={handleLikeClick} onChange={handleLikeChange} type="checkbox" id={font.code.toString()} className='like hidden' defaultChecked={handleDefaultLike(font.code)}/>
                                            <label htmlFor={font.code.toString()} className='cursor-pointer'>
                                                <svg className='w-[1.46vw] tlg:w-[2.73vw] tmd:w-[3.65vw] txs:w-[5.83vw] fill-theme-7 dark:fill-theme-4' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767-3.686 1.894.694-3.957a.565.565 0 0 0-.163-.505L1.71 6.745l4.052-.576a.525.525 0 0 0 .393-.288L8 2.223l1.847 3.658a.525.525 0 0 0 .393.288l4.052.575-2.906 2.77a.565.565 0 0 0-.163.506l.694 3.957-3.686-1.894a.503.503 0 0 0-.461 0z"/></svg>
                                                <svg className='w-[1.46vw] tlg:w-[2.73vw] tmd:w-[3.65vw] txs:w-[5.83vw] fill-theme-yellow dark:fill-theme-blue-1' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/></svg>
                                                {/* <svg className='w-[1.46vw] tlg:w-[2.73vw] tmd:w-[3.65vw] txs:w-[5.83vw] fill-theme-7 dark:fill-theme-4' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M7.84 4.1a.178.178 0 0 1 .32 0l.634 1.285a.178.178 0 0 0 .134.098l1.42.206c.145.021.204.2.098.303L9.42 6.993a.178.178 0 0 0-.051.158l.242 1.414a.178.178 0 0 1-.258.187l-1.27-.668a.178.178 0 0 0-.165 0l-1.27.668a.178.178 0 0 1-.257-.187l.242-1.414a.178.178 0 0 0-.05-.158l-1.03-1.001a.178.178 0 0 1 .098-.303l1.42-.206a.178.178 0 0 0 .134-.098L7.84 4.1z"/><path d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v13.5a.5.5 0 0 1-.777.416L8 13.101l-5.223 2.815A.5.5 0 0 1 2 15.5V2zm2-1a1 1 0 0 0-1 1v12.566l4.723-2.482a.5.5 0 0 1 .554 0L13 14.566V2a1 1 0 0 0-1-1H4z"/></svg>
                                                <svg className='w-[1.46vw] tlg:w-[2.73vw] tmd:w-[3.65vw] txs:w-[5.83vw] fill-theme-yellow dark:fill-theme-blue-1' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M2 15.5V2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v13.5a.5.5 0 0 1-.74.439L8 13.069l-5.26 2.87A.5.5 0 0 1 2 15.5zM8.16 4.1a.178.178 0 0 0-.32 0l-.634 1.285a.178.178 0 0 1-.134.098l-1.42.206a.178.178 0 0 0-.098.303L6.58 6.993c.042.041.061.1.051.158L6.39 8.565a.178.178 0 0 0 .258.187l1.27-.668a.178.178 0 0 1 .165 0l1.27.668a.178.178 0 0 0 .257-.187L9.368 7.15a.178.178 0 0 1 .05-.158l1.028-1.001a.178.178 0 0 0-.098-.303l-1.42-.206a.178.178 0 0 1-.134-.098L8.16 4.1z"/></svg> */}
                                            </label>
                                        </div>
                                        <div style={{fontFamily:"'"+font.font_family+"'"}} className="text-[1.04vw] tlg:text-[1.95vw] tmd:text-[2.6vw] txs:text-[4.17vw] mb-[0.42vw] tlg:mb-[0.78vw] tmd:mb-[1.04vw] txs:mb-[1.67vw] text-normal leading-tight text-theme-3 dark:text-theme-8">{font.name}</div>
                                        <div className="flex flex-row justify-start items-center">
                                            <div style={{fontFamily:"'"+font.font_family+"'"}} className="inline-block text-[0.73vw] tlg:text-[1.37] tmd:text-[1.82vw] txs:text-[2.92vw] text-normal text-theme-5 dark:text-theme-6 leading-tight"><span className="text-theme-3 dark:text-theme-8">by</span> {font.source}</div>
                                        </div>
                                        <div className="w-[100%] h-px my-[0.83vw] tlg:my-[1.56vw] tmd:my-[2.08vw] txs:my-[3.33vw] bg-theme-7 dark:bg-theme-5"></div>
                                        <div style={{fontFamily:"'"+font.font_family+"'"}} className="text-[1.88vw] tlg:text-[3.52vw] tmd:text-[4.69vw] txs:text-[7.5vw] text-normal leading-normal overflow-hidden">
                                            <p className="ellipsed-text text-theme-3 dark:text-theme-8"><DummyText lang={font.lang} text={text} num={num}/></p>
                                        </div>
                                    </a>
                                ))}
                            </React.Fragment>
                        )
                    })}

                    {/* 정렬 맞추기 위한 빈 div */}
                    <div className="w-[calc(25%-8px)] tlg:w-[calc(33.3%-6px)] tmd:w-[calc(50%-4px)] txs:w-[100%]"></div>
                    <div className="w-[calc(25%-8px)] tlg:w-[calc(33.3%-6px)] tmd:w-[calc(50%-4px)] txs:w-[100%]"></div>
                    <div className="w-[calc(25%-8px)] tlg:w-[calc(33.3%-6px)] tmd:w-[calc(50%-4px)] txs:w-[100%]"></div>

                    {/* 로딩 스켈레톤 */}
                    {
                        isLoading 
                        ? <div className='w-[100%] flex flex-wrap flex-row justify-between items-start'>
                            <SkeletonBox/>
                            <SkeletonBox/>
                            <SkeletonBox/>
                            <SkeletonBox/>
                            <SkeletonBox/>
                            <SkeletonBox/>
                            <SkeletonBox/>
                            <SkeletonBox/>
                            <SkeletonBox/>
                            <SkeletonBox/>
                            <SkeletonBox/>
                            <SkeletonBox/>
                            <SkeletonBox/>
                            <SkeletonBox/>
                            <SkeletonBox/>
                            <SkeletonBox/>
                            <SkeletonBox/>
                            <SkeletonBox/>
                            <SkeletonBox/>
                            <SkeletonBox/>
                            <SkeletonBox/>
                            <SkeletonBox/>
                            <SkeletonBox/>
                            <SkeletonBox/>
                        </div>
                        : null
                    }

                    {/* 뷰포트 만날 시 다음 데이터 로딩 */}
                    <span className="w-[100%]" ref={ref}></span>

                    {/* 로딩 바 */}
                    {hasNextPage ? <div className="w-[100%] pt-[28px] flex flex-row justify-center items-center"><span className="loader w-[40px] tlg:w-[36px] h-[40px] tlg:h-[36px]"></span></div> : null}
                </div>
            </div>
        </>
    )
}