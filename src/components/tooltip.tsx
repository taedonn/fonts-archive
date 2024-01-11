// react
import { useEffect, useRef } from "react";

const defaultTooltip = {
    page: ''
}

interface Tooltip {
    page?: string,
}

export default function Tooltip({
    page=defaultTooltip.page,
}: Tooltip) {
    // refs
    const tooltip = useRef<HTMLDivElement>(null);

    /** 맨 위로 버튼 클릭 이벤트 */
    const goUp = () => { window.scrollTo({top:0, behavior:'smooth'}); }

    /** 스크롤이 풋터와 만났을 때 위치 변경 */
    const handleScroll = () => {
        const scrollBottom = window.scrollY + window.innerHeight;
        const body = document.body as HTMLBodyElement;
        const footer = document.getElementsByTagName("footer")[0] as HTMLElement;

        if (tooltip.current && footer.style.display !== "none") {
            if (scrollBottom >= body.offsetHeight - footer.offsetHeight) {
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
        if (page === '') {
            window.addEventListener('scroll', handleScroll);
            return () => { window.removeEventListener('scroll', handleScroll); }
        }
    });

    return (
        <>
            <div ref={tooltip} className="group fixed z-10 right-4 bottom-4 flex flex-col justify-start items-start">
                <div onClick={goUp} className="w-10 h-10 rounded-full relative flex flex-row justify-center items-center mt-2 tlg:mt-1.5 cursor-pointer bg-h-e dark:bg-f-8 group-hover:bg-h-1 group-hover:dark:bg-f-9 drop-default-tooltip">
                    <i className="text-lg text-h-1 dark:text-d-2 group-hover:text-white group-hover:dark:text-d-2 fa-solid fa-angle-up"></i>
                </div>
            </div>
        </>
    )
}