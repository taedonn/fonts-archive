import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/libs/client-prisma';

const limit = 10;

// SSR 공지 목록 페이지 수
export async function FetchNoticesLength() {
    const notices = await prisma.fontsNotice.findMany({
        select: { notice_id: true },
    });
    const count = Number(notices.length) % limit > 0 ? Math.floor(Number(notices.length)/limit) + 1 : Math.floor(Number(notices.length)/limit);

    return count;
}

// SSR 첫 공지 목록 불러오기
export async function FetchNotices(lastId: number | undefined) {
    const list = await prisma.fontsNotice.findMany({
        orderBy: [{notice_id: 'desc'}], // 정렬순
        take: limit, // 가져오는 데이터 수
        skip: lastId ? 1 : 0,
        ...(lastId && { cursor: {notice_id: lastId} })
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
    } else if (req.method === "GET") {
        if (req.query.action === "list") {
            try {
                const { page, text, filter } = req.query;
                
                const texts = [
                    {notice_title: {contains: text as string}},
                    {notice_content: {contains: text as string}},
                ];
                const filters = filter as string;

                // 공지 목록 페이지 수
                const length = await prisma.fontsNotice.findMany({
                    select: { notice_id: true },
                    where: {
                        OR: texts,
                        notice_type: filters === "all" ? {} : filters,
                    }
                });
                const count = Number(length.length) % limit > 0 ? Math.floor(Number(length.length)/limit) + 1 : Math.floor(Number(length.length)/limit);

                // 공지 목록 불러오기
                const list = await prisma.fontsNotice.findMany({
                    where: {
                        OR: texts,
                        notice_type: filters === "all" ? {} : filters,
                    },
                    orderBy: [{notice_id: 'desc'}],
                    take: limit, // 가져오는 데이터 수
                    skip: Number(page) === 1 ? 0 : (Number(page) - 1) * limit
                });

                return res.status(200).json({
                    message: "공지 목록 불러오기 성공",
                    list: list,
                    count: count
                });
            } catch (err) {
                return res.status(500).json({
                    message: "공지 목록 불러오기 실패",
                    err: err
                });
            }
        }
    }
}