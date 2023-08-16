import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/libs/client-prisma';
  
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        // 아이디 가져오기
        const userId = req.query.id === undefined ? '' : req.query.id as string;

        const user: any = await prisma.fontsUser.findUnique({
            where: { user_id: userId }
        });

        return res.status(200).send(user);
    } else if (req.method === 'POST') {
        // 아이디/비밀번호 가져오기
        const userId = req.query.id === undefined ? '' : req.query.id as string;
        const newUserPw = req.query.pw === undefined ? '' : req.query.pw as string;

        await prisma.fontsUser.update({
            where: { user_id: userId },
            data: { user_pw: newUserPw },
        });

        return res.status(200).send(true);
    }
}