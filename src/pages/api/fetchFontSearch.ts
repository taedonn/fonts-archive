import client from "@/libs/client";

export async function FetchFontSearch(keyword: string) {
    const fonts = await client.fonts.findMany({
        select: { // 특정 column 선택
            code: true,
            name: true,
            source: true,
            font_family: true,
        },
        where: {
            OR: [
                { name: { contains: keyword } },
                { source: { contains: keyword } },
                { font_family: { contains: keyword } },
            ]
        }
    });

    return fonts;
}