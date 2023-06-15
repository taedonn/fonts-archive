import type { NextApiRequest, NextApiResponse } from 'next';
import client from '@/libs/client';

type fontsUser = {
    user_id: string
    user_email_token: string
}
  
interface data {
    fontsUser: fontsUser[],
}
  
export default async function handler(req: NextApiRequest, res: NextApiResponse<data>) {
    if (req.method === 'GET') {
        const userToken = req.query.token === undefined ? '' : req.query.token as string;

        const sendToken: any = await client.fontsUser.findFirst({
            select: {
                user_id: true,
                user_email_token: true
            },
            where: {
                user_email_token: userToken
            }
        });

        return res.send(sendToken.user_id);
    }
}