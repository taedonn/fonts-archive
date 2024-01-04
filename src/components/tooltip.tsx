// react
import { useEffect, useRef } from "react";

export default function Tooltip() {
    // refs
    const tooltip = useRef<HTMLDivElement>(null);

    /** 맨 위로 버튼 클릭 이벤트 */
    const goUp = () => { window.scrollTo({top:0,behavior:'smooth'}); }

    /** 스크롤이 풋터와 만났을 때 위치 변경 */
    const handleScroll = () => {
        const scrollBottom = window.scrollY + window.innerHeight;
        const body = document.body as HTMLBodyElement;
        const header = document.getElementsByClassName("interface")[0] as HTMLDivElement;
        const footer = document.getElementsByTagName("footer")[0] as HTMLElement;

        if (tooltip.current && footer.style.display !== "none") {
            if (scrollBottom >= body.offsetHeight + header.offsetHeight - footer.offsetHeight) {
                tooltip.current.style.position = "absolute";
                tooltip.current.style.bottom = (footer.offsetHeight + 16) + "px";
            } else {
                tooltip.current.style.position = "fixed";
                tooltip.current.style.bottom = "16px";
            }
        }
    }

    // lodash/throttle을 이용해 스크롤
    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => { window.removeEventListener('scroll', handleScroll); }
    });

    return (
        <>
            <div ref={tooltip} className="fixed z-20 right-4 bottom-4 flex flex-col justify-start items-start">
                <div onClick={goUp} className="w-10 h-10 rounded-full relative flex flex-row justify-center items-center mt-2 tlg:mt-1.5 cursor-pointer bg-theme-3 dark:bg-theme-1 drop-default-tooltip">
                    <svg className="w-[18px] fill-theme-10 dark:fill-theme-8" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M7.646 4.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1-.708.708L8 5.707l-5.646 5.647a.5.5 0 0 1-.708-.708l6-6z"/></svg>
                </div>
            </div>
        </>
    )
}