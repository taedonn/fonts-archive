// next
import Link from "next/link";
import Image from "next/image";

// next-auth
import { getServerSession } from "next-auth";
import { authOptions } from '@/pages/api/auth/[...nextauth]';

// react
import { useState, useEffect } from "react";

// api
import { FetchUser } from "@/pages/api/admin/user";

// libraries
import { NextSeo } from "next-seo";
import axios from "axios";
import { Switch } from "@mui/material";

// components
import Header from "@/components/header";
import Footer from "@/components/footer";
import Button from "@/components/button";
import TextInput from "@/components/textinput";

const UserDetailPage = ({params}: any) => {
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
    const [emailConfirmed, setEmailConfirmed] = useState<boolean>(user.user_email_confirm);
    const [userEmailTokenAlert, setUserEmailTokenAlert] = useState<boolean>(false);

    // change 이벤트
    const handleUserNameChange = () => { setUserNameAlert(""); }
    const handleUserNameReportChange = () => { setUserNameReportAlert(""); }
    const handleUserPwChange = () => { setUserPwAlert(""); }
    const handleUserEmailTokenChange = () => { setUserEmailTokenAlert(false); }

    // 부적절한 아이디 버튼 클릭
    const changeNickname = () => {
        // 아이디 변경
        const name = document.getElementById("user-name") as HTMLInputElement;
        name.value = '부적절한 닉네임 ' + (Math.floor(Math.random() * 100) + 1);

        // 닉네임 신고 수 0으로 초기화
        const report = document.getElementById("user-name-reported") as HTMLInputElement;
        report.value = "0";
    }

    // 이메일 토글 버튼 change
    const handleToggleChange = (e: React.ChangeEvent<HTMLInputElement>) => { setEmailConfirmed(e.target.checked); }

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

    // 토큰 재생성하기 버튼 클릭
    const regenerateToken = () => {
        // 토큰 생성
        const newToken = crypto.randomUUID();
        
        // input value값 변경
        const input = document.getElementById("user-email-token") as HTMLInputElement;
        input.value = newToken;

        // 알럿이 체크되어 있으면 체크 해제
        setUserEmailTokenAlert(false);
    }

    // 이미지 랜덤 변경하기 버튼 클릭
    const changeProfileImg = () => {
        const randomProfileImg = "/fonts-archive-base-profile-img-" + (Math.floor(Math.random() * 6) + 1) + ".svg";
        setProfileImg(randomProfileImg);
    }

    // 저장하기
    const saveUserInfo = async () => {
        const userNo = document.getElementById("user-no") as HTMLInputElement;
        const userName = document.getElementById("user-name") as HTMLInputElement;
        const userNameReported = document.getElementById("user-name-reported") as HTMLInputElement;
        const userPw = document.getElementById("user-pw") as HTMLInputElement;
        const userEmailToken = document.getElementById("user-email-token") as HTMLInputElement;

        // 빈 값 유효성 체크
        if (userName.value === "") {
            setUserNameAlert("empty");
            window.scrollTo({top: userName.offsetTop});
        } else if (userNameReported.value === "") {
            setUserNameReportAlert("empty");
            window.scrollTo({top: userNameReported.offsetTop});
        } else if (userPw.value === "") {
            setUserPwAlert("empty");
            window.scrollTo({top: userPw.offsetTop});
        } else if (userEmailToken.value === "") {
            setUserEmailTokenAlert(true);
            window.scrollTo({top: userEmailToken.offsetTop});
        } else {
            // 로딩 스피너 실행
            setIsLoading(true);

            // 유저 정보 저장 API 호출
            await axios.post("/api/admin/user", {
                action: 'save-user-info',
                user_no: userNo.value,
                profile_img: profileImg,
                user_name: userName.value,
                nickname_reported: userNameReported.value,
                user_pw: userPw.value,
                user_email_confirm: emailConfirmed,
                user_email_token: userEmailToken.value,
            })
            .then(res => {
                console.log(res.data.msg);

                // 알럿 표시
                setIsSuccess("success");
                window.scrollTo({top: 0});

                // 로딩 스피너 정지
                setIsLoading(false);
            })
            .catch(err => {
                console.log(err);

                // 알럿 표시
                setIsSuccess("fail");
                window.scrollTo({top: 0});

                // 로딩 스피너 정지
                setIsLoading(false);
            })
        }
    }

    // 엔터키 입력 시 가입하기 버튼 클릭
    useEffect(() => {
        const keys: any = [];
        const handleKeydown = (e: KeyboardEvent) => { keys[e.key] = true; if (keys["Enter"]) { saveUserInfo(); } }
        const handleKeyup = (e: KeyboardEvent) => {keys[e.key] = false;}

        window.addEventListener("keydown", handleKeydown, false);
        window.addEventListener("keyup", handleKeyup, false);

        return () => {
            window.removeEventListener("keydown", handleKeydown);
            window.removeEventListener("keyup", handleKeyup);
        }
    });

    // 저장 완료/실패 팝업 닫기 버튼 클릭
    const handleSuccessBtnClose = () => { setIsSuccess(""); }

    return (
        <>
            {/* Head 부분*/}
            <NextSeo 
                title={`${user.user_name}님의 정보 · 폰트 아카이브`}
                description={`유저 정보 - 폰트 아카이브 · 상업용 무료 한글 폰트 저장소`}
            />

            {/* 헤더 */}
            <Header
                isMac={isMac}
                theme={theme}
                user={params.user}
            />

            {/* 메인 */}
            <div className='w-full px-4 flex flex-col justify-center items-center'>
                <div className='relative max-w-[45rem] w-full flex flex-col justify-center items-start py-24 tlg:py-16'>
                    <Link href="/admin/user/list" className="absolute left-0 top-3 block border-b border-transparent text-sm text-l-5 dark:text-d-c hover:text-l-2 hover:dark:text-white tlg:hover:text-l-5 tlg:hover:dark:text-d-c hover:border-b-l-2 hover:dark:border-b-white tlg:hover:border-b-transparent tlg:hover:dark:border-b-transparent"><div className="inline-block mr-1">&#60;</div> 유저 관리 페이지로 돌아가기</Link>
                    <h2 className='text-2xl tlg:text-xl text-l-2 dark:text-white font-bold mb-4'>유저 정보</h2>
                    <div id="success-btn" className="w-full">
                        {
                            isSuccess === "success"
                            ? <>
                                <div className='w-full h-10 px-2.5 mb-3 flex justify-between items-center rounded-lg border-2 border-h-1 dark:border-f-8 text-xs text-l-2 dark:text-white bg-h-1/20 dark:bg-f-8/20'>
                                    <div className='flex items-center'>
                                        <i className="text-sm text-h-1 dark:text-f-8 fa-regular fa-bell"></i>
                                        <div className='ml-2'>유저 정보 저장이 완료됐습니다.</div>
                                    </div>
                                    <div onClick={handleSuccessBtnClose} className='flex justify-center items-center cursor-pointer'>
                                        <i className="text-sm fa-solid fa-xmark"></i>
                                    </div>
                                </div>
                            </>
                            : isSuccess === "fail"
                                ? <>
                                    <div className='w-full h-10 px-2.5 mb-3 flex justify-between items-center rounded-lg border-2 border-h-r text-xs text-l-2 dark:text-white bg-h-r/20'>
                                        <div className='flex items-center'>
                                            <i className="text-sm text-h-r fa-regular fa-bell"></i>
                                            <div className='ml-2'>유저 정보 저장에 실패했습니다.</div>
                                        </div>
                                        <div onClick={handleSuccessBtnClose} className='flex justify-center items-center cursor-pointer'>
                                            <i className="text-sm fa-solid fa-xmark"></i>
                                        </div>
                                    </div>
                                </> : <></>
                        }
                    </div>
                    <div className='w-full p-10 rounded-lg text-l-2 dark:text-white bg-l-e dark:bg-d-3 drop-shadow-default dark:drop-shadow-dark'>
                        <div className="flex items-center">
                            <div className="relative mr-7">
                                <div className="w-20 h-20 relative">
                                    <Image src={profileImg} alt="Profile image" fill sizes="100%" priority className="object-cover rounded-full"/>
                                </div>
                                <button onClick={changeProfileImg} className="group absolute top-0 -right-1 w-7 h-7 rounded-full bg-h-1 dark:bg-f-8">
                                    <i className="text-sm text-white dark:text-d-2 duration-200 group-hover:rotate-90 tlg:group-hover:rotate-0 fa-solid fa-rotate"></i>
                                    <div className="tooltip w-max absolute z-10 left-1/2 -top-10 text-sm font-medium leading-none origin-bottom px-3 py-2 rounded-lg hidden group-hover:block tlg:group-hover:hidden group-hover:animate-zoom-in-fontbox bg-h-1 dark:bg-f-8 after:bg-h-1 after:dark:bg-f-8 text-white dark:text-d-2">이미지 랜덤 변경하기</div>
                                </button>
                            </div>
                            <div className="w-[calc(100%-5rem)]">
                                <TextInput value={user.user_no} disabled id="user-no" label="유저 번호"/>
                                <TextInput value={user.user_id} disabled id="user-id" label="유저 ID" marginTop={2}/>
                            </div>
                        </div>
                        <div className="w-full h-px my-6 bg-l-b dark:bg-d-6"></div>
                        <label htmlFor="user-name" className="mt-8 flex items-center font-medium">
                            유저 이름
                            <button onClick={changeNickname} className="text-sm font-medium rounded-full px-4 py-1.5 ml-3 bg-h-1 dark:bg-f-8 hover:bg-h-0 hover:dark:bg-f-9 tlg:hover:bg-h-1 tlg:hover:dark:bg-f-8 text-white dark:text-d-2">부적절한 닉네임</button>
                        </label>
                        <TextInput
                            onchange={handleUserNameChange}
                            state={userNameAlert}
                            stateMsg={[
                                { state: "", msg: "" },
                                { state: "empty", msg: "유저 이름을 올바르게 입력해 주세요." }
                            ]}
                            value={user.user_name}
                            id="user-name"
                            tabindex={1}
                            placeholder="유저 이름"
                            marginTop={0.5}
                        />
                        <TextInput
                            onchange={handleUserNameReportChange}
                            state={userNameReportAlert} stateMsg={[
                                { state: "", msg: "" },
                                { state: "empty", msg: "유저 이름 신고 수를 올바르게 입력해 주세요." }
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
                                { state: "empty", msg: "비밀번호를 올바르게 입력해 주세요." }
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
                            <div className={`${emailConfirmed ? "text-h-1 dark:text-f-8" : ""} ml-1.5`}>확인됨</div>
                        </div>
                        <label htmlFor="user-email-token" className="mt-8 flex items-center font-medium">
                            이메일 토큰
                            <button id="token-copy" onClick={copyOnClick} value={user.user_email_token} className="inline-flex items-center ml-2 text-sm text-h-1 dark:text-f-8">
                                <span className="hover:underline tlg:hover:no-underline">복사하기</span>
                                <i className="copy_btn hidden ml-1 fa-solid fa-check"></i>
                            </button>
                        </label>
                        <div className="relative mt-2">
                            <button onClick={regenerateToken} className="group w-5 h-5 flex justify-center items-center absolute z-10 right-2 top-1/2 -translate-y-1/2 cursor-pointer">
                                <i className="text-sm text-h-1 dark:text-f-8 duration-200 group-hover:rotate-90 fa-solid fa-rotate"></i>
                                <div className="tooltip w-max absolute z-10 left-1/2 -top-10 text-sm font-medium leading-none origin-bottom px-3 py-2 rounded-lg hidden group-hover:block tlg:group-hover:hidden group-hover:animate-zoom-in-fontbox bg-h-1 dark:bg-f-8 after:bg-h-1 after:dark:bg-f-8 text-white dark:text-d-2">토큰 재생성하기</div>
                            </button>
                            <input onChange={handleUserEmailTokenChange} id="user-email-token" tabIndex={4} defaultValue={user.user_email_token} type="text" placeholder="이메일 토큰" className={`w-full ${userEmailTokenAlert ? 'border-h-r focus:border-h-r' : 'border-l-d dark:border-d-4 focus:border-h-1 focus:dark:border-f-8' } w-full text-sm px-3.5 py-3 rounded-lg border-2 placeholder-l-5 dark:placeholder-d-c bg-l-d dark:bg-d-4`}/>
                        </div>
                        {
                            userEmailTokenAlert
                            ? <div className="text-xs text-h-r mt-2 ml-4">이메일 토큰을 올바르게 입력해 주세요.</div>
                            : <></>
                        }
                        <Button marginTop={1}>
                            <button onClick={saveUserInfo} className="w-full h-full">
                                {
                                    isLoading
                                    ? <span className='loader border-2 border-h-e dark:border-d-6 border-b-h-1 dark:border-b-f-8 w-4 h-4'></span>
                                    : <>저장하기</>
                                }
                            </button>
                        </Button>
                    </div>
                </div>
            </div>

            {/* 풋터 */}
            <Footer/>
        </>
    )
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
            // 유저 상세정보 불러오기
            const userDetail = await FetchUser(ctx.params.userNo);

            return {
                props: {
                    params: {
                        theme: theme ? theme : 'light',
                        userAgent: userAgent,
                        user: session === null ? null : session.user,
                        userDetail: JSON.parse(JSON.stringify(userDetail)),
                    }
                }
            }
        }
    }
    catch (error) {
        console.log(error);
    }
}

export default UserDetailPage;