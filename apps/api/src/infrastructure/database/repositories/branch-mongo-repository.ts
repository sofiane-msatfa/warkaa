import type { BranchDocument } from "../models/branch.js";
import type { Branch } from "@/domain/entity/branch.js";
import type { BranchCreateRequest } from "@common/dto/branch-create-request.js";
import type { BranchRepository } from "@/domain/gateway/branch-repository.js";
import type { AsyncOption } from "@/application/types/async-option.js";
import type { Schema } from "mongoose";
import type { Enterprise } from "@/domain/entity/enterprise.js";
import type { ContactCreateRequest } from "@common/dto/contact-create-request.js";
import type { EntityContactMap } from "@/domain/internal/entity-contact-map.js";
import { injectable } from "inversify";
import BranchModel from "../models/branch.js";
import { None, Some } from "@thames/monads";
import EnterpriseModel, {
  type EnterpriseDocument,
} from "../models/enterprise.js";
import { isObjectId } from "../utils/is-object-id.js";
import { EnterpriseMongoRepository } from "./enterprise-mongo-repository.js";
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
export class BranchMongoRepository implements BranchRepository {
  public async create(branch: BranchCreateRequest): AsyncOption<Branch> {
    const enterprise = await EnterpriseModel.exists({
      enterpriseNumber: branch.enterpriseNumber,
    });

    if (!enterprise) {
      return None;
    }

    const newBranch = await BranchModel.create({
      ...branch,
      enterpriseNumber: enterprise._id,
    });

    return Some(BranchMongoRepository.toEntity(newBranch));
  }

  public async upsert(branch: BranchCreateRequest): AsyncOption<Branch> {
    const enterprise = await EnterpriseModel.findOne({
      enterpriseNumber: branch.enterpriseNumber,
    });

    if (!enterprise) {
      return None;
    }

    const newBranch = await BranchModel.findOneAndUpdate(
      { branchNumber: branch.branchNumber },
      { ...branch, enterpriseNumber: enterprise._id },
      { new: true, upsert: true }
    );

    return Some(BranchMongoRepository.toEntity(newBranch));
  }

  public async bulkUpsert(branches: BranchCreateRequest[]): Promise<void> {
    const enterpriseNumbers = branches.map((branch) => branch.enterpriseNumber);
    const enterprises = await EnterpriseModel.find({
      enterpriseNumber: { $in: enterpriseNumbers },
    }).select("enterpriseNumber _id");

    const enterpriseMap = new Map(
      enterprises.map((enterprise) => [
        enterprise.enterpriseNumber,
        enterprise._id,
      ])
    );

    const operations = branches
      .filter((branch) => enterpriseMap.has(branch.enterpriseNumber))
      .map((branch) => ({
        updateOne: {
          filter: { branchNumber: branch.branchNumber },
          update: {
            $set: {
              ...branch,
              enterprise: enterpriseMap.get(branch.enterpriseNumber),
            },
          },
          upsert: true,
        },
      }));

    if (operations.length > 0) {
      await BranchModel.bulkWrite(operations, { ordered: false });
    }
  }

  public async bulkAddContacts(
    contacts: ContactCreateRequest[]
  ): Promise<void> {
    const entityNumbers = contacts.map((contact) => contact.entityNumber);
    const branches = await BranchModel.find({
      branchNumber: { $in: entityNumbers },
    }).select("branchNumber _id contacts");

    const branchContactMap: EntityContactMap = new Map(
      branches.map((branch) => [
        branch.branchNumber,
        { _id: branch._id as Schema.Types.ObjectId, contacts: branch.contacts },
      ])
    );

    const operations = filterOutExistingContacts(
      contacts,
      branchContactMap
    ).map((contact) => ({
      updateOne: {
        filter: { branchNumber: contact.entityNumber },
        update: {
          $push: {
            contacts: buildContactForInsertion(contact),
          },
        },
      },
    }));

    if (operations.length > 0) {
      await BranchModel.bulkWrite(operations, { ordered: false });
    }
  }

  public async bulkAddActivities(
    activities: ActivityCreateRequest[]
  ): Promise<void> {
    const entityNumbers = activities.map((activity) => activity.entityNumber);
    const branches = await BranchModel.find({
      branchNumber: { $in: entityNumbers },
    }).select("branchNumber _id activities");

    const branchActivityMap: EntityActivityMap = new Map(
      branches.map((branch) => [
        branch.branchNumber,
        {
          _id: branch._id as Schema.Types.ObjectId,
          activities: branch.activities,
        },
      ])
    );

    const operations = filterOutExistingActivities(
      activities,
      branchActivityMap
    ).map((activity) => ({
      updateOne: {
        filter: { branchNumber: activity.entityNumber },
        update: {
          $push: {
            activities: buildActivityForInsertion(activity),
          },
        },
      },
    }));

    if (operations.length > 0) {
      await BranchModel.bulkWrite(operations, { ordered: false });
    }
  }

  public async bulkAddDenominations(
    denominations: DenominationCreateRequest[]
  ): Promise<void> {
    const entityNumbers = denominations.map(
      (denomination) => denomination.entityNumber
    );
    const branches = await BranchModel.find({
      branchNumber: { $in: entityNumbers },
    }).select("branchNumber _id denominations");

    const branchDenominationMap: EntityDenominationMap = new Map(
      branches.map((branch) => [
        branch.branchNumber,
        {
          _id: branch._id as Schema.Types.ObjectId,
          denominations: branch.denominations,
        },
      ])
    );

    const operations = filterOutExistingDenominations(
      denominations,
      branchDenominationMap
    ).map((denomination) => ({
      updateOne: {
        filter: { branchNumber: denomination.entityNumber },
        update: {
          $push: {
            denominations: buildDenominationForInsertion(denomination),
          },
        },
      },
    }));

    if (operations.length > 0) {
      await BranchModel.bulkWrite(operations, { ordered: false });
    }
  }

  public async bulkAddAddresses(
    addresses: AddressCreateRequest[]
  ): Promise<void> {
    const entityNumbers = addresses.map((address) => address.entityNumber);
    const branches = await BranchModel.find({
      branchNumber: { $in: entityNumbers },
    }).select("branchNumber _id addresses");

    const branchAddressMap: EntityAddressMap = new Map(
      branches.map((branch) => [
        branch.branchNumber,
        {
          _id: branch._id as Schema.Types.ObjectId,
          addresses: branch.addresses,
        },
      ])
    );

    const operations = filterOutExistingAddresses(
      addresses,
      branchAddressMap
    ).map((address) => ({
      updateOne: {
        filter: { branchNumber: address.entityNumber },
        update: {
          $push: {
            addresses: buildAddressForInsertion(address),
          },
        },
      },
    }));

    if (operations.length > 0) {
      await BranchModel.bulkWrite(operations, { ordered: false });
    }
  }

  public async findById(id: string): AsyncOption<Branch> {
    const branch = await BranchModel.findOne({ id }).populate("enterprise");
    return branch ? Some(BranchMongoRepository.toEntity(branch)) : None;
  }

  public async findAll(): Promise<Branch[]> {
    const branches = await BranchModel.find().populate("enterprise");
    return branches.map(BranchMongoRepository.toEntity);
  }

  public static toEntity(branch: BranchDocument): Branch {
    const populatedEnterprise = branch.enterprise as
      | Schema.Types.ObjectId // necessary for the type check
      | EnterpriseDocument
      | null;

    let enterprise: Enterprise | null = null;

    if (populatedEnterprise && !isObjectId(populatedEnterprise)) {
      enterprise = EnterpriseMongoRepository.toEntity(populatedEnterprise);
    }

    return {
      id: branch.id,
      startDate: branch.startDate,
      enterprise: enterprise,
      enterpriseNumber: branch.enterpriseNumber,
      activities: branch.activities,
      addresses: branch.addresses,
      contacts: branch.contacts,
      denominations: branch.denominations,
    };
  }
}
