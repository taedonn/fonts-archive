// next
import Link from "next/link";

export default function Footer () {
    return (
        <>
            <footer className="w-full h-[76px] tlg:px-4 absolute left-0 bottom-0 flex justify-center tlg:justify-start items-center border-t border-theme-7 dark:border-theme-4">
                <div className="flex items-center text-theme-3 dark:text-theme-8">
                    <div className="flex items-center">
                        <div className="w-8 tlg:w-[30px] h-7 tlg:h-[30px] mr-3 tlg:mr-2.5 flex flex-row justify-center items-center rounded-full bg-theme-3 dark:bg-theme-1/80">
                            <svg className="w-3.5 tlg:w-3 pb-px fill-theme-10 dark:fill-theme-8" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="m2.244 13.081.943-2.803H6.66l.944 2.803H8.86L5.54 3.75H4.322L1 13.081h1.244zm2.7-7.923L6.34 9.314H3.51l1.4-4.156h.034zm9.146 7.027h.035v.896h1.128V8.125c0-1.51-1.114-2.345-2.646-2.345-1.736 0-2.59.916-2.666 2.174h1.108c.068-.718.595-1.19 1.517-1.19.971 0 1.518.52 1.518 1.464v.731H12.19c-1.647.007-2.522.8-2.522 2.058 0 1.319.957 2.18 2.345 2.18 1.06 0 1.716-.43 2.078-1.011zm-1.763.035c-.752 0-1.456-.397-1.456-1.244 0-.65.424-1.115 1.408-1.115h1.805v.834c0 .896-.752 1.525-1.757 1.525z"/></svg>
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