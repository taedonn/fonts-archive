import type { NextApiRequest, NextApiResponse } from 'next';
import client from '@/libs/client-prisma';
  
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        const thisQuery = req.query;
        const id: number = thisQuery.fontId === undefined || thisQuery.fontId === "" ? 9999 : Number(thisQuery.fontId);

        const fonts = await client.fonts.findUnique({
            where: { code: id },
        });

        return res.json({ fonts });
    }
}