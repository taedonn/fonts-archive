import client from '@/libs/client';
  
export async function UpdateEmailConfirm(session: string) {
    const exists: any = await client.fontsUser.updateMany({
        where: {
            user_session_id: session
        },
        data: {
            user_email_confirm: true
        }
    });

    return exists;
}