// next
import { NextSeo } from 'next-seo';
import Image from 'next/image';

// next-auth
import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]';
import { FetchUserInfo } from '../api/auth/auth';

// react
import React, { useState, useEffect, useRef, ChangeEvent } from 'react';

// libraries
import imageCompression from 'browser-image-compression';
import { Switch } from '@mui/material';

// components
import Motion from '@/components/motion';
import Header from "@/components/header";
import Footer from '@/components/footer';
import ChangePwModal from '@/components/changepwmodal';
import DeleteUserModal from '@/components/deleteusermodal';
import Button from '@/components/button';
import KakaoAdFitLeftBanner from '@/components/kakaoAdFitLeftBanner';
import KakaoAdFitRightBanner from '@/components/kakaoAdFitRightBanner';

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
    const [isProtected, setIsProtected] = useState<boolean>(user.protected);
    const [isProtectionLoading, setIsProtectionLoading] = useState<boolean>(false);
    const [initialProtectionDisplay, setInitialProtectionDisplay] = useState<boolean>(false);
    const [alert, setAlert] = useState<string>('');
    const [alertDisplay, setAlertDisplay] = useState<boolean>(false);
    const [changePwModalDisplay, setChangePwModalDisplay] = useState<boolean>(false);
    const [deleteUserModalDisplay, setDeleteUserModalDisplay] = useState<boolean>(false);

    // 새로고침 시 input에 값 넣기
    useEffect(() => {
        const name = document.getElementById("name") as HTMLInputElement;
        if (name && name.value) setNameVal(name.value);
    }, []);

    /** 이름 체인지 이벤트 */
    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNameChk('');
        setNameVal(e.target.value);
    }

    /** 사생활 보호 체인지 이벤트 */
    const handlePrivacyChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        setIsProtected(e.target.checked);
        setIsProtectionLoading(true);
        setInitialProtectionDisplay(true);

        const url = "/api/user/updateuserinfo";
        const options = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                action: "update-privacy",
                user_no: user.user_no,
                img: e.target.checked ? user.public_img : user.profile_img,
                privacy: e.target.checked,
            })
        }

        await fetch(url, options)
        .then(() => setIsProtectionLoading(false))
        .catch(err => console.log(err));
    }

    /** 이름 변경하기 클릭 이벤트 */
    const handleNameClick = async () => {
        // 로딩 스피너 실행
        setIsLoading(true);

        if (nameVal === '') { setNameChk('empty'); }
        else if (nameVal === userName) { setNameChk("exists"); }
        else {
            // 이름 변경하기 API 호출
            const url = "/api/user/updateuserinfo";
            const options = {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    action: "change-name",
                    user_no: user.user_no,
                    name: nameVal,
                })
            }

            await fetch(url, options)
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
        const url = "/api/user/updateuserinfo";
        const options = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                action: 'delete-profile-img',
                user_no: user.user_no
            })
        }

        await fetch(url, options)
        .then(res => res.json())
        .then(data => {
            setProfileImg(data.img);

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
        const changeImgUrl = "/api/user/updateuserinfo";
        const changeImgOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                action: 'change-img',
                file_name: `fonts-archive-user-${user.user_no}-profile-img.` + fileType,
                file_type: file.type,
            })
        }

        await fetch(changeImgUrl, changeImgOptions)
        .then(res => res.json())
        .then(async (data) => {
            // s3 업로드
            const s3PutOptions = {
                method: "PUT",
                headers: { "Content-Type": file.type },
                body: file
            }
            
            await fetch(data.url, s3PutOptions)
            .then(async () => {
                const prismaPostUrl = "/api/user/updateuserinfo";
                const prismaPostOptions = {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        action: "upload-img-on-prisma",
                        user_no: user.user_no,
                        img_type: fileType,
                    })
                }

                await fetch(prismaPostUrl, prismaPostOptions)
                .then(res => res.json())
                .then(data => {
                    // 프로필 이미지 변경
                    setProfileImg(data.url);
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
            <Motion
                initialOpacity={0}
                animateOpacity={1}
                exitOpacity={0}
                transitionType="spring"
            >
                <form onSubmit={e => e.preventDefault()} className='w-full flex flex-col justify-center items-center text-l-2 dark:text-white'>
                    <div className='flex fixed left-0 top-40'>
                        <KakaoAdFitLeftBanner marginLeft={2}/>
                    </div>
                    <div className='flex fixed right-0 top-40'>
                        <KakaoAdFitRightBanner marginRight={2}/>
                    </div>
                    <div className='w-[22.5rem] flex flex-col justify-center items-start my-16 lg:my-24 mt-8 lg:mt-16'>
                        <h2 className='text-2xl font-bold mb-6'>프로필 정보</h2>
                        <div className='w-full flex items-end gap-3 mb-3'>
                            {
                                user.auth === "credentials"
                                    ? <div className='text-sm text-l-5 dark:text-d-c'>{timeFormat(user.updated_at)}에 마지막으로 수정됨</div>
                                    : <div className='text-sm text-l-5 dark:text-d-c'>{timeFormat(user.created_at)}에 생성됨</div>
                            }
                        </div>
                        {
                            alertDisplay
                            ? alert === 'name'
                                ? <div className='w-full h-10 px-2.5 mb-3 flex justify-between items-center rounded-lg border-2 border-h-1 dark:border-f-8 text-xs bg-h-1/20 dark:bg-f-8/20'>
                                    <div className='flex items-center'>
                                        <i className='text-sm text-h-1 dark:text-f-8 fa-regular fa-bell'></i>
                                        <div className='ml-2'>이름이 변경되었습니다.</div>
                                    </div>
                                    <div onClick={handleAlertClose} className='flex justify-center items-center cursor-pointer'>
                                        <i className="text-sm fa-solid fa-xmark"></i>
                                    </div>
                                </div>
                                : alert === 'pw'
                                    ? <>
                                        <div className='w-full h-10 px-2.5 mb-3 flex justify-between items-center rounded-lg border-2 border-h-1 dark:border-f-8 text-xs bg-h-1/20 dark:bg-f-8/20'>
                                            <div className='flex items-center'>
                                                <i className='text-sm text-h-1 dark:text-f-8 fa-regular fa-bell'></i>
                                                <div className='ml-2'>비밀번호가 변경되었습니다.</div>
                                            </div>
                                            <div onClick={handleAlertClose} className='flex justify-center items-center cursor-pointer'>
                                                <i className="text-sm fa-solid fa-xmark"></i>
                                            </div>
                                        </div>
                                    </> : <></>
                            : <></>
                        }
                        <div className='w-full p-5 rounded-lg bg-l-e dark:bg-d-3 drop-shadow-default dark:drop-shadow-dark'>
                            {
                                user.auth !== "credentials"
                                    && <div className='text-xs lg:text-sm h-8 lg:h-10 px-3 mb-4 flex items-center rounded-lg border-2 border-h-1 dark:border-f-8 bg-h-1/20 dark:bg-f-8/20'>
                                        <div className='mr-0.5 font-bold'>[{user.auth === "google" ? "Google" : user.auth === "kakao" ? "카카오" : user.auth === "github" ? "GitHub" : user.auth === "naver" ? "네이버" : ""}]</div>에서 연동 중
                                    </div>
                            }
                            <div className='flex items-center'>
                                <div ref={refImg} className='relative'>
                                    <input className='peer hidden' id='profile-img' type='checkbox'/>
                                    <label className='w-14 h-14 block relative cursor-pointer overflow-hidden' htmlFor='profile-img'>
                                        {
                                            !isImgLoading
                                            ? <Image src={user.auth !== "credentials" && isProtected ? user.public_img : profileImg} alt='Profile image' fill sizes='100%' priority referrerPolicy='no-referrer' className='object-cover rounded-full'/>
                                            : <div className='w-full h-full rounded-full flex items-center bg-l-d dark:bg-d-4'><div className='img-loader'></div></div>
                                        }
                                        {
                                            user.auth === "credentials"
                                                && <div className='w-5 h-[1.125rem] flex justify-center items-center absolute z-10 left-0.5 bottom-0.5 rounded-md bg-h-1 dark:bg-f-8 text-white dark:text-d-2'>
                                                    <i className="text-[0.625rem] fa-solid fa-pen"></i>
                                                </div>
                                        }
                                    </label>
                                    {
                                        user.auth === "credentials"
                                            && <div ref={refImgPopup} className='w-max hidden peer-checked:block absolute left-[1.875rem] -bottom-2.5 -translate-x-1/2 translate-y-full rounded-lg after:content-[""] after:w-2 after:h-2 after:absolute after:left-1/4 after:-top-1 after:-translate-x-1/2 after:rotate-45 drop-shadow-default dark:drop-shadow-dark bg-l-d dark:bg-d-4 dark:text-white after:bg-l-d after:dark:bg-d-4'>
                                                <div className='flex'>
                                                    <input onChange={changeImg} className='hidden' type='file' accept='image/*' id='profile-img-upload'/>
                                                    <label className='w-full relative z-10 text-xs leading-none rounded-t-lg pl-3 pr-3.5 pt-2.5 pb-2 hover:bg-h-1 hover:dark:bg-f-8 lg:hover:text-white hover:dark:text-d-2 cursor-pointer' htmlFor='profile-img-upload'>사진 변경</label>
                                                </div>
                                                <button onClick={deleteImg} className='w-full text-xs leading-none rounded-b-lg pl-3 pr-3.5 pt-2 pb-2.5 hover:bg-h-1 hover:dark:bg-f-8 lg:hover:text-white hover:dark:text-d-2 cursor-pointer'>사진 제거</button>
                                            </div>
                                    }
                                </div>
                                <div className='ml-4'>
                                    <h2 className='mr-px font-bold'>프로필 이미지</h2>
                                    <div className='mt-1.5 text-xs font-normal leading-none break-keep text-l-5 dark:text-d-c'>
                                        {
                                            user.auth === "credentials"
                                                ? <>
                                                    <h3 className='flex mb-0.5 leading-normal'><div className='w-0.5 h-0.5 mr-1 mt-2 rounded-full bg-l-5 dark:bg-d-c'></div>500px보다 큰 이미지는 축소되어 업로드됩니다.</h3>
                                                    <h3 className='flex leading-normal'><div className='w-0.5 h-0.5 mr-1 mt-2 shrink-0 rounded-full bg-l-5 dark:bg-d-c'></div>업로드된 이미지는 다음 로그인부터 적용됩니다.</h3>
                                                </> : <>
                                                    <h3 className='flex leading-normal'><div className='w-0.5 h-0.5 mr-1 mt-2 shrink-0 rounded-full bg-l-5 dark:bg-d-c'></div>SNS 계정의 프로필 이미지가 표시됩니다.</h3>
                                                    <h3 className='flex leading-normal'><div className='w-0.5 h-0.5 mr-1 mt-2 shrink-0 rounded-full bg-l-5 dark:bg-d-c'></div>사생활 보호 중일 시, 랜덤 이미지가 표시됩니다.</h3>
                                                </>
                                        }
                                    </div>
                                </div>
                            </div>
                            {
                                isImgError
                                && <span className='block text-xs text-h-r mt-3'>이미지 업로드에 실패했습니다. 잠시 후 다시 시도해 주세요.</span>
                            }
                            {
                                user.auth !== "credentials"
                                && <>
                                    <h2 className='mt-8 font-medium'>사생활 보호</h2>
                                    <div className='mt-1.5 text-xs text-l-5 dark:text-d-c'>
                                        <div className='flex items-start leading-normal'><div className='w-0.5 h-0.5 mr-1 mt-2 shrink-0 rounded-full bg-l-5 dark:bg-d-c'></div>프로필 이미지와 이름을 숨깁니다.</div>
                                        <div className='flex items-start leading-normal'><div className='w-0.5 h-0.5 mr-1 mt-2 shrink-0 rounded-full bg-l-5 dark:bg-d-c'></div>변경 시, 다음 로그인부터 적용됩니다.</div>
                                    </div>
                                    <div className="mt-2 flex gap-4 items-center">
                                        <div className="w-max h-12 rounded-lg px-6 flex items-center text-sm bg-l-d dark:bg-d-4">
                                            <div className="mr-3">미보호</div>
                                            <Switch
                                                checked={isProtected}
                                                onChange={handlePrivacyChange}
                                                size="small"
                                            />
                                            <div className={`${isProtected ? "text-h-1 dark:text-f-8" : ""} ml-3`}>보호중</div>
                                        </div>
                                        {
                                            isProtectionLoading
                                            ? <span className="loader w-4 h-4 border-2 border-l-b dark:border-d-6 border-b-h-1 dark:border-b-f-8"></span>
                                            : !isProtectionLoading && initialProtectionDisplay
                                                ? <div id="update-privacy" className="animate-fade-in-time-out text-xs text-h-1 dark:text-f-8">
                                                    <i className="mr-1.5 fa-solid fa-check"></i>
                                                    업데이트 성공
                                                </div>
                                                : <></>
                                        }
                                    </div>
                                </>
                            }
                            <div className='w-full h-px bg-l-b dark:bg-d-6 my-6'></div>
                            <label htmlFor='name' className='block font-medium ml-px'>이름</label>
                            {
                                user.auth === "credentials"
                                    ? <div className='w-full flex justify-between items-center mt-2'>
                                        <input onChange={handleNameChange} onKeyDown={handleNameEnter} type='text' id='name' tabIndex={1} autoComplete='on' defaultValue={user.user_name} placeholder='홍길동' className={`${nameChk === '' ? 'border-l-d dark:border-d-4 focus:border-h-1 focus:dark:border-f-8' : 'border-h-r focus:border-h-r'} w-[calc(100%-84px)] text-sm px-3.5 py-3 rounded-lg border-2 placeholder-l-5 dark:placeholder-d-c bg-l-d dark:bg-d-4`}/>
                                        <div className='w-[4.75rem]'>
                                            <Button>
                                                <button onClick={handleNameClick} className='w-full h-full flex justify-center items-center text-sm'>
                                                    {
                                                        isLoading === true
                                                        ? <span className='loader border-2 border-h-e dark:border-d-6 border-b-h-1 dark:border-b-f-8 w-4 h-4'></span>
                                                        : "변경하기"
                                                    }
                                                </button>
                                            </Button>
                                        </div>
                                    </div>
                                    : <div className='w-full text-sm mt-2 px-3.5 py-3 rounded-lg border-2 placeholder-l-5 dark:placeholder-d-c border-l-d dark:border-d-4 bg-l-d dark:bg-d-4 cursor-default'>{user.user_name}</div>
                            }
                            {
                                nameChk === 'empty'
                                ? <span className='block text-xs text-h-r mt-2 ml-4'>이름을 입력해 주세요.</span>
                                : ( nameChk === 'exists'
                                    ? <span className='block text-xs text-h-r mt-2 ml-4'>이미 사용중인 이름입니다.</span>
                                    : <></>
                                )
                            }
                            <div className='block font-medium mt-8 ml-px'>아이디</div>
                            <div className='w-full text-sm mt-2 px-3.5 py-3 rounded-lg border-2 border-transparent text-l-2 dark:text-white bg-l-d dark:bg-d-4 cursor-default'>{user.user_id}</div>
                            {
                                user.auth === "credentials" && 
                                <>
                                    <div className='w-full h-px bg-l-b dark:bg-d-6 my-6'></div>
                                    <h2 className="font-medium text-l-2 dark:text-white mb-2">비밀번호 변경</h2>
                                    <div className='w-full flex justify-start items-start mb-1.5 text-xs text-l-5 dark:text-d-c'>
                                        <i className="text-xs mr-2 text-h-1 dark:text-f-8 fa-regular fa-bell"></i>
                                        <div>영문, 숫자, 특수문자 포함 8~20자를 조합해 만들어 주세요.</div>
                                    </div>
                                    <div className='w-full flex justify-start items-start mb-3 text-xs text-l-5 dark:text-d-c'>
                                        <i className="text-xs mr-2 text-h-1 dark:text-f-8 fa-regular fa-bell"></i>
                                        <div>비밀번호 변경 완료 시, 비밀번호는 즉시 변경됩니다.</div>
                                    </div>
                                    <div className='w-full flex justify-between items-center mt-2'>
                                        <input type='password' id='pw' tabIndex={2} autoComplete='on' defaultValue={user.user_pw} disabled className='text-l-2 dark:text-white w-[calc(100%-84px)] text-sm px-3.5 py-3 rounded-lg border-2 border-transparent bg-l-d dark:bg-d-4'/>
                                        <div className='w-[4.75rem]'>
                                            <Button>
                                                <button onClick={handleChangePwModalClick} className='w-full h-full flex justify-center items-center text-sm'>변경하기</button>
                                            </Button>
                                        </div>
                                    </div>
                                </>
                            }
                            <div className='w-full h-px bg-l-b dark:bg-d-6 my-6'></div>
                            <h2 className="font-medium text-l-2 dark:text-white mb-2">회원 탈퇴</h2>
                            <div className='w-full flex justify-start items-start mb-1.5 text-xs text-l-5 dark:text-d-c'>
                                <i className="text-xs mr-2 text-h-r fa-regular fa-bell"></i>
                                <div>탈퇴 시 계정의 모든 정보는 삭제됩니다.</div>
                            </div>
                            <div className='w-full flex justify-start items-start mb-3 text-xs text-l-5 dark:text-d-c'>
                                <i className="text-xs mr-2 text-h-r fa-regular fa-bell"></i>
                                <div>재가입 시에도 삭제된 정보는 복구되지 않습니다.</div>
                            </div>
                            <Button color='red'>
                                <button onClick={handleDeleteUserModalClick} className='w-full h-full flex justify-center items-center'>회원 탈퇴하기</button>
                            </Button>
                        </div>
                    </div>
                </form>
            </Motion>

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