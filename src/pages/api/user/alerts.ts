import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/libs/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        if (req.query.action === "fetch-alerts") {
            try {
                const { user_no } = req.query;

                const alerts = await prisma.fontsAlert.findMany({
                    where: { user_no: Number(user_no) }
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