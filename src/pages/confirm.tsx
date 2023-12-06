// react hooks
import { useEffect } from "react";
import { useCookies } from 'react-cookie';

// next hooks
import Link from "next/link";

// api
import { FetchUserInfoFromToken } from "./api/auth/auth";
import axios from "axios";

// common
import { dateFormat } from "@/libs/common";

const Confirm = ({params}: any) => {
    const user = params.user;
    const [, setCookie] = useCookies<string>([]);

    // 로딩 시 폰트 다운로드
    useEffect(() => {
        const head = document.head as HTMLHeadElement;    
        head.innerHTML += '<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/fonts-archive/IntelOneMono/IntelOneMono.css" type="text/css"/>'

        /** 이메일 확인 DB에 저장 후 쿠키 저장 */
        async function updateEmailConfirmation() {
            await axios.post("/api/user/updateemailconfirm", {
                email_token: user.user_email_token,
                user_id: user.user_id,
            })
            .then(res => {
                let date = new Date();
                let expires = new Date(date.setDate(date.getDate() + 7));
                setCookie('refreshToken', res.data.refreshToken, {path:'/', expires: expires, secure: true, sameSite: 'strict'});
            })
            .catch(err => console.log(err));
        }
        updateEmailConfirmation();
    }, [user, setCookie]);
    
    return (
        <>
            <div className="w-[100%] h-[100%] absolute left-0 top-0 flex flex-col justify-center items-center text-center text-theme-3 dark:text-theme-9">
                <div className="text-[28px] font-medium">
                    환영합니다 {user.user_name}님!
                </div>
                <div className="text-[14px] mt-[8px] leading-relaxed">
                    폰트 아카이브의 회원이 되어주셔서 감사합니다. <br/>
                    앞으로 다양한 기능이 추가될 예정이니 자주 방문해 주세요!
                </div>
                <div style={{fontFamily: "Intel One Mono"}} className="w-[340px] px-[28px] py-[16px] mt-[16px] text-left leading-loose rounded-[8px] text-[14px] text-theme-3 dark:text-theme-9 bg-theme-red/20 dark:bg-theme-blue-1/20 border border-dashed border-theme-red dark:border-theme-blue-1">
                    이름: {user.user_name} <br/>
                    이메일: {user.user_id} <br/>
                    가입일: {dateFormat(user.created_at)}
                </div>
                <div className="flex items-center mt-[40px]">
                    <Link href="/" className="flex justify-center items-center w-[132px] h-[36px] rounded-full text-[13px] border border-theme-8 hover:border-theme-3 dark:border-theme-blue-1/40 hover:bg-theme-3 hover:dark:bg-theme-blue-1 text-theme-3 hover:text-theme-9 dark:text-theme-blue-1 hover:dark:text-theme-blue-2 cursor-pointer duration-100">메인 페이지</Link>
                </div>
            </div>
        </>
    )
}

export async function getServerSideProps(ctx: any) {
    try {
        // token 불러오기
        const token = ctx.query.token;

        // token으로 유저 정보 불러오기
        const user = token === undefined
            ? null
            : await FetchUserInfoFromToken(token);

        if (user === null || user.user_email_confirm) {
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
                        user: JSON.parse(JSON.stringify(user))
                    }
                }
            }
        }
    }
    catch (error) {
        console.log(error);
    }
}

export default Confirm;