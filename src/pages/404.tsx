import { useEffect } from "react";

export default function Custom404() {
    // 로딩 시 body 패딩 제거 & 풋터 제거
    useEffect(() => {
        const body = document.body as HTMLBodyElement;
        const footer = document.getElementsByTagName("footer")[0] as HTMLElement;
        body.style.paddingBottom = "0";
        footer.style.display = "none";
    }, []);
    
    return (
        <>
            <div className="w-[100%] h-[100vh] flex flex-col justify-center items-center text-center text-theme-3 dark:text-theme-9">
                <div className="text-[28px] font-medium">
                    권한이 없거나 <br/>
                    존재하지 않는 페이지입니다.
                </div>
                <div style={{fontFamily: "Intel One Mono"}} className="w-[340px] h-[60px] mt-[16px] flex justify-center items-center rounded-[8px] text-[14px] text-theme-3 dark:text-theme-9 bg-theme-red/20 dark:bg-theme-blue-1/20 border border-dashed border-theme-red dark:border-theme-blue-1">404: Page Not Found</div>
                <div className="flex items-center mt-[40px]">
                    {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
                    <a href="/" className="flex justify-center items-center w-[132px] h-[36px] rounded-full text-[13px] border border-theme-8 hover:border-theme-3 dark:border-theme-blue-1/40 hover:bg-theme-3 hover:dark:bg-theme-blue-1 text-theme-3 hover:text-theme-9 dark:text-theme-blue-1 hover:dark:text-theme-blue-2 cursor-pointer duration-100">메인 페이지</a>
                </div>
            </div>
        </>
    )
}