// 훅
import React, { useEffect } from 'react';
import { useInfiniteQuery } from 'react-query';
import { useInView } from 'react-intersection-observer';
import axios from 'axios';

// 컴포넌트
import DummyText from "./dummytext";

export default function FontBox({lang, type, sort, searchword, text, randomNum}:{lang: string, type: string, sort: string, searchword: string, text: string, randomNum: number}) {
    /** react-intersection-observer 훅 */
    const { ref, inView } = useInView();

    /** react-intersection-observer 사용해 ref를 지정한 요소가 viewport에 있을 때 fetchNextPage 함수 실행 */
    useEffect(() => {
        if (inView && hasNextPage) { fetchNextPage(); }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [inView]);

    /** useInfiniteQuery 사용해 다음에 불러올 데이터 업데이트 */
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

    useEffect(() => {
        remove();
        refetch();
    }, [lang, type, sort, searchword, remove, refetch]);

    return (
        <>
            <div className='w-[100%] flex flex-col justify-start items-end'>
                <div className="main-menu w-[100%] relative flex flex-wrap flex-row justify-between items-stretch mt-[60px] tlg:mt-[56px] p-[20px] tlg:p-[16px] tmd:p-[12px] pt-[10px] tlg:pt-[10px] tmd:pt-[10px]">
                    {/* 로딩 바 */}
                    {isLoading ? <div className="w-[100%] pt-[28px] pb-0 flex flex-row justify-center items-center"><span className="loader"></span></div> : null}

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
                                    <a href={`/DetailPage/${font.code}`} key={font.code} className="w-[calc(25%-8px)] txl:w-[calc(33.3%-6px)] tlg:w-[calc(50%-4px)] tmd:w-[100%] h-[360px] txl:h-[300px] tlg:h-[240px] tmd:h-[220px] block p-[20px] tlg:p-[16px] border border-theme-4 rounded-[8px] mt-[12px] txl:mt-[10px] cursor-pointer hover:bg-theme-3/40 tlg:hover:bg-transparent animate-fontbox-fade-in">
                                        <link href={font.cdn_url} rel="stylesheet" type="text/css" itemProp="url"></link>
                                        <div style={{fontFamily:"'"+font.font_family+"'"}} className="text-[18px] tlg:text-[16px] text-normal leading-tight mb-[8px] tlg:mb-[6px] text-theme-8">{font.name}</div>
                                        <div className="flex flex-row justify-start items-center">
                                            <div style={{fontFamily:"'"+font.font_family+"'"}} className="inline-block text-[14px] tlg:text-[12px] text-normal text-theme-6 leading-tight"><span className="text-theme-8">by</span> {font.source}</div>
                                        </div>
                                        <div className="w-[100%] h-px my-[16px] tlg:my-[12px] bg-theme-4"></div>
                                        <div style={{fontFamily:"'"+font.font_family+"'"}} className="text-[36px] txl:text-[32px] tlg:text-[24px] text-normal leading-normal overflow-hidden">
                                            <p className="ellipsed-text text-theme-8"><DummyText lang={font.lang} text={text} randomNum={randomNum}/></p>
                                        </div>
                                    </a>
                                ))}
                            </React.Fragment>
                        )
                    })}

                    {/* 정렬 맞추기 위한 빈 div */}
                    <div className="w-[calc(25%-8px)] txl:w-[calc(33.3%-6px)] tlg:w-[calc(50%-4px)] tmd:w-[100%]"></div>
                    <div className="w-[calc(25%-8px)] txl:w-[calc(33.3%-6px)] tlg:w-[calc(50%-4px)] tmd:w-[100%]"></div>
                    <div className="w-[calc(25%-8px)] txl:w-[calc(33.3%-6px)] tlg:w-[calc(50%-4px)] tmd:w-[100%]"></div>

                    {/* 뷰포트 만날 시 다음 데이터 로딩 */}
                    <span className="w-[100%]" ref={ref}></span>

                    {/* 로딩 바 */}
                    {hasNextPage ? <div className="w-[100%] pt-[28px] tmd:pt-[16px] pb-0 flex flex-row justify-center items-center"><span className="loader"></span></div> : null}
                </div>
            </div>
        </>
    )
}