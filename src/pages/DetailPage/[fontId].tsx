// 훅
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import client from "@/libs/client";
import { isMacOs } from "react-device-detect";

// 컴포넌트
import Tooltip from "@/components/tooltip";
import FontSearch from "@/components/fontsearch";
import DummyText from "@/components/dummytext";

const alphabetKR = '가 나 다 라 마 바 사 아 자 차 카 타 파 하 a b c d e f g h i j k l m n o p q r s t u v w x y z 0 1 2 3 4 5 6 7 8 9 가 나 다 라 마 바 사 아 자 차 카 타 파 하 a b c d e f g h i j k l m n o p q r s t u v w x y z 0 1 2 3 4 5 6 7 8 9 가 나 다 라 마 바 사 아 자 차 카 타 파 하 a b c d e f g h i j k l m n o p q r s t u v w x y z 0 1 2 3 4 5 6 7 8 9';
const alphabetEN = 'A B C D E F G H I J K L M N O P Q R S T U V W X Y Z a b c d e f g h i j k l m n o p q r s t u v w x y z 0 1 2 3 4 5 6 7 8 9 A B C D E F G H I J K L M N O P Q R S T U V W X Y Z a b c d e f g h i j k l m n o p q r s t u v w x y z 0 1 2 3 4 5 6 7 8 9 A B C D E F G H I J K L M N O P Q R S T U V W X Y Z a b c d e f g h i j k l m n o p q r s t u v w x y z 0 1 2 3 4 5 6 7 8 9';

function DetailPage({fontInfo, randomNum}:{fontInfo: any, randomNum: number}) {
    /** useRouter 훅 */
    const router = useRouter();

    /** 폰트 데이터 props */
    const font = fontInfo[0];

    /** 타이틀 변경 */
    useEffect(() => {
        document.title = font.name + " · FONTS ARCHIVE"
    }, [font]);
    
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

    /** 키값 변경 */
    const [isMac, setIsMac] = useState<boolean | undefined>(undefined);
    useEffect(() => {
        if (isMacOs) { setIsMac(true) }
        else { setIsMac(false); }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isMacOs]);

    /** 웹 폰트 적용하기 훅 */
    const defaultWebFont = "CSS";
    const [webFont, setWebFont] = useState(defaultWebFont);
    useEffect(() => {
        setWebFont(defaultWebFont);
    },[defaultWebFont]);

    /** 웹 폰트 클릭 시 코드 변경 */
    const handleWebFont = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.value === "CSS") { setWebFont("CSS"); }
        else if (e.target.value === "link") { setWebFont("link"); }
        else if (e.target.value === "import") { setWebFont("import"); }
        else { setWebFont("font-face"); }
    }

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

    /** 폰트 두께 텍스트 체인지 이벤트 */
    const defaultText = "";
    const [text, setText] = useState(defaultText);
    useEffect(() => {
        setText(defaultText);
    }, [defaultText])
    const handleFontWeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setText(e.target.value);
    }

    return (
        <>
            {/* 고정 메뉴 */}
            <Tooltip/>

            {/* 헤더 */}
            <div className='interface w-[100%] h-[60px] tlg:h-auto px-[20px] tlg:px-0 fixed right-0 top-0 z-10 flex flex-row tlg:flex-col justify-between tlg:justify-center items-center tlg:items-start backdrop-blur bg-blur-theme border-b border-dark-theme-4'>
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
                                isMac === true
                                ? <div className="flex flex-row justify-center items-center">
                                    <svg className="w-[10px] mt-px fill-dark-theme-8 mr-px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M3.5 2A1.5 1.5 0 0 1 5 3.5V5H3.5a1.5 1.5 0 1 1 0-3zM6 5V3.5A2.5 2.5 0 1 0 3.5 6H5v4H3.5A2.5 2.5 0 1 0 6 12.5V11h4v1.5a2.5 2.5 0 1 0 2.5-2.5H11V6h1.5A2.5 2.5 0 1 0 10 3.5V5H6zm4 1v4H6V6h4zm1-1V3.5A1.5 1.5 0 1 1 12.5 5H11zm0 6h1.5a1.5 1.5 0 1 1-1.5 1.5V11zm-6 0v1.5A1.5 1.5 0 1 1 3.5 11H5z"/></svg>
                                    <span className="text-[12px] leading-none">K</span>
                                </div>
                                : ( isMac === false
                                    ? <span className="tmd:hidden text-[12px] tlg:text-[10px] leading-none">Ctrl + K</span>
                                    : <></>
                                )
                            }
                        </div>
                    </button>
                </div>
            </div>

            {/* 메인 */}
            <div className="w-[100%] mt-[60px] p-[20px] py-[20px]">
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
                <div className="flex flex-col justify-start items-start mb-[60px]">
                    <h2 className="text-[24px] text-dark-theme-8 font-medium mb-[20px]">웹 폰트 사용하기</h2>
                    <div className="cdn w-[1000px] h-[60px] overflow-hidden border-x border-t border-b border-dark-theme-4 rounded-t-[8px] flex flex-row justify-start items-center">
                        <input onChange={handleWebFont} type="radio" id="cdn_css" name="cdn" value="CSS" className="hidden" defaultChecked/>
                        <label htmlFor="cdn_css" className="w-[25%] h-[100%] border-r border-dark-theme-4 flex flex-row justify-center items-center text-[16px] text-dark-theme-8 leading-none cursor-pointer">CSS 설정하기</label>
                        <input onChange={handleWebFont} type="radio" id="cdn_link" name="cdn" value="link" className="hidden"/>
                        <label htmlFor="cdn_link" className="w-[25%] h-[100%] border-r border-dark-theme-4 flex flex-row justify-center items-center text-[16px] text-dark-theme-8 leading-none cursor-pointer">link 방식</label>
                        <input onChange={handleWebFont} type="radio" id="cdn_import" name="cdn" value="import" className="hidden"/>
                        <label htmlFor="cdn_import" className="w-[25%] h-[100%] border-r border-dark-theme-4 flex flex-row justify-center items-center text-[16px] text-dark-theme-8 leading-none cursor-pointer">import 방식</label>
                        <input onChange={handleWebFont} type="radio" id="cdn_font_face" name="cdn" value="font-face" className="hidden"/>
                        <label htmlFor="cdn_font_face" className="w-[25%] h-[100%] flex flex-row justify-center items-center text-[16px] text-dark-theme-8 leading-none cursor-pointer">font-face 방식</label>
                    </div>
                    <div className="w-[1000px] border-x border-b rounded-b-[8px] border-dark-theme-4 bg-dark-theme-3">
                        {
                            webFont === "CSS"
                            ? <div className="w-[100%] relative pl-[32px] pr-[66px] overflow-hidden">
                                <div className="cdn_pre w-[100%] h-[72px] flex flex-row justify-start items-center overflow-x-auto"><pre style={{fontFamily:"Noto Sans KR"}} className="text-[16px] text-dark-theme-8">{font.cdn_css}</pre></div>
                                <div className="absolute z-10 right-[20px] top-[50%] translate-y-[-50%] cursor-pointer">
                                    <svg onClick={copyOnClick} className="copy_btn w-[32px] p-[8px] fill-dark-theme-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z"/><path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z"/></svg>
                                    <svg className="copy_chk_btn w-[32px] p-[8px] fill-dark-theme-6 hidden" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/></svg>
                                </div>
                            </div>
                            : ( webFont === "link"
                                ? <div className="w-[100%] relative pl-[32px] pr-[66px] overflow-hidden">
                                    <div className="cdn_pre w-[100%] h-[72px] flex flex-row justify-start items-center overflow-x-auto"><pre style={{fontFamily:"Noto Sans KR"}} className="text-[16px] text-dark-theme-8">{font.cdn_link}</pre></div>
                                    <div className="absolute z-10 right-[20px] top-[50%] translate-y-[-50%] cursor-pointer">
                                        <svg onClick={copyOnClick} className="copy_btn w-[32px] p-[8px] fill-dark-theme-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z"/><path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z"/></svg>
                                        <svg className="copy_chk_btn w-[32px] p-[8px] fill-dark-theme-6 hidden" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/></svg>
                                    </div>
                                </div>
                                : ( webFont === "import"
                                    ? <div className="w-[100%] relative pl-[32px] pr-[66px] overflow-hidden">
                                        <div className="cdn_pre w-[100%] h-[72px] flex flex-row justify-start items-center overflow-x-auto"><pre style={{fontFamily:"Noto Sans KR"}} className="text-[16px] text-dark-theme-8">{font.cdn_import}</pre></div>
                                        <div className="absolute z-10 right-[20px] top-[50%] translate-y-[-50%] cursor-pointer">
                                            <svg onClick={copyOnClick} className="copy_btn w-[32px] p-[8px] fill-dark-theme-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z"/><path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z"/></svg>
                                            <svg className="copy_chk_btn w-[32px] p-[8px] fill-dark-theme-6 hidden" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/></svg>
                                        </div>
                                    </div>
                                    : <div className="w-[100%] relative pl-[32px] pr-[66px] overflow-hidden">
                                        <div className="cdn_pre w-[100%] h-[auto] py-[24px] flex flex-row justify-start items-center overflow-x-auto"><pre style={{fontFamily:"Noto Sans KR"}} className="font-face text-[16px] text-dark-theme-8">{font.cdn_font_face}</pre></div>
                                        <div className="absolute z-10 right-[20px] top-[50%] translate-y-[-50%] cursor-pointer">
                                            <svg onClick={copyOnClick} className="copy_btn w-[32px] p-[8px] fill-dark-theme-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z"/><path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z"/></svg>
                                            <svg className="copy_chk_btn w-[32px] p-[8px] fill-dark-theme-6 hidden" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/></svg>
                                        </div>
                                    </div>
                                )
                            )
                        }
                    </div>
                </div>
                <div className="font-weight-wrap flex flex-col justify-start items-start mb-[60px]">
                    <h2 className="text-[24px] text-dark-theme-8 font-medium mb-[20px]">폰트 두께</h2>
                    <input onChange={handleFontWeightChange} type="text" placeholder="Type something..." className="w-[100%] h-[50px] text-[14px] text-dark-theme-8 leading-none px-[24px] pb-px mb-[32px] border border-dark-theme-4 rounded-full bg-transparent"/>
                    {
                        font.font_weight[0] === "Y"
                        ? <>
                            <div className="text-[14px] text-dark-theme-8 leading-none mb-[16px]">Thin 100</div>
                            <div style={{fontFamily:font.font_family, fontWeight:"100"}} className="font-weight w-[100%] text-[20px] text-dark-theme-8 pb-[16px] mb-[32px] border-b border-dark-theme-4"><DummyText lang={font.lang} text={text} randomNum={randomNum}/></div>
                        </>
                        : <></>
                    }
                    {
                        font.font_weight[1] === "Y"
                        ? <>
                            <div className="text-[14px] text-dark-theme-8 leading-none mb-[16px]">ExtraLight 200</div>
                            <div style={{fontFamily:font.font_family, fontWeight:"200"}} className="font-weight w-[100%] text-[20px] text-dark-theme-8 pb-[16px] mb-[32px] border-b border-dark-theme-4"><DummyText lang={font.lang} text={text} randomNum={randomNum}/></div>
                        </>
                        : <></>
                    }
                    {
                        font.font_weight[2] === "Y"
                        ? <>
                            <div className="text-[14px] text-dark-theme-8 leading-none mb-[16px]">Light 300</div>
                            <div style={{fontFamily:font.font_family, fontWeight:"300"}} className="font-weight w-[100%] text-[20px] text-dark-theme-8 pb-[16px] mb-[32px] border-b border-dark-theme-4"><DummyText lang={font.lang} text={text} randomNum={randomNum}/></div>
                        </>
                        : <></>
                    }
                    {
                        font.font_weight[3] === "Y"
                        ? <>
                            <div className="text-[14px] text-dark-theme-8 leading-none mb-[16px]">Regular 400</div>
                            <div style={{fontFamily:font.font_family, fontWeight:"400"}} className="font-weight w-[100%] text-[20px] text-dark-theme-8 pb-[16px] mb-[32px] border-b border-dark-theme-4"><DummyText lang={font.lang} text={text} randomNum={randomNum}/></div>
                        </>
                        : <></>
                    }
                    {
                        font.font_weight[4] === "Y"
                        ? <>
                            <div className="text-[14px] text-dark-theme-8 leading-none mb-[16px]">Medium 500</div>
                            <div style={{fontFamily:font.font_family, fontWeight:"500"}} className="font-weight w-[100%] text-[20px] text-dark-theme-8 pb-[16px] mb-[32px] border-b border-dark-theme-4"><DummyText lang={font.lang} text={text} randomNum={randomNum}/></div>
                        </>
                        : <></>
                    }
                    {
                        font.font_weight[5] === "Y"
                        ? <>
                            <div className="text-[14px] text-dark-theme-8 leading-none mb-[16px]">Bold 600</div>
                            <div style={{fontFamily:font.font_family, fontWeight:"600"}} className="font-weight w-[100%] text-[20px] text-dark-theme-8 pb-[16px] mb-[32px] border-b border-dark-theme-4"><DummyText lang={font.lang} text={text} randomNum={randomNum}/></div>
                        </>
                        : <></>
                    }
                    {
                        font.font_weight[6] === "Y"
                        ? <>
                            <div className="text-[14px] text-dark-theme-8 leading-none mb-[16px]">ExtraBold 700</div>
                            <div style={{fontFamily:font.font_family, fontWeight:"700"}} className="font-weight w-[100%] text-[20px] text-dark-theme-8 pb-[16px] mb-[32px] border-b border-dark-theme-4"><DummyText lang={font.lang} text={text} randomNum={randomNum}/></div>
                        </>
                        : <></>
                    }
                    {
                        font.font_weight[7] === "Y"
                        ? <>
                            <div className="text-[14px] text-dark-theme-8 leading-none mb-[16px]">Heavy 800</div>
                            <div style={{fontFamily:font.font_family, fontWeight:"800"}} className="font-weight w-[100%] text-[20px] text-dark-theme-8 pb-[16px] mb-[32px] border-b border-dark-theme-4"><DummyText lang={font.lang} text={text} randomNum={randomNum}/></div>
                        </>
                        : <></>
                    }
                    {
                        font.font_weight[8] === "Y"
                        ? <>
                            <div className="text-[14px] text-dark-theme-8 leading-none mb-[16px]">Black 900</div>
                            <div style={{fontFamily:font.font_family, fontWeight:"900"}} className="font-weight w-[100%] text-[20px] text-dark-theme-8 pb-[16px] mb-[32px] border-b border-dark-theme-4"><DummyText lang={font.lang} text={text} randomNum={randomNum}/></div>
                        </>
                        : <></>
                    }
                </div>
                <div className="flex flex-col justify-start items-start mb-[60px]">
                    <h2 className="text-[24px] text-dark-theme-8 font-medium mb-[20px]">폰트 크기</h2>
                    <div className="flex flex-row justify-start items-center">
                        <div className="text-[14px] text-dark-theme-6 leading-none pr-[16px]">10px</div>
                        <div style={{fontFamily:font.font_family}} className="font-size text-[10px] text-dark-theme-8 leading-none">
                            {
                                font.lang === "KR"
                                ? alphabetKR
                                : alphabetEN
                            }
                        </div>
                    </div>
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

    const randomNum: number = Math.floor(Math.random() * 19);

    return {
        props: {
            fontInfo: fonts,
            randomNum: randomNum,
        }
    }
}

export default DetailPage;