// 훅
import axios from "axios";
import client from "@/libs/client";

// 컴포넌트
import Tooltip from "@/components/tooltip";

function DetailPage({font}:{font: object}) {
    console.log(font);
    return (
        <>
            <Tooltip/>
            <div></div>
        </>
    )
}

export async function getStaticPaths() {
    const fonts = await client.fonts.findMany({
        select: { code: true, },
    })

    const paths = fonts.map((font: any) => ({
        params: { fontId: font.code.toString() },
    }))

    return { paths, fallback: false }
  }

export async function getStaticProps(ctx: any) {
        const res = await axios.get(`http://localhost:3000/api/DetailPage/${ctx.params.fontId}`);
        const data = res.data;

        return {
            props: { font: data }
        }
}

export default DetailPage;