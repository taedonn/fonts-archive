// react
import { useEffect, useRef } from "react";

export default function Tooltip() {
    // refs
    const tooltip = useRef<HTMLDivElement>(null);
    const button = useRef<HTMLDivElement>(null);

    /** 맨 위로 버튼 클릭 이벤트 */
    const goUp = () => { window.scrollTo({top:0, behavior:'smooth'}); }

    /** 스크롤이 풋터와 만났을 때 위치 변경 */
    const handleScroll = () => {
        const body = document.body as HTMLBodyElement;
        const footer = document.getElementsByTagName("footer")[0] as HTMLElement;

        if (tooltip.current && footer) {
            // 풋터와 만나면
            if ((window.scrollY + window.innerHeight) >= body.offsetHeight - footer.offsetHeight) {
                tooltip.current.style.position = "absolute";
                tooltip.current.style.bottom = (footer.offsetHeight + 16) + "px";
            } else {
                tooltip.current.style.position = "fixed";
                tooltip.current.style.bottom = "16px";
            }
        }
        
        if (button.current) {
            // 첫 화면(100vh) 벗어나면
            if (window.scrollY >= window.innerHeight) {
                button.current.classList.remove("invisible", "opacity-0", "right-0");
                button.current.classList.add("visible", "opacity-1", "right-4");
            } else {
                button.current.classList.remove("visible", "opacity-1", "right-4");
                button.current.classList.add("invisible", "opacity-0", "right-0");
            }
        }
    }

    // 스크롤 이벤트 적용
    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => { window.removeEventListener('scroll', handleScroll); }
    });

    return (
        <>
            <div ref={tooltip} className="w-10 h-10 group fixed z-10 right-0 bottom-4 flex flex-col justify-start items-start">
                <div ref={button} onClick={goUp} className="invisible opacity-0 w-full h-full rounded-full absolute right-0 bottom-0 flex flex-row justify-center items-center mt-2 tlg:mt-1.5 duration-200 cursor-pointer bg-h-e dark:bg-f-8 group-hover:bg-h-1 group-hover:dark:bg-f-9 tlg:group-hover:bg-h-e tlg:group-hover:dark:bg-f-8 drop-default-tooltip">
                    <i className="text-lg text-h-1 dark:text-d-2 group-hover:text-white group-hover:dark:text-d-2 tlg:group-hover:text-h-1 tlg:group-hover:dark:text-d-2 fa-solid fa-angle-up"></i>
                </div>
            </div>
        </>
    )
}