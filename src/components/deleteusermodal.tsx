// react hooks
import React, { useEffect, useRef, useState } from "react";

// hooks
import axios from "axios";
import { useCookies } from "react-cookie";

export default function DeleteUserModal(
    {
        display,
        close,
        id,
    }:
    {
        display: boolean, 
        close: any,
        id: string,
    }
) {
    // 쿠키 훅
    const [, , removeCookies] = useCookies<string>([]);

    // 모달창 영역 Ref
    const refSearchOutside = useRef<HTMLDivElement>(null);

    // 모달창 외 영역 클릭 시 모달창 닫기
    useEffect(() => {
        function handleSearchOutside(e:Event) {
            if (refSearchOutside?.current && !refSearchOutside.current.contains(e.target as Node)) {
                setInputVal('');
                setInputChk('');
                close();
            }
        }
        document.addEventListener("mouseup", handleSearchOutside);
        return () => document.removeEventListener("mouseup", handleSearchOutside);
    },[close, refSearchOutside]);

    // ESC키 입력 시 모달창 닫기
    useEffect(() => {
        const keys: any = [];
        const handleKeydown = (e: KeyboardEvent) => {
            keys[e.key] = true;
            if (display === true && keys["Escape"]) {
                setInputVal('');
                setInputChk('');
                close();
            }
            if (display === true && keys["Enter"]) { handleDeleteBtnClick(); }
        }
        const handleKeyup = (e: KeyboardEvent) => {keys[e.key] = false;}

        window.addEventListener("keydown", handleKeydown, false);
        window.addEventListener("keyup", handleKeyup, false);

        return () => {
            window.removeEventListener("keydown", handleKeydown);
            window.removeEventListener("keyup", handleKeyup);
        }
    });

    // 회원 탈퇴 인풋 state
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [inputVal, setInputVal] = useState<string>('');
    const [inputChk, setInputChk] = useState<string>('');

    /** 회원 탈퇴 인풋 value */
    const handleDeleteValChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputChk('');
        setInputVal(e.target.value);
    }

    /** 회원 탈퇴 버튼 클릭 */
    const handleDeleteBtnClick = async () => {
        // 로딩 스피너 실행
        setIsLoading(true);
        
        if (inputVal === '') {
            // "입력칸이 비어있습니다." 표시
            setInputChk('empty');

            // 로딩 스피너 정지
            setIsLoading(false);
        }
        else if (inputVal !== id + '/탈퇴한다') {
            // "입력값이 일치하지 않습니다." 표시
            setInputChk('wrong-val');

            // 로딩 스피너 정지
            setIsLoading(false);
        }
        else {
            await axios.post('/api/user/deleteuser', null, { params: { id: id } })
            .then((res) => {
                removeCookies('session', { path: '/' });
                location.href = '/';
                console.log(res.data);
            })
            .catch(err => {
                console.log(err);

                // 로딩 스피너 정지
                setIsLoading(false);
            });
        }
    }

    return (
        <>
            {
                display === true
                ? <div className="w-[100%] h-[100vh] fixed left-0 top-0 z-40 flex flex-col justify-start items-center pt-[12vh] tlg:pt-[10vh] tmd:pt-[60px] backdrop-blur bg-blur-theme dark:border-theme-4">
                    <div ref={refSearchOutside} className="overflow-hidden w-[400px] tmd:w-[calc(100%-24px)] rounded-[12px] border border-theme-7 dark:border-theme-3 bg-theme-9 dark:bg-theme-2 animate-zoom-in">
                        <div className="relative w-[100%] h-[52px] flex flex-row justify-between items-center px-[20px]">
                            <div className="text-[14px] text-theme-5 dark:text-theme-7 mt-px">정말 탈퇴 하시겠습니까?</div>
                            <button onClick={close} className="w-[36px] h-[24px] rounded-[6px] absolute right-[16px] tmd:right-[12px] top-[50%] translate-y-[-50%] text-[10px] leading-none text-theme-5 dark:text-theme-8 bg-theme-8 dark:bg-theme-3/80 hover:dark:bg-theme-4/60 tlg:hover:dark:bg-theme-3/80 hover:drop-shadow-default hover:dark:drop-shadow-dark tlg:hover:drop-shadow-none tlg:hover:dark:drop-shadow-none">ESC</button>
                        </div>
                        <div className="w-[100%] p-[20px] bg-theme-8 dark:bg-theme-blue-2">
                            <h2 className="font-bold text-[16px] text-theme-4 dark:text-theme-9 mb-[8px]">회원 탈퇴 시 유의사항</h2>
                            <div className='w-[100%] flex flex-row justify-start items-start mb-[4px] text-[12px] text-theme-5 dark:text-theme-7'>
                                <svg className='w-[12px] mt-[3px] mr-[6px] fill-theme-red' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/><path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/></svg>
                                <div>탈퇴 시 계정의 모든 정보는 삭제됩니다.</div>
                            </div>
                            <div className='w-[100%] flex flex-row justify-start items-start text-[12px] text-theme-5 dark:text-theme-7'>
                                <svg className='w-[12px] mt-[3px] mr-[6px] fill-theme-red' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/><path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/></svg>
                                <div>재가입 시에도 삭제된 정보는 복구되지 않습니다.</div>
                            </div>
                            <div className="w-[100%] h-px bg-theme-5 mt-[16px]"></div>
                            <h2 className="font-bold text-[16px] text-theme-4 dark:text-theme-9 mt-[32px]">탈퇴하기</h2>
                            <div className="text-[12px] text-theme-5 dark:text-theme-7 flex flex-row justify-start items-center mt-[6px]">
                                아래 문구를 정확히 입력 후 탈퇴하기 버튼을 눌러주세요.
                            </div>
                            <input onChange={handleDeleteValChange} id="delete-confirm" type="text" placeholder={`${id}/탈퇴한다`} className={`${inputChk === '' ? 'border-theme-4 focus:border-theme-yellow dark:border-theme-5 focus:dark:border-theme-blue-1' : 'border-theme-red focus:border-theme-red dark:border-theme-red focus:dark:border-theme-red'} w-[100%] text-[14px] text-theme-10 dark:text-theme-9 px-[14px] py-[8px] mt-[6px] rounded-[8px] border placeholder-theme-7 dark:placeholder-theme-6 bg-theme-4 dark:bg-theme-blue-2 autofill:bg-theme-4 autofill:dark:bg-theme-blue-2`}/>
                            {
                                inputChk === 'empty'
                                ? <span className='block text-[12px] text-theme-red mt-[4px] ml-[16px]'>입력칸이 비어있습니다.</span>
                                : ( inputChk === 'wrong-val'
                                    ? <span className='block text-[12px] text-theme-red mt-[4px] ml-[16px]'>입력값이 일치하지 않습니다.</span>
                                    : <></>
                                )
                            }
                            <button onClick={handleDeleteBtnClick} className='w-[100%] h-[40px] mt-[10px] rounded-[8px] flex flex-row justify-center items-center text-[14px] font-medium text-theme-10 dark:text-theme-9 bg-theme-red/80 hover:bg-theme-red tlg:hover:bg-theme-red/80'>
                                {
                                    isLoading === true
                                    ? <span className='loader loader-red w-[18px] h-[18px]'></span>
                                    : '회원 탈퇴하기'
                                }
                            </button>
                        </div>
                    </div>
                </div> : <></>
            }
        </>
    )
}