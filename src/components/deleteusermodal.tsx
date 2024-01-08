// react
import React, { useEffect, useRef, useState } from "react";

// next-auth
import { signOut } from "next-auth/react";

// libraries
import axios from "axios";

interface User {
    user_no: number,
    user_name: string,
    user_id: string,
    user_pw: string,
    user_session_id: string,
    user_email_token: string,
    user_email_confirm: boolean,
    profile_img: string,
    nickname_reported: number,
    created_at: Date,
    updated_at: Date,
}

export default function DeleteUserModal(
    {
        display,
        close,
        user,
    }:
    {
        display: boolean, 
        close: any,
        user: User,
    }
) {
    // states
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [inputVal, setInputVal] = useState<string>('');
    const [inputChk, setInputChk] = useState<string>('');

    // refs
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
        else if (inputVal !== user.user_id + '/탈퇴한다') {
            // "입력값이 일치하지 않습니다." 표시
            setInputChk('wrong-val');

            // 로딩 스피너 정지
            setIsLoading(false);
        }
        else {
            await axios.post('/api/user/updateuserinfo', {
                action: 'delete-user',
                file_name: `fonts-archive-user-${user.user_no}-profile-img.`,
                user_no: user.user_no,
            })
            .then(() => signOut({callbackUrl: "/"}))
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
                ? <div className="w-full h-full fixed left-0 top-0 z-40 flex flex-col justify-start items-center pt-[12vh] tlg:pt-[10vh] tmd:pt-[60px] backdrop-blur bg-blur-theme dark:border-theme-4">
                    <div ref={refSearchOutside} className="overflow-hidden w-[400px] tmd:w-[calc(100%-24px)] rounded-lg border border-theme-7 dark:border-theme-3 bg-theme-9 dark:bg-theme-2 animate-zoom-in">
                        <div className="relative w-full h-[52px] flex flex-row justify-between items-center px-5">
                            <div className="text-sm text-theme-5 dark:text-theme-7 mt-px">정말 탈퇴 하시겠습니까?</div>
                            <button onClick={close} className="w-9 h-6 rounded-md absolute right-4 tmd:right-3 top-1/2 -translate-y-1/2 text-xs leading-none text-theme-4 dark:text-theme-8 bg-theme-8 dark:bg-theme-3/80 hover:dark:bg-theme-4/60 tlg:hover:dark:bg-theme-3/80 hover:drop-shadow-default hover:dark:drop-shadow-dark tlg:hover:drop-shadow-none tlg:hover:dark:drop-shadow-none">ESC</button>
                        </div>
                        <div className="w-full p-5 bg-theme-8 dark:bg-theme-blue-2">
                            <h2 className="font-bold text-base text-theme-4 dark:text-theme-9 mb-2">회원 탈퇴 시 유의사항</h2>
                            <div className='w-full flex flex-row justify-start items-start mb-1.5 text-xs text-theme-5 dark:text-theme-7'>
                                <i className="text-xs mr-1.5 text-theme-red fa-regular fa-bell"></i>
                                <div>탈퇴 시 계정의 모든 정보는 삭제됩니다.</div>
                            </div>
                            <div className='w-full flex flex-row justify-start items-start text-xs text-theme-5 dark:text-theme-7'>
                                <i className="text-xs mr-1.5 text-theme-red fa-regular fa-bell"></i>
                                <div>재가입 시에도 삭제된 정보는 복구되지 않습니다.</div>
                            </div>
                            <div className="w-full h-px bg-theme-5 mt-4"></div>
                            <h2 className="font-bold text-base text-theme-4 dark:text-theme-9 mt-8">탈퇴하기</h2>
                            <div className="text-xs text-theme-5 dark:text-theme-7 flex flex-row justify-start items-center mt-1.5">
                                아래 문구를 정확히 입력 후 탈퇴하기 버튼을 눌러주세요.
                            </div>
                            <input onChange={handleDeleteValChange} id="delete-confirm" type="text" placeholder={`${user.user_id}/탈퇴한다`} className={`${inputChk === '' ? 'border-theme-4 focus:border-theme-yellow dark:border-theme-5 focus:dark:border-theme-blue-1' : 'border-theme-red focus:border-theme-red dark:border-theme-red focus:dark:border-theme-red'} w-full text-sm text-theme-10 dark:text-theme-9 px-3.5 py-2 mt-1.5 rounded-lg border-2 placeholder-theme-7 dark:placeholder-theme-6 bg-theme-4 dark:bg-theme-blue-2 autofill:bg-theme-4 autofill:dark:bg-theme-blue-2`}/>
                            {
                                inputChk === 'empty'
                                ? <span className='block text-xs text-theme-red mt-1 ml-4'>입력칸이 비어있습니다.</span>
                                : ( inputChk === 'wrong-val'
                                    ? <span className='block text-xs text-theme-red mt-1 ml-4'>입력값이 일치하지 않습니다.</span>
                                    : <></>
                                )
                            }
                            <button onClick={handleDeleteBtnClick} className='w-full h-10 mt-2.5 rounded-lg flex flex-row justify-center items-center text-sm font-medium text-theme-10 dark:text-theme-9 bg-theme-red/80 hover:bg-theme-red tlg:hover:bg-theme-red/80'>
                                {
                                    isLoading === true
                                    ? <span className='loader border-2 border-theme-5 dark:border-theme-3 border-b-theme-red dark:border-b-theme-red w-[18px] h-[18px]'></span>
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