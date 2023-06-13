// react hooks
import { useEffect } from "react";

export default function Alert(
    {
        display,
        text,
        handleAlertClose,
    }: {
        display: string,
        text: string,
        handleAlertClose: any,
    }
) {
    // ESC 눌렀을 때 Alert창 닫기
    useEffect(() => {
        const keys: any = [];
        const handleKeydown = (e: KeyboardEvent) => {
            keys[e.key] = true;
            if (keys["Escape"] || keys["Enter"]) { handleAlertClose(); }
        }
        const handleKeyup = (e: KeyboardEvent) => {keys[e.key] = false;}

        window.addEventListener("keydown", handleKeydown, false);
        window.addEventListener("keyup", handleKeyup, false);

        return () => {
            window.removeEventListener("keydown", handleKeydown);
            window.removeEventListener("keyup", handleKeyup);
        }
    });

    return (
        <>
            {
                display === 'show'
                ? <>
                    <div className="w-content h-[48px] tlg:h-[40px] pl-[16px] tlg:pl-[12px] pr-[64px] tlg:pr-[56px] leading-none text-[14px] tlg:text-[12px] text-theme-10 dark:text-theme-9 bg-theme-5 dark:bg-theme-blue-2 rounded-[8px] border-[2px] border-theme-yellow dark:border-theme-blue-1/60 fixed top-[76px] tlg:top-[72px] left-[50%] translate-x-[-50%] flex flex-row justify-center items-center animate-fontbox-zoom-in drop-shadow-default dark:drop-shadow-dark">
                        <div className="flex flex-row justify-center items-center">
                            <div className="w-[20px] tlg:w-[16px] h-[20px] tlg:h-[16px] mr-[8px] tlg:mr-[4px] flex flex-col justify-center items-center">
                                <svg className="w-[16px] tlg:w-[12px] fill-theme-yellow dark:fill-theme-blue-1/80" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/><path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/></svg>
                            </div>
                            <div className="mt-px">{text}</div>
                        </div>
                        <div onClick={handleAlertClose} className="w-[24px] tlg:w-[20px] h-[24px] tlg:h-[20px] absolute right-[12px] top-[50%] translate-y-[-50%] flex flex-row justify-center items-center rounded-[4px] hover:bg-theme-yellow/10 tlg:hover:bg-theme-transparent hover:dark:bg-theme-blue-1/10 tlg:hover:dark:bg-transparent group cursor-pointer">
                            <svg className="w-[20px] tlg:w-[16px] fill-theme-10 group-hover:fill-theme-yellow tlg:group-hover:fill-theme-10 dark:fill-theme-9 group-hover:dark:fill-theme-blue-1 tlg:group-hover:dark:fill-theme-9" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/></svg>
                        </div>
                    </div>
                </>
                : <></>
            }
        </>
    )
}