// react
import { useState } from "react";

// next
import Image from "next/image";

// next-auth
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]";

// libraries
import { NextSeo } from "next-seo";
import imageCompression from 'browser-image-compression';

// components
import Motion from "@/components/motion";
import Header from "@/components/header";
import Footer from "@/components/footer";
import Button from "@/components/button";
import TextInput from "@/components/textinput";
import TextArea from "@/components/textarea";
import SelectBox from "@/components/selectbox";

const IssueFont = ({params}: any) => {
    const { theme, userAgent, user } = params;

    // 디바이스 체크
    const isMac: boolean = userAgent.includes("Mac OS") ? true : false

    // states
    const [titleAlert, setTitleAlert] = useState<string>("");
    const [emailAlert, setEmailAlert] = useState<string>("");
    const [contentAlert, setContentAlert] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isIssued, setIsIssued] = useState<string>("");
    const [imgs, setImgs] = useState<any>([]);
    const [imgNo, setImgNo] = useState<number>(0);
    const [imgAlert, setImgAlert] = useState<boolean>(false);
    const [progress, setProgress] = useState<number>(0);
    const [isDragging, setIsDragging] = useState<boolean>(false);
    const [option, setOption] = useState<string>("font");

    // onChange
    const handleTitleChange = () => { setTitleAlert(""); }
    const handleEmailChange = () => { setEmailAlert(""); }
    const handleContentChange = () => { setContentAlert(""); }
    const handleOptionChange = (e: React.ChangeEvent<HTMLInputElement>) => { setOption(e.target.value); console.log(option); }

    // submit
    const handleSubmit = async () => {
        // 변수
        const title = document.getElementById("title") as HTMLInputElement;
        const email = document.getElementById("email") as HTMLInputElement;
        const content = document.getElementById("content") as HTMLTextAreaElement;

        // 이메일 유효성 검사
        const emailPattern = /^[A-Za-z0-9_.-]+@[A-Za-z0-9-]+\.[A-Za-z0-9-]+/;

        if (title.value === "") {
            setTitleAlert("empty");
            window.scrollTo({top: title.offsetTop});
        } else if (email.value === "") {
            setEmailAlert("empty");
            window.scrollTo({top: email.offsetTop});
        } else if (email.value !== "" && !emailPattern.test(email.value)) {
            setEmailAlert("invalid");
            window.scrollTo({top: email.offsetTop});
        } else if (content.value === "") {
            setContentAlert("empty");
            window.scrollTo({top: content.offsetTop});
        } else {
            setIsLoading(true);

            // ID 가져오기
            const getIssueIdUrl = "/api/issue?";
            const getIssueIdOptions = {
                method: "GET",
                headers: { "Content-Type": "application/json" }
            }
            const getIssueIdParams = {
                action: "get-issue-id"
            }
            const getIssueIdQuery = new URLSearchParams(getIssueIdParams).toString();

            await fetch(getIssueIdUrl + getIssueIdQuery, getIssueIdOptions)
            .then(res => res.json())
            .then(async (data) => {
                // 변수
                let issueId = data.issue.issue_id + 1;

                if (imgs.length !== 0) {
                    let promises = [];
                    let percentage = 0;
                    let totalSize = 0;
                    for (let i = 0; i < imgs.length; i++) {
                        totalSize += Number(imgs[i].file.size);
                    }
                    
                    // 이미지 여러개 업로드
                    let uploadImgUrl, uploadImgOptions, promise, putImgOptions, uploaded;
                    for (let i = 0; i < imgs.length; i++) {
                        uploadImgUrl = "/api/issue";
                        uploadImgOptions = {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                                action: 'upload-img',
                                file_name: `issue-${issueId}-${i+1}.` + imgs[i].file.name.split('.').pop(),
                                file_type: imgs[i].file.type
                            })
                        }

                        promise = await fetch(uploadImgUrl, uploadImgOptions)
                        .then(res => res.json())
                        .then(async (data) => {
                            putImgOptions = {
                                method: "PUT",
                                headers: { 'Content-Type': imgs[i].file.type },
                                body: imgs[i].file,
                            }
                            uploaded = await fetch(data.url, putImgOptions);
                            if (uploaded.status === 200) console.log("File uploaded to AWS S3 successfully");
                            else console.log("Failed to upload files to AWS S3");
                        })
                        .then(() => {
                            percentage = percentage + Number(Math.round(imgs[i].file.size) / totalSize * 90);
                            setProgress(percentage);
                        })
                        .catch(err => console.log(err));

                        promises.push(promise);
                    }

                    await Promise.all(promises)
                    .then(async () => {
                        // Prisma에 저장
                        let uploadIssueUrl = "/api/issue";
                        let uploadIssueOptions = {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                                action: "upload-issue",
                                title: title.value,
                                email: email.value,
                                content: content.value,
                                type: option,
                                img_length: imgs.length,
                                img_1: imgs[0] !== undefined ? `https://fonts-archive-issue.s3.ap-northeast-2.amazonaws.com/issue-${issueId}-1.` + imgs[0].file.name.split('.').pop() : "null",
                                img_2: imgs[1] !== undefined ? `https://fonts-archive-issue.s3.ap-northeast-2.amazonaws.com/issue-${issueId}-2.` + imgs[1].file.name.split('.').pop() : "null",
                                img_3: imgs[2] !== undefined ? `https://fonts-archive-issue.s3.ap-northeast-2.amazonaws.com/issue-${issueId}-3.` + imgs[2].file.name.split('.').pop() : "null",
                                img_4: imgs[3] !== undefined ? `https://fonts-archive-issue.s3.ap-northeast-2.amazonaws.com/issue-${issueId}-4.` + imgs[3].file.name.split('.').pop() : "null",
                                img_5: imgs[4] !== undefined ? `https://fonts-archive-issue.s3.ap-northeast-2.amazonaws.com/issue-${issueId}-5.` + imgs[4].file.name.split('.').pop() : "null",
                                issue_closed_type: "Open",
                            })
                        }

                        await fetch(uploadIssueUrl, uploadIssueOptions)
                        .then(() => setProgress(100))
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
                        console.log("AWS에 이미지 업로드 실패");
                    });
                } else {
                    // 이미지 없으면 바로 Prisma에 저장
                    const uploadIssueUrl = "/api/issue";
                    const uploadIssueOptions = {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            action: "upload-issue",
                            title: title.value,
                            email: email.value,
                            content: content.value,
                            type: option,
                            img_length: imgs.length,
                            img_1: "null",
                            img_2: "null",
                            img_3: "null",
                            img_4: "null",
                            img_5: "null",
                            issue_closed_type: "Open"
                        })
                    }

                    await fetch(uploadIssueUrl, uploadIssueOptions)
                    .then(() => {
                        // 폼 초기화
                        uploadOnSuccess();
                        console.log("이메일 발송 및 DB 저장 성공");
                    })
                    .catch(() => {
                        uploadOnFail();
                        console.log("이메일 발송 및 DB 저장 실패");
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
                title={"문의하기 · 폰트 아카이브"}
                description={"문의하기 - 폰트 아카이브 · 상업용 무료 한글 폰트 저장소"}
            />

            {/* 헤더 */}
            <Header
                isMac={isMac}
                theme={theme}
                user={user}
                page="issue"
            />

            {/* Progress Bar */}
            <div style={{width: `${progress}%`}} className="h-[0.188rem] bg-h-1 dark:bg-f-8 fixed z-30 left-0 top-0 duration-300 ease-out"></div>

            {/* 메인 */}
            <Motion
                initialOpacity={0}
                animateOpacity={1}
                exitOpacity={0}
                initialY={-50}
                animateY={0}
                exitY={-50}
                transitionType="spring"
            >
                <div className='w-full px-4 flex flex-col justify-center items-center'>
                    <div className='max-w-[45rem] w-full flex flex-col justify-center items-start my-16 lg:my-24 mt-8 lg:mt-16'>
                        <h2 className='text-2xl mb-4 font-bold text-l-2 dark:text-white'>문의하기</h2>
                        <h3 className='tlg:text-sm text-l-5 dark:text-d-c mb-3'>
                            제보 사항(버그, 새 폰트)이나 문의 사항 있으시면 연락 부탁드립니다.
                        </h3>
                        <div id="is-issued" className="w-full">
                            {
                                isIssued === "success"
                                ? <>
                                    <div className='w-full h-10 px-2.5 mb-3 flex justify-between items-center rounded-lg border-2 border-h-1 dark:border-f-8 text-xs text-l-2 dark:text-white bg-h-1/20 dark:bg-f-8/20'>
                                        <div className='flex justify-start items-center'>
                                            <i className="text-sm text-h-1 dark:text-f-8 fa-regular fa-bell"></i>
                                            <div className='ml-2'>문의해주셔서 감사합니다. 빠른 시일내에 답변 드리겠습니다.</div>
                                        </div>
                                        <div onClick={handleIssueClose} className='flex justify-center items-center cursor-pointer'>
                                            <i className="text-sm text-l-2 dark:text-white fa-solid fa-xmark"></i>
                                        </div>
                                    </div>
                                </>
                                : isIssued === "fail"
                                    ? <>
                                        <div className='w-full h-10 px-2.5 mb-3 flex justify-between items-center rounded-lg border-2 border-h-r text-xs text-l-2 dark:text-white bg-h-r/20'>
                                            <div className='flex flex-row justify-start items-center'>
                                                <i className="text-sm text-h-r fa-regular fa-bell"></i>
                                                <div className='ml-2'>문의를 전송하는데 실패했습니다. 잠시 후 다시 시도해 주세요.</div>
                                            </div>
                                            <div onClick={handleIssueClose} className='flex justify-center items-center cursor-pointer'>
                                                <i className="text-sm text-l-2 dark:text-white fa-solid fa-xmark"></i>
                                            </div>
                                        </div>
                                    </> : <></>
                            }
                        </div>
                        <div className='w-full p-5 rounded-lg text-l-2 dark:text-white bg-l-e dark:bg-d-3 drop-shadow-default dark:drop-shadow-dark'>
                            <div className="flex flex-col">
                                <SelectBox
                                    title="문의 유형"
                                    icon="bi-send"
                                    value="issue"
                                    select={option}
                                    options={[
                                        { value: "font", name: "폰트 관련 제보" },
                                        { value: "bug", name: "버그 관련 제보" },
                                        { value: "etc", name: "기타 문의 사항" },
                                    ]}
                                    optionChange={handleOptionChange}
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
                                    placeholder="제목을 입력해 주세요."
                                    label="제목"
                                    marginTop={2}
                                />
                                <TextInput
                                    onchange={handleEmailChange}
                                    state={emailAlert}
                                    stateMsg={[
                                        { state: "", msg: "" },
                                        { state: "empty", msg: "이메일을 입력해 주세요." },
                                        { state: "invalid", msg: "올바른 형식의 이메일이 아닙니다." },
                                    ]}
                                    id="email"
                                    tabindex={2}
                                    placeholder="빠른 시일내에 답변 드릴게요."
                                    label="이메일"
                                    marginTop={2}
                                />
                                <TextArea
                                    onchange={handleContentChange}
                                    state={contentAlert}
                                    stateMsg={[
                                        { state: "", msg: "" },
                                        { state: "empty", msg: "내용을 입력해 주세요." },
                                    ]}
                                    id="content"
                                    tabindex={3}
                                    placeholder="내용은 최대한 자세하게 적어주세요."
                                    label="내용"
                                    marginTop={2}
                                />
                                <div 
                                    className={`${isDragging ? "border-h-1 dark:border-f-8 bg-h-1/20 dark:bg-f-8/20 duration-100" : "border-l-b dark:border-d-6 bg-transparent dark:bg-transparent duration-0"} w-full mt-4 p-6 rounded-lg flex flex-col justify-center items-center gap-x-2.5 border`}
                                    onDragEnter={onDragEnter}
                                    onDragLeave={onDragLeave}
                                    onDragOver={onDragOver}
                                    onDrop={onDrop}
                                >
                                    <i className="text-3xl text-l-5 dark:text-d-c bi bi-image"></i>
                                    <label htmlFor="file" className="mt-2 text-sm text-h-1 dark:text-f-8 font-medium hover:underline tlg:hover:no-underline cursor-pointer">파일 첨부</label>
                                    <input onChange={uploadImg} accept='image/*' id="file" type="file" multiple className="hidden"/>
                                    <div className="mt-1.5 text-sm text-l-5 dark:text-d-c">또는 첨부 파일 드래그</div>
                                    {
                                        imgs.length > 0
                                        ? <div className="w-full mt-5 p-3 border border-l-b dark:border-d-6 rounded-lg flex flex-wrap justify-center gap-2">
                                            {
                                                imgs.map((img: any, index: number) => {
                                                    return (
                                                        <div className="w-max relative" key={img.index}>
                                                            <div className="w-24 h-28 relative">
                                                                <Image src={img.src} alt='Preview image' fill sizes="100%" priority referrerPolicy="no-referrer" className="object-cover rounded-lg"/>
                                                            </div>
                                                            <button onClick={() => deleteImg(img.index, index)} className="w-5 h-5 rounded-full absolute right-1.5 top-1.5 flex justify-center items-center bg-h-1 dark:bg-f-8 hover:bg-h-0 hover:dark:bg-f-9 tlg:hover:bg-h-1 tlg:hover:dark:bg-f-8">
                                                                <i className="text-sm text-white dark:text-d-2 fa-solid fa-xmark"></i>
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
                                    ? <div className='w-full h-10 px-2.5 mt-3 flex justify-between items-center rounded-lg border-2 border-h-r text-xs text-l-2 dark:text-white bg-h-r/20'>
                                        <div className='flex flex-row justify-start items-center'>
                                            <i className="text-sm text-h-r fa-regular fa-bell"></i>
                                            <div className='ml-2'>파일은 최대 5개까지만 올릴 수 있습니다.</div>
                                        </div>
                                        <div onClick={imgAlertClose} className='flex justify-center items-center cursor-pointer'>
                                            <i className="text-sm text-l-2 dark:text-white fa-solid fa-xmark"></i>
                                        </div>
                                    </div>
                                    : <></>
                                }
                                <div className='w-full flex justify-start items-center mt-3 text-xs text-l-5 dark:text-d-c'>
                                    <i className="text-xs mr-2 text-h-1 dark:text-f-8 fa-regular fa-bell"></i>
                                    <div>파일은 최대 다섯개까지만 올릴 수 있습니다.</div>
                                </div>
                                <div className='w-full flex justify-start items-center mt-1 text-xs text-l-5 dark:text-d-c'>
                                    <i className="text-xs mr-2 text-h-1 dark:text-f-8 fa-regular fa-bell"></i>
                                    <div>이미지 파일만 첨부 가능합니다.</div>
                                </div>
                            </div>
                            <Button marginTop={1.25}>
                                <button onClick={handleSubmit} className="w-full h-full">
                                    {
                                        isLoading === true
                                        ? <span className='loader border-2 border-h-e dark:border-d-6 border-b-h-1 dark:border-b-f-8 w-4 h-4'></span>
                                        : '제출하기'
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

export default IssueFont;