import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/libs/client-prisma';
  
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        const thisQuery = req.query;
        const id: number = thisQuery.fontId === undefined || thisQuery.fontId === "" ? 9999 : Number(thisQuery.fontId);

        const fonts = await prisma.fonts.findUnique({
            where: { code: id },
        });

        return res.json({ fonts });
    }
}