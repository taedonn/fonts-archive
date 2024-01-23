// react
import React, { useState, useEffect, useRef } from "react";

// libraries
import axios from "axios";

// components
import Button from "@/components/button";

// common
import { onMouseDown, onMouseUp, onMouseOut } from "@/libs/common";

interface ReportCommentModal {
    display: boolean,
    close: () => void,
    font_id: number,
    user: any,
    comment_id: number,
}

export default function ReportCommentModal({
    display,
    close,
    font_id,
    user,
    comment_id,
}: ReportCommentModal) {
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
                location.reload();

                // 로딩 바 정지
                setIsLoading(false);
            })
            .catch(err => console.log(err));

            // 모달창 닫기
            reportClose();
        }
    }

    /** Alert 닫기 */
    const closeAlert = () => { setReportWarning(false); }

    return (
        <>
            {
                display
                && <div className="w-full h-full fixed left-0 top-0 z-40 pt-24 tlg:pt-16 tlg:px-4 flex flex-col justify-start items-center backdrop-blur">
                    <div ref={thisModal} className="w-96 txs:w-full p-6 relative rounded-lg animate-zoom-in drop-shadow-default dark:drop-shadow-dark bg-l-e dark:bg-d-3">
                        <div className="w-full flex flex-col">
                            <div className="font-medium text-l-2 dark:text-white">신고하기</div>
                            <button onClick={close} onMouseDown={e => onMouseDown(e, 0.9, true)} onMouseUp={onMouseUp} onMouseOut={onMouseOut} className="w-8 h-8 absolute right-3 top-3 rounded-full text-l-2 dark:text-white hover:bg-l-d hover:dark:bg-d-6 tlg:hover:bg-transparent tlg:hover:dark:bg-transparent">
                                <i className="fa-solid fa-xmark"></i>
                            </button>
                            <div className="w-full mt-5 p-5 rounded-lg text-l-2 dark:text-white bg-l-d dark:bg-d-4">
                                <h2 className="font-medium mb-4">어떤 사유로 신고하시는지 알려주세요.</h2>
                                <div className="flex flex-col">
                                    <label htmlFor="report-nickname" className="flex items-center cursor-pointer">
                                        <input onChange={reportNicknameChk} type="checkbox" id="report-nickname" className="peer hidden"/>
                                        <i className="block peer-checked:hidden text-lg leading-none text-h-1 dark:text-f-8 fa-regular fa-square-check"></i>
                                        <i className="hidden peer-checked:block text-lg leading-none text-h-1 dark:text-f-8 fa-solid fa-square-check"></i>
                                        <div className="font-medium ml-2 select-none">부적절한 닉네임</div>
                                    </label>
                                    <div className="text-sm ml-6 mt-1 text-l-5 dark:text-d-c">선정적이거나, 폭력적인 뜻이 내포된 닉네임</div>
                                    <label htmlFor="report-propaganda" className="mt-4 flex items-center cursor-pointer">
                                        <input onChange={reportPoliticsChk} type="checkbox" id="report-propaganda" className="peer hidden"/>
                                        <i className="block peer-checked:hidden text-lg leading-none text-h-1 dark:text-f-8 fa-regular fa-square-check"></i>
                                        <i className="hidden peer-checked:block text-lg leading-none text-h-1 dark:text-f-8 fa-solid fa-square-check"></i>
                                        <div className="font-medium ml-2 select-none">선동적인 발언</div>
                                    </label>
                                    <div className="text-sm ml-6 mt-1 text-l-5 dark:text-d-c">정치적, 문화적으로 편향된 발언</div>
                                    <label htmlFor="report-lang" className="mt-4 flex items-center cursor-pointer">
                                        <input onChange={reportSwearingChk} type="checkbox" id="report-lang" className="peer hidden"/>
                                        <i className="block peer-checked:hidden text-lg leading-none text-h-1 dark:text-f-8 fa-regular fa-square-check"></i>
                                        <i className="hidden peer-checked:block text-lg leading-none text-h-1 dark:text-f-8 fa-solid fa-square-check"></i>
                                        <div className="font-medium ml-2 select-none">욕설</div>
                                    </label>
                                    <div className="text-sm ml-6 mt-1 text-l-5 dark:text-d-c">공격적, 폭력적인 언어 사용</div>
                                    <label htmlFor="report-etc" className="mt-4 flex items-center cursor-pointer">
                                        <input onChange={reportEtcChk} type="checkbox" id="report-etc" className="peer hidden"/>
                                        <i className="block peer-checked:hidden text-lg leading-none text-h-1 dark:text-f-8 fa-regular fa-square-check"></i>
                                        <i className="hidden peer-checked:block text-lg leading-none text-h-1 dark:text-f-8 fa-solid fa-square-check"></i>
                                        <div className="font-medium ml-2 select-none">기타</div>
                                    </label>
                                    <div className="text-sm ml-6 mt-1 text-l-5 dark:text-d-c">자세한 사유는 상세 입력칸에 적어주세요.</div>
                                    <textarea onChange={reportTextChk} placeholder="사유는 최대한 자세하게 기입해주세요..." className="custom-sm-scrollbar w-full h-24 resize-none mt-4 px-3 py-2 text-sm border-2 rounded-lg bg-l-e dark:bg-d-3 border-l-b dark:border-d-6 focus:border-h-1 focus:dark:border-f-8 text-l-2 dark:text-white placeholder-l-5 dark:placeholder-d-c"></textarea>
                                </div>
                                {
                                    reportWarning
                                    && <div className="flex">
                                        <div className='w-full h-10 px-2.5 mt-3 flex justify-between items-center rounded-lg border-2 border-h-r text-xs text-l-2 dark:text-white bg-h-r/20'>
                                            <div className='flex items-center'>
                                                <i className="text-sm text-h-r fa-regular fa-bell"></i>
                                                <div className='ml-2'>신고 사유를 하나 이상 선택해주세요.</div>
                                            </div>
                                            <div onClick={closeAlert} className='flex justify-center items-center cursor-pointer'>
                                                <i className="text-sm text-l-2 dark:text-white fa-solid fa-xmark"></i>
                                            </div>
                                        </div>
                                    </div>
                                }
                            </div>
                            <div className="flex justify-between gap-2 mt-4">
                                <div className="w-1/2">
                                    <Button color="gray">
                                        <button onClick={reportClose} className='w-full h-full'>취소</button>
                                    </Button>
                                </div>
                                <div className="w-1/2">
                                    <Button>
                                        <button onClick={reportComment} className='w-full h-full'>
                                            {
                                                isLoading
                                                ? <span className='loader border-2 border-h-e dark:border-d-6 border-b-h-1 dark:border-b-f-8 w-4 h-4'></span>
                                                : <>확인</>
                                            }
                                        </button>
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