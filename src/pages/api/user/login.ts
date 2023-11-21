import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/libs/client-prisma';

interface User {
    user_no: number,
    user_name: string,
    user_id: string,
    user_pw: string,
    user_session_id: string,
    user_email_token: string,
    user_email_confirm: boolean,
    profile_img: string,
    nickname_reported: number,
    created_at: Date,
    updated_at: Date,
}
  
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        try {
            const userId = req.query.id as string;
            const userPw = req.query.pw as string;
            const userSessionId = crypto.randomUUID();

            // 유저 정보 불러오기
            const user: User | null = await prisma.fontsUser.findUnique({
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
            status === "success" && await prisma.fontsUser.update({
                where: { user_id: userId },
                data: {
                    user_session_id: userSessionId
                }
            });

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