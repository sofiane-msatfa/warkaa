import type { Establishment } from "@/domain/entity/establishment.js";
import type { EstablishmentRepository } from "@/domain/gateway/establishment-repository.js";
import type { EstablishmentCreateRequest } from "@common/dto/establishment-create-request.js";
import type { AsyncOption } from "@/application/types/async-option.js";
import type { Schema } from "mongoose";
import type { Enterprise } from "@/domain/entity/enterprise.js";
import type { ContactCreateRequest } from "@common/dto/contact-create-request.js";
import type { EntityContactMap } from "@/domain/internal/entity-contact-map.js";
import type { ActivityCreateRequest } from "@common/dto/activity-create-request.js";
import type { EntityActivityMap } from "@/domain/internal/entity-activity-map.js";
import type { DenominationCreateRequest } from "@common/dto/denomination-create-request.js";
import type { EntityDenominationMap } from "@/domain/internal/entity-denomination-map.js";
import EstablishmentModel, {
  type EstablishmentDocument,
} from "../models/establishment.js";
import { injectable } from "inversify";
import EnterpriseModel, {
  type EnterpriseDocument,
} from "../models/enterprise.js";
import { None, Some } from "@thames/monads";
import { isObjectId } from "../utils/is-object-id.js";
import { EnterpriseMongoRepository } from "./enterprise-mongo-repository.js";
import {
  buildContactForInsertion,
  filterOutExistingContacts,
} from "../utils/contacts.js";
import {
  buildActivityForInsertion,
  filterOutExistingActivities,
} from "../utils/activities.js";
import {
  buildDenominationForInsertion,
  filterOutExistingDenominations,
} from "../utils/denominations.js";
import type { AddressCreateRequest } from "@common/dto/address-create-request.js";
import type { EntityAddressMap } from "@/domain/internal/entity-address-map.js";
import {
  buildAddressForInsertion,
  filterOutExistingAddresses,
} from "../utils/addresses.js";

@injectable()
export class EstablishmentMongoRepository implements EstablishmentRepository {
  public async create(
    establishment: EstablishmentCreateRequest
  ): AsyncOption<Establishment> {
    const enterprise = await EnterpriseModel.exists({
      enterpriseNumber: establishment.enterpriseNumber,
    });

    if (!enterprise) {
      return None;
    }

    const newEstablishment = await EstablishmentModel.create({
      ...establishment,
      enterprise: enterprise._id,
    });

    return Some(EstablishmentMongoRepository.toEntity(newEstablishment));
  }

  public async upsert(
    establishment: EstablishmentCreateRequest
  ): AsyncOption<Establishment> {
    const enterprise = await EnterpriseModel.findOne({
      enterpriseNumber: establishment.enterpriseNumber,
    });

    if (!enterprise) {
      return None;
    }

    const newEstablishment = await EstablishmentModel.findOneAndUpdate(
      { establishmentNumber: establishment.establishmentNumber },
      { ...establishment, enterprise: enterprise._id },
      { new: true, upsert: true }
    );

    return Some(EstablishmentMongoRepository.toEntity(newEstablishment));
  }

  public async bulkUpsert(
    establishments: EstablishmentCreateRequest[]
  ): Promise<void> {
    const enterpriseNumbers = establishments.map((est) => est.enterpriseNumber);
    const enterprises = await EnterpriseModel.find({
      enterpriseNumber: { $in: enterpriseNumbers },
    }).select("enterpriseNumber _id");

    const enterpriseMap = new Map(
      enterprises.map((enterprise) => [
        enterprise.enterpriseNumber,
        enterprise._id,
      ])
    );

    const operations = establishments
      .filter((est) => enterpriseMap.has(est.enterpriseNumber))
      .map((est) => ({
        updateOne: {
          filter: { establishmentNumber: est.establishmentNumber },
          update: {
            $set: {
              ...est,
              enterprise: enterpriseMap.get(est.enterpriseNumber),
            },
          },
          upsert: true,
        },
      }));

    if (operations.length > 0) {
      await EstablishmentModel.bulkWrite(operations, { ordered: false });
    }
  }

  public async bulkAddContacts(
    contacts: ContactCreateRequest[]
  ): Promise<void> {
    const entityNumbers = contacts.map((contact) => contact.entityNumber);
    const establishments = await EstablishmentModel.find({
      establishmentNumber: { $in: entityNumbers },
    }).select("establishmentNumber _id contacts");

    const establishmentContactMap: EntityContactMap = new Map(
      establishments.map((est) => [
        est.establishmentNumber,
        {
          _id: est._id as Schema.Types.ObjectId,
          contacts: est.contacts,
        },
      ])
    );

    const operations = filterOutExistingContacts(
      contacts,
      establishmentContactMap
    ).map((contact) => ({
      updateOne: {
        filter: { establishmentNumber: contact.entityNumber },
        update: {
          $push: {
            contacts: buildContactForInsertion(contact),
          },
        },
      },
    }));

    if (operations.length > 0) {
      await EnterpriseModel.bulkWrite(operations, { ordered: false });
    }
  }

  async bulkAddActivities(activities: ActivityCreateRequest[]): Promise<void> {
    const entityNumbers = activities.map((est) => est.entityNumber);
    const establishments = await EstablishmentModel.find({
      establishmentNumber: { $in: entityNumbers },
    }).select("establishmentNumber _id activities");

    const establishmentActivityMap: EntityActivityMap = new Map(
      establishments.map((est) => [
        est.establishmentNumber,
        {
          _id: est._id as Schema.Types.ObjectId,
          activities: est.activities,
        },
      ])
    );

    const operation = filterOutExistingActivities(
      activities,
      establishmentActivityMap
    ).map((activity) => ({
      updateOne: {
        filter: { establishmentNumber: activity.entityNumber },
        update: {
          $push: {
            activities: buildActivityForInsertion(activity),
          },
        },
      },
    }));

    if (operation.length > 0) {
      await EstablishmentModel.bulkWrite(operation, { ordered: false });
    }
  }

  async bulkAddDenominations(
    denominations: DenominationCreateRequest[]
  ): Promise<void> {
    const entityNumbers = denominations.map(
      (denomination) => denomination.entityNumber
    );
    const establishments = await EstablishmentModel.find({
      establishmentNumber: { $in: entityNumbers },
    }).select("establishmentNumber _id denominations");

    const establishmentDenominationMap: EntityDenominationMap = new Map(
      establishments.map((est) => [
        est.establishmentNumber,
        {
          _id: est._id as Schema.Types.ObjectId,
          denominations: est.denominations,
        },
      ])
    );

    const operations = filterOutExistingDenominations(
      denominations,
      establishmentDenominationMap
    ).map((denomination) => ({
      updateOne: {
        filter: { establishmentNumber: denomination.entityNumber },
        update: {
          $push: {
            denominations: buildDenominationForInsertion(denomination),
          },
        },
      },
    }));

    if (operations.length > 0) {
      await EstablishmentModel.bulkWrite(operations, { ordered: false });
    }
  }

  async bulkAddAddresses(addresses: AddressCreateRequest[]): Promise<void> {
    const entityNumbers = addresses.map((address) => address.entityNumber);
    const establishments = await EstablishmentModel.find({
      establishmentNumber: { $in: entityNumbers },
    }).select("establishmentNumber _id addresses");

    const establishmentAddressMap: EntityAddressMap = new Map(
      establishments.map((est) => [
        est.establishmentNumber,
        {
          _id: est._id as Schema.Types.ObjectId,
          addresses: est.addresses,
        },
      ])
    );

    const operations = filterOutExistingAddresses(
      addresses,
      establishmentAddressMap
    ).map((address) => ({
      updateOne: {
        filter: { establishmentNumber: address.entityNumber },
        update: {
          $push: {
            addresses: buildAddressForInsertion(address),
          },
        },
      },
    }));

    if (operations.length > 0) {
      await EstablishmentModel.bulkWrite(operations, { ordered: false });
    }
  }

  public static toEntity(establishment: EstablishmentDocument): Establishment {
    const populatedEnterprise = establishment.enterprise as
      | Schema.Types.ObjectId // necessary for the type check
      | EnterpriseDocument
      | null;

    let enterprise: Enterprise | null = null;

    if (populatedEnterprise && !isObjectId(populatedEnterprise)) {
      enterprise = EnterpriseMongoRepository.toEntity(populatedEnterprise);
    }

    return {
      establishmentNumber: establishment.establishmentNumber,
      startDate: establishment.startDate,
      enterprise: enterprise,
      enterpriseNumber: establishment.enterpriseNumber,
      activities: establishment.activities,
      addresses: establishment.addresses,
      contacts: establishment.contacts,
      denominations: establishment.denominations,
    };
  }
}
