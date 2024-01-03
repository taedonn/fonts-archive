import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/libs/prisma';
  
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { body } = req;
        const { code } = JSON.parse(body);

        await prisma.fonts.update({
            where: { code },
            data: { view: { increment: 1 } }
        });

        return res.status(200).send(true);
    }
}