import client from "@/libs/client";

export async function FetchFontInfo(id: string) {
    const fonts = await client.fonts.findMany({
        select: { // 특정 column 선택
            code: true,
            name: true,
            lang: true,
            view: true,
            font_family: true,
            font_type: true,
            font_weight: true,
            source: true,
            source_link: true,
            github_link: true,
            cdn_css: true,
            cdn_link: true,
            cdn_import: true,
            cdn_font_face: true,
            cdn_url: true,
            license_print: true,
            license_web: true,
            license_video: true,
            license_package: true,
            license_embed: true,
            license_bici: true,
            license_ofl: true,
            license_purpose: true,
            license_source: true,
            license: true,
        },
        where: {
            code: Number(id),
        },
    })

    return fonts;
}