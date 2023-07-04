import type { NextApiRequest, NextApiResponse } from 'next';
import client from '@/libs/client';
  
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        const code: string = req.query.code === undefined || req.query.code === '' ? '' : req.query.code as string;
        const checked: boolean =  req.query.checked === 'true' ? true : false;

        await client.fonts.update({
            where: { code: Number(code) },
            data: { like: checked ? { increment: 1 } : { decrement: 1 } }
        });

        return res.send(checked);
    }
}