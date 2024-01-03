import prisma from "@/libs/prisma";

export async function FetchFontDetail(font_family: string) {
    const fonts = await prisma.fonts.findMany({
        where: {
            font_family: font_family,
            show_type: true,
        },
    })

    return fonts;
}