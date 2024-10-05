// react
import { useEffect, useState } from "react";

// next
import Link from "next/link";

// next-auth
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]";

// libraries
import { debounce } from "lodash";
import { useCookies } from "react-cookie";

// components
import FontBox from "@/components/fontbox";
import Header from "@/components/header";
import SelectBox from "@/components/selectbox";
import Sidemenu from "@/components/sidemenu";
import ToTop from "@/components/totop";

// common
import { onSideMenuMouseDown, onSideMenuMouseUp } from "@/libs/common";

const Index = ({ params }: any) => {
  const { license, lang, type, sort, theme, search, filter, userAgent, user } =
    params;

  // 디바이스 체크
  const isMac: boolean = userAgent.includes("Mac OS") ? true : false;
  const isMobile = /iPhone|iPad|iPod|Android/i.test(userAgent);

  // states
  const [, setCookie] = useCookies<string>([]);
  const [thisLicense, setLicense] = useState<string>(license);
  const [thisLang, setLang] = useState<string>(lang);
  const [thisType, setType] = useState<string>(type);
  const [thisSort, setSort] = useState<string>(sort);
  const [text, setText] = useState<string>("");
  const [searchword, setSearchword] = useState<string>(search);
  const [expand, setExpand] = useState<boolean>(isMobile ? false : true);
  const [enableReset, setEnableReset] = useState<boolean>(
    thisLicense === "all" &&
      thisLang === "all" &&
      thisType === "all" &&
      thisSort === "date" &&
      text === "" &&
      searchword === ""
      ? false
      : true
  );

  /** 옵션 - "허용 범위" 클릭 */
  const handleLicenseOptionChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    // 쿠키 유효 기간 1달
    const expires = new Date();
    expires.setMonth(expires.getMonth() + 1);

    if (e.target.checked) {
      setCookie("license", e.target.value, {
        path: "/",
        expires: expires,
        secure: true,
        sameSite: "strict",
      });
      setLicense(e.target.value);
    }
  };

  /** 옵션 - "언어 선택" 클릭 */
  const handleLangOptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // 쿠키 유효 기간 1달
    const expires = new Date();
    expires.setMonth(expires.getMonth() + 1);

    if (e.target.checked) {
      setCookie("lang", e.target.value, {
        path: "/",
        expires: expires,
        secure: true,
        sameSite: "strict",
      });
      setLang(e.target.value);
    }
  };

  /** 옵션 - "폰트 형태" 클릭 */
  const handleTypeOptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // 쿠키 유효 기간 1달
    const expires = new Date();
    expires.setMonth(expires.getMonth() + 1);

    if (e.target.checked) {
      setCookie("type", e.target.value, {
        path: "/",
        expires: expires,
        secure: true,
        sameSite: "strict",
      });
      setType(e.target.value);
    }
  };

  /** 옵션 - "정렬순" 클릭 */
  const handleSortOptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // 쿠키 유효 기간 1달
    const expires = new Date();
    expires.setMonth(expires.getMonth() + 1);

    if (e.target.checked) {
      setCookie("sort", e.target.value, {
        path: "/",
        expires: expires,
        secure: true,
        sameSite: "strict",
      });
      setSort(e.target.value);
    }
  };

  /** 텍스트 입력칸 */
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  /** 폰트 검색 기능 */
  const debouncedSearch = debounce((e) => {
    if (e.target) setSearchword(e.target.value);
    else setSearchword("");
  }, 500);
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    debouncedSearch(e);
  };

  /** 필터 초기화하기 */
  const handleReset = () => {
    // 쿠키 유효 기간 삭제
    const expires = new Date();
    expires.setMonth(expires.getMonth() - 1);

    // 상태 리셋
    setLicense("all");
    setLang("all");
    setType("all");
    setSort("date");
    setText("");
    setSearchword("");

    // 쿠키 리셋
    setCookie("license", "all", {
      path: "/",
      expires: expires,
      secure: true,
      sameSite: "strict",
    });
    setCookie("lang", "all", {
      path: "/",
      expires: expires,
      secure: true,
      sameSite: "strict",
    });
    setCookie("type", "all", {
      path: "/",
      expires: expires,
      secure: true,
      sameSite: "strict",
    });
    setCookie("sort", "date", {
      path: "/",
      expires: expires,
      secure: true,
      sameSite: "strict",
    });

    // 문구 리셋
    const textP = document.getElementById("text-p") as HTMLTextAreaElement;
    const textS = document.getElementById("text-s") as HTMLInputElement;
    textP.value = "";
    textS.value = "";
  };

  /** 사이드 메뉴 필터 초기화 활성화/비활성화 */
  useEffect(() => {
    if (
      thisLicense !== "all" ||
      thisLang !== "all" ||
      thisType !== "all" ||
      thisSort !== "date" ||
      text !== "" ||
      searchword !== ""
    ) {
      setEnableReset(true);
    } else {
      setEnableReset(false);
    }
  }, [
    thisLicense,
    thisLang,
    thisType,
    thisSort,
    text,
    searchword,
    enableReset,
  ]);

  /** 사이드 메뉴 펼치기/접기 */
  const handleExpand = (e: React.ChangeEvent<HTMLInputElement>) => {
    setExpand(e.target.checked);
  };

  return (
    <>
      {/* 헤더 */}
      <Header
        isMac={isMac}
        theme={theme}
        user={user}
        page={"index"}
        handleSearch={handleSearch}
      />

      {/* 메인 */}
      <div className="w-full flex">
        <Sidemenu
          expand={expand}
          handleExpand={handleExpand}
          enableReset={enableReset}
          handleReset={handleReset}
        >
          <h2 className="font-bold mb-4 text-l-2 dark:text-white">
            폰트 미리보기
          </h2>
          <textarea
            id="text-p"
            className="custom-sm-scrollbar resize-none w-full h-48 px-3.5 py-3 rounded-lg border-2 border-transparent focus:border-h-1 focus:dark:border-f-8 dark:text-white bg-h-e dark:bg-d-4 placeholder-l-5 dark:placeholder-d-c"
            placeholder="원하는 문구를 적어보세요."
            onChange={handleTextChange}
          ></textarea>
          <div className="w-full h-px my-4 mb-8 bg-l-b dark:bg-d-6"></div>
          <h2 className="font-bold mb-4 text-l-2 dark:text-white">필터</h2>
          <input
            id="text-s"
            onChange={handleSearch}
            type="text"
            placeholder="폰트, 회사명을 검색해 보세요."
            defaultValue={search}
            className="w-full px-3.5 py-3 mb-2 rounded-lg border-2 border-transparent text-l-2 dark:text-white focus:border-h-1 focus:dark:border-f-8 bg-h-e dark:bg-d-4 placeholder-l-5 dark:placeholder-d-c"
          />
          <SelectBox
            title="언어 선택"
            icon="bi-globe2"
            value="lang"
            select={thisLang}
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
            select={thisLicense}
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
            select={thisType}
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
            select={thisSort}
            options={[
              { value: "date", name: "최신순" },
              { value: "view", name: "조회순" },
              { value: "like", name: "인기순" },
              { value: "name", name: "이름순" },
            ]}
            optionChange={handleSortOptionChange}
          />
          <h2 className="font-bold mt-8 mb-4 text-l-2 dark:text-white">약관</h2>
          <div className="w-full">
            <Link
              href="/terms"
              rel="noopener noreferrer"
              className="w-full h-16 px-4 flex justify-between items-center rounded-lg cursor-pointer border-2 border-transparent text-l-2 dark:text-white hover:bg-l-e hover:dark:bg-d-4"
              onMouseDown={onSideMenuMouseDown}
              onMouseUp={onSideMenuMouseUp}
              onMouseOut={onSideMenuMouseUp}
            >
              <div className="flex items-center gap-3 font-medium">
                <i className="text-lg bi bi-wrench-adjustable"></i>
                서비스 이용약관
              </div>
              <i className="fa-solid fa-angle-right"></i>
            </Link>
            <Link
              href="/privacy"
              rel="noopener noreferrer"
              className="w-full h-16 px-4 flex justify-between items-center rounded-lg cursor-pointer border-2 border-transparent text-l-2 dark:text-white hover:bg-l-e hover:dark:bg-d-4"
              onMouseDown={onSideMenuMouseDown}
              onMouseUp={onSideMenuMouseUp}
              onMouseOut={onSideMenuMouseUp}
            >
              <div className="flex items-center gap-3 font-medium">
                <i className="text-lg bi bi-file-earmark-lock"></i>
                개인정보 처리방침
              </div>
              <i className="fa-solid fa-angle-right"></i>
            </Link>
          </div>
        </Sidemenu>
        <FontBox
          expand={expand}
          license={thisLicense}
          lang={thisLang}
          type={thisType}
          sort={thisSort}
          user={user}
          filter={filter}
          searchword={searchword}
          text={text}
          num={999}
        />
      </div>

      {/* 툴팁 */}
      <ToTop />
    </>
  );
};

export async function getServerSideProps(ctx: any) {
  try {
    // 쿠키 가져오기
    const { license, lang, type, sort, theme } = ctx.req.cookies;

    // 파라미터 가져오기
    const { search, filter } = ctx.query;

    // 디바이스 체크
    const userAgent = ctx.req
      ? ctx.req.headers["user-agent"]
      : navigator.userAgent;

    // 유저 정보 불러오기
    const session = await getServerSession(ctx.req, ctx.res, authOptions);

    return {
      props: {
        params: {
          license: license ? license : "all",
          lang: lang ? lang : "all",
          type: type ? type : "all",
          sort: sort ? sort : "date",
          theme: theme ? theme : "light",
          search: search ? search : "",
          filter: filter ? filter : "",
          userAgent: userAgent,
          user: session === null ? null : session.user,
        },
      },
    };
  } catch (error) {
    console.log(error);
  }
}

export default Index;
