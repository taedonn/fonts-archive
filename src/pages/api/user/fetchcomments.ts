import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/libs/prisma';

// SSR 댓글 페이지 수
export async function FetchCommentsLength(user: any) {
    const comments = await prisma.fontsComment.findMany({
        select: { user_id: true },
        where: {
            user_email: user.email,
            user_auth: user.provier,
            is_deleted: false,
            is_deleted_with_reply: false,
            is_deleted_by_reports: false
        },
        take: 50,
    });

    return comments.length;
}

// SSR 첫 댓글 목록 가져오기
export async function FetchComments(user: any, lastId: number | undefined) {
    const comments = await prisma.fontsComment.findMany({
        where: {
            user_email: user.email,
            user_auth: user.provider,
            is_deleted: false,
            is_deleted_with_reply: false,
            is_deleted_by_reports: false
        },
        orderBy: [{created_at: 'desc'}, {comment_id: 'desc'}], // 정렬순
        take: 10, // 가져오는 데이터 수
        skip: lastId ? 1 : 0,
        ...(lastId && { cursor: {comment_id: lastId} })
    });

    return comments;
}
  
// API
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        try {
            const { email, provider, page, filter, text } = req.query;

            // 폰트 이름 배열에 저장
            let textArr: any[] = [];
            if (filter === 'font') {
                textArr = [{font_name: { contains: text }}];
            } else if (filter === 'comment') {
                textArr = [{comment: { contains: text }}];
            } else {
                textArr = [
                    {font_name: { contains: text }},
                    {comment: { contains: text }},
                ];
            }

            // 댓글 페이지 수 가져오기
            const length = await prisma.fontsComment.findMany({
                where: {
                    user_email: email as string,
                    user_auth: provider as string,
                    is_deleted: false,
                    is_deleted_with_reply: false,
                    is_deleted_by_reports: false,
                    OR: textArr
                }
            });
            const count = Number(length.length) % 10 > 0 ? Math.floor(Number(length.length)/10) + 1 : Math.floor(Number(length.length)/10);

            // 댓글 가져오기
            const comments = await prisma.fontsComment.findMany({
                where: {
                    user_email: email as string,
                    user_auth: provider as string,
                    is_deleted: false,
                    is_deleted_with_reply: false,
                    is_deleted_by_reports: false,
                    OR: textArr
                },
                orderBy: [{created_at: 'desc'}, {comment_id: 'desc'}], // 정렬순
                take: 10, // 가져오는 데이터 수
                skip: Number(page) === 1 ? 0 : (Number(page) - 1) * 10
            });

            return res.status(200).json({
                message: "댓글 가져오기 성공",
                comments: comments,
                count: count,
            });
        } catch (err) {
            return res.status(500).json({
                message: "댓글 가져오기 실패",
                error: err,
            })
        }
    }
}