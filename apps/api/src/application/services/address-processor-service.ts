import { inject, injectable } from "inversify";
import { Type } from "@/container/types.js";
import { AbstractProcessorService } from "./abstract-processor-service.js";
import type { BranchRepository } from "@/domain/gateway/branch-repository.js";
import type { EnterpriseRepository } from "@/domain/gateway/enterprise-repository.js";
import type { EstablishmentRepository } from "@/domain/gateway/establishment-repository.js";
import type { AddressCsvRow } from "@/domain/internal/address-csv-row.js";
import {
  addressCreateRequestSchema,
  type AddressCreateRequest,
} from "@common/dto/address-create-request.js";
import { parseDate } from "../utils/date.js";
import { Collection } from "@/domain/enum/collection.js";

@injectable()
export class AddressProcessorService extends AbstractProcessorService<
  AddressCsvRow,
  AddressCreateRequest
> {
  constructor(
    @inject(Type.BranchRepository)
    private readonly branchRepository: BranchRepository,
    @inject(Type.EnterpriseRepository)
    private readonly enterpriseRepository: EnterpriseRepository,
    @inject(Type.EstablishmentRepository)
    private readonly establishmentRepository: EstablishmentRepository
  ) {
    super();
  }

  protected collection = Collection.Enterprise;

  protected headers = [
    "EntityNumber",
    "TypeOfAddress",
    "CountryNL",
    "CountryFR",
    "Zipcode",
    "MunicipalityNL",
    "MunicipalityFR",
    "StreetNL",
    "StreetFR",
    "HouseNumber",
    "Box",
    "ExtraAddressInfo",
    "DateStrikingOff",
  ];

  protected batchAction = async (batch: AddressCreateRequest[]) => {
    await Promise.all([
      this.branchRepository.bulkAddAddresses(batch),
      this.enterpriseRepository.bulkAddAddresses(batch),
      this.establishmentRepository.bulkAddAddresses(batch),
    ]);
  };

  protected tranform(row: AddressCsvRow): AddressCreateRequest {
    return {
      entityNumber: row.EntityNumber,
      typeOfAddress: row.TypeOfAddress,
      box: row.Box,
      countryFR: row.CountryFR,
      countryNL: row.CountryNL,
      dateStrikingOff: parseDate(row.DateStrikingOff),
      extraAddressInfo: row.ExtraAddressInfo,
      houseNumber: row.HouseNumber,
      municipalityFR: row.MunicipalityFR,
      municipalityNL: row.MunicipalityNL,
      streetFR: row.StreetFR,
      streetNL: row.StreetNL,
      zipcode: row.Zipcode,
    };
  }

  protected validate(row: AddressCreateRequest): boolean {
    return addressCreateRequestSchema.safeParse(row).success;
  }
}
