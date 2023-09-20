import {
    communeRepository,
    districtRepository,
    provinceRepository,
} from "@/repositories";
import { ICrudOptionPrisma } from "@/services/base/basePrisma.service";

export class VietnamAddressService {
    async findAllAndCountProvince(query?: ICrudOptionPrisma) {
        return await provinceRepository.findAndCountAll(query);
    }

    async findAllAndCountDistrict(query?: ICrudOptionPrisma) {
        return await districtRepository.findAndCountAll(query);
    }

    async findAllAndCountCommune(query?: ICrudOptionPrisma) {
        return await communeRepository.findAndCountAll(query);
    }
}
