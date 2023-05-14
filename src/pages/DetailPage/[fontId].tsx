// 훅
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import axios from "axios";
import client from "@/libs/client";
import { isMacOs } from "react-device-detect";
import { Head } from "next/document";

// 컴포넌트
import Tooltip from "@/components/tooltip";
import FontSearch from "@/components/fontsearch";

function DetailPage({fontInfo}:{fontInfo: any}) {
    /** useRouter 훅 */
    const router = useRouter();

    /** 폰트 데이터 props */
    const font = fontInfo[0];
    console.log(font);

    /** 타이틀 변경 */
    useEffect(() => {
        document.title = font.name + " · FONTS ARCHIVE"
    }, []);
    
    /** 로고 클릭 시 새로고침 */
    const handleLogo = () => { router.push({ pathname: '/' }).then(() => router.reload()); }

    /** 폰트 검색 훅 */
    const defaultSearchDisplay = "hide"
    const [searchDisplay, setSearchDisplay] = useState(defaultSearchDisplay);
    useEffect(() => { setSearchDisplay(defaultSearchDisplay); }, [defaultSearchDisplay])

    /** 폰트 검색 버튼 클릭 */
    const handleFontSearch = () => {
        setSearchDisplay("show");
        document.body.style.overflow = "hidden";
    }

    /** 폰트 검색 ESC 버튼 클릭 */
    const handleFontSearchCloseBtn = () => {
        setSearchDisplay("hide");
        document.body.style.overflow = "auto";
    }

    return (
        <>
            {/* 고정 메뉴 */}
            <Tooltip/>

            {/* 헤더 */}
            <div className='interface w-[100%] h-[60px] tlg:h-auto px-[32px] tlg:px-0 fixed right-0 top-0 z-10 flex flex-row tlg:flex-col justify-between tlg:justify-center items-center tlg:items-start backdrop-blur bg-blur-theme border-b border-dark-theme-4'>
                <div className="tlg:w-[100%] tlg:px-[12px] tlg:py-[12px] tmd:py-[10px] tlg:border-b tlg:border-dark-theme-4 flex flex-row justify-start items-center">
                    <Link onClick={handleLogo} href="/" className="w-[36px] tlg:w-[32px] h-[36px] tlg:h-[32px] flex flex-row justify-center items-center rounded-[8px] tlg:rounded-[6px] mr-[12px] bg-dark-theme-3/80 hover:bg-dark-theme-4/60 hover:drop-shadow-default">
                        <svg className="w-[18px] tlg:w-[16px] pb-px fill-dark-theme-8" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="m2.244 13.081.943-2.803H6.66l.944 2.803H8.86L5.54 3.75H4.322L1 13.081h1.244zm2.7-7.923L6.34 9.314H3.51l1.4-4.156h.034zm9.146 7.027h.035v.896h1.128V8.125c0-1.51-1.114-2.345-2.646-2.345-1.736 0-2.59.916-2.666 2.174h1.108c.068-.718.595-1.19 1.517-1.19.971 0 1.518.52 1.518 1.464v.731H12.19c-1.647.007-2.522.8-2.522 2.058 0 1.319.957 2.18 2.345 2.18 1.06 0 1.716-.43 2.078-1.011zm-1.763.035c-.752 0-1.456-.397-1.456-1.244 0-.65.424-1.115 1.408-1.115h1.805v.834c0 .896-.752 1.525-1.757 1.525z"/></svg>
                    </Link>
                </div>
                <div className="tlg:w-[100%] tlg:px-[12px] tlg:py-[12px] tmd:py-[10px] w-content flex flex-row justify-start items-center">
                    <button onClick={handleFontSearch} className="w-[220px] tlg:w-[200px] tmd:w-[34px] h-[32px] tlg:h-[30px] relative text-[14px] tlg:text-[12px] text-normal text-dark-theme-8 leading-none bg-dark-theme-3/80 flex flex-start justify-start items-center rounded-[8px] pl-[38px] tlg:pl-[30px] tmd:pl-0 pb-px hover:bg-dark-theme-4/60 hover:drop-shadow-default">
                        <span className="tmd:hidden">폰트 검색하기...</span>
                        <svg className="w-[12px] tlg:w-[10px] absolute left-[16px] tlg:left-[12px] top-[50%] translate-y-[-50%] fill-dark-theme-8" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/></svg>
                        <div className="absolute right-[16px] flex flex-row justify-center items-center">
                            {
                                isMacOs
                                ? <div className="flex flex-row justify-center items-center">
                                    <svg className="w-[12px] fill-dark-theme-8 mr-px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M3.5 2A1.5 1.5 0 0 1 5 3.5V5H3.5a1.5 1.5 0 1 1 0-3zM6 5V3.5A2.5 2.5 0 1 0 3.5 6H5v4H3.5A2.5 2.5 0 1 0 6 12.5V11h4v1.5a2.5 2.5 0 1 0 2.5-2.5H11V6h1.5A2.5 2.5 0 1 0 10 3.5V5H6zm4 1v4H6V6h4zm1-1V3.5A1.5 1.5 0 1 1 12.5 5H11zm0 6h1.5a1.5 1.5 0 1 1-1.5 1.5V11zm-6 0v1.5A1.5 1.5 0 1 1 3.5 11H5z"/></svg>
                                    <span className="text-[12px]">K</span>
                                </div>
                                : <span className="tmd:hidden text-[12px] tlg:text-[10px] leading-none">Ctrl + K</span>
                            }
                        </div>
                    </button>
                </div>
            </div>

            {/* 메인 */}
            <div className="w-[100%] mt-[60px] p-[32px] py-[32px]">
                <link href={font.cdn_url} rel="stylesheet" type="text/css" itemProp="url"></link>
                <div className="w-[100%] flex flex-col justify-start items-start">
                    <div style={{fontFamily:font.font_family}} className="text-[32px] text-dark-theme-8 leading-tight mb-[12px]">{font.name}</div>
                    <div className="flex flex-row justify-start items-center">
                        <div style={{fontFamily:font.font_family}} className="text-[16px] leading-tight text-dark-theme-8 ml-[2px] mr-[16px]">제작<span className="text-dark-theme-6 ml-[8px]">{font.source}</span></div>
                        <div style={{fontFamily:font.font_family}} className="text-[16px] leading-tight text-dark-theme-8">형태<span className="text-dark-theme-6 ml-[8px]">{font.font_type === "Sans Serif" ? "고딕" : (font.font_type === "Serif" ? "명조" : (font.font_type === "Hand Writing" ? "손글씨" : "장식체"))}</span></div>
                    </div>
                    <div className="w-[100%] h-px my-[20px] bg-dark-theme-4"></div>
                </div>
                <div className="flex flex-row justify-start items-center mb-[60px]">
                    <a href={font.source_link} target="_blank" className="h-[40px] flex flex-row justify-center items-center text-[16px] text-blue-theme-border font-medium border-2 border-blue-theme-border rounded-full px-[20px] pb-[2px] mr-[12px] cursor-pointer hover:bg-blue-theme-border/10">다운로드 페이지로 이동</a>
                    <a href={font.github_link} target="_blank" className="w-[180px] h-[40px] flex flex-row justify-center items-center text-[16px] text-dark-theme-8 font-medium border-2 border-dark-theme-8 rounded-full px-[20px] pb-[2px] cursor-pointer hover:bg-dark-theme-8/10">폰트 다운로드</a>
                </div>
                <div className="flex flex-col justify-start items-start">
                    <h2 className="text-[24px] text-dark-theme-8 font-medium">웹 폰트 사용하기</h2>
                </div>
            </div>
            
            {/* 폰트 검색 */}
            <FontSearch display={searchDisplay} closeBtn={handleFontSearchCloseBtn} showBtn={handleFontSearch}/>
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
    const fonts = await client.fonts.findMany({
        select: { // 특정 column 선택
            code: true,
            name: true,
            lang: true,
            view: true,
            font_family: true,
            font_type: true,
            font_weight: true,
            source: true,
            source_link: true,
            github_link: true,
            cdn_css: true,
            cdn_link: true,
            cdn_import: true,
            cdn_font_face: true,
            cdn_url: true,
            license_print: true,
            license_web: true,
            license_video: true,
            license_package: true,
            license_embed: true,
            license_bici: true,
            license_ofl: true,
            license_purpose: true,
            license_source: true,
            license: true,
        },
        where: {
            code: Number(ctx.params.fontId),
        },
    })

    return {
        props: { fontInfo: fonts }
    }
}

export default DetailPage;