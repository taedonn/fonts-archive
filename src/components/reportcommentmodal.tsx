// react
import React, { useState, useEffect, useRef } from "react";

// libraries
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
    // states
    const [reportNickname, setReportNickname] = useState<boolean>(false);
    const [reportPolitics, setReportPolitics] = useState<boolean>(false);
    const [reportSwearing, setReportSwearing] = useState<boolean>(false);
    const [reportEtc, setReportEtc] = useState<boolean>(false);
    const [reportText, setReportText] = useState<string>('');
    const [reportWarning, setReportWarning] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    // refs
    const thisModal = useRef<HTMLDivElement>(null);

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
            await axios.post('/api/post/comments', {
                action: 'report-comment',
                font_id: font_id,
                user_id: user.id,
                user_email: user.email,
                user_auth: user.provider,
                comment_id: comment_id,
                report_nickname: reportNickname,
                report_politics: reportPolitics,
                report_swearing: reportSwearing,
                report_etc: reportEtc,
                report_text: reportText
            })
            .then(async (res) => {
                console.log(res.data.msg);
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
                ? <div className="w-full h-full fixed left-0 top-0 z-40 flex flex-col justify-start items-center pt-[12vh] tlg:pt-[10vh] tmd:pt-[60px] backdrop-blur bg-blur-theme dark:border-theme-4">
                    <div ref={thisModal} className="overflow-hidden w-[400px] tmd:w-[calc(100%-24px)] rounded-lg border border-theme-7 dark:border-theme-3 bg-theme-9 dark:bg-theme-2 animate-zoom-in">
                        <div className="relative w-full h-[52px] flex flex-row justify-between items-center px-5">
                            <div className="text-sm text-theme-5 dark:text-theme-7 mt-px">신고하기</div>
                            <button onClick={close} className="w-9 h-6 rounded-md absolute right-4 tmd:right-3 top-1/2 -translate-y-1/2 text-xs leading-none text-theme-4 dark:text-theme-8 bg-theme-8 dark:bg-theme-3/80 hover:dark:bg-theme-4/60 tlg:hover:dark:bg-theme-3/80 hover:drop-shadow-default hover:dark:drop-shadow-dark tlg:hover:drop-shadow-none tlg:hover:dark:drop-shadow-none">ESC</button>
                        </div>
                        <div className="w-full p-5 bg-theme-4 dark:bg-theme-blue-2">
                            <h2 className="font-bold text-base text-theme-9 mb-4">어떤 사유로 신고하시는지 알려주세요.</h2>
                            <div>
                                <label htmlFor="report-nickname" className="flex items-start text-theme-8 dark:text-theme-7 cursor-pointer">
                                    <input onChange={reportNicknameChk} type="checkbox" id="report-nickname" className="peer hidden"/>
                                    <i className="block text-lg leading-5 peer-checked:hidden text-theme-yellow dark:text-theme-blue-1 fa-regular fa-square-check"></i>
                                    <i className="hidden text-lg leading-5 peer-checked:block text-theme-yellow dark:text-theme-blue-1 fa-solid fa-square-check"></i>
                                    <div className="text-sm ml-1.5">
                                        <div>부적절한 닉네임</div>
                                    </div>
                                </label>
                                <div className="text-sm ml-[22px] text-theme-6 dark:text-theme-5">선정적이거나, 폭력적인 뜻이 내포된 닉네임 사용</div>
                                <label htmlFor="report-propaganda" className="flex items-center mt-2.5 fill-theme-yellow dark:fill-theme-blue-1 text-theme-8 dark:text-theme-7 cursor-pointer">
                                    <input onChange={reportPoliticsChk} type="checkbox" id="report-propaganda" className="peer hidden"/>
                                    <i className="block text-lg leading-5 peer-checked:hidden text-theme-yellow dark:text-theme-blue-1 fa-regular fa-square-check"></i>
                                    <i className="hidden text-lg leading-5 peer-checked:block text-theme-yellow dark:text-theme-blue-1 fa-solid fa-square-check"></i>
                                    <div className="text-sm ml-1.5">
                                        <div>선동적인 발언</div>
                                    </div>
                                </label>
                                <div className="text-sm ml-[22px] text-theme-6 dark:text-theme-5">정치적, 문화적으로 편향된 발언</div>
                                <label htmlFor="report-lang" className="flex items-start mt-2.5 fill-theme-yellow dark:fill-theme-blue-1 text-theme-8 dark:text-theme-7 cursor-pointer">
                                    <input onChange={reportSwearingChk} type="checkbox" id="report-lang" className="peer hidden"/>
                                    <i className="block text-lg leading-5 peer-checked:hidden text-theme-yellow dark:text-theme-blue-1 fa-regular fa-square-check"></i>
                                    <i className="hidden text-lg leading-5 peer-checked:block text-theme-yellow dark:text-theme-blue-1 fa-solid fa-square-check"></i>
                                    <div className="text-sm ml-1.5">
                                        <div>욕설</div>
                                    </div>
                                </label>
                                <div className="text-sm ml-[22px] text-theme-6 dark:text-theme-5">공격적, 폭력적인 언어 사용</div>
                                <label htmlFor="report-etc" className="flex items-start mt-2.5 fill-theme-yellow dark:fill-theme-blue-1 text-theme-8 dark:text-theme-7 cursor-pointer">
                                    <input onChange={reportEtcChk} type="checkbox" id="report-etc" className="peer hidden"/>
                                    <i className="block text-lg leading-5 peer-checked:hidden text-theme-yellow dark:text-theme-blue-1 fa-regular fa-square-check"></i>
                                    <i className="hidden text-lg leading-5 peer-checked:block text-theme-yellow dark:text-theme-blue-1 fa-solid fa-square-check"></i>
                                    <div className="text-sm ml-1.5">
                                        <div>기타</div>
                                    </div>
                                </label>
                                <div className="text-sm ml-[22px] text-theme-6 dark:text-theme-5">자세한 사유는 상세 입력칸에 적어주세요.</div>
                                <textarea onChange={reportTextChk} placeholder="사유는 최대한 자세하게 기입해주세요..." className="custom-sm-scrollbar w-full h-20 resize-none mt-3 px-3 py-2 text-sm border rounded-md border-theme-6 focus:border-theme-8 hover:border-theme-8 tlg:hover:border-theme-6 dark:border-theme-4 focus:dark:border-theme-6 hover:dark:border-theme-6 tlg:hover:dark:border-theme-4 bg-transparent dark:bg-theme-2 text-theme-8 dark:text-theme-7 placeholder-theme-6 dark:placeholder-theme-5"></textarea>
                            </div>
                            {
                                reportWarning
                                ? <div className="mt-2.5 flex">
                                    <div className='w-full h-10 px-2.5 mb-2 flex flex-row justify-between items-center rounded-lg border-2 border-theme-red/80 dark:border-theme-red/60 text-xs bg-theme-red/20'>
                                        <div className='flex flex-row justify-start items-center text-theme-10'>
                                            <i className="text-sm text-theme-red fa-regular fa-bell"></i>
                                            <div className='ml-2'>신고 사유를 하나 이상 선택해주세요.</div>
                                        </div>
                                    </div>
                                </div>
                                : <div className="mt-2.5"></div>
                            }
                            <div className="w-full h-px bg-theme-5 mt-1.5 mb-4"></div>
                            <div className="flex justify-between mt-3">
                                <button onClick={reportClose} className='w-[calc(50%-5px)] h-10 pt-px rounded-lg flex flex-row justify-center items-center text-sm font-medium text-theme-10 dark:text-theme-8 bg-theme-5/80 hover:bg-theme-5 tlg:hover:bg-theme-5/80 dark:bg-theme-3/80 hover:dark:bg-theme-3 tlg:hover:dark:bg-theme-3/80'>취소</button>
                                <button onClick={reportComment} className='w-[calc(50%-5px)] h-10 pt-px rounded-lg flex flex-row justify-center items-center text-sm font-medium text-theme-4 dark:text-theme-blue-2 bg-theme-yellow/80 hover:bg-theme-yellow tlg:hover:bg-theme-yellow/80 dark:bg-theme-blue-1/80 hover:dark:bg-theme-blue-1 tlg:hover:dark:bg-theme-blue-1/80'>
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