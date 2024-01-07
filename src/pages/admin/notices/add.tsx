// react
import { useState } from "react";

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

const NoticesAdd = ({params}: any) => {
    const { theme, userAgent, user } = params;

    // 디바이스 체크
    const isMac: boolean = userAgent.includes("Mac OS") ? true : false

    // states
    const [titleAlert, setTitleAlert] = useState<boolean>(false);
    const [contentAlert, setContentAlert] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isAlerted, setIsAlerted] = useState<string>("");
    const [isSelected, setIsSelected] = useState<string>("service");

    // onChange
    const handleTitleChange = () => { setTitleAlert(false); }
    const handleContentChange = () => { setContentAlert(false); }

    /** 셀렉트박스 선택 */
    const handleSelectBoxChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setIsSelected(e.target.value);
    }

    // submit
    const handleSubmit = async () => {
        // 변수
        const title = document.getElementById("title") as HTMLInputElement;
        const content = document.getElementById("content") as HTMLTextAreaElement;

        if (title.value === "") {
            setTitleAlert(true);
            window.scrollTo({top: title.offsetTop});
        } else if (content.value === "") {
            setContentAlert(true);
            window.scrollTo({top: content.offsetTop});
        } else {
            setIsLoading(true);

            await axios.post("/api/admin/notices", {
                action: "add",
                notice_type: isSelected,
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

    /** 알럿 닫기 */
    const handleAlertClose = () => {
        setIsAlerted("");
    }

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
            <div className='w-full flex flex-col justify-center items-center'>
                <div className='max-w-[720px] w-full flex flex-col justify-center items-start my-[100px] tlg:my-10'>
                    <h2 className='text-xl tlg:text-lg text-theme-3 dark:text-theme-9 font-medium mb-4 tlg:mb-3'>공지 추가</h2>
                    <div id="is-issued" className="w-full">
                        {
                            isAlerted === "success"
                            ? <>
                                <div className='w-full h-10 px-3 mb-2.5 flex flex-row justify-between items-center rounded-md border-2 border-theme-yellow dark:border-theme-blue-1/80 text-xs text-theme-3 dark:text-theme-9 bg-theme-yellow/40 dark:bg-theme-blue-1/20'>
                                    <div className='flex flex-row justify-start items-center'>
                                        <i className="text-sm text-theme-yellow dark:text-theme-blue-1 fa-regular fa-bell"></i>
                                        <div className='ml-2'>공지 추가에 성공했습니다.</div>
                                    </div>
                                    <div onClick={handleAlertClose} className='flex flex-row justify-center items-center cursor-pointer'>
                                        <i className="text-sm text-theme-3 dark:text-theme-9 fa-solid fa-xmark"></i>
                                    </div>
                                </div>
                            </>
                            : isAlerted === "fail"
                                ? <>
                                    <div className='w-full h-10 px-3 mb-2.5 flex flex-row justify-between items-center rounded-md border-2 border-theme-red/80 text-xs text-theme-3 dark:text-theme-9 bg-theme-red/20'>
                                        <div className='flex flex-row justify-start items-center'>
                                            <i className="text-sm text-theme-red fa-regular fa-bell"></i>
                                            <div className='ml-2'>공지 추가에 실패했습니다. 잠시 후 다시 시도해 주세요.</div>
                                        </div>
                                        <div onClick={handleAlertClose} className='flex flex-row justify-center items-center cursor-pointer'>
                                            <i className="text-sm text-theme-3 dark:text-theme-9 fa-solid fa-xmark"></i>
                                        </div>
                                    </div>
                                </> : <></>
                        }
                    </div>
                    <div className='w-full p-5 rounded-lg text-theme-10 dark:text-theme-9 bg-theme-5 dark:bg-theme-3 drop-shadow-default dark:drop-shadow-dark'>
                        <div className="text-sm flex flex-col">
                            <div>공지 유형</div>
                            <select onChange={handleSelectBoxChange} className='w-[100px] h-9 text-xs pt-px px-2.5 mt-2 rounded-lg outline-none cursor-pointer border-2 border-theme-7 dark:border-theme-5 bg-theme-4 dark:bg-theme-blue-2'>
                                <option value='service' defaultChecked>서비스</option>
                                <option value='font'>폰트</option>
                            </select>
                            <label htmlFor="title" className="mt-7">공지 제목</label>
                            <input onChange={handleTitleChange} placeholder="공지 제목을 입력해 주세요." id="title" tabIndex={1} type="text" className={`w-full ${titleAlert ? 'border-theme-red focus:border-theme-red' : 'border-theme-4 focus:border-theme-yellow dark:border-theme-blue-2 focus:dark:border-theme-blue-1' } text-xs mt-2 px-3.5 py-2 rounded-lg border-2 placeholder-theme-7 dark:placeholder-theme-6 bg-theme-4 dark:bg-theme-blue-2 autofill:bg-theme-4 autofill:dark:bg-theme-blue-2`}/>
                            {
                                titleAlert
                                ? <div className="text-xs ml-4 mt-1.5 text-theme-red">제목을 입력해 주세요.</div>
                                : <></>
                            }
                            <label htmlFor="content" className="mt-7">공지 내용</label>
                            <textarea onChange={handleContentChange} placeholder="공지 내용을 입력해 주세요." id="content" tabIndex={2} className={`font-edit-textarea w-full h-[200px] resize-none ${contentAlert ? 'border-theme-red focus:border-theme-red' : 'border-theme-4 focus:border-theme-yellow dark:border-theme-blue-2 focus:dark:border-theme-blue-1' } text-xs mt-2 px-3.5 py-3 rounded-lg border-2 placeholder-theme-7 dark:placeholder-theme-6 bg-theme-4 dark:bg-theme-blue-2 autofill:bg-theme-4 autofill:dark:bg-theme-blue-2`}></textarea>
                            {
                                contentAlert
                                ? <div className="text-xs ml-4 mt-1.5 text-theme-red">내용을 입력해 주세요.</div>
                                : <></>
                            }
                        </div>
                        <button onClick={handleSubmit} className="w-full h-9 rounded-lg mt-5 font-medium text-sm text-theme-4 dark:text-theme-blue-2 bg-theme-yellow/80 hover:bg-theme-yellow dark:bg-theme-blue-1/80 hover:dark:bg-theme-blue-1 tlg:hover:dark:bg-theme-blue-1">
                            {
                                isLoading === true
                                ? <span className='loader loader-register w-4 h-4'></span>
                                : '추가하기'
                            }
                        </button>
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