import type { NextApiRequest, NextApiResponse } from 'next';
import client from '@/libs/client';

type fonts = {
    code: number
    name: string
    source: string
    font_family: string
}
  
interface data {
    fonts: fonts[],
    id: number
}
  
export default async function handler(req: NextApiRequest, res: NextApiResponse<data>) {
    if (req.method === 'GET') {
        const thisQuery = req.query;
        const thisKeyword = thisQuery.keyword === undefined || thisQuery.keyword === '' ? 'no-data' : thisQuery.keyword as string;

        const fonts = await client.fonts.findMany({
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
        })
        return res.json({ fonts, id: fonts.length })
    }
}