// react hooks
import { useState } from "react";

// next hooks
import { NextSeo } from "next-seo";

// api
import { CheckIfSessionExists } from "@/pages/api/user/checkifsessionexists";
import { FetchUserInfo } from "@/pages/api/user/fetchuserinfo";

// components
import Header from "@/components/header";
import axios from "axios";

const IssueFont = ({params}: any) => {
    // 디바이스 체크
    const isMac: boolean = params.userAgent.includes("Mac OS") ? true : false

    // 빈 함수
    const emptyFn = () => { return; }

    // state
    const [titleAlert, setTitleAlert] = useState<boolean>(false);
    const [emailAlert, setEmailAlert] = useState<boolean>(false);
    const [emailValid, setEmailValid] = useState<boolean>(false);
    const [contentAlert, setContentAlert] = useState<boolean>(false);

    // onChange
    const handleTitleChange = () => { setTitleAlert(false); }
    const handleEmailChange = () => { setEmailAlert(false); setEmailValid(false); }
    const handleContentChange = () => { setContentAlert(false); }

    // submit
    const handleSubmit = () => {
        // 변수
        const title = document.getElementById("title") as HTMLInputElement;
        const email = document.getElementById("email") as HTMLInputElement;
        const content = document.getElementById("content") as HTMLTextAreaElement;

        // 이메일 유효성 검사
        const emailPattern = /^[A-Za-z0-9_.-]+@[A-Za-z0-9-]+\.[A-Za-z0-9-]+/;

        if (title.value === "") {
            setTitleAlert(true);
            window.scrollTo({top: title.offsetTop});
        } else if (email.value === "") {
            setEmailAlert(true);
            window.scrollTo({top: email.offsetTop});
        } else if (email.value !== "" && !emailPattern.test(email.value)) {
            setEmailValid(true);
            window.scrollTo({top: email.offsetTop});
        } else if (content.value === "") {
            setContentAlert(true);
            window.scrollTo({top: content.offsetTop});
        } else {
            
        }
    }

    return (
        <>
            {/* Head 부분*/}
            <NextSeo 
                title={"폰트 제보하기 · 폰트 아카이브"}
                description={"폰트 제보하기 - 상업용 무료 한글 폰트 아카이브"}
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
                    <h2 className='text-[20px] tlg:text-[18px] text-theme-4 dark:text-theme-9 font-medium mb-[12px] tlg:mb-[8px]'>폰트 제보하기</h2>
                    <div className='w-[100%] p-[20px] rounded-[8px] text-theme-10 dark:text-theme-9 bg-theme-5 dark:bg-theme-3 drop-shadow-default dark:drop-shadow-dark'>
                        <div className="text-[14px] flex flex-col">
                            <label htmlFor="title">제목</label>
                            <input onChange={handleTitleChange} placeholder="제목을 입력해 주세요." id="title" tabIndex={1} type="text" className={`w-[100%] ${titleAlert ? 'border-theme-red focus:border-theme-red' : 'border-theme-4 focus:border-theme-yellow dark:border-theme-blue-2 focus:dark:border-theme-blue-1' } text-[12px] mt-[8px] px-[14px] py-[6px] rounded-[8px] border-[2px] placeholder-theme-7 dark:placeholder-theme-6 bg-theme-4 dark:bg-theme-blue-2 autofill:bg-theme-4 autofill:dark:bg-theme-blue-2`}/>
                            {
                                titleAlert
                                ? <div className="text-[10px] ml-[16px] mt-[6px] text-theme-red">제목을 입력해 주세요.</div>
                                : <></>
                            }
                            <label htmlFor="email" className="mt-[20px]">이메일</label>
                            <input onChange={handleEmailChange} placeholder="빠른 시일내에 답변 드릴게요." id="email" tabIndex={2} type="text" className={`w-[100%] ${emailAlert || emailValid ? 'border-theme-red focus:border-theme-red' : 'border-theme-4 focus:border-theme-yellow dark:border-theme-blue-2 focus:dark:border-theme-blue-1' } text-[12px] mt-[8px] px-[14px] py-[6px] rounded-[8px] border-[2px] placeholder-theme-7 dark:placeholder-theme-6 bg-theme-4 dark:bg-theme-blue-2 autofill:bg-theme-4 autofill:dark:bg-theme-blue-2`}/>
                            {
                                emailAlert && !emailValid
                                ? <div className="text-[10px] ml-[16px] mt-[6px] text-theme-red">이메일을 입력해 주세요.</div>
                                : emailValid
                                    ? <div className="text-[10px] ml-[16px] mt-[6px] text-theme-red">올바른 형식의 이메일이 아닙니다.</div>
                                    : <></>
                            }
                            <label htmlFor="content" className="mt-[20px]">내용</label>
                            <textarea onChange={handleContentChange} placeholder="내용은 최대한 자세하게 적어주세요." id="content" tabIndex={3} className={`font-edit-textarea w-[100%] h-[200px] resize-none ${contentAlert ? 'border-theme-red focus:border-theme-red' : 'border-theme-4 focus:border-theme-yellow dark:border-theme-blue-2 focus:dark:border-theme-blue-1' } text-[12px] mt-[8px] px-[14px] py-[6px] rounded-[8px] border-[2px] placeholder-theme-7 dark:placeholder-theme-6 bg-theme-4 dark:bg-theme-blue-2 autofill:bg-theme-4 autofill:dark:bg-theme-blue-2`}></textarea>
                            {
                                contentAlert
                                ? <div className="text-[10px] ml-[16px] mt-[6px] text-theme-red">내용을 입력해 주세요.</div>
                                : <></>
                            }
                            <div className="w-[100%] h-[160px] mt-[16px] rounded-[8px] border-theme-7 dark:border-theme-5 flex flex-col justify-center items-center border">
                                <svg className="w-[28px] fill-theme-9 dark:fill-theme-7" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M6.502 7a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z"/><path d="M14 14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h5.5L14 4.5V14zM4 1a1 1 0 0 0-1 1v10l2.224-2.224a.5.5 0 0 1 .61-.075L8 11l2.157-3.02a.5.5 0 0 1 .76-.063L13 10V4.5h-2A1.5 1.5 0 0 1 9.5 3V1H4z"/></svg>
                                <label htmlFor="file" className="text-[14px] mt-[12px] text-theme-yellow dark:text-theme-blue-1 font-medium hover:underline tlg:hover:no-underline cursor-pointer">파일 추가</label>
                                <input id="file" type="file" className="hidden"/>
                                <div className="text-[12px] mt-[4px] text-theme-9 dark:text-theme-7">또는 첨부할 파일을 드래그해서 추가할 수 있습니다.</div>
                            </div>
                        </div>
                        <button onClick={handleSubmit} className="w-[100%] h-[34px] rounded-[8px] mt-[20px] font-medium text-[12px] text-theme-4 dark:text-theme-3 bg-theme-yellow/80 hover:bg-theme-yellow dark:bg-theme-blue-1/80 hover:dark:bg-theme-blue-1 tlg:hover:dark:bg-theme-blue-1">
                            제출하기
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}

export async function getServerSideProps(ctx: any) {
    try {
        // 쿠키
        const cookieTheme = ctx.req.cookies.theme === undefined ? "dark" : ctx.req.cookies.theme;

        // 디바이스 체크
        const userAgent = ctx.req ? ctx.req.headers['user-agent'] : navigator.userAgent;

        // 쿠키에 저장된 세션ID가 유효하면, 유저 정보 가져오기
        const user = ctx.req.cookies.session === undefined ? null : (
            await CheckIfSessionExists(ctx.req.cookies.session) === true 
            ? await FetchUserInfo(ctx.req.cookies.session)
            : null
        );

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
                    }
                }
            }
        }
    }
    catch (error) {
        console.log(error);
    }
}

export default IssueFont;