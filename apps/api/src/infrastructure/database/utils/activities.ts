import type { Activity } from "@/domain/entity/activity.js";
import type { EntityActivityMap } from "@/domain/internal/entity-activity-map.js";
import type { ActivityCreateRequest } from "@common/dto/activity-create-request.js";

export function filterOutExistingActivities(
  activities: ActivityCreateRequest[],
  entityActivityMap: EntityActivityMap
): ActivityCreateRequest[] {
  return activities.filter((activity) => {
    const entity = entityActivityMap.get(activity.entityNumber);

    if (!entity) {
      return false;
    }

    const activityAlreadyExists = entity.activities.some(
      (c) => c.activityGroup === activity.activityGroup
    );

    return !activityAlreadyExists;
  });
}

export function buildActivityForInsertion(
  activity: ActivityCreateRequest
): Activity {
  return {
    activityGroup: activity.activityGroup,
    naceVersion: activity.naceVersion ?? "",
    naceCode: activity.naceCode ?? "",
    classification: activity.classification ?? "",
  };
}
