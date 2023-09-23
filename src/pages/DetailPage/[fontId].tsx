// Next hooks
import Link from "next/link";
import { NextSeo } from 'next-seo';

// react hooks
import React, { useEffect, useState } from "react";

// api
import { FetchFontDetail } from "../api/detailpage/fetchfontdetail";
import { CheckIfSessionExists } from "../api/user/checkifsessionexists";
import { FetchUserInfo } from "../api/user/fetchuserinfo";
import { FetchUserLike } from "../api/user/fetchuserlike";
import { FetchNumberOfLikes } from "../api/user/fetchnumberoflikes";
import { FetchComments } from "../api/detailpage/fetchcomments";
import { FetchReports } from "../api/detailpage/fetchReports";
import axios from "axios";
import { throttle } from "lodash";

// material-ui hooks
import { Slider } from "@mui/material";

// components
import Header from "@/components/header";
import Tooltip from "@/components/tooltip";
import DummyText from "@/components/dummytext";
import Comments from "@/components/comments";

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

    // 좋아요 state
    const [alertDisplay, setAlertDisplay] = useState<boolean>(false);
    const [hoverDisplay, setHoverDisplay] = useState<boolean>(true);
    const [liked, setLiked] = useState<boolean>(params.like === null ? false : params.like.some((font: any) => font.font_id === params.fonts[0].code));
    const [likedInput, setLikedInput] = useState<boolean>(params.like === null ? false : params.like.some((font: any) => font.font_id === params.fonts[0].code));

    /** 로그인 중이 아닐 때 좋아요 클릭 방지 */
    const handleLikeClick = (e: React.MouseEvent<HTMLInputElement>) => {
        if (params.user === null) {
            setAlertDisplay(true);
            e.preventDefault();
        }
    }

    /** 좋아요 버튼 체인지 이벤트 */
    const handleLikeChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (params.user !== null) {
            // 좋아요 버튼 눌렀을 때 호버창 지우기
            setHoverDisplay(false);

            // 좋아요/좋아요 해제 여부 체크
            if (e.target.checked) { setLikedInput(true); }
            else { setLikedInput(false); }

            // 댓글창 위 좋아요 버튼의 아이디 규칙에 맞게 변경
            const thisId = e.target.id.includes('like-bottom-') ? e.target.id.replace('like-bottom-','') : e.target.id;

            await axios.post('/api/updatelike', null, { params: { code: thisId ,checked: e.target.checked, user_no: params.user.user_no } })
            .then(res => {
                // 좋아요 여부 확인 후 문장 변경
                if (res.data === 'liked') { setLiked(true); }
                else { setLiked(false); }

                // 좋아요 버튼 눌렀을 때 호버창 다시 띄우기
                setHoverDisplay(true);
            })
            .catch(err => console.log(err));
        }
    }

    /** 렌더링 시 좋아요 되어있는 폰트들은 체크된 상태로 변경 */
    const handleDefaultLike = (fontCode: number) => {
        return params.like === null ? false : params.like.some((font: any) => font.font_id === fontCode || font.font_id === 'like-bottom-' + fontCode);
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

            {/* 로그인 중이 아닐 때 좋아요 alert창 팝업 */}
            {
                alertDisplay === true
                ? <div className='fixed z-20 top-[24px] tlg:top-[20px] right-[32px] tlg:right-[28px] w-content h-[60px] tlg:h-[56px] px-[12px] flex flex-row justify-between items-center rounded-[8px] border border-theme-yellow dark:border-theme-blue-1 text-[13px] tlg:text-[12px] text-theme-10/80 dark:text-theme-9/80 bg-theme-4 dark:bg-theme-blue-2'>
                    <div className='flex flex-row justify-start items-center'>
                        <svg className='w-[20px] fill-theme-8 dark:fill-theme-9/80' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M7.657 6.247c.11-.33.576-.33.686 0l.645 1.937a2.89 2.89 0 0 0 1.829 1.828l1.936.645c.33.11.33.576 0 .686l-1.937.645a2.89 2.89 0 0 0-1.828 1.829l-.645 1.936a.361.361 0 0 1-.686 0l-.645-1.937a2.89 2.89 0 0 0-1.828-1.828l-1.937-.645a.361.361 0 0 1 0-.686l1.937-.645a2.89 2.89 0 0 0 1.828-1.828l.645-1.937zM3.794 1.148a.217.217 0 0 1 .412 0l.387 1.162c.173.518.579.924 1.097 1.097l1.162.387a.217.217 0 0 1 0 .412l-1.162.387A1.734 1.734 0 0 0 4.593 5.69l-.387 1.162a.217.217 0 0 1-.412 0L3.407 5.69A1.734 1.734 0 0 0 2.31 4.593l-1.162-.387a.217.217 0 0 1 0-.412l1.162-.387A1.734 1.734 0 0 0 3.407 2.31l.387-1.162zM10.863.099a.145.145 0 0 1 .274 0l.258.774c.115.346.386.617.732.732l.774.258a.145.145 0 0 1 0 .274l-.774.258a1.156 1.156 0 0 0-.732.732l-.258.774a.145.145 0 0 1-.274 0l-.258-.774a1.156 1.156 0 0 0-.732-.732L9.1 2.137a.145.145 0 0 1 0-.274l.774-.258c.346-.115.617-.386.732-.732L10.863.1z"/></svg>
                        <div className='ml-[8px]'>
                            좋아요 기능은 로그인 시 이용 가능합니다. <br/>
                            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
                            <a href="/user/login" className='text-theme-yellow dark:text-theme-blue-1 hover:underline tlg:hover:no-underline'>로그인 하러 가기</a>
                        </div>
                    </div>
                    <div onClick={handleAlertClose} className='flex flex-row justify-center items-center ml-[8px] cursor-pointer'>
                        <svg className='w-[20px] fill-theme-10/80 dark:fill-theme-9' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/></svg>
                    </div>
                </div> : <></>
            }

            {/* 메인 */}
            <div className="w-[100%] pt-[32px] tmd:pt-[20px]">
                <link href={font.cdn_url} rel="stylesheet" type="text/css" itemProp="url"></link>
                <div className="w-[100%] flex flex-col justify-start items-start">
                    <div className="mb-[12px] tlg:mb-[8px] flex items-center">
                        <div style={{fontFamily:'"'+font.font_family+'"'}} className="text-[32px] tlg:text-[28px] tmd:text-[24px] text-theme-3 dark:text-theme-9 font-medium leading-tight">{font.name}</div>
                        <div className='group relative ml-[14px] tmd:ml-[10px] mb-[2px]'>
                            <input onClick={handleLikeClick} onChange={handleLikeChange} type="checkbox" id={font.code.toString()} className='like hidden' defaultChecked={handleDefaultLike(font.code)}/>
                            <label htmlFor={font.code.toString()} className='cursor-pointer'>
                                <svg className='w-[26px] tmd:w-[22px] fill-theme-7 dark:fill-theme-4' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767-3.686 1.894.694-3.957a.565.565 0 0 0-.163-.505L1.71 6.745l4.052-.576a.525.525 0 0 0 .393-.288L8 2.223l1.847 3.658a.525.525 0 0 0 .393.288l4.052.575-2.906 2.77a.565.565 0 0 0-.163.506l.694 3.957-3.686-1.894a.503.503 0 0 0-.461 0z"/></svg>
                                <svg className='w-[26px] tmd:w-[22px] fill-theme-yellow dark:fill-theme-blue-1' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/></svg>
                            </label>
                            <div className={`${hoverDisplay === true ? 'group-hover:block' : 'group-hover:hidden'} same-source w-content absolute z-20 left-[50%] top-[-42px] text-[13px] font-medium leading-none px-[14px] py-[8px] rounded-[4px] hidden tlg:group-hover:hidden group-hover:animate-fontbox-zoom-in bg-theme-yellow dark:bg-theme-blue-1 text-theme-3 dark:text-theme-blue-2`}>{liked === true ? "좋아요 해제" : "좋아요"}</div>
                        </div>
                    </div>
                    <div className="flex flex-row justify-start items-center">
                        <div style={{fontFamily:'"'+font.font_family+'"'}} className="text-[16px] tmd:text-[12px] leading-tight text-theme-3 dark:text-theme-9 ml-[2px] mr-[16px] tmd:mr-[12px]">
                            제작
                            <Link href={{pathname: "/", query: {search: font.source}}} className="relative group text-theme-yellow dark:text-theme-blue-1 border-b border-theme-yellow dark:border-theme-blue-1 ml-[8px] tlg:ml-[6px]">
                                {font.source}
                                <div className="same-source w-content absolute z-10 left-[50%] top-[-38px] text-[13px] font-medium leading-none px-[14px] py-[8px] rounded-[4px] hidden group-hover:block tlg:group-hover:hidden group-hover:animate-fontbox-zoom-in bg-theme-yellow dark:bg-theme-blue-1 text-theme-3 dark:text-theme-blue-2">제작사의 다른 폰트 보기</div>
                            </Link>
                        </div>
                        <div style={{fontFamily:'"'+font.font_family+'"'}} className="text-[16px] tmd:text-[12px] leading-tight text-theme-3 dark:text-theme-9 mr-[14px] tmd:mr-[12px]">형태<span className="text-theme-5 dark:text-theme-7 ml-[6px]">{font.font_type === "Sans Serif" ? "고딕" : (font.font_type === "Serif" ? "명조" : (font.font_type === "Hand Writing" ? "손글씨" : (font.font_type === "Display" ? "장식체" : "픽셀체")))}</span></div>
                        <div style={{fontFamily:'"'+font.font_family+'"'}} className="text-[16px] tmd:text-[12px] leading-tight text-theme-3 dark:text-theme-9 mr-[14px] tmd:mr-[12px]">조회수<span className="text-theme-5 dark:text-theme-7 ml-[6px]">{formatNumber(font.view)}</span></div>
                        <div style={{fontFamily:'"'+font.font_family+'"'}} className="text-[16px] tmd:text-[12px] leading-tight text-theme-3 dark:text-theme-9">좋아요 수<span className="text-theme-5 dark:text-theme-7 ml-[6px]">{formatNumber(params.likedNum)}</span></div>
                    </div>
                    <div className="w-[100%] h-px my-[16px] tmd:my-[12px] bg-theme-7 dark:bg-theme-4"></div>
                </div>
                <div className="flex flex-row justify-start items-center mb-[60px] tmd:mb-[48px]">
                    <Link aria-label="source-link" href={font.source_link} target="_blank" className="h-[36px] tmd:h-[32px] flex flex-row justify-center items-center text-[14px] tmd:text-[12px] leading-none text-theme-3 dark:text-theme-blue-1 font-medium dark:border-2 tmd:dark:border dark:border-theme-blue-1 rounded-full px-[20px] mr-[12px] tmd:mr-[8px] cursor-pointer bg-theme-yellow hover:bg-theme-yellow/90 tlg:hover:bg-theme-yellow dark:bg-transparent hover:dark:bg-theme-blue-1/10 tlg:hover:dark:bg-transparent">다운로드 페이지로 이동</Link>
                    {
                        font.license_ofl === "N"
                        ? <></>
                        : <Link aria-label="github-source-link" href={font.github_link} className="w-[160px] tmd:w-[128px] h-[36px] tmd:h-[32px] flex flex-row justify-center items-center text-[14px] tmd:text-[12px] leading-none text-theme-9 dark:text-theme-9 font-medium dark:border-2 tmd:dark:border border-theme-4 dark:border-theme-9 rounded-full px-[20px] cursor-pointer bg-theme-4 hover:bg-theme-4/90 tlg:hover:bg-theme-4 dark:bg-transparent hover:dark:bg-theme-9/10 tlg:hover:dark:bg-transparent">폰트 다운로드</Link>
                    }
                </div>
                {
                    font.license_embed === "N" || font.license_ofl === "N"
                    ? <></>
                    : <>
                        <div className="flex flex-col justify-start items-start mb-[60px] tmd:mb-[48px]">
                            <h2 className="text-[20px] tmd:text-[18px] text-theme-3 dark:text-theme-9 font-medium mb-[14px]">웹 폰트 사용하기</h2>
                            <div className="cdn w-[916px] tlg:w-[100%] h-[48px] tmd:h-[40px] overflow-hidden border-x border-t border-b border-theme-4 dark:border-theme-3/80 rounded-t-[12px] flex flex-row justify-start items-center">
                                <input onChange={handleWebFont} type="radio" id="cdn_css" name="cdn" value="CSS" className="hidden" defaultChecked/>
                                <label htmlFor="cdn_css" className="w-[25%] h-[100%] border-r border-theme-8 dark:border-theme-3/80 flex flex-row justify-center items-center text-[14px] tmd:text-[10px] text-theme-3 focused:text-theme-9 dark:text-theme-9 leading-none cursor-pointer">CSS 설정하기</label>
                                <input onChange={handleWebFont} type="radio" id="cdn_link" name="cdn" value="link" className="hidden"/>
                                <label htmlFor="cdn_link" className="w-[25%] h-[100%] border-r border-theme-8 dark:border-theme-3/80 flex flex-row justify-center items-center text-[14px] tmd:text-[10px] text-theme-3 dark:text-theme-9 leading-none cursor-pointer">link 방식</label>
                                <input onChange={handleWebFont} type="radio" id="cdn_import" name="cdn" value="import" className="hidden"/>
                                <label htmlFor="cdn_import" className="w-[25%] h-[100%] border-r border-theme-8 dark:border-theme-3/80 flex flex-row justify-center items-center text-[14px] tmd:text-[10px] text-theme-3 dark:text-theme-9 leading-none cursor-pointer">import 방식</label>
                                <input onChange={handleWebFont} type="radio" id="cdn_font_face" name="cdn" value="font-face" className="hidden"/>
                                <label htmlFor="cdn_font_face" className="w-[25%] h-[100%] flex flex-row justify-center items-center text-[14px] tmd:text-[10px] text-theme-3 dark:text-theme-9 leading-none cursor-pointer">font-face 방식</label>
                            </div>
                            <div className="w-[916px] tlg:w-[100%] border-x border-b rounded-b-[12px] border-theme-4 dark:border-theme-blue-2 bg-theme-4 dark:bg-theme-blue-2">
                                {
                                    webFont === "CSS"
                                    ? <div className="w-[100%] relative pl-[24px] tmd:pl-[16px] pr-[60px] overflow-hidden">
                                        <div className="cdn_pre w-[100%] h-[60px] tmd:h-[48px] flex flex-row justify-start items-center overflow-x-auto"><pre style={{fontFamily:"Spoqa Han Sans Neo"}} className="text-[14px] tmd:text-[12px] text-theme-9">{font.cdn_css}</pre></div>
                                        <div className="absolute z-10 right-[16px] tmd:right-[12px] top-[50%] translate-y-[-50%] rounded-[6px] cursor-pointer">
                                            <svg onClick={copyOnClick} className="copy_btn w-[32px] tmd:w-[28px] p-[8px] rounded-[6px] hover:bg-theme-yellow/10 tlg:hover:bg-transparent hover:dark:bg-theme-blue-1/10 tlg:hover:dark:bg-transparent fill-theme-9 hover:fill-theme-yellow tlg:hover:fill-theme-9 dark:fill-theme-7 hover:dark:fill-theme-blue-1 tlg:hover:dark:fill-theme-7" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z"/><path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z"/></svg>
                                            <svg className="copy_chk_btn w-[32px] tmd:w-[28px] p-[8px] rounded-[6px] bg-theme-yellow/10 dark:bg-theme-blue-1/10 fill-theme-yellow dark:fill-theme-blue-1 hidden" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/></svg>
                                        </div>
                                    </div>
                                    : ( webFont === "link"
                                        ? <div className="w-[100%] relative pl-[24px] tmd:pl-[16px] pr-[60px] overflow-hidden">
                                            <div className="cdn_pre w-[100%] h-[60px] tmd:h-[48px] flex flex-row justify-start items-center overflow-x-auto"><pre style={{fontFamily:"Spoqa Han Sans Neo"}} className="text-[14px] tmd:text-[12px] text-theme-9">{font.cdn_link}</pre></div>
                                            <div className="absolute z-10 right-[16px] tmd:right-[12px] top-[50%] translate-y-[-50%] cursor-pointer">
                                                <svg onClick={copyOnClick} className="copy_btn w-[32px] tmd:w-[28px] p-[8px] rounded-[6px] hover:bg-theme-yellow/10 tlg:hover:bg-transparent hover:dark:bg-theme-blue-1/10 tlg:hover:dark:bg-transparent fill-theme-9 hover:fill-theme-yellow tlg:hover:fill-theme-9 dark:fill-theme-7 hover:dark:fill-theme-blue-1 tlg:hover:dark:fill-theme-7" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z"/><path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z"/></svg>
                                                <svg className="copy_chk_btn w-[32px] tmd:w-[28px] p-[8px] rounded-[6px] bg-theme-yellow/10 dark:bg-theme-blue-1/10 fill-theme-yellow dark:fill-theme-blue-1 hidden" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/></svg>
                                            </div>
                                        </div>
                                        : ( webFont === "import"
                                            ? <div className="w-[100%] relative pl-[24px] tmd:pl-[16px] pr-[60px] overflow-hidden">
                                                <div className="cdn_pre w-[100%] h-[60px] tmd:h-[48px] flex flex-row justify-start items-center overflow-x-auto"><pre style={{fontFamily:"Spoqa Han Sans Neo"}} className="text-[14px] tmd:text-[12px] text-theme-9">{font.cdn_import}</pre></div>
                                                <div className="absolute z-10 right-[16px] tmd:right-[12px] top-[50%] translate-y-[-50%] cursor-pointer">
                                                    <svg onClick={copyOnClick} className="copy_btn w-[32px] tmd:w-[28px] p-[8px] rounded-[6px] hover:bg-theme-yellow/10 tlg:hover:bg-transparent hover:dark:bg-theme-blue-1/10 tlg:hover:dark:bg-transparent fill-theme-9 hover:fill-theme-yellow tlg:hover:fill-theme-9 dark:fill-theme-7 hover:dark:fill-theme-blue-1 tlg:hover:dark:fill-theme-7" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z"/><path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z"/></svg>
                                                    <svg className="copy_chk_btn w-[32px] tmd:w-[28px] p-[8px] rounded-[6px] bg-theme-yellow/10 dark:bg-theme-blue-1/10 fill-theme-yellow dark:fill-theme-blue-1 hidden" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/></svg>
                                                </div>
                                            </div>
                                            : <div className="w-[100%] relative pl-[24px] tmd:pl-[16px] pr-[60px] overflow-hidden">
                                                <div className="cdn_pre w-[100%] h-[auto] py-[20px] tmd:py-[15px] flex flex-row justify-start items-center overflow-auto whitespace-nowrap"><pre id="cdn-font-face" style={{fontFamily:"Spoqa Han Sans Neo", tabSize:8}} className="font-face text-[14px] tmd:text-[12px] text-theme-9">{font.cdn_font_face}</pre></div>
                                                <div className="absolute z-10 right-[16px] tmd:right-[12px] top-[30px] tmd:top-[24px] translate-y-[-50%] cursor-pointer">
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
                <div className="max-w-[100%] w-content flex flex-col justify-start items-start mb-[60px] tmd:mb-[48px]">
                    <h2 className="text-[20px] tmd:text-[18px] text-theme-3 dark:text-theme-9 font-medium mb-[14px]">폰트 미리보기</h2>
                    <div className="w-[100%] px-[16px] py-[8px] mb-[16px] border-b border-theme-7 dark:border-theme-4">
                        <textarea onChange={handleFontWeightChange} onInput={handleHeightChange} placeholder="원하는 문구를 적어보세요..." className="w-[100%] h-[18px] resize-none text-[14px] text-theme-5 dark:text-theme-8 placeholder-theme-5 dark:placeholder-theme-6 leading-tight bg-transparent"/>
                    </div>
                    <div className="font-preview-wrap max-w-[100%] overflow-hidden rounded-[12px] p-[20px] pt-[28px] pb-[14px] bg-theme-4 dark:bg-theme-blue-2">
                        <div className="w-[100%] flex flex-row flex-wrap justify-start items-center">
                            <div className="flex flex-col justify-center items-start mr-[40px] mb-[16px]">
                                <p className="text-[14px] text-normal leading-none mb-[8px] text-theme-9">
                                    폰트 크기<span className="text-[12px] text-theme-7 ml-[6px]">Font Size</span>
                                </p>
                                <div className="w-[200px] mx-[34px] relative">
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
                            <div className="flex flex-col justify-center items-start mr-[40px] mb-[16px]">
                                <p className="text-[14px] text-normal leading-none mb-[8px] text-theme-9">
                                    행간<span className="text-[12px] text-theme-7 ml-[6px]">Line Height</span>
                                </p>
                                <div className="w-[200px] mx-[20px] relative">
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
                            <div className="flex flex-col justify-center items-start mr-[40px] mb-[16px]">
                                <p className="text-[14px] text-normal leading-none mb-[8px] text-theme-9">
                                    자간<span className="text-[12px] text-theme-7 ml-[6px]">Letter Spacing</span>
                                </p>
                                <div className="w-[200px] ml-[48px] relative">
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
                        <div className="w-[100%] h-px mb-[28px] bg-theme-5"></div>
                        {
                            font.font_weight[0] === "Y"
                            ? <>
                                <div className="text-[12px] text-theme-7 leading-none mb-[12px]">Thin 100</div>
                                <pre style={{fontFamily:'"'+font.font_family+'"', fontSize:fontSize, lineHeight:lineHeight, letterSpacing:letterSpacing+"em", fontWeight:"100"}} className="font-preview w-[100%] text-theme-9 pb-[16px] tlg:pb-[14px] mb-[20px] tlg:mb-[16px]"><DummyText lang={font.lang} text={text} num={params.randomNum}/></pre>
                            </>
                            : <></>
                        }
                        {
                            font.font_weight[1] === "Y"
                            ? <>
                                <div className="text-[12px] text-theme-7 leading-none mb-[12px]">ExtraLight 200</div>
                                <pre style={{fontFamily:'"'+font.font_family+'"', fontSize:fontSize, lineHeight:lineHeight, letterSpacing:letterSpacing+"em", fontWeight:"200"}} className="font-preview w-[100%] text-theme-9 pb-[16px] tlg:pb-[14px] mb-[20px] tlg:mb-[16px]"><DummyText lang={font.lang} text={text} num={params.randomNum}/></pre>
                            </>
                            : <></>
                        }
                        {
                            font.font_weight[2] === "Y"
                            ? <>
                                <div className="text-[12px] text-theme-7 leading-none mb-[12px]">Light 300</div>
                                <pre style={{fontFamily:'"'+font.font_family+'"', fontSize:fontSize, lineHeight:lineHeight, letterSpacing:letterSpacing+"em", fontWeight:"300"}} className="font-preview w-[100%] text-theme-9 pb-[16px] tlg:pb-[14px] mb-[20px] tlg:mb-[16px]"><DummyText lang={font.lang} text={text} num={params.randomNum}/></pre>
                            </>
                            : <></>
                        }
                        {
                            font.font_weight[3] === "Y"
                            ? <>
                                <div className="text-[12px] text-theme-7 leading-none mb-[12px]">Regular 400</div>
                                <pre style={{fontFamily:'"'+font.font_family+'"', fontSize:fontSize, lineHeight:lineHeight, letterSpacing:letterSpacing+"em", fontWeight:"400"}} className="font-preview w-[100%] text-theme-9 pb-[16px] tlg:pb-[14px] mb-[20px] tlg:mb-[16px]"><DummyText lang={font.lang} text={text} num={params.randomNum}/></pre>
                            </>
                            : <></>
                        }
                        {
                            font.font_weight[4] === "Y"
                            ? <>
                                <div className="text-[12px] text-theme-7 leading-none mb-[12px]">Medium 500</div>
                                <pre style={{fontFamily:'"'+font.font_family+'"', fontSize:fontSize, lineHeight:lineHeight, letterSpacing:letterSpacing+"em", fontWeight:"500"}} className="font-preview w-[100%] text-theme-9 pb-[16px] tlg:pb-[14px] mb-[20px] tlg:mb-[16px]"><DummyText lang={font.lang} text={text} num={params.randomNum}/></pre>
                            </>
                            : <></>
                        }
                        {
                            font.font_weight[5] === "Y"
                            ? <>
                                <div className="text-[12px] text-theme-7 leading-none mb-[12px]">SemiBold 600</div>
                                <pre style={{fontFamily:'"'+font.font_family+'"', fontSize:fontSize, lineHeight:lineHeight, letterSpacing:letterSpacing+"em", fontWeight:"600"}} className="font-preview w-[100%] text-theme-9 pb-[16px] tlg:pb-[14px] mb-[20px] tlg:mb-[16px]"><DummyText lang={font.lang} text={text} num={params.randomNum}/></pre>
                            </>
                            : <></>
                        }
                        {
                            font.font_weight[6] === "Y"
                            ? <>
                                <div className="text-[12px] text-theme-7 leading-none mb-[12px]">Bold 700</div>
                                <pre style={{fontFamily:'"'+font.font_family+'"', fontSize:fontSize, lineHeight:lineHeight, letterSpacing:letterSpacing+"em", fontWeight:"700"}} className="font-preview w-[100%] text-theme-9 pb-[16px] tlg:pb-[14px] mb-[20px] tlg:mb-[16px]"><DummyText lang={font.lang} text={text} num={params.randomNum}/></pre>
                            </>
                            : <></>
                        }
                        {
                            font.font_weight[7] === "Y"
                            ? <>
                                <div className="text-[12px] text-theme-7 leading-none mb-[12px]">Heavy 800</div>
                                <pre style={{fontFamily:'"'+font.font_family+'"', fontSize:fontSize, lineHeight:lineHeight, letterSpacing:letterSpacing+"em", fontWeight:"800"}} className="font-preview w-[100%] text-theme-9 pb-[16px] tlg:pb-[14px] mb-[20px] tlg:mb-[16px]"><DummyText lang={font.lang} text={text} num={params.randomNum}/></pre>
                            </>
                            : <></>
                        }
                        {
                            font.font_weight[8] === "Y"
                            ? <>
                                <div className="text-[12px] text-theme-7 leading-none mb-[12px]">Black 900</div>
                                <pre style={{fontFamily:'"'+font.font_family+'"', fontSize:fontSize, lineHeight:lineHeight, letterSpacing:letterSpacing+"em", fontWeight:"900"}} className="font-preview w-[100%] text-theme-9 pb-[16px] tlg:pb-[14px] mb-[20px] tlg:mb-[16px]"><DummyText lang={font.lang} text={text} num={params.randomNum}/></pre>
                            </>
                            : <></>
                        }
                    </div>
                </div>
                <div>
                    <h2 className="text-[20px] tmd:text-[18px] text-theme-3 dark:text-theme-9 font-medium mb-[16px] tmd:mb-[14px]">라이센스 사용 범위</h2>
                    <div className="w-[100%] flex flex-row tlg:flex-col justify-between items-start">
                        <table className="tlg:w-[100%] tlg:mb-[16px] text-left rounded-[12px] border border-theme-7 dark:border-theme-5">
                            <thead className="relative h-[56px]">
                                <tr className="text-[15px] text-theme-3 dark:text-theme-9 font-medium">
                                    <th className="w-[120px] tlg:w-[100px] text-center">카테고리</th>
                                    <th className="w-[450px] tlg:w-[auto]">사용 범위</th>
                                    <th className="w-[100px] tmd:w-[80px] pr-[28px] tlg:pr-[24px] tmd:pr-[20px] text-right">허용 여부</th>
                                    <th className="absolute bottom-0 left-[50%] translate-x-[-50%] w-[calc(100%-40px)] tlg:w-[calc(100%-32px)] tmd:w-[calc(100%-24px)] h-px bg-theme-7 dark:bg-theme-5"></th>
                                </tr>
                            </thead>
                            <tbody className="text-[13px] leading-tight text-theme-5 dark:text-theme-8 fill-theme-5 dark:fill-theme-8 text-left font-normal">
                                <tr className="relative">
                                    <td className="h-[68px] flex flex-col justify-center items-center text-theme-3 dark:text-theme-9 fill-theme-3 dark:fill-theme-9">
                                        <svg className="w-[20px] mb-[8px]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M2.5 8a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1z"/><path d="M5 1a2 2 0 0 0-2 2v2H2a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h1v1a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-1h1a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-1V3a2 2 0 0 0-2-2H5zM4 3a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2H4V3zm1 5a2 2 0 0 0-2 2v1H2a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v-1a2 2 0 0 0-2-2H5zm7 2v3a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1z"/></svg>
                                        <div>인쇄물</div>
                                    </td>
                                    <td>
                                        {
                                            font.license_print === "Y"
                                            ? <span>브로슈어, 포스터, 책, 잡지, 간판 등 출판용 인쇄물</span>
                                            : <span className="text-theme-red/80 line-through">브로슈어, 포스터, 책, 잡지, 간판 등 출판용 인쇄물</span>
                                        }
                                    </td>
                                    <td className="pr-[28px] tlg:pr-[24px] tmd:pr-[20px] translate-y-[8px] flex flex-row justify-end items-center">
                                        {
                                            font.license_print === "Y"
                                            ? <svg className="w-[14px]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/></svg>
                                            : ( font.license_print === "H"
                                                ? <svg className="w-[14px] fill-theme-red/80" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M7.938 2.016A.13.13 0 0 1 8.002 2a.13.13 0 0 1 .063.016.146.146 0 0 1 .054.057l6.857 11.667c.036.06.035.124.002.183a.163.163 0 0 1-.054.06.116.116 0 0 1-.066.017H1.146a.115.115 0 0 1-.066-.017.163.163 0 0 1-.054-.06.176.176 0 0 1 .002-.183L7.884 2.073a.147.147 0 0 1 .054-.057zm1.044-.45a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566z"/></svg>
                                                : ( font.license_print === "N"
                                                    ? <svg className="w-[26px] translate-x-[6px] translate-y-[6px] fill-theme-red/80" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/></svg>
                                                    : <></>
                                                )
                                            )
                                        }
                                    </td>
                                    <td className="absolute bottom-0 left-[50%] translate-x-[-50%] w-[calc(100%-40px)] tlg:w-[calc(100%-32px)] tmd:w-[calc(100%-24px)] h-px bg-theme-7 dark:bg-theme-5"></td>
                                </tr>
                                <tr className="relative">
                                    <td className="h-[68px] flex flex-col justify-center items-center text-theme-3 dark:text-theme-9 fill-theme-3 dark:fill-theme-9">
                                        <svg className="w-[20px] mb-[8px]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M8 1a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1V1Zm1 13.5a.5.5 0 1 0 1 0 .5.5 0 0 0-1 0Zm2 0a.5.5 0 1 0 1 0 .5.5 0 0 0-1 0ZM9.5 1a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1h-5ZM9 3.5a.5.5 0 0 0 .5.5h5a.5.5 0 0 0 0-1h-5a.5.5 0 0 0-.5.5ZM1.5 2A1.5 1.5 0 0 0 0 3.5v7A1.5 1.5 0 0 0 1.5 12H6v2h-.5a.5.5 0 0 0 0 1H7v-4H1.5a.5.5 0 0 1-.5-.5v-7a.5.5 0 0 1 .5-.5H7V2H1.5Z"/></svg>
                                        <div>웹 서비스</div>
                                    </td>
                                    <td>
                                        {
                                            font.license_web === "Y"
                                            ? <span>웹페이지, 광고 배너, 메일, E-브로슈어, 웹서버용 폰트 등</span>
                                            : <span className="text-theme-red/80 line-through">웹페이지, 광고 배너, 메일, E-브로슈어, 웹서버용 폰트 등</span>
                                        }
                                    </td>
                                    <td className="pr-[28px] tlg:pr-[24px] tmd:pr-[20px] translate-y-[8px] flex flex-row justify-end items-center">
                                        {
                                            font.license_web === "Y"
                                            ? <svg className="w-[14px]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/></svg>
                                            : ( font.license_web === "H"
                                                ? <svg className="w-[14px] fill-theme-red/80" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M7.938 2.016A.13.13 0 0 1 8.002 2a.13.13 0 0 1 .063.016.146.146 0 0 1 .054.057l6.857 11.667c.036.06.035.124.002.183a.163.163 0 0 1-.054.06.116.116 0 0 1-.066.017H1.146a.115.115 0 0 1-.066-.017.163.163 0 0 1-.054-.06.176.176 0 0 1 .002-.183L7.884 2.073a.147.147 0 0 1 .054-.057zm1.044-.45a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566z"/></svg>
                                                : ( font.license_web === "N"
                                                    ? <svg className="w-[26px] translate-x-[6px] translate-y-[6px] fill-theme-red/80" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/></svg>
                                                    : <></>
                                                )
                                            )
                                        }
                                    </td>
                                    <td className="absolute bottom-0 left-[50%] translate-x-[-50%] w-[calc(100%-40px)] tlg:w-[calc(100%-32px)] tmd:w-[calc(100%-24px)] h-px bg-theme-7 dark:bg-theme-5"></td>
                                </tr>
                                <tr className="relative">
                                    <td className="h-[68px] flex flex-col justify-center items-center text-theme-3 dark:text-theme-9 fill-theme-3 dark:fill-theme-9">
                                        <svg className="w-[20px] mb-[8px]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M6 3a3 3 0 1 1-6 0 3 3 0 0 1 6 0zM1 3a2 2 0 1 0 4 0 2 2 0 0 0-4 0z"/><path d="M9 6h.5a2 2 0 0 1 1.983 1.738l3.11-1.382A1 1 0 0 1 16 7.269v7.462a1 1 0 0 1-1.406.913l-3.111-1.382A2 2 0 0 1 9.5 16H2a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h7zm6 8.73V7.27l-3.5 1.555v4.35l3.5 1.556zM1 8v6a1 1 0 0 0 1 1h7.5a1 1 0 0 0 1-1V8a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1z"/><path d="M9 6a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM7 3a2 2 0 1 1 4 0 2 2 0 0 1-4 0z"/></svg>
                                        <div>영상물</div>
                                    </td>
                                    <td>
                                        {
                                            font.license_video === "Y"
                                            ? <span>방송 및 영상물 자막, 영화 오프닝/엔딩 크레딧, 개인 UCC 등</span>
                                            : <span className="text-theme-red/80 line-through">방송 및 영상물 자막, 영화 오프닝/엔딩 크레딧, 개인 UCC 등</span>
                                        }
                                    </td>
                                    <td className="pr-[28px] tlg:pr-[24px] tmd:pr-[20px] translate-y-[8px] flex flex-row justify-end items-center">
                                        {
                                            font.license_video === "Y"
                                            ? <svg className="w-[14px]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/></svg>
                                            : ( font.license_video === "H"
                                                ? <svg className="w-[14px] fill-theme-red/80" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M7.938 2.016A.13.13 0 0 1 8.002 2a.13.13 0 0 1 .063.016.146.146 0 0 1 .054.057l6.857 11.667c.036.06.035.124.002.183a.163.163 0 0 1-.054.06.116.116 0 0 1-.066.017H1.146a.115.115 0 0 1-.066-.017.163.163 0 0 1-.054-.06.176.176 0 0 1 .002-.183L7.884 2.073a.147.147 0 0 1 .054-.057zm1.044-.45a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566z"/></svg>
                                                : ( font.license_video === "N"
                                                    ? <svg className="w-[26px] translate-x-[6px] translate-y-[6px] fill-theme-red/80" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/></svg>
                                                    : <></>
                                                )
                                            )
                                        }
                                    </td>
                                    <td className="absolute bottom-0 left-[50%] translate-x-[-50%] w-[calc(100%-40px)] tlg:w-[calc(100%-32px)] tmd:w-[calc(100%-24px)] h-px bg-theme-7 dark:bg-theme-5"></td>
                                </tr>
                                <tr className="relative">
                                    <td className="h-[68px] flex flex-col justify-center items-center text-theme-3 dark:text-theme-9 fill-theme-3 dark:fill-theme-9">
                                        <svg className="w-[20px] mb-[8px]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M8.186 1.113a.5.5 0 0 0-.372 0L1.846 3.5l2.404.961L10.404 2l-2.218-.887zm3.564 1.426L5.596 5 8 5.961 14.154 3.5l-2.404-.961zm3.25 1.7-6.5 2.6v7.922l6.5-2.6V4.24zM7.5 14.762V6.838L1 4.239v7.923l6.5 2.6zM7.443.184a1.5 1.5 0 0 1 1.114 0l7.129 2.852A.5.5 0 0 1 16 3.5v8.662a1 1 0 0 1-.629.928l-7.185 2.874a.5.5 0 0 1-.372 0L.63 13.09a1 1 0 0 1-.63-.928V3.5a.5.5 0 0 1 .314-.464L7.443.184z"/></svg>
                                        <div>포장지</div>
                                    </td>
                                    <td>
                                        {
                                            font.license_package === "Y"
                                            ? <span>판매용 상품의 패키지</span>
                                            : <span className="text-theme-red/80 line-through">판매용 상품의 패키지</span>
                                        }
                                    </td>
                                    <td className="pr-[28px] tlg:pr-[24px] tmd:pr-[20px] translate-y-[8px] flex flex-row justify-end items-center">
                                        {
                                            font.license_package === "Y"
                                            ? <svg className="w-[14px]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/></svg>
                                            : ( font.license_package === "H"
                                                ? <svg className="w-[14px] fill-theme-red/80" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M7.938 2.016A.13.13 0 0 1 8.002 2a.13.13 0 0 1 .063.016.146.146 0 0 1 .054.057l6.857 11.667c.036.06.035.124.002.183a.163.163 0 0 1-.054.06.116.116 0 0 1-.066.017H1.146a.115.115 0 0 1-.066-.017.163.163 0 0 1-.054-.06.176.176 0 0 1 .002-.183L7.884 2.073a.147.147 0 0 1 .054-.057zm1.044-.45a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566z"/></svg>
                                                : ( font.license_package === "N"
                                                    ? <svg className="w-[26px] translate-x-[6px] translate-y-[6px] fill-theme-red/80" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/></svg>
                                                    : <></>
                                                )
                                            )
                                        }
                                    </td>
                                    <td className="absolute bottom-0 left-[50%] translate-x-[-50%] w-[calc(100%-40px)] tlg:w-[calc(100%-32px)] tmd:w-[calc(100%-24px)] h-px bg-theme-7 dark:bg-theme-5"></td>
                                </tr>
                                <tr className="relative">
                                    <td className="h-[68px] flex flex-col justify-center items-center text-theme-3 dark:text-theme-9 fill-theme-3 dark:fill-theme-9">
                                        <svg className="w-[20px] mb-[8px]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M10.478 1.647a.5.5 0 1 0-.956-.294l-4 13a.5.5 0 0 0 .956.294l4-13zM4.854 4.146a.5.5 0 0 1 0 .708L1.707 8l3.147 3.146a.5.5 0 0 1-.708.708l-3.5-3.5a.5.5 0 0 1 0-.708l3.5-3.5a.5.5 0 0 1 .708 0zm6.292 0a.5.5 0 0 0 0 .708L14.293 8l-3.147 3.146a.5.5 0 0 0 .708.708l3.5-3.5a.5.5 0 0 0 0-.708l-3.5-3.5a.5.5 0 0 0-.708 0z"/></svg>
                                        <div>임베딩</div>
                                    </td>
                                    <td>
                                        {
                                            font.license_embed === "Y"
                                            ? <span>웹사이트 및 프로그램 서버 내 폰트 탑재, E-book 제작</span>
                                            : <span className="text-theme-red/80 line-through">웹사이트 및 프로그램 서버 내 폰트 탑재, E-book 제작</span>
                                        }
                                    </td>
                                    <td className="pr-[28px] tlg:pr-[24px] tmd:pr-[20px] translate-y-[8px] flex flex-row justify-end items-center">
                                        {
                                            font.license_embed === "Y"
                                            ? <svg className="w-[14px]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/></svg>
                                            : ( font.license_embed === "H"
                                                ? <svg className="w-[14px] fill-theme-red/80" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M7.938 2.016A.13.13 0 0 1 8.002 2a.13.13 0 0 1 .063.016.146.146 0 0 1 .054.057l6.857 11.667c.036.06.035.124.002.183a.163.163 0 0 1-.054.06.116.116 0 0 1-.066.017H1.146a.115.115 0 0 1-.066-.017.163.163 0 0 1-.054-.06.176.176 0 0 1 .002-.183L7.884 2.073a.147.147 0 0 1 .054-.057zm1.044-.45a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566z"/></svg>
                                                : ( font.license_embed === "N"
                                                    ? <svg className="w-[26px] translate-x-[6px] translate-y-[6px] fill-theme-red/80" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/></svg>
                                                    : <></>
                                                )
                                            )
                                        }
                                    </td>
                                    <td className="absolute bottom-0 left-[50%] translate-x-[-50%] w-[calc(100%-40px)] tlg:w-[calc(100%-32px)] tmd:w-[calc(100%-24px)] h-px bg-theme-7 dark:bg-theme-5"></td>
                                </tr>
                                <tr className="relative">
                                    <td className="h-[68px] flex flex-col justify-center items-center text-theme-3 dark:text-theme-9 fill-theme-3 dark:fill-theme-9">
                                        <svg className="w-[20px] mb-[8px]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M4 2.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1Zm3 0a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1Zm3.5-.5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-1ZM4 5.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1ZM7.5 5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-1Zm2.5.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1ZM4.5 8a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-1Zm2.5.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1Zm3.5-.5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-1Z"/><path d="M2 1a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V1Zm11 0H3v14h3v-2.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 .5.5V15h3V1Z"/></svg>
                                        <div>BI/CI</div>
                                    </td>
                                    <td>
                                        {
                                            font.license_bici === "Y"
                                            ? <span>회사명, 브랜드명, 상품명, 로고, 마크, 슬로건, 캐치프레이즈</span>
                                            : <span className="text-theme-red/80 line-through">회사명, 브랜드명, 상품명, 로고, 마크, 슬로건, 캐치프레이즈</span>
                                        }
                                    </td>
                                    <td className="pr-[28px] tlg:pr-[24px] tmd:pr-[20px] translate-y-[8px] flex flex-row justify-end items-center">
                                        {
                                            font.license_bici === "Y"
                                            ? <svg className="w-[14px]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/></svg>
                                            : ( font.license_bici === "H"
                                                ? <svg className="w-[14px] fill-theme-red/80" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M7.938 2.016A.13.13 0 0 1 8.002 2a.13.13 0 0 1 .063.016.146.146 0 0 1 .054.057l6.857 11.667c.036.06.035.124.002.183a.163.163 0 0 1-.054.06.116.116 0 0 1-.066.017H1.146a.115.115 0 0 1-.066-.017.163.163 0 0 1-.054-.06.176.176 0 0 1 .002-.183L7.884 2.073a.147.147 0 0 1 .054-.057zm1.044-.45a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566z"/></svg>
                                                : ( font.license_bici === "N"
                                                    ? <svg className="w-[26px] translate-x-[6px] translate-y-[6px] fill-theme-red/80" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/></svg>
                                                    : <></>
                                                )
                                            )
                                        }
                                    </td>
                                    <td className="absolute bottom-0 left-[50%] translate-x-[-50%] w-[calc(100%-40px)] tlg:w-[calc(100%-32px)] tmd:w-[calc(100%-24px)] h-px bg-theme-7 dark:bg-theme-5"></td>
                                </tr>
                                <tr className="relative">
                                    <td className="h-[68px] flex flex-col justify-center items-center text-theme-3 dark:text-theme-9 fill-theme-3 dark:fill-theme-9">
                                        <svg className="w-[20px] mb-[8px]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M9.669.864 8 0 6.331.864l-1.858.282-.842 1.68-1.337 1.32L2.6 6l-.306 1.854 1.337 1.32.842 1.68 1.858.282L8 12l1.669-.864 1.858-.282.842-1.68 1.337-1.32L13.4 6l.306-1.854-1.337-1.32-.842-1.68L9.669.864zm1.196 1.193.684 1.365 1.086 1.072L12.387 6l.248 1.506-1.086 1.072-.684 1.365-1.51.229L8 10.874l-1.355-.702-1.51-.229-.684-1.365-1.086-1.072L3.614 6l-.25-1.506 1.087-1.072.684-1.365 1.51-.229L8 1.126l1.356.702 1.509.229z"/><path d="M4 11.794V16l4-1 4 1v-4.206l-2.018.306L8 13.126 6.018 12.1 4 11.794z"/></svg>
                                        <div>OFL</div>
                                    </td>
                                    <td>
                                        {
                                            font.license_ofl === "Y"
                                            ? <span>폰트 파일의 수정, 편집 및 재배포 가능. 단, 폰트 파일의 유료 판매는 금지</span>
                                            : <span className="text-theme-red/80 line-through">폰트 파일의 수정, 편집 재배포 및 유료 판매 금지</span>
                                        }
                                    </td>
                                    <td className="h-[42px] pr-[28px] tlg:pr-[24px] tmd:pr-[20px] translate-y-[8px] flex flex-row justify-end items-center">
                                        {
                                            font.license_ofl === "Y"
                                            ? <svg className="w-[14px]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/></svg>
                                            : <svg className="w-[26px] translate-x-[6px] translate-y-[6px] fill-theme-red/80" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/></svg>
                                        }
                                    </td>
                                    <td className="absolute bottom-0 left-[50%] translate-x-[-50%] w-[calc(100%-40px)] tlg:w-[calc(100%-32px)] tmd:w-[calc(100%-24px)] h-px bg-theme-7 dark:bg-theme-5"></td>
                                </tr>
                                <tr className="relative">
                                    <td className="h-[68px] flex flex-col justify-center items-center text-theme-3 dark:text-theme-9 fill-theme-3 dark:fill-theme-9">
                                        <svg className="w-[20px] mb-[8px]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M15 14s1 0 1-1-1-4-5-4-5 3-5 4 1 1 1 1h8Zm-7.978-1A.261.261 0 0 1 7 12.996c.001-.264.167-1.03.76-1.72C8.312 10.629 9.282 10 11 10c1.717 0 2.687.63 3.24 1.276.593.69.758 1.457.76 1.72l-.008.002a.274.274 0 0 1-.014.002H7.022ZM11 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm3-2a3 3 0 1 1-6 0 3 3 0 0 1 6 0ZM6.936 9.28a5.88 5.88 0 0 0-1.23-.247A7.35 7.35 0 0 0 5 9c-4 0-5 3-5 4 0 .667.333 1 1 1h4.216A2.238 2.238 0 0 1 5 13c0-1.01.377-2.042 1.09-2.904.243-.294.526-.569.846-.816ZM4.92 10A5.493 5.493 0 0 0 4 13H1c0-.26.164-1.03.76-1.724.545-.636 1.492-1.256 3.16-1.275ZM1.5 5.5a3 3 0 1 1 6 0 3 3 0 0 1-6 0Zm3-2a2 2 0 1 0 0 4 2 2 0 0 0 0-4Z"/></svg>
                                        <div>용도</div>
                                    </td>
                                    <td>
                                        {
                                            font.license_purpose === "Y"
                                            ? <span>개인적, 상업적 용도 모두 사용 가능</span>
                                            : <span className="text-theme-red/80 line-through">개인적 용도 사용 가능, 상업적 용도 사용 금지</span>
                                        }
                                    </td>
                                    <td className="h-[42px] pr-[28px] tlg:pr-[24px] tmd:pr-[20px] translate-y-[8px] flex flex-row justify-end items-center">
                                        {
                                            font.license_purpose === "Y"
                                            ? <svg className="w-[14px]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/></svg>
                                            : <svg className="w-[14px] fill-theme-red/80" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M7.938 2.016A.13.13 0 0 1 8.002 2a.13.13 0 0 1 .063.016.146.146 0 0 1 .054.057l6.857 11.667c.036.06.035.124.002.183a.163.163 0 0 1-.054.06.116.116 0 0 1-.066.017H1.146a.115.115 0 0 1-.066-.017.163.163 0 0 1-.054-.06.176.176 0 0 1 .002-.183L7.884 2.073a.147.147 0 0 1 .054-.057zm1.044-.45a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566z"/></svg>
                                        }
                                    </td>
                                    <td className="absolute bottom-0 left-[50%] translate-x-[-50%] w-[calc(100%-40px)] tlg:w-[calc(100%-32px)] tmd:w-[calc(100%-24px)] h-px bg-theme-7 dark:bg-theme-5"></td>
                                </tr>
                                <tr className="relative">
                                    <td className="h-[68px] flex flex-col justify-center items-center text-theme-3 dark:text-theme-9 fill-theme-3 dark:fill-theme-9">
                                        <svg className="w-[16px] mb-[8px]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M13.5 1a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zM11 2.5a2.5 2.5 0 1 1 .603 1.628l-6.718 3.12a2.499 2.499 0 0 1 0 1.504l6.718 3.12a2.5 2.5 0 1 1-.488.876l-6.718-3.12a2.5 2.5 0 1 1 0-3.256l6.718-3.12A2.5 2.5 0 0 1 11 2.5zm-8.5 4a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zm11 5.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3z"/></svg>
                                        <div>출처</div>
                                    </td>
                                    <td>출처 표시</td>
                                    <td className="pr-[28px] tlg:pr-[24px] tmd:pr-[20px] translate-y-[8px] flex flex-row justify-end items-center">
                                        {
                                            font.license_source === "Y"
                                            ? <svg className="w-[14px]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/></svg>
                                            : <span>권장</span>
                                        }
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <div className="w-[calc(100%-690px)] tlg:w-[100%] h-[669px] tlg:h-[auto] mb-[80px] tlg:mb-[60px] tmd:mb-[48px] border border-theme-7 dark:border-theme-5">
                            <h2 className="relative h-[56px] flex flex-row justify-start items-center text-[15px] text-theme-3 dark:text-theme-9 font-normal leading-none pl-[28px] tlg:pl-[24px] tmd:pl-[20px]">
                                라이센스 본문
                                <div className="absolute bottom-0 left-[50%] translate-x-[-50%] w-[calc(100%-40px)] tlg:w-[calc(100%-32px)] tmd:w-[calc(100%-24px)] h-px bg-theme-7 dark:bg-theme-5"></div>
                            </h2>
                            <div className="license-wrap w-[100%] h-[612px] tlg:h-[auto] overflow-hidden overflow-y-auto px-[28px] tlg:px-[24px] tmd:px-[20px] py-[12px] tlg:py-[16px]">
                                <div id="license" className="text-[15px] tlg:text-[13px] text-theme-5 dark:text-theme-8 leading-loose"></div>
                            </div>
                        </div>
                    </div>

                    {/* 댓글 */}
                    <Comments
                        font={font}
                        user={params.user}
                        report={params.report}
                        comment={params.comments}
                        likedInput={likedInput}
                    />

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
        );

        // 유저 정보에 신고 리포트 합치기
        const report = user !== null
        ? await FetchReports(ctx.params.fontId, user.user_no)
        : null;

        // typescript에서 createdAt은 JSON.parse를 통해 serialized object로 변환 후 params로 보낼 수 있다.
        const reportJSON = JSON.parse(JSON.stringify(report));

        // 좋아요한 폰트 체크
        const like = ctx.req.cookies.session === undefined ? null : (
            await CheckIfSessionExists(ctx.req.cookies.session) === true 
            ? await FetchUserLike(ctx.req.cookies.session)
            : null
        );

        const likedNum = await FetchNumberOfLikes(ctx.params.fontId);

        // 댓글 체크
        const comments = await FetchComments(ctx.params.fontId);

        // typescript에서 createdAt은 JSON.parse를 통해 serialized object로 변환 후 params로 보낼 수 있다.
        const commentsJSON = JSON.parse(JSON.stringify(comments));

        return {
            props: {
                params: {
                    fonts: fonts,
                    randomNum: randomNum,
                    theme: cookieTheme,
                    userAgent: userAgent,
                    user: user,
                    report: reportJSON,
                    like: like,
                    likedNum: likedNum.length,
                    comments: commentsJSON,
                }
            }
        }
    } catch (error) {
        console.log(error);
    }
}

export default DetailPage;