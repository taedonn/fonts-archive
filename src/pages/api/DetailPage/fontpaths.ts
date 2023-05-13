import type { NextApiRequest, NextApiResponse } from 'next';
import client from '@/libs/client';

type fonts = {
    code: number
}
  
interface data {
    fonts: fonts[]
}
  
export default async function handler(req: NextApiRequest, res: NextApiResponse<data>) {
    if (req.method === 'GET') {
        const fonts = await client.fonts.findMany({
            select: { // 특정 column 선택
                code: true,
            },
        })
        return res.json({ fonts })
    }
}