import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/libs/prisma';

export async function FetchComments(code: number) {
    // 댓글 가져오기
    const comments = await prisma.fontsComment.findMany({
        where: {
            font_id: Number(code),
            is_deleted: false
        },
        orderBy: [
            { bundle_id: 'desc' },
            { bundle_order: 'asc' },
            { comment_id: 'desc' }
        ]
    });

    return comments;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "GET") {
        if (req.query.action === "fetch-comments") {
            try {
                const { code } = req.query;

                // 댓글 가져오기
                const comments = await prisma.fontsComment.findMany({
                    where: {
                        font_id: Number(code),
                        is_deleted: false
                    },
                    orderBy: [
                        { bundle_id: 'desc' },
                        { bundle_order: 'asc' },
                        { comment_id: 'desc' }
                    ]
                });

                return res.status(200).json({
                    msg: "댓글 불러오기 성공",
                    comments: comments,
                });
            } catch (err) {
                return res.status(500).json({
                    err: err,
                    msg: "댓글 불러오기 실패"
                });
            }
        }
    }
}