// react
import React, { useEffect, useRef } from "react";

// libraries
import axios from "axios";

export default function AdminDeleteCommentModal(
    {
        display,
        close,
        font_id,
        comment_id,
        user_id,
        update,
        page,
        text,
        filter,
    }:
    {
        display: boolean, 
        close: any,
        font_id: number,
        comment_id: number,
        user_id: number,
        update: any,
        page: number,
        text: string,
        filter: string,
    }
) {
    // refs
    const thisModal = useRef<HTMLDivElement>(null);

    // 모달창 외 영역 클릭 시 모달창 닫기
    useEffect(() => {
        function handleSearchOutside(e:Event) {
            if (thisModal?.current && !thisModal.current.contains(e.target as Node)) {
                close();
            }
        }
        document.addEventListener("mouseup", handleSearchOutside);
        return () => document.removeEventListener("mouseup", handleSearchOutside);
    },[close, thisModal]);

    // ESC키 입력 시 모달창 닫기 & Enter키 입력 시 댓글 삭제
    useEffect(() => {
        const keys: any = [];
        const handleKeydown = (e: KeyboardEvent) => {
            keys[e.key] = true;
            if (display === true && keys["Escape"]) { close(); }
            if (display === true && keys["Enter"]) { deleteComment();  }
        }
        const handleKeyup = (e: KeyboardEvent) => {keys[e.key] = false;}

        window.addEventListener("keydown", handleKeydown, false);
        window.addEventListener("keyup", handleKeyup, false);

        return () => {
            window.removeEventListener("keydown", handleKeydown);
            window.removeEventListener("keyup", handleKeyup);
        }
    });

    /** 댓글 삭제 */
    const deleteComment = async () => {
        await axios.post('/api/post/comments', {
            action: 'delete-comment-by-admin',
            font_id: font_id,
            comment_id: comment_id
        })
        .then(async (res) => {
            console.log(res.data.message);

            if (document.location.href.includes("/admin/comment/list")) { // 댓글 관리
                await axios.get('/api/admin/comment', {
                    params: {
                        action: 'list',
                        page: page,
                        text: text
                    }
                })
                .then((res) => {
                    update(res.data.comments);
                })
                .catch(err => console.log(err));
            } else { // 내 댓글 목록
                await axios.get('/api/user/fetchcomments', {
                    params: {
                        user_id: user_id,
                        page: page,
                        text: text,
                        filter: filter,
                    }
                })
                .then((res) => { update(res.data.comments); })
                .catch(err => console.log(err));
            }
        })
        .catch(err => console.log(err));

        // 모달창 닫기
        close();
    }

    return (
        <>
            {
                display === true
                ? <div className="w-full h-full fixed left-0 top-0 z-40 flex flex-col justify-start items-center pt-[12vh] tlg:pt-[10vh] tmd:pt-[60px] backdrop-blur bg-blur-theme dark:border-theme-4">
                    <div ref={thisModal} className="overflow-hidden w-[400px] tmd:w-[calc(100%-24px)] rounded-lg border border-theme-7 dark:border-theme-3 bg-theme-9 dark:bg-theme-2 animate-zoom-in">
                        <div className="relative w-full h-[52px] flex flex-row justify-between items-center px-5">
                            <div className="text-sm text-theme-5 dark:text-theme-7 mt-px">댓글 삭제</div>
                            <button onClick={close} className="w-9 h-6 rounded-md absolute right-4 tmd:right-3 top-1/2 -translate-y-1/2 text-xs leading-none text-theme-4 dark:text-theme-8 bg-theme-8 dark:bg-theme-3/80 hover:dark:bg-theme-4/60 tlg:hover:dark:bg-theme-3/80 hover:drop-shadow-default hover:dark:drop-shadow-dark tlg:hover:drop-shadow-none tlg:hover:dark:drop-shadow-none">ESC</button>
                        </div>
                        <div className="w-full p-5 bg-theme-4 dark:bg-theme-blue-2">
                            <h2 className="font-bold text-base text-theme-9 mb-2">댓글을 삭제하시겠습니까?</h2>
                            <div className='w-full flex flex-row justify-start items-start mb-1 text-xs text-theme-7'>
                                <i className="text-xs mr-1.5 text-theme-yellow dark:text-theme-blue-1 fa-regular fa-bell"></i>
                                <div>삭제된 댓글은 복구되지 않습니다.</div>
                            </div>
                            <div className="w-full h-px bg-theme-5 my-4"></div>
                            <div className="flex justify-between mt-3">
                                <button onClick={close} className='w-[calc(50%-5px)] h-10 pt-px rounded-lg flex flex-row justify-center items-center text-sm font-medium text-theme-10 dark:text-theme-8 bg-theme-5/80 hover:bg-theme-5 tlg:hover:bg-theme-5/80 dark:bg-theme-3/80 hover:dark:bg-theme-3 tlg:hover:dark:bg-theme-3/80'>취소</button>
                                <button onClick={deleteComment} className='w-[calc(50%-5px)] h-10 pt-px rounded-lg flex flex-row justify-center items-center text-sm font-medium text-theme-4 dark:text-theme-blue-2 bg-theme-yellow/80 hover:bg-theme-yellow tlg:hover:bg-theme-yellow/80 dark:bg-theme-blue-1/80 hover:dark:bg-theme-blue-1 tlg:hover:dark:bg-theme-blue-1/80'>확인</button>
                            </div>
                        </div>
                    </div>
                </div> : <></>
            }
        </>
    )
}