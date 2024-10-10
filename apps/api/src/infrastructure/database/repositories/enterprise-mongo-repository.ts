import type { EnterpriseRepository } from "@/domain/gateway/enterprise-repository.js";
import type { EnterpriseDocument } from "../models/enterprise.js";
import type { Enterprise } from "@/domain/entity/enterprise.js";
import type { EnterpriseCreateRequest } from "@common/dto/enterprise-create-request.js";
import EnterpriseModel from "../models/enterprise.js";
import { injectable } from "inversify";
import type { ContactCreateRequest } from "@common/dto/contact-create-request.js";
import type { EntityContactMap } from "@/domain/internal/entity-contact-map.js";
import type { Schema } from "mongoose";
import {
  buildContactForInsertion,
  filterOutExistingContacts,
} from "../utils/contacts.js";
import type { ActivityCreateRequest } from "@common/dto/activity-create-request.js";
import type { EntityActivityMap } from "@/domain/internal/entity-activity-map.js";
import {
  buildActivityForInsertion,
  filterOutExistingActivities,
} from "../utils/activities.js";
import type { DenominationCreateRequest } from "@common/dto/denomination-create-request.js";
import type { EntityDenominationMap } from "@/domain/internal/entity-denomination-map.js";
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
export class EnterpriseMongoRepository implements EnterpriseRepository {
  public async create(
    enterprise: EnterpriseCreateRequest
  ): Promise<Enterprise> {
    const newEnterprise = await EnterpriseModel.create(enterprise);
    return EnterpriseMongoRepository.toEntity(newEnterprise);
  }

  public async upsert(
    enterprise: EnterpriseCreateRequest
  ): Promise<Enterprise> {
    const newEnterprise = await EnterpriseModel.findOneAndUpdate(
      { enterpriseNumber: enterprise.enterpriseNumber },
      enterprise,
      { new: true, upsert: true }
    );

    return EnterpriseMongoRepository.toEntity(newEnterprise);
  }

  public async bulkUpsert(
    enterprises: EnterpriseCreateRequest[]
  ): Promise<void> {
    const operations = enterprises.map((enterprise) => ({
      updateOne: {
        filter: { enterpriseNumber: enterprise.enterpriseNumber },
        update: { $set: enterprise },
        upsert: true,
      },
    }));

    await EnterpriseModel.bulkWrite(operations, { ordered: false });
  }

  public async bulkAddContacts(
    contacts: ContactCreateRequest[]
  ): Promise<void> {
    const entityNumbers = contacts.map((contact) => contact.entityNumber);
    const enterprises = await EnterpriseModel.find({
      enterpriseNumber: { $in: entityNumbers },
    }).select("enterpriseNumber _id contacts");

    const enterpriseContactMap: EntityContactMap = new Map(
      enterprises.map((enterprise) => [
        enterprise.enterpriseNumber,
        {
          _id: enterprise._id as Schema.Types.ObjectId,
          contacts: enterprise.contacts,
        },
      ])
    );

    const operations = filterOutExistingContacts(
      contacts,
      enterpriseContactMap
    ).map((contact) => ({
      updateOne: {
        filter: { enterpriseNumber: contact.entityNumber },
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
    const entityNumbers = activities.map((activity) => activity.entityNumber);
    const enterprises = await EnterpriseModel.find({
      enterpriseNumber: { $in: entityNumbers },
    }).select("enterpriseNumber _id activities");

    const enterpriseActivityMap: EntityActivityMap = new Map(
      enterprises.map((enterprise) => [
        enterprise.enterpriseNumber,
        {
          _id: enterprise._id as Schema.Types.ObjectId,
          activities: enterprise.activities,
        },
      ])
    );

    const operations = filterOutExistingActivities(
      activities,
      enterpriseActivityMap
    ).map((activity) => ({
      updateOne: {
        filter: { enterpriseNumber: activity.entityNumber },
        update: {
          $push: {
            activities: buildActivityForInsertion(activity),
          },
        },
      },
    }));

    if (operations.length > 0) {
      await EnterpriseModel.bulkWrite(operations, { ordered: false });
    }
  }

  async bulkAddDenominations(
    denominations: DenominationCreateRequest[]
  ): Promise<void> {
    const entityNumbers = denominations.map(
      (denomination) => denomination.entityNumber
    );
    const enterprises = await EnterpriseModel.find({
      enterpriseNumber: { $in: entityNumbers },
    }).select("enterpriseNumber _id denominations");

    const enterpriseDenominationMap: EntityDenominationMap = new Map(
      enterprises.map((enterprise) => [
        enterprise.enterpriseNumber,
        {
          _id: enterprise._id as Schema.Types.ObjectId,
          denominations: enterprise.denominations,
        },
      ])
    );

    const operations = filterOutExistingDenominations(
      denominations,
      enterpriseDenominationMap
    ).map((denomination) => ({
      updateOne: {
        filter: { enterpriseNumber: denomination.entityNumber },
        update: {
          $push: {
            denominations: buildDenominationForInsertion(denomination),
          },
        },
      },
    }));

    if (operations.length > 0) {
      await EnterpriseModel.bulkWrite(operations, { ordered: false });
    }
  }

  async bulkAddAddresses(addresses: AddressCreateRequest[]): Promise<void> {
    const entityNumbers = addresses.map((address) => address.entityNumber);
    const enterprises = await EnterpriseModel.find({
      enterpriseNumber: { $in: entityNumbers },
    }).select("enterpriseNumber _id addresses");

    const enterpriseAddressMap: EntityAddressMap = new Map(
      enterprises.map((enterprise) => [
        enterprise.enterpriseNumber,
        {
          _id: enterprise._id as Schema.Types.ObjectId,
          addresses: enterprise.addresses,
        },
      ])
    );

    const operations = filterOutExistingAddresses(
      addresses,
      enterpriseAddressMap
    ).map((address) => ({
      updateOne: {
        filter: { enterpriseNumber: address.entityNumber },
        update: {
          $push: {
            addresses: buildAddressForInsertion(address),
          },
        },
      },
    }));

    if (operations.length > 0) {
      await EnterpriseModel.bulkWrite(operations, { ordered: false });
    }
  }

  public static toEntity(enterprise: EnterpriseDocument): Enterprise {
    return {
      enterpriseNumber: enterprise.enterpriseNumber,
      status: enterprise.status,
      juridicalSituation: enterprise.juridicalSituation,
      typeOfEnterprise: enterprise.typeOfEnterprise,
      juridicalForm: enterprise.juridicalForm,
      juridicalFormCAC: enterprise.juridicalFormCAC,
      startDate: enterprise.startDate,
      activities: enterprise.activities,
      addresses: enterprise.addresses,
      contacts: enterprise.contacts,
      denominations: enterprise.denominations,
    };
  }
}
