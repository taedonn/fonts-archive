// react hooks
import { useState } from "react";

// next hooks
import { NextSeo } from "next-seo";

// api
import { CheckIfSessionExists } from "@/pages/api/user/checkifsessionexists";
import { FetchUserInfo } from "@/pages/api/user/fetchuserinfo";

// components
import Header from "@/components/header";
import axios from "axios";

const Add = ({params}: any) => {
    // 디바이스 체크
    const isMac: boolean = params.userAgent.includes("Mac OS") ? true : false

    // 빈 함수
    const emptyFn = () => { return; }

    /** 예시 복사하기 버튼 클릭 이벤트 */
    const copyOnClick = (e: any) => {
        const btn = document.getElementById(e.target.id) as HTMLButtonElement;
        const copyBtn = btn.getElementsByClassName("copy_btn")[0] as SVGSVGElement;

        window.navigator.clipboard.writeText(btn.value);

        copyBtn.style.display = 'block';
        setTimeout(function() {
            copyBtn.style.display = 'none';
        },1000);
    }

    // 추가하기 state
    const [addBtnLoading, setAddBtnLoading] = useState<boolean>(false);
    const [addBtnSuccess, setAddBtnSuccess] = useState<string>("");
    const [fontNameAlert, setFontNameAlert] = useState<boolean>(false);
    const [fontLangAlert, setFontLangAlert] = useState<boolean>(false);
    const [fontDateAlert, setFontDateAlert] = useState<boolean>(false);
    const [fontFamilyAlert, setFontFamilyAlert] = useState<boolean>(false);
    const [fontTypeAlert, setFontTypeAlert] = useState<boolean>(false);
    const [fontWeightAlert, setFontWeightAlert] = useState<boolean>(false);
    const [fontSourceAlert, setFontSourceAlert] = useState<boolean>(false);
    const [fontSourceLinkAlert, setFontSourceLinkAlert] = useState<boolean>(false);
    const [fontDownloadLinkAlert, setFontDownloadLinkAlert] = useState<boolean>(false);
    const [fontCdnCssAlert, setFontCdnCssAlert] = useState<boolean>(false);
    const [fontCdnLinkAlert, setFontCdnLinkAlert] = useState<boolean>(false);
    const [fontCdnImportAlert, setFontCdnImportAlert] = useState<boolean>(false);
    const [fontCdnFontFaceAlert, setFontCdnFontFaceAlert] = useState<boolean>(false);
    const [fontCdnUrlAlert, setFontCdnUrlAlert] = useState<boolean>(false);
    const [fontLicenseAlert, setFontLicenseAlert] = useState<boolean>(false);
    const [fontLicenseTextAlert, setFontLicenseTextAlert] = useState<boolean>(false);

    /** 추가하기 버튼 클릭 */
    const addBtnClick = async () => {
        const fontName = document.getElementById("font-name") as HTMLInputElement;
        const fontLang = document.getElementById("font-lang") as HTMLInputElement;
        const fontDate = document.getElementById("font-date") as HTMLInputElement;
        const fontFamily = document.getElementById("font-family") as HTMLInputElement;
        const fontType = document.getElementById("font-type") as HTMLInputElement;
        const fontWeight = document.getElementById("font-weight") as HTMLInputElement;
        const fontSource = document.getElementById("font-source") as HTMLInputElement;
        const fontSourceLink = document.getElementById("font-source-link") as HTMLInputElement;
        const fontDownloadLink = document.getElementById("font-download-link") as HTMLInputElement;
        const fontCdnCss = document.getElementById("font-cdn-css") as HTMLInputElement;
        const fontCdnLink = document.getElementById("font-cdn-link") as HTMLInputElement;
        const fontCdnImport = document.getElementById("font-cdn-import") as HTMLInputElement;
        const fontCdnFontFace = document.getElementById("font-cdn-font-face") as HTMLTextAreaElement;
        const fontCdnUrl = document.getElementById("font-cdn-url") as HTMLTextAreaElement;
        const fontLicense = document.getElementById("font-license") as HTMLInputElement;
        const fontLicenseText = document.getElementById("font-license-text") as HTMLTextAreaElement;

        // 빈 값 체크
        if (fontName.value === "") {
            setFontNameAlert(true);
            window.scrollTo({top: fontName.offsetTop});
        } else if (fontLang.value === "") {
            setFontLangAlert(true);
            window.scrollTo({top: fontLang.offsetTop});
        } else if (fontDate.value === "") {
            setFontDateAlert(true);
            window.scrollTo({top: fontDate.offsetTop});
        } else if (fontFamily.value === "") {
            setFontFamilyAlert(true);
            window.scrollTo({top: fontFamily.offsetTop});
        } else if (fontType.value === "") {
            setFontTypeAlert(true);
            window.scrollTo({top: fontType.offsetTop});
        } else if (fontWeight.value === "") {
            setFontWeightAlert(true);
            window.scrollTo({top: fontWeight.offsetTop});
        } else if (fontSource.value === "") {
            setFontSourceAlert(true);
            window.scrollTo({top: fontSource.offsetTop});
        } else if (fontSourceLink.value === "") {
            setFontSourceLinkAlert(true);
            window.scrollTo({top: fontSourceLink.offsetTop});
        } else if (fontDownloadLink.value === "") {
            setFontDownloadLinkAlert(true);
            window.scrollTo({top: fontDownloadLink.offsetTop});
        } else if (fontCdnCss.value === "") {
            setFontCdnCssAlert(true);
            window.scrollTo({top: fontCdnCss.offsetTop});
        } else if (fontCdnLink.value === "") {
            setFontCdnLinkAlert(true);
            window.scrollTo({top: fontCdnLink.offsetTop});
        } else if (fontCdnImport.value === "") {
            setFontCdnImportAlert(true);
            window.scrollTo({top: fontCdnImport.offsetTop});
        } else if (fontCdnFontFace.value === "") {
            setFontCdnFontFaceAlert(true);
            window.scrollTo({top: fontCdnFontFace.offsetTop});
        } else if (fontCdnUrl.value === "") {
            setFontCdnUrlAlert(true);
            window.scrollTo({top: fontCdnUrl.offsetTop});
        } else if (fontLicense.value === "") {
            setFontLicenseAlert(true);
            window.scrollTo({top: fontLicense.offsetTop});
        } else if (fontLicenseText.value === "") {
            setFontLicenseTextAlert(true);
            window.scrollTo({top: fontLicenseText.offsetTop});
        } else {
            setAddBtnLoading(true);

            await axios.post("/api/admin/font", {
                action: "add",
                name: fontName.value,
                lang: fontLang.value,
                date: fontDate.value,
                font_family: fontFamily.value,
                font_type: fontType.value,
                font_weight: fontWeight.value,
                source: fontSource.value,
                source_link: fontSourceLink.value,
                download_link: fontDownloadLink.value,
                cdn_css: fontCdnCss.value,
                cdn_link: fontCdnLink.value,
                cdn_import: fontCdnImport.value,
                cdn_font_face: fontCdnFontFace.value,
                cdn_url: fontCdnUrl.value,
                license: fontLicense.value,
                license_text: fontLicenseText.value,
            })
            .then(res => {
                console.log(res.data.msg);
                setAddBtnLoading(false);
                setAddBtnSuccess("success");
                window.scrollTo({top: 0});
            })
            .catch(err => {
                console.log(err);
                setAddBtnLoading(false);
                setAddBtnSuccess("fail");
                window.scrollTo({top: 0});
            });
        }
    }

    // 추가하기 onChange 이벤트
    const handleFontNameChange = () => { setFontNameAlert(false); }
    const handleFontLangChange = () => { setFontLangAlert(false); }
    const handleFontDateChange = () => { setFontDateAlert(false); }
    const handleFontFamilyChange = () => { setFontFamilyAlert(false); }
    const handleFontTypeChange = () => { setFontTypeAlert(false); }
    const handleFontWeightChange = () => { setFontWeightAlert(false); }
    const handleFontSourceChange = () => { setFontSourceAlert(false); }
    const handleFontSourceLinkChange = () => { setFontSourceLinkAlert(false); }
    const handleFontDownloadLinkChange = () => { setFontDownloadLinkAlert(false); }
    const handleFontCdnCssChange = () => { setFontCdnCssAlert(false); }
    const handleFontCdnLinkChange = () => { setFontCdnLinkAlert(false); }
    const handleFontCdnImportChange = () => { setFontCdnImportAlert(false); }
    const handleFontCdnFontFaceChange = () => { setFontCdnFontFaceAlert(false); }
    const handleFontCdnUrlChange = () => { setFontCdnUrlAlert(false); }
    const handleFontLicenseChange = () => { setFontLicenseAlert(false); }
    const handleFontLicenseTextChange = () => { setFontLicenseTextAlert(false); }

    // 추가 완료/실패 팝업 닫기 버튼 클릭
    const handleAddBtnClose = () => { setAddBtnSuccess(""); }

    return (
        <>
            {/* Head 부분*/}
            <NextSeo 
                title={"폰트 추가 · 폰트 아카이브"}
                description={"폰트 추가 - 폰트 아카이브 · 상업용 무료 한글 폰트 저장소"}
            />

            {/* 헤더 */}
            <Header
                isMac={isMac}
                theme={params.theme}
                user={params.user}
                page={""}
                license={""}
                lang={""}
                type={""}
                sort={""}
                source={""}
                handleTextChange={emptyFn}
                handleLicenseOptionChange={emptyFn}
                handleLangOptionChange={emptyFn}
                handleTypeOptionChange={emptyFn}
                handleSortOptionChange={emptyFn}
                handleSearch={emptyFn}
            />

            {/* 메인 */}
            <div className='w-[100%] flex flex-col justify-center items-center'>
                <div className='max-w-[720px] w-[100%] flex flex-col justify-center items-start my-[100px] tlg:my-[40px]'>
                    <h2 className='text-[20px] tlg:text-[18px] text-theme-3 dark:text-theme-9 font-medium mb-[12px] tlg:mb-[8px]'>폰트 추가</h2>
                    <div id="add-btn-success" className="w-[100%]">
                        {
                            addBtnSuccess === "success"
                            ? <>
                                <div className='w-[100%] h-[40px] px-[10px] mb-[10px] flex flex-row justify-between items-center rounded-[6px] border-[2px] border-theme-yellow dark:border-theme-blue-1/80 text-[12px] text-theme-3 dark:text-theme-9 bg-theme-yellow/40 dark:bg-theme-blue-1/20'>
                                    <div className='flex flex-row justify-start items-center'>
                                        <svg className='w-[14px] fill-theme-yellow dark:fill-theme-blue-1/80' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/><path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/></svg>
                                        <div className='ml-[6px]'>폰트가 추가되었습니다.</div>
                                    </div>
                                    <div onClick={handleAddBtnClose} className='flex flex-row justify-center items-center cursor-pointer'>
                                        <svg className='w-[18px] fill-theme-3 dark:fill-theme-9' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/></svg>
                                    </div>
                                </div>
                            </>
                            : addBtnSuccess === "fail"
                                ? <>
                                    <div className='w-[100%] h-[40px] px-[10px] mb-[10px] flex flex-row justify-between items-center rounded-[6px] border-[2px] border-theme-red/80 text-[12px] text-theme-3 dark:text-theme-9 bg-theme-red/20'>
                                        <div className='flex flex-row justify-start items-center'>
                                            <svg className='w-[14px] fill-theme-red/80' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/><path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/></svg>
                                            <div className='ml-[6px]'>폰트를 추가하는데 실패했습니다.</div>
                                        </div>
                                        <div onClick={handleAddBtnClose} className='flex flex-row justify-center items-center cursor-pointer'>
                                            <svg className='w-[18px] fill-theme-3 dark:fill-theme-9' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/></svg>
                                        </div>
                                    </div>
                                </> : <></>
                        }
                    </div>
                    <div className='w-[100%] p-[20px] rounded-[8px] text-theme-10 dark:text-theme-9 bg-theme-5 dark:bg-theme-3 drop-shadow-default dark:drop-shadow-dark'>
                        <div className="text-[14px] flex flex-col">
                            <label htmlFor="font-name">폰트 이름</label>
                            <input onChange={handleFontNameChange} tabIndex={1} type="text" id="font-name" placeholder="나눔 스퀘어" className={`w-[100%] ${fontNameAlert ? 'border-theme-red focus:border-theme-red' : 'border-theme-4 focus:border-theme-yellow dark:border-theme-blue-2 focus:dark:border-theme-blue-1' } text-[12px] mt-[8px] px-[14px] py-[6px] rounded-[8px] border-[2px] placeholder-theme-7 dark:placeholder-theme-6 bg-theme-4 dark:bg-theme-blue-2 autofill:bg-theme-4 autofill:dark:bg-theme-blue-2`}/>
                            {
                                fontNameAlert
                                ? <div className="text-[10px] ml-[16px] mt-[6px] text-theme-red">폰트명을 올바르게 입력해 주세요.</div>
                                : <></>
                            }
                            <label htmlFor="font-lang" className="mt-[20px]">
                                <div className="inline-block mr-[6px]">폰트 언어</div>
                                <div className="inline-block leading-loose text-[12px] text-theme-yellow dark:text-theme-blue-1 cursor-text">[KR, EN]</div>
                            </label>
                            <input onChange={handleFontLangChange} tabIndex={2} type="text" id="font-lang" placeholder="KR" maxLength={2} className={`w-[100%] ${fontLangAlert ? 'border-theme-red focus:border-theme-red' : 'border-theme-4 focus:border-theme-yellow dark:border-theme-blue-2 focus:dark:border-theme-blue-1' } text-[12px] mt-[8px] px-[14px] py-[6px] rounded-[8px] border-[2px] placeholder-theme-7 dark:placeholder-theme-6 bg-theme-4 dark:bg-theme-blue-2 autofill:bg-theme-4 autofill:dark:bg-theme-blue-2`}/>
                            {
                                fontLangAlert
                                ? <div className="text-[10px] ml-[16px] mt-[6px] text-theme-red">폰트 언어를 올바르게 입력해 주세요.</div>
                                : <></>
                            }
                            <label htmlFor="font-date" className="mt-[20px]">폰트 생성 날짜</label>
                            <input onChange={handleFontDateChange} tabIndex={3} type="text" id="font-date" placeholder="99.01.01" className={`w-[100%] ${fontDateAlert ? 'border-theme-red focus:border-theme-red' : 'border-theme-4 focus:border-theme-yellow dark:border-theme-blue-2 focus:dark:border-theme-blue-1' } text-[12px] mt-[8px] px-[14px] py-[6px] rounded-[8px] border-[2px] placeholder-theme-7 dark:placeholder-theme-6 bg-theme-4 dark:bg-theme-blue-2 autofill:bg-theme-4 autofill:dark:bg-theme-blue-2`}/>
                            {
                                fontDateAlert
                                ? <div className="text-[10px] ml-[16px] mt-[6px] text-theme-red">폰트 생성 날짜를 올바르게 입력해 주세요.</div>
                                : <></>
                            }
                            <label htmlFor="font-family" className="mt-[20px]">폰트체</label>
                            <input onChange={handleFontFamilyChange} tabIndex={4} type="text" id="font-family" placeholder="Nanum Square" className={`w-[100%] ${fontFamilyAlert ? 'border-theme-red focus:border-theme-red' : 'border-theme-4 focus:border-theme-yellow dark:border-theme-blue-2 focus:dark:border-theme-blue-1' } text-[12px] mt-[8px] px-[14px] py-[6px] rounded-[8px] border-[2px] placeholder-theme-7 dark:placeholder-theme-6 bg-theme-4 dark:bg-theme-blue-2 autofill:bg-theme-4 autofill:dark:bg-theme-blue-2`}/>
                            {
                                fontFamilyAlert
                                ? <div className="text-[10px] ml-[16px] mt-[6px] text-theme-red">폰트체를 올바르게 입력해 주세요.</div>
                                : <></>
                            }
                            <label htmlFor="font-type" className="mt-[20px]">
                                <div className="inline-block mr-[6px]">폰트 형태</div>
                                <div className="inline-block leading-loose text-[12px] text-theme-yellow dark:text-theme-blue-1 cursor-text">[Sans Serif, Serif, Hand Writing, Display, Pixel]</div>
                            </label>
                            <input onChange={handleFontTypeChange} tabIndex={5} type="text" id="font-type" placeholder="Sans Serif" className={`w-[100%] ${fontTypeAlert ? 'border-theme-red focus:border-theme-red' : 'border-theme-4 focus:border-theme-yellow dark:border-theme-blue-2 focus:dark:border-theme-blue-1' } text-[12px] mt-[8px] px-[14px] py-[6px] rounded-[8px] border-[2px] placeholder-theme-7 dark:placeholder-theme-6 bg-theme-4 dark:bg-theme-blue-2 autofill:bg-theme-4 autofill:dark:bg-theme-blue-2`}/>
                            {
                                fontTypeAlert
                                ? <div className="text-[10px] ml-[16px] mt-[6px] text-theme-red">폰트 형태를 올바르게 입력해 주세요.</div>
                                : <></>
                            }
                            <label htmlFor="font-weight" className="mt-[20px]">폰트 두께</label>
                            <input onChange={handleFontWeightChange} tabIndex={6} type="text" id="font-weight" placeholder="NNNYNNNNN" className={`w-[100%] ${fontWeightAlert ? 'border-theme-red focus:border-theme-red' : 'border-theme-4 focus:border-theme-yellow dark:border-theme-blue-2 focus:dark:border-theme-blue-1' } text-[12px] mt-[8px] px-[14px] py-[6px] rounded-[8px] border-[2px] placeholder-theme-7 dark:placeholder-theme-6 bg-theme-4 dark:bg-theme-blue-2 autofill:bg-theme-4 autofill:dark:bg-theme-blue-2`}/>
                            {
                                fontWeightAlert
                                ? <div className="text-[10px] ml-[16px] mt-[6px] text-theme-red">폰트 두께를 올바르게 입력해 주세요.</div>
                                : <></>
                            }
                            <label htmlFor="font-source" className="mt-[20px]">폰트 출처</label>
                            <input onChange={handleFontSourceChange} tabIndex={7} type="text" id="font-source" placeholder="네이버" className={`w-[100%] ${fontSourceAlert ? 'border-theme-red focus:border-theme-red' : 'border-theme-4 focus:border-theme-yellow dark:border-theme-blue-2 focus:dark:border-theme-blue-1' } text-[12px] mt-[8px] px-[14px] py-[6px] rounded-[8px] border-[2px] placeholder-theme-7 dark:placeholder-theme-6 bg-theme-4 dark:bg-theme-blue-2 autofill:bg-theme-4 autofill:dark:bg-theme-blue-2`}/>
                            {
                                fontSourceAlert
                                ? <div className="text-[10px] ml-[16px] mt-[6px] text-theme-red">폰트 출처를 올바르게 입력해 주세요.</div>
                                : <></>
                            }
                            <label htmlFor="font-source-link" className="mt-[20px]">폰트 출처 링크</label>
                            <input onChange={handleFontSourceLinkChange} tabIndex={8} type="text" id="font-source-link" placeholder="https://hangeul.naver.com/font" className={`w-[100%] ${fontSourceLinkAlert ? 'border-theme-red focus:border-theme-red' : 'border-theme-4 focus:border-theme-yellow dark:border-theme-blue-2 focus:dark:border-theme-blue-1' } text-[12px] mt-[8px] px-[14px] py-[6px] rounded-[8px] border-[2px] placeholder-theme-7 dark:placeholder-theme-6 bg-theme-4 dark:bg-theme-blue-2 autofill:bg-theme-4 autofill:dark:bg-theme-blue-2`}/>
                            {
                                fontSourceLinkAlert
                                ? <div className="text-[10px] ml-[16px] mt-[6px] text-theme-red">폰트 출처 링크를 올바르게 입력해 주세요.</div>
                                : <></>
                            }
                            <label htmlFor="font-download-link" className="mt-[20px]">
                                <div className="inline-block mr-[6px]">다운로드 링크</div>
                                <button id="font-download-link-copy" onClick={copyOnClick} value="https://github.com/fonts-archive/NanumSquare/archive/refs/heads/main.zip" className="inline-flex items-center leading-loose text-[12px] text-theme-yellow dark:text-theme-blue-1 hover:underline tlg:hover:no-underline">
                                    예시 복사하기
                                    <svg className="copy_btn hidden w-[18px] ml-[2px] fill-theme-yellow dark:fill-theme-blue-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z"/></svg>
                                </button>
                            </label>
                            <input onChange={handleFontDownloadLinkChange} tabIndex={9} type="text" id="font-download-link" placeholder="https://github.com/fonts-archive/NanumSquare/archive/refs/heads/main.zip" className={`w-[100%] ${fontDownloadLinkAlert ? 'border-theme-red focus:border-theme-red' : 'border-theme-4 focus:border-theme-yellow dark:border-theme-blue-2 focus:dark:border-theme-blue-1' } text-[12px] mt-[8px] px-[14px] py-[6px] rounded-[8px] border-[2px] placeholder-theme-7 dark:placeholder-theme-6 bg-theme-4 dark:bg-theme-blue-2 autofill:bg-theme-4 autofill:dark:bg-theme-blue-2`}/>
                            {
                                fontDownloadLinkAlert
                                ? <div className="text-[10px] ml-[16px] mt-[6px] text-theme-red">폰트 다운로드 링크를 올바르게 입력해 주세요.</div>
                                : <></>
                            }
                            <label htmlFor="font-cdn-css" className="mt-[20px]">
                                <div className="inline-block mr-[6px]">CSS 설정하기</div>
                                <button id="font-cdn-css-copy" onClick={copyOnClick} value="font-family: 'Nanum Square';" className="inline-flex items-center leading-loose text-[12px] text-theme-yellow dark:text-theme-blue-1 hover:underline tlg:hover:no-underline">
                                    예시 복사하기
                                    <svg className="copy_btn hidden w-[18px] ml-[2px] fill-theme-yellow dark:fill-theme-blue-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z"/></svg>
                                </button>
                            </label>
                            <input onChange={handleFontCdnCssChange} tabIndex={10} type="text" id="font-cdn-css" placeholder="font-family: 'Nanum Square';" className={`w-[100%] ${fontCdnCssAlert ? 'border-theme-red focus:border-theme-red' : 'border-theme-4 focus:border-theme-yellow dark:border-theme-blue-2 focus:dark:border-theme-blue-1' } text-[12px] mt-[8px] px-[14px] py-[6px] rounded-[8px] border-[2px] placeholder-theme-7 dark:placeholder-theme-6 bg-theme-4 dark:bg-theme-blue-2 autofill:bg-theme-4 autofill:dark:bg-theme-blue-2`}/>
                            {
                                fontCdnCssAlert
                                ? <div className="text-[10px] ml-[16px] mt-[6px] text-theme-red">폰트 CSS 설정을 올바르게 입력해 주세요.</div>
                                : <></>
                            }
                            <label htmlFor="font-cdn-link" className="mt-[20px]">
                                <div className="inline-block mr-[6px]">Link 방식</div>
                                <button id="font-cdn-link-copy" onClick={copyOnClick} value='<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/fonts-archive/NanumSquare/NanumSquare.css" type="text/css"/>' className="inline-flex items-center leading-loose text-[12px] text-theme-yellow dark:text-theme-blue-1 hover:underline tlg:hover:no-underline">
                                    예시 복사하기
                                    <svg className="copy_btn hidden w-[18px] ml-[2px] fill-theme-yellow dark:fill-theme-blue-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z"/></svg>
                                </button>
                            </label>
                            <input onChange={handleFontCdnLinkChange} tabIndex={11} type="text" id="font-cdn-link" placeholder='<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/fonts-archive/NanumSquare/NanumSquare.css" type="text/css"/>' className={`w-[100%] ${fontCdnLinkAlert ? 'border-theme-red focus:border-theme-red' : 'border-theme-4 focus:border-theme-yellow dark:border-theme-blue-2 focus:dark:border-theme-blue-1' } text-[12px] mt-[8px] px-[14px] py-[6px] rounded-[8px] border-[2px] placeholder-theme-7 dark:placeholder-theme-6 bg-theme-4 dark:bg-theme-blue-2 autofill:bg-theme-4 autofill:dark:bg-theme-blue-2`}/>
                            {
                                fontCdnLinkAlert
                                ? <div className="text-[10px] ml-[16px] mt-[6px] text-theme-red">폰트 Link 설정을 올바르게 입력해 주세요.</div>
                                : <></>
                            }
                            <label htmlFor="font-cdn-import" className="mt-[20px]">
                                <div className="inline-block mr-[6px]">Import 방식</div>
                                <button id="font-cdn-import-copy" onClick={copyOnClick} value="@import url('https://cdn.jsdelivr.net/gh/fonts-archive/NanumSquare/NanumSquare.css');" className="inline-flex items-center leading-loose text-[12px] text-theme-yellow dark:text-theme-blue-1 hover:underline tlg:hover:no-underline">
                                    예시 복사하기
                                    <svg className="copy_btn hidden w-[18px] ml-[2px] fill-theme-yellow dark:fill-theme-blue-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z"/></svg>
                                </button>
                            </label>
                            <input onChange={handleFontCdnImportChange} tabIndex={12} type="text" id="font-cdn-import" placeholder="@import url('https://cdn.jsdelivr.net/gh/fonts-archive/NanumSquare/NanumSquare.css');" className={`w-[100%] ${fontCdnImportAlert ? 'border-theme-red focus:border-theme-red' : 'border-theme-4 focus:border-theme-yellow dark:border-theme-blue-2 focus:dark:border-theme-blue-1' } text-[12px] mt-[8px] px-[14px] py-[6px] rounded-[8px] border-[2px] placeholder-theme-7 dark:placeholder-theme-6 bg-theme-4 dark:bg-theme-blue-2 autofill:bg-theme-4 autofill:dark:bg-theme-blue-2`}/>
                            {
                                fontCdnImportAlert
                                ? <div className="text-[10px] ml-[16px] mt-[6px] text-theme-red">폰트 Import 설정을 올바르게 입력해 주세요.</div>
                                : <></>
                            }
                            <label htmlFor="font-cdn-font-face" className="mt-[20px]">
                                <div className="inline-block mr-[6px]">font-face 방식</div>
                                <button 
                                    id="font-cdn-font-face-copy" 
                                    onClick={copyOnClick} 
                                    value={
`@font-face {
    font-family: 'Nanum Square';
    font-weight: normal;
    font-style: normal;
    font-display: swap;
    src: url('https://cdn.jsdelivr.net/gh/fonts-archive/NanumSquare/NanumSquare.woff2') format('woff2'),
            url('https://cdn.jsdelivr.net/gh/fonts-archive/NanumSquare/NanumSquare.woff') format('woff'),
            url('https://cdn.jsdelivr.net/gh/fonts-archive/NanumSquare/NanumSquare.otf') format('opentype'),
            url('https://cdn.jsdelivr.net/gh/fonts-archive/NanumSquare/NanumSquare.ttf') format('truetype');
}`} 
                                    className="inline-flex items-center leading-loose text-[12px] text-theme-yellow dark:text-theme-blue-1 hover:underline tlg:hover:no-underline">
                                    예시 복사하기
                                    <svg className="copy_btn hidden w-[18px] ml-[2px] fill-theme-yellow dark:fill-theme-blue-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z"/></svg>
                                </button>
                            </label>
                            <textarea 
                                onChange={handleFontCdnFontFaceChange}
                                id="font-cdn-font-face" 
                                tabIndex={13}
                                placeholder={
`@font-face {
    font-family: 'Nanum Square';
    font-weight: normal;
    font-style: normal;
    font-display: swap;
    src: url('https://cdn.jsdelivr.net/gh/fonts-archive/NanumSquare/NanumSquare.woff2') format('woff2'),
            url('https://cdn.jsdelivr.net/gh/fonts-archive/NanumSquare/NanumSquare.woff') format('woff'),
            url('https://cdn.jsdelivr.net/gh/fonts-archive/NanumSquare/NanumSquare.otf') format('opentype'),
            url('https://cdn.jsdelivr.net/gh/fonts-archive/NanumSquare/NanumSquare.ttf') format('truetype');
}`} 
                                className={`font-edit-textarea w-[100%] h-[196px] resize-none ${fontCdnFontFaceAlert ? 'border-theme-red focus:border-theme-red' : 'border-theme-4 focus:border-theme-yellow dark:border-theme-blue-2 focus:dark:border-theme-blue-1' } text-[12px] mt-[8px] px-[14px] py-[6px] rounded-[8px] border-[2px] placeholder-theme-7 dark:placeholder-theme-6 bg-theme-4 dark:bg-theme-blue-2 autofill:bg-theme-4 autofill:dark:bg-theme-blue-2`}>
                            </textarea>
                            {
                                fontCdnFontFaceAlert
                                ? <div className="text-[10px] ml-[16px] mt-[6px] text-theme-red">폰트 font-face 설정을 올바르게 입력해 주세요.</div>
                                : <></>
                            }
                            <label htmlFor="font-cdn-url" className="mt-[20px]">
                                <div className="inline-block mr-[6px]">CDN 주소</div>
                                <button id="font-cdn-url-copy" onClick={copyOnClick} value="https://cdn.jsdelivr.net/gh/fonts-archive/NanumSquare/NanumSquare.css" className="inline-flex items-center leading-loose text-[12px] text-theme-yellow dark:text-theme-blue-1 hover:underline tlg:hover:no-underline">
                                    예시 복사하기
                                    <svg className="copy_btn hidden w-[18px] ml-[2px] fill-theme-yellow dark:fill-theme-blue-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z"/></svg>
                                </button>
                            </label>
                            <input onChange={handleFontCdnUrlChange} tabIndex={14} type="text" id="font-cdn-url" placeholder="https://cdn.jsdelivr.net/gh/fonts-archive/NanumSquare/NanumSquare.css" className={`w-[100%] ${fontCdnUrlAlert ? 'border-theme-red focus:border-theme-red' : 'border-theme-4 focus:border-theme-yellow dark:border-theme-blue-2 focus:dark:border-theme-blue-1' } text-[12px] mt-[8px] px-[14px] py-[6px] rounded-[8px] border-[2px] placeholder-theme-7 dark:placeholder-theme-6 bg-theme-4 dark:bg-theme-blue-2 autofill:bg-theme-4 autofill:dark:bg-theme-blue-2`}/>
                            {
                                fontCdnUrlAlert
                                ? <div className="text-[10px] ml-[16px] mt-[6px] text-theme-red">CDN 주소를 올바르게 입력해 주세요.</div>
                                : <></>
                            }
                            <label htmlFor="font-license" className="mt-[20px]">라이센스 사용 범위</label>
                            <input onChange={handleFontLicenseChange} tabIndex={15} type="text" id="font-license" placeholder="HHHHHHNNN" className={`w-[100%] ${fontLicenseAlert ? 'border-theme-red focus:border-theme-red' : 'border-theme-4 focus:border-theme-yellow dark:border-theme-blue-2 focus:dark:border-theme-blue-1' } text-[12px] mt-[8px] px-[14px] py-[6px] rounded-[8px] border-[2px] placeholder-theme-7 dark:placeholder-theme-6 bg-theme-4 dark:bg-theme-blue-2 autofill:bg-theme-4 autofill:dark:bg-theme-blue-2`}/>
                            {
                                fontLicenseAlert
                                ? <div className="text-[10px] ml-[16px] mt-[6px] text-theme-red">폰트 라이센스 사용 범위를 올바르게 입력해 주세요.</div>
                                : <></>
                            }
                            <label htmlFor="font-license-text" className="mt-[20px]">라이센스 본문</label>
                            <textarea 
                                onChange={handleFontLicenseTextChange}
                                id="font-license-text" 
                                tabIndex={16}
                                placeholder={
`네이버에서 제작한 나눔 글꼴과 마루 부리 글꼴, 클로바 나눔손글씨(이하 네이버 글꼴)의 지적 재산권은 네이버와 네이버 문화재단에 있습니다.
네이버 글꼴은 개인 및 기업 사용자를 포함한 모든 사용자에게 무료로 제공되며 글꼴 자체를 유료로 판매하는 것을 제외한 상업적인 사용이 가능합니다.

네이버 글꼴은 본 저작권 안내와 라이선스 전문을 포함해서 다른 소프트웨어와 번들하거나 재배포 또는 판매가 가능하고 자유롭게 수정, 재배포하실 수 있습니다.
네이버 글꼴 라이선스 전문을 포함하기 어려울 경우 출처 표기를 권장합니다. 예) 이 페이지에는 네이버에서 제공한 나눔 고딕 글꼴이 적용되어 있습니다.`} 
                                className={`font-edit-textarea w-[100%] h-[196px] resize-none ${fontLicenseTextAlert ? 'border-theme-red focus:border-theme-red' : 'border-theme-4 focus:border-theme-yellow dark:border-theme-blue-2 focus:dark:border-theme-blue-1' } text-[12px] mt-[8px] px-[14px] py-[6px] rounded-[8px] border-[2px] placeholder-theme-7 dark:placeholder-theme-6 bg-theme-4 dark:bg-theme-blue-2 autofill:bg-theme-4 autofill:dark:bg-theme-blue-2`}>
                            </textarea>
                            {
                                fontLicenseTextAlert
                                ? <div className="text-[10px] ml-[16px] mt-[6px] text-theme-red">폰트 라이센스 본문을 올바르게 입력해 주세요.</div>
                                : <></>
                            }
                        </div>
                        <button onClick={addBtnClick} className="w-[100%] h-[34px] rounded-[8px] mt-[20px] font-medium text-[12px] text-theme-5 dark:text-theme-3 bg-theme-yellow/80 hover:bg-theme-yellow dark:bg-theme-blue-1/80 hover:dark:bg-theme-blue-1 tlg:hover:dark:bg-theme-blue-1">
                            {
                                addBtnLoading
                                ? <span className='loader loader-register w-[16px] h-[16px] mt-[2px]'></span>
                                : <>추가하기</>
                            }
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}

export async function getServerSideProps(ctx: any) {
    try {
        // 쿠키
        const cookieTheme = ctx.req.cookies.theme === undefined ? "dark" : ctx.req.cookies.theme;

        // 디바이스 체크
        const userAgent = ctx.req ? ctx.req.headers['user-agent'] : navigator.userAgent;

        // 쿠키에 저장된 세션ID가 유효하면, 유저 정보 가져오기
        const session = ctx.req.cookies.session;
        const user = session === undefined
            ? null
            : await CheckIfSessionExists(session)
                ? await FetchUserInfo(session)
                : ctx.res.setHeader('Set-Cookie', [`session=deleted; max-Age=0; path=/`]);;;

        // 쿠키에 저장된 세션ID가 유효하지 않다면, 메인페이지로 이동, 유효하면 클리이언트로 유저 정보 return
        if (user === null || user.user_no !== 1) {
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
                        theme: cookieTheme,
                        userAgent: userAgent,
                        user: JSON.parse(JSON.stringify(user)),
                    }
                }
            }
        }
    }
    catch (error) {
        console.log(error);
    }
}

export default Add;