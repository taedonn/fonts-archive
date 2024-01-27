import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/libs/prisma';
  
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        // 삭제된 댓글 가져오기
        const deletedComments = await prisma.fontsComment.findMany({
            where: { is_deleted: true }
        });

        // 삭제된 댓글 중 7일이 지난 댓글 ID 가져오기
        let arr = [];
        for (let i = 0; i < deletedComments.length; i++) {
            let deletedDate = new Date(deletedComments[i].deleted_at);
            let nowDate = new Date();

            if (deletedDate.getDate() + 7 < nowDate.getDate()) {
                arr.push({ comment_id: deletedComments[i].comment_id });
            }
        }

        // 삭제할 댓글이 한개 이상일 때 댓글 삭제
        arr.length > 0 && await prisma.fontsComment.deleteMany({
            where: { OR: arr }
        });

        // 삭제할 댓글이 한개 이상일 때 댓글 신고 삭제
        arr.length > 0 && await prisma.fontsUserReport.deleteMany({
            where: { OR: arr }
        });

        // 삭제할 댓글이 한개 이상일 때 댓글 알림 삭제
        arr.length > 0 && await prisma.fontsAlert.deleteMany({
            where: { OR: arr }
        });

        return res.status(200).json({
            message: "Comments deleted successfully.",
            deletedComments: arr,
        });
    } catch (err) {
        return res.status(400).json({
            message: "Comments deletion failed.",
            error: err
        });
    }
}