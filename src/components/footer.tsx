// next
import Link from "next/link";

// components
import Tooltip from "@/components/tooltip";

export default function Footer () {
    return (
        <>
            <div className="h-20"></div>
            <footer className="w-full h-20 px-4 absolute left-0 bottom-0 flex lg:justify-center items-center border-t-2 border-l-e dark:border-d-3 text-l-2 dark:text-white">
                <div className="flex items-center">
                    <div className="flex items-center">
                        <div className="w-8 h-8 mr-3 relative">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src="/icon.svg" alt="로고" referrerPolicy="no-referrer" className="h-full"/>
                        </div>
                        <div className="flex items-end text-sm">
                            <h2 className="font-medium">폰트 아카이브,</h2>
                            <h3 className="ml-2 tracking-wide text-l-5 dark:text-d-c">© 2023 - {new Date().getFullYear()} <Link href="https://taedonn.com" target="_blank" rel="noopener noreferrer" className="hover:underline tlg:hover:no-underline">태돈</Link></h3>
                        </div>
                    </div>
                    <div className="text-sm flex gap-4 ml-8 tlg:hidden text-h-1 dark:text-f-8">
                        <Link href="/terms" rel="noopener noreferrer" className="lg:hover:underline">서비스 이용약관</Link>
                        <Link href="/privacy" rel="noopener noreferrer" className="lg:hover:underline">개인정보 처리방침</Link>
                        <Link href="https://github.com/fonts-archive" target="_blank" rel="noopener noreferrer" className="lg:hover:underline">깃허브 프로젝트</Link>
                    </div>
                </div>
            </footer>

            {/* 툴팁 */}
            <Tooltip/>
        </>
    )
}