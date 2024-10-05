// next
import Link from "next/link";
import { useRouter } from "next/router";

// next-auth
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { getServerSession } from "next-auth";

// api
import { FetchIssues, FetchIssuesLength } from "@/pages/api/admin/issue";

// libraries
import { Pagination } from "@mui/material";
import { NextSeo } from "next-seo";

// components
import Footer from "@/components/footer";
import Header from "@/components/header";
import Motion from "@/components/motion";
import SearchInput from "@/components/searchinput";

// common
import { dateFormat, onMouseDown, onMouseOut, onMouseUp } from "@/libs/common";

const IssueList = ({ params }: any) => {
  const { theme, userAgent, user, page, filter, search, list, count } = params;

  // 디바이스 체크
  const isMac: boolean = userAgent.includes("Mac OS") ? true : false;

  // router
  const router = useRouter();

  // 페이지 변경
  const handlePageChange = (e: React.ChangeEvent<unknown>, value: number) => {
    router.push(
      `/admin/issue/list${value === 1 ? "" : `?page=${value}`}${
        filter === "all" ? "" : `${value === 1 ? "?" : "&"}filter=${filter}`
      }${
        search === ""
          ? ""
          : `${value === 1 && filter === "all" ? "?" : "&"}search=${search}`
      }`
    );
  };

  // 핕터 변경
  const handleFilterChange = (e: React.MouseEvent<HTMLButtonElement>) => {
    router.push(
      `/admin/issue/list${
        e.currentTarget.value === "all"
          ? ""
          : `?filter=${e.currentTarget.value}`
      }${
        search === ""
          ? ""
          : `${
              page === 1 && e.currentTarget.value === "all" ? "?" : "&"
            }search=${search}`
      }`
    );
  };

  // 검색어 변경
  const handleSearchClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const input = document.getElementById("search") as HTMLInputElement;
    router.push(
      `/admin/issue/list${filter === "all" ? "" : `?filter=${filter}`}${
        input.value === ""
          ? ""
          : `${page === 1 && filter === "all" ? "?" : "&"}search=${input.value}`
      }`
    );
  };

  return (
    <>
      {/* Head 부분*/}
      <NextSeo title="폰트 제보 목록 | 폰트 아카이브" />

      {/* 헤더 */}
      <Header isMac={isMac} theme={theme} user={user} />

      {/* 메인 */}
      <Motion
        initialOpacity={0}
        animateOpacity={1}
        exitOpacity={0}
        transitionType="spring"
      >
        <form
          onSubmit={(e) => e.preventDefault()}
          className="w-full px-4 flex flex-col justify-center items-center text-l-2 dark:text-white"
        >
          <div className="w-[45rem] tmd:w-full flex flex-col justify-center my-16 lg:my-24 mt-8 lg:mt-16">
            <h2 className="text-2xl font-bold mb-6">문의 목록</h2>
            <div className="flex items-center mb-10">
              <SearchInput
                id="search"
                placeholder="제목/내용"
                value={search}
                color="light"
              />
              <button onClick={handleSearchClick} className="hidden">
                검색
              </button>
            </div>
            <div className="flex items-center gap-1.5 mb-4">
              <button
                onClick={handleFilterChange}
                value="all"
                onMouseDown={(e) => onMouseDown(e, 0.9, true)}
                onMouseUp={onMouseUp}
                onMouseOut={onMouseOut}
                className={`${
                  filter === "all"
                    ? "bg-h-1 dark:bg-f-8 text-white dark:text-d-2"
                    : "text-l-5 dark:text-d-c hover:text-h-1 hover:dark:text-f-8"
                } w-20 h-9 flex justify-center items-center rounded-lg`}
              >
                전체
              </button>
              <button
                onClick={handleFilterChange}
                value="font"
                onMouseDown={(e) => onMouseDown(e, 0.9, true)}
                onMouseUp={onMouseUp}
                onMouseOut={onMouseOut}
                className={`${
                  filter === "font"
                    ? "bg-h-1 dark:bg-f-8 text-white dark:text-d-2"
                    : "text-l-5 dark:text-d-c hover:text-h-1 hover:dark:text-f-8"
                } w-20 h-9 flex justify-center items-center rounded-lg`}
              >
                폰트
              </button>
              <button
                onClick={handleFilterChange}
                value="bug"
                onMouseDown={(e) => onMouseDown(e, 0.9, true)}
                onMouseUp={onMouseUp}
                onMouseOut={onMouseOut}
                className={`${
                  filter === "bug"
                    ? "bg-h-1 dark:bg-f-8 text-white dark:text-d-2"
                    : "text-l-5 dark:text-d-c hover:text-h-1 hover:dark:text-f-8"
                } w-20 h-9 flex justify-center items-center rounded-lg`}
              >
                버그
              </button>
              <button
                onClick={handleFilterChange}
                value="etc"
                onMouseDown={(e) => onMouseDown(e, 0.9, true)}
                onMouseUp={onMouseUp}
                onMouseOut={onMouseOut}
                className={`${
                  filter === "etc"
                    ? "bg-h-1 dark:bg-f-8 text-white dark:text-d-2"
                    : "text-l-5 dark:text-d-c hover:text-h-1 hover:dark:text-f-8"
                } w-20 h-9 flex justify-center items-center rounded-lg`}
              >
                기타
              </button>
            </div>
            <div className="w-full">
              <div className="w-full text-sm">
                <div className="flex flex-col gap-3">
                  {list && list.length > 0 ? (
                    <>
                      {list.map((issue: any) => {
                        return (
                          <div
                            key={issue.issue_id}
                            className="px-6 py-4 relative rounded-lg bg-l-f dark:bg-d-3"
                          >
                            <div className="flex tlg:flex-col lg:items-center gap-2 mb-2">
                              <Link
                                href={`/admin/issue/${issue.issue_id}`}
                                className="block text-h-1 dark:text-f-8 lg:hover:underline"
                              >
                                {issue.issue_title}
                              </Link>
                              <div className="flex gap-2 items-center">
                                <div className="text-xs text-l-5 dark:text-d-c">
                                  {dateFormat(issue.issue_created_at)}
                                </div>
                                <div
                                  className={`text-xs ${
                                    issue.issue_closed
                                      ? "text-h-1 dark:text-f-8"
                                      : "text-l-5 dark:text-d-c"
                                  }`}
                                >
                                  {issue.issue_closed ? "답변 완료" : "답변 중"}
                                </div>
                              </div>
                            </div>
                            <div className="w-full overflow-hidden">
                              [
                              {issue.issue_type === "font"
                                ? "폰트"
                                : issue.issue_type === "bug"
                                ? "버그"
                                : "기타"}
                              ] {issue.issue_content}
                            </div>
                          </div>
                        );
                      })}
                    </>
                  ) : (
                    <div className="h-16 text-base flex justify-center items-center text-center">
                      문의가 없습니다.
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="w-full flex justify-center mt-3">
              <Pagination
                count={count}
                page={Number(page)}
                onChange={handlePageChange}
                shape="rounded"
              />
            </div>
          </div>
        </form>
      </Motion>

      {/* 풋터 */}
      <Footer />
    </>
  );
};

export async function getServerSideProps(ctx: any) {
  try {
    // 쿠키 체크
    const { theme } = ctx.req.cookies;

    // 쿼리 체크
    const page = ctx.query.page === undefined ? 1 : ctx.query.page;
    const filter = ctx.query.filter === undefined ? "all" : ctx.query.filter;
    const search = ctx.query.search === undefined ? "" : ctx.query.search;

    // 디바이스 체크
    const userAgent = ctx.req
      ? ctx.req.headers["user-agent"]
      : navigator.userAgent;

    // 유저 정보 불러오기
    const session: any = await getServerSession(ctx.req, ctx.res, authOptions);

    // 쿠키에 저장된 refreshToken이 유효하지 않다면, 메인페이지로 이동, 유효하면 클리이언트로 유저 정보 return
    if (
      session === null ||
      session.user === undefined ||
      session.user.id !== 1
    ) {
      return {
        redirect: {
          destination: "/404",
          permanent: false,
        },
      };
    } else {
      // 유저 목록 페이지 수
      const count = await FetchIssuesLength(search);

      // 유저 목록 가져오기
      const list = await FetchIssues(page, filter, search);

      return {
        props: {
          params: {
            theme: theme ? theme : "light",
            userAgent: userAgent,
            user: session === null ? null : session.user,
            page: page,
            filter: filter,
            search: search,
            list: JSON.parse(JSON.stringify(list)),
            count: count,
          },
        },
      };
    }
  } catch (error) {
    console.log(error);
  }
}

export default IssueList;
