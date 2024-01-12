// next
import Link from "next/link";

export default function Footer () {
    return (
        <>
            <div className="h-20"></div>
            <footer className="w-full h-20 px-4 absolute left-0 bottom-0 flex justify-center tlg:justify-start items-center border-t border-l-b dark:border-d-6">
                <div className="flex items-center text-l-2 dark:text-white">
                    <div className="flex items-center">
                        <div className="w-8 h-8 mr-3 tlg:mr-2.5 flex justify-center items-center rounded-full bg-h-1">
                            <i className="text-sm text-white fa-solid fa-a"></i>
                        </div>
                        <div className="flex items-end">
                            <h2 className="text-sm">폰트 아카이브,</h2>
                            <h3 className="text-sm ml-2 tracking-wide text-l-5 dark:text-d-c">© 2023 - {new Date().getFullYear()} <Link href="https://taedonn.com" target="_blank" rel="noopener noreferrer" className="hover:underline tlg:hover:no-underline">태돈</Link></h3>
                        </div>
                    </div>
                    <div className="text-sm flex gap-4 ml-9 tlg:hidden text-h-1 dark:text-f-8">
                        <Link href="/terms" target="_blank" rel="noopener noreferrer" className="hover:underline tlg:hover:no-underline">서비스 이용약관</Link>
                        <Link href="/privacy" target="_blank" rel="noopener noreferrer" className="hover:underline tlg:hover:no-underline">개인정보 처리방침</Link>
                        <Link href="https://github.com/fonts-archive" target="_blank" rel="noopener noreferrer" className="hover:underline tlg:hover:no-underline">깃허브 프로젝트</Link>
                    </div>
                </div>
            </footer>
        </>
    )
}