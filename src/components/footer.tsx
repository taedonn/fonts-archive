// next hooks
import Link from "next/link"

export default function Footer () {
    return (
        <>
            <footer className="w-[100%] h-[88px] tlg:h-[76px] tlg:px-[16px] absolute z-10 left-0 bottom-0 flex justify-center tlg:justify-start items-center border-t border-theme-7 dark:border-theme-4">
                <div className="flex items-center text-theme-3 dark:text-theme-8">
                    <div className="flex items-center">
                        <Link href="/" aria-label="logo" className="w-[32px] tlg:w-[30px] h-[32px] tlg:h-[30px] mr-[12px] tlg:mr-[10px] flex flex-row justify-center items-center rounded-full bg-theme-4 dark:bg-theme-1/80">
                            <svg className="w-[14px] tlg:w-[12px] pb-px fill-theme-10 dark:fill-theme-8" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="m2.244 13.081.943-2.803H6.66l.944 2.803H8.86L5.54 3.75H4.322L1 13.081h1.244zm2.7-7.923L6.34 9.314H3.51l1.4-4.156h.034zm9.146 7.027h.035v.896h1.128V8.125c0-1.51-1.114-2.345-2.646-2.345-1.736 0-2.59.916-2.666 2.174h1.108c.068-.718.595-1.19 1.517-1.19.971 0 1.518.52 1.518 1.464v.731H12.19c-1.647.007-2.522.8-2.522 2.058 0 1.319.957 2.18 2.345 2.18 1.06 0 1.716-.43 2.078-1.011zm-1.763.035c-.752 0-1.456-.397-1.456-1.244 0-.65.424-1.115 1.408-1.115h1.805v.834c0 .896-.752 1.525-1.757 1.525z"/></svg>
                        </Link>
                        <div className="flex items-end">
                            <h2 className="text-[14px] tlg:text-[13px]">폰트 아카이브,</h2>
                            <h3 className="text-[13px] tlg:text-[12px] font-light tracking-wide ml-[8px]">© 2023 <Link href="https://taedonn.com" target="_blank" rel="noopener noreferrer" className="hover:underline tlg:hover:no-underline">taedonn.com</Link></h3>
                        </div>
                    </div>
                    <div className="text-[13px] text-theme-2 dark:text-theme-blue-1 ml-[36px] tlg:hidden">
                        <Link href="/user/terms" target="_blank" rel="noopener noreferrer" className="text-[13px] hover:underline">서비스 이용약관</Link>
                        <Link href="/user/privacy" target="_blank" rel="noopener noreferrer" className="text-[13px] hover:underline ml-[20px]">개인정보 처리방침</Link>
                        {/* <Link href="https://taedonn.com" target="_blank" className="text-[13px] hover:underline ml-[20px]">사이트</Link> */}
                        <Link href="https://github.com/fonts-archive" target="_blank" rel="noopener noreferrer" className="text-[13px] hover:underline ml-[20px]">깃허브 프로젝트</Link>
                    </div>
                </div>
            </footer>
        </>
    )
}