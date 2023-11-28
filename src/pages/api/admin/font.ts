import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/libs/client-prisma';

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
                // 필터링 값
                const filter = req.query.filter === "all"
                    ? {name: {contains: req.query.text as string}}
                    : req.query.filter === "kr"
                        ? { 
                            AND: [
                                {lang: {equals: "KR"}},
                                {name: {contains: req.query.text as string}},
                            ]
                        }
                        : req.query.filter === "en"
                            ? {
                                AND: [
                                    {lang: {equals: "EN"}},
                                    {name: {contains: req.query.text as string}},
                                ]
                            }
                            : req.query.filter === "show"
                                ? {
                                    AND: [
                                        {show_type: {equals: true}},
                                        {name: {contains: req.query.text as string}},
                                    ]
                                }
                                : {
                                    AND: [
                                        {show_type: {equals: false}},
                                        {name: {contains: req.query.text as string}},
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
                    where: filter
                });
                const count = Number(length.length) % 10 > 0 ? Math.floor(Number(length.length)/10) + 1 : Math.floor(Number(length.length)/10);

                // 폰트 가져오기
                const fonts = await prisma.fonts.findMany({
                    where: filter,
                    orderBy: [{code: 'desc'}], // 정렬순
                    take: 10, // 가져오는 데이터 수
                    skip: Number(req.query.page) === 1 ? 0 : (Number(req.query.page) - 1) * 10
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
                await prisma.fonts.update({
                    where: { code: Number(req.body.id) },
                    data: {
                        name: req.body.name,
                        lang: req.body.lang,
                        date: req.body.date,
                        font_family: req.body.font_family,
                        font_type: req.body.font_type,
                        font_weight: req.body.font_weight,
                        source: req.body.source,
                        source_link: req.body.source_link,
                        github_link: req.body.download_link,
                        cdn_css: req.body.cdn_css,
                        cdn_link: req.body.cdn_link,
                        cdn_import: req.body.cdn_import,
                        cdn_font_face: req.body.cdn_font_face,
                        cdn_url: req.body.cdn_url,
                        license_print: req.body.license[0],
                        license_web: req.body.license[1],
                        license_video: req.body.license[2],
                        license_package: req.body.license[3],
                        license_embed: req.body.license[4],
                        license_bici: req.body.license[5],
                        license_ofl: req.body.license[6],
                        license_purpose: req.body.license[7],
                        license_source: req.body.license[8],
                        license: req.body.license_text,
                        show_type: req.body.show_type
                    }
                });

                return res.status(200).json({
                    msg: "Editing font has succeeded.",
                });
            } catch (err) {
                return res.status(500).json({
                    msg: "Editing font has failed.",
                    err: err
                });
            }
        }
        else if (req.body.action === "add") {
            try {
                await prisma.fonts.create({
                    data: {
                        name: req.body.name,
                        lang: req.body.lang,
                        date: req.body.date,
                        font_family: req.body.font_family,
                        font_type: req.body.font_type,
                        font_weight: req.body.font_weight,
                        source: req.body.source,
                        source_link: req.body.source_link,
                        github_link: req.body.download_link,
                        cdn_css: req.body.cdn_css,
                        cdn_link: req.body.cdn_link,
                        cdn_import: req.body.cdn_import,
                        cdn_font_face: req.body.cdn_font_face,
                        cdn_url: req.body.cdn_url,
                        license_print: req.body.license[0],
                        license_web: req.body.license[1],
                        license_video: req.body.license[2],
                        license_package: req.body.license[3],
                        license_embed: req.body.license[4],
                        license_bici: req.body.license[5],
                        license_ofl: req.body.license[6],
                        license_purpose: req.body.license[7],
                        license_source: req.body.license[8],
                        license: req.body.license_text,
                    }
                });

                return res.status(200).json({
                    msg: "font added successfully.",
                });
            } catch (err) {
                return res.status(500).json({
                    msg: "font failed to add.",
                    err: err
                });
            }
        }
    }
}