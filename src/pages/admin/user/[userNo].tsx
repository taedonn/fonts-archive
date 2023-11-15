// next hooks
import { NextSeo } from "next-seo";

// react hooks
import { useState } from "react";

// API
import { CheckIfSessionExists } from "@/pages/api/user/checkifsessionexists";
import { FetchUserInfo } from "@/pages/api/user/fetchuserinfo";
import { FetchUser } from "@/pages/api/admin/user";
import axios from "axios";

// components
import Header from "@/components/header";
import { Switch } from "@mui/material";

const UserDetailPage = ({params}: any) => {
    // 디바이스 체크
    const isMac: boolean = params.userAgent.includes("Mac OS") ? true : false;

    // 빈 함수
    const emptyFn = () => { return; }

    // 유저 정보
    const user = params.userDetail;

    // state
    const [profileImg, setProfileImg] = useState<string>(user.profile_img);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isSuccess, setIsSuccess] = useState<string>("");

    // alert state
    const [userNameAlert, setUserNameAlert] = useState<boolean>(false);
    const [userNameReportAlert, setUserNameReportAlert] = useState<boolean>(false);
    const [userPwAlert, setUserPwAlert] = useState<boolean>(false);
    const [emailConfirmed, setEmailConfirmed] = useState<boolean>(user.user_email_confirm);
    const [userEmailTokenAlert, setUserEmailTokenAlert] = useState<boolean>(false);
    const [userSessionIdAlert, setUserSessionIdAlert] = useState<boolean>(false);

    // change 이벤트
    const handleUserNameChange = () => { setUserNameAlert(false); }
    const handleUserNameReportChange = () => { setUserNameReportAlert(false); }
    const handleUserPwChange = () => { setUserPwAlert(false); }
    const handleUserEmailTokenChange = () => { setUserEmailTokenAlert(false); }
    const handleUserSessionIdChange = () => { setUserSessionIdAlert(false); }

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
    const copyOnClick = (e: any) => {
        const btn = document.getElementById(e.target.id) as HTMLButtonElement;
        const copyBtn = btn.getElementsByClassName("copy_btn")[0] as SVGSVGElement;

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

    // 세션 ID 재생성하기 버튼 클릭
    const regenerateSessionId = () => {
        // 세션 ID 생성
        const newSessionId = crypto.randomUUID();

        // input value값 변경
        const input = document.getElementById("user-session-id") as HTMLInputElement;
        input.value = newSessionId;

        // 알럿이 체크되어 있으면 체크 해제
        setUserSessionIdAlert(false);
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
        const userSessionId = document.getElementById("user-session-id") as HTMLInputElement;

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
        } else if (userSessionId.value === "") {
            setUserSessionIdAlert(true);
            window.scrollTo({top: userSessionId.offsetTop});
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
                user_session_id: userSessionId.value
            })
            .then(res => {
                console.log(res.data.message);

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
                <div className='relative max-w-[720px] w-[100%] flex flex-col justify-center items-start my-[100px] tlg:my-[40px]'>
                    {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
                    <a href="/admin/user/list" className="absolute left-0 top-[-80px] tlg:top-[-28px] text-[12px] text-theme-5 hover:text-theme-3 tlg:hover:text-theme-5 dark:text-theme-7 hover:dark:text-theme-9 tlg:hover:dark:text-theme-7 block border-b border-transparent hover:border-theme-3 tlg:border-theme-5 tlg:hover:border-theme-5 hover:dark:border-theme-9 tlg:dark:border-theme-7 tlg:hover:dark:border-theme-7"><div className="inline-block mr-[4px]">&#60;</div> 유저 관리 페이지로 돌아가기</a>
                    <h2 className='text-[20px] tlg:text-[18px] text-theme-3 dark:text-theme-9 font-medium mb-[12px] tlg:mb-[8px]'>유저 정보</h2>
                    <div id="success-btn" className="w-[100%]">
                        {
                            isSuccess === "success"
                            ? <>
                                <div className='w-[100%] h-[40px] px-[10px] mb-[10px] flex flex-row justify-between items-center rounded-[6px] border-[2px] border-theme-yellow dark:border-theme-blue-1/80 text-[12px] text-theme-3 dark:text-theme-9 bg-theme-yellow/40 dark:bg-theme-blue-1/20'>
                                    <div className='flex flex-row justify-start items-center'>
                                        <svg className='w-[14px] fill-theme-yellow dark:fill-theme-blue-1/80' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/><path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/></svg>
                                        <div className='ml-[6px]'>유저 정보 저장이 완료됐습니다.</div>
                                    </div>
                                    <div onClick={handleSuccessBtnClose} className='flex flex-row justify-center items-center cursor-pointer'>
                                        <svg className='w-[18px] fill-theme-3 dark:fill-theme-9' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/></svg>
                                    </div>
                                </div>
                            </>
                            : isSuccess === "fail"
                                ? <>
                                    <div className='w-[100%] h-[40px] px-[10px] mb-[10px] flex flex-row justify-between items-center rounded-[6px] border-[2px] border-theme-red/80 text-[12px] text-theme-3 dark:text-theme-9 bg-theme-red/20'>
                                        <div className='flex flex-row justify-start items-center'>
                                            <svg className='w-[14px] fill-theme-red/80' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/><path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/></svg>
                                            <div className='ml-[6px]'>유저 정보 저장에 실패했습니다.</div>
                                        </div>
                                        <div onClick={handleSuccessBtnClose} className='flex flex-row justify-center items-center cursor-pointer'>
                                            <svg className='w-[18px] fill-theme-3 dark:fill-theme-9' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/></svg>
                                        </div>
                                    </div>
                                </> : <></>
                        }
                    </div>
                    <div className='w-[100%] p-[20px] rounded-[8px] text-[14px] text-theme-10 dark:text-theme-9 bg-theme-5 dark:bg-theme-3 drop-shadow-default dark:drop-shadow-dark'>
                        <div className="flex items-center">
                            <div className="relative mr-[28px]">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={profileImg} alt="프로필 이미지" className="w-[80px] h-[80px] rounded-full"/>
                                <button onClick={changeProfileImg} className="group flex justify-center items-center absolute top-0 right-[-4px] w-[28px] h-[28px] rounded-full bg-theme-3 dark:bg-theme-blue-2">
                                    <svg className="w-[14px] fill-theme-yellow dark:fill-theme-blue-1 duration-200 group-hover:rotate-90" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M142.9 142.9c62.2-62.2 162.7-62.5 225.3-1L327 183c-6.9 6.9-8.9 17.2-5.2 26.2s12.5 14.8 22.2 14.8H463.5c0 0 0 0 0 0H472c13.3 0 24-10.7 24-24V72c0-9.7-5.8-18.5-14.8-22.2s-19.3-1.7-26.2 5.2L413.4 96.6c-87.6-86.5-228.7-86.2-315.8 1C73.2 122 55.6 150.7 44.8 181.4c-5.9 16.7 2.9 34.9 19.5 40.8s34.9-2.9 40.8-19.5c7.7-21.8 20.2-42.3 37.8-59.8zM16 312v7.6 .7V440c0 9.7 5.8 18.5 14.8 22.2s19.3 1.7 26.2-5.2l41.6-41.6c87.6 86.5 228.7 86.2 315.8-1c24.4-24.4 42.1-53.1 52.9-83.7c5.9-16.7-2.9-34.9-19.5-40.8s-34.9 2.9-40.8 19.5c-7.7 21.8-20.2 42.3-37.8 59.8c-62.2 62.2-162.7 62.5-225.3 1L185 329c6.9-6.9 8.9-17.2 5.2-26.2s-12.5-14.8-22.2-14.8H48.4h-.7H40c-13.3 0-24 10.7-24 24z"/></svg>
                                    <div className="same-source w-content absolute z-10 left-[50%] top-[-38px] text-[12px] font-medium leading-none px-[10px] py-[8px] rounded-[4px] hidden group-hover:block tlg:group-hover:hidden group-hover:animate-fontbox-zoom-in bg-theme-yellow dark:bg-theme-blue-1 text-theme-3 dark:text-theme-blue-2">이미지 랜덤 변경하기</div>
                                </button>
                            </div>
                            <div className="w-[calc(100%-100px)]">
                                <label htmlFor="user-no">유저 번호</label>
                                <input id="user-no" defaultValue={user.user_no} type="text" disabled className='w-[100%] border-theme-6 dark:border-theme-4 text-[12px] mt-[8px] px-[14px] py-[6px] rounded-[8px] border-[2px] bg-theme-4 dark:bg-theme-2 text-theme-8 dark:text-theme-7'/>
                                <label htmlFor="user-id" className="block mt-[20px]">유저 ID</label>
                                <input id="user-id" defaultValue={user.user_id} type="text" disabled className='w-[100%] border-theme-6 dark:border-theme-4 text-[12px] mt-[8px] px-[14px] py-[6px] rounded-[8px] border-[2px] bg-theme-4 dark:bg-theme-2 text-theme-8 dark:text-theme-7'/>
                            </div>
                        </div>
                        <div className="w-[100%] h-px my-[20px] bg-theme-8/80 dark:bg-theme-7/80"></div>
                        <label htmlFor="user-name" className="flex items-center mt-[20px]">
                            유저 이름
                            <button onClick={changeNickname} className="w-content text-[12px] font-medium rounded-full px-[12px] pt-[5px] pb-[4px] ml-[10px] bg-theme-yellow/80 hover:bg-theme-yellow tlg:bg-theme-yellow dark:bg-theme-blue-1/80 hover:dark:bg-theme-blue-1 tlg:dark:bg-theme-blue-1 text-theme-4 dark:text-theme-blue-2">부적절한 닉네임</button>
                        </label>
                        <input onChange={handleUserNameChange} id="user-name" tabIndex={1} defaultValue={user.user_name} type="text" placeholder="유저 이름" className={`w-[100%] ${userNameAlert ? 'border-theme-red focus:border-theme-red' : 'border-theme-4 focus:border-theme-yellow dark:border-theme-blue-2 focus:dark:border-theme-blue-1' } text-[12px] mt-[8px] px-[14px] py-[6px] rounded-[8px] border-[2px] placeholder-theme-7 dark:placeholder-theme-6 bg-theme-4 dark:bg-theme-blue-2 autofill:bg-theme-4 autofill:dark:bg-theme-blue-2`}/>
                        {
                            userNameAlert
                            ? <div className="text-[10px] ml-[16px] mt-[6px] text-theme-red">유저 이름을 올바르게 입력해 주세요.</div>
                            : <></>
                        }
                        <label htmlFor="user-name-reported" className="block mt-[20px]">유저 이름 신고 수</label>
                        <input onChange={handleUserNameReportChange} id="user-name-reported" tabIndex={2} defaultValue={user.nickname_reported} type="text" placeholder="유저 이름 신고 수" className={`w-[100%] ${userNameReportAlert ? 'border-theme-red focus:border-theme-red' : 'border-theme-4 focus:border-theme-yellow dark:border-theme-blue-2 focus:dark:border-theme-blue-1' } text-[12px] mt-[8px] px-[14px] py-[6px] rounded-[8px] border-[2px] placeholder-theme-7 dark:placeholder-theme-6 bg-theme-4 dark:bg-theme-blue-2 autofill:bg-theme-4 autofill:dark:bg-theme-blue-2`}/>
                        {
                            userNameReportAlert
                            ? <div className="text-[10px] ml-[16px] mt-[6px] text-theme-red">유저 이름 신고 수를 올바르게 입력해 주세요.</div>
                            : <></>
                        }
                        <label htmlFor="user-pw" className="block mt-[20px]">비밀번호</label>
                        <input onChange={handleUserPwChange} id="user-pw" tabIndex={3} defaultValue={user.user_pw} type="text" placeholder="비밀번호" className={`w-[100%] ${userPwAlert ? 'border-theme-red focus:border-theme-red' : 'border-theme-4 focus:border-theme-yellow dark:border-theme-blue-2 focus:dark:border-theme-blue-1' } text-[12px] mt-[8px] px-[14px] py-[6px] rounded-[8px] border-[2px] placeholder-theme-7 dark:placeholder-theme-6 bg-theme-4 dark:bg-theme-blue-2 autofill:bg-theme-4 autofill:dark:bg-theme-blue-2`}/>
                        {
                            userPwAlert
                            ? <div className="text-[10px] ml-[16px] mt-[6px] text-theme-red">비밀번호를 올바르게 입력해 주세요.</div>
                            : <></>
                        }
                        <div className="block mt-[20px]">이메일 확인</div>
                        <div className="w-content h-[34px] rounded-[8px] mt-[8px] px-[14px] flex items-center text-[12px] bg-theme-4 dark:bg-theme-blue-2">
                            <div className={`mr-[4px]`}>미확인</div>
                            <Switch
                                defaultChecked={user.user_email_confirm}
                                onChange={handleToggleChange}
                                size="small"
                            />
                            <div className={`${emailConfirmed ? "text-theme-green" : ""} ml-[6px]`}>확인됨</div>
                        </div>
                        <label htmlFor="user-email-token" className="flex items-center mt-[20px]">
                            이메일 토큰
                            <button id="token-copy" onClick={copyOnClick} value={user.user_email_token} className="inline-flex items-center leading-loose ml-[6px] text-[12px] text-theme-yellow dark:text-theme-blue-1 hover:underline tlg:hover:no-underline">
                                복사하기
                                <svg className="copy_btn hidden w-[18px] ml-[2px] fill-theme-yellow dark:fill-theme-blue-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z"/></svg>
                            </button>
                        </label>
                        <div className="relative mt-[8px]">
                            <button onClick={regenerateToken} className="group w-[22px] h-[22px] flex justify-center items-center absolute z-10 right-[8px] top-[50%] translate-y-[-50%] cursor-pointer">
                                <svg className="w-[14px] fill-theme-yellow dark:fill-theme-blue-1 duration-200 group-hover:rotate-90" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M142.9 142.9c62.2-62.2 162.7-62.5 225.3-1L327 183c-6.9 6.9-8.9 17.2-5.2 26.2s12.5 14.8 22.2 14.8H463.5c0 0 0 0 0 0H472c13.3 0 24-10.7 24-24V72c0-9.7-5.8-18.5-14.8-22.2s-19.3-1.7-26.2 5.2L413.4 96.6c-87.6-86.5-228.7-86.2-315.8 1C73.2 122 55.6 150.7 44.8 181.4c-5.9 16.7 2.9 34.9 19.5 40.8s34.9-2.9 40.8-19.5c7.7-21.8 20.2-42.3 37.8-59.8zM16 312v7.6 .7V440c0 9.7 5.8 18.5 14.8 22.2s19.3 1.7 26.2-5.2l41.6-41.6c87.6 86.5 228.7 86.2 315.8-1c24.4-24.4 42.1-53.1 52.9-83.7c5.9-16.7-2.9-34.9-19.5-40.8s-34.9 2.9-40.8 19.5c-7.7 21.8-20.2 42.3-37.8 59.8c-62.2 62.2-162.7 62.5-225.3 1L185 329c6.9-6.9 8.9-17.2 5.2-26.2s-12.5-14.8-22.2-14.8H48.4h-.7H40c-13.3 0-24 10.7-24 24z"/></svg>
                                <div className="same-source w-content absolute z-10 left-[50%] top-[-38px] text-[12px] font-medium leading-none px-[10px] py-[8px] rounded-[4px] hidden group-hover:block tlg:group-hover:hidden group-hover:animate-fontbox-zoom-in bg-theme-yellow dark:bg-theme-blue-1 text-theme-3 dark:text-theme-blue-2">토큰 재생성하기</div>
                            </button>
                            <input onChange={handleUserEmailTokenChange} id="user-email-token" tabIndex={4} defaultValue={user.user_email_token} type="text" placeholder="이메일 토큰" className={`w-[100%] ${userEmailTokenAlert ? 'border-theme-red focus:border-theme-red' : 'border-theme-4 focus:border-theme-yellow dark:border-theme-blue-2 focus:dark:border-theme-blue-1' } text-[12px] px-[14px] py-[6px] rounded-[8px] border-[2px] placeholder-theme-7 dark:placeholder-theme-6 bg-theme-4 dark:bg-theme-blue-2 autofill:bg-theme-4 autofill:dark:bg-theme-blue-2`}/>
                        </div>
                        {
                            userEmailTokenAlert
                            ? <div className="text-[10px] ml-[16px] mt-[6px] text-theme-red">이메일 토큰을 올바르게 입력해 주세요.</div>
                            : <></>
                        }
                        <label htmlFor="user-session-id" className="flex items-center mt-[20px]">
                            세션 ID
                            <button id="session-id-copy" onClick={copyOnClick} value={user.user_session_id} className="inline-flex items-center leading-loose ml-[6px] text-[12px] text-theme-yellow dark:text-theme-blue-1 hover:underline tlg:hover:no-underline">
                                복사하기
                                <svg className="copy_btn hidden w-[18px] ml-[2px] fill-theme-yellow dark:fill-theme-blue-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z"/></svg>
                            </button>
                        </label>
                        <div className="relative mt-[8px]">
                            <button onClick={regenerateSessionId} className="group w-[22px] h-[22px] flex justify-center items-center absolute z-10 right-[8px] top-[50%] translate-y-[-50%] cursor-pointer">
                                <svg className="w-[14px] fill-theme-yellow dark:fill-theme-blue-1 duration-200 group-hover:rotate-90" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M142.9 142.9c62.2-62.2 162.7-62.5 225.3-1L327 183c-6.9 6.9-8.9 17.2-5.2 26.2s12.5 14.8 22.2 14.8H463.5c0 0 0 0 0 0H472c13.3 0 24-10.7 24-24V72c0-9.7-5.8-18.5-14.8-22.2s-19.3-1.7-26.2 5.2L413.4 96.6c-87.6-86.5-228.7-86.2-315.8 1C73.2 122 55.6 150.7 44.8 181.4c-5.9 16.7 2.9 34.9 19.5 40.8s34.9-2.9 40.8-19.5c7.7-21.8 20.2-42.3 37.8-59.8zM16 312v7.6 .7V440c0 9.7 5.8 18.5 14.8 22.2s19.3 1.7 26.2-5.2l41.6-41.6c87.6 86.5 228.7 86.2 315.8-1c24.4-24.4 42.1-53.1 52.9-83.7c5.9-16.7-2.9-34.9-19.5-40.8s-34.9 2.9-40.8 19.5c-7.7 21.8-20.2 42.3-37.8 59.8c-62.2 62.2-162.7 62.5-225.3 1L185 329c6.9-6.9 8.9-17.2 5.2-26.2s-12.5-14.8-22.2-14.8H48.4h-.7H40c-13.3 0-24 10.7-24 24z"/></svg>
                                <div className="same-source w-content absolute z-10 left-[50%] top-[-38px] text-[12px] font-medium leading-none px-[10px] py-[8px] rounded-[4px] hidden group-hover:block tlg:group-hover:hidden group-hover:animate-fontbox-zoom-in bg-theme-yellow dark:bg-theme-blue-1 text-theme-3 dark:text-theme-blue-2">세션 ID 재생성하기</div>
                            </button>
                            <input onChange={handleUserSessionIdChange} id="user-session-id" tabIndex={5} defaultValue={user.user_session_id} type="text" placeholder="세션 ID" className={`w-[100%] ${userSessionIdAlert ? 'border-theme-red focus:border-theme-red' : 'border-theme-4 focus:border-theme-yellow dark:border-theme-blue-2 focus:dark:border-theme-blue-1' } text-[12px] px-[14px] py-[6px] rounded-[8px] border-[2px] placeholder-theme-7 dark:placeholder-theme-6 bg-theme-4 dark:bg-theme-blue-2 autofill:bg-theme-4 autofill:dark:bg-theme-blue-2`}/>
                        </div>
                        {
                            userSessionIdAlert
                            ? <div className="text-[10px] ml-[16px] mt-[6px] text-theme-red">세션 ID를 올바르게 입력해 주세요.</div>
                            : <></>
                        }
                        <button onClick={saveUserInfo} className="w-[100%] h-[34px] rounded-[8px] mt-[20px] font-medium text-[13px] text-theme-4 dark:text-theme-blue-2 bg-theme-yellow/80 hover:bg-theme-yellow tlg:bg-theme-yellow dark:bg-theme-blue-1/80 hover:dark:bg-theme-blue-1 tlg:dark:bg-theme-blue-1">
                            {
                                isLoading
                                ? <span className='loader loader-register w-[16px] h-[16px] mt-[2px]'></span>
                                : <>저장하기</>
                            }
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}

export async function getServerSideProps(ctx: any) {
    try {
        // 필터링 쿠키 체크
        const cookieTheme = ctx.req.cookies.theme === undefined ? "dark" : ctx.req.cookies.theme;

        // 디바이스 체크
        const userAgent = ctx.req ? ctx.req.headers['user-agent'] : navigator.userAgent;

        // 쿠키에 저장된 세션ID가 유효하면, 유저 정보 가져오기
        const user = ctx.req.cookies.session === undefined ? null : (
            await CheckIfSessionExists(ctx.req.cookies.session) === true 
            ? await FetchUserInfo(ctx.req.cookies.session)
            : null
        )

        // 유저 상세정보 불러오기
        const userDetail = await FetchUser(ctx.params.userNo);

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