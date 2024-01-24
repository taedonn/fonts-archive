import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/libs/prisma';
import { FetchComments } from './fetchcomments';
  
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        // 새 댓글 쓰기
        if (req.body.action === 'new-comment') {
            try {
                const {
                    font_id,
                    font_name,
                    font_family,
                    user_id,
                    user_name,
                    user_email,
                    user_auth,
                    user_image,
                    user_privacy,
                    comment,
                } = req.body;
    
                // 이전 댓글 가져오기
                const allComments = await prisma.fontsComment.findMany({
                    where: { font_id: Number(font_id) },
                    orderBy: [
                        { bundle_id: 'asc' },
                        { comment_id: 'asc' }
                    ]
                });
    
                allComments.length !== 0 
                    // 댓글이 있는 경우
                    ? await prisma.fontsComment.create({
                        data: {
                            font_id: Number(font_id),
                            font_name: font_name,
                            font_family: font_family,
                            user_id: Number(user_id),
                            user_name: user_name,
                            user_email: user_email,
                            user_auth: user_auth,
                            user_image: user_image,
                            user_privacy: user_privacy,
                            comment: comment,
                            depth: 0,
                            bundle_id: allComments[allComments.length-1].bundle_id + 1,
                            bundle_order: 0,
                            is_deleted: false
                        }
                    })
                    // 댓글이 없는 경우
                    : await prisma.fontsComment.create({
                        data: {
                            font_id: Number(font_id),
                            font_name: font_name,
                            font_family: font_family,
                            user_id: Number(user_id),
                            user_name: user_name,
                            user_email: user_email,
                            user_auth: user_auth,
                            user_image: user_image,
                            user_privacy: user_privacy,
                            comment: comment,
                            depth: 0,
                            bundle_id: 0,
                            bundle_order: 0,
                            is_deleted: false
                        }
                    });
    
                // 댓글 가져오기
                const comments = await FetchComments(font_id);
    
                return res.status(200).json({
                    msg: '댓글 생성 성공',
                    comments: comments
                });
            } catch (err) {
                return res.status(500).json({
                    err: err,
                    msg: "댓글 생성 실패"
                })
            }
        }
        else if (req.body.action === 'delete-comment') {
            try {
                const { font_id, comment_id, bundle_id } = req.body;

                // 번들 ID 조회
                const bundle = await prisma.fontsComment.findMany({
                    where: {
                        is_deleted: false,
                        font_id: font_id,
                        bundle_id: bundle_id
                    }
                });

                // 번들 ID에서 댓글 ID 추출
                const comment = bundle.find((bundle: any) => bundle.comment_id === comment_id);

                comment
                ? comment.depth === 1
                    ? await prisma.fontsComment.update({
                        where: { comment_id: Number(comment_id) },
                        data: {
                            is_deleted: true,
                            deleted_at: new Date(),
                            reports: { deleteMany: {} },
                            alerts: { deleteMany: {} }
                        },
                        include: {
                            reports: true,
                            alerts: true,
                        }
                    })
                    : bundle.length === 1
                        ? await prisma.fontsComment.update({
                            where: { comment_id: Number(comment_id) },
                            data: {
                                is_deleted: true,
                                deleted_at: new Date(),
                                reports: { deleteMany: {} },
                                alerts: { deleteMany: {} }
                            },
                            include: {
                                reports: true,
                                alerts: true,
                            }
                        })
                        : await prisma.fontsComment.update({
                            where: { comment_id: Number(comment_id) },
                            data: {
                                is_deleted_with_reply: true,
                                deleted_at: new Date(),
                                reports: { deleteMany: {} },
                                alerts: { deleteMany: {} }
                            },
                            include: {
                                reports: true,
                                alerts: true,
                            }
                        })
                : null;
                    
                return res.status(200).json({
                    msg: comment === null ? "댓글을 찾을 수 없습니다." : '댓글 삭제 성공',
                });
            } catch (err) {
                return res.status(500).json({
                    msg: "댓글 삭제 실패",
                    err: err,
                });
            }
        }
        else if (req.body.action === 'delete-comment-by-admin') {
            try {
                const { font_id, comment_id, bundle_id } = req.body;

                // 번들 ID 조회
                const bundle = await prisma.fontsComment.findMany({
                    where: {
                        is_deleted: false,
                        font_id: font_id,
                        bundle_id: bundle_id
                    }
                });

                // 번들 ID에서 댓글 ID 추출
                const comment = bundle.find((bundle: any) => bundle.comment_id === comment_id);

                comment
                ? comment.depth === 1
                    ? await prisma.fontsComment.update({
                        where: { comment_id: Number(comment_id) },
                        data: {
                            is_deleted: true,
                            deleted_at: new Date(),
                            reports: { deleteMany: {} },
                            alerts: { deleteMany: {} }
                        },
                        include: {
                            reports: true,
                            alerts: true,
                        }
                    })
                    : bundle.length === 1
                        ? await prisma.fontsComment.update({
                            where: { comment_id: Number(comment_id) },
                            data: {
                                is_deleted: true,
                                deleted_at: new Date(),
                                reports: { deleteMany: {} },
                                alerts: { deleteMany: {} }
                            },
                            include: {
                                reports: true,
                                alerts: true,
                            }
                        })
                        : await prisma.fontsComment.update({
                            where: { comment_id: Number(comment_id) },
                            data: {
                                is_deleted_by_reports: true,
                                deleted_at: new Date(),
                                reports: { deleteMany: {} },
                                alerts: { deleteMany: {} }
                            },
                            include: {
                                reports: true,
                                alerts: true,
                            }
                        })
                : null;
                    
                return res.status(200).json({
                    msg: comment === null ? "댓글을 찾을 수 없습니다." : '댓글 삭제 성공',
                });
            } catch (err) {
                return res.status(500).json({
                    msg: "댓글 삭제 실패",
                    err: err,
                });
            }
        }
        else if (req.body.action === 'edit-comment') {
            try {
                const { font_id, comment_id, comment } = req.body;

                // 댓글 수정하기
                await prisma.fontsComment.update({
                    where: { comment_id: Number(comment_id) },
                    data: {
                        comment: comment,
                        updated_at: new Date(),
                        alerts: {
                            updateMany: {
                                where: { comment_id: Number(comment_id) },
                                data: { sender_content: comment }
                            }
                        }
                    },
                    include: { alerts: true }
                });

                // 업데이트된 댓글 가져오기
                const comments = await FetchComments(font_id);

                return res.status(200).json({
                    msg: '댓글 수정 성공',
                    comments: comments,
                });
            } catch (err) {
                return res.status(500).json({
                    msg: "댓글 수정 실패",
                    err: err,
                })
            }
        }
        else if (req.body.action === 'reply-comment') {
            try {
                const {
                    font_id,
                    font_name,
                    font_family,
                    user_id,
                    user_name,
                    user_email,
                    user_auth,
                    user_image,
                    user_privacy,
                    recipent_email,
                    recipent_auth,
                    comment_id,
                    comment,
                    bundle_id,
                } = req.body;

                // 댓글과 답글이 다른 계정이면 알림 생성
                const generateAlert = recipent_email === user_email
                    ? recipent_auth === user_auth
                        ? false
                        : true
                    : true;

                // 번들 ID 조회
                const bundle = await prisma.fontsComment.findMany({
                    where: {
                        is_deleted: false,
                        font_id: font_id,
                        bundle_id: bundle_id
                    }
                });

                bundle 
                && await prisma.fontsComment.create({
                    data: {
                        font_id: Number(font_id),
                        font_name: font_name,
                        font_family: font_family,
                        user_id: Number(user_id),
                        user_name: user_name,
                        user_email: user_email,
                        user_auth: user_auth,
                        user_image: user_image,
                        user_privacy: user_privacy,
                        comment: comment,
                        depth: 1,
                        bundle_id: Number(bundle_id),
                        bundle_order: bundle.length,
                        is_deleted: false,
                        alerts: {
                            create: generateAlert
                                ? [{
                                    alert_type: "reply",
                                    alert_page: font_name,
                                    alert_link: `/post/${font_family.replaceAll(" ", "+")}#c${comment_id}`,
                                    sender_name: user_name,
                                    sender_img: user_image,
                                    sender_content: comment,
                                    recipent_email: recipent_email,
                                    recipent_auth: recipent_auth,
                                    user_no: user_id,
                                }] : []
                        }
                    },
                    include: { alerts: true }
                });

                // 댓글 가져오기
                const comments = await FetchComments(font_id);

                return res.status(200).json({
                    msg: '답글 생성 성공',
                    comments: comments
                });
            } catch (err) {
                return res.status(500).json({
                    msg: "답글 생성 실패",
                    err: err,
                })
            }
        }
        else if (req.body.action === 'report-comment') {
            try {
                const {
                    font_id,
                    user_id,
                    comment_id,
                    comment_user_no,
                    report_nickname,
                    report_politics,
                    report_swearing,
                    report_etc,
                    report_text,
                } = req.body;

                const reportObj = {};
                report_politics && Object.assign({ report_politics: { increment: 1 } }, reportObj);
                report_swearing && Object.assign({ report_swearing: { increment: 1 } }, reportObj);
                report_etc && Object.assign({ report_etc: { increment: 1 } }, reportObj);

                // 리포트 생성
                await prisma.fontsUser.update({
                    where: { user_no: Number(comment_user_no) },
                    data: {
                        nickname_reported: { increment: report_nickname ? 1 : 0 }, // 부적절한 닉네임인 경우 1 추가
                        reports: { // 리포트 생성
                            create: {
                                comment_id: Number(comment_id),
                                report_font_code: Number(font_id),
                                reported_user_id: Number(user_id),
                                report_nickname: report_nickname,
                                report_politics: report_politics,
                                report_swearing: report_swearing,
                                report_etc: report_etc,
                                report_text: report_text
                            }
                        },
                        comments: {
                            update: {  
                                where: { comment_id: Number(comment_id) },
                                data: reportObj
                            }
                        }
                    },
                    include: {
                        comments: true,
                        reports: true,
                    }
                });

                const comments = await FetchComments(Number(font_id));

                return res.status(200).json({
                    msg: "댓글 신고 성공",
                    comments: comments,
                });
            } catch (err) {
                return res.status(500).json({
                    msg: "댓글 신고 실패",
                    err: err,
                })
            }
        }
    }
}