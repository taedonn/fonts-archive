// react
import { useRef, useState, useEffect } from "react";

// next
import Script from "next/script";
import Image from "next/image";

// libraries
import axios from "axios";

// components
import DeleteCommentModal from "@/components/deletecommentmodal";
import ReportCommentModal from "@/components/reportcommentmodal";

declare global {
    interface Window {
        Kakao: any;
    }
}

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
    // states
    const [comments, setComments] = useState(comment);
    const [commentFocus, setCommentFocus] = useState<boolean>(false);
    const [commentBtn, setCommentBtn] = useState<boolean>(false);
    const [deleteModalDisplay, setDeleteModalDisplay] = useState<boolean>(false);
    const [reportModalDisplay, setReportModalDisplay] = useState<boolean>(false);
    const [commentId, setCommentId] = useState<number>(0);
    const [reports, setReports] = useState(report);
    const [shareExpand, setShareExpand] = useState<boolean>(false);

    // refs
    const commentRef = useRef<HTMLTextAreaElement>(null);
    const commentBtnRef = useRef<HTMLButtonElement>(null);
    const shareExpandBtn = useRef<HTMLLabelElement>(null);
    const shareExpandContent = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setComments(comment);
        setReports(report);
    }, [comment, report]);

    /** MUI TextArea 줄바꿈 시 높이 변경 */
    const handleHeightChange = (e: any) => {
        e.target.style.height = 0;
        e.target.style.height = (e.target.scrollHeight)+"px";
    }

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
                font_name: font.name,
                font_family: font.font_family,
                user_id: user.id,
                user_name: user.name,
                user_email: user.email,
                user_auth: user.provider,
                user_image: user.image,
                comment: commentRef.current.value,
            })
            .then(async (res) => {
                console.log(res.data.msg);
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
                console.log(res.data.msg);
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
                font_name: font.name,
                font_family: font.font_family,
                user_id: user.id,
                user_name: user.name,
                user_email: user.email,
                user_auth: user.provider,
                user_image: user.image,
                comment_id: id,
                comment: textarea.value
            })
            .then(async (res) => {
                // 업데이트된 댓글 가져오기
                console.log(res.data.msg);
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

    // 공유할 url
    const url = "https://fonts.taedonn.com/post/" + font.font_family.replaceAll(" ", "+");
    const urlEncoded = "https://fonts.taedonn.com/post/" + font.font_family.replaceAll(" ", "%2B");

    /** 카카오톡 공유 */
    const shareKakao = async () => {
        const { Kakao } = window;
        
        // 카카오 API 로드
        if (!Kakao.isInitialized()) Kakao.init(process.env.NEXT_PUBLIC_KAKAO_JAVASCRIPT_KEY as string);

        // API 실행
        await Kakao.Share.sendDefault({
            objectType: 'feed',
            content: {
                title: font.name + " · 폰트 아카이브",
                description: "상업용 무료 한글 폰트 저장소",
                imageUrl: `https://fonts-archive-meta-image.s3.ap-northeast-2.amazonaws.com/${font.font_family.replaceAll(" ", "")}.png`,
                link: {
                    mobileWebUrl: url,
                    webUrl: url,
                },
            },
            social: {
                likeCount: likedNum,
                commentCount: comment.length,
            },
            buttons: [
                {
                    title: '웹으로 이동',
                    link: {
                        mobileWebUrl: url,
                        webUrl: url,
                    },
                },
            ],
        });
    }

    /** 라인 공유 */
    const shareLine = () => {
        window.open(`https://social-plugins.line.me/lineit/share?url=${decodeURI(urlEncoded)}`, 'line', 'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,width=520,height=700');
    }

    /** 페이스북 공유 */
    const shareFacebook = () => {
        window.open(`https://facebook.com/sharer.php?u=${url}`, "facebook", "menubar=no,toolbar=no,resizable=yes,scrollbars=yes,width=520,height=700");
    }

    /** 트위터 공유 */
    const shareTwitter = () => {
        const text = font.name + " · 폰트 아카이브";
        window.open(`https://twitter.com/intent/tweet?text=${text}&url=${decodeURI(urlEncoded)}`, "x", "menubar=no,toolbar=no,resizable=yes,scrollbars=yes,width=520,height=700");
    }

    /** 배열 숨김 처리 */
    const hideUserName = (name: string) => {
        let arr = name.slice(1, name.length);
        let newName = name.slice(0, 1);
        for (let i = 0; i < arr.length; i++) newName += "*";
        return newName;
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

            <div className='w-max mb-3 flex gap-2'>
                <label htmlFor={font.code.toString()} className='cursor-pointer'>
                    {
                        !likedInput
                        ? <div className="w-14 h-8 flex justify-center items-center rounded-md text-theme-3 dark:text-theme-10 bg-theme-8 hover:bg-theme-7 tlg:hover:bg-theme-8 dark:bg-theme-3 hover:dark:bg-theme-4 tlg:dark:hover:bg-theme-3">
                            <i className="text-sm fa-regular fa-heart"></i>
                            <div className="ml-1.5 text-[13px] font-medium leading-none">{likedNum}</div>
                        </div>
                        : <div className="w-14 h-8 flex justify-center items-center rounded-md bg-theme-red">
                            <i className="text-sm fa-solid fa-heart"></i>
                            <div className="ml-1.5 text-[13px] font-medium leading-none">{likedNum}</div>
                        </div>
                    }
                </label>
                <div className="relative">
                    <input onChange={handleShareExpand} type="checkbox" id="share-expand" className="peer hidden"/>
                    <label ref={shareExpandBtn} htmlFor="share-expand" className="w-max h-8 px-3 text-[13px] font-medium flex justify-center items-center cursor-pointer rounded-md selection:bg-transparent text-theme-3 dark:text-theme-10 bg-theme-8 hover:bg-theme-7 tlg:hover:bg-theme-8 peer-checked:bg-theme-7 dark:bg-theme-3 hover:dark:bg-theme-4 tlg:hover:dark:bg-theme-3 peer-checked:dark:bg-theme-4">
                        <i className="text-sm mr-2 fa-solid fa-share-nodes"></i>
                        공유
                    </label>
                    {
                        shareExpand &&
                        <div ref={shareExpandContent} className="w-max px-5 py-4 rounded-lg absolute left-0 -top-2 -translate-y-full bg-theme-8 dark:bg-theme-3">
                            <div className="w-full rounded-lg border-2 flex items-center overflow-hidden border-theme-yellow dark:border-theme-blue-1 bg-theme-yellow dark:bg-theme-blue-1">
                                <input type="text" id="url" defaultValue={`https://fonts.taedonn.com/post/${font.font_family.replaceAll(" ", "+")}`} className="w-full text-xs px-3 py-2 rounded-r-lg text-theme-9 dark:text-theme-8 placeholder-theme-6 bg-theme-3 dark:bg-theme-blue-2 autofill:bg-theme-3 autofill:dark:bg-theme-blue-2"/>
                                <label onClick={copyUrl} htmlFor="url" className="w-[44px] h-[34px] text-[13px] shrink-0 flex justify-center items-center cursor-pointer font-medium text-theme-3 dark:text-theme-blue-2">
                                    <div className="url_copy_btn selection:bg-transparent">복사</div>
                                    <i className="url_copy_chk_btn text-sm hidden fa-solid fa-check"></i>
                                </label>
                            </div>
                            <div className="w-full h-px bg-theme-5 mt-2.5 mb-4"></div>
                            <div className="gap-4 flex justify-center items-center">
                                <button onClick={shareKakao} id="share-kakao" className="group text-[11px] flex flex-col justify-center items-center">
                                    <div className="w-8 h-8 rounded-full overflow-hidden flex justify-center items-center bg-theme-kakao drop-shadow-default dark:drop-shadow-dark">
                                        <div className="w-6 h-6 relative">
                                            <Image src="/logo-kakaotalk.svg" alt="카카오톡 로고" fill sizes="100%" referrerPolicy="no-referrer"/>
                                        </div>
                                    </div>
                                    <div className="w-[42px] mt-2.5 text-center text-theme-5 group-hover:text-theme-3 tlg:group-hover:text-theme-5 dark:text-theme-7 group-hover:dark:text-theme-9 tlg:group-hover:dark:text-theme7">카카오톡</div>
                                </button>
                                <button onClick={shareLine} className="group text-[11px] flex flex-col justify-center items-center">
                                    <div className="w-8 h-8 rounded-full overflow-hidden flex justify-center items-center bg-theme-naver drop-shadow-default dark:drop-shadow-dark">
                                        <div className="w-7 h-7 relative">
                                            <Image src="/logo-line.svg" alt="라인 로고" fill sizes="100%" referrerPolicy="no-referrer"/>
                                        </div>
                                    </div>
                                    <div className="w-[42px] mt-2.5 text-center text-theme-5 group-hover:text-theme-3 tlg:group-hover:text-theme-5 dark:text-theme-7 group-hover:dark:text-theme-9 tlg:group-hover:dark:text-theme7">라인</div>
                                </button>
                                <button onClick={shareFacebook} className="group text-[11px] flex flex-col justify-center items-center">
                                    <div className="w-8 h-8 relative rounded-full overflow-hidden flex justify-center items-center drop-shadow-default dark:drop-shadow-dark">
                                        <Image src="/logo-facebook.png" alt="페이스북 로고" fill sizes="100%" referrerPolicy="no-referrer"/>
                                    </div>
                                    <div className="w-[42px] mt-2.5 text-center text-theme-5 group-hover:text-theme-3 tlg:group-hover:text-theme-5 dark:text-theme-7 group-hover:dark:text-theme-9 tlg:group-hover:dark:text-theme7">페이스북</div>
                                </button>
                                <button onClick={shareTwitter} className="group text-[11px] flex flex-col justify-center items-center">
                                    <div className="w-8 h-8 rounded-full overflow-hidden flex justify-center items-center bg-theme-1 drop-shadow-default dark:drop-shadow-dark">
                                        <div className="w-4 h-4 relative">
                                            <Image src="/logo-x.svg" alt="엑스(트위터) 로고" fill sizes="100%" referrerPolicy="no-referrer"/>
                                        </div>
                                    </div>
                                    <div className="w-[42px] mt-2.5 text-center text-theme-5 group-hover:text-theme-3 tlg:group-hover:text-theme-5 dark:text-theme-7 group-hover:dark:text-theme-9 tlg:group-hover:dark:text-theme7">엑스</div>
                                </button>
                            </div>
                        </div>
                    }
                </div>
            </div>
            <div className="w-full h-px bg-theme-7 dark:bg-theme-5 mb-5"></div>
            <h2 className="text-base tlg:text-sm text-theme-3 dark:text-theme-9 font-medium mb-4 tlg:mb-3">댓글 {comments === null ? 0 : comments.length}개</h2>
            <div className="w-full mb-[38px] tlg:mb-[34px]">
                <div className="w-full flex">
                    {
                        user === null
                        ? <>
                            <i className="text-4xl text-theme-5 dark:text-theme-8 fa-regular fa-face-smile"></i>
                            <div className="w-full mt-1 ml-4 tlg:ml-3.5">
                                <div className="text-sm text-theme-5 dark:text-theme-7">로그인 후 댓글 이용 가능합니다...</div>
                                <div className="w-full h-px mt-1 bg-theme-7 dark:bg-theme-5"></div>
                            </div>
                        </>
                        : <>
                            <div className="w-10 tlg:w-8 h-10 tlg:h-8 relative object-cover rounded-full overflow-hidden">
                                <Image src={user.image} alt="유저 프로필 사진" fill sizes="100%" referrerPolicy="no-referrer"/>
                            </div>
                            <div className="w-full flex flex-col mt-1.5 ml-4 tlg:ml-3.5">
                                <div className={`relative w-full flex items-center pb-1 border-b ${commentFocus ? 'border-theme-5 dark:border-theme-7' : 'border-theme-7 dark:border-theme-5'}`}>
                                    <textarea ref={commentRef} onChange={commentOnChange} onInput={handleHeightChange} onFocus={commentOnFocus} onBlur={commentOnBlur} placeholder="댓글 달기..." className="w-full h-[21px] resize-none text-sm tlg:text-xs tracking-wide text-theme-3 dark:text-theme-10 placeholder-theme-5 dark:placeholder-theme-8 leading-normal bg-transparent"/>
                                </div>
                                {
                                    commentFocus
                                    ? <div className="flex w-full text-sm tlg:text-xs text-theme-3 dark:text-theme-9 mt-3">
                                        <button ref={commentBtnRef} onMouseDown={newComment} className={`${commentBtn ? 'comment-enabled text-theme-4 dark:text-theme-blue-2 bg-theme-yellow/80 tlg:bg-theme-yellow hover:bg-theme-yellow dark:bg-theme-blue-1 hover:dark:bg-theme-blue-1/90 tlg:hover:dark:bg-theme-blue-1 cursor-pointer' : 'comment-disabled text-theme-6 bg-theme-8 dark:text-theme-5 dark:bg-theme-3 cursor-default'} w-14 tlg:w-12 h-8 tlg:h-7 pb-px rounded-full`}>댓글</button>
                                        <button onMouseDown={commentCancelBtnOnMouseDown} className="w-14 tlg:w-12 h-8 tlg:h-7 ml-2 rounded-full hover:bg-theme-8 hover:dark:bg-theme-4 tlg:hover:bg-transparent tlg:hover:dark:bg-transparent pb-px">취소</button>
                                    </div> : <></>
                                }
                            </div>
                        </>
                    } 
                </div>
            </div>
            <div className="w-full min-h-[120px] mb-[180px] pl-10 tlg:pl-0">
                {
                    comments === null || comments.length === 0
                    ? <div className="w-full text-sm text-center text-theme-3 dark:text-theme-8">아직 댓글이 없습니다.</div>
                    : <>
                        {
                            comments.map((comment: any) => {
                                return (
                                    <div key={comment.comment_id} className='w-full text-theme-3 dark:text-theme-10 animate-fade-in-fontbox'>
                                        {/* 앵커 포인트 */}
                                        <div id={`c${comment.comment_id}`} className="-translate-y-20 tlg:translate-y-[72px]"></div>
                                        
                                        <div className='flex items-start mt-5 tlg:mt-4'>
                                            {
                                                comment.depth === 1
                                                && <i className="text-base text-theme-5 dark:text-theme-8 rotate-180 mt-2.5 mx-3.5 fa-solid fa-reply"></i>
                                            }
                                            <div className="w-10 tlg:w-8 h-10 tlg:h-8 relative object-cover rounded-full overflow-hidden">
                                                <Image src={comment.user_image} alt="유저 프로필 사진" fill sizes="100%" referrerPolicy="no-referrer"/>
                                            </div>
                                            <div className="w-full ml-4 tlg:ml-3.5">
                                                <div className="flex items-end">
                                                    <div className="text-[15px] tlg:text-sm font-medium">{comment.user_auth === "credentials" ? comment.user_name : hideUserName(comment.user_name)}</div>
                                                    {
                                                        comment.user_id === 1
                                                        ? <div className="text-xs leading-none px-1.5 pt-1 pb-[3px] ml-1.5 mb-px border rounded-full border-theme-blue-1 text-theme-blue-1">Manager</div>
                                                        : <div className="text-xs leading-none px-1.5 pt-1 pb-[3px] ml-1.5 mb-px border rounded-full border-theme-green text-theme-green">User</div>
                                                    }
                                                    <div className="text-[13px] tlg:text-[11px] ml-2.5 text-theme-5 dark:text-theme-7">{commentsDateFormat(comment.created_at)}</div>
                                                    {
                                                        user
                                                        ? comment.user_id !== user.id && !comment.is_deleted_with_reply
                                                            ? reports === null || !reports.some((report: any) => report.comment_id === comment.comment_id)
                                                                ? <button id={`report-comment-${comment.comment_id}`} onClick={reportCommentModalOpen} className="flex items-center ml-3 mb-px cursor-pointer text-theme-5 hover:text-theme-yellow dark:text-theme-8 hover:dark:text-theme-blue-1">
                                                                    <i className="text-xs mb-px fa-regular fa-bell"></i>
                                                                    <div className="text-xs leading-none ml-1">신고</div>
                                                                </button>
                                                                : <div className="ml-2.5 text-xs text-theme-4 dark:text-theme-8">댓글이 신고되었습니다.</div>
                                                            : comment.user_id === user.id && !comment.is_deleted_with_reply
                                                                ? <div id={`comment-btn-wrap-${comment.comment_id}`} className="flex items-start mb-1 tlg:mb-0.5">
                                                                    <input onChange={editComment} type="checkbox" id={`comment-edit-${comment.comment_id}`} className="hidden"/>
                                                                    <label htmlFor={`comment-edit-${comment.comment_id}`} className="flex items-center ml-3 cursor-pointer text-theme-4 hover:text-theme-yellow tlg:hover:text-theme-4 dark:text-theme-10 hover:dark:text-theme-blue-1 tlg:hover:dark:text-theme-10">
                                                                        <i className="text-[10px] fa-solid fa-pen"></i>
                                                                        <div className="text-xs leading-none ml-1">수정</div>
                                                                    </label>
                                                                    <div className="w-px h-[11px] mx-1.5 bg-theme-6"></div>
                                                                    <button id={`delete-comment-${comment.comment_id}`} onClick={deleteCommentModalOpen} className="flex items-center text-theme-4 hover:text-theme-yellow tlg:hover:text-theme-4 dark:text-theme-10 hover:dark:text-theme-blue-1 tlg:hover:dark:text-theme-10">
                                                                        <i className="text-[10px] fa-regular fa-trash-can"></i>
                                                                        <div className="text-xs leading-none ml-1">삭제</div>
                                                                    </button>
                                                                </div>
                                                                : <></>
                                                        : <></>
                                                    }
                                                </div>
                                                <div id={`comment-${comment.comment_id}`} className="mt-2">
                                                    {
                                                        comment.is_deleted_with_reply
                                                        ? <div className="text-sm tlg:text-xs text-theme-6">[삭제된 댓글입니다]</div>
                                                            : comment.is_deleted_by_reports
                                                                ? <div className="text-sm tlg:text-xs text-theme-6">[신고로 삭제된 댓글입니다]</div>
                                                                : <pre className="font-sans text-sm tlg:text-xs text-theme-4 dark:text-theme-9">{comment.comment}</pre>
                                                    }
                                                    <input onChange={commentReplyShow} id={`comment-reply-${comment.comment_id}`} type="checkbox" className="hidden peer"/>
                                                    <label htmlFor={`comment-reply-${comment.comment_id}`} className={`${user ? 'block' : 'hidden'} peer-checked:hidden text-sm tlg:text-xs mt-3 tlg:mt-2 text-theme-3 dark:text-theme-blue-1 hover:underline tlg:underline hover:dark:text-theme-blue-1 cursor-pointer`}>답글</label>
                                                </div>
                                                {/* 댓글 수정 */}
                                                <div id={`comment-editor-${comment.comment_id}`} className="hidden mt-2">
                                                    <div className="w-full items-center px-[14px] pt-2.5 pb-1 rounded-lg bg-theme-8 dark:bg-theme-3">
                                                        <textarea id={`comment-edit-textarea-${comment.comment_id}`} onChange={commentEditOnChange} onInput={handleHeightChange} onFocus={commentEditOnFocus} placeholder="댓글 수정하기..." defaultValue={comment.comment} className="w-full h-[21px] resize-none text-sm tlg:text-xs tracking-wide text-theme-4 dark:text-theme-9 placeholder-theme-5 dark:placeholder-theme-6 leading-normal bg-transparent"/>
                                                    </div>
                                                    <div className="flex text-sm mt-3">
                                                        <button onClick={editCommentAPIInit} id={`comment-edit-btn-${comment.comment_id}`} className="w-14 tlg:w-12 h-8 tlg:h-7 pb-px rounded-full">수정</button>
                                                        <button onClick={commentEditCancelBtnOnClick} id={`comment-edit-cancel-${comment.comment_id}`} className="w-14 tlg:w-12 h-8 tlg:h-7 pb-px rounded-full text-theme-3 dark:text-theme-9 hover:bg-theme-8 hover:dark:bg-theme-4 tlg:hover:dark:bg-transparent ml-1.5">취소</button>
                                                    </div>
                                                </div>
                                                {/* 답글 */}
                                                {
                                                    user
                                                    ? <div id={`comment-reply-content-${comment.comment_id}`} className="hidden mt-5">
                                                        <div className="w-full flex">
                                                            <div className="w-10 tlg:w-8 h-10 tlg:h-8 relative object-cover rounded-full overflow-hidden">
                                                                <Image src={user.image} alt="유저 프로필 사진" fill sizes="100%" referrerPolicy="no-referrer"/>
                                                            </div>
                                                            <div className="w-full ml-4 tlg:ml-3.5">
                                                                <div className="relative w-full flex items-center pb-1 border-b border-theme-5 dark:border-theme-7">
                                                                    <textarea onInput={handleHeightChange} onChange={commentReplyOnChange} onFocus={commentReplyOnChange} id={`comment-reply-textarea-${comment.comment_id}`} placeholder="답글 달기..." className="w-full h-[21px] resize-none text-sm tlg:text-xs tracking-wide mt-1.5 text-theme-5 dark:text-theme-8 placeholder-theme-5 dark:placeholder-theme-6 leading-normal bg-transparent"/>
                                                                </div>
                                                                <div className="flex text-sm mt-3">
                                                                    <button onClick={replyCommentAPIInit} id={`comment-reply-btn-${comment.comment_id}`} className="edit-btn-disabled w-14 tlg:w-12 h-8 tlg:h-7 pb-px rounded-full bg-theme-8 dark:bg-theme-3 text-theme-6 dark:text-theme-5 cursor-default">답글</button>
                                                                    <button onClick={commentReplyCancelBtnOnClick} id={`comment-reply-cancel-${comment.comment_id}`} className="w-14 tlg:w-12 h-8 tlg:h-7 pb-px rounded-full text-theme-3 dark:text-theme-9 hover:bg-theme-8 hover:dark:bg-theme-4 tlg:hover:dark:bg-transparent ml-1.5">취소</button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    : <></>
                                                }
                                            </div>
                                        </div>
                                        <div className="w-full h-px mt-5 tlg:mt-4 bg-theme-7 dark:bg-theme-5"></div>
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