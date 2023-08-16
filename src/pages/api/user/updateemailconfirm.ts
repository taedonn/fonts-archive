import prisma from '@/libs/client-prisma';
  
export async function UpdateEmailConfirm(session: string) {
    const exists: any = await prisma.fontsUser.updateMany({
        where: { user_session_id: session },
        data: { user_email_confirm: true }
    });

    return exists;
}