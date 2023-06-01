import client from "@/libs/client";

export async function FetchFontComp(comps: string, id: string) {
    const fonts = await client.fonts.findMany({
        select: { // 특정 column 선택
            code: true,
            name: true,
            font_family: true,
            source: true,
            cdn_url: true,
        },
        where: {
            source: comps,
            NOT: {
                code: Number(id)
            }
        },
    })

    return fonts;
}