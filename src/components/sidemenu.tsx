// components
import SelectBox from "@/components/selectbox"

interface Sidemenu {
    lang: string,
    license: string,
    type: string,
    sort: string,
    source: string,
    handleTextChange: any,
    handleLangOptionChange: any,
    handleLicenseOptionChange: any,
    handleTypeOptionChange: any,
    handleSortOptionChange: any,
    handleSearch: any,
}

export default function Sidemenu ({
    lang,
    license,
    type,
    sort,
    source,
    handleTextChange,
    handleLangOptionChange,
    handleLicenseOptionChange,
    handleTypeOptionChange,
    handleSortOptionChange,
    handleSearch,
}: Sidemenu) {
    return (
        <div className="w-80 shrink-0">
            <div className="w-80 h-full pt-32 p-8 fixed left-0 top-0 bg-l-main-f">
                <h2 className="font-bold mb-4 text-l-2">폰트 미리보기</h2>
                <textarea
                    className="custom-sm-scrollbar resize-none w-full h-48 px-3.5 py-3 text-sm rounded-lg border-2 border-transparent focus:border-l-main-1 bg-l-main-e placeholder-l-5"
                    placeholder="원하는 문구를 적어보세요."
                    onChange={handleTextChange}
                ></textarea>
                <div className="w-full h-px my-4 mb-8 bg-l-b"></div>
                <h2 className="font-bold mb-4 text-l-2">필터</h2>
                <input
                    onChange={handleSearch}
                    type="text"
                    placeholder="폰트, 회사명을 검색해 보세요."
                    defaultValue={source}
                    className="w-full px-3.5 py-3 mb-2 text-sm rounded-lg border-2 border-transparent focus:border-l-main-1 bg-l-main-e placeholder-l-5"
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