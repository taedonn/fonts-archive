import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/libs/client-prisma';
  
export async function UpdateEmailConfirm(session: string) {
    const exists: any = await prisma.fontsUser.updateMany({
        where: { user_session_id: session },
        data: { user_email_confirm: true }
    });

    return exists;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "POST") {
        try {
            await prisma.fontsUser.updateMany({
                where: { user_session_id: req.body.session_id as string },
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