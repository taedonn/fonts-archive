import React, { useEffect } from 'react';
import { useInfiniteQuery } from 'react-query';
import { useInView } from 'react-intersection-observer';
import axios from 'axios';

export default function TestOne() {
    /** react-intersection-observer 훅 */
    const { ref, inView } = useInView()

    /** react-intersection-observer 사용해 ref를 지정한 요소가 viewport에 있을 때 fetchNextPage 함수 실행 */
    useEffect(() => {
        if (inView && hasNextPage) { fetchNextPage(); }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [inView]);

    /** useInfiniteQuery 사용해 다음에 불러올 데이터 업데이트 */
    const {
        isLoading,
        isError,
        data,
        error,
        isFetchingNextPage,
        fetchNextPage,
        hasNextPage
    } = useInfiniteQuery('fonts', async ({ pageParam = '' }) => {
        await new Promise((res) => setTimeout(res, 200));
        const res = await axios.get('/api/fontlist', {params: { id: pageParam }});
        console.log(res.data);
        return res.data;
    },{
        getNextPageParam: (lastPage) => lastPage.nextId ?? false,
    });

    return (
        <div className="w-[100%] flex flex-col justify-start items-center">
            {/* 로딩 바 */}
            {isLoading ? <div className="w-[100%] text-center text-dark-theme-8">Loading...</div> : <></>}

            {/* 에러 표시 */}
            {isError ? <div className="w-[100%] text-center text-dark-theme-8">Error! {JSON.stringify(error)}</div> : <></>}

            {/* fetchNextPage */}
            {data && data.pages.map((page) => {
                return (
                    <React.Fragment key={page.nextId ?? 'lastPage'}>
                        {page.fonts.map((font: { code: number; name: string }) => (
                            <div key={font.code} className="w-[500px] h-[500px] flex flex-col justify-center items-center mb-[16px] bg-dark-theme-8">
                                <p className='text-[20px] text-dark-theme-3'>{font.code}</p>
                                <p className='text-[20px] text-dark-theme-3'>{font.name}</p>
                            </div>
                        ))}
                    </React.Fragment>
                )
            })}

            {/* 로딩 바 */}
            {isFetchingNextPage ? <div className="w-[100%] text-center text-dark-theme-8">Loading...</div> : <></>}

            <span style={{ visibility: 'hidden' }} ref={ref}>intersection observer marker</span>
        </div>
    )
}