// next hooks
import { NextSeo } from 'next-seo';

// react hooks
import React, { useState, useEffect, useRef, ChangeEvent } from 'react';

// hooks
import axios from 'axios';
import imageCompression from 'browser-image-compression';

// api
import { CheckIfSessionExists } from "../api/user/checkifsessionexists";
import { FetchUserInfo } from "../api/user/fetchuserinfo";

// components
import Header from "@/components/header";
import ChangePwModal from '@/components/changepwmodal';
import DeleteUserModal from '@/components/deleteusermodal';

// common
import { timeFormat } from '@/libs/common';

const Info = ({params}: any) => {
    // 디바이스 체크
    const isMac: boolean = params.userAgent.includes("Mac OS") ? true : false;

    // 빈 함수
    const emptyFn = () => { return; }

    const user = params.user;

    // 폼 state
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
        // 로딩 스피너 실행
        setIsLoading(true);

        if (nameVal === '') { setNameChk('empty'); }
        else if (nameVal === user.user_name) { setNameChk("exists"); }
        else {
            // 이름 변경하기 API 호출
            await axios.post('/api/user/updateuserinfo', {
                action: "change-name",
                id: user.user_id,
                name: nameVal,
            })
            .then(() => {
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

        if (!user.profile_img.startsWith('/fonts-archive-base-profile-img-')) {
            // 프로필 이미지 제거 후 state에 저장된 프로필 이미지 변경
            await axios.post('/api/user/updateuserinfo', {
                action: 'delete-profile-img',
                id: user.user_id,
            })
            .then(res => {
                setProfileImg(res.data.img);

                // 이미지 로딩 스피너 제거
                setIsImgLoading(false);
            })
            .catch(err => {
                console.log(err);

                // 이미지 로딩 스피너 제거
                setIsImgLoading(false);
            });
        }
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
        // 프로필 사진이 기본 프로필 사진이 아닌 경우
        if (!user.profile_img.startsWith('/fonts-archive-base-profile-img-')) {
            // 기존 프로필 삭제를 위한 Presigned URL 가져오기
            await axios.post('/api/user/updateuserinfo', {
                action: 'delete-s3-img',
                file_name: `fonts-archive-user-${user.user_no}-profile-img.` + user.profile_img.split('.').pop(),
                file_type: 'image/' + user.profile_img.split('.').pop() === 'jpg' ? 'jpeg' : user.profile_img.split('.').pop(),
            })
            .then(async (res) => {
                // 기존 프로필 삭제
                await axios.delete(res.data.url, { headers: { 'Content-Type': 'image/' + res.data.url.split('.').pop() === 'jpg' ? 'jpeg' : res.data.url.split('.').pop() }})
                .then(async () => {
                    // 이미지 업로드
                    fnImgUpload(file, fileType);
                })
                .catch(err => {
                    console.log(err);

                    // 이미지 로딩 스피너 제거
                    setIsImgLoading(false);

                    // 에러 메세지 표시
                    setisImgError(true);
                });
            })
            .catch(err => {
                console.log(err);

                // 이미지 로딩 스피너 제거
                setIsImgLoading(false);

                // 에러 메세지 표시
                setisImgError(true);
            });
        }
        // 프로필 사진이 기본 프로필 사진인 경우
        else {
            // 이미지 업로드
            fnImgUpload(file, fileType);
        }
    }

    // s3, prisma에 이미지 업로드하는 함수
    const fnImgUpload = async function(file: File, fileType: string) {
        // 프로필 이미지 업로드를 위한 Presigned URL 가져오기
        await axios.post('/api/user/updateuserinfo', {
            action: 'upload-s3-img',
            file_name: `fonts-archive-user-${user.user_no}-profile-img.` + fileType,
            file_type: file.type,
        })
        .then(async (res) => {
            // 프로필 이미지 s3에 업로드
            await axios.put(res.data.url, file, { headers: { 'Content-Type': file.type }})
            .then(async () => {
                // 프로필 이미지 Prisma에 저장
                await axios.post('/api/user/updateuserinfo', {
                    action: 'upload-s3-img-to-prisma',
                    user_id: user.user_id,
                    user_no: user.user_no,
                    img_type: fileType,
                })
                .then(() => location.reload())
                .catch(err => {
                    console.log(err);

                    // 이미지 로딩 스피너 제거
                    setIsImgLoading(false);

                    // 에러 메세지 표시
                    setisImgError(true);
                });
            })
            .catch(err => {
                console.log(err);

                // 이미지 로딩 스피너 제거
                setIsImgLoading(false);

                // 에러 메세지 표시
                setisImgError(true);
            });
        })
        .catch(err => {
            console.log(err);

            // 이미지 로딩 스피너 제거
            setIsImgLoading(false);

            // 에러 메세지 표시
            setisImgError(true);
        });
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
                theme={params.theme}
                user={user}
                page={""}
                license={""}
                lang={""}
                type={""}
                sort={""}
                source={""}
                handleTextChange={emptyFn}
                handleLicenseOptionChange={emptyFn}
                handleLangOptionChange={emptyFn}
                handleTypeOptionChange={emptyFn}
                handleSortOptionChange={emptyFn}
                handleSearch={emptyFn}
            />

            {/* 메인 */}
            <form onSubmit={e => e.preventDefault()} className='w-[100%] flex flex-col justify-center items-center'>
                <div className='w-[360px] flex flex-col justify-center items-start my-[100px] tlg:my-[40px]'>
                    <h2 className='text-[20px] tlg:text-[18px] text-theme-3 dark:text-theme-9 font-medium'>프로필 정보</h2>
                    <div className='text-[12px] text-theme-5 dark:text-theme-6 mt-[4px] mb-[10px] tlg:mb-[8px]'>{timeFormat(user.updated_at)}에 마지막으로 수정됨</div>
                    {
                        alertDisplay === true
                        ? alert === 'name'
                            ? <>
                                <div className='w-[100%] h-[40px] px-[10px] mb-[10px] flex flex-row justify-between items-center rounded-[6px] border-[2px] border-theme-yellow dark:border-theme-blue-1/80 text-[12px] text-theme-3 dark:text-theme-9 bg-theme-yellow/40 dark:bg-theme-blue-1/20'>
                                    <div className='flex flex-row justify-start items-center'>
                                        <svg className='w-[14px] fill-theme-yellow dark:fill-theme-blue-1/80' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/><path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/></svg>
                                        <div className='ml-[6px]'>이름이 변경되었습니다.</div>
                                    </div>
                                    <div onClick={handleAlertClose} className='flex flex-row justify-center items-center cursor-pointer'>
                                        <svg className='w-[18px] fill-theme-3 dark:fill-theme-9' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/></svg>
                                    </div>
                                </div>
                            </>
                            : alert === 'pw'
                                ? <>
                                    <div className='w-[100%] h-[40px] px-[10px] mb-[10px] flex flex-row justify-between items-center rounded-[6px] border-[2px] border-theme-yellow dark:border-theme-blue-1/80 text-[12px] text-theme-3 dark:text-theme-9 bg-theme-yellow/40 dark:bg-theme-blue-1/20'>
                                        <div className='flex flex-row justify-start items-center'>
                                            <svg className='w-[14px] fill-theme-yellow dark:fill-theme-blue-1/80' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/><path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/></svg>
                                            <div className='ml-[6px]'>비밀번호가 변경되었습니다.</div>
                                        </div>
                                        <div onClick={handleAlertClose} className='flex flex-row justify-center items-center cursor-pointer'>
                                            <svg className='w-[18px] fill-theme-3 dark:fill-theme-9' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/></svg>
                                        </div>
                                    </div>
                                </> : <></>
                        : <></>
                    }
                    <div className='w-[100%] p-[20px] rounded-[8px] text-theme-10 dark:text-theme-9 bg-theme-5 dark:bg-theme-3 drop-shadow-default dark:drop-shadow-dark'>
                        <div className='flex items-center'>
                            <div ref={refImg} className='relative'>
                                <input className='peer hidden' id='profile-img' type='checkbox'/>
                                <label className='w-[60px] h-[60px] block relative cursor-pointer overflow-hidden' htmlFor='profile-img'>
                                    {
                                        !isImgLoading
                                        ? <>
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img className='w-[100%] h-[100%] object-cover rounded-full' src={profileImg} width={60} height={60} alt='유저 프로필 사진'/>
                                        </>
                                        : <div className='w-[100%] h-[100%] rounded-full flex items-center bg-theme-4 dark:bg-theme-blue-2/60'><div className='img-loader'></div></div>
                                    }
                                    <div className='w-[20px] h-[18px] flex justify-center items-center bg-theme-4 dark:bg-theme-blue-2 border border-theme-yellow dark:border-theme-blue-1 absolute z-10 left-[2px] bottom-[2px] rounded-[6px]'>
                                        <svg className='w-[10px] fill-theme-yellow dark:fill-theme-blue-1' xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16"><path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"/></svg>
                                    </div>
                                </label>
                                <div ref={refImgPopup} className='w-content hidden peer-checked:block absolute left-[50%] bottom-[-8px] translate-x-[-50%] translate-y-[100%] rounded-[8px] bg-theme-4 dark:bg-theme-blue-2 drop-shadow-dark dark:drop-shadow-dark after:content-[""] after:w-[8px] after:h-[8px] after:absolute after:left-[25%] after:top-[-4px] after:translate-x-[-50%] after:rotate-45 after:bg-theme-4 after:dark:bg-theme-blue-2'>
                                    <div className='flex'>
                                        <input onChange={changeImg} className='hidden' type='file' accept='image/*' id='profile-img-upload'/>
                                        <label className='w-[100%] relative z-[2] text-[12px] leading-none dark:text-theme-7 rounded-t-[8px] pl-[12px] pr-[14px] pt-[10px] pb-[8px] hover:bg-theme-yellow hover:dark:bg-theme-blue-1 hover:text-theme-2 hover:dark:text-theme-blue-2 cursor-pointer' htmlFor='profile-img-upload'>사진 변경</label>
                                    </div>
                                    <button onClick={deleteImg} className='w-[100%] text-[12px] leading-none dark:text-theme-7 rounded-b-[8px] pl-[12px] pr-[14px] pb-[10px] pt-[8px] hover:bg-theme-yellow hover:dark:bg-theme-blue-1 hover:text-theme-2 hover:dark:text-theme-blue-2'>사진 제거</button>
                                </div>
                            </div>
                            <div className='ml-[16px]'>
                                <h2 className='mr-[1px] text-[14px] text-theme-10 dark:text-theme-9 font-bold'>프로필 이미지</h2>
                                <div className='text-[11px] font-normal leading-none break-keep text-theme-8 dark:text-theme-7 mt-[6px]'>
                                    <h3 className='flex items-center mb-[4px]'><div className='w-[3px] h-[3px] mr-[5px] mt-px rounded-full bg-theme-8 dark:bg-theme-7'></div>500px보다 큰 이미지는 축소되어 업로드 됩니다.</h3>
                                    <h3 className='flex items-start leading-normal'><div className='w-[3px] h-[3px] mr-[5px] mt-[7px] shrink-0 rounded-full bg-theme-8 dark:bg-theme-7'></div>사진 변경이 안되면, 캐시를 지우거나 강력 새로고침 (Ctrl/Cmd + Shift + R)을 해주세요.</h3>
                                </div>
                            </div>
                        </div>
                        {
                            isImgError
                            ? <span className='block text-[12px] text-theme-red mt-[12px]'>이미지 업로드에 실패했습니다. 잠시 후 다시 시도해 주세요.</span>
                            : <></>
                        }
                        <div className='w-[100%] h-px bg-theme-6 dark:bg-theme-5 mt-[16px] mb-[32px]'></div>
                        <label htmlFor='name' className='block text-[14px] ml-px'>이름</label>
                        <div className='w-[100%] flex flex-row justify-between items-center mt-[6px]'>
                            <input onChange={handleNameChange} onKeyDown={handleNameEnter} type='text' id='name' tabIndex={1} autoComplete='on' defaultValue={user.user_name} placeholder='홍길동' className={`${nameChk === '' ? 'border-theme-4 focus:border-theme-yellow dark:border-theme-blue-2 focus:dark:border-theme-blue-1' : 'border-theme-red focus:border-theme-red dark:border-theme-red focus:dark:border-theme-red'} w-[calc(100%-84px)] text-[14px] px-[14px] py-[8px] rounded-[8px] border-[2px] placeholder-theme-7 dark:placeholder-theme-6 bg-theme-4 dark:bg-theme-blue-2 autofill:bg-theme-4 autofill:dark:bg-theme-blue-2`}/>
                            <button onClick={handleNameClick} className='w-[76px] h-[39px] flex flex-row justify-center items-center rounded-[8px] font-medium text-[14px] text-theme-4 dark:text-theme-blue-2 bg-theme-yellow/80 hover:bg-theme-yellow tlg:hover:bg-theme-yellow/80 dark:bg-theme-blue-1/80 hover:dark:bg-theme-blue-1 tlg:hover:dark:bg-theme-blue-1/80'>
                                {
                                    isLoading === true
                                    ? <span className='loader loader-register w-[18px] h-[18px]'></span>
                                    : <span className='pt-px'>변경하기</span>
                                }
                            </button>
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
                        <div className='w-[100%] text-[14px] mt-[6px] px-[14px] py-[8px] rounded-[8px] border-[2px] text-theme-8 dark:text-theme-7 border-theme-6 dark:border-theme-4 bg-theme-4 dark:bg-theme-blue-2/60 cursor-default'>{user.user_id}</div>
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
                            <input type='password' id='pw' tabIndex={2} autoComplete='on' defaultValue={user.user_pw} disabled className='text-theme-8 dark:text-theme-7 border-theme-6 dark:border-theme-4 w-[calc(100%-84px)] text-[14px] px-[14px] py-[8px] rounded-[8px] border-[2px] bg-theme-4 dark:bg-theme-blue-2/60'/>
                            <button onClick={handleChangePwModalClick} className='w-[76px] h-[39px] pt-px rounded-[8px] font-medium text-[14px] text-theme-4 dark:text-theme-blue-2 bg-theme-yellow/80 hover:bg-theme-yellow tlg:hover:bg-theme-yellow/80 dark:bg-theme-blue-1/80 hover:dark:bg-theme-blue-1 tlg:hover:dark:bg-theme-blue-1/80'>변경하기</button>
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
                </div>
            </form>

            {/* 비밀번호 변경 모달창 */}
            <ChangePwModal
                display={changePwModalDisplay}
                close={handleChangePwModalClose}
                success={handlePwChangeOnSuccess}
                id={user.user_id}
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
        // 필터링 쿠키 체크
        const cookieTheme = ctx.req.cookies.theme === undefined ? "dark" : ctx.req.cookies.theme;

        // 디바이스 체크
        const userAgent = ctx.req ? ctx.req.headers['user-agent'] : navigator.userAgent;

        // 쿠키에 저장된 세션ID가 유효하면, 유저 정보 가져오기
        const session = ctx.req.cookies.session;
        const user = session === undefined
            ? null
            : await CheckIfSessionExists(session)
                ? await FetchUserInfo(session)
                : null;

        // 쿠키에 저장된 세션ID가 유효하지 않다면, 메인페이지로 이동, 유효하면 클리이언트로 유저 정보 return
        if (user === null) {
            return {
                redirect: {
                    destination: '/404',
                    permanent: false,
                }
            }
        } else {
            return {
                props: {
                    params: {
                        theme: cookieTheme,
                        userAgent: userAgent,
                        user: JSON.parse(JSON.stringify(user)),
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