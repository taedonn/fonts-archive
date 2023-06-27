import client from '@/libs/client';
  
export async function FetchEmailFromToken(token: string) {
    const user: any = await client.fontsUser.findFirst({
        select: {
            user_id: true,
            user_email_token: true
        },
        where: { user_email_token: token }
    });

    return user.user_id;
}