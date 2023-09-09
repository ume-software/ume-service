import { errorService } from "@/services";
import { ClassConstructor, plainToInstance } from "class-transformer";
import { validateSync } from "class-validator";
import _ from "lodash";

export function mappingDataRequest<T>(
    cls: ClassConstructor<T>,
    plain: any,
    justPropertyNames?: Array<string>
) {
    let targetData = plain;
    if (justPropertyNames) {
        targetData = {};
        for (const propertyName of justPropertyNames) {
            if (plain.hasOwnProperty(propertyName)) {
                targetData[propertyName] = plain[propertyName];
            }
        }
    }

    const data = plainToInstance(
        cls,
        _(targetData).omit(_.isUndefined).value()
    );
    if (data) {
        const errors = validateSync(data);
        if (errors.length) {
            throw errorService.badRequest(
                errors.map((item) => ({
                    [item.property]:
                        typeof item.value == "undefined"
                            ? "undefined"
                            : item.value,
                    constraints: item.constraints,
                }))
            );
        }
    }
    return data;
}
