// next
import { NextSeo } from 'next-seo';

// next-auth
import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]';
import { FetchUserInfo } from '../api/auth/auth';

// react
import React, { useState, useEffect, useRef, ChangeEvent } from 'react';

// libraries
import axios from 'axios';
import imageCompression from 'browser-image-compression';

// components
import Header from "@/components/header";
import Footer from '@/components/footer';
import ChangePwModal from '@/components/changepwmodal';
import DeleteUserModal from '@/components/deleteusermodal';

// common
import { timeFormat } from '@/libs/common';

const Info = ({params}: any) => {
    const { theme, userAgent, info } = params;
    const user = info;

    // 디바이스 체크
    const isMac: boolean = userAgent.includes("Mac OS") ? true : false;

    // states
    const [userName, setUserName] = useState<string>(user.user_name);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [profileImg, setProfileImg] = useState<string>(user.profile_img);
    const [isImgLoading, setIsImgLoading] = useState<boolean>(false);
    const [isImgError, setisImgError] = useState<boolean>(false);
    const [nameVal, setNameVal] = useState<string>('');
    const [nameChk, setNameChk] = useState<string>('');
    const [alert, setAlert] = useState<string>('');
    const [alertDisplay, setAlertDisplay] = useState<boolean>(false);
    const [changePwModalDisplay, setChangePwModalDisplay] = useState<boolean>(false);
    const [deleteUserModalDisplay, setDeleteUserModalDisplay] = useState<boolean>(false);

    /** 이름 체인지 이벤트 */
    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNameChk('');
        setNameVal(e.target.value);
    }

    /** 이름 변경하기 클릭 이벤트 */
    const handleNameClick = async () => {
        // 로딩 스피너 실행
        setIsLoading(true);

        if (nameVal === '') { setNameChk('empty'); }
        else if (nameVal === userName) { setNameChk("exists"); }
        else {
            // 이름 변경하기 API 호출
            await axios.post('/api/user/updateuserinfo', {
                action: "change-name",
                id: user.user_id,
                name: nameVal,
                auth: user.auth,
            })
            .then(() => {
                setUserName(nameVal);
                setAlert('name');
                setAlertDisplay(true);
            })
            .catch(err => console.log(err));
        }

        // 로딩 스피너 정지
        setIsLoading(false);
    }

    /** 이름 변경하기 포커스 시 엔터키 입력 이벤트 */
    const handleNameEnter = async (e: any) => {
        const keys: any = [];
        keys[e.key] = true;
        if (keys["Enter"]) {
            e.preventDefault();
            handleNameClick();
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

    /** 비밀번호 변경 완료 시 알럿창 띄우기 */
    const handlePwChangeOnSuccess = () => {
        setAlertDisplay(true);
        setAlert('pw');
    }

    // 프로필 이미지 영역
    const refImg = useRef<HTMLDivElement>(null);
    const refImgPopup = useRef<HTMLDivElement>(null);

    // 프로필 이미지 영역 외 클릭
    useEffect(() => {
        function handleImgOutside(e: Event) {
            const imgInput = document.getElementById("profile-img") as HTMLInputElement;
            if (refImg?.current && !refImg.current.contains(e.target as Node) && refImgPopup.current && !refImgPopup.current.contains(e.target as Node)) {
                imgInput.checked = false;
            }
        }
        document.addEventListener("mouseup", handleImgOutside);
        return () => document.removeEventListener("mouseup", handleImgOutside);
    }, [refImg, refImgPopup]);

    // 사진 삭제 버튼 클릭
    const deleteImg = async () => {
        const imgInput = document.getElementById("profile-img") as HTMLInputElement;

        // 사진 변경창 닫기
        imgInput.checked = false;

        // 이미지 로딩 스피너 실행
        setIsImgLoading(true);

        // 프로필 이미지 제거 후 state에 저장된 프로필 이미지 변경
        await axios.post('/api/user/updateuserinfo', {
            action: 'delete-profile-img',
            id: user.user_id,
            auth: user.auth,
        })
        .then(res => {
            setProfileImg(res.data.img);

            setIsImgLoading(false);
            setisImgError(false);
        })
        .catch(err => {
            console.log(err);

            setIsImgLoading(false);
            setisImgError(true);
        });
    }

    // 프로필 사진 변경
    const changeImg = async (e: ChangeEvent<HTMLInputElement>) => {
        const imgInput = document.getElementById("profile-img") as HTMLInputElement;

        // 이미지 로딩 스피너 실행
        setIsImgLoading(true);

        // 사진 변경창 닫기
        imgInput.checked = false;

        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];

            // 이미지 리사이징
            const img = document.createElement('img');
            const selectedImg = e.target.files[0];
            const objectURL = URL.createObjectURL(selectedImg);
            img.onload = async function() {
                // 파일이 jpeg나 png일 경우만 리사이징 함수 적용
                if (file.type === 'image/jpeg' || file.type === 'image/png') {
                    // 파일의 넓이나 높이가 500 초과일 때 리사이징
                    if (img.width > 500 || img.height > 500) {
                        // 리사이징 옵션
                        const resizeOption = { maxWidthOrHeight: 500 }
    
                        // 리사이징 함수
                        imageCompression(file, resizeOption)
                        .then(function(compressedFile) {
                            fnChangeImg(compressedFile, compressedFile.name.split('.').pop() as string);
                        })
                        .catch(err => console.log(err));
                    } else {
                        fnChangeImg(file, file.name.split('.').pop() as string);
                    }
                } else {
                    fnChangeImg(file, file.name.split('.').pop() as string);
                }

                URL.revokeObjectURL(objectURL);
            }
            img.src = objectURL;
        }
    }

    // 프로필 사진 변경 함수
    const fnChangeImg = async function(file: File, fileType: string) {        
        await axios.post("/api/user/updateuserinfo", {
            action: 'change-img',
            file_name: `fonts-archive-user-${user.user_no}-profile-img.` + fileType,
            file_type: file.type,
        })
        .then(async (res) => {
            // s3 업로드
            await axios.put(res.data.url, file, { headers: { 'Content-Type': file.type }})
            .then(async () => {
                await axios.post("/api/user/updateuserinfo", {
                    action: "upload-img-on-prisma",
                    id: user.user_id,
                    no: user.user_no,
                    auth: user.auth,
                    img_type: fileType,
                })
                .then((res) => {
                    // 프로필 이미지 변경
                    setProfileImg(res.data.url);
                    setIsImgLoading(false);
                    setisImgError(false);
                })
                .catch(err => {
                    console.log(err);
                    setIsImgLoading(false);
                    setisImgError(true);
                })
            })
            .catch(err => {
                console.log(err);
                setIsImgLoading(false);
                setisImgError(true);
            })
        })
        .catch(err => {
            console.log(err);
            setIsImgLoading(false);
            setisImgError(true);
        });

        // input 리셋
        const imgInput = document.getElementById("profile-img-upload") as HTMLInputElement;
        imgInput.value = "";
    }

    return (
        <>
            {/* Head 부분*/}
            <NextSeo 
                title={"회원정보 · 폰트 아카이브"}
                description={"회원정보 - 폰트 아카이브 · 상업용 무료 한글 폰트 저장소"}
            />

            {/* 헤더 */}
            <Header
                isMac={isMac}
                theme={theme}
                user={params.user}
            />

            {/* 메인 */}
            <form onSubmit={e => e.preventDefault()} className='w-full flex flex-col justify-center items-center'>
                <div className='w-[360px] flex flex-col justify-center items-start my-[100px] tlg:my-10'>
                    <h2 className='text-xl tlg:text-lg mb-1 text-theme-3 dark:text-theme-9 font-medium'>프로필 정보</h2>
                    {
                        user.auth !== "credentials"
                            && <div className='text-xs p-1 px-3 mb-2 flex items-center rounded-md border-2 text-theme-3 dark:text-theme-9 border-theme-yellow dark:border-theme-blue-1/80 bg-theme-yellow/40 dark:bg-theme-blue-1/20'>
                                <div className='mr-0.5 font-medium text-theme-3 dark:text-theme-9'>{user.auth === "google" ? "Google" : user.auth === "kakao" ? "카카오" : user.auth === "github" ? "GitHub" : user.auth === "naver" ? "네이버" : ""}</div>에서 연동 중
                            </div>
                    }
                    {
                        user.auth === "credentials"
                            ? <div className='text-xs text-theme-5 dark:text-theme-7 mb-2.5 tlg:mb-2'>{timeFormat(user.updated_at)}에 마지막으로 수정됨</div>
                            : <div className='text-xs text-theme-5 dark:text-theme-7 mb-2.5 tlg:mb-2'>{timeFormat(user.created_at)}에 생성됨</div>
                    }
                    {
                        alertDisplay === true
                        ? alert === 'name'
                            ? <>
                                <div className='w-full h-10 px-2.5 mb-2.5 flex flex-row justify-between items-center rounded-md border-2 border-theme-yellow dark:border-theme-blue-1/80 text-xs text-theme-3 dark:text-theme-9 bg-theme-yellow/40 dark:bg-theme-blue-1/20'>
                                    <div className='flex flex-row justify-start items-center'>
                                        <svg className='w-3.5 fill-theme-yellow dark:fill-theme-blue-1/80' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/><path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/></svg>
                                        <div className='ml-1.5'>이름이 변경되었습니다.</div>
                                    </div>
                                    <div onClick={handleAlertClose} className='flex flex-row justify-center items-center cursor-pointer'>
                                        <svg className='w-[18px] fill-theme-3 dark:fill-theme-9' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/></svg>
                                    </div>
                                </div>
                            </>
                            : alert === 'pw'
                                ? <>
                                    <div className='w-full h-10 px-2.5 mb-2.5 flex flex-row justify-between items-center rounded-md border-2 border-theme-yellow dark:border-theme-blue-1/80 text-xs text-theme-3 dark:text-theme-9 bg-theme-yellow/40 dark:bg-theme-blue-1/20'>
                                        <div className='flex flex-row justify-start items-center'>
                                            <svg className='w-3.5 fill-theme-yellow dark:fill-theme-blue-1/80' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/><path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/></svg>
                                            <div className='ml-1.5'>비밀번호가 변경되었습니다.</div>
                                        </div>
                                        <div onClick={handleAlertClose} className='flex flex-row justify-center items-center cursor-pointer'>
                                            <svg className='w-[18px] fill-theme-3 dark:fill-theme-9' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/></svg>
                                        </div>
                                    </div>
                                </> : <></>
                        : <></>
                    }
                    <div className='w-full p-5 rounded-lg text-theme-10 dark:text-theme-9 bg-theme-5 dark:bg-theme-3 drop-shadow-default dark:drop-shadow-dark'>
                        <div className='flex items-center'>
                            <div ref={refImg} className='relative'>
                                <input className='peer hidden' id='profile-img' type='checkbox'/>
                                <label className='w-[60px] h-[60px] block relative cursor-pointer overflow-hidden' htmlFor='profile-img'>
                                    {
                                        !isImgLoading
                                        ? <>
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img className='w-full h-full object-cover rounded-full' src={profileImg} width={60} height={60} alt='유저 프로필 사진' referrerPolicy="no-referrer"/>
                                        </>
                                        : <div className='w-full h-full rounded-full flex items-center bg-theme-4 dark:bg-theme-blue-2/60'><div className='img-loader'></div></div>
                                    }
                                    {
                                        user.auth === "credentials"
                                            && <div className='w-5 h-[18px] flex justify-center items-center bg-theme-4 dark:bg-theme-blue-2 border border-theme-yellow dark:border-theme-blue-1 absolute z-10 left-0.5 bottom-0.5 rounded-md'>
                                                <svg className='w-2.5 fill-theme-yellow dark:fill-theme-blue-1' xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16"><path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"/></svg>
                                            </div>
                                    }
                                </label>
                                {
                                    user.auth === "credentials"
                                        && <div ref={refImgPopup} className='w-max hidden peer-checked:block absolute left-1/2 bottom-2 -translate-x-1/2 translate-y-full rounded-lg bg-theme-4 dark:bg-theme-blue-2 drop-shadow-dark dark:drop-shadow-dark after:content-[""] after:w-2 after:h-2 after:absolute after:left-1/4 after:-top-1 after:-translate-x-1/2 after:rotate-45 after:bg-theme-4 after:dark:bg-theme-blue-2'>
                                            <div className='flex'>
                                                <input onChange={changeImg} className='hidden' type='file' accept='image/*' id='profile-img-upload'/>
                                                <label className='w-full relative z-[2] text-xs leading-none dark:text-theme-7 rounded-t-lg pl-3 pr-3.5 pt-2.5 pb-2 hover:bg-theme-yellow hover:dark:bg-theme-blue-1 hover:text-theme-2 hover:dark:text-theme-blue-2 cursor-pointer' htmlFor='profile-img-upload'>사진 변경</label>
                                            </div>
                                            <button onClick={deleteImg} className='w-full text-[12px] leading-none dark:text-theme-7 rounded-b-lg pl-3 pr-3.5 pt-2 pb-2.5 hover:bg-theme-yellow hover:dark:bg-theme-blue-1 hover:text-theme-2 hover:dark:text-theme-blue-2'>사진 제거</button>
                                        </div>
                                }
                            </div>
                            <div className='ml-4'>
                                <h2 className='mr-px text-sm text-theme-10 dark:text-theme-9 font-bold'>프로필 이미지</h2>
                                <div className='text-[11px] font-normal leading-none break-keep text-theme-8 dark:text-theme-7 mt-1.5'>
                                    {
                                        user.auth === "credentials"
                                            ? <>
                                                <h3 className='flex items-center mb-1'><div className='w-[3px] h-[3px] mr-[5px] mt-px rounded-full bg-theme-8 dark:bg-theme-7'></div>500px보다 큰 이미지는 축소되어 업로드 됩니다.</h3>
                                                <h3 className='flex items-start leading-normal'><div className='w-[3px] h-[3px] mr-[5px] mt-[7px] shrink-0 rounded-full bg-theme-8 dark:bg-theme-7'></div>업로드된 이미지는 다음 로그인부터 적용 됩니다.</h3>
                                            </> : <h3 className='flex items-start leading-normal'><div className='w-[3px] h-[3px] mr-[5px] mt-[7px] shrink-0 rounded-full bg-theme-8 dark:bg-theme-7'></div>SNS로 로그인한 계정은 SNS 계정의 프로필 이미지가 표시됩니다.</h3>
                                    }
                                </div>
                            </div>
                        </div>
                        {
                            isImgError
                            ? <span className='block text-xs text-theme-red mt-3'>이미지 업로드에 실패했습니다. 잠시 후 다시 시도해 주세요.</span>
                            : <></>
                        }
                        <div className='w-full h-px bg-theme-6 dark:bg-theme-5 my-5'></div>
                        <label htmlFor='name' className='block text-sm ml-px'>이름</label>
                        {
                            user.auth === "credentials"
                                ? <div className='w-full flex flex-row justify-between items-center mt-1.5'>
                                    <input onChange={handleNameChange} onKeyDown={handleNameEnter} type='text' id='name' tabIndex={1} autoComplete='on' defaultValue={user.user_name} placeholder='홍길동' className={`${nameChk === '' ? 'border-theme-4 focus:border-theme-yellow dark:border-theme-blue-2 focus:dark:border-theme-blue-1' : 'border-theme-red focus:border-theme-red dark:border-theme-red focus:dark:border-theme-red'} w-[calc(100%-84px)] text-sm px-3.5 py-2 rounded-lg border-2 placeholder-theme-7 dark:placeholder-theme-6 bg-theme-4 dark:bg-theme-blue-2 autofill:bg-theme-4 autofill:dark:bg-theme-blue-2`}/>
                                    <button onClick={handleNameClick} className='w-[76px] h-10 flex flex-row justify-center items-center rounded-lg font-medium text-sm text-theme-4 dark:text-theme-blue-2 bg-theme-yellow/80 hover:bg-theme-yellow tlg:hover:bg-theme-yellow/80 dark:bg-theme-blue-1/80 hover:dark:bg-theme-blue-1 tlg:hover:dark:bg-theme-blue-1/80'>
                                        {
                                            isLoading === true
                                            ? <span className='loader loader-register w-[18px] h-[18px]'></span>
                                            : <span className='pt-px'>변경하기</span>
                                        }
                                    </button>
                                </div> : <div className='w-full text-sm mt-1.5 px-3.5 py-2 rounded-lg border-2 text-theme-8 dark:text-theme-7 border-theme-6 dark:border-theme-4 bg-theme-4 dark:bg-theme-blue-2/60 cursor-default'>{user.user_name}</div>
                        }
                        {
                            nameChk === 'empty'
                            ? <span className='block text-xs text-theme-red mt-1 ml-4'>이름을 입력해 주세요.</span>
                            : ( nameChk === 'exists'
                                ? <span className='block text-xs text-theme-red mt-1 ml-4'>이미 사용중인 이름입니다.</span>
                                : <></>
                            )
                        }
                        <div className='block text-sm mt-[18px] ml-px'>아이디</div>
                        <div className='w-full text-sm mt-1.5 px-3.5 py-2 rounded-lg border-2 text-theme-8 dark:text-theme-7 border-theme-6 dark:border-theme-4 bg-theme-4 dark:bg-theme-blue-2/60 cursor-default'>{user.user_id}</div>
                        {
                            user.auth === "credentials" && 
                            <>
                                <div className='w-full h-px bg-theme-6 dark:bg-theme-5 my-5'></div>
                                <h2 className="font-bold text-base text-theme-10 dark:text-theme-9 mb-2">비밀번호 변경</h2>
                                <div className='w-full flex flex-row justify-start items-start mb-1 text-xs text-theme-8 dark:text-theme-7'>
                                    <svg className='w-3 mt-[3px] mr-1.5 fill-theme-yellow dark:fill-theme-blue-1' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/><path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/></svg>
                                    <div>영문, 숫자, 특수문자 포함 8~20자를 조합해 만들어 주세요.</div>
                                </div>
                                <div className='w-full flex flex-row justify-start items-start mb-3 text-xs text-theme-8 dark:text-theme-7'>
                                    <svg className='w-3 mt-[3px] mr-1.5 fill-theme-yellow dark:fill-theme-blue-1' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/><path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/></svg>
                                    <div>비밀번호 변경 완료 시, 비밀번호는 즉시 변경됩니다.</div>
                                </div>
                                <div className='w-full flex flex-row justify-between items-center mt-1.5'>
                                    <input type='password' id='pw' tabIndex={2} autoComplete='on' defaultValue={user.user_pw} disabled className='text-theme-8 dark:text-theme-7 border-theme-6 dark:border-theme-4 w-[calc(100%-84px)] text-sm px-3.5 py-2 rounded-lg border-2 bg-theme-4 dark:bg-theme-blue-2/60'/>
                                    <button onClick={handleChangePwModalClick} className='w-[76px] h-10 pt-px rounded-lg font-medium text-sm text-theme-4 dark:text-theme-blue-2 bg-theme-yellow/80 hover:bg-theme-yellow tlg:hover:bg-theme-yellow/80 dark:bg-theme-blue-1/80 hover:dark:bg-theme-blue-1 tlg:hover:dark:bg-theme-blue-1/80'>변경하기</button>
                                </div>
                            </>
                        }
                        <div className='w-full h-px bg-theme-6 dark:bg-theme-5 my-5'></div>
                        <h2 className="font-bold text-base text-theme-10 dark:text-theme-9 mb-2">회원 탈퇴</h2>
                        <div className='w-full flex flex-row justify-start items-start mb-1 text-xs text-theme-8 dark:text-theme-7'>
                            <svg className='w-3 mt-[3px] mr-1.5 fill-theme-red' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/><path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/></svg>
                            <div>탈퇴 시 계정의 모든 정보는 삭제됩니다.</div>
                        </div>
                        <div className='w-full flex flex-row justify-start items-start mb-3 text-xs text-theme-8 dark:text-theme-7'>
                            <svg className='w-3 mt-[3px] mr-1.5 fill-theme-red' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/><path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/></svg>
                            <div>재가입 시에도 삭제된 정보는 복구되지 않습니다.</div>
                        </div>
                        <button onClick={handleDeleteUserModalClick} className='w-full h-10 rounded-lg flex flex-row justify-center items-center text-sm font-medium text-theme-10 dark:text-theme-9 bg-theme-red/80 hover:bg-theme-red tlg:hover:bg-theme-red/80'>회원 탈퇴하기</button>
                    </div>
                </div>
            </form>

            {/* 풋터 */}
            <Footer/>

            {/* 비밀번호 변경 모달창 */}
            <ChangePwModal
                display={changePwModalDisplay}
                close={handleChangePwModalClose}
                success={handlePwChangeOnSuccess}
                id={user.user_id}
                auth={user.auth}
            />

            {/* 회원 탈퇴 모달창 */}
            <DeleteUserModal
                display={deleteUserModalDisplay}
                close={handleDeleteUserModalClose}
                user={user}
            />
        </>
    );
}

export async function getServerSideProps(ctx: any) {
    try {
        // 쿠키 체크
        const { theme } = ctx.req.cookies;

        // 디바이스 체크
        const userAgent = ctx.req ? ctx.req.headers['user-agent'] : navigator.userAgent;

        // 유저 정보 불러오기
        const session: any = await getServerSession(ctx.req, ctx.res, authOptions);

        if (session === null || session.user === undefined) {
            return {
                redirect: {
                    destination: '/404',
                    permanent: false,
                }
            }
        } else {
            const info = await FetchUserInfo(session.user.email, session.user.provider);

            return {
                props: {
                    params: {
                        theme: theme ? theme : 'light',
                        userAgent: userAgent,
                        user: session === null ? null : session.user,
                        info: JSON.parse(JSON.stringify(info)),
                    }
                }
            }
        }
    }
    catch (error) {
        console.log(error);
    }
}

export default Info;