import { useEffect } from "react";
import { useInfiniteQuery } from "react-query";
import { useInView } from "react-intersection-observer";
import axios from "axios";

export default function test() {
    /** react-intersection-observer 훅 */
    const { ref, inView } = useInView();

    /** react-intersection-observer와 viewport가 만날 때 실행 */
    useEffect(() => {
        if (inView && hasNextPage) { fetchNextPage(); }
    }, [inView]);

    /** axios를 이용해 querystring GET */
    const get = (queryString: string) => {
        return axios.create({ baseURL: "/api/test-two" }).get(queryString).then((response) => response.data);
    }

    /** InfiniteQuery를 이용해 다음에 불러올 데이터 GET */
    const useFetchUserList = () => {
        const queryResult = useInfiniteQuery(
            ["fonts"],
            ({ pageParam = "" }) => get(`?id=${pageParam}`),
            { getNextPageParam: ({ fontList }) => fontList ? fontList[fontList.length - 1].code : undefined, }
        );
    
        return queryResult;
    }

    /** update된 데이터 fetch */
    const { data, hasNextPage, fetchNextPage } = useFetchUserList();

    /** fetch된 데이터 렌더링 */
    const renderFontList = () => {
        if (data && data.pages) {
            const fontList = data.pages.reduce((prev, { fontList }) => {
                if (fontList) prev.push(...fontList);
                return prev;
            }, []);

            return fontList.map((font:any) => (
                <div key={font.code} className="w-[500px] h-[500px] flex flex-col justify-center items-center mb-[20px] bg-dark-theme-8">
                    <p className="text-[20px] text-dark-theme-3 mb-[8px]">{font.code}</p>
                    <p className="text-[20px] text-dark-theme-3 mb-[8px]">{font.name}</p>
                </div>
            ));
        }
    };

    return (
        <div className="w-[100%] flex flex-col justify-start items-center">
            {renderFontList()}
            <span style={{visibility: 'hidden'}} ref={ref}></span>
        </div>
    );
  }