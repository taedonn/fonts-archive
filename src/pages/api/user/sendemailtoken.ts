import type { NextApiRequest, NextApiResponse } from 'next';
import client from '@/libs/client-prisma';

type fontsUser = {
    user_id: string
    user_email_token: string
}
  
interface data {
    fontsUser: fontsUser[],
}
  
export default async function handler(req: NextApiRequest, res: NextApiResponse<data>) {
    if (req.method === 'GET') {
        const userId = req.query.id === undefined ? '' : req.query.id as string;

        const sendToken: any = await client.fontsUser.findUnique({
            select: {
                user_id: true,
                user_email_token: true
            },
            where: { user_id: userId }
        });

        return res.send(sendToken.user_email_token);
    }
}