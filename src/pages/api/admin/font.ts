import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/libs/prisma';

const limit = 10;

// 페이지 수
export async function FetchFontsLength(search: string) {
    const fonts = await prisma.fonts.findMany({
        select: { code: true },
        where: {
            OR: [
                {name: { contains: search }},
                {font_family: { contains: search }},
            ]
        },
    });
    const count = Number(fonts.length) % limit > 0 ? Math.floor(Number(fonts.length)/limit) + 1 : Math.floor(Number(fonts.length)/limit);

    return count;
}

// 목록
export async function FetchFonts(page: number, filter: string, search: string) {
    const fonts = await prisma.fonts.findMany({
        where: {
            OR: [
                {name: { contains: search }},
                {font_family: { contains: search }},
            ]
        },
        orderBy: filter === "date"
            ? [{code: "desc"}]
            : filter === "name"
                ? [{name: "asc"}, {code: "desc"}]
                : filter === "view"
                    ? [{view: "desc"}, {code: "desc"}]
                    : [{like: "desc"}, {code: "desc"}],
        skip: (Number(page) - 1) * limit,
        take: limit, // 가져오는 데이터 수
    });

    return fonts;
}

// 폰트 모두 불러오기
export async function FetchFont(code: number) {
    const font = await prisma.fonts.findUnique({
        where: { code: code }
    });
    
    return font;
}

export async function FetchAllFonts() {
    const fonts = await prisma.fonts.findMany({
        select: { font_family: true },
        where: { show_type: true }
    });

    return fonts;
}
  
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        if (req.body.action === "edit") {
            try {
                const {
                    id,
                    name,
                    lang,
                    date,
                    font_family,
                    font_type,
                    font_weight,
                    source,
                    source_link,
                    download_link,
                    cdn_css,
                    cdn_link,
                    cdn_import,
                    cdn_font_face,
                    cdn_url,
                    license,
                    license_text,
                    show_type,
                } = req.body;

                await prisma.fonts.update({
                    where: { code: Number(id) },
                    data: {
                        name: name,
                        lang: lang,
                        date: date,
                        font_family: font_family,
                        font_type: font_type,
                        font_weight: font_weight,
                        source: source,
                        source_link: source_link,
                        github_link: download_link,
                        cdn_css: cdn_css,
                        cdn_link: cdn_link,
                        cdn_import: cdn_import,
                        cdn_font_face: cdn_font_face,
                        cdn_url: cdn_url,
                        license_print: license[0],
                        license_web: license[1],
                        license_video: license[2],
                        license_package: license[3],
                        license_embed: license[4],
                        license_bici: license[5],
                        license_ofl: license[6],
                        license_purpose: license[7],
                        license_source: license[8],
                        license: license_text,
                        show_type: show_type
                    }
                });

                return res.status(200).json({
                    msg: "폰트 수정 성공",
                });
            } catch (err) {
                return res.status(500).json({
                    msg: "폰트 수정 실패",
                    err: err
                });
            }
        }
        else if (req.body.action === "add") {
            try {
                const {
                    name,
                    lang,
                    date,
                    font_family,
                    font_type,
                    font_weight,
                    source,
                    source_link,
                    download_link,
                    cdn_css,
                    cdn_link,
                    cdn_import,
                    cdn_font_face,
                    cdn_url,
                    license,
                    license_text,
                } = req.body;

                await prisma.fonts.create({
                    data: {
                        name: name,
                        lang: lang,
                        date: date,
                        font_family: font_family,
                        font_type: font_type,
                        font_weight: font_weight,
                        source: source,
                        source_link: source_link,
                        github_link: download_link,
                        cdn_css: cdn_css,
                        cdn_link: cdn_link,
                        cdn_import: cdn_import,
                        cdn_font_face: cdn_font_face,
                        cdn_url: cdn_url,
                        license_print: license[0],
                        license_web: license[1],
                        license_video: license[2],
                        license_package: license[3],
                        license_embed: license[4],
                        license_bici: license[5],
                        license_ofl: license[6],
                        license_purpose: license[7],
                        license_source: license[8],
                        license: license_text,
                    }
                });

                return res.status(200).json({
                    msg: "폰트 추가 성공",
                });
            } catch (err) {
                return res.status(500).json({
                    msg: "폰트 추가 실패",
                    err: err
                });
            }
        }
    }
}