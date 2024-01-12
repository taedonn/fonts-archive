// react
import { useEffect } from "react";

// next
import Link from "next/link";

export default function Custom404() {
    // 로딩 시 폰트 다운로드
    useEffect(() => {
        const head = document.head as HTMLHeadElement;     
        head.innerHTML += '<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/fonts-archive/IntelOneMono/IntelOneMono.css" type="text/css"/>'
    }, []);
    
    return (
        <>
            <div className="w-full h-full absolute left-0 top-0 flex flex-col justify-center items-center text-center text-l-2 dark:text-white">
                <div className="text-3xl leading-normal font-medium">
                    권한이 없거나 <br/>
                    존재하지 않는 페이지입니다.
                </div>
                <div style={{fontFamily: "Intel One Mono"}} className="w-[340px] h-[60px] mt-4 flex justify-center items-center rounded-lg text-sm bg-h-1/20 dark:bg-f-8/20 border border-dashed border-h-1 dark:border-f-8">404: Page Not Found</div>
                <div className="flex items-center mt-[40px]">
                    <Link href="/" className="flex justify-center items-center w-[132px] h-9 rounded-full text-[13px] border border-h-1 dark:border-f-8 hover:bg-h-1 hover:dark:bg-f-8 text-h-1 hover:text-white dark:text-f-8 hover:dark:text-d-2 cursor-pointer duration-100">메인 페이지</Link>
                </div>
            </div>
        </>
    )
}