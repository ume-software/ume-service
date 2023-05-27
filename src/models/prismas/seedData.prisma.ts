import { LoginType, PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();
const loginType = Object.values(LoginType);
async function seed() {
    try {
        const check = await prisma.user.findFirst();
        if (check) return;
        // Create users
        const users: any[] = [];
        for (let i = 0; i < 10; i++) {
            const user = await prisma.user.create({
                data: {
                    loginType: Object.values(LoginType)[faker.number.int({ min: 0, max: loginType.length - 1 })] || LoginType.INAPP,
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
                    name: faker.lorem.word(),
                    imageUrl: faker.image.url(),
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
                        defaultCost: faker.number.float({ min: 5, max: 50 }) || 10,
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
                    amount: faker.number.float({ min: 10, max: 100 }),

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