/* eslint-disable @next/next/no-img-element */
// next hooks
import { NextSeo } from "next-seo";

// react hooks
import { useState, useEffect, useRef } from "react";

// API
import { CheckIfSessionExists } from "@/pages/api/user/checkifsessionexists";
import { FetchUserInfo } from "@/pages/api/user/fetchuserinfo";
import { FetchIssue } from "@/pages/api/admin/issue";
import axios from "axios";

// components
import Header from "@/components/header";
import { Switch } from "@mui/material";

const IssuePage = ({params}: any) => {
    // 디바이스 체크
    const isMac: boolean = params.userAgent.includes("Mac OS") ? true : false;

    // 빈 함수
    const emptyFn = () => { return; }

    // 유저 정보
    const issue = params.issue;

    // ref
    const imgRef = useRef<HTMLDivElement>(null);

    // state
    const [isFocused, setIsFocused] = useState<boolean>(false);
    const [focusedImg, setFocusedImg] = useState<string>("");

    /** 댓글 시간 포맷 */
    const commentsTimeFormat = (time: string) => {
        const splitTime = time.split(':');
        return splitTime[0] + ':' + splitTime[1];
    }

    /** 댓글 날짜 포맷 */
    const commentsDateFormat = (date: string) => {
        const splitDate = date.split('-');
        return splitDate[0].replace("20", "") + '.' + splitDate[1] + '.' + commentsTimeFormat(splitDate[2].replace('T', ' ').replace('Z', ''));
    }

    /** 이미지 영역 확대 */
    const handleOnImgFocus = (e: React.MouseEvent<HTMLImageElement>) => {
        // 이미지 번호에 맞는 이미지 넣기
        const imgNum = e.currentTarget.id.split("_").pop();
        if (imgNum === "1") { setFocusedImg(issue.issue_img_1); }
        else if (imgNum === "2") { setFocusedImg(issue.issue_img_2); }
        else if (imgNum === "3") { setFocusedImg(issue.issue_img_3); }
        else if (imgNum === "4") { setFocusedImg(issue.issue_img_4); }
        else if (imgNum === "5") { setFocusedImg(issue.issue_img_5); }

        // 이미지 영역 확대
        setIsFocused(true);
        document.body.style.overflow = "hidden";
    }

    /** 이미지 영역 축소 */
    const handleOffImgFocus = () => {
        // 이미지 영역 축소
        setIsFocused(false);
        document.body.style.overflow = "auto";
    }

    // 이미지 영역 축소
    useEffect(() => {
        function handleImgOutside(e:Event) {
            if (imgRef?.current && !imgRef.current.contains(e.target as Node)) {
                // 이미지 영역 축소
                setIsFocused(false);
                document.body.style.overflow = "auto";
            }
        }
        document.addEventListener("mouseup", handleImgOutside);
        return () => document.removeEventListener("mouseup", handleImgOutside);
    },[imgRef]);

    return (
        <>
            {/* Head 부분*/}
            <NextSeo 
                title={`티켓 · 폰트 아카이브`}
                description={`티켓 - 상업용 무료 한글 폰트 저장소`}
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
                <div className='relative max-w-[720px] w-[100%] flex flex-col justify-center items-start my-[100px] tlg:my-[40px]'>
                    {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
                    <a href="/admin/issue/list" className="absolute left-0 top-[-80px] tlg:top-[-28px] text-[12px] text-theme-5 hover:text-theme-3 tlg:hover:text-theme-5 dark:text-theme-7 hover:dark:text-theme-9 tlg:hover:dark:text-theme-7 block border-b border-transparent hover:border-theme-3 tlg:border-theme-5 tlg:hover:border-theme-5 hover:dark:border-theme-9 tlg:dark:border-theme-7 tlg:hover:dark:border-theme-7"><div className="inline-block mr-[4px]">&#60;</div> 목록으로 돌아가기</a>
                    <h2 className='text-[20px] tlg:text-[18px] text-theme-3 dark:text-theme-9 font-medium'>티켓</h2>
                    <div className='text-[12px] text-theme-5 dark:text-theme-6 mt-[4px] mb-[10px] tlg:mb-[8px]'>{commentsDateFormat(issue.issue_created_at) === commentsDateFormat(issue.issue_closed_at) ? commentsDateFormat(issue.issue_created_at) + "에 생성됨" : commentsDateFormat(issue.issue_closed_at) + "에 수정됨"}</div>
                    <div className='w-[100%] p-[20px] rounded-[8px] text-[14px] text-theme-10 dark:text-theme-9 bg-theme-5 dark:bg-theme-3 drop-shadow-default dark:drop-shadow-dark'>
                        <label htmlFor="title">제목</label>
                        <input id="title" defaultValue={issue.issue_title} type="text" disabled className='w-[100%] border-theme-6 dark:border-theme-4 text-[12px] mt-[8px] px-[14px] py-[6px] rounded-[8px] border-[2px] bg-theme-4 dark:bg-theme-2 text-theme-10 dark:text-theme-9 cursor-text'/>
                        <label htmlFor="email" className="block mt-[20px]">이메일</label>
                        <input id="email" defaultValue={issue.issue_email} type="text" disabled className='w-[100%] border-theme-6 dark:border-theme-4 text-[12px] mt-[8px] px-[14px] py-[6px] rounded-[8px] border-[2px] bg-theme-4 dark:bg-theme-2 text-theme-10 dark:text-theme-9 cursor-text'/>
                        <label htmlFor="content" className="block mt-[20px]">내용</label>
                        <textarea id="content" disabled defaultValue={issue.issue_content} tabIndex={14} className={`font-edit-textarea w-[100%] h-[196px] resize-none border-theme-6 dark:border-theme-4 bg-theme-4 dark:bg-theme-2 text-theme-10 dark:text-theme-9 text-[12px] mt-[8px] px-[14px] py-[12px] rounded-[8px] border-[2px] cursor-text`}></textarea>
                        <div className="mt-[20px]">첨부한 이미지</div>
                        <div className="w-[100%] min-h-[88px] flex items-center px-[16px] mt-[8px] rounded-[8px] border-[2px] border-theme-6 dark:border-theme-4 bg-theme-4 dark:bg-theme-2">
                            {
                                issue.issue_img_length > 0
                                ? <div className="w-[100%] flex justify-center items-center gap-x-[10px] my-[16px]">
                                    {issue.issue_img_1 !== "null" && <img src={issue.issue_img_1} onClick={handleOnImgFocus} id="img_1" alt="첨부한 이미지 1" className="w-[72px] h-[88px] rounded-[8px] border-[2px] border-theme-6 dark:border-theme-4 object-cover cursor-pointer"/>}
                                    {issue.issue_img_2 !== "null" && <img src={issue.issue_img_2} onClick={handleOnImgFocus} id="img_2" alt="첨부한 이미지 2" className="w-[72px] h-[88px] rounded-[8px] border-[2px] border-theme-6 dark:border-theme-4 object-cover cursor-pointer"/>}
                                    {issue.issue_img_3 !== "null" && <img src={issue.issue_img_3} onClick={handleOnImgFocus} id="img_3" alt="첨부한 이미지 3" className="w-[72px] h-[88px] rounded-[8px] border-[2px] border-theme-6 dark:border-theme-4 object-cover cursor-pointer"/>}
                                    {issue.issue_img_4 !== "null" && <img src={issue.issue_img_4} onClick={handleOnImgFocus} id="img_4" alt="첨부한 이미지 4" className="w-[72px] h-[88px] rounded-[8px] border-[2px] border-theme-6 dark:border-theme-4 object-cover cursor-pointer"/>}
                                    {issue.issue_img_5 !== "null" && <img src={issue.issue_img_5} onClick={handleOnImgFocus} id="img_5" alt="첨부한 이미지 5" className="w-[72px] h-[88px] rounded-[8px] border-[2px] border-theme-6 dark:border-theme-4 object-cover cursor-pointer"/>}
                                </div> 
                                : <div className="w-[100%] text-[12px] text-center text-theme-10 dark:text-theme-9 cursor-text">첨부한 이미지가 없습니다.</div>
                            }
                        </div>
                    </div>
                </div>
            </div>

            {/* 이미지 확대 */}
            {
                isFocused &&
                <div className="fixed z-40 left-0 top-0 backdrop-blur bg-blur-theme w-[100%] h-[100vh] flex justify-center items-center">
                    <div ref={imgRef} className="relative flex items-center">
                        <button onClick={handleOffImgFocus} className="w-[40px] h-[40px] rounded-full hover:dark:bg-theme-4 absolute right-[92px] top-[-48px] flex justify-center items-center">
                            <svg className="w-[28px] h-[28px] fill-theme-10 dark:fill-theme-9" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/></svg>
                        </button>
                        <button className="w-[40px] h-[40px] rounded-full hover:dark:bg-theme-4 mr-[60px] flex justify-center items-center">
                            <svg className="w-[28px] h-[28px] fill-theme-10 dark:fill-theme-9" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path d="M41.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.3 256 246.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z"/></svg>
                        </button>
                        <img src={focusedImg} alt="이미지 미리보기" className="w-[600px] animate-zoom-in"/>
                        <button className="w-[40px] h-[40px] rounded-full hover:dark:bg-theme-4 ml-[60px] flex justify-center items-center">
                            <svg className="w-[28px] h-[28px] fill-theme-10 dark:fill-theme-9" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path d="M278.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-160 160c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L210.7 256 73.4 118.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l160 160z"/></svg>
                        </button>
                    </div>
                </div>
            }
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
        const issue = await FetchIssue(ctx.params.issueId);

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
                        user: JSON.parse(JSON.stringify(user)),
                        issue: JSON.parse(JSON.stringify(issue)),
                    }
                }
            }
        }
    }
    catch (error) {
        console.log(error);
    }
}

export default IssuePage;