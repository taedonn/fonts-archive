// react hooks
import React, { useEffect } from 'react';
import { useInfiniteQuery } from 'react-query';
import { useInView } from 'react-intersection-observer';

// hooks
import axios from 'axios';

// 컴포넌트
import DummyText from "./dummytext";
import SkeletonBox from './skeletonbox';

export default function FontBox ({lang, type, sort, searchword, text, num}:{lang: string, type: string, sort: string, searchword: string, text: string, num: number}) {
    // react-intersection-observer 훅
    const { ref, inView } = useInView();

    // react-intersection-observer 사용해 ref를 지정한 요소가 viewport에 있을 때 fetchNextPage 함수 실행
    useEffect(() => {
        if (inView && hasNextPage) { fetchNextPage(); }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [inView]);

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
        const res = await axios.get('/api/fontlist', {params: { id: pageParam, lang: lang, type: type, sort: sort, searchword: searchword }});
        return res.data;
    },{
        getNextPageParam: (lastPage) => lastPage.nextId ?? false,
    });

    // 폰트 검색 필터링 값 변경 시 기존 데이터 지우고 useInfiniteQuery 재실행
    useEffect(() => {
        remove();
        refetch();
    }, [lang, type, sort, searchword, remove, refetch]);

    return (
        <>
            <div className='w-[100%] flex flex-col justify-start items-end'>
                <div className="main-menu w-[100%] relative flex flex-wrap flex-row justify-between items-stretch pt-[10px] pb-[20px]">
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
                                    <a aria-label="font-link" href={`/detailpage/${font.code}`} key={font.code} className="block w-[calc(25%-8px)] tlg:w-[calc(33.3%-6px)] tmd:w-[calc(50%-4px)] txs:w-[100%] h-[22vw] tlg:h-[30vw] tmd:h-[46vw] txs:h-[82vw] p-[1.04vw] tlg:p-[1.95vw] tmd:p-[2.6vw] txs:p-[4.17vw] mt-[12px] tlg:mt-[10px] rounded-[8px] border border-theme-7 dark:border-theme-4 hover:bg-theme-8/60 tlg:hover:bg-transparent hover:dark:bg-theme-3/40 tlg:hover:dark:bg-transparent animate-fontbox-fade-in cursor-pointer">
                                        <link href={font.cdn_url} rel="stylesheet" type="text/css" itemProp="url"></link>
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

                    {/* 뷰포트 만날 시 다음 데이터 로딩 */}
                    <span className="w-[100%]" ref={ref}></span>

                    {/* 로딩 바 */}
                    {hasNextPage ? <div className="w-[100%] pt-[28px] flex flex-row justify-center items-center"><span className="loader w-[40px] tlg:w-[36px] h-[40px] tlg:h-[36px]"></span></div> : null}
                </div>
            </div>
        </>
    )
}