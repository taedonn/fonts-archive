// next
import Link from "next/link";

export default function Footer () {
    return (
        <>
            <footer className="w-full h-[76px] tlg:px-4 absolute left-0 bottom-0 flex justify-center tlg:justify-start items-center border-t border-theme-7 dark:border-theme-4">
                <div className="flex items-center text-theme-3 dark:text-theme-8">
                    <div className="flex items-center">
                        <div className="w-8 h-8 mr-3 tlg:mr-2.5 flex flex-row justify-center items-center rounded-full bg-theme-2 dark:bg-theme-1">
                            <i className="text-sm text-theme-10 fa-solid fa-a"></i>
                        </div>
                        <div className="flex items-end">
                            <h2 className="text-sm">폰트 아카이브,</h2>
                            <h3 className="text-sm ml-2 tracking-wide text-theme-5 dark:text-theme-7">© 2023 - {new Date().getFullYear()} <Link href="https://taedonn.com" target="_blank" rel="noopener noreferrer" className="hover:underline tlg:hover:no-underline">태돈</Link></h3>
                        </div>
                    </div>
                    <div className="text-[13px] text-theme-2 dark:text-theme-blue-1 ml-9 tlg:hidden">
                        <Link href="/terms" target="_blank" rel="noopener noreferrer" className="text-[13px] hover:underline">서비스 이용약관</Link>
                        <Link href="/privacy" target="_blank" rel="noopener noreferrer" className="text-[13px] hover:underline ml-5">개인정보 처리방침</Link>
                        <Link href="https://github.com/fonts-archive" target="_blank" rel="noopener noreferrer" className="text-[13px] hover:underline ml-5">깃허브 프로젝트</Link>
                    </div>
                </div>
            </footer>
        </>
    )
}