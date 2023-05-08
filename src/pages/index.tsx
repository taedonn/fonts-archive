// 훅
import axios from "axios";

// 컴포넌트
import Tooltip from "@/components/tooltip";
import SideMenu from "@/components/sidemenu";
import client from "@/libs/client";

const Index = ({fonts}:any) => {
    console.log(fonts);
    return (
        <>
            <Tooltip/>
            <SideMenu/>
        </>
    );
}

export async function getServerSideProps() {
    try {
        const fonts = await client.fonts.findMany();
        return { props: { fonts } }
    } catch (error) {
        console.log(error)
        return { props: {} }
    }
}

export default Index;