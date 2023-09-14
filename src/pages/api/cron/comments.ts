import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/libs/client-prisma';
  
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        // 삭제된 댓글 가져오기
        const deletedComments = await prisma.fontsComment.findMany({
            where: { is_deleted: true }
        });

        // 삭제된 댓글 중 3일이 지난 댓글 ID 가져오기
        let arr = [];
        for (let i = 0; i < deletedComments.length; i++) {
            let deletedDate = new Date(deletedComments[i].deleted_at);
            let nowDate = new Date();

            if (deletedDate.getDate() + 3 < nowDate.getDate()) {
                arr.push({ comment_id: deletedComments[i].comment_id });
            }
        }

        // 삭제할 댓글이 한개 이상일 때 댓글에 대한 신고 데이터 삭제
        arr.length > 0 ? await prisma.fontsUserReport.deleteMany({
            where: { OR: arr }
        }) : null;

        // 삭제할 댓글이 한개 이상일 때 댓글 삭제
        arr.length > 0 ? await prisma.fontsComment.deleteMany({
            where: { OR: arr }
        }) : null;

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