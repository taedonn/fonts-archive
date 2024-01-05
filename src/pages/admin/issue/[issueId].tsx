// next
import Link from "next/link";
import Image from "next/image";

// next-auth
import { getServerSession } from "next-auth";
import { authOptions } from '@/pages/api/auth/[...nextauth]';

// react
import { useState, useEffect, useRef } from "react";

// api
import { FetchIssue } from "@/pages/api/admin/issue";

// libraries
import { NextSeo } from "next-seo";
import axios from "axios";
import { Switch } from "@mui/material";

// components
import Header from "@/components/header";
import Footer from "@/components/footer";

// common
import { timeFormat } from "@/libs/common";

const IssuePage = ({params}: any) => {
    const { theme, userAgent, user, issue } = params;

    // 디바이스 체크
    const isMac: boolean = userAgent.includes("Mac OS") ? true : false;

    // states
    const [replySuccess, setReplySuccess] = useState<string>("");
    const [isFocused, setIsFocused] = useState<boolean>(false);
    const [focusedImg, setFocusedImg] = useState<string>("");
    const [txtAlert, setTxtAlert] = useState<boolean>(false);
    const [issueClosed, setIssueClosed] = useState<boolean>(issue.issue_closed);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    // refs
    const imgRef = useRef<HTMLDivElement>(null);

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

    /** 왼쪽 화살표 클릭 */
    const handleImgPrev = () => {
        const imgNum = focusedImg.split(`/issue-font-${issue.issue_id}-`)[1].split(".")[0];
        if (Number(imgNum) > 1) {
            setFocusedImg(issue[`issue_img_${Number(imgNum) - 1}`]);
        }
    }

    /** 오른쪽 화살표 클릭 */
    const handleImgNext = () => {
        const imgNum = focusedImg.split("/issue-font-")[1].split("-")[1].split(".")[0];
        if (Number(imgNum) < issue.issue_img_length) {
            setFocusedImg(issue[`issue_img_${Number(imgNum) + 1}`]);
        }
    }

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
        }

        const handleKeyup = (e: KeyboardEvent) => {
            keys[e.key] = false;
        }

        window.addEventListener("keydown", handleKeydown, false);
        window.addEventListener("keyup", handleKeyup, false);

        return () => {
            window.removeEventListener("keydown", handleKeydown);
            window.removeEventListener("keyup", handleKeyup);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [handleImgPrev, handleImgNext, handleOffImgFocus]);

    /** 이슈 닫기/열기 */
    const handleToggleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setIssueClosed(e.target.checked);
    }

    /** 텍스트 에리어 변경사항 있을 때 알럿 해제 */
    const handleTextAreaOnChange = () => {
        setTxtAlert(false);
    }

    /** 답변하기 버튼 클릭 */
    const handleBtnClick = async () => {
        const txt = document.getElementById("answer") as HTMLTextAreaElement;

        if (txt.value === "") {
            setTxtAlert(true);
        } else if (!issueClosed) {
            setIsLoading(true);

            // 답변 완료 비활성화 시 DB에만 저장
            await axios.post("/api/admin/issue", {
                action: "issue_saved",
                issue_id: issue.issue_id,
                issue_reply: txt.value,
            })
            .then(res => {
                console.log(res.data.msg);
                setIsLoading(false);
                setReplySuccess("success");
                window.scrollTo({top: 0});
            })
            .catch(err => {
                console.log(err);
                setReplySuccess("fail");
                window.scrollTo({top: 0});
            });
        } else {
            setIsLoading(true);

            // 답변 완료하고 메일 보내기
            await axios.post("/api/admin/issue", {
                action: "issue_id",
                email: issue.issue_email,
                content: issue.issue_content,
                reply: txt.value,
                issue_id: issue.issue_id,
                issue_reply: txt.value,
                issue_closed: issueClosed,
                issue_closed_type: "Closed",
            })
            .then(res => {
                console.log(res.data.msg);
                setIsLoading(false);
                setReplySuccess("success");
                window.scrollTo({top: 0});
            })
            .catch(err => {
                console.log(err);
                setReplySuccess("fail");
            });
        }
        setIsLoading(false);
    }

    /** 답변 완료 시 알럿 표시 */
    const handleOnReplyClose = () => {
        setReplySuccess("");
    }

    return (
        <>
            {/* Head 부분*/}
            <NextSeo 
                title={`폰트 티켓 · 폰트 아카이브`}
                description={`폰트 티켓 - 폰트 아카이브 · 상업용 무료 한글 폰트 저장소`}
            />

            {/* 헤더 */}
            <Header
                isMac={isMac}
                theme={theme}
                user={user}
            />

            {/* 메인 */}
            <div className='w-full flex flex-col justify-center items-center'>
                <div className='relative max-w-[720px] w-full flex flex-col justify-center items-start my-[100px] tlg:my-10'>
                    <Link href="/admin/issue/list" className="absolute left-0 -top-20 tlg:-top-7 text-xs text-theme-5 hover:text-theme-3 tlg:hover:text-theme-5 dark:text-theme-7 hover:dark:text-theme-9 tlg:hover:dark:text-theme-7 block border-b border-transparent hover:border-theme-3 tlg:border-theme-5 tlg:hover:border-theme-5 hover:dark:border-theme-9 tlg:dark:border-theme-7 tlg:hover:dark:border-theme-7"><div className="inline-block mr-1">&#60;</div> 목록으로 돌아가기</Link>
                    <h2 className='text-xl tlg:text-lg text-theme-3 dark:text-theme-9 font-medium'>폰트 티켓</h2>
                    <div className='text-xs text-theme-5 dark:text-theme-6 mt-1 mb-2.5 tlg:mb-2'>{timeFormat(issue.issue_created_at) === timeFormat(issue.issue_closed_at) ? timeFormat(issue.issue_created_at) + "에 생성됨" : timeFormat(issue.issue_closed_at) + "에 수정됨"}</div>
                    <div id="reply-success" className="w-full">
                        {
                            replySuccess === "success"
                            ? <div className='w-full h-10 px-2.5 mb-2.5 flex flex-row justify-between items-center rounded-md border-2 border-theme-yellow dark:border-theme-blue-1/80 text-xs text-theme-3 dark:text-theme-9 bg-theme-yellow/40 dark:bg-theme-blue-1/20'>
                                <div className='flex flex-row justify-start items-center'>
                                    <svg className='w-3.5 fill-theme-yellow dark:fill-theme-blue-1/80' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/><path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/></svg>
                                    <div className='ml-1.5'>답변이 완료되었습니다.</div>
                                </div>
                                <div onClick={handleOnReplyClose} className='flex flex-row justify-center items-center cursor-pointer'>
                                    <svg className='w-[18px] fill-theme-3 dark:fill-theme-9' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/></svg>
                                </div>
                            </div>
                            : replySuccess === "fail"
                                ? <div className='w-full h-10 px-2.5 mb-2.5 flex flex-row justify-between items-center rounded-md border-2 border-theme-red/80 text-xs text-theme-3 dark:text-theme-9 bg-theme-red/20'>
                                    <div className='flex flex-row justify-start items-center'>
                                        <svg className='w-3.5 fill-theme-red/80' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/><path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/></svg>
                                        <div className='ml-1.5'>답변 전송에 실패했습니다.</div>
                                    </div>
                                    <div onClick={handleOnReplyClose} className='flex flex-row justify-center items-center cursor-pointer'>
                                        <svg className='w-[18px] fill-theme-3 dark:fill-theme-9' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/></svg>
                                    </div>
                                </div> : <></>
                        }
                    </div>
                    <div className='w-full p-5 rounded-lg text-sm text-theme-10 dark:text-theme-9 bg-theme-5 dark:bg-theme-3 drop-shadow-default dark:drop-shadow-dark'>
                        <label htmlFor="title">제목</label>
                        <input id="title" defaultValue={issue.issue_title} type="text" disabled className='w-full border-theme-6 dark:border-theme-4 text-xs mt-2 px-3.5 py-2.5 rounded-lg border-2 bg-theme-4 dark:bg-theme-2 text-theme-10 dark:text-theme-9 cursor-text'/>
                        <label htmlFor="email" className="block mt-5">이메일</label>
                        <input id="email" defaultValue={issue.issue_email} type="text" disabled className='w-full border-theme-6 dark:border-theme-4 text-xs mt-2 px-3.5 py-2.5 rounded-lg border-2 bg-theme-4 dark:bg-theme-2 text-theme-10 dark:text-theme-9 cursor-text'/>
                        <label htmlFor="content" className="block mt-5">내용</label>
                        <textarea id="content" disabled defaultValue={issue.issue_content} className={`font-edit-textarea w-full h-48 resize-none border-theme-6 dark:border-theme-4 bg-theme-4 dark:bg-theme-2 text-theme-10 dark:text-theme-9 text-xs mt-2 px-3.5 py-3 rounded-lg border-2 cursor-text`}></textarea>
                        <div className="mt-5">첨부한 이미지</div>
                        <div className="w-full min-h-[88px] flex items-center px-4 mt-2 rounded-lg border-2 border-theme-6 dark:border-theme-4 bg-theme-4 dark:bg-theme-2">
                            {
                                issue.issue_img_length > 0
                                ? <div className="w-full flex justify-center items-center gap-x-2.5 my-4">
                                    {issue.issue_img_1 !== "null" && <div className="w-[72px] h-[88px] relative"><Image src={issue.issue_img_1} alt="첨부한 이미지 1" fill sizes="100%" priority referrerPolicy="no-referrer" onClick={handleOnImgFocus} id="img_1" className="rounded-lg border-2 border-theme-6 dark:border-theme-4 object-cover cursor-pointer"/></div>}
                                    {issue.issue_img_2 !== "null" && <div className="w-[72px] h-[88px] relative"><Image src={issue.issue_img_2} alt="첨부한 이미지 2" fill sizes="100%" priority referrerPolicy="no-referrer" onClick={handleOnImgFocus} id="img_2" className="rounded-lg border-2 border-theme-6 dark:border-theme-4 object-cover cursor-pointer"/></div>}
                                    {issue.issue_img_3 !== "null" && <div className="w-[72px] h-[88px] relative"><Image src={issue.issue_img_3} alt="첨부한 이미지 3" fill sizes="100%" priority referrerPolicy="no-referrer" onClick={handleOnImgFocus} id="img_3" className="rounded-lg border-2 border-theme-6 dark:border-theme-4 object-cover cursor-pointer"/></div>}
                                    {issue.issue_img_4 !== "null" && <div className="w-[72px] h-[88px] relative"><Image src={issue.issue_img_4} alt="첨부한 이미지 4" fill sizes="100%" priority referrerPolicy="no-referrer" onClick={handleOnImgFocus} id="img_4" className="rounded-lg border-2 border-theme-6 dark:border-theme-4 object-cover cursor-pointer"/></div>}
                                    {issue.issue_img_5 !== "null" && <div className="w-[72px] h-[88px] relative"><Image src={issue.issue_img_5} alt="첨부한 이미지 5" fill sizes="100%" priority referrerPolicy="no-referrer" onClick={handleOnImgFocus} id="img_5" className="rounded-lg border-2 border-theme-6 dark:border-theme-4 object-cover cursor-pointer"/></div>}
                                </div> 
                                : <div className="w-full text-xs text-center text-theme-10 dark:text-theme-9 cursor-text">첨부한 이미지가 없습니다.</div>
                            }
                        </div>
                        <div className="w-full h-px my-7 bg-theme-8/80 dark:bg-theme-7/80"></div>
                        <div className="mt-5">답변 여부</div>
                        <div className="w-max flex items-center text-xs mt-3 px-5 py-2 rounded-lg bg-theme-4 dark:bg-theme-blue-2">
                            <div className="mr-1">답변 중</div>
                            <Switch
                                checked={issueClosed}
                                onChange={handleToggleChange}
                                size="small"
                            />
                            <div className={`${issueClosed ? "text-theme-green" : ""} ml-1.5`}>답변 완료</div>
                        </div>
                        <div className="mt-7">답변</div>
                        <textarea onChange={handleTextAreaOnChange} defaultValue={issue.issue_reply} id="answer" placeholder="답변을 입력해 주세요." className={`font-edit-textarea w-full h-48 resize-none ${txtAlert ? 'border-theme-red focus:border-theme-red' : 'border-theme-4 focus:border-theme-yellow dark:border-theme-blue-2 focus:dark:border-theme-blue-1' } text-xs mt-2 px-3.5 py-3 rounded-lg border-2 placeholder-theme-7 dark:placeholder-theme-6 bg-theme-4 dark:bg-theme-blue-2 autofill:bg-theme-4 autofill:dark:bg-theme-blue-2`}></textarea>
                        {
                            txtAlert &&
                            <div className="text-xs ml-4 mt-1.5 text-theme-red">답변 내용이 없습니다.</div>
                        }
                        <button onClick={handleBtnClick} className="w-full h-9 rounded-lg mt-5 font-medium text-sm text-theme-3 dark:text-theme-2 bg-theme-yellow/80 hover:bg-theme-yellow dark:bg-theme-blue-1/80 hover:dark:bg-theme-blue-1 tlg:hover:dark:bg-theme-blue-1">
                            {
                                isLoading
                                ? <span className='loader loader-register w-4 h-4 mt-0.5'></span>
                                : <>답변하기</>
                            }
                        </button>
                    </div>
                </div>
            </div>

            {/* 이미지 확대 */}
            {
                isFocused &&
                <div className="fixed z-40 left-0 top-0 backdrop-blur bg-blur-theme w-full h-full flex justify-center items-center">
                    <div ref={imgRef} className="relative flex items-center">
                        <button onClick={handleOffImgFocus} className="group w-10 tlg:w-8 h-10 tlg:h-8 rounded-full hover:bg-theme-3 tlg:hover:bg-transparent hover:dark:bg-theme-4 tlg:hover:dark:bg-transparent absolute right-[92px] tlg:right-16 tsm:right-10 -top-12 tlg:1top-10 flex justify-center items-center">
                            <svg className="w-7 tlg:w-5 h-7 tlg:h-5 fill-theme-3 tlg:fill-theme-9 group-hover:fill-theme-9 dark:fill-theme-9" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/></svg>
                        </button>
                        <button onClick={handleImgPrev} className="group w-10 tlg:w-8 h-10 tlg:h-8 rounded-full hover:bg-theme-3 tlg:hover:bg-transparent hover:dark:bg-theme-4 tlg:hover:dark:bg-transparent mr-[60px] tlg:mr-10 tsm:mr-4 flex justify-center items-center">
                            <svg className="w-7 tlg:w-5 h-7 tlg:h-5 -translate-x-px fill-theme-3 tlg:fill-theme-9 group-hover:fill-theme-9 dark:fill-theme-9" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path d="M41.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.3 256 246.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z"/></svg>
                        </button>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={focusedImg} alt="이미지 미리보기" className="w-[600px] tlg:w-[420px] tsm:w-[300px] rounded-lg animate-zoom-in"/>
                        <button onClick={handleImgNext} className="group w-10 tlg:w-8 h-10 tlg:h-8 rounded-full hover:bg-theme-3 tlg:hover:bg-transparent hover:dark:bg-theme-4 tlg:hover:dark:bg-transparent ml-[60px] tlg:ml-10 tsm:ml-4 flex justify-center items-center">
                            <svg className="w-7 tlg:w-5 h-7 tlg:h-5 translate-x-px fill-theme-3 tlg:fill-theme-9 group-hover:fill-theme-9 dark:fill-theme-9" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path d="M278.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-160 160c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L210.7 256 73.4 118.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l160 160z"/></svg>
                        </button>
                    </div>
                </div>
            }

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

        // 유저 상세정보 불러오기
        const issue = await FetchIssue(ctx.params.issueId);

        // 쿠키에 저장된 세션ID가 유효하지 않다면, 메인페이지로 이동, 유효하면 클리이언트로 유저 정보 return
        if (session === null || session.user === undefined || session.user.id !== 1) {
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
                        theme: theme ? theme : 'light',
                        userAgent: userAgent,
                        user: session === null ? null : session.user,
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