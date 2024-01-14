// react
import { useEffect, useRef } from "react";

// libraries
import axios from "axios";

// components
import Button from "@/components/button";

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

    // 팝업 보일 시 스크롤 막기
    useEffect(() => {
        const body = document.body;
        if (display) body.style.overflow = "hidden";
        else body.style.overflow = "auto";
    }, [display]);

    /** 댓글 삭제 */
    const deleteComment = async () => {
        await axios.post('/api/post/comments', {
            action: 'delete-comment-by-admin',
            font_id: font_id,
            comment_id: comment_id
        })
        .then(async (res) => {
            console.log(res.data.message);

            if (document.location.href.includes("/admin/comment/list")) { // 관리자 댓글 목록
                await axios.get('/api/admin/comment', {
                    params: {
                        action: 'list',
                        page: page,
                        text: text
                    }
                })
                .then((res) => update(res.data.comments))
                .catch(err => console.log(err));
            } else { // 일반 댓글 목록
                await axios.get('/api/user/fetchcomments', {
                    params: {
                        user_id: user_id,
                        page: page,
                        text: text,
                        filter: filter,
                    }
                })
                .then((res) => update(res.data.comments))
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
                display
                && <div className="w-full h-full fixed left-0 top-0 z-40 pt-24 tlg:pt-16 tlg:px-4 flex flex-col justify-start items-center backdrop-blur">
                    <div ref={thisModal} className="overflow-hidden w-96 txs:w-full p-6 relative rounded-lg animate-zoom-in drop-shadow-default dark:drop-shadow-dark bg-l-e dark:bg-d-3">
                        <div className="w-full flex flex-col">
                            <div className="font-medium text-l-2 dark:text-white">댓글 삭제</div>
                            <button onClick={close} className="w-8 h-8 absolute right-3 top-3 rounded-full text-l-2 dark:text-white hover:bg-l-d hover:dark:bg-d-6 tlg:hover:bg-transparent tlg:hover:dark:bg-transparent">
                                <i className="fa-solid fa-xmark"></i>
                            </button>
                            <div className="w-full mt-5 px-5 py-4 rounded-lg text-l-2 dark:text-white bg-l-d dark:bg-d-4">
                                <h2 className="font-medium mb-1">댓글을 삭제하시겠습니까?</h2>
                                <div className='w-full text-sm flex gap-1.5 items-center'>
                                    <div className="w-1 h-1 rounded-full bg-l-2 dark:bg-white"></div>
                                    <div>삭제된 댓글은 복구되지 않습니다.</div>
                                </div>
                            </div>
                            <div className="flex justify-between gap-2 mt-3">
                                <div className="w-1/2">
                                    <Button color="gray">
                                        <button onClick={close} className='w-full h-full'>취소</button>
                                    </Button>
                                </div>
                                <div className="w-1/2">
                                    <Button>
                                        <button onClick={deleteComment} className='w-full h-full'>확인</button>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            }
        </>
    )
}