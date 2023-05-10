import { providerService, userService } from "@/services";

export class BookingService {
  async userBookingProvider(userId: string, providerId: string) {
    const user = await userService.findOne({
      where: {
        id: userId,
      },
    });
    const provider = await providerService.findOne({
      where: {
        id: providerId,
      },
    });
    return {
      user,
      provider,
    };
  }
}
