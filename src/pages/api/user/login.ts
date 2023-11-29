import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/libs/client-prisma';
  
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        try {
            const userId = req.query.id as string;
            const userPw = req.query.pw as string;
            const stayLoggedIn = req.query.stay_logged_in;
            const userSessionId = crypto.randomUUID();
            const date = new Date();

            // 유저 정보 불러오기
            const user = await prisma.fontsUser.findUnique({
                where: { user_id: userId }
            });

            // 로그인 상태
            const status = user === null
            ? "wrong-id"
            : user.user_pw !== userPw
                ? "wrong-pw"
                : !user.user_email_confirm
                    ? "not-confirmed"
                    : "success";

            // 세션ID 업데이트
            status === "success" && (
                await prisma.fontsUser.update({
                    where: { user_id: userId },
                    data: { user_session_id: userSessionId }
                }), 
                res.setHeader(
                    'Set-Cookie',
                    `session=${userSessionId}; Path=/; Expires=${stayLoggedIn ? date.setFullYear(date.getFullYear() + 1) : date.setHours(date.getHours() + 1)}; HttpOnly`,
                )
            );

            return res.status(200).json({
                msg: "로그인 성공",
                status: status,
                session: user === null
                            ? null
                            : status === "success"
                                ? userSessionId
                                : user.user_session_id,
            });
        } catch (err) {
            return res.status(500).json({
                msg: "로그인 실패",
                err: err,
            });
        }
    }
}