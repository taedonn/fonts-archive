import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/libs/client-prisma';
import { FetchComments } from './fetchcomments';
  
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        // 새 댓글 쓰기
        if (req.body.action === 'new-comment') {
            // 이전 댓글 가져오기
            const allComments = await prisma.fontsComment.findMany({
                where: { font_id: Number(req.body.font_id) },
                orderBy: [
                    { bundle_id: 'asc' },
                    { comment_id: 'asc' }
                ]
            });

            allComments.length !== 0 
                // 댓글이 있는 경우
                ? await prisma.fontsComment.create({
                    data: {
                        font_id: Number(req.body.font_id),
                        user_id: Number(req.body.user_id),
                        comment: req.body.comment,
                        depth: 0,
                        bundle_id: allComments[allComments.length-1].bundle_id + 1,
                        bundle_order: 0,
                        nickname_reported: 0,
                        is_deleted: false
                    }
                })
                // 댓글이 없는 경우
                : await prisma.fontsComment.create({
                    data: {
                        font_id: Number(req.body.font_id),
                        user_id: Number(req.body.user_id),
                        comment: req.body.comment,
                        depth: 0,
                        bundle_id: 0,
                        bundle_order: 0,
                        nickname_reported: 0,
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
        else if (req.body.action === 'delete-comment') {
            // 답글이 있는지 검색
            const thisComment = await prisma.fontsComment.findUnique({
                where: { comment_id: Number(req.body.comment_id) }
            });

            const thisBundle = await prisma.fontsComment.findMany({
                where: {
                    is_deleted: false,
                    depth: 1,
                    bundle_id: thisComment?.bundle_id
                }
            });

            // 댓글 삭제하기
            thisBundle.length === 0
            ? await prisma.fontsComment.update({
                where: { comment_id: Number(req.body.comment_id) },
                data: {
                    is_deleted: true,
                    deleted_at: new Date(),
                }
            })
            : thisComment && thisComment.depth === 1
                ? await prisma.fontsComment.update({
                    where: { comment_id: Number(req.body.comment_id) },
                    data: {
                        is_deleted: true,
                        deleted_at: new Date(),
                    }
                })
                : await prisma.fontsComment.update({
                    where: { comment_id: Number(req.body.comment_id) },
                    data: {
                        is_deleted_with_reply: true,
                        deleted_at: new Date(),
                    }
                });

            // 업데이트된 댓글 가져오기
            const comments = await FetchComments(req.body.font_id);

            return res.status(200).json({
                message: 'Message deleted successfully.',
                comments: comments
            });
        }
        else if (req.body.action === 'edit-comment') {
            // 댓글 수정하기
            await prisma.fontsComment.update({
                where: { comment_id: Number(req.body.comment_id) },
                data: {
                    comment: req.body.comment,
                    updated_at: new Date(),
                }
            });

            // 업데이트된 댓글 가져오기
            const comments = await FetchComments(req.body.font_id);

            return res.status(200).json({
                message: 'Message edited successfully.',
                comments: comments
            });
        }
        else if (req.body.action === 'reply-comment') {
            // 답글을 단 댓글 정보 가져오기
            const thisComment = await prisma.fontsComment.findUnique({
                where: { comment_id: Number(req.body.comment_id) }
            });

            if (thisComment) {
                // 답글을 단 댓글의 bundle_id 가져오기
                const thisBundle = await prisma.fontsComment.findMany({
                    where: { bundle_id: thisComment.bundle_id }
                });

                // 답글 저장하기
                await prisma.fontsComment.create({
                    data: {
                        font_id: Number(req.body.font_id),
                        user_id: Number(req.body.user_id),
                        comment: req.body.comment,
                        depth: 1,
                        bundle_id: Number(thisComment.bundle_id),
                        bundle_order: thisBundle.length,
                        nickname_reported: 0,
                        is_deleted: false
                    }
                });

                // 댓글 가져오기
                const comments = await FetchComments(req.body.font_id);

                return res.status(200).json({
                    message: 'New reply added successfully.',
                    comments: comments
                });
            }
        }
        else if (req.body.action === 'report-comment') {
            // await prisma.fontsUserReport.create({
            //     data: {
            //         report_user_id: 
            //     }
            // });
        }
    }
}