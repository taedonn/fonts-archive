// Next hooks
import Link from "next/link";
import { NextSeo } from 'next-seo';

// react hooks
import React, { useEffect, useState } from "react";

// api
import { FetchFontDetail } from "../api/detailpage/fetchfontdetail";
import { CheckIfSessionExists } from "../api/user/checkifsessionexists";
import { FetchUserInfo } from "../api/user/fetchuserinfo";

// material-ui hooks
import { Slider } from "@mui/material";

// components
import Header from "@/components/header";
import Tooltip from "@/components/tooltip";
import DummyText from "@/components/dummytext";

function DetailPage({params}: any) {
    // 디바이스 체크
    const isMac: boolean = params.userAgent.includes("Mac OS") ? true : false;

    // 빈 함수
    const emptyFn = () => { return; }

    // 폰트 데이터 props
    const font = params.fonts[0];

    /** 조회수 업데이트 */
    const viewUpdate = async () => {
        await fetch("/api/detailpage/updateview", { method: "POST", body: JSON.stringify(font) });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => { viewUpdate(); }, [font]);

    /** 조회수 단위 변경 : 1000 => 1K */
    const ranges = [
        { divider: 1e6 , suffix: 'M' },
        { divider: 1e3 , suffix: 'k' }
    ];
    const formatNumber = (n: number | null) => {
        if (n === null) {
            return ""
        }
        else {
            for (let i = 0; i < ranges.length; i++) {
                if (n >= ranges[i].divider) {
                    return (n / ranges[i].divider).toString() + ranges[i].suffix;
                }
            }
        }
        return n.toString();
    }

    // 웹 폰트 사용하기 디폴트: CSS 설정하기
    const [webFont, setWebFont] = useState("CSS");

    /** 웹 폰트 클릭 시 코드 변경 */
    const handleWebFont = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.value === "CSS") { setWebFont("CSS"); }
        else if (e.target.value === "link") { setWebFont("link"); }
        else if (e.target.value === "import") { setWebFont("import"); }
        else { setWebFont("font-face"); }
    }

    useEffect(() => {
        const cdnFontFace = document.getElementById("cdn-font-face") as HTMLDivElement;
        if (webFont === "font-face") { cdnFontFace.innerHTML = font.cdn_font_face; }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [webFont]);

    /** 웹 폰트 적용하기 복사 버튼 클릭 이벤트 */
    const copyOnClick = () => {
        const pre = document.getElementsByClassName("cdn_pre")[0] as HTMLPreElement;
        const copyBtn = document.getElementsByClassName("copy_btn")[0] as SVGSVGElement;
        const copyChkBtn = document.getElementsByClassName("copy_chk_btn")[0] as SVGSVGElement;

        window.navigator.clipboard.writeText(pre.innerText);

        copyBtn.style.display = 'none';
        copyChkBtn.style.display = 'block';
        setTimeout(function() {
            copyBtn.style.display = 'block';
            copyChkBtn.style.display = 'none';
        },1000);
    }

    // 폰트 미리보기 디폴트: 빈 문자열
    const [text, setText] = useState("");

    /** 폰트 미리보기 텍스트 체인지 이벤트 */
    const handleFontWeightChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setText(e.target.value);
    }

    // 라이센스 본문
    useEffect(() => {
        const license = document.getElementById("license") as HTMLDivElement;
        license.innerHTML = font.license;
    }, [font.license]);

    // 폰트 미리보기 state
    const [fontSize, setFontSize] = useState<number>(20);
    const [lineHeight, setLineHeight] = useState<number>(1.2);
    const [letterSpacing, setLetterSpacing] = useState<number>(0);

    /** MUI TextArea 줄바꿈 시 높이 변경 */
    const handleHeightChange = (e: any) => {
        e.target.style.height = 0;
        e.target.style.height = (e.target.scrollHeight)+"px";
    }

    /** MUI 폰트 크기 뒤에 px 추가 */
    const fnAddUnit = (value: number) => { return value + "px"; }

    /** MUI 행간 값 */
    const fnLineheightValue = (value: number) => { return value / 10; }

    /** MUI 자간 값 */
    const fnLetterSpacingValue = (value: number) => { return value / 10; }

    return (
        <>
            {/* Head 부분*/}
            <NextSeo 
                title={font.name + " · 폰트 아카이브"}
                description={font.name + " - 상업용 무료 한글 폰트 아카이브"}
            />

            {/* 헤더 */}
            <Header
                isMac={isMac}
                theme={params.theme}
                user={params.user}
                page={"DetailPage"}
                lang={""}
                type={""}
                sort={""}
                source={""}
                handleTextChange={emptyFn}
                handleLangOptionChange={emptyFn}
                handleTypeOptionChange={emptyFn}
                handleSortOptionChange={emptyFn}
                handleSearch={emptyFn}
            />

            {/* 고정 메뉴 */}
            <Tooltip/>

            {/* 메인 */}
            <div className="w-[100%] py-[24px] tlg:py-[20px] tmd:py-[16px]">
                <link href={font.cdn_url} rel="stylesheet" type="text/css" itemProp="url"></link>
                <div className="w-[100%] flex flex-col justify-start items-start">
                    <div style={{fontFamily:'"'+font.font_family+'"'}} className="text-[32px] tlg:text-[28px] tmd:text-[24px] text-theme-3 dark:text-theme-9 font-medium leading-tight mb-[12px] tlg:mb-[8px]">{font.name}</div>
                    <div className="flex flex-row justify-start items-center">
                        <div style={{fontFamily:'"'+font.font_family+'"'}} className="text-[16px] tlg:text-[14px] tmd:text-[12px] leading-tight text-theme-3 dark:text-theme-9 ml-[2px] mr-[16px] tlg:mr-[14px] tmd:mr-[12px]">
                            제작
                            <Link href={{pathname: "/", query: {search: font.source}}} className="relative group text-theme-yellow dark:text-theme-blue-1 border-b border-theme-yellow dark:border-theme-blue-1 ml-[8px] tlg:ml-[6px]">
                                {font.source}
                                <div className="same-source w-content absolute z-10 left-[50%] top-[-38px] text-[13px] font-medium leading-none px-[14px] py-[8px] rounded-[4px] hidden group-hover:block tlg:group-hover:hidden group-hover:animate-fontbox-zoom-in bg-theme-yellow dark:bg-theme-blue-1 text-theme-3 dark:text-theme-blue-2">제작사의 다른 폰트 보기</div>
                            </Link>
                        </div>
                        <div style={{fontFamily:'"'+font.font_family+'"'}} className="text-[16px] tlg:text-[14px] tmd:text-[12px] leading-tight text-theme-3 dark:text-theme-9 mr-[16px] tlg:mr-[14px] tmd:mr-[12px]">형태<span className="text-theme-5 dark:text-theme-7 ml-[8px] tlg:ml-[6px]">{font.font_type === "Sans Serif" ? "고딕" : (font.font_type === "Serif" ? "명조" : (font.font_type === "Hand Writing" ? "손글씨" : (font.font_type === "Display" ? "장식체" : "픽셀체")))}</span></div>
                        <div style={{fontFamily:'"'+font.font_family+'"'}} className="text-[16px] tlg:text-[14px] tmd:text-[12px] leading-tight text-theme-3 dark:text-theme-9 mr-[16px] tlg:mr-[14px] tmd:mr-[12px]">조회수<span className="text-theme-5 dark:text-theme-7 ml-[8px] tlg:ml-[6px]">{formatNumber(font.view)}</span></div>
                        <div style={{fontFamily:'"'+font.font_family+'"'}} className="text-[16px] tlg:text-[14px] tmd:text-[12px] leading-tight text-theme-3 dark:text-theme-9">좋아요 수<span className="text-theme-5 dark:text-theme-7 ml-[8px] tlg:ml-[6px]">{formatNumber(font.like)}</span></div>
                    </div>
                    <div className="w-[100%] h-px my-[20px] tlg:my-[16px] bg-theme-7 dark:bg-theme-4"></div>
                </div>
                <div className="flex flex-row justify-start items-center mb-[60px] tlg:mb-[48px] tmd:mb-[40px]">
                    <Link aria-label="source-link" href={font.source_link} target="_blank" className="h-[40px] tlg:h-[36px] tmd:h-[32px] flex flex-row justify-center items-center text-[16px] tlg:text-[14px] tmd:text-[12px] text-theme-3 dark:text-theme-blue-1 font-medium dark:border-2 tmd:dark:border dark:border-theme-blue-1 rounded-full px-[20px] mr-[12px] tmd:mr-[8px] cursor-pointer bg-theme-yellow hover:bg-theme-yellow/90 tlg:hover:bg-theme-yellow dark:bg-transparent hover:dark:bg-theme-blue-1/10 tlg:hover:dark:bg-transparent">다운로드 페이지로 이동</Link>
                    {
                        font.license_ofl === "N"
                        ? <></>
                        : <Link aria-label="github-source-link" href={font.github_link} className="w-[180px] tlg:w-[140px] tmd:w-[128px] h-[40px] tlg:h-[36px] tmd:h-[32px] flex flex-row justify-center items-center text-[16px] tlg:text-[14px] tmd:text-[12px] text-theme-9 dark:text-theme-9 font-medium dark:border-2 tmd:dark:border border-theme-4 dark:border-theme-9 rounded-full px-[20px] cursor-pointer bg-theme-4 hover:bg-theme-4/90 tlg:hover:bg-theme-4 dark:bg-transparent hover:dark:bg-theme-9/10 tlg:hover:dark:bg-transparent">폰트 다운로드</Link>
                    }
                </div>
                {
                    font.license_embed === "N" || font.license_ofl === "N"
                    ? <></>
                    : <>
                        <div className="flex flex-col justify-start items-start mb-[60px] tlg:mb-[48px] tmd:mb-[40px]">
                            <h2 className="text-[24px] tlg:text-[20px] tmd:text-[18px] text-theme-3 dark:text-theme-9 font-medium mb-[20px] tlg:mb-[16px] tmd:mb-[14px]">웹 폰트 사용하기</h2>
                            <div className="cdn w-[1000px] tlg:w-[100%] h-[60px] tlg:h-[48px] tmd:h-[40px] overflow-hidden border-x border-t border-b border-theme-4 dark:border-theme-3/80 rounded-t-[8px] flex flex-row justify-start items-center">
                                <input onChange={handleWebFont} type="radio" id="cdn_css" name="cdn" value="CSS" className="hidden" defaultChecked/>
                                <label htmlFor="cdn_css" className="w-[25%] h-[100%] border-r border-theme-8 dark:border-theme-3/80 flex flex-row justify-center items-center text-[16px] tlg:text-[14px] tmd:text-[10px] text-theme-3 focused:text-theme-9 dark:text-theme-9 leading-none cursor-pointer">CSS 설정하기</label>
                                <input onChange={handleWebFont} type="radio" id="cdn_link" name="cdn" value="link" className="hidden"/>
                                <label htmlFor="cdn_link" className="w-[25%] h-[100%] border-r border-theme-8 dark:border-theme-3/80 flex flex-row justify-center items-center text-[16px] tlg:text-[14px] tmd:text-[10px] text-theme-3 dark:text-theme-9 leading-none cursor-pointer">link 방식</label>
                                <input onChange={handleWebFont} type="radio" id="cdn_import" name="cdn" value="import" className="hidden"/>
                                <label htmlFor="cdn_import" className="w-[25%] h-[100%] border-r border-theme-8 dark:border-theme-3/80 flex flex-row justify-center items-center text-[16px] tlg:text-[14px] tmd:text-[10px] text-theme-3 dark:text-theme-9 leading-none cursor-pointer">import 방식</label>
                                <input onChange={handleWebFont} type="radio" id="cdn_font_face" name="cdn" value="font-face" className="hidden"/>
                                <label htmlFor="cdn_font_face" className="w-[25%] h-[100%] flex flex-row justify-center items-center text-[16px] tlg:text-[14px] tmd:text-[10px] text-theme-3 dark:text-theme-9 leading-none cursor-pointer">font-face 방식</label>
                            </div>
                            <div className="w-[1000px] tlg:w-[100%] border-x border-b rounded-b-[8px] border-theme-4 dark:border-theme-blue-2 bg-theme-4 dark:bg-theme-blue-2">
                                {
                                    webFont === "CSS"
                                    ? <div className="w-[100%] relative pl-[32px] tlg:pl-[24px] tmd:pl-[16px] pr-[66px] tlg:pr-[60px] overflow-hidden">
                                        <div className="cdn_pre w-[100%] h-[72px] tlg:h-[60px] tmd:h-[48px] flex flex-row justify-start items-center overflow-x-auto"><pre style={{fontFamily:"Noto Sans KR"}} className="text-[16px] tlg:text-[14px] tmd:text-[12px] text-theme-9">{font.cdn_css}</pre></div>
                                        <div className="absolute z-10 right-[20px] tlg:right-[16px] tmd:right-[12px] top-[50%] translate-y-[-50%] rounded-[6px] cursor-pointer">
                                            <svg onClick={copyOnClick} className="copy_btn w-[32px] tmd:w-[28px] p-[8px] rounded-[6px] hover:bg-theme-yellow/10 tlg:hover:bg-transparent hover:dark:bg-theme-blue-1/10 tlg:hover:dark:bg-transparent fill-theme-9 hover:fill-theme-yellow tlg:hover:fill-theme-9 dark:fill-theme-7 hover:dark:fill-theme-blue-1 tlg:hover:dark:fill-theme-7" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z"/><path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z"/></svg>
                                            <svg className="copy_chk_btn w-[32px] tmd:w-[28px] p-[8px] rounded-[6px] bg-theme-yellow/10 dark:bg-theme-blue-1/10 fill-theme-yellow dark:fill-theme-blue-1 hidden" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/></svg>
                                        </div>
                                    </div>
                                    : ( webFont === "link"
                                        ? <div className="w-[100%] relative pl-[32px] tlg:pl-[24px] tmd:pl-[16px] pr-[66px] tlg:pr-[60px] overflow-hidden">
                                            <div className="cdn_pre w-[100%] h-[72px] tlg:h-[60px] tmd:h-[48px] flex flex-row justify-start items-center overflow-x-auto"><pre style={{fontFamily:"Noto Sans KR"}} className="text-[16px] tlg:text-[14px] tmd:text-[12px] text-theme-9">{font.cdn_link}</pre></div>
                                            <div className="absolute z-10 right-[20px] tlg:right-[16px] tmd:right-[12px] top-[50%] translate-y-[-50%] cursor-pointer">
                                                <svg onClick={copyOnClick} className="copy_btn w-[32px] tmd:w-[28px] p-[8px] rounded-[6px] hover:bg-theme-yellow/10 tlg:hover:bg-transparent hover:dark:bg-theme-blue-1/10 tlg:hover:dark:bg-transparent fill-theme-9 hover:fill-theme-yellow tlg:hover:fill-theme-9 dark:fill-theme-7 hover:dark:fill-theme-blue-1 tlg:hover:dark:fill-theme-7" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z"/><path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z"/></svg>
                                                <svg className="copy_chk_btn w-[32px] tmd:w-[28px] p-[8px] rounded-[6px] bg-theme-yellow/10 dark:bg-theme-blue-1/10 fill-theme-yellow dark:fill-theme-blue-1 hidden" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/></svg>
                                            </div>
                                        </div>
                                        : ( webFont === "import"
                                            ? <div className="w-[100%] relative pl-[32px] tlg:pl-[24px] tmd:pl-[16px] pr-[66px] tlg:pr-[60px] overflow-hidden">
                                                <div className="cdn_pre w-[100%] h-[72px] tlg:h-[60px] tmd:h-[48px] flex flex-row justify-start items-center overflow-x-auto"><pre style={{fontFamily:"Noto Sans KR"}} className="text-[16px] tlg:text-[14px] tmd:text-[12px] text-theme-9">{font.cdn_import}</pre></div>
                                                <div className="absolute z-10 right-[20px] tlg:right-[16px] tmd:right-[12px] top-[50%] translate-y-[-50%] cursor-pointer">
                                                    <svg onClick={copyOnClick} className="copy_btn w-[32px] tmd:w-[28px] p-[8px] rounded-[6px] hover:bg-theme-yellow/10 tlg:hover:bg-transparent hover:dark:bg-theme-blue-1/10 tlg:hover:dark:bg-transparent fill-theme-9 hover:fill-theme-yellow tlg:hover:fill-theme-9 dark:fill-theme-7 hover:dark:fill-theme-blue-1 tlg:hover:dark:fill-theme-7" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z"/><path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z"/></svg>
                                                    <svg className="copy_chk_btn w-[32px] tmd:w-[28px] p-[8px] rounded-[6px] bg-theme-yellow/10 dark:bg-theme-blue-1/10 fill-theme-yellow dark:fill-theme-blue-1 hidden" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/></svg>
                                                </div>
                                            </div>
                                            : <div className="w-[100%] relative pl-[32px] tlg:pl-[24px] tmd:pl-[16px] pr-[66px] tlg:pr-[60px] overflow-hidden">
                                                <div className="cdn_pre w-[100%] h-[auto] py-[24px] tlg:py-[20px] tmd:py-[15px] flex flex-row justify-start items-center overflow-auto whitespace-nowrap"><div id="cdn-font-face" style={{fontFamily:"Noto Sans KR"}} className="font-face text-[16px] tlg:text-[14px] tmd:text-[12px] text-theme-9">{font.cdn_font_face}</div></div>
                                                <div className="absolute z-10 right-[20px] tlg:right-[16px] tmd:right-[12px] top-[36px] tlg:top-[30px] tmd:top-[24px] translate-y-[-50%] cursor-pointer">
                                                    <svg onClick={copyOnClick} className="copy_btn w-[32px] tmd:w-[28px] p-[8px] rounded-[6px] hover:bg-theme-yellow/10 tlg:hover:bg-transparent hover:dark:bg-theme-blue-1/10 tlg:hover:dark:bg-transparent fill-theme-9 hover:fill-theme-yellow tlg:hover:fill-theme-9 dark:fill-theme-7 hover:dark:fill-theme-blue-1 tlg:hover:dark:fill-theme-7" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z"/><path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z"/></svg>
                                                    <svg className="copy_chk_btn w-[32px] tmd:w-[28px] p-[8px] rounded-[6px] bg-theme-yellow/10 dark:bg-theme-blue-1/10 fill-theme-yellow dark:fill-theme-blue-1 hidden" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/></svg>
                                                </div>
                                            </div>
                                        )
                                    )
                                }
                            </div>
                        </div>
                    </>
                }
                <div className="max-w-[100%] w-content flex flex-col justify-start items-start mb-[60px] tlg:mb-[48px] tmd:mb-[40px]">
                    <h2 className="text-[24px] tlg:text-[20px] tmd:text-[18px] text-theme-3 dark:text-theme-9 font-medium mb-[20px] tlg:mb-[16px] tmd:mb-[14px]">폰트 미리보기</h2>
                    <div className="w-[100%] px-[16px] py-[8px] mb-[20px] tlg:mb-[16px] border-b border-theme-7 dark:border-theme-4">
                        <textarea onChange={handleFontWeightChange} onInput={handleHeightChange} placeholder="원하는 문구를 적어보세요..." className="w-[100%] h-[18px] resize-none text-[14px] text-theme-5 dark:text-theme-8 placeholder-theme-5 dark:placeholder-theme-6 leading-tight bg-transparent"/>
                    </div>
                    <div className="font-preview-wrap max-w-[100%] overflow-hidden rounded-[12px] p-[32px] pb-[16px] tlg:p-[20px] tlg:pt-[28px] tlg:pb-[14px] bg-theme-4 dark:bg-theme-blue-2">
                        <div className="w-[100%] flex flex-row flex-wrap justify-start items-center">
                            <div className="flex flex-col justify-center items-start mr-[60px] tlg:mr-[40px] mb-[20px] tlg:mb-[16px]">
                                <p className="text-[16px] tlg:text-[14px] text-normal leading-none mb-[12px] tlg:mb-[2px] text-theme-9">
                                    폰트 크기<span className="text-[13px] tlg:text-[11px] text-theme-7 ml-[8px]">Font Size</span>
                                </p>
                                <div className="w-[280px] tlg:w-[200px] mx-[34px] relative">
                                    <Slider
                                        className="font-size-slider"
                                        aria-label="font-size-slider"
                                        aria-valuetext="px"
                                        valueLabelDisplay="auto"
                                        valueLabelFormat={fnAddUnit}
                                        onChange={(e, v) => setFontSize(Number(v))}
                                        defaultValue={20}
                                        min={12}
                                        max={64}
                                    />
                                    <div className="absolute left-[-34px] top-[50%] translate-y-[-70%] text-[12px] text-theme-9">12px</div>
                                    <div className="absolute right-[-34px] top-[50%] translate-y-[-70%] text-[12px] text-theme-9">64px</div>
                                </div>
                            </div>
                            <div className="flex flex-col justify-center items-start mr-[60px] tlg:mr-[40px] mb-[20px] tlg:mb-[16px]">
                                <p className="text-[16px] tlg:text-[14px] text-normal leading-none mb-[12px] tlg:mb-[2px] text-theme-9">
                                    행간<span className="text-[13px] tlg:text-[11px] text-theme-7 ml-[8px]">Line Height</span>
                                </p>
                                <div className="w-[280px] tlg:w-[200px] mx-[20px] relative">
                                    <Slider
                                        className="font-size-slider"
                                        aria-label="font-size-slider"
                                        valueLabelDisplay="auto"
                                        valueLabelFormat={fnLineheightValue}
                                        onChange={(e, v) => setLineHeight(Number(v)/10)}
                                        defaultValue={12}
                                        min={10}
                                        max={20}
                                    />
                                    <div className="absolute left-[-18px] top-[50%] translate-y-[-70%] text-[12px] text-theme-9">1</div>
                                    <div className="absolute right-[-18px] top-[50%] translate-y-[-70%] text-[12px] text-theme-9">2</div>
                                </div>
                            </div>
                            <div className="flex flex-col justify-center items-start mr-[60px] tlg:mr-[40px] mb-[20px] tlg:mb-[16px]">
                                <p className="text-[16px] tlg:text-[14px] text-normal leading-none mb-[12px] tlg:mb-[2px] text-theme-9">
                                    자간<span className="text-[13px] tlg:text-[11px] text-theme-7 ml-[8px]">Letter Spacing</span>
                                </p>
                                <div className="w-[280px] tlg:w-[200px] ml-[48px] relative">
                                    <Slider
                                        className="font-size-slider"
                                        aria-label="font-size-slider"
                                        valueLabelDisplay="auto"
                                        valueLabelFormat={fnLetterSpacingValue}
                                        onChange={(e, v) => setLetterSpacing(Number(v)/10)}
                                        defaultValue={0}
                                        min={-5}
                                        max={10}
                                    />
                                    <div className="absolute left-[-48px] top-[50%] translate-y-[-70%] text-[12px] text-theme-9">-0.5em</div>
                                    <div className="absolute right-[-32px] top-[50%] translate-y-[-70%] text-[12px] text-theme-9">1em</div>
                                </div>
                            </div>
                        </div>
                        <div className="w-[100%] h-px mb-[36px] tlg:mb-[28px] bg-theme-5"></div>
                        {
                            font.font_weight[0] === "Y"
                            ? <>
                                <div className="text-[14px] tlg:text-[11px] text-theme-7 leading-none mb-[12px]">Thin 100</div>
                                <pre style={{fontFamily:'"'+font.font_family+'"', fontSize:fontSize, lineHeight:lineHeight, letterSpacing:letterSpacing+"em", fontWeight:"100"}} className="font-preview w-[100%] text-theme-9 pb-[16px] tlg:pb-[14px] mb-[20px] tlg:mb-[16px]"><DummyText lang={font.lang} text={text} num={params.randomNum}/></pre>
                            </>
                            : <></>
                        }
                        {
                            font.font_weight[1] === "Y"
                            ? <>
                                <div className="text-[14px] tlg:text-[11px] text-theme-7 leading-none mb-[12px]">ExtraLight 200</div>
                                <pre style={{fontFamily:'"'+font.font_family+'"', fontSize:fontSize, lineHeight:lineHeight, letterSpacing:letterSpacing+"em", fontWeight:"200"}} className="font-preview w-[100%] text-theme-9 pb-[16px] tlg:pb-[14px] mb-[20px] tlg:mb-[16px]"><DummyText lang={font.lang} text={text} num={params.randomNum}/></pre>
                            </>
                            : <></>
                        }
                        {
                            font.font_weight[2] === "Y"
                            ? <>
                                <div className="text-[14px] tlg:text-[11px] text-theme-7 leading-none mb-[12px]">Light 300</div>
                                <pre style={{fontFamily:'"'+font.font_family+'"', fontSize:fontSize, lineHeight:lineHeight, letterSpacing:letterSpacing+"em", fontWeight:"300"}} className="font-preview w-[100%] text-theme-9 pb-[16px] tlg:pb-[14px] mb-[20px] tlg:mb-[16px]"><DummyText lang={font.lang} text={text} num={params.randomNum}/></pre>
                            </>
                            : <></>
                        }
                        {
                            font.font_weight[3] === "Y"
                            ? <>
                                <div className="text-[14px] tlg:text-[11px] text-theme-7 leading-none mb-[12px]">Regular 400</div>
                                <pre style={{fontFamily:'"'+font.font_family+'"', fontSize:fontSize, lineHeight:lineHeight, letterSpacing:letterSpacing+"em", fontWeight:"400"}} className="font-preview w-[100%] text-theme-9 pb-[16px] tlg:pb-[14px] mb-[20px] tlg:mb-[16px]"><DummyText lang={font.lang} text={text} num={params.randomNum}/></pre>
                            </>
                            : <></>
                        }
                        {
                            font.font_weight[4] === "Y"
                            ? <>
                                <div className="text-[14px] tlg:text-[11px] text-theme-7 leading-none mb-[12px]">Medium 500</div>
                                <pre style={{fontFamily:'"'+font.font_family+'"', fontSize:fontSize, lineHeight:lineHeight, letterSpacing:letterSpacing+"em", fontWeight:"500"}} className="font-preview w-[100%] text-theme-9 pb-[16px] tlg:pb-[14px] mb-[20px] tlg:mb-[16px]"><DummyText lang={font.lang} text={text} num={params.randomNum}/></pre>
                            </>
                            : <></>
                        }
                        {
                            font.font_weight[5] === "Y"
                            ? <>
                                <div className="text-[14px] tlg:text-[11px] text-theme-7 leading-none mb-[12px]">SemiBold 600</div>
                                <pre style={{fontFamily:'"'+font.font_family+'"', fontSize:fontSize, lineHeight:lineHeight, letterSpacing:letterSpacing+"em", fontWeight:"600"}} className="font-preview w-[100%] text-theme-9 pb-[16px] tlg:pb-[14px] mb-[20px] tlg:mb-[16px]"><DummyText lang={font.lang} text={text} num={params.randomNum}/></pre>
                            </>
                            : <></>
                        }
                        {
                            font.font_weight[6] === "Y"
                            ? <>
                                <div className="text-[14px] tlg:text-[11px] text-theme-7 leading-none mb-[12px]">Bold 700</div>
                                <pre style={{fontFamily:'"'+font.font_family+'"', fontSize:fontSize, lineHeight:lineHeight, letterSpacing:letterSpacing+"em", fontWeight:"700"}} className="font-preview w-[100%] text-theme-9 pb-[16px] tlg:pb-[14px] mb-[20px] tlg:mb-[16px]"><DummyText lang={font.lang} text={text} num={params.randomNum}/></pre>
                            </>
                            : <></>
                        }
                        {
                            font.font_weight[7] === "Y"
                            ? <>
                                <div className="text-[14px] tlg:text-[11px] text-theme-7 leading-none mb-[12px]">Heavy 800</div>
                                <pre style={{fontFamily:'"'+font.font_family+'"', fontSize:fontSize, lineHeight:lineHeight, letterSpacing:letterSpacing+"em", fontWeight:"800"}} className="font-preview w-[100%] text-theme-9 pb-[16px] tlg:pb-[14px] mb-[20px] tlg:mb-[16px]"><DummyText lang={font.lang} text={text} num={params.randomNum}/></pre>
                            </>
                            : <></>
                        }
                        {
                            font.font_weight[8] === "Y"
                            ? <>
                                <div className="text-[14px] tmd:text-[12px] text-theme-7 leading-none mb-[12px]">Black 900</div>
                                <pre style={{fontFamily:'"'+font.font_family+'"', fontSize:fontSize, lineHeight:lineHeight, letterSpacing:letterSpacing+"em", fontWeight:"900"}} className="font-preview w-[100%] text-theme-9 pb-[16px] tlg:pb-[14px] mb-[20px] tlg:mb-[16px]"><DummyText lang={font.lang} text={text} num={params.randomNum}/></pre>
                            </>
                            : <></>
                        }
                    </div>
                </div>
                <div>
                    <h2 className="text-[24px] tlg:text-[20px] tmd:text-[18px] text-theme-3 dark:text-theme-9 font-medium mb-[20px] tlg:mb-[16px] tmd:mb-[14px]">라이센스 사용 범위</h2>
                    <div className="w-[100%] flex flex-row tlg:flex-col justify-between items-start">
                        <table className="tlg:w-[100%] tlg:mb-[16px] tmd:mb-[12px] text-left rounded-[12px] border border-theme-7 dark:border-theme-5">
                            <thead className="h-[44px] border-b border-theme-7 dark:border-theme-5">
                                <tr className="text-[16px] tlg:text-[14px] tmd:text-[12px] text-theme-3 dark:text-theme-9 font-medium">
                                    <th className="w-[120px] tlg:w-[100px] tmd:w-[80px] pl-[20px] tlg:pl-[16px] tmd:pl-[12px]">카테고리</th>
                                    <th className="w-[450px] tlg:w-[auto]">사용 범위</th>
                                    <th className="w-[100px] tmd:w-[80px] pr-[20px] tlg:pr-[16px] tmd:pr-[12px] text-right">허용 여부</th>
                                </tr>
                            </thead>
                            <tbody className="text-[16px] tlg:text-[14px] tmd:text-[12px] leading-tight text-theme-5 dark:text-theme-7 fill-theme-5 dark:fill-theme-7 text-left font-normal">
                                <tr className="h-[44px] border-b border-theme-7 dark:border-theme-5">
                                    <td className="pl-[20px] tlg:pl-[16px] tmd:pl-[12px]">인쇄</td>
                                    <td>
                                        {
                                            font.license_print === "Y"
                                            ? <span>브로슈어, 포스터, 책, 잡지 및 출판용 인쇄물 등</span>
                                            : <span className="text-theme-red/80 line-through">브로슈어, 포스터, 책, 잡지 및 출판용 인쇄물 등</span>
                                        }
                                    </td>
                                    <td className="h-[44px] pr-[20px] tlg:pr-[16px] tmd:pr-[12px] flex flex-row justify-end items-center">
                                        {
                                            font.license_print === "Y"
                                            ? <svg className="w-[12px]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/></svg>
                                            : ( font.license_print === "H"
                                                ? <svg className="w-[12px] fill-theme-red/80" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M7.938 2.016A.13.13 0 0 1 8.002 2a.13.13 0 0 1 .063.016.146.146 0 0 1 .054.057l6.857 11.667c.036.06.035.124.002.183a.163.163 0 0 1-.054.06.116.116 0 0 1-.066.017H1.146a.115.115 0 0 1-.066-.017.163.163 0 0 1-.054-.06.176.176 0 0 1 .002-.183L7.884 2.073a.147.147 0 0 1 .054-.057zm1.044-.45a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566z"/></svg>
                                                : ( font.license_print === "N"
                                                    ? <svg className="w-[20px] translate-x-[4px] fill-theme-red/80" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/></svg>
                                                    : <></>
                                                )
                                            )
                                        }
                                    </td>
                                </tr>
                                <tr className="h-[44px] border-b border-theme-7 dark:border-theme-5">
                                    <td className="pl-[20px] tlg:pl-[16px] tmd:pl-[12px]">웹사이트</td>
                                    <td>
                                        {
                                            font.license_web === "Y"
                                            ? <span>웹페이지, 광고 배너, 메일, E-브로슈어 등</span>
                                            : <span className="text-theme-red/80 line-through">웹페이지, 광고 배너, 메일, E-브로슈어 등</span>
                                        }
                                    </td>
                                    <td className="h-[44px] pr-[20px] tlg:pr-[16px] tmd:pr-[12px] flex flex-row justify-end items-center">
                                        {
                                            font.license_web === "Y"
                                            ? <svg className="w-[12px]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/></svg>
                                            : ( font.license_web === "H"
                                                ? <svg className="w-[12px] fill-theme-red/80" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M7.938 2.016A.13.13 0 0 1 8.002 2a.13.13 0 0 1 .063.016.146.146 0 0 1 .054.057l6.857 11.667c.036.06.035.124.002.183a.163.163 0 0 1-.054.06.116.116 0 0 1-.066.017H1.146a.115.115 0 0 1-.066-.017.163.163 0 0 1-.054-.06.176.176 0 0 1 .002-.183L7.884 2.073a.147.147 0 0 1 .054-.057zm1.044-.45a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566z"/></svg>
                                                : ( font.license_web === "N"
                                                    ? <svg className="w-[20px] translate-x-[4px] fill-theme-red/80" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/></svg>
                                                    : <></>
                                                )
                                            )
                                        }
                                    </td>
                                </tr>
                                <tr className="h-[44px] border-b border-theme-7 dark:border-theme-5">
                                    <td className="pl-[20px] tlg:pl-[16px] tmd:pl-[12px]">영상</td>
                                    <td>
                                        {
                                            font.license_video === "Y"
                                            ? <span>영상물 자막, 영화 오프닝/엔딩 크레딧, UCC 등</span>
                                            : <span className="text-theme-red/80 line-through">영상물 자막, 영화 오프닝/엔딩 크레딧, UCC 등</span>
                                        }
                                    </td>
                                    <td className="h-[44px] pr-[20px] tlg:pr-[16px] tmd:pr-[12px] flex flex-row justify-end items-center">
                                        {
                                            font.license_video === "Y"
                                            ? <svg className="w-[12px]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/></svg>
                                            : ( font.license_video === "H"
                                                ? <svg className="w-[12px] fill-theme-red/80" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M7.938 2.016A.13.13 0 0 1 8.002 2a.13.13 0 0 1 .063.016.146.146 0 0 1 .054.057l6.857 11.667c.036.06.035.124.002.183a.163.163 0 0 1-.054.06.116.116 0 0 1-.066.017H1.146a.115.115 0 0 1-.066-.017.163.163 0 0 1-.054-.06.176.176 0 0 1 .002-.183L7.884 2.073a.147.147 0 0 1 .054-.057zm1.044-.45a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566z"/></svg>
                                                : ( font.license_video === "N"
                                                    ? <svg className="w-[20px] translate-x-[4px] fill-theme-red/80" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/></svg>
                                                    : <></>
                                                )
                                            )
                                        }
                                    </td>
                                </tr>
                                <tr className="h-[44px] border-b border-theme-7 dark:border-theme-5">
                                    <td className="pl-[20px] tlg:pl-[16px] tmd:pl-[12px]">포장지</td>
                                    <td>
                                        {
                                            font.license_package === "Y"
                                            ? <span>판매용 상품의 패키지</span>
                                            : <span className="text-theme-red/80 line-through">판매용 상품의 패키지</span>
                                        }
                                    </td>
                                    <td className="h-[44px] pr-[20px] tlg:pr-[16px] tmd:pr-[12px] flex flex-row justify-end items-center">
                                        {
                                            font.license_package === "Y"
                                            ? <svg className="w-[12px]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/></svg>
                                            : ( font.license_package === "H"
                                                ? <svg className="w-[12px] fill-theme-red/80" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M7.938 2.016A.13.13 0 0 1 8.002 2a.13.13 0 0 1 .063.016.146.146 0 0 1 .054.057l6.857 11.667c.036.06.035.124.002.183a.163.163 0 0 1-.054.06.116.116 0 0 1-.066.017H1.146a.115.115 0 0 1-.066-.017.163.163 0 0 1-.054-.06.176.176 0 0 1 .002-.183L7.884 2.073a.147.147 0 0 1 .054-.057zm1.044-.45a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566z"/></svg>
                                                : ( font.license_package === "N"
                                                    ? <svg className="w-[20px] translate-x-[4px] fill-theme-red/80" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/></svg>
                                                    : <></>
                                                )
                                            )
                                        }
                                    </td>
                                </tr>
                                <tr className="h-[44px] border-b border-theme-7 dark:border-theme-5">
                                    <td className="pl-[20px] tlg:pl-[16px] tmd:pl-[12px]">임베딩</td>
                                    <td>
                                        {
                                            font.license_embed === "Y"
                                            ? <span>웹사이트 및 프로그램 서버 내 폰트 탑재, E-book 제작</span>
                                            : <span className="text-theme-red/80 line-through">웹사이트 및 프로그램 서버 내 폰트 탑재, E-book 제작</span>
                                        }
                                    </td>
                                    <td className="h-[44px] pr-[20px] tlg:pr-[16px] tmd:pr-[12px] flex flex-row justify-end items-center">
                                        {
                                            font.license_embed === "Y"
                                            ? <svg className="w-[12px]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/></svg>
                                            : ( font.license_embed === "H"
                                                ? <svg className="w-[12px] fill-theme-red/80" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M7.938 2.016A.13.13 0 0 1 8.002 2a.13.13 0 0 1 .063.016.146.146 0 0 1 .054.057l6.857 11.667c.036.06.035.124.002.183a.163.163 0 0 1-.054.06.116.116 0 0 1-.066.017H1.146a.115.115 0 0 1-.066-.017.163.163 0 0 1-.054-.06.176.176 0 0 1 .002-.183L7.884 2.073a.147.147 0 0 1 .054-.057zm1.044-.45a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566z"/></svg>
                                                : ( font.license_embed === "N"
                                                    ? <svg className="w-[20px] translate-x-[4px] fill-theme-red/80" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/></svg>
                                                    : <></>
                                                )
                                            )
                                        }
                                    </td>
                                </tr>
                                <tr className="h-[44px] border-b border-theme-7 dark:border-theme-5">
                                    <td className="pl-[20px] tlg:pl-[16px] tmd:pl-[12px]">BI/CI</td>
                                    <td>
                                        {
                                            font.license_bici === "Y"
                                            ? <span>회사명, 브랜드명, 상품명, 로고, 마크, 슬로건, 캐치프레이즈</span>
                                            : <span className="text-theme-red/80 line-through">회사명, 브랜드명, 상품명, 로고, 마크, 슬로건, 캐치프레이즈</span>
                                        }
                                    </td>
                                    <td className="h-[44px] pr-[20px] tlg:pr-[16px] tmd:pr-[12px] flex flex-row justify-end items-center">
                                        {
                                            font.license_bici === "Y"
                                            ? <svg className="w-[12px]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/></svg>
                                            : ( font.license_bici === "H"
                                                ? <svg className="w-[12px] fill-theme-red/80" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M7.938 2.016A.13.13 0 0 1 8.002 2a.13.13 0 0 1 .063.016.146.146 0 0 1 .054.057l6.857 11.667c.036.06.035.124.002.183a.163.163 0 0 1-.054.06.116.116 0 0 1-.066.017H1.146a.115.115 0 0 1-.066-.017.163.163 0 0 1-.054-.06.176.176 0 0 1 .002-.183L7.884 2.073a.147.147 0 0 1 .054-.057zm1.044-.45a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566z"/></svg>
                                                : ( font.license_bici === "N"
                                                    ? <svg className="w-[20px] translate-x-[4px] fill-theme-red/80" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/></svg>
                                                    : <></>
                                                )
                                            )
                                        }
                                    </td>
                                </tr>
                                <tr className="h-[44px] border-b border-theme-7 dark:border-theme-5">
                                    <td className="pl-[20px] tlg:pl-[16px] tmd:pl-[12px]">OFL</td>
                                    <td>
                                        {
                                            font.license_ofl === "Y"
                                            ? <span>폰트 파일의 수정/ 복제/ 배포 가능. 단, 폰트 파일의 유료 판매는 금지</span>
                                            : <span className="text-theme-red/80 line-through">폰트 파일의 수정/ 복제/ 배포/ 유료 판매 금지</span>
                                        }
                                    </td>
                                    <td className="h-[44px] pr-[20px] tlg:pr-[16px] tmd:pr-[12px] flex flex-row justify-end items-center">
                                        {
                                            font.license_ofl === "Y"
                                            ? <svg className="w-[12px]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/></svg>
                                            : <svg className="w-[20px] translate-x-[4px] fill-theme-red/80" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/></svg>
                                        }
                                    </td>
                                </tr>
                                <tr className="h-[44px] border-b border-theme-7 dark:border-theme-5">
                                    <td className="pl-[20px] tlg:pl-[16px] tmd:pl-[12px]">용도</td>
                                    <td>
                                        {
                                            font.license_purpose === "Y"
                                            ? <span>개인적, 상업적 용도 모두 사용 가능</span>
                                            : <span className="text-theme-red/80 line-through">개인적 용도 사용 가능, 상업적 용도 사용 금지</span>
                                        }
                                    </td>
                                    <td className="h-[44px] pr-[20px] tlg:pr-[16px] tmd:pr-[12px] flex flex-row justify-end items-center">
                                        {
                                            font.license_purpose === "Y"
                                            ? <svg className="w-[12px]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/></svg>
                                            : <svg className="w-[12px] fill-theme-red/80" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M7.938 2.016A.13.13 0 0 1 8.002 2a.13.13 0 0 1 .063.016.146.146 0 0 1 .054.057l6.857 11.667c.036.06.035.124.002.183a.163.163 0 0 1-.054.06.116.116 0 0 1-.066.017H1.146a.115.115 0 0 1-.066-.017.163.163 0 0 1-.054-.06.176.176 0 0 1 .002-.183L7.884 2.073a.147.147 0 0 1 .054-.057zm1.044-.45a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566z"/></svg>
                                        }
                                    </td>
                                </tr>
                                <tr className="h-[44px]">
                                    <td className="pl-[20px] tlg:pl-[16px] tmd:pl-[12px]">출처</td>
                                    <td>출처 표시</td>
                                    <td className="h-[44px] pr-[20px] tlg:pr-[16px] tmd:pr-[12px] flex flex-row justify-end items-center">
                                        {
                                            font.license_source === "Y"
                                            ? <svg className="w-[12px]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/></svg>
                                            : <span>권장</span>
                                        }
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <div className="w-[calc(100%-690px)] tlg:w-[100%] h-[450px] tlg:h-[auto] border border-theme-7 dark:border-theme-5">
                            <h2 className="h-[44px] flex flex-row justify-start items-center text-[16px] tlg:text-[14px] tmd:text-[12px] text-theme-3 dark:text-theme-9 border-b border-theme-7 dark:border-theme-5 font-medium leading-none pl-[20px] tlg:pl-[16px] tmd:pl-[12px]">라이센스 본문</h2>
                            <div className="license-wrap w-[100%] h-[404px] tlg:h-[auto] overflow-y-auto px-[20px] tlg:px-[16px] tmd:px-[12px] py-[8px]">
                                <div id="license" className="text-[16px] tlg:text-[14px] tmd:text-[12px] text-theme-5 dark:text-theme-7 leading-loose"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

// getStaticProps
// export async function getStaticPaths() {
//     try {
//         const fonts = await FetchFont();

//         const paths = fonts.map((font: any) => ({
//             params: { fontId: font.code.toString() },
//         }));

//         return { paths, fallback: false }
//     } catch (error) {
//         console.log(error);
//     }
// }

// export async function getStaticProps(ctx: any) {
//     try {
//         const fonts = await FetchFontDetail(ctx.params.fontId);
//         const randomNum: number = Math.floor(Math.random() * 19);

//         return {
//             props: {
//                 fonts: fonts,
//                 randomNum: randomNum,
//                 initFontSize: 20,
//                 initLineHeight: 1.2,
//                 initLetterSpacing: 0
//             }
//         }
//     } catch (error) {
//         console.log(error);
//     }
// }

export async function getServerSideProps(ctx: any) {
    try {
        // 폰트 정보 불러오기
        const fonts = await FetchFontDetail(ctx.params.fontId);

        // 랜덤 넘버
        const randomNum: number = Math.floor(Math.random() * 19);

        // 쿠키
        const cookieTheme = ctx.req.cookies.theme === undefined ? "dark" : ctx.req.cookies.theme;

        // 디바이스 체크
        const userAgent = ctx.req ? ctx.req.headers['user-agent'] : navigator.userAgent;

        // 쿠키에 저장된 세션ID가 유효하면, 유저 정보 가져오기
        const user = ctx.req.cookies.session === undefined ? null : (
            await CheckIfSessionExists(ctx.req.cookies.session) === true 
            ? await FetchUserInfo(ctx.req.cookies.session)
            : null
        )

        return {
            props: {
                params: {
                    fonts: fonts,
                    randomNum: randomNum,
                    theme: cookieTheme,
                    userAgent: userAgent,
                    user: user,
                }
            }
        }
    } catch (error) {
        console.log(error);
    }
}

export default DetailPage;