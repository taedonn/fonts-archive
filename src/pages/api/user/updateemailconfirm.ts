import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/libs/client-prisma';
import { refresh } from '@/libs/jwt-utils';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "POST") {
        try {
            const { email_token, user_id } = req.body;
            const refreshToken = refresh(user_id);

            await prisma.fontsUser.updateMany({
                where: { user_email_token: email_token },
                data: {
                    user_email_confirm: true,
                    refresh_token: refreshToken,
                }
            });

            return res.status(200).json({
                msg: "이메일 확인 성공",
                refreshToken: refreshToken,
            });
        } catch (err) {
            return res.status(500).json({
                msg: "이메일 확인 실패",
                err: err
            });
        }
    }
}