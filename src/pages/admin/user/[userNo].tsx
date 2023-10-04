// next hooks
import { NextSeo } from "next-seo";

// react hooks
import { useState } from "react";

// API
import { CheckIfSessionExists } from "@/pages/api/user/checkifsessionexists";
import { FetchUserInfo } from "@/pages/api/user/fetchuserinfo";
import { FetchUser } from "@/pages/api/admin/user";

// components
import Header from "@/components/header";

const userDetailPage = ({params}: any) => {
    // 디바이스 체크
    const isMac: boolean = params.userAgent.includes("Mac OS") ? true : false;

    // 빈 함수
    const emptyFn = () => { return; }

    // 유저 정보
    const user = params.userDetail;

    // value state
    const [name, setName] = useState<string>(user.user_name);
    const [nameReport, setNameReport] = useState<string>(user.nickname_reported);
    const [pw, setPw] = useState<string>(user.user_pw);

    // alert state
    const [userNameAlert, setUserNameAlert] = useState<boolean>(false);
    const [userNameReportAlert, setUserNameReportAlert] = useState<boolean>(false);
    const [userPwAlert, setUserPwAlert] = useState<boolean>(false);

    // change 이벤트
    const handleUserNameChange = (e: React.ChangeEvent<HTMLInputElement>) => { setName(e.target.value); setUserNameAlert(false); }
    const handleUserNameReportChange = (e: React.ChangeEvent<HTMLInputElement>) => { setNameReport(e.target.value); setUserNameReportAlert(false); }
    const handleUserPwChange = (e: React.ChangeEvent<HTMLInputElement>) => { setPw(e.target.value); setUserPwAlert(false); }

    // 부적절한 아이디 버튼 클릭
    const changeNickname = () => {
        // 아이디 변경
        const name = document.getElementById("user-name") as HTMLInputElement;
        name.value = '부적절한 닉네임 ' + (Math.floor(Math.random() * 100) + 1);

        // 닉네임 신고 수 0으로 초기화
        const report = document.getElementById("user-name-reported") as HTMLInputElement;
        report.value = "0";
        setNameReport("0");
    }

    return (
        <>
            {/* Head 부분*/}
            <NextSeo 
                title={`${user.user_name}님의 정보 · 폰트 아카이브`}
                description={`유저 정보 - 상업용 무료 한글 폰트 아카이브`}
            />

            {/* 헤더 */}
            <Header
                isMac={isMac}
                theme={params.theme}
                user={params.user}
                page={"admin"}
                lang={""}
                type={""}
                sort={""}
                source={""}
                handleTextChange={emptyFn}
                handleLangOptionChange={emptyFn}
                handleTypeOptionChange={emptyFn}
                handleSortOptionChange={emptyFn}
                handleSearch={emptyFn}
            />

            {/* 메인 */}
            <div className='w-[100%] flex flex-col justify-center items-center'>
                <div className='max-w-[720px] w-[100%] flex flex-col justify-center items-start my-[100px] tlg:my-[40px]'>
                    <h2 className='text-[20px] tlg:text-[18px] text-theme-4 dark:text-theme-9 font-medium mb-[12px] tlg:mb-[8px]'>유저 정보</h2>
                    <div className='w-[100%] p-[20px] rounded-[8px] text-[14px] text-theme-10 dark:text-theme-9 bg-theme-5 dark:bg-theme-3 drop-shadow-default dark:drop-shadow-dark'>
                        <label htmlFor="user-no">유저 번호</label>
                        <input id="user-no" defaultValue={user.user_no} type="text" disabled className='w-[100%] border-theme-6 dark:border-theme-4 text-[12px] mt-[8px] px-[14px] py-[6px] rounded-[8px] border-[2px] bg-theme-4 dark:bg-theme-2'/>
                        <label htmlFor="user-id" className="block mt-[20px]">유저 ID</label>
                        <input id="user-id" defaultValue={user.user_id} type="text" disabled className='w-[100%] border-theme-6 dark:border-theme-4 text-[12px] mt-[8px] px-[14px] py-[6px] rounded-[8px] border-[2px] bg-theme-4 dark:bg-theme-2'/>
                        <label htmlFor="user-name" className="flex items-center mt-[20px]">
                            유저 이름
                            <button onClick={changeNickname} className="w-content text-[12px] font-medium rounded-full px-[12px] py-[6px] ml-[10px] bg-theme-yellow/80 hover:bg-theme-yellow tlg:bg-theme-yellow dark:bg-theme-blue-1/80 hover:dark:bg-theme-blue-1 tlg:dark:bg-theme-blue-1 text-theme-4 dark:text-theme-blue-2">부적절한 아이디</button>
                        </label>
                        <input onChange={handleUserNameChange} id="user-name" tabIndex={1} defaultValue={name} type="text" placeholder="유저 이름" className={`w-[100%] ${userNameAlert ? 'border-theme-red focus:border-theme-red' : 'border-theme-4 focus:border-theme-yellow dark:border-theme-blue-2 focus:dark:border-theme-blue-1' } text-[12px] mt-[8px] px-[14px] py-[6px] rounded-[8px] border-[2px] placeholder-theme-7 dark:placeholder-theme-6 bg-theme-4 dark:bg-theme-blue-2 autofill:bg-theme-4 autofill:dark:bg-theme-blue-2`}/>
                        {
                            userNameAlert
                            ? <div className="text-[10px] ml-[16px] mt-[6px] text-theme-red">유저 이름을 올바르게 입력해 주세요.</div>
                            : <></>
                        }
                        <label htmlFor="user-name-reported" className="block mt-[20px]">유저 이름 신고 수</label>
                        <input onChange={handleUserNameReportChange} id="user-name-reported" tabIndex={2} defaultValue={nameReport} type="text" placeholder="유저 이름 신고 수" className={`w-[100%] ${userNameReportAlert ? 'border-theme-red focus:border-theme-red' : 'border-theme-4 focus:border-theme-yellow dark:border-theme-blue-2 focus:dark:border-theme-blue-1' } text-[12px] mt-[8px] px-[14px] py-[6px] rounded-[8px] border-[2px] placeholder-theme-7 dark:placeholder-theme-6 bg-theme-4 dark:bg-theme-blue-2 autofill:bg-theme-4 autofill:dark:bg-theme-blue-2`}/>
                        {
                            userNameReportAlert
                            ? <div className="text-[10px] ml-[16px] mt-[6px] text-theme-red">유저 이름 신고 수를 올바르게 입력해 주세요.</div>
                            : <></>
                        }
                        <label htmlFor="user-pw" className="block mt-[20px]">비밀번호</label>
                        <input onChange={handleUserPwChange} id="user-pw" tabIndex={3} defaultValue={pw} type="text" placeholder="비밀번호" className={`w-[100%] ${userPwAlert ? 'border-theme-red focus:border-theme-red' : 'border-theme-4 focus:border-theme-yellow dark:border-theme-blue-2 focus:dark:border-theme-blue-1' } text-[12px] mt-[8px] px-[14px] py-[6px] rounded-[8px] border-[2px] placeholder-theme-7 dark:placeholder-theme-6 bg-theme-4 dark:bg-theme-blue-2 autofill:bg-theme-4 autofill:dark:bg-theme-blue-2`}/>
                        {
                            userPwAlert
                            ? <div className="text-[10px] ml-[16px] mt-[6px] text-theme-red">비밀번호를 올바르게 입력해 주세요.</div>
                            : <></>
                        }
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
                    destination: '/',
                    permanent: false,
                }
            }
        } else {
            return {
                props: {
                    params: {
                        theme: cookieTheme,
                        userAgent: userAgent,
                        user: user,
                        userDetail: userDetail,
                    }
                }
            }
        }
    }
    catch (error) {
        console.log(error);
    }
}

export default userDetailPage;