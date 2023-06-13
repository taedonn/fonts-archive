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
    // ESC/ENTER 눌렀을 때 Alert창 닫기
    useEffect(() => {
        const keys: any = [];
        const handleKeydown = (e: KeyboardEvent) => {
            keys[e.key] = true;
            if (display === 'show') {
                e.preventDefault();
                if (keys["Escape"] || keys["Enter"]) { handleAlertClose(); }
            }
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
                    <div className="w-content h-[48px] tlg:h-[40px] pl-[12px] pr-[84px] leading-none text-[13px] tlg:text-[12px] text-theme-10 dark:text-theme-9 bg-theme-4 dark:bg-theme-blue-2 rounded-[8px] border-[2px] border-theme-yellow dark:border-theme-blue-1/60 fixed top-[76px] tlg:top-[72px] left-[50%] translate-x-[-50%] flex flex-row justify-center items-center animate-alert-zoom-in drop-shadow-default dark:drop-shadow-dark">
                        <div className="flex flex-row justify-center items-center">
                            <div className="w-[20px] tlg:w-[16px] h-[20px] tlg:h-[16px] mr-[6px] tlg:mr-[4px] flex flex-col justify-center items-center">
                                <svg className="w-[14px] tlg:w-[12px] fill-theme-10 dark:fill-theme-9" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/><path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/></svg>
                            </div>
                            <div>{text}</div>
                        </div>
                        <div onClick={handleAlertClose} className="w-[44px] h-[24px] tlg:h-[22px] absolute right-[16px] top-[50%] translate-y-[-50%] flex flex-row justify-center items-center font-medium text-theme-5 dark:text-theme-blue-2 bg-theme-yellow/90 hover:bg-theme-yellow tlg:bg-theme-yellow tlg:hover:bg-theme-yellow dark:bg-theme-blue-1/90 hover:dark:bg-theme-blue-1 tlg:dark:bg-theme-blue-1 tlg:hover:dark:bg-theme-blue-1 rounded-[4px] cursor-pointer">확인</div>
                    </div>
                </>
                : <></>
            }
        </>
    )
}