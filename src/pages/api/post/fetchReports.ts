import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/libs/client-prisma';
  
export async function FetchReports(code: number, user: any) {
    // 해당 폰트 상세페이지에 쓰인 댓글 전부 가져오기
    const comments: any = await prisma.fontsComment.findMany({
        where: {
            font_id: code,
            is_deleted: false
        }
    });

    // 유저가 신고한 리포트 전부 가져오기
    const userReports: any = await prisma.fontsUserReport.findMany({
        where: {
            report_user_email: user.email,
            report_user_auth: user.provider,
        }
    });

    // 댓글과 리포트 비교 후 신고한 리포트 가져오기
    let reportArr: any[] = [];
    userReports.forEach((userReport: any) => {
        comments.forEach((comment: any) => {
            if (userReport.comment_id === comment.comment_id) {
                reportArr.push(comment.comment_id)
            }
        });
    });

    return reportArr;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "GET") {
        if (req.query.action === "fetch-reports") {
            try {
                

                return res.status(200).json({
                    msg: "신고 불러오기 성공"
                });
            } catch (err) {
                return res.status(500).json({
                    err: err,
                    msg: "신고 불러오기 실패"
                });
            }
        }
    }
}