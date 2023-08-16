import prisma from '@/libs/client-prisma';
  
export async function FetchUserInfo(session: string) {
    const user: any = await prisma.fontsUser.findFirst({
        where: { user_session_id: session }
    });

    return user;
}