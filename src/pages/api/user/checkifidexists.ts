import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/libs/client-prisma';

type fontsUser = {
    user_id: string
}
  
interface data {
    fontsUser: fontsUser[],
}
  
export default async function handler(req: NextApiRequest, res: NextApiResponse<data>) {
    if (req.method === 'GET') {
        const userId = req.query.id === undefined ? '' : req.query.id as string;

        const exists: any = !!await prisma.fontsUser.findUnique({
            select: { user_id: true },
            where: { user_id: userId }
        });

        return res.status(200).send(exists);
    }
}