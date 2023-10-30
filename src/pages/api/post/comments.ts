import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/libs/client-prisma';
import { FetchComments } from './fetchcomments';
import { FetchReports } from './fetchReports';
  
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
        else if (req.body.action === 'delete-comment-by-admin') {
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
                        is_deleted_by_reports: true,
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
            // 리포트 생성
            await prisma.fontsUserReport.create({
                data: {
                    report_user_id: Number(req.body.user_id),
                    comment_id: Number(req.body.comment_id),
                    report_nickname: req.body.report_nickname,
                    report_politics: req.body.report_politics,
                    report_swearing: req.body.report_swearing,
                    report_etc: req.body.report_etc,
                    report_text: req.body.report_text
                }
            });

            // 부적절한 닉네임인 경우 유저 정보 불러와서 nickname_reported에 1 추가 (10되면 자동으로 닉네임 변경)
            if (req.body.report_nickname) {
                const comment = await prisma.fontsComment.findUnique({
                    where: { comment_id: Number(req.body.comment_id) }
                });

                // 유저 정보 불러온 후 nickname_reported 업데이트
                comment
                ? await prisma.fontsUser.update({
                    where: { user_no: comment.user_id },
                    data: { nickname_reported: { increment: 1 } }
                })
                : null;
            }

            // 선동적인 발언인 경우 reported_politics에 1 추가
            if (req.body.report_politics) {
                await prisma.fontsComment.update({
                    where: { comment_id: Number(req.body.comment_id) },
                    data: { reported_politics: { increment: 1 } }
                });
            }

            // 욕설일 경우 reported_swearing에 1 추가
            if (req.body.report_swearing) {
                await prisma.fontsComment.update({
                    where: { comment_id: Number(req.body.comment_id) },
                    data: { reported_swearing: { increment: 1 } }
                });
            }

            // 기타인 경우 reported_swearing에 1 추가
            if (req.body.report_swearing) {
                await prisma.fontsComment.update({
                    where: { comment_id: Number(req.body.comment_id) },
                    data: { reported_etc: { increment: 1 } }
                });
            }

            // 댓글 가져오기
            const comments = await FetchComments(req.body.font_id);

            // 리포트 가져오기
            const reports = await FetchReports(req.body.font_id, req.body.user_id);

            return res.status(200).json({
                message: 'New report added successfully.',
                comments: comments,
                reports: reports
            });
        }
        else if (req.body.action === 'reset-reports') {
            // 리포트 전부 삭제하기
            await prisma.fontsUserReport.deleteMany({
                where: { NOT: [{ report_id: 0 }] }
            });

            // 댓글 가져오기
            const comments = await FetchComments(req.body.font_id);

            // 리포트 가져오기
            const reports = await FetchReports(req.body.font_id, req.body.user_id);

            return res.status(200).json({
                message: 'Reports reset completed.',
                comments: comments,
                reports: reports
            });
        }
    }
}