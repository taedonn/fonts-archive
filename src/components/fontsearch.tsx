// 훅
import { useEffect, useRef } from "react";

export default function FontSearch({display, closeBtn}:{display: string, closeBtn: any}) {
    /** esc 버튼 클릭 */
    const handleCloseBtn = () => { closeBtn(); }

    /** 검색 영역 외 클릭 시 */
    const refSearchOutside = useRef<HTMLDivElement>(null);

    /** 셀렉트 박스 - "언어 선택" 외 영역 클릭 */
    useEffect(() => {
        function handleSearchOutside(e:Event) {
            if (refSearchOutside?.current && !refSearchOutside.current.contains(e.target as Node)) {
                closeBtn();
            }
        }
        document.addEventListener("mouseup", handleSearchOutside);
        return () => document.removeEventListener("mouseup", handleSearchOutside);
    },[refSearchOutside]);

    return (
        <>
            {
                display === "show"
                ? <div className="w-[100%] h-[100vh] fixed left-0 top-0 z-40 flex flex-col justify-start items-center pt-[12vh] backdrop-blur bg-blur-theme border-dark-theme-4">
                    <div ref={refSearchOutside} className="w-[720px] rounded-[12px] border border-dark-theme-3 bg-dark-theme-2">
                        <div className="w-[100%] h-[56px] relative flex flex-row justify-center items-center border-b border-dark-theme-3">
                        <svg className="w-[16px] absolute left-[24px] top-[50%] translate-y-[-50%] fill-dark-theme-8" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/></svg>
                            <input type="text" placeholder="폰트 검색하기..." className="w-[calc(100%-108px)] h-[100%] text-[14px] leading-none text-dark-theme-8 bg-transparent"/>
                            <button onClick={handleCloseBtn} className="w-[36px] h-[24px] rounded-[6px] absolute right-[16px] top-[50%] translate-y-[-50%] text-[10px] leading-none text-dark-theme-8 bg-dark-theme-3/80 hover:bg-dark-theme-4/60 hover:drop-shadow-default">ESC</button>
                        </div>
                        <div className="w-[100%] min-h-[150px] relative">
                            <div className="w-[100%] h-[100%] absolute flex flex-row justify-center items-center text-[14px] leading-none text-dark-theme-8">검색 결과가 없습니다.</div>
                        </div>
                    </div>
                </div> : <></>
            }
        </>
    )
}