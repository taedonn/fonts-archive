import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/libs/client-prisma';
  
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        if (req.query.action === "user") {
            const thisQuery = req.query;
            const thisKeyword = thisQuery.keyword === undefined || thisQuery.keyword === '' ? 'no-data' : thisQuery.keyword as string;

            const fonts = await prisma.fonts.findMany({
                select: { // 특정 column 선택
                    code: true,
                    name: true,
                    source: true,
                    font_family: true,
                },
                where: {
                    OR: [
                        { name: { contains: thisKeyword } },
                        { source: { contains: thisKeyword } },
                        { font_family: { contains: thisKeyword } },
                    ],
                    show_type: true
                }
            });
            return res.json({ fonts, id: fonts.length });
        }
        else if (req.query.action === "admin") {
            const thisQuery = req.query;
            const thisKeyword = thisQuery.keyword === undefined || thisQuery.keyword === '' ? 'no-data' : thisQuery.keyword as string;

            const fonts = await prisma.fonts.findMany({
                select: { // 특정 column 선택
                    code: true,
                    name: true,
                    source: true,
                    font_family: true,
                },
                where: {
                    OR: [
                        { name: { contains: thisKeyword } },
                        { source: { contains: thisKeyword } },
                        { font_family: { contains: thisKeyword } },
                    ]
                }
            });
            return res.json({ fonts, id: fonts.length });
        }
    }
}