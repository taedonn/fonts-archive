import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/libs/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        if (req.query.action === "fetch-alerts") {
            try {
                const { id, admin, user_email, user_auth } = req.query;
                const limit = 10;

                // refetching 시 새로 추가될 데이터에서 기준이 될 마지막 폰트
                const cursor = id ?? "";
                const cursorObj: any = cursor === "" ? undefined : { alert_id: parseInt(cursor as string, 10) };

                const alerts = admin === "true"
                ? await prisma.fontsAlert.findMany({ // 관리자일 때
                    orderBy: [{ alert_id: "desc" }],
                    take: limit,
                    skip: cursor !== "" ? 1 : 0,
                    cursor: cursorObj
                })
                : await prisma.fontsAlert.findMany({ // 일반 유저일 때
                    where: {
                        recipent_email: user_email as string,
                        recipent_auth: user_auth as string,
                    },
                    orderBy: [{ alert_id: "desc" }],
                    take: limit,
                    skip: cursor !== "" ? 1 : 0,
                    cursor: cursorObj
                });

                return res.status(200).json({
                    msg: "알럿 불러오기 성공",
                    alerts,
                    nextId: alerts.length === limit ? alerts[limit - 1].alert_id : undefined,
                });
            } catch (err) {
                return res.status(500).json({
                    msg: "알럿 불러오기 실패",
                    err: err,
                });
            }
        }
    } else if (req.method === "POST") {
        if (req.body.action === "read-all-alerts") {
            try {
                const { recipent_email, recipent_auth } = req.body;

                await prisma.fontsAlert.updateMany({
                    where: {
                        recipent_email: recipent_email,
                        recipent_auth: recipent_auth,
                        alert_read: false,
                    },
                    data: { alert_read: true }
                });

                return res.status(200).json({
                    msg: "모두 읽음 표시 성공",
                });
            } catch (err) {
                return res.status(500).json({
                    msg: "모두 읽음 표시 실패",
                    err: err,
                });
            }
        } else if (req.body.action === "read-alerts") {
            try {
                const { alert_id } = req.body;

                await prisma.fontsAlert.update({
                    where: { alert_id: alert_id },
                    data: { alert_read: true }
                });

                return res.status(200).json({
                    msg: "읽음으로 표시 성공",
                });
            } catch (err) {
                return res.status(500).json({
                    msg: "읽음으로 표시 실패",
                    err: err,
                });
            }
        }
    }
}