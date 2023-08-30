// react hooks
import { useEffect, useState } from "react";
import { useCookies } from 'react-cookie';
import { debounce } from "lodash";

// api
import { CheckIfSessionExists } from "../api/user/checkifsessionexists";
import { FetchUserInfo } from "../api/user/fetchuserinfo";

// components
import Header from "@/components/header";

const Index = ({params}: any) => {
    // 디바이스 체크
    const isMac: boolean = params.userAgent.includes("Mac OS") ? true : false

    // 빈 함수
    const emptyFn = () => { return; }

    // 마스터가 아니면 인덱스로 이동
    useEffect(() => {
        if (params.user.user_no !== 0) {
            alert("접근 권한이 없습니다.");
            location.href = '/';
        }
    }, [params]);

    return (
        <>
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
        </>
    );
}

export async function getServerSideProps(ctx: any) {
    try {
        // 쿠키
        const cookieTheme = ctx.req.cookies.theme === undefined ? "dark" : ctx.req.cookies.theme;

        // 디바이스 체크
        const userAgent = ctx.req ? ctx.req.headers['user-agent'] : navigator.userAgent;

        // 쿠키에 저장된 세션ID가 유효하면, 유저 정보 가져오기
        const user = ctx.req.cookies.session === undefined ? null : (
            await CheckIfSessionExists(ctx.req.cookies.session) === true 
            ? await FetchUserInfo(ctx.req.cookies.session)
            : null
        );

        return {
            props: {
                params: {
                    theme: cookieTheme,
                    userAgent: userAgent,
                    user: user
                }
            }
        }
    }
    catch (error) {
        console.log(error);
    }
}

export default Index;