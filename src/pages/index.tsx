// 훅
import Link from "next/link";


// 컴포넌트
import Tooltip from "@/components/tooltip";
import client from "@/libs/client";
import SideMenu from "@/components/sidemenu";

const Index = ({fonts}:any) => {
    return (
        <>
            <Tooltip/>
            <SideMenu fonts={fonts}/>
        </>
    );
}

export async function getServerSideProps() {
    try {
        const fonts = await client.fonts.findMany({
            select: { // 특정 필드만 선택
                code: true,
                name: true,
                lang: true,
                date: true,
                font_family: true,
                font_type: true,
                cdn_link: true,
            }
        });
        return { props: { fonts } }
    } catch (error) {
        console.log(error)
        return { props: {} }
    }
}

export default Index;