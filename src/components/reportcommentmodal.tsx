// react hooks
import React, { useEffect, useRef } from "react";

// hooks
import axios from "axios";

export default function ReportCommentModal(
    {
        display,
        close,
        font_id,
        comment_id,
        update,
    }:
    {
        display: boolean, 
        close: any,
        font_id: number,
        comment_id: number,
        update: any
    }
) {
    // 댓글 삭제 Ref
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
            if (display === true && keys["Enter"]) { reportComment();  }
        }
        const handleKeyup = (e: KeyboardEvent) => {keys[e.key] = false;}

        window.addEventListener("keydown", handleKeydown, false);
        window.addEventListener("keyup", handleKeyup, false);

        return () => {
            window.removeEventListener("keydown", handleKeydown);
            window.removeEventListener("keyup", handleKeyup);
        }
    });

    /** 댓글 신고 */
    const reportComment = async () => {
        await axios.post('/api/detailpage/comments', {
            action: 'delete-comment',
            font_id: font_id,
            comment_id: comment_id
        })
        .then(async (res) => {
            console.log(res.data.message);
            update(res.data.comments);
        })
        .catch(err => console.log(err));

        // 모달창 닫기
        close();
    }

    return (
        <>
            {
                display === true
                ? <div className="w-[100%] h-[100vh] fixed left-0 top-0 z-40 flex flex-col justify-start items-center pt-[12vh] tlg:pt-[10vh] tmd:pt-[60px] backdrop-blur bg-blur-theme dark:border-theme-4">
                    <div ref={thisModal} className="overflow-hidden w-[400px] tmd:w-[calc(100%-24px)] rounded-[12px] border border-theme-7 dark:border-theme-3 bg-theme-9 dark:bg-theme-2 animate-zoom-in">
                        <div className="relative w-[100%] h-[52px] flex flex-row justify-between items-center px-[20px]">
                            <div className="text-[14px] text-theme-5 dark:text-theme-7 mt-px">신고하기</div>
                            <button onClick={close} className="w-[36px] h-[24px] rounded-[6px] absolute right-[16px] tmd:right-[12px] top-[50%] translate-y-[-50%] text-[10px] leading-none text-theme-5 dark:text-theme-8 bg-theme-8 dark:bg-theme-3/80 hover:dark:bg-theme-4/60 tlg:hover:dark:bg-theme-3/80 hover:drop-shadow-default hover:dark:drop-shadow-dark tlg:hover:drop-shadow-none tlg:hover:dark:drop-shadow-none">ESC</button>
                        </div>
                        <div className="w-[100%] p-[20px] bg-theme-4 dark:bg-theme-blue-2">
                            <h2 className="font-bold text-[16px] text-theme-9 mb-[8px]">어떤 사유로 신고하시는지 알려주세요.</h2>
                            <div>
                                <label htmlFor="report-nickname" className="flex items-start fill-theme-yellow dark:fill-theme-blue-1 text-theme-8 dark:text-theme-7 cursor-pointer">
                                    <input type="checkbox" id="report-nickname" className="peer hidden"/>
                                    <svg className="block peer-checked:hidden w-[16px] mt-[2px]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
                                        <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/>
                                        <path d="M10.97 4.97a.75.75 0 0 1 1.071 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.235.235 0 0 1 .02-.022z"/>
                                    </svg>
                                    <svg className="hidden peer-checked:block w-[16px] mt-[2px]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
                                        <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm10.03 4.97a.75.75 0 0 1 .011 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.75.75 0 0 1 1.08-.022z"/>
                                    </svg>
                                    <div className="text-[14px] ml-[6px]">
                                        <div>부적절한 닉네임</div>
                                        <div className="text-theme-6 dark:text-theme-5">선정적이거나, 폭력적인 뜻이 내포된 닉네임 사용</div>
                                    </div>
                                </label>
                                <label htmlFor="report-propaganda" className="flex items-start mt-[8px] fill-theme-yellow dark:fill-theme-blue-1 text-theme-8 dark:text-theme-7 cursor-pointer">
                                    <input type="checkbox" id="report-propaganda" className="peer hidden"/>
                                    <svg className="block peer-checked:hidden w-[16px] mt-[2px]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
                                        <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/>
                                        <path d="M10.97 4.97a.75.75 0 0 1 1.071 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.235.235 0 0 1 .02-.022z"/>
                                    </svg>
                                    <svg className="hidden peer-checked:block w-[16px] mt-[2px]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
                                        <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm10.03 4.97a.75.75 0 0 1 .011 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.75.75 0 0 1 1.08-.022z"/>
                                    </svg>
                                    <div className="text-[14px] ml-[6px]">
                                        <div>선동적인 발언</div>
                                        <div className="text-theme-6 dark:text-theme-5">정치적, 문화적으로 편향적인 발언</div>
                                    </div>
                                </label>
                                <label htmlFor="report-lang" className="flex items-start mt-[8px] fill-theme-yellow dark:fill-theme-blue-1 text-theme-8 dark:text-theme-7 cursor-pointer">
                                    <input type="checkbox" id="report-lang" className="peer hidden"/>
                                    <svg className="block peer-checked:hidden w-[16px] mt-[2px]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
                                        <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/>
                                        <path d="M10.97 4.97a.75.75 0 0 1 1.071 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.235.235 0 0 1 .02-.022z"/>
                                    </svg>
                                    <svg className="hidden peer-checked:block w-[16px] mt-[2px]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
                                        <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm10.03 4.97a.75.75 0 0 1 .011 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.75.75 0 0 1 1.08-.022z"/>
                                    </svg>
                                    <div className="text-[14px] ml-[6px]">
                                        <div>욕설</div>
                                        <div className="text-theme-6 dark:text-theme-5">공격적인 언어 사용</div>
                                    </div>
                                </label>
                            </div>
                            <div className="w-[100%] h-px bg-theme-5 my-[16px]"></div>
                            <div className="flex justify-between mt-[12px]">
                                <button onClick={close} className='w-[calc(50%-5px)] h-[40px] pt-px rounded-[8px] flex flex-row justify-center items-center text-[14px] font-medium text-theme-10 dark:text-theme-8 bg-theme-5/80 hover:bg-theme-5 tlg:hover:bg-theme-5/80 dark:bg-theme-3/80 hover:dark:bg-theme-3 tlg:hover:dark:bg-theme-3/80'>취소</button>
                                <button onClick={reportComment} className='w-[calc(50%-5px)] h-[40px] pt-px rounded-[8px] flex flex-row justify-center items-center text-[14px] font-medium text-theme-4 dark:text-theme-blue-2 bg-theme-yellow/80 hover:bg-theme-yellow tlg:hover:bg-theme-yellow/80 dark:bg-theme-blue-1/80 hover:dark:bg-theme-blue-1 tlg:hover:dark:bg-theme-blue-1/80'>확인</button>
                            </div>
                        </div>
                    </div>
                </div> : <></>
            }
        </>
    )
}