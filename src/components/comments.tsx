// react hooks
import { useRef, useState } from "react";

// api
import axios from "axios";

// components
import DeleteCommentModal from "@/components/deletecommentmodal";
import ReportCommentModal from "@/components/reportcommentmodal";

export default function Comments (
    {
        font,
        user,
        comment,
        likedInput
    } : 
    {
        font: any,
        user: any,
        comment: any,
        likedInput: boolean
    }
) {
    // 댓글 state
    const [comments, setComments] = useState(comment);
    const [commentFocus, setCommentFocus] = useState<boolean>(false);
    const [commentBtn, setCommentBtn] = useState<boolean>(false);
    const [deleteModalDisplay, setDeleteModalDisplay] = useState<boolean>(false);
    const [reportModalDisplay, setReportModalDisplay] = useState<boolean>(false);
    const [commentId, setCommentId] = useState<number>(0);

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
            await axios.post('/api/detailpage/comments', {
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

            await axios.post('/api/detailpage/comments', {
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

            await axios.post('/api/detailpage/comments', {
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

    return (
        <>

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
                comment_id={commentId}
                update={updateComments}
            />

            <div className='w-content mb-[12px]'>
                <label htmlFor={font.code.toString()} className='cursor-pointer'>
                    {
                        !likedInput
                        ? <div className="w-[76px] h-[32px] flex justify-center items-center rounded-[6px] bg-theme-8 hover:bg-theme-7/80 dark:bg-theme-4/60 hover:dark:bg-theme-4 tlg:dark:hover:bg-theme-4/60">
                            <svg className='w-[13px] fill-theme-5 dark:fill-theme-9 mb-px' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/></svg>
                            <div className="ml-[5px] mr-[2px] mt-px text-[13px] font-medium leading-none text-theme-5 dark:text-theme-9">좋아요</div>
                        </div>
                        : <div className="w-[76px] h-[32px] flex justify-center items-center rounded-[6px] bg-theme-yellow dark:bg-theme-blue-1">
                            <svg className='w-[13px] fill-theme-4 dark:fill-theme-2 mb-px' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/></svg>
                            <div className="ml-[5px] mr-[2px] mt-px text-[13px] font-medium leading-none text-theme-4 dark:text-theme-2">좋아요</div>
                        </div>
                    }
                </label>
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
                                    ? <div className="flex w-[100%] text-[14px] tlg:text-[12px] text-theme-5 dark:text-theme-9 mt-[12px]">
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
                    ? <div className="w-[100%] text-[14px] text-center text-theme-5 dark:text-theme-8">아직 댓글이 없습니다.</div>
                    : <>
                        {
                            comments.map((comment: any) => {
                                return (
                                    <div key={comment.comment_id} className='w-[100%] text-theme-3 dark:text-theme-10 animate-fontbox-fade-in'>
                                        <div className='flex items-start mt-[20px] tlg:mt-[16px]'>
                                            {
                                                comment.depth === 1
                                                ? <svg className="w-[20px] fill-theme-4 dark:fill-theme-9 rotate-180 mt-[10px] mx-[14px]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
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
                                                            ? <>
                                                                <button id={`report-comment-${comment.comment_id}`} onClick={reportCommentModalOpen} className="group flex items-center ml-[12px] mb-[2px] cursor-pointer">
                                                                    <svg className="w-[11px] mb-px fill-theme-4 group-hover:fill-theme-yellow tlg:group-hover:fill-theme-4 dark:fill-theme-9 group-hover:dark:fill-theme-blue-1 tlg:group-hover:dark:fill-theme-9" viewBox="0 0 18 21" xmlns="http://www.w3.org/2000/svg"><path d="M17.7002 14.4906C17.147 13.5344 16.4814 11.7156 16.4814 8.5V7.83438C16.4814 3.68125 13.1533 0.278125 9.05642 0.25H9.00017C8.01649 0.25123 7.04268 0.4462 6.13435 0.823776C5.22601 1.20135 4.40094 1.75414 3.70624 2.45058C3.01154 3.14702 2.46082 3.97347 2.08552 4.88275C1.71022 5.79202 1.51769 6.76632 1.51892 7.75V8.5C1.51892 11.7156 0.853295 13.5344 0.30017 14.4906C0.166399 14.7185 0.0951976 14.9777 0.0937718 15.2419C0.0923461 15.5061 0.160747 15.7661 0.292051 15.9954C0.423355 16.2247 0.612903 16.4152 0.841513 16.5477C1.07012 16.6803 1.32968 16.75 1.59392 16.75H5.25017C5.25017 17.7446 5.64526 18.6984 6.34852 19.4016C7.05178 20.1049 8.00561 20.5 9.00017 20.5C9.99473 20.5 10.9486 20.1049 11.6518 19.4016C12.3551 18.6984 12.7502 17.7446 12.7502 16.75H16.4064C16.6706 16.7517 16.9305 16.6831 17.1595 16.5513C17.3884 16.4196 17.5783 16.2293 17.7095 16C17.8397 15.7694 17.9073 15.5088 17.9056 15.2441C17.904 14.9793 17.8332 14.7196 17.7002 14.4906ZM9.00017 19C8.40419 18.9975 7.83333 18.7597 7.41191 18.3383C6.99048 17.9168 6.75264 17.346 6.75017 16.75H11.2502C11.2477 17.346 11.0099 17.9168 10.5884 18.3383C10.167 18.7597 9.59615 18.9975 9.00017 19ZM1.59392 15.25C2.2408 14.125 3.01892 12.0531 3.01892 8.5V7.75C3.01645 6.96295 3.16934 6.18316 3.46882 5.45532C3.7683 4.72747 4.20849 4.06589 4.76414 3.50849C5.3198 2.95109 5.98 2.50884 6.70691 2.20708C7.43381 1.90533 8.21312 1.75 9.00017 1.75H9.04705C12.3189 1.76875 14.9814 4.50625 14.9814 7.83438V8.5C14.9814 12.0531 15.7595 14.125 16.4064 15.25H1.59392Z"/></svg>
                                                                    <div className="text-[12px] leading-none text-theme-4 group-hover:text-theme-yellow tlg:group-hover:text-theme-4 dark:text-theme-9 group-hover:dark:text-theme-blue-1 tlg:group-hover:dark:text-theme-9 ml-[4px] tlg:mt-px">신고</div>
                                                                </button>
                                                            </>
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
                                                        !comment.is_deleted_with_reply
                                                        ? <pre style={{fontFamily: "Spoqa Han Sans Neo"}} className="text-[14px] tlg:text-[12px] text-theme-4 dark:text-theme-9">{comment.comment}</pre>
                                                        : <div className="text-[14px] tlg:text-[12px] text-theme-6">[삭제된 댓글입니다]</div>
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
                                                        <button onClick={commentEditCancelBtnOnClick} id={`comment-edit-cancel-${comment.comment_id}`} className="w-[56px] tlg:w-[48px] h-[32px] tlg:h-[28px] pb-px rounded-full text-theme-5 dark:text-theme-9 hover:bg-theme-8 hover:dark:bg-theme-4 tlg:hover:dark:bg-transparent ml-[6px]">취소</button>
                                                    </div>
                                                </div>
                                                {/* 댓글 삭제 */}
                                                <div id={`comment-reply-content-${comment.comment_id}`} className="hidden mt-[20px]">
                                                    <div className="w-[100%] flex">
                                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                                        <img src={comment.profile_img} alt="유저 프로필 이미지" className="w-[40px] tlg:w-[32px] h-[40px] tlg:h-[32px] object-cover rounded-full"/>
                                                        <div className="w-[100%] ml-[16px] tlg:ml-[14px]">
                                                            <div className="relative w-[100%] flex items-center pb-[4px] border-b border-theme-5 dark:border-theme-7">
                                                                <textarea onInput={handleHeightChange} onChange={commentReplyOnChange} onFocus={commentReplyOnChange} id={`comment-reply-textarea-${comment.comment_id}`} placeholder="답글 달기..." className="w-[100%] h-[21px] resize-none text-[14px] tlg:text-[12px] tracking-wide mt-[6px] text-theme-5 dark:text-theme-8 placeholder-theme-5 dark:placeholder-theme-6 leading-normal bg-transparent"/>
                                                            </div>
                                                            <div className="flex text-[14px] mt-[12px]">
                                                                <button onClick={replyCommentAPIInit} id={`comment-reply-btn-${comment.comment_id}`} className="edit-btn-disabled w-[56px] tlg:w-[48px] h-[32px] tlg:h-[28px] pb-px rounded-full">답글</button>
                                                                <button onClick={commentReplyCancelBtnOnClick} id={`comment-reply-cancel-${comment.comment_id}`} className="w-[56px] tlg:w-[48px] h-[32px] tlg:h-[28px] pb-px rounded-full text-theme-5 dark:text-theme-9 hover:bg-theme-8 hover:dark:bg-theme-4 tlg:hover:dark:bg-transparent ml-[6px]">취소</button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
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