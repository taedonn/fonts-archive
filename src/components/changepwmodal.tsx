// react
import React, { useEffect, useRef, useState } from "react";

// libraries
import axios from "axios";

// components
import TextInput from "@/components/textinput";
import Button from "@/components/button";

export default function ChangePwModal(
    {
        display,
        close,
        success,
        id,
        auth,
    }:
    {
        display: boolean, 
        close: any,
        success: any,
        id: string,
        auth: string,
    }
) {
    // states
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [currentPwVal, setCurrentPwVal] = useState<string>('');
    const [currentPwChk, setCurrentPwChk] = useState<string>('');
    const [newPwVal, setNewPwVal] = useState<string>('');
    const [newPwChk, setNewPwChk] = useState<string>('');
    const [newPwConfirmVal, setNewPwConfirmVal] = useState<string>('');
    const [newPwConfirmChk, setNewPwConfirmChk] = useState<string>('');

    // refs
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

    // ESC키 입력 시 모달창 닫기 / Enter 키 입력 시 비밀번호 변경
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

            if (display === true && keys["Enter"]) { handlePwChangeClick(); }
        }
        const handleKeyup = (e: KeyboardEvent) => {keys[e.key] = false;}

        window.addEventListener("keydown", handleKeydown, false);
        window.addEventListener("keyup", handleKeyup, false);

        return () => {
            window.removeEventListener("keydown", handleKeydown);
            window.removeEventListener("keyup", handleKeyup);
        }
    });

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
        // 비밀번호 패턴
        const pwPattern = /^(?=.*?[a-zA-Z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,20}$/;

        // 로딩 스피너 실행
        setIsLoading(true);

        // 현재 비밀번호
        let currentPw = '';
        
        await axios.get('/api/user/updateuserinfo', {
            params: {
                action: "get-current-pw",
                id: id,
                auth: auth,
            }
        })
        .then(res => {
            // 현재 비밀번호 유효성 검사
            currentPw = res.data.user.user_pw;
            if (currentPwVal === '') { setCurrentPwChk('empty'); }
            else if (currentPwVal !== currentPw) { setCurrentPwChk('invalid'); }
            else { setCurrentPwChk('success'); }

            // 새 비밀번호 유효성 검사
            if (newPwVal === '') { setNewPwChk('empty'); }
            else if (newPwVal === currentPw) { setNewPwChk('unchanged'); }
            else if (!pwPattern.test(newPwVal)) { setNewPwChk('invalid'); }
            else { setNewPwChk('success'); }

            // 새 비밀번호 재입력 유효성 검사
            if (newPwConfirmVal === '') { setNewPwConfirmChk('empty'); }
            else if (newPwConfirmVal !== newPwVal) { setNewPwConfirmChk('invalid'); }
            else { setNewPwConfirmChk('success'); }
        })
        .then(async () => {
            // 유효성 검사 통과 시 비밀번호 변경 API 호출
            if (
                currentPwVal !== '' &&
                currentPwVal === currentPw &&
                newPwVal !== '' &&
                newPwVal !== currentPw &&
                pwPattern.test(newPwVal) &&
                newPwConfirmVal !== '' &&
                newPwConfirmVal === newPwVal
            ) {
                await axios.post('/api/user/updateuserinfo', {
                    action: "change-pw",
                    id: id,
                    pw: newPwVal,
                    auth: auth,
                })
                .then(() => {
                    success();
                    close();
                })
                .then(() => {
                    setIsLoading(false);
                    setCurrentPwVal('');
                    setCurrentPwChk('');
                    setNewPwVal('');
                    setNewPwChk('');
                    setNewPwConfirmVal('');
                    setNewPwConfirmChk('');
                })
                .catch(err => console.log(err));
            } else { setIsLoading(false); }
        })
        .catch(err => console.log(err));
    }

    return (
        <>
            {
                display
                && <div className="w-full h-full fixed left-0 top-0 z-40 pt-24 tlg:pt-16 tlg:px-4 flex flex-col justify-start items-center backdrop-blur">
                    <div ref={refSearchOutside} className="w-96 txs:w-full p-6 relative rounded-lg animate-zoom-in drop-shadow-default dark:drop-shadow-dark text-l-2 dark:text-white bg-l-e dark:bg-d-3">
                        <div className="w-full flex flex-col">
                            <div className="font-medium">비밀번호 변경 안내</div>
                            <button onClick={close} className="w-8 h-8 absolute right-3 top-3 rounded-full hover:bg-l-d hover:dark:bg-d-6 tlg:hover:bg-transparent tlg:hover:dark:bg-transparent">
                                <i className="fa-solid fa-xmark"></i>
                            </button>
                            <form onSubmit={e => e.preventDefault()} className="w-full">
                                <TextInput
                                    onchange={handleCurrentPwChange}
                                    state={currentPwChk}
                                    stateMsg={[
                                        { state: "", msg: "" },
                                        { state: "empty", msg: "비밀번호를 입력해 주세요." },
                                        { state: "invalid", msg: "비밀번호가 일치하지 않습니다." },
                                    ]}
                                    type="password"
                                    id="current-pw"
                                    autocomplete="current-pw"
                                    tabindex={1}
                                    placeholder="현재 비밀번호를 입력해 주세요."
                                    label="현재 비밀번호"
                                    marginTop={2}
                                />
                                <TextInput
                                    onchange={handleNewPwChange}
                                    state={newPwChk}
                                    stateMsg={[
                                        { state: "", msg: "" },
                                        { state: "empty", msg: "새 비밀번호를 입력해 주세요." },
                                        { state: "unchanged", msg: "기존 비밀번호와 동일합니다." },
                                        { state: "invalid", msg: "비밀번호 형식이 올바르지 않습니다." },
                                    ]}
                                    type="password"
                                    id="new-pw"
                                    autocomplete="new-pw"
                                    tabindex={2}
                                    placeholder="새 비밀번호를 입력해 주세요."
                                    label="새 비밀번호 입력"
                                    marginTop={1}
                                />
                                <TextInput
                                    onchange={handleNewPwConfirmChange}
                                    state={newPwConfirmChk}
                                    stateMsg={[
                                        { state: "", msg: "" },
                                        { state: "empty", msg: "새 비밀번호를 입력해 주세요." },
                                        { state: "invalid", msg: "새 비밀번호와 일치하지 않습니다." },
                                    ]}
                                    type="password"
                                    id="new-pw-confirm"
                                    autocomplete="new-pw-confirm"
                                    tabindex={3}
                                    placeholder="새 비밀번호를 재입력해 주세요."
                                    label="새 비밀번호 확인"
                                    marginTop={1}
                                />
                                <div className="w-full mt-5 px-5 py-4 rounded-lg text-l-2 dark:text-white bg-l-d dark:bg-d-4">
                                    <h2 className="font-medium mb-2">비밀번호 변경 시 유의사항</h2>
                                    <div className='w-full text-sm flex gap-1.5 items-center text-l-5 dark:text-d-c'>
                                        <div className="w-1 h-1 rounded-full bg-l-5 dark:bg-d-c"></div>
                                        <div>영문, 숫자, 특수문자 포함 8~20자 조합</div>
                                    </div>
                                    <div className='w-full text-sm flex gap-1.5 mt-1 items-center text-l-5 dark:text-d-c'>
                                        <div className="w-1 h-1 rounded-full bg-l-5 dark:bg-d-c"></div>
                                        <div>비밀번호 변경 완료 시, 즉시 반영됩니다.</div>
                                    </div>
                                </div>
                                <Button marginTop={0.75}>
                                    <button onClick={handlePwChangeClick} className='w-full h-full'>
                                        {
                                            isLoading === true
                                            ? <span className='loader border-2 border-h-e dark:border-d-6 border-b-h-1 dark:border-b-f-8 w-4 h-4'></span>
                                            : '비밀번호 변경하기'
                                        }
                                    </button>
                                </Button>
                            </form>
                        </div>
                    </div>
                </div>
            }
        </>
    )
}