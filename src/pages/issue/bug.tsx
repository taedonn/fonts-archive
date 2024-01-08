// react
import { useState } from "react";

// next
import Image from "next/image";

// next-auth
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]";

// libraries
import { NextSeo } from "next-seo";
import axios, { AxiosProgressEvent } from "axios";
import imageCompression from 'browser-image-compression';

// components
import Header from "@/components/header";
import Footer from "@/components/footer";

const IssueBug = ({params}: any) => {
    const { theme, userAgent, user } = params;

    // 디바이스 체크
    const isMac: boolean = userAgent.includes("Mac OS") ? true : false

    // states
    const [titleAlert, setTitleAlert] = useState<boolean>(false);
    const [emailAlert, setEmailAlert] = useState<boolean>(false);
    const [emailValid, setEmailValid] = useState<boolean>(false);
    const [contentAlert, setContentAlert] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isIssued, setIsIssued] = useState<string>("");
    const [imgs, setImgs] = useState<any>([]);
    const [imgNo, setImgNo] = useState<number>(0);
    const [imgAlert, setImgAlert] = useState<boolean>(false);
    const [progress, setProgress] = useState<number>(0);
    const [isDragging, setIsDragging] = useState<boolean>(false);

    // onChange
    const handleTitleChange = () => { setTitleAlert(false); }
    const handleEmailChange = () => { setEmailAlert(false); setEmailValid(false); }
    const handleContentChange = () => { setContentAlert(false); }

    // submit
    const handleSubmit = async () => {
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
            setIsLoading(true);

            // ID 가져오기
            await axios.get('/api/issue/bug', {
                params: {
                    action: "get-issue-id"
                }
            })
            .then(async (res) => {
                // 변수
                let issueId = res.data.issue.issue_id + 1;

                if (imgs.length !== 0) {
                    let allPromise = [];
                    let percentage = 0;
                    let totalSize = 0;
                    for (let i = 0; i < imgs.length; i++) {
                        totalSize += Number(imgs[i].file.size);
                    }
                    
                    // 이미지 여러개 업로드
                    for (let i = 0; i < imgs.length; i++) {
                        let promise = await axios.post('/api/issue/bug', 
                            {
                                action: 'upload-img',
                                file_name: `issue-bug-${issueId}-${i+1}.` + imgs[i].file.name.split('.').pop(),
                                file_type: imgs[i].file.type
                            }, {
                                onUploadProgress: (progressEvent: AxiosProgressEvent) => {
                                    if (progressEvent && progressEvent.total) {
                                        percentage = percentage + Number(Math.round(imgs[i].file.size) / totalSize * 90);
                                        setProgress(percentage);
                                    }
                                },
                                headers: {
                                    "Context-Type": "multiplart/form-data"
                                }
                            }
                        )
                        .then(async (res) => {
                            // AWS에 이미지 업로드
                            await axios.put(res.data.url, imgs[i].file, { headers: { 'Content-Type': imgs[i].file.type }})
                        })
                        allPromise.push(promise);
                    }

                    // 모든 이미지가 업로드되면 Prisma에 저장
                    await axios.all(allPromise)
                    .then(async () => {
                        // 버그 리포트 송신
                        await axios.post("/api/issue/bug", 
                            {
                                action: "upload-bug-report",
                                title: title.value,
                                email: email.value,
                                content: content.value,
                                img_length: imgs.length,
                                img_1: imgs[0] !== undefined ? `https://fonts-archive-issue-bug.s3.ap-northeast-2.amazonaws.com/issue-bug-${issueId}-1.` + imgs[0].file.name.split('.').pop() : "null",
                                img_2: imgs[1] !== undefined ? `https://fonts-archive-issue-bug.s3.ap-northeast-2.amazonaws.com/issue-bug-${issueId}-2.` + imgs[1].file.name.split('.').pop() : "null",
                                img_3: imgs[2] !== undefined ? `https://fonts-archive-issue-bug.s3.ap-northeast-2.amazonaws.com/issue-bug-${issueId}-3.` + imgs[2].file.name.split('.').pop() : "null",
                                img_4: imgs[3] !== undefined ? `https://fonts-archive-issue-bug.s3.ap-northeast-2.amazonaws.com/issue-bug-${issueId}-4.` + imgs[3].file.name.split('.').pop() : "null",
                                img_5: imgs[4] !== undefined ? `https://fonts-archive-issue-bug.s3.ap-northeast-2.amazonaws.com/issue-bug-${issueId}-5.` + imgs[4].file.name.split('.').pop() : "null",
                                issue_closed_type: "Open",
                            },
                            {
                                onUploadProgress: () => {
                                    setProgress(100);
                                },
                                headers: {
                                    "Context-Type": "multipart/form-data"
                                }
                            }
                        )
                        .then(() => {
                            // 폼 초기화
                            uploadOnSuccess();
                            console.log("이메일 발송 및 DB 저장 성공");
                        })
                        .catch(() => {
                            uploadOnFail();
                            console.log("이메일 발송 및 DB 저장 실패");
                        });
                    })
                    .catch(() => {
                        uploadOnFail();
                        console.log(`AWS에 이미지 업로드 실패`);
                    });
                } else {
                    // 이미지 없으면 바로 Prisma에 저장
                    await axios.post("/api/issue/bug", {
                        action: "upload-bug-report",
                        title: title.value,
                        email: email.value,
                        content: content.value,
                        img_length: imgs.length,
                        img_1: "null",
                        img_2: "null",
                        img_3: "null",
                        img_4: "null",
                        img_5: "null",
                        issue_closed_type: "Open"
                    })
                    .then(() => {
                        // 폼 초기화
                        uploadOnSuccess();
                        console.log("이메일 발송 및 DB 저장 성공");
                    })
                    .catch((err) => {
                        uploadOnFail();
                        console.log("이메일 발송 및 DB 저장 실패");
                        console.log(err);
                    });
                }
            })
            .catch(() => {
                uploadOnFail();
                console.log("폰트 제보 실패");
            });

            setIsLoading(false);
        }
    }

    /** 업로드 실패 시 */
    const uploadOnFail = () => {
        // 초기화
        setIsIssued("fail");
        window.scrollTo({top: 0});
        setProgress(0);
    }

    /** 업로드 성공 시 */
    const uploadOnSuccess = () => {
        // 초기화
        setIsIssued("success");
        resetForm();
        setProgress(0);
        window.scrollTo({top: 0});
    }

    /** 업로드 성공 시 폼 초기화 */
    const resetForm = () => {
        // 변수
        const title = document.getElementById("title") as HTMLInputElement;
        const email = document.getElementById("email") as HTMLInputElement;
        const content = document.getElementById("content") as HTMLTextAreaElement;
        const file = document.getElementById("file") as HTMLInputElement;

        // 초기화
        title.value = "";
        email.value = "";
        content.value = "";
        file.value = "";
        setImgs([]);
    }

    // 이미지 알럿 닫기
    const imgAlertClose = () => { setImgAlert(false); }

    // Input에 파일 업로드 시 실행할 함수
    const uploadImg = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            // 파일 5개 이상일 때 알럿 팝업
            if (e.target.files.length > 5 || imgs.length + e.target.files.length > 5) {
                setImgAlert(true);
            } else {
                for (let i = 0; i < e.target.files.length; i++) {
                    // 이미지 리사이징 후 미리보기
                    let file = e.target.files[i];
                    let img = document.createElement('img');
                    let objectURL = URL.createObjectURL(file);
                    img.onload = async function() {
                        // 파일이 jpeg나 png일 경우만 리사이징 함수 적용
                        if (file.type === 'image/jpeg' || file.type === 'image/png') {
                            // 파일의 넓이나 높이가 1000 초과일 때 리사이징
                            if (img.width > 1000 || img.height > 1000) {
                                // 리사이징 옵션
                                const resizeOption = { maxWidthOrHeight: 1000 }
            
                                // 리사이징 함수
                                imageCompression(file, resizeOption)
                                .then(function(compressedFile) {
                                    loadPreview(compressedFile, imgNo + imgs.length + i);
                                })
                                .catch(() => {
                                    console.log(`이미지 ${imgNo + imgs.length + i} 리사이징 실패`);
                                    uploadOnFail();
                                });
                            } else {
                                loadPreview(file, imgNo + imgs.length + i);
                            }
                        } else {
                            loadPreview(file, imgNo + imgs.length + i);
                        }
                        URL.revokeObjectURL(objectURL);
                    }
                    img.src = objectURL;
                }
                setImgNo(imgNo + imgs.length + e.target.files.length);
            }
        }
    }

    /** 미리보기 실행 */
    const loadPreview = (file: File, index: number) => {
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            setImgs((prevList: any) => [...prevList, {src: reader.result, index: index, file: file}]);
        }
    }

    /** 미리보기 삭제 */
    const deleteImg = (imgIndex: number, index: number) => {
        setImgs(imgs.filter((img: any) => img.index !== imgIndex));
        removeFileFromFileList(index);
    }

    const removeFileFromFileList = (index: number) => {
        const dt = new DataTransfer();
        const input = document.getElementById('file') as HTMLInputElement;
        const { files } = input;
        
        if (files) {
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                if (index !== i) dt.items.add(file); // here you exclude the file. thus removing it.
            }
        }
        input.files = dt.files // Assign the updates list
    }

    /** 알럿 닫기 */
    const handleIssueClose = () => {
        setIsIssued("");
    }

    const onDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };
    const onDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };
    const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.dataTransfer.files) {
            setIsDragging(true);
        }
    };
    const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        uploadImgOnDrag(e.dataTransfer.files);
        setIsDragging(false);
    };

    // Input에 파일 업로드 시 실행할 함수
    const uploadImgOnDrag = async (files: FileList) => {
        if (files) {
            // 파일 5개 이상일 때 알럿 팝업
            if (files.length > 5 || imgs.length + files.length > 5) {
                setImgAlert(true);
            } else {
                for (let i = 0; i < files.length; i++) {
                    // 이미지 리사이징 후 미리보기
                    let file = files[i];
                    let img = document.createElement('img');
                    let objectURL = URL.createObjectURL(file);
                    img.onload = async function() {
                        // 파일이 jpeg나 png일 경우만 리사이징 함수 적용
                        if (file.type === 'image/jpeg' || file.type === 'image/png') {
                            // 파일의 넓이나 높이가 1000 초과일 때 리사이징
                            if (img.width > 1000 || img.height > 1000) {
                                // 리사이징 옵션
                                const resizeOption = { maxWidthOrHeight: 1000 }
            
                                // 리사이징 함수
                                imageCompression(file, resizeOption)
                                .then(function(compressedFile) {
                                    loadPreview(compressedFile, imgNo + imgs.length + i);
                                })
                                .catch(() => {
                                    console.log(`이미지 ${imgNo + imgs.length + i} 리사이징 실패`);
                                    uploadOnFail();
                                });
                            } else {
                                loadPreview(file, imgNo + imgs.length + i);
                            }
                        } else {
                            loadPreview(file, imgNo + imgs.length + i);
                        }
                        URL.revokeObjectURL(objectURL);
                    }
                    img.src = objectURL;
                }
                setImgNo(imgNo + imgs.length + files.length);
            }
        }
    }

    return (
        <>
            {/* Head 부분*/}
            <NextSeo 
                title={"버그 리포트 · 폰트 아카이브"}
                description={"버그 리포트 - 폰트 아카이브 · 상업용 무료 한글 폰트 저장소"}
            />

            {/* 헤더 */}
            <Header
                isMac={isMac}
                theme={theme}
                user={user}
            />

            {/* Progress Bar */}
            <div style={{width: `${progress}%`}} className="h-[3px] bg-theme-yellow dark:bg-theme-blue-1 fixed z-30 left-0 top-0 duration-300 ease-out"></div>

            {/* 메인 */}
            <div className='w-full flex flex-col justify-center items-center'>
                <div className='max-w-[720px] w-full flex flex-col justify-center items-start my-[100px] tlg:my-10'>
                    <h2 className='text-xl tlg:text-lg text-theme-3 dark:text-theme-9 font-medium mb-1.5'>버그 리포트</h2>
                    <h3 className='text-sm text-theme-5 dark:text-theme-7 mb-3'>
                        버그를 발견하셨다면 제보해 주세요! 운영에 많은 도움이 됩니다.
                    </h3>
                    <div id="is-issued" className="w-full">
                        {
                            isIssued === "success"
                            ? <>
                                <div className='w-full h-10 px-3 mb-2.5 flex flex-row justify-between items-center rounded-md border-2 border-theme-yellow dark:border-theme-blue-1/80 text-xs text-theme-3 dark:text-theme-9 bg-theme-yellow/40 dark:bg-theme-blue-1/20'>
                                    <div className='flex flex-row justify-start items-center'>
                                        <i className="text-sm text-theme-yellow dark:text-theme-blue-1 fa-regular fa-bell"></i>
                                        <div className='ml-2'>이상 현상을 제보해주셔서 감사합니다. 빠른 시일 내에 해결할 수 있도록 노력하겠습니다.</div>
                                    </div>
                                    <div onClick={handleIssueClose} className='flex flex-row justify-center items-center cursor-pointer'>
                                        <i className="text-sm text-theme-3 dark:text-theme-9 fa-solid fa-xmark"></i>
                                    </div>
                                </div>
                            </>
                            : isIssued === "fail"
                                ? <>
                                    <div className='w-full h-10 px-3 mb-2.5 flex flex-row justify-between items-center rounded-md border-2 border-theme-red/80 text-xs text-theme-3 dark:text-theme-9 bg-theme-red/20'>
                                        <div className='flex flex-row justify-start items-center'>
                                            <i className="text-sm text-theme-red fa-regular fa-bell"></i>
                                            <div className='ml-2'>제보에 실패했습니다. 잠시 후 다시 시도해 주세요.</div>
                                        </div>
                                        <div onClick={handleIssueClose} className='flex flex-row justify-center items-center cursor-pointer'>
                                            <i className="text-sm text-theme-3 dark:text-theme-9 fa-solid fa-xmark"></i>
                                        </div>
                                    </div>
                                </> : <></>
                        }
                    </div>
                    <div className='w-full p-5 rounded-lg text-theme-10 dark:text-theme-9 bg-theme-5 dark:bg-theme-3 drop-shadow-default dark:drop-shadow-dark'>
                        <div className="text-sm flex flex-col">
                            <label htmlFor="title">제목</label>
                            <input onChange={handleTitleChange} placeholder="제목을 입력해 주세요." id="title" tabIndex={1} type="text" className={`w-full ${titleAlert ? 'border-theme-red focus:border-theme-red' : 'border-theme-4 focus:border-theme-yellow dark:border-theme-blue-2 focus:dark:border-theme-blue-1' } text-xs mt-2 px-3.5 py-2 rounded-lg border-2 placeholder-theme-7 dark:placeholder-theme-6 bg-theme-4 dark:bg-theme-blue-2 autofill:bg-theme-4 autofill:dark:bg-theme-blue-2`}/>
                            {
                                titleAlert
                                ? <div className="text-xs ml-4 mt-1.5 text-theme-red">제목을 입력해 주세요.</div>
                                : <></>
                            }
                            <label htmlFor="email" className="mt-5">이메일</label>
                            <input onChange={handleEmailChange} placeholder="이메일을 입력해 주세요." id="email" tabIndex={2} type="text" className={`w-full ${emailAlert || emailValid ? 'border-theme-red focus:border-theme-red' : 'border-theme-4 focus:border-theme-yellow dark:border-theme-blue-2 focus:dark:border-theme-blue-1' } text-xs mt-2 px-3.5 py-2 rounded-lg border-2 placeholder-theme-7 dark:placeholder-theme-6 bg-theme-4 dark:bg-theme-blue-2 autofill:bg-theme-4 autofill:dark:bg-theme-blue-2`}/>
                            {
                                emailAlert && !emailValid
                                ? <div className="text-xs ml-4 mt-1.5 text-theme-red">이메일을 입력해 주세요.</div>
                                : emailValid
                                    ? <div className="text-xs ml-4 mt-1.5 text-theme-red">올바른 형식의 이메일이 아닙니다.</div>
                                    : <></>
                            }
                            <label htmlFor="content" className="mt-5">내용</label>
                            <textarea onChange={handleContentChange} placeholder="내용은 최대한 자세하게 적어주세요." id="content" tabIndex={3} className={`custom-sm-scrollbar w-full h-[200px] resize-none ${contentAlert ? 'border-theme-red focus:border-theme-red' : 'border-theme-4 focus:border-theme-yellow dark:border-theme-blue-2 focus:dark:border-theme-blue-1' } text-xs mt-2 px-3.5 py-3 rounded-lg border-2 placeholder-theme-7 dark:placeholder-theme-6 bg-theme-4 dark:bg-theme-blue-2 autofill:bg-theme-4 autofill:dark:bg-theme-blue-2`}></textarea>
                            {
                                contentAlert
                                ? <div className="text-xs ml-4 mt-1.5 text-theme-red">내용을 입력해 주세요.</div>
                                : <></>
                            }
                            <div 
                                className={`${isDragging ? "border-theme-yellow dark:border-theme-blue-1 bg-theme-yellow/20 dark:bg-theme-blue-1/20 duration-100" : "border-theme-7 dark:border-theme-5 bg-transparent dark:bg-transparent duration-0"} w-full mt-4 p-6 rounded-lg flex flex-col justify-center items-center gap-x-2.5 border`}
                                onDragEnter={onDragEnter}
                                onDragLeave={onDragLeave}
                                onDragOver={onDragOver}
                                onDrop={onDrop}
                            >
                                <i className="text-3xl text-theme-9 dark:text-theme-7 fa-regular fa-image"></i>
                                <label htmlFor="file" className="text-sm mt-2 text-theme-yellow dark:text-theme-blue-1 font-medium hover:underline tlg:hover:no-underline cursor-pointer">파일 추가</label>
                                <input onChange={uploadImg} accept='image/*' id="file" type="file" multiple className="hidden"/>
                                <div className="text-xs mt-1 text-theme-9 dark:text-theme-7">또는 첨부할 파일을 드래그해서 추가할 수 있습니다.</div>
                                {
                                    imgs.length > 0
                                    ? <div className="w-full mt-5 p-3 border border-theme-7 dark:border-theme-5 rounded-lg flex justify-center gap-x-2.5">
                                        {
                                            imgs.map((img: any, index: number) => {
                                                return (
                                                    <div className="w-max relative" key={img.index}>
                                                        <div className="w-[72px] h-[88px]">
                                                            <Image src={img.src} alt="Preview image" fill sizes="100%" priority referrerPolicy="no-referrer" className="object-cover rounded-lg"/>
                                                        </div>
                                                        <button onClick={() => deleteImg(img.index, index)} className="w-6 h-6 rounded-full absolute -right-1.5 -top-1.5 flex justify-center items-center bg-theme-3 dark:bg-theme-blue-2">
                                                            <i className="text-sm text-theme-yellow dark:text-theme-blue-1 fa-solid fa-xmark"></i>
                                                        </button>
                                                    </div>
                                                )
                                            })
                                        }
                                    </div> : <></>
                                }
                            </div>
                            {
                                imgAlert
                                ? <div className='w-full h-10 px-3 mt-2.5 flex flex-row justify-between items-center rounded-md border-2 border-theme-red text-xs text-theme-9 bg-theme-red/20'>
                                    <div className='flex flex-row justify-start items-center'>
                                        <i className="text-sm text-theme-red fa-regular fa-bell"></i>
                                        <div className='ml-2'>파일은 최대 5개까지만 올릴 수 있습니다.</div>
                                    </div>
                                    <div onClick={imgAlertClose} className='flex flex-row justify-center items-center cursor-pointer'>
                                        <i className="text-sm text-theme-10 fa-solid fa-xmark"></i>
                                    </div>
                                </div>
                                : <></>
                            }
                            <div className='w-full flex justify-start items-center mt-3 text-xs text-theme-8 dark:text-theme-7'>
                                <i className="text-xs mr-2 text-theme-yellow dark:text-theme-blue-1 fa-regular fa-bell"></i>
                                <div>파일은 최대 다섯개까지만 올릴 수 있습니다.</div>
                            </div>
                            <div className='w-full flex justify-start items-center mt-1 text-xs text-theme-8 dark:text-theme-7'>
                                <i className="text-xs mr-2 text-theme-yellow dark:text-theme-blue-1 fa-regular fa-bell"></i>
                                <div>이미지 파일만 첨부 가능합니다.</div>
                            </div>
                        </div>
                        <button onClick={handleSubmit} className="w-full h-9 rounded-lg mt-5 font-medium text-sm text-theme-4 dark:text-theme-blue-2 bg-theme-yellow/80 hover:bg-theme-yellow dark:bg-theme-blue-1/80 hover:dark:bg-theme-blue-1 tlg:hover:dark:bg-theme-blue-1">
                            {
                                isLoading === true
                                ? <span className='loader loader-register w-4 h-4'></span>
                                : '제출하기'
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
        const session = await getServerSession(ctx.req, ctx.res, authOptions);

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
    catch (error) {
        console.log(error);
    }
}

export default IssueBug;