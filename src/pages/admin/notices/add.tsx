// react
import { useState, useEffect } from "react";

// next
import { NextSeo } from "next-seo";

// next-auth
import { getServerSession } from "next-auth";
import { authOptions } from '@/pages/api/auth/[...nextauth]';

// libraries
import axios from "axios";

// components
import Header from "@/components/header";
import Footer from "@/components/footer";
import Button from "@/components/button";
import SelectBox from "@/components/selectbox";
import TextInput from "@/components/textinput";

const NoticesAdd = ({params}: any) => {
    const { theme, userAgent, user } = params;

    // 디바이스 체크
    const isMac: boolean = userAgent.includes("Mac OS") ? true : false

    // states
    const [titleAlert, setTitleAlert] = useState<string>("");
    const [contentAlert, setContentAlert] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isAlerted, setIsAlerted] = useState<string>("");
    const [option, setOption] = useState<string>("service");

    // onChange
    const handleTitleChange = () => { setTitleAlert(""); }
    const handleContentChange = () => { setContentAlert(""); }
    const handleSelectBoxChange = (e: React.ChangeEvent<HTMLSelectElement>) => { setOption(e.target.value); }

    // submit
    const handleSubmit = async () => {
        // 변수
        const title = document.getElementById("title") as HTMLInputElement;
        const content = document.getElementById("content") as HTMLTextAreaElement;

        if (title.value === "") {
            setTitleAlert("empty");
            window.scrollTo({top: title.offsetTop});
        } else if (content.value === "") {
            setContentAlert("empty");
            window.scrollTo({top: content.offsetTop});
        } else {
            setIsLoading(true);

            await axios.post("/api/admin/notices", {
                action: "add",
                notice_type: option,
                notice_title: title.value,
                notice_content: content.value,
            })
            .then(res => {
                console.log(res.data.msg);
                uploadOnSuccess();
            })
            .catch(err => {
                console.log(err);
                uploadOnFail();
            });
        }
        setIsLoading(false);
    }

    /** 업로드 실패 시 */
    const uploadOnFail = () => {
        // 초기화
        setIsAlerted("fail");
        window.scrollTo({top: 0});
    }

    /** 업로드 성공 시 */
    const uploadOnSuccess = () => {
        // 초기화
        resetForm();
        setIsAlerted("success");
        window.scrollTo({top: 0});
    }

    /** 업로드 성공 시 폼 초기화 */
    const resetForm = () => {
        // 변수
        const title = document.getElementById("title") as HTMLInputElement;
        const content = document.getElementById("content") as HTMLTextAreaElement;

        // 초기화
        title.value = "";
        content.value = "";
    }

    // 엔터키 입력 시 가입하기 버튼 클릭
    useEffect(() => {
        const keys: any = [];
        const handleKeydown = (e: KeyboardEvent) => { keys[e.key] = true; if (keys["Enter"]) { handleSubmit(); } }
        const handleKeyup = (e: KeyboardEvent) => {keys[e.key] = false;}

        window.addEventListener("keydown", handleKeydown, false);
        window.addEventListener("keyup", handleKeyup, false);

        return () => {
            window.removeEventListener("keydown", handleKeydown);
            window.removeEventListener("keyup", handleKeyup);
        }
    });

    /** 알럿 닫기 */
    const handleAlertClose = () => { setIsAlerted(""); }

    return (
        <>
            {/* Head 부분*/}
            <NextSeo 
                title={"공지 추가 · 폰트 아카이브"}
                description={"공지 추가 - 폰트 아카이브 · 상업용 무료 한글 폰트 저장소"}
            />

            {/* 헤더 */}
            <Header
                isMac={isMac}
                theme={theme}
                user={user}
            />

            {/* 메인 */}
            <div className='w-full px-4 flex flex-col justify-center items-center'>
                <div className='max-w-[45rem] w-full flex flex-col justify-center items-start py-24 tlg:py-16'>
                    <h2 className='text-2xl tlg:text-xl text-l-2 dark:text-white font-bold mb-4'>공지 추가</h2>
                    <div id="is-issued" className="w-full">
                        {
                            isAlerted === "success"
                            ? <div className='w-full h-10 px-2.5 mb-3 flex justify-between items-center rounded-lg border-2 border-h-1 dark:border-f-8 text-xs text-l-2 dark:text-white bg-h-1/20 dark:bg-f-8/20'>
                                <div className='flex items-center'>
                                    <i className="text-sm text-h-1 dark:text-f-8 fa-regular fa-bell"></i>
                                    <div className='ml-2'>공지 추가에 성공했습니다.</div>
                                </div>
                                <div onClick={handleAlertClose} className='flex justify-center items-center cursor-pointer'>
                                    <i className="text-sm fa-solid fa-xmark"></i>
                                </div>
                            </div>
                            : isAlerted === "fail"
                                ? <div className='w-full h-10 px-2.5 mb-3 flex justify-between items-center rounded-lg border-2 border-h-r text-xs text-l-2 dark:text-white bg-h-r/20'>
                                <div className='flex items-center'>
                                    <i className="text-sm text-h-r fa-regular fa-bell"></i>
                                    <div className='ml-2'>공지 추가에 실패했습니다. 잠시 후 다시 시도해 주세요.</div>
                                </div>
                                <div onClick={handleAlertClose} className='flex justify-center items-center cursor-pointer'>
                                    <i className="text-sm fa-solid fa-xmark"></i>
                                </div>
                            </div> : <></>
                        }
                    </div>
                    <div className='w-full p-10 rounded-lg text-l-2 dark:text-white bg-l-e dark:bg-d-3 drop-shadow-default dark:drop-shadow-dark'>
                        <div className="w-full flex flex-col">
                            <SelectBox
                                title="문의 종류"
                                icon="bi-send"
                                value="type"
                                select={option}
                                options={[
                                    { value: "service", name: "서비스" },
                                    { value: "font", name: "폰트" },
                                ]}
                                optionChange={handleSelectBoxChange}
                            />
                            <TextInput
                                onchange={handleTitleChange}
                                state={titleAlert}
                                stateMsg={[
                                    { state: "", msg: "" },
                                    { state: "empty", msg: "제목을 입력해 주세요." }
                                ]}
                                id="title"
                                tabindex={1}
                                placeholder="공지 제목을 입력해 주세요."
                                label="공지 제목"
                                marginTop={2}
                            />
                            <TextInput
                                onchange={handleContentChange}
                                state={contentAlert}
                                stateMsg={[
                                    { state: "", msg: "" },
                                    { state: "empty", msg: "내용을 입력해 주세요." }
                                ]}
                                id="content"
                                tabindex={2}
                                placeholder="공지 내용을 입력해 주세요."
                                label="공지 내용"
                                marginTop={2}
                            />
                        </div>
                        <Button marginTop={1}>
                            <button onClick={handleSubmit} className="w-full h-full">
                                {
                                    isLoading === true
                                    ? <span className='loader border-2 border-h-e dark:border-d-6 border-b-h-1 dark:border-b-f-8 w-4 h-4'></span>
                                    : '추가하기'
                                }
                            </button>
                        </Button>
                    </div>
                </div>
            </div>

            {/* 풋터 */}
            <Footer/>
        </>
    );
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
            return {
                props: {
                    params: {
                        theme: theme ? theme : 'light',
                        userAgent: userAgent,
                        user: session === null ? null : session.user,
                    }
                }
            }
        }
    }
    catch (error) {
        console.log(error);
    }
}

export default NoticesAdd;