import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/libs/client-prisma';

const limit = 10;

// SSR 댓글 목록 페이지 수
export async function FetchCommentsLength() {
    const comments = await prisma.fontsComment.findMany({
        select: { comment_id: true },
        where: {
            is_deleted: false,
            is_deleted_with_reply: false,
            is_deleted_by_reports: false,
        },
    });
    const count = Number(comments.length) % limit > 0 ? Math.floor(Number(comments.length)/limit) + 1 : Math.floor(Number(comments.length)/limit);

    return count;
}

// SSR 첫 댓글 목록 불러오기
export async function FetchComments(lastId: number | undefined) {
    const comments = await prisma.fontsComment.findMany({
        where: {
            is_deleted: false,
            is_deleted_with_reply: false,
            is_deleted_by_reports: false,
        },
        orderBy: [{comment_id: 'desc'}], // 정렬순
        take: limit, // 가져오는 데이터 수
        skip: lastId ? 1 : 0,
        ...(lastId && { cursor: {comment_id: lastId} })
    });

    return comments;
}

// API
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        if (req.query.action === "list") {
            try {
                const { page, text, filter } = req.query;

                let textArr: any = [];
                if (text !== "") {
                    if (filter === "all") {
                        textArr = [
                            {font_name: { contains: text }},
                            {user_name: { contains: text }},
                            {comment: { contains: text }},
                        ];
                    } else if (filter === "font") {
                        textArr = [{font_name: { contains: text }}];
                    } else if (filter === "user") {
                        textArr = [{user_name: { contains: text }}];
                    } else {
                        textArr = [{comment: { contains: text }}];
                    }
                } else {
                    textArr = [{font_name: { contains: "" }}];
                }

                // 댓글 페이지 수 가져오기
                const length = await prisma.fontsComment.findMany({
                    where: {
                        is_deleted: false,
                        is_deleted_with_reply: false,
                        is_deleted_by_reports: false,
                        OR: textArr,
                    }
                });
                const count = Number(length.length) % limit > 0 ? Math.floor(Number(length.length)/limit) + 1 : Math.floor(Number(length.length)/limit);

                // 댓글 가져오기
                const comments = await prisma.fontsComment.findMany({
                    where: {
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
                    test: textArr,
                });
            } catch (err) {
                res.status(500).json({
                    message: "댓글 가져오기 실패",
                    err: err
                });
            }
        }
    }
}