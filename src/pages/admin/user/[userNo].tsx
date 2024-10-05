// next
import Image from "next/image";
import Link from "next/link";

// next-auth
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { getServerSession } from "next-auth";

// react
import { useEffect, useState } from "react";

// api
import { FetchUser } from "@/pages/api/admin/user";

// libraries
import { Switch } from "@mui/material";
import { NextSeo } from "next-seo";

// components
import Button from "@/components/button";
import Footer from "@/components/footer";
import Header from "@/components/header";
import TextInput from "@/components/textinput";

// common
import { onMouseDown, onMouseOut, onMouseUp } from "@/libs/common";

const UserDetailPage = ({ params }: any) => {
  const { theme, userAgent, userDetail } = params;
  const user = userDetail;

  // 디바이스 체크
  const isMac: boolean = userAgent.includes("Mac OS") ? true : false;

  // states
  const [profileImg, setProfileImg] = useState<string>(user.profile_img);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<string>("");
  const [userNameAlert, setUserNameAlert] = useState<string>("");
  const [userNameReportAlert, setUserNameReportAlert] = useState<string>("");
  const [userPwAlert, setUserPwAlert] = useState<string>("");
  const [emailConfirmed, setEmailConfirmed] = useState<boolean>(
    user.user_email_confirm
  );
  const [userEmailTokenAlert, setUserEmailTokenAlert] =
    useState<boolean>(false);

  // change 이벤트
  const handleUserNameChange = () => {
    setUserNameAlert("");
  };
  const handleUserNameReportChange = () => {
    setUserNameReportAlert("");
  };
  const handleUserPwChange = () => {
    setUserPwAlert("");
  };
  const handleUserEmailTokenChange = () => {
    setUserEmailTokenAlert(false);
  };

  // 부적절한 아이디 버튼 클릭
  const changeNickname = () => {
    // 아이디 변경
    const name = document.getElementById("user-name") as HTMLInputElement;
    name.value = "부적절한 닉네임 " + (Math.floor(Math.random() * 100) + 1);

    // 닉네임 신고 수 0으로 초기화
    const report = document.getElementById(
      "user-name-reported"
    ) as HTMLInputElement;
    report.value = "0";
  };

  // 이메일 토글 버튼 change
  const handleToggleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmailConfirmed(e.target.checked);
  };

  /** 예시 복사하기 버튼 클릭 이벤트 */
  const copyOnClick = (e: React.MouseEvent) => {
    const btn = document.getElementById(
      e.currentTarget.id
    ) as HTMLButtonElement;
    const copyBtn = btn.getElementsByClassName("copy_btn")[0] as HTMLLIElement;

    window.navigator.clipboard.writeText(btn.value);

    copyBtn.style.display = "block";
    setTimeout(function () {
      copyBtn.style.display = "none";
    }, 1000);
  };

  // 토큰 재생성하기 버튼 클릭
  const regenerateToken = () => {
    // 토큰 생성
    const newToken = crypto.randomUUID();

    // input value값 변경
    const input = document.getElementById(
      "user-email-token"
    ) as HTMLInputElement;
    input.value = newToken;

    // 알럿이 체크되어 있으면 체크 해제
    setUserEmailTokenAlert(false);
  };

  // 이미지 랜덤 변경하기 버튼 클릭
  const changeProfileImg = () => {
    const randomProfileImg =
      "/fonts-archive-base-profile-img-" +
      (Math.floor(Math.random() * 6) + 1) +
      ".svg";
    setProfileImg(randomProfileImg);
  };

  // 저장하기
  const saveUserInfo = async () => {
    const userNo = document.getElementById("user-no") as HTMLInputElement;
    const userName = document.getElementById("user-name") as HTMLInputElement;
    const userNameReported = document.getElementById(
      "user-name-reported"
    ) as HTMLInputElement;
    const userPw = document.getElementById("user-pw") as HTMLInputElement;
    const userEmailToken = document.getElementById(
      "user-email-token"
    ) as HTMLInputElement;

    // 빈 값 유효성 체크
    if (userName.value === "") {
      setUserNameAlert("empty");
      window.scrollTo({ top: userName.offsetTop, behavior: "smooth" });
    } else if (userNameReported.value === "") {
      setUserNameReportAlert("empty");
      window.scrollTo({ top: userNameReported.offsetTop, behavior: "smooth" });
    } else if (userPw.value === "") {
      setUserPwAlert("empty");
      window.scrollTo({ top: userPw.offsetTop, behavior: "smooth" });
    } else if (userEmailToken.value === "") {
      setUserEmailTokenAlert(true);
      window.scrollTo({ top: userEmailToken.offsetTop, behavior: "smooth" });
    } else {
      // 로딩 스피너 실행
      setIsLoading(true);

      // 유저 정보 저장 API 호출
      const url = "/api/admin/user";
      const options = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "save-user-info",
          user_no: userNo.value,
          profile_img: profileImg,
          user_name: userName.value,
          nickname_reported: userNameReported.value,
          user_pw: userPw.value,
          user_email_confirm: emailConfirmed,
          user_email_token: userEmailToken.value,
        }),
      };

      await fetch(url, options)
        .then((res) => res.json())
        .then((data) => {
          console.log(data.msg);

          // 알럿 표시
          setIsSuccess("success");
          window.scrollTo({ top: 0, behavior: "smooth" });

          // 로딩 스피너 정지
          setIsLoading(false);
        })
        .catch((err) => {
          console.log(err);

          // 알럿 표시
          setIsSuccess("fail");
          window.scrollTo({ top: 0, behavior: "smooth" });

          // 로딩 스피너 정지
          setIsLoading(false);
        });
    }
  };

  // 엔터키 입력 시 버튼 클릭
  useEffect(() => {
    const keys: any = [];
    const handleKeydown = (e: KeyboardEvent) => {
      keys[e.key] = true;
      if (keys["Enter"]) {
        saveUserInfo();
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
  });

  // 저장 완료/실패 팝업 닫기 버튼 클릭
  const handleSuccessBtnClose = () => {
    setIsSuccess("");
  };

  return (
    <>
      {/* Head 부분*/}
      <NextSeo title={`${user.user_name}님의 정보 | 폰트 아카이브`} />

      {/* 헤더 */}
      <Header isMac={isMac} theme={theme} user={params.user} />

      {/* 메인 */}
      <div className="w-full px-4 flex flex-col justify-center items-center text-l-2 dark:text-white">
        <div className="relative max-w-[45rem] w-full flex flex-col justify-center my-16 lg:my-24 mt-8 lg:mt-16">
          <Link
            href="/admin/user/list"
            className="absolute left-0 -top-10 hidden lg:block border-b border-transparent text-sm text-l-5 dark:text-d-c lg:hover:text-l-2 lg:hover:dark:text-white lg:hover:border-b-l-2 lg:hover:dark:border-b-white"
          >
            <div className="inline-block mr-1">&#60;</div> 유저 관리 페이지로
            돌아가기
          </Link>
          <h2 className="text-2xl font-bold mb-6">유저 정보</h2>
          <div id="success-btn" className="w-full">
            {isSuccess === "success" ? (
              <>
                <div className="w-full h-10 px-2.5 mb-3 flex justify-between items-center rounded-lg border-2 border-h-1 dark:border-f-8 text-xs bg-h-1/20 dark:bg-f-8/20">
                  <div className="flex items-center">
                    <i className="text-sm text-h-1 dark:text-f-8 fa-regular fa-bell"></i>
                    <div className="ml-2">유저 정보 저장이 완료됐습니다.</div>
                  </div>
                  <div
                    onClick={handleSuccessBtnClose}
                    className="flex justify-center items-center cursor-pointer"
                  >
                    <i className="text-sm fa-solid fa-xmark"></i>
                  </div>
                </div>
              </>
            ) : isSuccess === "fail" ? (
              <>
                <div className="w-full h-10 px-2.5 mb-3 flex justify-between items-center rounded-lg border-2 border-h-r text-xs bg-h-r/20">
                  <div className="flex items-center">
                    <i className="text-sm text-h-r fa-regular fa-bell"></i>
                    <div className="ml-2">유저 정보 저장에 실패했습니다.</div>
                  </div>
                  <div
                    onClick={handleSuccessBtnClose}
                    className="flex justify-center items-center cursor-pointer"
                  >
                    <i className="text-sm fa-solid fa-xmark"></i>
                  </div>
                </div>
              </>
            ) : (
              <></>
            )}
          </div>
          <div className="w-full p-5 rounded-lg bg-l-e dark:bg-d-3 drop-shadow-default dark:drop-shadow-dark">
            <div className="flex items-center">
              <div className="relative mr-7">
                <div className="w-20 h-20 relative">
                  <Image
                    src={profileImg}
                    alt="Profile image"
                    fill
                    sizes="100%"
                    priority
                    className="object-cover rounded-full"
                  />
                </div>
                <button
                  onClick={changeProfileImg}
                  onMouseDown={(e) => onMouseDown(e, 0.95, true)}
                  onMouseUp={onMouseUp}
                  onMouseOut={onMouseOut}
                  className="group absolute top-0 -right-1 w-7 h-7 rounded-full bg-h-1 dark:bg-f-8 text-white dark:text-d-2"
                >
                  <i className="text-sm duration-200 lg:group-hover:rotate-90 fa-solid fa-rotate"></i>
                  <div className="w-max absolute z-10 left-1/2 -top-8 px-3 py-1.5 text-[0.813rem] leading-none origin-bottom rounded hidden lg:group-hover:block lg:group-hover:animate-hover-delay bg-l-5 dark:bg-d-4 text-white dark:text-f-8 dark:drop-shadow-dark selection:bg-transparent">
                    이미지 랜덤 변경하기
                  </div>
                </button>
              </div>
              <div className="w-[calc(100%-5rem)]">
                <TextInput
                  value={user.user_no}
                  disabled
                  id="user-no"
                  label="유저 번호"
                />
                <TextInput
                  value={user.user_id}
                  disabled
                  id="user-id"
                  label="유저 ID"
                  marginTop={2}
                />
              </div>
            </div>
            <div className="w-full h-px my-6 bg-l-b dark:bg-d-6"></div>
            <label
              htmlFor="user-name"
              className="mt-8 flex items-center font-medium"
            >
              유저 이름
              <button
                onClick={changeNickname}
                onMouseDown={(e) => onMouseDown(e, 0.9, true)}
                onMouseUp={onMouseUp}
                onMouseOut={onMouseOut}
                className="text-sm font-medium rounded-full px-4 py-1.5 ml-3 bg-h-1 dark:bg-f-8 lg:hover:bg-h-0 lg:hover:dark:bg-f-9 text-white dark:text-d-2"
              >
                부적절한 닉네임
              </button>
            </label>
            <TextInput
              onchange={handleUserNameChange}
              state={userNameAlert}
              stateMsg={[
                { state: "", msg: "" },
                {
                  state: "empty",
                  msg: "유저 이름을 올바르게 입력해 주세요.",
                },
              ]}
              value={user.user_name}
              id="user-name"
              tabindex={1}
              placeholder="유저 이름"
              marginTop={0.5}
            />
            <TextInput
              onchange={handleUserNameReportChange}
              state={userNameReportAlert}
              stateMsg={[
                { state: "", msg: "" },
                {
                  state: "empty",
                  msg: "유저 이름 신고 수를 올바르게 입력해 주세요.",
                },
              ]}
              value={user.nickname_reported}
              id="user-name-reported"
              tabindex={2}
              placeholder="유저 이름 신고 수"
              label="유저 이름 신고 수"
              marginTop={2}
            />
            <TextInput
              onchange={handleUserPwChange}
              state={userPwAlert}
              stateMsg={[
                { state: "", msg: "" },
                { state: "empty", msg: "비밀번호를 올바르게 입력해 주세요." },
              ]}
              value={user.user_pw}
              id="user-pw"
              tabindex={3}
              placeholder="비밀번호"
              label="비밀번호"
              marginTop={2}
            />
            <div className="mt-8 font-medium">이메일 확인</div>
            <div className="w-max h-12 rounded-lg mt-2 px-3.5 flex items-center text-sm bg-l-d dark:bg-d-4">
              <div className="mr-1.5">미확인</div>
              <Switch
                defaultChecked={user.user_email_confirm}
                onChange={handleToggleChange}
                size="small"
              />
              <div
                className={`${
                  emailConfirmed ? "text-h-1 dark:text-f-8" : ""
                } ml-1.5`}
              >
                확인됨
              </div>
            </div>
            <label
              htmlFor="user-email-token"
              className="mt-8 flex items-center font-medium"
            >
              이메일 토큰
              <button
                id="token-copy"
                onClick={copyOnClick}
                value={user.user_email_token}
                className="inline-flex items-center ml-2 text-sm text-h-1 dark:text-f-8"
              >
                <span className="lg:hover:underline">복사하기</span>
                <i className="copy_btn hidden ml-1 fa-solid fa-check"></i>
              </button>
            </label>
            <div className="relative mt-2">
              <button
                onClick={regenerateToken}
                className="group w-5 h-5 flex justify-center items-center absolute z-10 right-2 top-1/2 -translate-y-1/2 cursor-pointer"
              >
                <i className="text-sm text-h-1 dark:text-f-8 duration-200 lg:group-hover:rotate-90 fa-solid fa-rotate"></i>
                <div className="w-max absolute z-10 left-1/2 -top-7 px-3 py-1.5 text-[0.813rem] leading-none origin-bottom rounded hidden lg:group-hover:block lg:group-hover:animate-hover-delay bg-l-5 dark:bg-d-4 text-white dark:text-f-8 dark:drop-shadow-dark selection:bg-transparent">
                  토큰 재생성하기
                </div>
              </button>
              <input
                onChange={handleUserEmailTokenChange}
                id="user-email-token"
                tabIndex={4}
                defaultValue={user.user_email_token}
                type="text"
                placeholder="이메일 토큰"
                className={`w-full ${
                  userEmailTokenAlert
                    ? "border-h-r focus:border-h-r"
                    : "border-l-d dark:border-d-4 focus:border-h-1 focus:dark:border-f-8"
                } w-full text-sm px-3.5 py-3 rounded-lg border-2 placeholder-l-5 dark:placeholder-d-c bg-l-d dark:bg-d-4`}
              />
            </div>
            {userEmailTokenAlert ? (
              <div className="text-xs text-h-r mt-2 ml-4">
                이메일 토큰을 올바르게 입력해 주세요.
              </div>
            ) : (
              <></>
            )}
            <Button marginTop={1}>
              <button onClick={saveUserInfo} className="w-full h-full">
                {isLoading ? (
                  <span className="loader border-2 border-h-e dark:border-d-6 border-b-h-1 dark:border-b-f-8 w-4 h-4"></span>
                ) : (
                  <>저장하기</>
                )}
              </button>
            </Button>
          </div>
        </div>
      </div>

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
      // 유저 상세정보 불러오기
      const userDetail = await FetchUser(ctx.params.userNo);

      return {
        props: {
          params: {
            theme: theme ? theme : "light",
            userAgent: userAgent,
            user: session === null ? null : session.user,
            userDetail: JSON.parse(JSON.stringify(userDetail)),
          },
        },
      };
    }
  } catch (error) {
    console.log(error);
  }
}

export default UserDetailPage;
