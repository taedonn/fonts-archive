import type { NextApiRequest, NextApiResponse } from 'next';
import client from '@/libs/client';

type fonts = {
    code: number
    name: string
}
  
interface Data {
    fonts: fonts[]
    nextId: number | undefined
}
  
export default async (req: NextApiRequest, res: NextApiResponse<Data>) => {
    if (req.method === 'GET') {
        const limit = 5
        const cursor = req.query.cursor ?? ''
        const cursorObj: any = cursor === '' ? undefined : { id: parseInt(cursor as string, 10) }
    
        const fonts = await client.fonts.findMany({
            skip: cursor !== '' ? 1 : 0,
            take: limit,
            cursor: cursorObj,
        })
        return res.json({ fonts, nextId: fonts.length === limit ? fonts[limit - 1].code : undefined })
    }
}