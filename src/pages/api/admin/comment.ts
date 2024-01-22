import prisma from '@/libs/prisma';

const limit = 10;

// 페이지 수
export async function FetchCommentsLength(search: string) {
    const comments = await prisma.fontsComment.findMany({
        select: { comment_id: true },
        where: {
            is_deleted: false,
            is_deleted_with_reply: false,
            is_deleted_by_reports: false,
            OR: [
                {font_name: { contains: search }},
                {comment: { contains: search }}
            ]
        },
    });
    const count = Number(comments.length) % limit > 0 ? Math.floor(Number(comments.length)/limit) + 1 : Math.floor(Number(comments.length)/limit);

    return count;
}

// 목록
export async function FetchComments(page: number, filter: string, search: string) {
    const comments = await prisma.fontsComment.findMany({
        where: {
            is_deleted: false,
            is_deleted_with_reply: false,
            is_deleted_by_reports: false,
            OR: [
                {font_name: { contains: search }},
                {comment: { contains: search }}
            ]
        },
        orderBy: filter === "date"
            ? [{comment_id: "desc"}]
            : [{font_name: "asc"}, {comment_id: "desc"}],
        skip: (Number(page) - 1) * limit,
        take: limit,
    });

    return comments;
}