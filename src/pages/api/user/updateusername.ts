import type { NextApiRequest, NextApiResponse } from 'next';
import client from '@/libs/client-prisma';
  
interface data {
    nameChange: any,
}
  
export default async function handler(req: NextApiRequest, res: NextApiResponse<data>) {
    if (req.method === 'POST') {
        // 쿼리에서 뽑은 이름
        const id = req.query.id === undefined ? '' : req.query.id as string;
        const name = req.query.name === undefined ? '' : req.query.name as string;

        const user: any = await client.fontsUser.findUnique({
            where: { user_id: id }
        });

        // 이름 업데이트
        const nameChange: any = user.user_name === name ? 'exists' : await client.fontsUser.update({
            where: { user_id: id },
            data: { user_name: name }
        });

        return res.status(200).send(nameChange);
    }
}