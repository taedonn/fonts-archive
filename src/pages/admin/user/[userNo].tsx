// next
import Link from "next/link";
import Image from "next/image";

// next-auth
import { getServerSession } from "next-auth";
import { authOptions } from '@/pages/api/auth/[...nextauth]';

// react
import { useState } from "react";

// api
import { FetchUser } from "@/pages/api/admin/user";

// libraries
import { NextSeo } from "next-seo";
import axios from "axios";
import { Switch } from "@mui/material";

// components
import Header from "@/components/header";
import Footer from "@/components/footer";

const UserDetailPage = ({params}: any) => {
    const { theme, userAgent, userDetail } = params;
    const user = userDetail;

    // 디바이스 체크
    const isMac: boolean = userAgent.includes("Mac OS") ? true : false;

    // states
    const [profileImg, setProfileImg] = useState<string>(user.profile_img);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isSuccess, setIsSuccess] = useState<string>("");
    const [userNameAlert, setUserNameAlert] = useState<boolean>(false);
    const [userNameReportAlert, setUserNameReportAlert] = useState<boolean>(false);
    const [userPwAlert, setUserPwAlert] = useState<boolean>(false);
    const [emailConfirmed, setEmailConfirmed] = useState<boolean>(user.user_email_confirm);
    const [userEmailTokenAlert, setUserEmailTokenAlert] = useState<boolean>(false);

    // change 이벤트
    const handleUserNameChange = () => { setUserNameAlert(false); }
    const handleUserNameReportChange = () => { setUserNameReportAlert(false); }
    const handleUserPwChange = () => { setUserPwAlert(false); }
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
            setUserNameAlert(true);
            window.scrollTo({top: userName.offsetTop});
        } else if (userNameReported.value === "") {
            setUserNameReportAlert(true);
            window.scrollTo({top: userNameReported.offsetTop});
        } else if (userPw.value === "") {
            setUserPwAlert(true);
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
            <div className='w-full flex flex-col justify-center items-center'>
                <div className='relative max-w-[720px] w-full flex flex-col justify-center items-start my-[100px] tlg:my-10'>
                    <Link href="/admin/user/list" className="absolute left-0 -top-20 tlg:-top-7 text-xs text-theme-5 hover:text-theme-3 tlg:hover:text-theme-5 dark:text-theme-7 hover:dark:text-theme-9 tlg:hover:dark:text-theme-7 block border-b border-transparent hover:border-theme-3 tlg:border-theme-5 tlg:hover:border-theme-5 hover:dark:border-theme-9 tlg:dark:border-theme-7 tlg:hover:dark:border-theme-7"><div className="inline-block mr-1">&#60;</div> 유저 관리 페이지로 돌아가기</Link>
                    <h2 className='text-xl tlg:text-lg text-theme-3 dark:text-theme-9 font-medium mb-3 tlg:mb-2'>유저 정보</h2>
                    <div id="success-btn" className="w-full">
                        {
                            isSuccess === "success"
                            ? <>
                                <div className='w-full h-10 px-3 mb-2.5 flex flex-row justify-between items-center rounded-md border-2 border-theme-yellow dark:border-theme-blue-1/80 text-xs text-theme-3 dark:text-theme-9 bg-theme-yellow/40 dark:bg-theme-blue-1/20'>
                                    <div className='flex flex-row justify-start items-center'>
                                        <i className="text-sm text-theme-yellow dark:text-theme-blue-1 fa-regular fa-bell"></i>
                                        <div className='ml-2'>유저 정보 저장이 완료됐습니다.</div>
                                    </div>
                                    <div onClick={handleSuccessBtnClose} className='flex flex-row justify-center items-center cursor-pointer'>
                                        <i className="text-sm text-theme-3 dark:text-theme-9 fa-solid fa-xmark"></i>
                                    </div>
                                </div>
                            </>
                            : isSuccess === "fail"
                                ? <>
                                    <div className='w-full h-10 px-3 mb-2.5 flex flex-row justify-between items-center rounded-md border-2 border-theme-red/80 text-xs text-theme-3 dark:text-theme-9 bg-theme-red/20'>
                                        <div className='flex flex-row justify-start items-center'>
                                            <i className="text-sm text-theme-red fa-regular fa-bell"></i>
                                            <div className='ml-2'>유저 정보 저장에 실패했습니다.</div>
                                        </div>
                                        <div onClick={handleSuccessBtnClose} className='flex flex-row justify-center items-center cursor-pointer'>
                                            <i className="text-sm text-theme-3 dark:text-theme-9 fa-solid fa-xmark"></i>
                                        </div>
                                    </div>
                                </> : <></>
                        }
                    </div>
                    <div className='w-full p-10 rounded-lg text-sm text-theme-10 dark:text-theme-9 bg-theme-5 dark:bg-theme-3 drop-shadow-default dark:drop-shadow-dark'>
                        <div className="flex items-center">
                            <div className="relative mr-7">
                                <div className="w-20 h-20">
                                    <Image src={profileImg} alt="Profile image" fill sizes="100%" priority className="object-cover rounded-full"/>
                                </div>
                                <button onClick={changeProfileImg} className="group flex justify-center items-center absolute top-0 -right-1 w-7 h-7 rounded-full bg-theme-3 dark:bg-theme-blue-2">
                                    <i className="text-sm text-theme-yellow dark:text-theme-blue-1 duration-200 group-hover:rotate-90 fa-solid fa-rotate"></i>
                                    <div className="tooltip w-max absolute z-10 left-1/2 -top-10 text-xs font-medium leading-none px-3 py-2 rounded-md hidden group-hover:block tlg:group-hover:hidden group-hover:animate-zoom-in-fontbox bg-theme-yellow dark:bg-theme-blue-1 text-theme-3 dark:text-theme-blue-2">이미지 랜덤 변경하기</div>
                                </button>
                            </div>
                            <div className="w-[calc(100%-100px)]">
                                <label htmlFor="user-no">유저 번호</label>
                                <input id="user-no" defaultValue={user.user_no} type="text" disabled className='w-full border-theme-6 dark:border-theme-4 text-xs mt-2 px-3.5 py-2 rounded-lg border-2 bg-theme-4 dark:bg-theme-2 text-theme-8 dark:text-theme-7'/>
                                <label htmlFor="user-id" className="block mt-5">유저 ID</label>
                                <input id="user-id" defaultValue={user.user_id} type="text" disabled className='w-full border-theme-6 dark:border-theme-4 text-xs mt-2 px-3.5 py-2 rounded-lg border-2 bg-theme-4 dark:bg-theme-2 text-theme-8 dark:text-theme-7'/>
                            </div>
                        </div>
                        <div className="w-full h-px my-5 bg-theme-8/80 dark:bg-theme-7/80"></div>
                        <label htmlFor="user-name" className="flex items-center mt-5">
                            유저 이름
                            <button onClick={changeNickname} className="w-max text-xs font-medium rounded-full px-3 py-1.5 ml-2.5 bg-theme-yellow/80 hover:bg-theme-yellow tlg:bg-theme-yellow dark:bg-theme-blue-1/80 hover:dark:bg-theme-blue-1 tlg:dark:bg-theme-blue-1 text-theme-4 dark:text-theme-blue-2">부적절한 닉네임</button>
                        </label>
                        <input onChange={handleUserNameChange} id="user-name" tabIndex={1} defaultValue={user.user_name} type="text" placeholder="유저 이름" className={`w-full ${userNameAlert ? 'border-theme-red focus:border-theme-red' : 'border-theme-4 focus:border-theme-yellow dark:border-theme-blue-2 focus:dark:border-theme-blue-1' } text-xs mt-2 px-3.5 py-2 rounded-lg border-2 placeholder-theme-7 dark:placeholder-theme-6 bg-theme-4 dark:bg-theme-blue-2 autofill:bg-theme-4 autofill:dark:bg-theme-blue-2`}/>
                        {
                            userNameAlert
                            ? <div className="text-xs ml-4 mt-1.5 text-theme-red">유저 이름을 올바르게 입력해 주세요.</div>
                            : <></>
                        }
                        <label htmlFor="user-name-reported" className="block mt-5">유저 이름 신고 수</label>
                        <input onChange={handleUserNameReportChange} id="user-name-reported" tabIndex={2} defaultValue={user.nickname_reported} type="text" placeholder="유저 이름 신고 수" className={`w-full ${userNameReportAlert ? 'border-theme-red focus:border-theme-red' : 'border-theme-4 focus:border-theme-yellow dark:border-theme-blue-2 focus:dark:border-theme-blue-1' } text-xs mt-2 px-3.5 py-2 rounded-lg border-2 placeholder-theme-7 dark:placeholder-theme-6 bg-theme-4 dark:bg-theme-blue-2 autofill:bg-theme-4 autofill:dark:bg-theme-blue-2`}/>
                        {
                            userNameReportAlert
                            ? <div className="text-xs ml-4 mt-1.5 text-theme-red">유저 이름 신고 수를 올바르게 입력해 주세요.</div>
                            : <></>
                        }
                        <label htmlFor="user-pw" className="block mt-5">비밀번호</label>
                        <input onChange={handleUserPwChange} id="user-pw" tabIndex={3} defaultValue={user.user_pw} type="text" placeholder="비밀번호" className={`w-full ${userPwAlert ? 'border-theme-red focus:border-theme-red' : 'border-theme-4 focus:border-theme-yellow dark:border-theme-blue-2 focus:dark:border-theme-blue-1' } text-xs mt-2 px-3.5 py-2 rounded-lg border-2 placeholder-theme-7 dark:placeholder-theme-6 bg-theme-4 dark:bg-theme-blue-2 autofill:bg-theme-4 autofill:dark:bg-theme-blue-2`}/>
                        {
                            userPwAlert
                            ? <div className="text-xs ml-4 mt-1.5 text-theme-red">비밀번호를 올바르게 입력해 주세요.</div>
                            : <></>
                        }
                        <div className="block mt-5">이메일 확인</div>
                        <div className="w-max h-9 rounded-lg mt-2 px-3.5 flex items-center text-xs bg-theme-4 dark:bg-theme-blue-2">
                            <div className="mr-1">미확인</div>
                            <Switch
                                defaultChecked={user.user_email_confirm}
                                onChange={handleToggleChange}
                                size="small"
                            />
                            <div className={`${emailConfirmed ? "text-theme-green" : ""} ml-1.5`}>확인됨</div>
                        </div>
                        <label htmlFor="user-email-token" className="flex items-center mt-5">
                            이메일 토큰
                            <button id="token-copy" onClick={copyOnClick} value={user.user_email_token} className="inline-flex items-center leading-loose ml-1.5 text-xs text-theme-yellow dark:text-theme-blue-1">
                                <span className="hover:underline tlg:hover:no-underline">복사하기</span>
                                <i className="copy_btn hidden ml-1 fa-solid fa-check"></i>
                            </button>
                        </label>
                        <div className="relative mt-2">
                            <button onClick={regenerateToken} className="group w-[22px] h-[22px] flex justify-center items-center absolute z-10 right-2 top-1/2 -translate-y-1/2 cursor-pointer">
                                <i className="text-sm text-theme-yellow dark:text-theme-blue-1 duration-200 group-hover:rotate-90 fa-solid fa-rotate"></i>
                                <div className="tooltip w-max absolute z-10 left-1/2 -top-10 text-xs font-medium leading-none px-3 py-2 rounded-md hidden group-hover:block tlg:group-hover:hidden group-hover:animate-zoom-in-fontbox bg-theme-yellow dark:bg-theme-blue-1 text-theme-3 dark:text-theme-blue-2">토큰 재생성하기</div>
                            </button>
                            <input onChange={handleUserEmailTokenChange} id="user-email-token" tabIndex={4} defaultValue={user.user_email_token} type="text" placeholder="이메일 토큰" className={`w-full ${userEmailTokenAlert ? 'border-theme-red focus:border-theme-red' : 'border-theme-4 focus:border-theme-yellow dark:border-theme-blue-2 focus:dark:border-theme-blue-1' } text-xs px-3.5 py-2 rounded-lg border-2 placeholder-theme-7 dark:placeholder-theme-6 bg-theme-4 dark:bg-theme-blue-2 autofill:bg-theme-4 autofill:dark:bg-theme-blue-2`}/>
                        </div>
                        {
                            userEmailTokenAlert
                            ? <div className="text-xs ml-4 mt-1.5 text-theme-red">이메일 토큰을 올바르게 입력해 주세요.</div>
                            : <></>
                        }
                        <button onClick={saveUserInfo} className="w-full h-9 rounded-lg mt-5 font-medium text-sm text-theme-4 dark:text-theme-blue-2 bg-theme-yellow/80 hover:bg-theme-yellow tlg:bg-theme-yellow dark:bg-theme-blue-1/80 hover:dark:bg-theme-blue-1 tlg:dark:bg-theme-blue-1">
                            {
                                isLoading
                                ? <span className='loader border-2 border-theme-5 border-b-theme-yellow dark:border-b-theme-blue-1 w-4 h-4 mt-0.5'></span>
                                : <>저장하기</>
                            }
                        </button>
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