// react
import { useState, useEffect } from "react";

// next
import { NextSeo } from "next-seo";

// next-auth
import { getServerSession } from "next-auth";
import { authOptions } from '@/pages/api/auth/[...nextauth]';

// libraries
import axios from "axios";

// components
import Motion from "@/components/motion";
import Header from "@/components/header";
import Footer from "@/components/footer";
import TextInput from "@/components/textinput";
import TextArea from "@/components/textarea";
import Button from "@/components/button";

const Add = ({params}: any) => {
    const { theme, userAgent, user } = params;

    // 디바이스 체크
    const isMac: boolean = userAgent.includes("Mac OS") ? true : false;

    // states
    const [addBtnLoading, setAddBtnLoading] = useState<boolean>(false);
    const [addBtnSuccess, setAddBtnSuccess] = useState<string>("");
    const [fontNameAlert, setFontNameAlert] = useState<string>("");
    const [fontLangAlert, setFontLangAlert] = useState<string>("");
    const [fontDateAlert, setFontDateAlert] = useState<string>("");
    const [fontFamilyAlert, setFontFamilyAlert] = useState<string>("");
    const [fontTypeAlert, setFontTypeAlert] = useState<string>("");
    const [fontWeightAlert, setFontWeightAlert] = useState<string>("");
    const [fontSourceAlert, setFontSourceAlert] = useState<string>("");
    const [fontSourceLinkAlert, setFontSourceLinkAlert] = useState<string>("");
    const [fontDownloadLinkAlert, setFontDownloadLinkAlert] = useState<string>("");
    const [fontCdnCssAlert, setFontCdnCssAlert] = useState<string>("");
    const [fontCdnLinkAlert, setFontCdnLinkAlert] = useState<string>("");
    const [fontCdnImportAlert, setFontCdnImportAlert] = useState<string>("");
    const [fontCdnFontFaceAlert, setFontCdnFontFaceAlert] = useState<string>("");
    const [fontCdnUrlAlert, setFontCdnUrlAlert] = useState<string>("");
    const [fontLicenseAlert, setFontLicenseAlert] = useState<string>("");
    const [fontLicenseTextAlert, setFontLicenseTextAlert] = useState<string>("");

    /** 예시 복사하기 버튼 클릭 이벤트 */
    const copyOnClick = (e: React.MouseEvent) => {
        const btn = document.getElementById(e.currentTarget.id) as HTMLButtonElement;
        const copyBtn = btn.getElementsByClassName("copy_btn")[0] as SVGSVGElement;

        window.navigator.clipboard.writeText(btn.value);

        copyBtn.style.display = 'block';
        setTimeout(function() {
            copyBtn.style.display = 'none';
        },1000);
    }

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
            setFontNameAlert("empty");
            window.scrollTo({top: fontName.offsetTop});
        } else if (fontLang.value === "") {
            setFontLangAlert("empty");
            window.scrollTo({top: fontLang.offsetTop});
        } else if (fontDate.value === "") {
            setFontDateAlert("empty");
            window.scrollTo({top: fontDate.offsetTop});
        } else if (fontFamily.value === "") {
            setFontFamilyAlert("empty");
            window.scrollTo({top: fontFamily.offsetTop});
        } else if (fontType.value === "") {
            setFontTypeAlert("empty");
            window.scrollTo({top: fontType.offsetTop});
        } else if (fontWeight.value === "") {
            setFontWeightAlert("empty");
            window.scrollTo({top: fontWeight.offsetTop});
        } else if (fontSource.value === "") {
            setFontSourceAlert("empty");
            window.scrollTo({top: fontSource.offsetTop});
        } else if (fontSourceLink.value === "") {
            setFontSourceLinkAlert("empty");
            window.scrollTo({top: fontSourceLink.offsetTop});
        } else if (fontDownloadLink.value === "") {
            setFontDownloadLinkAlert("empty");
            window.scrollTo({top: fontDownloadLink.offsetTop});
        } else if (fontCdnCss.value === "") {
            setFontCdnCssAlert("empty");
            window.scrollTo({top: fontCdnCss.offsetTop});
        } else if (fontCdnLink.value === "") {
            setFontCdnLinkAlert("empty");
            window.scrollTo({top: fontCdnLink.offsetTop});
        } else if (fontCdnImport.value === "") {
            setFontCdnImportAlert("empty");
            window.scrollTo({top: fontCdnImport.offsetTop});
        } else if (fontCdnFontFace.value === "") {
            setFontCdnFontFaceAlert("empty");
            window.scrollTo({top: fontCdnFontFace.offsetTop});
        } else if (fontCdnUrl.value === "") {
            setFontCdnUrlAlert("empty");
            window.scrollTo({top: fontCdnUrl.offsetTop});
        } else if (fontLicense.value === "") {
            setFontLicenseAlert("empty");
            window.scrollTo({top: fontLicense.offsetTop});
        } else if (fontLicenseText.value === "") {
            setFontLicenseTextAlert("empty");
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
    const handleFontNameChange = () => { setFontNameAlert(""); }
    const handleFontLangChange = () => { setFontLangAlert(""); }
    const handleFontDateChange = () => { setFontDateAlert(""); }
    const handleFontFamilyChange = () => { setFontFamilyAlert(""); }
    const handleFontTypeChange = () => { setFontTypeAlert(""); }
    const handleFontWeightChange = () => { setFontWeightAlert(""); }
    const handleFontSourceChange = () => { setFontSourceAlert(""); }
    const handleFontSourceLinkChange = () => { setFontSourceLinkAlert(""); }
    const handleFontDownloadLinkChange = () => { setFontDownloadLinkAlert(""); }
    const handleFontCdnCssChange = () => { setFontCdnCssAlert(""); }
    const handleFontCdnLinkChange = () => { setFontCdnLinkAlert(""); }
    const handleFontCdnImportChange = () => { setFontCdnImportAlert(""); }
    const handleFontCdnFontFaceChange = () => { setFontCdnFontFaceAlert(""); }
    const handleFontCdnUrlChange = () => { setFontCdnUrlAlert(""); }
    const handleFontLicenseChange = () => { setFontLicenseAlert(""); }
    const handleFontLicenseTextChange = () => { setFontLicenseTextAlert(""); }

    // 엔터키 입력 시 가입하기 버튼 클릭
    useEffect(() => {
        const keys: any = [];
        const handleKeydown = (e: KeyboardEvent) => { keys[e.key] = true; if (keys["Enter"]) { addBtnClick(); } }
        const handleKeyup = (e: KeyboardEvent) => {keys[e.key] = false;}

        window.addEventListener("keydown", handleKeydown, false);
        window.addEventListener("keyup", handleKeyup, false);

        return () => {
            window.removeEventListener("keydown", handleKeydown);
            window.removeEventListener("keyup", handleKeyup);
        }
    });

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
                theme={theme}
                user={user}
            />

            {/* 메인 */}
            <Motion
                initialOpacity={0}
                animateOpacity={1}
                exitOpacity={0}
                initialY={-50}
                animateY={0}
                exitY={-50}
                transitionType="spring"
            >
                <div className='w-full px-4 flex flex-col justify-center items-center'>
                    <div className='max-w-[45rem] w-full flex flex-col justify-center items-start py-24 tlg:py-16'>
                        <h2 className='text-2xl tlg:text-xl text-l-2 dark:text-white font-bold mb-4'>폰트 추가</h2>
                        <div id="add-btn-success" className="w-full">
                            {
                                addBtnSuccess === "success"
                                ? <div className='w-full h-10 px-2.5 mb-3 flex justify-between items-center rounded-lg border-2 border-h-1 dark:border-f-8 text-xs text-l-2 dark:text-white bg-h-1/20 dark:bg-f-8/20'>
                                    <div className='flex items-center'>
                                        <i className="text-sm text-h-1 dark:text-f-8 fa-regular fa-bell"></i>
                                        <div className='ml-2'>폰트가 추가되었습니다.</div>
                                    </div>
                                    <div onClick={handleAddBtnClose} className='flex justify-center items-center cursor-pointer'>
                                        <i className="text-sm fa-solid fa-xmark"></i>
                                    </div>
                                </div>
                                : addBtnSuccess === "fail"
                                    ? <div className='w-full h-10 px-2.5 mb-3 flex justify-between items-center rounded-lg border-2 border-h-r text-xs text-l-2 dark:text-white bg-h-r/20'>
                                        <div className='flex items-center'>
                                            <i className="text-sm text-h-r fa-regular fa-bell"></i>
                                            <div className='ml-2'>폰트를 추가하는데 실패했습니다.</div>
                                        </div>
                                        <div onClick={handleAddBtnClose} className='flex justify-center items-center cursor-pointer'>
                                            <i className="text-sm fa-solid fa-xmark"></i>
                                        </div>
                                    </div> : <></>
                            }
                        </div>
                        <div className='w-full p-5 rounded-lg text-l-2 dark:text-white bg-l-e dark:bg-d-3 drop-shadow-default dark:drop-shadow-dark'>
                            <div className="flex flex-col">
                                <TextInput
                                    onchange={handleFontNameChange}
                                    state={fontNameAlert}
                                    stateMsg={[
                                        { state: "", msg: "" },
                                        { state: "empty", msg: "폰트명을 올바르게 입력해 주세요." }
                                    ]}
                                    id="font-name"
                                    tabindex={1}
                                    placeholder="나눔 스퀘어"
                                    label="폰트 이름"
                                />
                                <label htmlFor="font-lang" className="mt-8 flex items-center font-medium">
                                    <div className="mr-2">폰트 언어</div>
                                    <div className="font-normal text-sm text-h-1 dark:text-f-8">[KR, EN]</div>
                                </label>
                                <TextInput
                                    onchange={handleFontLangChange}
                                    state={fontLangAlert}
                                    stateMsg={[
                                        { state: "", msg: "" },
                                        { state: "empty", msg: "폰트 언어를 올바르게 입력해 주세요." }
                                    ]}
                                    id="font-lang"
                                    tabindex={2}
                                    placeholder="KR"
                                    isLabeled={false}
                                    marginTop={0.5}
                                />
                                <TextInput
                                    onchange={handleFontDateChange}
                                    state={fontDateAlert}
                                    stateMsg={[
                                        { state: "", msg: "" },
                                        { state: "empty", msg: "폰트 생성 날짜를 올바르게 입력해 주세요." }
                                    ]}
                                    id="font-date"
                                    tabindex={3}
                                    placeholder="99.01.01"
                                    label="폰트 생성 날짜"
                                    marginTop={2}
                                />
                                <TextInput
                                    onchange={handleFontFamilyChange}
                                    state={fontFamilyAlert}
                                    stateMsg={[
                                        { state: "", msg: "" },
                                        { state: "empty", msg: "폰트체를 올바르게 입력해 주세요." }
                                    ]}
                                    id="font-family"
                                    tabindex={4}
                                    placeholder="Nanum Square"
                                    label="폰트체"
                                    marginTop={2}
                                />
                                <label htmlFor="font-type" className="mt-8 flex items-center font-medium">
                                    <div className="mr-2">폰트 형태</div>
                                    <div className="font-normal text-sm text-h-1 dark:text-f-8">[Sans Serif, Serif, Hand Writing, Display, Pixel]</div>
                                </label>
                                <TextInput
                                    onchange={handleFontTypeChange}
                                    state={fontTypeAlert}
                                    stateMsg={[
                                        { state: "", msg: "" },
                                        { state: "empty", msg: "폰트 형태를 올바르게 입력해 주세요." }
                                    ]}
                                    id="font-type"
                                    tabindex={5}
                                    placeholder="Sans Serif"
                                    isLabeled={false}
                                    marginTop={0.5}
                                />
                                <TextInput
                                    onchange={handleFontWeightChange}
                                    state={fontWeightAlert}
                                    stateMsg={[
                                        { state: "", msg: "" },
                                        { state: "empty", msg: "폰트 두께를 올바르게 입력해 주세요." }
                                    ]}
                                    id="font-weight"
                                    tabindex={6}
                                    placeholder="NNNYNNNNN"
                                    label="폰트 두께"
                                    marginTop={2}
                                />
                                <TextInput
                                    onchange={handleFontSourceChange}
                                    state={fontSourceAlert}
                                    stateMsg={[
                                        { state: "", msg: "" },
                                        { state: "empty", msg: "폰트 출처를 올바르게 입력해 주세요." }
                                    ]}
                                    id="font-source"
                                    tabindex={7}
                                    placeholder="네이버"
                                    label="폰트 출처"
                                    marginTop={2}
                                />
                                <TextInput
                                    onchange={handleFontSourceLinkChange}
                                    state={fontSourceLinkAlert}
                                    stateMsg={[
                                        { state: "", msg: "" },
                                        { state: "empty", msg: "폰트 출처 링크를 올바르게 입력해 주세요." }
                                    ]}
                                    id="font-source-link"
                                    tabindex={8}
                                    placeholder="https://hangeul.naver.com/font"
                                    label="폰트 출처 링크"
                                    marginTop={2}
                                />
                                <label htmlFor="font-download-link" className="mt-8 flex items-center">
                                    <div className="mr-2 font-medium">다운로드 링크</div>
                                    <button id="font-download-link-copy" onClick={copyOnClick} value="https://github.com/fonts-archive/NanumSquare/archive/refs/heads/main.zip" className="flex items-center text-sm text-h-1 dark:text-f-8">
                                        <span className="hover:underline tlg:hover:no-underline">예시 복사하기</span>
                                        <i className="copy_btn hidden ml-1 fa-solid fa-check"></i>
                                    </button>
                                </label>
                                <TextInput
                                    onchange={handleFontDownloadLinkChange}
                                    state={fontDownloadLinkAlert}
                                    stateMsg={[
                                        { state: "", msg: "" },
                                        { state: "empty", msg: "폰트 다운로드 링크를 올바르게 입력해 주세요." }
                                    ]}
                                    id="font-download-link"
                                    tabindex={9}
                                    placeholder="https://github.com/fonts-archive/NanumSquare/archive/refs/heads/main.zip"
                                    isLabeled={false}
                                    marginTop={0.5}
                                />
                                <label htmlFor="font-cdn-css" className="mt-8 flex items-center">
                                    <div className="mr-2 font-medium">CSS 설정하기</div>
                                    <button id="font-cdn-css-copy" onClick={copyOnClick} value="font-family: 'Nanum Square';" className="flex items-center text-sm text-h-1 dark:text-f-8">
                                        <span className="hover:underline tlg:hover:no-underline">예시 복사하기</span>
                                        <i className="copy_btn hidden ml-1 fa-solid fa-check"></i>
                                    </button>
                                </label>
                                <TextInput
                                    onchange={handleFontCdnCssChange}
                                    state={fontCdnCssAlert}
                                    stateMsg={[
                                        { state: "", msg: "" },
                                        { state: "empty", msg: "폰트 CSS 설정을 올바르게 입력해 주세요." }
                                    ]}
                                    id="font-cdn-css"
                                    tabindex={10}
                                    placeholder="font-family: 'Nanum Square';"
                                    isLabeled={false}
                                    marginTop={0.5}
                                />
                                <label htmlFor="font-cdn-link" className="mt-8 flex items-center">
                                    <div className="mr-2 font-medium">Link 방식</div>
                                    <button id="font-cdn-link-copy" onClick={copyOnClick} value='<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/fonts-archive/NanumSquare/NanumSquare.css" type="text/css"/>' className="flex items-center text-sm text-h-1 dark:text-f-8">
                                        <span className="hover:underline tlg:hover:no-underline">예시 복사하기</span>
                                        <i className="copy_btn hidden ml-1 fa-solid fa-check"></i>
                                    </button>
                                </label>
                                <TextInput
                                    onchange={handleFontCdnLinkChange}
                                    state={fontCdnLinkAlert}
                                    stateMsg={[
                                        { state: "", msg: "" },
                                        { state: "empty", msg: "폰트 Link 설정을 올바르게 입력해 주세요." }
                                    ]}
                                    id="font-cdn-link"
                                    tabindex={11}
                                    placeholder='<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/fonts-archive/NanumSquare/NanumSquare.css>'
                                    isLabeled={false}
                                    marginTop={0.5}
                                />
                                <label htmlFor="font-cdn-import" className="mt-8 flex items-center">
                                    <div className="mr-2 font-medium">Import 방식</div>
                                    <button id="font-cdn-import-copy" onClick={copyOnClick} value="@import url('https://cdn.jsdelivr.net/gh/fonts-archive/NanumSquare/NanumSquare.css');" className="flex items-center text-sm text-h-1 dark:text-f-8">
                                        <span className="hover:underline tlg:hover:no-underline">예시 복사하기</span>
                                        <i className="copy_btn hidden ml-1 fa-solid fa-check"></i>
                                    </button>
                                </label>
                                <TextInput
                                    onchange={handleFontCdnImportChange}
                                    state={fontCdnImportAlert}
                                    stateMsg={[
                                        { state: "", msg: "" },
                                        { state: "empty", msg: "폰트 Import 설정을 올바르게 입력해 주세요." }
                                    ]}
                                    id="font-cdn-import"
                                    tabindex={12}
                                    placeholder="@import url('https://cdn.jsdelivr.net/gh/fonts-archive/NanumSquare/NanumSquare.css');"
                                    isLabeled={false}
                                    marginTop={0.5}
                                />
                                <label htmlFor="font-cdn-font-face" className="mt-8 flex items-center">
                                    <div className="mr-2 font-medium">font-face 방식</div>
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
                                        className="flex items-center text-sm text-h-1 dark:text-f-8">
                                        <span className="hover:underline tlg:hover:no-underline">예시 복사하기</span>
                                        <i className="copy_btn hidden ml-1 fa-solid fa-check"></i>
                                    </button>
                                </label>
                                <TextArea
                                    onchange={handleFontCdnFontFaceChange}
                                    state={fontCdnFontFaceAlert}
                                    stateMsg={[
                                        { state: "", msg: "" },
                                        { state: "empty", msg: "폰트 font-face 설정을 올바르게 입력해 주세요." }
                                    ]}
                                    id="font-cdn-font-face"
                                    tabindex={13}
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
}`
                                    }
                                    isLabeled={false}
                                    marginTop={0.5}
                                />
                                <label htmlFor="font-cdn-url" className="mt-8 flex items-center">
                                    <div className="mr-2 font-medium">CDN 주소</div>
                                    <button id="font-cdn-url-copy" onClick={copyOnClick} value="https://cdn.jsdelivr.net/gh/fonts-archive/NanumSquare/NanumSquare.css" className="flex items-center text-sm text-h-1 dark:text-f-8">
                                        <span className="hover:underline tlg:hover:no-underline">예시 복사하기</span>
                                        <i className="copy_btn hidden ml-1 fa-solid fa-check"></i>
                                    </button>
                                </label>
                                <TextInput
                                    onchange={handleFontCdnUrlChange}
                                    state={fontCdnUrlAlert}
                                    stateMsg={[
                                        { state: "", msg: "" },
                                        { state: "empty", msg: "CDN 주소를 올바르게 입력해 주세요." }
                                    ]}
                                    id="font-cdn-url"
                                    tabindex={14}
                                    placeholder='https://cdn.jsdelivr.net/gh/fonts-archive/NanumSquare/NanumSquare.css'
                                    isLabeled={false}
                                    marginTop={0.5}
                                />
                                <TextInput
                                    onchange={handleFontLicenseChange}
                                    state={fontLicenseAlert}
                                    stateMsg={[
                                        { state: "", msg: "" },
                                        { state: "empty", msg: "폰트 라이센스 사용 범위를 올바르게 입력해 주세요." }
                                    ]}
                                    id="font-license"
                                    tabindex={15}
                                    placeholder='HHHHHHNNN'
                                    label="라이센스 사용 범위"
                                    marginTop={2}
                                />
                                <TextArea
                                    onchange={handleFontLicenseTextChange}
                                    state={fontLicenseTextAlert}
                                    stateMsg={[
                                        { state: "", msg: "" },
                                        { state: "empty", msg: "폰트 라이센스 본문을 올바르게 입력해 주세요." }
                                    ]}
                                    id="font-license-text"
                                    tabindex={16}
                                    placeholder={
`네이버에서 제작한 나눔 글꼴과 마루 부리 글꼴, 클로바 나눔손글씨(이하 네이버 글꼴)의 지적 재산권은 네이버와 네이버 문화재단에 있습니다.
네이버 글꼴은 개인 및 기업 사용자를 포함한 모든 사용자에게 무료로 제공되며 글꼴 자체를 유료로 판매하는 것을 제외한 상업적인 사용이 가능합니다.

네이버 글꼴은 본 저작권 안내와 라이선스 전문을 포함해서 다른 소프트웨어와 번들하거나 재배포 또는 판매가 가능하고 자유롭게 수정, 재배포하실 수 있습니다.
네이버 글꼴 라이선스 전문을 포함하기 어려울 경우 출처 표기를 권장합니다. 예) 이 페이지에는 네이버에서 제공한 나눔 고딕 글꼴이 적용되어 있습니다.`
                                    }
                                    label="라이센스 본문"
                                    marginTop={2}
                                />
                            </div>
                            <Button marginTop={1}>
                                <button onClick={addBtnClick} className="w-full h-full">
                                    {
                                        addBtnLoading
                                        ? <span className='loader border-2 border-h-e dark:border-d-6 border-b-h-1 dark:border-b-f-8 w-4 h-4'></span>
                                        : <>추가하기</>
                                    }
                                </button>
                            </Button>
                        </div>
                    </div>
                </div>
            </Motion>

            {/* 풋터 */}
            <Footer/>
        </>
    );
}

export async function getServerSideProps(ctx: any) {
    try {
        // 쿠키 체크
        const { theme } = ctx.req.cookies;

        // 디바이스 체크
        const userAgent = ctx.req ? ctx.req.headers['user-agent'] : navigator.userAgent;

        // 유저 정보 불러오기
        const session: any = await getServerSession(ctx.req, ctx.res, authOptions);

        if (session === null || session.user === undefined || session.user.id !== 1) {
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
                        user: session === null ? null : session.user,
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