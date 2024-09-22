import type { EntityAddressMap } from "@/domain/internal/entity-address-map.js";
import type { AddressCreateRequest } from "@common/dto/address-create-request.js";
import type { AddressDocument } from "../models/address.js";
import type { Address } from "@/domain/entity/address.js";

function isSameAddress(
  a: AddressCreateRequest | AddressDocument,
  b: AddressCreateRequest | AddressDocument
): boolean {
  const isSameFRAddress =
    a.countryFR === b.countryFR &&
    a.municipalityFR === b.municipalityFR &&
    a.streetFR === b.streetFR &&
    a.houseNumber === b.houseNumber &&
    a.box === b.box;

  const isSameNLAddress =
    a.countryNL === b.countryNL &&
    a.municipalityNL === b.municipalityNL &&
    a.streetNL === b.streetNL &&
    a.houseNumber === b.houseNumber &&
    a.box === b.box;

  return isSameFRAddress || isSameNLAddress;
}

export function filterOutExistingAddresses(
  addresses: AddressCreateRequest[],
  entityAddressMap: EntityAddressMap
): AddressCreateRequest[] {
  return addresses.filter((address) => {
    const entity = entityAddressMap.get(address.entityNumber);

    if (!entity) {
      return false;
    }

    const addressAlreadyExists = entity.addresses.some((a) =>
      isSameAddress(a, address)
    );

    return !addressAlreadyExists;
  });
}

export function buildAddressForInsertion(
  address: AddressCreateRequest
): Address {
  return {
    typeOfAddress: address.typeOfAddress,
    countryNL: address.countryNL ?? "",
    countryFR: address.countryFR ?? "",
    zipcode: address.zipcode ?? "",
    municipalityNL: address.municipalityNL ?? "",
    municipalityFR: address.municipalityFR ?? "",
    streetNL: address.streetNL ?? "",
    streetFR: address.streetFR ?? "",
    houseNumber: address.houseNumber ?? "",
    box: address.box ?? "",
    extraAddressInfo: address.extraAddressInfo ?? "",
    dateStrikingOff: address.dateStrikingOff ?? "",
  };
}
