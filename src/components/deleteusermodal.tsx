// react
import React, { useEffect, useRef, useState } from "react";

// next-auth
import { signOut } from "next-auth/react";

// libraries
import axios from "axios";

// components
import TextInput from "@/components/textinput";
import Button from "@/components/button";

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
                display
                && <div className="w-full h-full fixed left-0 top-0 z-40 pt-24 tlg:pt-16 tlg:px-4 flex flex-col justify-start items-center backdrop-blur">
                    <div ref={refSearchOutside} className="w-96 txs:w-full p-6 relative rounded-lg animate-zoom-in drop-shadow-default dark:drop-shadow-dark bg-l-e dark:bg-d-3">
                        <div className="w-full flex flex-col text-l-2 dark:text-white">
                            <div className="font-medium text-l-2 dark:text-white">정말 탈퇴 하시겠습니까?</div>
                            <button onClick={close} className="w-8 h-8 absolute right-3 top-3 rounded-full text-l-2 dark:text-white hover:bg-l-d hover:dark:bg-d-6 tlg:hover:bg-transparent tlg:hover:dark:bg-transparent">
                                <i className="fa-solid fa-xmark"></i>
                            </button>
                            <div className="w-full mt-5 px-5 py-4 rounded-lg text-l-2 dark:text-white bg-l-d dark:bg-d-4">
                                <h2 className="font-medium mb-2">회원 탈퇴 시 유의사항</h2>
                                <div className='w-full text-sm flex gap-1.5 items-center text-l-5 dark:text-d-c'>
                                    <div className="w-1 h-1 rounded-full bg-l-5 dark:bg-d-c"></div>
                                    <div>탈퇴 시 계정의 모든 정보는 삭제됩니다.</div>
                                </div>
                                <div className='w-full text-sm flex mt-1 gap-1.5 items-center text-l-5 dark:text-d-c'>
                                    <div className="w-1 h-1 rounded-full bg-l-5 dark:bg-d-c"></div>
                                    <div>재가입 시에도 삭제된 정보는 복구되지 않습니다.</div>
                                </div>
                            </div>
                            <h2 className="font-medium mt-8 mb-2">탈퇴하기</h2>
                            <div className="text-sm text-l-5 dark:text-d-c flex items-center">
                                아래 문구를 정확히 입력 후 탈퇴하기 버튼을 눌러주세요.
                            </div>
                            <TextInput
                                onchange={handleDeleteValChange}
                                state={inputChk}
                                stateMsg={[
                                    { state: "", msg: "" },
                                    { state: "empty", msg: "입력칸이 비어있습니다." },
                                    { state: "wrong-val", msg: "입력값이 일치하지 않습니다." },
                                ]}
                                id="delete-confirm"
                                placeholder={`${user.user_id}/탈퇴한다`}
                                isLabeled={false}
                                marginTop={0.5}
                            />
                            <Button marginTop={1} color="red">
                                <button onClick={handleDeleteBtnClick} className='w-full h-full'>
                                    {
                                        isLoading === true
                                        ? <span className='loader border-2 border-white border-b-h-r w-4 h-4'></span>
                                        : '회원 탈퇴하기'
                                    }
                                </button>
                            </Button>
                        </div>
                    </div>
                </div>
            }
        </>
    )
}