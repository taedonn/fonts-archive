import type { NextApiRequest, NextApiResponse } from 'next';
import client from '@/libs/client';
  
interface data {
    status: string,
    session: string,
}
  
export default async function handler(req: NextApiRequest, res: NextApiResponse<data>) {
    if (req.method === 'GET') {
        const userId = req.query.id === undefined ? '' : req.query.id as string;
        const userPw = req.query.pw === undefined ? '' : req.query.pw as string;


        const id: boolean = !!await client.fontsUser.findFirst({
            select: {
                user_id: true,
            },
            where: {
                user_id: userId
            }
        });

        const pw: boolean = !id ? false : !!await client.fontsUser.findFirst({
            select: {
                user_id: true,
                user_pw: true,
            },
            where: {
                user_id: userId,
                user_pw: userPw,
            }
        });

        const login: string = !id && !pw ? 'wrong-id' : (
            !id && pw ? 'wrong-id' : (
                id && !pw ? 'wrong-pw' : 'success'
            )
        );

        const user: any = id && pw ? await client.fontsUser.findFirst({
            select: {
                user_id: true,
                user_pw: true,
                user_session_id: true,
            },
            where: {
                user_id: userId,
                user_pw: userPw,
            }
        }) : null;

        return res.status(200).send({ status: login, session: user.user_session_id}, );
    }
}