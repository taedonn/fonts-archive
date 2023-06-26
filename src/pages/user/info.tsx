// next hooks
import { NextSeo } from 'next-seo';

// react hooks
import React, { useState, useEffect } from 'react';

// hooks
import axios from 'axios';

// api
import { CheckIfSessionExists } from "../api/user/checkifsessionexists";
import { FetchUserInfo } from "../api/user/fetchuserinfo";

// components
import Header from "@/components/header";
import ChangePwModal from '@/components/changepwmodal';
import DeleteUserModal from '@/components/deleteusermodal';

const SendEmail = ({params}: any) => {
    // 디바이스 체크
    const isMac: boolean = params.userAgent.includes("Mac OS") ? true : false;

    // 빈 함수
    const emptyFn = () => { return; }

    // 폼 state
    const [nameVal, setNameVal] = useState<string>('');
    const [nameChk, setNameChk] = useState<string>('');
    const [alert, setAlert] = useState<string>('');
    const [alertDisplay, setAlertDisplay] = useState<boolean>(false);
    const [changePwModalDisplay, setChangePwModalDisplay] = useState<boolean>(false);
    const [deleteUserModalDisplay, setDeleteUserModalDisplay] = useState<boolean>(false);

    // 뒤로가기 시 history가 남아있으면 state 변경
    useEffect(() => {
        const formName = document.getElementById('name') as HTMLInputElement;
        if (formName.value !== '') { setNameVal(formName.value); }
    }, []);

    /** 이름 체인지 이벤트 */
    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNameChk('');
        setNameVal(e.target.value);
    }

    /** 이름 변경하기 클릭 이벤트 */
    const handleNameClick = async () => {
        if (nameVal === '') { setNameChk('empty'); }
        else {
            // 이름 변경하기 API 호출
            await axios.post('/api/user/updateusername', null, { params: {
                id: params.user.user_id,
                name: nameVal,
            }})
            .then(res => {
                if (res.data === 'exists') {
                    setNameChk('exists');
                } else {
                    setAlert('name');
                    setAlertDisplay(true);
                }
            })
            .catch(err => console.log(err));
        }
    }

    /** 비밀번호 변경하기 클릭 이벤트 */
    const handleChangePwModalClick = async () => { setChangePwModalDisplay(true); }

    /** 비밀번호 변경하기 모달창 닫기 이벤트 */
    const handleChangePwModalClose = () => { setChangePwModalDisplay(false); }

    /** 회원 탈퇴 버튼 클릭 이벤트 */
    const handleDeleteUserModalClick = () => { setDeleteUserModalDisplay(true); }

    /** 회원 탈퇴 모달창 닫기 이벤트 */
    const handleDeleteUserModalClose = () => { setDeleteUserModalDisplay(false); }

    /** 알럿창 닫기 */
    const handleAlertClose = () => { setAlertDisplay(false); }

    return (
        <>
            {/* Head 부분*/}
            <NextSeo 
                title={"회원정보 · 폰트 아카이브"}
                description={"회원정보 - 상업용 무료 한글 폰트 아카이브"}
            />

            {/* 헤더 */}
            <Header
                isMac={isMac}
                theme={params.theme}
                user={params.user}
                page={"login"}
                lang={""}
                type={""}
                sort={""}
                source={""}
                handleTextChange={emptyFn}
                handleLangOptionChange={emptyFn}
                handleTypeOptionChange={emptyFn}
                handleSortOptionChange={emptyFn}
                handleSearch={emptyFn}
            />

            {/* 메인 */}
            <div className='w-[100%] flex flex-col justify-center items-center'>
                <form onSubmit={e => e.preventDefault()} className='w-[360px] flex flex-col justify-center items-start mt-[100px] tlg:mt-[40px]'>
                    <h2 className='text-[20px] tlg:text-[18px] text-theme-4 dark:text-theme-9 font-medium mb-[12px] tlg:mb-[8px]'>회원정보</h2>
                    {
                        alertDisplay === true
                        ? alert === 'name'
                            ? <>
                                <div className='w-[100%] h-[40px] px-[10px] mb-[10px] flex flex-row justify-between items-center rounded-[6px] border-[2px] border-theme-yellow dark:border-theme-blue-1/80 text-[12px] text-theme-5 dark:text-theme-9 bg-theme-yellow/40 dark:bg-theme-blue-1/20'>
                                    <div className='flex flex-row justify-start items-center'>
                                        <svg className='w-[14px] fill-theme-yellow dark:fill-theme-blue-1/80' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/><path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/></svg>
                                        <div className='ml-[6px]'>이름이 변경되었습니다.</div>
                                    </div>
                                    <div onClick={handleAlertClose} className='flex flex-row justify-center items-center cursor-pointer'>
                                        <svg className='w-[18px] fill-theme-5 dark:fill-theme-9' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/></svg>
                                    </div>
                                </div>
                            </>
                            : <></>
                        : <></>
                    }
                    <div className='w-[100%] p-[20px] rounded-[8px] text-theme-10 dark:text-theme-9 bg-theme-5 dark:bg-theme-3 drop-shadow-default dark:drop-shadow-dark'>
                        <label htmlFor='name' className='block text-[14px] ml-px'>이름</label>
                        <div className='w-[100%] flex flex-row justify-between items-center mt-[6px]'>
                            <input onChange={handleNameChange} type='text' id='name' tabIndex={1} autoComplete='on' defaultValue={params.user.user_name} placeholder='홍길동' className={`${nameChk === '' ? 'border-theme-4 focus:border-theme-yellow dark:border-theme-blue-2 focus:dark:border-theme-blue-1' : 'border-theme-red focus:border-theme-red dark:border-theme-red focus:dark:border-theme-red'} w-[calc(100%-84px)] text-[14px] px-[14px] py-[8px] rounded-[8px] border-[2px] placeholder-theme-7 dark:placeholder-theme-6 bg-theme-4 dark:bg-theme-blue-2 autofill:bg-theme-4 autofill:dark:bg-theme-blue-2`}/>
                            <button onClick={handleNameClick} className='w-[76px] h-[39px] pt-px rounded-[8px] font-medium text-[14px] text-theme-5 dark:text-theme-blue-2 bg-theme-yellow/80 hover:bg-theme-yellow tlg:hover:bg-theme-yellow/80 dark:bg-theme-blue-1/80 hover:dark:bg-theme-blue-1 tlg:hover:dark:bg-theme-blue-1/80'>변경하기</button>
                        </div>
                        {
                            nameChk === 'empty'
                            ? <span className='block text-[12px] text-theme-red mt-[4px] ml-[16px]'>이름을 입력해 주세요.</span>
                            : ( nameChk === 'exists'
                                ? <span className='block text-[12px] text-theme-red mt-[4px] ml-[16px]'>이미 사용중인 이름입니다.</span>
                                : <></>
                            )
                        }
                        <div className='block text-[14px] mt-[18px] ml-px'>아이디</div>
                        <div className='w-[100%] text-[14px] mt-[6px] px-[14px] py-[8px] rounded-[8px] border-[2px] border-transparent dark:border-transparent bg-theme-4/60 dark:bg-theme-blue-2/60 cursor-default'>{params.user.user_id}</div>
                        <div className='w-[100%] h-px bg-theme-6 dark:bg-theme-5 mt-[16px] mb-[32px]'></div>
                        <h2 className="font-bold text-[16px] text-theme-10 dark:text-theme-9 mb-[8px]">비밀번호 변경</h2>
                        <div className='w-[100%] flex flex-row justify-start items-start mb-[4px] text-[12px] text-theme-8 dark:text-theme-7'>
                            <svg className='w-[12px] mt-[3px] mr-[6px] fill-theme-yellow dark:fill-theme-blue-1' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/><path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/></svg>
                            <div>영문, 숫자, 특수문자 포함 8~20자를 조합해 만들어 주세요.</div>
                        </div>
                        <div className='w-[100%] flex flex-row justify-start items-start mb-[12px] text-[12px] text-theme-8 dark:text-theme-7'>
                            <svg className='w-[12px] mt-[3px] mr-[6px] fill-theme-yellow dark:fill-theme-blue-1' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/><path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/></svg>
                            <div>비밀번호 변경 완료 시, 비밀번호는 즉시 변경됩니다.</div>
                        </div>
                        <div className='w-[100%] flex flex-row justify-between items-center mt-[6px]'>
                            <input type='password' id='pw' tabIndex={2} autoComplete='on' defaultValue={params.user.user_pw} disabled className='border-transparent dark:border-theme-transparent w-[calc(100%-84px)] text-[14px] px-[14px] py-[8px] rounded-[8px] border-[2px] bg-theme-4/60 dark:bg-theme-blue-2/60'/>
                            <button onClick={handleChangePwModalClick} className='w-[76px] h-[39px] pt-px rounded-[8px] font-medium text-[14px] text-theme-5 dark:text-theme-blue-2 bg-theme-yellow/80 hover:bg-theme-yellow tlg:hover:bg-theme-yellow/80 dark:bg-theme-blue-1/80 hover:dark:bg-theme-blue-1 tlg:hover:dark:bg-theme-blue-1/80'>변경하기</button>
                        </div>
                        <div className='w-[100%] h-px bg-theme-6 dark:bg-theme-5 mt-[16px] mb-[32px]'></div>
                        <h2 className="font-bold text-[16px] text-theme-10 dark:text-theme-9 mb-[8px]">회원 탈퇴</h2>
                        <div className='w-[100%] flex flex-row justify-start items-start mb-[4px] text-[12px] text-theme-8 dark:text-theme-7'>
                            <svg className='w-[12px] mt-[3px] mr-[6px] fill-theme-red' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/><path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/></svg>
                            <div>탈퇴 시 계정의 모든 정보는 삭제됩니다.</div>
                        </div>
                        <div className='w-[100%] flex flex-row justify-start items-start mb-[12px] text-[12px] text-theme-8 dark:text-theme-7'>
                            <svg className='w-[12px] mt-[3px] mr-[6px] fill-theme-red' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/><path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/></svg>
                            <div>재가입 시에도 삭제된 정보는 복구되지 않습니다.</div>
                        </div>
                        <button onClick={handleDeleteUserModalClick} className='w-[100%] h-[40px] rounded-[8px] flex flex-row justify-center items-center text-[14px] font-medium text-theme-10 dark:text-theme-9 bg-theme-red/80 hover:bg-theme-red tlg:hover:bg-theme-red/80'>회원 탈퇴하기</button>
                    </div>
                </form>
            </div>

            {/* 비밀번호 변경 모달창 */}
            <ChangePwModal
                display={changePwModalDisplay}
                close={handleChangePwModalClose}
            />

            {/* 회원 탈퇴 모달창 */}
            <DeleteUserModal
                display={deleteUserModalDisplay}
                close={handleDeleteUserModalClose}
                id={params.user.user_id}
            />
        </>
    );
}

export async function getServerSideProps(ctx: any) {
    try {
        // 필터링 쿠키 체크
        const cookieTheme = ctx.req.cookies.theme === undefined ? "dark" : ctx.req.cookies.theme;

        // 디바이스 체크
        const userAgent = ctx.req ? ctx.req.headers['user-agent'] : navigator.userAgent;

        // 쿠키에 저장된 세션ID가 유효하면, 유저 정보 가져오기
        const user = ctx.req.cookies.session === undefined ? null : (
            await CheckIfSessionExists(ctx.req.cookies.session) === true 
            ? await FetchUserInfo(ctx.req.cookies.session)
            : null
        )

        // 쿠키에 저장된 세션ID가 유효하지 않다면, 메인페이지로 이동, 유효하면 클리이언트로 유저 정보 return
        if (user === null) {
            return {
                redirect: {
                    destination: '/',
                    permanent: false,
                }
            }
        } else {
            return {
                props: {
                    params: {
                        theme: cookieTheme,
                        userAgent: userAgent,
                        user: user,
                    }
                }
            }
        }
    }
    catch (error) {
        console.log(error);
    }
}

export default SendEmail;