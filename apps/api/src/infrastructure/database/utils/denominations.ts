import type { Denomination } from "@/domain/entity/denomination.js";
import type { EntityDenominationMap } from "@/domain/internal/entity-denomination-map.js";
import type { DenominationCreateRequest } from "@common/dto/denomination-create-request.js";

export function filterOutExistingDenominations(
  denominations: DenominationCreateRequest[],
  entityDenominationMap: EntityDenominationMap
): DenominationCreateRequest[] {
  return denominations.filter((denomination) => {
    const entity = entityDenominationMap.get(denomination.entityNumber);

    if (!entity) {
      return false;
    }

    const denominationAlreadyExists = entity.denominations.some(
      (c) => c.denomination === denomination.denomination
    );

    return !denominationAlreadyExists;
  });
}

export function buildDenominationForInsertion(
  denomination: DenominationCreateRequest
): Denomination {
  return {
    language: denomination.language ?? "",
    typeOfDenomination: denomination.typeOfDenomination ?? "",
    denomination: denomination.denomination,
  };
}
