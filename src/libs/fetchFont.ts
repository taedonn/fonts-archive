import client from "./client"

export async function fetchFont() {
    const fonts = await client.fonts.findMany({
        select: { code: true, },
    });

    return fonts;
}