import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/libs/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        if (req.query.action === "fetch-alerts") {
            try {
                const { admin, user_email, user_auth } = req.query;
                const limit = 10;

                const alerts = admin
                ? await prisma.fontsAlert.findMany({ // 관리자일 때
                    orderBy: [{ alert_id: "desc" }],
                    take: limit,
                })
                : await prisma.fontsAlert.findMany({ // 일반 유저일 때
                    where: {
                        recipent_email: user_email as string,
                        recipent_auth: user_auth as string,
                    },
                    orderBy: [{ alert_id: "desc" }],
                    take: limit,
                });

                return res.status(200).json({
                    msg: "알럿 불러오기 성공",
                    alerts: alerts,
                })
            } catch (err) {
                return res.status(500).json({
                    msg: "알럿 불러오기 실패",
                    err: err,
                })
            }
        }
    }
}