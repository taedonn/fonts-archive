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

        const emailConfirm: any = id && pw ? await client.fontsUser.findFirst({
            select: {
                user_id: true,
                user_email_confirm: true,
            },
            where: {
                user_id: userId,
            }
        }) : null

        const login: string = !id && !pw ? 'wrong-id' : (
            !id && pw ? 'wrong-id' : (
                id && !pw ? 'wrong-pw' : (
                    emailConfirm.user_email_confirm === false
                    ? 'not-confirmed'
                    : 'success'
                )
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

        return res.status(200).send({ status: login, session: user === null ? null : user.user_session_id}, );
    }
}