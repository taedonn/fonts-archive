import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/libs/prisma';

const limit = 10;

// 페이지 수
export async function FetchNoticesLength(search: string) {
    const notices = await prisma.fontsNotice.findMany({
        select: { notice_id: true },
        where: {
            OR: [
                {notice_title: { contains: search }},
                {notice_content: { contains: search }},
            ]
        },
    });
    const count = Number(notices.length) % limit > 0 ? Math.floor(Number(notices.length)/limit) + 1 : Math.floor(Number(notices.length)/limit);

    return count;
}

// 목록
export async function FetchNotices(page: number, filter: string, search: string) {
    const list = await prisma.fontsNotice.findMany({
        where: {
            notice_type: filter === "all"
                ? { contains: "" }
                : filter,
            OR: [
                {notice_title: { contains: search }},
                {notice_content: { contains: search }},
            ]
        },
        orderBy: [{notice_id: "desc"}],
        skip: (Number(page) - 1) * limit,
        take: limit,
    });

    return list;
}

// 특정 공지 불러오기
export async function FetchNotice(noticeId: number) {
    const notice = await prisma.fontsNotice.findUnique({
        where: { notice_id: Number(noticeId) }
    });

    return notice;
}

// API
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "POST") {
        if (req.body.action === "add") {
            try {
                const { notice_type, notice_title, notice_content } = req.body;

                await prisma.fontsNotice.create({
                    data: {
                        notice_type: notice_type,
                        notice_title: notice_title,
                        notice_content: notice_content,
                    }
                });

                return res.status(200).json({
                    msg: "공지 추가 성공",
                });
            } catch (err) {
                return res.status(500).json({
                    msg: "공지 추가 실패",
                    err: err
                });
            }
        } else if (req.body.action === "edit") {
            try {
                const { id, show_type, created_date, updated_date, title, content } = req.body;

                await prisma.fontsNotice.update({
                    where: { notice_id: Number(id) },
                    data: {
                        notice_show_type: show_type,
                        notice_created_at: created_date,
                        notice_updated_at: updated_date,
                        notice_title: title,
                        notice_content: content,
                    }
                });

                return res.status(200).json({
                    msg: "공지 수정 성공"
                });
            } catch (err) {
                return res.status(500).json({
                    msg: "공지 수정 실패",
                    err: err,
                });
            }
        }
    }
}