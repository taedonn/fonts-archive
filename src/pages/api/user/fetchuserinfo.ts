import prisma from '@/libs/client-prisma';
  
export async function FetchUserInfo(session: string) {
    const user: any = await prisma.fontsUser.findFirst({
        where: { user_session_id: session }
    });

    return user;
}

export async function FetchUserInfoFromToken(token: string) {
    const user = await prisma.fontsUser.findFirst({
        where: { user_email_token: token }
    });

    return user;
}