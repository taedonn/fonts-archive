// next
import { NextSeo } from "next-seo";
import Link from "next/link";

// next-auth
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]";

// react
import React, { useEffect, useState } from "react";

// components
import AdSense from "@/components/adSense";
import Button from "@/components/button";
import Footer from "@/components/footer";
import Header from "@/components/header";
import TextInput from "@/components/textinput";

const FindPw = ({ params }: any) => {
  const { theme, userAgent } = params;

  // 디바이스 체크
  const isMac: boolean = userAgent.includes("Mac OS") ? true : false;

  // states
  const [nameVal, setNameVal] = useState<string>("");
  const [nameChk, setNameChk] = useState<string>("");
  const [idVal, setIdVal] = useState<string>("");
  const [idChk, setIdChk] = useState<string>("");
  const [alertDisplay, setAlertDisplay] = useState<boolean>(false);
  const [isValid, setIsValid] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // 뒤로가기 시 history가 남아있으면 state 변경
  useEffect(() => {
    const formName = document.getElementById("name") as HTMLInputElement;
    const formId = document.getElementById("id") as HTMLInputElement;
    if (formName.value !== "") {
      setNameVal(formName.value);
    }
    if (formId.value !== "") {
      setIdVal(formId.value);
    }
  }, []);

  // 이름 체인지 이벤트
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNameChk("");
    setNameVal(e.target.value);
  };

  // 아이디 체인지 이벤트
  const handleIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIdChk("");
    setIdVal(e.target.value);
  };

  /** 폼 서밋 */
  const handleOnSubmit = async () => {
    // 로딩 스피너 실행
    setIsLoading(true);

    if (nameVal === "") {
      setNameChk("empty");
    } else if (idVal === "") {
      setIdChk("empty");
    } else {
      const url = "/api/user/findpw";
      const options = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: idVal,
          name: nameVal,
        }),
      };

      await fetch(url, options)
        .then((res) => res.json())
        .then((data) => {
          if (data.valid === "invalid") {
            setIsValid(false);
            setAlertDisplay(true);
          } else {
            setIsValid(true);
            setAlertDisplay(true);
          }
        })
        .catch((err) => console.log(err));
    }

    // 로딩 스피너 정지
    setIsLoading(false);
  };

  // 엔터키 입력 시 가입하기 버튼 클릭
  useEffect(() => {
    const keys: any = [];
    const handleKeydown = (e: KeyboardEvent) => {
      keys[e.key] = true;
      if (keys["Enter"]) {
        e.preventDefault();
        handleOnSubmit();
      }
    };

    window.addEventListener("keydown", handleKeydown, false);

    return () => {
      window.removeEventListener("keydown", handleKeydown);
    };
  });

  /** 알럿창 닫기 */
  const handleAlertClose = () => {
    setAlertDisplay(false);
  };

  return (
    <>
      {/* Head 부분*/}
      <NextSeo title="비밀번호 찾기 | 폰트 아카이브" />

      {/* 헤더 */}
      <Header isMac={isMac} theme={theme} user={null} />

      {/* 메인 */}
      <div className="w-full flex flex-col justify-center items-center">
        {/* Google AdSense */}
        <div className="hidden lg:flex fixed left-8 top-36">
          <AdSense
            pc={{
              style: "display: inline-block; width: 160px; height: 600px;",
              client: "ca-pub-7819549426971576",
              slot: "3299140583",
            }}
            mobile={{
              style: "display: inline-block; width: 160px; height: 600px;",
              client: "ca-pub-7819549426971576",
              slot: "3299140583",
            }}
          />
        </div>

        {/* Google AdSense */}
        <div className="hidden lg:flex fixed right-8 top-36">
          <AdSense
            pc={{
              style: "display: inline-block; width: 160px; height: 600px;",
              client: "ca-pub-7819549426971576",
              slot: "3299140583",
            }}
            mobile={{
              style: "display: inline-block; width: 160px; height: 600px;",
              client: "ca-pub-7819549426971576",
              slot: "3299140583",
            }}
          />
        </div>
        <div className="w-[22.5rem] flex flex-col justify-center my-16 lg:my-24 mt-8 lg:mt-16 text-l-2 dark:text-white">
          <h2 className="text-2xl font-bold mb-6">비밀번호 찾기</h2>
          {alertDisplay === true ? (
            isValid ? (
              <div className="w-full h-10 px-2.5 mb-3 flex justify-between items-center rounded-lg border-2 border-h-1 dark:border-f-8 text-xs bg-h-1/20 dark:bg-f-8/20">
                <div className="flex items-center">
                  <i className="text-sm text-h-1 dark:text-f-8 fa-regular fa-bell"></i>
                  <div className="ml-2">
                    이메일로 임시 비밀번호가 발급되었습니다.{" "}
                    <Link
                      href="/user/login"
                      className="ml-2 text-h-1 dark:text-f-8 hover:underline"
                    >
                      로그인 하기
                    </Link>
                  </div>
                </div>
                <div
                  onClick={handleAlertClose}
                  className="flex justify-center items-center cursor-pointer"
                >
                  <i className="text-sm fa-solid fa-xmark"></i>
                </div>
              </div>
            ) : (
              <div className="w-full h-10 px-2.5 mb-3 flex justify-between items-center rounded-lg border-2 border-h-r text-xs bg-h-r/20">
                <div className="flex items-center">
                  <i className="text-sm text-h-r fa-regular fa-bell"></i>
                  <div className="ml-2">일치하는 유저가 없습니다.</div>
                </div>
                <div
                  onClick={handleAlertClose}
                  className="flex justify-center items-center cursor-pointer"
                >
                  <i className="text-sm fa-solid fa-xmark"></i>
                </div>
              </div>
            )
          ) : (
            <></>
          )}
          <form
            onSubmit={(e) => e.preventDefault()}
            className="w-full p-5 rounded-lg bg-l-e dark:bg-d-3 drop-shadow-default dark:drop-shadow-dark"
          >
            <TextInput
              onchange={handleNameChange}
              state={nameChk}
              stateMsg={[
                { state: "", msg: "" },
                { state: "empty", msg: "이름을 입력해 주세요." },
              ]}
              id="name"
              tabindex={1}
              placeholder="홍길동"
              label="이름"
            />
            <TextInput
              onchange={handleIdChange}
              state={idChk}
              stateMsg={[
                { state: "", msg: "" },
                { state: "empty", msg: "아이디를 입력해 주세요." },
              ]}
              id="id"
              tabindex={2}
              placeholder="이메일을 입력해 주세요."
              label="아이디"
              marginTop={2}
            />
            <Button marginTop={1}>
              <button
                onClick={handleOnSubmit}
                className="w-full h-full flex justify-center items-center"
              >
                {isLoading ? (
                  <span className="loader border-2 border-h-e dark:border-d-6 border-b-h-1 dark:border-b-f-8 w-4 h-4"></span>
                ) : (
                  "다음"
                )}
              </button>
            </Button>
          </form>
          <div className="w-full flex justify-center items-center text-sm mt-6 text-l-5 dark:text-d-c">
            <Link
              href="/terms"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              서비스 이용약관
            </Link>
            <div className="mx-1">·</div>
            <Link
              href="/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              개인정보처리방침
            </Link>
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
    const session = await getServerSession(ctx.req, ctx.res, authOptions);

    if (session === null || session.user === undefined) {
      return {
        props: {
          params: {
            theme: theme ? theme : "light",
            userAgent: userAgent,
          },
        },
      };
    } else {
      return {
        redirect: {
          destination: "/404",
          permanent: false,
        },
      };
    }
  } catch (error) {
    console.log(error);
  }
}

export default FindPw;
