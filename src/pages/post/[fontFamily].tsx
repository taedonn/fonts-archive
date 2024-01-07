// Next
import Link from "next/link";
import { NextSeo } from 'next-seo';

// next-auth
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]";

// react
import React, { useEffect, useState, useRef } from "react";

// api
import { FetchFontDetail } from "../api/post/fetchfontdetail";
import { FetchUserLikeOnDetail } from "../api/user/fetchuserlike";

// libraries
import axios from "axios";
import { throttle } from "lodash";
import {  Slider } from "@mui/material";
import { ColorPicker, useColor } from "react-color-palette";
import "react-color-palette/css";

// components
import Header from "@/components/header";
import Footer from "@/components/footer";
import Tooltip from "@/components/tooltip";
import DummyText from "@/components/dummytext";
import Comments from "@/components/comments";
import KakaoAdFitTopBanner from "@/components/kakaoAdFitTopBanner";
import KakaoAdFitBottomBanner from "@/components/kakaoAdFitBottomBanner";

function DetailPage({params}: any) {
    const { theme, userAgent, randomNum, user, like } = params;
    const font = params.font[0];

    // 디바이스 체크
    const isMac: boolean = userAgent.includes("Mac OS") ? true : false;

    // states
    const [comments, setComments] = useState(null);
    const [reports, setReports] = useState(null);
    const [alertDisplay, setAlertDisplay] = useState<boolean>(false);
    const [hoverDisplay, setHoverDisplay] = useState<boolean>(true);
    const [liked, setLiked] = useState<boolean>(like === null ? false : true);
    const [likedInput, setLikedInput] = useState<boolean>(like === null ? false : true);
    const [likedNum, setLikedNum] = useState<number>(font.like);
    const [webFont, setWebFont] = useState("CSS");
    const [text, setText] = useState("");
    const [fontSize, setFontSize] = useState<number>(20);
    const [lineHeight, setLineHeight] = useState<number>(1.5);
    const [letterSpacing, setLetterSpacing] = useState<number>(0);
    const [fontUnit, setFontUnit] = useState<string>("px");
    const [lineHeightUnit, setLineHeightUnit] = useState<string>("em");
    const [letterSpacingUnit, setLetterSpacingUnit] = useState<string>("em");
    const [textColor, setTextColor] = useColor("#E9EAEE");
    const [displayTextColorPicker, setDisplayTextColorPicker] = useState<boolean>(false);
    const [bgColor, setBgColor] = useColor(params.theme === "dark" ? "#17181B" : "#35363A");
    const [displaybgColorPicker, setDisplaybgColorPicker] = useState<boolean>(false);

    // refs
    const textColorPickerBtn = useRef<HTMLLabelElement>(null);
    const textColorPicker = useRef<HTMLDivElement>(null);
    const bgColorPickerBtn = useRef<HTMLLabelElement>(null);
    const bgColorPicker = useRef<HTMLDivElement>(null);

    /** 조회수 업데이트 */
    useEffect(() => {
        const viewUpdate = async () => {
            await fetch("/api/post/updateview", { method: "POST", body: JSON.stringify(font) });
        }
        if (!window.location.href.includes("localhost") && !window.location.href.includes("127.0.0.1")) {
            viewUpdate();
        }
    }, [font]);

    // 댓글 가져오기
    useEffect(() => {
        const fetchComments = async () => {
            await axios.get("/api/post/fetchcomments", {
                params: {
                    action: "fetch-comments",
                    code: font.code,
                }
            })
            .then(res => setComments(res.data.comments))
            .catch(err => console.log(err));
        }
        fetchComments();

        const fetchReports = async () => {
            if (user !== null) {
                await axios.get('/api/post/fetchreports', {
                    params: {
                        action: "fetch-reports",
                        code: font.code,
                        email: user.email,
                        provider: user.provider,
                    }
                })
                .then(res => setReports(res.data.reports))
                .catch(err => console.log(err));
            }
        }
        fetchReports();
    }, [font.code, user]);

    /** 로그인 중이 아닐 때 좋아요 클릭 방지 */
    const handleLikeClick = (e: React.MouseEvent<HTMLInputElement>) => {
        if (user === null) {
            setAlertDisplay(true);
            e.preventDefault();
        }
    }

    /** 좋아요 버튼 체인지 이벤트 */
    const handleLikeChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (user !== null) {
            // 좋아요 버튼 눌렀을 때 호버창 지우기
            setHoverDisplay(false);

            // 좋아요/좋아요 해제 여부 체크
            if (e.target.checked) { setLikedInput(true); }
            else { setLikedInput(false); }

            // 댓글창 위 좋아요 버튼의 아이디 규칙에 맞게 변경
            const thisId = e.target.id.includes('like-bottom-') ? e.target.id.replace('like-bottom-','') : e.target.id;

            await axios.post('/api/post/updatelike', {
                action: e.target.checked ? "increase" : "decrease",
                code: thisId,
                id: user.id,
                email: user.email,
                provider: user.provider,
            })
            .then(res => {
                // 좋아요 여부 확인 후 문장 변경
                if (res.data.msg === 'liked') { setLiked(true); }
                else { setLiked(false); }

                // 좋아요 시 좋아요 수 변경
                setLikedNum(res.data.num);

                // 좋아요 버튼 눌렀을 때 호버창 다시 띄우기
                setHoverDisplay(true);
            })
            .catch(err => console.log(err));
        }
    }

    /** 알럿창 닫기 */
    const handleAlertClose = () => { setAlertDisplay(false); }

    /** 스크롤 시 알럿창 닫기 */
    const handleScroll = () => { setAlertDisplay(false); }
    const throttledScroll = throttle(handleScroll, 500);

    // lodash/throttle을 이용해 스크롤 제어
    useEffect(() => {
        window.addEventListener('scroll', throttledScroll);
        return () => { window.removeEventListener('scroll', throttledScroll); }
    });

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

    /** 폰트 미리보기 텍스트 체인지 이벤트 */
    const handleFontWeightChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setText(e.target.value);
    }

    // 라이센스 본문
    useEffect(() => {
        const license = document.getElementById("license") as HTMLDivElement;
        license.innerHTML = font.license;
    }, [font.license]);

    /** MUI TextArea 줄바꿈 시 높이 변경 */
    const handleHeightChange = (e: any) => {
        e.target.style.height = 0;
        e.target.style.height = (e.target.scrollHeight)+"px";
    }

    // 단위 변경
    const convertedFontSize = fontUnit === "px" ? fontSize : fontSize * 0.75;

    /** 폰트 단위 변경 */
    const handleFontUnit = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setFontUnit(e.target.value);
        if (fontUnit === "px") { setFontSize(Math.round(fontSize * 1.33)); }
        else { setFontSize(Math.round(fontSize * 0.75)); }
    };

    /** 행간 단위 변경 */
    const handleLineHeightUnit = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setLineHeightUnit(e.target.value);
        if (e.target.value === "em") { setLineHeight(1.5); }
        else if (e.target.value === "px") { setLineHeight(28); }
        else { setLineHeight(150); }
    };

    /** 자간 단위 변경 */
    const handleLetterSpacingUnit = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setLetterSpacingUnit(e.target.value);
        setLetterSpacing(0);
    };
    
    /** 폰트 color picker 보임/숨김 */
    const handleTextColorPickerDisplay = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) { setDisplayTextColorPicker(true); }
        else { setDisplayTextColorPicker(false); }
    }

    // 폰트 color picker 영역 외 클릭
    useEffect(() => {
        function handleOutside(e:Event) {
            const textInput = document.getElementById("text-color-picker") as HTMLInputElement;
            if (textColorPickerBtn.current && !textColorPickerBtn.current.contains(e.target as Node) && textColorPicker.current && !textColorPicker.current.contains(e.target as Node)) {
                setDisplayTextColorPicker(false);
                textInput.checked = false;
            }
        }
        document.addEventListener("mouseup", handleOutside);
        return () => document.removeEventListener("mouseup", handleOutside);
    }, [textColorPicker, textColorPickerBtn]);
    
    /** 배경 color picker 보임/숨김 */
    const handlebgColorPickerDisplay = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) { setDisplaybgColorPicker(true); }
        else { setDisplaybgColorPicker(false); }
    }

    // 배경 color picker 영역 외 클릭
    useEffect(() => {
        function handleOutside(e:Event) {
            const bgInput = document.getElementById("bg-color-picker") as HTMLInputElement;
            if (bgColorPickerBtn.current && !bgColorPickerBtn.current.contains(e.target as Node) && bgColorPicker.current && !bgColorPicker.current.contains(e.target as Node)) {
                setDisplaybgColorPicker(false);
                bgInput.checked = false;
            }
        }
        document.addEventListener("mouseup", handleOutside);
        return () => document.removeEventListener("mouseup", handleOutside);
    }, [bgColorPicker, bgColorPickerBtn]);

    /** color picker 리셋 */
    const resetColorPicker = () => {
        const html = document.getElementsByTagName("html")[0];
        if (html.classList.contains("dark")) {
            setTextColor({hex: "#E9EAEE", rgb: {r: 233, g: 234, b: 238, a: 1}, hsv: {h: 228, s: 2.1, v: 93.3, a: 1}});
            setBgColor({hex: "#17181B", rgb: {r: 23, g: 24, b: 27, a: 1}, hsv: {h: 225, s: 14.8, v: 10.6, a: 1}});
        }
        else {
            setTextColor({hex: "#E9EAEE", rgb: {r: 233, g: 234, b: 238, a: 1}, hsv: {h: 228, s: 2.1, v: 93.3, a: 1}});
            setBgColor({hex: "#35363A", rgb: {r: 53, g: 54, b: 58, a: 1}, hsv: {h: 228, s: 8.6, v: 22.7, a: 1}});
        }
    }

    return (
        <>
            {/* Head 부분*/}
            <NextSeo 
                title={font.name + " · 폰트 아카이브"}
                description={"상업용 무료 한글 폰트 저장소 | " + font.license}
                openGraph={{
                    title: font.name + " · 폰트 아카이브",
                    description: "상업용 무료 한글 폰트 저장소 | " + font.license,
                    url: `https://fonts.taedonn.com/post/${font.font_family.replaceAll(" ", "+")}`,
                    images: [{
                        url: `https://${process.env.MY_AWS_S3_META_IMAGE_BUCKET}.s3.ap-northeast-2.amazonaws.com/${font.font_family.replaceAll(" ", "")}.png`,
                        width: 500,
                        height: 500,
                        alt: `${font.name} 메타 이미지`
                    }],
                    type: "article",
                    article: {
                        publishedTime: font.created_at,
                        modifiedTime: font.updated_at,
                        authors: ["태돈"],
                        tags: [
                            font.name,
                            font.font_family,
                            font.font_type,
                            font.source,
                            "폰트",
                            "한글 폰트",
                            "웹 폰트",
                            "한글 웹 폰트",
                            "상업용 무료 폰트",
                            "상업용 무료 한글 폰트",
                            "CDN",
                            "CDN 링크",
                            "link",
                            "import",
                            "font-face"
                        ],
                    },
                }}
            />

            {/* 헤더 */}
            <Header
                isMac={isMac}
                theme={theme}
                user={user}
            />

            {/* 고정 메뉴 */}
            <Tooltip/>

            {/* 로그인 중이 아닐 때 좋아요 alert창 팝업 */}
            {
                alertDisplay === true
                ? <div className='fixed z-20 top-6 tlg:top-5 right-8 tlg:right-7 w-max h-[60px] tlg:h-14 px-4 flex flex-row justify-between items-center rounded-lg border border-theme-yellow dark:border-theme-blue-1 text-sm text-theme-10 dark:text-theme-9 bg-theme-4 dark:bg-theme-blue-2'>
                    <div className='flex flex-row justify-start items-center'>
                        <i className="text-lg text-theme-10 dark:text-theme-9 fa-solid fa-star-and-crescent"></i>
                        <div className='ml-3'>
                            좋아요 기능은 로그인 시 이용 가능합니다. <br/>
                            <Link href="/user/login" className='text-theme-yellow dark:text-theme-blue-1 hover:underline tlg:hover:no-underline'>로그인 하러 가기</Link>
                        </div>
                    </div>
                    <div onClick={handleAlertClose} className='flex flex-row justify-center items-center ml-3 cursor-pointer'>
                        <i className="text-sm text-theme-10 dark:text-theme-9 fa-solid fa-xmark"></i>
                    </div>
                </div> : <></>
            }

            {/* 메인 */}
            <div className="w-full pt-8 tmd:pt-5">
                <link href={font.cdn_url} rel="stylesheet" type="text/css" itemProp="url"></link>
                <div className="w-full flex flex-col justify-start items-start">
                    <div className="mb-3 tlg:mb-2 flex items-center">
                        <div style={{fontFamily:'"'+font.font_family+'"'}} className="text-4xl tlg:text-3xl tmd:text-2xl text-theme-3 dark:text-theme-9 font-medium leading-tight">{font.name}</div>
                        <div className='group relative ml-3.5 tmd:ml-2.5 mb-0.5'>
                            <input onClick={handleLikeClick} onChange={handleLikeChange} type="checkbox" id={font.code.toString()} className='like hidden' defaultChecked={like === null ? false : true}/>
                            <label htmlFor={font.code.toString()} className='cursor-pointer'>
                                <i className="text-2xl text-theme-4 dark:text-theme-7 fa-regular fa-heart"></i>
                                <i className="text-2xl text-theme-red fa-solid fa-heart"></i>
                            </label>
                            <div className={`${hoverDisplay === true ? 'group-hover:block' : 'group-hover:hidden'} like-btn w-max absolute z-20 left-1/2 -top-10 text-sm font-medium leading-none px-3 py-2 origin-bottom rounded-md hidden tlg:group-hover:hidden group-hover:animate-zoom-in-fontbox bg-theme-red text-theme-2`}>{liked === true ? "좋아요 해제" : "좋아요"}</div>
                        </div>
                    </div>
                    <div className="flex flex-row justify-start items-center">
                        <div style={{fontFamily:'"'+font.font_family+'"'}} className="text-base tmd:text-xs leading-tight text-theme-3 dark:text-theme-9 ml-0.5 mr-4 tmd:mr-3">
                            <span className={`${font.lang === 'KR' ? '' : 'font-sans'}`}>제작</span>
                            <Link href={{pathname: "/", query: {search: font.source}}} className="relative group text-theme-yellow dark:text-theme-blue-1 border-b border-theme-yellow dark:border-theme-blue-1 ml-2 tlg:ml-1.5">
                                {font.source}
                                <div className="same-source w-max absolute z-10 left-1/2 -top-11 text-sm font-medium leading-none px-3 py-2 origin-bottom rounded-md hidden group-hover:block tlg:group-hover:hidden group-hover:animate-zoom-in-fontbox bg-theme-yellow dark:bg-theme-blue-1 text-theme-3 dark:text-theme-blue-2">제작사의 다른 폰트 보기</div>
                            </Link>
                        </div>
                        <div className={`${font.lang === 'KR' ? '' : 'font-sans'} text-base tmd:text-xs leading-tight text-theme-3 dark:text-theme-9 mr-3.5 tmd:mr-3`}>형태<span className="text-theme-5 dark:text-theme-7 ml-1.5">{font.font_type === "Sans Serif" ? "고딕" : (font.font_type === "Serif" ? "명조" : (font.font_type === "Hand Writing" ? "손글씨" : (font.font_type === "Display" ? "장식체" : "픽셀체")))}</span></div>
                        <div className={`${font.lang === 'KR' ? '' : 'font-sans'} text-base tmd:text-xs leading-tight text-theme-3 dark:text-theme-9 mr-3.5 tmd:mr-3`}>조회수<span className="text-theme-5 dark:text-theme-7 ml-1.5">{formatNumber(font.view)}</span></div>
                        <div className={`${font.lang === 'KR' ? '' : 'font-sans'} text-base tmd:text-xs leading-tight text-theme-3 dark:text-theme-9`}>좋아요 수<span className="text-theme-5 dark:text-theme-7 ml-1.5">{formatNumber(likedNum)}</span></div>
                    </div>

                    {/* 카카오 애드핏 상단 띠배너 */}
                    <div className="w-full">
                        <KakaoAdFitTopBanner
                            marginTop={16}
                        />
                    </div>

                    <div className="w-full h-px my-4 tmd:my-3 bg-theme-7 dark:bg-theme-5"></div>
                </div>
                <div className="flex flex-row justify-start items-center mb-[60px] tmd:mb-12">
                    <Link aria-label="source-link" href={font.source_link} target="_blank" rel="noopener noreferrer" className="h-9 tmd:h-8 flex flex-row justify-center items-center text-sm tmd:text-xs leading-none text-theme-3 dark:text-theme-blue-1 font-medium dark:border-2 tmd:dark:border dark:border-theme-blue-1 rounded-full px-5 mr-3 tmd:mr-2 cursor-pointer bg-theme-yellow hover:bg-theme-yellow/90 tlg:hover:bg-theme-yellow dark:bg-transparent hover:dark:bg-theme-blue-1/10 tlg:hover:dark:bg-transparent">다운로드 페이지로 이동</Link>
                    {
                        font.license_ofl !== "Y"
                        ? <></>
                        : <Link aria-label="github-source-link" href={font.github_link} className="w-40 tmd:w-32 h-9 tmd:h-8 flex flex-row justify-center items-center text-sm tmd:text-xs leading-none text-theme-9 dark:text-theme-9 font-medium dark:border-2 tmd:dark:border border-theme-4 dark:border-theme-9 rounded-full px-5 cursor-pointer bg-theme-3 hover:bg-theme-3/90 tlg:hover:bg-theme-3 dark:bg-transparent hover:dark:bg-theme-9/10 tlg:hover:dark:bg-transparent">폰트 다운로드</Link>
                    }
                </div>
                {
                    font.license_embed !== "Y" || font.license_ofl !== "Y"
                    ? <></>
                    : <>
                        <div className="flex flex-col justify-start items-start mb-[60px] tmd:mb-12">
                            <h2 className="text-xl tmd:text-lg text-theme-3 dark:text-theme-9 font-medium mb-3.5">웹 폰트 사용하기</h2>
                            <div className="cdn w-[916px] tlg:w-full h-12 tmd:h-10 overflow-hidden border-x border-t border-b border-theme-4 dark:border-theme-3/80 rounded-t-lg flex flex-row justify-start items-center">
                                <input onChange={handleWebFont} type="radio" id="cdn_css" name="cdn" value="CSS" className="hidden" defaultChecked/>
                                <label htmlFor="cdn_css" className="w-1/4 h-full border-r border-theme-8 dark:border-theme-3/80 flex flex-row justify-center items-center text-sm tmd:text-xs text-theme-3 focused:text-theme-9 dark:text-theme-9 leading-none cursor-pointer">CSS 설정하기</label>
                                <input onChange={handleWebFont} type="radio" id="cdn_link" name="cdn" value="link" className="hidden"/>
                                <label htmlFor="cdn_link" className="w-1/4 h-full border-r border-theme-8 dark:border-theme-3/80 flex flex-row justify-center items-center text-sm tmd:text-xs text-theme-3 dark:text-theme-9 leading-none cursor-pointer">link 방식</label>
                                <input onChange={handleWebFont} type="radio" id="cdn_import" name="cdn" value="import" className="hidden"/>
                                <label htmlFor="cdn_import" className="w-1/4 h-full border-r border-theme-8 dark:border-theme-3/80 flex flex-row justify-center items-center text-sm tmd:text-xs text-theme-3 dark:text-theme-9 leading-none cursor-pointer">import 방식</label>
                                <input onChange={handleWebFont} type="radio" id="cdn_font_face" name="cdn" value="font-face" className="hidden"/>
                                <label htmlFor="cdn_font_face" className="w-1/4 h-full flex flex-row justify-center items-center text-sm tmd:text-xs text-theme-3 dark:text-theme-9 leading-none cursor-pointer">font-face 방식</label>
                            </div>
                            <div className="w-[916px] tlg:w-full border-x border-b rounded-b-lg border-theme-4 dark:border-theme-blue-2 bg-theme-3 dark:bg-theme-blue-2">
                                {
                                    webFont === "CSS"
                                    ? <div className="w-full relative pl-6 tmd:pl-4 pr-[60px] overflow-hidden">
                                        <div className="cdn_pre w-full h-[60px] tmd:h-12 flex flex-row justify-start items-center overflow-x-auto"><pre className="font-sans text-[14px] tmd:text-[12px] text-theme-9">{font.cdn_css}</pre></div>
                                        <div className="absolute z-10 right-4 tmd:right-3 top-1/2 -translate-y-1/2 rounded-md cursor-pointer">
                                            <i onClick={copyOnClick} className="copy_btn text-base px-2 py-1 rounded-md hover:bg-theme-yellow/10 tlg:hover:bg-transparent hover:dark:bg-theme-blue-1/10 tlg:hover:dark-bg-transparent text-theme-yellow dark:text-theme-blue-1 fa-regular fa-copy"></i>
                                            <i className="copy_chk_btn text-base px-2 py-1 rounded-md bg-theme-yellow/10 dark:bg-theme-blue-1/10 text-theme-yellow dark:text-theme-blue-1 hidden fa-solid fa-check"></i>
                                        </div>
                                    </div>
                                    : ( webFont === "link"
                                        ? <div className="w-full relative pl-6 tmd:pl-4 pr-[60px] overflow-hidden">
                                            <div className="cdn_pre w-full h-[60px] tmd:h-12 flex flex-row justify-start items-center overflow-x-auto"><pre className="font-sans text-sm tmd:text-xs text-theme-9">{font.cdn_link}</pre></div>
                                            <div className="absolute z-10 right-4 tmd:right-[12px] top-1/2 -translate-y-1/2 cursor-pointer">
                                                <i onClick={copyOnClick} className="copy_btn text-base px-2 py-1 rounded-md hover:bg-theme-yellow/10 tlg:hover:bg-transparent hover:dark:bg-theme-blue-1/10 tlg:hover:dark-bg-transparent text-theme-yellow dark:text-theme-blue-1 fa-regular fa-copy"></i>
                                                <i className="copy_chk_btn text-base px-2 py-1 rounded-md bg-theme-yellow/10 dark:bg-theme-blue-1/10 text-theme-yellow dark:text-theme-blue-1 hidden fa-solid fa-check"></i>
                                            </div>
                                        </div>
                                        : ( webFont === "import"
                                            ? <div className="w-full relative pl-6 tmd:pl-4 pr-[60px] overflow-hidden">
                                                <div className="cdn_pre w-full h-[60px] tmd:h-12 flex flex-row justify-start items-center overflow-x-auto"><pre className="font-sans text-sm tmd:text-xs text-theme-9">{font.cdn_import}</pre></div>
                                                <div className="absolute z-10 right-4 tmd:right-3 top-1/2 -translate-y-1/2 cursor-pointer">
                                                    <i onClick={copyOnClick} className="copy_btn text-base px-2 py-1 rounded-md hover:bg-theme-yellow/10 tlg:hover:bg-transparent hover:dark:bg-theme-blue-1/10 tlg:hover:dark-bg-transparent text-theme-yellow dark:text-theme-blue-1 fa-regular fa-copy"></i>
                                                    <i className="copy_chk_btn text-base px-2 py-1 rounded-md bg-theme-yellow/10 dark:bg-theme-blue-1/10 text-theme-yellow dark:text-theme-blue-1 hidden fa-solid fa-check"></i>
                                                </div>
                                            </div>
                                            : <div className="w-full relative pl-6 tmd:pl-4 pr-[60px] overflow-hidden">
                                                <div className="cdn_pre w-full h-[auto] py-5 tmd:py-[15px] flex flex-row justify-start items-center overflow-auto whitespace-nowrap"><pre id="cdn-font-face" style={{tabSize: 8}} className="font-sans font-face text-sm tmd:text-xs text-theme-9">{font.cdn_font_face}</pre></div>
                                                <div className="absolute z-10 right-4 tmd:right-3 top-[30px] tmd:top-6 -translate-y-1/2 cursor-pointer">
                                                    <i onClick={copyOnClick} className="copy_btn text-base px-2 py-1 rounded-md hover:bg-theme-yellow/10 tlg:hover:bg-transparent hover:dark:bg-theme-blue-1/10 tlg:hover:dark-bg-transparent text-theme-yellow dark:text-theme-blue-1 fa-regular fa-copy"></i>
                                                    <i className="copy_chk_btn text-base px-2 py-1 rounded-md bg-theme-yellow/10 dark:bg-theme-blue-1/10 text-theme-yellow dark:text-theme-blue-1 hidden fa-solid fa-check"></i>
                                                </div>
                                            </div>
                                        )
                                    )
                                }
                            </div>
                        </div>
                    </>
                }
                <div className="max-w-full w-max flex flex-col justify-start items-start mb-[60px] tmd:mb-12">
                    <h2 className="text-5 tmd:text-[18px] text-theme-3 dark:text-theme-9 font-medium mb-3.5">폰트 미리보기</h2>
                    <div className="w-full px-4 py-2 mb-4 border-b border-theme-7 dark:border-theme-5">
                        <textarea onChange={handleFontWeightChange} onInput={handleHeightChange} placeholder="원하는 문구를 적어보세요..." className="w-full h-[18px] resize-none text-sm text-theme-5 dark:text-theme-8 placeholder-theme-5 dark:placeholder-theme-6 leading-tight bg-transparent"/>
                    </div>
                    <div className="font-preview-wrap max-w-full rounded-lg pt-7 bg-theme-3 dark:bg-theme-blue-2">
                        <div className="w-full px-5 flex flex-row flex-wrap justify-start items-center">
                            <div className="flex flex-col justify-center items-start mr-[40px] mb-4">
                                <div className="flex items-center mb-2">
                                    <p className="text-sm text-normal leading-none text-theme-9">
                                        폰트 크기<span className="text-xs text-theme-7 ml-1.5">Font Size</span>
                                    </p>
                                    <select onChange={handleFontUnit} className='w-14 h-7 text-xs ml-2.5 px-2.5 bg-transparent rounded-md outline-none border border-theme-6 hover:border-theme-8 tlg:hover:border-theme-6 dark:border-theme-5 hover:dark:border-theme-7 tlg:hover:dark:border-theme-5 text-theme-9 cursor-pointer'>
                                        <option value='px' defaultChecked>px</option>
                                        <option value='pt'>pt</option>
                                    </select>
                                </div>
                                <div className="w-[182px] mx-10 relative">
                                    <Slider
                                        className="font-size-slider"
                                        aria-label="font-size-slider"
                                        valueLabelDisplay="auto"
                                        valueLabelFormat={fontSize + fontUnit}
                                        onChange={(e, v) => setFontSize(Number(v))}
                                        defaultValue={20}
                                        value={fontSize}
                                        min={fontUnit === "px" ? 12 : 9}
                                        max={fontUnit === "px" ? 64 : 48}
                                    />
                                    <div className="absolute -left-10 top-1/2 translate-y-[-70%] text-xs text-theme-9">{fontUnit === "px" ? 12 : 9}{fontUnit}</div>
                                    <div className="absolute -right-10 top-1/2 translate-y-[-70%] text-xs text-theme-9">{fontUnit === "px" ? 64 : 48}{fontUnit}</div>
                                </div>
                            </div>
                            <div className="flex flex-col justify-center items-start mr-10 mb-4">
                                <div className="flex items-center mb-2">
                                    <p className="text-sm text-normal leading-none text-theme-9">
                                        행간<span className="text-xs text-theme-7 ml-1.5">Line Height</span>
                                    </p>
                                    <select onChange={handleLineHeightUnit} className='w-44 h-7 text-xs ml-2.5 px-2.5 bg-transparent rounded-md outline-none border border-theme-6 hover:border-theme-8 tlg:hover:border-theme-6 dark:border-theme-5 hover:dark:border-theme-7 tlg:hover:dark:border-theme-5 text-theme-9 cursor-pointer'>
                                        <option value='em' defaultChecked>em</option>
                                        <option value='px'>px</option>
                                        <option value='%'>%</option>
                                    </select>
                                </div>
                                <div className="w-[182px] mx-10 relative">
                                    <Slider
                                        className="font-size-slider"
                                        aria-label="font-size-slider"
                                        step={lineHeightUnit === "em" ? 0.1 : lineHeightUnit === "px" ? 1 : 10}
                                        valueLabelDisplay="auto"
                                        valueLabelFormat={lineHeight + lineHeightUnit}
                                        onChange={(e, v) => setLineHeight(Number(v))}
                                        defaultValue={1.5}
                                        value={lineHeight}
                                        min={lineHeightUnit === "em" ? 1 : lineHeightUnit === "px" ? 12 : 50}
                                        max={lineHeightUnit === "em" ? 3 : lineHeightUnit === "px" ? 64 : 200}
                                    />
                                    <div className="absolute -left-10 top-1/2 translate-y-[-70%] text-xs text-theme-9">{lineHeightUnit === "em" ? 1 : lineHeightUnit === "px" ? 12 : 50}{lineHeightUnit}</div>
                                    <div className="absolute -right-10 top-1/2 translate-y-[-70%] text-xs text-theme-9">{lineHeightUnit === "em" ? 3 : lineHeightUnit === "px" ? 64 : 200}{lineHeightUnit}</div>
                                </div>
                            </div>
                            <div className="flex flex-col justify-center items-start mr-10 mb-4">
                                <div className="flex items-center mb-2">
                                    <p className="text-sm text-normal leading-none text-theme-9">
                                        자간<span className="text-xs text-theme-7 ml-1.5">Letter Spacing</span>
                                    </p>
                                    <select onChange={handleLetterSpacingUnit} className='w-14 h-7 text-xs ml-2.5 px-2.5 bg-transparent rounded-md outline-none border border-theme-6 hover:border-theme-8 tlg:hover:border-theme-6 dark:border-theme-5 hover:dark:border-theme-7 tlg:hover:dark:border-theme-5 text-theme-9 cursor-pointer'>
                                        <option value='em' defaultChecked>em</option>
                                        <option value='px'>px</option>
                                    </select>
                                </div>
                                <div className="w-[182px] ml-12 relative">
                                    <Slider
                                        className="font-size-slider"
                                        aria-label="font-size-slider"
                                        step={letterSpacingUnit === "em" ? 0.1 : 1}
                                        valueLabelDisplay="auto"
                                        valueLabelFormat={letterSpacing + letterSpacingUnit}
                                        onChange={(e, v) => setLetterSpacing(Number(v))}
                                        defaultValue={0}
                                        value={letterSpacing}
                                        min={letterSpacingUnit === "em" ? -1 : -10}
                                        max={letterSpacingUnit === "em" ? 1 : 10}
                                    />
                                    <div className="absolute -left-12 top-1/2 translate-y-[-70%] text-xs text-theme-9">{letterSpacingUnit === "em" ? -1 :  -10}{letterSpacingUnit}</div>
                                    <div className="absolute -right-8 top-1/2 translate-y-[-70%] text-xs text-theme-9">{letterSpacingUnit === "em" ? 1 : 10}{letterSpacingUnit}</div>
                                </div>
                            </div>
                        </div>
                        <div className="w-full">
                            <div className="w-full h-px mt-10 relative bg-theme-5">
                                <div className="color-picker absolute z-10 left-5 -top-3 -translate-y-full flex flex-row gap-2">
                                    <div className="relative z-10">
                                        <input onChange={handleTextColorPickerDisplay} id="text-color-picker" type="checkbox" className="peer hidden"/>
                                        <label htmlFor="text-color-picker" ref={textColorPickerBtn} className="w-7 h-7 rounded-md relative group flex flex-col justify-center items-center cursor-pointer bg-theme-yellow/80 hover:bg-theme-yellow tlg:hover:bg-theme-yellow/80 dark:bg-theme-blue-1/80 hover:dark:bg-theme-blue-1 tlg:hover:dark:bg-theme-blue-1/80 hover:drop-shadow-dark tlg:hover:drop-shadow-none">
                                            <i className="text-sm text-theme-3 dark:text-theme-blue-2 fa-solid fa-a"></i>
                                            <div style={{background: textColor.hex}} className="w-4 h-0.5 mb-0.5"></div>
                                            <div className="same-source w-max absolute left-1/2 -top-11 text-sm font-medium leading-none px-3 py-2 origin-bottom rounded-md hidden group-hover:block tlg:group-hover:hidden group-hover:animate-zoom-in-fontbox bg-theme-yellow dark:bg-theme-blue-1 text-theme-3 dark:text-theme-blue-2 selection:bg-transparent">폰트색 변경</div>
                                        </label>
                                        <div ref={textColorPicker} className="drop-shadow-dark absolute left-0 -top-2 -translate-y-full">
                                            {
                                                displayTextColorPicker && 
                                                <ColorPicker height={120} color={textColor} onChange={setTextColor} hideInput={["hsv"]}/>
                                            }
                                        </div>
                                    </div>
                                    <div className="relative">
                                        <input onChange={handlebgColorPickerDisplay} id="bg-color-picker" type="checkbox" className="peer hidden"/>
                                        <label htmlFor="bg-color-picker" ref={bgColorPickerBtn} className="w-7 h-7 rounded-md relative group flex flex-col justify-center items-center cursor-pointer bg-theme-yellow/80 hover:bg-theme-yellow tlg:hover:bg-theme-yellow/80 dark:bg-theme-blue-1/80 hover:dark:bg-theme-blue-1 tlg:hover:dark:bg-theme-blue-1/80 hover:drop-shadow-dark tlg:hover:drop-shadow-none">
                                            <i className="text-sm text-theme-3 dark:text-theme-blue-2 fa-solid fa-fill"></i>
                                            <div style={{background: bgColor.hex}} className="w-4 h-0.5 mb-0.5"></div>
                                            <div className="same-source w-max absolute left-1/2 -top-11 text-sm font-medium leading-none px-3 py-2 origin-bottom rounded-md hidden group-hover:block tlg:group-hover:hidden group-hover:animate-zoom-in-fontbox bg-theme-yellow dark:bg-theme-blue-1 text-theme-3 dark:text-theme-blue-2 selection:bg-transparent">배경색 변경</div>
                                        </label>
                                        <div ref={bgColorPicker} className="drop-shadow-dark absolute left-0 -top-2 -translate-y-full">
                                            {
                                                displaybgColorPicker && 
                                                <ColorPicker height={120} color={bgColor} onChange={setBgColor} hideInput={["hsv"]}/>
                                            }
                                        </div>
                                    </div>
                                    <button onClick={resetColorPicker} className="w-7 h-7 rounded-md relative z-20 group flex flex-col justify-center items-center bg-theme-yellow/80 hover:bg-theme-yellow tlg:hover:bg-theme-yellow/80 dark:bg-theme-blue-1/80 hover:dark:bg-theme-blue-1 tlg:hover:dark:bg-theme-blue-1/80 hover:drop-shadow-dark tlg:hover:drop-shadow-none">
                                        <i className="text-sm group-hover:rotate-45 tlg:group-hover:rotate-0 duration-100 fa-solid fa-rotate"></i>
                                        <div className="same-source w-max absolute left-1/2 -top-11 text-sm font-medium leading-none px-3 py-2 origin-bottom rounded-md hidden group-hover:block tlg:group-hover:hidden group-hover:animate-zoom-in-fontbox bg-theme-yellow dark:bg-theme-blue-1 text-theme-3 dark:text-theme-blue-2 selection:bg-transparent">컬러 리셋하기</div>
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div style={{backgroundColor: bgColor.hex}} className="w-full px-5 pt-7 pb-3.5 rounded-b-lg relative overflow-hidden">
                            {
                                font.font_weight[0] === "Y"
                                ? <>
                                    <div style={{color: textColor.hex, opacity: "0.8"}} className="text-xs leading-none mb-3">Thin 100</div>
                                    <pre style={{fontFamily:'"'+font.font_family+'"', fontSize: convertedFontSize, lineHeight: lineHeight + lineHeightUnit, letterSpacing: letterSpacing + letterSpacingUnit, fontWeight:"100", color: textColor.hex}} className="font-preview w-full pb-4 tlg:pb-3.5 mb-5 tlg:mb-4"><DummyText lang={font.lang} text={text} num={randomNum}/></pre>
                                </>
                                : <></>
                            }
                            {
                                font.font_weight[1] === "Y"
                                ? <>
                                    <div style={{color: textColor.hex, opacity: "0.8"}} className="text-xs leading-none mb-3">ExtraLight 200</div>
                                    <pre style={{fontFamily:'"'+font.font_family+'"', fontSize: convertedFontSize, lineHeight: lineHeight + lineHeightUnit, letterSpacing: letterSpacing + letterSpacingUnit, fontWeight:"200", color: textColor.hex}} className="font-preview w-full pb-4 tlg:pb-3.5 mb-5 tlg:mb-4"><DummyText lang={font.lang} text={text} num={randomNum}/></pre>
                                </>
                                : <></>
                            }
                            {
                                font.font_weight[2] === "Y"
                                ? <>
                                    <div style={{color: textColor.hex, opacity: "0.8"}} className="text-xs leading-none mb-3">Light 300</div>
                                    <pre style={{fontFamily:'"'+font.font_family+'"', fontSize: convertedFontSize, lineHeight: lineHeight + lineHeightUnit, letterSpacing: letterSpacing + letterSpacingUnit, fontWeight:"300", color: textColor.hex}} className="font-preview w-full pb-4 tlg:pb-3.5 mb-5 tlg:mb-4"><DummyText lang={font.lang} text={text} num={randomNum}/></pre>
                                </>
                                : <></>
                            }
                            {
                                font.font_weight[3] === "Y"
                                ? <>
                                    <div style={{color: textColor.hex, opacity: "0.8"}} className="text-xs leading-none mb-3">Regular 400</div>
                                    <pre style={{fontFamily:'"'+font.font_family+'"', fontSize: convertedFontSize, lineHeight: lineHeight + lineHeightUnit, letterSpacing: letterSpacing + letterSpacingUnit, fontWeight:"400", color: textColor.hex}} className="font-preview w-full pb-4 tlg:pb-3.5 mb-5 tlg:mb-4"><DummyText lang={font.lang} text={text} num={randomNum}/></pre>
                                </>
                                : <></>
                            }
                            {
                                font.font_weight[4] === "Y"
                                ? <>
                                    <div style={{color: textColor.hex, opacity: "0.8"}} className="text-xs leading-none mb-3">Medium 500</div>
                                    <pre style={{fontFamily:'"'+font.font_family+'"', fontSize: convertedFontSize, lineHeight: lineHeight + lineHeightUnit, letterSpacing: letterSpacing + letterSpacingUnit, fontWeight:"500", color: textColor.hex}} className="font-preview w-full pb-4 tlg:pb-3.5 mb-5 tlg:mb-4"><DummyText lang={font.lang} text={text} num={randomNum}/></pre>
                                </>
                                : <></>
                            }
                            {
                                font.font_weight[5] === "Y"
                                ? <>
                                    <div style={{color: textColor.hex, opacity: "0.8"}} className="text-xs leading-none mb-3">SemiBold 600</div>
                                    <pre style={{fontFamily:'"'+font.font_family+'"', fontSize: convertedFontSize, lineHeight: lineHeight + lineHeightUnit, letterSpacing: letterSpacing + letterSpacingUnit, fontWeight:"600", color: textColor.hex}} className="font-preview w-full pb-4 tlg:pb-3.5 mb-5 tlg:mb-4"><DummyText lang={font.lang} text={text} num={randomNum}/></pre>
                                </>
                                : <></>
                            }
                            {
                                font.font_weight[6] === "Y"
                                ? <>
                                    <div style={{color: textColor.hex, opacity: "0.8"}} className="text-xs leading-none mb-3">Bold 700</div>
                                    <pre style={{fontFamily:'"'+font.font_family+'"', fontSize: convertedFontSize, lineHeight: lineHeight + lineHeightUnit, letterSpacing: letterSpacing + letterSpacingUnit, fontWeight:"700", color: textColor.hex}} className="font-preview w-full pb-4 tlg:pb-3.5 mb-5 tlg:mb-4"><DummyText lang={font.lang} text={text} num={randomNum}/></pre>
                                </>
                                : <></>
                            }
                            {
                                font.font_weight[7] === "Y"
                                ? <>
                                    <div style={{color: textColor.hex, opacity: "0.8"}} className="text-xs leading-none mb-3">Heavy 800</div>
                                    <pre style={{fontFamily:'"'+font.font_family+'"', fontSize: convertedFontSize, lineHeight: lineHeight + lineHeightUnit, letterSpacing: letterSpacing + letterSpacingUnit, fontWeight:"800", color: textColor.hex}} className="font-preview w-full pb-4 tlg:pb-3.5 mb-5 tlg:mb-4"><DummyText lang={font.lang} text={text} num={randomNum}/></pre>
                                </>
                                : <></>
                            }
                            {
                                font.font_weight[8] === "Y"
                                ? <>
                                    <div style={{color: textColor.hex, opacity: "0.8"}} className="text-xs leading-none mb-3">Black 900</div>
                                    <pre style={{fontFamily:'"'+font.font_family+'"', fontSize: convertedFontSize, lineHeight: lineHeight + lineHeightUnit, letterSpacing: letterSpacing + letterSpacingUnit, fontWeight:"900", color: textColor.hex}} className="font-preview w-full pb-4 tlg:pb-3.5 mb-5 tlg:mb-4"><DummyText lang={font.lang} text={text} num={randomNum}/></pre>
                                </>
                                : <></>
                            }
                        </div>
                    </div>
                </div>
                <div>
                    <h2 className="text-xl tmd:text-lg text-theme-3 dark:text-theme-9 font-medium mb-4 tmd:mb-3.5">라이센스 사용 범위</h2>
                    <div className="mb-20 tlg:mb-[60px] tmd:mb-12">
                        <div className="w-full flex flex-row tlg:flex-col justify-between items-stretch tlg:items-start">
                            <div className="tlg:w-full tlg:mb-4 border border-theme-7 dark:border-theme-5">
                                <div className="w-[670px] tlg:w-full px-5 text-sm">
                                    <div className="w-full h-14 flex items-center text-theme-3 dark:text-theme-9 font-medium">
                                        <div className="w-28 shrink-0 text-center">카테고리</div>
                                        <div className="w-full">사용 범위</div>
                                        <div className="w-24 shrink-0 text-center">허용 여부</div>
                                    </div>
                                    <div className="w-full h-px bg-theme-7 dark:bg-theme-5"></div>
                                    <div className="w-full text-theme-4 dark:text-theme-8">
                                        <div className="w-full h-[72px] flex items-center border-b border-theme-7 dark:border-theme-5">
                                            <div className="w-28 shrink-0 flex flex-col justify-center items-center">
                                                <i className="text-lg mb-0.5 fa-solid fa-print"></i>
                                                <div>인쇄물</div>
                                            </div>
                                            <div className="w-full">
                                                {
                                                    font.license_print === "Y"
                                                    ? <span className="font-size">브로슈어, 카탈로그, 전단지, 책, 신문 등 출판용 인쇄물</span>
                                                    : <span className="font-size text-theme-red/80 line-through">브로슈어, 포스터, 책, 잡지, 간판 등 출판용 인쇄물</span>
                                                }
                                            </div>
                                            <div className="w-24 shrink-0 flex justify-center">
                                                {
                                                    font.license_print === "Y"
                                                    ? <i className="text-sm fa-regular fa-circle"></i>
                                                    : ( font.license_print === "H"
                                                        ? <i className="text-lg text-theme-red fa-solid fa-not-equal"></i>
                                                        : ( font.license_print === "N"
                                                            ? <i className="text-lg text-theme-red fa-solid fa-xmark"></i>
                                                            : <></>
                                                        )
                                                    )
                                                }
                                            </div>
                                        </div>
                                        <div className="w-full h-[72px] flex items-center border-b border-theme-7 dark:border-theme-5">
                                            <div className="w-28 shrink-0 flex flex-col justify-center items-center">
                                                <i className="text-lg fa-solid fa-laptop"></i>
                                                <div>웹 서비스</div>
                                            </div>
                                            <div className="w-full">
                                                {
                                                    font.license_web === "Y"
                                                    ? <span className="font-size">웹페이지, 광고 배너, 메일, E-브로슈어, 웹서버용 폰트 등</span>
                                                    : <span className="font-size text-theme-red/80 line-through">웹페이지, 광고 배너, 메일, E-브로슈어, 웹서버용 폰트 등</span>
                                                }
                                            </div>
                                            <div className="w-24 shrink-0 flex justify-center">
                                                {
                                                    font.license_web === "Y"
                                                    ? <i className="text-sm fa-regular fa-circle"></i>
                                                    : ( font.license_web === "H"
                                                    ? <i className="text-lg text-theme-red fa-solid fa-not-equal"></i>
                                                        : ( font.license_web === "N"
                                                            ? <i className="text-lg text-theme-red fa-solid fa-xmark"></i>
                                                            : <></>
                                                        )
                                                    )
                                                }
                                            </div>
                                        </div>
                                        <div className="w-full h-[72px] flex items-center border-b border-theme-7 dark:border-theme-5">
                                            <div className="w-28 shrink-0 flex flex-col justify-center items-center">
                                                <i className="text-lg fa-solid fa-film"></i>
                                                <div>영상물</div>
                                            </div>
                                            <div className="w-full">
                                                {
                                                    font.license_video === "Y"
                                                    ? <span className="font-size">방송 및 영상물 자막, 영상 광고, 영화 오프닝/엔딩크레딧 자막 등</span>
                                                    : <span className="font-size text-theme-red/80 line-through">방송 및 영상물 자막, 영상 광고, 영화 오프닝/엔딩크레딧 자막 등</span>
                                                }
                                            </div>
                                            <div className="w-24 shrink-0 flex justify-center">
                                                {
                                                    font.license_video === "Y"
                                                    ? <i className="text-sm fa-regular fa-circle"></i>
                                                    : ( font.license_video === "H"
                                                        ? <i className="text-lg text-theme-red fa-solid fa-not-equal"></i>
                                                        : ( font.license_video === "N"
                                                            ? <i className="text-lg text-theme-red fa-solid fa-xmark"></i>
                                                            : <></>
                                                        )
                                                    )
                                                }
                                            </div>
                                        </div>
                                        <div className="w-full h-[72px] flex items-center border-b border-theme-7 dark:border-theme-5">
                                            <div className="w-28 shrink-0 flex flex-col justify-center items-center">
                                                <i className="text-lg fa-solid fa-cube"></i>
                                                <div>포장지</div>
                                            </div>
                                            <div className="w-full">
                                                {
                                                    font.license_package === "Y"
                                                    ? <span className="font-size">판매용 상품의 패키지</span>
                                                    : <span className="font-size text-theme-red/80 line-through">판매용 상품의 패키지</span>
                                                }
                                            </div>
                                            <div className="w-24 shrink-0 flex justify-center">
                                                {
                                                    font.license_package === "Y"
                                                    ? <i className="text-sm fa-regular fa-circle"></i>
                                                    : ( font.license_package === "H"
                                                        ? <i className="text-lg text-theme-red fa-solid fa-not-equal"></i>
                                                        : ( font.license_package === "N"
                                                            ? <i className="text-lg text-theme-red fa-solid fa-xmark"></i>
                                                            : <></>
                                                        )
                                                    )
                                                }
                                            </div>
                                        </div>
                                        <div className="w-full h-[72px] flex items-center border-b border-theme-7 dark:border-theme-5">
                                            <div className="w-28 shrink-0 flex flex-col justify-center items-center">
                                                <i className="text-lg mb-0.5 fa-solid fa-code"></i>
                                                <div>임베딩</div>
                                            </div>
                                            <div className="w-full">
                                                {
                                                    font.license_embed === "Y"
                                                    ? <span className="font-size">웹사이트 및 프로그램 서버 내 폰트 탑재, E-book 제작</span>
                                                    : <span className="font-size text-theme-red/80 line-through">웹사이트 및 프로그램 서버 내 폰트 탑재, E-book 제작</span>
                                                }
                                            </div>
                                            <div className="w-24 shrink-0 flex justify-center">
                                                {
                                                    font.license_embed === "Y"
                                                    ? <i className="text-sm fa-regular fa-circle"></i>
                                                    : ( font.license_embed === "H"
                                                        ? <i className="text-lg text-theme-red fa-solid fa-not-equal"></i>
                                                        : ( font.license_embed === "N"
                                                            ? <i className="text-lg text-theme-red fa-solid fa-xmark"></i>
                                                            : <></>
                                                        )
                                                    )
                                                }
                                            </div>
                                        </div>
                                        <div className="w-full h-[72px] flex items-center border-b border-theme-7 dark:border-theme-5">
                                            <div className="w-28 shrink-0 flex flex-col justify-center items-center">
                                                <i className="text-lg fa-regular fa-building"></i>
                                                <div>BI/CI</div>
                                            </div>
                                            <div className="w-full">
                                                {
                                                    font.license_bici === "Y"
                                                    ? <span className="font-size">회사명, 브랜드명, 상품명, 로고, 마크, 슬로건, 캐치프레이즈</span>
                                                    : <span className="font-size text-theme-red/80 line-through">회사명, 브랜드명, 상품명, 로고, 마크, 슬로건, 캐치프레이즈</span>
                                                }
                                            </div>
                                            <div className="w-24 shrink-0 flex justify-center">
                                                {
                                                    font.license_bici === "Y"
                                                    ? <i className="text-sm fa-regular fa-circle"></i>
                                                    : ( font.license_bici === "H"
                                                        ? <i className="text-lg text-theme-red fa-solid fa-not-equal"></i>
                                                        : ( font.license_bici === "N"
                                                            ? <i className="text-lg text-theme-red fa-solid fa-xmark"></i>
                                                            : <></>
                                                        )
                                                    )
                                                }
                                            </div>
                                        </div>
                                        <div className="w-full h-[72px] flex items-center border-b border-theme-7 dark:border-theme-5">
                                            <div className="w-28 shrink-0 flex flex-col justify-center items-center">
                                                <i className="text-lg fa-solid fa-lock-open"></i>
                                                <div>OFL</div>
                                            </div>
                                            <div className="w-full">
                                                {
                                                    font.license_ofl === "Y"
                                                    ? <span className="font-size">폰트 파일의 수정, 편집 및 재배포 가능. 폰트 파일의 유료 판매는 금지</span>
                                                    : <span className="font-size text-theme-red/80 line-through">폰트 파일의 수정, 편집 재배포 및 유료 판매 금지</span>
                                                }
                                            </div>
                                            <div className="w-24 shrink-0 flex justify-center">
                                                {
                                                    font.license_ofl === "Y"
                                                    ? <i className="text-sm fa-regular fa-circle"></i>
                                                    : <i className="text-lg text-theme-red fa-solid fa-xmark"></i>
                                                }
                                            </div>
                                        </div>
                                        <div className="w-full h-[72px] flex items-center border-b border-theme-7 dark:border-theme-5">
                                            <div className="w-28 shrink-0 flex flex-col justify-center items-center">
                                                <i className="text-lg fa-solid fa-user-check"></i>
                                                <div>용도</div>
                                            </div>
                                            <div className="w-full">
                                                {
                                                    font.license_purpose === "Y"
                                                    ? <span className="font-size">개인적, 상업적 용도 모두 사용 가능</span>
                                                    : <span className="font-size text-theme-red/80 line-through">개인적 용도 사용 가능, 상업적 용도 사용 금지</span>
                                                }
                                            </div>
                                            <div className="w-24 shrink-0 flex justify-center">
                                                {
                                                    font.license_purpose === "Y"
                                                    ? <i className="text-sm fa-regular fa-circle"></i>
                                                    : <i className="text-lg text-theme-red fa-solid fa-xmark"></i>
                                                }
                                            </div>
                                        </div>
                                        <div className="w-full h-[72px] flex items-center">
                                            <div className="w-28 shrink-0 flex flex-col justify-center items-center">
                                                <i className="text-lg fa-solid fa-share-nodes"></i>
                                                <div>출처</div>
                                            </div>
                                            <div className="w-full">출처 표시</div>
                                            <div className="w-24 shrink-0 flex justify-center">
                                                {
                                                    font.license_source === "Y"
                                                    ? <i className="text-sm fa-regular fa-circle"></i>
                                                    : <span>권장</span>
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="w-[calc(100%-690px)] tlg:w-full flex flex-col border border-theme-7 dark:border-theme-5">
                                <h2 className="relative h-14 flex flex-row justify-start items-center text-[15px] text-theme-3 dark:text-theme-9 font-normal leading-none pl-7 tlg:pl-6 tmd:pl-5">
                                    라이센스 본문
                                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[calc(100%-40px)] tlg:w-[calc(100%-32px)] tmd:w-[calc(100%-24px)] h-px bg-theme-7 dark:bg-theme-5"></div>
                                </h2>
                                <div className="license-wrap w-full h-[calc(707px-56px)] tlg:h-[auto] overflow-hidden overflow-y-auto px-7 tlg:px-6 tmd:px-5 py-3 tlg:py-4">
                                    <pre id="license" className="font-sans text-[15px] tlg:text-[13px] text-theme-3 dark:text-theme-8 leading-loose whitespace-pre-wrap"></pre>
                                </div>
                            </div>
                        </div>
                        
                        {/* 카카오 애드핏 하단 띠배너 */}
                        <div className="w-full">
                            <KakaoAdFitBottomBanner
                                marginTop={16}
                            />
                        </div>
                    </div>

                    {/* 댓글 */}
                    <Comments
                        font={font}
                        user={user}
                        report={reports}
                        comment={comments}
                        likedInput={likedInput}
                        likedNum={likedNum}
                    />

                </div>
            </div>

            {/* 풋터 */}
            <Footer/>
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
//         const fonts = await FetchFontDetail(ctx.params.fontFamily);
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
        // 쿠키 체크
        const { theme } = ctx.req.cookies;

        // 디바이스 체크
        const userAgent = ctx.req ? ctx.req.headers['user-agent'] : navigator.userAgent;

        // 랜덤 넘버
        const randomNum: number = Math.floor(Math.random() * 19);

        // 폰트 정보 불러오기
        const fontFamily = ctx.params.fontFamily.replaceAll("+", " ");
        const font = await FetchFontDetail(fontFamily);

        // 유저 정보 불러오기
        const session = await getServerSession(ctx.req, ctx.res, authOptions);

        // 유저 정보가 있으면, 좋아요한 폰트 체크
        const like = session === null
            ? null
            : await FetchUserLikeOnDetail(session.user, font[0].code);

        if (font.length === 0) {
            return {
                redirect: {
                    destination: '/404',
                    permanent: false,
                }
            }
        } else {
            return {
                props: {
                    params: {
                        theme: theme ? theme : 'light',
                        userAgent: userAgent,
                        randomNum: randomNum,
                        font: JSON.parse(JSON.stringify(font)), // typescript에서 createdAt은 JSON.parse를 통해 serialized object로 변환 후 params로 보낼 수 있다.
                        user: session === null ? null : session.user,
                        like: like,
                    }
                }
            }
        }
    } catch (error) {
        console.log(error);
    }
}

export default DetailPage;