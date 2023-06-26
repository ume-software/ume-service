import { BookingStatus, CoinSettingType, CoinType, LoginType, PaymentSystemPlatform, PrismaClient, UnitCurrency } from '@prisma/client';
import { faker } from '@faker-js/faker';

const userDefault =
    [
        {
            id: '9985b3de-3963-49a4-a6ac-aa5f273fd2b4',
            avatarUrl: 'https://global-oss.epal.gg/data/cover/1462729/16717899518529566.jpeg'
        },
        {
            id: 'b5aa3ace-19da-4112-b41f-f93edb5b8a11',
            avatarUrl: 'https://global-oss.epal.gg/data/cover/367563/16780986636345719.jpeg'
        },
        {
            id: '4fe8aae9-9d63-4683-baad-d3590ced2598',
            avatarUrl: 'https://global-oss.epal.gg/data/cover/1974032/16848702165217550.jpeg'
        },
        {
            id: '802eedc0-2c37-46cb-a857-d311a6251a13',
            avatarUrl: 'https://global-oss.epal.gg/data/cover/1605774/16747326300495711.jpeg'
        },
        {
            id: '1c5dafeb-13b0-4c5a-80ba-ea40b2a460ba',
            avatarUrl: 'https://global-oss.epal.gg/data/cover/157645/16848332689635966.jpeg'
        },
        {
            id: '3c61af82-187f-449f-9b23-8bca5f2186a2',
            avatarUrl: 'https://global-oss.epal.gg/data/cover/1684413/16786883962963700.jpeg'
        },
        {
            id: '848f0816-b39a-4b0d-a3a2-cea5d83e21ba',
            avatarUrl: 'https://global-oss.epal.gg/data/cover/376803/16859521050006272.jpeg?'
        },
        {
            id: 'dd43d7d8-87e0-4699-b829-89b6f5e2863b',
            avatarUrl: 'https://global-oss.epal.gg/data/cover/1462729/16700667856147708.jpeg'
        },
        {
            id: '2e82b1a6-e878-4bd5-9e08-1fa3d03cd18e',
            avatarUrl: 'https://global-oss.epal.gg/data/cover/1973809/16862433098586045.jpeg'
        },
        {
            id: 'eb8728a0-aaeb-4190-b475-519728e532ca',
            avatarUrl: 'https://global-oss.epal.gg/data/cover/1684413/1673325015493547.jpeg'
        },
        {
            id: 'a47aeac8-a730-4f42-a1aa-c072d1e96ab7',
            avatarUrl: 'https://global-oss.epal.gg/data/cover/376803/16833767097816821.jpeg'
        },
        {
            id: '6d1f0910-f53a-4784-969c-69cdefef61e9',
            avatarUrl: 'https://global-oss.epal.gg/data/cover/1227048/16605565132718799.jpeg'
        },
        {
            id: 'ac124683-8268-49fa-83bf-5180ab3ce980',
            avatarUrl: 'https://global-oss.epal.gg/data/cover/1011755/16697279953677315.jpeg'
        },
        {
            id: '816c1899-c65e-4819-86d0-a3357173848d',
            avatarUrl: 'https://global-oss.epal.gg/data/cover/1962700/16850082812127061.jpeg'
        },
        {
            id: '82cfafb0-ea31-45dc-8639-63a673569436',
            avatarUrl: 'https://global-oss.epal.gg/data/cover/655708/16726452431573402.jpeg'
        },
        {
            id: '7091f5cb-2b63-4aa6-a3c8-17cf8763258f',
            avatarUrl: 'https://global-oss.epal.gg/data/cover/1009695/1682259562827278.jpeg'
        },
        {
            id: '373f7281-4a4d-4b4e-a60b-771e089800d0',
            avatarUrl: 'https://global-oss.epal.gg/data/cover/1948854/1684047373300316.jpeg'
        },
        {
            id: '42ce1830-14a3-48f7-8f08-e86a6a15c14e',
            avatarUrl: 'https://cdn.pixabay.com/photo/2020/05/11/22/31/cat-5160456_960_720.png'
        },
        {
            id: '365d2fbc-662d-483e-a3bc-d82f6241fe78',
            avatarUrl: 'https://global-oss.epal.gg/data/cover/1948854/16872779154687276.jpeg'
        },
        {
            id: 'c676d677-9cd1-4079-a944-26b46f9ebc96',
            avatarUrl: 'https://global-oss.epal.gg/data/cover/1992068/1687268874434137.jpeg'
        },
        {
            id: '228f379c-2dfe-4c80-8e1b-98e0fa6f6324',
            avatarUrl: 'https://global-oss.epal.gg/data/cover/267432/16786204537404882.jpeg'
        },
        {
            id: '4211702b-5387-4c06-a019-b785a8f0be49',
            avatarUrl: 'https://global-oss.epal.gg/data/cover/1462729/16700667856147708.jpeg'
        },
        {
            id: '9fdba5fc-fb7b-4717-8b08-1214367e2899',
            avatarUrl: 'https://global-oss.epal.gg/data/cover/1925126/16858913098309040.jpeg'
        },
        {
            id: '2a5745c1-a230-4ac8-a6ed-683f1f151899',
            avatarUrl: 'https://global-oss.epal.gg/data/cover/1121715/1668255749464521.jpeg'
        },
        {
            id: '2e9f3fc0-9f7a-4c26-8021-7d7d38679b02',
            avatarUrl: 'https://global-oss.epal.gg/data/cover/984537/16826079776944261.jpeg'
        },
        {
            id: '02056642-6166-40a3-9563-8a960e6ff45d',
            avatarUrl: 'https://global-oss.epal.gg/image/ablum/16423074615829127.jpg'
        },
        {
            id: 'f653228d-3967-4707-9d2e-1f7d4e76187c',
            avatarUrl: 'https://global-oss.epal.gg/data/cover/1044455/16819834871407986.jpeg'
        },
        {
            id: 'fa179e09-dc4d-4204-93d2-1339ed68007b',
            avatarUrl: 'https://global-oss.epal.gg/data/cover/2014655/16861573934842976.jpeg'
        },
        {
            id: '642ea59d-9d54-44ee-91f4-680fd1a69105',
            avatarUrl: 'https://global-oss.epal.gg/data/cover/252157/16843424942294914.jpeg'
        },
        {
            id: '7ce139e4-5003-46f5-a1fc-89c74d79097f',
            avatarUrl: 'https://global-oss.epal.gg/data/cover/1214628/16874982230794096.jpeg'
        },
        {
            id: '965c6170-592d-4978-9f4e-d27584366e96',
            avatarUrl: 'https://global-oss.epal.gg/data/cover/1921263/16872142620374880.jpeg'
        }
    ]
const skillsDefault = [
    {
        url: "https://static-oss.epal.gg/data/static/v2/img10_v2_LeagueofLegends.png",
        name: "League of Legends"
    },
    {
        url: "https://static-oss.epal.gg/data/static/v2/img10_v2_Valorant.png",
        name: "Valorant"
    },
    {
        url: "https://static-oss.epal.gg/data/static/v2/img10_v2_Overwatch2.png",
        name: "Overwatch"
    },
    {
        url: "https://static-oss.epal.gg/data/static/v2/img10_v2_Fortnite.png",
        name: "Fortnite"
    },
    {
        url: "https://static-oss.epal.gg/data/static/v2/img10_v2_Dota2.png",
        name: "Dota 2"
    },
    {
        url: "https://static-oss.epal.gg/data/static/v2/img10_v2_Don'tStarveTogether.png",
        name: "Don't Starve Together"
    },
    {
        url: "https://static-oss.epal.gg/data/static/v2/img10_v2_FIFA.png",
        name: "FIFA"
    },
    {
        url: "https://static-oss.epal.gg/data/static/v2/img10_v2_GrandTheftAutoV.png",
        name: "Grand Theft Auto V"
    },
    {
        url: "https://static-oss.epal.gg/data/static/v2/img10_v2_TeamfightTactics.png",
        name: "Team fight Tactics"
    },
    {
        url: "https://static-oss.epal.gg/data/static/v2/img10_v2_GenshinImpact.png",
        name: "Genshin Impact"
    }
]
const prisma = new PrismaClient();
async function seed() {
    try {

        if (!await prisma.user.findFirst()) {


            const users: any[] = [];
            for (let i = 0; i < userDefault.length; i++) {
                const user = await prisma.user.create({
                    data: {
                        id: userDefault[i]?.id!,
                        loginType: LoginType.GOOGLE,
                    },
                });
                users.push(user);
            }

            // Create providers
            const providers = [];
            for (let i = 0; i < userDefault.length; i++) {
                const provider = await prisma.provider.create({
                    data: {
                        user: {
                            connect: {
                                id: users[i].id
                            }
                        },
                        slug: faker.lorem.slug(),
                        name: faker.person.fullName(),
                        avatarUrl: userDefault[i]?.avatarUrl!,
                        voiceUrl: faker.internet.url(),
                        description: faker.lorem.paragraph(),
                    },
                });
                providers.push(provider);
            }

            // Create skills
            const skills = [];
            for (let i = 0; i < 10; i++) {
                const skill = await prisma.skill.create({
                    data: {
                        name: skillsDefault[i]?.name!,
                        imageUrl: skillsDefault[i]?.url!,
                    },
                });
                skills.push(skill);
            }

            // Create provider skills
            for (const provider of providers) {
                for (const skill of skills) {
                    await prisma.providerSkill.create({
                        data: {
                            provider: {
                                connect: {
                                    id: provider.id,
                                }
                            },
                            skill: {
                                connect: {
                                    id: skill.id!
                                }
                            },
                            defaultCost: faker.number.int({ min: 5, max: 50 }) || 10,
                            position: faker.number.int({ min: 1, max: 10 }) || 1,
                        },
                    });
                }
            }

            // Create booking costs
            for (const providerSkill of await prisma.providerSkill.findMany()) {
                await prisma.bookingCost.create({
                    data: {

                        providerSkill: {
                            connect: {
                                id: providerSkill.id,
                            }
                        },
                        startTimeOfDay: ['09:00', '10:00', '11:00'][faker.number.int({ min: 0, max: 2 })] || "09:00",
                        endTimeOfDay: ['12:00', '13:00', '14:00'][faker.number.int({ min: 0, max: 2 })] || "12:00",
                        amount: faker.number.int({ min: 10, max: 100 }),

                    },
                });
            }
            // Create CoinHistory
            for (const user of users) {
                const coinType = Object.values(CoinType)[faker.number.int({ min: 0, max: Object.values(CoinType).length - 1 })] || CoinType.ADMIN;

                await prisma.coinHistory.create({
                    data: {
                        user: {
                            connect: {
                                id: user.id,
                            },
                        },
                        coinType: coinType,
                        amount: (coinType.toString().includes("SPEND") ? -1 : 1) * faker.number.int({ min: 1, max: 100 }),
                    },
                });
            }

            // Create BookingHistory
            for (let i = 0; i < userDefault.length; i++) {
                for (let j = 0; j < userDefault.length; j++) {
                    const bookingStatus = Object.values(BookingStatus)[faker.number.int({ min: 0, max: Object.values(BookingStatus).length - 1 })] || BookingStatus.PROVIDER_ACCEPT;
                    await prisma.bookingHistory.create({
                        data: {
                            status: bookingStatus,
                            booker: {
                                connect: {
                                    id: users[j].id,
                                },
                            },
                            providerSkill: {
                                connect: {
                                    id: (await prisma.providerSkill.findMany({
                                        where: {
                                            NOT: {
                                                provider: {
                                                    userId: users[j].id
                                                }
                                            }
                                        }
                                    }))[j]?.id!,
                                },
                            },
                            acceptedAt: bookingStatus != BookingStatus.INIT ? faker.date.recent() : null,
                            totalCost: faker.number.int({ min: 10, max: 200 }),
                            bookingPeriod: faker.number.int({ min: 1, max: 10 }),
                        },
                    });
                }
            }


            // Create Feedback
            for (const bookingHistory of await prisma.bookingHistory.findMany()) {
                await prisma.feedback.create({
                    data: {
                        booking: {
                            connect: {
                                id: bookingHistory.id,
                            },
                        },
                        content: faker.lorem.paragraph(),
                        amountStart: faker.number.int({ min: 1, max: 5 }),
                    },
                });
            }
        }
        if (!await prisma.coinSetting.findFirst()) {
            await prisma.coinSetting.createMany({
                data: [
                    {
                        unitCurrency: UnitCurrency.VND,
                        feePercentage: 0.001,
                        surcharge: 0,
                        coinSettingType: CoinSettingType.BUY_COIN,
                        paymentSystemPlatform: PaymentSystemPlatform.MOMO,
                        conversionRateCoin: 0.001
                    },
                    {
                        unitCurrency: UnitCurrency.VND,
                        feePercentage: 0.001,
                        surcharge: 1000,
                        coinSettingType: CoinSettingType.SELL_COIN,
                        paymentSystemPlatform: PaymentSystemPlatform.MOMO,
                        conversionRateCoin: 0.001
                    },
                    {
                        coinSettingType: CoinSettingType.PROVIDER_GET_COIN_BOOKING,
                        feePercentage: 0.001,
                    },
                    {
                        coinSettingType: CoinSettingType.GIFT_TO_COIN,
                        feePercentage: 0.001,
                    }
                ]
            })
        }
        if (!await prisma.post.findFirst()) {
            // Generate sample posts
            const posts = [];
            for (const user of userDefault) {
                for (let i = 0; i < faker.number.int({ min: 0, max: 10 }); i++) {
                    const post = await prisma.post.create({
                        data: {
                            userId: user.id,
                            content: faker.lorem.paragraph(),
                            thumbnails: [
                                {
                                    url: faker.image.urlPicsumPhotos(),
                                    type: "IMAGE"
                                },
                                {
                                    url: faker.image.urlPicsumPhotos(),
                                    type: "IMAGE"
                                },
                                {
                                    url: faker.image.urlPicsumPhotos(),
                                    type: "IMAGE"
                                },
                                {
                                    url: faker.image.urlPicsumPhotos(),
                                    type: "IMAGE"
                                },
                            ]
                        }
                    })

                    posts.push(post);
                }
            }
            for (const post of posts) {
                for (let i = 0; i < faker.number.int({ min: 0, max: userDefault.length }); i++) {
                    await prisma.commentPost.create({
                        data: {
                            userId: userDefault[i]?.id!,
                            postId: post.id,
                            content: faker.lorem.sentence(),
                        }
                    })
                }
                for (let i = 0; i < faker.number.int({ min: 0, max: userDefault.length }); i++) {
                    await prisma.likePost.create({
                        data: {
                            userId: userDefault[i]?.id!,
                            postId: post.id,
                        }
                    })
                }
                for (let i = 0; i < faker.number.int({ min: 0, max: userDefault.length }); i++) {
                    await prisma.watchedPost.create({
                        data: {
                            userId: userDefault[i]?.id!,
                            postId: post.id,
                        }
                    })
                }
            }
        }

        console.log('Seed data created successfully!');
    } catch (error) {
        console.error('Error seeding data:', error);
    } finally {
        await prisma.$disconnect();
    }
}


export { seed }