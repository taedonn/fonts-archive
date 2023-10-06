// react hooks
import { useState, useEffect } from "react";

// next hooks
import { NextSeo } from "next-seo";

// hooks
import imageCompression from 'browser-image-compression';

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

    // 이미지 URL을 저장할 state
    const [imgs, setImgs] = useState<any>([]);
    const [imgAlert, setImgAlert] = useState<boolean>(false);
    const [isImgUploaded, setIsImgUploaded] = useState<boolean>(false);

    // 이미지 알럿 닫기
    const imgAlertClose = () => { setImgAlert(false); }

    // Input에 파일 업로드 시 실행할 함수
    const uploadImg = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            // 파일 5개 이상일 때 알럿 팝업
            if (e.target.files.length > 5) {
                setImgAlert(true);
            } else {
                setIsImgUploaded(true);
                for (let i = 0; i < e.target.files.length; i++) {
                    fnUploadImg(e.target.files[i], e.target.files[i].name.split('.').pop() as string, i)
                }
            }
        }
    }

    const fnUploadImg = async (file: File, fileType: string, index: number) => {
        // API 호출
        await axios.post('/api/issue/font', {
            file_name: `issue-test-${index}.` + fileType,
            file_type: file.type,
        })
        .then(async (res) => {
            // getSignedUrl의 PutObjectCommand로 받아온 url에 파일 업로드
            await axios.put(res.data.url, file, {
                headers: { 'Content-Type': file.type }
            })
            .then(async () => {
                // getSignedUrl의 GetObjectCommand로 받아온 url을 state에 저장
                await axios.get('/api/issue/font', {
                    params: {
                        fileName: `issue-test-${index}.` + fileType
                    }
                })
                .then(res => {
                    setImgs(imgs.push({src: res.data.url}));
                    
                    let imgWrap = document.getElementById("img-wrap") as HTMLDivElement;
                    imgWrap.innerHTML += `
                        <div class="relative">
                            <img src="${res.data.url}" alt="preview-img" class="w-[72px] h-[88px] rounded-[8px] object-cover"/> 
                            <button class="w-[24px] h-[24px] rounded-full absolute right-[-6px] top-[-6px] flex items-center bg-theme-3 dark:bg-theme-blue-2">
                                <svg class="w-[12px] mx-auto fill-theme-yellow dark:fill-theme-blue-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/></svg>
                            </button>
                        </div>
                    `
                })
                .catch(() => console.log("GetObjectCommand 실패"));
            })
            .catch(() => console.log("PutObjectCommand 실패"));
        })
        .catch(() => console.log("API 호출 실패"));
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
                            <div id="img-wrap" className="w-[100%] h-[132px] mt-[16px] rounded-[8px] border-theme-7 dark:border-theme-5 flex justify-center items-center gap-x-[10px] border">
                                {
                                    !isImgUploaded
                                    ? <div className="flex flex-col justify-center items-center">
                                        <svg className="w-[28px] fill-theme-9 dark:fill-theme-7" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M6.502 7a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z"/><path d="M14 14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h5.5L14 4.5V14zM4 1a1 1 0 0 0-1 1v10l2.224-2.224a.5.5 0 0 1 .61-.075L8 11l2.157-3.02a.5.5 0 0 1 .76-.063L13 10V4.5h-2A1.5 1.5 0 0 1 9.5 3V1H4z"/></svg>
                                        <label htmlFor="file" className="text-[14px] mt-[12px] text-theme-yellow dark:text-theme-blue-1 font-medium hover:underline tlg:hover:no-underline cursor-pointer">파일 추가</label>
                                        <input onChange={uploadImg} accept='image/*' id="file" type="file" multiple className="hidden"/>
                                        <div className="text-[12px] mt-[4px] text-theme-9 dark:text-theme-7">또는 첨부할 파일을 드래그해서 추가할 수 있습니다.</div>
                                    </div>
                                    : <></>
                                }
                            </div>
                            {
                                imgAlert
                                ? <div className='w-[100%] h-[40px] px-[10px] mt-[10px] flex flex-row justify-between items-center rounded-[6px] border-[2px] border-theme-red text-[12px] text-theme-9 bg-theme-red/20'>
                                    <div className='flex flex-row justify-start items-center'>
                                        <svg className='w-[14px] fill-theme-red' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/><path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/></svg>
                                        <div className='ml-[6px]'>이미지는 최대 5개까지만 올릴 수 있습니다.</div>
                                    </div>
                                    <div onClick={imgAlertClose} className='flex flex-row justify-center items-center cursor-pointer'>
                                        <svg className='w-[18px] fill-theme-9' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/></svg>
                                    </div>
                                </div>
                                : <></>
                            }
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
    catch (error) {
        console.log(error);
    }
}

export default IssueFont;