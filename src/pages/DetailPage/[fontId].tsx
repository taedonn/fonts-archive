// 훅
import axios from "axios";
import client from "@/libs/client";
import Link from "next/link";
import { useRouter } from "next/router";

// 컴포넌트
import Tooltip from "@/components/tooltip";

function DetailPage({font}:{font: object}) {
    /** useRouter 훅 */
    const router = useRouter();
    
    /** 로고 클릭 시 새로고침 */
    const handleLogo = () => { router.push({ pathname: '/' }).then(() => router.reload()); }

    return (
        <>
            <Tooltip/>
            <div className='interface w-[100%] h-[60px] tlg:h-auto px-[16px] tlg:px-0 fixed right-0 top-0 z-10 flex flex-row tlg:flex-col justify-between tlg:justify-center items-center tlg:items-start backdrop-blur bg-blur-theme border-b border-dark-theme-4'>
                <div className="tlg:w-[100%] tlg:px-[12px] tlg:py-[12px] tmd:py-[10px] tlg:border-b tlg:border-dark-theme-4 flex flex-row justify-start items-center">
                    <Link onClick={handleLogo} href="/" className="w-[36px] tlg:w-[32px] h-[36px] tlg:h-[32px] flex flex-row justify-center items-center rounded-[8px] tlg:rounded-[6px] mr-[12px] bg-dark-theme-3/80 hover:bg-dark-theme-4/60 hover:drop-shadow-default">
                        <svg className="w-[18px] tlg:w-[16px] pb-px fill-dark-theme-8" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="m2.244 13.081.943-2.803H6.66l.944 2.803H8.86L5.54 3.75H4.322L1 13.081h1.244zm2.7-7.923L6.34 9.314H3.51l1.4-4.156h.034zm9.146 7.027h.035v.896h1.128V8.125c0-1.51-1.114-2.345-2.646-2.345-1.736 0-2.59.916-2.666 2.174h1.108c.068-.718.595-1.19 1.517-1.19.971 0 1.518.52 1.518 1.464v.731H12.19c-1.647.007-2.522.8-2.522 2.058 0 1.319.957 2.18 2.345 2.18 1.06 0 1.716-.43 2.078-1.011zm-1.763.035c-.752 0-1.456-.397-1.456-1.244 0-.65.424-1.115 1.408-1.115h1.805v.834c0 .896-.752 1.525-1.757 1.525z"/></svg>
                    </Link>
                </div>
            </div>
        </>
    )
}

export async function getStaticPaths() {
    const fonts = await client.fonts.findMany({
        select: { code: true, },
    })

    const paths = fonts.map((font: any) => ({
        params: { fontId: font.code.toString() },
    }))

    return { paths, fallback: false }
  }

export async function getStaticProps(ctx: any) {
        const res = await axios.get(`http://localhost:3000/api/DetailPage/${ctx.params.fontId}`);
        const data = res.data;

        return {
            props: { font: data }
        }
}

export default DetailPage;