// react
import { useEffect } from "react";

// next
import Link from "next/link";

// common
import { onMouseDown, onMouseOut, onMouseUp } from "@/libs/common";

export default function Custom500() {
  // 로딩 시 폰트 다운로드
  useEffect(() => {
    const head = document.head as HTMLHeadElement;
    head.innerHTML +=
      '<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/fonts-archive/IntelOneMono/IntelOneMono.css" type="text/css"/>';
  }, []);

  return (
    <>
      <div className="w-full h-full absolute left-0 top-0 flex flex-col justify-center items-center text-center text-l-2 dark:text-white">
        <div className="text-3xl leading-normal font-medium">
          권한이 없거나 <br />
          존재하지 않는 페이지입니다.
        </div>
        <div
          style={{ fontFamily: "Intel One Mono" }}
          className="w-[22.5rem] h-16 mt-4 flex justify-center items-center rounded-lg text-sm bg-h-1/20 dark:bg-f-8/20 border border-dashed border-h-1 dark:border-f-8"
        >
          500: Internal Server Error
        </div>
        <div className="flex items-center mt-10">
          <Link
            href="/"
            onMouseDown={(e) => onMouseDown(e, 0.95, true)}
            onMouseUp={onMouseUp}
            onMouseOut={onMouseOut}
            className="flex justify-center items-center w-32 h-9 rounded-lg text-sm border border-h-1 dark:border-f-8 hover:bg-h-1 hover:dark:bg-f-8 text-h-1 hover:text-white dark:text-f-8 hover:dark:text-d-2 cursor-pointer duration-100"
          >
            메인 페이지
          </Link>
        </div>
      </div>
    </>
  );
}
