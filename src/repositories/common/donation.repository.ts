import { ICrudOptionPrisma } from "@/services/base/basePrisma.service";
import {
    BasePrismaRepository,
    PrismaTransaction,
} from "../base/basePrisma.repository";
import { Prisma, Donation } from "@prisma/client";
import { ETopDonationDuration } from "@/enums/topDonationDuration.enum";
import moment from "moment";
import { config } from "@/configs";

export class DonationRepository extends BasePrismaRepository {
    private tableName = "donate_provider";
    constructor() {
        super();
    }

    async topDonationRecipient(duration: ETopDonationDuration, take: number) {
        const regex = /(\d+)([A-Za-z]+)/;
        const matches = duration.match(regex)!;
        const unitOfTime: any = matches[2];
        const time = moment()
            .utcOffset(config.server.timezone)
            .startOf(unitOfTime)
            .toDate();
        const topDonationRecipient = await this.prisma.donation.groupBy({
            by: ["recipientId"],
            _count: {
                receivedAmount: true,
            },
            _sum: {
                receivedAmount: true,
            },
            orderBy: {
                _sum: {
                    receivedAmount: "desc",
                },
            },
            where: {
                createdAt: {
                    gte: time,
                },
            },
            take,
        });
        return topDonationRecipient;
    }
    async topDonationDonor(duration: ETopDonationDuration, take: number) {
        const regex = /(\d+)([A-Za-z]+)/;
        const matches = duration.match(regex)!;
        const unitOfTime: any = matches[2];
        const time = moment()
            .utcOffset(config.server.timezone)
            .startOf(unitOfTime)
            .toDate();
        const topDonationRecipient = await this.prisma.donation.groupBy({
            by: ["donorId"],
            _count: {
                donatedAmount: true,
            },
            _sum: {
                donatedAmount: true,
            },
            orderBy: {
                _sum: {
                    donatedAmount: "desc",
                },
            },
            where: {
                createdAt: {
                    gte: time,
                },
            },
            take,
        });
        return topDonationRecipient;
    }

    async findAndCountAll(query?: ICrudOptionPrisma): Promise<{
        row: Donation[];
        count: number;
    }> {
        const [row, count] = await this.prisma.$transaction([
            this.prisma.donation.findMany(query),
            this.prisma.donation.count({
                where: query?.where,
            }),
        ]);
        return {
            row,
            count,
        };
    }

    async updateById(
        id: string,
        donationUpdateInput: Prisma.DonationUpdateInput,
        tx: PrismaTransaction = this.prisma
    ) {
        return await tx.donation.update({
            data: donationUpdateInput,
            where: { id },
        });
    }

    async update(
        donationUpdateInput: Prisma.DonationUpdateInput,
        query: ICrudOptionPrisma,
        tx: PrismaTransaction = this.prisma
    ) {
        return await tx.donation.update({
            data: donationUpdateInput,
            where: query.where,
        });
    }

    async create(
        donationCreateInput: Prisma.DonationCreateInput,
        tx: PrismaTransaction = this.prisma
    ): Promise<Donation> {
        return await tx.donation.create({
            data: donationCreateInput,
        });
    }

    async findOne(
        query?: ICrudOptionPrisma,
        tx: PrismaTransaction = this.prisma
    ): Promise<Donation | null> {
        return await tx.donation.findFirst(query);
    }

    async findMany(
        query?: ICrudOptionPrisma,
        tx: PrismaTransaction = this.prisma
    ): Promise<Donation[]> {
        return await tx.donation.findMany(query);
    }

    async deleteById(
        id: string,
        tx: PrismaTransaction = this.prisma
    ): Promise<Donation> {
        return await tx.donation.delete({ where: { id } });
    }

    async deleteMany(
        donationWhereInput: Prisma.DonationWhereInput,
        tx: PrismaTransaction = this.prisma
    ): Promise<Prisma.BatchPayload> {
        return await tx.donation.deleteMany({
            where: donationWhereInput,
        });
    }

    async destroyById(id: string) {
        const query = `DELETE FROM ${this.tableName} WHERE id='${id}';`;
        return await this.prisma.$queryRawUnsafe(query);
    }
}
