import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/libs/client-prisma';
  
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
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
                    msg: "Editing font has succeeded.",
                });
            } catch (err) {
                return res.status(500).json({
                    msg: "Editing font has failed.",
                    err: err
                });
            }
        }
    }
}