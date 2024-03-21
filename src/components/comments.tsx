// react
import { useRef, useState, useEffect } from "react";

// next
import Script from "next/script";
import Image from "next/image";

// components
import DeleteCommentModal from "@/components/deletecommentmodal";
import ReportCommentModal from "@/components/reportcommentmodal";

// common
import { timeFormat, getIntFromString, onMouseDown, onMouseOut, onMouseUp, hideUserName } from "@/libs/common";

// global
import { reports, comments } from "@/libs/global";

declare global {
    interface Window {
        Kakao: any;
    }
}

export default function Comments (
    {
        font,
        user,
        comment,
        likedInput,
        likedNum
    } : 
    {
        font: any,
        user: any,
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
    const [commentUserId, setCommentUserId] = useState<number>(0);
    const [bundleId, setBundleId] = useState<number>(0);
    const [shareExpand, setShareExpand] = useState<boolean>(false);

    // refs
    const commentRef = useRef<HTMLTextAreaElement>(null);
    const commentBtnRef = useRef<HTMLButtonElement>(null);
    const shareExpandBtn = useRef<HTMLLabelElement>(null);
    const shareExpandContent = useRef<HTMLDivElement>(null);

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

    /** 새 댓글 쓰기 */
    const newComment = async (e: React.MouseEvent<HTMLButtonElement>) => {
        if (commentRef.current && e.currentTarget.classList.contains('comment-enabled')) {
            const url = "/api/post/comments";
            const options = {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    action: 'new-comment',
                    font_id: font.code,
                    font_name: font.name,
                    font_family: font.font_family,
                    user_id: user.id,
                    user_name: user.name,
                    user_email: user.email,
                    user_auth: user.provider,
                    user_image: user.protected && user.provider !== "credentials" ? user.public_img : user.image,
                    user_privacy: user.protected,
                    comment: commentRef.current.value,
                })
            }
            
            await fetch(url, options)
            .then(res => res.json())
            .then(async (data) => {
                console.log(data.msg);
                setComments(data.comments);
            })
            .catch(err => console.log(err));

            // 댓글 지우기
            commentCancelBtnOnMouseDown();
        }
    }

    /** 댓글 삭제 모달창 열기 */
    const deleteCommentModalOpen = (e: React.MouseEvent<HTMLButtonElement>) => {
        setDeleteModalDisplay(true);
        setCommentId(Number(e.currentTarget.dataset.comment));
        setBundleId(Number(e.currentTarget.dataset.bundle));
    }

    /** 댓글 삭제 모달창 닫기 */
    const deleteCommentModalClose = () => { setDeleteModalDisplay(false); }

    /** 댓글 수정하기 버튼 클릭(보임/숨김) */
    const editComment = (e: React.ChangeEvent<HTMLInputElement>) => { commentEditShow(e); }

    /** 댓글 수정 포커스 시 */
    const commentEditOnFocus = (e: React.ChangeEvent<HTMLTextAreaElement>) => { handleHeightChange(e); }

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

            const url = "/api/post/comments";
            const options = {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    action: 'edit-comment',
                    font_id: font.code,
                    comment_id: id,
                    comment: textarea.value
                })
            }

            await fetch(url, options)
            .then(res => res.json())
            .then(async (data) => {
                // 업데이트된 댓글 가져오기
                console.log(data.msg);
                setComments(data.comments);

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

    /** 답글 수정 API 실행 */
    const replyCommentAPIInit = async (e: any) => {
        if(e.target.classList.contains('edit-btn-enabled')) {
            // 아이디 추출
            const id = getIntFromString(e.target.id);
            const recipentEmail = e.currentTarget.dataset.email;
            const recipentAuth = e.currentTarget.dataset.auth;
            const commentId = Number(e.currentTarget.dataset.comment);
            const bundle = Number(e.currentTarget.dataset.bundle);
            const textarea = document.getElementById('comment-reply-textarea-' + id) as HTMLTextAreaElement;
            const input = document.getElementById('comment-reply-' + id) as HTMLInputElement;

            const url = "/api/post/comments";
            const options = {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    action: 'reply-comment',
                    font_id: font.code,
                    font_name: font.name,
                    font_family: font.font_family,
                    user_id: user.id,
                    user_name: user.name,
                    user_email: user.email,
                    user_auth: user.provider,
                    user_image: user.protected && user.provider !== "credentials" ? user.public_img : user.image,
                    user_privacy: user.protected,
                    recipent_email: recipentEmail,
                    recipent_auth: recipentAuth,
                    comment_id: commentId,
                    comment: textarea.value,
                    bundle_id: bundle,
                })
            }

            await fetch(url, options)
            .then(res => res.json())
            .then(async (data) => {
                // 업데이트된 댓글 가져오기
                console.log(data.msg);
                setComments(data.comments);

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
        setCommentUserId(Number(e.currentTarget.dataset.user));
    }
    
    const compareIdsFromReports = (reports: reports[]) => {
        const isReported = reports.length === 0 ? false : reports.some((report: reports) => report.reported_user_id === Number(user.id));
        return isReported;
    }

    /** 댓글 업데이트 */
    const updateComments = (comments: comments) => { setComments(comments); }

    /** 댓글 신고 모달창 닫기 */
    const reportCommentModalClose = () => { setReportModalDisplay(false); }

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
                bundle_id={bundleId}
            />

            {/* 댓글 신고 모달 */}
            <ReportCommentModal
                display={reportModalDisplay}
                close={reportCommentModalClose}
                font_id={font.code}
                user={user}
                comment_id={commentId}
                comment_user_no={commentUserId}
                update={updateComments}
            />

            <div className='w-max mb-3 flex gap-2 text-l-2 dark:text-white'>
                <label htmlFor={font.code.toString()} onMouseDown={e => onMouseDown(e, 0.9, true)} onMouseUp={onMouseUp} onMouseOut={onMouseOut} className='cursor-pointer'>
                    {
                        !likedInput
                        ? <div className="w-14 h-8 flex justify-center items-center rounded-lg bg-l-f lg:hover:bg-l-e dark:bg-d-3 lg:hover:dark:bg-d-4">
                            <i className="text-sm bi bi-heart"></i>
                            <div className="ml-1.5 text-[0.813rem] selection:bg-transparent">{likedNum}</div>
                        </div>
                        : <div className="w-14 h-8 flex justify-center items-center rounded-lg bg-h-r text-white">
                            <i className="text-sm bi bi-heart-fill"></i>
                            <div className="ml-1.5 text-[0.813rem] selection:bg-transparent">{likedNum}</div>
                        </div>
                    }
                </label>
                <div className="relative">
                    <input onChange={handleShareExpand} type="checkbox" id="share-expand" className="peer hidden"/>
                    <label ref={shareExpandBtn} htmlFor="share-expand" onMouseDown={e => onMouseDown(e, 0.9, true)} onMouseUp={onMouseUp} onMouseOut={onMouseOut} className="w-max h-8 px-3 text-[0.813rem] flex justify-center items-center cursor-pointer rounded-lg selection:bg-transparent bg-l-f lg:hover:bg-l-e peer-checked:bg-l-e dark:bg-d-3 lg:hover:dark:bg-d-4 peer-checked:dark:bg-d-4">
                        <i className="text-sm mr-2 fa-solid fa-share-nodes"></i>
                        공유
                    </label>
                    {
                        shareExpand &&
                        <div ref={shareExpandContent} className="p-4 rounded-lg absolute left-0 -top-2 -translate-y-full bg-l-f dark:bg-d-3">
                            <div className="w-full mb-4 relative rounded-lg flex items-center overflow-hidden">
                                <input type="text" id="url" defaultValue={`https://fonts.taedonn.com/post/${font.font_family.replaceAll(" ", "+")}`} className="w-full h-12 px-3 pr-10 py-2 rounded-r-lg text-sm placeholder-l-5 dark:placeholder-d-c bg-l-e dark:bg-d-4"/>
                                <label onClick={copyUrl} htmlFor="url" className="w-8 h-8 absolute z-10 right-1 flex justify-center items-center cursor-pointer lg:hover:text-h-1 lg:hover:dark:text-f-8">
                                    <i className="url_copy_btn text-sm bi bi-clipboard"></i>
                                    <i className="url_copy_chk_btn text-sm hidden text-h-1 dark:text-f-8 bi bi-check-lg"></i>
                                </label>
                            </div>
                            <div className="gap-3 flex justify-center items-center text-xs text-l-5 dark:text-d-c">
                                <button onClick={shareKakao} id="share-kakao" onMouseDown={e => onMouseDown(e, 0.9, true)} onMouseUp={onMouseUp} onMouseOut={onMouseOut} className="group flex flex-col justify-center items-center">
                                    <div className="w-8 h-8 rounded-full flex justify-center items-center bg-theme-kakao drop-shadow-default dark:drop-shadow-dark">
                                        <div className="w-6 h-6 relative">
                                            <Image src="/logo-kakaotalk.svg" alt="카카오톡 로고" fill sizes="100%" referrerPolicy="no-referrer"/>
                                        </div>
                                    </div>
                                    <div className="w-12 mt-2.5 text-center lg:group-hover:text-l-2 lg:group-hover:dark:text-white">카카오톡</div>
                                </button>
                                <button onClick={shareLine} onMouseDown={e => onMouseDown(e, 0.9, true)} onMouseUp={onMouseUp} onMouseOut={onMouseOut} className="group flex flex-col justify-center items-center">
                                    <div className="w-8 h-8 rounded-full flex justify-center items-center bg-theme-naver drop-shadow-default dark:drop-shadow-dark">
                                        <div className="w-[1.125rem] h-[1.125rem] relative">
                                            <Image src="/logo-line.svg" alt="라인 로고" fill sizes="100%" referrerPolicy="no-referrer"/>
                                        </div>
                                    </div>
                                    <div className="w-12 mt-2.5 text-center lg:group-hover:text-l-2 lg:group-hover:dark:text-white">라인</div>
                                </button>
                                <button onClick={shareFacebook} onMouseDown={e => onMouseDown(e, 0.9, true)} onMouseUp={onMouseUp} onMouseOut={onMouseOut} className="group flex flex-col justify-center items-center">
                                    <div className="w-8 h-8 relative rounded-full flex justify-center items-center drop-shadow-default dark:drop-shadow-dark">
                                        <Image src="/logo-facebook.png" alt="페이스북 로고" fill sizes="100%" referrerPolicy="no-referrer"/>
                                    </div>
                                    <div className="w-12 mt-2.5 text-center lg:group-hover:text-l-2 lg:group-hover:dark:text-white">페이스북</div>
                                </button>
                                <button onClick={shareTwitter} onMouseDown={e => onMouseDown(e, 0.9, true)} onMouseUp={onMouseUp} onMouseOut={onMouseOut} className="group flex flex-col justify-center items-center">
                                    <div className="w-8 h-8 rounded-full flex justify-center items-center bg-black drop-shadow-default dark:drop-shadow-dark">
                                        <div className="w-4 h-4 relative">
                                            <Image src="/logo-x.svg" alt="엑스(트위터) 로고" fill sizes="100%" referrerPolicy="no-referrer"/>
                                        </div>
                                    </div>
                                    <div className="w-12 mt-2.5 text-center lg:group-hover:text-l-2 lg:group-hover:dark:text-white">엑스</div>
                                </button>
                            </div>
                        </div>
                    }
                </div>
            </div>
            <div className="w-full h-px bg-l-b dark:bg-d-6 mb-5"></div>
            <h2 className="font-medium mb-4">댓글 {comments === null ? 0 : comments.length}개</h2>
            <div className="w-full mb-8 lg:mb-10">
                <div className="w-full flex">
                    {
                        user === null
                        ? <div className="w-full flex items-center gap-4 text-l-5 dark:text-d-c">
                            <i className="text-3xl lg:text-4xl bi bi-person-circle"></i>
                            <div className="w-full text-sm">
                                <div>로그인 후 댓글 이용 가능합니다.</div>
                                <div className="w-full h-px mt-1.5 bg-l-b dark:bg-d-6"></div>
                            </div>
                        </div>
                        : <div className="w-full flex gap-4">
                            <div className="w-8 h-8 lg:w-10 lg:h-10 shrink-0 relative rounded-full overflow-hidden">
                                <Image src={user.protected && user.provider !== "credentials" ? user.public_img : user.image} alt="유저 프로필 사진" fill sizes="100%" referrerPolicy="no-referrer" className="object-cover"/>
                            </div>
                            <div className="w-full flex flex-col mt-0.5 lg:mt-1.5">
                                <div className={`relative w-full flex items-center pb-1.5 border-b lg:hover:border-l-9 hover:dark:border-d-9 ${commentFocus ? 'border-l-9 dark:border-d-9' : 'border-l-b dark:border-d-6'}`}>
                                    <textarea ref={commentRef} onChange={commentOnChange} onInput={handleHeightChange} onFocus={commentOnFocus} onBlur={commentOnBlur} placeholder="댓글 달기..." className="w-full h-[1.375rem] resize-none text-sm placeholder-l-5 dark:placeholder-d-c bg-transparent"/>
                                </div>
                                {
                                    commentFocus
                                    && <div className="flex gap-2 w-full mt-3 text-sm">
                                        <button ref={commentBtnRef} onMouseDown={newComment} className={`${commentBtn ? 'comment-enabled text-white dark:text-f-1 bg-h-1 lg:hover:bg-h-0 dark:bg-f-8 lg:hover:dark:bg-f-9 cursor-pointer' : 'comment-disabled text-l-9 dark:text-d-9 bg-l-f dark:bg-d-3 cursor-default'} w-14 h-8 rounded-lg`}>댓글</button>
                                        <button onMouseDown={commentCancelBtnOnMouseDown} className="w-14 h-8 rounded-lg lg:hover:bg-l-f lg:hover:dark:bg-d-3">취소</button>
                                    </div>
                                }
                            </div>
                        </div>
                    } 
                </div>
            </div>
            <div className="w-full min-h-[7.5rem] mb-36 lg:mb-40 lg:pl-10">
                {
                    comments === null || comments.length === 0
                    ? <div className="w-full mt-4 text-center text-sm text-l-5 dark:text-d-c">아직 댓글이 없습니다.</div>
                    : <>
                        {
                            comments.map((comment: any) => {
                                return (
                                    <div key={comment.comment_id} id={`c${comment.comment_id}`} className='w-full animate-fade-in-fontbox'>
                                        <div className='flex items-start gap-4 mt-4'>
                                            {
                                                comment.depth === 1
                                                && <i className="rotate-180 mt-2.5 mx-3.5 fa-solid fa-reply"></i>
                                            }
                                            <div className="w-8 h-8 lg:w-10 lg:h-10 shrink-0 relative rounded-full overflow-hidden">
                                                <Image src={comment.user_image} alt="유저 프로필 사진" fill sizes="100%" referrerPolicy="no-referrer" className="object-cover"/>
                                            </div>
                                            <div className="w-full">
                                                <div className="flex gap-1 lg:gap-3 tlg:flex-col lg:items-center">
                                                    <div className="font-medium">{comment.user_auth !== "credentials" && comment.user_privacy ? hideUserName(comment.user_name, 1) : comment.user_name}</div>
                                                    <div className="flex gap-3 items-center">
                                                        <div className="text-sm text-l-5 dark:text-d-c">{timeFormat(comment.created_at)}</div>
                                                        {
                                                            user
                                                                ? comment.user_id !== user.id && !comment.is_deleted_with_reply && !comment.is_deleted_by_reports
                                                                    ? !compareIdsFromReports(comment.reports)
                                                                        ? <button id={`report-comment-${comment.comment_id}`} data-user={comment.user_id} onClick={reportCommentModalOpen} className="flex gap-1 items-center text-sm lg:hover:text-h-1 lg:hover:dark:text-f-8">
                                                                            {comment.reports.toString()}
                                                                            <i className="text-xs fa-regular fa-bell"></i>
                                                                            신고
                                                                        </button>
                                                                        : <div className="text-sm text-l-5 dark:text-d-c">댓글이 신고되었습니다.</div>
                                                                    : comment.user_id === user.id && !comment.is_deleted_with_reply && !comment.is_deleted_by_reports
                                                                        ? <div id={`comment-btn-wrap-${comment.comment_id}`} className="flex gap-2 items-center text-sm">
                                                                            <input onChange={editComment} type="checkbox" id={`comment-edit-${comment.comment_id}`} className="hidden"/>
                                                                            <label htmlFor={`comment-edit-${comment.comment_id}`} className="flex gap-1 items-center cursor-pointer lg:hover:text-h-1 lg:hover:dark:text-f-8">
                                                                                <i className="text-[0.5rem] fa-solid fa-pen"></i>
                                                                                수정
                                                                            </label>
                                                                            <div className="w-px h-3 bg-l-2 dark:bg-white"></div>
                                                                            <button id={`delete-comment-${comment.comment_id}`} data-comment={comment.comment_id} data-bundle={comment.bundle_id} onClick={deleteCommentModalOpen} className="flex gap-1 items-center lg:hover:text-h-1 lg:hover:dark:text-f-8">
                                                                                <i className="text-[0.625rem] fa-regular fa-trash-can"></i>
                                                                                삭제
                                                                            </button>
                                                                        </div>
                                                                        : <></>
                                                                : <></>
                                                        }
                                                    </div>
                                                </div>
                                                <div id={`comment-${comment.comment_id}`} className="mt-2 text-sm">
                                                    {
                                                        comment.is_deleted_with_reply
                                                        ? <div className="text-l-5 dark:text-d-c">[삭제된 댓글입니다]</div>
                                                            : comment.is_deleted_by_reports
                                                                ? <div className="text-l-5 dark:text-d-c">[신고로 삭제된 댓글입니다]</div>
                                                                : <pre className="whitespace-pre-wrap font-sans">{comment.comment}</pre>
                                                    }
                                                    <input onChange={commentReplyShow} id={`comment-reply-${comment.comment_id}`} type="checkbox" className="hidden peer"/>
                                                    <label htmlFor={`comment-reply-${comment.comment_id}`} className={`${user ? 'block' : 'hidden'} peer-checked:hidden text-sm mt-3 text-h-1 dark:text-f-8 lg:hover:underline cursor-pointer`}>답글</label>
                                                </div>
                                                {/* 댓글 수정 */}
                                                <div id={`comment-editor-${comment.comment_id}`} className="hidden mt-3">
                                                    <div className="w-full items-center px-4 pt-3 pb-1.5 rounded-lg bg-l-f dark:bg-d-3">
                                                        <textarea id={`comment-edit-textarea-${comment.comment_id}`} onChange={commentEditOnChange} onInput={handleHeightChange} onFocus={commentEditOnFocus} placeholder="댓글 수정하기..." defaultValue={comment.comment} className="w-full h-5 resize-none text-sm placeholder-l-5 dark:placeholder-d-c bg-transparent"/>
                                                    </div>
                                                    <div className="flex gap-2 text-sm mt-3">
                                                        <button onClick={editCommentAPIInit} id={`comment-edit-btn-${comment.comment_id}`} onMouseDown={e => onMouseDown(e, 0.9, e.currentTarget.classList.contains("edit-btn-enabled") ? true : false)} onMouseUp={onMouseUp} onMouseOut={onMouseOut} className="w-14 h-8 rounded-lg">수정</button>
                                                        <button onClick={commentEditCancelBtnOnClick} id={`comment-edit-cancel-${comment.comment_id}`} onMouseDown={e => onMouseDown(e, 0.9, true)} onMouseUp={onMouseUp} onMouseOut={onMouseOut} className="w-14 h-8 rounded-lg lg:hover:bg-l-f lg:hover:dark:bg-d-3">취소</button>
                                                    </div>
                                                </div>
                                                {/* 답글 */}
                                                {
                                                    user
                                                    ? <div id={`comment-reply-content-${comment.comment_id}`} className="hidden mt-5">
                                                        <div className="w-full flex gap-4">
                                                            <div className="w-8 h-8 lg:w-10 lg:h-10 shrink-0 relative rounded-full overflow-hidden">
                                                                <Image src={user.protected && user.provider !== "credentials" ? user.public_img : user.image} alt="유저 프로필 사진" fill sizes="100%" referrerPolicy="no-referrer" className="object-cover"/>
                                                            </div>
                                                            <div className="w-full">
                                                                <div className="relative w-full flex items-center pb-1.5 border-b border-l-b dark:border-d-6">
                                                                    <textarea onInput={handleHeightChange} onChange={commentReplyOnChange} onFocus={commentReplyOnChange} id={`comment-reply-textarea-${comment.comment_id}`} placeholder="답글 달기..." className="w-full h-[1.375rem] resize-none text-sm mt-1.5 placeholder-l-5 dark:placeholder-d-c bg-transparent"/>
                                                                </div>
                                                                <div className="flex gap-2 text-sm mt-3">
                                                                    <button onClick={replyCommentAPIInit} id={`comment-reply-btn-${comment.comment_id}`} data-comment={comment.comment_id} data-bundle={comment.bundle_id} data-email={comment.user_email} data-auth={comment.user_auth} onMouseDown={e => onMouseDown(e, 0.9, e.currentTarget.classList.contains("edit-btn-enabled") ? true : false)} onMouseUp={onMouseUp} onMouseOut={onMouseOut} className="edit-btn-disabled w-14 h-8 rounded-lg bg-l-f dark:bg-d-3 text-l-9 dark:text-d-9 cursor-default">답글</button>
                                                                    <button onClick={commentReplyCancelBtnOnClick} id={`comment-reply-cancel-${comment.comment_id}`} onMouseDown={e => onMouseDown(e, 0.9, true)} onMouseUp={onMouseUp} onMouseOut={onMouseOut} className="w-14 h-8 rounded-lg lg:hover:bg-l-f lg:hover:dark:bg-d-3">취소</button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    : <></>
                                                }
                                            </div>
                                        </div>
                                        <div className="w-full h-px mt-5 tlg:mt-4 bg-l-b dark:bg-d-6"></div>
                                    </div>
                                )
                            })
                        }
                    </>
                }
            </div>

            {/* 앵커 포인트 */}
            <div id="comment-section"></div>
        </>
    )
}