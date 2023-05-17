import client from "@/libs/client";

export async function FetchFont() {
    const fonts = await client.fonts.findMany({
        select: { code: true, },
    });

    return fonts;
}