// react
import { useEffect } from "react";

// next
import Link from "next/link";

// api
import { FetchUserInfoFromToken } from "./api/auth/auth";

// libraries
import axios from "axios";

// common
import { dateFormat } from "@/libs/common";

const Confirm = ({params}: any) => {
    const { user } = params;

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
            .then(res => console.log(res))
            .catch(err => console.log(err));
        }
        updateEmailConfirmation();
    }, [user]);
    
    return (
        <>
            <div className="w-full h-full absolute left-0 top-0 flex justify-center items-center text-center text-l-2 dark:text-white">
                <div className="w-[22.5rem]">
                    <div className="text-3xl font-medium">
                        환영합니다 {user.user_name}님!
                    </div>
                    <div className="text-sm mt-2.5 leading-relaxed">
                        폰트 아카이브의 회원이 되어주셔서 감사합니다. <br/>
                        앞으로 다양한 기능이 추가될 예정이니 자주 방문해 주세요!
                    </div>
                    <div style={{fontFamily: "Intel One Mono"}} className="w-full px-7 py-4 mt-5 text-left leading-loose rounded-lg text-sm bg-h-1/20 dark:bg-f-8/20 border border-dashed border-h-1 dark:border-f-8">
                        이름: {user.user_name} <br/>
                        이메일: {user.user_id} <br/>
                        가입일: {dateFormat(user.created_at)}
                    </div>
                    <div className="flex justify-center items-center mt-10">
                        <Link href="/" className="flex justify-center items-center w-[8.25rem] h-9 rounded-lg text-sm border border-h-1 dark:border-f-8 hover:bg-h-1 hover:dark:bg-f-8 tlg:hover:bg-transparent tlg:hover:dark:bg-transparent text-h-1 dark:text-f-8 hover:text-white hover:dark:text-d-2 tlg:hover:text-h-1 tlg:hover:dark:text-f-8 cursor-pointer duration-100">메인 페이지</Link>
                    </div>
                </div>
            </div>
        </>
    )
}

export async function getServerSideProps(ctx: any) {
    try {
        // 쿠키 체크
        const { theme } = ctx.req.cookies;

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
                        theme: theme ? theme : 'light',
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