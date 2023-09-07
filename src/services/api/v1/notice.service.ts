import { AmountNoticeResponse } from "@/common/responses/notice/amountNotice.response";
import { noticeRepository } from "@/repositories";
import { errorService } from "@/services";
import {
  BasePrismaService,
  ICrudOptionPrisma,
} from "@/services/base/basePrisma.service";
import { ERROR_MESSAGE } from "@/services/errors/errorMessage";
import { Prisma, Notice } from "@prisma/client";

export class NoticeService extends BasePrismaService<typeof noticeRepository> {
  constructor() {
    super(noticeRepository);
  }
  async findAndCountAll(query?: ICrudOptionPrisma): Promise<{
    row: Notice[];
    count: number;
  }> {
    const result = await this.repository.findAndCountAll(query);
    if (!result) {
      throw errorService.error(
        ERROR_MESSAGE.THIS_NOTICE_DOES_NOT_EXISTED
      );
    }
    return result;
  }

  async amountNewNoticeByUserId(userId: string): Promise<AmountNoticeResponse> {
    const amount = await this.repository.amountNewNoticeByUserId(userId);
    return {
      amount
    }
  }
  async getNotice(userId: string, query?: ICrudOptionPrisma): Promise<{
    row: Notice[];
    count: number;
  }> {
    if (!query) query = {}
    if (!query.where) {
      query.where = { userId };
    } else {
      query.where.userId = userId;
    }
    noticeRepository.update({
      isReaded: true
    }, {
      where: {
        userId,
        isReaded: false
      }
    })
    return await this.repository.findAndCountAll(query);;
  }
  async create(noticeCreateInput: Prisma.NoticeCreateInput): Promise<Notice> {
    return await this.repository.create(noticeCreateInput);
  }

  async findOne(query?: ICrudOptionPrisma): Promise<Notice> {
    const result = await this.repository.findOne(query);
    if (!result) {
      throw errorService.error(
        ERROR_MESSAGE.THIS_NOTICE_DOES_NOT_EXISTED
      );
    }
    return result;
  }

  async deleteByNoticeId(noticeId: string): Promise<Notice> {
    const result = await this.repository.deleteById(noticeId);
    if (!result) {
      throw errorService.error(
        ERROR_MESSAGE.THIS_NOTICE_DOES_NOT_EXISTED
      );
    }
    return result;
  }

}
