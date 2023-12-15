import prisma from '@/libs/client-prisma';
  
export async function FetchUserLike(user: any) {
    const like = await prisma.fontsLiked.findMany({
        where: {
            user_email: user.email,
            user_auth: user.provider,
        }
    });

    return like;
}

export async function FetchUserLikeOnDetail(user: any, fontId: number) {
    const like = await prisma.fontsLiked.findFirst({
        where: {
            font_id: fontId,
            user_email: user.email,
            user_auth: user.provider,
        }
    });

    return like;
}