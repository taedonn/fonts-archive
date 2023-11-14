// react hooks
import { useState } from "react";

// next hooks
import { NextSeo } from "next-seo";

// hooks
import imageCompression from 'browser-image-compression';

// api
import { CheckIfSessionExists } from "@/pages/api/user/checkifsessionexists";
import { FetchUserInfo } from "@/pages/api/user/fetchuserinfo";
import axios, { AxiosProgressEvent } from "axios";

// components
import Header from "@/components/header";

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
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isIssued, setIsIssued] = useState<string>("");

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
            await axios.get('/api/issue/font', {
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
                        let promise = await axios.post('/api/issue/font', 
                            {
                                action: 'upload-img',
                                file_name: `issue-font-${issueId}-${i+1}.` + imgs[i].file.name.split('.').pop(),
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
                        // Prisma에 저장
                        await axios.post("/api/issue/font", 
                            {
                                action: "upload-to-prisma",
                                issue_id: issueId,
                                title: title.value,
                                email: email.value,
                                content: content.value,
                                img_length: imgs.length,
                                img_1: imgs[0] !== undefined ? `https://fonts-archive-issue-font.s3.ap-northeast-2.amazonaws.com/issue-font-${issueId}-1.` + imgs[0].file.name.split('.').pop() : "null",
                                img_2: imgs[1] !== undefined ? `https://fonts-archive-issue-font.s3.ap-northeast-2.amazonaws.com/issue-font-${issueId}-2.` + imgs[1].file.name.split('.').pop() : "null",
                                img_3: imgs[2] !== undefined ? `https://fonts-archive-issue-font.s3.ap-northeast-2.amazonaws.com/issue-font-${issueId}-3.` + imgs[2].file.name.split('.').pop() : "null",
                                img_4: imgs[3] !== undefined ? `https://fonts-archive-issue-font.s3.ap-northeast-2.amazonaws.com/issue-font-${issueId}-4.` + imgs[3].file.name.split('.').pop() : "null",
                                img_5: imgs[4] !== undefined ? `https://fonts-archive-issue-font.s3.ap-northeast-2.amazonaws.com/issue-font-${issueId}-5.` + imgs[4].file.name.split('.').pop() : "null",
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
                        .then(async () => {
                            // 이메일 발송
                            await axios.post("/api/issue/font", {
                                action: "send-email",
                                title: title.value,
                                email: email.value,
                                content: content.value,
                            })
                            .then(() => {
                                // 폼 초기화
                                uploadOnSuccess();
                                console.log("이메일 발송 성공");
                            })
                            .catch(() => console.log("이메일 발송 실패"));
                        })
                        .catch(() => {
                            console.log("Prisma에 저장 실패");
                            uploadOnFail();
                        });
                    })
                    .catch(() => {
                        console.log(`AWS에 이미지 업로드 실패`);
                        uploadOnFail();
                    });
                } else {
                    // 이미지 없으면 바로 Prisma에 저장
                    await axios.post("/api/issue/font", {
                        action: "upload-to-prisma",
                        issue_id: issueId,
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
                    .then(async () => {
                        // 이메일 발송
                        await axios.post("/api/issue/font", {
                            action: "send-email",
                            title: title.value,
                            email: email.value,
                            content: content.value,
                        })
                        .then(() => {
                            // 폼 초기화
                            uploadOnSuccess();
                            console.log("이메일 발송 성공");
                        })
                        .catch(() => console.log("이메일 발송 실패"));
                    })
                    .catch((err) => {
                        console.log("Prisma에 저장 실패");
                        console.log(err);
                        uploadOnFail();
                    });
                }
            })
            .catch(() => {
                console.log("폰트 제보 실패");
                uploadOnFail();
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

    // 이미지 URL을 저장할 state
    const [imgs, setImgs] = useState<any>([]);
    const [imgNo, setImgNo] = useState<number>(0);
    const [imgAlert, setImgAlert] = useState<boolean>(false);

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

    // Progress Bar
    const [progress, setProgress] = useState<number>(0);

    // 드래그 이벤트
    const [isDragging, setIsDragging] = useState<boolean>(false);

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
                title={"폰트 제보하기 · 폰트 아카이브"}
                description={"폰트 제보하기 - 상업용 무료 한글 폰트 저장소"}
            />

            {/* 헤더 */}
            <Header
                isMac={isMac}
                theme={params.theme}
                user={params.user}
                page={""}
                license={""}
                lang={""}
                type={""}
                sort={""}
                source={""}
                handleTextChange={emptyFn}
                handleLicenseOptionChange={emptyFn}
                handleLangOptionChange={emptyFn}
                handleTypeOptionChange={emptyFn}
                handleSortOptionChange={emptyFn}
                handleSearch={emptyFn}
            />

            {/* Progress Bar */}
            <div style={{width: `${progress}%`}} className="h-[4px] bg-theme-green fixed z-30 left-0 top-0 duration-300 ease-out"></div>

            {/* 메인 */}
            <div className='w-[100%] flex flex-col justify-center items-center'>
                <div className='max-w-[720px] w-[100%] flex flex-col justify-center items-start my-[100px] tlg:my-[40px]'>
                    <h2 className='text-[20px] tlg:text-[18px] text-theme-3 dark:text-theme-9 font-medium mb-[6px]'>폰트 제보하기</h2>
                    <h3 className='text-[13px] text-theme-5 dark:text-theme-7 mb-[12px]'>
                        폰트 관련 제보 사항(새 폰트, 라이센스 등)이 있으시면 제보해 주시면 감사하겠습니다.
                    </h3>
                    <div id="is-issued" className="w-[100%]">
                        {
                            isIssued === "success"
                            ? <>
                                <div className='w-[100%] h-[40px] px-[10px] mb-[10px] flex flex-row justify-between items-center rounded-[6px] border-[2px] border-theme-yellow dark:border-theme-blue-1/80 text-[12px] text-theme-3 dark:text-theme-9 bg-theme-yellow/40 dark:bg-theme-blue-1/20'>
                                    <div className='flex flex-row justify-start items-center'>
                                        <svg className='w-[14px] fill-theme-yellow dark:fill-theme-blue-1/80' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/><path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/></svg>
                                        <div className='ml-[6px]'>폰트를 제보해주셔서 감사합니다. 빠른 시일내에 답변 드리겠습니다.</div>
                                    </div>
                                    <div onClick={handleIssueClose} className='flex flex-row justify-center items-center cursor-pointer'>
                                        <svg className='w-[18px] fill-theme-3 dark:fill-theme-9' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/></svg>
                                    </div>
                                </div>
                            </>
                            : isIssued === "fail"
                                ? <>
                                    <div className='w-[100%] h-[40px] px-[10px] mb-[10px] flex flex-row justify-between items-center rounded-[6px] border-[2px] border-theme-red/80 text-[12px] text-theme-3 dark:text-theme-9 bg-theme-red/20'>
                                        <div className='flex flex-row justify-start items-center'>
                                            <svg className='w-[14px] fill-theme-red/80' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/><path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/></svg>
                                            <div className='ml-[6px]'>폰트 제보에 실패했습니다. 다시 시도해 주세요.</div>
                                        </div>
                                        <div onClick={handleIssueClose} className='flex flex-row justify-center items-center cursor-pointer'>
                                            <svg className='w-[18px] fill-theme-3 dark:fill-theme-9' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/></svg>
                                        </div>
                                    </div>
                                </> : <></>
                        }
                    </div>
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
                            <textarea onChange={handleContentChange} placeholder="내용은 최대한 자세하게 적어주세요." id="content" tabIndex={3} className={`font-edit-textarea w-[100%] h-[200px] resize-none ${contentAlert ? 'border-theme-red focus:border-theme-red' : 'border-theme-4 focus:border-theme-yellow dark:border-theme-blue-2 focus:dark:border-theme-blue-1' } text-[12px] mt-[8px] px-[14px] py-[12px] rounded-[8px] border-[2px] placeholder-theme-7 dark:placeholder-theme-6 bg-theme-4 dark:bg-theme-blue-2 autofill:bg-theme-4 autofill:dark:bg-theme-blue-2`}></textarea>
                            {
                                contentAlert
                                ? <div className="text-[10px] ml-[16px] mt-[6px] text-theme-red">내용을 입력해 주세요.</div>
                                : <></>
                            }
                            <div 
                                className={`${isDragging ? "border-theme-yellow dark:border-theme-blue-1 bg-theme-yellow/20 dark:bg-theme-blue-1/20 duration-100" : "border-theme-7 dark:border-theme-5 bg-transparent dark:bg-transparent duration-0"} w-[100%] mt-[16px] p-[24px] rounded-[8px] flex flex-col justify-center items-center gap-x-[10px] border`}
                                onDragEnter={onDragEnter}
                                onDragLeave={onDragLeave}
                                onDragOver={onDragOver}
                                onDrop={onDrop}
                            >
                                <svg className="w-[28px] fill-theme-9 dark:fill-theme-7" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M6.502 7a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z"/><path d="M14 14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h5.5L14 4.5V14zM4 1a1 1 0 0 0-1 1v10l2.224-2.224a.5.5 0 0 1 .61-.075L8 11l2.157-3.02a.5.5 0 0 1 .76-.063L13 10V4.5h-2A1.5 1.5 0 0 1 9.5 3V1H4z"/></svg>
                                <label htmlFor="file" className="text-[14px] mt-[12px] text-theme-yellow dark:text-theme-blue-1 font-medium hover:underline tlg:hover:no-underline cursor-pointer">파일 추가</label>
                                <input onChange={uploadImg} accept='image/*' id="file" type="file" multiple className="hidden"/>
                                <div className="text-[12px] mt-[4px] text-theme-9 dark:text-theme-7">또는 첨부할 파일을 드래그해서 추가할 수 있습니다.</div>
                                {
                                    imgs.length > 0
                                    ? <div className="w-[100%] mt-[20px] p-[12px] border border-theme-7 dark:border-theme-5 rounded-[8px] flex justify-center gap-x-[10px]">
                                        {
                                            imgs.map((img: any, index: number) => {
                                                return (
                                                    <div className="w-content relative" key={img.index}>
                                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                                        <img src={img.src} alt="preview-img" className="w-[72px] h-[88px] rounded-[8px] object-cover"/> 
                                                        <button onClick={() => deleteImg(img.index, index)} className="w-[24px] h-[24px] rounded-full absolute right-[-6px] top-[-6px] flex items-center bg-theme-3 dark:bg-theme-blue-2">
                                                            <svg className="w-[12px] mx-auto fill-theme-yellow dark:fill-theme-blue-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/></svg>
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
                                ? <div className='w-[100%] h-[40px] px-[10px] mt-[10px] flex flex-row justify-between items-center rounded-[6px] border-[2px] border-theme-red text-[12px] text-theme-9 bg-theme-red/20'>
                                    <div className='flex flex-row justify-start items-center'>
                                        <svg className='w-[14px] fill-theme-red' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/><path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/></svg>
                                        <div className='ml-[6px]'>파일은 최대 5개까지만 올릴 수 있습니다.</div>
                                    </div>
                                    <div onClick={imgAlertClose} className='flex flex-row justify-center items-center cursor-pointer'>
                                        <svg className='w-[18px] fill-theme-9' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/></svg>
                                    </div>
                                </div>
                                : <></>
                            }
                            <div className='w-[100%] flex justify-start items-center mt-[12px] text-[12px] text-theme-8 dark:text-theme-7'>
                                <svg className='w-[12px] mr-[6px] fill-theme-yellow dark:fill-theme-blue-1' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/><path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/></svg>
                                <div>파일은 최대 다섯개까지만 올릴 수 있습니다.</div>
                            </div>
                            <div className='w-[100%] flex justify-start items-center mt-[4px] text-[12px] text-theme-8 dark:text-theme-7'>
                                <svg className='w-[12px] mr-[6px] fill-theme-yellow dark:fill-theme-blue-1' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/><path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/></svg>
                                <div>이미지 파일만 첨부 가능합니다.</div>
                            </div>
                        </div>
                        <button onClick={handleSubmit} className="w-[100%] h-[34px] rounded-[8px] mt-[20px] font-medium text-[12px] text-theme-4 dark:text-theme-3 bg-theme-yellow/80 hover:bg-theme-yellow dark:bg-theme-blue-1/80 hover:dark:bg-theme-blue-1 tlg:hover:dark:bg-theme-blue-1">
                            {
                                isLoading === true
                                ? <span className='loader loader-register w-[16px] h-[16px]'></span>
                                : '제출하기'
                            }
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
                    user: JSON.parse(JSON.stringify(user)),
                }
            }
        }
    }
    catch (error) {
        console.log(error);
    }
}

export default IssueFont;