// react
import { useState } from "react"

// components
import SelectBox from "@/components/selectbox"

interface Sidemenu {
    lang: string,
    license: string,
    type: string,
    sort: string,
    source: string,
    text: string,
    searchword: string,
    handleTextChange: any,
    handleLangOptionChange: any,
    handleLicenseOptionChange: any,
    handleTypeOptionChange: any,
    handleSortOptionChange: any,
    handleSearch: any,
    resetFilter: any,
}

export default function Sidemenu ({
    lang,
    license,
    type,
    sort,
    source,
    text,
    searchword,
    handleTextChange,
    handleLangOptionChange,
    handleLicenseOptionChange,
    handleTypeOptionChange,
    handleSortOptionChange,
    handleSearch,
    resetFilter,
}: Sidemenu) {
    // states
    const [expand, setExpand] = useState<boolean>(true);

    /** 사이드 메뉴 펼치기/접기 */
    const handleExpand = (e: React.ChangeEvent<HTMLInputElement>) => { setExpand(e.target.checked); }

    /** 필터 초기화하기 */
    const handleResetFilter = () => {
        const textP = document.getElementById("text-p") as HTMLTextAreaElement;
        const textS = document.getElementById("text-s") as HTMLInputElement;
        textP.value = "";
        textS.value = "";
        resetFilter();
    }

    return (
        <div className={`${expand ? "w-80 mr-4" : "w-0 mr-8"} shrink-0 duration-200`}>
            <div className={`${expand ? "w-[calc(100%-320px)] pl-4" : "w-full pl-8"} h-16 fixed z-10 top-16 right-0 flex items-center duration-200 bg-white`}>
                <input
                    type="checkbox"
                    id="expand-filter"
                    className="peer hidden"
                    onChange={handleExpand}
                    checked={expand}
                />
                <label htmlFor="expand-filter" className="px-4 py-1.5 text-sm font-medium rounded-full cursor-pointer border border-h-1 peer-checked:hover:border-h-0 hover:bg-h-1/10 peer-checked:bg-h-1 peer-checked:hover:bg-h-0 text-h-1 peer-checked:text-white">
                    <i className="mr-1.5 bi bi-sliders2"></i>
                    필터
                </label>
                <button onClick={handleResetFilter} className={`${
                    license === "all" && lang === "all" && type === "all" && sort === "date" && text === "" && searchword === ""
                    ? "text-l-b hover:bg-transparent cursor-default"
                    : "text-h-1 hover:bg-h-e"
                } ml-1.5 px-3 py-2 rounded-lg text-sm`}>
                <i className="mr-2 fa-solid fa-rotate-right"></i>
                필터 초기화
            </button>
            </div>
            <div className={`${expand ? "left-0" : "-left-80"} w-80 custom-sm-scrollbar h-full pt-32 p-8 fixed z-10 top-0 duration-200 bg-h-f`}>
                <div className="absolute right-8 top-[76px] flex items-center">
                    <button onClick={handleResetFilter} className={`${
                            license === "all" && lang === "all" && type === "all" && sort === "date" && text === "" && searchword === ""
                            ? "text-l-b hover:bg-transparent cursor-default"
                            : "text-h-1 hover:bg-h-e"
                        } mr-1 mt-0.5 px-3 py-2 rounded-lg text-sm`}>
                        <i className="mr-2 fa-solid fa-rotate-right"></i>
                        필터 초기화
                    </button>
                    <input
                        type="checkbox"
                        id="expand"
                        className="hidden"
                        onChange={handleExpand}
                        checked={expand}
                    />
                    <label htmlFor="expand" className="w-10 h-10 relative flex justify-center items-center text-3xl rounded-full cursor-pointer text-l-2 hover:bg-h-e">
                        <i className="bi bi-x"></i>
                    </label>
                </div>
                <h2 className="font-bold mb-4 text-l-2">폰트 미리보기</h2>
                <textarea
                    id="text-p"
                    className="custom-sm-scrollbar resize-none w-full h-48 px-3.5 py-3 text-sm rounded-lg border-2 border-transparent focus:border-h-1 bg-h-e placeholder-l-5"
                    placeholder="원하는 문구를 적어보세요."
                    onChange={handleTextChange}
                ></textarea>
                <div className="w-full h-px my-4 mb-8 bg-l-b"></div>
                <h2 className="font-bold mb-4 text-l-2">필터</h2>
                <input
                    id="text-s"
                    onChange={handleSearch}
                    type="text"
                    placeholder="폰트, 회사명을 검색해 보세요."
                    defaultValue={source}
                    className="w-full px-3.5 py-3 mb-2 text-sm rounded-lg border-2 border-transparent focus:border-h-1 bg-h-e placeholder-l-5"
                />
                <SelectBox
                    title="언어 선택"
                    icon="bi-globe2"
                    value="lang"
                    select={lang}
                    options={[
                        { value: "all", name: "전체" },
                        { value: "kr", name: "한국어" },
                        { value: "en", name: "영어" },
                    ]}
                    optionChange={handleLangOptionChange}
                />
                <SelectBox
                    title="허용 범위"
                    icon="bi-shield-shaded"
                    value="license"
                    select={license}
                    options={[
                        { value: "all", name: "전체" },
                        { value: "print", name: "인쇄물" },
                        { value: "web", name: "웹 서비스" },
                        { value: "video", name: "영상물" },
                        { value: "package", name: "포장지" },
                        { value: "embed", name: "임베딩" },
                        { value: "bici", name: "BI/CI" },
                        { value: "ofl", name: "OFL" },
                    ]}
                    optionChange={handleLicenseOptionChange}
                />
                <SelectBox
                    title="폰트 타입"
                    icon="bi-type"
                    value="type"
                    select={type}
                    options={[
                        { value: "all", name: "전체" },
                        { value: "sans-serif", name: "고딕" },
                        { value: "serif", name: "명조" },
                        { value: "hand-writing", name: "손글씨" },
                        { value: "display", name: "장식체" },
                        { value: "pixel", name: "픽셀체" },
                    ]}
                    optionChange={handleTypeOptionChange}
                />
                <SelectBox
                    title="정렬 기준"
                    icon="bi-sort-down"
                    value="sort"
                    select={sort}
                    options={[
                        { value: "date", name: "최신순" },
                        { value: "view", name: "조회순" },
                        { value: "like", name: "인기순" },
                        { value: "name", name: "이름순" },
                    ]}
                    optionChange={handleSortOptionChange}
                />
            </div>
        </div>
    )
}