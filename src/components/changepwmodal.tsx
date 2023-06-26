// react hooks
import React, { useEffect, useRef, useState } from "react";

// hooks
import axios from "axios";

export default function ChangePwModal(
    {
        display,
        close,
    }:
    {
        display: boolean, 
        close: any,
    }
) {
    // 모달창 영역 Ref
    const refSearchOutside = useRef<HTMLDivElement>(null);

    // 모달창 외 영역 클릭 시 모달창 닫기
    useEffect(() => {
        function handleSearchOutside(e:Event) {
            if (refSearchOutside?.current && !refSearchOutside.current.contains(e.target as Node)) {
                setCurrentPwVal('');
                setCurrentPwChk('');
                setNewPwVal('');
                setNewPwChk('');
                setNewPwConfirmVal('');
                setNewPwConfirmChk('');
                close();
            }
        }
        document.addEventListener("mouseup", handleSearchOutside);
        return () => document.removeEventListener("mouseup", handleSearchOutside);
    },[close, refSearchOutside]);

    // ESC키 입력 시 모달창 닫기
    useEffect(() => {
        const keys: any = [];
        const handleKeydown = (e: KeyboardEvent) => { keys[e.key] = true; 
            if (display === true && keys["Escape"]) {
                setCurrentPwVal('');
                setCurrentPwChk('');
                setNewPwVal('');
                setNewPwChk('');
                setNewPwConfirmVal('');
                setNewPwConfirmChk('');
                close();
            }
        }
        const handleKeyup = (e: KeyboardEvent) => {keys[e.key] = false;}

        window.addEventListener("keydown", handleKeydown, false);
        window.addEventListener("keyup", handleKeyup, false);

        return () => {
            window.removeEventListener("keydown", handleKeydown);
            window.removeEventListener("keyup", handleKeyup);
        }
    });

    // 인풋 state
    const [currentPwVal, setCurrentPwVal] = useState<string>('');
    const [currentPwChk, setCurrentPwChk] = useState<string>('');
    const [newPwVal, setNewPwVal] = useState<string>('');
    const [newPwChk, setNewPwChk] = useState<string>('');
    const [newPwConfirmVal, setNewPwConfirmVal] = useState<string>('');
    const [newPwConfirmChk, setNewPwConfirmChk] = useState<string>('');

    /** 현재 비밀번호 인풋 Change Event */
    const handleCurrentPwChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCurrentPwChk('');
        setCurrentPwVal(e.target.value);
    }

    /** 새 비밀번호 입력 인풋 Change Event */
    const handleNewPwChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewPwChk('');
        setNewPwVal(e.target.value);
    }

    /** 새 비밀번호 확인 인풋 Change Event */
    const handleNewPwConfirmChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewPwConfirmChk('');
        setNewPwConfirmVal(e.target.value);
    }

    /** 비밀번호 변경 버튼 클릭 */
    const handlePwChangeClick = async () => {

    }

    /** 비밀번호 유효성 검사 */
    const handlePwValidChk = () => {
        // 비밀번호 패턴
        const pwPattern = /^(?=.*?[a-zA-Z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,20}$/;

        
    }

    /** 비밀번호 변경 인풋 유효성 체크 */

    return (
        <>
            {
                display === true
                ? <div className="w-[100%] h-[100vh] fixed left-0 top-0 z-40 flex flex-col justify-start items-center pt-[12vh] tlg:pt-[10vh] tmd:pt-[60px] backdrop-blur bg-blur-theme dark:border-theme-4">
                    <div ref={refSearchOutside} className="overflow-hidden w-[400px] tmd:w-[calc(100%-24px)] rounded-[12px] border border-theme-7 dark:border-theme-3 bg-theme-9 dark:bg-theme-2 animate-zoom-in">
                        <div className="relative w-[100%] h-[52px] flex flex-row justify-between items-center px-[20px]">
                            <div className="text-[14px] text-theme-5 dark:text-theme-7 mt-px">비밀번호 변경 안내</div>
                            <button onClick={close} className="w-[36px] h-[24px] rounded-[6px] absolute right-[16px] tmd:right-[12px] top-[50%] translate-y-[-50%] text-[10px] leading-none text-theme-5 dark:text-theme-8 bg-theme-8 dark:bg-theme-3/80 hover:dark:bg-theme-4/60 tlg:hover:dark:bg-theme-3/80 hover:drop-shadow-default hover:dark:drop-shadow-dark tlg:hover:drop-shadow-none tlg:hover:dark:drop-shadow-none">ESC</button>
                        </div>
                        <div className="w-[100%] p-[20px] bg-theme-8 dark:bg-theme-blue-2">
                            <div className="text-[14px] text-theme-4 dark:text-theme-9">현재 비밀번호</div>
                            <input onChange={handleCurrentPwChange} id="current-pw" type="text" placeholder="현재 비밀번호를 입력해 주세요." className={`${currentPwChk === '' ? 'border-theme-4 focus:border-theme-yellow dark:border-theme-5 focus:dark:border-theme-blue-1' : 'border-theme-red focus:border-theme-red dark:border-theme-red focus:dark:border-theme-red'} w-[100%] text-[14px] text-theme-10 dark:text-theme-9 px-[14px] py-[8px] mt-[6px] rounded-[8px] border placeholder-theme-7 dark:placeholder-theme-6 bg-theme-4 dark:bg-theme-blue-2 autofill:bg-theme-4 autofill:dark:bg-theme-blue-2`}/>
                            {
                                currentPwChk === ''
                                ? <></>
                                : ( currentPwChk === 'empty'
                                    ? <span className='block text-[12px] text-theme-red mt-[4px] ml-[16px]'>비밀번호를 입력해 주세요.</span>
                                    : <span className='block text-[12px] text-theme-red mt-[4px] ml-[16px]'>비밀번호가 일치하지 않습니다.</span>
                                )
                            }
                            <div className="text-[14px] text-theme-4 dark:text-theme-9 mt-[20px]">새 비밀번호 입력</div>
                            <input onChange={handleNewPwChange} id="new-pw" type="text" placeholder='새 비밀번호를 입력해 주세요.' className={`${newPwChk === '' ? 'border-theme-4 focus:border-theme-yellow dark:border-theme-5 focus:dark:border-theme-blue-1' : 'border-theme-red focus:border-theme-red dark:border-theme-red focus:dark:border-theme-red'} w-[100%] text-[14px] text-theme-10 dark:text-theme-9 px-[14px] py-[8px] mt-[6px] rounded-[8px] border placeholder-theme-7 dark:placeholder-theme-6 bg-theme-4 dark:bg-theme-blue-2 autofill:bg-theme-4 autofill:dark:bg-theme-blue-2`}/>
                            {
                                newPwChk === ''
                                ? <></>
                                : ( newPwChk === 'empty'
                                    ? <span className='block text-[12px] text-theme-red mt-[4px] ml-[16px]'>새 비밀번호를 입력해 주세요.</span>
                                    : <span className='block text-[12px] text-theme-red mt-[4px] ml-[16px]'>비밀번호 형식이 올바르지 않습니다.</span>
                                )
                            }
                            <div className="text-[14px] text-theme-4 dark:text-theme-9 mt-[20px]">새 비밀번호 확인</div>
                            <input onChange={handleNewPwConfirmChange} id="new-pw-confirm" type="text" placeholder="새 비밀번호를 재입력해 주세요." className={`${newPwConfirmChk === '' ? 'border-theme-4 focus:border-theme-yellow dark:border-theme-5 focus:dark:border-theme-blue-1' : 'border-theme-red focus:border-theme-red dark:border-theme-red focus:dark:border-theme-red'} w-[100%] text-[14px] text-theme-10 dark:text-theme-9 px-[14px] py-[8px] mt-[6px] rounded-[8px] border placeholder-theme-7 dark:placeholder-theme-6 bg-theme-4 dark:bg-theme-blue-2 autofill:bg-theme-4 autofill:dark:bg-theme-blue-2`}/>
                            {
                                newPwConfirmChk === ''
                                ? <></>
                                : ( newPwConfirmChk === 'empty'
                                    ? <span className='block text-[12px] text-theme-red mt-[4px] ml-[16px]'>새 비밀번호를 재입력해 주세요.</span>
                                    : <span className='block text-[12px] text-theme-red mt-[4px] ml-[16px]'>새 비밀번호와 일치하지 않습니다.</span>
                                )
                            }
                            <div className="w-[100%] h-px bg-theme-6 dark:bg-theme-5 mt-[16px]"></div>
                            <h2 className="font-bold text-[16px] text-theme-4 dark:text-theme-9 mt-[32px]">비밀번호 변경 시 유의사항</h2>
                            <div className='w-[100%] flex flex-row justify-start items-start text-[12px] text-theme-5 dark:text-theme-7 mt-[4px]'>
                                <svg className='w-[12px] mt-[3px] mr-[6px] fill-theme-yellow dark:fill-theme-blue-1' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/><path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/></svg>
                                <div>영문, 숫자, 특수문자 포함 8~20자를 조합해 만들어 주세요.</div>
                            </div>
                            <div className='w-[100%] flex flex-row justify-start items-start text-[12px] text-theme-5 dark:text-theme-7 mt-[4px]'>
                                <svg className='w-[12px] mt-[3px] mr-[6px] fill-theme-yellow dark:fill-theme-blue-1' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/><path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/></svg>
                                <div>비밀번호 변경 완료 시, 비밀번호는 즉시 변경됩니다.</div>
                            </div>
                            <button onClick={handlePwChangeClick} className='w-[100%] h-[40px] rounded-[8px] mt-[14px] text-[14px] font-medium text-theme-4 dark:text-theme-blue-2 bg-theme-yellow/80 hover:bg-theme-yellow tlg:hover:bg-theme-yellow/80 dark:bg-theme-blue-1/80 hover:dark:bg-theme-blue-1 tlg:hover:dark:bg-theme-blue-1/80'>비밀번호 변경하기</button>
                        </div>
                    </div>
                </div> : <></>
            }
        </>
    )
}