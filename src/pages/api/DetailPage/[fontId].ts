import type { NextApiRequest, NextApiResponse } from 'next';
import client from '@/libs/client';

type fonts = {
    code: number
    name: string
    lang: string
    view: number
    font_family: string
    font_type: string
    font_weight: string
    source: string
    source_link: string
    github_link: string
    cdn_css: string
    cdn_link: string
    cdn_import: string
    cdn_font_face: string
    cdn_url: string
    license_print: String
    license_web: String
    license_video: String
    license_package: String
    license_embed: String
    license_bici: String
    license_ofl: String
    license_purpose: String
    license_source: String
    license: String
}
  
interface data {
    fonts: fonts[]
}
  
export default async function handler(req: NextApiRequest, res: NextApiResponse<data>) {
    if (req.method === 'GET') {
        const thisQuery = req.query;
        const id: number = thisQuery.fontId === undefined || thisQuery.fontId === "" ? 9999 : Number(thisQuery.fontId);

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
                code: id,
            },
        })
        return res.json({ fonts })
    }
}