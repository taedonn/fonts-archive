import prisma from '@/libs/prisma';
  
export async function FetchUserLike(user: any) {
    const like = await prisma.fontsLiked.findMany({
        where: {
            user_email: user.email,
            user_auth: user.provider,
        }
    });

    return like;
}