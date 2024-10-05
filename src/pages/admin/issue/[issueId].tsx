// next
import Image from "next/image";
import Link from "next/link";

// next-auth
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { getServerSession } from "next-auth";

// react
import { useEffect, useRef, useState } from "react";

// api
import { FetchIssue } from "@/pages/api/admin/issue";

// libraries
import { Switch } from "@mui/material";
import { NextSeo } from "next-seo";

// components
import Button from "@/components/button";
import Footer from "@/components/footer";
import Header from "@/components/header";
import TextArea from "@/components/textarea";
import TextInput from "@/components/textinput";

// common
import { onMouseDown, onMouseOut, onMouseUp, timeFormat } from "@/libs/common";

const IssuePage = ({ params }: any) => {
  const { theme, userAgent, user, issue } = params;

  // 디바이스 체크
  const isMac: boolean = userAgent.includes("Mac OS") ? true : false;

  // states
  const [replySuccess, setReplySuccess] = useState<string>("");
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [focusedImg, setFocusedImg] = useState<string>("");
  const [txtAlert, setTxtAlert] = useState<string>("");
  const [issueClosed, setIssueClosed] = useState<boolean>(issue.issue_closed);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // refs
  const imgRef = useRef<HTMLDivElement>(null);

  /** 이미지 영역 확대 */
  const handleOnImgFocus = (e: React.MouseEvent<HTMLImageElement>) => {
    // 이미지 번호에 맞는 이미지 넣기
    const imgNum = e.currentTarget.id.split("_").pop();
    if (imgNum === "1") {
      setFocusedImg(issue.issue_img_1);
    } else if (imgNum === "2") {
      setFocusedImg(issue.issue_img_2);
    } else if (imgNum === "3") {
      setFocusedImg(issue.issue_img_3);
    } else if (imgNum === "4") {
      setFocusedImg(issue.issue_img_4);
    } else if (imgNum === "5") {
      setFocusedImg(issue.issue_img_5);
    }

    // 이미지 영역 확대
    setIsFocused(true);
    document.body.style.overflow = "hidden";
  };

  /** 이미지 영역 축소 */
  const handleOffImgFocus = () => {
    setIsFocused(false);
    document.body.style.overflow = "auto";
  };

  // 이미지 영역 축소
  useEffect(() => {
    function handleImgOutside(e: Event) {
      if (imgRef?.current && !imgRef.current.contains(e.target as Node)) {
        // 이미지 영역 축소
        setIsFocused(false);
        document.body.style.overflow = "auto";
      }
    }
    document.addEventListener("mouseup", handleImgOutside);
    return () => document.removeEventListener("mouseup", handleImgOutside);
  }, [imgRef]);

  /** 왼쪽 화살표 클릭 */
  const handleImgPrev = () => {
    const imgNum = focusedImg
      .split(`/issue-${issue.issue_id}-`)[1]
      .split(".")[0];
    if (Number(imgNum) > 1) {
      setFocusedImg(issue[`issue_img_${Number(imgNum) - 1}`]);
    }
  };

  /** 오른쪽 화살표 클릭 */
  const handleImgNext = () => {
    const imgNum = focusedImg.split("/issue-")[1].split("-")[1].split(".")[0];
    if (Number(imgNum) < issue.issue_img_length) {
      setFocusedImg(issue[`issue_img_${Number(imgNum) + 1}`]);
    }
  };

  // 키 다운 이벤트
  useEffect(() => {
    const keys: any = [];
    const handleKeydown = (e: KeyboardEvent) => {
      // 한글로 쓸 때 keydown이 두번 실행되는 현상 방지
      if (e.isComposing) return;
      keys[e.key] = true;

      // 왼쪽 화살표 입력
      if (keys["ArrowLeft"] && isFocused) {
        handleImgPrev();
        e.preventDefault();
      }
      // 오른쪽 화살표 입력
      if (keys["ArrowRight"] && isFocused) {
        handleImgNext();
        e.preventDefault();
      }
      // ESC 입력
      if (keys["Escape"] && isFocused) {
        handleOffImgFocus();
      }
    };

    const handleKeyup = (e: KeyboardEvent) => {
      keys[e.key] = false;
    };

    window.addEventListener("keydown", handleKeydown, false);
    window.addEventListener("keyup", handleKeyup, false);

    return () => {
      window.removeEventListener("keydown", handleKeydown);
      window.removeEventListener("keyup", handleKeyup);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [handleImgPrev, handleImgNext, handleOffImgFocus]);

  /** 이슈 닫기/열기 */
  const handleToggleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIssueClosed(e.target.checked);
  };

  /** 텍스트 에리어 변경사항 있을 때 알럿 해제 */
  const handleTextAreaOnChange = () => {
    setTxtAlert("");
  };

  /** 답변하기 버튼 클릭 */
  const handleBtnClick = async () => {
    const txt = document.getElementById("answer") as HTMLTextAreaElement;

    if (txt.value === "") {
      setTxtAlert("empty");
    } else if (!issueClosed) {
      setIsLoading(true);

      // 답변 완료 비활성화 시 DB에만 저장
      const url = "/api/admin/issue";
      const options = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "issue_saved",
          issue_id: issue.issue_id,
          issue_reply: txt.value,
        }),
      };

      await fetch(url, options)
        .then((res) => res.json())
        .then((data) => {
          console.log(data.msg);
          setIsLoading(false);
          setReplySuccess("success");
          window.scrollTo({ top: 0, behavior: "smooth" });
        })
        .catch((err) => {
          console.log(err);
          setReplySuccess("fail");
          window.scrollTo({ top: 0, behavior: "smooth" });
        });
    } else {
      setIsLoading(true);

      // 답변 완료하고 메일 보내기
      const url = "/api/admin/issue";
      const options = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "issue_id",
          email: issue.issue_email,
          content: issue.issue_content,
          reply: txt.value,
          issue_id: issue.issue_id,
          issue_reply: txt.value,
          issue_closed: issueClosed,
          issue_closed_type: "Closed",
        }),
      };

      await fetch(url, options)
        .then((res) => res.json())
        .then((data) => {
          console.log(data.msg);
          setIsLoading(false);
          setReplySuccess("success");
          window.scrollTo({ top: 0, behavior: "smooth" });
        })
        .catch((err) => {
          console.log(err);
          setReplySuccess("fail");
        });
    }
    setIsLoading(false);
  };

  /** 답변 완료 시 알럿 표시 */
  const handleOnReplyClose = () => {
    setReplySuccess("");
  };

  return (
    <>
      {/* Head 부분*/}
      <NextSeo title="폰트 티켓 | 폰트 아카이브" />

      {/* 헤더 */}
      <Header isMac={isMac} theme={theme} user={user} />

      {/* 메인 */}
      <div className="w-full px-4 flex flex-col justify-center items-center text-l-2 dark:text-white">
        <div className="relative max-w-[45rem] w-full flex flex-col justify-center my-16 lg:my-24 mt-8 lg:mt-16">
          <Link
            href="/admin/issue/list"
            className="absolute left-0 -top-10 hidden lg:block border-b border-transparent text-sm text-l-5 dark:text-d-c lg:hover:text-l-2 lg:hover:dark:text-white lg:hover:border-b-l-2 lg:hover:dark:border-b-white"
          >
            <div className="inline-block mr-1">&#60;</div> 목록으로 돌아가기
          </Link>
          <h2 className="text-2xl font-bold mb-6">문의 사항</h2>
          <div className="mb-2.5 text-sm text-l-5 dark:text-d-c">
            {timeFormat(issue.issue_created_at) ===
            timeFormat(issue.issue_closed_at)
              ? timeFormat(issue.issue_created_at) + "에 생성됨"
              : timeFormat(issue.issue_closed_at) + "에 수정됨"}
          </div>
          {replySuccess === "success" ? (
            <div className="w-full h-10 px-2.5 mb-3 flex justify-between items-center rounded-lg border-2 border-h-1 dark:border-f-8 text-xs bg-h-1/20 dark:bg-f-8/20">
              <div className="flex items-center">
                <i className="text-sm text-h-1 dark:text-f-8 fa-regular fa-bell"></i>
                <div className="ml-2">답변이 완료되었습니다.</div>
              </div>
              <div
                onClick={handleOnReplyClose}
                className="flex justify-center items-center cursor-pointer"
              >
                <i className="text-sm fa-solid fa-xmark"></i>
              </div>
            </div>
          ) : replySuccess === "fail" ? (
            <div className="w-full h-10 px-2.5 mb-3 flex justify-between items-center rounded-lg border-2 border-h-r text-xs bg-h-r/20">
              <div className="flex items-center">
                <i className="text-sm text-h-r fa-regular fa-bell"></i>
                <div className="ml-2">답변 전송에 실패했습니다.</div>
              </div>
              <div
                onClick={handleOnReplyClose}
                className="flex justify-center items-center cursor-pointer"
              >
                <i className="text-sm fa-solid fa-xmark"></i>
              </div>
            </div>
          ) : (
            <></>
          )}
          <div className="w-full p-5 rounded-lg bg-l-e dark:bg-d-3 drop-shadow-default dark:drop-shadow-dark">
            <TextInput
              value={
                issue.issue_type === "font"
                  ? "폰트 관련 제보"
                  : issue.issue_type === "bug"
                  ? "버그 관련 제보"
                  : "기타 문의 사항"
              }
              disabled
              id="type"
              tabindex={1}
              label="유형"
            />
            <TextInput
              value={issue.issue_title}
              disabled
              id="title"
              tabindex={2}
              label="제목"
              marginTop={2}
            />
            <TextInput
              value={issue.issue_email}
              disabled
              id="email"
              tabindex={3}
              label="이메일"
              marginTop={2}
            />
            <TextArea
              value={issue.issue_content}
              disabled
              id="content"
              tabindex={4}
              label="내용"
              marginTop={2}
            />
            <div className="mt-8 font-medium">첨부한 이미지</div>
            <div className="w-full min-h-24 flex items-center px-4 mt-2 rounded-lg bg-l-d dark:bg-d-4">
              {issue.issue_img_length > 0 ? (
                <div className="w-full flex justify-center items-center gap-x-2.5 my-6">
                  {issue.issue_img_1 !== "null" && (
                    <div
                      onMouseDown={(e) => onMouseDown(e, 0.9, true)}
                      onMouseUp={onMouseUp}
                      onMouseOut={onMouseOut}
                      className="w-24 h-28 relative"
                    >
                      <Image
                        src={issue.issue_img_1}
                        alt="첨부한 이미지 1"
                        fill
                        sizes="100%"
                        priority
                        referrerPolicy="no-referrer"
                        onClick={handleOnImgFocus}
                        id="img_1"
                        className="rounded-lg border-2 border-l-b dark:border-d-6 object-cover cursor-pointer"
                      />
                    </div>
                  )}
                  {issue.issue_img_2 !== "null" && (
                    <div
                      onMouseDown={(e) => onMouseDown(e, 0.9, true)}
                      onMouseUp={onMouseUp}
                      onMouseOut={onMouseOut}
                      className="w-24 h-28 relative"
                    >
                      <Image
                        src={issue.issue_img_2}
                        alt="첨부한 이미지 2"
                        fill
                        sizes="100%"
                        priority
                        referrerPolicy="no-referrer"
                        onClick={handleOnImgFocus}
                        id="img_2"
                        className="rounded-lg border-2 border-l-b dark:border-d-6 object-cover cursor-pointer"
                      />
                    </div>
                  )}
                  {issue.issue_img_3 !== "null" && (
                    <div
                      onMouseDown={(e) => onMouseDown(e, 0.9, true)}
                      onMouseUp={onMouseUp}
                      onMouseOut={onMouseOut}
                      className="w-24 h-28 relative"
                    >
                      <Image
                        src={issue.issue_img_3}
                        alt="첨부한 이미지 3"
                        fill
                        sizes="100%"
                        priority
                        referrerPolicy="no-referrer"
                        onClick={handleOnImgFocus}
                        id="img_3"
                        className="rounded-lg border-2 border-l-b dark:border-d-6 object-cover cursor-pointer"
                      />
                    </div>
                  )}
                  {issue.issue_img_4 !== "null" && (
                    <div
                      onMouseDown={(e) => onMouseDown(e, 0.9, true)}
                      onMouseUp={onMouseUp}
                      onMouseOut={onMouseOut}
                      className="w-24 h-28 relative"
                    >
                      <Image
                        src={issue.issue_img_4}
                        alt="첨부한 이미지 4"
                        fill
                        sizes="100%"
                        priority
                        referrerPolicy="no-referrer"
                        onClick={handleOnImgFocus}
                        id="img_4"
                        className="rounded-lg border-2 border-l-b dark:border-d-6 object-cover cursor-pointer"
                      />
                    </div>
                  )}
                  {issue.issue_img_5 !== "null" && (
                    <div
                      onMouseDown={(e) => onMouseDown(e, 0.9, true)}
                      onMouseUp={onMouseUp}
                      onMouseOut={onMouseOut}
                      className="w-24 h-28 relative"
                    >
                      <Image
                        src={issue.issue_img_5}
                        alt="첨부한 이미지 5"
                        fill
                        sizes="100%"
                        priority
                        referrerPolicy="no-referrer"
                        onClick={handleOnImgFocus}
                        id="img_5"
                        className="rounded-lg border-2 border-l-b dark:border-d-6 object-cover cursor-pointer"
                      />
                    </div>
                  )}
                </div>
              ) : (
                <div className="w-full h-24 flex justify-center items-center text-sm text-center">
                  첨부한 이미지가 없습니다.
                </div>
              )}
            </div>
            <div className="w-full h-px my-6 bg-l-b dark:bg-d-6"></div>
            <div className="font-medium">답변 여부</div>
            <div className="w-max h-12 rounded-lg mt-2 px-3.5 flex items-center text-sm bg-l-d dark:bg-d-4">
              <div className="mr-1.5">답변 중</div>
              <Switch
                checked={issueClosed}
                onChange={handleToggleChange}
                size="small"
              />
              <div
                className={`${
                  issueClosed ? "text-h-1 dark:text-f-8" : ""
                } ml-1.5`}
              >
                답변 완료
              </div>
            </div>
            <TextArea
              onchange={handleTextAreaOnChange}
              state={txtAlert}
              stateMsg={[
                { state: "", msg: "" },
                { state: "empty", msg: "답변 내용이 없습니다." },
              ]}
              value={issue.issue_reply}
              id="answer"
              tabindex={5}
              placeholder="답변을 입력해 주세요."
              label="답변"
              marginTop={2}
            />
            <Button marginTop={1}>
              <button onClick={handleBtnClick} className="w-full h-full">
                {isLoading ? (
                  <span className="loader border-2 border-h-e dark:border-d-6 border-b-h-1 dark:border-b-f-8 w-4 h-4"></span>
                ) : (
                  <>답변하기</>
                )}
              </button>
            </Button>
          </div>
        </div>
      </div>

      {/* 이미지 확대 */}
      {isFocused && (
        <div className="fixed z-40 left-0 top-0 backdrop-blur bg-blur-theme w-full h-full flex justify-center items-center">
          <div ref={imgRef} className="relative flex items-center">
            <button
              onClick={handleOffImgFocus}
              onMouseDown={(e) => onMouseDown(e, 0.9, true)}
              onMouseUp={onMouseUp}
              onMouseOut={onMouseOut}
              className="w-8 h-8 lg:w-10 lg:h-10 rounded-full lg:hover:bg-l-d lg:hover:dark:bg-d-4 absolute right-[5.75rem] tlg:right-16 tsm:right-10 -top-12 tlg:-top-10 flex justify-center items-center"
            >
              <i className="text-2xl fa-solid fa-xmark"></i>
            </button>
            <button
              onClick={handleImgPrev}
              onMouseDown={(e) => onMouseDown(e, 0.9, true)}
              onMouseUp={onMouseUp}
              onMouseOut={onMouseOut}
              className="w-8 h-8 lg:w-10 lg:h-10 rounded-full lg:hover:bg-l-d lg:hover:dark:bg-d-4 mr-[3.75rem] tlg:mr-10 tsm:mr-4 flex justify-center items-center"
            >
              <i className="text-2xl -translate-x-px fa-solid fa-angle-left"></i>
            </button>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={focusedImg}
              alt="이미지 미리보기"
              className="w-[37.5rem] tlg:w-[26.25rem] tsm:w-[18.75rem] rounded-lg animate-zoom-in"
            />
            <button
              onClick={handleImgNext}
              onMouseDown={(e) => onMouseDown(e, 0.9, true)}
              onMouseUp={onMouseUp}
              onMouseOut={onMouseOut}
              className="w-8 h-8 lg:w-10 lg:h-10 rounded-full lg:hover:bg-l-d lg:hover:dark:bg-d-4 ml-[3.75rem] tlg:ml-10 tsm:ml-4 flex justify-center items-center"
            >
              <i className="text-2xl translate-x-px fa-solid fa-angle-right"></i>
            </button>
          </div>
        </div>
      )}

      {/* 풋터 */}
      <Footer />
    </>
  );
};

export async function getServerSideProps(ctx: any) {
  try {
    // 쿠키 체크
    const { theme } = ctx.req.cookies;

    // 디바이스 체크
    const userAgent = ctx.req
      ? ctx.req.headers["user-agent"]
      : navigator.userAgent;

    // 유저 정보 불러오기
    const session: any = await getServerSession(ctx.req, ctx.res, authOptions);

    // 유저 상세정보 불러오기
    const issue = await FetchIssue(ctx.params.issueId);

    // 쿠키에 저장된 세션ID가 유효하지 않다면, 메인페이지로 이동, 유효하면 클리이언트로 유저 정보 return
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
      return {
        props: {
          params: {
            theme: theme ? theme : "light",
            userAgent: userAgent,
            user: session === null ? null : session.user,
            issue: JSON.parse(JSON.stringify(issue)),
          },
        },
      };
    }
  } catch (error) {
    console.log(error);
  }
}

export default IssuePage;
