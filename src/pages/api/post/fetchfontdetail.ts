import prisma from "@/libs/prisma";

export async function FetchFontDetail(font_family: string) {
    const fonts = await prisma.fonts.findMany({
        where: {
            font_family: font_family,
            show_type: true,
        },
        include: {
            liked_user: true,
            comments: {
                include: { reports: true },
                orderBy: [
                    { bundle_id: "desc" },
                    { bundle_order: "asc" },
                    { comment_id: "desc" }
                ]
            },
        },
    })

    return fonts;
}