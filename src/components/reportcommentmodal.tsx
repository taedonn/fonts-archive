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
        // await axios.post('/api/detailpage/comments', {
        //     action: 'delete-comment',
        //     font_id: font_id,
        //     comment_id: comment_id
        // })
        // .then(async (res) => {
        //     console.log(res.data.message);
        //     update(res.data.comments);
        // })
        // .catch(err => console.log(err));

        // 모달창 닫기
        // close();
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
                            <h2 className="font-bold text-[16px] text-theme-9 mb-[16px]">어떤 사유로 신고하시는지 알려주세요.</h2>
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
                                    </div>
                                </label>
                                <div className="text-[14px] ml-[22px] text-theme-6 dark:text-theme-5">선정적이거나, 폭력적인 뜻이 내포된 닉네임 사용</div>
                                <label htmlFor="report-propaganda" className="flex items-center mt-[10px] fill-theme-yellow dark:fill-theme-blue-1 text-theme-8 dark:text-theme-7 cursor-pointer">
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
                                    </div>
                                </label>
                                <div className="text-[14px] ml-[22px] text-theme-6 dark:text-theme-5">정치적, 문화적으로 편향된 발언</div>
                                <label htmlFor="report-lang" className="flex items-start mt-[10px] fill-theme-yellow dark:fill-theme-blue-1 text-theme-8 dark:text-theme-7 cursor-pointer">
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
                                    </div>
                                </label>
                                <div className="text-[14px] ml-[22px] text-theme-6 dark:text-theme-5">공격적, 폭력적인 언어 사용</div>
                                <label htmlFor="report-etc" className="flex items-start mt-[10px] fill-theme-yellow dark:fill-theme-blue-1 text-theme-8 dark:text-theme-7 cursor-pointer">
                                    <input type="checkbox" id="report-etc" className="peer hidden"/>
                                    <svg className="block peer-checked:hidden w-[16px] mt-[2px]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
                                        <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/>
                                        <path d="M10.97 4.97a.75.75 0 0 1 1.071 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.235.235 0 0 1 .02-.022z"/>
                                    </svg>
                                    <svg className="hidden peer-checked:block w-[16px] mt-[2px]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
                                        <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm10.03 4.97a.75.75 0 0 1 .011 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.75.75 0 0 1 1.08-.022z"/>
                                    </svg>
                                    <div className="text-[14px] ml-[6px]">
                                        <div>기타</div>
                                    </div>
                                </label>
                                <div className="text-[14px] ml-[22px] text-theme-6 dark:text-theme-5">자세한 사유는 상세 입력칸에 적어주세요.</div>
                                <textarea id="report-textarea" placeholder="사유는 최대한 자세하게 기입해주세요..." className="w-[100%] h-[80px] resize-none mt-[12px] px-[12px] py-[8px] text-[14px] border rounded-[6px] border-theme-6 focus:border-theme-8 hover:border-theme-8 tlg:hover:border-theme-6 dark:border-theme-5 focus:dark:border-theme-7 hover:dark:border-theme-7 tlg:hover:dark:border-theme-5 bg-transparent text-theme-8 dark:text-theme-7 placeholder-theme-6 dark:placeholder-theme-5"></textarea>
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