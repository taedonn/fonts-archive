// react hooks
import React, { useState, useEffect, useRef } from "react";

// hooks
import axios from "axios";

export default function ReportCommentModal(
    {
        display,
        close,
        font_id,
        user,
        comment_id,
        update,
        update_reports
    }:
    {
        display: boolean, 
        close: any,
        font_id: number,
        user: any,
        comment_id: number,
        update: any,
        update_reports: any
    }
) {
    // 신고 모달창 state
    const [reportNickname, setReportNickname] = useState<boolean>(false);
    const [reportPolitics, setReportPolitics] = useState<boolean>(false);
    const [reportSwearing, setReportSwearing] = useState<boolean>(false);
    const [reportEtc, setReportEtc] = useState<boolean>(false);
    const [reportText, setReportText] = useState<string>('');
    const [reportWarning, setReportWarning] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    /** 신고 모달창 닫기 */
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const reportClose = () => {
        // state 초기화
        setReportNickname(false);
        setReportPolitics(false);
        setReportSwearing(false);
        setReportEtc(false);
        setReportText('');
        setReportWarning(false);

        // 모달창 닫기
        close();
    }

    // 댓글 삭제 Ref
    const thisModal = useRef<HTMLDivElement>(null);

    // 모달창 외 영역 클릭 시 모달창 닫기
    useEffect(() => {
        function handleSearchOutside(e:Event) {
            if (thisModal?.current && !thisModal.current.contains(e.target as Node)) {
                reportClose();
            }
        }
        document.addEventListener("mouseup", handleSearchOutside);
        return () => document.removeEventListener("mouseup", handleSearchOutside);
    },[reportClose, thisModal]);

    // ESC키 입력 시 모달창 닫기 & Enter키 입력 시 댓글 삭제
    useEffect(() => {
        const keys: any = [];
        const handleKeydown = (e: KeyboardEvent) => {
            keys[e.key] = true;
            if (display === true && keys["Escape"]) { reportClose(); }
            // if (display === true && keys["Enter"]) { reportComment();  }
        }
        const handleKeyup = (e: KeyboardEvent) => {keys[e.key] = false;}

        window.addEventListener("keydown", handleKeydown, false);
        window.addEventListener("keyup", handleKeyup, false);

        return () => {
            window.removeEventListener("keydown", handleKeydown);
            window.removeEventListener("keyup", handleKeyup);
        }
    });

    /** 부적절한 닉네임 신고 state */
    const reportNicknameChk = (e:React.ChangeEvent<HTMLInputElement>) => {
        setReportNickname(e.target.checked);
        if (e.target.checked) { setReportWarning(false); }
    }

    /** 선동적인 발언 신고 state  */
    const reportPoliticsChk = (e:React.ChangeEvent<HTMLInputElement>) => {
        setReportPolitics(e.target.checked);
        if (e.target.checked) { setReportWarning(false); }
    }

    /** 욕설 신고 state  */
    const reportSwearingChk = (e:React.ChangeEvent<HTMLInputElement>) => {
        setReportSwearing(e.target.checked);
        if (e.target.checked) { setReportWarning(false); }
    }

    /** 기타 신고 state  */
    const reportEtcChk = (e:React.ChangeEvent<HTMLInputElement>) => {
        setReportEtc(e.target.checked);
        if (e.target.checked) { setReportWarning(false); }
    }

    /** 사유 state */
    const reportTextChk = (e:React.ChangeEvent<HTMLTextAreaElement>) => { setReportText(e.target.value); }

    /** 댓글 신고 */
    const reportComment = async () => {
        // 최소 한개 이상 체크되어있는지 유효성 검사
        if (
            !reportNickname && 
            !reportPolitics && 
            !reportSwearing &&
            !reportEtc
        ) {
            setReportWarning(true);
        } else {
            // 로딩 바 실행
            setIsLoading(true);

            // 신고 axios 실행
            await axios.post('/api/detailpage/comments', {
                action: 'report-comment',
                // action: 'reset-reports',
                font_id: font_id,
                user_id: user.user_no,
                comment_id: comment_id,
                report_nickname: reportNickname,
                report_politics: reportPolitics,
                report_swearing: reportSwearing,
                report_etc: reportEtc,
                report_text: reportText
            })
            .then(async (res) => {
                console.log(res.data.message);
                update(res.data.comments);
                update_reports(res.data.reports);

                // 로딩 바 정지
                setIsLoading(false);
            })
            .catch(err => console.log(err));

            // 모달창 닫기
            reportClose();
        }
    }

    return (
        <>
            {
                display === true
                ? <div className="w-[100%] h-[100vh] fixed left-0 top-0 z-40 flex flex-col justify-start items-center pt-[12vh] tlg:pt-[10vh] tmd:pt-[60px] backdrop-blur bg-blur-theme dark:border-theme-4">
                    <div ref={thisModal} className="overflow-hidden w-[400px] tmd:w-[calc(100%-24px)] rounded-[12px] border border-theme-7 dark:border-theme-3 bg-theme-9 dark:bg-theme-2 animate-zoom-in">
                        <div className="relative w-[100%] h-[52px] flex flex-row justify-between items-center px-[20px]">
                            <div className="text-[14px] text-theme-5 dark:text-theme-7 mt-px">신고하기</div>
                            <button onClick={close} className="w-[36px] h-[24px] rounded-[6px] absolute right-[16px] tmd:right-[12px] top-[50%] translate-y-[-50%] text-[10px] leading-none text-theme-4 dark:text-theme-8 bg-theme-8 dark:bg-theme-3/80 hover:dark:bg-theme-4/60 tlg:hover:dark:bg-theme-3/80 hover:drop-shadow-default hover:dark:drop-shadow-dark tlg:hover:drop-shadow-none tlg:hover:dark:drop-shadow-none">ESC</button>
                        </div>
                        <div className="w-[100%] p-[20px] bg-theme-4 dark:bg-theme-blue-2">
                            <h2 className="font-bold text-[16px] text-theme-9 mb-[16px]">어떤 사유로 신고하시는지 알려주세요.</h2>
                            <div>
                                <label htmlFor="report-nickname" className="flex items-start fill-theme-yellow dark:fill-theme-blue-1 text-theme-8 dark:text-theme-7 cursor-pointer">
                                    <input onChange={reportNicknameChk} type="checkbox" id="report-nickname" className="peer hidden"/>
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
                                    <input onChange={reportPoliticsChk} type="checkbox" id="report-propaganda" className="peer hidden"/>
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
                                    <input onChange={reportSwearingChk} type="checkbox" id="report-lang" className="peer hidden"/>
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
                                    <input onChange={reportEtcChk} type="checkbox" id="report-etc" className="peer hidden"/>
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
                                <textarea onChange={reportTextChk} id="report-textarea" placeholder="사유는 최대한 자세하게 기입해주세요..." className="w-[100%] h-[80px] resize-none mt-[12px] px-[12px] py-[8px] text-[14px] border rounded-[6px] border-theme-6 focus:border-theme-8 hover:border-theme-8 tlg:hover:border-theme-6 dark:border-theme-4 focus:dark:border-theme-6 hover:dark:border-theme-6 tlg:hover:dark:border-theme-4 bg-transparent dark:bg-theme-2 text-theme-8 dark:text-theme-7 placeholder-theme-6 dark:placeholder-theme-5"></textarea>
                            </div>
                            {
                                reportWarning
                                ? <div className="mt-[10px] flex">
                                    <svg className='w-[14px] mb-px mr-[6px] fill-theme-red' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/><path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/></svg>
                                    <div className="text-[12px] text-theme-red">신고 사유를 하나 이상 선택해주세요.</div>
                                </div>
                                : <div className="mt-[10px]"></div>
                            }
                            <div className="w-[100%] h-px bg-theme-5 mt-[6px] mb-[16px]"></div>
                            <div className="flex justify-between mt-[12px]">
                                <button onClick={reportClose} className='w-[calc(50%-5px)] h-[40px] pt-px rounded-[8px] flex flex-row justify-center items-center text-[14px] font-medium text-theme-10 dark:text-theme-8 bg-theme-5/80 hover:bg-theme-5 tlg:hover:bg-theme-5/80 dark:bg-theme-3/80 hover:dark:bg-theme-3 tlg:hover:dark:bg-theme-3/80'>취소</button>
                                <button onClick={reportComment} className='w-[calc(50%-5px)] h-[40px] pt-px rounded-[8px] flex flex-row justify-center items-center text-[14px] font-medium text-theme-4 dark:text-theme-blue-2 bg-theme-yellow/80 hover:bg-theme-yellow tlg:hover:bg-theme-yellow/80 dark:bg-theme-blue-1/80 hover:dark:bg-theme-blue-1 tlg:hover:dark:bg-theme-blue-1/80'>
                                    {
                                        isLoading
                                        ? <span className='loader loader-register w-[18px] h-[18px] mb-px'></span>
                                        : <>확인</>
                                    }
                                </button>
                            </div>
                        </div>
                    </div>
                </div> : <></>
            }
        </>
    )
}