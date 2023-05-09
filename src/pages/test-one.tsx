import React, { useEffect } from 'react';
import { useInfiniteQuery } from 'react-query';
import { useInView } from 'react-intersection-observer';
import axios from 'axios';

export default function Test() {
    const { ref, inView } = useInView()

    const { isLoading, isError, data, error, isFetchingNextPage, fetchNextPage, hasNextPage } = useInfiniteQuery('fonts', async ({ pageParam = '' }) => {
        await new Promise((res) => setTimeout(res, 1000));
        const res = await axios.get('/api/infinite-scroll-test-one?cursor=' + pageParam);
        return res.data;
    },{ getNextPageParam: (lastPage) => lastPage.nextId ?? false, });

    useEffect(() => {
        if (inView && hasNextPage) { fetchNextPage(); }
    }, [inView]);

    if (isLoading) return <div className="w-[100%] text-center text-dark-theme-8 mt-[20px]">Loading...</div>
    if (isError) return <div>Error! {JSON.stringify(error)}</div>

    return (
        <div className="w-[100%] flex flex-col justify-start items-center">
            {data && data.pages.map((page) => {
                return (
                    <React.Fragment key={page.nextId ?? 'lastPage'}>
                        {page.fonts.map((font: { code: number; name: string }) => (
                            <div className="w-[500px] h-[500px] flex flex-col justify-center items-center mb-[16px] bg-dark-theme-8" key={font.code}>
                                <p className='text-[20px] text-dark-theme-3'>{font.code}</p>
                                <p className='text-[20px] text-dark-theme-3'>{font.name}</p>
                            </div>
                        ))}
                    </React.Fragment>
                )
            })}

            {isFetchingNextPage ? <div className="w-[100%] text-center text-dark-theme-8">Loading...</div> : null}

            <span style={{ visibility: 'hidden' }} ref={ref}>intersection observer marker</span>
        </div>
    )
}