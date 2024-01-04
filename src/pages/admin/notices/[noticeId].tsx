/* eslint-disable @next/next/no-img-element */
// next
import Link from "next/link";
import { NextSeo } from "next-seo";

// next-auth
import { getServerSession } from "next-auth";
import { authOptions } from '@/pages/api/auth/[...nextauth]';

// react
import { useState } from "react";

// api
import { FetchNotice } from "@/pages/api/admin/notices";

// libraries
import axios from "axios";
import { Switch } from "@mui/material";

// components
import Header from "@/components/header";
import Footer from "@/components/footer";

// common
import { dateFormat } from "@/libs/common";

const NoticePage = ({params}: any) => {
    const { theme, userAgent, user, notice } = params;

    // 디바이스 체크
    const isMac: boolean = userAgent.includes("Mac OS") ? true : false;

    // states
    const [isEdited, setIsEdited] = useState<string>("");
    const [createdDateAlert, setCreatedDateAlert] = useState<boolean>(false);
    const [updatedDateAlert, setUpdatedDateAlert] = useState<boolean>(false);
    const [titleAlert, setTitleAlert] = useState<boolean>(false);
    const [contentAlert, setContentAlert] = useState<boolean>(false);
    const [noticeShow, setNoticeShow] = useState<boolean>(notice.notice_show_type);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    /** 보임/숨김 변경 */
    const handleToggleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNoticeShow(e.target.checked);
    }

    /** 생성 날짜 변경사항 있을 때 알럿 해제 */
    const handleCreatedDateChange = () => {
        setCreatedDateAlert(false);
    }

    /** 수정 날짜 변경사항 있을 때 알럿 해제 */
    const handleUpdatedDateChange = () => {
        setUpdatedDateAlert(false);
    }

    /** 제목 변경사항 있을 때 알럿 해제 */
    const handleTitleChange = () => {
        setTitleAlert(false);
    }

    /** 내용 변경사항 있을 때 알럿 해제 */
    const handleContentChange = () => {
        setContentAlert(false);
    }

    /** 수정하기 버튼 클릭 */
    const handleBtnClick = async () => {
        const createdDate = document.getElementById("created_date") as HTMLInputElement;
        const updatedDate = document.getElementById("updated_date") as HTMLInputElement;
        const title = document.getElementById("title") as HTMLInputElement;
        const content = document.getElementById("content") as HTMLTextAreaElement;

        if (createdDate.value === "") {
            setCreatedDateAlert(true);
        } else if (updatedDate.value === "") {
            setUpdatedDateAlert(true);
        } else if (title.value === "") {
            setTitleAlert(true);
        } else if (content.value === "") {
            setContentAlert(true);
        } else {
            setIsLoading(true);

            // 답변 완료하고 DB에 저장하기
            await axios.post("/api/admin/notices", {
                action: "edit",
                id: notice.notice_id,
                show_type: noticeShow,
                created_date: new Date(createdDate.value),
                updated_date: new Date(updatedDate.value),
                title: title.value,
                content: content.value,
            })
            .then(res => {
                console.log(res.data.msg);
                setIsEdited("success");
            })
            .catch(err => {
                console.log(err);
                setIsEdited("fail");
            });
        }
        setIsLoading(false);
    }

    /** 답변 완료 시 알럿 표시 */
    const handleOnEdit = () => {
        setIsEdited("");
    }

    return (
        <>
            {/* Head 부분*/}
            <NextSeo 
                title={`공지 수정 · 폰트 아카이브`}
                description={`공지 수정 - 폰트 아카이브 · 상업용 무료 한글 폰트 저장소`}
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
                    <Link href="/admin/notices/list" className="absolute left-0 -top-20 tlg:-top-7 text-xs text-theme-5 hover:text-theme-3 tlg:hover:text-theme-5 dark:text-theme-7 hover:dark:text-theme-9 tlg:hover:dark:text-theme-7 block border-b border-transparent hover:border-theme-3 tlg:border-theme-5 tlg:hover:border-theme-5 hover:dark:border-theme-9 tlg:dark:border-theme-7 tlg:hover:dark:border-theme-7"><div className="inline-block mr-1">&#60;</div> 목록으로 돌아가기</Link>
                    <h2 className='text-xl tlg:text-lg text-theme-3 dark:text-theme-9 font-medium mb-4 tlg:mb-3'>공지 수정</h2>
                    <div id="reply-success" className="w-full">
                        {
                            isEdited === "success"
                            ? <div className='w-full h-10 px-2.5 mb-2.5 flex flex-row justify-between items-center rounded-md border-2 border-theme-yellow dark:border-theme-blue-1/80 text-xs text-theme-3 dark:text-theme-9 bg-theme-yellow/40 dark:bg-theme-blue-1/20'>
                                <div className='flex flex-row justify-start items-center'>
                                    <svg className='w-3.5 fill-theme-yellow dark:fill-theme-blue-1/80' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/><path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/></svg>
                                    <div className='ml-1.5'>공지 수정이 완료되었습니다.</div>
                                </div>
                                <div onClick={handleOnEdit} className='flex flex-row justify-center items-center cursor-pointer'>
                                    <svg className='w-[18px] fill-theme-3 dark:fill-theme-9' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/></svg>
                                </div>
                            </div>
                            : isEdited === "fail"
                                ? <div className='w-full h-10 px-2.5 mb-2.5 flex flex-row justify-between items-center rounded-md border-2 border-theme-red/80 text-[12px] text-theme-3 dark:text-theme-9 bg-theme-red/20'>
                                    <div className='flex flex-row justify-start items-center'>
                                        <svg className='w-3.5 fill-theme-red/80' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/><path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/></svg>
                                        <div className='ml-1.5'>공지 수정에 실패했습니다.</div>
                                    </div>
                                    <div onClick={handleOnEdit} className='flex flex-row justify-center items-center cursor-pointer'>
                                        <svg className='w-[18px] fill-theme-3 dark:fill-theme-9' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/></svg>
                                    </div>
                                </div> : <></>
                        }
                    </div>
                    <div className='w-full p-5 rounded-lg text-sm text-theme-10 dark:text-theme-9 bg-theme-5 dark:bg-theme-3 drop-shadow-default dark:drop-shadow-dark'>
                        <div>숨김 여부</div>
                        <div className="w-max flex items-center text-xs mt-2.5 px-5 py-2 rounded-lg bg-theme-4 dark:bg-theme-blue-2">
                            <div className="mr-1">숨김</div>
                            <Switch
                                checked={noticeShow}
                                onChange={handleToggleChange}
                                size="small"
                            />
                            <div className={`${noticeShow ? "text-theme-green" : ""} ml-1.5`}>보임</div>
                        </div>
                        <div className="flex items-center gap-3 mt-7">
                            <div className="relative">
                                <label htmlFor="created_date" className="block">생성 날짜</label>
                                <input id="created_date" tabIndex={1} onChange={handleCreatedDateChange} placeholder="YYYY-MM-DD" defaultValue={dateFormat(notice.notice_created_at)} type="text" className={`w-[134px] ${createdDateAlert ? 'border-theme-red focus:border-theme-red' : 'border-theme-4 focus:border-theme-yellow dark:border-theme-blue-2 focus:dark:border-theme-blue-1' } text-xs mt-2.5 px-3.5 py-2 rounded-lg border-2 placeholder:text-theme-7 bg-theme-4 dark:bg-theme-blue-2 autofill:bg-theme-4 autofill:dark:bg-theme-blue-2`}/>
                                {
                                    createdDateAlert &&
                                    <div className="absolute left-1.5 -bottom-5 text-xs text-theme-red">생성 날짜를 입력해 주세요.</div>
                                }
                            </div>
                            <div className="relative">
                                <label htmlFor="updated_date" className="block">수정 날짜</label>
                                <input id="updated_date" tabIndex={2} onChange={handleUpdatedDateChange} placeholder="YYYY-MM-DD" defaultValue={dateFormat(notice.notice_updated_at)} type="text" className={`w-[134px] ${updatedDateAlert ? 'border-theme-red focus:border-theme-red' : 'border-theme-4 focus:border-theme-yellow dark:border-theme-blue-2 focus:dark:border-theme-blue-1' } text-xs mt-2.5 px-3.5 py-2 rounded-lg border-2 placeholder:text-theme-7 bg-theme-4 dark:bg-theme-blue-2 autofill:bg-theme-4 autofill:dark:bg-theme-blue-2`}/>
                                {
                                    updatedDateAlert &&
                                    <div className="absolute left-1.5 -bottom-5 text-xs text-theme-red">수정 날짜를 입력해 주세요.</div>
                                }
                            </div>
                        </div>
                        <div className="w-full h-px my-7 bg-theme-8/80 dark:bg-theme-7/80"></div>
                        <label htmlFor="title">제목</label>
                        <input id="title" tabIndex={3} onChange={handleTitleChange} placeholder="제목을 입력해 주세요." defaultValue={notice.notice_title} type="text" className={`w-full ${titleAlert ? 'border-theme-red focus:border-theme-red' : 'border-theme-4 focus:border-theme-yellow dark:border-theme-blue-2 focus:dark:border-theme-blue-1' } text-xs mt-2.5 px-3.5 py-2 rounded-lg border-2 placeholder:text-theme-7 bg-theme-4 dark:bg-theme-blue-2 autofill:bg-theme-4 autofill:dark:bg-theme-blue-2`}/>
                        {
                            titleAlert &&
                            <div className="text-xs ml-4 mt-1.5 text-theme-red">제목을 입력해 주세요.</div>
                        }
                        <label htmlFor="content" className="block mt-7">내용</label>
                        <textarea id="content" tabIndex={4} onChange={handleContentChange} placeholder="내용을 입력해 주세요." defaultValue={notice.notice_content} className={`font-edit-textarea w-full h-[200px] resize-none ${contentAlert ? 'border-theme-red focus:border-theme-red' : 'border-theme-4 focus:border-theme-yellow dark:border-theme-blue-2 focus:dark:border-theme-blue-1' } text-xs mt-2.5 px-3.5 py-3 rounded-lg border-2 placeholder:text-theme-7 bg-theme-4 dark:bg-theme-blue-2 autofill:bg-theme-4 autofill:dark:bg-theme-blue-2`}></textarea>
                        {
                            contentAlert &&
                            <div className="text-xs ml-4 text-theme-red">내용을 입력해 주세요.</div>
                        }
                        <button onClick={handleBtnClick} className="w-full h-9 rounded-lg mt-5 font-medium text-xs text-theme-3 dark:text-theme-blue-2 bg-theme-yellow/80 hover:bg-theme-yellow dark:bg-theme-blue-1/80 hover:dark:bg-theme-blue-1 tlg:hover:dark:bg-theme-blue-1">
                            {
                                isLoading
                                ? <span className='loader loader-register w-4 h-4 mt-2'></span>
                                : <>수정하기</>
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

        // 쿠키에 저장된 refreshToken이 유효하지 않다면, 메인페이지로 이동, 유효하면 클리이언트로 유저 정보 return
        if (session === null || session.user === undefined || session.user.id !== 1) {
            return {
                redirect: {
                    destination: '/404',
                    permanent: false,
                }
            }
        } else {
            // 유저 상세정보 불러오기
            const notice = await FetchNotice(ctx.params.noticeId);

            return {
                props: {
                    params: {
                        theme: theme ? theme : 'light',
                        userAgent: userAgent,
                        user: session === null ? null : session.user,
                        notice: JSON.parse(JSON.stringify(notice)),
                    }
                }
            }
        }
    }
    catch (error) {
        console.log(error);
    }
}

export default NoticePage;