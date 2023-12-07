import prisma from '@/libs/client-prisma';
  
export async function FetchUserLike(user_email: string) {
    const like = await prisma.fontsLiked.findMany({
        where: { user_email: user_email }
    });

    return like;
}