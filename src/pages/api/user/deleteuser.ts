import type { NextApiRequest, NextApiResponse } from 'next';
import client from '@/libs/client';
  
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        // 쿼리에서 뽑은 아이디
        const id = req.query.id === undefined ? '' : req.query.id as string;

        await client.fontsUser.delete({
            where: { user_id: id }
        });

        return res.status(200).send(true);
    }
}