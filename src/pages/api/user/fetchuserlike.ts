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

export async function FetchUserLikeOnDetail(user: any, font: any) {
    const like = await prisma.fontsLiked.findFirst({
        where: {
            font_id: font.code,
            user_email: user.email,
            user_auth: user.provider,
        }
    });

    return like;
}