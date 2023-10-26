import prisma from "@/libs/client-prisma";

export async function FetchFontDetail(id: string) {
    const fonts = await prisma.fonts.findMany({
        where: {
            code: Number(id),
            show_type: true,
        },
    })

    return fonts;
}