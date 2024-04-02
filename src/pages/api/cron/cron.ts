import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/libs/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        /**
         * 댓글 삭제
         */
        // 삭제된 댓글 가져오기
        const deletedComments = await prisma.fontsComment.findMany({
            where: { is_deleted: true }
        });

        // 삭제된 댓글 중 7일이 지난 댓글 ID 가져오기
        let arr = [];
        let date = new Date();
        for (let i = 0; i < deletedComments.length; i++) {
            let deletedDate = new Date(deletedComments[i].deleted_at);
            deletedDate.setDate(deletedDate.getDate() + 7);

            if (deletedDate < date) {
                arr.push({ comment_id: deletedComments[i].comment_id });
            }
        }

        // 삭제할 댓글이 한개 이상일 때 댓글 신고 삭제
        arr.length > 0 && await prisma.fontsUserReport.deleteMany({
            where: { OR: arr }
        });

        // 삭제할 댓글이 한개 이상일 때 댓글 알림 삭제
        arr.length > 0 && await prisma.fontsAlert.deleteMany({
            where: { OR: arr }
        });

        // 삭제할 댓글이 한개 이상일 때 댓글 삭제
        arr.length > 0 && await prisma.fontsComment.deleteMany({
            where: { OR: arr },
        });

        /**
         * 신고
         */
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
            msg: "Cron job succeeded.",
            deletedComments: arr,
            reportedNickname: reportedNickname,
            reportedPolitics: reportedPolitics,
            reportedSwearing: reportedSwearing,
            reportedEtc: reportedEtc
        });
    } catch (err) {
        return res.status(400).json({
            msg: "Cron job failed",
            err: err
        });
    }
}