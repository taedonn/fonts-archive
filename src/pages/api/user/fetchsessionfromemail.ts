import client from '@/libs/client';
  
export async function FetchSessionFromEmail(email: string) {
    const user: any = await client.fontsUser.findFirst({
        select: {
            user_id: true,
            user_session_id: true
        },
        where: {
            user_id: email
        }
    });

    return user.user_session_id;
}