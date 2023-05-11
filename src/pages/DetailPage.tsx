// 훅
import client from "@/libs/client";

// 컴포넌트
import Tooltip from "@/components/tooltip";

export default function DetailPage({fonts}:any) {
    return (
        <>
            <Tooltip/>
            {/* <div className='w-[100%] flex flex-col justify-start items-end'>
                <div className="main-menu w-[100%] relative flex flex-wrap flex-row justify-between items-stretch mt-[68px] p-[16px]">
                    {
                        fonts.map((font:any) => (
                            <Link href={`/DetailPage/${font.code}`} key={font.code} className="w-[calc(33.3%-8px)] h-[360px] block p-[20px] border border-dark-theme-4 rounded-[8px] mt-[12px] hover:bg-dark-theme-3/40 cursor-pointer">
                                <link href={font.cdn_url} rel="stylesheet" type="text/css" itemProp="url"></link>
                                <div style={{fontFamily:"'"+font.font_family+"'"}} className="text-[18px] text-normal leading-tight mb-[8px] text-dark-theme-8">{font.name}</div>
                                <div className="flex flex-row justify-start items-center">
                                    <div style={{fontFamily:"'"+font.font_family+"'"}} className="inline-block text-[14px] text-normal text-dark-theme-6 leading-tight"><span className="text-dark-theme-8">by</span> {font.source}</div>
                                </div>
                                <div className="w-[100%] h-px my-[16px] bg-dark-theme-4"></div>
                                <div style={{fontFamily:"'"+font.font_family+"'"}} className="text-[36px] text-normal leading-normal overflow-hidden">
                                    <p className="ellipsed-text text-dark-theme-8">너 지금 멋지게 헤엄치려고 숨 참는 것부터 하고 있다고 생각해.</p>
                                </div>
                            </Link>
                        ))
                    }
                </div>
            </div> */}
        </>
    )
}

export async function getServerSideProps() {
    try {
        const fonts = await client.fonts.findMany({
            select: { // 특정 필드만 선택
                code: true,
                name: true,
                lang: true,
                date: true,
                source: true,
                font_family: true,
                font_type: true,
                cdn_url: true
            },
            take: 12,
        });
        return { props: { fonts } }
    } catch (error) {
        console.log(error)
        return { props: {} }
    }
}