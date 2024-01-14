import prisma from '@/libs/prisma';

// 페이지 수
export async function FetchCommentsLength(user: any, search: string) {
    const comments = await prisma.fontsComment.findMany({
        select: { user_id: true },
        where: {
            user_email: user.email,
            user_auth: user.provier,
            is_deleted: false,
            is_deleted_with_reply: false,
            is_deleted_by_reports: false,
            OR: [
                {font_name: { contains: search }},
                {comment: { contains: search }}
            ]
        },
        take: 50,
    });

    return comments.length;
}

// 목록
export async function FetchComments(user: any, page: number, filter: string, search: string) {    
    const comments = await prisma.fontsComment.findMany({
        where: {
            user_email: user.email,
            user_auth: user.provider,
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
            : [{font_name: "desc"}, {comment_id: "desc"}],
        skip: (Number(page) - 1) * 10,
        take: 10,
    });

    return comments;
}