import prisma from '@/libs/client-prisma';
  
export async function FetchEmailFromToken(token: string) {
    const user = await prisma.fontsUser.findFirst({
        select: {
            user_id: true,
            user_email_token: true,
            user_email_confirm: true,
        },
        where: { user_email_token: token }
    });

    return user;
}