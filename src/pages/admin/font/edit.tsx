// react
import { useEffect, useRef, useState } from "react";
import { useQuery } from "react-query";
import { debounce } from "lodash";
import { Switch } from "@mui/material";

// next
import { useRouter } from "next/router";

// next-auth
import { getServerSession } from "next-auth";
import { authOptions } from '@/pages/api/auth/[...nextauth]';

// api
import { FetchFont } from "@/pages/api/admin/font";

// libraries
import axios from "axios";
import { NextSeo } from "next-seo";

// components
import Header from "@/components/header";
import Footer from "@/components/footer";
import TextInput from "@/components/textinput";
import TextArea from "@/components/textarea";
import Button from "@/components/button";

const Edit = ({params}: any) => {
    const { theme, userAgent, user, font } = params;
    const defaultFont = font;

    // 디바이스 체크
    const isMac: boolean = userAgent.includes("Mac OS") ? true : false;

    // router
    const router = useRouter();

    // refs
    const refSearchBar = useRef<HTMLInputElement>(null);
    const refSearchResult = useRef<HTMLDivElement>(null);

    // states
    const [keyword, setKeyword] = useState<string>("");
    const [data, setData] = useState<any>([]);
    const [focus, setFocus] = useState<boolean>(false);
    const [showType, setShowType] = useState(defaultFont !== null ? defaultFont.show_type : false);
    const [editBtnLoading, setEditBtnLoading] = useState<boolean>(false);
    const [editBtnSuccess, setEditBtnSuccess] = useState<string>("");
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

    // onChange
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

    // useQuery를 이용한 데이터 파싱
    const {
        isLoading, 
        isRefetching, 
        isSuccess, 
        refetch
    } = useQuery(['font-search'], async () => {
        await axios.get("/api/fontsearch", { params: {
            keyword: keyword,
            action: "admin"
        }})
        .then((res) => { setData(res.data); })
        .catch(err => console.log(err));
    });

    /** lodash/debounce가 적용된 검색 기능 */
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => { debouncedSearch(e); }
    const debouncedSearch = debounce((e) => { setKeyword(e.target.value); }, 500);

    // 검색 키워드가 변경되거나, 검색창이 띄워지면 refetch
    useEffect(() => { refetch(); }, [keyword, focus, refetch]);

    /** 검색바가 포커스 되면 검색창 띄우기 */
    const handleFocus = () => { setFocus(true); }

    // 검색바 외 클릭
    useEffect(() => {
        function handleAccountOutside(e:Event) {
            if (refSearchBar?.current && !refSearchBar.current.contains(e.target as Node) && refSearchResult.current && !refSearchResult.current.contains(e.target as Node)) {
                setFocus(false);
            }
        }
        document.addEventListener("mouseup", handleAccountOutside);
        return () => document.removeEventListener("mouseup", handleAccountOutside);
    },[refSearchBar, refSearchResult]);

    /** 검색 결과 클릭 */
    const onFontClick = async (id: number) => {
        if (id) {
            router.push(`/admin/font/edit?code=${id}`);
            setFocus(false);
        }
    }

    /** 예시 복사하기 버튼 클릭 이벤트 */
    const copyOnClick = (e: React.MouseEvent) => {
        const btn = document.getElementById(e.currentTarget.id) as HTMLButtonElement;
        const copyBtn = btn.getElementsByClassName("copy_btn")[0] as HTMLLIElement;

        window.navigator.clipboard.writeText(btn.value);

        copyBtn.style.display = 'block';
        setTimeout(function() {
            copyBtn.style.display = 'none';
        },1000);
    }

    // 폰트 보임/숨김 change
    const handleToggleChange = (e: React.ChangeEvent<HTMLInputElement>) => { setShowType(e.target.checked); }

    /** 수정하기 버튼 클릭 */
    const editBtnClick = async () => {
        const fontCode = document.getElementById("font-code") as HTMLInputElement;
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
        const fontCdnUrl = document.getElementById("font-cdn-url") as HTMLInputElement;
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
            setEditBtnLoading(true);

            await axios.post("/api/admin/font", {
                action: "edit",
                id: fontCode.value,
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
                show_type: showType
            })
            .then(res => {
                console.log(res.data.msg);
                setEditBtnLoading(false);
                setEditBtnSuccess("success");
                window.scrollTo({top: 0});
            })
            .catch(err => {
                console.log(err);
                setEditBtnLoading(false);
                setEditBtnSuccess("fail");
                window.scrollTo({top: 0});
            });
        }
    }

    // 수정 완료/실패 팝업 닫기 버튼 클릭
    const handleEditBtnClose = () => { setEditBtnSuccess(""); }

    return (
        <>
            {/* Head 부분*/}
            <NextSeo 
                title={"폰트 수정 · 폰트 아카이브"}
                description={"폰트 수정 - 폰트 아카이브 · 상업용 무료 한글 폰트 저장소"}
            />

            {/* 헤더 */}
            <Header
                isMac={isMac}
                theme={theme}
                user={user}
            />

            {/* 메인 */}
            <div className='w-full px-4 flex flex-col justify-center items-center'>
                <div className='max-w-[45rem] w-full flex flex-col justify-center items-start py-24 tlg:py-16'>
                    <h2 className='text-2xl tlg:text-xl text-l-2 dark:text-white font-bold mb-4'>폰트 수정</h2>
                    <div id="edit-btn-success" className="w-full">
                        {
                            editBtnSuccess === "success"
                            ? <div className='w-full h-10 px-2.5 mb-3 flex justify-between items-center rounded-lg border-2 border-h-1 dark:border-f-8 text-xs text-l-2 dark:text-white bg-h-1/20 dark:bg-f-8/20'>
                                <div className='flex items-center'>
                                    <i className="text-sm text-h-1 dark:text-f-8 fa-regular fa-bell"></i>
                                    <div className='ml-2'>폰트가 수정되었습니다.</div>
                                </div>
                                <div onClick={handleEditBtnClose} className='flex justify-center items-center cursor-pointer'>
                                    <i className="text-sm fa-solid fa-xmark"></i>
                                </div>
                            </div>
                            : editBtnSuccess === "fail"
                                ? <div className='w-full h-10 px-2.5 mb-3 flex justify-between items-center rounded-lg border-2 border-h-r text-xs text-l-2 dark:text-white bg-h-r/20'>
                                    <div className='flex items-center'>
                                        <i className="text-sm text-h-r fa-regular fa-bell"></i>
                                        <div className='ml-2'>폰트를 수정하는데 실패했습니다.</div>
                                    </div>
                                    <div onClick={handleEditBtnClose} className='flex justify-center items-center cursor-pointer'>
                                        <i className="text-sm fa-solid fa-xmark"></i>
                                    </div>
                                </div> : <></>
                        }
                    </div>
                    <div className='w-full p-5 rounded-lg text-l-2 dark:text-white bg-l-e dark:bg-d-3 drop-shadow-default dark:drop-shadow-dark'>
                        <div className="w-full relative text-l-2 dark:text-white">
                            <label htmlFor='search-font' className='block ml-px font-medium'>폰트 검색</label>
                            <input ref={refSearchBar} onChange={handleSearch} onFocus={handleFocus} autoComplete="off" type='text' id='search-font' tabIndex={1} placeholder='폰트명/회사명을 입력해 주세요...' className={`w-full mt-2 px-3.5 py-3 text-sm rounded-lg border-2 placeholder-l-5 dark:placeholder-d-c border-l-d dark:border-d-4 focus:border-h-1 focus:dark:border-f-8 bg-l-d dark:bg-d-4`}/>
                            <div ref={refSearchResult} style={focus ? {display: "block"} : {display: "none"}} className="custom-sm-scrollbar w-full h-44 py-2.5 overflow-y-auto absolute z-10 -bottom-1.5 translate-y-full rounded-lg text-sm drop-shadow-default dark:drop-shadow-dark bg-l-d dark:bg-d-4">
                                {
                                    data.fonts && isSuccess && !isLoading && !isRefetching
                                    ? data.fonts.length !== 0
                                        ? data.fonts.map((font: any) => {
                                            return (
                                                <div key={font.code} className="group relative w-full h-9 px-3 flex items-center gap-3 bg-transparent hover:bg-h-1 hover:dark:bg-f-8 hover:text-white hover:dark:text-d-2 cursor-pointer">
                                                    <div onClick={() => onFontClick(font.code)} id={font.code} className="w-full h-full absolute z-10 left-0 top-0"></div>
                                                    <div className="text-l-5 dark:text-d-c group-hover:text-white group-hover:dark:text-d-4">{font.code}</div>
                                                    <div className="font-medium shrink-0">{font.name}</div>
                                                    <div className="ellipsed-text text-l-5 dark:text-d-c group-hover:text-white group-hover:dark:text-d-4">{font.source}</div>
                                                </div>
                                            )
                                        })
                                        : <div className="w-full absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                                            <div className="text-center">폰트 검색 결과가 없습니다.</div>
                                        </div>
                                    : <></>
                                }
                            </div>
                        </div>
                        <div className="w-full h-px my-6 bg-l-b dark:bg-d-6"></div>
                        <div className="flex flex-col">
                            <TextInput
                                id="font-code"
                                value={defaultFont !== null ? defaultFont.code : ""}
                                tabindex={2}
                                placeholder="폰트 번호"
                                label="폰트 번호"
                                disabled
                            />
                            <div className="mt-8 font-medium">폰트 보임/숨김</div>
                            <div className="w-max h-12 rounded-lg mt-2 px-3.5 flex items-center text-sm bg-l-d dark:bg-d-4">
                            <div className="mr-1.5">숨김</div>
                            <Switch
                                checked={showType}
                                onChange={handleToggleChange}
                                size="small"
                            />
                            <div className={`${showType ? "text-h-1 dark:text-f-8" : ""} ml-1.5`}>보임</div>
                        </div>
                            <TextInput
                                onchange={handleFontNameChange}
                                state={fontNameAlert}
                                stateMsg={[
                                    { state: "", msg: "" },
                                    { state: "empty", msg: "폰트명을 올바르게 입력해 주세요." }
                                ]}
                                value={defaultFont !== null ? defaultFont.name : ""}
                                id="font-name"
                                tabindex={3}
                                placeholder="나눔 스퀘어"
                                label="폰트 이름"
                                marginTop={2}
                            />
                            <label htmlFor="font-lang" className="mt-8 flex items-center font-medium">
                                폰트 언어
                                <div className="ml-2 font-normal text-sm text-h-1 dark:text-f-8">[KR, EN]</div>
                            </label>
                            <TextInput
                                onchange={handleFontLangChange}
                                state={fontLangAlert}
                                stateMsg={[
                                    { state: "", msg: "" },
                                    { state: "empty", msg: "폰트 언어를 올바르게 입력해 주세요." }
                                ]}
                                value={defaultFont !== null ? defaultFont.lang : ""}
                                id="font-lang"
                                tabindex={4}
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
                                value={defaultFont !== null ? defaultFont.date : ""}
                                id="font-date"
                                tabindex={5}
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
                                value={defaultFont !== null ? defaultFont.font_family : ""}
                                id="font-family"
                                tabindex={6}
                                placeholder="Nanum Square"
                                label="폰트체"
                                marginTop={2}
                            />
                            <label htmlFor="font-type" className="mt-8 flex items-center font-medium">
                                폰트 형태
                                <div className="ml-2 font-normal text-sm text-h-1 dark:text-f-8">[Sans Serif, Serif, Hand Writing, Display, Pixel]</div>
                            </label>
                            <TextInput
                                onchange={handleFontTypeChange}
                                state={fontTypeAlert}
                                stateMsg={[
                                    { state: "", msg: "" },
                                    { state: "empty", msg: "폰트 형태를 올바르게 입력해 주세요." }
                                ]}
                                value={defaultFont !== null ? defaultFont.font_type : ""}
                                id="font-type"
                                tabindex={7}
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
                                value={defaultFont !== null ? defaultFont.font_weight : ""}
                                id="font-weight"
                                tabindex={8}
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
                                value={defaultFont !== null ? defaultFont.source : ""}
                                id="font-source"
                                tabindex={9}
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
                                value={defaultFont !== null ? defaultFont.source_link : ""}
                                id="font-source-link"
                                tabindex={10}
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
                                value={defaultFont !== null ? defaultFont.github_link : ""}
                                id="font-download-link"
                                tabindex={11}
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
                                value={defaultFont !== null ? defaultFont.cdn_css : ""}
                                id="font-cdn-css"
                                tabindex={12}
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
                                value={defaultFont !== null ? defaultFont.cdn_link : ""}
                                id="font-cdn-link"
                                tabindex={13}
                                placeholder='<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/fonts-archive/NanumSquare/NanumSquare.css" type="text/css"/>'
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
                                value={defaultFont !== null ? defaultFont.cdn_import : ""}
                                id="font-cdn-import"
                                tabindex={14}
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
                                value={defaultFont !== null ? defaultFont.cdn_font_face : ""}
                                id="font-cdn-font-face"
                                tabindex={15}
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
                                value={defaultFont !== null ? defaultFont.cdn_url : ""}
                                id="font-cdn-url"
                                tabindex={16}
                                placeholder="https://cdn.jsdelivr.net/gh/fonts-archive/NanumSquare/NanumSquare.css"
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
                                value={defaultFont !== null ? defaultFont.license_print + defaultFont.license_web + defaultFont.license_video + defaultFont.license_package + defaultFont.license_embed + defaultFont.license_bici + defaultFont.license_ofl + defaultFont.license_purpose + defaultFont.license_source : ""}
                                id="font-license"
                                tabindex={17}
                                placeholder="HHHHHHNNN"
                                label="라이센스 사용 범위"
                                marginTop={2}
                            />
                            <TextArea 
                                onchange={handleFontLicenseTextChange}
                                state={fontCdnFontFaceAlert}
                                stateMsg={[
                                    { state: "", msg: "" },
                                    { state: "empty", msg: "폰트 라이센스 본문을 올바르게 입력해 주세요." }
                                ]}
                                value={defaultFont !== null ? defaultFont.license : ""}
                                id="font-license-text"
                                tabindex={18}
                                label="라이센스 본문"
                                marginTop={2}
                                placeholder={
`네이버에서 제작한 나눔 글꼴과 마루 부리 글꼴, 클로바 나눔손글씨(이하 네이버 글꼴)의 지적 재산권은 네이버와 네이버 문화재단에 있습니다.
네이버 글꼴은 개인 및 기업 사용자를 포함한 모든 사용자에게 무료로 제공되며 글꼴 자체를 유료로 판매하는 것을 제외한 상업적인 사용이 가능합니다.

네이버 글꼴은 본 저작권 안내와 라이선스 전문을 포함해서 다른 소프트웨어와 번들하거나 재배포 또는 판매가 가능하고 자유롭게 수정, 재배포하실 수 있습니다.
네이버 글꼴 라이선스 전문을 포함하기 어려울 경우 출처 표기를 권장합니다. 예) 이 페이지에는 네이버에서 제공한 나눔 고딕 글꼴이 적용되어 있습니다.`} 
                            />
                        </div>
                        <Button marginTop={1}>
                            <button onClick={editBtnClick} className="w-full h-full">
                                {
                                    editBtnLoading
                                    ? <span className='loader border-2 border-h-e dark:border-d-6 border-b-h-1 dark:border-b-f-8 w-4 h-4'></span>
                                    : <>수정하기</>
                                }
                            </button>
                        </Button>
                    </div>
                </div>
            </div>

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
            // 쿼리가 있으면 폰트 불러오기
            const font = ctx.query.code ? await FetchFont(Number(ctx.query.code)) : null;

            return {
                props: {
                    params: {
                        theme: theme ? theme : 'light',
                        userAgent: userAgent,
                        user: session === null ? null : session.user,
                        font: font ? JSON.parse(JSON.stringify(font)) : null,
                    }
                }
            }
        }
    }
    catch (error) {
        console.log(error);
    }
}

export default Edit;