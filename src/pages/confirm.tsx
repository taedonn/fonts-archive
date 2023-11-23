// react hooks
import { useEffect } from "react";
import { useCookies } from "react-cookie";

// API
import { CheckIfSessionExists } from "./api/user/checkifsessionexists";
import { FetchUserInfo } from "./api/user/fetchuserinfo";
import axios from "axios";

// common
import { dateFormat } from "@/libs/common";

const Confirm = ({params}: any) => {
    const user = params.user;

    // 쿠키 훅
    const [, setCookie] = useCookies<string>([]);

    // 로딩 시 body 패딩 제거 & 풋터 제거
    useEffect(() => {
        const head = document.head as HTMLHeadElement;
        const body = document.body as HTMLBodyElement;
        const footer = document.getElementsByTagName("footer")[0] as HTMLElement;
        
        head.innerHTML += '<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/fonts-archive/IntelOneMono/IntelOneMono.css" type="text/css"/>'
        body.style.paddingBottom = "0";
        footer.style.display = "none";

        /** 이메일 확인 DB에 저장 후 쿠키 저장 */
        async function updateEmailConfirmation() {
            await axios.post("/api/user/updateemailconfirm", {
                session_id: user.user_session_id
            })
            .then(() => {
                setCookie('session', user.user_session_id, {path:'/', expires: new Date(), secure:true, sameSite:'none'});
            })
            .catch(err => console.log(err));
        }
        updateEmailConfirmation();
    }, [user, setCookie]);
    
    return (
        <>
            <div className="w-[100%] h-[100vh] flex flex-col justify-center items-center text-center text-theme-3 dark:text-theme-9">
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
                    {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
                    <a href="/" className="flex justify-center items-center w-[132px] h-[36px] rounded-full text-[13px] border border-theme-8 hover:border-theme-3 dark:border-theme-blue-1/40 hover:bg-theme-3 hover:dark:bg-theme-blue-1 text-theme-3 hover:text-theme-9 dark:text-theme-blue-1 hover:dark:text-theme-blue-2 cursor-pointer duration-100">메인 페이지</a>
                </div>
            </div>
        </>
    )
}

export async function getServerSideProps(ctx: any) {
    try {
        const session = ctx.query.session;
        const user = session === undefined
            ? null
            : await CheckIfSessionExists(session)
                ? await FetchUserInfo(session)
                : null;

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