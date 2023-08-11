import type { NextApiRequest, NextApiResponse } from 'next';
import client from '@/libs/client-prisma';
  
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { body } = req;
        const { code } = JSON.parse(body);

        await client.fonts.update({
            where: { code },
            data: { view: { increment: 1 } }
        });

        return res.status(200).send(true);
    }
}