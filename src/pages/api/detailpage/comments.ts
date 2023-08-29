import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/libs/client-prisma';
import { FetchComments } from './fetchcomments';
  
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        // 새 댓글 쓰기
        if (req.body.action === 'new-comment') {
            // 댓글 저장하기
            await prisma.fontsComment.create({
                data: {
                    font_id: Number(req.body.font_id),
                    user_id: Number(req.body.user_id),
                    comment: req.body.comment,
                    depth: 0,
                    bundle_id: Number(req.body.bundle_id),
                    bundle_order: 0,
                    is_deleted: false
                }
            });

            // 댓글 가져오기
            const comments = await FetchComments(req.body.font_id);

            return res.status(200).json({
                message: 'New comment added successfully.',
                comments: comments
            });
        }
    }
}