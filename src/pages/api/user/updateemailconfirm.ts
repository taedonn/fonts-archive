import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/libs/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "POST") {
        try {
            await prisma.fontsUser.updateMany({
                where: {
                    user_email_token: req.body.email_token,
                    auth: "credentials",
                },
                data: { user_email_confirm: true }
            });

            return res.status(200).json({
                msg: "이메일 확인 성공",
            });
        } catch (err) {
            return res.status(500).json({
                msg: "이메일 확인 실패",
                err: err
            });
        }
    }
}