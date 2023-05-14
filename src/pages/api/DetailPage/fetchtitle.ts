import type { NextApiRequest, NextApiResponse } from 'next';
import client from '@/libs/client';

type fonts = {
    code: number
    name: string
}
  
interface data {
    fonts: fonts[]
}
  
export default async function handler(req: NextApiRequest, res: NextApiResponse<data>) {
    const thisQuery = req.query;
    const id: number = thisQuery.fontId === undefined || thisQuery.fontId === "" ? 9999 : Number(thisQuery.fontId);
    
    if (req.method === 'GET') {
        const fonts = await client.fonts.findMany({
            select: { // 특정 column 선택
                code: true,
                name: true,
            },
            where: {
                code: id
            }
        })
        return res.json({ fonts })
    }
}