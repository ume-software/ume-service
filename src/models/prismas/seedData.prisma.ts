import { BookingStatus, CoinType, LoginType, PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';
const userIds = [
    "9985b3de-3963-49a4-a6ac-aa5f273fd2b4",
    "b5aa3ace-19da-4112-b41f-f93edb5b8a11",
    "4fe8aae9-9d63-4683-baad-d3590ced2598",
    "802eedc0-2c37-46cb-a857-d311a6251a13",
    "1c5dafeb-13b0-4c5a-80ba-ea40b2a460ba",
    "3c61af82-187f-449f-9b23-8bca5f2186a2",
    "848f0816-b39a-4b0d-a3a2-cea5d83e21ba",
    "dd43d7d8-87e0-4699-b829-89b6f5e2863b",
    "2e82b1a6-e878-4bd5-9e08-1fa3d03cd18e",
    "eb8728a0-aaeb-4190-b475-519728e532ca",
    "a47aeac8-a730-4f42-a1aa-c072d1e96ab7"
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
        url: ",https://static-oss.epal.gg/data/static/v2/img10_v2_GrandTheftAutoV.png",
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
        const check = await prisma.user.findFirst();
        if (check) return;
        // Create users
        const users: any[] = [];
        for (let i = 0; i < 10; i++) {
            const user = await prisma.user.create({
                data: {
                    id: userIds[i]!,
                    loginType: LoginType.GOOGLE,
                },
            });
            users.push(user);
        }

        // Create providers
        const providers = [];
        for (let i = 0; i < 10; i++) {
            const provider = await prisma.provider.create({
                data: {
                    user: {
                        connect: {
                            id: users[i].id
                        }
                    },
                    slug: faker.lorem.slug(),
                    name: faker.person.fullName(),
                    avatarUrl: faker.image.avatar(),
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
        for (let i = 0; i < 10; i++) {
            for (let j = 0; j < 10; j++) {
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

        console.log('Seed data created successfully!');
    } catch (error) {
        console.error('Error seeding data:', error);
    } finally {
        await prisma.$disconnect();
    }
}


export { seed }