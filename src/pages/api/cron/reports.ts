import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/libs/client-prisma';
  
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        // 부적절한 닉네임 신고가 10개 이상일 경우
        const reportedNickname = await prisma.fontsUser.updateMany({
            where: { nickname_reported: { gte: 10 } },
            data: {
                user_name: '부적절한 닉네임 ' + (Math.floor(Math.random() * 100) + 1),
                nickname_reported: 0
            }
        });

        // 선동적인 발언 신고가 10개 이상일 경우 댓글 삭제
        const reportedPolitics = await prisma.fontsComment.updateMany({
            where: { reported_politics: { gte: 10 } },
            data: { is_deleted_by_reports: true }
        });

        // 욕설 신고가 10개 이상일 경우 댓글 삭제
        const reportedSwearing = await prisma.fontsComment.updateMany({
            where: { reported_swearing: { gte: 10 } },
            data: { is_deleted_by_reports: true }
        });

        // 기타 신고가 10개 이상일 경우 댓글 삭제
        const reportedEtc = await prisma.fontsComment.updateMany({
            where: { reported_etc: { gte: 10 } },
            data: { is_deleted_by_reports: true }
        });

        return res.status(200).json({
            message: "Comments with over 10 reports have been modified.",
            nickname: reportedNickname,
            politics: reportedPolitics,
            swearing: reportedSwearing,
            etc: reportedEtc
        });
    } catch (err) {
        return res.status(400).json({
            message: "comments with over 10 reports modification failed due to an error.",
            error: err
        });
    }
}