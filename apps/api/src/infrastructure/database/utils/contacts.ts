import type { Contact } from "@/domain/entity/contact.js";
import type { EntityContactMap } from "@/domain/internal/entity-contact-map.js";
import type { ContactCreateRequest } from "@common/dto/contact-create-request.js";

export function filterOutExistingContacts(
  contacts: ContactCreateRequest[],
  entityContactMap: EntityContactMap
): ContactCreateRequest[] {
  return contacts.filter((contact) => {
    const entity = entityContactMap.get(contact.entityNumber);

    if (!entity) {
      return false;
    }

    const contactAlreadyExists = entity.contacts.some(
      (c) => c.value === contact.value
    );

    return !contactAlreadyExists;
  });
}

export function buildContactForInsertion(
  contact: ContactCreateRequest
): Contact {
  return {
    entityContact: contact.entityContact ?? "",
    contactType: contact.contactType ?? "",
    value: contact.value,
  };
}
