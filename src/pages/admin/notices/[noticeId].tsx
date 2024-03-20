// next
import Link from "next/link";

// next-auth
import { getServerSession } from "next-auth";
import { authOptions } from '@/pages/api/auth/[...nextauth]';

// react
import { useState } from "react";

// api
import { FetchNotice } from "@/pages/api/admin/notices";

// libraries
import { Switch } from "@mui/material";
import { NextSeo } from "next-seo";

// components
import Motion from "@/components/motion";
import Header from "@/components/header";
import Footer from "@/components/footer";
import TextInput from "@/components/textinput";
import TextArea from "@/components/textarea";
import Button from "@/components/button";

// common
import { dateFormat } from "@/libs/common";

const NoticePage = ({params}: any) => {
    const { theme, userAgent, user, notice } = params;

    // 디바이스 체크
    const isMac: boolean = userAgent.includes("Mac OS") ? true : false;

    // states
    const [isEdited, setIsEdited] = useState<string>("");
    const [createdDateAlert, setCreatedDateAlert] = useState<string>("");
    const [updatedDateAlert, setUpdatedDateAlert] = useState<string>("");
    const [titleAlert, setTitleAlert] = useState<string>("");
    const [contentAlert, setContentAlert] = useState<string>("");
    const [noticeShow, setNoticeShow] = useState<boolean>(notice.notice_show_type);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    // change 이벤트
    const handleToggleChange = (e: React.ChangeEvent<HTMLInputElement>) => { setNoticeShow(e.target.checked); }
    const handleCreatedDateChange = () => { setCreatedDateAlert(""); }
    const handleUpdatedDateChange = () => { setUpdatedDateAlert(""); }
    const handleTitleChange = () => { setTitleAlert(""); }
    const handleContentChange = () => { setContentAlert(""); }

    /** 수정하기 버튼 클릭 */
    const handleBtnClick = async () => {
        const createdDate = document.getElementById("created_date") as HTMLInputElement;
        const updatedDate = document.getElementById("updated_date") as HTMLInputElement;
        const title = document.getElementById("title") as HTMLInputElement;
        const content = document.getElementById("content") as HTMLTextAreaElement;

        if (createdDate.value === "") {
            setCreatedDateAlert("empty");
        } else if (updatedDate.value === "") {
            setUpdatedDateAlert("empty");
        } else if (title.value === "") {
            setTitleAlert("empty");
        } else if (content.value === "") {
            setContentAlert("empty");
        } else {
            setIsLoading(true);

            // 공지 수정하고 DB에 저장하기
            const url = "/api/admin/notices";
            const options = {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    action: "edit",
                    id: notice.notice_id,
                    show_type: noticeShow,
                    created_date: new Date(createdDate.value),
                    updated_date: new Date(updatedDate.value),
                    title: title.value,
                    content: content.value,
                })
            }
            
            await fetch(url, options)
            .then(res => res.json())
            .then(data => {
                console.log(data.msg);
                setIsEdited("success");
                window.scrollTo({ top: 0, behavior: "smooth" });
            })
            .catch(err => {
                console.log(err);
                setIsEdited("fail");
                window.scrollTo({ top: 0, behavior: "smooth" });
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
            <Motion
                initialOpacity={0}
                animateOpacity={1}
                exitOpacity={0}
                transitionType="spring"
            >
                <div className='w-full px-4 flex flex-col justify-center items-center text-l-2 dark:text-white'>
                    <div className='relative max-w-[45rem] w-full flex flex-col justify-center my-16 lg:my-24 mt-8 lg:mt-16'>
                        <Link href="/admin/notices/list" className="absolute left-0 -top-10 hidden lg:block border-b border-transparent text-sm text-l-5 dark:text-d-c lg:hover:text-l-2 lg:hover:dark:text-white lg:hover:border-b-l-2 lg:hover:dark:border-b-white"><div className="inline-block mr-1">&#60;</div> 목록으로 돌아가기</Link>
                        <h2 className='text-2xl font-bold mb-6'>공지 수정</h2>
                        <div id="reply-success" className="w-full">
                            {
                                isEdited === "success"
                                ? <div className='w-full h-10 px-2.5 mb-3 flex justify-between items-center rounded-lg border-2 border-h-1 dark:border-f-8 text-xs bg-h-1/20 dark:bg-f-8/20'>
                                    <div className='flex items-center'>
                                        <i className="text-sm text-h-1 dark:text-f-8 fa-regular fa-bell"></i>
                                        <div className='ml-2'>공지 수정이 완료되었습니다.</div>
                                    </div>
                                    <div onClick={handleOnEdit} className='flex justify-center items-center cursor-pointer'>
                                        <i className="text-sm fa-solid fa-xmark"></i>
                                    </div>
                                </div>
                                : isEdited === "fail"
                                    ? <div className='w-full h-10 px-2.5 mb-3 flex justify-between items-center rounded-lg border-2 border-h-r text-xs bg-h-r/20'>
                                        <div className='flex items-center'>
                                            <i className="text-sm text-h-r fa-regular fa-bell"></i>
                                            <div className='ml-2'>공지 수정에 실패했습니다.</div>
                                        </div>
                                        <div onClick={handleOnEdit} className='flex justify-center items-center cursor-pointer'>
                                            <i className="text-sm fa-solid fa-xmark"></i>
                                        </div>
                                    </div> : <></>
                            }
                        </div>
                        <div className='w-full p-5 rounded-lg bg-l-e dark:bg-d-3 drop-shadow-default dark:drop-shadow-dark'>
                            <div className="font-medium">숨김 여부</div>
                            <div className="w-max h-12 rounded-lg mt-2 px-3.5 flex items-center text-sm bg-l-d dark:bg-d-4">
                                <div className="mr-1.5">숨김</div>
                                <Switch
                                    checked={noticeShow}
                                    onChange={handleToggleChange}
                                    size="small"
                                />
                                <div className={`${noticeShow ? "text-h-1 dark:text-f-8" : ""} ml-1.5`}>보임</div>
                            </div>
                            <div className="flex gap-3 mt-8">
                                <div className="w-40 relative">
                                    <TextInput
                                        onchange={handleCreatedDateChange}
                                        state={createdDateAlert}
                                        stateMsg={[
                                            { state: "", msg: "" },
                                            { state: "empty", msg: "생성 날짜를 입력해 주세요." }
                                        ]}
                                        value={dateFormat(notice.notice_created_at)}
                                        id="created_date"
                                        tabindex={1}
                                        placeholder="YYYY-MM-DD"
                                        label="생성 날짜"
                                    />
                                </div>
                                <div className="w-40 relative">
                                    <TextInput
                                        onchange={handleUpdatedDateChange}
                                        state={updatedDateAlert}
                                        stateMsg={[
                                            { state: "", msg: "" },
                                            { state: "empty", msg: "생성 날짜를 입력해 주세요." }
                                        ]}
                                        value={dateFormat(notice.notice_updated_at)}
                                        id="updated_date"
                                        tabindex={2}
                                        placeholder="YYYY-MM-DD"
                                        label="수정 날짜"
                                    />
                                </div>
                            </div>
                            <div className="w-full h-px my-6 bg-l-b dark:bg-d-6"></div>
                            <TextInput
                                onchange={handleTitleChange}
                                state={titleAlert}
                                stateMsg={[
                                    { state: "", msg: "" },
                                    { state: "empty", msg: "제목을 입력해 주세요." }
                                ]}
                                value={notice.notice_title}
                                id="title"
                                tabindex={3}
                                placeholder="제목을 입력해 주세요."
                                label="제목"
                            />
                            <TextArea
                                onchange={handleContentChange}
                                state={contentAlert}
                                stateMsg={[
                                    { state: "", msg: "" },
                                    { state: "empty", msg: "내용을 입력해 주세요." }
                                ]}
                                value={notice.notice_content}
                                id="content"
                                tabindex={4}
                                placeholder="내용을 입력해 주세요."
                                label="내용"
                                marginTop={2}
                            />
                            <Button marginTop={1}>
                                <button onClick={handleBtnClick} className="w-full h-full">
                                    {
                                        isLoading
                                        ? <span className='loader border-2 border-h-e dark:border-d-6 border-b-h-1 dark:border-b-f-8 w-4 h-4'></span>
                                        : <>수정하기</>
                                    }
                                </button>
                            </Button>
                        </div>
                    </div>
                </div>
            </Motion>

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