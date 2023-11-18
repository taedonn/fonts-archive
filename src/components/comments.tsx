/* eslint-disable @next/next/no-img-element */
// react hooks
import { useRef, useState, useEffect } from "react";

// next hooks
import Script from "next/script";

// api
import axios from "axios";

// components
import DeleteCommentModal from "@/components/deletecommentmodal";
import ReportCommentModal from "@/components/reportcommentmodal";

export default function Comments (
    {
        font,
        user,
        report,
        comment,
        likedInput,
        likedNum
    } : 
    {
        font: any,
        user: any,
        report: any,
        comment: any,
        likedInput: boolean,
        likedNum: number
    }
) {
    // 댓글 state
    const [comments, setComments] = useState(comment);
    const [commentFocus, setCommentFocus] = useState<boolean>(false);
    const [commentBtn, setCommentBtn] = useState<boolean>(false);
    const [deleteModalDisplay, setDeleteModalDisplay] = useState<boolean>(false);
    const [reportModalDisplay, setReportModalDisplay] = useState<boolean>(false);
    const [commentId, setCommentId] = useState<number>(0);
    const [reports, setReports] = useState(report);

    /** MUI TextArea 줄바꿈 시 높이 변경 */
    const handleHeightChange = (e: any) => {
        e.target.style.height = 0;
        e.target.style.height = (e.target.scrollHeight)+"px";
    }

    // 댓글 ref
    const commentRef = useRef<HTMLTextAreaElement>(null);
    const commentBtnRef = useRef<HTMLButtonElement>(null);

    /** 댓글 포커스 시 */
    const commentOnFocus = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setCommentFocus(true);
        if (e.target.value !== '') { setCommentBtn(true); }
        else { setCommentBtn(false); }
    }

    /** 댓글 포커스 아웃 시 */
    const commentOnBlur = () => { setCommentFocus(false); }

    /** 댓글 적었을 때 댓글 버튼 활성화 */
    const commentOnChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
            // 댓글 value값 판단
            if (e.target.value !== '') { setCommentBtn(true); }
            else { setCommentBtn(false); }
    }

    /** 댓글 취소 버튼 눌렀을 때 댓글 지우고 포커스 아웃 (click 이벤트는 적용이 안돼서 mousedown으로 대체) */
    const commentCancelBtnOnMouseDown: any = () => {
        if (commentRef.current) {
            commentRef.current.blur();
            commentRef.current.value = '';
            handleHeightChangeOnClick();
        }
    }

    /** 댓글 취소 버튼 눌렀을 때 TextArea 높이 변경 */
    const handleHeightChangeOnClick = () => {
        if (commentRef.current) {
            commentRef.current.style.height = "0";
            commentRef.current.style.height = (commentRef.current.scrollHeight)+"px";
        }
    }

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

    /** 새 댓글 쓰기 */
    const newComment = async (e: React.MouseEvent<HTMLButtonElement>) => {
        if (commentRef.current && e.currentTarget.classList.contains('comment-enabled')) {
            await axios.post('/api/post/comments', {
                action: 'new-comment',
                font_id: font.code,
                user_id: user.user_no,
                comment: commentRef.current.value,
            })
            .then(async (res) => {
                console.log(res.data.message);
                setComments(res.data.comments);
            })
            .catch(err => console.log(err));

            // 댓글 지우기
            commentCancelBtnOnMouseDown();
        }
    }

    /** 댓글 삭제 모달창 열기 */
    const deleteCommentModalOpen = (e: React.MouseEvent<HTMLButtonElement>) => {
        setDeleteModalDisplay(true);
        setCommentId(getIntFromString(e.currentTarget.id));
    }

    /** 댓글 삭제 모달창 닫기 */
    const deleteCommentModalClose = () => {
        setDeleteModalDisplay(false);
    }

    /** 댓글 삭제 시 댓글 업데이트 */
    const updateComments = (comments: any) => {
        setComments(comments);
    }

    /** 신고 업데이트 */
    const updateReports = (reports: any) => {
        setReports(reports);
    }

    /** 문자열에서 숫자 추출 */
    const getIntFromString = (string: string) => {
        const regex = /[^0-9]/g;
        const result = string.replace(regex, '');
        return parseInt(result);
    }

    /** 댓글 수정하기 버튼 클릭 */
    const editComment = (e: React.ChangeEvent<HTMLInputElement>) => {
        // 댓글 수정 보임/숨김
        commentEditShow(e);
    }

    /** 댓글 수정 포커스 시 */
    const commentEditOnFocus = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        handleHeightChange(e);
    }

    const commentEditOnChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        // 아이디 추출
        const id = getIntFromString(e.target.id);
        const button = document.getElementById('comment-edit-btn-' + id) as HTMLButtonElement;

        // Textarea 높이 변경
        handleHeightChange(e);

        // 버튼 활성화/비활성화
        if (e.target.value === '') {
            button.classList.add('edit-btn-disabled');
            button.classList.remove('edit-btn-enabled');
        } else {
            button.classList.add('edit-btn-enabled');
            button.classList.remove('edit-btn-disabled');
        }
    }

    /** 댓글 수정 취소 버튼 클릭 시 */
    const commentEditCancelBtnOnClick = (e: any) => {
        // 아이디 추출
        const id = getIntFromString(e.target.id);
        const edit = document.getElementById('comment-edit-' + id) as HTMLInputElement;
        
        // 수정 체크 해제
        edit.checked = false;

        // 댓글 수정 보임/숨김
        commentEditShow(e);
    }

    /** 댓글 수정 보임/숨김 */
    const commentEditShow = (e: any) => {
        // 아이디 추출
        const id = getIntFromString(e.target.id);
        const comment = document.getElementById('comment-' + id) as HTMLDivElement;
        const commentWrap = document.getElementById('comment-btn-wrap-' + id) as HTMLDivElement;
        const editor = document.getElementById('comment-editor-' + id) as HTMLDivElement;
        const editBtn = document.getElementById('comment-edit-btn-' + id) as HTMLButtonElement;
        
        // 보임/숨김 처리
        if (e.target.checked) {
            comment.style.display = 'none';
            commentWrap.style.visibility = 'hidden';
            editor.style.display = 'block';
            editor.getElementsByTagName('textarea')[0].value = comment.getElementsByTagName('pre')[0].innerHTML;
            editor.getElementsByTagName('textarea')[0].focus();
            editBtn.classList.add('edit-btn-enabled');
            editBtn.classList.remove('edit-btn-disabled');
        } else {
            comment.style.display = 'block';
            commentWrap.style.visibility = 'visible';
            editor.style.display = 'none';
        }
    }

    /** 댓글 수정 API 실행 */
    const editCommentAPIInit = async (e: any) => {
        if(e.target.classList.contains('edit-btn-enabled')) {
            // 아이디 추출
            const id = getIntFromString(e.target.id);
            const textarea = document.getElementById('comment-edit-textarea-' + id) as HTMLTextAreaElement;
            const input = document.getElementById('comment-edit-' + id) as HTMLInputElement;

            await axios.post('/api/post/comments', {
                action: 'edit-comment',
                font_id: font.code,
                comment_id: id,
                comment: textarea.value
            })
            .then(async (res) => {
                // 업데이트된 댓글 가져오기
                console.log(res.data.message);
                setComments(res.data.comments);

                // 댓글 수정 보임/숨김
                commentEditShow(e);

                // 텍스트에리어 초기화
                textarea.value='';

                // 댓글 수정 Input 체크 해제
                input.checked = false;
            })
            .catch(err => console.log(err));
        }
    }

    /** 답글 보임/숨김 */
    const commentReplyShow = (e: any) => {
        // 아이디 추출
        const id = getIntFromString(e.target.id);
        const reply = document.getElementById('comment-reply-content-' + id) as HTMLDivElement;
        const replyTextArea = document.getElementById('comment-reply-textarea-' + id) as HTMLTextAreaElement;
        
        // 보임/숨김 처리
        if (e.target.checked) {
            reply.style.display = 'block';
            replyTextArea.focus();
        } else {
            reply.style.display = 'none';
        }
    }

    const commentReplyOnChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        // 아이디 추출
        const id = getIntFromString(e.target.id);
        const button = document.getElementById('comment-reply-btn-' + id) as HTMLButtonElement;

        // Textarea 높이 변경
        handleHeightChange(e);

        // 버튼 활성화/비활성화
        if (button) {
            if (e.target.value === '') {
                button.classList.add('edit-btn-disabled');
                button.classList.remove('edit-btn-enabled');
            } else {
                button.classList.add('edit-btn-enabled');
                button.classList.remove('edit-btn-disabled');
            }
        }
    }

    /** 답글 취소 버튼 클릭 시 */
    const commentReplyCancelBtnOnClick = (e: any) => {
        // 아이디 추출
        const id = getIntFromString(e.target.id);
        const replyBtn = document.getElementById('comment-reply-' + id) as HTMLInputElement;
        const reply = document.getElementById('comment-reply-textarea-' + id) as HTMLTextAreaElement;
        
        // 수정 체크 해제
        replyBtn.checked = false;

        // 답글 지우기
        reply.value = '';

        // 답글 보임/숨김
        commentReplyShow(e);
    }

    /** 댓글 수정 API 실행 */
    const replyCommentAPIInit = async (e: any) => {
        if(e.target.classList.contains('edit-btn-enabled')) {
            // 아이디 추출
            const id = getIntFromString(e.target.id);
            const textarea = document.getElementById('comment-reply-textarea-' + id) as HTMLTextAreaElement;
            const input = document.getElementById('comment-reply-' + id) as HTMLInputElement;

            await axios.post('/api/post/comments', {
                action: 'reply-comment',
                font_id: font.code,
                user_id: user.user_no,
                comment_id: id,
                comment: textarea.value
            })
            .then(async (res) => {
                // 업데이트된 댓글 가져오기
                console.log(res.data.message);
                setComments(res.data.comments);

                // 댓글 수정 보임/숨김
                commentReplyShow(e);

                // 텍스트에리어 초기화
                textarea.value = '';

                // 댓글 수정 Input 체크 해제
                input.checked = false;
            })
            .catch(err => console.log(err));
        }
    }

    /** 댓글 신고 모달창 열기 */
    const reportCommentModalOpen = (e: React.MouseEvent<HTMLButtonElement>) => {
        setReportModalDisplay(true);
        setCommentId(getIntFromString(e.currentTarget.id));
    }

    /** 댓글 신고 모달창 닫기 */
    const reportCommentModalClose = () => {
        setReportModalDisplay(false);
    }

    // 공유 state
    const [shareExpand, setShareExpand] = useState<boolean>(false);

    // 공유 ref
    const shareExpandBtn = useRef<HTMLLabelElement>(null);
    const shareExpandContent = useRef<HTMLDivElement>(null);

    // 공유 버튼 클릭
    const handleShareExpand = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) { setShareExpand(true); }
        else { setShareExpand(false); }
    }

    // 공유 버튼 외 영역 클릭
    useEffect(() => {
        function handleOutside(e:Event) {
            const input = document.getElementById("share-expand") as HTMLInputElement;
            if (shareExpandBtn.current && !shareExpandBtn.current.contains(e.target as Node) && shareExpandContent.current && !shareExpandContent.current.contains(e.target as Node)) {
                setShareExpand(false);
                input.checked = false;
            }
        }
        document.addEventListener("mouseup", handleOutside);
        return () => document.removeEventListener("mouseup", handleOutside);
    }, [shareExpandBtn, shareExpandContent]);

    /** URL 복사 */
    const copyUrl = () => {
        const input = document.getElementById("url") as HTMLInputElement;
        const copyBtn = document.getElementsByClassName("url_copy_btn")[0] as HTMLDivElement;
        const copyChkBtn = document.getElementsByClassName("url_copy_chk_btn")[0] as SVGSVGElement;

        window.navigator.clipboard.writeText(input.value);

        copyBtn.style.display = 'none';
        copyChkBtn.style.display = 'block';
        setTimeout(function() {
            copyBtn.style.display = 'block';
            copyChkBtn.style.display = 'none';
        }, 1000);
    }

    // 카카오톡 공유
    const shareKakao = async () => {
        // 카카오 API 로드
        if (!Kakao.isInitialized()) Kakao.init(process.env.NEXT_PUBLIC_KAKAO_JAVASCRIPT_KEY as string);

        // 카카오톡 공유
        await Kakao.Share.sendDefault({
            objectType: 'text',
            text: '기본 템플릿으로 제공되는 텍스트 템플릿은 텍스트를 최대 200자까지 표시할 수 있습니다. 텍스트 템플릿은 텍스트 영역과 하나의 기본 버튼을 가집니다. 임의의 버튼을 설정할 수도 있습니다. 여러 장의 이미지, 프로필 정보 등 보다 확장된 형태의 카카오톡 공유는 다른 템플릿을 이용해 보낼 수 있습니다.',
            link: {
                mobileWebUrl: 'https://fonts.taedonn.com',
                webUrl: 'https://fonts.taedonn.com',
            },
        });
    }

    return (
        <>

            <Script
                src="https://t1.kakaocdn.net/kakao_js_sdk/2.5.0/kakao.min.js"
                crossOrigin="anonymous"
            />

            {/* 댓글 삭제 모달 */}
            <DeleteCommentModal
                display={deleteModalDisplay}
                close={deleteCommentModalClose}
                font_id={font.code}
                comment_id={commentId}
                update={updateComments}
            />

            {/* 댓글 신고 모달 */}
            <ReportCommentModal
                display={reportModalDisplay}
                close={reportCommentModalClose}
                font_id={font.code}
                user={user}
                comment_id={commentId}
                update={updateComments}
                update_reports={updateReports}
            />

            <div className='w-content mb-[12px] flex gap-[8px]'>
                <label htmlFor={font.code.toString()} className='cursor-pointer'>
                    {
                        !likedInput
                        ? <div className="w-[52px] h-[32px] flex justify-center items-center rounded-[6px] bg-theme-8 hover:bg-theme-7/80 tlg:hover:bg-theme-8 dark:bg-theme-4/60 hover:dark:bg-theme-4 tlg:dark:hover:bg-theme-4/60">
                            <svg className='w-[12px] fill-theme-4 dark:fill-theme-9 mb-px' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M47.6 300.4L228.3 469.1c7.5 7 17.4 10.9 27.7 10.9s20.2-3.9 27.7-10.9L464.4 300.4c30.4-28.3 47.6-68 47.6-109.5v-5.8c0-69.9-50.5-129.5-119.4-141C347 36.5 300.6 51.4 268 84L256 96 244 84c-32.6-32.6-79-47.5-124.6-39.9C50.5 55.6 0 115.2 0 185.1v5.8c0 41.5 17.2 81.2 47.6 109.5z"/></svg>
                            <div className="ml-[6px] text-[13px] font-medium leading-none text-theme-4 dark:text-theme-9">{likedNum}</div>
                        </div>
                        : <div className="w-[52px] h-[32px] flex justify-center items-center rounded-[6px] bg-theme-red">
                            <svg className='w-[12px] fill-theme-3 mb-px' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M47.6 300.4L228.3 469.1c7.5 7 17.4 10.9 27.7 10.9s20.2-3.9 27.7-10.9L464.4 300.4c30.4-28.3 47.6-68 47.6-109.5v-5.8c0-69.9-50.5-129.5-119.4-141C347 36.5 300.6 51.4 268 84L256 96 244 84c-32.6-32.6-79-47.5-124.6-39.9C50.5 55.6 0 115.2 0 185.1v5.8c0 41.5 17.2 81.2 47.6 109.5z"/></svg>
                            <div className="ml-[6px] text-[13px] font-medium leading-none text-theme-3">{likedNum}</div>
                        </div>
                    }
                </label>
                <div className="relative">
                    <input onChange={handleShareExpand} type="checkbox" id="share-expand" className="hidden"/>
                    <label ref={shareExpandBtn} htmlFor="share-expand" className="w-content h-[32px] px-[12px] text-[13px] font-medium flex justify-center items-center cursor-pointer rounded-[6px] selection:bg-transparent text-theme-4 dark:text-theme-9 bg-theme-8 hover:bg-theme-7/80 tlg:hover:bg-theme-8 dark:bg-theme-4/60 hover:dark:bg-theme-4 tlg:dark:hover:bg-theme-4/60">
                        <svg className="w-[12px] mr-[8px] fill-theme-4 dark:fill-theme-9" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M352 224c53 0 96-43 96-96s-43-96-96-96s-96 43-96 96c0 4 .2 8 .7 11.9l-94.1 47C145.4 170.2 121.9 160 96 160c-53 0-96 43-96 96s43 96 96 96c25.9 0 49.4-10.2 66.6-26.9l94.1 47c-.5 3.9-.7 7.8-.7 11.9c0 53 43 96 96 96s96-43 96-96s-43-96-96-96c-25.9 0-49.4 10.2-66.6 26.9l-94.1-47c.5-3.9 .7-7.8 .7-11.9s-.2-8-.7-11.9l94.1-47C302.6 213.8 326.1 224 352 224z"/></svg>
                        공유
                    </label>
                    {
                        shareExpand &&
                        <div ref={shareExpandContent} className="w-content px-[20px] py-[16px] rounded-[8px] absolute left-0 top-[-8px] translate-y-[-100%] bg-theme-8 dark:bg-theme-3">
                            <div className="rounded-[8px] border-[2px] flex items-center overflow-hidden border-theme-yellow dark:border-theme-blue-1 bg-theme-yellow dark:bg-theme-blue-1">
                                <input type="text" id="url" defaultValue={`https://fonts.taedonn.com/post/${font.font_family.replaceAll(" ", "+")}`} className="w-[100%] text-[12px] px-[12px] py-[8px] rounded-r-[8px] text-theme-9 dark:text-theme-8 placeholder-theme-7 dark:placeholder-theme-6 bg-theme-3 dark:bg-theme-blue-2 autofill:bg-theme-3 autofill:dark:bg-theme-blue-2"/>
                                <label onClick={copyUrl} htmlFor="url" className="w-[44px] h-[34px] text-[13px] shrink-0 flex justify-center items-center cursor-pointer font-medium text-theme-3 dark:text-theme-blue-2">
                                    <div className="url_copy_btn selection:bg-transparent">복사</div>
                                    <svg className="url_copy_chk_btn w-[32px] tmd:w-[28px] p-[8px] rounded-[6px] hidden fill-theme-3 dark:fill-theme-blue-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/></svg>
                                </label>
                            </div>
                            <div className="w-[100%] h-px bg-theme-5 mt-[10px] mb-[16px]"></div>
                            <div className="gap-[16px] flex justify-center items-center">
                                {/* <button className="group text-[11px] flex flex-col justify-center items-center">
                                    <div className="w-[32px] h-[32px] rounded-full flex justify-center items-center bg-theme-10 drop-shadow-default dark:drop-shadow-dark">
                                        <svg className="w-[16px] fill-theme-4 dark:fill-theme-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><path d="M392.8 1.2c-17-4.9-34.7 5-39.6 22l-128 448c-4.9 17 5 34.7 22 39.6s34.7-5 39.6-22l128-448c4.9-17-5-34.7-22-39.6zm80.6 120.1c-12.5 12.5-12.5 32.8 0 45.3L562.7 256l-89.4 89.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l112-112c12.5-12.5 12.5-32.8 0-45.3l-112-112c-12.5-12.5-32.8-12.5-45.3 0zm-306.7 0c-12.5-12.5-32.8-12.5-45.3 0l-112 112c-12.5 12.5-12.5 32.8 0 45.3l112 112c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L77.3 256l89.4-89.4c12.5-12.5 12.5-32.8 0-45.3z"/></svg>
                                    </div>
                                    <div className="w-[42px] mt-[10px] text-center text-theme-5 group-hover:text-theme-3 tlg:group-hover:text-theme-5 dark:text-theme-7 group-hover:dark:text-theme-9 tlg:group-hover:dark:text-theme7">URL</div>
                                </button> */}
                                <button onClick={shareKakao} id="share-kakao" className="group text-[11px] flex flex-col justify-center items-center">
                                    <div className="w-[32px] h-[32px] rounded-full overflow-hidden flex justify-center items-center bg-theme-kakao drop-shadow-default dark:drop-shadow-dark">
                                        <img src="/logo-kakaotalk.svg" alt="카카오톡 로고" className="w-[24px]"/>
                                    </div>
                                    <div className="w-[42px] mt-[10px] text-center text-theme-5 group-hover:text-theme-3 tlg:group-hover:text-theme-5 dark:text-theme-7 group-hover:dark:text-theme-9 tlg:group-hover:dark:text-theme7">카카오톡</div>
                                </button>
                                <button className="group text-[11px] flex flex-col justify-center items-center">
                                    <div className="w-[32px] h-[32px] rounded-full overflow-hidden flex justify-center items-center bg-theme-naver drop-shadow-default dark:drop-shadow-dark">
                                        <img src="/logo-line.svg" alt="라인 로고" className="w-[26px]"/>
                                    </div>
                                    <div className="w-[42px] mt-[10px] text-center text-theme-5 group-hover:text-theme-3 tlg:group-hover:text-theme-5 dark:text-theme-7 group-hover:dark:text-theme-9 tlg:group-hover:dark:text-theme7">라인</div>
                                </button>
                                <button className="group text-[11px] flex flex-col justify-center items-center">
                                    <div className="w-[32px] h-[32px] rounded-full overflow-hidden flex justify-center items-center drop-shadow-default dark:drop-shadow-dark">
                                        <img src="/logo-facebook.png" alt="페이스북 로고" className="w-[100%]"/>
                                    </div>
                                    <div className="w-[42px] mt-[10px] text-center text-theme-5 group-hover:text-theme-3 tlg:group-hover:text-theme-5 dark:text-theme-7 group-hover:dark:text-theme-9 tlg:group-hover:dark:text-theme7">페이스북</div>
                                </button>
                                <button className="group text-[11px] flex flex-col justify-center items-center">
                                    <div className="w-[32px] h-[32px] rounded-full overflow-hidden flex justify-center items-center bg-theme-1 drop-shadow-default dark:drop-shadow-dark">
                                        <img src="/logo-x.svg" alt="엑스(트위터) 로고" className="w-[16px]"/>
                                    </div>
                                    <div className="w-[42px] mt-[10px] text-center text-theme-5 group-hover:text-theme-3 tlg:group-hover:text-theme-5 dark:text-theme-7 group-hover:dark:text-theme-9 tlg:group-hover:dark:text-theme7">엑스</div>
                                </button>
                            </div>
                        </div>
                    }
                </div>
            </div>
            <div className="w-[100%] h-px bg-theme-7 dark:bg-theme-5 mb-[20px]"></div>
            <h2 className="text-[16px] tlg:text-[14px] text-theme-3 dark:text-theme-9 font-medium mb-[16px] tlg:mb-[12px]">댓글 {comments.length}개</h2>
            <div className="w-[100%] mb-[38px] tlg:mb-[34px]">
                <div className="w-[100%] flex">
                    {
                        user === null
                        ? <>
                            <svg className="w-[36px] tlg:w-[32px] h-[36px] tlg:h-[32px] fill-theme-4/80 dark:fill-theme-9/80" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/><path fillRule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"/></svg>
                            <div className="w-[100%] mt-[4px] ml-[16px] tlg:ml-[14px]">
                                <div className="text-[14px] text-theme-5 dark:text-theme-6">로그인 후 댓글 이용 가능합니다...</div>
                                <div className="w-[100%] h-px mt-[4px] bg-theme-7 dark:bg-theme-5"></div>
                            </div>
                        </>
                        : <>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img className="w-[40px] tlg:w-[32px] h-[40px] tlg:h-[32px] object-cover rounded-full" src={user.profile_img} width={28} height={28} alt="유저 프로필 사진"/>
                            <div className="w-[100%] flex flex-col mt-[6px] ml-[16px] tlg:ml-[14px]">
                                <div className={`relative w-[100%] flex items-center pb-[4px] border-b ${commentFocus ? 'border-theme-5 dark:border-theme-7' : 'border-theme-7 dark:border-theme-5'}`}>
                                    <textarea ref={commentRef} onChange={commentOnChange} onInput={handleHeightChange} onFocus={commentOnFocus} onBlur={commentOnBlur} placeholder="댓글 달기..." className="w-[100%] h-[21px] resize-none text-[14px] tlg:text-[12px] tracking-wide text-theme-5 dark:text-theme-8 placeholder-theme-5 dark:placeholder-theme-6 leading-normal bg-transparent"/>
                                </div>
                                {
                                    commentFocus
                                    ? <div className="flex w-[100%] text-[14px] tlg:text-[12px] text-theme-3 dark:text-theme-9 mt-[12px]">
                                        <button ref={commentBtnRef} onMouseDown={newComment} className={`${commentBtn ? 'comment-enabled text-theme-4 dark:text-theme-blue-2 bg-theme-yellow/80 tlg:bg-theme-yellow hover:bg-theme-yellow dark:bg-theme-blue-1 hover:dark:bg-theme-blue-1/90 tlg:hover:dark:bg-theme-blue-1 cursor-pointer' : 'comment-disabled text-theme-6 bg-theme-8 dark:text-theme-5 dark:bg-theme-3 cursor-default'} w-[56px] tlg:w-[48px] h-[32px] tlg:h-[28px] pb-px rounded-full`}>댓글</button>
                                        <button onMouseDown={commentCancelBtnOnMouseDown} className="w-[56px] tlg:w-[48px] h-[32px] tlg:h-[28px] ml-[8px] rounded-full hover:bg-theme-8 hover:dark:bg-theme-4 tlg:hover:bg-transparent tlg:hover:dark:bg-transparent pb-px">취소</button>
                                    </div> : <></>
                                }
                            </div>
                        </>
                    } 
                </div>
            </div>
            <div className="w-[100%] min-h-[120px] mb-[180px] pl-[40px] tlg:pl-0">
                {
                    comments.length === 0
                    ? <div className="w-[100%] text-[14px] text-center text-theme-3 dark:text-theme-8">아직 댓글이 없습니다.</div>
                    : <>
                        {
                            comments.map((comment: any) => {
                                return (
                                    <div key={comment.comment_id} className='w-[100%] text-theme-3 dark:text-theme-10 animate-fontbox-fade-in'>
                                        {/* 앵커 포인트 */}
                                        <div id={`c${comment.comment_id}`} className="translate-y-[-80px] tlg:translate-y-[72px]"></div>
                                        
                                        <div className='flex items-start mt-[20px] tlg:mt-[16px]'>
                                            {
                                                comment.depth === 1
                                                ? <svg className="w-[20px] fill-theme-3 dark:fill-theme-9 rotate-180 mt-[10px] mx-[14px]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
                                                    <path d="M5.921 11.9 1.353 8.62a.719.719 0 0 1 0-1.238L5.921 4.1A.716.716 0 0 1 7 4.719V6c1.5 0 6 0 7 8-2.5-4.5-7-4-7-4v1.281c0 .56-.606.898-1.079.62z"/>
                                                </svg> : <></>
                                            }
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img src={comment.profile_img} alt="유저 프로필 이미지" className="w-[40px] tlg:w-[32px] h-[40px] tlg:h-[32px] object-cover rounded-full"/>
                                            <div className="w-[100%] ml-[16px] tlg:ml-[14px]">
                                                <div className="flex items-end">
                                                    <div className="text-[15px] tlg:text-[14px] font-medium">{comment.user_name}</div>
                                                    {
                                                        comment.user_no === 1
                                                        ? <div className="text-[10px] leading-none px-[6px] pt-[4px] pb-[3px] ml-[6px] mb-[2px] border rounded-full border-theme-blue-1 text-theme-blue-1">Manager</div>
                                                        : <div className="text-[10px] leading-none px-[6px] pt-[4px] pb-[3px] ml-[6px] mb-[2px] border rounded-full border-theme-green text-theme-green">User</div>
                                                    }
                                                    <div className="text-[13px] tlg:text-[11px] ml-[10px] text-theme-6">{commentsDateFormat(comment.created_at)}</div>
                                                    {
                                                        user
                                                        ? comment.user_no !== user.user_no && !comment.is_deleted_with_reply
                                                            ? !reports.includes(comment.comment_id)
                                                                ? <>
                                                                    <button id={`report-comment-${comment.comment_id}`} onClick={reportCommentModalOpen} className="group flex items-center ml-[12px] mb-[3px] cursor-pointer">
                                                                        <svg className="w-[10px] mb-px fill-theme-4 group-hover:fill-theme-yellow tlg:group-hover:fill-theme-4 dark:fill-theme-9 group-hover:dark:fill-theme-blue-1 tlg:group-hover:dark:fill-theme-9" viewBox="0 0 18 21" xmlns="http://www.w3.org/2000/svg"><path d="M17.7002 14.4906C17.147 13.5344 16.4814 11.7156 16.4814 8.5V7.83438C16.4814 3.68125 13.1533 0.278125 9.05642 0.25H9.00017C8.01649 0.25123 7.04268 0.4462 6.13435 0.823776C5.22601 1.20135 4.40094 1.75414 3.70624 2.45058C3.01154 3.14702 2.46082 3.97347 2.08552 4.88275C1.71022 5.79202 1.51769 6.76632 1.51892 7.75V8.5C1.51892 11.7156 0.853295 13.5344 0.30017 14.4906C0.166399 14.7185 0.0951976 14.9777 0.0937718 15.2419C0.0923461 15.5061 0.160747 15.7661 0.292051 15.9954C0.423355 16.2247 0.612903 16.4152 0.841513 16.5477C1.07012 16.6803 1.32968 16.75 1.59392 16.75H5.25017C5.25017 17.7446 5.64526 18.6984 6.34852 19.4016C7.05178 20.1049 8.00561 20.5 9.00017 20.5C9.99473 20.5 10.9486 20.1049 11.6518 19.4016C12.3551 18.6984 12.7502 17.7446 12.7502 16.75H16.4064C16.6706 16.7517 16.9305 16.6831 17.1595 16.5513C17.3884 16.4196 17.5783 16.2293 17.7095 16C17.8397 15.7694 17.9073 15.5088 17.9056 15.2441C17.904 14.9793 17.8332 14.7196 17.7002 14.4906ZM9.00017 19C8.40419 18.9975 7.83333 18.7597 7.41191 18.3383C6.99048 17.9168 6.75264 17.346 6.75017 16.75H11.2502C11.2477 17.346 11.0099 17.9168 10.5884 18.3383C10.167 18.7597 9.59615 18.9975 9.00017 19ZM1.59392 15.25C2.2408 14.125 3.01892 12.0531 3.01892 8.5V7.75C3.01645 6.96295 3.16934 6.18316 3.46882 5.45532C3.7683 4.72747 4.20849 4.06589 4.76414 3.50849C5.3198 2.95109 5.98 2.50884 6.70691 2.20708C7.43381 1.90533 8.21312 1.75 9.00017 1.75H9.04705C12.3189 1.76875 14.9814 4.50625 14.9814 7.83438V8.5C14.9814 12.0531 15.7595 14.125 16.4064 15.25H1.59392Z"/></svg>
                                                                        <div className="text-[12px] leading-none text-theme-4 group-hover:text-theme-yellow tlg:group-hover:text-theme-4 dark:text-theme-9 group-hover:dark:text-theme-blue-1 tlg:group-hover:dark:text-theme-9 ml-[4px] tlg:mt-px">신고</div>
                                                                    </button>
                                                                </>
                                                                : <div className="ml-[10px] text-[12px] text-theme-4 dark:text-theme-8">댓글이 신고되었습니다.</div>
                                                            : comment.user_no === user.user_no && !comment.is_deleted_with_reply
                                                                ? <div id={`comment-btn-wrap-${comment.comment_id}`} className="flex items-start mb-[2px] tlg:mb-0">
                                                                    <input onChange={editComment} type="checkbox" id={`comment-edit-${comment.comment_id}`} className="hidden"/>
                                                                    <label htmlFor={`comment-edit-${comment.comment_id}`} className="group flex items-center ml-[12px] mb-[2px] tlg:mb-px cursor-pointer">
                                                                        <svg className="w-[11px] mb-px fill-theme-4 group-hover:fill-theme-yellow tlg:group-hover:fill-theme-4 dark:fill-theme-9 group-hover:dark:fill-theme-blue-1 tlg:group-hover:dark:fill-theme-9" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"/></svg>
                                                                        <div className="text-[12px] leading-none text-theme-4 group-hover:text-theme-yellow tlg:group-hover:text-theme-4 dark:text-theme-9 group-hover:dark:text-theme-blue-1 tlg:group-hover:dark:text-theme-9 ml-[3px]">수정</div>
                                                                    </label>
                                                                    <div className="w-px h-[11px] mx-[6px] bg-theme-6"></div>
                                                                    <button id={`delete-comment-${comment.comment_id}`} onClick={deleteCommentModalOpen} className="group flex">
                                                                        <svg className="w-[12px] mb-px fill-theme-4 group-hover:fill-theme-yellow tlg:group-hover:fill-theme-4 dark:fill-theme-9 group-hover:dark:fill-theme-blue-1 tlg:group-hover:dark:fill-theme-9" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6Z"/><path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1ZM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118ZM2.5 3h11V2h-11v1Z"/></svg>
                                                                        <div className="text-[12px] leading-none text-theme-4 group-hover:text-theme-yellow tlg:group-hover:text-theme-4 dark:text-theme-9 group-hover:dark:text-theme-blue-1 tlg:group-hover:dark:text-theme-9 ml-[3px] tlg:mt-px">삭제</div>
                                                                    </button>
                                                                </div>
                                                                : <></>
                                                        : <></>
                                                    }
                                                </div>
                                                <div id={`comment-${comment.comment_id}`} className="mt-[8px]">
                                                    {
                                                        comment.is_deleted_with_reply
                                                        ? <div className="text-[14px] tlg:text-[12px] text-theme-6">[삭제된 댓글입니다]</div>
                                                            : comment.is_deleted_by_reports
                                                                ? <div className="text-[14px] tlg:text-[12px] text-theme-6">[신고로 삭제된 댓글입니다]</div>
                                                                : <pre style={{fontFamily: "Spoqa Han Sans Neo"}} className="text-[14px] tlg:text-[12px] text-theme-4 dark:text-theme-9">{comment.comment}</pre>
                                                    }
                                                    <input onChange={commentReplyShow} id={`comment-reply-${comment.comment_id}`} type="checkbox" className="hidden peer"/>
                                                    <label htmlFor={`comment-reply-${comment.comment_id}`} className={`${user ? 'block' : 'hidden'} peer-checked:hidden text-[14px] tlg:text-[12px] mt-[12px] tlg:mt-[8px] text-theme-3 dark:text-theme-blue-1 hover:underline tlg:underline hover:dark:text-theme-blue-1 cursor-pointer`}>답글</label>
                                                </div>
                                                {/* 댓글 수정 */}
                                                <div id={`comment-editor-${comment.comment_id}`} className="hidden mt-[8px]">
                                                    <div className="w-[100%] items-center px-[14px] pt-[10px] pb-[4px] rounded-[8px] bg-theme-8 dark:bg-theme-3">
                                                        <textarea id={`comment-edit-textarea-${comment.comment_id}`} onChange={commentEditOnChange} onInput={handleHeightChange} onFocus={commentEditOnFocus} placeholder="댓글 수정하기..." defaultValue={comment.comment} className="w-[100%] h-[21px] resize-none text-[14px] tlg:text-[12px] tracking-wide text-theme-4 dark:text-theme-9 placeholder-theme-5 dark:placeholder-theme-6 leading-normal bg-transparent"/>
                                                    </div>
                                                    <div className="flex text-[14px] mt-[12px]">
                                                        <button onClick={editCommentAPIInit} id={`comment-edit-btn-${comment.comment_id}`} className="w-[56px] tlg:w-[48px] h-[32px] tlg:h-[28px] pb-px rounded-full">수정</button>
                                                        <button onClick={commentEditCancelBtnOnClick} id={`comment-edit-cancel-${comment.comment_id}`} className="w-[56px] tlg:w-[48px] h-[32px] tlg:h-[28px] pb-px rounded-full text-theme-3 dark:text-theme-9 hover:bg-theme-8 hover:dark:bg-theme-4 tlg:hover:dark:bg-transparent ml-[6px]">취소</button>
                                                    </div>
                                                </div>
                                                {/* 답글 */}
                                                {
                                                    user
                                                    ? <div id={`comment-reply-content-${comment.comment_id}`} className="hidden mt-[20px]">
                                                        <div className="w-[100%] flex">
                                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                                            <img src={user.profile_img} alt="유저 프로필 이미지" className="w-[40px] tlg:w-[32px] h-[40px] tlg:h-[32px] object-cover rounded-full"/>
                                                            <div className="w-[100%] ml-[16px] tlg:ml-[14px]">
                                                                <div className="relative w-[100%] flex items-center pb-[4px] border-b border-theme-5 dark:border-theme-7">
                                                                    <textarea onInput={handleHeightChange} onChange={commentReplyOnChange} onFocus={commentReplyOnChange} id={`comment-reply-textarea-${comment.comment_id}`} placeholder="답글 달기..." className="w-[100%] h-[21px] resize-none text-[14px] tlg:text-[12px] tracking-wide mt-[6px] text-theme-5 dark:text-theme-8 placeholder-theme-5 dark:placeholder-theme-6 leading-normal bg-transparent"/>
                                                                </div>
                                                                <div className="flex text-[14px] mt-[12px]">
                                                                    <button onClick={replyCommentAPIInit} id={`comment-reply-btn-${comment.comment_id}`} className="edit-btn-disabled w-[56px] tlg:w-[48px] h-[32px] tlg:h-[28px] pb-px rounded-full">답글</button>
                                                                    <button onClick={commentReplyCancelBtnOnClick} id={`comment-reply-cancel-${comment.comment_id}`} className="w-[56px] tlg:w-[48px] h-[32px] tlg:h-[28px] pb-px rounded-full text-theme-3 dark:text-theme-9 hover:bg-theme-8 hover:dark:bg-theme-4 tlg:hover:dark:bg-transparent ml-[6px]">취소</button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    : <></>
                                                }
                                            </div>
                                        </div>
                                        <div className="w-[100%] h-px mt-[20px] tlg:mt-[16px] bg-theme-7 dark:bg-theme-5"></div>
                                    </div>
                                )
                            })
                        }
                    </>
                }
            </div>
        </>
    )
}