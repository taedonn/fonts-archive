import client from "@/libs/client-prisma";

export async function FetchFontDetail(id: string) {
    const fonts = await client.fonts.findMany({
        where: { code: Number(id) },
    })

    return fonts;
}