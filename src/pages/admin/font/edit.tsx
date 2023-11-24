// react hooks
import { useEffect, useRef, useState } from "react";
import { useQuery } from "react-query";
import { debounce } from "lodash";
import { Switch } from "@mui/material";

// next hooks
import { NextSeo } from "next-seo";

// api
import { CheckIfSessionExists } from "@/pages/api/user/checkifsessionexists";
import { FetchUserInfo } from "@/pages/api/user/fetchuserinfo";
import { FetchFont } from "@/pages/api/admin/font";

// components
import Header from "@/components/header";
import axios from "axios";

const Edit = ({params}: any) => {
    // 디바이스 체크
    const isMac: boolean = params.userAgent.includes("Mac OS") ? true : false

    // 빈 함수
    const emptyFn = () => { return; }

    // 파라미터에서 폰트 조회
    const defaultFont = params.font;

    // 검색 키워드 디폴트: 빈 문자열
    const [keyword, setKeyword] = useState<string>("");
    const [data, setData] = useState<any>([]);
    const [focus, setFocus] = useState<boolean>(false);

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

    // 검색바 ref
    const refSearchBar = useRef<HTMLInputElement>(null);
    const refSearchResult = useRef<HTMLDivElement>(null);

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
            await axios.get(`/api/post/${id}`)
            .then(res => {
                const font = res.data.fonts;
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

                fontCode.value = font.code;
                fontName.value = font.name;
                fontLang.value = font.lang;
                fontDate.value = font.date;
                fontFamily.value = font.font_family;
                fontType.value = font.font_type;
                fontWeight.value = font.font_weight;
                fontSource.value = font.source;
                fontSourceLink.value = font.source_link;
                fontDownloadLink.value = font.github_link;
                fontCdnCss.value = font.cdn_css;
                fontCdnLink.value = font.cdn_link;
                fontCdnImport.value = font.cdn_import;
                fontCdnFontFace.value = font.cdn_font_face;
                fontCdnUrl.value = font.cdn_url;
                fontLicense.value = font.license_print + font.license_web + font.license_video + font.license_package + font.license_embed + font.license_bici + font.license_ofl + font.license_purpose + font.license_source;
                fontLicenseText.value = font.license;
                setShowType(font.show_type);
            })
            .then(() => {
                setFocus(false);
                setFontNameAlert(false);
                setFontLangAlert(false);
                setFontDateAlert(false);
                setFontFamilyAlert(false);
                setFontTypeAlert(false);
                setFontWeightAlert(false);
                setFontSourceAlert(false);
                setFontSourceLinkAlert(false);
                setFontDownloadLinkAlert(false);
                setFontCdnCssAlert(false);
                setFontCdnLinkAlert(false);
                setFontCdnImportAlert(false);
                setFontCdnFontFaceAlert(false);
                setFontCdnUrlAlert(false);
                setFontLicenseAlert(false);
                setFontLicenseTextAlert(false);
            })
            .catch(err => console.log(err));
        }
    }

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

    // 폰트 보임/숨김 change
    const [showType, setShowType] = useState(defaultFont !== null ? defaultFont.show_type : false);
    const handleToggleChange = (e: React.ChangeEvent<HTMLInputElement>) => { setShowType(e.target.checked); }

    // 수정하기 state
    const [editBtnLoading, setEditBtnLoading] = useState<boolean>(false);
    const [editBtnSuccess, setEditBtnSuccess] = useState<string>("");
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

    // 수정하기 onChange 이벤트
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
                    <h2 className='text-[20px] tlg:text-[18px] text-theme-3 dark:text-theme-9 font-medium mb-[12px] tlg:mb-[8px]'>폰트 수정</h2>
                    <div id="edit-btn-success" className="w-[100%]">
                        {
                            editBtnSuccess === "success"
                            ? <>
                                <div className='w-[100%] h-[40px] px-[10px] mb-[10px] flex flex-row justify-between items-center rounded-[6px] border-[2px] border-theme-yellow dark:border-theme-blue-1/80 text-[12px] text-theme-3 dark:text-theme-9 bg-theme-yellow/40 dark:bg-theme-blue-1/20'>
                                    <div className='flex flex-row justify-start items-center'>
                                        <svg className='w-[14px] fill-theme-yellow dark:fill-theme-blue-1/80' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/><path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/></svg>
                                        <div className='ml-[6px]'>폰트가 수정되었습니다.</div>
                                    </div>
                                    <div onClick={handleEditBtnClose} className='flex flex-row justify-center items-center cursor-pointer'>
                                        <svg className='w-[18px] fill-theme-3 dark:fill-theme-9' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/></svg>
                                    </div>
                                </div>
                            </>
                            : editBtnSuccess === "fail"
                                ? <>
                                    <div className='w-[100%] h-[40px] px-[10px] mb-[10px] flex flex-row justify-between items-center rounded-[6px] border-[2px] border-theme-red/80 text-[12px] text-theme-3 dark:text-theme-9 bg-theme-red/20'>
                                        <div className='flex flex-row justify-start items-center'>
                                            <svg className='w-[14px] fill-theme-red/80' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/><path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/></svg>
                                            <div className='ml-[6px]'>폰트를 수정하는데 실패했습니다.</div>
                                        </div>
                                        <div onClick={handleEditBtnClose} className='flex flex-row justify-center items-center cursor-pointer'>
                                            <svg className='w-[18px] fill-theme-3 dark:fill-theme-9' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/></svg>
                                        </div>
                                    </div>
                                </> : <></>
                        }
                    </div>
                    <div className='w-[100%] p-[20px] rounded-[8px] text-theme-10 dark:text-theme-9 bg-theme-5 dark:bg-theme-3 drop-shadow-default dark:drop-shadow-dark'>
                        <div className="w-content relative">
                            <label htmlFor='search-font' className='block text-[14px] ml-px'>폰트 검색</label>
                            <input ref={refSearchBar} onChange={handleSearch} onFocus={handleFocus} type='text' id='search-font' tabIndex={1} placeholder='폰트명/회사명을 입력해 주세요...' className={`w-[280px] border-theme-4 focus:border-theme-yellow dark:border-theme-blue-2 focus:dark:border-theme-blue-1 text-[12px] mt-[8px] px-[14px] py-[6px] rounded-[8px] border-[2px] placeholder-theme-7 dark:placeholder-theme-6 bg-theme-4 dark:bg-theme-blue-2 autofill:bg-theme-4 autofill:dark:bg-theme-blue-2`}/>
                            <div ref={refSearchResult} style={focus ? {display: "block"} : {display: "none"}} className="edit-font-search w-[100%] h-[180px] overflow-y-auto absolute z-10 bottom-[-6px] translate-y-[100%] rounded-[8px] py-[10px] bg-theme-4 dark:bg-theme-blue-2">
                                {
                                    data.fonts && isSuccess && !isLoading && !isRefetching
                                    ? data.fonts.length !== 0
                                        ? data.fonts.map((font: any) => {
                                            return (
                                                <div key={font.code} className="group relative w-[100%] h-[36px] px-[12px] flex items-center bg-transparent hover:bg-theme-yellow hover:dark:bg-theme-blue-1 text-[12px] cursor-pointer">
                                                    <div onClick={() => onFontClick(font.code)} id={font.code} className="w-[100%] h-[100%] absolute z-10 left-0 top-0"></div>
                                                    <div className="text-theme-7 group-hover:text-theme-4 group-hover:dark:text-theme-blue-2">{font.code}</div>
                                                    <div className="text-theme-9 group-hover:text-theme-2 group-hover:dark:text-theme-blue-2 font-bold shrink-0 ml-[12px]">{font.name}</div>
                                                    <div className="ellipsed-text-1 text-theme-7 group-hover:text-theme-4 group-hover:dark:text-theme-blue-2 ml-[12px] text-ellipsis overflow-hidden">{font.source}</div>
                                                </div>
                                            )
                                        })
                                        : <div className="w-[100%] absolute left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%]">
                                            <div className="text-center text-[12px] text-theme-10 dark:text-theme-9">폰트 검색 결과가 없습니다.</div>
                                        </div>
                                    : <></>
                                }
                            </div>
                        </div>
                        <div className="w-[100%] h-px my-[16px] bg-theme-8/80 dark:bg-theme-7/80"></div>
                        <div className="text-[14px] flex flex-col">
                            <label htmlFor="font-code">폰트 번호</label>
                            <input type="text" defaultValue={defaultFont !== null ? defaultFont.code : ""} disabled id="font-code" placeholder="폰트 번호" className='w-[100%] border-theme-6 dark:border-theme-4 text-[12px] mt-[8px] px-[14px] py-[6px] rounded-[8px] border-[2px] placeholder-theme-7 dark:placeholder-theme-6 bg-theme-4 autofill:bg-theme-4 dark:bg-theme-2 autofill:dark:bg-theme-blue-2'/>
                            <div className="block mt-[20px] text-[14px]">폰트 보임/숨김</div>
                            <div className="w-content h-[34px] rounded-[8px] mt-[8px] px-[14px] flex items-center text-[12px] bg-theme-4 dark:bg-theme-blue-2">
                            <div className={`mr-[4px]`}>숨김</div>
                            <Switch
                                checked={showType}
                                onChange={handleToggleChange}
                                size="small"
                            />
                            <div className={`${showType ? "text-theme-green" : ""} ml-[6px]`}>보임</div>
                        </div>
                            <label htmlFor="font-name" className="mt-[20px]">폰트 이름</label>
                            <input onChange={handleFontNameChange} defaultValue={defaultFont !== null ? defaultFont.name : ""} tabIndex={2} type="text" id="font-name" placeholder="나눔 스퀘어" className={`w-[100%] ${fontNameAlert ? 'border-theme-red focus:border-theme-red' : 'border-theme-4 focus:border-theme-yellow dark:border-theme-blue-2 focus:dark:border-theme-blue-1' } text-[12px] mt-[8px] px-[14px] py-[6px] rounded-[8px] border-[2px] placeholder-theme-7 dark:placeholder-theme-6 bg-theme-4 dark:bg-theme-blue-2 autofill:bg-theme-4 autofill:dark:bg-theme-blue-2`}/>
                            {
                                fontNameAlert
                                ? <div className="text-[10px] ml-[16px] mt-[6px] text-theme-red">폰트명을 올바르게 입력해 주세요.</div>
                                : <></>
                            }
                            <label htmlFor="font-lang" className="mt-[20px]">
                                <div className="inline-block mr-[6px]">폰트 언어</div>
                                <div className="inline-block leading-loose text-[12px] text-theme-yellow dark:text-theme-blue-1 cursor-text">[KR, EN]</div>
                            </label>
                            <input onChange={handleFontLangChange} defaultValue={defaultFont !== null ? defaultFont.lang : ""} tabIndex={3} type="text" id="font-lang" placeholder="KR" maxLength={2} className={`w-[100%] ${fontLangAlert ? 'border-theme-red focus:border-theme-red' : 'border-theme-4 focus:border-theme-yellow dark:border-theme-blue-2 focus:dark:border-theme-blue-1' } text-[12px] mt-[8px] px-[14px] py-[6px] rounded-[8px] border-[2px] placeholder-theme-7 dark:placeholder-theme-6 bg-theme-4 dark:bg-theme-blue-2 autofill:bg-theme-4 autofill:dark:bg-theme-blue-2`}/>
                            {
                                fontLangAlert
                                ? <div className="text-[10px] ml-[16px] mt-[6px] text-theme-red">폰트 언어를 올바르게 입력해 주세요.</div>
                                : <></>
                            }
                            <label htmlFor="font-date" className="mt-[20px]">폰트 생성 날짜</label>
                            <input onChange={handleFontDateChange} defaultValue={defaultFont !== null ? defaultFont.date : ""} tabIndex={4} type="text" id="font-date" placeholder="99.01.01" className={`w-[100%] ${fontDateAlert ? 'border-theme-red focus:border-theme-red' : 'border-theme-4 focus:border-theme-yellow dark:border-theme-blue-2 focus:dark:border-theme-blue-1' } text-[12px] mt-[8px] px-[14px] py-[6px] rounded-[8px] border-[2px] placeholder-theme-7 dark:placeholder-theme-6 bg-theme-4 dark:bg-theme-blue-2 autofill:bg-theme-4 autofill:dark:bg-theme-blue-2`}/>
                            {
                                fontDateAlert
                                ? <div className="text-[10px] ml-[16px] mt-[6px] text-theme-red">폰트 생성 날짜를 올바르게 입력해 주세요.</div>
                                : <></>
                            }
                            <label htmlFor="font-family" className="mt-[20px]">폰트체</label>
                            <input onChange={handleFontFamilyChange} defaultValue={defaultFont !== null ? defaultFont.font_family : ""} tabIndex={5} type="text" id="font-family" placeholder="Nanum Square" className={`w-[100%] ${fontFamilyAlert ? 'border-theme-red focus:border-theme-red' : 'border-theme-4 focus:border-theme-yellow dark:border-theme-blue-2 focus:dark:border-theme-blue-1' } text-[12px] mt-[8px] px-[14px] py-[6px] rounded-[8px] border-[2px] placeholder-theme-7 dark:placeholder-theme-6 bg-theme-4 dark:bg-theme-blue-2 autofill:bg-theme-4 autofill:dark:bg-theme-blue-2`}/>
                            {
                                fontFamilyAlert
                                ? <div className="text-[10px] ml-[16px] mt-[6px] text-theme-red">폰트체를 올바르게 입력해 주세요.</div>
                                : <></>
                            }
                            <label htmlFor="font-type" className="mt-[20px]">
                                <div className="inline-block mr-[6px]">폰트 형태</div>
                                <div className="inline-block leading-loose text-[12px] text-theme-yellow dark:text-theme-blue-1 cursor-text">[Sans Serif, Serif, Hand Writing, Display, Pixel]</div>
                            </label>
                            <input onChange={handleFontTypeChange} defaultValue={defaultFont !== null ? defaultFont.font_type : ""} tabIndex={6} type="text" id="font-type" placeholder="Sans Serif" className={`w-[100%] ${fontTypeAlert ? 'border-theme-red focus:border-theme-red' : 'border-theme-4 focus:border-theme-yellow dark:border-theme-blue-2 focus:dark:border-theme-blue-1' } text-[12px] mt-[8px] px-[14px] py-[6px] rounded-[8px] border-[2px] placeholder-theme-7 dark:placeholder-theme-6 bg-theme-4 dark:bg-theme-blue-2 autofill:bg-theme-4 autofill:dark:bg-theme-blue-2`}/>
                            {
                                fontTypeAlert
                                ? <div className="text-[10px] ml-[16px] mt-[6px] text-theme-red">폰트 형태를 올바르게 입력해 주세요.</div>
                                : <></>
                            }
                            <label htmlFor="font-weight" className="mt-[20px]">폰트 두께</label>
                            <input onChange={handleFontWeightChange} defaultValue={defaultFont !== null ? defaultFont.font_weight : ""} tabIndex={7} type="text" id="font-weight" placeholder="NNNYNNNNN" className={`w-[100%] ${fontWeightAlert ? 'border-theme-red focus:border-theme-red' : 'border-theme-4 focus:border-theme-yellow dark:border-theme-blue-2 focus:dark:border-theme-blue-1' } text-[12px] mt-[8px] px-[14px] py-[6px] rounded-[8px] border-[2px] placeholder-theme-7 dark:placeholder-theme-6 bg-theme-4 dark:bg-theme-blue-2 autofill:bg-theme-4 autofill:dark:bg-theme-blue-2`}/>
                            {
                                fontWeightAlert
                                ? <div className="text-[10px] ml-[16px] mt-[6px] text-theme-red">폰트 두께를 올바르게 입력해 주세요.</div>
                                : <></>
                            }
                            <label htmlFor="font-source" className="mt-[20px]">폰트 출처</label>
                            <input onChange={handleFontSourceChange} defaultValue={defaultFont !== null ? defaultFont.source : ""} tabIndex={8} type="text" id="font-source" placeholder="네이버" className={`w-[100%] ${fontSourceAlert ? 'border-theme-red focus:border-theme-red' : 'border-theme-4 focus:border-theme-yellow dark:border-theme-blue-2 focus:dark:border-theme-blue-1' } text-[12px] mt-[8px] px-[14px] py-[6px] rounded-[8px] border-[2px] placeholder-theme-7 dark:placeholder-theme-6 bg-theme-4 dark:bg-theme-blue-2 autofill:bg-theme-4 autofill:dark:bg-theme-blue-2`}/>
                            {
                                fontSourceAlert
                                ? <div className="text-[10px] ml-[16px] mt-[6px] text-theme-red">폰트 출처를 올바르게 입력해 주세요.</div>
                                : <></>
                            }
                            <label htmlFor="font-source-link" className="mt-[20px]">폰트 출처 링크</label>
                            <input onChange={handleFontSourceLinkChange} defaultValue={defaultFont !== null ? defaultFont.source_link : ""} tabIndex={9} type="text" id="font-source-link" placeholder="https://hangeul.naver.com/font" className={`w-[100%] ${fontSourceLinkAlert ? 'border-theme-red focus:border-theme-red' : 'border-theme-4 focus:border-theme-yellow dark:border-theme-blue-2 focus:dark:border-theme-blue-1' } text-[12px] mt-[8px] px-[14px] py-[6px] rounded-[8px] border-[2px] placeholder-theme-7 dark:placeholder-theme-6 bg-theme-4 dark:bg-theme-blue-2 autofill:bg-theme-4 autofill:dark:bg-theme-blue-2`}/>
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
                            <input onChange={handleFontDownloadLinkChange} defaultValue={defaultFont !== null ? defaultFont.github_link : ""} tabIndex={10} type="text" id="font-download-link" placeholder="https://github.com/fonts-archive/NanumSquare/archive/refs/heads/main.zip" className={`w-[100%] ${fontDownloadLinkAlert ? 'border-theme-red focus:border-theme-red' : 'border-theme-4 focus:border-theme-yellow dark:border-theme-blue-2 focus:dark:border-theme-blue-1' } text-[12px] mt-[8px] px-[14px] py-[6px] rounded-[8px] border-[2px] placeholder-theme-7 dark:placeholder-theme-6 bg-theme-4 dark:bg-theme-blue-2 autofill:bg-theme-4 autofill:dark:bg-theme-blue-2`}/>
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
                            <input onChange={handleFontCdnCssChange} defaultValue={defaultFont !== null ? defaultFont.cdn_css : ""} tabIndex={11} type="text" id="font-cdn-css" placeholder="font-family: 'Nanum Square';" className={`w-[100%] ${fontCdnCssAlert ? 'border-theme-red focus:border-theme-red' : 'border-theme-4 focus:border-theme-yellow dark:border-theme-blue-2 focus:dark:border-theme-blue-1' } text-[12px] mt-[8px] px-[14px] py-[6px] rounded-[8px] border-[2px] placeholder-theme-7 dark:placeholder-theme-6 bg-theme-4 dark:bg-theme-blue-2 autofill:bg-theme-4 autofill:dark:bg-theme-blue-2`}/>
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
                            <input onChange={handleFontCdnLinkChange} defaultValue={defaultFont !== null ? defaultFont.cdn_link : ""} tabIndex={12} type="text" id="font-cdn-link" placeholder='<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/fonts-archive/NanumSquare/NanumSquare.css" type="text/css"/>' className={`w-[100%] ${fontCdnLinkAlert ? 'border-theme-red focus:border-theme-red' : 'border-theme-4 focus:border-theme-yellow dark:border-theme-blue-2 focus:dark:border-theme-blue-1' } text-[12px] mt-[8px] px-[14px] py-[6px] rounded-[8px] border-[2px] placeholder-theme-7 dark:placeholder-theme-6 bg-theme-4 dark:bg-theme-blue-2 autofill:bg-theme-4 autofill:dark:bg-theme-blue-2`}/>
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
                            <input onChange={handleFontCdnImportChange} defaultValue={defaultFont !== null ? defaultFont.cdn_import : ""} tabIndex={13} type="text" id="font-cdn-import" placeholder="@import url('https://cdn.jsdelivr.net/gh/fonts-archive/NanumSquare/NanumSquare.css');" className={`w-[100%] ${fontCdnImportAlert ? 'border-theme-red focus:border-theme-red' : 'border-theme-4 focus:border-theme-yellow dark:border-theme-blue-2 focus:dark:border-theme-blue-1' } text-[12px] mt-[8px] px-[14px] py-[6px] rounded-[8px] border-[2px] placeholder-theme-7 dark:placeholder-theme-6 bg-theme-4 dark:bg-theme-blue-2 autofill:bg-theme-4 autofill:dark:bg-theme-blue-2`}/>
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
                                tabIndex={14}
                                defaultValue={defaultFont !== null ? defaultFont.cdn_font_face : ""}
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
                            <input onChange={handleFontCdnUrlChange} defaultValue={defaultFont !== null ? defaultFont.cdn_url : ""} tabIndex={15} type="text" id="font-cdn-url" placeholder="https://cdn.jsdelivr.net/gh/fonts-archive/NanumSquare/NanumSquare.css" className={`w-[100%] ${fontCdnUrlAlert ? 'border-theme-red focus:border-theme-red' : 'border-theme-4 focus:border-theme-yellow dark:border-theme-blue-2 focus:dark:border-theme-blue-1' } text-[12px] mt-[8px] px-[14px] py-[6px] rounded-[8px] border-[2px] placeholder-theme-7 dark:placeholder-theme-6 bg-theme-4 dark:bg-theme-blue-2 autofill:bg-theme-4 autofill:dark:bg-theme-blue-2`}/>
                            {
                                fontCdnUrlAlert
                                ? <div className="text-[10px] ml-[16px] mt-[6px] text-theme-red">CDN 주소를 올바르게 입력해 주세요.</div>
                                : <></>
                            }
                            <label htmlFor="font-license" className="mt-[20px]">라이센스 사용 범위</label>
                            <input onChange={handleFontLicenseChange} defaultValue={defaultFont !== null ? defaultFont.license_print + defaultFont.license_web + defaultFont.license_video + defaultFont.license_package + defaultFont.license_embed + defaultFont.license_bici + defaultFont.license_ofl + defaultFont.license_purpose + defaultFont.license_source : ""} tabIndex={16} type="text" id="font-license" placeholder="HHHHHHNNN" className={`w-[100%] ${fontLicenseAlert ? 'border-theme-red focus:border-theme-red' : 'border-theme-4 focus:border-theme-yellow dark:border-theme-blue-2 focus:dark:border-theme-blue-1' } text-[12px] mt-[8px] px-[14px] py-[6px] rounded-[8px] border-[2px] placeholder-theme-7 dark:placeholder-theme-6 bg-theme-4 dark:bg-theme-blue-2 autofill:bg-theme-4 autofill:dark:bg-theme-blue-2`}/>
                            {
                                fontLicenseAlert
                                ? <div className="text-[10px] ml-[16px] mt-[6px] text-theme-red">폰트 라이센스 사용 범위를 올바르게 입력해 주세요.</div>
                                : <></>
                            }
                            <label htmlFor="font-license-text" className="mt-[20px]">라이센스 본문</label>
                            <textarea 
                                onChange={handleFontLicenseTextChange}
                                id="font-license-text" 
                                tabIndex={17}
                                defaultValue={defaultFont !== null ? defaultFont.license : ""}
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
                        <button onClick={editBtnClick} className="w-[100%] h-[34px] rounded-[8px] mt-[20px] font-medium text-[12px] text-theme-5 dark:text-theme-3 bg-theme-yellow/80 hover:bg-theme-yellow dark:bg-theme-blue-1/80 hover:dark:bg-theme-blue-1 tlg:hover:dark:bg-theme-blue-1">
                            {
                                editBtnLoading
                                ? <span className='loader loader-register w-[16px] h-[16px] mt-[2px]'></span>
                                : <>수정하기</>
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

        // 쿼리가 있으면 폰트 불러오기
        const font = await FetchFont(Number(ctx.query.code));

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
                        font: JSON.parse(JSON.stringify(font)),
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