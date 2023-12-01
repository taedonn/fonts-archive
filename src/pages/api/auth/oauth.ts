import prisma from '@/libs/client-prisma';

export async function snsLogin(snsUser: any) {
    const user = await prisma.fontsUser.findUnique({
        where: { user_id: snsUser.email }
    });

    user === null && await prisma.fontsUser.create({
        data: {
            user_name: snsUser.name,
            user_id: snsUser.email,
            user_pw: "",
            user_email_token: "",
            user_email_confirm: true,
            profile_img: snsUser.image === undefined ? "/fonts-archive-base-profile-img-" + (Math.floor(Math.random() * 6) + 1) + ".svg" : snsUser.image
        }
    });

    return user;
}