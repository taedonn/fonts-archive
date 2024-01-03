import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/libs/prisma';

// SSR 댓글 페이지 수
export async function FetchFontsLength() {
    const fonts = await prisma.fonts.findMany({
        select: { code: true },
    });

    return fonts.length;
}

// SSR 첫 댓글 목록 가져오기
export async function FetchFonts(lastId: number | undefined) {
    const fonts = await prisma.fonts.findMany({
        orderBy: [{code: 'desc'}], // 정렬순
        take: 10, // 가져오는 데이터 수
        skip: lastId ? 1 : 0,
        ...(lastId && { cursor: {code: lastId} })
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
    if (req.method === "GET") {
        if (req.query.action === "fetch-fonts") {
            try {
                const { page, filter, text } = req.query;

                // 필터링 값
                const filters = filter === "all"
                    ? {name: {contains: text as string}}
                    : filter === "kr"
                        ? { 
                            AND: [
                                {lang: {equals: "KR"}},
                                {name: {contains: text as string}},
                            ]
                        }
                        : filter === "en"
                            ? {
                                AND: [
                                    {lang: {equals: "EN"}},
                                    {name: {contains: text as string}},
                                ]
                            }
                            : filter === "show"
                                ? {
                                    AND: [
                                        {show_type: {equals: true}},
                                        {name: {contains: text as string}},
                                    ]
                                }
                                : {
                                    AND: [
                                        {show_type: {equals: false}},
                                        {name: {contains: text as string}},
                                    ]
                                };

                // 댓글 페이지 수 가져오기
                const length = await prisma.fonts.findMany({
                    select: {
                        code: true,
                        name: true,
                        lang: true,
                        show_type: true,
                    },
                    where: filters
                });
                const count = Number(length.length) % 10 > 0 ? Math.floor(Number(length.length)/10) + 1 : Math.floor(Number(length.length)/10);

                // 폰트 가져오기
                const fonts = await prisma.fonts.findMany({
                    where: filters,
                    orderBy: [{code: 'desc'}], // 정렬순
                    take: 10, // 가져오는 데이터 수
                    skip: Number(page) === 1 ? 0 : (Number(page) - 1) * 10
                });

                return res.status(200).json({
                    msg: "댓글 가져오기 성공",
                    fonts: fonts,
                    count: count,
                });
            } catch (err) {
                return res.status(500).json({
                    msg: "폰트 가져오기 실패",
                    err: err,
                })
            }
        }
    } else if (req.method === 'POST') {
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