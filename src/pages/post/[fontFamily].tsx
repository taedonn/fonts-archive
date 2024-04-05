// next
import Link from "next/link";
import { NextSeo } from 'next-seo';

// next-auth
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]";

// react
import React, { useEffect, useState, useRef } from "react";

// api
import { FetchFontDetail } from "../api/post/fetchfontdetail";

// libraries
import { throttle } from "lodash";
import { Slider } from "@mui/material";
import { ColorPicker, useColor } from "react-color-palette";
import "react-color-palette/css";

// components
import Motion from "@/components/motion";
import Header from "@/components/header";
import Footer from "@/components/footer";
import Sidemenu from "@/components/sidemenu";
import Button from "@/components/button";
import SelectBox from "@/components/selectbox";
import DummyText from "@/components/dummytext";
import Comments from "@/components/comments";
import KakaoAdFitTopBanner from "@/components/kakaoAdFitTopBanner";
import KakaoAdFitBottomBanner from "@/components/kakaoAdFitBottomBanner";

// common
import { onMouseDown, onMouseUp, onMouseOut } from "@/libs/common";

// global
import { likes, comments } from "@/libs/global";

// types
interface SourceFont {
    name: string,
    font_family: string
}

function DetailPage({params}: any) {
    const { theme, userAgent, randomNum, user } = params;
    const font = params.font[0];
    const fontLiked = user ? font.liked_user.some((obj: likes) => obj.user_id === user.id) : false;
    const fontComments = font.comments.filter((obj: comments) => obj.is_deleted === false);

    // 디바이스 체크
    const isMac: boolean = userAgent.includes("Mac OS") ? true : false;
    const isMobile = /iPhone|iPad|iPod|Android/i.test(userAgent);

    // states
    const [alertDisplay, setAlertDisplay] = useState<boolean>(false);
    const [hoverDisplay, setHoverDisplay] = useState<boolean>(true);
    const [sourceFonts, setSourceFonts] = useState<any>(null);
    const [likedInput, setLikedInput] = useState<boolean>(fontLiked ? true : false);
    const [likedNum, setLikedNum] = useState<number>(font.liked_user.length);
    const [webFont, setWebFont] = useState("CSS");
    const [text, setText] = useState("");
    const [fontSize, setFontSize] = useState<number>(28);
    const [lineHeight, setLineHeight] = useState<number>(1.5);
    const [letterSpacing, setLetterSpacing] = useState<number>(0);
    const [fontUnit, setFontUnit] = useState<string>("px");
    const [lineHeightUnit, setLineHeightUnit] = useState<string>("em");
    const [letterSpacingUnit, setLetterSpacingUnit] = useState<string>("em");
    const [textColor, setTextColor] = useColor(theme === "dark" ? "#FFFFFF" : "#202124");
    const [bgColor, setBgColor] = useColor(theme === "dark" ? "#2E3134" : "#F2F1F6");
    const [expand, setExpand] = useState<boolean>(isMobile ? false : true);
    const [enableReset, setEnableReset] = useState<boolean>(false);

    // refs
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    /** 조회수 업데이트 */
    useEffect(() => {
        const viewUpdate = async () => {
            await fetch("/api/post/updateview", { method: "POST", body: JSON.stringify(font) });
        }
        if (!window.location.href.includes("localhost") && !window.location.href.includes("127.0.0.1")) {
            viewUpdate();
        }
    }, [font]);

    // 제작사의 다른 폰트 가져오기
    useEffect(() => {
        const fetchFonts = async () => {
            const fetchFontsUrl = `/api/fontsearch?action=post&name=${font.name}&source=${font.source}`;
            const fetchFontsOptions = {
                method: "GET",
                headers: { "Content-Type": "application/json" }
            }
            await fetch(fetchFontsUrl, fetchFontsOptions)
            .then(res  => res.json())
            .then(async (data) => {
                setSourceFonts(data.fonts);
            })
            .catch(err => console.log(err));
        }
        fetchFonts();
    }, [font.name, font.source]);

    /** 헤더 테마 변경 시 color picker 리셋 */
    const resetColor = (theme: string) => {
        if (theme === "dark") {
            setTextColor({hex: "#FFFFFF", rgb: {r: 233, g: 234, b: 238, a: 1}, hsv: {h: 228, s: 2.1, v: 93.3, a: 1}});
            setBgColor({hex: "#2E3134", rgb: {r: 23, g: 24, b: 27, a: 1}, hsv: {h: 225, s: 14.8, v: 10.6, a: 1}});
        } else {
            setTextColor({hex: "#202124", rgb: {r: 233, g: 234, b: 238, a: 1}, hsv: {h: 228, s: 2.1, v: 93.3, a: 1}});
            setBgColor({hex: "#F2F1F6", rgb: {r: 53, g: 54, b: 58, a: 1}, hsv: {h: 228, s: 8.6, v: 22.7, a: 1}});
        }
    }

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

            const url = "/api/post/updatelike";
            const options = {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    action: e.target.checked ? "increase" : "decrease",
                    code: thisId,
                    id: user.id,
                    email: user.email,
                    provider: user.provider,
                })
            }

            await fetch(url, options)
            .then(res => res.json())
            .then(data => {
                // 좋아요 시 좋아요 수 변경
                setLikedNum(data.num);

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
        const pre = document.getElementsByClassName("cdn-pre")[0] as HTMLPreElement;
        const copyBtn = document.getElementsByClassName("copy_btn")[0] as HTMLLIElement;
        const copyChkBtn = document.getElementsByClassName("copy_chk_btn")[0] as SVGSVGElement;

        window.navigator.clipboard.writeText(pre.innerText);

        copyBtn.style.display = 'none';
        copyChkBtn.style.display = 'flex';
        setTimeout(function() {
            copyBtn.style.display = 'flex';
            copyChkBtn.style.display = 'none';
        },1000);
    }

    /** 폰트 미리보기 텍스트 체인지 이벤트 */
    const handleFontChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setText(e.target.value);
    }

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.setAttribute("style", "height: 0");
            textareaRef.current.setAttribute("style", `height: ${textareaRef.current.scrollHeight}px`);
        }
    }, [text]);

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

    /** 사이드 메뉴 필터 초기화 */
    const handleReset = () => {
        // 문구 리셋
        setText("");

        // 크기 리셋
        setFontSize(28);
        setLineHeight(1.5);
        setLetterSpacing(0);
        setFontUnit("px");
        setLineHeightUnit("em");
        setLetterSpacingUnit("em");

        // 펼치기 접기
        const rcpText = document.getElementById("rcp-text") as HTMLInputElement;
        const rcpBg = document.getElementById("rcp-bg") as HTMLInputElement;
        rcpText.checked = false;
        rcpBg.checked = false;

        // 컬러 리셋
        const html = document.getElementsByTagName("html")[0];
        if (html.classList.contains("dark")) {
            setTextColor({hex: "#FFFFFF", rgb: {r: 233, g: 234, b: 238, a: 1}, hsv: {h: 228, s: 2.1, v: 93.3, a: 1}});
            setBgColor({hex: "#2E3134", rgb: {r: 23, g: 24, b: 27, a: 1}, hsv: {h: 225, s: 14.8, v: 10.6, a: 1}});
        }
        else {
            setTextColor({hex: "#202124", rgb: {r: 233, g: 234, b: 238, a: 1}, hsv: {h: 228, s: 2.1, v: 93.3, a: 1}});
            setBgColor({hex: "#F2F1F6", rgb: {r: 53, g: 54, b: 58, a: 1}, hsv: {h: 228, s: 8.6, v: 22.7, a: 1}});
        }
    }

    /** 사이드 메뉴 필터 초기화 활성화/비활성화 */
    useEffect(() => {
        const html = document.getElementsByTagName("html")[0];
        if (html.classList.contains("dark")) {
            if (text !== "" || fontSize !== 28 || lineHeight !== 1.5 || letterSpacing !== 0 || fontUnit !== "px" || lineHeightUnit !== "em" || letterSpacingUnit !== "em" || textColor.hex !== "#FFFFFF" || bgColor.hex !== "#2E3134") {
                setEnableReset(true);
            } else {
                setEnableReset(false);
            }
        } else {
            if (text !== "" || fontSize !== 28 || lineHeight !== 1.5 || letterSpacing !== 0 || fontUnit !== "px" || lineHeightUnit !== "em" || letterSpacingUnit !== "em" || textColor.hex !== "#202124" || bgColor.hex !== "#F2F1F6") {
                setEnableReset(true);
            } else {
                setEnableReset(false);
            }
        }
    }, [text, fontSize, lineHeight, letterSpacing, fontUnit, lineHeightUnit, letterSpacingUnit, enableReset, theme, textColor.hex, bgColor.hex]);

    /** 사이드 메뉴 펼치기/접기 */
    const handleExpand = (e: React.ChangeEvent<HTMLInputElement>) => { setExpand(e.target.checked); }

    // 라이센스 본문
    useEffect(() => {
        const license = document.getElementById("license") as HTMLDivElement;
        license.innerHTML = font.license;
    }, [font.license]);

    return (
        <>
            {/* Head 부분*/}
            <NextSeo 
                title={font.name + " · 폰트 아카이브 · 상업용 무료 한글 폰트 저장소"}
                description={`폰트 아카이브 · 상업용 무료 한글 폰트 저장소 | 폰트 이름: ${font.name}, 폰트 언어: ${font.lang === "KR" ? "한글" : "영어"}, 폰트 생성 날짜: ${font.date}, 조회수: ${font.view}, 좋아요수: ${font.like}, 폰트체: ${font.font_family}, 폰트 형태: ${font.font_type}, 폰트 출처: ${font.source}, 라이센스 본문: ${font.license}`}
                openGraph={{
                    title: font.name + " · 폰트 아카이브 · 상업용 무료 한글 폰트 저장소",
                    description: `폰트 아카이브 · 상업용 무료 한글 폰트 저장소 | 폰트 이름: ${font.name}, 폰트 언어: ${font.lang === "KR" ? "한글" : "영어"}, 폰트 생성 날짜: ${font.date}, 조회수: ${font.view}, 좋아요수: ${font.like}, 폰트체: ${font.font_family}, 폰트 형태: ${font.font_type}, 폰트 출처: ${font.source}, 라이센스 본문: ${font.license}`,
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
                        authors: ["태돈(taedonn)"],
                        tags: [
                            font.name,
                            font.font_family,
                            font.font_type,
                            font.source,
                            "폰트 아카이브",
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
                page={"post"}
                handleThemeChange={resetColor}
            />

            {/* 로그인 중이 아닐 때 좋아요 alert창 팝업 */}
            {
                alertDisplay
                    && <div className='fixed z-20 top-6 right-8 tlg:right-4 w-max h-16 px-4 flex justify-between items-center rounded-lg text-sm text-l-2 dark:text-white bg-l-e dark:bg-d-4'>
                        <div className='flex flex-row justify-start items-center'>
                            <i className="text-lg text-h-1 dark:text-f-8 bi bi-stars"></i>
                            <div className='ml-3'>
                                좋아요 기능은 로그인 시 이용 가능합니다. <br/>
                                <Link href="/user/login" className='text-h-1 dark:text-f-8 hover:underline'>로그인 하러 가기</Link>
                            </div>
                        </div>
                        <div onClick={handleAlertClose} onMouseDown={e => onMouseDown(e, 0.85, true)} onMouseUp={onMouseUp} onMouseOut={onMouseOut} className='flex justify-center items-center ml-3 cursor-pointer'>
                            <i className="text-lg fa-solid fa-xmark"></i>
                        </div>
                    </div>
            }

            {/* 메인 */}
            <Motion
                initialOpacity={0}
                animateOpacity={1}
                exitOpacity={0}
                transitionType="spring"
            >
                <div className="w-full flex">
                    <Sidemenu
                        expand={expand}
                        handleExpand={handleExpand}
                        enableReset={enableReset}
                        handleReset={handleReset}
                    >
                        <div className="text-l-2 dark:text-white">
                            <h2 className="font-bold mb-4">폰트 미리보기</h2>
                            <textarea
                                id="text-p"
                                className="custom-sm-scrollbar resize-none w-full h-36 px-3.5 py-3 text-sm rounded-lg border-2 border-transparent focus:border-h-1 focus:dark:border-f-8 dark:text-white bg-h-e dark:bg-d-4 placeholder-l-5 dark:placeholder-d-c"
                                placeholder="원하는 문구를 적어보세요."
                                onChange={handleFontChange}
                                value={text}
                            ></textarea>
                            <div className="w-full mt-3 flex flex-col gap-5">
                                <div className="w-full">
                                    <div className="w-full flex items-center mb-1">
                                        <SelectBox
                                            height={3.5}
                                            title="폰트 크기"
                                            icon="none"
                                            value="font-size"
                                            select={fontUnit}
                                            options={[
                                                { value: "px", name: "px" },
                                                { value: "pt", name: "pt" },
                                            ]}
                                            optionChange={handleFontUnit}
                                        />
                                    </div>
                                    <div className="w-full px-4 flex gap-2 items-center">
                                        <div className="text-center text-sm">{fontUnit === "px" ? 12 : 9}{fontUnit}</div>
                                        <Slider
                                            className="font-size-slider"
                                            aria-label="font-size-slider"
                                            valueLabelDisplay="auto"
                                            valueLabelFormat={fontSize + fontUnit}
                                            onChange={(e, v) => setFontSize(Number(v))}
                                            defaultValue={28}
                                            value={fontSize}
                                            min={fontUnit === "px" ? 12 : 9}
                                            max={fontUnit === "px" ? 64 : 48}
                                        />
                                        <div className="text-center text-sm">{fontUnit === "px" ? 64 : 48}{fontUnit}</div>
                                    </div>
                                </div>
                                <div className="w-full">
                                    <div className="w-full flex items-center mb-1">
                                        <SelectBox
                                            height={3.5}
                                            title="행간"
                                            icon="none"
                                            value="line-height"
                                            select={lineHeightUnit}
                                            options={[
                                                { value: "em", name: "em" },
                                                { value: "px", name: "px" },
                                                { value: "%", name: "%" },
                                            ]}
                                            optionChange={handleLineHeightUnit}
                                        />
                                    </div>
                                    <div className="w-full px-4 flex gap-2 items-center">
                                        <div className="text-center text-sm">{lineHeightUnit === "em" ? 1 : lineHeightUnit === "px" ? 12 : 50}{lineHeightUnit}</div>
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
                                        <div className="text-center text-sm">{lineHeightUnit === "em" ? 3 : lineHeightUnit === "px" ? 64 : 200}{lineHeightUnit}</div>
                                    </div>
                                </div>
                                <div className="w-full">
                                    <div className="w-full flex items-center mb-1">
                                        <SelectBox
                                            height={3.5}
                                            title="자간"
                                            icon="none"
                                            value="letter-spacing"
                                            select={letterSpacingUnit}
                                            options={[
                                                { value: "em", name: "em" },
                                                { value: "px", name: "px" },
                                            ]}
                                            optionChange={handleLetterSpacingUnit}
                                        />
                                    </div>
                                    <div className="w-full px-4 flex gap-2 items-center">
                                        <div className="text-center text-sm">{letterSpacingUnit === "em" ? -1 :  -10}{letterSpacingUnit}</div>
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
                                        <div className="text-center text-sm">{letterSpacingUnit === "em" ? 1 : 10}{letterSpacingUnit}</div>
                                    </div>
                                </div>
                            </div>
                            <div className="w-full mt-5">
                                <input id="rcp-text" type="checkbox" className="peer hidden"/>
                                <label htmlFor="rcp-text" className="group w-full h-14 px-4 flex justify-between items-center rounded-lg cursor-pointer border-2 border-transparent lg:hover:border-l-e lg:hover:dark:border-d-4 lg:peer-checked:hover:bg-transparent lg:peer-checked:dark:hover:bg-transparent peer-checked:border-h-1 peer-checked:dark:border-f-8 lg:hover:bg-l-e lg:hover:dark:bg-d-4">
                                    <div className="font-medium selection:bg-transparent">폰트색 
                                        <span className="inline peer-checked:group-[]:hidden ml-1 font-medium text-h-1 dark:text-f-8">[펼치기]</span>
                                        <span className="hidden peer-checked:group-[]:inline ml-1 font-medium text-h-1 dark:text-f-8">[접기]</span>
                                    </div>
                                    <i className="peer-checked:group-[]:rotate-180 duration-100 fa-solid fa-angle-down"></i>
                                </label>
                                <div className="color-picker w-full pt-3 hidden peer-checked:block">
                                    <ColorPicker height={80} color={textColor} onChange={setTextColor} hideInput={["hsv"]}/>
                                </div>
                            </div>
                            <div className="w-full mt-3">
                                <input id="rcp-bg" type="checkbox" className="peer hidden"/>
                                <label htmlFor="rcp-bg" className="group w-full h-14 px-4 flex justify-between items-center rounded-lg cursor-pointer border-2 border-transparent lg:hover:border-l-e lg:hover:dark:border-d-4 lg:peer-checked:hover:bg-transparent lg:peer-checked:dark:hover:bg-transparent peer-checked:border-h-1 peer-checked:dark:border-f-8 lg:hover:bg-l-e lg:hover:dark:bg-d-4">
                                    <div className="font-medium selection:bg-transparent">배경색 
                                        <span className="inline peer-checked:group-[]:hidden ml-1 font-medium text-h-1 dark:text-f-8">[펼치기]</span>
                                        <span className="hidden peer-checked:group-[]:inline ml-1 font-medium text-h-1 dark:text-f-8">[접기]</span>
                                    </div>
                                    <i className="peer-checked:group-[]:rotate-180 duration-100 fa-solid fa-angle-down"></i>
                                </label>
                                <div className="color-picker w-full pt-3 hidden peer-checked:block">
                                    <ColorPicker height={80} color={bgColor} onChange={setBgColor} hideInput={["hsv"]}/>
                                </div>
                            </div>
                            <div className="w-full h-px mt-4 mb-8 bg-l-b dark:bg-d-6"></div>
                            <h2 className="font-bold mb-4">제작사의 다른 폰트</h2>
                            <div className="w-full text-sm">
                                {
                                    sourceFonts && sourceFonts.length !== 0
                                        ? <div className="flex flex-col pt-2">
                                            {
                                                sourceFonts.map((font: SourceFont) => {
                                                    return <Link key={font.name} href={`/post/${font.font_family.replaceAll(" ", "+")}`} className="group w-full relative px-4 py-3 border-l-[2px] border-l-b dark:border-d-6 lg:hover:border-h-1 lg:hover:dark:border-f-8 lg:hover:text-h-1 lg:hover:dark:text-f-8 lg:hover:bg-l-e lg:hover:dark:bg-d-4">
                                                        {font.name}
                                                        <i className="hidden lg:group-hover:inline absolute right-4 top-1/2 -translate-y-1/2 fa-solid fa-angle-right"></i>
                                                    </Link>
                                                })
                                            }
                                        </div>
                                        : <>제작사의 다른 폰트가 없습니다.</>
                                }
                            </div>
                        </div>
                    </Sidemenu>
                    <div className={`${expand ? "w-full lg:w-[calc(100%-320px)]" : "w-full"} relative mt-20 px-4 lg:px-8 text-l-2 dark:text-white`}>
                        <link href={font.cdn_url} rel="stylesheet" type="text/css" itemProp="url"></link>
                        <div className="w-full flex flex-col">
                            <div className="mb-4 flex gap-4 items-center">
                                <div style={{fontFamily:'"'+font.font_family+'"'}} className="text-3xl lg:text-4xl font-medium">{font.name}</div>
                                <div className='group relative'>
                                    <input onClick={handleLikeClick} onChange={handleLikeChange} type="checkbox" id={font.code.toString()} className='peer hidden' defaultChecked={likedInput}/>
                                    <label htmlFor={font.code.toString()} onMouseDown={e => onMouseDown(e, 0.85, true)} onMouseUp={onMouseUp} onMouseOut={onMouseOut} className='group block cursor-pointer'>
                                        <i className="block peer-checked:group-[]:hidden text-xl bi bi-heart"></i>
                                        <i className="hidden peer-checked:group-[]:block text-xl text-h-r bi bi-heart-fill"></i>
                                    </label>
                                    <div className={`${hoverDisplay === true ? 'lg:group-hover:block' : 'lg:group-hover:hidden'} w-max absolute z-10 left-1/2 top-8 px-3 py-1.5 text-[0.813rem] leading-none origin-top rounded hidden lg:group-hover:animate-hover-delay bg-l-5 dark:bg-d-4 text-white dark:text-f-8 dark:drop-shadow-dark selection:bg-transparent`}>{likedInput ? "좋아요 해제" : "좋아요"}</div>
                                </div>
                            </div>
                            <div className="mb-4 flex flex-col lg:flex-row gap-2 lg:gap-4 lg:items-center">
                                <div className="flex gap-2 tlg:text-sm">
                                    <span>제작</span>
                                    <Link href={{pathname: "/", query: {search: font.source}}} className="relative group border-b border-h-1 dark:border-f-8 text-h-1 dark:text-f-8">
                                        {font.source}
                                        <div className="w-max absolute z-10 left-1/2 top-8 px-3 py-1.5 text-[0.813rem] leading-none origin-top rounded hidden lg:group-hover:block lg:group-hover:animate-hover-delay bg-l-5 dark:bg-d-4 text-white dark:text-f-8 dark:drop-shadow-dark selection:bg-transparent">제작사의 다른 폰트 보기</div>
                                    </Link>
                                </div>
                                <div className="flex gap-3 lg:gap-4">
                                    <div className={`${font.lang === 'KR' ? '' : 'font-sans'} tlg:text-sm`}>형태<span className="text-l-5 dark:text-d-c ml-2">{font.font_type === "Sans Serif" ? "고딕" : (font.font_type === "Serif" ? "명조" : (font.font_type === "Hand Writing" ? "손글씨" : (font.font_type === "Display" ? "장식체" : "픽셀체")))}</span></div>
                                    <div className={`${font.lang === 'KR' ? '' : 'font-sans'} tlg:text-sm`}>조회수<span className="text-l-5 dark:text-d-c ml-2">{formatNumber(font.view)}</span></div>
                                    <div className={`${font.lang === 'KR' ? '' : 'font-sans'} tlg:text-sm`}>좋아요 수<span className="text-l-5 dark:text-d-c ml-2">{formatNumber(likedNum)}</span></div>
                                </div>
                            </div>

                            {/* 카카오 애드핏 상단 띠배너 */}
                            <div className="w-max">
                                <KakaoAdFitTopBanner
                                    marginBottom={1}
                                />
                            </div>

                            <div className="w-full h-px mb-4 bg-l-b dark:bg-d-6"></div>
                        </div>
                        <div className="flex gap-2 justify-start items-center mb-16 lg:mb-20">
                            <div className="w-40">
                                <Button>
                                    <Link aria-label="source-link" href={font.source_link} target="_blank" rel="noopener noreferrer" className="w-full h-full flex gap-2.5 justify-center items-center">
                                        <i className="text-sm bi bi-send"></i>
                                        원 배포처 링크
                                    </Link>
                                </Button>
                            </div>
                            {
                                font.license_ofl !== "N"
                                    && <div className="w-40">
                                        <Button color="light">
                                            <Link aria-label="github-source-link" href={font.github_link} className="w-full h-full flex gap-2.5 justify-center items-center">
                                                <i className="bi bi-download"></i>
                                                파일 다운로드
                                            </Link>
                                        </Button>
                                    </div>
                            }
                        </div>
                        {
                            font.license_embed === "N" || font.license_ofl === "N"
                            ? <></>
                            : <div className="w-full max-w-[58rem] flex flex-col mb-16 lg:mb-20">
                                <h2 className="text-2xl font-medium mb-6">웹 폰트</h2>
                                <div className="w-full mb-4 gap-2 flex flex-wrap items-center text-sm">
                                    <input onChange={handleWebFont} type="radio" id="cdn_css" name="cdn" value="CSS" className="peer/css hidden" defaultChecked/>
                                    <label htmlFor="cdn_css" onMouseDown={e => onMouseDown(e, 0.9, true)} onMouseUp={onMouseUp} onMouseOut={onMouseOut} className="w-[6.5rem] h-9 rounded-full flex justify-center items-center cursor-pointer peer-checked/css:bg-h-1 peer-checked/css:dark:bg-f-8 peer-checked/css:text-white peer-checked/css:dark:text-d-2 bg-l-f lg:hover:bg-l-e dark:bg-d-3 lg:dark:hover:bg-d-4">CSS</label>
                                    <input onChange={handleWebFont} type="radio" id="cdn_link" name="cdn" value="link" className="peer/link hidden"/>
                                    <label htmlFor="cdn_link" onMouseDown={e => onMouseDown(e, 0.9, true)} onMouseUp={onMouseUp} onMouseOut={onMouseOut} className="w-[6.5rem] h-9 rounded-full flex justify-center items-center cursor-pointer peer-checked/link:bg-h-1 peer-checked/link:dark:bg-f-8 peer-checked/link:text-white peer-checked/link:dark:text-d-2 bg-l-f lg:hover:bg-l-e dark:bg-d-3 lg:dark:hover:bg-d-4">&#60;link/&#62;</label>
                                    <input onChange={handleWebFont} type="radio" id="cdn_import" name="cdn" value="import" className="peer/import hidden"/>
                                    <label htmlFor="cdn_import" onMouseDown={e => onMouseDown(e, 0.9, true)} onMouseUp={onMouseUp} onMouseOut={onMouseOut} className="w-[6.5rem] h-9 rounded-full flex justify-center items-center cursor-pointer peer-checked/import:bg-h-1 peer-checked/import:dark:bg-f-8 peer-checked/import:text-white peer-checked/import:dark:text-d-2 bg-l-f lg:hover:bg-l-e dark:bg-d-3 lg:dark:hover:bg-d-4">@import</label>
                                    <input onChange={handleWebFont} type="radio" id="cdn_font_face" name="cdn" value="font-face" className="peer/font-face hidden"/>
                                    <label htmlFor="cdn_font_face" onMouseDown={e => onMouseDown(e, 0.9, true)} onMouseUp={onMouseUp} onMouseOut={onMouseOut} className="w-[6.5rem] h-9 rounded-full flex justify-center items-center cursor-pointer peer-checked/font-face:bg-h-1 peer-checked/font-face:dark:bg-f-8 peer-checked/font-face:text-white peer-checked/font-face:dark:text-d-2 bg-l-f lg:hover:bg-l-e dark:bg-d-3 lg:dark:hover:bg-d-4">@font-face</label>
                                </div>
                                <div className="w-full tlg:text-sm rounded-lg bg-l-f dark:bg-d-3">
                                    {
                                        webFont === "CSS"
                                        ? <div className="w-full relative pl-6 lg:pl-8 pr-[3.75rem] lg:pr-16 overflow-hidden">
                                            <div className="cdn-pre no-scrollbar w-full h-16 flex items-center overflow-x-auto"><pre className="font-sans">{font.cdn_css}</pre></div>
                                            <div className="w-7 h-7 lg:w-8 lg:h-8 absolute z-10 right-4 top-1/2 -translate-y-1/2 rounded-md cursor-pointer">
                                                <div onClick={copyOnClick} className="copy_btn w-full h-full flex justify-center items-center rounded-md lg:hover:bg-h-1/20 lg:hover:dark:bg-f-8/20 text-h-1 dark:text-f-8">
                                                    <i className="text-base bi bi-clipboard"></i>
                                                </div>
                                                <div className="copy_chk_btn w-full h-full hidden justify-center items-center rounded-md bg-h-1/20 dark:bg-f-8/20 text-h-1 dark:text-f-8">
                                                    <i className="text-base bi bi-check-lg"></i>
                                                </div>
                                            </div>
                                        </div>
                                        : ( webFont === "link"
                                            ? <div className="w-full relative pl-6 lg:pl-8 pr-[3.75rem] lg:pr-16 overflow-hidden">
                                                <div className="cdn-pre no-scrollbar w-full h-16 flex items-center overflow-x-auto"><pre className="font-sans">{font.cdn_link}</pre></div>
                                                <div className="w-7 h-7 lg:w-8 lg:h-8 absolute z-10 right-4 top-1/2 -translate-y-1/2 rounded-md cursor-pointer">
                                                    <div onClick={copyOnClick} className="copy_btn w-full h-full flex justify-center items-center rounded-md lg:hover:bg-h-1/20 lg:hover:dark:bg-f-8/20 text-h-1 dark:text-f-8">
                                                        <i className="text-base bi bi-clipboard"></i>
                                                    </div>
                                                    <div className="copy_chk_btn w-full h-full hidden justify-center items-center rounded-md bg-h-1/20 dark:bg-f-8/20 text-h-1 dark:text-f-8">
                                                        <i className="text-base bi bi-check-lg"></i>
                                                    </div>
                                                </div>
                                            </div>
                                            : ( webFont === "import"
                                                ? <div className="w-full relative pl-6 lg:pl-8 pr-[3.75rem] lg:pr-16 overflow-hidden">
                                                    <div className="cdn-pre no-scrollbar w-full h-16 flex items-center overflow-x-auto"><pre className="font-sans">{font.cdn_import}</pre></div>
                                                    <div className="w-7 h-7 lg:w-8 lg:h-8 absolute z-10 right-4 top-1/2 -translate-y-1/2 rounded-md cursor-pointer">
                                                        <div onClick={copyOnClick} className="copy_btn w-full h-full flex justify-center items-center rounded-md lg:hover:bg-h-1/20 lg:hover:dark:bg-f-8/20 text-h-1 dark:text-f-8">
                                                            <i className="text-base bi bi-clipboard"></i>
                                                        </div>
                                                        <div className="copy_chk_btn w-full h-full hidden justify-center items-center rounded-md bg-h-1/20 dark:bg-f-8/20 text-h-1 dark:text-f-8">
                                                            <i className="text-base bi bi-check-lg"></i>
                                                        </div>
                                                    </div>
                                                </div>
                                                : <div className="w-full relative pl-6 lg:pl-8 pr-[3.75rem] lg:pr-16 overflow-hidden">
                                                    <div className="cdn-pre no-scrollbar w-full h-auto py-[1.375rem] flex items-center overflow-auto whitespace-nowrap"><pre id="cdn-font-face" style={{tabSize: 8}} className="font-sans">{font.cdn_font_face}</pre></div>
                                                    <div className="w-7 h-7 lg:w-8 lg:h-8 absolute z-10 right-4 top-8 -translate-y-1/2 cursor-pointer">
                                                        <div onClick={copyOnClick} className="copy_btn w-full h-full flex justify-center items-center rounded-md lg:hover:bg-h-1/20 lg:hover:dark:bg-f-8/20 text-h-1 dark:text-f-8">
                                                            <i className="text-base bi bi-clipboard"></i>
                                                        </div>
                                                        <div className="copy_chk_btn w-full h-full hidden justify-center items-center rounded-md bg-h-1/20 dark:bg-f-8/20 text-h-1 dark:text-f-8">
                                                            <i className="text-base bi bi-check-lg"></i>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        )
                                    }
                                </div>
                            </div>
                        }
                        <div className="w-full max-w-[58rem] flex flex-col mb-16 lg:mb-20">
                            <h2 className="text-2xl font-medium mb-6">폰트 미리보기</h2>
                            <div className="w-full px-4 py-2 mb-4 border-b border-l-b dark:border-d-6">
                                <textarea ref={textareaRef} onChange={handleFontChange} value={text} placeholder="원하는 문구를 적어보세요." className="w-full h-[1.5rem] resize-none placeholder-l-5 dark:placeholder-d-c bg-transparent"/>
                            </div>
                            <div style={{backgroundColor: bgColor.hex}} className="w-full rounded-lg overflow-hidden">
                                <div className="w-full p-6 lg:p-8 flex flex-col gap-6">
                                    {
                                        font.font_weight[0] === "Y"
                                        && <div>
                                            <div style={{color: textColor.hex}}>Thin 100</div>
                                            <div className="w-full relative py-2">
                                                <div style={{backgroundImage: `linear-gradient(to left, ${bgColor.hex} 25%, #FFFFFF00)`}} className='w-44 h-full absolute -right-6 lg:-right-8 top-1/2 -translate-y-1/2'></div>
                                                <pre style={{fontFamily:'"'+font.font_family+'"', fontSize: convertedFontSize, lineHeight: lineHeight + lineHeightUnit, letterSpacing: letterSpacing + letterSpacingUnit, fontWeight:"100", color: textColor.hex}} className="w-full"><DummyText lang={font.lang} text={text} num={randomNum}/></pre>
                                            </div>
                                        </div>
                                    }
                                    {
                                        font.font_weight[1] === "Y"
                                        && <div>
                                            <div style={{color: textColor.hex}}>ExtraLight 200</div>
                                            <div className="w-full relative py-2">
                                                <div style={{backgroundImage: `linear-gradient(to left, ${bgColor.hex} 25%, #FFFFFF00)`}} className='w-44 h-full absolute -right-6 lg:-right-8 top-1/2 -translate-y-1/2'></div>
                                                <pre style={{fontFamily:'"'+font.font_family+'"', fontSize: convertedFontSize, lineHeight: lineHeight + lineHeightUnit, letterSpacing: letterSpacing + letterSpacingUnit, fontWeight:"200", color: textColor.hex}} className="w-full"><DummyText lang={font.lang} text={text} num={randomNum}/></pre>
                                            </div>
                                        </div>
                                    }
                                    {
                                        font.font_weight[2] === "Y"
                                        && <div>
                                            <div style={{color: textColor.hex}}>Light 300</div>
                                            <div className="w-full relative py-2">
                                                <div style={{backgroundImage: `linear-gradient(to left, ${bgColor.hex} 25%, #FFFFFF00)`}} className='w-44 h-full absolute -right-6 lg:-right-8 top-1/2 -translate-y-1/2'></div>
                                                <pre style={{fontFamily:'"'+font.font_family+'"', fontSize: convertedFontSize, lineHeight: lineHeight + lineHeightUnit, letterSpacing: letterSpacing + letterSpacingUnit, fontWeight:"300", color: textColor.hex}} className="w-full"><DummyText lang={font.lang} text={text} num={randomNum}/></pre>
                                            </div>
                                        </div>
                                    }
                                    {
                                        font.font_weight[3] === "Y"
                                        && <div>
                                            <div style={{color: textColor.hex}}>Regular 400</div>
                                            <div className="w-full relative py-2">
                                                <div style={{backgroundImage: `linear-gradient(to left, ${bgColor.hex} 25%, #FFFFFF00)`}} className='w-44 h-full absolute -right-6 lg:-right-8 top-1/2 -translate-y-1/2'></div>
                                                <pre style={{fontFamily:'"'+font.font_family+'"', fontSize: convertedFontSize, lineHeight: lineHeight + lineHeightUnit, letterSpacing: letterSpacing + letterSpacingUnit, fontWeight:"400", color: textColor.hex}} className="w-full"><DummyText lang={font.lang} text={text} num={randomNum}/></pre>
                                            </div>
                                        </div>
                                    }
                                    {
                                        font.font_weight[4] === "Y"
                                        && <div>
                                            <div style={{color: textColor.hex}}>Medium 500</div>
                                            <div className="w-full relative py-2">
                                                <div style={{backgroundImage: `linear-gradient(to left, ${bgColor.hex} 25%, #FFFFFF00)`}} className='w-44 h-full absolute -right-6 lg:-right-8 top-1/2 -translate-y-1/2'></div>
                                                <pre style={{fontFamily:'"'+font.font_family+'"', fontSize: convertedFontSize, lineHeight: lineHeight + lineHeightUnit, letterSpacing: letterSpacing + letterSpacingUnit, fontWeight:"500", color: textColor.hex}} className="w-full"><DummyText lang={font.lang} text={text} num={randomNum}/></pre>
                                            </div>
                                        </div>
                                    }
                                    {
                                        font.font_weight[5] === "Y"
                                        && <div>
                                            <div style={{color: textColor.hex}}>SemiBold 600</div>
                                            <div className="w-full relative py-2">
                                                <div style={{backgroundImage: `linear-gradient(to left, ${bgColor.hex} 25%, #FFFFFF00)`}} className='w-44 h-full absolute -right-6 lg:-right-8 top-1/2 -translate-y-1/2'></div>
                                                <pre style={{fontFamily:'"'+font.font_family+'"', fontSize: convertedFontSize, lineHeight: lineHeight + lineHeightUnit, letterSpacing: letterSpacing + letterSpacingUnit, fontWeight:"600", color: textColor.hex}} className="w-full"><DummyText lang={font.lang} text={text} num={randomNum}/></pre>
                                            </div>
                                        </div>
                                    }
                                    {
                                        font.font_weight[6] === "Y"
                                        && <div>
                                            <div style={{color: textColor.hex}}>Bold 700</div>
                                            <div className="w-full relative py-2">
                                                <div style={{backgroundImage: `linear-gradient(to left, ${bgColor.hex} 25%, #FFFFFF00)`}} className='w-44 h-full absolute -right-6 lg:-right-8 top-1/2 -translate-y-1/2'></div>
                                                <pre style={{fontFamily:'"'+font.font_family+'"', fontSize: convertedFontSize, lineHeight: lineHeight + lineHeightUnit, letterSpacing: letterSpacing + letterSpacingUnit, fontWeight:"700", color: textColor.hex}} className="w-full"><DummyText lang={font.lang} text={text} num={randomNum}/></pre>
                                            </div>
                                        </div>
                                    }
                                    {
                                        font.font_weight[7] === "Y"
                                        && <div>
                                            <div style={{color: textColor.hex}}>Heavy 800</div>
                                            <div className="w-full relative py-2">
                                                <div style={{backgroundImage: `linear-gradient(to left, ${bgColor.hex} 25%, #FFFFFF00)`}} className='w-44 h-full absolute -right-6 lg:-right-8 top-1/2 -translate-y-1/2'></div>
                                                <pre style={{fontFamily:'"'+font.font_family+'"', fontSize: convertedFontSize, lineHeight: lineHeight + lineHeightUnit, letterSpacing: letterSpacing + letterSpacingUnit, fontWeight:"800", color: textColor.hex}} className="w-full"><DummyText lang={font.lang} text={text} num={randomNum}/></pre>
                                            </div>
                                        </div>
                                    }
                                    {
                                        font.font_weight[8] === "Y"
                                        && <div>
                                            <div style={{color: textColor.hex}}>Black 900</div>
                                            <div className="w-full relative py-2">
                                                <div style={{backgroundImage: `linear-gradient(to left, ${bgColor.hex} 25%, #FFFFFF00)`}} className='w-44 h-full absolute -right-6 lg:-right-8 top-1/2 -translate-y-1/2'></div>
                                                <pre style={{fontFamily:'"'+font.font_family+'"', fontSize: convertedFontSize, lineHeight: lineHeight + lineHeightUnit, letterSpacing: letterSpacing + letterSpacingUnit, fontWeight:"900", color: textColor.hex}} className="w-full"><DummyText lang={font.lang} text={text} num={randomNum}/></pre>
                                            </div>
                                        </div>
                                    }
                                </div>
                            </div>
                        </div>
                        <div>
                            <h2 className="text-2xl font-medium mb-6">라이센스 사용 범위</h2>
                            <div className="mb-16 lg:mb-20">
                                <div className="w-full flex flex-col gap-4 items-start lg:items-stretch">
                                    <div className="w-full max-w-[58rem] rounded-lg bg-l-f dark:bg-d-3">
                                        <div className="w-full p-6 tlg:px-0 pb-3 flex flex-col gap-4 text-sm">
                                            <div className="w-full flex items-center font-medium">
                                                <div className="w-28 lg:w-32 shrink-0 text-center">카테고리</div>
                                                <div className="w-full">사용 범위</div>
                                                <div className="w-28 shrink-0 text-center">허용 여부</div>
                                            </div>
                                            <div className="w-full">
                                                <div className="w-full h-[4.5rem] flex items-center border-b border-l-d dark:border-d-6">
                                                    <div className="w-28 lg:w-32 shrink-0 flex flex-col justify-center items-center">
                                                        <i className="text-lg mb-1 fa-solid fa-print"></i>
                                                        <div>인쇄물</div>
                                                    </div>
                                                    <div className="w-full">
                                                        {
                                                            font.license_print === "Y"
                                                            ? <span className="ellipsed-text">브로슈어, 카탈로그, 전단지, 책, 신문 등 출판용 인쇄물</span>
                                                            : <span className="ellipsed-text text-h-r line-through">브로슈어, 포스터, 책, 잡지, 간판 등 출판용 인쇄물</span>
                                                        }
                                                    </div>
                                                    <div className="w-28 shrink-0 flex justify-center">
                                                        {
                                                            font.license_print === "Y"
                                                            ? <i className="text-sm fa-regular fa-circle"></i>
                                                            : ( font.license_print === "H"
                                                                ? <i className="text-lg text-h-r fa-solid fa-not-equal"></i>
                                                                : ( font.license_print === "N"
                                                                    ? <i className="text-lg text-h-r fa-solid fa-xmark"></i>
                                                                    : <></>
                                                                )
                                                            )
                                                        }
                                                    </div>
                                                </div>
                                                <div className="w-full h-[4.5rem] flex items-center border-b border-l-d dark:border-d-6">
                                                    <div className="w-28 lg:w-32 shrink-0 flex flex-col justify-center items-center">
                                                        <i className="text-lg mb-1 fa-solid fa-laptop"></i>
                                                        <div>웹 서비스</div>
                                                    </div>
                                                    <div className="w-full">
                                                        {
                                                            font.license_web === "Y"
                                                            ? <span className="ellipsed-text">웹페이지, 광고 배너, 메일, E-브로슈어, 웹서버용 폰트 등</span>
                                                            : <span className="ellipsed-text text-h-r line-through">웹페이지, 광고 배너, 메일, E-브로슈어, 웹서버용 폰트 등</span>
                                                        }
                                                    </div>
                                                    <div className="w-28 shrink-0 flex justify-center">
                                                        {
                                                            font.license_web === "Y"
                                                            ? <i className="text-sm fa-regular fa-circle"></i>
                                                            : ( font.license_web === "H"
                                                            ? <i className="text-lg text-h-r fa-solid fa-not-equal"></i>
                                                                : ( font.license_web === "N"
                                                                    ? <i className="text-lg text-h-r fa-solid fa-xmark"></i>
                                                                    : <></>
                                                                )
                                                            )
                                                        }
                                                    </div>
                                                </div>
                                                <div className="w-full h-[4.5rem] flex items-center border-b border-l-d dark:border-d-6">
                                                    <div className="w-28 lg:w-32 shrink-0 flex flex-col justify-center items-center">
                                                        <i className="text-lg mb-1 fa-solid fa-film"></i>
                                                        <div>영상물</div>
                                                    </div>
                                                    <div className="w-full">
                                                        {
                                                            font.license_video === "Y"
                                                            ? <span className="ellipsed-text">방송 및 영상물 자막, 영상 광고, 영화 오프닝/엔딩크레딧 자막 등</span>
                                                            : <span className="ellipsed-text text-h-r line-through">방송 및 영상물 자막, 영상 광고, 영화 오프닝/엔딩크레딧 자막 등</span>
                                                        }
                                                    </div>
                                                    <div className="w-28 shrink-0 flex justify-center">
                                                        {
                                                            font.license_video === "Y"
                                                            ? <i className="text-sm fa-regular fa-circle"></i>
                                                            : ( font.license_video === "H"
                                                                ? <i className="text-lg text-h-r fa-solid fa-not-equal"></i>
                                                                : ( font.license_video === "N"
                                                                    ? <i className="text-lg text-h-r fa-solid fa-xmark"></i>
                                                                    : <></>
                                                                )
                                                            )
                                                        }
                                                    </div>
                                                </div>
                                                <div className="w-full h-[4.5rem] flex items-center border-b border-l-d dark:border-d-6">
                                                    <div className="w-28 lg:w-32 shrink-0 flex flex-col justify-center items-center">
                                                        <i className="text-lg mb-1 fa-solid fa-cube"></i>
                                                        <div>포장지</div>
                                                    </div>
                                                    <div className="w-full">
                                                        {
                                                            font.license_package === "Y"
                                                            ? <span className="ellipsed-text">판매용 상품의 패키지</span>
                                                            : <span className="ellipsed-text text-h-r line-through">판매용 상품의 패키지</span>
                                                        }
                                                    </div>
                                                    <div className="w-28 shrink-0 flex justify-center">
                                                        {
                                                            font.license_package === "Y"
                                                            ? <i className="text-sm fa-regular fa-circle"></i>
                                                            : ( font.license_package === "H"
                                                                ? <i className="text-lg text-h-r fa-solid fa-not-equal"></i>
                                                                : ( font.license_package === "N"
                                                                    ? <i className="text-lg text-h-r fa-solid fa-xmark"></i>
                                                                    : <></>
                                                                )
                                                            )
                                                        }
                                                    </div>
                                                </div>
                                                <div className="w-full h-[4.5rem] flex items-center border-b border-l-d dark:border-d-6">
                                                    <div className="w-28 lg:w-32 shrink-0 flex flex-col justify-center items-center">
                                                        <i className="text-lg mb-1 fa-solid fa-code"></i>
                                                        <div>임베딩</div>
                                                    </div>
                                                    <div className="w-full">
                                                        {
                                                            font.license_embed === "Y"
                                                            ? <span className="ellipsed-text">웹사이트 및 프로그램 서버 내 폰트 탑재, E-book 제작</span>
                                                            : <span className="ellipsed-text text-h-r line-through">웹사이트 및 프로그램 서버 내 폰트 탑재, E-book 제작</span>
                                                        }
                                                    </div>
                                                    <div className="w-28 shrink-0 flex justify-center">
                                                        {
                                                            font.license_embed === "Y"
                                                            ? <i className="text-sm fa-regular fa-circle"></i>
                                                            : <i className="text-lg text-h-r fa-solid fa-xmark"></i>
                                                        }
                                                    </div>
                                                </div>
                                                <div className="w-full h-[4.5rem] flex items-center border-b border-l-d dark:border-d-6">
                                                    <div className="w-28 lg:w-32 shrink-0 flex flex-col justify-center items-center">
                                                        <i className="text-lg mb-1 fa-regular fa-building"></i>
                                                        <div>BI/CI</div>
                                                    </div>
                                                    <div className="w-full">
                                                        {
                                                            font.license_bici === "Y"
                                                            ? <span className="ellipsed-text">회사명, 브랜드명, 상품명, 로고, 마크, 슬로건, 캐치프레이즈</span>
                                                            : <span className="ellipsed-text text-h-r line-through">회사명, 브랜드명, 상품명, 로고, 마크, 슬로건, 캐치프레이즈</span>
                                                        }
                                                    </div>
                                                    <div className="w-28 shrink-0 flex justify-center">
                                                        {
                                                            font.license_bici === "Y"
                                                            ? <i className="text-sm fa-regular fa-circle"></i>
                                                            : ( font.license_bici === "H"
                                                                ? <i className="text-lg text-h-r fa-solid fa-not-equal"></i>
                                                                : ( font.license_bici === "N"
                                                                    ? <i className="text-lg text-h-r fa-solid fa-xmark"></i>
                                                                    : <></>
                                                                )
                                                            )
                                                        }
                                                    </div>
                                                </div>
                                                <div className="w-full h-[4.5rem] flex items-center border-b border-l-d dark:border-d-6">
                                                    <div className="w-28 lg:w-32 shrink-0 flex flex-col justify-center items-center">
                                                        <i className="text-lg mb-1 fa-solid fa-lock-open"></i>
                                                        <div>OFL</div>
                                                    </div>
                                                    <div className="w-full">
                                                        {
                                                            font.license_ofl === "Y"
                                                            ? <span className="ellipsed-text">폰트 파일의 수정, 편집 및 재배포 가능. 폰트 파일의 유료 판매는 금지</span>
                                                            : font.license_ofl === "H"
                                                                ? <span className="ellipsed-text">폰트 파일의 수정, 편집 및 유료 판매 금지</span>
                                                                : <span className="ellipsed-text text-h-r line-through">폰트 파일의 수정, 편집 재배포 및 유료 판매 금지</span>
                                                        }
                                                    </div>
                                                    <div className="w-28 shrink-0 flex justify-center">
                                                        {
                                                            font.license_ofl === "Y"
                                                            ? <i className="text-sm fa-regular fa-circle"></i>
                                                            : font.license_ofl === "H"
                                                                ? <i className="text-lg text-h-r fa-solid fa-not-equal"></i>
                                                                : <i className="text-lg text-h-r fa-solid fa-xmark"></i>
                                                        }
                                                    </div>
                                                </div>
                                                <div className="w-full h-[4.5rem] flex items-center border-b border-l-d dark:border-d-6">
                                                    <div className="w-28 lg:w-32 shrink-0 flex flex-col justify-center items-center">
                                                        <i className="text-lg mb-1 fa-solid fa-user-check"></i>
                                                        <div>용도</div>
                                                    </div>
                                                    <div className="w-full">
                                                        {
                                                            font.license_purpose === "Y"
                                                            ? <span className="ellipsed-text">개인적, 상업적 용도 모두 사용 가능</span>
                                                            : <span className="ellipsed-text text-h-r line-through">개인적 용도 사용 가능, 상업적 용도 사용 금지</span>
                                                        }
                                                    </div>
                                                    <div className="w-28 shrink-0 flex justify-center">
                                                        {
                                                            font.license_purpose === "Y"
                                                            ? <i className="text-sm fa-regular fa-circle"></i>
                                                            : <i className="text-lg text-h-r fa-solid fa-xmark"></i>
                                                        }
                                                    </div>
                                                </div>
                                                <div className="w-full h-[4.5rem] flex items-center">
                                                    <div className="w-28 lg:w-32 shrink-0 flex flex-col justify-center items-center">
                                                        <i className="text-lg mb-1 fa-solid fa-share-nodes"></i>
                                                        <div>출처</div>
                                                    </div>
                                                    <div className="w-full">출처 표시</div>
                                                    <div className="w-28 shrink-0 flex justify-center">
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
                                    <div className="w-full max-w-[58rem] flex flex-col rounded-lg overflow-hidden bg-l-f dark:bg-d-3">
                                        <input id="license-text" type="checkbox" className="peer hidden" defaultChecked={isMobile ? false : true}/>
                                        <label htmlFor="license-text" className="group w-full text-base lg:text-lg py-6 lg:py-8 p-8 flex justify-between items-center font-medium rounded-lg cursor-pointer lg:hover:bg-l-e lg:dark:hover:bg-d-4">
                                            <div className="flex gap-2 selection:bg-transparent">
                                                라이센스 본문
                                                <span className="block peer-checked:group-[]:hidden text-h-1 dark:text-f-8">[펼치기]</span>
                                                <span className="hidden peer-checked:group-[]:block text-h-1 dark:text-f-8">[접기]</span>
                                            </div>
                                            <i className="peer-checked:group-[]:rotate-180 fa-solid fa-angle-down duration-200"></i>
                                        </label>
                                        <div className="h-0 peer-checked:h-fit w-full overflow-hidden">
                                            <div className="w-full p-8 pt-4">
                                                <pre id="license" className="w-full text-sm font-sans leading-loose whitespace-pre-wrap"></pre>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                {/* 카카오 애드핏 하단 띠배너 */}
                                <div className="w-max">
                                    <KakaoAdFitBottomBanner marginTop={1}/>
                                </div>
                            </div>

                            {/* 댓글 */}
                            <Comments
                                font={font}
                                user={user}
                                comment={fontComments}
                                likedInput={likedInput}
                                likedNum={likedNum}
                            />

                            {/* 풋터 */}
                            <Footer/>

                        </div>
                    </div>
                </div>
            </Motion>
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
                    }
                }
            }
        }
    } catch (error) {
        console.log(error);
    }
}

export default DetailPage;